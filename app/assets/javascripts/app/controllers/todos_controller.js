function TodosController($xhr) {
  this.$xhr = $xhr;
  var scope = this;

  this.estimates = [0, 1, 2, 3, 5, 8];
  this.todos = [];

  this.$xhr('GET', '/todos.json', function(code, response) {
    scope.todos = response;
  });

  this.resetForm();
}
TodosController.$inject = ['$xhr'];

TodosController.prototype = {
  addTodo: function(name, estimate) {
    var scope = this;

    var data = {
      name: name,
      estimate: estimate,
      done: false
    };

    this.$xhr('POST', '/todos.json', {todo: data}, function(code, response) {
      if (code == 201) {
        scope.todos.push(response);
        scope.resetForm();
      }
    });
  },

  updateTodo: function(todo, data, callback) {
    var scope = this;

    this.$xhr('PUT', '/todos/' + todo.id + '.json', {todo: data}, function(code, response) {
      if (code == 200) {
        _(response).each(function(value, field) {
          todo[field] = value;
        });

        (callback || angular.noop)(response);
      }
    });
  },

  deleteTodo: function(todo) {
    var scope = this;

    this.$xhr('DELETE', '/todos/' + todo.id + '.json', function(code, response) {
      if (code == 200) {
        angular.Array.remove(scope.todos, todo);
      }
    });
  },

  resetForm: function() {
    this.todoName = null;
    this.todoEstimate = _(this.estimates).first();
  }
};

