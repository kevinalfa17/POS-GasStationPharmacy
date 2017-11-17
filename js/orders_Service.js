'use strict';

angular.module('newApp')

    .factory('ordersService', ['$http', 'config',
        function ($http, config) {
            var service = {};

            service.GetAllOrders = function () {
                return $http.get(config.ip + '/api/Orders/').then(handleSuccess, handleError('Error gettin order'));

            }

            service.GetOrder = function (order) {
                return $http.get(config.ip + '/api/Orders/' + order.id_order).then(handleSuccess, handleError('Error gettin order'));

            }

            service.UploadOrder = function (order) {
                return $http.put(config.ip + '/api/Orders/' + order.id_order, order).then(handleSuccess, handleError('Error uploading order'));

            }

            service.DeleteOrder = function (order) {
                return $http.delete(config.ip + '/api/Orders/' + order).then(handleSuccess, handleError('Error deleting order'));

            }

            function handleSuccess(res) {
                return res.data;
            }

            function handleError(error) {
                return function () {
                    return { success: false, message: error };
                }
            }


            return service;
        }]);
