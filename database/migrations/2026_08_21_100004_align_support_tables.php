<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('support_messages', function (Blueprint $table) {
            $table->dropForeign(['support_id']);
            $table->renameColumn('support_id', 'support_ticket_id');
        });

        Schema::table('support_messages', function (Blueprint $table) {
            $table->foreign('support_ticket_id')
                ->references('id')
                ->on('support_tickets')
                ->cascadeOnDelete();
        });

        Schema::table('support_attachments', function (Blueprint $table) {
            $table->dropForeign(['support_id']);
            $table->dropForeign(['message_id']);
            $table->dropForeign(['uploaded_by']);
            $table->renameColumn('support_id', 'support_ticket_id');
            $table->renameColumn('message_id', 'support_message_id');
            $table->renameColumn('file_name', 'original_name');
            $table->renameColumn('file_path', 'path');
            $table->renameColumn('file_size', 'size');
        });

        Schema::table('support_attachments', function (Blueprint $table) {
            $table->foreign('support_ticket_id')
                ->references('id')
                ->on('support_tickets')
                ->cascadeOnDelete();
            $table->foreign('support_message_id')
                ->references('id')
                ->on('support_messages')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('support_attachments', function (Blueprint $table) {
            $table->dropForeign(['support_ticket_id']);
            $table->dropForeign(['support_message_id']);
            $table->renameColumn('support_ticket_id', 'support_id');
            $table->renameColumn('support_message_id', 'message_id');
            $table->renameColumn('original_name', 'file_name');
            $table->renameColumn('path', 'file_path');
            $table->renameColumn('size', 'file_size');
        });

        Schema::table('support_messages', function (Blueprint $table) {
            $table->dropForeign(['support_ticket_id']);
            $table->renameColumn('support_ticket_id', 'support_id');
        });

        Schema::table('support_messages', function (Blueprint $table) {
            $table->foreign('support_id')
                ->references('id')
                ->on('supports')
                ->cascadeOnDelete();
        });

        Schema::table('support_attachments', function (Blueprint $table) {
            $table->foreign('support_id')
                ->references('id')
                ->on('supports')
                ->cascadeOnDelete();
            $table->foreign('message_id')
                ->references('id')
                ->on('support_messages')
                ->nullOnDelete();
            $table->foreign('uploaded_by')
                ->references('id')
                ->on('users')
                ->cascadeOnDelete();
        });
    }
};
