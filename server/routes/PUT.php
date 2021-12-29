<?php

// Update existing

if(!isset($included)) {
    require_once('ajaxDBQuery.php');
}

class PUT extends ajaxDBQuery
{

    public $_PUT;

	function __construct() {

		parent::__construct($_PUT['db'], $_PUT['query']);

        $db           = $_POST['db'];
        $table        = $_POST['table'];
        $columns      = $_POST['columns'];
        $inner_join   = ((isset($_POST['inner_join']) && ($_POST['inner_join'] != '')) ? "INNER JOIN {$_POST['inner_join']}" : '');
        $where        = ((isset($_POST['where']) && !empty($_POST['where']))? "WHERE {$_POST['where']}" : '');
        $order_by     = ((isset($_POST['order_by']) && !empty($_POST['order_by'])) ? "ORDER BY {$_POST['order_by']}" : '');
        $direction    = $_POST['direction'];

        // ------------------------------------------------
        if( (isset($_POST['offset']) && isset($_POST['offset'])) && (isset($_POST['limit']) && !empty($_POST['limit'])) ) {
            $sql = "SELECT {$columns} FROM {$table} {$inner_join} {$where} {$order_by} {$direction} OFFSET :offset LIMIT :per_page";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute(['offset'=>$offset, 'per_page'=>$per_page]);
        } else if( (isset($_POST['limit']) && !empty($_POST['limit'])) ) {
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

$query = new PUT();

?>
