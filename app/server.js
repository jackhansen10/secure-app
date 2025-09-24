const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Sample customer database
const customers = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@email.com',
    phone: '+1-555-0123',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    dateOfBirth: '1985-03-15',
    customerSince: '2020-01-15',
    status: 'active'
  },
  {
    id: 2,
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1-555-0456',
    address: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    dateOfBirth: '1990-07-22',
    customerSince: '2019-06-10',
    status: 'active'
  },
  {
    id: 3,
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@email.com',
    phone: '+1-555-0789',
    address: {
      street: '789 Pine Rd',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA'
    },
    dateOfBirth: '1988-11-08',
    customerSince: '2021-03-20',
    status: 'inactive'
  },
  {
    id: 4,
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@email.com',
    phone: '+1-555-0321',
    address: {
      street: '321 Elm St',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
      country: 'USA'
    },
    dateOfBirth: '1992-05-14',
    customerSince: '2022-08-05',
    status: 'active'
  },
  {
    id: 5,
    firstName: 'David',
    lastName: 'Wilson',
    email: 'david.wilson@email.com',
    phone: '+1-555-0654',
    address: {
      street: '654 Maple Dr',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      country: 'USA'
    },
    dateOfBirth: '1987-09-30',
    customerSince: '2020-11-12',
    status: 'active'
  }
];

