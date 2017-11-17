'use strict';

angular.module('newApp')

    .factory('UserService',
    ['$timeout', '$filter', '$q', 'config', '$http', 'Base64',
        function ($timeout, $filter, $q, config, $http, Base64) {

            var users = [];
            var service = {};

            // service.GetAll = function () {
            //     var deferred = $q.defer();
            //     deferred.resolve(getUsers());
            //     return deferred.promise;
            // }

            // service.GetById = function (id_client) {
            //     var deferred = $q.defer();
            //     var filtered = $filter('filter')(getUsers(), { id_client: id_client });
            //     var user = filtered.length ? filtered[0] : null;
            //     deferred.resolve(user);
            //     return deferred.promise;
            // }

            service.GetByuser_name = function (user_name) {
                var deferred = $q.defer();
                var filtered = $filter('filter')(getUsers(), { user_name: user_name });
                var user = filtered.length ? filtered[0] : null;
                deferred.resolve(user);
                return deferred.promise;
            }

            service.Create = function (user) {
                user.password = Base64.encode(user.password);
                console.log(user);
                return $http.post(config.ip + '/api/Clients', user).then(handleSuccess, handleError('Error creating user client'));

            }

            // service.GetAll = function () {
            //     return $http.get(config.ip + '/api/').then(handleSuccess, handleError('Error getting all users'));
            // }

            service.GetById = function (id) {
                return $http.get('/api/users/' + id).then(handleSuccess, handleError('Error getting user by id'));
            }

            service.GetByuser_name = function (user_name) {
                return $http.get(config.ip + '/api/' + user_name).then(handleSuccess, handleError('Error getting user by user_name'));
            }

            //             service.GetByuser_name(user_name) {
            //                 return $http.get('/api/users/' + user_name).then(handleSuccess, handleError('Error getting user by user_name'));
            //             }


            service.Update = function (user) {
                return $http.put('/api/users/' + user.id, user).then(handleSuccess, handleError('Error updating user'));
            }

            service.Delete = function (id) {
                return $http.delete('/api/users/' + id).then(handleSuccess, handleError('Error deleting user'));
            }

            service.getAilments = function () {
                return $http.get(config.ip + '/api/Ailments').then(handleSuccess, handleError('Error getting employee by user_name'));
            }

            service.getSubsidiaryId = function (id) {
                // console.log(id);
                return $http.get(config.ip + '/api/Subsidiaries/' + id).then(handleSuccess, handleError('Error getting subsidiary by id'));
            }

            //             // private functions

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