const crypto = require('crypto');
const fs = require('fs');

function ChecksumPlugin( options ) {
    this.options = options;
}

ChecksumPlugin.prototype.apply = function(compiler) {
    const options = this.options;
    const checksumFilepath = `${options.distPath}/${options.outputFilename || 'checksums'}`;
    const checksumPattern = options.checksumPattern || 'hash:filepath';

    // Setup callback for accessing a compilation:
    compiler.plugin('after-emit', function(compilation, callback) {

        // reset checksums
        fs.writeFileSync( checksumFilepath, '', {
            encoding: 'utf8'
        } );
        let checksums = [];

        Object.keys(compilation.assets).forEach( function(filename) {
            const asset = fs.readFileSync( `${options.distPath}/${filename}` );
            const hash = crypto.createHash('md5').update(asset).digest('hex');
            const assetFilepath = options.assetPath + filename;
            const checksumEntry = checksumPattern.replace('hash', hash).replace('filepath', assetFilepath);

            checksums.push( checksumEntry );
        } );

        fs.writeFileSync( checksumFilepath, checksums.join('\n'), {
            encoding: 'utf8'
        } );

        callback();
    });
};

module.exports = ChecksumPlugin;
