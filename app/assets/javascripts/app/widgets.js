angular.directive('grid:sortable-column', function(columnName, compiledElement) {
  return function(linkElement) {
    var scope = this;

    linkElement.addClass('sortable-column');

    if (columnName == scope.grid.orderBy) {
      linkElement.addClass('sort-' + scope.grid.orderDirection);
    }

    linkElement.click(function() {
      scope.grid.setOrderBy(columnName);

      $('.sortable-column')
        .removeClass('sort-asc')
        .removeClass('sort-desc');
      linkElement.addClass('sort-' + scope.grid.orderDirection);
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

angular.directive('grid:mark-dirty', function(expression, element) {
  return function(element) {
    var scope = this;

    scope.$watch(expression, function() {
      var isDirty = scope.$eval(expression);
      element.toggleClass('dirty', isDirty);
    });
  }
});

angular.widget('@grid:editable-cell', function(attribute, compiledElement) {
  var compiler = this;
  compiler.directives(true);
  compiler.descend(true);

  var gridProperty = compiledElement.attr('grid:property');
  var property = _.last(attribute.split('.'));
  compiledElement.attr('grid:mark-dirty', gridProperty + '.isCellDirty($index, "' + property + '")');

  // wrap the input element
  var inputElementHtml = compiledElement.html();
  compiledElement.html('<span>' + inputElementHtml + '</span>');

  // create an element for displaying cell's value
  var spanElement = angular.element('<span />');
  compiledElement.append(spanElement);

  return function(linkElement) {
    var currentScope = this;

    var inputElement = linkElement.find('span:first');
    inputElement.hide();
    var spanElement = linkElement.find('span:last');

    var showInput = function() {
      inputElement.show();
      // focus on the input element
      inputElement.find('input,select').focus();
      spanElement.hide();
    }

    var hideInput = function() {
      inputElement.hide();
      spanElement.show();
    }

    linkElement.click(function(event) {
      showInput();
      event.stopPropagation();
    });

    inputElement.keyup(function(event) {
      var escOrEnterPressed = event.keyCode === 27 || event.keyCode === 13;
      if (escOrEnterPressed) {
        hideInput();
      }
    });

    $('html').click(function() {
      hideInput();
    });

    currentScope.$watch(attribute, function(value) {
      spanElement.text(value);
    });
  }
});

