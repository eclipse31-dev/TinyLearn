<?php

namespace App\Repositories;

use App\Models\Course;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class CourseRepository
{
    public function __construct(
        protected Course $model
    ) {}

    public function all(): Collection
    {
        return $this->model
            ->with(['creator', 'enrollments'])
            ->withCount(['enrollments', 'modules'])
            ->get();
    }

    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return $this->model
            ->with(['creator'])
            ->withCount(['enrollments', 'modules'])
            ->latest()
            ->paginate($perPage);
    }

    public function find(int $id): ?Course
    {
        return $this->model
            ->with(['creator', 'modules', 'enrollments'])
            ->withCount(['enrollments', 'modules'])
            ->find($id);
    }

    public function create(array $data): Course
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): bool
    {
        $course = $this->model->findOrFail($id);
        return $course->update($data);
    }

    public function delete(int $id): bool
    {
        return $this->model->findOrFail($id)->delete();
    }

    public function getByStatus(string $status): Collection
    {
        return $this->model
            ->where('status', $status)
            ->with(['creator'])
            ->withCount(['enrollments'])
            ->get();
    }

    public function getByCreator(int $userId): Collection
    {
        return $this->model
            ->where('created_by', $userId)
            ->with(['enrollments'])
            ->withCount(['enrollments', 'modules'])
            ->get();
    }

    public function search(string $query): Collection
    {
        return $this->model
            ->where('title', 'like', "%{$query}%")
            ->orWhere('course_code', 'like', "%{$query}%")
            ->orWhere('description', 'like', "%{$query}%")
            ->with(['creator'])
            ->withCount(['enrollments'])
            ->get();
    }
}
