-- Pharmacy module schema (Postgres)

CREATE TABLE IF NOT EXISTS MEDICINE (
  medicine_id SERIAL PRIMARY KEY,
  medicine_code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(100),
  manufacturer VARCHAR(150),
  dosage_form VARCHAR(50),
  strength VARCHAR(50),
  prescription_required BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS MEDICINE_BATCH (
  batch_id SERIAL PRIMARY KEY,
  medicine_id INT REFERENCES MEDICINE(medicine_id),
  batch_number VARCHAR(100),
  expiry_date DATE,
  purchase_price NUMERIC,
  selling_price NUMERIC,
  quantity_available INT
);

CREATE TABLE IF NOT EXISTS SUPPLIER (
  supplier_id SERIAL PRIMARY KEY,
  supplier_name VARCHAR(150),
  contact_person VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS PURCHASE_ORDER (
  purchase_order_id SERIAL PRIMARY KEY,
  supplier_id INT REFERENCES SUPPLIER(supplier_id),
  order_date DATE,
  status VARCHAR(30)
);

CREATE TABLE IF NOT EXISTS PURCHASE_ORDER_ITEM (
  item_id SERIAL PRIMARY KEY,
  purchase_order_id INT REFERENCES PURCHASE_ORDER(purchase_order_id),
  medicine_id INT REFERENCES MEDICINE(medicine_id),
  quantity INT,
  unit_price NUMERIC
);

CREATE TABLE IF NOT EXISTS PRESCRIPTION (
  prescription_id SERIAL PRIMARY KEY,
  patient_id INT,
  doctor_id INT,
  prescription_date DATE
);

CREATE TABLE IF NOT EXISTS PRESCRIPTION_ITEM (
  item_id SERIAL PRIMARY KEY,
  prescription_id INT REFERENCES PRESCRIPTION(prescription_id),
  medicine_id INT REFERENCES MEDICINE(medicine_id),
  dosage VARCHAR(50),
  duration_days INT
);

CREATE TABLE IF NOT EXISTS PHARMACY_SALE (
  sale_id SERIAL PRIMARY KEY,
  prescription_id INT REFERENCES PRESCRIPTION(prescription_id),
  sale_date TIMESTAMP,
  total_amount NUMERIC
);

CREATE TABLE IF NOT EXISTS PHARMACY_SALE_ITEM (
  item_id SERIAL PRIMARY KEY,
  sale_id INT REFERENCES PHARMACY_SALE(sale_id),
  medicine_id INT REFERENCES MEDICINE(medicine_id),
  quantity INT,
  price NUMERIC
);
