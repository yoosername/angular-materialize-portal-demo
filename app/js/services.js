'use strict';

var portalServices = angular.module('portalServices', []);

// Portal Backend API
portalServices.factory('PAPI', function($http) {
  return {
    jira : {
      account : function(){
        return $http.get('/api/jira/account');
      },
      license : function(payload){
        return $http.put('/api/jira/license', payload);
      },
      project : {
        list : function(){
          return $http.get('/api/jira/project');
        },
        create : function(payload){
          return $http.post('/api/jira/project', payload);
        },
        read : function(id){
          return $http.get('/api/jira/project/' + id);
        },
        update : function(id, payload){
          return $http.put('/api/jira/project/' + id, payload);
        },
        delete : function(){
          return $http.delete('/api/jira/project/' + id);
        }
      }
    },
    confluence : {
      account : function(options){
        return $http.get('/api/confluence/account', options);
      },
      license : function(options){
        return $http.put('/api/confluence/license', options);
      },
      project : {
        list : function(){
          return $http.get('/api/confluence/project');
        },
        create : function(payload){
          return $http.post('/api/confluence/project', payload);
        },
        read : function(id){
          return $http.get('/api/confluence/project/' + id);
        },
        update : function(id, payload){
          return $http.put('/api/confluence/project/' + id, payload);
        },
        delete : function(){
          return $http.delete('/api/confluence/project/' + id);
        }
      }
    },
    bitbucket : {
      account : function(options){
        return $http.get('/api/bitbucket/account', options);
      },
      license : function(options){
        return $http.put('/api/bitbucket/license', options);
      },
      project : {
        list : function(){
          return $http.get('/api/bitbucket/project');
        },
        create : function(payload){
          return $http.post('/api/bitbucket/project', payload);
        },
        read : function(id){
          return $http.get('/api/bitbucket/project/' + id);
        },
        update : function(id, payload){
          return $http.put('/api/bitbucket/project/' + id, payload);
        },
        delete : function(){
          return $http.delete('/api/bitbucket/project/' + id);
        }
      }
    }
  }
});
