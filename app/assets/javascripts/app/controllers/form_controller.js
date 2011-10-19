FormController = function() {
  this.categories = ['foo', 'bar', 'baz'];

  this.record = {
    category: 'foo'
  };

  this.myFormData = angular.copy(this.record);
}

