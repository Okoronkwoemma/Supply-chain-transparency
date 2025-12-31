export const mockProducts = [
  {
    id: "PRD-001",
    name: "Smartphone X",
    manufacturer: "TechCorp Inc.",
    status: "Delivered",
    location: "New York, USA",
    price: "899.99",
    lastUpdated: "2024-01-25",
    transactionHash: "0x1234abcd...",
    history: [
      {
        status: "Manufactured",
        timestamp: "2024-01-10",
        location: "Shenzhen, China",
      },
      { status: "Shipped", timestamp: "2024-01-15", location: "Shanghai Port" },
      {
        status: "In Transit",
        timestamp: "2024-01-20",
        location: "Pacific Ocean",
      },
      {
        status: "Delivered",
        timestamp: "2024-01-25",
        location: "New York, USA",
      },
    ],
  },
  {
    id: "PRD-002",
    name: "Coffee Beans",
    manufacturer: "Green Farms",
    status: "Shipped",
    location: "Pacific Ocean",
    price: "24.99",
    lastUpdated: "2024-01-20",
    transactionHash: "0x5678efgh...",
    history: [
      { status: "Harvested", timestamp: "2024-01-05", location: "Colombia" },
      {
        status: "Processed",
        timestamp: "2024-01-10",
        location: "Processing Plant",
      },
      { status: "Shipped", timestamp: "2024-01-15", location: "Pacific Ocean" },
    ],
  },
  {
    id: "PRD-003",
    name: "Winter Jacket",
    manufacturer: "Outdoor Gear",
    status: "Manufactured",
    location: "Vietnam",
    price: "129.99",
    lastUpdated: "2024-01-18",
    transactionHash: "0x9012ijkl...",
    history: [
      {
        status: "Manufactured",
        timestamp: "2024-01-18",
        location: "Vietnam Factory",
      },
    ],
  },
];
