import fetch from 'node-fetch';

async function registerAdmin() {
  try {
    console.log('Registering super admin via API...');
    
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: 'Super',
        lastName: 'Admin',
        email: 'admin@store.com',
        password: 'admin123',
        shopName: 'Best Supermarket',
        shopAddress: '123 Main Street',
        shopPhone: '+1-555-0100',
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Super admin registered successfully!');
      console.log('\nLogin credentials:');
      console.log('Email: admin@store.com');
      console.log('Password: admin123');
    } else {
      console.error('❌ Registration failed:', data);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

registerAdmin();
