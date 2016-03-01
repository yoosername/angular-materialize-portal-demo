'use strict';

/* App Module */
var portalApp = angular.module('portalApp', [
  'ui.router',
  'portalControllers',
  'ncy-angular-breadcrumb',
  'portalFilters',
  'portalServices',
  'portalDirectives',
  'restangular'
]);

portalApp.config(function(
  $stateProvider,
  $urlRouterProvider,
  $breadcrumbProvider,
  RestangularProvider,
  $urlMatcherFactoryProvider
) {

    RestangularProvider.setBaseUrl('/api');

    $breadcrumbProvider.setOptions({
      prefixStateName: 'dashboard'
    });

    $urlRouterProvider.otherwise('/404');

    $urlMatcherFactoryProvider.strictMode(false);

    $stateProvider
        // MAIN ENTRY ROUTE
        .state('dashboard', {
          url: "/dashboard",
          templateUrl: "partials/dashboard.html",
          controller: 'DashboardCtrl',
          ncyBreadcrumb: {
            label: 'Dashboard'
          }
        })

        // ACCOUNTS ROUTES
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
              templateUrl: "partials/accounts/wizard.html"
            }
          },
          ncyBreadcrumb: {
            label: '{{stateParams.id | capitalise}}',
            parent: 'accounts'
          },
          redirectTo: 'accounts.wizard.license'
        })
        .state('accounts.wizard.license', {
          url: '/license',
          templateUrl: 'partials/accounts/license.html',
          ncyBreadcrumb: {
            skip: true
          }
        })
        .state('accounts.wizard.complete', {
          url: '/complete',
          templateUrl: 'partials/accounts/complete.html',
          ncyBreadcrumb: {
            skip: true
          }
        })

        // PROJECTS ROUTES
        .state('projects', {
          url: "/projects",
          views: {
            '': {
              templateUrl: "partials/projects/projects.html",
              controller: 'ProjectsCtrl'
            }
          },
          ncyBreadcrumb: {
            label: 'Projects'
          },
          redirectTo: 'projects.list'
        })

        .state('projects.list', {
          url: "/all",
          views: {
            '': {
              templateUrl: "partials/projects/list.html",
            }
          },
          ncyBreadcrumb: {
            label: 'My Projects'
          }
        })

        .state('projects.new', {
          url: "/new",
          views: {
            '': {
              templateUrl: "partials/projects/new.html",
              controller: 'ProjectsNewCtrl'
            }
          },
          ncyBreadcrumb: {
            label: 'New'
          }
        })

        .state('projects.edit', {
          url: "/edit/:id",
          views: {
            '': {
              templateUrl: "partials/projects/edit.html",
              controller: 'ProjectsEditCtrl'
            }
          },
          ncyBreadcrumb: {
            label: '{{stateParams.id | capitalise}}'
          }
        })

        // CATCH ALL ROUTE
        .state('404', {
          url: '/404',
          templateUrl: "partials/404.html",
          ncyBreadcrumb: {
            label: '404'
          }
        })

  });
