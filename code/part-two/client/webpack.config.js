const path = require('path');
const SOURCE_DIR = path.join(__dirname, '/source');
const PUBLIC_DIR = path.join(__dirname, '/public');

module.exports = {
  entry: `${SOURCE_DIR}/index.jsx`,
  output: {
    filename: 'bundle.js',
    path: PUBLIC_DIR
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        include: SOURCE_DIR,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react']
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  }
};
