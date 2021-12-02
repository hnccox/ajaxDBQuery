
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

function create(sql, callback) {

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

function read(sql, callback) {

	let xhr = new XMLHttpRequest(),
		method = "GET",
		url = sql.url + "?db="+JSON.stringify(sql.db)+"&query="+JSON.stringify(sql.query);

	xhr.open(method, url, true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onreadystatechange = function () {
		if (this.readyState === XMLHttpRequest.DONE) {
			if (this.status == 200) {
				// retrieve data
				let obj = JSON.parse(this.responseText);
				callback({"type": obj.type, "status": obj.status, "statusText": obj.statusText, "data": obj.data, "message": obj.message});
			} else if (this.status >= 500) {
				// internal server error
				callback({"type": "internal server error", "status": this.status, "statusText": this.statusText});
			} else if (this.status >= 402 && this.status <= 420) {
				// error
				callback({"type": "error", "status": this.status, "statusText": this.statusText});
			} else if (this.status == 400 || this.status == 401) {
				// bad request & unauthorized error
				callback({"type": "bad request", "status": this.status, "statusText": this.statusText});
			}
		}
	}
	xhr.send();
}

function update(sql, callback) {

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

function del(sql, callback) {

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

function ajaxDBQuery(method, sql, callback = () => { }) {
	console.log("ajaxDBQuery");
	console.log(sql);
	
	if (sql.url == null || sql.db == null || sql.query[0].select.columns == null || sql.query[0].select.from.table == null) {
		callback({"type": "error", "status": "400", "message": "Bad Request"});
		return;
	} else {
		switch(method) {
			case "POST":
				create(sql, callback)
				break;
			case "GET":
				read(sql, callback)
				break;
			case "PUT":
				update(sql, callback)
				break;
			case "DELETE":
				del(sql, callback)
				break;
			
		}
	}
}

export default ajaxDBQuery;