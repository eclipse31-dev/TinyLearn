<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserRole extends Model
{
    use HasFactory;

    protected $table = 'user_roles';
    protected $primaryKey = 'user_role_ID';
    public $timestamps = true;

    protected $fillable = [
        'user_id',
        'role_id', // FIXED
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_ID');
    }

    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id', 'role_ID'); // FIXED
    }
}