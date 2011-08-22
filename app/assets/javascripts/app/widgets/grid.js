angular.widget('@grid:container', function(gridProperty, element) {
  element.addClass('grid-container');

  var compiler = this;
  compiler.descend(true);
  compiler.directives(true);
  compiler.scope(true);

  return angular.extend(function($log, $invalidWidgets, element) {
    var scope = this;
    var gridInstance = scope[gridProperty];
    scope.$grid = gridInstance;

    gridInstance._getInvalidWidgets = function() {
      var scopedInvalidWidgets = _($invalidWidgets).select(function(widget) {
        return element.find(widget).length > 0;
      });

      $log.info('$invalidWidgets for ', scope.$grid, ' = ', scopedInvalidWidgets);
      return scopedInvalidWidgets;
    }

  }, { $inject: ['$log', '$invalidWidgets'] });
});

angular.widget('@grid:pagination', function(attribute, element) {
  var compiler = this;
  compiler.descend(true);
  compiler.directives(true);

  var ngInclude = angular.element('<ng:include />').attr('src', "'/assets/app/templates/grid_pagination.html'")
  element.append(ngInclude);

  return function(element) {
    var scope = this;

    scope.$watch('$grid.perPage', function() {
      scope.$grid.currentPage = 1;
      scope.$grid.load();
    });
  };
});

angular.directive('grid:sortable-column', function(columnName, compiledElement) {
  return function(linkElement) {
    var scope = this;
    var grid = scope.$grid;

    linkElement.addClass('sortable-column');

    if (columnName == grid.orderBy) {
      linkElement.addClass('sort-' + grid.orderDirection);
    }

    linkElement.click(function() {
      grid.setOrderBy(columnName);

      $('.sortable-column')
        .removeClass('sort-asc')
        .removeClass('sort-desc');
      linkElement.addClass('sort-' + grid.orderDirection);
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
    var grid = scope.$grid;

    scope.$onEval(function() {
      var isDirty = grid.isCellDirty(scope.$index, expression);
      element.toggleClass('dirty', isDirty);
    });
  }
});

angular.widget('@grid:editable-cell', function(attribute, compiledElement) {
  var compiler = this;
  compiler.directives(true);
  compiler.descend(true);

  compiledElement.addClass('grid-editable-cell');
  var property = _.last(attribute.split('.'));
  compiledElement.attr('grid:mark-dirty',  property);

  // wrap the input element
  var inputElementHtml = compiledElement.html();
  compiledElement.html('<span>' + inputElementHtml + '</span>');

  // create an element for displaying cell's value
  var spanElement = angular.element('<span />');
  compiledElement.append(spanElement);

  return angular.extend(function($log, linkElement) {
    var currentScope = this;

    var inputElementContainer = linkElement.find('span:first');
    inputElementContainer.hide();
    var inputElement = inputElementContainer.find('input,select');
    inputElement.addClass('grid-input');
    var spanElement = linkElement.find('span:last');

    /**
     * Check if the input element has validation errors.
     */
    var isValid = function() {
      var scopedInvalidWidgets = currentScope.$grid._getInvalidWidgets();
      var hasErrors = _(scopedInvalidWidgets).detect(function(invalidElement) {
        return invalidElement.get(0) === inputElement.get(0);
      });

      return !hasErrors;
    }

    /**
     * Check if the input element is visible.
     */
    var isVisible = function() {
      return inputElementContainer.is(':visible');
    }

    var showInput = function() {
      inputElementContainer.show();
      // focus on the input element
      inputElement.focus();
      spanElement.hide();
    }

    var hideInput = function() {
      if (isVisible() && isValid()) {
        inputElementContainer.hide();
        spanElement.show();
      }
    }

    linkElement.click(function(event) {
      showInput();
      event.stopPropagation();
    });

    inputElementContainer.keyup(function(event) {
      var enterPressed = event.keyCode === 13;
      if (enterPressed) {
        hideInput();
      }

      var escPressed = event.keyCode == 27;
      if (escPressed) {
        currentScope.$grid.resetCell(currentScope.$index, property);
        currentScope.$root.$eval();

        hideInput();
      }
    });

    $('body').click(function() {
      hideInput();
    });

    currentScope.$watch(attribute, function(value) {
      spanElement.text(value);
    });
  }, { $inject: ['$log'] });
});
