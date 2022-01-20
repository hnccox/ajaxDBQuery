
'use strict';

function create(method, sql, callback) {

	let xhr = new XMLHttpRequest(),
		url = sql.url;
	let data = {
		"db": JSON.stringify(sql.db),
		"query": JSON.stringify(sql.query)
	};

	xhr.open(method, url, true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.onreadystatechange = function () {
		if (this.readyState === XMLHttpRequest.DONE) {
			if (this.status == 200) {
				// retrieve data
				let obj = JSON.parse(this.responseText);
				callback({ "type": obj.type, "status": obj.status, "statusText": obj.statusText, "data": obj.data, "message": obj.message });
			} else if (this.status >= 500) {
				// internal server error
				callback({ "type": "internal server error", "status": this.status, "statusText": this.statusText });
			} else if (this.status >= 402 && this.status <= 420) {
				// error
				callback({ "type": "error", "status": this.status, "statusText": this.statusText });
			} else if (this.status == 400 || this.status == 401) {
				// bad request & unauthorized error
				callback({ "type": "bad request", "status": this.status, "statusText": this.statusText });
			}
		}
	}
	xhr.send(data);
}

function read(method, sql, callback) {
	console.log(sql);

	let xhr = new XMLHttpRequest(),
		url = sql.url;
	if (sql.db) { url += "?db=" + JSON.stringify(sql.db) }
	if (sql.query) { url += "&query=" + JSON.stringify(sql.query) }

	xhr.open(method, url, true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onreadystatechange = function () {
		if (this.readyState === XMLHttpRequest.DONE) {
			if (this.status == 200) {
				// retrieve data
				//console.log(this.responseText);
				let obj = JSON.parse(this.responseText);
				callback({ "type": obj.type || "success", "status": obj.status || this.status, "statusText": obj.statusText || this.statusText, "data": obj.data || {}, "message": obj.message || "Retrieved data successfully" });
			} else if (this.status >= 500) {
				// internal server error
				callback({ "type": "internal server error", "status": this.status, "statusText": this.statusText });
			} else if (this.status >= 402 && this.status <= 420) {
				// error
				callback({ "type": "error", "status": this.status, "statusText": this.statusText });
			} else if (this.status == 400 || this.status == 401) {
				// bad request & unauthorized error
				callback({ "type": "bad request", "status": this.status || 400, "statusText": this.statusText });
			}
		}
	}
	xhr.send();
}

function update(method, sql, callback) {

	let xhr = new XMLHttpRequest(),
		url = sql.url;
	let data = {
		"db": JSON.stringify(sql.db),
		"query": JSON.stringify(sql.query)
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

function del(method, sql, callback) {

	let xhr = new XMLHttpRequest(),
		url = sql.url;
	let data = {
		"db": JSON.stringify(sql.db),
		"query": JSON.stringify(sql.query)
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

function ajaxDBQuery(method, sql, callback = () => { }) {
	console.log("ajaxDBQuery");

	if (sql.url == null) {
		callback({ "type": "error", "status": "400", "message": "Bad Request" });
		return;
	} else {
		switch (method) {
			case "POST":
				create(method, sql, callback)
				break;
			case "GET":
				read(method, sql, callback)
				break;
			case "PUT":
				update(method, sql, callback)
				break;
			case "DELETE":
				del(method, sql, callback)
				break;

		}
	}
}

export default ajaxDBQuery;