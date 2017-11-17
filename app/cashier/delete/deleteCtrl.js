'use strict';
angular.module('newApp')
    .controller('deleteCtrl', ['$scope', 'pluginsService','$window','$route', 
    function ($scope, pluginsService,$window,$route) {

        $scope.number = '';
        $scope.barcode = '';
        $scope.manageruser = '';
        $scope.managerpassword = '';


        //##Get product from BD based on invoice number and barcode##
        $scope.product = {date:'MM/dd/yyyy hh:mm',name:'Camera HD nofake',quantity:2,price:100};
        $scope.productRefundQuantity = 1;      
        

        $scope.refund = function(){
            //##Validate manager username and password
            //##Do the refund in DB
            $route.reload();
        }
    
    
    
    }]);