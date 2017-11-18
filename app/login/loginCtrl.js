'use strict';

angular.module('Authentication')
    .controller('loginCtrl', ['$scope', '$rootScope', '$window', 'AuthenticationService', '$http','config',
        function ($scope, $rootScope, $window, AuthenticationService, $http,config) {
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

                        userId = response.information.id_employee;
                        user = response.information;
                        user.cashier = $scope.cashier;

                        AuthenticationService.SetCredentials($scope.username, $scope.password, service, userId, user);
                        //User is admin
                        if (user.role == 3) {
                            $window.location.href = ('/app/admin/admin.html');
                        }
                        //User is employee
                        else {

                            console.log(JSON.stringify($scope.allCashiers))
                            //Check user cashier
                            if ($scope.checkCashier(user.subsidiary)) {
                                //Everything is ok
                                $window.location.href = ('/app/cashier/cashier.html');                                                              
                                //Register initial cash
                            }
                            else{
                                $scope.error = "This cashier number is not part of your subsidiary";                                
                            }

                        }

                    } else {
                        console.log("errorrrrr")
                        $scope.error = response.message;
                        $scope.dataLoading = false;
                    }
                });
            };
        }
    ]);