import React from 'react';
import Predictor from './Predictor.tsx';

const App: React.FC = () => {
  return (
    <>
      <div style={{ padding: '10vh' }}>
        <h1 style={{ textAlign: 'center' }}>Hotel Price Prediction Using Linear Regression Based on Occupancy</h1>
        <Predictor />
      </div>
    </>
  );
};

export default App;
