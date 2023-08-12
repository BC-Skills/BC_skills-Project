<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Status; // Make sure to include the correct namespace

class statusseeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $data = [
            [
                'name' => 'projets',
                // Add other attributes here
            ],
            [
                'name' => 'tickets',
                // Add other attributes here
            ],
            [
                'name' => 'schedules',
                // Add other attributes here
            ],
            [
                'name' => 'formation',
                // Add other attributes here
            ],
            [
                'name' => 'users',
                // Add other attributes here
            ],
            [
                'name' => 'sprints',
                // Add other attributes here
            ],
           
        ];

        foreach ($data as $record) {
            Status::create($record);
        }
    }
}
