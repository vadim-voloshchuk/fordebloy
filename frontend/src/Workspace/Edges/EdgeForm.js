import React, { useState } from 'react';

const EdgeForm = ({ onAddEdge }) => {
  const [directed, setDirected] = useState(false);
  const [weight, setWeight] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (weight === '' || isNaN(weight) || weight < 0 || weight > 1) {
      alert('Please enter a valid weight between 0 and 1');
      return;
    }

    const newEdge = {
      directed: directed,
      weight: parseFloat(weight)
    };

    onAddEdge(newEdge);

    setDirected(false);
    setWeight('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Edge</h2>
      <div>
        <label>Directed:</label>
        <input
          type="checkbox"
          checked={directed}
          onChange={(e) => setDirected(e.target.checked)}
        />
      </div>
      <div>
        <label>Weight:</label>
        <input
          type="number"
          step="0.01"
          min="0"
          max="1"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
      </div>
      <button type="submit">Add Edge</button>
    </form>
  );
};

export default EdgeForm;
