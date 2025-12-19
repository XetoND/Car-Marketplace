<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;

class NhtsaController extends Controller
{
    // GET /api/brands
    public function getBrands()
    {
        $cached = DB::table('brand_cache')->get();
        
        if ($cached->count() > 0) {
            return response()->json($cached);
        }

        // Fetch from External API
        $response = Http::withoutVerifying()->get('https://vpic.nhtsa.dot.gov/api/vehicles/GetAllMakes?format=json');
        
        if ($response->successful()) {
            $data = $response->json()['Results'];
            
            // Limit to top 50 common brands to keep it simple for this demo
            $commonBrands = [
                'TOYOTA', 'HONDA', 'FORD', 'CHEVROLET', 'NISSAN', 
                'BMW', 'MERCEDES-BENZ', 'AUDI', 'VOLKSWAGEN', 'HYUNDAI',
                'KIA', 'MAZDA', 'SUBARU', 'LEXUS', 'JEEP', 'TESLA'
            ];

            $insertData = [];
            foreach ($data as $item) {
                if (in_array(strtoupper($item['Make_Name']), $commonBrands)) {
                    $insertData[] = [
                        'id' => (string) \Illuminate\Support\Str::uuid(),
                        'brand_id' => $item['Make_ID'],
                        'name' => ucwords(strtolower($item['Make_Name'])),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }

            // Save to DB
            DB::table('brand_cache')->insert($insertData);

            return response()->json($insertData);
        }

        return response()->json(['message' => 'Failed to fetch brands'], 500);
    }

    // GET /api/models/{brand_id}
    public function getModels($brandName)
    {
        $brandName = strtolower($brandName);

        $cached = DB::table('model_cache')
            ->where('brand_id', $brandName) 
            ->get();

        if ($cached->count() > 0) {
            return response()->json($cached);
        }

        // Fetch External API
        $response = Http::withoutVerifying()->get("https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/$brandName?format=json");

        if ($response->successful()) {
            $data = $response->json()['Results'];
            
            $insertData = [];
            foreach ($data as $item) {
                $insertData[] = [
                    'id' => (string) \Illuminate\Support\Str::uuid(),
                    'model_id' => $item['Model_ID'],
                    'brand_id' => $brandName,
                    'name' => $item['Model_Name'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            // Save to DB
            DB::table('model_cache')->insert($insertData);

            return response()->json($insertData);
        }

        return response()->json(['message' => 'Failed to fetch models'], 500);
    }
}