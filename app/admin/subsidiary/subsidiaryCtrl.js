angular.module('newApp')
    .controller('subsidiaryCtrl', ['$scope', '$location', 'config', '$http', function ($scope, $location, config, $http) {

        $scope.model = []; //Aux variable to manage ng-repeat scope

        $scope.editIndex = -1; //Actual row under edition

        //HTML AUX OBJECTS
        $scope.header = ['Name', 'Description', 'Company', 'Medicines'];
        $scope.keys = ['name', 'description', 'company_name'];

        $scope.newRowModels = [];
        //Create empty fields for each key
        for (i = 0; i < $scope.keys.length; i++) {
            $scope.newRowModels[i] = '';
        }

        //SELECTS
        //companies
        $scope.companies = [];
        $http.get(config.ip + '/api/Companies')
            .success(function (result) {
                $scope.companies = result;
                $scope.newRowModels[2] = $scope.companies[0]; // Default
            })
            .error(function (data, status) {
                console.log(data);
            });

        //employees
        $scope.employees = [];
        $http.get(config.ip + '/api/Employees')
            .success(function (result) {
                $scope.employees = result;
            })
            .error(function (data, status) {
                console.log(data);
            });


        //Select a row when click on edit
        $scope.edit = function () {
            $scope.editIndex = arguments[0];

            //Assign arguments data (values previous edition) to the editedModel
            for (i = 1; i < arguments.length; i++) {
                $scope.model[i - 1] = arguments[i];
            }

            //Select aux
            $scope.model[2] = $scope.getSelectObject(arguments[3], $scope.companies);


        }

        //Save changes if there was any change
        $scope.save = function () {
            var i = 0;

            //Use normal index if there are not in a search
            if ($scope.search == '') {
                i = arguments[0];
            }
            //Use a aux index if user is searching something
            else {
                i = arguments[arguments.length - 1];
            }

            //If there are any change (original data and temporal edited daTa are not equal)
            if ($scope.checkUnchangedFields.apply(this, arguments)) {

                var put_resquest = {};
                //Change the original object
                for (j = 0; j < $scope.keys.length; j++) {
                    $scope.items[i][$scope.keys[j]] = $scope.model[j]; //Item in JSON = Modified value in Edited model
                    put_resquest[$scope.keys[j]] = $scope.model[j];
                }

                //Aux keys (Add manually)
                put_resquest.company_name = "";
                put_resquest.medicines = [];
                put_resquest.id_subsidiary = $scope.items[i].id_subsidiary;

                //Select aux
                put_resquest.company = $scope.model[2].id_company;
                $scope.items[i]['company'] = $scope.model[2].id_company;

                console.log(JSON.stringify(put_resquest));
                $http.put(config.ip + '/api/Subsidiaries/' + $scope.items[i].id_subsidiary, put_resquest)
                    .success(function (result) {
                        console.log(result);
                    })
                    .error(function (data, status) {
                        console.log(data);
                    });
            }

            $scope.editIndex = -1; //End edition
        }

        //Check if any field was modified
        $scope.checkUnchangedFields = function () {
            for (i = 1; i < arguments.length - 1; i++) { //Start in 1 and ends in lenght -1 to ignore index and index_aux
                if ($scope.model[i - 1] !== arguments[i]) {
                    return true; //There are any field which changes
                }
            }
            return false;
        }


        //Add row variables
        $scope.addingRow = false;
        $scope.newLineText = ' Add New Line';

        //Start adding process
        $scope.addNewLine = function () {
            $scope.search = ''; //Cancel search

            if (!$scope.addingRow) {
                $scope.newLineText = ' Cancel Addition'
            } else {
                $scope.newLineText = ' Add New Line'
            }
            $scope.addingRow = !$scope.addingRow;
        }

        //Check empty fields
        $scope.add = function () {

            //Verify if all fields are empty (Empty fields = number of fields)
            if ($scope.countEmptyFields($scope.newRowModels) == $scope.keys.length) {
                alert("New row can't be empty!");
            } else {
                //Verify if any field is empty (Empty fields >= 1)
                if ($scope.countEmptyFields($scope.newRowModels) >= 1) {
                    if (confirm("Are you sure to add row with blank fields?") == true) {

                        $scope.verifiedAdd();
                    }
                } else {
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
            //Aux keys 
            post_resquest.company_name = "";
            post_resquest.id_subsidiary = 1000;

            //Select aux
            post_resquest.company = $scope.newRowModels[2].id_company;


            $http.post(config.ip + '/api/Subsidiaries', post_resquest)
                .success(function (result) {
                    console.log(result);

                    //Get new subsidiary ID
                    $http.get(config.ip + '/api/Subsidiaries')
                        .success(function (result) {
                            $scope.items.unshift(post_resquest); //Add new item to json array (at the beginning of the array)
                            $scope.items[0].id_subsidiary = result[result.length - 1].id_subsidiary;
                            $scope.pageRecalc();


                        })
                        .error(function (data, status) {

                            console.log(data);

                        });

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
                $scope.searchObjects.splice(index, 1); //Remove from array

            }

            //Confirm box
            if (confirm("Are you sure to delete this row?") == true) {

                $http.delete(config.ip + '/api/Subsidiaries/' + $scope.items[i].id_subsidiary)
                    .success(function (result) {
                        console.log(result);
                    })
                    .error(function (data, status) {
                        console.log(data);
                    });

                $scope.items.splice(i, 1); //Remove from array

            }
            $scope.pageRecalc();
        }

        //Check if the row is under edition (to show input or not)
        $scope.editable = function (index) {

            return $scope.editIndex == index;
        }

        $scope.items = [];
        $http.get(config.ip + '/api/Subsidiaries')
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
        $scope.options = [{
                value: 5
            },
            {
                value: 10
            },
            {
                value: 15
            },
            {
                value: 20
            },
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
            } else {
                return $scope.select.value;
            }
        }
        //Recalculate the number list for pagination
        $scope.pageRecalc = function () {
            if ($scope.getDataSource().length % $scope.select.value >= 1) {
                $scope.totalPages = Math.floor($scope.getDataSource().length / $scope.select.value) + 1;
            } else {
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
            } else {
                return $scope.searchObjects;
            }
        }

        $scope.formatDate = function (date) {
            var aux_date = date.split("-");

            var new_date = aux_date[2] + "/" + aux_date[1] + "/" + aux_date[0];
            return new_date;
        }


        //This function check value in json array and return the object-name which matches 
        $scope.getSelectName = function (value, array) {

            for (i = 0; i < array.length; i++) { //Iterate over array
                var obj = array[i];
                for (var key in obj) { //Check each key
                    if (obj.hasOwnProperty(key)) {
                        if (obj[key] == value) { //Matches!
                            return obj["name"];
                        }
                    }
                }

            }

            return "Desconocido";

        }

        //This function check value in json array and return the object-name which matches 
        $scope.getSelectName2 = function (value, array) {

            for (i = 0; i < array.length; i++) { //Iterate over array
                var obj = array[i];
                for (var key in obj) { //Check each key
                    if (obj.hasOwnProperty(key)) {

                        if (obj[key] == value) { //Matches!
                            return obj["first_name"];
                        }
                    }
                }

            }

            return "Desconocido";

        }

        //This function check value in json array and return the object which matches 
        $scope.getSelectObject = function (value, array) {

            for (i = 0; i < array.length; i++) { //Iterate over array
                var obj = array[i];
                for (var key in obj) { //Check each key
                    if (obj.hasOwnProperty(key)) {

                        if (obj[key] + "" == value + "") { //Matches!
                            return obj;
                        }
                    }
                }

            }

            return value;

        }




    }]);

//TODO
//Reportes
//recetas