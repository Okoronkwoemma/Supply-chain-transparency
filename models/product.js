const mongoose = require('mongoose');

// Schema for each "Block" in the history chain
const HistorySchema = new mongoose.Schema({
    status: { type: String, required: true },
    actor: { type: String, required: true },
    timestamp: { type: String, required: true },
    previousHash: { type: String, required: true },
    hash: { type: String, required: true }
});

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['Manufactured', 'In Distribution', 'For Sale', 'Sold'], 
        default: 'Manufactured' 
    },
    manufacturer: { type: String, required: true },
    // The history array acts as our blockchain ledger
    history: [HistorySchema]
});

module.exports = mongoose.model('Product', ProductSchema);