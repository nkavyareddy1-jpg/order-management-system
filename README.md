<<<<<<< HEAD
# Order Management System (Full Stack)

A beginner-friendly full-stack Order Management System built with HTML, CSS, JavaScript, Node.js, Express and MongoDB.

## Features

- Create, read, update and delete orders (CRUD)
- Search by customer or product
- Filter by order status
- Dashboard totals and revenue
- Order status doughnut chart
- Dark mode
- Responsive layout
- Server-side validation and error handling

## Requirements

Install:
1. Node.js (LTS recommended)
2. MongoDB Community Server running locally, OR create a MongoDB Atlas database.
3. Visual Studio Code (recommended)

## Setup on Windows

### 1. Extract the ZIP
Extract `order-management-system.zip`. Open the extracted `order-management-system` folder in VS Code.

### 2. Open the terminal
In VS Code, select **Terminal > New Terminal**. Make sure the terminal is inside the project folder (the folder containing `package.json`).

### 3. Install project packages
Run:

```powershell
npm install
```

If PowerShell blocks `npm.ps1`, use Command Prompt in VS Code (terminal dropdown > Command Prompt), then run `npm install`. Alternatively, run `npm.cmd install` in PowerShell.

### 4. Configure MongoDB
For a local MongoDB installation, make sure the MongoDB server service is running. Copy `.env.example` and rename the copy to `.env`. The `.env` file should contain:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/order_management_system
```

If you use MongoDB Atlas, replace the value of `MONGODB_URI` with your Atlas connection string. Do not share your database password or commit `.env`.

### 5. Start the project
For normal use:

```powershell
npm start
```

For development auto-restart:

```powershell
npm run dev
```

When the terminal says the server is running, open this address in Chrome:

http://localhost:3000

Keep the terminal open while using the application.

## API endpoints

Base URL: `http://localhost:3000/api/orders`

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/orders` | Get all orders |
| GET | `/api/orders/:id` | Get one order |
| POST | `/api/orders` | Add an order |
| PUT | `/api/orders/:id` | Update an order |
| DELETE | `/api/orders/:id` | Delete an order |
| GET | `/api/health` | Check API status |

### Example POST body

```json
{
  "customerName": "Anita",
  "product": "Notebook",
  "quantity": 2,
  "price": 50,
  "status": "Pending"
}
```

## Project structure

```text
order-management-system/
├── models/
│   └── Order.js
├── routes/
│   └── orders.js
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── .env.example
├── .gitignore
├── package.json
├── server.js
└── README.md
```

## Troubleshooting

- **MongoDB connection error:** Confirm MongoDB is installed and its service is running, or verify the Atlas connection string.
- **Port 3000 is already in use:** Change `PORT=3001` in `.env`, restart the server, and open `http://localhost:3001`.
- **Cannot find module:** Run `npm install` in the folder containing `package.json`.
- **Page cannot connect:** Start the backend with `npm start` and visit the local URL above. Do not open `public/index.html` directly as a file.

## Notes

This is a learning/demo project. Before production use, add authentication, authorization, automated tests, backups, and deployment security.
=======
# order-management-system
>>>>>>> 4c4bc9a3b706aa4a3c6f15eaa6fc5fd762eb4075
