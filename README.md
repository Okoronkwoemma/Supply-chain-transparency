# 📦 Blockchain-Inspired Supply Chain API

A Node.js/Express REST API that simulates a blockchain ledger for supply chain management. This system uses **SHA-256 Hashing** to ensure data integrity and **Mongoose** for persistent storage on MongoDB Atlas.

## 🚀 Features
- **Role-Based Access:** Specific actions restricted to Manufacturers or Distributors.
- **Linear Flow Control:** Ensures products follow the `Manufactured -> In Distribution -> For Sale -> Sold` path.
- **Cryptographic Ledger:** Every status update is hashed and linked to the previous update.
- **Audit Tool:** A verification endpoint to detect if any historical data has been tampered with.

## 🛠 Tech Stack
- **Backend:** Node.js, Express
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Security:** Node.js `crypto` module (SHA-256)
- **Testing:** Postman

## 🚦 Getting Started

1. **Install Dependencies:**
   ```bash
   npm install