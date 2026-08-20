<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('complaint_reporters', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->foreignUuid('complaint_id')
                ->unique()
                ->constrained('complaints')
                ->cascadeOnDelete();

        $table->longText('name')->nullable();
            $table->boolean('is_anonymous')->default(false);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('complaint_reporters');
    }
};
