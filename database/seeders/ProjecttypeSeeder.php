<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ProjectType; 
class ProjecttypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $data = [
            [
                'name' => 'type1',
            ],
            [
                'name' => 'type2',
            ],
            [
                'name' => 'type3',
            ],
            [
                'name' => 'type4',
            ],
        ];

        foreach ($data as $record) {
            ProjectType::create($record);
        }
    }
}
