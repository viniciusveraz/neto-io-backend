import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados neto.io...');

  // Limpa registros anteriores para permitir re-seed
  await prisma.review.deleteMany();
  await prisma.touristSpot.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // 1. Criação dos Usuários
  const passwordHash = await bcrypt.hash('neto123456', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Administrador neto.io',
      email: 'admin@neto.io',
      password: passwordHash,
      role: 'ADMIN',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
  });

  const kiter = await prisma.user.create({
    data: {
      name: 'Lucas Kiteboarding',
      email: 'lucas@kitesurf.com',
      password: passwordHash,
      role: 'USER',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
  });

  const traveler = await prisma.user.create({
    data: {
      name: 'Marina Rota das Emoções',
      email: 'marina@viagens.com.br',
      password: passwordHash,
      role: 'USER',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    },
  });

  console.log('✅ Usuários criados: admin@neto.io, lucas@kitesurf.com (senha: neto123456)');

  // 2. Criação das Categorias
  const catKite = await prisma.category.create({
    data: {
      name: 'Kitesurf & Esportes Náuticos',
      slug: 'kitesurf',
      description: 'Picos de vento perfeitos, downwinds e escolas de vela no litoral piauiense.',
      icon: 'wind',
    },
  });

  const catPraias = await prisma.category.create({
    data: {
      name: 'Praias Paradisíacas',
      slug: 'praias',
      description: 'Extensas faixas de areia, piscinas naturais e mar azul do Piauí.',
      icon: 'umbrella-beach',
    },
  });

  const catGastro = await prisma.category.create({
    data: {
      name: 'Gastronomia & Frutos do Mar',
      slug: 'gastronomia',
      description: 'Caranguejadas, peixadas piauienses, camarões frescos e culinária litorânea.',
      icon: 'utensils',
    },
  });

  const catEco = await prisma.category.create({
    data: {
      name: 'Ecoturismo & Delta',
      slug: 'ecoturismo',
      description: 'Delta do Parnaíba, revoada dos guarás, dunas e passeios de barco pelos manguezais.',
      icon: 'compass',
    },
  });

  const catHosp = await prisma.category.create({
    data: {
      name: 'Pousadas & Charme',
      slug: 'hospedagem',
      description: 'Pousadas rústico-chiques à beira-mar com conforto e hospitalidade acolhedora.',
      icon: 'hotel',
    },
  });

  const catCultura = await prisma.category.create({
    data: {
      name: 'Cultura & História',
      slug: 'cultura',
      description: 'Casarios coloniais, artesanato em trançado de carnaúba e patrimônio histórico.',
      icon: 'landmark',
    },
  });

  console.log('✅ 6 Categorias cadastradas.');

  // 3. Criação dos Pontos Turísticos
  const spotBG = await prisma.touristSpot.create({
    data: {
      name: 'Praia de Barra Grande',
      slug: 'praia-de-barra-grande',
      description: 'Meca mundial do Kitesurf, vilarejo charmoso de ruas de areia, ventos alísios constantes entre julho e janeiro, águas mornas e pôr do sol inesquecível no Piauí.',
      city: 'Barra Grande',
      address: 'Vila de Barra Grande, Cajueiro da Praia - PI',
      latitude: -2.9189,
      longitude: -41.4058,
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      additionalImages: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
      kitesurfSpot: true,
      contactPhone: '+55 86 99999-0001',
      instagram: '@barragrandepi',
      categoryId: catKite.id,
    },
  });

  const spotPontal = await prisma.touristSpot.create({
    data: {
      name: 'Pontal da Barra & Passeio do Cavalo-Marinho',
      slug: 'pontal-da-barra-grande',
      description: 'Ponto onde o rio Camurupim encontra o mar. Área de preservação com passeios ecológicos de canoa para observação de cavalos-marinhos nos mangues nativos.',
      city: 'Barra Grande',
      address: 'Estrada do Pontal, Barra Grande - PI',
      latitude: -2.9135,
      longitude: -41.421,
      imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
      isFeatured: true,
      kitesurfSpot: true,
      categoryId: catEco.id,
    },
  });

  const spotMacapa = await prisma.touristSpot.create({
    data: {
      name: 'Praia do Macapá',
      slug: 'praia-do-macapa',
      description: 'Mar de águas calmas na maré baixa que formam grandes piscinas naturais e bancos de areia. Ponto favorito de velejadores para manobras de freestyle e flat water.',
      city: 'Luís Correia',
      address: 'Praia do Macapá, Luís Correia - PI',
      latitude: -2.9068,
      longitude: -41.4552,
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      isFeatured: true,
      kitesurfSpot: true,
      categoryId: catKite.id,
    },
  });

  const spotCoqueiro = await prisma.touristSpot.create({
    data: {
      name: 'Praia do Coqueiro',
      slug: 'praia-do-coqueiro',
      description: 'Uma das praias mais tradicionais e charmosas de Luís Correia. Recifes de corais que protegem banhistas na maré baixa, barracas estruturadas e excelente gastronomia de frutos do mar.',
      city: 'Luís Correia',
      address: 'Av. Beira Mar, Coqueiro, Luís Correia - PI',
      latitude: -2.8943,
      longitude: -41.5645,
      imageUrl: 'https://images.unsplash.com/photo-1520483601560-389dff434fdf?auto=format&fit=crop&w=1200&q=80',
      isFeatured: true,
      kitesurfSpot: false,
      categoryId: catPraias.id,
    },
  });

  const spotAtalaia = await prisma.touristSpot.create({
    data: {
      name: 'Praia de Atalaia',
      slug: 'praia-de-atalaia',
      description: 'A praia mais movimentada e acessível de Luís Correia, com calçadão urbanizado, iluminação noturna, ampla faixa de areia e variedade de quiosques que servem a clássica caranguejada piauiense.',
      city: 'Luís Correia',
      address: 'Orla de Atalaia, Luís Correia - PI',
      latitude: -2.8805,
      longitude: -41.6741,
      imageUrl: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&q=80',
      isFeatured: false,
      kitesurfSpot: false,
      categoryId: catPraias.id,
    },
  });

  const spotItaqui = await prisma.touristSpot.create({
    data: {
      name: 'Praia do Itaqui & Farol',
      slug: 'praia-do-itaqui',
      description: 'Praia de beleza selvagem com falésias claras, mar aberto e o icônico Farol do Itaqui. Atmosfera de refúgio e tranquilidade absoluta.',
      city: 'Luís Correia',
      address: 'Praia do Itaqui, Luís Correia - PI',
      latitude: -2.9022,
      longitude: -41.5124,
      imageUrl: 'https://images.unsplash.com/photo-1509233725247-49e657c54213?auto=format&fit=crop&w=1200&q=80',
      isFeatured: false,
      kitesurfSpot: true,
      categoryId: catPraias.id,
    },
  });

  const spotDelta = await prisma.touristSpot.create({
    data: {
      name: 'Delta do Parnaíba & Revoada dos Guarás',
      slug: 'delta-do-parnaiba-porto-dos-tatus',
      description: 'O único delta em mar aberto das Américas. Um arquipélago com mais de 70 ilhas fluviomarinhas, igarapés, dunas gigantes e o emocionante espetáculo diário de milhares de guarás vermelhos recolhendo-se na Ilha dos Guarás ao entardecer.',
      city: 'Ilha Grande',
      address: 'Porto dos Tatus, Ilha Grande - PI',
      latitude: -2.8582,
      longitude: -41.8211,
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      isFeatured: true,
      kitesurfSpot: false,
      contactPhone: '+55 86 99888-1234',
      categoryId: catEco.id,
    },
  });

  const spotPortoBarcas = await prisma.touristSpot.create({
    data: {
      name: 'Porto das Barcas',
      slug: 'porto-das-barcas',
      description: 'Coração histórico de Parnaíba às margens do Rio Igaraçu. Edificações coloniais do século XVIII restauradas, lojas de artesanato em palha de carnaúba, museus e restaurantes culturais.',
      city: 'Parnaíba',
      address: 'Rua do Porto, Centro Histórico, Parnaíba - PI',
      latitude: -3.0033,
      longitude: -41.7761,
      imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      isFeatured: true,
      kitesurfSpot: false,
      categoryId: catCultura.id,
    },
  });

  const spotPortinho = await prisma.touristSpot.create({
    data: {
      name: 'Lagoa do Portinho',
      slug: 'lagoa-do-portinho',
      description: 'Cartão-postal piauiense cercado por dunas brancas de areia e vegetação nativa. Excelente para banho de água doce, passeios de buggy e contemplação.',
      city: 'Parnaíba',
      address: 'Rodovia Parnaíba - Luís Correia, Parnaíba - PI',
      latitude: -2.9469,
      longitude: -41.7011,
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      isFeatured: false,
      kitesurfSpot: false,
      categoryId: catEco.id,
    },
  });

  const spotArvore = await prisma.touristSpot.create({
    data: {
      name: 'Árvore Penteada',
      slug: 'arvore-penteada',
      description: 'Monumento natural esculpido pela mãe natureza: um tamarindeiro que cresceu deitado e com sua copa toda direcionada para um lado devido aos fortes e incessantes ventos litorâneos.',
      city: 'Luís Correia',
      address: 'PI-116, sentido Praia do Coqueiro, Luís Correia - PI',
      latitude: -2.9056,
      longitude: -41.5982,
      imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
      isFeatured: false,
      kitesurfSpot: false,
      categoryId: catCultura.id,
    },
  });

  console.log('✅ 10 Pontos turísticos cadastrados.');

  // 4. Criação das Avaliações (Reviews)
  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'Barra Grande tem um dos melhores ventos do mundo para velejar! Água morna, vento constante de 20 a 25 nós e a vibe do vilarejo é surreal.',
      userId: kiter.id,
      touristSpotId: spotBG.id,
    },
  });

  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'O Delta do Parnaíba e a Revoada dos Guarás no fim de tarde foi uma das experiências mais marcantes da minha vida. Imperdível!',
      userId: traveler.id,
      touristSpotId: spotDelta.id,
    },
  });

  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'Lugar mágico! As piscinas naturais na maré baixa são um paraíso na terra e o flat para o kitesurf é perfeito.',
      userId: kiter.id,
      touristSpotId: spotMacapa.id,
    },
  });

  await prisma.review.create({
    data: {
      rating: 4,
      comment: 'Excelente passeio histórico e cultural. O artesanato piauiense em carnaúba é lindo e os restaurantes têm música ao vivo agradável.',
      userId: traveler.id,
      touristSpotId: spotPortoBarcas.id,
    },
  });

  console.log('✅ Avaliações cadastradas com sucesso!');
  console.log('🚀 Seed do neto.io finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante a execução do seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
