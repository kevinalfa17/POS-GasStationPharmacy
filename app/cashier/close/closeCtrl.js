'use strict';
angular.module('newApp')
    .controller('closeCtrl', ['$scope', 'pluginsService', '$window', '$route', 'AuthenticationService', '$rootScope', '$http', 'config',
        function ($scope, pluginsService, $window, $route, AuthenticationService, $rootScope, $http, config) {


            //Sales summary #Get from DB
            $scope.cashSales = "0000";
            $scope.creditSales = "0000";
            $scope.totalCash = "0000";

            //Get sales summary
            console.log(config.ip + '/api/Sales?sub=' + $rootScope.globals.currentUser.subsidiary +
                '&cash=' + $rootScope.globals.currentUser.cashier + '&date=' + $rootScope.globals.currentUser.initial_time)

            $http.get(config.ip + '/api/Sales?sub=' + $rootScope.globals.currentUser.subsidiary +
                    '&cash=' + $rootScope.globals.currentUser.cashier + '&date=' + $rootScope.globals.currentUser.initial_time)
                .success(function (result) {
                    console.log("a" + JSON.stringify(result));

                    var totalCredit = 0;
                    var totalCash = 0;
                    //Get credit total sales 
                    for (var i = 0; i < result.credit.length; i++) {
                        totalCredit += result.credit[i].total;
                    }
                    for (var i = 0; i < result.cash.length; i++) {
                        totalCash += result.cash[i].total;
                    }

                    //Refresh GUI
                    $scope.creditSales = totalCredit;
                    $scope.cashSales = totalCash;
                    $scope.totalCash = Number($rootScope.globals.currentUser.initial_cash) + Number($scope.cashSales);


                })
                .error(function (data, status) {
                    console.log(data);
                });


            //Close and logout
            $scope.close = function () {

                var date = new Date();
                var month = Number(date.getMonth()) + 1;
                var minutes = function () {
                    if (date.getMinutes() < 10) {
                        return '0' + date.getMinutes();
                    } else {
                        return date.getMinutes();
                    }
                }
                var final_time = date.getFullYear() + "-" + month + "-" +
                    date.getDate() + "T" + date.getHours() + ":" + minutes() + ":" + "00";


                //Register close in DB
                var put_request = {
                    "cash": $rootScope.globals.currentUser.cashier,
                    "subsidiary": $rootScope.globals.currentUser.subsidiary,
                    "employee": $rootScope.globals.currentUser.id,
                    "initial_time": $rootScope.globals.currentUser.initial_time,
                    "final_time": final_time,
                    "final_cash": $scope.totalCash
                };

                $http.put(config.ip + '/api/CashRegisters', put_request)
                    .success(function (result) {
                        console.log(result);
                        AuthenticationService.ClearCredentials();
                        $window.location.href = ('../index.html');

                    })
                    .error(function (data, status) {
                        console.log(data);
                    });


            }

        }
    ]);