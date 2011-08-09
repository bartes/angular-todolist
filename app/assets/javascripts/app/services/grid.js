todos.Grid = function($log, opts) {
  this.$log = $log;

  var self = this;

  this.controller = opts.controller;
  this.property = opts.property;
  this.resource = opts.resource;

  this.masterData = [];

  this.wrapParams = opts.wrapParams;
  this.orderBy = opts.orderBy || 'created_at'
  this.orderDirection = opts.orderDirection || 'asc';
  this.perPage = opts.perPage || 10;
  this.currentPage = 1;
  this.numPages = 0;
  this.totalCount = 0;
}
todos.Grid.$inject = ['$log'];

todos.Grid.prototype = {
  setOrderBy: function(name) {
    if (this.orderBy === name) {
      this._swapOrderDirection();
    } else {
      this._setOrderDirection('asc');
      this.orderBy = name;
    }

    this.$log.info('[grid] setOrderBy, orderBy=', this.orderBy, ', orderDirection=', this.orderDirection);

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
      this.$log.info('[grid] setCurrnetPage=', this.currentPage);
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
    var self = this;

    var params = {
      orderBy: this.orderBy,
      orderDirection: this.orderDirection,
      perPage: this.perPage,
      currentPage: this.currentPage
    }

    this.$log.info('[grid] loading data, params=', params);

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

