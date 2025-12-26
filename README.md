# Supply Chain Transparency System (MVP)

A simple blockchain-based supply chain transparency system that allows products to be registered, tracked, and verified on the blockchain.  
This project focuses on **clarity, transparency, and minimalism** (MVP approach).

---

## 🚀 Project Overview

The system demonstrates how blockchain can be used to improve transparency in a supply chain by recording product lifecycle events immutably.

Each product goes through the following stages:

- Manufactured  
- In Distribution  
- For Sale  
- Sold  

All updates are stored on the blockchain and can be publicly verified.

---

## 🎯 Project Goals

- Demonstrate blockchain transparency
- Remove reliance on traditional authentication
- Use wallet addresses as user identity
- Build a simple and functional MVP suitable for academic projects

---

## 🛠️ Tech Stack

### Frontend
- React
- Tailwind CSS
- Ethers.js
- React Router

### Blockchain
- Solidity Smart Contracts
- Ethereum / Polygon Testnet
- MetaMask Wallet

---

## 🔑 Key Design Decisions

- **No Authentication System**  
  Wallet addresses act as user identities.

- **Role Enforcement on Blockchain**  
  Only the smart contract determines who can perform actions.

- **Minimal UI (MVP)**  
  Focus on functionality over design complexity.

---

## 📁 Project Structure
frontend/
│
├── src/
│ ├── components/
│ │ ├── WalletConnect.jsx
│ │ ├── ProductForm.jsx
│ │ ├── ProductList.jsx
│ │ └── ProductTimeline.jsx
│ │
│ ├── pages/
│ │ ├── Home.jsx
│ │ ├── RegisterProduct.jsx
│ │ └── Products.jsx
│ │
│ ├── services/
│ │ └── blockchain.js
│ │
│ ├── App.jsx
│ ├── main.jsx
│ └── index.css
│
├── public/
├── package.json
└── README.md


---

## 🔄 How the System Works

1. User connects their wallet using MetaMask  
2. Wallet address becomes the user's identity  
3. User performs actions (register product, update status)  
4. Smart contract verifies permissions and updates state  
5. Product history can be viewed by anyone  

---

## 🖥️ Application Pages

### Home Page
- Connect wallet
- Navigate to register or view products

### Register Product
- Register a new product on the blockchain
- Only allowed for manufacturer wallets

### Products / History Page
- Search product by ID
- View full product lifecycle
- Update product status (if permitted)

---

## 🔐 Security & Trust Model

- No passwords or login system
- Blockchain enforces:
  - Roles
  - State transitions
  - Data integrity

Even if the frontend is bypassed, invalid actions are rejected by the smart contract.

---

## 📦 Installation & Setup

### Prerequisites
- Node.js
- MetaMask Browser Extension
- Deployed Smart Contract (Testnet)

### Steps

```bash
npm install
npm run dev
