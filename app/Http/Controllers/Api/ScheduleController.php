<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

use Illuminate\Support\Facades\Storage;

class ScheduleController extends Controller
{
    public function index()
    {
        $schedules = Schedule::all();
        return response()->json($schedules);
    }

    public function getLast7DaysSchedulesForUser($userId)
    {
        $endDate = Carbon::now();
        $startDate = $endDate->copy()->subDays(6); // Get the start date 7 days ago

        $schedules = Schedule::where('user_id', $userId)->with('project','ticket')
            ->whereBetween('date', [$startDate->toDateString(), $endDate->toDateString()])
            ->orderBy('date', 'asc')
            ->get();

        return response()->json($schedules);
    }

    public function store(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'start_hour' => 'required|string',
            'end_hour' => 'required|string',
            'ticket_id' => 'required|exists:tickets,id',
            'project_id' => 'required|exists:projects,id',
            'user_id' => 'required|exists:users,id',
            'description' => 'nullable|string',
        ]);
    
        // Handle the file upload and store the file in the public disk
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $filePath = $file->store('public'); // Automatically generate a unique filename and store in 'public' disk
    
            // Get the filename from the full file path
            $fileName = basename($filePath);
        } else {
            // If no file is uploaded, set default values for file_path and file_name
            $filePath = null;
            $fileName = null;
        }
    
        $schedule = Schedule::create([
            'date' => $request->date,
            'start_hour' => $request->start_hour,
            'end_hour' => $request->end_hour,
            'ticket_id' => $request->ticket_id,
            'project_id' => $request->project_id,
            'user_id' => $request->user_id,
            'file_name' => $fileName,
            'file_path' => $filePath,
            'description' => $request->description,
        ]);
    
        // If you want to return the full schedule data including the file_name and file_path, use this line
        return response()->json($schedule, 201);
    
        // If you only want to return the newly created schedule ID, use this line
        // return response()->json(['id' => $schedule->id], 201);
    }




    public function downloadFile($id)
    {
        $schedule = Schedule::findOrFail($id);
    
        // Check if the file exists in the custom storage location
        //$filePath = storage_path('app/public/' . $schedule->file_path);
        $filePath = env('CUSTOM_STORAGE_PATH') .'/'.  $schedule->file_name;
       // dd($filePath);
    
        if (file_exists($filePath)) {
            // Set the appropriate headers
            $headers = [
                'Content-Type' => $schedule->file_type,
                'Content-Disposition' => 'attachment; filename="' . $schedule->file_name . '"',
            ];
    
            // Return the file as a response
            return response()->download($filePath, $schedule->file_name, $headers);
        } else {
            // File not found
            return response()->json(['error' => 'File not found'], 404);
        }
    }
 

// public function downloadFile($id)
// {
//     $schedule = Schedule::findOrFail($id);

//     // Generate the URL for the file using the Storage facade
//     $fileUrl = Storage::disk('public')->url($schedule->file_name);

//     if ($fileUrl) {
//         // Redirect the user to the file URL, which will initiate the download
//         return redirect($fileUrl);
//     } else {
//         // File not found
//         return response()->json(['error' => 'File not found'], 404);
//     }
// }



    public function getSchedulesByUser($userId)
    {
        // Fetch schedules for the given user ID
        $schedules = Schedule::where('user_id', $userId)->with('project','ticket')->get();

        // Return the schedules as a JSON response
        return response()->json($schedules);
    }
    


    public function show(Schedule $schedule)
    {
        return response()->json($schedule);
    }

    public function update(Request $request, Schedule $schedule)
    {
        $request->validate([
            'date' => 'required|date',
            'start_hour' => 'required|string',
            'end_hour' => 'required|string',
            'ticket_id' => 'required|exists:tickets,id',
            'project_id' => 'required|exists:projects,id',
            'user_id' => 'required|exists:users,id',
            'file_path' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $schedule->update($request->all());
        return response()->json($schedule);
    }

    public function destroy(Schedule $schedule)
    {
        $schedule->delete();
        return response()->json(['message' => 'Schedule deleted successfully']);
    }
}
