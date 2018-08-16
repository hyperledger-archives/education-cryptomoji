const path = require('path');
const SOURCE_DIR = path.join(__dirname, '/source');
const PUBLIC_DIR = path.join(__dirname, '/public');

module.exports = {
  entry: `${SOURCE_DIR}/index.jsx`,
  output: {
    filename: 'bundle.js',
    path: PUBLIC_DIR
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.jsx?$/,
        include: SOURCE_DIR,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  }
};
