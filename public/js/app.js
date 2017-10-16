var empresa = angular.module('empresa', ['ngResource']);


// ----- Clases -------------------------

class Accion {

    constructor() {

      console.log("Accion");
    }
}


class Alerta {

    constructor() {

      console.log("Alerta");
    }
}


class Vehiculo {


  constructor() {

    this.nombre = "";
    this.descripcion = "";

    this.placas = "";
    this.kilometraje = 0.0;

    this.acciones = [];

    console.log("Vehiculo");
  }
}

  class Procesa {

    constructor() {

      console.log("Procesa");

      this.vehiculos = [];
      this.alertasProx = [];
      this.alertas = [];
    }


    addVehiculo(v){

      this.vehiculos.push(v);
    }

    deleteVehiculo(v){

      
    }

    upDateVehiculo(v){

      
    }

    findVehiculo(id){
      
    }

    findVehiculos(){
      
      return this.vehiculos;
    }


    findAllAlertas(){
      
      return this.alertas;
    }

    findAlertasProx(){
      
      return this.alertas;
    }

  }

//---------------------------------------


empresa.config(function($routeProvider) {
  $routeProvider
          .when('/', 
                    {
                      templateUrl: 'views/home.html'
                      ,controller: 'home'                      
                    }
              )
          
          .when('/detail/:id', 
                    {
                      templateUrl: 'public/views/detail.html'
                      ,controller: 'detail'
                    })
                   
          .when('/cart', 
                    {
                      controller:  'cart',
                      templateUrl: 'public/views/cart.html'
                    })

          .when('/check', 
                    {
                      controller:  'home',
                      templateUrl: 'public/views/checkout.html'
                    })
          
          .otherwise({ redirectTo: '/' });
});




empresa.factory('storeDataFactory', function($rootScope, $http) {

    var obj = {};

    obj.products = [];
    obj.pedido = [];
    obj.car = [];
    obj.offers = [];
    obj.specialOffer =  {};
    obj.user = {};
    obj.pedido = {};
    obj.total = 0;

    var pro = new Procesa();


    var init = function(){

      console.log("---- init ------");

      var veh = new Vehiculo();
      veh.nombre = "Vehiculo de Reparto";
      veh.placas = "XYZ";
      veh.descripcion = "Una descripcion";
      veh.kilometraje = 120.67;

      pro.addVehiculo(veh);

    }

    obj.getVehiculos = function(){

      return pro.findVehiculos();
    }

    obj.getAlertas = function(){

      return pro.findAllAlertas();
    }

    obj.getAlertasProx = function(){

      return pro.findAlertasProx();
    }

    obj.login = function(usu){
        
        $http.post("/login", usu).success
        (
                function(data){                  
                    
                    obj.user = data;
                    obj.broadcastItem('usu');
                    obj.getPedido(obj.user.id);
                }
        );
    }

    obj.broadcastItem = function(event) {
      
      $rootScope.$broadcast(event);
    };

    obj.getOffers = function() {

      	if(this.offers[0])
          	return this.offers;        
          else 
          {
            $http.get("/offers").
              success(              
                function(data)
                {
                  obj.offers = data;
                  obj.broadcastItem('offers');
                }
                
              );
            
          }        
    };

    obj.getProducts = function() {
  		
        if(this.products[0])
          	return this.products;

        else {
            
          $http.get("/products").
              success(         		  
                function(data)
          		  {         
          			  obj.products = data;
                                    
                                    obj.broadcastItem('products');
          		  }
                
          	  );
        }

    };

    obj.getSpecialOffer = function() {

      	if(this.specialOffer.id)
          	return this.specialOffer;        
          else 
          {
            $http.get("/specialoffer").
              success(              
                function(data)
                {
                  obj.specialOffer = data;
                  obj.broadcastItem('specialOffer');
                }
                
              );   
          }     	
    };

    obj.getDetailById = function(id) {
  	
      	for (var i=0 ; i<=this.products.length - 1; i++) {            
      		if(this.products[i].id == id)
                      return this.products[i];       
       	} 
    };

    obj.getCar = function() {
        
        return this.car;       
    }

    obj.getPedido = function(idUsu) {
        
        $http.get("/pedidos?id=" + idUsu)
             .success(         		  
                function(data)
          		  {    
                                    obj.car = data.entradas;
                                    
                                    obj.car.iPedido = data.id;
                                    
                                    obj.total = data.total;
                                    
                                    obj.broadcastItem('newTotal');
                                    obj.broadcastItem('car');
          		  }
                
          	  );
        
    };
  
    obj.addToCar = function(idUsu, idPe, idProd, canti) {
  	
      $http.get("/addprodtopedido?idUsu=" + idUsu + "&idPe=" + idPe + "&idProd=" + idProd + "&canti=" + canti)
             .success(         		  
                function(data)
          		  {    
                                    obj.car = data.entradas;
                                    
                                    obj.car.iPedido = data.id;
                                    
                                    obj.total = data.total;
                                    
                                    obj.broadcastItem('newTotal');
                                    obj.broadcastItem('car');
          		  }
                
          	  );  
          
    };

    obj.upDateToCar = function(idUsu, idPe, idProd, canti) {

          obj.addToCar(idUsu, idPe, idProd, canti); 
    };

    obj.delFromCar = function(idUsu, idPe, idProd) {
        
        $http.get("/delprodtopedido?idUsu=" + idUsu + "&idPe=" + idPe + "&idProd=" + idProd)
             .success(         		  
                function(data)
          		  {    
                                    obj.car = data.entradas;
                                    
                                    obj.car.iPedido = data.id;
                                    
                                    obj.total = data.total;
                                    
                                    obj.broadcastItem('newTotal');
                                    obj.broadcastItem('car');
          		  }
                
          	  ); 

    };

  
    var totalizar = function(){
  		obj.total = 0;
  		var impo = 0;
  		
      	angular.forEach(obj.car, function(r) {
        		
                  if( r.cantidad == '')
  				impo = 0; 
        		else
  				impo = parseInt(r.price) * parseInt(r.cantidad);
        		
  			  obj.total+= impo;
  				
      	});
  	
  		  obj.broadcastItem('newTotal');
  	};


    init();
    return obj;
});


