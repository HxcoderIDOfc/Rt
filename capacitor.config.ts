import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'id.my.axynera.app',
  appName: 'Axynera',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
