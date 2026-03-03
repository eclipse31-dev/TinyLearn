<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCourseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Only teachers and admins can create courses
        return $this->user()->hasRole('teacher') || $this->user()->hasRole('admin');
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:courses,slug,' . $this->route('id') . ',course_ID',
            'course_code' => 'required|string|max:50|unique:courses,course_code,' . $this->route('id') . ',course_ID',
            'description' => 'nullable|string',
            'status' => 'required|in:draft,active,archived',
            'header_image' => 'nullable|image|max:2048',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Course title is required',
            'course_code.unique' => 'This course code is already in use',
            'status.in' => 'Status must be draft, active, or archived',
        ];
    }
}
