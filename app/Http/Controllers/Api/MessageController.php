<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message; // Make sure the namespace matches your actual project structure
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function updateNotifyStatus(Request $request, $messageId)
    {
        $message = Message::findOrFail($messageId);
    
        // Update the notify status
        $message->update(['notify' => true]); // Update to false to match client
    
        return response()->json(['message' => 'Notify status updated successfully']);
    }
    
}
