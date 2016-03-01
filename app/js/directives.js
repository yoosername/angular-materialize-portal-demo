'use strict';

/* Directives */
var portalDirectives = angular.module('portalDirectives', []);

portalDirectives.directive('autofocus', ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    link : function($scope, $element) {
      $timeout(function() {
        $element[0].focus();
      });
    }
  }
}]);
