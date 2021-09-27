module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript'
  ],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@app': './src/app',
          '@utils': './src/utils',
          '@enums': './src/enums',
          '@typings': './src/typings',
          '@logger': './src/logger/index'
        }
      }
    ]
  ],
  ignore: ['**/*.spec.ts']
}
