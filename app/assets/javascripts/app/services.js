// Enables rails middle ware for parsing json params
angular.service('xhrDefaults', function($xhr) {
  $xhr.defaults.headers.post['Content-Type'] = 'application/json';
  $xhr.defaults.headers.put['Content-Type'] = 'application/json';
}, {$inject: ['$xhr'], $eager: true});

