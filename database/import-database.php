<?php

/**
 * Database Import Function
 * Imports the TinyLearn database structure and data from SQL dump
 */

class DatabaseImporter
{
    private $connection;
    private $host = '127.0.0.1';
    private $username = 'root';
    private $password = '';
    private $database = 'tinylearn';

    /**
     * Constructor - Initialize database connection
     */
    public function __construct($host = null, $username = null, $password = null, $database = null)
    {
        if ($host) $this->host = $host;
        if ($username) $this->username = $username;
        if ($password !== null) $this->password = $password;
        if ($database) $this->database = $database;
    }

    /**
     * Connect to MySQL server
     */
    public function connect()
    {
        try {
            $this->connection = new mysqli($this->host, $this->username, $this->password);
            
            if ($this->connection->connect_error) {
                throw new Exception("Connection failed: " . $this->connection->connect_error);
            }
            
            echo "✓ Connected to MySQL server\n";
            return true;
        } catch (Exception $e) {
            echo "✗ Error: " . $e->getMessage() . "\n";
            return false;
        }
    }

    /**
     * Create database if it doesn't exist
     */
    public function createDatabase()
    {
        try {
            $sql = "CREATE DATABASE IF NOT EXISTS `{$this->database}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";
            
            if ($this->connection->query($sql) === TRUE) {
                echo "✓ Database '{$this->database}' created/verified\n";
                return true;
            } else {
                throw new Exception($this->connection->error);
            }
        } catch (Exception $e) {
            echo "✗ Error creating database: " . $e->getMessage() . "\n";
            return false;
        }
    }

    /**
     * Select the database
     */
    public function selectDatabase()
    {
        try {
            if ($this->connection->select_db($this->database)) {
                echo "✓ Database '{$this->database}' selected\n";
                return true;
            } else {
                throw new Exception($this->connection->error);
            }
        } catch (Exception $e) {
            echo "✗ Error selecting database: " . $e->getMessage() . "\n";
            return false;
        }
    }

    /**
     * Import SQL file
     */
    public function importSQLFile($filePath)
    {
        try {
            if (!file_exists($filePath)) {
                throw new Exception("SQL file not found: {$filePath}");
            }

            $sql = file_get_contents($filePath);
            
            // Remove comments and extra whitespace
            $sql = $this->cleanSQL($sql);
            
            // Split by semicolon and execute each statement
            $statements = array_filter(explode(';', $sql));
            $count = 0;

            foreach ($statements as $statement) {
                $statement = trim($statement);
                
                if (empty($statement)) {
                    continue;
                }

                if ($this->connection->query($statement) === TRUE) {
                    $count++;
                } else {
                    echo "✗ Error executing statement: " . $this->connection->error . "\n";
                    echo "Statement: " . substr($statement, 0, 100) . "...\n";
                }
            }

            echo "✓ Imported {$count} SQL statements\n";
            return true;
        } catch (Exception $e) {
            echo "✗ Error importing SQL file: " . $e->getMessage() . "\n";
            return false;
        }
    }

    /**
     * Clean SQL content
     */
    private function cleanSQL($sql)
    {
        // Remove SQL comments
        $sql = preg_replace('/--.*$/m', '', $sql);
        $sql = preg_replace('/\/\*.*?\*\//s', '', $sql);
        
        return $sql;
    }

    /**
     * Get database statistics
     */
    public function getStatistics()
    {
        try {
            $result = $this->connection->query("SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = '{$this->database}'");
            $row = $result->fetch_assoc();
            $tableCount = $row['table_count'];

            echo "\n=== Database Statistics ===\n";
            echo "Database: {$this->database}\n";
            echo "Tables: {$tableCount}\n";

            // Get table details
            $result = $this->connection->query("SELECT TABLE_NAME, TABLE_ROWS FROM information_schema.tables WHERE table_schema = '{$this->database}' ORDER BY TABLE_NAME");
            
            echo "\nTable Details:\n";
            echo str_pad("Table Name", 30) . " | " . str_pad("Rows", 10) . "\n";
            echo str_repeat("-", 45) . "\n";

            while ($row = $result->fetch_assoc()) {
                echo str_pad($row['TABLE_NAME'], 30) . " | " . str_pad($row['TABLE_ROWS'], 10) . "\n";
            }

            return true;
        } catch (Exception $e) {
            echo "✗ Error getting statistics: " . $e->getMessage() . "\n";
            return false;
        }
    }

    /**
     * Close database connection
     */
    public function close()
    {
        if ($this->connection) {
            $this->connection->close();
            echo "✓ Database connection closed\n";
        }
    }
}

/**
 * Main execution
 */
if (php_sapi_name() === 'cli') {
    echo "\n=== TinyLearn Database Importer ===\n\n";

    $importer = new DatabaseImporter();

    // Step 1: Connect
    if (!$importer->connect()) {
        exit(1);
    }

    // Step 2: Create database
    if (!$importer->createDatabase()) {
        exit(1);
    }

    // Step 3: Select database
    if (!$importer->selectDatabase()) {
        exit(1);
    }

    // Step 4: Import SQL file
    $sqlFile = __DIR__ . '/tinylearn-dump.sql';
    if (!$importer->importSQLFile($sqlFile)) {
        exit(1);
    }

    // Step 5: Show statistics
    $importer->getStatistics();

    // Step 6: Close connection
    $importer->close();

    echo "\n✓ Database import completed successfully!\n\n";
}
