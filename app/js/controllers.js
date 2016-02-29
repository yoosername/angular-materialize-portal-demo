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


portalControllers.controller('PasswordCtrl', [
  '$rootScope','$scope', '$state', '$stateParams', function($rootScope,$scope,$state,$stateParams) {

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

}]);


portalControllers.controller('ProjectsCtrl', [
  '$rootScope','$scope', '$state', '$stateParams', function($rootScope,$scope,$state,$stateParams) {


}]);


portalControllers.controller('AccountWizardCtrl', [
  '$rootScope','$scope', '$state', '$stateParams', function($rootScope,$scope,$state,$stateParams) {


}]);
