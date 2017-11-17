

    angular.module('newApp')
    .controller('indexCtrl', ['$scope', 'applicationService', 'quickViewService', 
    'builderService', 'pluginsService', '$location', '$rootScope',
    'AuthenticationService','$window',
        function ($scope, applicationService, quickViewService, builderService,
        pluginsService, $location, $rootScope,AuthenticationService,$window) {
            $(document).ready(function () {
                applicationService.init();
                quickViewService.init();
                builderService.init();
                pluginsService.init();
                Dropzone.autoDiscover = false;
            });
    
        }]);