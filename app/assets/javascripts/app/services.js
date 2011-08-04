// Enables rails middle ware for parsing json params
angular.service('xhrDefaults', function($xhr) {
  $xhr.defaults.headers.post['Content-Type'] = 'application/json';
  $xhr.defaults.headers.put['Content-Type'] = 'application/json';
}, {$inject: ['$xhr'], $eager: true});

todos.Grid = function($window, opts) {
  this.$window = $window;
  var self = this;

  this.controller = opts.controller;
  this.property = opts.property;
  this.resource = opts.resource;

  this.masterData = [];

  this.orderBy = opts.orderBy || 'created_at'
  this.orderDirection = opts.orderDirection || 'asc';
  this.perPage = opts.perPage || 10;
  this.currentPage = 1;
  this.numPages = 0;
  this.totalCount = 0;
}
todos.Grid.$inject = ['$window'];

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

  dirty: function() {
    return !angular.Object.equals(this.controller[this.property], this.masterData);
  },

  isCellDirty: function(rowIndex, property) {
    return this.masterData.records[rowIndex][property] !== this.controller[this.property].records[rowIndex][property];
  },

  load: function() {
    if (this.dirty() && !this.$window.confirm('Abandon changes?')) { return false; }

    var self = this;

    var params = {
      orderBy: this.orderBy,
      orderDirection: this.orderDirection,
      perPage: this.perPage,
      currentPage: this.currentPage
    }

    this.loading = true;
    this.controller[this.property] = this.resource.get(params, function(data) {
      self.masterData = angular.copy(data);

      self.totalCount = data.totalCount;
      self.numPages = data.numPages;

      self.loading = false;
    });
  },

  save: function() {
    if (!this.dirty()) { return false; }

    var self = this;

    this.loading = true;
    this.controller[this.property].$save(function(data) {
      self.controller[self.property].records = data.records;
      self.masterData = angular.copy(data);

      self.loading = false;
    });
  },

  cancel: function() {
    if (!this.dirty()) { return false; }
    this.controller[this.property] = angular.copy(this.masterData);
  }
}

angular.service('Grid', function() {
  var scope = this;

  return function(opts) {
    return scope.$new(todos.Grid, opts);
  }
});

