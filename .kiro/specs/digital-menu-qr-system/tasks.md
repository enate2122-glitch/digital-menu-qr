# Tasks

## Task List

- [x] 1. Project Setup and Infrastructure
  - [x] 1.1 Initialize Node.js/Express backend project with TypeScript
  - [x] 1.2 Configure PostgreSQL connection and run initial schema migrations (users, restaurants, categories, menu_items, revoked_tokens tables)
  - [x] 1.3 Set up Redis connection for rate limiting
  - [x] 1.4 Configure object storage client (S3 or Cloudinary)
  - [x] 1.5 Initialize React frontend project with TypeScript
  - [x] 1.6 Set up Jest and fast-check for backend testing

- [x] 2. Auth_Service — Authentication
  - [x] 2.1 Implement POST /api/auth/login — validate credentials, return JWT + role
  - [x] 2.2 Implement JWT middleware — validate signature and expiry on protected routes
  - [x] 2.3 Implement bcrypt password hashing with cost factor >= 12
  - [x] 2.4 Implement revoked token check middleware for session invalidation
  - [x] 2.5 Write property test: valid credentials always return JWT with correct role (P1)
  - [x] 2.6 Write property test: invalid credentials always return 401 (P2)

- [x] 3. Auth_Service — Owner Account Management
  - [x] 3.1 Implement POST /api/auth/register — Super_Admin only, create Owner account
  - [x] 3.2 Implement GET /api/auth/users — Super_Admin only, list all Owner accounts
  - [x] 3.3 Implement PATCH /api/auth/users/:id/deactivate — set status inactive, revoke tokens
  - [x] 3.4 Write property test: inactive owner login always returns 403 (P3)
  - [x] 3.5 Write property test: duplicate email registration always returns 409 (P4)
  - [x] 3.6 Write property test: non-super_admin register requests return 403

- [x] 4. Restaurant Profile Management
  - [x] 4.1 Implement POST /api/restaurants — create restaurant, generate slug and unique_qr_id
  - [x] 4.2 Implement GET /api/restaurants/:id — fetch restaurant profile
  - [x] 4.3 Implement PATCH /api/restaurants/:id — partial update, ownership check
  - [x] 4.4 Write property test: cross-tenant resource access always returns 403 (P5)
  - [x] 4.5 Write property test: partial update preserves unchanged fields (P17)
  - [x] 4.6 Write property test: generated slug and unique_qr_id are unique across restaurants (P3.2)

- [x] 5. Category Management
  - [x] 5.1 Implement POST /api/categories — create category with ownership check
  - [x] 5.2 Implement PATCH /api/categories/:id — update name/display_order with ownership check
  - [x] 5.3 Implement DELETE /api/categories/:id — cascade delete items, ownership check
  - [x] 5.4 Implement GET /api/restaurants/:id/categories — list sorted by display_order
  - [x] 5.5 Write property test: category list always sorted ascending by display_order (P6)
  - [x] 5.6 Write property test: deleting a category removes all its items (P7)
  - [x] 5.7 Write property test: duplicate category name in same restaurant returns 409 (P8)

- [x] 6. Menu Item Management
  - [x] 6.1 Implement POST /api/items — create menu item with ownership check
  - [x] 6.2 Implement PATCH /api/items/:id — partial update with ownership check
  - [x] 6.3 Implement DELETE /api/items/:id — permanent delete with ownership check
  - [x] 6.4 Implement GET /api/categories/:id/items — list sorted by display_order
  - [x] 6.5 Write property test: item list always sorted ascending by display_order (P9)
  - [x] 6.6 Write property test: price < 0 always returns 422 (P10)

- [x] 7. Image_Service
  - [x] 7.1 Implement POST /api/images/upload — validate MIME via magic bytes, enforce 5 MB limit, store and return URL
  - [x] 7.2 Implement magic byte MIME detection for JPEG, PNG, WebP
  - [x] 7.3 Write property test: non-permitted MIME binary always returns 422 (P15)
  - [x] 7.4 Write property test: files > 5 MB always return 413 (P16)

- [x] 8. QR_Service
  - [x] 8.1 Implement GET /api/restaurant/qr — generate PNG QR code encoding the public menu URL (`https://menu.{domain}/{unique_qr_id}`)
    - Create `backend/src/services/qr.service.ts` using a QR code library (e.g. `qrcode`)
    - Create `backend/src/routes/qr.router.ts` and mount at `/api/restaurant` in `app.ts`
    - Require Owner JWT; derive restaurant from the authenticated user's owned restaurant
    - _Requirements: 6.1, 6.2, 6.5_
  - [x] 8.2 Ensure unique_qr_id is generated and persisted if not already present
    - If the owner's restaurant has no `unique_qr_id`, generate a UUID v4 and persist it before producing the QR image
    - _Requirements: 6.4_
  - [ ]* 8.3 Write property test: repeated QR generation always encodes the same URL (P11)
    - **Property 11: QR code URL stability**
    - **Validates: Requirements 6.3**

