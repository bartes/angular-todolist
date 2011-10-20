FormController = function() {
  this.categories = ['foo', 'bar', 'baz'];

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
  var options = angular.fromJson(expression);

  return angular.extend(function($formFactory, element) {
    var form = $formFactory.forElement(element);

    var alias = element.attr('name');
    var widget = form[alias];

    form.$on('$validate', function() {
      var value = element.val();
      if (value.length < options.min) {
        widget.$emit('$invalid', 'LENGTH');
      } else if (value.length > options.max) {
        widget.$emit('$invalid', 'LENGTH');
      } else {
        widget.$emit('$valid', 'LENGTH');
      }
    });

  }, {$inject: ['$formFactory']});
});

//angular.widget('my:form', function(element) {
  //var linkFn = function($formFactory, element) {
    //var form = $formFactory.forElement(element);

    //form.$createWidget({
      //scope: this
    //});

    //form.$on('$validate', function() {
      //console.log('validate');
    //});
  //};
  //linkFn.$inject = ['$formFactory'];

  //return linkFn;
//});

