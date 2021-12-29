<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

class ajaxDBQuery 
{
    // Properties
    public $pdo;
	public $sql;
	public $params;

    // Methods
    function __construct(string $db) {
	
		$db = json_decode($db, true);

		$require_path = realpath($_SERVER['DOCUMENT_ROOT']."/../../db");
		require("{$require_path}/{$db}.php");

		try {
			$this->pdo = new PDO("pgsql:host=$servername;dbname=$dbname", $username, $password);
			$this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		} catch(PDOException $e) {
			echo "Error: " . $e->getMessage();
		}
		
	}


}

?>