empresa.controller('index', function($scope, storeDataFactory) {
  
  $scope.vehiculos    = storeDataFactory.getVehiculos();
  $scope.alertas      = storeDataFactory.getAlertas();
  $scope.alertasProx  = storeDataFactory.getAlertasProx();

  console.log($scope.vehiculos);
  console.log($scope.alertas);
  console.log($scope.alertasProx);
  /*
  $scope.$on('car', function() {
        $scope.car = storeDataFactory.getCar();
  });

  $scope.$on('newTotal', function() {
        $scope.total = storeDataFactory.total;
  }); 
  */

});

empresa.controller('home', function($scope, storeDataFactory, $http) {

    $scope.specialOffer = storeDataFactory.getSpecialOffer();	    
    $scope.products = storeDataFactory.getProducts();
    $scope.offers = storeDataFactory.getOffers();
    $scope.usu = storeDataFactory.user;
    $scope.total = storeDataFactory.total;
    
    if($scope.usu.id)
        storeDataFactory.getPedido($scope.usu.id);      
    
  
    $scope.$on('specialOffer', function() {  
        $scope.specialOffer = storeDataFactory.getSpecialOffer();
    });

    $scope.$on('products', function() {  
        $scope.products = storeDataFactory.getProducts();
    });

    $scope.$on('offers', function() {  
        $scope.offers = storeDataFactory.getOffers();
    });
    
    $scope.$on('car', function() {  
        $scope.car = storeDataFactory.getCar();
    });
  	
    $scope.addToCar = function(product){
  		
  		storeDataFactory.addToCar(
                    $scope.usu.id, 
                    $scope.car.iPedido, 
                    product.id, 
                    1
                );
    }
    
    $scope.doLogin = function(usu)
    {
      
      storeDataFactory.login(usu);
    }
    
    $scope.$on('usu', function() {  
        
        $scope.usu = storeDataFactory.user;
    });
    
    $scope.$on('newTotal', function() {  
        $scope.total = storeDataFactory.total;
    });
  
});

empresa.controller('detail', function($scope, storeDataFactory, $routeParams) {

  $scope.usu = storeDataFactory.user;  
  $scope.id = $routeParams.id;
  
  $scope.detail = storeDataFactory.getDetailById($scope.id);
  $scope.detail.cantidad = 1;
  
  $scope.products = storeDataFactory.getProducts();
  $scope.specialOffer = storeDataFactory.getSpecialOffer();
  $scope.offers = storeDataFactory.getOffers();

  $scope.$on('products', function() {  
        $scope.products = storeDataFactory.getProducts();
  });

  $scope.$on('specialOffer', function() {  
        $scope.specialOffer = storeDataFactory.getSpecialOffer();
  });

  $scope.$on('offers', function() {  
        $scope.offers = storeDataFactory.getOffers();
  });
  
  $scope.$on('usu', function() {  
        $scope.usu = storeDataFactory.user;
  });


  $scope.addToCar = function(product){
  		
  		storeDataFactory.addToCar(
                    $scope.usu.id, 
                    $scope.car.iPedido, 
                    product.id, 
                    product.cantidad
                );
  }

});

empresa.controller('cart', function($scope, storeDataFactory, $location) {

  $scope.usu = storeDataFactory.user;
  
  if($scope.usu.id == null)
  {
     $location.path('/');   
  }  
  
  $scope.car = storeDataFactory.getCar();
  
  $scope.$on('car', function() {
        $scope.car = storeDataFactory.getCar();
  });
  
  $scope.specialOffer = storeDataFactory.getSpecialOffer();	    
  $scope.offers = storeDataFactory.getOffers();
  

  $scope.$on('specialOffer', function() {  
        $scope.specialOffer = storeDataFactory.getSpecialOffer();
  });
    
  $scope.$on('offers', function() {  
        $scope.offers = storeDataFactory.getOffers();
  });
  
  $scope.$on('usu', function() {  
        $scope.usu = storeDataFactory.user;
  });

  $scope.delFromCar = function(product){
      
  	storeDataFactory.delFromCar(
                    $scope.usu.id, 
                    $scope.car.iPedido, 
                    product.id
                );
  }

  $scope.upDateToCar = function(product, c){
      
  	if(c > 0 || c != null)	
            storeDataFactory.addToCar(
                $scope.usu.id, 
                $scope.car.iPedido, 
                product.id, 
                c
            );
          
  }
  
});

empresa.controller('check', function($scope, storeDataFactory) {

});