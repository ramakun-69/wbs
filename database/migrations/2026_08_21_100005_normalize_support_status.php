<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        DB::table('support_tickets')
            ->where('status', 'resolved')
            ->update(['status' => 'closed']);
    }

    public function down(): void
    {
        DB::table('support_tickets')
            ->where('status', 'closed')
            ->update(['status' => 'resolved']);
    }
};
