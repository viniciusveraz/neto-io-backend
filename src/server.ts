import { app } from './app';
import { env } from './config/env';

const server = app.listen(env.port, () => {
  console.log(`
  =======================================================
  🚀 neto.io API inicializada com sucesso!
  📍 Litoral do Piauí & Vento em Barra Grande (BG)
  -------------------------------------------------------
  🌐 Servidor ouvindo em:     ${env.apiBaseUrl}
  📚 Swagger Documentação:    ${env.apiBaseUrl}/docs
  💨 Telemetria de Vento:     ${env.apiBaseUrl}/weather/barra-grande
  🏖️ Pontos Turísticos:       ${env.apiBaseUrl}/spots
  🌱 Ambiente:                ${env.nodeEnv}
  =======================================================
  `);
});

// Encerramento gracioso em caso de sinais de terminação
process.on('SIGTERM', () => {
  console.log('Sinal SIGTERM recebido. Fechando servidor HTTP...');
  server.close(() => {
    console.log('Servidor finalizado com segurança.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('Sinal SIGINT recebido. Fechando servidor HTTP...');
  server.close(() => {
    console.log('Servidor finalizado com segurança.');
    process.exit(0);
  });
});
