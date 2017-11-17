'use strict';
angular.module('newApp')
    .controller('closeCtrl', ['$scope', 'pluginsService','$window','$route', 
    function ($scope, pluginsService,$window,$route) {
        //Sales summary #Get from DB
        $scope.cashSales = "0000";
        $scope.creditSales = "0000";
        $scope.totalCash = "0000";

        //Close and logout
        $scope.close = function(){

        }

    }]);