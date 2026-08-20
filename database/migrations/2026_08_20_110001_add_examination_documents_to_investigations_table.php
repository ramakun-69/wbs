<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('investigations', function (Blueprint $table) {
            $table->string('review_document_path')->nullable()->after('basis');
            $table->string('implementation_document_path')->nullable()->after('target_completion_date');
            $table->string('conclusion_category')->nullable()->after('conclusion');
            $table->string('recommendation_document_path')->nullable()->after('recommendation');
            $table->longText('reporter_report')->nullable()->after('recommendation_document_path');
        });
    }

    public function down(): void
    {
        Schema::table('investigations', function (Blueprint $table) {
            $table->dropColumn([
                'review_document_path',
                'implementation_document_path',
                'conclusion_category',
                'recommendation_document_path',
                'reporter_report',
            ]);
        });
    }
};
