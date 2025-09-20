// Test script to verify wishlist functionality
const baseURL = 'http://localhost:5001/api';

// Test user credentials (you'll need to replace with actual user token)
const testToken = 'your-jwt-token-here';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${testToken}`
};

async function testWishlistEndpoints() {
  console.log('🚀 Starting Wishlist API Tests...\n');

  try {
    // Test 1: Get wishlist
    console.log('1. Testing GET /api/wishlist');
    const wishlistResponse = await fetch(`${baseURL}/wishlist`, {
      headers
    });
    console.log('Status:', wishlistResponse.status);
    if (wishlistResponse.ok) {
      const wishlistData = await wishlistResponse.json();
      console.log('Wishlist data:', JSON.stringify(wishlistData, null, 2));
    } else {
      console.log('Error:', await wishlistResponse.text());
    }
    console.log('---\n');

    // Test 2: Get wishlist summary
    console.log('2. Testing GET /api/wishlist/summary');
    const summaryResponse = await fetch(`${baseURL}/wishlist/summary`, {
      headers
    });
    console.log('Status:', summaryResponse.status);
    if (summaryResponse.ok) {
      const summaryData = await summaryResponse.json();
      console.log('Summary data:', JSON.stringify(summaryData, null, 2));
    } else {
      console.log('Error:', await summaryResponse.text());
    }
    console.log('---\n');

    // Test 3: Add product to wishlist (replace with actual product ID)
    const testProductId = '60d0fe4f5311236168a109ca'; // Replace with actual product ID
    console.log('3. Testing POST /api/wishlist/add');
    const addResponse = await fetch(`${baseURL}/wishlist/add`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        productId: testProductId,
        notes: 'Test product added via API'
      })
    });
    console.log('Status:', addResponse.status);
    if (addResponse.ok) {
      const addData = await addResponse.json();
      console.log('Add response:', JSON.stringify(addData, null, 2));
    } else {
      console.log('Error:', await addResponse.text());
    }

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// Instructions for running the test
console.log(`
📋 WISHLIST API TEST INSTRUCTIONS:

1. First, log in to get a JWT token:
   - Go to http://localhost:5174/login
   - Login with valid credentials
   - Check browser developer tools > Application > Local Storage
   - Copy the "userInfo" token value

2. Replace 'your-jwt-token-here' above with the actual token

3. Get a valid product ID:
   - Go to http://localhost:5174/products
   - Inspect any product and get its ID from the URL or API calls

4. Replace the testProductId with actual product ID

5. Run this script in the browser console or with Node.js

Example API endpoints available:
- GET /api/wishlist - Get user wishlist
- POST /api/wishlist/add - Add product to wishlist
- DELETE /api/wishlist/remove/:productId - Remove product
- PUT /api/wishlist/notes/:productId - Update product notes
- GET /api/wishlist/check/:productId - Check if product is in wishlist
- DELETE /api/wishlist/clear - Clear entire wishlist
- GET /api/wishlist/summary - Get wishlist statistics
- GET /api/wishlist/filtered - Get filtered wishlist with pagination

🎯 Ready to test! Update the token and product ID, then call testWishlistEndpoints()
`);

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testWishlistEndpoints };
}