'use strict';

/**
 * @ngdoc overview
 * @name newappApp
 * @description
 * # newappApp
 *
 * Main module of the application.
 */
angular.module('Authentication', []);
angular.module('Home', []);

var GSPApp = angular.module('newApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'ui.bootstrap',
        'ui.mask',
        'Authentication',
        'Home',
        'checklist-model',
        'ng-fusioncharts'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'main/main.html',
                controller: 'mainCtrl'
            })
            .when('/login-cashier', {
                templateUrl: 'login/login-employee.html',
                controller: 'loginCtrl'
            })
            .when('/login-admin', {
                templateUrl: 'login/login-admin.html',
                controller: 'loginCtrl'
            })
            .when('/sales', {
                templateUrl: 'sales/sales.html',
                controller: 'salesCtrl'
            })
            .when('/delete', {
                templateUrl: 'delete/delete.html',
                controller: 'deleteCtrl'
            })
            .when('/close', {
                templateUrl: 'close/close.html',
                controller: 'closeCtrl'
            })
            //Admin
            .when('/admin', {
                templateUrl: 'home/home.html',
                controller: 'homeCtrl'
            })
            .when('/clients', {
                templateUrl: 'clients/clients.html',
                controller: 'clientsCtrl'
            })
            .when('/employees', {
                templateUrl: 'doctors/doctors.html',
                controller: 'doctorsCtrl'
            })
            .when('/products', {
                templateUrl: 'drugs/drugs.html',
                controller: 'drugsCtrl'
            })
            .when('/roles', {
                templateUrl: 'roles/roles.html',
                controller: 'rolesCtrl'
            })
            .when('/stadistics', {
                templateUrl: 'stadistics/products.html',
                controller: 'productsCtrl'
            })
            .when('/stadistics/products', {
                templateUrl: 'stadistics/products.html',
                controller: 'productsCtrl'
            })
            .when('/stadistics/companies', {
                templateUrl: 'stadistics/companies.html',
                controller: 'companiesCtrl'
            })
            .when('/subsidiary', {
                templateUrl: 'subsidiary/subsidiary.html',
                controller: 'subsidiaryCtrl'
            })
            .when('/subsidiary/:id', {
                templateUrl: 'subsidiary/subsidiaryMedicines.html',
                controller: 'subsidiaryMedicinesCtrl'
            })


    }).run(['$rootScope', '$location', '$cookieStore', '$http', '$window',
        function ($rootScope, $location, $cookieStore, $http, $window) {

            // keep user logged in after page refresh
            $rootScope.globals = $cookieStore.get('globals') || {};
            if ($rootScope.globals.currentUser) {
                $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
            }

            $rootScope.$on('$locationChangeStart', function (event, next, current) {
                // redirect to login page if not logged in
                if ($location.path() !== '/' && $location.path() !== '' && $location.path() !== '/login-admin' && $location.path() !== '/login-cashier' && $location.path() !== '/register' && !$rootScope.globals.currentUser) {
                    //$window.location.href = ('../index.html');
                }
            });
        }
    ]).directive('ngSpinnerLoader', ['$rootScope',
        function ($rootScope) {
            return {
                link: function (scope, element, attrs) {
                    // by defult hide the spinner bar
                    element.addClass('hide'); // hide spinner bar by default
                    // display the spinner bar whenever the route changes(the content part started loading)
                    $rootScope.$on('$routeChangeStart', function () {
                        element.removeClass('hide'); // show spinner bar
                    });
                    // hide the spinner bar on rounte change success(after the content loaded)
                    $rootScope.$on('$routeChangeSuccess', function () {
                        setTimeout(function () {
                            element.addClass('hide'); // hide spinner bar
                        }, 500);
                        $("html, body").animate({
                            scrollTop: 0
                        }, 500);
                    });
                }
            };
        }
    ]).directive( 'btnHref', function ( $location ) {
        return function ( scope, element, attrs ) {
          var path;
      
          attrs.$observe( 'btnHref', function (val) {
            path = val;
          });
      
          element.bind( 'click', function () {
            scope.$apply( function () {
              $location.path( path );
            });
          });
        };
      });


//Services
GSPApp.service('config', function () {

    var self = this;
    this.ip = 'http://grupomaravillagasstationpharmacy.azurewebsites.net';


});