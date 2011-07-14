#!/bin/bash

BASE_DIR=`dirname $0`

java -jar "$BASE_DIR/../spec/javascripts/lib/jstestdriver/JsTestDriver.jar" \
     --config "$BASE_DIR/../config.angularjs/jsTestDriver.conf" \
     --basePath "$BASE_DIR/.." \
     --tests all
