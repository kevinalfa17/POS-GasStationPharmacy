var GSPApp = angular.module('newApp')
    .controller('adminCtrl', ['$scope', 'applicationService', 'quickViewService', 
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

            if ($location.path() == '/' || $location.path() == '') {

                $location.path('admin')
            }

            $scope.username = $rootScope.globals.currentUser.user_name;

            //Listen viewContentLoaded event
            $scope.$on('$viewContentLoaded', function () {
                pluginsService.init();
                applicationService.customScroll();
                applicationService.handlePanelAction();

                //Minimize panel if maximized START
                var $body = $('body');

                if ($body.hasClass("maximized-panel")) {
                    var panel = $(this).parents(".panel:first");
                    $body.toggleClass("maximized-panel");
                    panel.removeAttr("style").toggleClass("maximized");
                    applicationService.maximizePanel();
                    if (panel.hasClass("maximized")) {
                        panel.parents(".portlets:first").sortable("destroy");
                        $(window).trigger('resize');
                    } else {
                        $(window).trigger('resize');
                        panel.parent().height('');
                        pluginsService.sortablePortlets();
                    }
                    $("i", this).toggleClass("icon-size-fullscreen").toggleClass("icon-size-actual");
                    panel.find(".panel-toggle").toggleClass("nevershow");
                    $("body").trigger("resize");
                }
                //Minimize panel if maximized END

                $('.nav.nav-sidebar .nav-active').removeClass('nav-active active');
                $('.nav.nav-sidebar .active:not(.nav-parent)').closest('.nav-parent').addClass('nav-active active');

                //Unselect parent and child when home is selected
                if ($location.$$path == '/') {

                    $('.nav.nav-sidebar .nav-parent').removeClass('nav-active active');
                    $('.nav.nav-sidebar .nav-parent .children').removeClass('nav-active active');
                    if ($('body').hasClass('sidebar-collapsed') && !$('body').hasClass('sidebar-hover')) return;
                    if ($('body').hasClass('submenu-hover')) return;
                    $('.nav.nav-sidebar .nav-parent .children').slideUp(200);
                    $('.nav-sidebar .arrow').removeClass('active');
                }

            });

            //Check if any /direction is active
            $scope.isActive = function (viewLocation) {
                return viewLocation === $location.path();
            };

            //Delete when get data from DB
            $scope.user = {
                name: 'Fulano',
                imageUrl: '../../assets/global/images/avatars/user1.png'
            }

            $scope.logout = function () {
                AuthenticationService.ClearCredentials();
                $window.location.href = ('../index.html');

            }

        }]);

//Directives
GSPApp.directive("topBar", function () {
    return {
        restrict: 'AE',
        templateUrl: 'directives/topbar.html',
        scope: {
            userObject: "=",
        }
    }
});
