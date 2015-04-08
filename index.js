var through = require('through2');

exports = module.exports = function(s3, options) {
  
  options = options || {};
  options.highWaterMark = options.highWaterMark || 4 * 1024 * 1024;
  
  return {
    createReadStream: function(params) {
      var request = s3.getObject(params);
      var stream = through({ highWaterMark: options.highWaterMark });

      request.on('httpHeaders', function(status, headers, response) {
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
        
        response.httpResponse.createUnbufferedStream().pipe(stream);
      });
      
      request.on('error', function(err) {
        stream.emit('error', err);
      });
      
      request.send(function(err) {
        if (!err) return;
        stream.emit('error', err);
      });
      
      return stream;
    }
  }
}