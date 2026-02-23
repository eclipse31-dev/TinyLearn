<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DiscussionController extends Controller
{
    /**
     * Display a listing of discussions.
     */
    public function index()
    {
        return response()->json([
            'success' => true,
            'discussions' => [
                [
                    'id' => 1,
                    'title' => 'Environment Discussion',
                    'description' => 'Let\'s discuss environmental issues',
                    'replies' => 5,
                    'views' => 23,
                ],
                [
                    'id' => 2,
                    'title' => 'Health & Fitness Tips',
                    'description' => 'Share your fitness journey',
                    'replies' => 12,
                    'views' => 45,
                ],
            ]
        ]);
    }

    /**
     * Store a new discussion.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Discussion created successfully',
            'discussion' => $validated
        ], 201);
    }

    /**
     * Display a specific discussion.
     */
    public function show($id)
    {
        return response()->json([
            'success' => true,
            'discussion' => [
                'id' => $id,
                'title' => 'Environment Discussion',
                'description' => 'Let\'s discuss environmental issues',
                'author' => 'John Doe',
                'created_at' => now(),
                'replies' => []
            ]
        ]);
    }
}
