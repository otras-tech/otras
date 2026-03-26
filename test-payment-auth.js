async function testPaymentAuth() {
  const baseUrl = 'http://localhost:4000';
  const testUser = {
    email: `tester_${Date.now()}@example.com`,
    password: 'password123',
    firstName: 'Test',
    lastName: 'User',
    phoneNumber: '1234567890',
    domicile: 'TS',
    pincode: '500001'
  };

  try {
    console.log("1. Registering new user...");
    const regRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    
    const regData = await regRes.json();
    if (!regRes.ok) {
        console.error("Registration failed:", regData);
        return;
    }
    
    const token = regData.access_token;
    console.log("Token received:", token.substring(0, 20) + "...");

    console.log("2. Creating order with new token...");
    // First, ensure a subscription exists with ID 1
    const orderRes = await fetch(`${baseUrl}/payments/create-order`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ subscriptionId: 1 })
    });

    const orderData = await orderRes.json();
    console.log("Status:", orderRes.status);
    console.log("Response:", JSON.stringify(orderData, null, 2));
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testPaymentAuth();
