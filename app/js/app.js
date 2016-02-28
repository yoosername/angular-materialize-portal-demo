'use strict';

/* App Module */
var portalApp = angular.module('portalApp', [
  'ui.router',
  'portalControllers',
  'ncy-angular-breadcrumb',
  'portalFilters',
  'portalServices'
]);

portalApp.config(function($stateProvider, $urlRouterProvider, $breadcrumbProvider) {

    $breadcrumbProvider.setOptions({
      prefixStateName: 'dashboard'
    });

    $urlRouterProvider.otherwise('/404');

    $stateProvider
        .state('dashboard', {
          url: "/dashboard",
          templateUrl: "partials/dashboard.html",
          controller: 'DashboardCtrl',
          ncyBreadcrumb: {
            label: 'Dashboard'
          }
        })
        .state('accounts', {
          url: "/accounts",
          views: {
            '': {
              templateUrl: "partials/accounts/accounts.html",
              controller: 'AccountsCtrl'
            }
          },
          ncyBreadcrumb: {
            label: 'Accounts'
          }
        })
        .state('accounts.wizard', {
          url: "/:id",
          views: {
            '': {
              templateUrl: "partials/accounts/wizard.html",
              controller: 'AccountWizardCtrl'
            }
          },
          ncyBreadcrumb: {
            label: '{{stateParams.id | capitalise}}',
            parent: 'accounts'
          },
          redirectTo: 'accounts.wizard.stepOne'
        })
        .state('accounts.wizard.stepOne', {
          url: '/stepOne',
          templateUrl: 'partials/accounts/step-one.html',
          controller: 'AccountWizardCtrl',
          ncyBreadcrumb: {
            skip: true
          }
        })
        .state('accounts.wizard.stepTwo', {
          url: '/stepTwo',
          templateUrl: 'partials/accounts/step-two.html',
          controller: 'AccountWizardCtrl',
          ncyBreadcrumb: {
            skip: true
          }
        })
        .state('404', {
          url: '/404',
          templateUrl: "partials/404.html",
          ncyBreadcrumb: {
            label: '404'
          }
        })

  });
