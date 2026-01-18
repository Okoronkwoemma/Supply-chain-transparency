// ============ REPLACE THIS WITH YOUR CONTRACT ADDRESS ============
const contractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138"; 

// ============ CLEANED CONTRACT ABI ============
const contractABI = [
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "productId", "type": "uint256" },
      { "indexed": false, "internalType": "string", "name": "name", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "manufacturer", "type": "string" },
      { "indexed": true, "internalType": "address", "name": "registeredBy", "type": "address" }
    ],
    "name": "ProductRegistered",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_name", "type": "string" },
      { "internalType": "string", "name": "_manufacturer", "type": "string" },
      { "internalType": "string", "name": "_productType", "type": "string" },
      { "internalType": "string", "name": "_description", "type": "string" }
    ],
    "name": "registerProduct",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "productId", "type": "uint256" },
      { "indexed": false, "internalType": "string", "name": "newStatus", "type": "string" },
      { "indexed": true, "internalType": "address", "name": "updatedBy", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "StatusUpdated",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_productId", "type": "uint256" },
      { "internalType": "string", "name": "_newStatus", "type": "string" },
      { "internalType": "string", "name": "_location", "type": "string" },
      { "internalType": "string", "name": "_role", "type": "string" }
    ],
    "name": "updateProductStatus",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }],
    "name": "getProduct",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "id", "type": "uint256" },
          { "internalType": "string", "name": "name", "type": "string" },
          { "internalType": "string", "name": "manufacturer", "type": "string" },
          { "internalType": "string", "name": "productType", "type": "string" },
          { "internalType": "string", "name": "description", "type": "string" },
          { "internalType": "string", "name": "status", "type": "string" },
          { "internalType": "uint256", "name": "createdAt", "type": "uint256" },
          { "internalType": "uint256", "name": "updatedAt", "type": "uint256" },
          { "internalType": "address", "name": "owner", "type": "address" },
          { "internalType": "string[]", "name": "statusHistory", "type": "string[]" },
          { "internalType": "address[]", "name": "statusUpdateBy", "type": "address[]" },
          { "internalType": "uint256[]", "name": "statusUpdateTimestamp", "type": "uint256[]" }
        ],
        "internalType": "struct SupplyChainProduct.Product",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }],
    "name": "getUpdateHistory",
    "outputs": [
      { "internalType": "string[]", "name": "", "type": "string[]" },
      { "internalType": "address[]", "name": "", "type": "address[]" },
      { "internalType": "uint256[]", "name": "", "type": "uint256[]" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "productCounter",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "name": "products",
    "outputs": [
      { "internalType": "uint256", "name": "id", "type": "uint256" },
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "string", "name": "manufacturer", "type": "string" },
      { "internalType": "string", "name": "productType", "type": "string" },
      { "internalType": "string", "name": "description", "type": "string" },
      { "internalType": "string", "name": "status", "type": "string" },
      { "internalType": "uint256", "name": "createdAt", "type": "uint256" },
      { "internalType": "uint256", "name": "updatedAt", "type": "uint256" },
      { "internalType": "address", "name": "owner", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// ============ VALIDATION ============
// These checks run when the script loads
if (!contractAddress || contractAddress === "0x...") {
  console.warn(
    "⚠️ Contract address not set! Update contract_abi.js with your deployed contract address.",
  );
}

if (!contractABI || contractABI.length === 0) {
  console.warn(
    "⚠️ Contract ABI not set! Update contract_abi.js with your contract's ABI.",
  );
}

// Export for use in app.js
if (typeof module !== "undefined" && module.exports) {
  module.exports = { contractAddress, contractABI };
}
