import { prisma } from '../config/prisma';
import { AppError } from '../utils/app-error';

export interface CreateReviewDTO {
  rating: number;
  comment: string;
  userId: string;
  touristSpotId: string;
}

export class ReviewService {
  async listReviewsForSpot(spotIdentifier: string) {
    const spot = await prisma.touristSpot.findFirst({
      where: {
        OR: [{ id: spotIdentifier }, { slug: spotIdentifier }],
      },
      select: { id: true, name: true },
    });

    if (!spot) {
      throw new AppError('Ponto turístico não encontrado.', 404);
    }

    const reviews = await prisma.review.findMany({
      where: { touristSpotId: spot.id },
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
    });

    const total = reviews.length;
    const averageRating =
      total > 0
        ? Number((reviews.reduce((acc, curr) => acc + curr.rating, 0) / total).toFixed(1))
        : null;

    return {
      spotId: spot.id,
      spotName: spot.name,
      total,
      averageRating,
      reviews,
    };
  }

  async createReview(data: CreateReviewDTO) {
    const spot = await prisma.touristSpot.findFirst({
      where: {
        OR: [{ id: data.touristSpotId }, { slug: data.touristSpotId }],
      },
    });

    if (!spot) {
      throw new AppError('Ponto turístico não encontrado.', 404);
    }

    // Permite que o usuário atualize a avaliação se já tiver avaliado
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: data.userId,
        touristSpotId: spot.id,
      },
    });

    if (existingReview) {
      const updated = await prisma.review.update({
        where: { id: existingReview.id },
        data: {
          rating: data.rating,
          comment: data.comment.trim(),
        },
        include: {
          user: {
            select: { id: true, name: true, avatarUrl: true },
          },
        },
      });
      return { review: updated, updated: true };
    }

    const review = await prisma.review.create({
      data: {
        rating: data.rating,
        comment: data.comment.trim(),
        userId: data.userId,
        touristSpotId: spot.id,
      },
      include: {
        user: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
    });

    return { review, updated: false };
  }
}
