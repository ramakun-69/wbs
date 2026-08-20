<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('complaints', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('ticket_number')->unique();
            $table->foreignUuid('category_id')
                ->constrained('complaint_categories')
                ->restrictOnDelete();
            // Encrypted
            $table->longText('title');
            $table->longText('description');
            // Metadata
            $table->string('priority')->nullable();
            $table->string('status')->index();

            $table->foreignUuid('created_by')
                ->constrained('users')
                ->restrictOnDelete();

            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('completed_at')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('complaints');
    }
};
