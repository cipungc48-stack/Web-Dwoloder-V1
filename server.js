const express = require('express');
const axios = require('axios');
const UserAgent = require('user-agents');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. SECURITY & STATIC FILES
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 2. ADMIN MONITORING (LOG SETIAP AKSES)
app.use((req, res, next) => {
    if (req.path === '/') {
        const time = new Date().toLocaleTimeString();
        console.log(`\n[${time}] 👥 VISITOR DETECTED!`);
        console.log(`[${time}] 🌐 IP: ${req.ip}`);
        console.log(`[${time}] 📱 AGENT: ${req.headers['user-agent'].substring(0, 50)}...`);
    }
    next();
});

// 3. RATE LIMITER (ANTI SPAM)
const downloadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 Menit
    max: 20, // Max 20 request per IP
    handler: (req, res) => {
        console.log(`\n[⚠️ WARN] IP ${req.ip} TERDETEKSI SPAM!`);
        res.status(429).json({ message: "Sabar bos, jangan spam! Tunggu 15 menit." });
    }
});

// 4. MAIN ENGINE (DOWNLOADER)
app.get('/download', downloadLimiter, async (req, res) => {
    const targetUrl = req.query.url;
    const time = new Date().toLocaleTimeString();

    if (!targetUrl) {
        return res.status(400).json({ error: "Link Kosong!" });
    }

    console.log(`\n[${time}] 📥 ATTEMPTING EXTRACTION...`);
    console.log(`[${time}] 🔗 URL: ${targetUrl}`);
    console.log(`[${time}] 📡 IP : ${req.ip}`);

    try {
        // Generate Stealth User-Agent
        const ua = new UserAgent({ deviceCategory: 'mobile' }).toString();

        // HIT API TIKLYDOWN (STABLE)
        const response = await axios.get(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(targetUrl)}`, {
            headers: { 'User-Agent': ua }
        });

        // Verifikasi Data
        if (response.data) {
            console.log(`[${time}] ✅ SUCCESS: Data secured for ${req.ip}`);
            res.json(response.data);
        } else {
            throw new Error("Empty Response");
        }

    } catch (error) {
        console.log(`[${time}] ❌ ERROR: Failed to bypass server target.`);
        console.error(`Reason: ${error.message}`);
        res.status(500).json({ message: "Gagal menembus firewall target." });
    }
});

// 5. RUN SERVER WITH ASCII ART
app.listen(PORT, () => {
    console.clear();
    console.log(`
    ██████╗  ██████╗  ██████╗ ███████╗████████╗
    ██╔════╝ ██╔═══██╗██╔═══██╗██╔════╝╚══██╔══╝
    ██║  ███╗██║   ██║██║   ██║███████╗   ██║   
    ██║   ██║██║   ██║██║   ██║╚════██║   ██║   
    ╚██████╔╝╚██████╔╝╚██████╔╝███████║   ██║   
     ╚═════╝  ╚═════╝  ╚═════╝ ╚══════╝   ╚═╝   
    =============================================
    🚀 ENGINE   : GOOSTTEAM V4.0 ELITE
    📡 PORT     : ${PORT}
    🛡️  SECURITY : HIGH (HELMET & RATE-LIMIT)
    📊 MONITOR  : ACTIVE (REAL-TIME LOGGING)
    =============================================
    [SYSTEM] Server is now listening for requests...
    `);
});
