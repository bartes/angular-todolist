describe('TodosController', function() {
  var scope, controller;
  var $browser;

  beforeEach(function() {
    scope = angular.scope();

    $browser = scope.$service('$browser');
    $browser.xhr.expectGET('/todos.json').respond([]);

    controller = scope.$new(TodosController);
  });

  it('should have an array with allowed estimates', function() {
    expect(controller.estimates).toBeDefined();

    _([0, 1, 2, 3, 5, 8]).each(function(estimate) {
      expect(controller.estimates).toContain(estimate);
    });
  });

});
