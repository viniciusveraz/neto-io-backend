import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/app-error';

export interface ListSpotsFilter {
  city?: string;
  category?: string; // aceita id ou slug
  search?: string;
  kitesurfOnly?: boolean;
  featuredOnly?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateSpotDTO {
  name: string;
  slug?: string;
  description: string;
  city: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  imageUrl?: string;
  additionalImages?: string;
  isFeatured?: boolean;
  kitesurfSpot?: boolean;
  contactPhone?: string;
  instagram?: string;
  website?: string;
  categoryId: string;
}

export interface UpdateSpotDTO extends Partial<CreateSpotDTO> {}

export class TouristSpotService {
  async listSpots(filters: ListSpotsFilter) {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(filters.limit) || 10));
    const skip = (page - 1) * limit;

    const where: Prisma.TouristSpotWhereInput = {};

    if (filters.city) {
      where.city = {
        contains: filters.city.trim(),
      };
    }

    if (filters.category) {
      where.OR = [
        { categoryId: filters.category },
        { category: { slug: filters.category.toLowerCase().trim() } },
      ];
    }

    if (filters.search) {
      const term = filters.search.trim();
      where.OR = [
        { name: { contains: term } },
        { description: { contains: term } },
        { city: { contains: term } },
      ];
    }

    if (filters.kitesurfOnly !== undefined) {
      where.kitesurfSpot = filters.kitesurfOnly;
    }

    if (filters.featuredOnly !== undefined) {
      where.isFeatured = filters.featuredOnly;
    }

    const [total, spots] = await Promise.all([
      prisma.touristSpot.count({ where }),
      prisma.touristSpot.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              icon: true,
            },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
        },
      }),
    ]);

    // Calcula nota média das avaliações para cada ponto turístico
    const items = spots.map((spot) => {
      const totalReviews = spot.reviews.length;
      const avgRating =
        totalReviews > 0
          ? Number((spot.reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1))
          : null;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { reviews, ...spotData } = spot;
      return {
        ...spotData,
        averageRating: avgRating,
        totalReviews,
      };
    });

    const totalPages = Math.ceil(total / limit);

    return {
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      items,
    };
  }

  async getSpotByIdOrSlug(identifier: string) {
    const spot = await prisma.touristSpot.findFirst({
      where: {
        OR: [{ id: identifier }, { slug: identifier }],
      },
      include: {
        category: true,
        reviews: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    if (!spot) {
      throw new AppError('Ponto turístico não encontrado.', 404);
    }

    const totalReviews = spot.reviews.length;
    const avgRating =
      totalReviews > 0
        ? Number((spot.reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1))
        : null;

    return {
      ...spot,
      averageRating: avgRating,
      totalReviews,
    };
  }

  async createSpot(data: CreateSpotDTO) {
    // Valida categoria
    const categoryExists = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!categoryExists) {
      throw new AppError('Categoria informada não existe.', 404);
    }

    const slug = data.slug || this.slugify(data.name);

    const slugExists = await prisma.touristSpot.findUnique({
      where: { slug },
    });

    if (slugExists) {
      throw new AppError(`Já existe um local com o identificador slug "${slug}".`, 409);
    }

    const spot = await prisma.touristSpot.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        city: data.city,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        imageUrl: data.imageUrl,
        additionalImages: data.additionalImages,
        isFeatured: data.isFeatured ?? false,
        kitesurfSpot: data.kitesurfSpot ?? false,
        contactPhone: data.contactPhone,
        instagram: data.instagram,
        website: data.website,
        categoryId: data.categoryId,
      },
      include: {
        category: true,
      },
    });

    return spot;
  }

  async updateSpot(id: string, data: UpdateSpotDTO) {
    const spot = await prisma.touristSpot.findUnique({ where: { id } });
    if (!spot) {
      throw new AppError('Ponto turístico não encontrado.', 404);
    }

    if (data.categoryId) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: data.categoryId },
      });
      if (!categoryExists) {
        throw new AppError('Categoria informada não existe.', 404);
      }
    }

    if (data.slug && data.slug !== spot.slug) {
      const slugExists = await prisma.touristSpot.findUnique({
        where: { slug: data.slug },
      });
      if (slugExists) {
        throw new AppError('Este slug já está em uso por outro local.', 409);
      }
    }

    const updated = await prisma.touristSpot.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    });

    return updated;
  }

  async deleteSpot(id: string) {
    const spot = await prisma.touristSpot.findUnique({ where: { id } });
    if (!spot) {
      throw new AppError('Ponto turístico não encontrado.', 404);
    }

    await prisma.touristSpot.delete({ where: { id } });

    return { message: 'Ponto turístico excluído com sucesso.' };
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
