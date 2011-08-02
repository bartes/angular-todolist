angular.directive('grid:sortable-column', function(columnName, compiledElement) {
  return function(linkElement) {
    var scope = this;

    linkElement.addClass('sortable-column');

    if (columnName == scope.paginationParams.orderBy) {
      linkElement.addClass('sort-' + scope.paginationParams.orderDirection);
    }

    linkElement.click(function() {
      scope.setOrderBy(columnName);

      $('.sortable-column')
        .removeClass('sort-asc')
        .removeClass('sort-desc');
      linkElement.addClass('sort-' + scope.paginationParams.orderDirection);
    });
  }
});

angular.widget('@grid:cell', function(attribute, compileElement) {
  var compiler = this;

  return function(linkElement) {
    var currentScope = this;

    var spanElement = angular.element('<span />');
    linkElement.append(spanElement);

    currentScope.$watch(attribute, function(value) {
      spanElement.text(value);
    });
  }
});

angular.widget('@grid:editable-cell', function(attribute, compiledElement) {
  var compiler = this;

  return function(linkElement) {
    var currentScope = this;

    var spanElement = angular.element('<span />');
    linkElement.append(spanElement);

    var inputElement = angular.element('<input />');
    inputElement.attr('type', 'text');
    inputElement.attr('name', attribute);
    linkElement.append(inputElement);
    compiler.compile(inputElement)(currentScope.$new());
    inputElement.hide();

    spanElement.click(function() {
      inputElement.show();
      inputElement.focus();
      spanElement.hide();
    });

    inputElement.blur(function() {
      inputElement.hide();
      spanElement.show();
    });

    currentScope.$watch(attribute, function(value) {
      spanElement.text(value);
    });
  }
});

