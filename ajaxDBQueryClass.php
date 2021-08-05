<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

/*
if(!isset($included)) {
    $json = file_get_contents("php://input");
}
*/
// $_POST = json_decode($json, true);

$require_path = "../../../../db";
require_once("{$require_path}/{$_POST['db']}.php");

class ajaxDBQuery {
    // Properties
    public $_POST;

    // Methods
    function __construct() {
        $this->db = $_POST['db'];

        try {
            $conn = new PDO("pgsql:host=$servername;dbname=$dbname", $username, $password);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $e) {
            echo "Error: " . $e->getMessage();
        }
        
    }

    function select() {
    }

    function insert() {
    }

    function update() {
    }

    function delete() {
    }

    private function return() {
        header('Content-Type: application/json');
        echo json_encode($jsonArray);
    }
}


try {
	$conn = new PDO("pgsql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // ------------------------------------------------
    $table = $_POST['table'];
    $columns = $_POST['columns'];
    $selection = $_POST['selection'];
    $order_by = ($_POST['order_by'] == '' ? $_POST['order_by'] : "ORDER BY {$_POST['order_by']}");
    $direction = $_POST['direction'];
    // ------------------------------------------------
    /* Begin Paging Info */
    $page = 1;
    if (isset($_POST['offset'])) {
      $page = filter_var($_POST['offset'], FILTER_SANITIZE_NUMBER_INT);
    }
    $per_page = 20;
    if (isset($_POST['limit'])) {
        if($_POST['limit'] == -1) {
            $per_page = 100;
        } else {
            $per_page = filter_var($_POST['limit'], FILTER_SANITIZE_NUMBER_INT);
        }
    }

    $sqlcount = "SELECT count(*) AS total_records FROM {$_POST['table']} {$selection}";
    $stmt = $conn->prepare($sqlcount);
    $stmt->execute();
    $row = $stmt->fetch();
    $total_records = $row['total_records'];
    $total_pages = ceil($total_records / $per_page);
    $offset = ($page-1) * $per_page;
  
    /* End Paging Info */
    // ------------------------------------------------
    $sql = "SELECT {$columns} FROM {$table} {$selection} {$order_by} {$direction} OFFSET :offset LIMIT :per_page";
    // $next = "SELECT * FROM cb_cat WHERE id > 450 ORDER BY id ASC OFFSET :offset LIMIT :per_page";
    // $prev = "SELECT * FROM cb_cat WHERE id < 450 ORDER BY id DESC OFFSET :offset LIMIT :per_page";
	// ------------------------------------------------
    $stmt = $conn->prepare($sql);
    //$stmt->execute();
    $stmt->execute(['offset'=>$offset, 'per_page'=>$per_page]);
    // ------------------------------------------------
	// set the resulting array to associative
	$result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
    $jsonArray = array();
    $jsonArray["totalrecords"] = $total_records;
    // $jsonArray[] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    while ( ($row = $stmt->fetch(PDO::FETCH_ASSOC) ) !== false) {
        $jsonArray[] = $row;
    }
    // ------------------------------------------------
    header('Content-Type: application/json');
    echo json_encode($jsonArray);
    // ------------------------------------------------
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
$conn = null;

?>
