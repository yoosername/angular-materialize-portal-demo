'use strict';

/* Controllers */
var portalControllers = angular.module('portalControllers', []);


portalControllers.controller('DashboardCtrl', function($rootScope,$scope,$state,$stateParams,PAPI) {

  // This is used to determine which step we are in within sections with child steps
  $scope.stateParams = $stateParams;

  // Start with empty map
  $scope.accounts = {jira:{},confluence:{},bitbucket:{},all : function(){
    var a = $scope.accounts
    return Object.assign({}, a.jira, a.confluence, a.bitbucket)
  }};

  // Load status of account for each app into scope
  PAPI.jira.account({}).then(function(response){
    $scope.accounts.jira = response.data;
  });

  PAPI.confluence.account({}).then(function(response){
    $scope.accounts.confluence = response.data;
  });

  PAPI.bitbucket.account({}).then(function(response){
    $scope.accounts.bitbucket = response.data;
  });

  $scope.projects = {jira:{},confluence:{},bitbucket:{},all : function(){
    var p = $scope.projects
    return Object.assign({}, p.jira, p.confluence, p.bitbucket)
  }};

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



portalControllers.controller('AccountsCtrl', function($scope,$state,PAPI) {

  // Show a given license
  $scope.showLicense = function(id){
    console.log("showing license for " + id);
    $state.go("accounts.licenses",{"id":id});
  }

  // Deactivate account
  $scope.deactivate = function(id){
    console.log("deactivating " + id);
    PAPI[id].license({signed:false}).then(function(response){
      $scope.accounts[id] = response.data;
      console.log(id + " account: " + response.data.active);
      $state.go("accounts");
    });
  }

});

portalControllers.controller('AccountsLicensesCtrl', function($scope,$state,PAPI) {

  // User has clicked agree in the modal
  $scope.agreeLicense = function(id, agreed){
    console.log("user "+ ( (agreed) ? "did" : "did not" ) +" agree to license for " + id);
    PAPI[id].license({signed:true}).then(function(response){
      $scope.accounts[id] = response.data;
      console.log(id + " account: " + response.data.active);
      $("#license_modal").closeModal();
      $state.go("accounts");
    });
  }

  // Show the license in a modal as soon as were ready
  $("#license_modal").openModal({dismissible: true});

});


portalControllers.controller('ProjectsCtrl', function($scope,$state,PAPI) {

  // Load status of projects for each app into scope
  PAPI.jira.project.list().then(function(response){
    $scope.projects.jira = response.data;
  });

  PAPI.confluence.project.list().then(function(response){
    $scope.projects.confluence = response.data;
  });

  PAPI.bitbucket.project.list().then(function(response){
    $scope.projects.bitbucket = response.data;
  });

  // Handle editing a project
  $scope.editProject = function(project){
    console.log("EDIT Project with id: " + project.id);
    $scope.project = project;
    $state.go("projects.edit",{id:project.id});
  }

  // Handle creating a project
  $scope.newProject = function(type){
    console.log($scope.accounts,type,$scope.accounts[type]);
    if($scope.accounts[type].active){
      console.log("CREATE Project of type: " + type);
      $scope.type = type;
      $state.go("projects.new");
    }
    else{
      console.log("Cant create project of type: " + type + " : reason (no account)");
      Materialize.toast('You need a '+type+' account first', 4000);
    }
  }

  // Handle deleting a project
  $scope.deleteProject = function(project){
    console.log("DELETE Project with id: " + project.id);
    // TODO: Add some confirmation box
    PAPI[project.type].project.delete(project.id).then(function(response){
      $scope.projects[type] = response.data;
      $state.go("projects");
      Materialize.toast('Project '+project.$loki+' has been deleted', 4000);
    });

  }
});


portalControllers.controller('ProjectsNewCtrl', function($scope,$state,PAPI) {

  $scope.project = {};

  $scope.createProject = function(type){

    PAPI[type].project.create($scope.project).then(function(response){
      $state.go("projects");
      Materialize.toast('Project '+project.id+' has been created', 4000);
    });

  }

});


portalControllers.controller('ProjectsEditCtrl', function($scope,$stateParams,$state,PAPI) {

  PAPI[$stateParams.type].project.read($stateParams.id).then(function(response){
    $scope.project = response;
  });

  $scope.updateProject = function(project){

    PAPI[$scope.project.type].project.update($scope.project.id, $scope.project).then(function(response){
      $state.go("projects");
      Materialize.toast('Project '+response.id+' has been updated', 4000);
    });

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
