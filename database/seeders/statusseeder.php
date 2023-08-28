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
            ],
            [
                'name' => 'tickets',
            ],
            [
                'name' => 'schedules',
            ],
            [
                'name' => 'formation',
            ],
            [
                'name' => 'users',
            ],
            [
                'name' => 'sprints',
            ],
           
        ];

        foreach ($data as $record) {
            Status::create($record);
        }
    }
}
