<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Services\ActivityLogService;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class LogActivity
{
    protected $activityLogService;

    public function __construct(ActivityLogService $activityLogService)
    {
        $this->activityLogService = $activityLogService;
    }

    public function handle(Request $request, Closure $next): Response
    {
        $startTime = microtime(true);
        $response = $next($request);
        $endTime = microtime(true);
        $responseTimeMs = round(($endTime - $startTime) * 1000);

        // Only log authenticated requests
        if (Auth::check()) {
            try {
                $this->logRequest($request, $response, $responseTimeMs);
            } catch (\Exception $e) {
                // Silently fail if logging fails
                \Log::error('Activity logging failed: ' . $e->getMessage());
            }
        }

        return $response;
    }

    protected function logRequest(Request $request, Response $response, int $responseTimeMs): void
    {
        $method = $request->getMethod();
        $path = $request->getPathInfo();
        $status = $response->getStatusCode();
        $userId = Auth::id();

        // Skip if no user
        if (!$userId) {
            return;
        }

        // Determine action type based on HTTP method
        $actionType = match ($method) {
            'POST' => 'create',
            'PUT', 'PATCH' => 'update',
            'DELETE' => 'delete',
            'GET' => 'read',
            default => 'read',
        };

        // Skip logging for certain endpoints
        if ($this->shouldSkipLogging($path)) {
            return;
        }

        // Extract model type and ID from path
        [$modelType, $modelId] = $this->extractModelInfo($path);

        // Determine status
        $logStatus = $status >= 400 ? 'failed' : 'success';

        $this->activityLogService->log(
            action: "{$method} {$path}",
            actionType: $actionType,
            description: "API request: {$method} {$path}",
            userId: $userId,
            modelType: $modelType,
            modelId: $modelId,
            status: $logStatus,
            responseTimeMs: $responseTimeMs
        );
    }

    protected function shouldSkipLogging(string $path): bool
    {
        $skipPaths = [
            '/api/health',
            '/api/user',
            '/api/auth/google/data',
            '/api/activity-logs',
        ];

        foreach ($skipPaths as $skipPath) {
            if (str_contains($path, $skipPath)) {
                return true;
            }
        }

        return false;
    }

    protected function extractModelInfo(string $path): array
    {
        // Extract model type and ID from path like /api/courses/1
        $segments = explode('/', trim($path, '/'));

        if (count($segments) >= 3) {
            $modelType = ucfirst(rtrim($segments[1], 's'));
            $modelId = is_numeric($segments[2]) ? (int)$segments[2] : null;

            return [$modelType, $modelId];
        }

        return [null, null];
    }
}
