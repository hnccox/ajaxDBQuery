'use strict';

import { default as ajax } from "./ajaxDBQuery.js";
// import { default as Map } from "./ajaxMaps.js";
import { default as storageHandler } from "./../../storageHandler/js/storageHandler.js";
import * as L from 'leaflet'; // Get's imported in Map

(function () {

	var Pages = [];

	class Page {
		constructor(element: HTMLDivElement, index: number) {
			ajax(element, this.pageTabulate.bind(this))
		}

		pageCallback(obj: Object) {
			console.log("pageCallback")
			
			if(obj[0].sitetype == 'coring' || obj[0].sitetype == 'excavation') {
				(document.getElementById("sitetype-icon") as HTMLImageElement).src = "img/sitetype_"+obj[0].sitetype+".png";
			}
		
			if(document.getElementById("lat") && document.getElementById("long")) {
				var BING_KEY: string = 'AnJ32Lw8DOlL-Ji7EhfLuc8plPJDZKYW1XY2-1Uia43MwMC2gxNYfMA7c1FyaWPX';
				var coordinates: Array<number> = [parseInt(document.getElementById("lat").innerText, 10), parseInt(document.getElementById("long").innerText, 10)];
				var map = L.map('map').setView(coordinates, 13);
				var bingLayer = L.tileLayer.bing(BING_KEY).addTo(map);
		
				var marker = L.marker(coordinates).addTo(map);
			}
			
		}

		pageTabulate = (element: HTMLDivElement, data: string) => {
			console.log("HELLO:");
			console.log(element);
			console.dir(data);

			const obj: Object = JSON.parse(data);
			const totalrecords = obj["totalrecords"];  // Should always be "1"
			const dataset = obj[0];

			Object.keys(dataset).forEach(function (key) {
				var NodeList: NodeListOf<HTMLElement> = element.querySelectorAll('[data-variable="' + key + '"]');
				NodeList.forEach(function (el: HTMLElement) {
					if (el.tagName == "INPUT") {
						if ((el as HTMLInputElement).type == "date") {
							var date = new Date(Date.parse(dataset[key]));
							dataset[key] = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
						}
						(el as HTMLInputElement).value = dataset[key];
					} else {
						el.innerHTML = dataset[key];
					}
				});
			});

			this.pageCallback(obj);

		}

		pageNext = (element: HTMLDivElement) => {
			let page: HTMLDivElement = element.closest("div[data-ajax]");
			const queryString = window.location.search;
			const urlParams = new URLSearchParams(queryString);
			const id = urlParams.get('id');
			page.dataset.selection = "WHERE id>" + id;
			page.dataset.order_by = "id";
			page.dataset.direction = "ASC";
	
			ajax(page, this.pageTabulate.bind(this));
		}
	
		pagePrev = (element) => {
			let page = element.closest("div[data-ajax]");
			const queryString = window.location.search;
			const urlParams = new URLSearchParams(queryString);
			const id = urlParams.get('id');
			page.dataset.selection = "WHERE id<" + id;
			page.dataset.order_by = "id";
			page.dataset.direction = "DESC";
	
			ajax(page, this.pageTabulate.bind(this));
		}
	}

	/*
	let dataStorage = (data) => {
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
	*/

	document.addEventListener('DOMContentLoaded', () => {
		const divs: NodeListOf<HTMLDivElement> = document.querySelectorAll('div[data-ajax]');

		divs.forEach((div: HTMLDivElement, index: number) => {
			// Check if we already have specific id in our localStorage...
			// And if data in our localStorage is still valid...
			// Else 
			Pages[index] = new Page(div, index);
			//ajax(div, pageTabulate);
			// ...and store data in our LocalStorage
		})
	});
})();
