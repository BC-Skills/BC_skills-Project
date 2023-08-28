<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Formation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\User;


class FormationController extends Controller
{
    public function index()
    {
        $formations = Formation::all();
        return response()->json($formations);
    }

    // public function store(Request $request)
    // {
    //     $request->validate([
    //         'name' => 'required|string',
    //         'description' => 'required|string',
    //         'formation_type_id' => 'required|exists:formation_types,id',
    //     ]);
    
    //     $formation = new Formation([
    //         'name' => $request->input('name'),
    //         'description' => $request->input('description'),
    //         'formation_type_id' => $request->input('formation_type_id'),
    //         // You can remove the 'file_path' assignment if not needed
    //     ]);
    
    //     // Handle file upload and storage as needed (if applicable)
    //     if ($request->hasFile('file')) {
    //         $file = $request->file('file');
    //         $filePath = $file->store('public/formations'); // Store the file in the 'public/formations' directory
    //         $formation->file_path = $filePath;
    //     }
    
    //     $formation->save();
    //     return response()->json($formation, 201);
    // }
    public function store(Request $request)
    {
        // $request->validate([
        //     'name' => 'required|string',
        //     'description' => 'required|string',
        //     'formation_type_id' => 'required|exists:formation_types,id',
        //     'file_path' => 'required|string', // Update validation rule for file path
        // ]);

       
    
        $formation = new Formation([
            'name' => $request->name,
            'description' => $request->description,
            'formation_type_id' => $request->formation_type_id,
            'file_path' => $request->file_path, // Store the file path
            'duree'=> $request->duree
        ]);
    
        if ($request->hasFile('file')) {
        $file = $request->file('file');
        $filePath = $file->store('public/formations'); // Store the file in the 'public/formations' directory
        $formation->file_path = $filePath;
    }
        $formation->save();
        
        return response()->json($formation, 201);
    }
    
    


    public function downloadFile($id)
    {
        $formation = Formation::findOrFail($id);
    
        // Check if the file exists in the custom storage location
        $filePath = storage_path('app/' . $formation->file_path);
    
        if (file_exists($filePath)) {
            // Set the appropriate headers
            $headers = [
                'Content-Type' => 'application/octet-stream', // Set the appropriate content type
                'Content-Disposition' => 'attachment; filename="' . basename($filePath) . '"',
            ];
    
            // Return the file as a response
            return response()->download($filePath, basename($filePath), $headers);
        } else {
            // File not found
            return response()->json(['error' => 'File not found'], 404);
        }
    }
    
    
    
    

    public function show($id)
    {
        
        $formation = Formation::findOrFail($id);
        return response()->json($formation);
    }


    

    public function update(Request $request, $id)
    {
        $formation = Formation::findOrFail($id);
        $formation->update($request->all());
        return response()->json($formation, 200);
    }

    public function destroy($id)
    {
        $formation = Formation::findOrFail($id);
        $formation->delete();
        return response()->json(null, 204);
    }
   
    public function attachFormation(Request $request, $profileId)
    {
        $user = User::findOrFail($profileId);
        $formationId = $request->input('formation_id');
        $duree = $request->input('duree');

        $user->formations()->attach($formationId, ['duree' => $duree]);
        $user = User::findOrFail($profileId);
        $attachedFormations = $user->formations()->withPivot('duree')->get();
        $totalDuree = $attachedFormations->sum('pivot.duree');
    
        return response()->json($totalDuree, 200);
    }
}
// public function attachFormation(Request $request, $profileId)
// {
//     $user = User::findOrFail($profileId);
//     $formationId = $request->input('formation_id');
//     $duree = $request->input('duree');

    
//     $user->formations()->attach($formationId, ['duree' => $duree]);

//     return response()->json($duree, 200);
// }