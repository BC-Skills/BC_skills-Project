<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Profile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;


class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        DB::beginTransaction();

        try {
            $adminProfile = Profile::where('name', 'admin')->first();

            if (!$adminProfile) {
                // Create admin profile if it doesn't exist
                $adminProfile = Profile::create(['name' => 'admin']);
            }

            User::create([
                'name' => 'Admin',
                'email' => 'admin@admin',
                'password' => Hash::make('123'),
                'tel' => '1234567890',
                'profile_picture' => 'https://media.licdn.com/dms/image/D4E03AQHz0YlNqxAY7Q/profile-displayphoto-shrink_800_800/0/1685212295560?e=1697068800&v=beta&t=1NkvROsU3EKjHHGi6l-yjAQXHolP1Wt0TKTGtIDKITI', // Update with actual image path
                'profile_id' => $adminProfile->id,
            ]);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollback();
            throw $e;
        }
    }
}
