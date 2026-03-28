# Requirements Document

## Introduction

The Digital Menu QR System is a SaaS platform that enables restaurants, cafes, and hotels to manage and publish digital menus. Restaurant owners create and manage their menus through an admin portal. Customers scan a unique QR code to view the menu in a mobile-friendly browser interface without installing any application. The system supports three roles: Super Admin (platform-wide management), Restaurant Owner (menu and profile management), and Customer (read-only public access).

## Glossary

- **System**: The Digital Menu QR System platform as a whole.
- **Auth_Service**: The component responsible for authentication and JWT token issuance.
- **Admin_Portal**: The web interface used by Super Admins and Restaurant Owners.
- **Menu_Service**: The backend component responsible for managing categories and menu items.
- **QR_Service**: The component responsible for generating and serving QR code images.
- **Public_Menu_Service**: The backend component that serves public menu data to customers.
- **Image_Service**: The component responsible for handling image uploads and storage.
- **Super_Admin**: A platform-level administrator with full user and system management access.
- **Owner**: A Restaurant Owner user who manages one or more restaurant profiles and menus.
- **Customer**: An end user who scans a QR code and views a restaurant's digital menu.
- **Restaurant**: A business entity (restaurant, cafe, or hotel) registered on the platform.
- **Category**: A named grouping of menu items within a restaurant (e.g., "Appetizers", "Drinks").
- **Menu_Item**: A single dish or product listed under a Category, with name, description, price, image, and availability.
- **QR_Code**: A scannable image encoding the public menu URL for a specific Restaurant.
- **unique_qr_id**: A UUID v4 or 12-character random string uniquely identifying a Restaurant for public access.
- **JWT**: JSON Web Token used for authenticating Admin and Owner API requests.
- **Slug**: A URL-safe unique string identifier for a Restaurant.

---

## Requirements

### Requirement 1: User Authentication

**User Story:** As an Admin or Owner, I want to log in with my credentials, so that I can access the platform securely.

#### Acceptance Criteria

1. WHEN a user submits a valid email and password to `/api/auth/login`, THE Auth_Service SHALL return a signed JWT token and the user's role.
2. WHEN a user submits an invalid email or password to `/api/auth/login`, THE Auth_Service SHALL return an HTTP 401 response with a descriptive error message.
3. THE Auth_Service SHALL store passwords as bcrypt hashes with a minimum cost factor of 12.
4. WHEN a JWT token is included in a request to a protected endpoint, THE Auth_Service SHALL validate the token signature and expiry before granting access.
5. IF a request to a protected endpoint contains an expired or invalid JWT token, THEN THE Auth_Service SHALL return an HTTP 401 response.

---

### Requirement 2: Super Admin — Owner Account Management

**User Story:** As a Super Admin, I want to create, view, update, and deactivate Restaurant Owner accounts, so that I can manage who has access to the platform.

#### Acceptance Criteria

1. WHEN a Super_Admin submits a valid email and temporary password to `/api/auth/register`, THE Auth_Service SHALL create a new Owner account with the role `owner`.
2. IF a Super_Admin submits an email that already exists in the system, THEN THE Auth_Service SHALL return an HTTP 409 response with a descriptive error message.
3. WHEN a Super_Admin requests the list of Owner accounts, THE System SHALL return all Owner records including id, email, status, and created_at.
4. WHEN a Super_Admin deactivates an Owner account, THE System SHALL set the account status to inactive and invalidate all active sessions for that Owner.
5. WHILE an Owner account is inactive, THE Auth_Service SHALL reject login attempts from that Owner with an HTTP 403 response.
6. THE System SHALL restrict the `/api/auth/register` endpoint to Super_Admin role only, returning HTTP 403 for any other role.

---

### Requirement 3: Restaurant Profile Management

**User Story:** As an Owner, I want to create and update my restaurant profile including name, logo, address, and theme color, so that customers see accurate branding when viewing my menu.

#### Acceptance Criteria

1. WHEN an Owner submits valid restaurant profile data, THE System SHALL persist the restaurant name, address, logo URL, and primary color associated with that Owner's account.
2. THE System SHALL generate a unique `slug` and a unique `unique_qr_id` (UUID v4) for each Restaurant at creation time.
3. WHEN an Owner updates restaurant profile fields, THE System SHALL persist only the updated fields without overwriting unchanged fields.
4. IF an Owner attempts to access or modify a Restaurant not associated with their account, THEN THE System SHALL return an HTTP 403 response.
5. WHEN an Owner uploads a logo image, THE Image_Service SHALL validate that the file is a JPEG, PNG, or WebP format with a maximum size of 5 MB before storing it.
6. IF an uploaded image fails format or size validation, THEN THE Image_Service SHALL return an HTTP 422 response with a descriptive error message.

---

### Requirement 4: Category Management

**User Story:** As an Owner, I want to create, edit, reorder, and delete menu categories, so that I can organize my menu into logical sections.

#### Acceptance Criteria

1. WHEN an Owner creates a Category with a name and optional display_order, THE Menu_Service SHALL persist the Category linked to the Owner's Restaurant.
2. WHEN an Owner updates a Category's name or display_order, THE Menu_Service SHALL persist the changes.
3. WHEN an Owner deletes a Category, THE Menu_Service SHALL delete the Category and all Menu_Items belonging to that Category.
4. THE Menu_Service SHALL return Categories for a Restaurant sorted ascending by display_order.
5. IF an Owner attempts to create, update, or delete a Category belonging to a Restaurant not owned by that Owner, THEN THE Menu_Service SHALL return an HTTP 403 response.
6. IF an Owner attempts to create a Category with a name that already exists within the same Restaurant, THEN THE Menu_Service SHALL return an HTTP 409 response.

