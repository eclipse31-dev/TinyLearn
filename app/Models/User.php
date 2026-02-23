<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $primaryKey = 'user_ID';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'FName',
        'LName',
        'email',
        'username',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed', // auto-hash
        ];
    }

    public function roles()
    {
        return $this->belongsToMany(
            Role::class,
            'user_roles',
            'user_id',
            'role_id',
            'user_ID',
            'role_ID'
        );
    }

    public function hasRole($roleName)
    {
        return $this->roles()->where('role', $roleName)->exists();
    }
}