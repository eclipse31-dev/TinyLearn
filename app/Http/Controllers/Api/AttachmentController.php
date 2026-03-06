<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AttachmentController extends Controller
{
    /**
     * Upload a file and create an attachment record
     */
    public function upload(Request $request)
    {
        try {
            $request->validate([
                'file' => 'required|file|max:51200', // 50MB max
                'type' => 'required|in:material,assignment,submission',
            ]);

            $file = $request->file('file');
            $type = $request->input('type');

            // Generate unique filename
            $originalName = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();
            $filename = Str::slug(pathinfo($originalName, PATHINFO_FILENAME)) . '_' . time() . '.' . $extension;

            // Store file in public disk under attachments folder
            $path = $file->storeAs('attachments/' . $type, $filename, 'public');

            // Create attachment record
            $attachment = Attachment::create([
                'file_name' => $originalName,
                'file_path' => $path,
                'file_type' => $file->getMimeType(),
                'file_size' => $file->getSize(),
                'uploaded_by' => auth()->id(),
            ]);

            return response()->json([
                'message' => 'File uploaded successfully',
                'attachment' => $attachment,
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'File upload failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Download a file
     */
    public function download($id)
    {
        try {
            $attachment = Attachment::findOrFail($id);

            if (!Storage::disk('public')->exists($attachment->file_path)) {
                return response()->json([
                    'message' => 'File not found',
                ], 404);
            }

            return Storage::disk('public')->download(
                $attachment->file_path,
                $attachment->file_name
            );
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'File not found',
            ], 404);
        }
    }

    /**
     * Delete an attachment
     */
    public function destroy($id)
    {
        try {
            $attachment = Attachment::findOrFail($id);

            // Delete file from storage
            if (Storage::disk('public')->exists($attachment->file_path)) {
                Storage::disk('public')->delete($attachment->file_path);
            }

            $attachment->delete();

            return response()->json([
                'message' => 'Attachment deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Attachment not found',
            ], 404);
        }
    }

    /**
     * Get attachment details
     */
    public function show($id)
    {
        try {
            $attachment = Attachment::findOrFail($id);
            return response()->json($attachment);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Attachment not found',
            ], 404);
        }
    }
}
