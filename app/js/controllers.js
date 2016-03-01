'use strict';

/* Controllers */
var portalControllers = angular.module('portalControllers', []);


portalControllers.controller('DashboardCtrl', [
  '$rootScope', '$scope', '$state', '$stateParams', function($rootScope,$scope,$state,$stateParams) {

  // This is used to determine which step we are in within sections with child steps
  $scope.stateParams = $stateParams;

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
}]);



portalControllers.controller('AccountsCtrl', [
  '$rootScope','$scope', '$state', '$stateParams', function($rootScope,$scope,$state,$stateParams) {

  $scope.isEditMode = function(){
    if($state.params.id){
      return true;
    }
    return false;
  };

  $scope.completeForm = function(){
    console.log("Accounts form completed, model = ");
    $state.go("accounts");
  }

  $scope.agreeLicense = function(){
    console.log("License agreed, model = ");
    $state.go("accounts.wizard.complete");
  }

}]);


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
      console.log("CREATE Project of type: " + type);
      $scope.type = type;
      $state.go("projects.new");
    }

    // Handle deleting a project
    $scope.deleteProject = function(project){
      console.log("DELETE Project with id: " + project.id);
      // TODO: Add some confirmation box
      Projects.one(project.id).remove().then(function(projects) {
        $scope.projects = projects;
      });
    }
});


portalControllers.controller('ProjectsNewCtrl', function($scope,$state,Projects) {

  $scope.project = {};

  $scope.createProject = function(){

    // Put the new object on the server
    Projects.post($scope.project).then(function(project){

      // add type from scope
      project.type = $scope.type;
      $scope.type = "";

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
