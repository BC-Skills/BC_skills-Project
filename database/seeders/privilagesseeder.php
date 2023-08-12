<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Privilege;

class privilagesseeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $data = [
            [

                'name' => 'show',
                'status_id'=>1,
                // Add other attributes here
            ],
            [
                'name' => 'edit',
                'status_id'=>1,
            ],
            [
                'name' => 'add',
                'status_id'=>1,
            ],
            [
                'name' => 'show',
                'status_id'=>2,
            ],
            [
                'name' => 'edit',
                'status_id'=>2,
            ],
            [
                'name' => 'add',
                'status_id'=>2,
            ],
            [
                'name' => 'show',
                'status_id'=>3,
            ],
            [
                'name' => 'edit',
                'status_id'=>3,
            ],
            [
                'name' => 'add',
                'status_id'=>3,
            ],
            [
                'name' => 'show',
                'status_id'=>4,
            ],
            [
                'name' => 'edit',
                'status_id'=>4,
            ],
            [
                'name' => 'add',
                'status_id'=>4,
            ],
            [
                'name' => 'show',
                'status_id'=>5,
            ],
            [
                'name' => 'edit',
                'status_id'=>5,
            ],
            [
                'name' => 'add',
                'status_id'=>5,
            ],
            [
                'name' => 'show',
                'status_id'=>6,
            ],
            [
                'name' => 'edit',
                'status_id'=>6,
            ],
            
            [
                'name' => 'add',
                'status_id'=>6,
            ],
        ];

        foreach ($data as $record) {
            Privilege::create($record);
        }
    }
}
