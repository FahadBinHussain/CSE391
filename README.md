# Car Workshop Appointment System

A comprehensive web-based appointment booking system for a car workshop with admin panel and discount management.

**Live Demo:** https://portfolio391.netlify.app/

## Features

- 📅 **Appointment Booking** - Customers can book appointments with mechanics
- 👨‍💼 **Admin Panel** - Manage appointments, mechanics, and view statistics
- 🎁 **Discount System** - Set discount rules based on phone number summation
- 📊 **Real-time Updates** - Dynamic availability tracking for mechanics
- 🔐 **Database Integration** - MySQL/MariaDB backend for data persistence

## New Discount Feature

### How It Works:
The admin can set discount rules for specific dates. If a customer's phone number matches the discount criteria, they automatically receive a discount!

**Example:**
- Admin sets: Date = 2025-12-25, Summation Value = 30, Discount = 10%
- Customer books with phone: +1-555-86754 (Last 5 digits: 8+6+7+5+4 = 30)
- Customer receives: "Booking confirmed! You have received 10% discount! 🎉"

## Setup Instructions

### Prerequisites
- PHP 7.0 or higher
- MySQL/MariaDB database server
- Web server (XAMPP, WAMP, or similar)

### Database Setup

1. **Start your MySQL server** (usually through XAMPP/WAMP control panel)

2. **Create the database:**
   - Open phpMyAdmin (usually at `http://localhost/phpmyadmin`)
   - OR use MySQL command line
   
3. **Run the SQL setup file:**
   ```sql
   -- Import local_setup.sql file
   -- OR copy and paste the contents into phpMyAdmin SQL tab
   ```

### Running the Application

#### Method 1: Using XAMPP/WAMP (Recommended)

1. **Install XAMPP/WAMP** if you haven't already
2. **Move project folder** to htdocs (XAMPP) or www (WAMP) directory:
   ```
   Example: C:\xampp\htdocs\CSE391\
   ```
3. **Start Apache and MySQL** from XAMPP/WAMP control panel
4. **Access the application:**
   - Homepage: `http://localhost/CSE391/index.html`
   - Booking: `http://localhost/CSE391/appointment.html`
   - Admin: `http://localhost/CSE391/admin.html`

#### Method 2: Using PHP Built-in Server

1. **Open terminal** in the project directory:
   ```powershell
   cd C:\Users\hamas\Downloads\CSE391
   ```

2. **Start PHP server:**
   ```powershell
   php -S localhost:8000
   ```

3. **Access the application:**
   - Homepage: `http://localhost:8000/index.html`
   - Booking: `http://localhost:8000/appointment.html`
   - Admin: `http://localhost:8000/admin.html`

## Admin Panel Features

### Discount Management
1. Navigate to Admin Panel
2. Find the "🎁 Discount Management" section
3. Set discount rules:
   - **Date**: Select the date when discount applies
   - **Summation Value**: Sum of last 5 phone digits (0-45)
   - **Discount %**: Discount percentage (1-100%)
4. Click "Set Discount Rule"
5. View/delete active rules below

### Example Discount Scenarios

**Scenario 1:**
- Rule: Sum = 45, Discount = 5%, Date = 2025-12-30
- Phone: +1-234-99999 → Sum = 9+9+9+9+9 = 45 ✅ Gets 5% discount

**Scenario 2:**
- Rule: Sum = 20, Discount = 15%, Date = 2025-12-25
- Phone: +1-555-64433 → Sum = 6+4+4+3+3 = 20 ✅ Gets 15% discount

**Scenario 3:**
- Rule: Sum = 30, Discount = 10%, Date = 2025-12-28
- Phone: +1-234-12345 → Sum = 1+2+3+4+5 = 15 ❌ No discount

## Database Configuration

The system is now configured for **local database**:

```php
Host: localhost
Username: root
Password: (empty)
Database: car_workshop
```

If you need different credentials, edit the connection in:
- `ultra_simple.php`
- `admin_data.php`
- `simple_update.php`
- `simple_delete.php`
- `manage_discount.php`

## Troubleshooting

### CORS Error
If you see CORS errors, you're opening HTML files directly (file://).
**Solution:** Use a web server (see Running the Application above)

### Database Connection Failed
1. Ensure MySQL is running
2. Verify database exists: `car_workshop`
3. Check credentials in PHP files
4. Run `local_setup.sql` to create tables

### Appointments Not Saving
1. Check browser console for errors
2. Verify PHP server is running
3. Check database connection
4. Ensure tables exist

## File Structure

```
CSE391/
├── index.html              # Homepage
├── appointment.html        # Booking page
├── appointment.js          # Booking logic
├── appointment.css         # Styles
├── admin.html             # Admin panel
├── admin.js               # Admin logic
├── ultra_simple.php       # Booking endpoint (with discount check)
├── admin_data.php         # Fetch appointments
├── simple_update.php      # Update appointments
├── simple_delete.php      # Delete appointments
├── manage_discount.php    # Discount management endpoint
├── local_setup.sql        # Database setup script
└── README.md              # This file
```

## Technology Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** PHP 7+
- **Database:** MySQL/MariaDB
- **Server:** Apache/PHP Built-in

## Credits

CSE 391 Assignment - Car Workshop Appointment System
© 2025

---

**Need help?** Check the browser console (F12) for error messages!
