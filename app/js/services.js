'use strict';

var portalServices = angular.module('portalServices', []);

portalServices.factory('Jira',function(){
    //return $resource('phones/:phoneId.json', {}, {
    //  query: {method:'GET', params:{phoneId:'phones'}, isArray:true}
    //});
    return {
      createUserAccount : function(){
        console.log("POST user account")
      },
      getUserAccount : function(){
        console.log("GET user account")
      }
    }
});
