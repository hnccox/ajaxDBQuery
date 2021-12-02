'use strict';

// class ajaxDBQuery {
// 	constructor(element, index, object = {}) {
// 		console.log("ajaxTemplate constructor");

// 		for (const [key, value] of Object.entries(object)) {
// 			this[key] = value;
// 		}

//         //this.callbacks = callbacks;
//         this.element = element;
//         this.index = index;
//         this.dataset = {};
//         this.dataset.columns = element.dataset.columns;
//         this.dataset.order_by = element.dataset.order_by;
//         this.dataset.where = element.dataset.where;

// 	}
// }

function SELECT(element, callback) {

	let xhr = new XMLHttpRequest(),
		method = "GET",
		url = element.dataset.url;
	let data = {
		"db": element.dataset.db,
		"table": element.dataset.table,
		"columns": element.dataset.columns,
		"inner_join": element.dataset.inner_join,
		"where": element.dataset.where,
		"order_by": element.dataset.order_by,
		"direction": element.dataset.direction,
		"limit": (element.dataset.limit) ? parseInt(element.dataset.limit, 10) : 0,
		"offset": (element.dataset.offset) ? parseInt(element.dataset.offset, 10) : 0,
	};

	url = url + "?db=" + data.db + "&table=" + data.table + "&columns=" + data.columns + "&inner_join=" + data.inner_join + "&where=" + data.where + "&order_by=" + data.order_by + "&direction=" + data.direction + "&limit=" + data.limit + "&offset=" + data.offset;

	xhr.open(method, url, true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onreadystatechange = function () {
		if (this.readyState === XMLHttpRequest.DONE) {
			if (this.status == 200) {
				// retrieve data
				callback(element, this.responseText);
			} else if (this.status >= 500) {
				// internal server error
				element.innerText = this.statusText;
			} else if (this.status >= 402 && this.status <= 420) {
				// error
				element.innerText = this.statusText;
			} else if (this.status == 400 || this.status == 401) {
				// bad request & unauthorized error
				element.innerText = this.statusText;
			}
		}
	}
	xhr.send(data);
}

function INSERT(element, callback) {

	let xhr = new XMLHttpRequest(),
		method = "POST",
		url = element.dataset.url;
	let data = {
		"db": element.dataset.db,
		"table": element.dataset.table,
		"columns": element.dataset.columns,
		"inner_join": element.dataset.inner_join,
		"where": element.dataset.where,
		"order_by": element.dataset.order_by,
		"direction": element.dataset.direction,
		"limit": (element.dataset.limit) ? parseInt(element.dataset.limit, 10) : 0,
		"offset": (element.dataset.offset) ? parseInt(element.dataset.offset, 10) : 0,
	};

	xhr.open(method, url, true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onreadystatechange = function () {
		if (this.readyState === XMLHttpRequest.DONE) {
			if (this.status == 200) {
				// retrieve data
				callback(element, this.responseText);
			} else if (this.status >= 500) {
				// internal server error
				element.innerText = this.statusText;
			} else if (this.status >= 402 && this.status <= 420) {
				// error
				element.innerText = this.statusText;
			} else if (this.status == 400 || this.status == 401) {
				// bad request & unauthorized error
				element.innerText = this.statusText;
			}
		}
	}
	xhr.send(data);
}

function UPDATE(element, callback) {

	let xhr = new XMLHttpRequest(),
		method = "PUT",
		url = element.dataset.url;
	let data = {
		"db": element.dataset.db,
		"table": element.dataset.table,
		"columns": element.dataset.columns,
		"inner_join": element.dataset.inner_join,
		"where": element.dataset.where,
		"order_by": element.dataset.order_by,
		"direction": element.dataset.direction,
		"limit": (element.dataset.limit) ? parseInt(element.dataset.limit, 10) : 0,
		"offset": (element.dataset.offset) ? parseInt(element.dataset.offset, 10) : 0,
	};

	xhr.open(method, url, true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onreadystatechange = function () {
		if (this.readyState === XMLHttpRequest.DONE) {
			if (this.status == 200) {
				// retrieve data
				callback(element, this.responseText);
			} else if (this.status >= 500) {
				// internal server error
				element.innerText = this.statusText;
			} else if (this.status >= 402 && this.status <= 420) {
				// error
				element.innerText = this.statusText;
			} else if (this.status == 400 || this.status == 401) {
				// bad request & unauthorized error
				element.innerText = this.statusText;
			}
		}
	}
	xhr.send(data);
}

function DELETE(element, callback) {

	let xhr = new XMLHttpRequest(),
		method = "GET",
		url = element.dataset.url;
	let data = {
		"db": element.dataset.db,
		"table": element.dataset.table,
		"columns": element.dataset.columns,
		"inner_join": element.dataset.inner_join,
		"where": element.dataset.where,
		"order_by": element.dataset.order_by,
		"direction": element.dataset.direction,
		"limit": (element.dataset.limit) ? parseInt(element.dataset.limit, 10) : 0,
		"offset": (element.dataset.offset) ? parseInt(element.dataset.offset, 10) : 0,
	};

	url = url + "?db=" + data.db + "&table=" + data.table + "&columns=" + data.columns + "&inner_join=" + data.inner_join + "&where=" + data.where + "&order_by=" + data.order_by + "&direction=" + data.direction + "&limit=" + data.limit + "&offset=" + data.offset;

	xhr.open(method, url, true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onreadystatechange = function () {
		if (this.readyState === XMLHttpRequest.DONE) {
			if (this.status == 200) {
				// retrieve data
				callback(element, this.responseText);
			} else if (this.status >= 500) {
				// internal server error
				element.innerText = this.statusText;
			} else if (this.status >= 402 && this.status <= 420) {
				// error
				element.innerText = this.statusText;
			} else if (this.status == 400 || this.status == 401) {
				// bad request & unauthorized error
				element.innerText = this.statusText;
			}
		}
	}
	xhr.send(data);
}

function ajaxDBQuery(element, method, callback = () => { }) {
	console.log("ajaxDBQuery");
	if (element.dataset.url == null || element.dataset.db == null || element.dataset.table == null || element.dataset.columns == null) {
		element.innerText = "400 (Bad Request)";
		return;
	} else {
		switch (method) {
			case "GET":
				SELECT(element, callback);
				break;
			case "POST":
				INSERT(element, callback);
				break;
			case "PUT":
				UPDATE(element, callback);
				break;
			case "DELETE":
				DELETE(element, callback);
				break;
			default:
				return;
		}

	}
}

export default ajaxDBQuery;