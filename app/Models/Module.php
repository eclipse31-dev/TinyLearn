<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    use HasFactory;

    protected $primaryKey = 'module_ID';
    protected $table = 'modules';

    protected $fillable = [
        'course_ID',
        'title',
        'order',
        'created_by',
    ];

    protected $casts = [
        'order' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the course that owns this module.
     */
    public function course()
    {
        return $this->belongsTo(Course::class, 'course_ID', 'course_ID');
    }

    /**
     * Get all assessments for this module.
     */
    public function assessments()
    {
        return $this->hasMany(Assessment::class, 'module_ID', 'module_ID');
    }

    /**
     * Get all materials for this module.
     */
    public function materials()
    {
        return $this->hasMany(Material::class, 'module_ID', 'module_ID');
    }

    /**
     * Get the user who created this module.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by', 'user_ID');
    }
}
