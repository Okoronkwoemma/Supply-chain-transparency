// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplyChain {

    // Roles and Entities
    enum Role { None, Manufacturer, Distributor, Retailer }
    enum State { Manufactured, Shipped, ReceivedByDistributor, ReceivedByRetailer }

    struct Product {
        uint256 id;
        string name;
        string productCode; // Unique ID (QR code/Serial)
        address currentOwner;
        Role currentRole;
        State currentState;
        uint256 timestamp;
    }

    mapping(string => Product) public products;
    mapping(address => Role) public permissions;
    address public owner;

    event ProductCreated(string productCode, address manufacturer);
    event ProductTransferred(string productCode, address from, address to, State newState);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can perform this");
        _;
    }

    modifier onlyRole(Role _role) {
        require(permissions[msg.sender] == _role, "Unauthorized: Incorrect role");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Assign roles to addresses (done by the contract deployer)
    function assignRole(address _account, Role _role) public onlyOwner {
        permissions[_account] = _role;
    }

    // 1. Manufacturer creates the product
    function manufactureProduct(string memory _name, string memory _productCode) 
        public 
        onlyRole(Role.Manufacturer) 
    {
        require(products[_productCode].id == 0, "Product code already exists");

        products[_productCode] = Product({
            id: block.timestamp, // Using timestamp as a simple ID
            name: _name,
            productCode: _productCode,
            currentOwner: msg.sender,
            currentRole: Role.Manufacturer,
            currentState: State.Manufactured,
            timestamp: block.timestamp
        });

        emit ProductCreated(_productCode, msg.sender);
    }

    // 2. Transfer to Distributor or Retailer
    // In this logic, the receiver "verifies" by calling the receive function
    function receiveProduct(string memory _productCode, State _newState) public {
        Product storage product = products[_productCode];
        require(product.id != 0, "Product does not exist");
        
        // Logical flow: Manufacturer -> Distributor -> Retailer
        if (_newState == State.ReceivedByDistributor) {
            require(permissions[msg.sender] == Role.Distributor, "Must be a Distributor");
        } else if (_newState == State.ReceivedByRetailer) {
            require(permissions[msg.sender] == Role.Retailer, "Must be a Retailer");
        }

        product.currentOwner = msg.sender;
        product.currentState = _newState;
        product.timestamp = block.timestamp;

        emit ProductTransferred(_productCode, product.currentOwner, msg.sender, _newState);
    }

    // 3. Fetch Product Details for verification
    function getProduct(string memory _productCode) public view returns (
        string memory name,
        address currentOwner,
        State currentState,
        uint256 timestamp
    ) {
        Product memory p = products[_productCode];
        return (p.name, p.currentOwner, p.currentState, p.timestamp);
    }
}