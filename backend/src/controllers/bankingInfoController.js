import pool from '../config/database.js';

const ensureTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS banking_info (
      id INTEGER PRIMARY KEY DEFAULT 1,
      paypal_email VARCHAR(255),
      bank_rib TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query('INSERT INTO banking_info (id) VALUES (1) ON CONFLICT (id) DO NOTHING');
};

export const getBankingInfo = async (req, res) => {
  try {
    await ensureTable();
    const result = await pool.query('SELECT paypal_email, bank_rib, updated_at FROM banking_info WHERE id = 1');
    res.json({ banking: result.rows[0] || {} });
  } catch (error) {
    console.error('Get banking info error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const upsertBankingInfo = async (req, res) => {
  try {
    await ensureTable();
    const paypalEmail = (req.body.paypal_email || '').trim();
    const bankRib = (req.body.bank_rib || '').trim();

    const result = await pool.query(
      `UPDATE banking_info
         SET paypal_email = $1, bank_rib = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = 1
       RETURNING paypal_email, bank_rib, updated_at`,
      [paypalEmail || null, bankRib || null]
    );

    if (result.rowCount === 0) {
      const insert = await pool.query(
        `INSERT INTO banking_info (id, paypal_email, bank_rib, updated_at)
         VALUES (1, $1, $2, CURRENT_TIMESTAMP)
         RETURNING paypal_email, bank_rib, updated_at`,
        [paypalEmail || null, bankRib || null]
      );
      return res.json({ banking: insert.rows[0] });
    }

    res.json({ banking: result.rows[0] });
  } catch (error) {
    console.error('Upsert banking info error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
