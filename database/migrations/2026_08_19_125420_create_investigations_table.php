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
        Schema::create('investigations', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->foreignUuid('complaint_id')
                ->unique()
                ->constrained('complaints')
                ->cascadeOnDelete();

            // SK
            $table->string('sk_number')->nullable()->unique();
            $table->date('sk_date')->nullable();
            $table->string('sk_file_path')->nullable();

            // Snapshot dari SK
            $table->longText('team_name')->nullable();
            $table->longText('team_leader_name')->nullable();

            $table->longText('basis')->nullable();

            $table->string('handling_type')->nullable();
            $table->date('target_completion_date')->nullable();

            // Investigation result
            $table->longText('findings')->nullable();
            $table->longText('conclusion')->nullable();
            $table->longText('violation_element')->nullable();
            $table->longText('recommendation')->nullable();
            $table->string('result_status')->nullable();

            // Workflow
            $table->string('status')->index();

            $table->foreignUuid('created_by')
                ->constrained('users')
                ->restrictOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('investigations');
    }
};
