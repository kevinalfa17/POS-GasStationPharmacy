'use strict';
angular.module('newApp')
    .controller('deleteCtrl', ['$scope', 'pluginsService', '$window', '$route', '$http', 'config', 'AuthenticationService',
        function ($scope, pluginsService, $window, $route, $http, config, AuthenticationService) {

            //General input models
            $scope.number = '';
            $scope.barcode = '';
            $scope.manageruser = '';
            $scope.managerpassword = '';

            //Product information
            $scope.loading = false;
            $scope.loginLoading = false;
            $scope.wrongLogin = false;
            $scope.found = false;
            $scope.product = {};
            $scope.productRefundQuantity = 1;

            //Process refund
            $scope.refund = function () {
                //Set icons in default state
                $scope.loginLoading = true;
                $scope.wrongLogin = false;

                //Try login
                AuthenticationService.Login($scope.manageruser, $scope.managerpassword, '', function (response) {

                    //Login ok
                    if (response.success) {
                        var user = response.information;
                        //Check if is an admin
                        if (user.role == 3) {
                            //REFUND DONE
                            $scope.loginLoading = false;
                            //Do the refund in DB
                            if ($scope.product.quantity == $scope.productRefundQuantity) {
                                //delete from db
                                $http.delete(config.ip + '/api/MedicinesbySales?idm=' + $scope.product.barcode + '&ids=' + $scope.product.number)
                                    .success(function (result) {
                                        console.log(result);
                                        //Hide modal again
                                        $('#modal-manager').modal('hide');
                                        //Clean credentials
                                        $scope.manageruser = '';
                                        $scope.managerpassword = '';
                                        //$route.reload();

                                    })
                                    .error(function (data, status) {
                                        console.log(data);
                                    });
                            } else {
                                //update from db
                                var put_request = {
                                    "medicine": $scope.product.barcode,
                                    "sale": $scope.product.number,
                                    "price": $scope.product.price,
                                    "quantity": $scope.product.quantity - $scope.productRefundQuantity
                                }

                                $http.put(config.ip + '/api/MedicinesbySales?idm=' + $scope.product.barcode + '&ids=' + $scope.product.number, put_request)
                                    .success(function (result) {
                                        console.log(result);
                                        //Hide modal again
                                        $('#modal-manager').modal('hide');
                                        //Clean credentials
                                        $scope.manageruser = '';
                                        $scope.managerpassword = '';
                                        //$route.reload();
                                    })
                                    .error(function (data, status) {
                                        console.log(data);
                                    });
                            }

                        } else {
                            //Not an admin
                            $scope.loginLoading = false;
                            $scope.wrongLogin = true;
                        }
                    }
                    //Bad authentication
                    else {
                        $scope.loginLoading = false;
                        $scope.wrongLogin = true;
                    }

                })


            }

            //Search item for deletion
            $scope.search = function () {

                $scope.loading = true;
                //Get specific item data based in item barcode and invoice number
                $http.get(config.ip + '/api/MedicinesbySales?idm=' + $scope.barcode + '&ids=' + $scope.number)
                    .success(function (result) {
                        $scope.product.price = result.price;
                        $scope.product.quantity = result.quantity;
                        $scope.productRefundQuantity = result.quantity;
                        $scope.product.barcode = $scope.barcode;
                        $scope.product.number = $scope.number;
                        $scope.found = true;

                        //Get sale to get the date
                        $http.get(config.ip + '/api/Sales/' + $scope.number)
                            .success(function (result2) {
                                $scope.product.date = result2.sale_date;
                            })
                            .error(function (data, status) {
                                console.log(data);
                                $scope.found = false;
                                $scope.loading = false;
                            });

                        //Get product name
                        $http.get(config.ip + '/api/Medicines/' + result.medicine)
                            .success(function (result3) {
                                $scope.product.name = result3.name;
                                $scope.loading = false;
                            })
                            .error(function (data, status) {
                                console.log(data);
                                $scope.found = false;
                                $scope.loading = false;

                            });

                    })
                    .error(function (data, status) {
                        console.log(data);
                        $scope.found = false;
                        $scope.loading = false;

                    });

            }
            $scope.calcTotal = function (val) {
                if (val) {
                    return val;
                } else {
                    return 0;
                }

            }

        }
    ]);