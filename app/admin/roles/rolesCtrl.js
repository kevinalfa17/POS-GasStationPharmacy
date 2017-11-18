angular.module('newApp')
    .controller('rolesCtrl', ['$scope', '$location', '$http', 'config', function ($scope, $location, $http, config) {

        $scope.model = {}; //Aux variable to manage ng-repeat scope

        $scope.editIndex = -1; //Actual row under edition

        //Temporary variables to store edition
        //$scope.editedName = '';
        //$scope.editedDescription = '';

        //Select a row when click on edit
        $scope.edit = function (index, name, desc) {
            $scope.editIndex = index;

            //Fill temp role object with original non-edited values
            $scope.model.editedName = name;
            $scope.model.editedDescription = desc;
        }

        //Save changes if there was any change
        $scope.save = function (index, name, desc, index_aux) {
            var i = 0;

            //Use normal index if there are not in a search
            if ($scope.search == '') {
                i = index;
            }
            //Use a aux index if user is searching something
            else {
                i = index_aux;
            }

            //If there are any change (original data and temporal edited dara are not equal)
            if (!($scope.model.editedName == name && $scope.model.editedDescription == desc)) {
                //Change the original object
                $scope.roles[i].name = $scope.model.editedName;
                $scope.roles[i].description = $scope.model.editedDescription;

                var post_resquest = {
                    "id_role": $scope.roles[i].id_role,
                    "name": $scope.roles[i].name,
                    "description": $scope.roles[i].description
                }



                $http.put(config.ip + '/api/Roles/' + $scope.roles[i].id_role, post_resquest)
                    .success(function (result) {

                        console.log(result);
                    })
                    .error(function (data, status) {

                        console.log(data);

                    });
            }

            $scope.editIndex = -1; //End edition
        }

        //Add row variables
        $scope.addingRow = false;
        $scope.newName = '';
        $scope.newDescription = '';
        $scope.newLineText = ' Add New Line'

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
        $scope.add = function (name, description) {
            //Verify if both fields are empty
            if (name == '' && description == '') {
                alert("New row can't be empty!");
            } else {
                //Verify if one field is empty
                if (name == '' || description == '') {
                    if (confirm("Are you sure to add row with blank fields?") == true) {
                        $scope.verifiedAdd(name, description);
                    }
                } else {
                    //No empty fields
                    $scope.verifiedAdd(name, description);
                }
            }
        }

        //Add new row after checking
        $scope.verifiedAdd = function (name, description) {
            //HTTP REQUEST HERE
            var post_resquest = {
                "name": name,
                "description": description
            }

            $http.post(config.ip + '/api/Roles', post_resquest)
                .success(function (result) {
                    console.log(result);

                    //Get new role ID
                    $http.get(config.ip + '/api/Roles')
                        .success(function (result) {
                            $scope.roles.unshift({
                                name,
                                description
                            }); //Add new role to json array
                            $scope.roles[0].id_role = result[result.length - 1].id_role;
                            $scope.pageRecalc();


                        })
                        .error(function (data, status) {

                            console.log(data);

                        });

                })
                .error(function (data, status) {
                    console.log(data);

                });

            $scope.addingRow = false;
            $scope.newName = '';
            $scope.newDescription = '';
            $scope.newLineText = ' Add New Line'

            $scope.pageRecalc();
        }

        //Cancel adding process
        $scope.cancel = function () {
            $scope.addingRow = false;
            $scope.newName = '';
            $scope.newDescription = '';
            $scope.newLineText = ' Add New Line'
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

                $http.delete(config.ip + '/api/Roles/' + $scope.roles[i].id_role)
                    .success(function (result) {

                        console.log(result);
                    })
                    .error(function (data, status) {

                        console.log(data);

                    });

                $scope.roles.splice(i, 1); //Remove from array

            }
            $scope.pageRecalc();
        }

        //Check if the row is under edition (to show input or not)
        $scope.editable = function (index) {

            return $scope.editIndex == index;
        }

        $scope.roles = [];
        $http.get(config.ip + '/api/Roles')
            .success(function (result) {
                console.log(result);
                $scope.roles = result;
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
        $scope.totalPages = Math.floor($scope.roles.length / $scope.select.value) + 1;
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
            if ($scope.roles.length < $scope.select.value * $scope.currentPage) {
                return $scope.roles.length;
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
            $scope.roles.forEach(function (element) {
                if ((element.name.indexOf($scope.search) !== -1) || (element.description.indexOf($scope.search) !== -1)) {
                    //Aux index to indentify element on original json array
                    var ind = $scope.roles.indexOf(element);
                    element.index = ind;
                    //Add object
                    $scope.searchObjects.push(element);
                }
            });
            $scope.pageRecalc();

        });

        //Choose between original roles object or roles in searchObject
        $scope.getDataSource = function () {
            if ($scope.search == '') {

                return $scope.roles;

            } else {

                return $scope.searchObjects;
            }
        }


    }]);


// TODO 
//RESPONSIVE

//Form new something