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
    if (this.todoName === "") { return false; }

    this.todo.name = this.todoName;
    this.todo.estimate = this.todoEstimate;

    this.disableEditor();
  }
};

