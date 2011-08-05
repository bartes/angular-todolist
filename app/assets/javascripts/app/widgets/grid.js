angular.widget('@grid:container', function(gridProperty, element) {
  var compiler = this;
  compiler.descend(true);
  compiler.directives(true);

  // create a new scope for the grid container
  element.attr('ng:controller', 'angular.noop');

  return function(linkElement) {
    var parentScope = this;
    parentScope.$grid = parentScope[gridProperty];

    linkElement.addClass('grid-container');
  }
});

angular.widget('@grid:pagination', function(attribute, compiledElement) {
  var compiler = this;
  compiler.descend(true);
  compiler.directives(true);

  // create pagination
  compiledElement.append(angular.element('<span />').attr('ng:hide', '$grid.hasPrevPage()').text('Prev page'));
  compiledElement.append(angular.element('<a />').attr('ng:show', '$grid.hasPrevPage()').attr('ng:click', '$grid.prevPage()').text('Prev page'))
  compiledElement.append(angular.element('<span />').text('Page {{$grid.currentPage}} of {{$grid.numPages}}'));
  compiledElement.append(angular.element('<span />').attr('ng:hide', '$grid.hasNextPage()').text('Next page'));
  compiledElement.append(angular.element('<a />').attr('ng:show', '$grid.hasNextPage()').attr('ng:click', '$grid.nextPage()').text('Next page'))

  // create per page select box
  var perPageContainer = angular.element('<span />');
  var perPageSelectLabel = angular.element('<label />');
  perPageSelectLabel
    .attr('for', 'perPage-{{$grid.$id}}')
    .text('Per page');
  perPageContainer.append(perPageSelectLabel);
  var perPageSelect = angular.element('<select />');
  perPageSelect
    .attr('name', '$grid.perPage')
    .attr('id', 'perPage-{{$grid.$id}}')
    .attr('ng:options', 'perPage for perPage in pages')
    .attr('ng:format', 'number');
  perPageContainer.append(perPageSelect);
  compiledElement.append(perPageContainer);

  // grid reload and spinner
  compiledElement.append(angular.element('<a />').attr('ng:click', '$grid.load()').text('Reload'));
  compiledElement.append(angular.element('img').attr('src', '/assets/spinner.gif').attr('ng:show', '$grid.loading'));

  compiledElement.addClass('pagination');

  return function(linkElement) {
    var currentScope = this;
    currentScope.$watch('$grid.perPage', function() {
      currentScope.$grid.currentPage = 1;
      currentScope.$grid.load();
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

  var gridProperty = compiledElement.parents('.grid-container').data('grid-property');
  var property = _.last(attribute.split('.'));
  compiledElement.attr('grid:mark-dirty',  property);

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