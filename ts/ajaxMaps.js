'use strict';

import { default as ajax } from "./ajaxDBQuery.js";

(function () {

	var Maps = {};
	var Layers = {};

	let groupClick = (event) => {
		document.getElementById("boreholeID").innerText = event.layer.popup;
		console.log("Clicked on marker " + event.layer.popup);
	}

	let mapCallback = (element, data) => {

		console.log("mapCallback");

	}

	let updateLayer = (map, data) => {

		console.log("updateLayer");

		data = JSON.parse(data);
		delete data.totalrecords;
		console.log(data);  // Important

		document.getElementById("data").innerText = "ajaxreturn: " + data;

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
		// console.log(map.dataset.selection);
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

	let updateMap = (element, data) => {

		console.log("updateMap");

		let map = element;
		console.log(Maps[map]);

		/*
		var layers = [];
		Maps[map].eachLayer(function(layer) {
			if(Maps[map]._layers[layer].feature) {
				console.log(Maps[map]._layers[layer].feature)
			}
		})
		*/

		console.dir(data);
		const obj = JSON.parse(data);
		const totalrecords = obj["totalrecords"];

		console.log(Maps[map].hasLayer(Maps[map]["cities"]));

		/*
		console.log(map);
	
		var cities = L.layerGroup();
		console.log(cities);
		
	
		L.marker([map.dataset.lat, map.dataset.lng]).bindPopup('This is Littleton, CO.').addTo(cities);
	
		cities.addTo(map);
	
		console.log(cities._leaflet_id);
		
		console.log(map.hasLayer(cities));
	
		var bounds = map.getBounds();
		var xmin, ymin, xmax, ymax, srid, query;
	
		xmin = bounds._southWest.lng;
		ymin = bounds._southWest.lat;
		xmax = bounds._northEast.lng;
		ymax = bounds._northEast.lat;
		srid = 4326;
	
		console.dir(bounds);
	
		map.dataset.selection = `INNER JOIN llg_it_boreholeheader ON llg_it_geom.borehole = llg_it_boreholeheader.borehole WHERE llg_it_geom.longitude BETWEEN ${xmin} AND ${xmax} AND llg_it_geom.latitude BETWEEN ${ymin} AND ${ymax}`;
		console.log("NEW SELECTION");
		console.log(map.dataset.selection);
		console.log(map.dataset);
		*/

		mapCallback(map)

	}

	document.addEventListener('DOMContentLoaded', () => {
		const maps = document.querySelectorAll('.map[data-ajax]');

		maps.forEach((map) => {
			// Initialize map...
			// Get the map id...
			// Add id to the element.id...
			// data-db = [..,..], data-table = [..,..], data-columns = [[.., .., ..,],[.., .., ..]], data-columnNames (layerNames) = [];

			//Let's bring in our API_KEY
			// const BING_KEY = "AnJ32Lw8DOlL-Ji7EhfLuc8plPJDZKYW1XY2-1Uia43MwMC2gxNYfMA7c1FyaWPX";
			
			Maps[map] = L.map(map, {
				center: [39.73, -104.99],
				zoom: 10,
			});

			// Maps[element][layergroup]
			Maps[map]["cities"] = L.layerGroup();
			//Layers[map] = {};
			//Layers[map]["cities"] = L.layerGroup();

			L.marker([39.61, -105.02]).bindPopup('This is Littleton, CO.').addTo(Maps[map]["cities"]),
			L.marker([39.74, -104.99]).bindPopup('This is Denver, CO.').addTo(Maps[map]["cities"]),
			L.marker([39.73, -104.8]).bindPopup('This is Aurora, CO.').addTo(Maps[map]["cities"]),
			L.marker([39.77, -105.23]).bindPopup('This is Golden, CO.').addTo(Maps[map]["cities"]);


			var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
				'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
				mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaG5jY294IiwiYSI6ImNrbTlxam8wdzE1N2gycGxhN3RiNHpmODkifQ.FQmxF3Bjsb8ElMnALjgO_A';

			var grayscale = L.tileLayer(mbUrl, { id: 'mapbox/light-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr }),
				streets = L.tileLayer(mbUrl, { id: 'mapbox/streets-v11', tileSize: 512, zoomOffset: -1, attribution: mbAttr });


			grayscale.addTo(Maps[map]);
			Maps[map]["cities"].addTo(Maps[map]);

			var baseLayers = {
				"Grayscale": grayscale,
				"Streets": streets
			};

			var overlays = {
				"Cities": Maps[map]["cities"]
			};

			L.control.layers(baseLayers, overlays).addTo(Maps[map]);

			var refresh;

			Maps[map].on('dragstart', e => {
				clearTimeout(refresh);
			})
			Maps[map].on('drag', e => {
				console.log('dragging');
			})
			Maps[map].on('dragend', e => {
				refresh = setTimeout(() => { ajax(map, updateMap); }, 1500);
			})
			Maps[map].on('zoomstart', e => {
				clearTimeout(refresh);
			})
			Maps[map].on('zoom', e => {
				console.log('zooming');
			})
			Maps[map].on('zoomend', e => {
				refresh = setTimeout(() => { ajax(map, updateMap); }, 1500);
			})

			if (map.classList.contains("map-ajax")) {
				mapCreate(map, ajax(map, updateMap));
			} else {
				ajax(map, updateMap);
			}

		})
	});
})();