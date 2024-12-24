import React, { useState } from 'react';
import axios from 'axios';

const Predictor: React.FC = () => {
  const [occupancy, setOccupancy] = useState<number | ''>(''); // State untuk input occupancy
  const [predictedPrice, setPredictedPrice] = useState<number | null>(null); // State untuk hasil prediksi

  // Fungsi untuk menangani perubahan input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOccupancy(value === '' ? '' : parseInt(value)); // Ubah ke number jika ada input
  };

  // Fungsi untuk prediksi harga
  const handlePredict = async () => {
    if (occupancy === '' || occupancy <= 0) {
      alert('Please enter a valid occupancy');
      return;
    }

    try {
      const response = await axios.get('http://localhost:3000/linear-regression/predict', {
        params: { occupancyValues: occupancy },
      });

      const predictedPrice = (response.data as { predictedPricing: number }[])[0]?.predictedPricing;
      setPredictedPrice(predictedPrice);
    } catch (error) {
      console.error('Error predicting price:', error);
      alert('Failed to predict price.');
    }
  };

  // Fungsi untuk menyimpan prediksi ke database
  const handleSave = async () => {
    if (occupancy === '' || predictedPrice === null) {
      alert('Please predict the price first before saving');
      return;
    }

    try {
      await axios.post('http://localhost:3000/linear-regression/store-predict', {
        occupancy,
        price: predictedPrice,
      });
      alert('Predicted price saved successfully!');
    } catch (error) {
      console.error('Error saving predicted price:', error);
      alert('Failed to save predicted price.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto', textAlign: 'center' }}>
      <h2>Predict Hotel Pricing</h2>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="occupancy">Occupancy:</label>
        <input
          id="occupancy"
          type="number"
          value={occupancy}
          onChange={handleInputChange}
          placeholder="Enter occupancy"
          style={{ marginLeft: '10px', padding: '5px', width: '100px' }}
        />
      </div>
      <button onClick={handlePredict} style={{ marginRight: '10px', padding: '5px 10px' }}>
        Predict
      </button>
      <button onClick={handleSave} style={{ padding: '5px 10px' }}>
        Save Predicted Price
      </button>
      {predictedPrice !== null && (
        <div style={{ marginTop: '20px' }}>
          <strong>Predicted Price:</strong> {predictedPrice.toLocaleString()} IDR
        </div>
      )}
    </div>
  );
};

export default Predictor;
