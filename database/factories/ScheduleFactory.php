<?php

namespace Database\Factories;

use App\Models\Schedule;
use App\Models\User;
use App\Models\Course;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

class ScheduleFactory extends Factory
{
    protected $model = Schedule::class;

    public function definition(): array
    {
        $startTime = $this->faker->dateTimeBetween('now', '+30 days');
        $endTime = (new \DateTime($startTime->format('Y-m-d H:i:s')))->modify('+1 hour');

        $types = ['class', 'activity', 'assignment', 'exam', 'event'];
        $colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

        return [
            'user_id' => User::factory(),
            'course_id' => $this->faker->boolean(70) ? Course::inRandomOrder()->first()?->id : null,
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(),
            'type' => $this->faker->randomElement($types),
            'start_time' => $startTime,
            'end_time' => $endTime,
            'location' => $this->faker->randomElement(['Room 101', 'Room 102', 'Lab A', 'Library', 'Auditorium', null]),
            'color' => $this->faker->randomElement($colors),
            'is_recurring' => $this->faker->boolean(20),
            'recurrence_pattern' => $this->faker->randomElement(['daily', 'weekly', 'biweekly', 'monthly', null]),
            'recurrence_end_date' => $this->faker->boolean(50) ? $this->faker->dateTimeBetween('+1 month', '+3 months') : null,
        ];
    }

    public function class(): self
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'class',
            'color' => '#3B82F6',
            'location' => $this->faker->randomElement(['Room 101', 'Room 102', 'Lab A']),
            'is_recurring' => true,
            'recurrence_pattern' => 'weekly',
        ]);
    }

    public function activity(): self
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'activity',
            'color' => '#10B981',
        ]);
    }

    public function assignment(): self
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'assignment',
            'color' => '#F59E0B',
        ]);
    }

    public function exam(): self
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'exam',
            'color' => '#EF4444',
        ]);
    }

    public function event(): self
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'event',
            'color' => '#8B5CF6',
        ]);
    }
}
