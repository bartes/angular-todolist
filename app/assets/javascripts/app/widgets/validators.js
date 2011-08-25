angular.directive('my:async-validator-cache-sweeper', function(key, element) {
  var compiler = this;

  return function(element) {
    var scope = this;

    if (!scope.$asyncValidatorCaches) {
      scope.$asyncValidatorCaches = {};
    }
    scope.$asyncValidatorCaches[key] = {inputs: {}};

    var cache = element.data('$asyncValidator');
    element.data('$asyncValidator', scope.$asyncValidatorCaches[key]);
  }
});

angular.service('asyncValidatorCacheSweeper', function() {
  return function(scope) {
    return {
      expireFor: function(key) {
        scope.$asyncValidatorCaches[key].inputs = {};
      }
    };
  }
})
