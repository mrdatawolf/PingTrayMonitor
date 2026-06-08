const fs = require('fs');
const path = require('path');
const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const packageJson = require('./package.json');

module.exports = {
  packagerConfig: {
    name: 'PingTrayMonitor',
    appId: 'com.biztech.ping-tray-monitor',
    asar: true,
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      platforms: ['win32'],
      config: {
        name: 'PingTrayMonitor',
        authors: 'Trust Biz Tech',
        setupExe: 'PingTrayMonitor-Setup.exe',
        noMsi: true,
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin', 'linux'],
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-vite',
      config: {
        build: [
          { entry: 'electron/main.js',    config: 'vite.main.config.js',    target: 'main' },
          { entry: 'electron/preload.js', config: 'vite.preload.config.js', target: 'preload' },
          { entry: 'electron/icons.js',   config: 'vite.main.config.js',    target: 'main' },
        ],
        renderer: [
          { name: 'main_window', config: 'vite.renderer.config.js' },
        ],
      },
    },
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: false,
      [FuseV1Options.OnlyLoadAppFromAsar]: false,
    }),
  ],
  hooks: {
    postMake: async (forgeConfig, makeResults) => {
      const distributeDir = path.resolve(__dirname, 'distribute');
      fs.mkdirSync(distributeDir, { recursive: true });

      const versionTag = packageJson.version.replace(/\./g, '_');

      for (const result of makeResults) {
        if (result.platform !== 'win32') continue;

        const setupExe = result.artifacts.find((artifact) => artifact.toLowerCase().endsWith('.exe'));
        if (!setupExe) continue;

        const dest = path.join(distributeDir, `PingTray-${versionTag}.exe`);
        fs.copyFileSync(setupExe, dest);
        console.log(`[postMake] Copied installer to ${dest}`);
      }

      return makeResults;
    },
  },
};
