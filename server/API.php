<?php

// API Login
require_once($_SERVER['DOCUMENT_ROOT']."/class2.php");

require_once('ajaxDBQuery.php');

switch($_SERVER['REQUEST_METHOD']) {
	case "POST":
		require_once("routes/POST.php");
		break;
	case "GET":
		require_once("routes/GET.php");
		$query = new GET();
		if(!isset($included)) {
			$query->return($query->response);
		}
		break;
	case "PUT":
		require_once("routes/PUT.php");
		break;
	case "DELETE":
		require_once("routes/DELETE.php");
		break;
	default:
		exit;
}

?>