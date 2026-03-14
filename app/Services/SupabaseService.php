<?php

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Support\Facades\Log;

class SupabaseService
{
    protected $client;
    protected $projectUrl;
    protected $apiKey;
    protected $anonKey;

    public function __construct()
    {
        $this->projectUrl = env('SUPABASE_PROJECT_URL');
        $this->apiKey = env('SUPABASE_ANON_KEY');
        $this->anonKey = env('SUPABASE_ANON_KEY');

        $this->client = new Client([
            'base_uri' => $this->projectUrl,
            'headers' => [
                'apikey' => $this->apiKey,
                'Authorization' => 'Bearer ' . $this->anonKey,
                'Content-Type' => 'application/json',
            ],
        ]);
    }

    /**
     * Get data from a Supabase table
     */
    public function getTable($table, $filters = [])
    {
        try {
            $query = "rest/v1/{$table}?select=*";

            if (!empty($filters)) {
                foreach ($filters as $key => $value) {
                    $query .= "&{$key}=eq.{$value}";
                }
            }

            $response = $this->client->get($query);
            return json_decode($response->getBody(), true);
        } catch (GuzzleException $e) {
            Log::error('Supabase GET error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Insert data into a Supabase table
     */
    public function insertTable($table, $data)
    {
        try {
            $response = $this->client->post("rest/v1/{$table}", [
                'json' => $data,
            ]);
            return json_decode($response->getBody(), true);
        } catch (GuzzleException $e) {
            Log::error('Supabase INSERT error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Update data in a Supabase table
     */
    public function updateTable($table, $id, $data)
    {
        try {
            $response = $this->client->patch("rest/v1/{$table}?id=eq.{$id}", [
                'json' => $data,
            ]);
            return json_decode($response->getBody(), true);
        } catch (GuzzleException $e) {
            Log::error('Supabase UPDATE error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Delete data from a Supabase table
     */
    public function deleteTable($table, $id)
    {
        try {
            $response = $this->client->delete("rest/v1/{$table}?id=eq.{$id}");
            return $response->getStatusCode() === 204;
        } catch (GuzzleException $e) {
            Log::error('Supabase DELETE error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Upload file to Supabase Storage
     */
    public function uploadFile($bucket, $path, $file)
    {
        try {
            $response = $this->client->post("storage/v1/object/{$bucket}/{$path}", [
                'body' => fopen($file, 'r'),
                'headers' => [
                    'Content-Type' => mime_content_type($file),
                ],
            ]);
            return json_decode($response->getBody(), true);
        } catch (GuzzleException $e) {
            Log::error('Supabase FILE UPLOAD error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Get public URL for a file in Supabase Storage
     */
    public function getPublicUrl($bucket, $path)
    {
        return "{$this->projectUrl}/storage/v1/object/public/{$bucket}/{$path}";
    }

    /**
     * Backup database to Supabase
     */
    public function backupDatabase()
    {
        try {
            $timestamp = now()->format('Y-m-d_H-i-s');
            $backupName = "backup_{$timestamp}.sql";
            
            // Create backup file
            $backupPath = storage_path("backups/{$backupName}");
            
            if (!is_dir(storage_path('backups'))) {
                mkdir(storage_path('backups'), 0755, true);
            }

            // Execute mysqldump
            $command = sprintf(
                'mysqldump -h %s -u %s -p%s %s > %s',
                env('DB_HOST'),
                env('DB_USERNAME'),
                env('DB_PASSWORD'),
                env('DB_DATABASE'),
                $backupPath
            );

            exec($command);

            // Upload to Supabase Storage
            $result = $this->uploadFile('backups', $backupName, $backupPath);

            // Clean up local backup
            if (file_exists($backupPath)) {
                unlink($backupPath);
            }

            return $result;
        } catch (\Exception $e) {
            Log::error('Database backup error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Sync local database with Supabase
     */
    public function syncDatabase($table, $data)
    {
        try {
            // Insert or update data in Supabase
            $response = $this->client->post("rest/v1/{$table}", [
                'json' => $data,
                'headers' => [
                    'Prefer' => 'resolution=merge-duplicates',
                ],
            ]);
            return json_decode($response->getBody(), true);
        } catch (GuzzleException $e) {
            Log::error('Supabase SYNC error: ' . $e->getMessage());
            return null;
        }
    }
}
