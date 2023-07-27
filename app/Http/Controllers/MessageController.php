<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function store(Request $request)
{
    $message = Message::create(['body' => $request->body]);
    broadcast(new MessageSentEvent($message->body))->toOthers();
    return response()->json('Message broadcast');
}
}
