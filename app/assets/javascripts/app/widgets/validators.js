angular.directive('my:async-validator-cache-sweeper', function(key, element) {
  return angular.extend(function(asyncValidatorCacheSweeper, element) {
    var cache = asyncValidatorCacheSweeper.addCache(key);
    element.data('$asyncValidator', cache);
  }, { $inject: ['asyncValidatorCacheSweeper'] });
});

angular.service('asyncValidatorCacheSweeper', function() {
  var asyncValidatorCaches = {};

  return {
    addCache: function(key) {
      asyncValidatorCaches[key] = {inputs: {}};
      return asyncValidatorCaches[key];
    },
    expireFor: function(key) {
      if (asyncValidatorCaches[key]) {
        asyncValidatorCaches[key].inputs = {};
        return true;
      } else {
        return false;
      }
    }
  }
});

