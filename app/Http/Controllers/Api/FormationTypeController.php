<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FormationType;
use Illuminate\Http\Request;
use App\Models\Formation;
use App\Models\User;

class FormationTypeController extends Controller
{
    public function index()
{
    $formationTypes = FormationType::with('formations.users')->get();

    $result = [];

    foreach ($formationTypes as $formationType) {
        $formationTypeData = [
            'id' => $formationType->id,
            'name' => $formationType->name,
            'description' => $formationType->description,
            'imagePath' => $formationType->imagePath,
            'imageUrl' => $formationType->imageUrl, 
            'formations' => [],
            'formationCount' => 0, // Initialize the count of formations for this type
            'totalFormationDuration' => 0, // Initialize the total duration
            'userFormationDuration' => [], // Initialize the user formation duration array
        ];

        foreach ($formationType->formations as $formation) {
            $formationData = $formation->toArray();
            $formationData['users'] = $formation->users->toArray();

            $formationTypeData['formations'][] = $formationData;
            $formationTypeData['formationCount']++; // Increment the formation count
            $formationTypeData['totalFormationDuration'] += $formation->duree; // Add formation duration

            // Update user formation duration
            foreach ($formation->users as $user) {
                $userId = $user['id'];
                $userFormationDuration = ($formationTypeData['userFormationDuration'][$userId] ?? 0) + $formation->duree;
                $formationTypeData['userFormationDuration'][] = $userFormationDuration;
            }
        }

        // Calculate the total user formation duration
        $totalUserFormationDuration = array_sum($formationTypeData['userFormationDuration']);
        $formationTypeData['userFormationDurationTotal'] = $totalUserFormationDuration;

        $result[] = $formationTypeData;
    }

    return response()->json($result);
}

    
    
    public function index3($userId)
    {
        $formationTypes = FormationType::with(['formations.users' => function ($query) use ($userId) {
            $query->where('users.id', $userId);
        }])->get();
    
        $result = [];
    
        foreach ($formationTypes as $formationType) {
            $formationTypeData = [
                'id' => $formationType->id,
                'name' => $formationType->name,
                'description' => $formationType->description,
                'imagePath' => $formationType->imagePath,
                'imageUrl' => $formationType->imageUrl,
                'formations' => [],
            ];
    
            foreach ($formationType->formations as $formation) {
                if ($formation->users->isEmpty()) {
                    $formationData = $formation->toArray();
                    $formationData['users'] = $formation->users->toArray();
    
                    $formationTypeData['formations'][] = $formationData;
                }
            }
    
            $result[] = $formationTypeData;
        }
    
        return response()->json($result);
    }
   

    // public function store(Request $request)
    // {
    //     $request->validate([
    //         'name' => 'required|string',
    //         'description' => 'required|string',
    //         'imagePath' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Adjust the file types and size limit as needed
    //     ]);
    
    //     // Handle the image upload and store the image in the public disk
    //     if ($request->hasFile('imagePath')) {
    //         $image = $request->file('imagePath');
    //         $imagePath = $image->store('formation_images', 'public');  
    //     } else {
    //         // If no image is uploaded, set default value for imagePath
    //         $imagePath = null;
    //     }
    
    //     $formationType = FormationType::create([
    //         'name' => $request->name,
    //         'description' => $request->description,
    //         'imagePath' => $imagePath,
    //     ]);
    
    //     return response()->json($formationType, 201);
    // }
    public function store(Request $request)
{
    // $request->validate([
    //     'name' => 'required|string',
    //     'description' => 'required|string',
    //     'imagePath' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Adjust the file types and size limit as needed
    // ]);

    // Handle the image upload and store the image in the public disk
    if ($request->hasFile('imagePath')) {
        $image = $request->file('imagePath');
        $imagePath = $image->store('public/formation_images');
        
        // Generate URL for the uploaded image
        $imageUrl = asset('storage/formation_images/' . basename($imagePath));
    } else {
        // If no image is uploaded, set default values for imagePath and imageUrl
        $imagePath = null;
        $imageUrl = null;
    }

    $formationType = FormationType::create([
        'name' => $request->name,
        'description' => $request->description,
        'imagePath' => $imagePath,
        'imageUrl' => $imageUrl, // Add this line to include the imageUrl in the created formationType
    ]);

    return response()->json($formationType, 201);
}

    
    public function update(Request $request, $id)
    {
        $data = $request->all();
    
        // Handle image upload
        if ($request->hasFile('imagePath')) {
            $imagePath = $request->file('imagePath')->store('formation_images', 'public');
            $data['image_path'] = $imagePath;
        }
    
        $formationType = FormationType::findOrFail($id);
        $formationType->update($data);
        return response()->json($formationType, 200);
    }
    

    public function show($id)
    {
        $formationType = FormationType::findOrFail($id);
        return response()->json($formationType);
    }



    public function destroy($id)
    {
        $formationType = FormationType::findOrFail($id);
        $formationType->delete();
        return response()->json(null, 204);
    }
}
