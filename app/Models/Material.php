<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Material extends Model
{
    use HasFactory;

    protected $table = 'materials';

    protected $fillable = [
        'module_ID',
        'materials_type',
        'attachment_ID',
        'content',
        'created_by',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the module that owns this material.
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
     * Get the attachment for this material.
     */
    public function attachment()
    {
        return $this->belongsTo(Attachment::class, 'attachment_ID', 'attachment_ID');
    }

    /**
     * Get the user who created this material.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by', 'user_ID');
    }
}

