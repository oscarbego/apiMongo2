

console.log("app.js");



function getMyEventGPS(e){

	var evento = {};


	if(e != undefined)
	{

		evento.controllerId = e.controllerId;

		for (var i = 0; i < e.data.length; i++) {
			
			if(e.data[i].name == "posinfo" ){

				evento.la = e.data[i].value.lat;
				evento.lo = e.data[i].value.lon;
			}

			if(e.data[i].name == "odometer" )
				evento.odometer = e.data[i].value;
				
		}

		evento.time = e.time;

		return evento;
	}

	/*
	return  {
				"controllerId" : 0,
				"la" : 0,
				"lo": 0,
				"odometer" 0,
				"time" : ""
			}
			*/
}

function wraperMarker(eGps, txt = ""){

	return  {
            	'lat': eGps.la,
            	'lng': eGps.lo,
            	'title': txt,
          	}
}

function toMapEvents(arr, map){

	for (var i = 0; i < arr.length; i+=3) {		
		if(i == 0)
			wraperMarker ( getMyEventGPS( arr[i] ) )
		else
			if(!compareEventGPS(arr[i], arr[i + 3]))
				map.addMarker(wraperMarker ( getMyEventGPS( arr[i] ), "" + i ) );	
			
		//console.log ( wraperMarker ( getMyEventGPS( arr[i] ) ) );
		//map.addMarker(wraperMarker ( getMyEventGPS( arr[i] ) ) );
	}
}

function route(eGpsIni, eGpsFin, map, tMode = "driving", color ="#131540", sOpacity= 0.6, sWeight= 6){

	
	var ini = getMyEventGPS( eGpsIni );
	var fin = getMyEventGPS( eGpsFin );

	if(ini != undefined && fin != undefined){
		map.drawRoute(
					{
		  				origin: [ini.la, ini.lo],       // [la, lo]
		  				destination: [fin.la, fin.lo],  // [la, lo] 
		  				travelMode: tMode,
		  				strokeColor: color,
		  				strokeOpacity: sOpacity,
		  				strokeWeight: 6
					}
				);
		console.log("draw route");
	}
}

function addRoutes (arr, map) {
	
	if(arr.length > 0){
		map.addMarker(wraperMarker ( getMyEventGPS( arr[0] ) ) );
		//map.addMarker(wraperMarker ( getMyEventGPS( arr[arr.length - 1] ) ) );
	}
	
	for (var i = 0; i < arr.length; i+=4) 
		if(i < arr.length -1 ){
			route( arr[i], arr[ i + 4], map);
			//console.log(getMyEventGPS(arr[i]));
			//console.log("ok " + i + " - " + (i + 1 ) );
	}
			//setTimeout( () => {  
			//	console.log("ok " + i + " - " + (i + 1 ) ); 
			//	route( arr[i], arr[ i + 1], map);
			//}, 500 * i);

	//while(arr.length > 0)
	//	route( arr.shift(), arr.shift(), map);
}


function addRoutesAs (arr, map) {
        
	Concurrent.Thread.create(function(){
        	if(arr.length > 0){
                	map.addMarker(wraperMarker ( getMyEventGPS( arr[0] ) ) );
                	map.addMarker(wraperMarker ( getMyEventGPS( arr[arr.length - 1] ) ) );
        	}
        
        	for (var i = arr.length - 50; i < arr.length; i++) 
                	if(i < arr.length -1 && !compareEventGPS( arr[i], arr[i + 1]))
                        	route( arr[i], arr[ i + 1], map);
	});
}


function addRoutes3s (arr, map) {
	
	map.addMarker(wraperMarker ( getMyEventGPS( arr[0] ) ) );

	
	for (var i = 0; i < arr.length; i+=2) 
		if(i < arr.length -1 && !compareEventGPS( arr[i], arr[i + 2]))
			route( arr[i], arr[ i + 2], map);
}

function compareEventGPS (e1, e2) {
	
	return  getMyEventGPS(e1) != undefined && getMyEventGPS(e2) != undefined && 
			getMyEventGPS(e1).la === getMyEventGPS(e2).la && 
			getMyEventGPS(e1).lo === getMyEventGPS(e2).lo;

		/*
	if( getMyEventGPS(e1) != undefined && getMyEventGPS(e2) != undefined && 
		getMyEventGPS(e1).la === getMyEventGPS(e2).la && 
		getMyEventGPS(e1).lo === getMyEventGPS(e2).lo 
	) return true;
		*/
	
	
	//return false;
}

function addLastRoute (arr, map) {
	
	var e1 = arr[ arr.length - 1 ];
	var e2 = arr[ arr.length - 2 ];


	console.log("e1");
	console.log(e1);

	console.log("e2");
	console.log(e2);

	//if(!compareEventGPS(e1, e2))
	//	route( e1, e2, map);
		//route( arr[ arr.length -2 ], arr[ arr.length -1 ], map);
}


	//var eventoGPSParcer = getMyEventGPS(eventos[0]);

	//console.log(wraperMarker(eventoGPSParcer, "Kilometraje"));


	//toMapEvents(eventos);

	//map.setZoom(16);
	//map.setCenter(latlng.lat, latlng.lng);
	//map.addMarker(latlng);






function getGpsLatLng(e){

	var evento = getMyEventGPS(e);

	return new google.maps.LatLng(evento.la, evento.lo);
}


function addRoutesMox (arr, map) {
	
	var eventosGo = [];

	//if(arr.length > 0)
	//	map.addMarker(wraperMarker ( getMyEventGPS( arr[0] ) ) );

	for (var i = 0; i < arr.length; i++)
		eventosGo.push(getGpsLatLng(arr[i]));			

	return eventosGo;
}
