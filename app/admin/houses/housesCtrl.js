angular.module('newApp')
    .controller('housesCtrl', ['$scope', '$location', 'pluginsService', '$http', 'config', function ($scope, $location, pluginsService, $http, config) {

        $scope.model = []; //Aux variable to manage ng-repeat scope

        $scope.editIndex = -1; //Actual row under edition

        //HTML AUX OBJECTS
        $scope.header = ['Name'];
        $scope.keys = ['name'];

        $scope.newRowModels = [];
        //Create empty fields for each key
        for (i = 0; i < $scope.keys.length; i++) {
            $scope.newRowModels[i] = '';
        }


        //Add row variables
        $scope.addingRow = false;
        $scope.newLineText = ' Add New Line'

        //Start adding process
        $scope.addNewLine = function () {
            $scope.search = ''; //Cancel search

            if (!$scope.addingRow) {
                $scope.newLineText = ' Cancel Addition'
            }
            else {
                $scope.newLineText = ' Add New Line'
            }
            $scope.addingRow = !$scope.addingRow;
        }

        //Check empty fields
        $scope.add = function () {

            //Verify if all fields are empty (Empty fields = number of fields)
            if ($scope.countEmptyFields($scope.newRowModels) == $scope.keys.length) {
                alert("New row can't be empty!");
            }
            else {
                //Verify if any field is empty (Empty fields >= 1)
                if ($scope.countEmptyFields($scope.newRowModels) >= 1) {
                    if (confirm("Are you sure to add row with blank fields?") == true) {

                        $scope.verifiedAdd();
                    }
                }
                else {
                    //No empty fields
                    $scope.verifiedAdd();
                }
            }
        }

        //Count empty fields
        $scope.countEmptyFields = function (array) {
            var count = 0;
            array.forEach(function (field) {
                if (field == '') { //Field is empty
                    count = count + 1;
                }
            });
            return count;
        }

        //Add new row after checking
        $scope.verifiedAdd = function () {

            var post_resquest = {};
            //Fill json object with new values from editedModel
            for (i = 0; i < $scope.keys.length; i++) {
                post_resquest[$scope.keys[i]] = $scope.newRowModels[i];
            }

            $scope.items.unshift(post_resquest); //Add new item to json array (at the beginning of the array)

            console.log(JSON.stringify(post_resquest));
            $http.post(config.ip + '/api/PharmaceuticalHouses', post_resquest)
                .success(function (result) {
                    console.log(result);
                })
                .error(function (data, status) {
                    console.log(data);

                });

            //HTTP REQUEST HERE
            $scope.addingRow = false;
            $scope.resetNewFields();
            $scope.newLineText = ' Add New Line'

            $scope.pageRecalc();
        }


        //Cancel adding process
        $scope.cancel = function () {
            $scope.addingRow = false;
            $scope.resetNewFields();
            $scope.newLineText = ' Add New Line'
        }

        $scope.resetNewFields = function () {

            for (var i = 0; i < $scope.newRowModels.length; i++) {
                $scope.newRowModels[i] = '';
            }

        }

        //Remove a row
        $scope.remove = function (index, index_aux) {
            var i = 0;

            //Use normal index if there are not in a search
            if ($scope.search == '') {
                i = index;
            }
            //Use a aux index if user is searching something
            else {
                i = index_aux;
                $scope.searchObjects.splice(index, 1);//Remove from array

            }

            //Confirm box
            if (confirm("Are you sure to delete this row?") == true) {

                $http.delete(config.ip + '/api/PharmaceuticalHouses/' + $scope.items[i].id_pharmaceutical_house)
                    .success(function (result) {
                        console.log(result);
                    })
                    .error(function (data, status) {
                        console.log(data);
                    });

                $scope.items.splice(i, 1);//Remove from array
            }
            $scope.pageRecalc();
        }

        //Check if the row is under edition (to show input or not)
        $scope.editable = function (index) {

            return $scope.editIndex == index;
        }

        $scope.items = [];
        $http.get(config.ip + '/api/PharmaceuticalHouses')
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


