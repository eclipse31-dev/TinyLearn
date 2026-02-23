<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Resource;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class ResourceController extends Controller
{
    /**
     * Get all resources from all courses
     */
    public function allResources()
    {
        $resources = Resource::with('course')->get();
        return response()->json($resources);
    }

    /**
     * Get all resources for a course
     */
    public function index($courseId)
    {
        $course = Course::findOrFail($courseId);
        $resources = $course->resources()->get();
        return response()->json($resources);
    }

    /**
     * Store a new resource
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'course_id' => 'required|exists:courses,course_ID',
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'type' => 'required|in:link,file,image,video',
                'url' => 'nullable|url|required_if:type,link,video',
                'file' => 'nullable|file|required_if:type,file,image|mimes:pdf,doc,docx,jpg,jpeg,png,mp4,webm',
            ]);

            $resource = new Resource($validated);

            // Handle file uploads
            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $path = $file->store('resources/' . $validated['course_id'], 'public');
                
                $resource->file_path = $path;
                $resource->file_name = $file->getClientOriginalName();
                $resource->file_size = $file->getSize();
                $resource->mime_type = $file->getMimeType();
            }

            $resource->save();

            return response()->json([
                'message' => 'Resource created successfully',
                'resource' => $resource,
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    /**
     * Show a specific resource
     */
    public function show($id)
    {
        $resource = Resource::findOrFail($id);
        return response()->json($resource);
    }

    /**
     * Update a resource
     */
    public function update(Request $request, $id)
    {
        try {
            $resource = Resource::findOrFail($id);

            $validated = $request->validate([
                'title' => 'sometimes|string|max:255',
                'description' => 'nullable|string',
                'type' => 'sometimes|in:link,file,image,video',
                'url' => 'nullable|url',
                'file' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png,mp4,webm',
            ]);

            // Handle file uploads
            if ($request->hasFile('file')) {
                // Delete old file if exists
                if ($resource->file_path && Storage::disk('public')->exists($resource->file_path)) {
                    Storage::disk('public')->delete($resource->file_path);
                }

                $file = $request->file('file');
                $path = $file->store('resources/' . $resource->course_id, 'public');
                
                $validated['file_path'] = $path;
                $validated['file_name'] = $file->getClientOriginalName();
                $validated['file_size'] = $file->getSize();
                $validated['mime_type'] = $file->getMimeType();
            }

            $resource->update($validated);

            return response()->json([
                'message' => 'Resource updated successfully',
                'resource' => $resource,
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    /**
     * Delete a resource
     */
    public function destroy($id)
    {
        try {
            $resource = Resource::findOrFail($id);

            // Delete file if exists
            if ($resource->file_path && Storage::disk('public')->exists($resource->file_path)) {
                Storage::disk('public')->delete($resource->file_path);
            }

            $resource->delete();

            return response()->json([
                'message' => 'Resource deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete resource',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
