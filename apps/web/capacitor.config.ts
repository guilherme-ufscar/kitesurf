import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'br.com.kite360.app',
  appName: 'KITE360',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
}

export default config
