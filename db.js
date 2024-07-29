// index.js

const express = require('express');
const mongodb = require('mongodb');
const cors = require('cors');
const { ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS for all routes

// MongoDB Connection
const MongoClient = mongodb.MongoClient;
const mongoURI = 'yourKluster';
const dbName = 'expenses';

let db;

MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log('Connected successfully to MongoDB');
    db = client.db(dbName);

    // Express Routes
    // GET all expenses
    app.get('/expenses', async (req, res) => {
      try {
        const collection = db.collection('expense'); // Replace 'expense' with your collection name
        const items = await collection.find().toArray();
        res.json(items);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });

       // GET single expense by ID
       app.get('/expenses/:id', async (req, res) => {
        try {
          const collection = db.collection('expense'); // Replace 'expense' with your collection name
          const itemId = new mongodb.ObjectId(req.params.id); // Corrected usage
          const item = await collection.findOne({ _id: itemId });
          if (!item) {
            return res.status(404).json({ message: 'Item not found' });
          }
          res.json(item);
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      });

    // POST new expense
    app.post('/expenses', async (req, res) => {
      try {
        const collection = db.collection('expense'); // Replace 'expense' with your collection name
        const newItem = req.body;
        const result = await collection.insertOne(newItem);
        res.status(201).json(result.ops[0]);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
    });

    // PUT update expense by ID
    app.put('/expenses/:id', async (req, res) => {
      try {
        const collection = db.collection('expense'); // Replace 'expense' with your collection name
        const updatedItem = req.body;
        const result = await collection.updateOne(
          { _id: new mongodb.ObjectID(req.params.id) },
          { $set: updatedItem }
        );
        if (result.matchedCount === 0) {
          return res.status(404).json({ message: 'Item not found' });
        }
        res.json(updatedItem);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
    });

   // DELETE expense by ID
app.delete('/expenses/:id', async (req, res) => {
  try {
    const collection = db.collection('expense');
    const itemId = new ObjectId(req.params.id); // Correct usage
    const result = await collection.deleteOne({ _id: itemId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ message: 'Item deleted' });
  } catch (err) {
    console.error('Error during delete operation:', err);
    res.status(500).json({ message: err.message });
  }
});

    // Start Server
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

  })
  .catch(err => {
    console.error('Failed to connect to the database');
    console.error(err);
    process.exit(1); // Exit with failure
  });
