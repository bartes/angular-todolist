describe('TodosController', function() {
  var scope, controller;
  var $browser;

  beforeEach(function() {
    scope = angular.scope();

    $browser = scope.$service('$browser');
    $browser.xhr.expectGET('/todos.json').respond(['todo1', 'todo2']);

    controller = scope.$new(TodosController);
  });

  it('should load todos via $xhr', function() {
    expect(controller.todos).toEqual([]);

    $browser.xhr.flush();
    expect(controller.todos).toContain('todo1');
    expect(controller.todos).toContain('todo2');
  });

  it('should have an array with allowed estimates', function() {
    expect(controller.estimates).toBeDefined();

    _([0, 1, 2, 3, 5, 8]).each(function(estimate) {
      expect(controller.estimates).toContain(estimate);
    });
  });

  describe('addTodo()', function() {
    beforeEach(function() {
      var expectedData = { todo: {
        name: 'Something evil',
        estimate: 666,
        done: false
      }};
      $browser.xhr.expectPOST('/todos.json', expectedData).respond(201, expectedData.todo);
    });

    it('should add a new todo item via $xhr', function() {
      spyOn(controller, 'resetForm');

      controller.addTodo('Something evil', 666);
      $browser.xhr.flush();

      expect(controller.resetForm).toHaveBeenCalled();
    });
  });

});
