<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Discussion;
use App\Models\DiscussionReply;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DiscussionController extends Controller
{
    /**
     * Display a listing of discussions.
     */
    public function index(Request $request)
    {
        try {
            $query = Discussion::with(['user', 'course'])
                ->withCount('allReplies');

            // Filter by course if provided
            if ($request->has('course_id') && $request->course_id !== 'all') {
                $query->where('course_ID', $request->course_id);
            }

            // Filter by category if provided
            if ($request->has('category') && $request->category !== 'all') {
                $query->where('category', $request->category);
            }

            // Search by title or content
            if ($request->has('search') && $request->search) {
                $query->where(function ($q) use ($request) {
                    $q->where('title', 'like', '%' . $request->search . '%')
                      ->orWhere('content', 'like', '%' . $request->search . '%');
                });
            }

            // Order by pinned first, then by latest
            $discussions = $query->orderBy('is_pinned', 'desc')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json($discussions);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch discussions',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a new discussion.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'course_ID' => 'nullable|exists:courses,course_ID',
                'title' => 'required|string|max:255',
                'content' => 'required|string',
                'category' => 'required|in:general,question,announcement,study-group',
            ]);

            $validated['user_ID'] = Auth::id();

            $discussion = Discussion::create($validated);
            $discussion->load(['user', 'course']);

            return response()->json([
                'message' => 'Discussion created successfully',
                'discussion' => $discussion
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create discussion',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display a specific discussion with replies.
     */
    public function show($id)
    {
        try {
            $discussion = Discussion::with([
                'user',
                'course',
                'replies.user',
                'replies.childReplies.user'
            ])->findOrFail($id);

            // Increment views
            $discussion->incrementViews();

            return response()->json($discussion);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Discussion not found'
            ], 404);
        }
    }

    /**
     * Add a reply to a discussion.
     */
    public function reply(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'content' => 'required|string',
                'parent_reply_ID' => 'nullable|exists:discussion_replies,reply_ID',
            ]);

            $discussion = Discussion::findOrFail($id);

            if ($discussion->is_locked) {
                return response()->json([
                    'message' => 'This discussion is locked'
                ], 403);
            }

            $reply = DiscussionReply::create([
                'discussion_ID' => $id,
                'user_ID' => Auth::id(),
                'content' => $validated['content'],
                'parent_reply_ID' => $validated['parent_reply_ID'] ?? null,
            ]);

            $reply->load(['user', 'childReplies.user']);

            return response()->json([
                'message' => 'Reply added successfully',
                'reply' => $reply
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to add reply',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update a discussion (only by owner or admin).
     */
    public function update(Request $request, $id)
    {
        try {
            $discussion = Discussion::findOrFail($id);

            // Check if user is owner or admin
            if ($discussion->user_ID !== Auth::id() && !Auth::user()->hasRole('admin')) {
                return response()->json([
                    'message' => 'Unauthorized'
                ], 403);
            }

            $validated = $request->validate([
                'title' => 'sometimes|string|max:255',
                'content' => 'sometimes|string',
                'category' => 'sometimes|in:general,question,announcement,study-group',
            ]);

            $discussion->update($validated);
            $discussion->load(['user', 'course']);

            return response()->json([
                'message' => 'Discussion updated successfully',
                'discussion' => $discussion
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update discussion',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a discussion (only by owner or admin).
     */
    public function destroy($id)
    {
        try {
            $discussion = Discussion::findOrFail($id);

            // Check if user is owner or admin
            if ($discussion->user_ID !== Auth::id() && !Auth::user()->hasRole('admin')) {
                return response()->json([
                    'message' => 'Unauthorized'
                ], 403);
            }

            $discussion->delete();

            return response()->json([
                'message' => 'Discussion deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete discussion',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Pin/unpin a discussion (admin only).
     */
    public function togglePin($id)
    {
        try {
            if (!Auth::user()->hasRole('admin') && !Auth::user()->hasRole('teacher')) {
                return response()->json([
                    'message' => 'Unauthorized'
                ], 403);
            }

            $discussion = Discussion::findOrFail($id);
            $discussion->is_pinned = !$discussion->is_pinned;
            $discussion->save();

            return response()->json([
                'message' => $discussion->is_pinned ? 'Discussion pinned' : 'Discussion unpinned',
                'discussion' => $discussion
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to toggle pin',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lock/unlock a discussion (admin only).
     */
    public function toggleLock($id)
    {
        try {
            if (!Auth::user()->hasRole('admin') && !Auth::user()->hasRole('teacher')) {
                return response()->json([
                    'message' => 'Unauthorized'
                ], 403);
            }

            $discussion = Discussion::findOrFail($id);
            $discussion->is_locked = !$discussion->is_locked;
            $discussion->save();

            return response()->json([
                'message' => $discussion->is_locked ? 'Discussion locked' : 'Discussion unlocked',
                'discussion' => $discussion
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to toggle lock',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
