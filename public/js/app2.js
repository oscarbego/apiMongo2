
var app = angular.module('app', []);

app.config(function($routeProvider) {
  $routeProvider
          .when('/', 
                    {
                      templateUrl: 'views/home.html'
                      ,controller: 'home'                      
                    }
           )  

           .when('/add', 
                    {
                      templateUrl: 'views/add.html'
                      ,controller: 'add'                      
                    }
           )          
          
          .otherwise({ redirectTo: '/' });
});


function home ($scope, $http) {

	console.log("Home Ctrl");

	$scope.lista = [];

	$http.get("api/tvshows").success(
		function (data) {
	
			console.log(data);
			$scope.lista = data;
		}
	);

}


function add ($scope, $http, $location) {

	console.log("Add Ctrl");

	$scope.add = function (kms) {
	
        kms.fecha = new Date();
        
		$http.post("api/kms", kms ).success(
			function (data) {
	
				console.log(data);
				//$location.path('/');   	
			}
		);	
	}
	
}

app.controller("home", home);
app.controller("add", add);


