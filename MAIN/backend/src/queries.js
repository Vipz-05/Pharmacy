const db = require('./db');

async function createMedicine({ medicine_code, name, category, manufacturer, dosage_form, strength, prescription_required }){
  const res = await db.query(
    `INSERT INTO MEDICINE(medicine_code,name,category,manufacturer,dosage_form,strength,prescription_required)
     VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [medicine_code, name, category, manufacturer, dosage_form, strength, prescription_required]
  );
  return res.rows[0];
}

async function listMedicines(filters){
  let base = 'SELECT * FROM MEDICINE';
  const conditions = [];
  const params = [];
  if(filters){
    if(filters.name){ params.push(`%${filters.name}%`); conditions.push(`name ILIKE $${params.length}`); }
    if(filters.category){ params.push(filters.category); conditions.push(`category = $${params.length}`); }
    if(filters.prescription_required !== undefined){ params.push(filters.prescription_required); conditions.push(`prescription_required = $${params.length}`); }
  }
  if(conditions.length) base += ' WHERE ' + conditions.join(' AND ');
  const res = await db.query(base, params);
  return res.rows;
}

async function addMedicineBatch({ medicine_id, batch_number, expiry_date, purchase_price, selling_price, quantity }){
  const res = await db.query(
    `INSERT INTO MEDICINE_BATCH(medicine_id,batch_number,expiry_date,purchase_price,selling_price,quantity_available)
     VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
    [medicine_id, batch_number, expiry_date, purchase_price, selling_price, quantity]
  );
  return res.rows[0];
}

async function getInventoryStatus(){
  const res = await db.query(
    `SELECT m.medicine_id, m.medicine_code, m.name, COALESCE(SUM(b.quantity_available),0) AS total_quantity
     FROM MEDICINE m
     LEFT JOIN MEDICINE_BATCH b ON b.medicine_id = m.medicine_id
     GROUP BY m.medicine_id, m.medicine_code, m.name
     ORDER BY m.name`
  );
  return res.rows;
}

async function createPurchaseOrder({ supplier_id, items }){
  const client = await db.pool.connect();
  try{
    await client.query('BEGIN');
    const poRes = await client.query(
      `INSERT INTO PURCHASE_ORDER(supplier_id,order_date,status) VALUES($1,CURRENT_DATE,'CREATED') RETURNING *`,
      [supplier_id]
    );
    const po = poRes.rows[0];
    for(const it of items){
      await client.query(
        `INSERT INTO PURCHASE_ORDER_ITEM(purchase_order_id,medicine_id,quantity,unit_price) VALUES($1,$2,$3,$4)`,
        [po.purchase_order_id, it.medicine_id, it.quantity, it.unit_price]
      );
    }
    await client.query('COMMIT');
    return po;
  }catch(e){
    await client.query('ROLLBACK');
    throw e;
  }finally{ client.release(); }
}

async function createPrescription({ patient_id, doctor_id, items }){
  const client = await db.pool.connect();
  try{
    await client.query('BEGIN');
    const presRes = await client.query(
      `INSERT INTO PRESCRIPTION(patient_id,doctor_id,prescription_date) VALUES($1,$2,CURRENT_DATE) RETURNING *`,
      [patient_id, doctor_id]
    );
    const pres = presRes.rows[0];
    for(const it of items){
      await client.query(
        `INSERT INTO PRESCRIPTION_ITEM(prescription_id,medicine_id,dosage,duration_days) VALUES($1,$2,$3,$4)`,
        [pres.prescription_id, it.medicine_id, it.dosage, it.duration_days]
      );
    }
    await client.query('COMMIT');
    return pres;
  }catch(e){
    await client.query('ROLLBACK');
    throw e;
  }finally{ client.release(); }
}

// processSale: creates sale record and sale items, decrements batches (FIFO by expiry)
async function processSale({ prescription_id, items }){
  const client = await db.pool.connect();
  try{
    await client.query('BEGIN');
    // calculate total
    let total = 0;
    const saleRes = await client.query(
      `INSERT INTO PHARMACY_SALE(prescription_id,sale_date,total_amount) VALUES($1,CURRENT_TIMESTAMP,0) RETURNING *`,
      [prescription_id]
    );
    const sale = saleRes.rows[0];

    for(const it of items){
      // find batches ordered by earliest expiry with available quantity
      let remaining = it.quantity;
      const batchesRes = await client.query(
        `SELECT * FROM MEDICINE_BATCH WHERE medicine_id = $1 AND quantity_available > 0 ORDER BY expiry_date NULLS LAST`,
        [it.medicine_id]
      );
      for(const b of batchesRes.rows){
        if(remaining <= 0) break;
        const take = Math.min(remaining, b.quantity_available);
        await client.query(`UPDATE MEDICINE_BATCH SET quantity_available = quantity_available - $1 WHERE batch_id = $2`, [take, b.batch_id]);
        await client.query(`INSERT INTO PHARMACY_SALE_ITEM(sale_id,medicine_id,quantity,price) VALUES($1,$2,$3,$4)`, [sale.sale_id, it.medicine_id, take, it.price || 0]);
        remaining -= take;
        total += (it.price || 0) * take;
      }
      if(remaining > 0){
        throw new Error(`Insufficient stock for medicine_id ${it.medicine_id}`);
      }
    }

    await client.query(`UPDATE PHARMACY_SALE SET total_amount = $1 WHERE sale_id = $2`, [total, sale.sale_id]);
    await client.query('COMMIT');
    const final = await db.query('SELECT * FROM PHARMACY_SALE WHERE sale_id = $1', [sale.sale_id]);
    return { sale: final.rows[0], total };
  }catch(e){
    await client.query('ROLLBACK');
    throw e;
  }finally{ client.release(); }
}

module.exports = {
  createMedicine,
  listMedicines,
  addMedicineBatch,
  getInventoryStatus,
  createPurchaseOrder,
  createPrescription,
  processSale
};
