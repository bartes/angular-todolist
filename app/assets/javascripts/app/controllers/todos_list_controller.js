function TodosListController($resource, $location) {
  var scope = this;

  this.location = $location;

  var params = this.location.hashSearch;
  this.todos = {
    orderBy: params.order_by || 'created_at',
    orderDirection: params.order_direction || 'asc',
    perPage: params.per_page || 10,
    currentPage: params.page || 1,
    numPages: null
  };

  this.resource = $resource('/todos/paginate.json', {}, {
    paginate: {method: 'GET', isArray: false, verifyCache: true}
  });

  this.load();

  this.$watch('todos.perPage', function() {
    scope.currentPage = 1;
    scope.load();
  });
}
TodosListController.$inject = ['$resource', '$location'];

TodosListController.prototype = {
  setOrderBy: function(name) {
    if (this.todos.orderBy === name) {
      this._swapOrderDirection();
    } else {
      this._setOrderDirection('asc');
      this.todos.orderBy = name;
    }

    this.load();
  },

  _setOrderDirection: function(orderDirection) {
    this.todos.orderDirection = orderDirection;
  },

  _swapOrderDirection: function() {
    var orderDirection = this.todos.orderDirection === 'asc' ? 'desc' : 'asc';
    this._setOrderDirection(orderDirection);
  },

  prevPage: function() {
    this._setCurrentPage(this.currentPage - 1);
  },

  nextPage: function() {
    this._setCurrentPage(this.currentPage + 1);
  },

  _setCurrentPage: function(page) {
    if (page >= 1 && page <= this.numPages) {
      this.todos.currentPage = page;
      this.load();
    }
  },

  load: function() {
    var scope = this;

    var params = {
      order_by: scope.todos.orderBy,
      order_direction: scope.todos.orderDirection,
      per_page: scope.todos.perPage,
      page: scope.todos.currentPage
    };

    this.location.update({hashSearch: params});

    this.resource.paginate(params, function(data) {
      scope.todos = data;
    });
  }
}
