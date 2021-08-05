'use strict';

import { default as ajax } from "./ajaxDBQuery.js";
import { default as storageHandler } from "./../../storageHandler/js/storageHandler.js";

(function () {

	const tableCallback = (element) => {

		let table = element;
		let rows = table.querySelectorAll('tr[data-href]');

		rows.forEach(row => {
			row.addEventListener('click', () => {
				window.location.href = row.dataset.href;
			});
		});
	}

	/*
	window.tableCreate = (element, callback=()=>{}) => {
	
		let table = element;
		let tfoot = table.getElementsByClassName("table-footer")[0];
	
		tfoot.getElementsByClassName("navigation")[0].getElementsByTagName("th")[0].colSpan = table.dataset.columns.split(',').length;
		table.getElementsByClassName("currentpage")[0].addEventListener("keydown", function (event) {
			// Number 13 is the "Enter" key on the keyboard
			if (event.key === "Enter") {
				// Cancel the default action, if needed
				event.preventDefault();
				// Trigger the function
				tablePagination(table);
			}
		});
	
		ajax(table, tableTabulate);
	}
	*/

	const tableCreate = (element, callback = () => { }) => {

		let table = element;

		if (table.dataset.columns.split(",").length !== table.dataset.columnnames.split(",").length) { return null; }
		let columnArr = table.dataset.columns.split(",");
		let columnNamesArr = table.dataset.columnnames.split(",");

		if (table.dataset.order_by === '') { table.dataset.order_by = columnArr[0]; }

		let thead = document.createElement("thead");
		thead.classList.add("table-header");
		let tbody = document.createElement("tbody");
		tbody.dataset.href = table.dataset.href;
		let tfoot = document.createElement("tfoot");
		tfoot.classList.add("table-footer");

		thead.appendChild(document.createElement("tr"));
		for (var i = 0; i < columnArr.length; i++) {
			var node = document.createElement("th");
			node.setAttribute("data-column", columnArr[i]);
			var sortASC = document.createElement("button");
			sortASC.classList.add("btn", "btn-primary", "btn-xs");
			sortASC.type = "submit";
			sortASC.setAttribute("onclick", "tableSort(this);");
			sortASC.dataset.value = "ASC";
			sortASC.appendChild(document.createElement("SPAN"));
			sortASC.lastElementChild.appendChild(document.createTextNode("⇑"));
			var sortDESC = document.createElement("button");
			sortDESC.classList.add("btn", "btn-primary", "btn-xs");
			sortDESC.type = "submit";
			sortDESC.setAttribute("onclick", "tableSort(this);");
			sortDESC.dataset.value = "DESC";
			sortDESC.appendChild(document.createElement("SPAN"));
			sortDESC.lastElementChild.appendChild(document.createTextNode("⇓"));
			var textnode = document.createElement("span");
			textnode.appendChild(document.createTextNode(columnNamesArr[i]));
			// node.appendChild(sortASC);
			// node.appendChild(sortDESC);
			// node.appendChild(textnode);
			node.append(document.createTextNode(" "), sortASC, sortDESC, document.createTextNode(" "), textnode, document.createTextNode(" "));
			thead.lastElementChild.appendChild(node);
		}
		table.appendChild(thead);

		table.appendChild(tbody);

		tfoot.appendChild(document.createElement("tr"));
		var tablebuttons = document.createElement("th");
		tablebuttons.classList.add("table-buttons");
		tablebuttons.innerHTML = '<div class="btn-group">\
								<button type="button" class="btn btn-primary btn-xs" data-toggle="collapse" data-target="" aria-expanded="true" aria-controls="" onclick="tableToggle(this);">\
									<span class="glyphicon glyphicon-chevron-down" aria-hidden="true"></span>\
								</button>\
								<button type="button" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\
									<span>20</span> <span class="caret"></span>\
									<span class="sr-only">Toggle Dropdown</span>\
								</button>\
								<ul class="dropdown-menu" style="min-width:unset">\
									<li><a href="#" onclick="tableLimit(this);return false;">20</a></li>\
									<li><a href="#" onclick="tableLimit(this);return false;">50</a></li>\
									<li><a href="#" onclick="tableLimit(this);return false;">100</a></li>\
								</ul>\
							</div>';
		tfoot.lastElementChild.appendChild(tablebuttons);

		var totalrecords = document.createElement("th");
		totalrecords.classList.add("totalrecords");
		tfoot.lastElementChild.appendChild(totalrecords);

		for (var i = 3; i < columnArr.length; i++) {
			var node = document.createElement("th");
			node.innerText = "...";
			tfoot.lastElementChild.appendChild(node);
		}

		var tablebuttons = document.createElement("th");
		tablebuttons.classList.add("table-buttons");
		if (table.dataset.add == true) {
			tablebuttons.innerHTML = '<button type="button" class="btn btn-primary btn-xs" onclick="tableAddData;">\
										<span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Add\
									</button>';
		} else {
			tablebuttons.innerHTML = "...";
		}
		tfoot.lastElementChild.appendChild(tablebuttons);

		tfoot.appendChild(document.createElement("tr"));
		tfoot.lastElementChild.classList.add("navigation", "collapse");
		var navigation = document.createElement("th");
		navigation.colSpan = table.dataset.columns.split(',').length;
		navigation.innerHTML = '<nav aria-label="Page navigation" class="text-center">\
								<ul class="pagination btn-group">\
									<li class="disabled"><a href="#" data-nav="prev" onclick="tablePagination(this);return false;"><span aria-hidden="true">&laquo;</span></a></li>\
									<li class="">\
										<span type="button" class="currentpage" contenteditable="true">1</span>\
									</li>\
									<li class=""><a href="#" data-nav="next" onclick="tablePagination(this);return false;"><span aria-hidden="true">&raquo;</span></a></li>\
								</ul>\
							</nav>';
		tfoot.lastElementChild.appendChild(navigation);
		table.appendChild(tfoot);

		callback(table);
	}

	const tableLimit = (element) => {

		let table = element.closest("table");
		let button = element.closest("th").getElementsByTagName("button")[1];
		button.getElementsByTagName("span")[0].innerText = element.innerText;

		if (table.dataset.limit !== element.innerText) {
			if (parseInt(table.dataset.limit, 10) >= parseInt(table.dataset.totalrecords) && parseInt(element.innerText, 10) >= parseInt(table.dataset.totalrecords)) {
				return null;
			}
			table.dataset.limit = element.innerText;
			table.dataset.page = 1;
			table.getElementsByTagName("nav")[0].getElementsByTagName("ul")[0].firstElementChild.classList.add("disabled");
			table.getElementsByClassName("currentpage")[0].innerText = table.dataset.page;
			table.getElementsByTagName("nav")[0].getElementsByTagName("ul")[0].lastElementChild.classList.remove("disabled");
			table.setAttribute("aria-expanded", true);
			ajax(table, tableTabulate);
		}

	}

	const tablePagination = (element) => {

		let table = element.closest("table");
		let currentpage = table.dataset.page;
		let totalpages = Math.ceil(parseInt(table.dataset.totalrecords, 10) / parseInt(table.dataset.limit, 10));

		if (totalpages == 1) { table.getElementsByClassName("currentpage")[0].innerText = totalpages; return; }

		if (element.dataset.nav == "next" && parseInt(table.dataset.page, 10) < totalpages) {
			table.dataset.page = parseInt(table.dataset.page, 10) + 1;
			table.getElementsByClassName("currentpage")[0].innerText = table.dataset.page;
		} else if (element.dataset.nav == "prev" && parseInt(table.dataset.page, 10) > 1) {
			table.dataset.page = parseInt(table.dataset.page, 10) - 1;
			table.getElementsByClassName("currentpage")[0].innerText = table.dataset.page;
		} else if (table.getElementsByClassName("currentpage")[0].innerText > totalpages) {
			if (parseInt(table.dataset.page, 10) !== totalpages) {
				table.dataset.page = totalpages;
			}
			table.getElementsByClassName("currentpage")[0].innerText = totalpages;
		} else if (table.getElementsByClassName("currentpage")[0].innerText < 1) {
			if (parseInt(table.dataset.page, 10) !== 1) {
				table.dataset.page = 1;
			}
			table.getElementsByClassName("currentpage")[0].innerText = 1;
		} else {
			table.dataset.page = table.getElementsByClassName("currentpage")[0].innerText;
		}

		if (currentpage !== table.dataset.page) {
			switch (parseInt(table.dataset.page, 10)) {
				case 1:
					table.getElementsByTagName("nav")[0].getElementsByTagName("ul")[0].firstElementChild.classList.add("disabled");
					if (parseInt(table.dataset.page, 10) == totalpages) {
						table.getElementsByTagName("nav")[0].getElementsByTagName("ul")[0].lastElementChild.classList.add("disabled");
					} else {
						table.getElementsByTagName("nav")[0].getElementsByTagName("ul")[0].lastElementChild.classList.remove("disabled");
					}
					break;
				case totalpages:
					table.getElementsByTagName("nav")[0].getElementsByTagName("ul")[0].lastElementChild.classList.add("disabled");
					if (parseInt(table.dataset.page, 10) !== 1) {
						table.getElementsByTagName("nav")[0].getElementsByTagName("ul")[0].firstElementChild.classList.remove("disabled");
					}
					break;
				default:
					table.getElementsByTagName("nav")[0].getElementsByTagName("ul")[0].firstElementChild.classList.remove("disabled");
					table.getElementsByTagName("nav")[0].getElementsByTagName("ul")[0].lastElementChild.classList.remove("disabled");
			}

			ajax(table, tableTabulate);
		}
	}

	const tableSort = (element) => {

		let table = element.closest("table");

		if (table.dataset.order_by !== element.parentNode.dataset.column || table.dataset.direction !== element.dataset.value) {

			table.dataset.order_by = element.parentNode.dataset.column;
			switch (element.dataset.value) {
				case '⇓':
				case 'DESC':
				case 'desc':
					table.dataset.direction = 'DESC';
					break;
				case '⇑':
				case 'ASC':
				case 'asc':
					table.dataset.direction = 'ASC'
					break;
				default: table.dataset.direction = 'DESC';
			}
			table.dataset.page = 1;
			table.getElementsByTagName("nav")[0].getElementsByTagName("ul")[0].firstElementChild.classList.add("disabled");
			table.getElementsByClassName("currentpage")[0].innerText = table.dataset.page;
			table.getElementsByTagName("nav")[0].getElementsByTagName("ul")[0].lastElementChild.classList.remove("disabled");
			ajax(table, tableTabulate);

		}

	}

	const tableTabulate = (element, data) => {

		let table = element;
		let tfoot = table.getElementsByClassName("table-footer")[0];

		console.dir(data);
		const obj = JSON.parse(data);
		const totalrecords = obj["totalrecords"];

		let tbody = table.getElementsByTagName("tbody")[0];
		let tbodies = table.querySelectorAll("tbody");
		tbodies.forEach((value, index) => {
			if (index !== 0) { table.removeChild(value) } else { value.innerText = '' }
		});

		var rowcount = 0;
		Object.keys(obj).forEach(function (k, v) {

			if (k === "totalrecords") { return; }
			if (v === parseInt(table.dataset.preview, 10)) {
				// Always show the first preview results (default 3), add new tbody after that
				tbody.insertAdjacentElement('afterend', document.createElement('tbody'));
				if (tbody.dataset.href == "false") {
					tbody = table.getElementsByTagName("tbody")[1];
					tbody.dataset.href = "false";
				} else {
					tbody = table.getElementsByTagName("tbody")[1];
				}
				if (table.getAttribute("aria-expanded") == "true") {
					tbody.classList.add("collapse", "in");
					tbody.setAttribute("aria-expanded", true)
				} else {
					tbody.classList.add("collapse");
				}
				tbody.setAttribute("style", "border-top:0px;");
				rowcount = 0;	// New tbody, start at 0 again
			}

			var row = tbody.insertRow(rowcount);
			var cellcount = 0;
			if (tbody.dataset.href !== "false") {
				row.dataset.href = Object.keys(obj[k])[0] + ".php?" + Object.keys(obj[k])[0] + "=" + obj[k][Object.keys(obj[k])[0]];
			}

			Object.keys(obj[k]).forEach(key => {
				row.insertCell(cellcount).innerText = obj[k][key];
				cellcount++;
			});

			rowcount++;

		});

		table.dataset.totalrecords = totalrecords;
		table.getElementsByClassName("totalrecords")[0].innerText = "Total records: " + table.dataset.totalrecords;
		if (!table.dataset.limit) { table.dataset.limit = 100; }
		if (Math.ceil(parseInt(table.dataset.totalrecords, 10) / parseInt(table.dataset.limit, 10)) === 1) {
			table.getElementsByTagName("nav")[0].getElementsByTagName("ul")[0].lastElementChild.classList.add("disabled");
		}

		if (table.hasAttribute("aria-expanded")) {

			let nodes = table.getElementsByClassName("collapse");
			for (let node of nodes) {
				node.classList.add("in");
				node.setAttribute("aria-expanded", true);
			}

			let expandbutton = tfoot.getElementsByClassName("table-buttons")[0].getElementsByTagName("button")[0];
			expandbutton.classList.remove("btn-primary");
			expandbutton.classList.add("btn-secondary");
			expandbutton.firstElementChild.classList.remove("glyphicon-chevron-down");
			expandbutton.firstElementChild.classList.add("glyphicon-chevron-up");
		}

		let limitbutton = tfoot.getElementsByClassName("table-buttons")[0].getElementsByTagName("button")[1];
		limitbutton.getElementsByTagName("span")[0].innerText = table.dataset.limit;

		let navigation = tfoot.getElementsByClassName("navigation")[0];
		if (parseInt(table.dataset.limit) > totalrecords) {
			navigation.classList.add("hidden");
		} else {
			navigation.classList.remove("hidden");
		}

		tableCallback(table);
	}

	const tableToggle = (element) => {

		let table = element.closest("table");
		let nodes = table.getElementsByClassName("collapse");
		for (const node of nodes) {
			node.classList.toggle("in");
			node.toggleAttribute("aria-expanded");
		}

		element.classList.toggle("btn-primary");
		element.classList.toggle("btn-secondary");
		element.firstElementChild.classList.toggle("glyphicon-chevron-down");
		element.firstElementChild.classList.toggle("glyphicon-chevron-up");
		table.toggleAttribute("aria-expanded");

	}

	document.addEventListener('DOMContentLoaded', () => {
		const tables = document.querySelectorAll('table[data-ajax]');
		tables.forEach((table) => {

			if (table.classList.contains("table-ajax")) {
				tableCreate(table, ajax(table, tableTabulate));
			} else {
				ajax(table, tableTabulate);
			}

			table.getElementsByClassName("currentpage")[0].addEventListener("keydown", function (event) {
				// Number 13 is the "Enter" key on the keyboard
				if (event.key === "Enter") {
					// Cancel the default action, if needed
					event.preventDefault();
					// Trigger the function
					tablePagination(table);
				}
			});

		});

	});
})();