- [x] 9. Public_Menu_Service
  - [x] 9.1 Implement GET /api/public/menu/:unique_qr_id — return full menu data, no auth required
    - Create `backend/src/services/publicMenu.service.ts` and `backend/src/routes/publicMenu.router.ts`
    - Mount at `/api/public` in `app.ts`
    - Return restaurant name, logo URL, primary color, and all categories with their menu items (name, description, price, image URL, is_available), sorted by display_order
    - _Requirements: 7.1, 7.2, 7.3, 7.5_
  - [x] 9.2 Apply rate limiting middleware (100 req/min per IP via Redis)
    - Add `express-rate-limit` with a Redis store to the public menu route
    - Return HTTP 429 with `Retry-After` header when limit is exceeded
    - _Requirements: 7.6_
  - [ ]* 9.3 Write property test: valid unique_qr_id response contains all required fields (P12)
    - **Property 12: Public menu response completeness**
    - **Validates: Requirements 7.1, 7.2**
  - [ ]* 9.4 Write property test: public menu response is correctly sorted (P13)
    - **Property 13: Public menu sort order**
    - **Validates: Requirements 7.5**
  - [ ]* 9.5 Write property test: unknown unique_qr_id always returns 404 (P14)
    - **Property 14: Unknown QR ID returns 404**
    - **Validates: Requirements 7.4**

- [x] 10. Checkpoint — Backend complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Admin Portal Frontend
  - [x] 11.1 Implement login page with JWT storage and API call to POST /api/auth/login
    - Wire up the existing `LoginPage.tsx` form to call the API and store the JWT in localStorage
    - Redirect to `/admin` on success
    - _Requirements: 1.1, 1.2_
  - [x] 11.2 Implement Super_Admin dashboard — owner account list, create, deactivate
    - Add a route at `/admin/users` inside `AdminLayout.tsx`
    - Fetch from GET /api/auth/users; render a table with create and deactivate actions
    - _Requirements: 2.1, 2.3, 2.4_
  - [x] 11.3 Implement Owner dashboard — restaurant profile form
    - Add a route at `/admin/restaurant` inside `AdminLayout.tsx`
    - Fetch/update via GET and PATCH /api/restaurants/:id
    - Include logo image upload via POST /api/images/upload
    - _Requirements: 3.1, 3.3, 3.5_
  - [x] 11.4 Implement category management UI — create, edit, reorder, delete
    - Add a route at `/admin/categories` inside `AdminLayout.tsx`
    - CRUD via POST/PATCH/DELETE /api/categories and GET /api/restaurants/:id/categories
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  - [x] 11.5 Implement menu item management UI — create, edit, reorder, delete, toggle availability
    - Add a route at `/admin/items` inside `AdminLayout.tsx`
    - CRUD via POST/PATCH/DELETE /api/items and GET /api/categories/:id/items
    - Include item image upload via POST /api/images/upload
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  - [x] 11.6 Implement QR code download button
    - Add a button in the Owner dashboard that calls GET /api/restaurant/qr and triggers a PNG download
    - _Requirements: 6.1, 6.2_

- [x] 12. Public Menu Frontend
  - [x] 12.1 Implement mobile-first public menu page — display restaurant header (logo, name, theme color)
    - Flesh out `PublicMenuPage.tsx`: fetch from GET /api/public/menu/:uniqueQrId and render the restaurant header
    - Apply mobile-first responsive CSS (viewport widths 320px–1280px)
    - _Requirements: 8.1, 8.2_
  - [x] 12.2 Render categories as navigable sections with menu items listed beneath
    - Map over categories and items from the API response; render each category as a section with its items
    - _Requirements: 8.3_
  - [x] 12.3 Display "Sold Out" label for items where is_available is false
    - Conditionally render a "Sold Out" badge on items with `is_available === false`
    - _Requirements: 8.4_
  - [x] 12.4 Implement 404 error page for invalid unique_qr_id
    - Handle 404 response from the API and render a user-friendly "menu not found" page
    - _Requirements: 8.5_
  - [ ]* 12.5 Write property test: unavailable items render with "Sold Out" label (P8.4)
    - **Property 8.4: Sold Out label rendered for unavailable items**
    - **Validates: Requirements 8.4**

- [ ] 13. Integration and End-to-End Testing
  - [ ]* 13.1 Write integration test: full owner flow — register → create restaurant → add categories/items → generate QR → public menu accessible
    - _Requirements: 2.1, 3.1, 4.1, 5.1, 6.1, 7.1_
  - [ ]* 13.2 Write integration test: session invalidation — deactivate owner → old JWT rejected
    - _Requirements: 2.4_
  - [ ]* 13.3 Write integration test: rate limiting — 101st request from same IP returns 429
    - _Requirements: 7.6_

- [x] 14. Final Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
