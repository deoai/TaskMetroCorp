export interface OccupancyPricing {
    occupancy: number; // Persentase okupansi
    pricing: number;   // Harga
  }
  
  export interface PredictionResult {
    occupancy: number;
    predictedPricing: number; // Harga prediksi
  }
  