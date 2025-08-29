-- Migration: Create payments table
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(50),
    consultant VARCHAR(255),
    amount NUMERIC(10,2) NOT NULL,
    transaction_id VARCHAR(100),
    payment_date TIMESTAMP DEFAULT NOW() NOT NULL,
    status VARCHAR(50) DEFAULT 'paid',
    notes TEXT,
    metadata JSON,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
