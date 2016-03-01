'use strict';

/* Filters
angular.module('phonecatFilters', []).filter('checkmark', function() {
  return function(input) {
    return input ? '\u2713' : '\u2718';
  };
});
*/

var filters = angular.module('portalFilters', []);

filters.filter('capitalise', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});

filters.filter('jira', function(obj){

    if(obj.type === "jira")
    {
        return true; // this will be listed in the results
    }

    return false; // otherwise it won't be within the results

});
