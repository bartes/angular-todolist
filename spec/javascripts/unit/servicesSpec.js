/* jasmine specs for services go here */

describe('todos.Grid', function() {
  var scope;
  var grid;

  beforeEach(function() {
    scope = angular.scope();

    var opts = {};
    grid = scope.$new(todos.Grid, opts);
    grid.numPages = 10;
  });

  it('should be created', function() {
    expect(grid).toBeDefined();
  });

  describe('.setOrderBy', function() {
    beforeEach(function() {
      spyOn(grid, 'load');
    });

    describe('when the same column was selected', function() {
      it('should switch the order direction and reload the grid', function() {
        var oldOrderBy = grid.orderBy;
        var oldOrderDirection = grid.orderDirection;
        grid.setOrderBy(oldOrderBy);

        expect(grid.orderBy).toBe(oldOrderBy);
        expect(grid.orderDirection).not.toBe(oldOrderDirection);
        expect(grid.orderDirection).toBe('desc');
        expect(grid.load).toHaveBeenCalled();
      });
    });

    describe('when the a new column was selected', function() {
      it('should set the new column, set order to asc and reload the grid', function() {
        var oldOrderBy = grid.orderBy;
        grid.setOrderBy('a new column');

        expect(grid.orderBy).not.toBe(oldOrderBy);
        expect(grid.orderBy).toBe('a new column');
        expect(grid.orderDirection).toBe('asc');
        expect(grid.load).toHaveBeenCalled();
      });
    });
  });

  describe('.hasPrevPage', function() {
    describe('when currentPage is the first page', function() {
      it('show return false', function() {
        grid.currentPage = 1;
        expect(grid.hasPrevPage()).toBeFalsy();
      });
    });

    describe('when currentPage is the last page', function() {
      it('should return true', function() {
        grid.currentPage = grid.numPages;
        expect(grid.hasPrevPage()).toBeTruthy();
      });
    });
  });

  describe('.hasNextPage', function() {
    describe('when currentPage is the last page', function() {
      it('should return false', function() {
        grid.currentPage = grid.numPages;
        expect(grid.hasNextPage()).toBeFalsy();
      });
    });

    describe('when currentPage is the first page', function() {
      it('should return true', function() {
        grid.currentPage = 1;
        expect(grid.hasNextPage()).toBeTruthy();
      });
    });
  });

  describe('.setCurrentPage', function() {
    describe('when page is invalid', function() {
      it('should do nothing', function() {
        spyOn(grid, 'load');

        var invalidPage = grid.numPages + 1;
        grid.setCurrentPage(invalidPage);
        expect(grid.load).not.toHaveBeenCalled();
      });
    });

    describe('when page is valid', function() {
      it('should set the current page and reload the grid', function() {
        spyOn(grid, 'load');

        var validPage = grid.numPages - 1;
        grid.setCurrentPage(validPage);
        expect(grid.load).toHaveBeenCalled();
      });
    });
  });

  describe('.load', function() {
    it('should call #get on the resource with valid params', function() {
      grid.resource = { get: function(){} };
      spyOn(grid.resource, 'get').andCallThrough();

      grid.load();
      expect(grid.resource.get).toHaveBeenCalled();
    });
  });

});

