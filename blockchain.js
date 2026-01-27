const Web3 = window.Web3;

if (!Web3) {
    console.error("Web3 library not found! Please check your script tags.");
}

const GANACHE_URL = "http://127.0.0.1:7545";

// 1. Exporting web3 so other pages can access utilities
export const web3 = new Web3(GANACHE_URL);

const CONTRACT_ADDRESS = "0xDd6C8416fb19B73dFF1b1e918A91D329b7CA69Fc";
const CONTRACT_ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": false, "internalType": "string", "name": "productCode", "type": "string" },
            { "indexed": false, "internalType": "address", "name": "manufacturer", "type": "address" }
        ],
        "name": "ProductCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": false, "internalType": "string", "name": "productCode", "type": "string" },
            { "indexed": false, "internalType": "address", "name": "from", "type": "address" },
            { "indexed": false, "internalType": "address", "name": "to", "type": "address" },
            { "indexed": false, "internalType": "enum SupplyChain.State", "name": "newState", "type": "uint8" }
        ],
        "name": "ProductTransferred",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "name": "permissions",
        "outputs": [{ "internalType": "enum SupplyChain.Role", "name": "", "type": "uint8" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "name": "products",
        "outputs": [
            { "internalType": "uint256", "name": "id", "type": "uint256" },
            { "internalType": "string", "name": "name", "type": "string" },
            { "internalType": "string", "name": "productCode", "type": "string" },
            { "internalType": "address", "name": "currentOwner", "type": "address" },
            { "internalType": "enum SupplyChain.Role", "name": "currentRole", "type": "uint8" },
            { "internalType": "enum SupplyChain.State", "name": "currentState", "type": "uint8" },
            { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "_account", "type": "address" },
            { "internalType": "enum SupplyChain.Role", "name": "_role", "type": "uint8" }
        ],
        "name": "assignRole",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "string", "name": "_name", "type": "string" },
            { "internalType": "string", "name": "_productCode", "type": "string" }
        ],
        "name": "manufactureProduct",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "string", "name": "_productCode", "type": "string" },
            { "internalType": "enum SupplyChain.State", "name": "_newState", "type": "uint8" }
        ],
        "name": "receiveProduct",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "string", "name": "_productCode", "type": "string" }],
        "name": "getProduct",
        "outputs": [
            { "internalType": "string", "name": "name", "type": "string" },
            { "internalType": "address", "name": "currentOwner", "type": "address" },
            { "internalType": "enum SupplyChain.State", "name": "currentState", "type": "uint8" },
            { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

// 2. Exporting contract instance
export const supplyChain = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

// 3. Manufacturer Function - Ensures we wait for the Receipt
export async function createProduct(name, code, senderWallet) {
    if (!senderWallet) throw new Error("No wallet address provided.");

    console.log("Registering product on chain:", code);

    return await supplyChain.methods.manufactureProduct(name, code)
        .send({
            from: senderWallet,
            gas: 3000000
        });
}

// 4. Logistics Function
export async function updateProductStatus(code, newState, senderWallet) {
    if (!senderWallet) throw new Error("No wallet address provided.");

    return await supplyChain.methods.receiveProduct(code, newState)
        .send({
            from: senderWallet,
            gas: 3000000
        });
}

// 5. Public View Function - Re-optimized for the new ABI
export async function fetchProductDetails(code) {
    try {
        const cleanCode = String(code).trim();
        console.log("Fetching details for:", cleanCode);

        // This calls the Solidity 'getProduct' function
        const details = await supplyChain.methods.getProduct(cleanCode).call();

        // If the owner is the Zero address, the mapping entry is empty (Product doesn't exist)
        if (!details.currentOwner || details.currentOwner === "0x0000000000000000000000000000000000000000") {
            console.warn("Product code not found in Blockchain mapping:", cleanCode);
            return null;
        }

        return {
            name: details.name,
            owner: details.currentOwner,
            state: Number(details.currentState),
            timestamp: new Date(Number(details.timestamp) * 1000).toLocaleString()
        };
    } catch (error) {
        console.error("Critical Blockchain Decoding Error. Check if your ABI matches the Contract!", error);
        return null;
    }
}

// 6. Global Logout Helper
export async function logoutUser(auth) {
    try {
        await auth.signOut();
        window.location.href = "login.html";
    } catch (error) {
        console.error("Logout failed", error);
    }
}