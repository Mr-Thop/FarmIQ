# Missing APIs Required for Full Functionality

## Customer APIs
1. `/api/customer/orders` - GET - Fetch customer orders
2. `/api/customer/orders/{id}` - GET - Fetch specific order details
3. `/api/customer/orders/{id}/cancel` - POST - Cancel an order
4. `/api/customer/profile` - GET - Fetch customer profile
5. `/api/customer/profile` - PUT - Update customer profile
6. `/api/customer/saved-items` - GET - Fetch saved items
7. `/api/customer/saved-items` - POST - Save an item
8. `/api/customer/saved-items/{id}` - DELETE - Remove a saved item
9. `/api/customer/toggle-save` - POST - Toggle save status for an item

## Cart APIs
1. `/api/cart` - GET - Fetch cart contents
2. `/api/cart` - POST - Add item to cart
3. `/api/cart/{id}` - PUT - Update cart item
4. `/api/cart/{id}` - DELETE - Remove item from cart

## Order APIs
1. `/api/orders` - GET - Fetch all orders
2. `/api/orders` - POST - Create a new order
3. `/api/orders/{id}` - GET - Fetch specific order
4. `/api/orders/{id}/cancel` - POST - Cancel an order

## Farm APIs
1. `/api/farms` - GET - Fetch farms with filtering options
2. `/api/farms/{id}` - GET - Fetch specific farm details
3. `/api/farms/{id}/products` - GET - Fetch products from a specific farm

## Product APIs
1. `/api/products` - GET - Fetch products with filtering options
2. `/api/products/{id}` - GET - Fetch specific product details
3. `/api/products` - POST - Create a new product listing (for farmers)
4. `/api/products/{id}` - PUT - Update a product listing
5. `/api/products/{id}` - DELETE - Remove a product listing

## Notification APIs
1. `/api/notifications` - GET - Fetch notifications
2. `/api/notifications/{id}/read` - POST - Mark notification as read
3. `/api/notifications/read-all` - POST - Mark all notifications as read

## Authentication APIs
1. `/api/auth/login` - POST - User login
2. `/api/auth/register` - POST - User registration
3. `/api/auth/logout` - POST - User logout
4. `/api/auth/refresh` - POST - Refresh authentication token
5. `/api/auth/me` - GET - Get current user information

## Analysis APIs (for farmers)
1. `/api/analysis/soil` - POST - Upload and analyze soil images
2. `/api/analysis/leaf` - POST - Upload and analyze leaf images for disease detection

## Weather APIs
1. `/api/weather/current` - GET - Get current weather for a location
2. `/api/weather/forecast` - GET - Get weather forecast for a location
