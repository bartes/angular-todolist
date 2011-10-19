angular.directive('my:async-validator', function(expression, element) {
  var compiler = this;
  compiler.descend(true);

  element.attr('ng:validate', 'asynchronous:' + expression);
  element.addClass('async-validator-cache-sweepable');

  return angular.noop;
});

angular.service('asyncValidatorCacheSweeper', function() {
  var asyncValidatorCaches = {};

  return {
    expireAll: function() {
      $('.async-validator-cache-sweepable').each(function(indx, input) {
        var input = $(input);
        input.data('$asyncValidator').inputs = {};
      });
    }
  }
});

