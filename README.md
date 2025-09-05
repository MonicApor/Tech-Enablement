# aefs-apor

**APOR, MONICA CLAIRE** - A web platform allowing legitimate employees (validated via Sprout System integration) to post anonymous issues, concerns, and suggestions for HR/Management. The dashboard mimics social feed functionality (like Facebook), with upvoting, commenting, and progressive escalation of popular posts.

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Git

### Running the Project

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd aefs-apor
   ```

2. **Start all services**

   ```bash
   docker-compose up -d
   ```

3. **Run database migrations**

   ```bash
   docker exec anon_php php artisan migrate
   ```

4. **Seed the database (optional)**
   ```bash
   docker exec anon_php php artisan db:seed
   ```

## 🌐 Access URLs

- **Frontend (React)**: http://localhost:3000
- **Backend API (Laravel)**: http://localhost:8000
- **MailHog (Email Testing)**: http://localhost:8025
- **API Documentation (Swagger)**: http://localhost:8000/api/documentation

## 📧 Email Testing

The project uses MailHog for email testing. All emails (user invitations, flag post reminders, escalation notifications) will be captured in MailHog instead of being sent to real email addresses.

## 🔧 Development Commands

- **View logs**: `docker-compose logs -f`
- **Stop services**: `docker-compose down`
- **Restart services**: `docker-compose restart`
- **Run Laravel commands**: `docker exec anon_php php artisan [command]`

## 📋 Key Features

- **Anonymous Posting**: Employees can post issues anonymously
- **Social Feed**: Facebook-like interface with upvoting and commenting
- **Post Flagging**: Automatic flagging based on upvotes and view counts
- **HR Escalation**: Posts are escalated to HR after 3 days if not reviewed
- **Management Escalation**: Posts are escalated to management after 6 days if HR doesn't respond
- **Email Notifications**: Automated email reminders and escalation notifications
