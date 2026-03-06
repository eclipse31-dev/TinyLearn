<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\Module;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;

class MaterialController extends Controller
{
    /**
     * Get all materials for a course (through modules)
     */
    public function getByCourse($courseId)
    {
        try {
            // Get all modules for the course, then get their materials
            $materials = Material::with(['attachment', 'module'])
                ->whereHas('module', function ($query) use ($courseId) {
                    $query->where('course_ID', $courseId);
                })
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json($materials);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching materials',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get all materials for a specific module
     */
    public function index($moduleId)
    {
        try {
            $module = Module::findOrFail($moduleId);
            $materials = $module->materials()
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json($materials);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Module not found',
            ], 404);
        }
    }

    /**
     * Store a new material for a module
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'module_ID' => 'required|integer|exists:modules,module_ID',
                'materials_type' => 'required|in:video,document,link',
                'content' => 'nullable|string',
                'attachment_ID' => 'nullable|integer|exists:attachments,attachment_ID',
            ]);

            // Set created_by to current user
            $validated['created_by'] = auth()->check() ? auth()->user()->user_ID : null;

            $material = Material::create($validated);

            return response()->json([
                'message' => 'Material created successfully',
                'material' => $material,
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error creating material',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display a specific material
     */
    public function show($id)
    {
        try {
            $material = Material::findOrFail($id);
            return response()->json($material);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Material not found',
            ], 404);
        }
    }

    /**
     * Update a material
     */
    public function update(Request $request, $id)
    {
        try {
            $material = Material::findOrFail($id);

            $validated = $request->validate([
                'materials_type' => 'sometimes|in:video,document,link',
                'content' => 'nullable|string',
                'attachment_ID' => 'nullable|integer|exists:attachments,attachment_ID',
            ]);

            $material->update($validated);

            return response()->json([
                'message' => 'Material updated successfully',
                'material' => $material,
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Material not found',
            ], 404);
        }
    }

    /**
     * Delete a material
     */
    public function destroy($id)
    {
        try {
            $material = Material::findOrFail($id);
            
            // Delete associated attachment if exists
            if ($material->attachment_ID && $material->attachment_ID != null) {
                $attachment = $material->attachment();
                if ($attachment) {
                    // Delete file from storage if needed
                    if ($attachment->file_path && Storage::disk('public')->exists($attachment->file_path)) {
                        Storage::disk('public')->delete($attachment->file_path);
                    }
                    $attachment->delete();
                }
            }

            $material->delete();

            return response()->json([
                'message' => 'Material deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Material not found',
            ], 404);
        }
    }
}
