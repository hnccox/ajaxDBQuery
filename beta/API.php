<?php

// API Login
require_once($_SERVER['DOCUMENT_ROOT']."/class2.php");

switch($_SERVER['REQUEST_METHOD']) {
    case "POST":
        require_once("POST.php");
        break;
    case "GET":
        require_once("GET.php");
        $query = new GET();
        if(!isset($included)) {
			$query->return($query->response);
		}
        break;
    case "PUT":
        require_once("PUT.php");
        break;
    case "DELETE":
        require_once("DELETE.php");
        break;
    default:
        exit;
}

?>