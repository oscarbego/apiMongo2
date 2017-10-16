
function getMyEventGPS(e){

	var evento = {};
	//console.log("getMyEventGPS");
	//console.log(e);
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

function wraperMarker(eGps, txt = ""){

	return  {
            	'lat': eGps.la,
            	'lng': eGps.lo,
            	'title': txt,
          	}
}

function toMapEvents(arr, map){

	for (var i = 0; i < arr.length; i++) {
		
		console.log ( wraperMarker ( getMyEventGPS( arr[i] ) ) );

		map.addMarker(wraperMarker ( getMyEventGPS( arr[i] ) ) );
	}
}

function route(eGpsIni, eGpsFin, map, tMode = "driving", color ="#131540", sOpacity= 0.6, sWeight= 6){

	var ini = getMyEventGPS( eGpsIni );
	var fin = getMyEventGPS( eGpsFin );

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
}

function addRoutes (arr, map) {
	
	map.addMarker(wraperMarker ( getMyEventGPS( arr[0] ) ) );

	//for (var i = 0; i < arr.length; i++)
	for (var i = 0; i < 100; i++) 
		if(i < arr.length -1)
			route( arr[i], arr[ i + 1], map);
}


function addRoutes3s (arr, map) {
	
	map.addMarker(wraperMarker ( getMyEventGPS( arr[0] ) ) );

	console.log("arr.length: " + arr.length);

	for (var i = 0; i < arr.length; i+=2) {
		console.log("La i es " + i);
		if(i < arr.length -1 )
			route( arr[i], arr[ i + 2], map);
	}

}


function addLastRoute (arr, map) {
	
	route( arr[ arr.length -2 ], arr[ arr.length -1 ], map);
}


