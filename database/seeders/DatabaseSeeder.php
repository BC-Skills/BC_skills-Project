<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(ProfilSeeder::class);
        $this->call(statusseeder::class);
        $this->call(privilagesseeder::class); 
        $this->call(UserSeeder::class); 
        $this->call(ProjecttypeSeeder::class); 
    }
}
