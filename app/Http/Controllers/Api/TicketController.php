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
    

    public function getTicketsByProjectId($projectId)
    {
        try {
            // Query the database to find tickets with the given project ID
            $tickets = Ticket::with('project', 'sprint', 'user', 'assignedToUser','sprint')
                ->where('project_id', $projectId)
                ->get();
    
            // Return the tickets with project, sprint, and user information in the response
            return response()->json($tickets);
        } catch (\Exception $e) {
            // Handle any errors that might occur during the process
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    public function getTicketsByProjectAndSprintIdd($projectId, $sprintId)
    {
        try {
            // Query the database to find tickets with the given project ID and sprint ID
            $tickets = Ticket::with('project', 'sprint', 'user', 'assignedToUser')
                ->where('project_id', $projectId)
                ->where('sprint_id', $sprintId)
                ->get();
    
            // Return the tickets with project, sprint, and user information in the response
            return response()->json($tickets);
        } catch (\Exception $e) {
            // Handle any errors that might occur during the process
            return response()->json(['error' => 'An error occurred.'], 500);
        }
    }
    
    public function getTicketsByProjectWithoutSprint($projectId)
    {
        try {
            // Query the database to find tickets with the given project ID and where sprint_id is null
            $tickets = Ticket::with('project', 'sprint', 'user', 'assignedToUser')
                ->where('project_id', $projectId)
                ->whereNull('sprint_id')
                ->get();
    
            // Return the tickets with project, sprint, and user information in the response
            return response()->json($tickets);
        } catch (\Exception $e) {
            // Handle any errors that might occur during the process
            return response()->json(['error' => 'An error occurred.'], 500);
        }
    }
    
    public function update2(Request $request, $id)
    {
        $ticket = Ticket::findOrFail($id);
        $ticket->update($request->all());
        return response()->json($ticket, 200);
    }

  

    
}
