# s3-readable

Read S3 files using streams

[![NPM Package](https://img.shields.io/npm/v/s3-readable.svg?style=flat)](https://www.npmjs.org/package/s3-readable)
[![Dependencies](https://david-dm.org/seedalpha/s3-readable.svg)](https://david-dm.org/seedalpha/s3-readable)

### Installation

    $ npm install s3-readable --save
    
### Usage

```javascript

var fs = require('fs');
var aws = require('aws-sdk');
var readable = require('s3-readable');

aws.config.update({
  accessKeyId:      process.env.AMAZON_ACCESS_KEY_ID,
  secretAccessKey:  process.env.AMAZON_ACCESS_KEY_SECRET,
  region:           process.env.S3_REGION
});

var s3 = new aws.S3();

var stream = readable(s3).createReadStream({
  Bucket: 'test',
  Key: 'file.pdf'
  // takes same params as `s3.getObject`
});

// optionally

stream.on('open', function(file) {
  console.log(file); // { ContentLength: 8, ContentType: 'text/plain', Bucket: '...', Key: 'test.txt', Body: self }
});

stream.pipe(fs.createWriteStream(__dirname + '/file.pdf'));

```

### Author

Vladimir Popov <rusintez@gmail.com>

### License

MIT