'use strict';
angular.module('newApp')
    .controller('salesCtrl', ['$scope', 'pluginsService', '$window', '$route','$http','config','$rootScope',
     function ($scope, pluginsService, $window, $route,$http,config,$rootScope) {
        $scope.$on('$viewContentLoaded', function () {

            $scope.user = {
                first_name: '',
                first_last_name: ''
            };

            $scope.defaultClient = true;
            $scope.clientExist = true;
            $scope.creditCard = false;
            $scope.userId = '';
            $scope.idReady = false;
            $scope.productList = [];
            $scope.quantity = 1;
            $scope.total = 0;
            $scope.cash = '';

            //Subsidiary id
            $scope.subsidiary = $rootScope.globals.currentUser.subsidiary;
            console.log("subsi"+ $scope.subsidiary)
            

            //Remove item to the list
            $scope.remove = function (index) {
                $scope.total = $scope.total - $scope.productList[index].total; //Remove product cost to total cost                
                $scope.productList.splice(index, 1)
            }

            //Add new item to list
            $scope.add = function () {
                var product = {};
                product.name = "newname"; //Search in product list
                product.quantity = $scope.quantity;
                product.price = 100; ////Search in product list

                $scope.productList.push(product);
                $scope.total = $scope.total + product.price * product.quantity; //Add product cost to total cost
            }

            //Finish sale and print invoice
            $scope.finish = function () {
                var $popup = $window.open("sales/invoice.html", "popup", "width=450,height=600,left=10,top=150");
                $popup.productList = $scope.productList;
                $popup.date = new Date();
                $popup.total = $scope.total;
                $popup.number = "0000"; //Get from DB
                $route.reload();

            }

            //Get client list to check if client is new 
            $scope.clients = [];
            $http.get(config.ip + '/api/Clients')
                .success(function (result) {
                    $scope.clients = result;
                })
                .error(function (data, status) {
                    console.log(data);
                });

            //Check if specific client exist in client list
            $scope.checkClient = function(client){
                for(var i = 0; i<$scope.clients.length; i++){
                    if($scope.clients[i].id_client == client){
                        return true;
                    }
                }
                return false;
            }

            //Aux class
            $scope.viewPort = $('.sf-viewport');

            $scope.$watch('creditCard', function (newValue, oldValue) {
                console.log("credit");
            })

            //Check if customer is a registered client or default client (check control)
            $scope.$watch('defaultClient', function (newValue, oldValue) {

                //Resize aux class based on if new user form is visible or not
                if ($scope.clientExist) {
                    $('.sf-viewport').height(150);
                } else {
                    $('.sf-viewport').height(600);
                }

            })

            //Check if customer is a registered client or new client is necesary
            $scope.$watch('clientExist', function (newValue, oldValue) {
                //Resize aux class based on if new user form is visible or not
                if ($scope.clientExist) {
                    $('.sf-viewport').height(150);
                } else {
                    $('.sf-viewport').height(600);
                }

            })


            //Watch Client Id to check if exist
            $scope.$watch('userId', function (newValue, oldValue) {
                //If data is undefined then mask is not completed
                if ($scope.userId !== undefined) {
                    $scope.user.id = $scope.userId;

                    //Check if Id complete (9 numbers)
                    console.log("idlenght" + $scope.userId.length)
                    if ($scope.userId.length == 9) {

                        //Check if exist
                        $scope.clientExist = $scope.checkClient($scope.userId); //(Change id comparisson with DB search)
                        //Form validation
                        $scope.idReady = true;

                    } else {
                        //Not show new client inputs at the begining
                        $scope.clientExist = true;
                        //Form validation
                        $scope.idReady = false;
                    }
                } else {
                    //Not show new client inputs if masked is incomplete (ID is less than 9)
                    $scope.clientExist = true;
                    //Form validation
                    $scope.idReady = false;
                }

            });

        });

    }]);