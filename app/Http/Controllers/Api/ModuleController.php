<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ModuleController extends Controller
{
    /**
     * Get all modules for a course
     */
    public function index($courseId)
    {
        try {
            $course = Course::findOrFail($courseId);
            $modules = $course->modules()
                ->orderBy('order')
                ->get()
                ->load('assessments', 'materials');

            return response()->json($modules);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Course not found',
            ], 404);
        }
    }

    /**
     * Get a specific module with its content
     */
    public function show($id)
    {
        try {
            $module = Module::with('assessments', 'materials', 'course')
                ->findOrFail($id);

            return response()->json($module);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Module not found',
            ], 404);
        }
    }

    /**
     * Create a new module for a course
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'course_ID' => 'required|integer|exists:courses,course_ID',
                'title' => 'required|string|max:255',
                'order' => 'nullable|integer|min:1',
            ]);

            // Set created_by to current user
            $validated['created_by'] = auth()->check() ? auth()->user()->user_ID : null;

            // If no order provided, set it to the next available
            if (!isset($validated['order'])) {
                $maxOrder = Module::where('course_ID', $validated['course_ID'])
                    ->max('order') ?? 0;
                $validated['order'] = $maxOrder + 1;
            }

            $module = Module::create($validated);

            return response()->json([
                'message' => 'Module created successfully',
                'module' => $module,
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error creating module',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update a module
     */
    public function update(Request $request, $id)
    {
        try {
            $module = Module::findOrFail($id);

            $validated = $request->validate([
                'title' => 'sometimes|string|max:255',
                'order' => 'sometimes|integer|min:1',
            ]);

            $module->update($validated);

            return response()->json([
                'message' => 'Module updated successfully',
                'module' => $module,
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Module not found',
            ], 404);
        }
    }

    /**
     * Delete a module
     */
    public function destroy($id)
    {
        try {
            $module = Module::findOrFail($id);
            
            // This will cascade delete all assessments and materials in this module
            $module->delete();

            return response()->json([
                'message' => 'Module deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Module not found',
            ], 404);
        }
    }
}
