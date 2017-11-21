'use strict';
angular.module('newApp')
    .controller('deleteCtrl', ['$scope', 'pluginsService', '$window', '$route',
        function ($scope, pluginsService, $window, $route) {

            //General input models
            $scope.number = '';
            $scope.barcode = '';
            $scope.manageruser = '';
            $scope.managerpassword = '';

            //Product information
            $scope.product = {price:0};
            $scope.productRefundQuantity = 1;

            //Process refund
            $scope.refund = function () {
                //##Validate manager username and password
                //##Do the refund in DB
                $route.reload();
            }

            //Search item for deletion
            $scope.search = function () {

                //Get specific item data based in item barcode and invoice number
                $http.get(config.ip + '/api/MedicinesbySales?idm=' + $scope.barcode + '&ids=' + $scope.number)
                    .success(function (result) {
                        $scope.product.price = result.price;
                        $scope.product.quantity = result.quantity;
                        $scope.productRefundQuantity = result.quantity;

                        //Get sale to get the date
                        $http.get(config.ip + '/api/Sales/' + $scope.number)
                            .success(function (result2) {
                                $scope.product.date = result2.sale_date;
                            })
                            .error(function (data, status) {
                                console.log(data);
                            });

                        //Get product name
                        $http.get(config.ip + '/api/Medicines/' + result.medicine)
                            .success(function (result3) {
                                $scope.product.name = result3.name;
                            })
                            .error(function (data, status) {
                                console.log(data);
                            });

                    })
                    .error(function (data, status) {
                        console.log(data);
                    });

            }

        }
    ]);