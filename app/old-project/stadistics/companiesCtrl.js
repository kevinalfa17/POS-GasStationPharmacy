angular.module('newApp')
    .controller('companiesCtrl', ['$scope', '$location', 'pluginsService', '$http', 'config', function ($scope, $location, pluginsService, $http, config) {




        //HTML AUX OBJECTS
        $scope.header = ['Company', 'Sales', 'Gain'];

        $scope.header2 = ['Company', 'Medicine', 'Pharmaceutical House','Quantity'];
        $scope.keys = ['company', 'medicine', 'pharmaceutical_house','quantity'];


        $scope.graph = {};

        $scope.items2 = [];
        $http.get(config.ip + '/api/Statistics/2')
            .success(function (result) {

                $scope.items2 = result;
                $scope.pageRecalc();

                $scope.graphData = JSON.parse(JSON.stringify($scope.items2).split('"company":').join('"label":'));
                $scope.graphData = JSON.parse(JSON.stringify($scope.graphData).split('"quantity":').join('"value":'));

                for (var i = 0; i < $scope.graphData.length; i++) {
                    $scope.graphData[i].value = $scope.graphData[i].value.toString(); ;
                    //$scope.graphData[i].color = "#58ACFA";
                }


                $scope.fillGraph();
            })
            .error(function (data, status) {

                console.log(data);

            });


        $scope.fillGraph = function () {
            $scope.graph = {
                chart: {
                    caption: "Gas Station Pharmacy",
                    subCaption: "Sales by company",
                    usePlotGradientColor: 0
                }
            };

            $scope.graph.data = $scope.graphData;
        }


        $scope.items = [];
        $http.get(config.ip + '/api/Statistics/3')
            .success(function (result) {

                $scope.items = result;
                $scope.pageRecalc();

            })
            .error(function (data, status) {

                console.log(data);

            });



        //Watcher of the select input
        $scope.$watch('select', function () {
            //Recalculate the number list for pagination
            $scope.pageRecalc();
        });


        //Select component variables
        $scope.options = [
            { value: 5 },
            { value: 10 },
            { value: 15 },
            { value: 20 },
        ];
        $scope.select = $scope.options[0]; // Default 5 rows

        //Pagination row variables
        $scope.pages = [];
        $scope.totalPages = Math.floor($scope.items.length / $scope.select.value) + 1;
        $scope.currentPage = 1;

        //Initial first of the pagination numbers
        for (var i = 1; i <= $scope.totalPages; i++) {
            $scope.pages.push(i);
        }

        //Calculates the "from" text to the pagination description
        $scope.from = function () {
            return ($scope.currentPage - 1) * $scope.select.value + 1;
        }

        //Calculates the "to" text to the pagination description
        $scope.to = function () {
            if ($scope.items.length < $scope.select.value * $scope.currentPage) {
                return $scope.items.length;
            }
            else {
                return $scope.select.value;
            }
        }
        //Recalculate the number list for pagination
        $scope.pageRecalc = function () {
            if ($scope.getDataSource().length % $scope.select.value >= 1) {
                $scope.totalPages = Math.floor($scope.getDataSource().length / $scope.select.value) + 1;
            }
            else {
                $scope.totalPages = Math.floor($scope.getDataSource().length / $scope.select.value);

            }
            $scope.pages = [];
            for (var i = 1; i <= $scope.totalPages; i++) {
                $scope.pages.push(i);
            }
            $scope.currentPage = 1;
        }

        //Function called when page is changed
        $scope.changePage = function (page) {
            $scope.currentPage = page;
        }

        //Function to determine if a row should be showed in the actual page
        $scope.showRow = function (index) {
            return ((index + 1) <= $scope.select.value * $scope.currentPage) && ((index + 1) > $scope.select.value * ($scope.currentPage - 1));
        }

        //Search bar
        $scope.search = '';
        $scope.searchObjects = [];

        //Search bar changed
        $scope.$watch('search', function () {

            if ($scope.search !== '') {
                //Cancel add new line
                $scope.newLineText = ' Add New Line'
                $scope.addingRow = false;
            }

            //Fill searchObjects with elements in role with the search term
            $scope.searchObjects = [];
            $scope.items.forEach(function (element) {
                if ($scope.checkElementMatch(element)) {

                    //Aux index to indentify element on original json array
                    var ind = $scope.items.indexOf(element);
                    element.index = ind;
                    //Add object
                    $scope.searchObjects.push(element);
                }
            });
            $scope.pageRecalc();

        });

        //Check if any property of element match with search term
        $scope.checkElementMatch = function (element) {
            for (i = 0; i < $scope.keys.length; i++) {
                if ((element[$scope.keys[i]] + "").indexOf($scope.search) !== -1) {

                    return true; //There are any field matches
                }
            }
            return false;
        }

        //Choose between original items object or items in searchObject
        $scope.getDataSource = function () {
            if ($scope.search == '') {
                return $scope.items;
            }
            else {
                return $scope.searchObjects;
            }
        }

    }]);


