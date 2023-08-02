<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FormationType;
use Illuminate\Http\Request;

class FormationTypeController extends Controller
{
    public function index()
    {
        $formationTypes = FormationType::all();
        return response()->json($formationTypes);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'imagePath' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Adjust the file types and size limit as needed
        ]);
    
        // Handle the image upload and store the image in the public disk
        if ($request->hasFile('imagePath')) {
            $image = $request->file('imagePath');
            $imagePath = $image->store('public/formation_images');  
        } else {
            // If no image is uploaded, set default value for imagePath
            $imagePath = null;
        }
    
        $formationType = FormationType::create([
            'name' => $request->name,
            'description' => $request->description,
            'imagePath' => $imagePath,
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
