'use strict';

angular.module('Authentication')
    .controller('loginCtrl', ['$scope', '$rootScope', '$window', 'AuthenticationService', '$http', 'config',
        function ($scope, $rootScope, $window, AuthenticationService, $http, config) {
            //Reset login status
            AuthenticationService.ClearCredentials();

            //Set initial cash to 0
            $scope.cash = 0;
            $scope.cashier = 0;
            $scope.error = "";

            //Get all cashiers
            $scope.allCashiers = [];
            $http.get(config.ip + '/api/CashRegisters')
                .success(function (result) {
                    $scope.allCashiers = result;
                })
                .error(function (data, status) {
                    console.log(data);
                });

            //Check if specific client exist in client list
            $scope.checkCashier = function (employeeSubsidiary) {
                for (var i = 0; i < $scope.allCashiers.length; i++) {
                    //If the selected cashier exist in the employee subsidiary, return true
                    if ($scope.allCashiers[i].cash == $scope.cashier && $scope.allCashiers[i].subsidiary == employeeSubsidiary) {

                        return true;
                    }
                }
                return false;
            }

            //Do login
            $scope.login = function (service) {

                $scope.dataLoading = true;

                //Check user username and password
                AuthenticationService.Login($scope.username, $scope.password, service, function (response) {
                    var userId = 0;
                    var user = {};

                    //Server response
                    if (response.success) {

                        var aux_date = new Date();
                        var month = Number(aux_date.getMonth()) + 1;
                        var minutes = function () {
                            if (aux_date.getMinutes() < 10) {
                                return '0' + aux_date.getMinutes();
                            } else {
                                return aux_date.getMinutes();
                            }
                        }

                        var date = aux_date.getFullYear() + "-" + month + "-" +
                            aux_date.getDate() + "T" + aux_date.getHours() + ":" + minutes() + ":" + "00";
                        console.log(date)

                        userId = response.information.id_employee;
                        user = response.information;
                        user.cashier = $scope.cashier;
                        user.initial_time = date;
                        user.initial_cash = $scope.cash;

                        AuthenticationService.SetCredentials($scope.username, $scope.password, service, userId, user);
                        //User is admin
                        if (user.role == 3) {
                            $window.location.href = ('/app/admin/admin.html');
                        }
                        //User is employee
                        else {

                            var post_resquest = {
                                "cash": $scope.cashier,
                                "subsidiary": user.subsidiary,
                                "employee": userId,
                                "initial_time": user.initial_time,
                                "final_time": user.initial_time,
                                "initial_cash": $scope.cash,
                                "final_cash": $scope.cash
                            }
                            //Register cashier
                            $http.post(config.ip + '/api/CashRegisters', post_resquest)
                                .success(function (result) {
                                    console.log(result);
                                    $window.location.href = ('/app/cashier/cashier.html');

                                })
                                .error(function (data, status) {
                                    console.log(data);
                                    $scope.error = "Error registering cashier"

                                });

                        }

                    } else {
                        $scope.error = response.message;
                        $scope.dataLoading = false;
                    }
                });
            };
        }
    ]);