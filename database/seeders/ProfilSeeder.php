<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Profile; // Make sure to include the correct namespace
class ProfilSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $data = [
            [
                'name' => 'admin',
            ],
            [
                'name' => 'developer',
            ],
            [
                'name' => 'adminsystem',
            ],
            [
                'name' => 'manager',
            ],
            [
                'name' => 'chefprojet',
            ],
            [
                'name' => 'RH',
            ],
            [
                'name' => 'ControlleF',
            ],
            [
                'name' => 'Client',
            ],
        ];

        foreach ($data as $record) {
            Profile::create($record);
        }
    }
}
