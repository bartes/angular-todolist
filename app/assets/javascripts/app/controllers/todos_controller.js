function TodosController($xhr, asyncValidatorCacheSweeper) {
  var scope = this;

  this.$xhr = $xhr;
  this.asyncValidatorCacheSweeper = asyncValidatorCacheSweeper;

  this.estimates = [0, 1, 2, 3, 5, 8];
  this.todos = [];

  this.$xhr('GET', '/todos.json', function(code, response) {
    scope.todos = response;
  });

  this.resetForm();
}
TodosController.$inject = ['$xhr', 'asyncValidatorCacheSweeper'];

TodosController.prototype = {
  validateName: function(value, validationDone) {
    var self = this;

    this.saveDisabled = true;
    this.$xhr('POST', '/todos/validate.json', { id: null, name: value }, function(code, response) {
      var errors = response;
      validationDone(!!errors.name);

      this.saveDisabled = false;
    });
  },

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

        scope.asyncValidatorCacheSweeper.expireFor('todoName');
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

        scope.asyncValidatorCacheSweeper.expireFor('todoName-' + todo.id);
        (callback || angular.noop)(response);
      }
    });
  },

  deleteTodo: function(todo) {
    var scope = this;

    this.$xhr('DELETE', '/todos/' + todo.id + '.json', function(code, response) {
      if (code == 200) {
        angular.Array.remove(scope.todos, todo);
        scope.asyncValidatorCacheSweeper.expireFor('todoName');
      }
    });
  },

  resetForm: function() {
    this.todoName = null;
    this.todoEstimate = _(this.estimates).first();
  }
};

