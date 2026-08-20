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
        Schema::create('complaint_approvals', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->foreignUuid('complaint_id')
                ->constrained('complaints')
                ->cascadeOnDelete();

            $table->string('stage');
            $table->string('decision');

            $table->longText('note')->nullable();

            $table->foreignUuid('decided_by')
                ->constrained('users')
                ->restrictOnDelete();

            $table->timestamp('decided_at');

            $table->timestamps();

            $table->index([
                'complaint_id',
                'stage',
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('complaint_approvals');
    }
};
