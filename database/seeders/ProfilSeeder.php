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
                // Add other attributes here
            ],
            [
                'name' => 'developer',
                // Add other attributes here
            ],
            [
                'name' => 'adminsystem',
                // Add other attributes here
            ],
            [
                'name' => 'manager',
                // Add other attributes here
            ],
            [
                'name' => 'chefprojet',
                // Add other attributes here
            ],
            [
                'name' => 'RH',
                // Add other attributes here
            ],
            [
                'name' => 'ControlleF',
                // Add other attributes here
            ],  [
                'name' => 'Client',
                // Add other attributes here
            ],
        ];

        foreach ($data as $record) {
            Profile::create($record);
        }
    }
}
