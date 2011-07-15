function TodoEditorController() {
  this.editorEnabled = false;
}

TodoEditorController.prototype = {
  enableEditor: function() {
    this.editorEnabled = true;

    this.todoName = this.todo.name;
    this.todoEstimate = this.todo.estimate;
  },

  disableEditor: function() {
    this.editorEnabled = false;
  },

  save: function() {
    var scope = this;
    var data = {name: this.todoName, estimate: this.todoEstimate};

    this.updateTodo(this.todo, data, function() {
      scope.disableEditor();
    });
  }
};

