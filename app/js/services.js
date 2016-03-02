'use strict';

var portalServices = angular.module('portalServices', []);

portalServices.factory('Projects', function(Restangular) {
  return Restangular.service('projects');
});

portalServices.factory('Accounts', function(Restangular) {
  return Restangular.service('accounts');
});

portalServices.factory('JiraAccounts', function(Restangular) {
  return Restangular.service('accounts/jira');
});

portalServices.factory('Password', function(Restangular) {
  return Restangular.service('password');
});
