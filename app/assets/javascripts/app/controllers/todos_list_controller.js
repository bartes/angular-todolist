function TodosListController($resource, $window, grid) {
  var scope = this;

  this.todos = {};
  this.todos2 = {};
  this.$resource = $resource('/todos/paginate.json', {}, {
    get: {method: 'GET', isArray: false, verifyCache: true}
  });

  this.$window = $window;

  this.estimates = [0, 1, 2, 3, 5, 8, 13, 21, 34];
  this.pages = [5, 10, 20, 50];

  this.grid = grid({
    controller: this,
    property: 'todos',
    resource: this.$resource,
    perPage: 5
  });

  this.secondGrid = grid({
    controller: this,
    property: 'todos2',
    resource: this.$resource,
    perPage: 10
  });

  this.grid.load();
  this.secondGrid.load();
}
TodosListController.$inject = ['$resource', '$window', 'Grid'];

