# Webpack Checksum Plugin

This plugin will generate checksum files for files outputted by Webpack.

## Usage

```
 plugins: [
	new ChecksumPlugin({
		distPath: 'build',
		assetPath: '/v5/touch/',
		outputFilename: 'checksums',
		checksumPattern: 'hash:filepath',
		resetChecksumFile: false
	})
]
```

## Options

| Name | Required | Default     | Details                                                 |
|------|----------|------------ |---------------------------------------------------------|
| `distPath` | Y      |             | The path where the outputted Webpack files will be generated to. |
| `assetPath` | Y      |             | The public path where the outputted Webpack files will be accessible from. |
| `outputFilename` | N      | checksums            | The name of the generated checksums file. |
| `checksumPattern` | N      | hash:filepath            | The pattern that should be used in the generated checksums file. The only available variales are `hash` and `filepath`. |
| `resetChecksumFile` | N      | false            | Tells the plugin whether or not it should reset the contents of the outputted checksum file, or if it should just append to it. |