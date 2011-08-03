function TodosListController($resource, grid) {
  var scope = this;

  this.todos = {};
  this.resource = $resource('/todos/paginate.json', {}, {
    get: {method: 'GET', isArray: false, verifyCache: true}
  });

  this.estimates = [0, 1, 2, 3, 5, 8, 13, 21, 34];
  this.pages = [5, 10, 20, 50];

  this.grid = grid({
    controller: this,
    property: 'todos',
    resource: this.resource,
    perPage: 5
  });

  this.$watch('grid.perPage', function(newValue, oldValue) {
    if (newValue === oldValue) { return; }

    scope.grid.currentPage = 1;
    scope.grid.load();
  });

  this.grid.load();
}
TodosListController.$inject = ['$resource', 'Grid'];

