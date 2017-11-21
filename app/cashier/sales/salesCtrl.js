'use strict';
angular.module('newApp')
    .controller('salesCtrl', ['$scope', 'pluginsService', '$window', '$route', '$http', 'config', '$rootScope',
        function ($scope, pluginsService, $window, $route, $http, config, $rootScope) {
            $scope.$on('$viewContentLoaded', function () {


                $scope.user = {
                    id_client: '',
                    first_name: '',
                    first_last_name: '',
                    second_name: '',
                    second_last_name: '',
                    birthdate: '',
                    phone: '',
                    residence: ''
                };


                //General input variables
                $scope.defaultClient = true;
                $scope.clientExist = true;
                $scope.creditCard = false;
                $scope.userId = '';
                $scope.idReady = false;
                $scope.productList = [];
                $scope.quantity = 1;
                $scope.total = 0;
                $scope.cash = '';
                $scope.barcode = '';
                $scope.lowStock = false;
                $scope.invoiceNumber = 0;
                $scope.invoiceDate = '';
                $scope.readyToPrint = false;
                $scope.printing = false;

                //Subsidiary id
                $scope.subsidiary = $rootScope.globals.currentUser.subsidiary;


                //Remove item to the list
                $scope.remove = function (index) {
                    $scope.total = $scope.total - ($scope.productList[index].price * $scope.productList[index].quantity); //Remove product cost to total cost                
                    $scope.productList.splice(index, 1)
                }

                //Add new item to list
                $scope.add = function () {
                    
                    //Check if is already added
                    if ($scope.productAlreadyAdded($scope.barcode)) {
                        $scope.increaseProductQuantity($scope.barcode);
                    } else {
                        $scope.addProduct($scope.barcode);
                    }

                }

                //Finish sale and print invoice
                $scope.finish = function () {
                    var icon = $('#loadIcon');// load icon
                    
                    console.log("ic"+icon.hasClass("hide"));
                    icon.removeClass("hide")
                    //Register user
                    if ($scope.defaultClient == false && $scope.idReady) {
                        $scope.user.id_client = $scope.userId;

                        $http.post(config.ip + '/api/Clients', $scope.user)
                            .success(function (result) {
                                console.log(result);
                                //If only is registering a user
                                if ($scope.total <= 0) {
                                    $route.reload();
                                }
                            })
                            .error(function (data, status) {
                                console.log(data);

                            });
                    }

                    //Register sale
                    if ($scope.total > 0) {

                        var date = new Date();
                        var aux_date = date.getFullYear() + "-" + date.getMonth() + "-" +
                            date.getDate() + "T" + date.getHours() + ":" + date.getMinutes() + ":" + date.getUTCSeconds();

                        $scope.invoiceDate = +date.getMonth() + "/" +
                            date.getDate() + "/" + date.getFullYear() + " at " + date.getHours() + ":" + date.getMinutes() + ":" + date.getUTCSeconds();

                        var client;
                        var payment_type;

                        //Set client id
                        if ($scope.defaultClient || !$scope.idReady) {
                            client = '000000000';
                        } else {
                            client = userId;
                        }

                        //Set payment type
                        if ($scope.creditCard) {
                            payment_type = 1;
                        } else {
                            payment_type = 2;
                        }

                        //Delete products names and houses
                        var formattedProducts = [];
                        for (var i = 0; i < $scope.productList.length; i++) {
                            formattedProducts[i] = $scope.productList[i];
                            delete formattedProducts[i]["name"];
                            delete formattedProducts[i]["pharmaceutical_house"];
                        }

                        var post_request = {
                            "id_sale": null,
                            "total": $scope.total,
                            "sale_date": aux_date,
                            "client": Number(client),
                            "payment_type": payment_type,
                            "employee": $rootScope.globals.currentUser.id,
                            "subsidiary": $rootScope.globals.currentUser.subsidiary,
                            "cash": $rootScope.globals.currentUser.cashier,
                            "medicines": formattedProducts
                        }


                        //Register in DB
                        $http.post(config.ip + '/api/Sales', post_request)
                            .success(function (result) {
                                console.log(result);


                                $scope.invoiceNumber = result.id_inserted; //Get from DB 
                                $scope.readyToPrint = true;
                                icon.addClass("hide");

                            })
                            .error(function (data, status) {
                                console.log(data);

                            });
                    }
                }

                $scope.print = function () {
                    var $popup = $window.open("sales/invoice.html", "popup", "width=450,height=600,left=10,top=150");
                    $popup.productList = $scope.productList;
                    $popup.date = $scope.invoiceDate;
                    $popup.total = $scope.total;
                    $popup.number = $scope.invoiceNumber;

                    //$route.reload();


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

                //Get products that can be added to the sale
                $scope.products = [];
                $http.get(config.ip + '/api/MedicinesbySubsidiaries/' + $scope.subsidiary + "?type=s")
                    .success(function (result) {
                        $scope.products = result;
                    })
                    .error(function (data, status) {
                        console.log(data);
                    });

                $scope.productsData = [];
                $http.get(config.ip + '/api/Medicines/')
                    .success(function (result) {
                        $scope.productsData = result;
                    })
                    .error(function (data, status) {
                        console.log(data);
                    });


                //Check if specific client exist in client list
                $scope.checkClient = function (client) {
                    for (var i = 0; i < $scope.clients.length; i++) {
                        if ($scope.clients[i].id_client == client) {
                            $scope.user.first_name = $scope.clients[i].first_name;
                            $scope.user.phone = $scope.clients[i].phone;
                            return true;
                        }
                    }
                    $scope.user.first_name = ''
                    $scope.user.phone = '';
                    return false;
                }

                //Check if specific client exist in client list
                $scope.addProduct = function (product) {
                    for (var i = 0; i < $scope.products.length; i++) {
                        if ($scope.products[i].medicine == product) {
                            $scope.searchProduct(product);
                        }
                    }
                }

                //Search for product name and price
                $scope.searchProduct = function (product) {
                    for (var i = 0; i < $scope.productsData.length; i++) {
                        if ($scope.productsData[i].id_medicine == product) {
                            var newProduct = $scope.productsData[i];
                            newProduct.quantity = $scope.quantity;
                            newProduct.sale = null;
                            newProduct = JSON.parse(JSON.stringify(newProduct).split('"id_medicine":').join('"medicine":'));
                            //Add product to list
                            $scope.productList.push(newProduct);
                            //Update total
                            $scope.total = $scope.total + newProduct.price * newProduct.quantity; //Add product cost to total cost

                        }
                    }
                }

                //Check is product was added to product list before
                $scope.productAlreadyAdded = function (product) {
                    for (var i = 0; i < $scope.productList.length; i++) {
                        if ($scope.productList[i].medicine == product) {
                            return true;
                        }
                    }
                    return false;
                }

                //Increase product quantity when already exist
                $scope.increaseProductQuantity = function (product) {
                    for (var i = 0; i < $scope.productList.length; i++) {
                        if ($scope.productList[i].medicine == product) {
                            $scope.productList[i].quantity = $scope.productList[i].quantity + $scope.quantity;
                        }
                    }
                }

                //Get product min stock, returns -1 if product doesnt exist
                $scope.getMinStock = function (product) {
                    for (var i = 0; i < $scope.products.length; i++) {
                        if ($scope.products[i].medicine == product) {
                            return $scope.products[i].stock_minimo;
                        }
                    }
                    return -1;
                }


                //Aux class
                $scope.viewPort = $('.sf-viewport');

                //Watch for quantity change
                $scope.$watch('productList', function (newValue, oldValue) {
                    //It wasnt an addition!
                    if (newValue.length == oldValue.length) {

                        for (var i = 0; i < newValue.length; i++) {
                            //Quantity changed
                            if (newValue[i].quantity !== oldValue[i].quantity) {

                                //Update total
                                if (newValue[i].quantity > oldValue[i].quantity) {
                                    //Increase total
                                    $scope.total = $scope.total + $scope.productList[i].price * (newValue[i].quantity - oldValue[i].quantity); //Add product cost to total cost                                    
                                } else {
                                    //Decrease total
                                    $scope.total = $scope.total - $scope.productList[i].price * (oldValue[i].quantity - newValue[i].quantity); //Remove product cost to total cost                                    
                                }
                            }
                        }

                    }

                }, true)

                //Product quantity changes
                $scope.$watch('creditCard', function (newValue, oldValue) {
                    console.log("credit");
                })

                $scope.$watch('quantity', function (newValue, oldValue) {
                    //Check product min stock
                    var min = $scope.getMinStock($scope.barcode);
                    //If product exist and quantity is higher than the min stock then show warning
                    if (min != -1 && $scope.quantity >= min) {
                        $scope.lowStock = true;
                    } else {
                        $scope.lowStock = false;
                    }
                })

                $scope.$watch('barcode', function (newValue, oldValue) {
                    //Check product min stock
                    var min = $scope.getMinStock($scope.barcode);
                    //If product exist and quantity is higher than the min stock then show warning
                    if (min != -1 && $scope.quantity >= min) {
                        $scope.lowStock = true;
                    } else {
                        $scope.lowStock = false;
                    }
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

        }
    ]);