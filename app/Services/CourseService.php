<?php

namespace App\Services;

use App\Models\Course;
use App\Repositories\CourseRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CourseService
{
    public function __construct(
        protected CourseRepository $courseRepository,
        protected ActivityLogService $activityLogService
    ) {}

    public function createCourse(array $data, int $userId): Course
    {
        return DB::transaction(function () use ($data, $userId) {
            // Generate slug if not provided
            if (empty($data['slug'])) {
                $data['slug'] = Str::slug($data['title']);
            }

            // Handle header image upload
            if (isset($data['header_image'])) {
                $data['header_image'] = $this->uploadHeaderImage($data['header_image']);
            }

            $data['created_by'] = $userId;

            $course = $this->courseRepository->create($data);

            // Log activity
            $this->activityLogService->log(
                'course_created',
                "Created course: {$course->title}",
                $userId,
                'Course',
                $course->course_ID
            );

            return $course;
        });
    }

    public function updateCourse(int $id, array $data, int $userId): Course
    {
        return DB::transaction(function () use ($id, $data, $userId) {
            $course = $this->courseRepository->find($id);

            if (!$course) {
                throw new \Exception('Course not found');
            }

            // Handle header image upload
            if (isset($data['header_image'])) {
                // Delete old image
                if ($course->header_image) {
                    Storage::disk('public')->delete($course->header_image);
                }
                $data['header_image'] = $this->uploadHeaderImage($data['header_image']);
            }

            $this->courseRepository->update($id, $data);

            // Log activity
            $this->activityLogService->log(
                'course_updated',
                "Updated course: {$course->title}",
                $userId,
                'Course',
                $id
            );

            return $this->courseRepository->find($id);
        });
    }

    public function deleteCourse(int $id, int $userId): bool
    {
        return DB::transaction(function () use ($id, $userId) {
            $course = $this->courseRepository->find($id);

            if (!$course) {
                throw new \Exception('Course not found');
            }

            // Delete header image
            if ($course->header_image) {
                Storage::disk('public')->delete($course->header_image);
            }

            $result = $this->courseRepository->delete($id);

            // Log activity
            $this->activityLogService->log(
                'course_deleted',
                "Deleted course: {$course->title}",
                $userId,
                'Course',
                $id
            );

            return $result;
        });
    }

    protected function uploadHeaderImage($file): string
    {
        return $file->store('courses/headers', 'public');
    }

    public function enrollStudent(int $courseId, int $studentId, int $enrolledBy): void
    {
        DB::transaction(function () use ($courseId, $studentId, $enrolledBy) {
            $course = $this->courseRepository->find($courseId);

            if (!$course) {
                throw new \Exception('Course not found');
            }

            // Create enrollment logic here

            $this->activityLogService->log(
                'student_enrolled',
                "Student enrolled in course: {$course->title}",
                $enrolledBy,
                'Enrollment',
                null
            );
        });
    }
}
