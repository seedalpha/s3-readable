var assert = require('assert');
var fs = require('fs');
var aws = require('aws-sdk');
var readable = require('./');

aws.config.update({
  accessKeyId:      process.env.AMAZON_ACCESS_KEY_ID,
  secretAccessKey:  process.env.AMAZON_ACCESS_KEY_SECRET,
  region:           process.env.S3_REGION
});

var s3 = new aws.S3();

describe('s3-readable', function() {
  it('should create a readable stream', function(done) {
    var from = readable(s3).createReadStream({
      Bucket: process.env.S3_BUCKET,
      Key: 'test.txt'
    });

    var to = fs.createWriteStream(__dirname + '/test.txt');
    
    from.pipe(to).on('finish', function() {
      assert.equal(
        fs.readFileSync(__dirname + '/test.txt').toString(),
        'testing'
      );
      fs.unlinkSync(__dirname + '/test.txt');
      done();
    });
  });
});