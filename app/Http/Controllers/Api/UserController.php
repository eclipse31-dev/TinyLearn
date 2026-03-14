<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with('roles');

        // Search by name or email
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('FName', 'like', "%$search%")
                  ->orWhere('LName', 'like', "%$search%")
                  ->orWhere('email', 'like', "%$search%")
                  ->orWhere('username', 'like', "%$search%");
            });
        }

        // Filter by role
        if ($request->has('role')) {
            $query->whereHas('roles', function ($q) use ($request) {
                $q->where('role', $request->role);
            });
        }

        // Filter by status
        if ($request->has('status')) {
            $status = $request->status === 'active' ? 1 : 0;
            $query->where('is_active', $status);
        }

        // Sort
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 15);
        return $query->paginate($perPage);
    }

    public function show($id)
    {
        $user = User::with('roles')->findOrFail($id);
        return response()->json($user);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'FName' => 'string|max:100',
            'LName' => 'string|max:100',
            'email' => 'email|unique:users,email,' . $id . ',user_ID',
            'username' => 'string|unique:users,username,' . $id . ',user_ID',
            'phone' => 'string|max:20|nullable',
            'bio' => 'string|nullable',
            'is_active' => 'boolean',
        ]);

        $user->update($validated);
        return response()->json(['message' => 'User updated successfully', 'user' => $user]);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        
        // Prevent deleting the last admin
        if ($user->roles->where('role', 'admin')->count() > 0) {
            $adminCount = User::whereHas('roles', function ($q) {
                $q->where('role', 'admin');
            })->count();
            
            if ($adminCount <= 1) {
                return response()->json(['error' => 'Cannot delete the last admin user'], 403);
            }
        }

        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }

    public function toggleStatus($id)
    {
        $user = User::findOrFail($id);
        
        // Prevent deactivating the last admin
        if ($user->is_active && $user->roles->where('role', 'admin')->count() > 0) {
            $adminCount = User::where('is_active', true)
                ->whereHas('roles', function ($q) {
                    $q->where('role', 'admin');
                })->count();
            
            if ($adminCount <= 1) {
                return response()->json(['error' => 'Cannot deactivate the last active admin'], 403);
            }
        }

        $user->is_active = !$user->is_active;
        $user->save();
        
        return response()->json([
            'message' => 'User status updated',
            'is_active' => $user->is_active
        ]);
    }

    public function resetPassword(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user->password = Hash::make($validated['password']);
        $user->save();

        return response()->json(['message' => 'Password reset successfully']);
    }

    public function assignRole(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'role' => 'required|string|exists:roles,role',
        ]);

        $role = \App\Models\Role::where('role', $validated['role'])->first();
        $user->roles()->syncWithoutDetaching([$role->role_ID]);

        return response()->json(['message' => 'Role assigned successfully', 'user' => $user->load('roles')]);
    }

    public function removeRole(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'role' => 'required|string|exists:roles,role',
        ]);

        $role = \App\Models\Role::where('role', $validated['role'])->first();
        
        // Prevent removing the last admin role from the last admin
        if ($validated['role'] === 'admin' && $user->roles->count() === 1) {
            $adminCount = User::whereHas('roles', function ($q) {
                $q->where('role', 'admin');
            })->count();
            
            if ($adminCount <= 1) {
                return response()->json(['error' => 'Cannot remove the last admin role'], 403);
            }
        }

        $user->roles()->detach($role->role_ID);

        return response()->json(['message' => 'Role removed successfully', 'user' => $user->load('roles')]);
    }
}