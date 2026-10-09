export function kmhToKnots(kmh: number): number {
  return Number((kmh * 0.539957).toFixed(1));
}

export function degreesToCardinal(degrees: number): { code: string; label: string } {
  const normalized = (degrees % 360 + 360) % 360;
  const directions = [
    { code: 'N', label: 'Norte' },
    { code: 'NNE', label: 'Norte-Nordeste' },
    { code: 'NE', label: 'Nordeste' },
    { code: 'ENE', label: 'Leste-Nordeste' },
    { code: 'E', label: 'Leste' },
    { code: 'ESE', label: 'Leste-Sudeste' },
    { code: 'SE', label: 'Sudeste' },
    { code: 'SSE', label: 'Sul-Sudeste' },
    { code: 'S', label: 'Sul' },
    { code: 'SSW', label: 'Sul-Sudoeste' },
    { code: 'SW', label: 'Sudoeste' },
    { code: 'WSW', label: 'Oeste-Sudoeste' },
    { code: 'W', label: 'Oeste' },
    { code: 'WNW', label: 'Oeste-Noroeste' },
    { code: 'NW', label: 'Noroeste' },
    { code: 'NNW', label: 'Norte-Noroeste' },
  ];

  const index = Math.round(normalized / 22.5) % 16;
  return directions[index];
}

export interface KiteConditionAnalysis {
  status: 'EXCELLENT' | 'GOOD' | 'LIGHT' | 'EXTREME' | 'NO_WIND';
  badge: string;
  recommendedKiteSize: string;
  advice: string;
}

export function analyzeKiteConditions(knots: number, directionDegrees: number): KiteConditionAnalysis {
  const cardinal = degreesToCardinal(directionDegrees).code;
  const isSideOnshore = ['E', 'ENE', 'NE', 'ESE', 'SE'].includes(cardinal);

  if (knots >= 22 && knots <= 28) {
    return {
      status: 'EXCELLENT',
      badge: 'Condições Perfeitas 🚀',
      recommendedKiteSize: '7m - 9m',
      advice: `Vento constante e seguro (${cardinal}${isSideOnshore ? ' Side-Onshore' : ''}). Excelente para saltos altos e freestyle.`,
    };
  }

  if (knots >= 15 && knots < 22) {
    return {
      status: 'GOOD',
      badge: 'Muito Bom 🪁',
      recommendedKiteSize: '9m - 12m',
      advice: `Vento clássico de Barra Grande. Excelente para velejadores de todos os níveis.`,
    };
  }

  if (knots >= 11 && knots < 15) {
    return {
      status: 'LIGHT',
      badge: 'Vento Suave / Foil ⛵',
      recommendedKiteSize: '12m - 15m ou Hydrofoil',
      advice: 'Ideal para hidrofoil, pranchas direcionais ou pipas maiores.',
    };
  }

  if (knots > 28) {
    return {
      status: 'EXTREME',
      badge: 'Vento Forte / Alerta de Rajadas ⚠️',
      recommendedKiteSize: '5m - 7m',
      advice: 'Condição intensa reservada para kiters experientes. Fique atento às rajadas.',
    };
  }

  return {
    status: 'NO_WIND',
    badge: 'Sem Vento para Kitesurf 🏖️',
    recommendedKiteSize: 'Stand-up paddle / Relaxar',
    advice: 'Aproveite para curtir as piscinas naturais, passeios de canoa ou a gastronomia local.',
  };
}
