angular.module('newApp')
    .controller('reportsCtrl', ['$scope', '$location', '$http', 'config', '$rootScope', '$window',
        function ($scope, $location, $http, config, $rootScope, $window) {

            $scope.reportSelect = 1;
            $scope.initialDate = '';
            $scope.finalDate = '';

            $scope.generate = function () {

                if (!$scope.initialDate) {
                    $scope.initialDate = '2017-01-01T10:00:00.000'
                } else {
                    $scope.initialDate = $scope.initialDate + '00';
                }

                if (!$scope.finalDate) {
                    $scope.finalDate = '2017-01-01T10:00:00.000'
                } else {
                    $scope.finalDate = $scope.finalDate + '00';
                }

                $scope.company = $rootScope.globals.currentUser.company;
                var ip = 'http://localhost:7045';
                var url = ip + '/api/Reports/' + $scope.reportSelect + '?initial=' +
                    $scope.initialDate + '&final=' + $scope.finalDate + '&company=' + $scope.company;
                console.log("url: " + url)

                //var $popup = $window.open("reports/report.html", "popup", "width=600,height=600,left=10,top=150");
                $window.location.href = (url);

            }

        }
    ]);