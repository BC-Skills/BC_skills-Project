<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;    
use App\Models\Schedule;


class ScheduleController extends Controller
{


public function storeSchedule(Request $request)
{
    $request->validate([
        'user_id' => 'required|integer',
        'hour' => 'required',
        'ticket_id' => 'required|integer', // Assuming ticket_id is the selected ticket's ID
        'description' => 'nullable|string',
    ]);

    Schedule::create([
        'user_id' => $request->user_id,
        'hour' => $request->hour,
        'ticket_id' => $request->ticket_id,
        'description' => $request->description,
    ]);

    // Redirect or return a response as needed
    return redirect()->route('tickets.store');  

}

}
