'use strict';

import { default as ajax } from "./ajaxDBQuery.js";
import { default as storageHandler } from "/e107_plugins/storageHandler/js/storageHandler.js";

window.dataStorage = (data) => {
	// This seems more like a callback function...
	if (localStorage.getItem("CBcatalog") === null) {
		// Initialize localStorage
		var CBcatalog = {};
		CBcatalog[dataset.id] = dataset;
		CBcatalog['total_records'] = 1;
	} else {
		// Check if current page is already in localStorage
		// How old is current page record in localStorage?
		var CBcatalog = JSON.parse(localStorage.CBcatalog);
		CBcatalog[dataset.id] = dataset;
		CBcatalog['total_records'] = parseInt(CBcatalog['totalrecords'], 10) + 1;
		console.log(CBcatalog);
	}
	localStorage.setItem("CBcatalog", JSON.stringify(CBcatalog));
}

(function () {

	const pageCallback = (element, data) => {
		if (data[0].sitetype == 'coring' || data[0].sitetype == 'excavation') {
			document.getElementById("sitetype-icon").src = "img/sitetype_" + data[0].sitetype + ".png";
		}

		if (document.getElementById("lat") && document.getElementById("long")) {
			const BING_KEY = 'AnJ32Lw8DOlL-Ji7EhfLuc8plPJDZKYW1XY2-1Uia43MwMC2gxNYfMA7c1FyaWPX';
			let coordinates = [document.getElementById("lat").innerText, document.getElementById("long").innerText];
			let map = L.map('map').setView(coordinates, 13);
			let bingLayer = L.tileLayer.bing(BING_KEY).addTo(map);

			var marker = L.marker(coordinates).addTo(map);
		}
	}

	const pageNext = (element) => {
		let page = element.closest("div[data-ajax]");
		var queryString = window.location.search;
		let urlParams = new URLSearchParams(queryString);
		let id = urlParams.get('id');
		page.dataset.selection = "WHERE id>" + id;
		page.dataset.order_by = "id";
		page.dataset.direction = "ASC";

		ajax(page, function (element, data) {
			console.log(element, data);
		});
	}

	const pagePrev = (element) => {
		let page = element.closest("div[data-ajax]");
		var queryString = window.location.search;
		let urlParams = new URLSearchParams(queryString);
		let id = urlParams.get('id');
		page.dataset.selection = "WHERE id<" + id;
		page.dataset.order_by = "id";
		page.dataset.direction = "DESC";

		ajax(page, function (element, data) {
			console.log(element, data);
		});
	}

	const pageTabulate = (element, data) => {
		let obj = JSON.parse(data);
		let totalrecords = obj["totalrecords"];  // Should always be "1"
		let dataset = obj[0];
		Object.keys(dataset).forEach(function (key) {
			var NodeList = element.querySelectorAll('[data-variable="' + key + '"]');
			NodeList.forEach(function (el) {
				if (el.tagName == "INPUT") {
					if (el.type == "date") {
						var date = new Date(Date.parse(dataset[key]));
						dataset[key] = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
					}
					el.value = dataset[key];
				} else {
					el.innerHTML = dataset[key];
				}
			});
		});

		pageCallback(element, obj);
	}

	document.addEventListener('DOMContentLoaded', () => {
		const divs = document.querySelectorAll('div[data-ajax]');
		divs.forEach((div) => {
			// Check if we already have specific id in our localStorage...
			// And if data in our localStorage is still valid...
			// Else 
			ajax(div, pageTabulate);
			// ...and store data in our LocalStorage
		})
	});
})();
