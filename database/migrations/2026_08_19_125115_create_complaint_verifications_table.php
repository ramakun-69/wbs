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
        Schema::create('complaint_verifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('complaint_id')
                ->unique()
                ->constrained('complaints')
                ->cascadeOnDelete();
            $table->string('decision');
            $table->longText('summary')->nullable();
            $table->longText('note')->nullable();
            $table->foreignUuid('verified_by')
                ->constrained('users')
                ->restrictOnDelete();
            $table->timestamp('verified_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('complaint_verifications');
    }
};
