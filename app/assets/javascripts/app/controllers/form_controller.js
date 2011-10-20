FormController = function() {
  this.categories = ['foo', 'bar', 'baz'];
  this.passwordLength = {min: 3, max: 6};

  this.record = {
    category: 'foo',
    oddNumber: 667
  };

  this.cancel();

  this.OddNumber = function(element) {
    var widget = this;

    this.$on('$validate', function() {
      var isOdd = widget.$viewValue % 2 !== 0;
      if (isOdd) {
        widget.$emit('$valid', 'ODD_NUMBER');
      } else {
        widget.$emit('$invalid', 'ODD_NUMBER');
      }
    });
  };
};

FormController.prototype = {
  cancel: function() {
    this.myFormData = angular.copy(this.record);
  },

  save: function() {
    this.record = this.myFormData;
    this.cancel();
  },

  dirty: function() {
    return !angular.equals(this.record, this.myFormData);
  },

  valid: function() {
    return this.myForm.$valid;
  },

  invalid: function() {
    return this.myForm.$invalid;
  }
};

angular.directive('ensure-length', function(expression, element) {
  return angular.extend(function($formFactory, element) {
    var options = this.$eval(expression);
    var form = $formFactory.forElement(element);

    var alias = element.attr('name');
    var widget = form[alias];

    form.$on('$validate', function() {
      var value = element.val();

      if (value.length < options.min) {
        widget.$emit('$invalid', 'TOO_SHORT');
      } else if (value.length > options.max) {
        widget.$emit('$invalid', 'TOO_LONG');
      } else {
        widget.$emit('$valid', 'TOO_SHORT');
        widget.$emit('$valid', 'TOO_LONG');
      }
    });

  }, {$inject: ['$formFactory']});
});

