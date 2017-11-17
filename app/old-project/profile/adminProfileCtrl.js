angular.module('newApp')
    .controller('adminProfileCtrl', ['$scope', '$http', '$rootScope', 'Encoder', 'config',
        function ($scope, $http, $rootScope, Encoder, config) {

            $scope.done = false;

            console.log("user"+JSON.stringify($rootScope.globals));
            //Get employee (admin) data
            $scope.user = {};
            $http.get(config.ip + '/api/Employees/' + $rootScope.globals.currentUser.id)
                .success(function (result) {
                    console.log("result" + result)
                    $scope.user = result;
                    $scope.user.password = '';
                    $scope.formatIncommingDates();
                })
                .error(function (data, status) {

                    console.log(data);

                });

            //Format all backend dates to YYYY-MM-DD
            $scope.formatIncommingDates = function () {

                var aux = $scope.user.birthdate.split("T");
                $scope.user.birthdate = aux[0];

            }

            $scope.editProfile = function () {

                if ($scope.user.password != '') {
                    $scope.user.password = Encoder.encode($scope.user.password);
                }
                else {
                    delete $scope.user.password;
                }

                $http.put(config.ip + '/api/Employees/' + $rootScope.globals.currentUser.id, $scope.user)
                    .success(function (result) {
                        console.log(result);

                        $scope.done = true;

                    })
                    .error(function (data, status) {
                        console.log(data);
                    });
            }

            //Watcher of the select input
            $scope.$watch('user', function () {
                if (!$scope.user.hasOwnProperty("password")) {
                    $scope.user.password = '';
                }
                $scope.done = false;
            }, true);


        }]);