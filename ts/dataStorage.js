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
