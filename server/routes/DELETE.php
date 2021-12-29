<?php

// Delete existing

if(!isset($included)) {
    require_once('ajaxDBQuery.php');
}

class DELETE extends ajaxDBQuery
{

	function __construct() {
		parent::__construct($_GET['db']);

        $db           = $_GET['db'];
        $table        = $_GET['table'];
        $columns      = $_GET['columns'];
        $inner_join   = ((isset($_GET['inner_join']) && ($_GET['inner_join'] != '')) ? "INNER JOIN {$_GET['inner_join']}" : '');
        $where        = ((isset($_GET['where']) && !empty($_GET['where']))? "WHERE {$_GET['where']}" : '');
        $order_by     = ((isset($_GET['order_by']) && !empty($_GET['order_by'])) ? "ORDER BY {$_GET['order_by']}" : '');
        $direction    = $_GET['direction'];

        // ------------------------------------------------
        if( (isset($_GET['offset']) && isset($_GET['offset'])) && (isset($_GET['limit']) && !empty($_GET['limit'])) ) {
            $sql = "SELECT {$columns} FROM {$table} {$inner_join} {$where} {$order_by} {$direction} OFFSET :offset LIMIT :per_page";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute(['offset'=>$offset, 'per_page'=>$per_page]);
        } else if( (isset($_GET['limit']) && !empty($_GET['limit'])) ) {
            $sql = "SELECT {$columns} FROM {$table} {$inner_join} {$where} {$order_by} {$direction} LIMIT :per_page";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute(['per_page'=>$per_page]);        
        } else {
            $sql = "SELECT {$columns} FROM {$table} {$inner_join} {$where} {$order_by} {$direction}";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute();
        }
        // ------------------------------------------------
        // set the resulting array to associative
        $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $jsonArray = array();
        $jsonArray["totalrecords"] = $total_records;
        while ( ($row = $stmt->fetch(PDO::FETCH_ASSOC) ) !== false) {
            $jsonArray[] = $row;
        }
	    // ------------------------------------------------
        $this->return($jsonArray);
	    // ------------------------------------------------
    }

    private function return($jsonArray) {
        header('Content-Type: application/json');
        echo json_encode($jsonArray);
    }

}

$query = new DELETE();

?>
