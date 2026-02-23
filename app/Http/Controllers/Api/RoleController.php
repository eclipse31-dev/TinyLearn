<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\UserRole;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class RoleController extends Controller
{
    /**
     * Get all roles
     */
    public function index()
    {
        $roles = Role::with('userRoles')->get();
        return response()->json($roles);
    }

    /**
     * Get a specific role
     */
    public function show($id)
    {
        $role = Role::with('userRoles', 'users')->findOrFail($id);
        return response()->json($role);
    }

    /**
     * Create a new role
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:roles',
                'description' => 'nullable|string',
            ]);

            $role = Role::create($validated);

            return response()->json([
                'message' => 'Role created successfully',
                'role' => $role,
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    /**
     * Update a role
     */
    public function update(Request $request, $id)
    {
        try {
            $role = Role::findOrFail($id);

            $validated = $request->validate([
                'name' => 'sometimes|string|max:255|unique:roles,name,' . $id,
                'description' => 'nullable|string',
            ]);

            $role->update($validated);

            return response()->json([
                'message' => 'Role updated successfully',
                'role' => $role,
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    /**
     * Delete a role
     */
    public function destroy($id)
    {
        try {
            $role = Role::findOrFail($id);
            $role->delete();

            return response()->json(['message' => 'Role deleted successfully']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete role',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
