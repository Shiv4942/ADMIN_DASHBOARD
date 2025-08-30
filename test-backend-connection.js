// Test script to verify backend connection
const testBackendConnection = async () => {
  const backendUrl = 'https://admin-dashboard-qdgo.onrender.com';
  
  console.log('Testing connection to:', backendUrl);
  
  try {
    // Test dashboard endpoint
    const dashboardRes = await fetch(`${backendUrl}/api/dashboard/overview`);
    console.log('Dashboard endpoint status:', dashboardRes.status);
    
    if (dashboardRes.ok) {
      const data = await dashboardRes.json();
      console.log('Dashboard data received:', data);
    }
    
    // Test finance endpoint
    const financeRes = await fetch(`${backendUrl}/api/finance/overview`);
    console.log('Finance endpoint status:', financeRes.status);
    
    if (financeRes.ok) {
      const data = await financeRes.json();
      console.log('Finance data received:', data);
    }
    
    console.log('✅ Backend connection successful!');
    
  } catch (error) {
    console.error('❌ Backend connection failed:', error.message);
  }
};

// Run the test
testBackendConnection();
