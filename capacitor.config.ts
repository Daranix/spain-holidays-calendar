import { CapacitorConfig } from '@capacitor/cli';

const basicConfig: CapacitorConfig = {
  appId: 'dev.mpesteban.calendario.festivos',
  appName: 'Calendario Festivos España',
  webDir: 'dist/browser',
}

function getConfig(): CapacitorConfig {
  if(process.env['IS_BUILD'] === 'true') {
    return {
      ...basicConfig
    };
  }

  return {
    ...basicConfig,
    server: {
      cleartext: true,
      url: 'http://10.0.2.2:4200',
      androidScheme: 'https'
    }
  };
}

const config: CapacitorConfig = getConfig();



export default config;
