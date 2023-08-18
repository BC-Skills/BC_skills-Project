<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Chat;

class ChatController extends Controller
{
    public function index()
    {
        // Fetch all chats from the database
        $chats = Chat::all();
        
        return response()->json($chats);
    }

    public function store(Request $request)
    {
        // Validate the request data (you can add more validation rules if needed)
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        // Create a new chat record
        $chat = Chat::create([
            'name' => $request->name,
        ]);

        return response()->json($chat, 201);
    }

    public function show($id)
    {
        // Find the chat record by its ID
        $chat = Chat::findOrFail($id);

        return response()->json($chat);
    }

    public function update(Request $request, $id)
    {
        // Validate the request data (you can add more validation rules if needed)
        $request->validate([
            'isActive' => 'required|boolean',
            'name' => 'required|string|max:255',
        ]);

        // Find the chat record by its ID and update it
        $chat = Chat::findOrFail($id);
        $chat->update([
            'isActive' => $request->isActive,
            'name' => $request->name,
        ]);

        return response()->json($chat);
    }

    public function destroy($id)
    {
        // Find the chat record by its ID and delete it
        $chat = Chat::findOrFail($id);
        $chat->delete();

        return response()->json(null, 204);
    }


    public function getOrCreateChat(Request $request)
    {
        $user_id = $request->input('user_id');
        $other_user_id = $request->input('other_user_id');
    
        // Check if a chat already exists between these users
        $existingChat = Chat::where(function ($query) use ($user_id, $other_user_id) {
            $query->where(function ($subQuery) use ($user_id, $other_user_id) {
                $subQuery->where('user_id', $user_id)
                         ->where('other_user_id', $other_user_id);
            })->orWhere(function ($subQuery) use ($user_id, $other_user_id) {
                $subQuery->where('user_id', $other_user_id)
                         ->where('other_user_id', $user_id);
            });
        })->first();
    
        if ($existingChat) {
            // Return the existing chat
            return response()->json($existingChat);
        }
    
        // Create a new chat if it doesn't exist
        $newChat = Chat::create([
            'name' => $user_id . $other_user_id,
            'user_id' => (int) $user_id, // Convert to integer
            'other_user_id' => (int) $other_user_id, // Convert to integer
        ]);
    
        return response()->json($newChat, 201);
    }
    

}
