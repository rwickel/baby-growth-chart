import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.babygrowthchart.app',
  appName: 'Baby Growth Chart',
  webDir: 'dist',
  plugins: {
    StatusBar: {
      backgroundColor: '#000000',
      style: 'DARK',
      overlaysWebView: true,
    },
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
};

export default config;
