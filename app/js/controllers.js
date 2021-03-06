'use strict';

/* Controllers */
var portalControllers = angular.module('portalControllers', []);


portalControllers.controller('DashboardCtrl', function($rootScope,$scope,$state,$stateParams,PAPI) {

  // This is used to determine which step we are in within sections with child steps
  $scope.state = $state;
  $scope.stateParams = $stateParams;

  // Start with empty map
  $scope.accounts = {jira:{},confluence:{},bitbucket:{},all : function(){
    var a = $scope.accounts
    return Object.assign({}, a.jira, a.confluence, a.bitbucket)
  }};

  // utility to determine how many accounts are active
  $scope.activeAccounts = function(){
    var acc = $scope.accounts
    var all = [].concat(acc.jira,acc.confluence,acc.bitbucket)
    var num = 0;
    for(var i=0; i < all.length; i++){
      if(all[i].active){
        num++;
      }
    }
    return num;
  }

  // Load accounts from server
  PAPI.jira.account({}).then(function(response){
    $scope.accounts.jira = response.data;
  });

  PAPI.confluence.account({}).then(function(response){
    $scope.accounts.confluence = response.data;
  });

  PAPI.bitbucket.account({}).then(function(response){
    $scope.accounts.bitbucket = response.data;
  });

  $scope.projects = []

  $scope.updateProjects = function(projects){
    $scope.projects = projects
  }

  // Load status of projects for each app into scope
  PAPI.jira.project.list().then(function(response){
    var projects = response.data;
    for (var i = 0; i < projects.length; i++) {
        $scope.projects.push(projects[i]);
    }
    console.log("jira", response.data)
  });

  PAPI.confluence.project.list().then(function(response){
    var projects = response.data;
    for (var i = 0; i < projects.length; i++) {
        $scope.projects.push(projects[i]);
    }
    console.log("confluence", response.data)
  });

  PAPI.bitbucket.project.list().then(function(response){
    var projects = response.data;
    for (var i = 0; i < projects.length; i++) {
        $scope.projects.push(projects[i]);
    }
    console.log("bitbucket", response.data)
  });

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



portalControllers.controller('AccountsCtrl', function($scope,$state,$stateParams,PAPI) {

  $scope.state = $state;
  $scope.stateParams = $stateParams;

  console.log("stateParams: ",$stateParams)

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

portalControllers.controller('AccountsLicensesCtrl', function($scope,$state,$stateParams,PAPI) {

  $scope.licenseApp = $stateParams.id;

  // setup where we want to take the user next
  $scope.nextState = $stateParams.nextState || "accounts"
  $scope.nextStateParams = ($scope.nextState!="accounts")?{application:$scope.licenseApp}:{}

  console.log("license state info: ",$stateParams)

  $scope.closeModal = function(agreed){

    $("#license_modal").closeModal()

    PAPI[$scope.licenseApp].license({agreed:agreed}).then(function(response){

      $scope.accounts[$scope.licenseApp] = response.data;
      $state.go($scope.nextState, $scope.nextStateParams);

    })
  }

  // Show the license in a modal as soon as were ready
  $("#license_modal").openModal({dismissible: false});

});


portalControllers.controller('ProjectsCtrl', function($scope,$state,$stateParams,PAPI) {

  $scope.state = $state;

  $scope.sortField    = 'created';  // set the default sort field
  $scope.sortReverse  = true;      // set the default sort order
  $scope.searchTerm   = '';         // set the default search/filter term

  // check if filter specified in params and apply it
  console.log("project state: ", $state)
  console.log("project state params: ", $state.params)

  if($stateParams.filter && $stateParams.filter!=""){
    $scope.searchTerm = $stateParams.filter
  }
  // update the filter text
  $scope.search = function(term){
    $scope.searchTerm = term;
  }

  // Handle editing a project
  $scope.editProject = function(project){
    console.log("EDIT Project with id: " + project._id);
    $state.go("projects.edit",{application:project.application, id:project._id});
  }

  // Handle creating a project
  $scope.newProject = function(application){
    $scope.application = application;
    $state.go("projects.new",{application:application});
  }

  // Handle deleting a project
  $scope.deleteProject = function(project){
    console.log("DELETE Project with id: " + project._id);
    // TODO: Add some confirmation box
    PAPI[project.application].project.delete(project._id).then(function(response){

      var projects = [];
      // remove the item from the local store
      for (var i = 0; i < $scope.projects.length; i++) {
          if($scope.projects[i]._id != project._id){
            projects.push($scope.projects[i])
          }
      }
      $scope.updateProjects(projects)

      $state.go("projects");
      Materialize.toast('Project '+project._id+' has been deleted', 4000);
    });

  }

  $scope.updateHasData = function(project){
    PAPI[project.application].project.update(project._id, project).then(function(response){

      var projects = [];
      // replace the updated item in the local store
      for (var i = 0; i < $scope.projects.length; i++) {
          if($scope.projects[i]._id == response.data._id){
            projects.push(response.data)
          }else{
            projects.push($scope.projects[i])
          }
      }
      $scope.updateProjects(projects)
    });
  }
});


portalControllers.controller('ProjectsNewCtrl', function($scope,$state,$stateParams,PAPI) {

  $scope.project = {};
  $scope.application = $stateParams.application;

  $scope.getAccountAndReturn = function(){
    var application = $scope.application;
    var next = $state.current.name;
    $state.go("accounts.licenses",{id:application,nextState:next})
  }

  $scope.createProject = function(type){

    PAPI[type].project.create($scope.project).then(function(response){
      // add the new item to local store immediately
      $scope.projects.push(response.data)
      $state.go("projects");
      Materialize.toast('Project '+response.data._id+' has been created', 4000);
    });

  }

  $scope.cancel = function(){
    $state.go("projects");
  }

});


portalControllers.controller('ProjectsEditCtrl', function($scope,$stateParams,$state,PAPI) {

  $scope.editing = true

  console.log("app: ",$stateParams.application," : id: ",$stateParams._id)
  PAPI[$stateParams.application].project.read($stateParams.id).then(function(response){
    $scope.project = response.data;
    console.log("editing: ",$scope.project)
  });

  $scope.updateProject = function(project){

    PAPI[$scope.project.application].project.update($scope.project._id, $scope.project).then(function(response){

      var projects = [];
      // replace the updated item in the local store
      for (var i = 0; i < $scope.projects.length; i++) {
          if($scope.projects[i]._id == response.data._id){
            projects.push(response.data)
          }else{
            projects.push($scope.projects[i])
          }
      }

      $scope.updateProjects(projects)
      $state.go("projects");
      Materialize.toast('Project '+$scope.project._id+' has been updated', 4000);
      
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
