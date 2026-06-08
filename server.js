const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();

// تنظیم دستی هدرها برای دور زدن محدودیت CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json({ limit: '50mb' }));

const pool = new Pool({
    user: 'postgres',
    host: 'services.irn3.chabokan.net',
    database: 'anthony',
    password: 'رمز_دیتابیس_شما', // حتما رمز خودت رو بذار
    port: 34341,
    ssl: false
});

app.get('/', (req, res) => res.send('Chat Server is Online! 🚀'));

app.post('/send', async (req, res) => {
    const { sender, content, file_data, file_name, type } = req.body;
    try {
        await pool.query(
            'INSERT INTO secure_messages (sender, content, file_data, file_name, type) VALUES ($1, $2, $3, $4, $5)',
            [sender, content || null, file_data || null, file_name || null, type]
        );
        res.status(200).json({ status: 'ok' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/messages', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM secure_messages ORDER BY created_at ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is listening on port ${PORT}`);
});
