# Animal Rescue Association Website
## جمعية إنقاذ الحيوانات

A bilingual (Arabic/English) website for an animal rescue organization with admin panel for managing content, images, and videos.

## Features

- 🌍 Bilingual support (Arabic & English)
- 🔐 Admin authentication system
- 📸 Image and video management
- 🎨 Custom theme matching organization branding
- 📱 Responsive design
- 🗄️ PostgreSQL database

## Tech Stack

- **Frontend**: React + Vite, TailwindCSS
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Authentication**: JWT

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)

### Installation

1. **Setup PostgreSQL database:**

   **Option A: Using PowerShell Script (Recommended)**
   ```powershell
   .\setup-database.ps1
   ```

   **Option B: Manual Setup**
   ```powershell
   # Find your PostgreSQL installation path, then run:
   & "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -f setup-database.sql
   
   # Or if PostgreSQL is in your PATH:
   psql -U postgres -f setup-database.sql
   ```

   **Option C: Using pgAdmin**
   - Open pgAdmin
   - Right-click "Databases" → Create → Database
   - Name it: `animal_rescue`
   - Open the query tool and run the contents of [backend/database/schema.sql](backend/database/schema.sql)

   **Option D: Run the Node migration script**
   ```powershell
   cd backend
   npm run migrate
   ```
   This Node command loads the same [backend/database/schema.sql](backend/database/schema.sql) file and applies the statements via the backend connection pool by running [backend/scripts/migrate.js](backend/scripts/migrate.js).

2. **Configure environment variables:**
   ```powershell
   # Copy the example env file
   copy backend\.env.example backend\.env

   # Edit backend/.env with your database credentials
   # Use notepad or your preferred editor:
   notepad backend\.env
   ```

3. **Install all dependencies:**
   ```powershell
   npm run install-all
   ```

4. **Start the development servers:**
   ```powershell
   npm run dev
   ```

The frontend will run on http://localhost:5173
The backend will run on http://localhost:5000

## Default Admin Credentials

**Username**: admin
**Password**: admin123

⚠️ **Important**: Change these credentials after first login!

## Project Structure

```
animal-rescue-website/
├── frontend/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   └── utils/
│   └── public/
├── backend/           # Node.js backend
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── config/
│   ├── database/
│   └── uploads/
└── README.md
```

## License

MIT
