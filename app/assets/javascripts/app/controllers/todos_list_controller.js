function TodosListController($resource, $location) {
  var scope = this;

  this.location = $location;

  var params = this.location.hashSearch;
  this.orderBy = params.order_by || 'created_at';
  this.orderDirection = params.order_direction || 'asc';
  this.perPage = params.per_page || 10;
  this.currentPage = params.page || 1;
  this.numPages = null;

  this.resource = $resource('/todos/paginate.json', {}, {
    paginate: {method: 'GET', isArray: false, verifyCache: true}
  });

  this.load();

  this.$watch('perPage', function() {
    scope.currentPage = 1;
    scope.load();
  });
}
TodosListController.$inject = ['$resource', '$location'];

TodosListController.prototype = {
  setOrderBy: function(name) {
    if (this.orderBy === name) {
      this.swapOrderDirection();
    } else {
      this.setOrderDirection('asc');
      this.orderBy = name;
    }

    this.load();
  },

  setOrderDirection: function(orderDirection) {
    this.orderDirection = orderDirection;
  },

  swapOrderDirection: function() {
    var orderDirection = this.orderDirection === 'asc' ? 'desc' : 'asc';
    this.setOrderDirection(orderDirection);
  },

  prevPage: function() {
    this.setCurrentPage(this.currentPage - 1);
  },

  nextPage: function() {
    this.setCurrentPage(this.currentPage + 1);
  },

  setCurrentPage: function(page) {
    if (page >= 1 && page <= this.numPages) {
      this.currentPage = page;
      this.load();
    }
  },

  load: function() {
    var scope = this;

    var params = {
      order_by: scope.orderBy,
      order_direction: scope.orderDirection,
      per_page: scope.perPage,
      page: scope.currentPage
    };

    this.location.update({hashSearch: params});

    this.resource.paginate(params, function(data) {
      scope.todos = data.records;
      scope.currentPage = data.currentPage;
      scope.numPages = data.numPages;
    });
  }
}
