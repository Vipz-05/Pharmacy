const express = require('express');
const bodyParser = require('express').json;
require('dotenv').config();
const queries = require('./queries');

const app = express();
app.use(bodyParser());

app.get('/', (req, res) => res.json({ service: 'pharmacy-backend', status: 'ok' }));

app.post('/medicines', async (req, res) => {
  try{
    const m = await queries.createMedicine(req.body);
    res.status(201).json(m);
  }catch(e){ res.status(400).json({ error: e.message }); }
});

app.get('/medicines', async (req, res) => {
  try{
    const filters = { name: req.query.name, category: req.query.category };
    if(req.query.prescription_required !== undefined) filters.prescription_required = req.query.prescription_required === 'true';
    const list = await queries.listMedicines(filters);
    res.json(list);
  }catch(e){ res.status(500).json({ error: e.message }); }
});

app.post('/batches', async (req, res) => {
  try{
    const b = await queries.addMedicineBatch(req.body);
    res.status(201).json(b);
  }catch(e){ res.status(400).json({ error: e.message }); }
});

app.get('/inventory', async (req, res) => {
  try{
    const inv = await queries.getInventoryStatus();
    res.json(inv);
  }catch(e){ res.status(500).json({ error: e.message }); }
});

app.post('/purchase-orders', async (req, res) => {
  try{
    const po = await queries.createPurchaseOrder(req.body);
    res.status(201).json(po);
  }catch(e){ res.status(400).json({ error: e.message }); }
});

app.post('/prescriptions', async (req, res) => {
  try{
    const p = await queries.createPrescription(req.body);
    res.status(201).json(p);
  }catch(e){ res.status(400).json({ error: e.message }); }
});

app.post('/sales', async (req, res) => {
  try{
    const r = await queries.processSale(req.body);
    res.status(201).json(r);
  }catch(e){ res.status(400).json({ error: e.message }); }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Pharmacy backend listening on ${port}`));
