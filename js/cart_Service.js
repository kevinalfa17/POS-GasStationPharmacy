'use strict';

angular.module('newApp')

    .factory('cartService', ['$http', 'config',
        function ($http, config) {
            var service = {};

            service.CreateOrder = function (order) {
                return $http.post(config.ip + '/api/Orders', order).then(handleSuccess, handleError('Error creating order'));
            }

            service.GetOrder = function (order) {
                return $http.get(config.ip + '/api/Orders/' + order.id_order).then(handleSuccess, handleError('Error gettin order'));

            }

            service.UploadOrder = function (order) {
                return $http.put(config.ip + '/api/Orders/' + order.id_order).then(handleSuccess, handleError('Error uploading order'));

            }

            service.DeleteOrder = function (order) {
                return $http.delete(config.ip + '/api/Orders' + order.id_order).then(handleSuccess, handleError('Error deleting order'));

            }

            service.DrugsListAllSub = function () {
                return $http.get(config.ip + '/api/Subsidiaries').then(handleSuccess, handleError('Error getting drugslist'));

            }

            service.uploadQuantity = function (med) {
                console.log('med');
                console.log(JSON.stringify(med));
                
                return $http.put(config.ip + '/api/MedicinesbySubsidiary?id_subsidiary=' + med.subsidiary + '&id_medicine=' + med.medicine, med).then(handleSuccess, handleError('Error medicinesBySubsidiary'));
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
