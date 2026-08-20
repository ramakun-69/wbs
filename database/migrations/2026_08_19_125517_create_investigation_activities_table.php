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
        Schema::create('investigation_activities', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->foreignUuid('investigation_id')
                ->constrained('investigations')
                ->cascadeOnDelete();

            $table->date('activity_date');
            $table->string('activity_type');
            $table->longText('description');

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
        Schema::dropIfExists('investigation_activities');
    }
};
