# Restaurant Order and Reservation System

Spring Boot backend for a restaurant system that supports user authentication, menu browsing, order creation, and table reservations.

## Project Overview

This backend provides REST APIs for:

- User registration and login with JWT authentication
- Menu item management and public menu browsing
- Cart-based order creation with order summaries
- Table reservation creation
- Table availability checking
- Double-booking prevention for reservations
- Sample menu data seeding for testing

The project follows a layered architecture:

- `controller`
- `service`
- `repository`
- `entity`
- `dto`
- `security`
- `exception`
- `config`

## Technologies Used

- Java 17
- Spring Boot 3.2.2
- Spring Web
- Spring Security
- Spring Data JPA
- PostgreSQL
- Hibernate
- JWT using `jjwt`
- BCrypt password hashing
- Lombok
- Maven
- H2 for tests

## Setup Instructions

### Prerequisites

- Java 17 or newer
- Maven
- PostgreSQL
- pgAdmin, optional but useful

### Clone the Repository

```bash
git clone https://github.com/nihalersoy/restaurant-order-reservation-system.git
cd restaurant-order-reservation-system
```

### Create the PostgreSQL Database

Create a database named:

```text
restaurant_db
```

Using pgAdmin:

1. Open pgAdmin.
2. Connect to your PostgreSQL server.
3. Right-click `Databases`.
4. Select `Create > Database`.
5. Set database name to `restaurant_db`.
6. Set owner to `postgres`.
7. Save.

## Database Configuration

The application uses PostgreSQL by default.

Default configuration in `src/main/resources/application.properties`:

```properties
spring.datasource.url=${DB_URL:jdbc:postgresql://localhost:5432/restaurant_db}
spring.datasource.username=${DB_USERNAME:postgres}
spring.datasource.password=${DB_PASSWORD:postgres}
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.open-in-view=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.format_sql=true

security.jwt.secret=${JWT_SECRET:c3VwZXItc2VjcmV0LWtleS1mb3Itand0LWF1dGgtMzItYnl0ZXMh}
security.jwt.expiration-ms=${JWT_EXPIRATION_MS:86400000}
```

If your PostgreSQL password is different, set an environment variable:

```powershell
$env:DB_PASSWORD="your_postgres_password"
```

When the app starts, Hibernate creates or updates the required tables:

- `users`
- `menu_items`
- `orders`
- `order_items`
- `reservations`

## How to Run the Backend

Run with Maven:

```bash
mvn spring-boot:run
```

Or on Windows using the Maven wrapper:

```powershell
.\mvnw.cmd spring-boot:run
```

Backend base URL:

```text
http://localhost:8080
```

Run tests:

```bash
mvn test
```

## Sample Menu Data

The app includes a data initializer that inserts sample menu items only when the `menu_items` table is empty.

Sample categories:

- `APPETIZER`
- `MAIN_COURSE`
- `SIDE`
- `DESSERT`
- `DRINK`

## API Endpoint List

### Authentication

| Method | URL | Auth Required | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | No | Register a new customer |
| `POST` | `/api/auth/login` | No | Login and receive JWT token |

### Menu

| Method | URL | Auth Required | Description |
|---|---|---|---|
| `POST` | `/api/menus` | Yes, `ADMIN` | Create a menu item |
| `GET` | `/api/menus` | No | Get all menu items |
| `GET` | `/api/menus?category=MAIN_COURSE` | No | Filter menu items by category |

### Orders

| Method | URL | Auth Required | Description |
|---|---|---|---|
| `POST` | `/api/orders` | Yes | Create an order from cart items |

### Reservations

| Method | URL | Auth Required | Description |
|---|---|---|---|
| `POST` | `/api/reservations` | Yes | Create a table reservation |
| `GET` | `/api/reservations/availability` | Yes | Check table availability |

Availability query example:

```text
/api/reservations/availability?tableNumber=4&reservationTime=2026-05-06T19:30:00&durationMinutes=90
```

## Example Request Bodies

### Register

```http
POST /api/auth/register
Content-Type: application/json
```

```json
{
  "fullName": "Nihal Ersoy",
  "email": "nihal@example.com",
  "password": "password123"
}
```

Example response:

```json
{
  "token": "jwt-token",
  "tokenType": "Bearer",
  "userId": 1,
  "fullName": "Nihal Ersoy",
  "email": "nihal@example.com",
  "role": "CUSTOMER"
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "nihal@example.com",
  "password": "password123"
}
```

### Create Menu Item

Requires an authenticated user with `ADMIN` role.

```http
POST /api/menus
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

```json
{
  "name": "Margherita Pizza",
  "description": "Classic pizza with tomato sauce, mozzarella, and fresh basil",
  "price": 12.99,
  "category": "MAIN_COURSE",
  "available": true
}
```

### Get Menu Items

```http
GET /api/menus
```

Filter by category:

```http
GET /api/menus?category=MAIN_COURSE
```

### Create Order

```http
POST /api/orders
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

```json
{
  "items": [
    {
      "menuItemId": 1,
      "quantity": 2
    },
    {
      "menuItemId": 3,
      "quantity": 1
    }
  ]
}
```

Example response:

```json
{
  "orderId": 1,
  "userId": 1,
  "customerName": "Nihal Ersoy",
  "status": "PENDING",
  "totalAmount": 32.48,
  "items": [
    {
      "menuItemId": 1,
      "menuItemName": "Tomato Bruschetta",
      "quantity": 2,
      "unitPrice": 6.50,
      "subtotal": 13.00
    }
  ],
  "createdAt": "2026-05-05T15:00:00Z"
}
```

### Create Reservation

```http
POST /api/reservations
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

```json
{
  "tableNumber": 4,
  "partySize": 2,
  "reservationTime": "2026-05-06T19:30:00",
  "durationMinutes": 90,
  "specialRequest": "Window seat if possible"
}
```

Example response:

```json
{
  "reservationId": 1,
  "userId": 1,
  "customerName": "Nihal Ersoy",
  "tableNumber": 4,
  "partySize": 2,
  "reservationStart": "2026-05-06T19:30:00",
  "reservationEnd": "2026-05-06T21:00:00",
  "status": "CONFIRMED",
  "specialRequest": "Window seat if possible"
}
```

### Check Table Availability

```http
GET /api/reservations/availability?tableNumber=4&reservationTime=2026-05-06T19:30:00&durationMinutes=90
Authorization: Bearer <jwt-token>
```

Example response:

```json
{
  "tableNumber": 4,
  "reservationStart": "2026-05-06T19:30:00",
  "reservationEnd": "2026-05-06T21:00:00",
  "available": true
}
```

## Error Response Format

Validation and application errors return a consistent response:

```json
{
  "timestamp": "2026-05-05T15:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "messages": [
    "email: Email is required"
  ],
  "path": "/api/auth/register"
}
```

Common status codes:

- `400 Bad Request`
- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`
- `409 Conflict`
- `500 Internal Server Error`
