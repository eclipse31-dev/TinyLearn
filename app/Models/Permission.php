<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    use HasFactory;

    protected $primaryKey = 'permission_ID';

    protected $fillable = [
        'name',
        'display_name',
        'description',
        'group',
    ];

    /**
     * Get the roles that have this permission
     */
    public function roles()
    {
        return $this->belongsToMany(
            Role::class,
            'role_permissions',
            'permission_ID',
            'role_ID',
            'permission_ID',
            'role_ID'
        );
    }
}
