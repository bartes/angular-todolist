function TodosController() {
  this.estimates = [0, 1, 2, 3, 5, 8];

  this.todos = [{
    name: "Learn angular",
    estimate: 8,
    done: true
  }, {
    name: "Install java",
    estimate: 2,
    done: false
  }, {
    name: 'Uninstall ruby',
    estimate: 3,
    done: false
  }];
}

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

