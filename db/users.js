var records = [
    { id: 1, username: 'admin', token: 'ae8f340f1940547a177b6bb04e6d3cd3', displayName: 'admin', emails: [ { value: 'admin@example.com' } ] }
  , { id: 2, username: 'user', token: '7703c48c8fe92c696c7db70768231e6c', displayName: 'user1', emails: [ { value: 'user1@example.com' } ] }
];

exports.findByToken = function(token, cb) {
  process.nextTick(function() {
    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      if (record.token === token) {
        return cb(null, record);
      }
    }
    return cb(null, null);
  });
}