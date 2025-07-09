require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;

app.get('/api/flights', async (req, res) => {
  try {
    const apiKey = process.env.AVIATIONSTACK_API_KEY;
    const url = `http://api.aviationstack.com/v1/flights?access_key=${apiKey}&dep_iata=DEL&arr_iata=BOM`;
    const response = await axios.get(url);
    const flights = response.data.data || [];
    if (!flights.length) {
      return res.status(404).json({ error: 'No flights found.' });
    }
    const result = flights.map(flight => ({
      airline: flight.airline?.name || '',
      flight_number: flight.flight?.number || '',
      departure_time: flight.departure?.scheduled || '',
      arrival_time: flight.arrival?.scheduled || '',
      status: flight.flight_status || ''
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch flight data.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 