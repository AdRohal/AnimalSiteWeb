import pool from '../config/database.js';

const ensureTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS contact_info (
      id INTEGER PRIMARY KEY DEFAULT 1,
      email VARCHAR(255),
      phone VARCHAR(50),
      address TEXT,
      whatsapp VARCHAR(100),
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query('INSERT INTO contact_info (id) VALUES (1) ON CONFLICT (id) DO NOTHING');
};

export const getContactInfo = async (req, res) => {
  try {
    await ensureTable();
    const result = await pool.query('SELECT email, phone, address, whatsapp, updated_at FROM contact_info WHERE id = 1');
    res.json({ contact: result.rows[0] || {} });
  } catch (error) {
    console.error('Get contact info error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const upsertContactInfo = async (req, res) => {
  try {
    await ensureTable();
    const email = (req.body.email || '').trim();
    const phone = (req.body.phone || '').trim();
    const address = (req.body.address || '').trim();
    const whatsapp = (req.body.whatsapp || '').trim();

    const result = await pool.query(
      `UPDATE contact_info
         SET email = $1, phone = $2, address = $3, whatsapp = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = 1
       RETURNING email, phone, address, whatsapp, updated_at`,
      [email || null, phone || null, address || null, whatsapp || null]
    );

    // If no row was updated (should not happen), insert the row
    if (result.rowCount === 0) {
      const insert = await pool.query(
        `INSERT INTO contact_info (id, email, phone, address, whatsapp, updated_at)
         VALUES (1, $1, $2, $3, $4, CURRENT_TIMESTAMP)
         RETURNING email, phone, address, whatsapp, updated_at`,
        [email || null, phone || null, address || null, whatsapp || null]
      );
      return res.json({ contact: insert.rows[0] });
    }

    res.json({ contact: result.rows[0] });
  } catch (error) {
    console.error('Upsert contact info error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
