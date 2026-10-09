import { prisma } from '../config/prisma';
import { AppError } from '../utils/app-error';

export interface CreateCategoryDTO {
  name: string;
  slug?: string;
  description?: string;
  icon?: string;
}

export class CategoryService {
  async listCategories() {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { spots: true },
        },
      },
    });

    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      icon: cat.icon,
      spotsCount: cat._count.spots,
    }));
  }

  async getCategoryBySlug(slug: string) {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        spots: {
          take: 20,
          orderBy: { isFeatured: 'desc' },
        },
      },
    });

    if (!category) {
      throw new AppError('Categoria não encontrada.', 404);
    }

    return category;
  }

  async createCategory(data: CreateCategoryDTO) {
    const slug = data.slug || data.name.toLowerCase().replace(/\s+/g, '-');

    const exists = await prisma.category.findFirst({
      where: {
        OR: [{ name: data.name }, { slug }],
      },
    });

    if (exists) {
      throw new AppError('Categoria já cadastrada com este nome ou slug.', 409);
    }

    return prisma.category.create({
      data: {
        name: data.name.trim(),
        slug,
        description: data.description,
        icon: data.icon,
      },
    });
  }
}
