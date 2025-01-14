const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Data storage (use fs to simulate a persistent store)
const dataFile = './data.json';

// Helper to read/write data
const readData = () => JSON.parse(fs.readFileSync(dataFile, 'utf8') || '[]');
const writeData = (data) => fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));


if (!fs.existsSync(dataFile)) {
  writeData([]);
}

// Routes
app.get('/', (req, res) => {
  res.send('Service is up');
});

app.get('/items', (req, res) => {
  const items = readData();
  res.status(200).json(items);
});

app.get('/items/:id', (req, res) => {
  const items = readData();
  const item = items.find((i) => i.id === parseInt(req.params.id));
  if (item) {
    res.status(200).json(item);
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

app.post('/items', (req, res) => {
  const items = readData();
  const newItem = { id: Date.now(), ...req.body };
  items.push(newItem);
  writeData(items);
  res.status(201).json(newItem);
});

app.put('/items/:id', (req, res) => {
  let items = readData();
  const index = items.findIndex((i) => i.id === parseInt(req.params.id));
  if (index !== -1) {
    items[index] = { ...items[index], ...req.body };
    writeData(items);
    res.status(200).json(items[index]);
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

app.delete('/items/:id', (req, res) => {
  let items = readData();
  const newItems = items.filter((i) => i.id !== parseInt(req.params.id));
  if (newItems.length < items.length) {
    writeData(newItems);
    res.status(200).json({ message: 'Item deleted' });
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
