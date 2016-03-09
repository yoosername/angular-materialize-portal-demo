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

filters.filter('search', function($filter){
   return function(items, text){
      if (!text || text.length === 0)
        return items;

      // split search text on space
      var searchTerms = text.split(' ');

      // search for single terms.
      // this reduces the item list step by step
      searchTerms.forEach(function(term) {
        if (term && term.length)
          items = $filter('filter')(items, term);
      });

      return items
   };
});
