# SpotCheck - AI Review Summarizer

**SpotCheck** is a modern web application that aggregates Google Maps reviews and uses AI to summarize them into a clear, actionable verdict. Instead of reading hundreds of reviews, get an instant analysis of the pros, cons, and overall sentiment.

## Features

- **Instant Search**: Search for any location via Google Places API.
- **AI Summaries**: Uses Groq AI (Llama 3.3 70b) to analyze reviews.
- **Sentiment Analysis**: Clear Positive, Mixed, or Negative badge.
- **Key Insights**: distinct Pros (Green) and Cons (Red) lists.
- **Common Themes**: Identifies recurring topics (e.g., "Great Service", "Long Wait").
- **Modern UI**: built with React + Tailwind CSS, featuring smooth animations and responsive design.

## Tech Stack

### Frontend
- **React 18**: UI Library (Vite)
- **Tailwind CSS**: Styling
- **Axios**: HTTP Client
- **Lucide React**: Icons

### Backend
- **Node.js & Express**: Server
- **Google Places API**: Location Data
- **Groq API**: AI Summarization
- **Dotenv**: Environment Configuration

## Prerequisites

- Node.js (v16.0.0 or higher)
- npm (v7.0.0 or higher)
- Google Places API Key
- Groq API Key

## Setup & Installation

### 1. Clone & Structure
The project is structured into two main folders: `frontend` and `backend`.

### 2. Backend Setup
1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure Environment Variables:
    -   Create a `.env` file (copy from `.env.example`).
    -   Add your API keys (see below).

    ```bash
    cp .env.example .env
    ```

    **File: .env**
    ```env
    GOOGLE_PLACES_API_KEY=your_google_places_key
    GROQ_API_KEY=your_groq_key
    PORT=3001
    ```
4.  Start the Server:
    ```bash
    npm run dev
    # Server runs on http://localhost:3001
    ```

### 3. Frontend Setup
1.  Open a new terminal and navigate to the frontend folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Dev Server:
    ```bash
    npm run dev
    # App runs on http://localhost:5173
    ```

---

## Getting API Keys

### Google Places API
1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a new project.
3.  Enable **"Places API (New)"** or **"Places API"**.
4.  Go to **Credentials** -> **Create Credentials** -> **API Key**.
5.  Copy the key into your `.env` file.
    *Note: You must enable billing for the Places API to work, though it has a free tier.*

### Groq API
1.  Go to the [Groq Console](https://console.groq.com/keys).
2.  Log in (or sign up).
3.  Click **"Create API Key"**.
4.  Name it "SpotCheck" and copy the key into your `.env` file.

---

## Troubleshooting

-   **Backend Error: "Location not found"**:
    -   Ensure your Google Places API key is valid and has billing enabled.
    -   Try a more specific search term (e.g., "Joe's Pizza New York" instead of "Joe's").

-   **Frontend Error: "Network Error"**:
    -   Ensure the backend server is running on port 3001.
    -   Check the console for CORS errors.

-   **AI Summary Fails**:
    -   Ensure your Groq API key is valid.
    -   Check backend logs for specific error messages from Groq.

---

## 🚀 Detailed Deployment Guide (Free Hosting)

To keep SpotCheck running 24/7 for free, follow these steps:

### 1. Backend (Host on [Render.com](https://render.com))
1.  **Create account** and click **New** -> **Web Service**.
2.  Connect your GitHub repository.
3.  **Configure**:
    -   **Name**: `spotcheck-backend`
    -   **Root Directory**: `backend`
    -   **Build Command**: `npm install`
    -   **Start Command**: `node server.js`
4.  **Environment Variables** (Add these in the Render dashboard):
    -   `GOOGLE_PLACES_API_KEY`: Your key
    -   `GROQ_API_KEY`: Your key
    -   `NODE_ENV`: `production`
5.  **Copy your URL**: Render will give you a URL like `https://spotcheck-backend.onrender.com`.

### 2. Frontend (Host on [Vercel](https://vercel.com) or [Netlify](https://netlify.com))
1.  **Create account** and import your GitHub repository.
2.  **Configure**:
    -   **Framework Preset**: Vite
    -   **Root Directory**: `frontend`
    -   **Build Command**: `npm run build`
    -   **Output Directory**: `dist`
3.  **Environment Variables** (CRITICAL):
    -   Add `VITE_API_URL` and set it to your Render URL + `/api`.
    -   Example: `https://spotcheck-backend.onrender.com/api`
4.  **Deploy**: Click deploy and your site is live!

---

**Note**: On Render's free tier, the backend "sleeps" after inactivity. The first search might take 30-50 seconds to wake it up.

---

**Built with ❤️ using React & Node.js**
