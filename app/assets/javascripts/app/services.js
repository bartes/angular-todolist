angular.service('Todos', function($resource) {
  return $resource('todos.json', {}, {
    query: { method: 'GET', isArray: true }
  });
});
