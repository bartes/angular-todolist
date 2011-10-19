function TodosController($xhr, $log, asyncValidatorCacheSweeper) {
  var scope = this;

  this.$xhr = $xhr;
  this.$log = $log;
  this.asyncValidatorCacheSweeper = asyncValidatorCacheSweeper;

  this.estimates = [1, 2, 3, 5, 8];
  this.todos = [];

  this.$xhr('GET', '/todos.json', function(code, response) {
    scope.todos = response;
  });

  this.resetForm();
}
TodosController.$inject = ['$xhr', '$log', 'asyncValidatorCacheSweeper'];

TodosController.prototype = {
  addTodo: function() {
    var scope = this;

    var data = {
      name: scope.newTodoName,
      estimate: scope.newTodoEstimate,
      done: false
    };

    this.$xhr('POST', '/todos.json', {todo: data}, function(code, response) {
      if (code == 201) {
        scope.todos.push(response);
        scope.resetForm();

        scope.asyncValidatorCacheSweeper.expireAll();
      }
    });
  },

  updateTodo: function(todo, data, callback) {
    var scope = this;

    this.$xhr('PUT', '/todos/' + todo.id + '.json', {todo: data}, function(code, response) {
      if (code == 200) {
        // update todo's fields
        _(response).each(function(value, field) {
          todo[field] = value;
        });

        scope.asyncValidatorCacheSweeper.expireAll();
        (callback || angular.noop)(response);
      }
    });
  },

  deleteTodo: function(todo) {
    var scope = this;

    this.$xhr('DELETE', '/todos/' + todo.id + '.json', function(code, response) {
      if (code == 200) {
        angular.Array.remove(scope.todos, todo);

        scope.asyncValidatorCacheSweeper.expireAll();
      }
    });
  },

  resetForm: function() {
    this.newTodoName = null;
    this.newTodoEstimate = _(this.estimates).first();
  }
};

