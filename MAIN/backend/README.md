# Pharmacy Backend (minimal)

Quick steps:

1. Copy `.env.example` to `.env` and set `DATABASE_URL`.
2. Install dependencies:

```bash
cd backend
npm install
```

3. Create the database and run migration using psql:

```bash
# example
psql "$DATABASE_URL" -f migrations/schema.sql
```

4. Start server:

```bash
npm start
```

API endpoints:

- `POST /medicines` - create medicine
- `GET /medicines` - list medicines
- `POST /batches` - add batch
- `GET /inventory` - inventory status
- `POST /purchase-orders` - create purchase order
- `POST /prescriptions` - create prescription
- `POST /sales` - process sale
