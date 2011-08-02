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
