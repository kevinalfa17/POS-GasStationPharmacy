'use strict';
angular.module('newApp')
    .controller('closeCtrl', ['$scope', 'pluginsService', '$window', '$route', 'AuthenticationService', '$rootScope',
        function ($scope, pluginsService, $window, $route, AuthenticationService, $rootScope) {

            //Get sales summary
            $http.get(config.ip + 'api/CashRegisters?cash=' + $rootScope.globals.currentUser.cashier +
                    '&subsidiary=' + $rootScope.globals.currentUser.subsidiary + '&employee=' + $rootScope.globals.currentUser.id +
                    '&initial_time=' + $rootScope.globals.currentUser.initial_time)
                .success(function (result) {
                    console.log(JSON.stringify(result));
                })
                .error(function (data, status) {
                    console.log(data);
                });

            //Sales summary #Get from DB
            $scope.cashSales = "0000";
            $scope.creditSales = "0000";
            $scope.totalCash = "0000";

            //Close and logout
            $scope.close = function () {
                AuthenticationService.ClearCredentials();
                $window.location.href = ('../index.html');
            }

        }
    ]);