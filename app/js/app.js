'use strict';

/* App Module */
var portalApp = angular.module('portalApp', [
  'ui.router',
  'portalControllers',
  'ncy-angular-breadcrumb',
  'portalFilters',
  'portalServices',
  'portalDirectives'
]);

portalApp.config(function(
  $stateProvider,
  $urlRouterProvider,
  $breadcrumbProvider,
  $urlMatcherFactoryProvider
) {

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
        .state('accounts.licenses', {
          url: "/licenses/:id?nextState",
          views: {
            '': {
              templateUrl: function ($stateParams){
               return '/partials/accounts/licenses/' + $stateParams.id + '.html';
             },
              controller: 'AccountsLicensesCtrl'
            }
          },
          ncyBreadcrumb: {
            label: '{{stateParams.id | capitalise}} License'
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
          url: "/all?filter",
          views: {
            '': {
              templateUrl: "partials/projects/list.html",
              controller: function($scope, $stateParams) {
                if(typeof $stateParams.filter == "string"
                    && $stateParams.filter.length > 0
                    && $stateParams.filter != "true"
                ){
                    $scope.search($stateParams.filter);
                }
              }
            }
          },
          ncyBreadcrumb: {
            label: 'All'
          }
        })

        .state('projects.new', {
          url: "/:application/new",
          views: {
            '': {
              templateUrl: "partials/projects/new.html",
              controller: 'ProjectsNewCtrl'
            }
          },
          ncyBreadcrumb: {
            label: 'New {{stateParams.application | capitalise}}'
          }
        })

        .state('projects.edit', {
          url: "/:application/edit/:id",
          views: {
            '': {
              templateUrl: "partials/projects/edit.html",
              controller: 'ProjectsEditCtrl'
            }
          },
          ncyBreadcrumb: {
            label: 'Edit {{stateParams.id | capitalise}}'
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
