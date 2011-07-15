# the paths are relative to the current directory, but you can use absolute paths too
# this is different from the JsTestDriver which does not allow you to use absolute paths in the config file

# use Jasmine as test syntax
enable_jasmine

# files to be included
# you can use Ruby globbing syntax (spec/js/**/*_spec.js), which will be automatically expanded
includes 'vendor/assets/javascripts/angular/angular.js'
includes 'vendor/assets/javascripts/underscore.js'

includes 'app/assets/javascripts/**/*.js'

includes 'spec/javascripts/unit/spec_helper.js'
includes 'spec/javascripts/unit/**/*.js'

# files to be excluded, useful with globbing
excludes 'vendor/assets/javascripts/angular/angular-ie-compat.js', 'vendor/assets/javascripts/angular/angular.min.js'

# the host to which the test runner will connect, by default 'localhost'
host 'localhost'

# the port to which test runner will connect, and on which the test server will start, by default 4224
port 4224

# you can specify the default browsers which will be captured
browser 'firefox'
