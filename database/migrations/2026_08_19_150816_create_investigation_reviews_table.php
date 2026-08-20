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
        Schema::create('investigation_reviews', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->foreignUuid('investigation_id')
                ->constrained('investigations')
                ->cascadeOnDelete();

            $table->string('reviewer_role');
            $table->string('decision');

            $table->longText('note')->nullable();

            $table->foreignUuid('reviewed_by')
                ->constrained('users')
                ->restrictOnDelete();

            $table->timestamp('reviewed_at');

            $table->timestamps();

            $table->index([
                'investigation_id',
                'reviewer_role',
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('investigation_reviews');
    }
};
