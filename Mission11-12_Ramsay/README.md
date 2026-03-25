# Mission 11-12 Bookstore

This project contains:
- Bookstore.Api: ASP.NET Core Web API (SQLite + Session)
- bookstore-ui: React + Vite + TypeScript frontend

## Prerequisites

Install these tools first:
- .NET SDK 10.x
- Node.js 20+
- npm

## One-time setup

1. Download the Bookstore SQLite database from the course instructions.
2. Put the file at this location:
   Mission11-12_Ramsay/Bookstore.Api/Data/Bookstore.sqlite
3. Verify the database has a Books table (the app expects that exact table name).

## Start the backend API

Open a terminal and run:

cd Mission11-12_Ramsay/Bookstore.Api
dotnet restore
dotnet run

Default API URL:
- http://localhost:5015

OpenAPI endpoint in development:
- http://localhost:5015/openapi/v1.json

## Start the frontend

Open a second terminal and run:

cd Mission11-12_Ramsay/bookstore-ui
npm install
npm run dev

Default frontend URL:
- http://localhost:5173

The frontend is configured to proxy /api requests to http://localhost:5015.

## Typical development workflow

1. Start backend terminal with dotnet run.
2. Start frontend terminal with npm run dev.
3. Open http://localhost:5173 in your browser.
4. Use the list page to test paging, sorting, category filter, and cart actions.

## Build checks

Backend build:

cd Mission11-12_Ramsay/Bookstore.Api
dotnet build

Frontend build:

cd Mission11-12_Ramsay/bookstore-ui
npm run build

## Common issue

If the books API returns errors like no such table: Books, the wrong SQLite file is in place.
Replace Bookstore.Api/Data/Bookstore.sqlite with the prepopulated course database file.
