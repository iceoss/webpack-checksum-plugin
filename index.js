const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function ChecksumPlugin( options ) {
    this.options = options;
}

ChecksumPlugin.prototype.apply = function(compiler) {
    const options = this.options;
    const checksumFilepath = `${options.distPath}/${options.outputFilename || 'checksums'}`;
    const checksumPattern = options.checksumPattern || 'hash:filepath';
    const resetChecksumFile = options.resetChecksumFile || false;

    // Setup callback for accessing a compilation:
    compiler.plugin('after-emit', function(compilation, callback) {
        let checksums = [];

        if ( resetChecksumFile ) {
            // reset checksums
            fs.writeFileSync( checksumFilepath, '', {
                encoding: 'utf8'
            } );
        } else {
            if ( fs.existsSync(checksumFilepath) ) {
                checksums = fs.readFileSync(checksumFilepath, 'utf8').split('\n');
            }
        }

        Object.keys(compilation.assets).forEach( function(filename) {
            const asset = compilation.assets[filename];
            const absolutePath = asset.existsAt;
            const publicPath = absolutePath.substr( absolutePath.indexOf( options.assetPath ) + options.assetPath.length );
            const file = fs.readFileSync( absolutePath );
            const hash = crypto.createHash('md5').update(file).digest('hex');
            const checksumEntry = checksumPattern.replace('hash', hash).replace('filepath', options.assetPath + publicPath);

            checksums.push( checksumEntry );
        } );

        fs.writeFileSync( checksumFilepath, checksums.join('\n'), {
            encoding: 'utf8'
        } );

        callback();
    });
};

module.exports = ChecksumPlugin;
