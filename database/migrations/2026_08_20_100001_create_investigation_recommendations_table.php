<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('investigation_recommendations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('investigation_id')->constrained('investigations')->cascadeOnDelete();
            $table->string('recommendation_type');
            $table->longText('description')->nullable();
            $table->longText('file_name')->nullable();
            $table->longText('file_path')->nullable();
            $table->string('disk')->default('private');
            $table->string('mime_type')->nullable();
            $table->unsignedBigInteger('file_size')->nullable();
            $table->foreignUuid('created_by')->constrained('users')->restrictOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('investigation_recommendations');
    }
};
