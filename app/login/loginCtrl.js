'use strict';

angular.module('Authentication')
    .controller('loginCtrl', ['$scope', '$rootScope', '$window', 'AuthenticationService',
        function ($scope, $rootScope, $window, AuthenticationService) {
            //Reset login status
            AuthenticationService.ClearCredentials();

            //Set initial cash to 0
            $scope.initialCash = 0;

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

                        AuthenticationService.SetCredentials($scope.username, $scope.password, service, userId, user);
                        //User is admin
                        if (user.role == 3) {
                            $window.location.href = ('/app/admin/admin.html');                            
                        }
                        //User is employee
                        else{
                            $window.location.href = ('/app/cashier/cashier.html');                            
                        }

                    } else {
                        $scope.error = response.messages;
                        $scope.dataLoading = false;
                    }
                });
            };
        }
    ]);