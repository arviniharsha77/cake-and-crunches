# Cakes and Crunches - Customer Allergy & Dietary Preference Profile System

A modern, responsive, and robust full-stack web application designed for **Cakes and Crunches Bakery** to prevent food allergy mistakes. The system stores customer food allergies and dietary preferences, performs real-time checks when orders are created, and raises blocking warnings if ingredients conflict with customer allergies.

---

## Technical Stack

*   **Frontend**: React.js (loaded via UMD CDN), React Router (HashRouter), Tailwind CSS (dynamic CDN client compilation), Axios, Chart.js.
*   **Backend**: Python Flask, REST API.
*   **ORM**: SQLAlchemy.
*   **Database**: MySQL (Production ready), with zero-configuration fallback to local SQLite for development.
*   **Authentication**: Role-based access control (RBAC) with sessions/cookie support (Admin and Staff login levels).

---

## Key Features

1.  **Automatic Allergy & Diet Safety Checker**: Real-time checking comparing recipe ingredients (and ingredient allergy tags) against the selected customer's allergy file. Displays a blocking warnings modal requiring staff override acknowledgement.
2.  **Operations Dashboard**: High-impact visualization of active orders, popular customer allergies, recent activity logs, and quick actions.
3.  **Customer Profile Catalog**: Detailed customer registry with email/phone contact methods, emergency contacts, notes, and order histories.
4.  **Allergy & Diet Management**: Red (Severe), Orange (Moderate), Green (Safe) severity badges and multiple dietary selections (Vegan, Halal, Jain, Keto, etc.).
5.  **Ingredient & Recipe Database**: Maintain inventory ingredients, assign allergen tags, and compose product recipes.
6.  **Full Audit Trail**: Log all operations, especially allergy overrides, with timestamp and operator details.
7.  **Data Analytics Exporter**: Generate and download CSV reports for customers, orders, and allergy metrics.

---

## Directory Structure

```
intern work/
│
├── schema.sql              # Raw SQL commands for setting up MySQL database
├── README.md               # Setup and deployment documentation
│
└── backend/
    ├── app.py              # Flask server initializer and catch-all routing
    ├── config.py           # Configuration managing database fallbacks
    ├── database.py         # SQLAlchemy database session instance
    ├── models.py           # SQLAlchemy entity classes and dictionaries
    ├── auth.py             # Auth blueprints, passwords hashing, and role checks
    ├── api.py              # Main REST endpoints (CRUD, Allergy Check, Dashboard)
    ├── seed.py             # Database clean & populate script (rich mock data)
    │
    ├── templates/
    │   └── index.html      # Single Page Application HTML shell with CDNs
    │
    └── static/
        ├── css/
        │   └── styles.css  # Premium theme variables, animations, and typography
        └── js/
            └── app.js      # Consolidated React components, routers, and safety modals
```

---

## Installation & Setup Guide

Ensure **Python 3.10+** is installed on your computer.

### 1. Install Dependencies
Run the command below in the project directory:
```bash
pip install flask flask-sqlalchemy flask-cors pymysql cryptography
```

### 2. Populate and Seed the Database
Initialize and seed the database with mock customers, products, and ingredients:
```bash
python backend/seed.py
```
This creates the local SQLite database (`backend/instance/cakes_and_crunches.db` or `backend/cakes_and_crunches.db` depending on runtime folder) and registers the default accounts:
*   **Staff Login**: Username `staff` / Password `staff123`
*   **Admin Login**: Username `admin` / Password `admin@123`

### 3. Start the Flask Server
Launch the application locally:
```bash
python backend/app.py
```
Open your browser and navigate to `http://127.0.0.1:5000` to start using the system.

---

## Production MySQL Configuration

To deploy the application to a production environment using a **MySQL** server:

1.  Create a MySQL database on your server:
    ```sql
    CREATE DATABASE cakes_and_crunches;
    ```
2.  Set the following environment variables on your server:
    ```bash
    export USE_SQLITE="false"
    export DB_USER="your_mysql_username"
    export DB_PASSWORD="your_mysql_password"
    export DB_HOST="your_mysql_host_ip"
    export DB_PORT="3306"
    export DB_NAME="cakes_and_crunches"
    ```
3.  Upon startup, Flask's SQLAlchemy will automatically establish connections and build all tables in MySQL matching the `schema.sql` outline.
