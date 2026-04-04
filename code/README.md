# Mission 13 Bookstore

This project contains:
- `Bookstore.Api`: ASP.NET Core Web API using SQLite and session-based cart storage
- `bookstore-ui`: React + Vite + TypeScript frontend

Mission 13 adds:
- Book browsing with paging, sorting, and category filtering
- Shopping cart support with session persistence
- Admin book management for adding, editing, and deleting books
- SPA routing support for deployments through `bookstore-ui/public/routes.json`

## Prerequisites

Install these tools first:
- .NET SDK 10.x
- Node.js 20+
- npm
- Python 3.10+ if you want to use the combined launcher script

## One-time setup

1. Download the course SQLite database file.
2. Place it here:
   `code/Bookstore.Api/Data/Bookstore.sqlite`
3. Install frontend packages:
   `cd code/bookstore-ui`
   `npm install`

## Run both frontend and backend with one command

From the repository root, run:

```powershell
python code/run_bookstore.py
```

That script starts:
- Backend API at `http://localhost:5015`
- Frontend app at `http://localhost:5173`

Use `Ctrl+C` in the terminal to stop both processes.

## Run manually in two terminals

Backend:

```powershell
cd code/Bookstore.Api
dotnet restore
dotnet run
```

Frontend:

```powershell
cd code/bookstore-ui
npm install
npm run dev
```

## Main routes

- Storefront: `http://localhost:5173/`
- Cart: `http://localhost:5173/cart`
- Admin books page: `http://localhost:5173/adminbooks`

## Build checks

Backend:

```powershell
cd code/Bookstore.Api
dotnet build
```

Frontend:

```powershell
cd code/bookstore-ui
npm run build
npm run lint
```

## Bootstrap Notes

Two Bootstrap features used beyond the basics:
- `sticky-lg-top` keeps the cart summary visible on larger screens
- `table-responsive` keeps the tables usable on smaller screens

## Common issue

If the API returns a SQLite error such as `no such table: Books`, the wrong database file is in place. Replace `code/Bookstore.Api/Data/Bookstore.sqlite` with the prepopulated course database file from the assignment materials.
