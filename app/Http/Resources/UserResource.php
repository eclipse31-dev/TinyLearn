<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->user_ID,
            'first_name' => $this->FName,
            'last_name' => $this->LName,
            'full_name' => $this->FName . ' ' . $this->LName,
            'email' => $this->email,
            'username' => $this->username,
            'roles' => RoleResource::collection($this->whenLoaded('roles')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
