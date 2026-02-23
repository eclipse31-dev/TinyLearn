<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Assessment extends Model
{
    use HasFactory;

    protected $primaryKey = 'assessment_ID';
    protected $table = 'assessments';

    protected $fillable = [
        'module_ID',
        'attachment_ID',
        'status',
        'due_date',
        'created_by',
    ];

    protected $casts = [
        'due_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the module that owns this assessment.
     */
    public function module()
    {
        return $this->belongsTo(Module::class, 'module_ID', 'module_ID');
    }

    /**
     * Get the course through module relationship.
     */
    public function course()
    {
        return $this->module->course();
    }

    /**
     * Get the attachment for this assessment.
     */
    public function attachment()
    {
        return $this->belongsTo(Attachment::class, 'attachment_ID', 'attachment_ID');
    }

    /**
     * Get the user who created this assessment.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by', 'user_ID');
    }

    /**
     * Get all submissions for this assessment.
     */
    public function submissions()
    {
        return $this->hasMany(Submission::class, 'assessment_ID', 'assessment_ID');
    }
}
