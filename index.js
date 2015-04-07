var through = require('through2');

exports = module.exports = function(s3, options) {
  
  options = options || {};
  options.highWaterMark = options.highWaterMark || 4 * 1024 * 1024;
  
  return {
    createReadStream: function(params) {
      var request = s3.getObject(params);
      var stream = through({ highWaterMark: options.highWaterMark });
      
      request.on('httpHeaders', function(status, headers) {
        if (status >= 300) {
          return stream.emit('error', { statusCode: status });
        }
        
        stream.emit('open', {
          ContentLength: parseInt(headers['content-length'], 10),
          ContentType: headers['content-type'],
          Bucket: params.Bucket,
    			Key: params.Key,
    			Body: stream
        });
      });
      
      var readable = request.createReadStream();
      
      readable.pipe(stream);
      
      return stream;
    }
  }
}