function TodosController(Todos_) {
  this.estimates = [0, 1, 2, 3, 5, 8];
  this.todos = Todos_.query();
}
TodosController.$inject = ['Todos'];

TodosController.prototype = {
  addTodo: function(name, estimate) {
    if (name === "") { return false; }

    this.todos.push({
      name: name,
      estimate: estimate,
      done: false
    });

    this.todoName = null;
    this.todoEstimate = null;
  }
};

