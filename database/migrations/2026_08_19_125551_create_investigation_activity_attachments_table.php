<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('investigation_activity_attachments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('investigation_id')
                ->constrained('investigations')
                ->cascadeOnDelete();
            $table->foreignUuid('activity_id')
                ->nullable()
                ->constrained('investigation_activities')
                ->nullOnDelete();
            $table->string('file_name');
            $table->string('file_path');
            $table->string('disk')->default('private');
            $table->string('mime_type')->nullable();
            $table->unsignedBigInteger('file_size')->nullable();

            $table->foreignUuid('uploaded_by')
                ->constrained('users')
                ->restrictOnDelete();

            $table->timestamps();

            $table->index([
                'investigation_id',
                'activity_id',
            ], 'iaa_investigation_activity_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('investigation_activity_attachments');
    }
};
