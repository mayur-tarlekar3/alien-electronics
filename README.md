# 🛸 Alien ELECTRONICS

A premium, modern E-Commerce platform for high-end consumer electronics. Built with a sophisticated **"Titanium Obsidian"** design system featuring glassmorphism, cyan accents, and a high-performance dark-mode aesthetic.

## ✨ Highlights
- **Premium UI/UX**: Custom-built "Titanium Obsidian" theme with glassmorphism and smooth micro-animations.
- **Admin Storefront Management**: Administrators can manage products (Update/Remove) directly from the storefront without leaving the main view.
- **Real-time Search**: Advanced product search with instant results.
- **Automated Notifications**: Transaction and registration emails sent automatically via JavaMail.
- **Chronological History**: All orders and transactions are sorted by time (newest first) for both users and admins.

## 🛠️ Technology Stack
### Frontend
- **React 18**: Core application framework.
- **Tailwind CSS**: Modern styling with custom glassmorphism utilities.
- **Vite**: Ultra-fast build tool and development server.
- **React Router 6**: For seamless, zero-refresh navigation.

### Backend
- **Java (JDK 21)**: Robust server-side logic.
- **Jakarta Servlets**: For RESTful API endpoints.
- **Maven**: Dependency management and build automation.
- **MySQL / TiDB Cloud**: Scalable relational database.

## 🚀 Deployment (Free Tier)
This project is configured for a **zero-cost** deployment without requiring a credit card:
1. **Database**: Hosted on **TiDB Cloud** (Free MySQL).
2. **Web Service**: Hosted on **Render** (Free Docker tier).
3. **Containerization**: Full `Dockerfile` included for multi-stage automated builds.

## 🛠️ Local Setup

### 1. Database Setup
1. Create a MySQL database named `shopping-cart`.
2. Execute the schema from `databases/mysql_query.sql`.

### 2. Configuration
Update `src/application.properties` with your database and mailer credentials.
```properties
db.connectionString = jdbc:mysql://localhost:3306/shopping-cart
db.username = root
db.password = your_password
```

### 3. Run Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Run Backend
Deploy the project to a **Tomcat 9.0+** server.

---
#### 🎮 Admin Credentials
- **Email**: `admin@gmail.com`
- **Password**: `admin`

#### 👤 Guest Credentials
- **Email**: `guest@gmail.com`
- **Password**: `guest`

---
*Created with passion for the Future of Tech.*
