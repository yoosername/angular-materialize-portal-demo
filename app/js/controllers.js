'use strict';

/* Controllers */
var portalControllers = angular.module('portalControllers', []);


portalControllers.controller('DashboardCtrl', function($rootScope,$scope,$state,$stateParams,Accounts) {

  // This is used to determine which step we are in within sections with child steps
  $scope.stateParams = $stateParams;
  $scope.accounts = {};

  // Get all the accounts the current user has and load into the scope now

  Accounts.one("jira").getList().then(function(jiraAccount){
    console.log(jiraAccount);
    $scope.accounts.jira = jiraAccount[0] || {};
  })
  Accounts.one("confluence").getList().then(function(confluenceAccount){
    console.log(confluenceAccount);
    $scope.accounts.confluence = confluenceAccount[0] || {};
  })
  Accounts.one("bitbucket").getList().then(function(bitbucketAccount){
    console.log(bitbucketAccount);
    $scope.accounts.bitbucket = bitbucketAccount[0] || {};
  })

  // If any state in app has redirect set then goto it here.
  $rootScope.$on('$stateChangeStart', function(evt, to, params) {
    if (to.redirectTo) {
      evt.preventDefault();
      $state.go(to.redirectTo, params)
    }
  });

  // If any state in app is not found then goto 404 page instead
  $rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams) {
    event.preventDefault();
    $scope.missingState = unfoundState.to;
    $state.go('404');
  });
});



portalControllers.controller('AccountsCtrl', function($scope,$state,Accounts,JiraAccounts) {

  $scope.isEditMode = function(){
    if($state.params.id){
      return true;
    }
    return false;
  };

  // Setup edit mode for type
  $scope.edit = function(id){
    var account = {
      "id": id,
      "license_agreed": false
    };

    $scope.account = account;
    $state.go("accounts.wizard",{"id":id});
  };

  $scope.agreeLicense = function(){
    $scope.account["license_agreed"] = true;
    console.log($scope.account);
    $state.go("accounts.wizard.complete",{"id":$scope.account.id});
  };

  //
  $scope.update = function(id){
    console.log("updating: "+id)
    // Put the new object on the server
    Accounts.one(id).post($scope.account).then(function(accounts){
      // update actual accounts from server
      $scope.accounts[$scope.account.id] = accounts;
      console.log("Account "+$scope.account.id+" Created: " + JSON.stringify(accounts))
      $state.go("accounts");
      Materialize.toast('Account '+$scope.account.id+' has been created', 4000);
    })
  }

  $scope.delete = function(id){
    Accounts.one(id).remove().then(function(accounts) {
      $scope.accounts = accounts;
      $state.go("accounts");
      Materialize.toast('Account '+id+' has been deleted', 4000);
    });
  };
});


portalControllers.controller('ProjectsCtrl', function($scope,$state,Projects) {

    // Get list of users projects from server
    Projects.getList().then(function(projects){
      $scope.projects = projects;
    })

    // Handle editing a project
    $scope.editProject = function(project){
      console.log("EDIT Project with id: " + project.id);
      $scope.project = project;
      $state.go("projects.edit",{id:project.id});
    }

    // Handle creating a project
    $scope.newProject = function(type){
      if($scope.accounts.jira.id){
        console.log("CREATE Project of type: " + type);
        $scope.type = type;
        $state.go("projects.new");
      }
      else{
        console.log("Cant create project of type: " + type + " : reason (no account)");
        $state.go("accounts");
        Materialize.toast('You need a '+type+' account first', 4000);
      }
    }

    // Handle deleting a project
    $scope.deleteProject = function(project){
      console.log("DELETE Project with id: " + project.id);
      // TODO: Add some confirmation box
      Projects.one(project.id).remove().then(function(projects) {
        $scope.projects = projects;
        $state.go("projects");
        Materialize.toast('Project '+project.id+' has been deleted', 4000);
      });
    }
});


portalControllers.controller('ProjectsNewCtrl', function($scope,$state,Projects) {

  $scope.project = {};

  $scope.createProject = function(){

    // add type from scope
    $scope.project.type = $scope.type;
    $scope.type = "";

    // Put the new object on the server
    Projects.post($scope.project).then(function(project){

      // Eagerly insert the object into the local collection
      $scope.projects.push(project);
      console.log("Project "+project.id+" Created: " + JSON.stringify($scope.projects))
      $state.go("projects.list");
      Materialize.toast('Project '+project.id+' has been created', 4000);
    })
  }

});


portalControllers.controller('ProjectsEditCtrl', function($scope,Projects,$stateParams,$state) {

    Projects.one($stateParams.id).get().then(function(project){
      $scope.project = project;
    });

    $scope.updateProject = function(project){

      // PUT the new object on the server
      project.put().then(function(project){

        // Insert the newly updated object into the local collection for eager refresh
        for (var i in $scope.projects) {
          if ($scope.projects[i].id == project.id) {
             $scope.projects[i] = project;
             break;
          }
        }

        console.log("Project "+project.id+" Updated: " + JSON.stringify($scope.projects))
        $state.go("projects");
        Materialize.toast('Project '+project.id+' has been updated', 4000);
      })
    }

});


portalControllers.controller('PasswordCtrl', function($scope) {

    // Configure Password reset scope here.
    $scope.password = "";

    $scope.resetPassword = function(){
      console.log("user reset password to: " + $scope.password);
      $scope.password = "";
      Materialize.toast('Password has been reset', 4000);
    }

    $scope.validPassword = function(){
      if($scope.password.length < 8){
        return false;
      }

      return true;
    }

});
