<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Resource>
 */
class ResourceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $types = ['link', 'file', 'image', 'video'];
        $type = $this->faker->randomElement($types);

        return [
            'course_id' => 1,
            'title' => $this->faker->sentence(),
            'description' => $this->faker->paragraph(),
            'type' => $type,
            'url' => $type === 'link' || $type === 'video' ? $this->faker->url() : null,
        ];
    }
}
