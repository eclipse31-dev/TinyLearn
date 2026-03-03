<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Assignment extends Model
{
    use HasFactory;

    protected $table = 'assessments';
    protected $primaryKey = 'assessment_ID';

    protected $fillable = [
        'module_ID',
        'attachment_ID',
        'status',
        'due_date',
        'created_by',
        'title',
        'description',
    ];

    protected $casts = [
        'due_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function module()
    {
        return $this->belongsTo(Module::class, 'module_ID', 'module_ID');
    }

    public function course()
    {
        return $this->hasOneThrough(
            Course::class,
            Module::class,
            'module_ID',
            'course_ID',
            'module_ID',
            'course_ID'
        );
    }

    public function submissions()
    {
        return $this->hasMany(Submission::class, 'assessment_id', 'assessment_ID');
    }

    public function attachment()
    {
        return $this->belongsTo(Attachment::class, 'attachment_ID', 'attachment_ID');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by', 'user_ID');
    }
}
