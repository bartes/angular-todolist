function TodosListController($resource, $xhr, $window, gridBuilder, sweeper) {
  var scope = this;

  this.$xhr = $xhr;
  this.$window = $window;

  this.todos = {};
  this.secondTodos = {};
  this.Todo = $resource('/todos/paginate.json', {}, {
    paginate: { method: 'GET', isArray: false, verifyCache: true }
  });

  this.Todo.prototype.$validateName = function(value, validationDone) {
    var self = this;
    var params = { id: this.id, value: value };

    var otherTodoWithSameNameLoaded = !!_.detect(scope.todos.records, function(otherTodo) {
      return otherTodo.id != self.id && otherTodo.name == value;
    });

    if (otherTodoWithSameNameLoaded) {
      validationDone("exists in loaded collection!");
    } else {
      if (self.name != value) {
        //perform validation xhr against all records
        $xhr('POST', '/todos/validate.json', params, function(code, response) {
          var hasErrors = !!response.name;
          if (hasErrors) {
            validationDone("exists in database!");
          } else {
            validationDone(false);
          }
        });
      } else {
        //no errors
        validationDone(false);
      }
    }
  };

  this.estimates = [0, 1, 2, 3, 5, 8, 13, 21, 34];

  this.grid = gridBuilder({
    controller: this,
    property: 'todos',
    resource: this.Todo,
    perPage: 5,
    afterSave: function() {
      scope.sweeper.expireAll();
    },
    afterLoad: function() {
      scope.sweeper.expireAll();
    }
  });

  this.secondGrid = gridBuilder({
    controller: this,
    property: 'secondTodos',
    resource: this.Todo,
    perPage: 10,
    afterSave: function() {
      scope.sweeper.expireAll();
    },
    afterLoad: function() {
      scope.sweeper.expireAll();
    }
  });

  this.sweeper = sweeper;

  this.grid.load();
  this.secondGrid.load();
}
TodosListController.$inject = ['$resource', '$xhr', '$window', 'Grid', 'asyncValidatorCacheSweeper'];

TodosListController.prototype = {
}
