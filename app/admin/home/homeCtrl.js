angular.module('newApp')
    .controller('homeCtrl', ['$scope', '$location',
        function ($scope, $location) {
            $scope.$on('$viewContentLoaded', function () {
                //dashboardService.init(); //Clock
               
               
            });

        }]);