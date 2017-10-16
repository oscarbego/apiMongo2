

function getMyEventGPS(e){

	var evento = {};


	if(e != undefined)
	{

		evento.controllerId = e.controllerId;

		for (var i = 0; i < e.data.length; i++) {
			
			if(e.data[i].name == "posiinfo" ){

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
	
	if(eGps != undefined)
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

	for (var i = 0; i < arr.length; i++) 
		if(i < arr.length -1 && !compareEventGPS( arr[i], arr[i + 2]))
			route( arr[i], arr[ i + 1], map);
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
	
	var e1 = arr[ arr.length -2 ];
	var e2 = arr[ arr.length -1 ];

	if(!compareEventGPS(e1, e2))
		route( e1, e2, map);
		//route( arr[ arr.length -2 ], arr[ arr.length -1 ], map);
}

