'use strict';

import { default as ajax } from "./ajaxDBQuery.js";
import { default as storageHandler } from "/e107_plugins/storageHandler/js/storageHandler.js";

(function () {

    const menuTabulate = (element, data) => {

        let obj = JSON.parse(data);
        let { totalrecords, ...dataset } = obj;

        var node = document.createElement("UL");
        node.style.listStyleType = "none";
        element.appendChild(node);

        Object.keys(dataset).forEach(function (key) {
            if (parseInt(dataset[key].id, 10) % 10 == 0) {
                element.lastElementChild.appendChild(document.createElement("BR"));
                var node = document.createElement("LI");
                var textnode = document.createTextNode(dataset[key].displayname);
                node.appendChild(textnode);
                node.style.fontSize = "2rem";
                node.setAttribute("data-systemgrp", dataset[key].id);
                node.onclick = function (e) {
                    e.stopPropagation();
                    var elements = this.closest('div[menu-ajax]').querySelectorAll(".active");
                    for (let elem of elements) {
                        elem.classList.remove("active");
                    }
                    this.classList.add("active");
                    let title = document.querySelectorAll('h1.table-ajax')[0];
                    title.innerText = dataset[key].displayname;
                    let table = document.querySelectorAll('table[data-ajax]')[0];
                    table.setAttribute("data-selection", "WHERE systemgrp BETWEEN " + dataset[key].id + " AND " + parseInt(dataset[key].id + 9, 10));
                    table.innerHTML = "";
                    window.tableCreate(table, ajax(table, tableTabulate));
                };
                element.lastElementChild.appendChild(node);
            } else {
                if (parseInt(dataset[key].id, 10) % 10 == 1) {
                    var node = document.createElement("UL");
                    element.lastElementChild.lastElementChild.appendChild(node);
                }
                var node = document.createElement("LI");
                var textnode = document.createTextNode(dataset[key].displayname);
                node.appendChild(textnode);
                node.style.fontSize = "1.5rem";
                node.setAttribute("data-systemgrp", dataset[key].id);
                node.onclick = function (e) {
                    e.stopPropagation();
                    var elements = this.closest('div[menu-ajax]').querySelectorAll(".active");
                    for (let elem of elements) {
                        elem.classList.remove("active");
                    }
                    this.classList.add("active");
                    let title = document.querySelectorAll('h1.table-ajax')[0];
                    title.innerText = dataset[key].displayname;
                    let table = document.querySelectorAll('table[data-ajax]')[0];
                    table.setAttribute("data-selection", "WHERE systemgrp=" + dataset[key].id);
                    table.innerHTML = "";
                    window.tableCreate(table, ajax(table, tableTabulate));
                };
                element.lastElementChild.lastElementChild.lastElementChild.appendChild(node);
            }
        });

    }

    document.addEventListener('DOMContentLoaded', () => {
        let divs = document.querySelectorAll('div[menu-ajax]');
        divs.forEach((div) => {
            // Check if we already have specific id in our localStorage...
            // And if data in our localStorage is still valid...
            // Else 
            ajax(div, menuTabulate);
            // And store data in our LocalStorage
            // console.log(div);
        });
    });
})();
