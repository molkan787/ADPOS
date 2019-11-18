const config = {
    appName: 'ADPOS',
    versionCode: 900,
    versionName: '0.9.0',
    dev: true,
}

Object.freeze(config)
global.config = config;
window.config = config;
export default config;