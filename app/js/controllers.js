'use strict';

/* Controllers */
var portalControllers = angular.module('portalControllers', []);

portalControllers.controller('DashboardCtrl', ['$scope', '$state', '$stateParams', function($scope,$state,$stateParams) {
  $scope.state = $state;
  $scope.stateParams = $stateParams;
  $scope.instanceID = $stateParams.instanceID;

  $scope.password = "";

  $scope.resetPassword = function(){
    if($scope.password.length > 8){
      console.log("user reset password to: " + $scope.password);
      Materialize.toast('Password has been reset', 4000)
    }else{
      console.log("password too short: " + $scope.password);
      Materialize.toast('Password must be at least 8 characters!!', 8000)
    }
  }
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

  $scope.agreeSyops = function(){
    console.log("Syops agreed, model = ");
    $state.go("accounts.wizard.stepTwo");
  }

  $rootScope.$on('$stateChangeStart', function(evt, to, params) {
    if (to.redirectTo) {
      evt.preventDefault();
      $state.go(to.redirectTo, params)
    }
  });

}]);

portalControllers.controller('AccountWizardCtrl', [
  '$rootScope','$scope', '$state', '$stateParams', function($rootScope,$scope,$state,$stateParams) {


}]);
