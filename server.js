const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
// افزایش حجم مجاز برای ارسال عکس و فایل
app.use(express.json({ limit: '50mb' }));
app.use(cors());

const pool = new Pool({
    user: 'postgres',
    host: 'services.irn3.chabokan.net',
    database: 'anthony',
    password: 'kCu1QWZtGZeOExqC', // حتما رمز خودت رو بذار
    port: 34341,
    ssl: false
});

// مسیر ارسال پیام
app.post('/send', async (req, res) => {
    const { sender, content, file_data, file_name, type } = req.body;
    try {
        await pool.query(
            'INSERT INTO secure_messages (sender, content, file_data, file_name, type) VALUES ($1, $2, $3, $4, $5)',
            [sender, content || null, file_data || null, file_name || null, type]
        );
        res.status(200).send({ status: 'ok' });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// مسیر دریافت پیام‌ها
app.get('/messages', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM secure_messages ORDER BY created_at ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