---

### Requirement 5: Menu Item Management

**User Story:** As an Owner, I want to create, edit, reorder, and delete menu items within categories, so that customers see an accurate and up-to-date menu.

#### Acceptance Criteria

1. WHEN an Owner creates a Menu_Item with a name, price, and category_id, THE Menu_Service SHALL persist the Menu_Item linked to the specified Category.
2. WHEN an Owner updates a Menu_Item's name, description, price, image, availability, or display_order, THE Menu_Service SHALL persist only the updated fields.
3. WHEN an Owner sets a Menu_Item's `is_available` field to `false`, THE Menu_Service SHALL mark the item as sold out.
4. WHEN an Owner deletes a Menu_Item, THE Menu_Service SHALL remove the item permanently.
5. THE Menu_Service SHALL return Menu_Items within a Category sorted ascending by display_order.
6. IF an Owner attempts to create or modify a Menu_Item in a Category not belonging to the Owner's Restaurant, THEN THE Menu_Service SHALL return an HTTP 403 response.
7. IF an Owner submits a Menu_Item with a price less than 0, THEN THE Menu_Service SHALL return an HTTP 422 response with a descriptive error message.
8. WHEN an Owner uploads a Menu_Item image, THE Image_Service SHALL validate that the file is a JPEG, PNG, or WebP format with a maximum size of 5 MB before storing it.

---

### Requirement 6: QR Code Generation

**User Story:** As an Owner, I want to generate and download a QR code for my restaurant, so that I can print it and place it on tables for customers to scan.

#### Acceptance Criteria

1. WHEN an Owner requests QR code generation via `GET /api/restaurant/qr`, THE QR_Service SHALL generate a QR code image encoding the URL `https://menu.{domain}/{unique_qr_id}`.
2. THE QR_Service SHALL return the QR code as a downloadable PNG image.
3. THE QR_Service SHALL use the Restaurant's existing `unique_qr_id` so that repeated generation requests produce a QR code pointing to the same URL.
4. IF the Owner's Restaurant does not yet have a `unique_qr_id`, THEN THE QR_Service SHALL generate and persist a new UUID v4 before producing the QR code image.
5. THE System SHALL restrict QR code generation to authenticated Owners, returning HTTP 401 for unauthenticated requests.

---

### Requirement 7: Public Menu Display

**User Story:** As a Customer, I want to scan a QR code and view the restaurant's full menu in my mobile browser, so that I can browse available items without installing an app or creating an account.

#### Acceptance Criteria

1. WHEN a Customer sends a request to `GET /api/public/menu/{unique_qr_id}`, THE Public_Menu_Service SHALL return the Restaurant's name, logo URL, primary color, and all active Categories with their Menu_Items.
2. THE Public_Menu_Service SHALL include each Menu_Item's name, description, price, image URL, and `is_available` status in the response.
3. THE Public_Menu_Service SHALL require no authentication token for `GET /api/public/menu/{unique_qr_id}`.
4. IF a request is made with a `unique_qr_id` that does not match any Restaurant, THEN THE Public_Menu_Service SHALL return an HTTP 404 response.
5. THE Public_Menu_Service SHALL return Categories sorted ascending by display_order and Menu_Items within each Category sorted ascending by display_order.
6. THE System SHALL enforce a rate limit of 100 requests per minute per IP address on the public menu endpoint, returning HTTP 429 when the limit is exceeded.

---

### Requirement 8: Public Menu Frontend

**User Story:** As a Customer, I want the menu page to be readable and usable on a mobile phone, so that I can comfortably browse the menu after scanning the QR code.

#### Acceptance Criteria

1. THE System SHALL render the public menu page using a mobile-first responsive layout that is functional on viewport widths from 320px to 1280px.
2. WHEN the public menu page loads, THE System SHALL display the Restaurant's logo, name, and theme color as the page header.
3. WHEN the public menu page loads, THE System SHALL display all Categories as navigable sections with their Menu_Items listed beneath each Category.
4. THE System SHALL visually distinguish Menu_Items where `is_available` is `false` by displaying a "Sold Out" label.
5. WHEN a Customer navigates to a URL with an invalid `unique_qr_id`, THE System SHALL display a user-friendly error page indicating the menu was not found.

---

### Requirement 9: Image Upload and Storage

**User Story:** As an Owner, I want to upload images for my restaurant logo and menu items, so that customers see visual representations of the food.

#### Acceptance Criteria

1. WHEN an Owner uploads an image, THE Image_Service SHALL store the image in the configured object storage (S3 or Cloudinary) and return a permanent URL.
2. THE Image_Service SHALL sanitize uploaded files by verifying the file's MIME type against its binary content, not solely the file extension.
3. IF an uploaded file's binary content does not match a permitted MIME type (JPEG, PNG, WebP), THEN THE Image_Service SHALL reject the upload and return an HTTP 422 response.
4. THE Image_Service SHALL limit accepted image file size to 5 MB, returning HTTP 413 for files exceeding this limit.

---

### Requirement 10: Row-Level Data Security

**User Story:** As a platform operator, I want each Owner to access only their own data, so that restaurant data is isolated between tenants.

#### Acceptance Criteria

1. WHILE an Owner is authenticated, THE System SHALL scope all Menu_Service and QR_Service queries to Restaurants owned by that Owner's user ID.
2. IF an authenticated Owner's request references a resource (Restaurant, Category, or Menu_Item) not belonging to their account, THEN THE System SHALL return an HTTP 403 response without exposing data from other accounts.
3. THE System SHALL validate ownership at the API layer before executing any database write operation.
