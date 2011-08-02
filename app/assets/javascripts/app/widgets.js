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

    // wrap the input element
    var inputElementHtml = linkElement.html();
    linkElement.html('<span>' + inputElementHtml + '</span>');
    var inputElement = linkElement.find('span:first');
    inputElement.hide();
    // compile the input element
    compiler.compile(inputElement)(currentScope.$new());

    // create an element for displaying cell's value
    var spanElement = angular.element('<span />');
    linkElement.append(spanElement);

    spanElement.click(function() {
      inputElement.show();
      inputElement.find('input,select').focus();
      spanElement.hide();
    });

    inputElement.find('input,select').blur(function() {
      inputElement.hide();
      spanElement.show();
    });

    currentScope.$watch(attribute, function(value) {
      spanElement.text(value);
    });
  }
});

