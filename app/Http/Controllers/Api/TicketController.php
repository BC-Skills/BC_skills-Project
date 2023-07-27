<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\Request;
use App\Models\Schedule;

class TicketController extends Controller
{
    public function index()
    {
        $tickets = Ticket::all();
        return response()->json($tickets);
    }

    public function storez(Request $request)
    {
        $ticket = Ticket::create($request->all());
        return response()->json($ticket, 201);
        
    }

    public function show($id)
    {
        $ticket = Ticket::findOrFail($id);
        return response()->json($ticket);
    }

    public function update(Request $request, $id)
    {
        $ticket = Ticket::findOrFail($id);
        $ticket->update($request->all());
        return response()->json($ticket, 200);
    }

    public function destroy($id)
    {
        $ticket = Ticket::findOrFail($id);
        $ticket->delete();
        return response()->json(null, 204);
    }

    public function showScheduleForUser($userId)
    {
        $user = User::findOrFail($userId);
        $hours = ['08:00', '09:00', '10:00', '11:00', '12:00']; // Add all hours you want to display

        $allTickets = Ticket::all(); // Fetch all tickets from the database

        return view('pages/tasksTest', compact('user', 'hours', 'allTickets'));
    }

        public function store(Request $request)
    {
        $request->validate([
            'tickets' => 'required|array',
            'tickets.*.ticket_id' => 'required|exists:tickets,id',
            'tickets.*.nom' => 'nullable|string',
        ]);

        foreach ($request->input('tickets') as $hour => $ticketData) {
            Ticket::create([
                'user_id' => auth()->id(),
                'hour' => $hour,
                'ticket_id' => $ticketData['ticket_id'],
                'nom' => $ticketData['nom'],
            ]);
        }

        // TicketController.php
                return redirect()->route('tickets.store');  

    }

    public function storeSchedule(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer',
            'tickets' => 'required|array',
            'tickets.*.ticket_id' => 'required|integer|exists:tickets,id',
            'tickets.*.description' => 'nullable|string',
        ]);
    
        foreach ($request->input('tickets') as $hour => $ticketData) {
            Schedule::create([
                'user_id' => $request->user_id,
                'hour' => $hour,
                'ticket_id' => $ticketData['ticket_id'],
               // 'nom' => $ticketData['nom'],
            ]);
        }
    
        // Redirect or return a response as needed
        return redirect()->route('schedule.store');
    }
    

}
