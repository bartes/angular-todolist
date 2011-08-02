/* http://docs.angularjs.org/#!angular.widget */
angular.directive('my:sortable-column', function(columnName, compiledElement) {
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
