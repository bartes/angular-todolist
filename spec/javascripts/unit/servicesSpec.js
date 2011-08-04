/* jasmine specs for services go here */

describe(todos.Grid, function() {
  var scope;
  var grid;

  beforeEach(function() {
    scope = angular.scope();

    var opts = {};
    grid = scope.$new(todos.Grid, opts);
  });

  it('should be created', function() {
    expect(grid).toBeDefined();
  });

});

