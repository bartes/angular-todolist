function TodosListController($resource, $location, $invalid) {
  var scope = this;

  this.loading = false;
  this.resource = $resource('/todos/paginate.json', {}, {
    get: {method: 'GET', isArray: false, verifyCache: true}
  });

  this.location = $location;

  this.pages = [5, 10, 20, 50];
  this.estimates = [0, 1, 2, 3, 5, 8, 13, 21, 34];
  this.data = {};
  this.todos = [];

  var paramsFromLocationHash = this.location.hashSearch;
  this.paginationParams = {
    orderBy: paramsFromLocationHash.orderBy || 'created_at',
    orderDirection: paramsFromLocationHash.orderDirection || 'asc',
    perPage: angular.formatter.number.parse(paramsFromLocationHash.perPage || 10),
    currentPage: paramsFromLocationHash.currentPage || 1,
    numPages: 0
  };

  this.$watch('paginationParams.perPage', function(newValue, oldValue) {
    if (newValue === oldValue) { return; }

    scope.paginationParams.currentPage = 1;
    scope.load();
  });

  this.load();
}
TodosListController.$inject = ['$resource', '$location'];

TodosListController.prototype = {
  setOrderBy: function(name) {
    if (this.paginationParams.orderBy === name) {
      this._swapOrderDirection();
    } else {
      this._setOrderDirection('asc');
      this.paginationParams.orderBy = name;
    }

    this.load();
  },

  _setOrderDirection: function(orderDirection) {
    this.paginationParams.orderDirection = orderDirection;
  },

  _swapOrderDirection: function() {
    var orderDirection = this.paginationParams.orderDirection === 'asc' ? 'desc' : 'asc';
    this._setOrderDirection(orderDirection);
  },

  hasPrevPage: function() {
    return this.paginationParams.currentPage > 1;
  },

  hasNextPage: function() {
    return this.paginationParams.currentPage < this.paginationParams.numPages;
  },

  prevPage: function() {
    this.setCurrentPage(this.paginationParams.currentPage - 1);
  },

  nextPage: function() {
    this.setCurrentPage(this.paginationParams.currentPage + 1);
  },

  setCurrentPage: function(page) {
    if (page >= 1 && page <= this.paginationParams.numPages) {
      this.paginationParams.currentPage = page;
      this.load();
    }
  },

  load: function() {
    var scope = this;

    this.location.update({hashSearch: this.paginationParams});

    this.loading = true;
    this.data = this.resource.get(this.paginationParams, function(data) {
      scope.todos = data.records;
      scope.paginationParams = data.paginationParams;

      scope.loading = false;
    });
  },

  save: function() {
    var scope = this;

    this.loading = true;
    this.data.$save(function(data) {
      scope.loading = false;
    });
  }
}