app.get('/', (req, res) => {
  res.json({ 
    message: 'SecureApp Customer API', 
    version: '3.0.0',
    environment: process.env.NODE_ENV || 'development',
    totalCustomers: customers.length,
    endpoints: {
      'GET /customers': 'Get all customers',
      'GET /customers/:id': 'Get customer by ID',
      'GET /customers/search/:query': 'Search customers by name or email',
      'GET /customers/active': 'Get active customers only',
      'GET /customers/inactive': 'Get inactive customers only'
    },
    formats: {
      json: 'Default JSON format',
      text: 'Plain text format: ?format=text',
      html: 'HTML format: ?format=html'
    },
    examples: [
      'curl http://localhost:3000/customers',
      'curl http://localhost:3000/customers/1',
      'curl http://localhost:3000/customers/search/john',
      'curl http://localhost:3000/customers/active?format=html'
    ]
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Get all customers
app.get('/customers', (req, res) => {
  const format = req.query.format || 'json';
  
  if (format === 'text' || format === 'plain') {
    res.set('Content-Type', 'text/plain');
    let output = `Total Customers: ${customers.length}\n\n`;
    customers.forEach(customer => {
      output += `${customer.id}. ${customer.firstName} ${customer.lastName} (${customer.email}) - ${customer.status}\n`;
    });
    res.send(output);
  } else if (format === 'html') {
    res.set('Content-Type', 'text/html');
    let html = `
      <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Customer Database</h2>
          <p><strong>Total Customers:</strong> ${customers.length}</p>
          <table border="1" style="border-collapse: collapse; width: 100%;">
            <tr style="background-color: #f2f2f2;">
              <th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Status</th>
            </tr>
    `;
    customers.forEach(customer => {
      const statusColor = customer.status === 'active' ? 'green' : 'red';
      html += `
        <tr>
          <td>${customer.id}</td>
          <td>${customer.firstName} ${customer.lastName}</td>
          <td>${customer.email}</td>
          <td>${customer.phone}</td>
          <td style="color: ${statusColor};">${customer.status}</td>
        </tr>
      `;
    });
    html += `
          </table>
          <hr>
          <p><a href="/customers/active">Active Customers</a> | <a href="/customers/inactive">Inactive Customers</a></p>
        </body>
      </html>
    `;
    res.send(html);
  } else {
    res.json({ 
      customers: customers,
      total: customers.length,
      timestamp: new Date().toISOString()
    });
  }
});

// Get active customers only
app.get('/customers/active', (req, res) => {
  const activeCustomers = customers.filter(c => c.status === 'active');
  const format = req.query.format || 'json';
  
  if (format === 'text' || format === 'plain') {
    res.set('Content-Type', 'text/plain');
    let output = `Active Customers: ${activeCustomers.length}\n\n`;
    activeCustomers.forEach(customer => {
      output += `${customer.id}. ${customer.firstName} ${customer.lastName} (${customer.email})\n`;
    });
    res.send(output);
  } else if (format === 'html') {
    res.set('Content-Type', 'text/html');
    let html = `
      <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Active Customers</h2>
          <p><strong>Total Active:</strong> ${activeCustomers.length}</p>
          <table border="1" style="border-collapse: collapse; width: 100%;">
            <tr style="background-color: #f2f2f2;">
              <th>ID</th><th>Name</th><th>Email</th><th>Phone</th>
            </tr>
    `;
    activeCustomers.forEach(customer => {
      html += `
        <tr>
          <td>${customer.id}</td>
          <td>${customer.firstName} ${customer.lastName}</td>
          <td>${customer.email}</td>
          <td>${customer.phone}</td>
        </tr>
      `;
    });
    html += `
          </table>
          <hr>
          <p><a href="/customers">All Customers</a> | <a href="/customers/inactive">Inactive Customers</a></p>
        </body>
      </html>
    `;
    res.send(html);
  } else {
    res.json({ 
      customers: activeCustomers,
      count: activeCustomers.length,
      timestamp: new Date().toISOString()
    });
  }
});

// Get inactive customers only
app.get('/customers/inactive', (req, res) => {
  const inactiveCustomers = customers.filter(c => c.status === 'inactive');
  const format = req.query.format || 'json';
  
  if (format === 'text' || format === 'plain') {
    res.set('Content-Type', 'text/plain');
    let output = `Inactive Customers: ${inactiveCustomers.length}\n\n`;
    inactiveCustomers.forEach(customer => {
      output += `${customer.id}. ${customer.firstName} ${customer.lastName} (${customer.email})\n`;
    });
    res.send(output);
  } else if (format === 'html') {
    res.set('Content-Type', 'text/html');
    let html = `
      <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Inactive Customers</h2>
          <p><strong>Total Inactive:</strong> ${inactiveCustomers.length}</p>
          <table border="1" style="border-collapse: collapse; width: 100%;">
            <tr style="background-color: #f2f2f2;">
              <th>ID</th><th>Name</th><th>Email</th><th>Phone</th>
            </tr>
    `;
    inactiveCustomers.forEach(customer => {
      html += `
        <tr>
          <td>${customer.id}</td>
          <td>${customer.firstName} ${customer.lastName}</td>
          <td>${customer.email}</td>
          <td>${customer.phone}</td>
        </tr>
      `;
    });
    html += `
          </table>
          <hr>
          <p><a href="/customers">All Customers</a> | <a href="/customers/active">Active Customers</a></p>
        </body>
      </html>
    `;
    res.send(html);
  } else {
    res.json({ 
      customers: inactiveCustomers,
      count: inactiveCustomers.length,
      timestamp: new Date().toISOString()
    });
  }
});

// Get customer by ID
app.get('/customers/:id', (req, res) => {
  const customerId = parseInt(req.params.id);
  const customer = customers.find(c => c.id === customerId);
  const format = req.query.format || 'json';
  
  if (!customer) {
    return res.status(404).json({ 
      error: 'Customer not found', 
      availableIds: customers.map(c => c.id)
    });
  }
  
  if (format === 'text' || format === 'plain') {
    res.set('Content-Type', 'text/plain');
    res.send(`
Customer ID: ${customer.id}
Name: ${customer.firstName} ${customer.lastName}
Email: ${customer.email}
Phone: ${customer.phone}
Address: ${customer.address.street}, ${customer.address.city}, ${customer.address.state} ${customer.address.zipCode}
Date of Birth: ${customer.dateOfBirth}
Customer Since: ${customer.customerSince}
Status: ${customer.status}
    `);
  } else if (format === 'html') {
    res.set('Content-Type', 'text/html');
    const statusColor = customer.status === 'active' ? 'green' : 'red';
    res.send(`
      <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Customer Details</h2>
          <p><strong>ID:</strong> ${customer.id}</p>
          <p><strong>Name:</strong> ${customer.firstName} ${customer.lastName}</p>
          <p><strong>Email:</strong> ${customer.email}</p>
          <p><strong>Phone:</strong> ${customer.phone}</p>
          <p><strong>Address:</strong> ${customer.address.street}, ${customer.address.city}, ${customer.address.state} ${customer.address.zipCode}</p>
          <p><strong>Date of Birth:</strong> ${customer.dateOfBirth}</p>
          <p><strong>Customer Since:</strong> ${customer.customerSince}</p>
          <p><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${customer.status}</span></p>
          <hr>
          <p><a href="/customers">Back to All Customers</a></p>
        </body>
      </html>
    `);
  } else {
    res.json({ 
      customer: customer,
      timestamp: new Date().toISOString()
    });
  }
});

// Search customers by name or email
app.get('/customers/search/:query', (req, res) => {
  const query = req.params.query.toLowerCase();
  const format = req.query.format || 'json';
  
  const results = customers.filter(customer => 
    customer.firstName.toLowerCase().includes(query) ||
    customer.lastName.toLowerCase().includes(query) ||
    customer.email.toLowerCase().includes(query)
  );
  
  if (format === 'text' || format === 'plain') {
    res.set('Content-Type', 'text/plain');
    let output = `Search Results for "${query}": ${results.length} found\n\n`;
    results.forEach(customer => {
      output += `${customer.id}. ${customer.firstName} ${customer.lastName} (${customer.email}) - ${customer.status}\n`;
    });
    res.send(output);
  } else if (format === 'html') {
    res.set('Content-Type', 'text/html');
    let html = `
      <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Search Results for "${query}"</h2>
          <p><strong>Found:</strong> ${results.length} customers</p>
    `;
    if (results.length > 0) {
      html += `
        <table border="1" style="border-collapse: collapse; width: 100%;">
          <tr style="background-color: #f2f2f2;">
            <th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Status</th>
          </tr>
      `;
      results.forEach(customer => {
        const statusColor = customer.status === 'active' ? 'green' : 'red';
        html += `
          <tr>
            <td>${customer.id}</td>
            <td>${customer.firstName} ${customer.lastName}</td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td style="color: ${statusColor};">${customer.status}</td>
          </tr>
        `;
      });
      html += `</table>`;
    } else {
      html += `<p>No customers found matching "${query}"</p>`;
    }
    html += `
          <hr>
          <p><a href="/customers">Back to All Customers</a></p>
        </body>
      </html>
    `;
    res.send(html);
  } else {
    res.json({ 
      query: query,
      results: results,
      count: results.length,
      timestamp: new Date().toISOString()
    });
  }
});

// Get active customers only
app.get('/customers/active', (req, res) => {
  const activeCustomers = customers.filter(c => c.status === 'active');
  const format = req.query.format || 'json';
  
  if (format === 'text' || format === 'plain') {
    res.set('Content-Type', 'text/plain');
    let output = `Active Customers: ${activeCustomers.length}\n\n`;
    activeCustomers.forEach(customer => {
      output += `${customer.id}. ${customer.firstName} ${customer.lastName} (${customer.email})\n`;
    });
    res.send(output);
  } else if (format === 'html') {
    res.set('Content-Type', 'text/html');
    let html = `
      <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Active Customers</h2>
          <p><strong>Total Active:</strong> ${activeCustomers.length}</p>
          <table border="1" style="border-collapse: collapse; width: 100%;">
            <tr style="background-color: #f2f2f2;">
              <th>ID</th><th>Name</th><th>Email</th><th>Phone</th>
            </tr>
    `;
    activeCustomers.forEach(customer => {
      html += `
        <tr>
          <td>${customer.id}</td>
          <td>${customer.firstName} ${customer.lastName}</td>
          <td>${customer.email}</td>
          <td>${customer.phone}</td>
        </tr>
      `;
    });
    html += `
          </table>
          <hr>
          <p><a href="/customers">All Customers</a> | <a href="/customers/inactive">Inactive Customers</a></p>
        </body>
      </html>
    `;
    res.send(html);
  } else {
    res.json({ 
      customers: activeCustomers,
      count: activeCustomers.length,
      timestamp: new Date().toISOString()
    });
  }
});

// Get inactive customers only
app.get('/customers/inactive', (req, res) => {
  const inactiveCustomers = customers.filter(c => c.status === 'inactive');
  const format = req.query.format || 'json';
  
  if (format === 'text' || format === 'plain') {
    res.set('Content-Type', 'text/plain');
    let output = `Inactive Customers: ${inactiveCustomers.length}\n\n`;
    inactiveCustomers.forEach(customer => {
      output += `${customer.id}. ${customer.firstName} ${customer.lastName} (${customer.email})\n`;
    });
    res.send(output);
  } else if (format === 'html') {
    res.set('Content-Type', 'text/html');
    let html = `
      <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Inactive Customers</h2>
          <p><strong>Total Inactive:</strong> ${inactiveCustomers.length}</p>
          <table border="1" style="border-collapse: collapse; width: 100%;">
            <tr style="background-color: #f2f2f2;">
              <th>ID</th><th>Name</th><th>Email</th><th>Phone</th>
            </tr>
    `;
    inactiveCustomers.forEach(customer => {
      html += `
        <tr>
          <td>${customer.id}</td>
          <td>${customer.firstName} ${customer.lastName}</td>
          <td>${customer.email}</td>
          <td>${customer.phone}</td>
        </tr>
      `;
    });
    html += `
          </table>
          <hr>
          <p><a href="/customers">All Customers</a> | <a href="/customers/active">Active Customers</a></p>
        </body>
      </html>
    `;
    res.send(html);
  } else {
    res.json({ 
      customers: inactiveCustomers,
      count: inactiveCustomers.length,
      timestamp: new Date().toISOString()
    });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`SecureApp Customer API running on port ${port}`);
  console.log(`Total customers loaded: ${customers.length}`);
  console.log(`Active customers: ${customers.filter(c => c.status === 'active').length}`);
  console.log(`Inactive customers: ${customers.filter(c => c.status === 'inactive').length}`);
});