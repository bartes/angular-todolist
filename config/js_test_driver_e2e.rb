# guess the local ip and use that instead of localhost
host guess_local_ip

proxy('*').to('http://localhost:3000')

# jasmine-like syntax
includes 'vendor/assets/javascripts/tests/angular/angular-scenario.js'

# jstd adapter with config
includes 'vendor/assets/javascripts/tests/angular/jstd-scenario-adapter.js'

# test files
includes 'spec/javascripts/e2e/spec_helper.js'
includes 'spec/javascripts/e2e/**/*.js'

browser 'firefox'
