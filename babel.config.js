module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  env: {
    production: {
      plugins: ['ignite-ignore-reactotron']
    }
  }
};

