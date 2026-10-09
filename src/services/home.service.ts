import { prisma } from '../config/prisma';
import { WeatherService } from './weather.service';

export class HomeService {
  private weatherService: WeatherService;

  constructor() {
    this.weatherService = new WeatherService();
  }

  async getHomePayload() {
    // Busca dados em paralelo para máxima velocidade de carregamento da UI
    const [weatherResult, featuredSpots, kiteSpots, categories, spotCountByCity] = await Promise.allSettled([
      this.weatherService.getCurrentWeatherBarraGrande(),
      prisma.touristSpot.findMany({
        where: { isFeatured: true },
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: {
          category: {
            select: { name: true, slug: true, icon: true },
          },
          reviews: {
            select: { rating: true },
          },
        },
      }),
      prisma.touristSpot.findMany({
        where: { kitesurfSpot: true },
        take: 4,
        orderBy: { isFeatured: 'desc' },
        include: {
          category: {
            select: { name: true, slug: true, icon: true },
          },
          reviews: {
            select: { rating: true },
          },
        },
      }),
      prisma.category.findMany({
        orderBy: { name: 'asc' },
        include: {
          _count: { select: { spots: true } },
        },
      }),
      prisma.touristSpot.groupBy({
        by: ['city'],
        _count: { id: true },
      }),
    ]);

    // Trata fallback elegante caso a API de clima tenha oscilações temporárias
    const windStatus =
      weatherResult.status === 'fulfilled'
        ? weatherResult.value
        : {
            status: 'offline_fallback',
            message: 'Medição em tempo real temporariamente em atualização. Condições médias da época: 18 a 24 nós.',
            location: { spot: 'Barra Grande', city: 'Cajueiro da Praia', state: 'PI' },
          };

    const formatSpots = (spotsList: any[]) =>
      spotsList.map((spot) => {
        const total = spot.reviews?.length || 0;
        const avg =
          total > 0
            ? Number((spot.reviews.reduce((acc: number, c: any) => acc + c.rating, 0) / total).toFixed(1))
            : null;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { reviews, ...rest } = spot;
        return {
          ...rest,
          averageRating: avg,
          totalReviews: total,
        };
      });

    const formattedFeatured = featuredSpots.status === 'fulfilled' ? formatSpots(featuredSpots.value) : [];
    const formattedKite = kiteSpots.status === 'fulfilled' ? formatSpots(kiteSpots.value) : [];

    const formattedCategories =
      categories.status === 'fulfilled'
        ? categories.value.map((c) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            icon: c.icon,
            spotsCount: c._count.spots,
          }))
        : [];

    const citiesSummary =
      spotCountByCity.status === 'fulfilled'
        ? spotCountByCity.value.map((c) => ({
            city: c.city,
            totalSpots: c._count.id,
          }))
        : [];

    return {
      meta: {
        title: 'neto.io - Guia do Litoral do Piauí',
        description: 'Vento em tempo real em Barra Grande, praias e experiências inesquecíveis da Rota das Emoções.',
        kiteSeason: 'Julho a Janeiro (Alta temporada de ventos constantes)',
      },
      liveWindBarraGrande: windStatus,
      featuredSpots: formattedFeatured,
      kitesurfSpots: formattedKite,
      categories: formattedCategories,
      destinations: citiesSummary,
    };
  }
}
