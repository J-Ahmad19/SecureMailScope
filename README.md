# SecureMailScope Prototype

SecureMailScope is a prototype tool for analyzing PCAP files to identify email protocols (SMTP, IMAP, POP3), detect STARTTLS / STLS, extract TLS version and cipher details, analyze X.509 certificates, and present deterministic security findings with risk scoring.

## Architecture

- **Frontend**: React, Vite, Tailwind CSS, GSAP, Recharts, Lucide React
- **Backend**: Python, FastAPI, SQLite
- **Analysis**: Scapy and Cryptography libraries for local packet and certificate analysis. Also includes deterministic demo fixtures when PCAP binary tools are unavailable.

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the FastAPI development server:
   ```bash
   uvicorn main:app --reload
   ```
   The backend will be available at `http://127.0.0.1:8000`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173` (or port specified by Vite).

## Design System

Please refer to `DESIGN.md` for the explicit design tokens and UI constraints.
