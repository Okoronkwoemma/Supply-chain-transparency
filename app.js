require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const crypto = require('crypto');
const Product = require('./models/product');

const app = express();
app.use(express.json());

// 1. DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/supply_chain')
    .then(() => console.log("Connected to Supply Chain Database"))
    .catch(err => console.error("Database Connection Error:", err));

// 2. UTILITY: Calculate SHA-256 Hash
const calculateHash = (status, actor, timestamp, previousHash) => {
    const data = status + actor + timestamp + previousHash;
    return crypto.createHash('sha256').update(data).digest('hex');
};

// 3. ROUTE: Register Product (Step 1: Manufactured)
app.post('/register', async (req, res) => {
    try {
        const { name, manufacturer, role } = req.body;

        if (role !== 'Manufacturer') {
            return res.status(403).json({ error: "Only manufacturers can register products" });
        }

        const timestamp = new Date().toISOString();
        const initialHash = calculateHash('Manufactured', manufacturer, timestamp, "0");

        const product = new Product({
            name,
            manufacturer,
            status: 'Manufactured',
            history: [{
                status: 'Manufactured',
                actor: manufacturer,
                timestamp: timestamp,
                previousHash: "0",
                hash: initialHash
            }]
        });

        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 4. ROUTE: Update Status (The Logic Layer)
app.patch('/update-status/:id', async (req, res) => {
    try {
        const { nextStatus, actor, role } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) return res.status(404).json({ error: "Product not found" });

        // Logic: Enforce Linear Supply Chain Flow
        const validNextStep = {
            'Manufactured': 'In Distribution',
            'In Distribution': 'For Sale',
            'For Sale': 'Sold'
        };

        if (validNextStep[product.status] !== nextStatus) {
            return res.status(400).json({
                error: `Invalid Move. Current: ${product.status}. Expected: ${validNextStep[product.status]}`
            });
        }

        // Logic: Role Permission Enforcement
        if (nextStatus === 'In Distribution' && role !== 'Manufacturer') return res.status(403).json({ error: "Only Manufacturers can ship." });
        if (nextStatus === 'For Sale' && role !== 'Distributor') return res.status(403).json({ error: "Only Distributors can list for sale." });

        // Blockchain Logic: Link to previous entry
        const lastEntry = product.history[product.history.length - 1];
        const timestamp = new Date().toISOString();
        const newHash = calculateHash(nextStatus, actor, timestamp, lastEntry.hash);

        product.status = nextStatus;
        product.history.push({
            status: nextStatus,
            actor: actor,
            timestamp: timestamp,
            previousHash: lastEntry.hash,
            hash: newHash
        });

        await product.save();
        res.json({ message: "Status updated and hashed successfully", product });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. ROUTE: Verify Integrity (The Auditor)
app.get('/verify/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        let chainBroken = false;

        for (let i = 1; i < product.history.length; i++) {
            if (product.history[i].previousHash !== product.history[i - 1].hash) {
                chainBroken = true;
                break;
            }
        }

        res.json({
            name: product.name,
            isValid: !chainBroken,
            historyCount: product.history.length,
            message: chainBroken ? "CRITICAL: Chain is broken. Tampering detected!" : "Chain is secure."
        });
    } catch (err) {
        res.status(500).json({ error: "Verification failed" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Blockchain Supply Chain API running on port ${PORT}`));