describe('TodosController', function() {
  var scope, controller;

  beforeEach(function() {
    scope = angular.scope();
    controller = scope.$new(TodosController);
  });

  it('has array with allowed estimates', function() {
    expect(controller.estimates).toBeDefined();

    _([0, 1, 2, 3, 5, 8]).each(function(estimate) {
      expect(controller.estimates).toContain(estimate);
    });
  });

  describe("#addTodo", function() {
    it('add a new item to todos list', function() {
      spyOn(controller.todos, 'push');
      controller.addTodo('Sample todo', 8);

      expect(controller.todos.push).toHaveBeenCalledWith({
        name: 'Sample todo',
        estimate: 8,
        done: false
      });
    });

    it('should not add a new item if name is empty', function() {
      spyOn(controller.todos, 'push');
      controller.addTodo('', 3);

      expect(controller.todos.push).not.toHaveBeenCalled();
    });
  });

});
