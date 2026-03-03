<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->course_ID,
            'title' => $this->title,
            'slug' => $this->slug,
            'course_code' => $this->course_code,
            'description' => $this->description,
            'status' => $this->status,
            'header_image' => $this->header_image,
            'creator' => new UserResource($this->whenLoaded('creator')),
            'enrollments_count' => $this->when(isset($this->enrollments_count), $this->enrollments_count),
            'modules_count' => $this->when(isset($this->modules_count), $this->modules_count),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
