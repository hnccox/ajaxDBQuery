'use strict';

import { default as ajax } from "./ajaxDBQuery.js";
import { default as storageHandler } from "/e107_plugins/storageHandler/js/storageHandler.js";

window.groupClick = (event) => {
	document.getElementById("boreholeID").innerText = event.layer.popup;
	console.log("Clicked on marker " + event.layer.popup);
}

window.mapCallback = (element) => {

	/*
	var layers = [];
	map.eachLayer(function(layer) {
		if( layer instanceof L.TileLayer )
			layers.push(layer);
	});
	*/

	var layers = [];
	map.eachLayer(function(layer) {
		console.log(layer);
		/*
		if( layer instanceof L.FeatureGroup )
			layers.push(layer);
		*/
	});

	//console.log(L.hasLayer(myFeatureGroup));

	console.log("mapCallback");
	
	var myFeatureGroup = L.featureGroup().on("click", groupClick);
	var marker;

	data = JSON.parse(data);
	delete data.totalrecords;
	console.log(data);  // Important

	for (const [key, value] of Object.entries(data)) {
		marker = L.marker([value.latitude, value.longitude]).addTo(myFeatureGroup);
		marker.popup = value.borehole;
	}
	myFeatureGroup.addTo(map);

}

window.mapCreate = (element) => {
}

window.mapLimit = (element) => {

}

window.updateMap = (map, data) => {

	console.log("updateMap");

	var bounds = map.getBounds();
	var xmin, ymin, xmax, ymax, srid, query;

	xmin = bounds._southWest.lng;
	ymin = bounds._southWest.lat;
	xmax = bounds._northEast.lng;
	ymax = bounds._northEast.lat;
	srid = 4326;
	// console.log(dataset.db);
	// SELECT * FROM llg_it_geom INNER JOIN llg_it_boreholedata ON llg_it_geom.borehole = llg_it_boreholedata.borehole WHERE llg_it_geom.borehole=601211001
	// map.dataset.selection = `INNER JOIN llg_it_boreholeheader ON llg_it_geom.borehole = llg_it_boreholeheader.borehole WHERE llg_it_geom.geom && ST_Transform(ST_MakeEnvelope(${xmin}, ${ymin}, ${xmax}, ${ymax}, ${srid}), ${srid})`;

	console.log("SELECTION");
	console.log(map.dataset.selection);
	// console.log(element.dataset.selection);
	// element.dataset.selection = `INNER JOIN llg_it_boreholeheader ON llg_it_geom.borehole = llg_it_boreholeheader.borehole WHERE llg_it_geom.borehole=601211001`;
	// console.log(element.dataset);
	// query = `SELECT ${element.dataset.columns} FROM ${element.dataset.table} WHERE llg_it_geom.geom && ST_Transform(ST_MakeEnvelope(${xmin}, ${ymin}, ${xmax}, ${ymax}, ${srid}), ${srid})`;
	// query = `SELECT ${element.dataset.columns} FROM ${element.dataset.table} ${element.dataset.selection}`;
	map.dataset.selection = `INNER JOIN llg_it_boreholeheader ON llg_it_geom.borehole = llg_it_boreholeheader.borehole WHERE llg_it_geom.longitude BETWEEN ${xmin} AND ${xmax} AND llg_it_geom.latitude BETWEEN ${ymin} AND ${ymax}`;
	console.log(map.dataset.selection);
	// console.log(query);
	console.dir(bounds);
	mapCallback(map);

	// ajax(map, mapCallback);

}

(function () {
	document.addEventListener('DOMContentLoaded', () => {
		const maps = document.querySelectorAll('.map[data-ajax]');
		maps.forEach(element => {

			if(element.classList.contains("map-ajax")) {
				mapCreate(element, ajax(element, updateMap));
			} else {
				ajax(element, updateMap);
			}

			//Let's bring in our API_KEY
			const BING_KEY = "AnJ32Lw8DOlL-Ji7EhfLuc8plPJDZKYW1XY2-1Uia43MwMC2gxNYfMA7c1FyaWPX";

			// let map;
			let marker;
			let refresh;

			var littleton = L.marker([39.61, -105.02]).bindPopup('This is Littleton, CO.'),
				denver    = L.marker([39.74, -104.99]).bindPopup('This is Denver, CO.'),
				aurora    = L.marker([39.73, -104.8]).bindPopup('This is Aurora, CO.'),
				golden    = L.marker([39.77, -105.23]).bindPopup('This is Golden, CO.');
	
			var cities = L.layerGroup([littleton, denver, aurora, golden]);

			var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
			var mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

			var grayscale = L.tileLayer(mbUrl, {id: 'MapID', tileSize: 512, zoomOffset: -1, attribution: mbAttr}),
				streets   = L.tileLayer(mbUrl, {id: 'MapID', tileSize: 512, zoomOffset: -1, attribution: mbAttr});

			var map = L.map(element, {
				center: [39.73, -104.99],
				zoom: 10,
				layers: [grayscale, cities]
			});

			//map = L.map(element).setView([element.dataset.lat, element.dataset.lng], 13).layers([grayscale, boreholes]);

			var baseMaps = {
				"Grayscale": grayscale,
				"Streets": streets
			};
			
			var overlayMaps = {
				"Cities": cities
			};

			L.control.layers(baseMaps, overlayMaps).addTo(map);

			console.log(map.getBounds());
			// TODO: Make the query selection based on the bounds
			// marker = L.marker([element.dataset.lat, element.dataset.lng]).addTo(map);
			
			let bingLayer = L.tileLayer.bing(BING_KEY).addTo(map);

			map.dataset = element.dataset;

			map.on('dragstart', e => {
				clearTimeout(refresh);
			})
			map.on('drag', e => {
				console.log('dragging');
			})
			map.on('dragend', e => {
				refresh = setTimeout( () => { updateMap(map); } , 1500);
			})
			map.on('zoomstart', e => {
				clearTimeout(refresh);
			})
			map.on('zoom', e => {
				console.log('zooming');
			})
			map.on('zoomend', e => {
				refresh = setTimeout( () => { updateMap(map); } , 1500);
			})

			// ajax(map, mapCallback);

		})
		//Let's declare our Gmap and Gmarker variables that will hold the Map and Marker Objects later on
		//let map;
		//let marker;

		// var coordinates = [51.85806679, 5.190495399];

	});
})();