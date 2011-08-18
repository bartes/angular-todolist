function OuterController() {
  this.outerEvalCycles = 0;
  this.bar = 'bar';

  this.$onEval(function() {
    this.outerEvalCycles++;
  });
}

function MyController($log) {
  var scope = this;
  this.$log = $log;

  this.bar = 'foo';
  this.items = [{value: 'Initial item'}, {value: 'Second initial item'}];

  this.$watch('items.length', function(value, oldValue) {
    this.itemsCount = value;
    this.oldItemsCount = oldValue;
  });

  this.evalCycles = 0;
  this.$onEval('evalCycles = evalCycles + 1');

  this.$onEval(function() {
    var changed = !angular.Object.equals(this.items, this.itemsMasterCopy);
    if (changed) {
      this.$log.info('items changed = ', this.items);
      this.itemsMasterCopy = angular.Object.copy(this.items);
    }
  });
}
MyController.$inject = ['$log'];

MyController.prototype = {
  addItem: function() {
    this.items.push({ value: this._newItemValue });
    this._newItemValue = '';
  },
  changeFirstItemName: function() {
    this.items[0].value = 'New value';
  }
};
