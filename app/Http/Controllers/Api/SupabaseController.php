<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SupabaseService;
use Illuminate\Http\Request;

class SupabaseController extends Controller
{
    protected $supabaseService;

    public function __construct(SupabaseService $supabaseService)
    {
        $this->supabaseService = $supabaseService;
    }

    /**
     * Backup database to Supabase
     */
    public function backupDatabase(Request $request)
    {
        try {
            $result = $this->supabaseService->backupDatabase();
            
            if ($result) {
                return response()->json([
                    'message' => 'Database backed up successfully',
                    'backup' => $result,
                ]);
            }

            return response()->json([
                'error' => 'Failed to backup database',
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Sync data to Supabase
     */
    public function syncData(Request $request)
    {
        try {
            $validated = $request->validate([
                'table' => 'required|string',
                'data' => 'required|array',
            ]);

            $result = $this->supabaseService->syncDatabase(
                $validated['table'],
                $validated['data']
            );

            if ($result) {
                return response()->json([
                    'message' => 'Data synced successfully',
                    'data' => $result,
                ]);
            }

            return response()->json([
                'error' => 'Failed to sync data',
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get public URL for a file
     */
    public function getFileUrl(Request $request)
    {
        try {
            $validated = $request->validate([
                'bucket' => 'required|string',
                'path' => 'required|string',
            ]);

            $url = $this->supabaseService->getPublicUrl(
                $validated['bucket'],
                $validated['path']
            );

            return response()->json([
                'url' => $url,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Upload file to Supabase Storage
     */
    public function uploadFile(Request $request)
    {
        try {
            $validated = $request->validate([
                'bucket' => 'required|string',
                'path' => 'required|string',
                'file' => 'required|file',
            ]);

            $file = $validated['file'];
            $result = $this->supabaseService->uploadFile(
                $validated['bucket'],
                $validated['path'],
                $file->getRealPath()
            );

            if ($result) {
                $publicUrl = $this->supabaseService->getPublicUrl(
                    $validated['bucket'],
                    $validated['path']
                );

                return response()->json([
                    'message' => 'File uploaded successfully',
                    'url' => $publicUrl,
                    'data' => $result,
                ]);
            }

            return response()->json([
                'error' => 'Failed to upload file',
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get data from Supabase table
     */
    public function getTableData(Request $request)
    {
        try {
            $validated = $request->validate([
                'table' => 'required|string',
                'filters' => 'nullable|array',
            ]);

            $data = $this->supabaseService->getTable(
                $validated['table'],
                $validated['filters'] ?? []
            );

            return response()->json([
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
