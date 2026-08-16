import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.axynera.official',
  appName: 'Axynera',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
