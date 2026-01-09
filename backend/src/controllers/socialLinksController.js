import pool from '../config/database.js';

const ensureTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS social_links (
      platform VARCHAR(50) PRIMARY KEY,
      url VARCHAR(500) NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

// Public: list social links
export const getSocialLinks = async (req, res) => {
  try {
    await ensureTable();
    const result = await pool.query(
      'SELECT platform, url, updated_at FROM social_links ORDER BY platform ASC'
    );
    res.json({ links: result.rows });
  } catch (error) {
    console.error('Get social links error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: upsert or remove a link by platform
export const upsertSocialLink = async (req, res) => {
  try {
    await ensureTable();
    const { platform } = req.params;
    const trimmedPlatform = (platform || '').trim().toLowerCase();
    const trimmedUrl = (req.body.url || '').trim();

    if (!trimmedPlatform) {
      return res.status(400).json({ message: 'Platform is required' });
    }

    if (!trimmedUrl) {
      await pool.query('DELETE FROM social_links WHERE platform = $1', [trimmedPlatform]);
      return res.json({ message: 'Link removed', platform: trimmedPlatform });
    }

    const result = await pool.query(
      `INSERT INTO social_links (platform, url, updated_at)
       VALUES ($1, $2, CURRENT_TIMESTAMP)
       ON CONFLICT (platform)
       DO UPDATE SET url = EXCLUDED.url, updated_at = CURRENT_TIMESTAMP
       RETURNING platform, url, updated_at`,
      [trimmedPlatform, trimmedUrl]
    );

    res.json({ link: result.rows[0] });
  } catch (error) {
    console.error('Upsert social link error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
