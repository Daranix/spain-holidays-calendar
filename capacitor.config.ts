import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'dev.mpesteban.calendario.festivos',
  appName: 'Calendario Festivos España',
  webDir: 'dist/browser',
  server: {
    cleartext: true,
    url: 'http://10.0.2.2:4200',
    androidScheme: 'https'
  }
};

export default config;
