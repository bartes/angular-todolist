function TodosListController($resource, $location) {
  var scope = this;

  this.resource = $resource('/todos/paginate.json', {}, {
    paginate: {method: 'GET', isArray: false, verifyCache: true}
  });

  this.location = $location;

  this.todos = [];

  var paramsFromLocationHash = this.location.hashSearch;
  this.paginationParams = {
    orderBy: paramsFromLocationHash.orderBy || 'created_at',
    orderDirection: paramsFromLocationHash.orderDirection || 'asc',
    perPage: paramsFromLocationHash.perPage || 10,
    currentPage: paramsFromLocationHash.currentPage || 1,
    numPages: 0
  };

  this.load();

  this.$watch('paginationParams.perPage', function() {
    scope.paginationParams.currentPage = 1;
    scope.load();
  });
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

    this.resource.paginate(this.paginationParams, function(data) {
      scope.todos = data.records;
      scope.paginationParams = data.paginationParams;
    });
  }
}
