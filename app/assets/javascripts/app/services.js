// Enables rails middle ware for parsing json params
angular.service('xhrDefaults', function($xhr) {
  $xhr.defaults.headers.post['Content-Type'] = 'application/json';
  $xhr.defaults.headers.put['Content-Type'] = 'application/json';
}, {$inject: ['$xhr'], $eager: true});

todos.Grid = function(opts) {
  var self = this;

  this.controller = opts.controller;
  this.property = opts.property;
  this.resource = opts.resource;

  this.orderBy = 'created_at'
  this.orderDirection = 'asc';
  this.perPage = 10;
  this.currentPage = 1;
  this.numPages = 0;
  this.totalCount = 0;
}

todos.Grid.prototype = {
  setOrderBy: function(name) {
    if (this.orderBy === name) {
      this._swapOrderDirection();
    } else {
      this._setOrderDirection('asc');
      this.orderBy = name;
    }

    this.load();
  },

  _setOrderDirection: function(orderDirection) {
    this.orderDirection = orderDirection;
  },

  _swapOrderDirection: function() {
    var orderDirection = this.orderDirection === 'asc' ? 'desc' : 'asc';
    this._setOrderDirection(orderDirection);
  },

  hasPrevPage: function() {
    return this.currentPage > 1;
  },

  hasNextPage: function() {
    return this.currentPage < this.numPages;
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
    var self = this;

    var params = {
      orderBy: this.orderBy,
      orderDirection: this.orderDirection,
      perPage: this.perPage,
      currentPage: this.currentPage
    }

    this.loading = true;
    this.controller[this.property] = this.resource.get(params, function(data) {
      self.totalCount = data.totalCount;
      self.numPages = data.numPages;

      self.loading = false;
    });
  },

  save: function() {
    var self = this;

    this.loading = true;
    this.controller[this.property].$save(function(data) {
      self.controller[self.property].records = data.records;

      self.loading = false;
    });
  }
}

angular.service('Grid', function() {
  var scope = this;

  return function(opts) {
    return new todos.Grid(opts);
  }
});

