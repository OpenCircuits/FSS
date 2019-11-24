const path = require('path');

function baseUrl(subdir) {
    return path.join(__dirname, ".", subdir);
}

const config = {
   entry: './site/public/ts/fss/Main.ts',
   output: {
       filename: 'Bundle.js',
       path: path.resolve(__dirname, 'build')
   },
   devtool: 'source-map',
   module: {
       rules: [
           {
               test: /\.(ts)$/,
               exclude: /(node_modules)/,
               use: {
                   loader: 'ts-loader',
                   options: {onlyCompileBundledFiles: true}
               }
           }
       ]
   },
   resolve: {
       alias: {
           "Vector": baseUrl('lib/OpenCircuits/app/core/ts/utils/math/Vector'),
           "math": baseUrl('lib/OpenCircuits/app/core/ts/utils/math'),
           "core": baseUrl('lib/OpenCircuits/app/core/ts/'),
           "fss": baseUrl('app/fss/ts/'),
           "site/shared": baseUrl('lib/OpenCircuits/site/public/ts/shared'),
           "site/fss": baseUrl('site/public/ts/fss')
       },
       extensions: ['.ts', '.js']
   }
};

module.exports = config;


