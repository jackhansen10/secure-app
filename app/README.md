# SecureApp Customer API

A secure Node.js application demonstrating DevSecOps practices with a customer database API. This application serves as a learning tool for security scanning, containerization, and Kubernetes deployment.

## 🚀 Quick Start

### Prerequisites
- Docker installed and running
- Node.js 18+ (for local development)

### Running the Application

#### Option 1: Docker (Recommended)
```bash
# Build the container
docker build -f Dockerfile -t secure-app:latest .

# Run the container
docker run -d -p 3000:3000 --name secure-app-container secure-app:latest

# Test the API
curl http://localhost:3000/
```

#### Option 2: Local Development
```bash
# Install dependencies
npm install

# Start the server
npm start

# The API will be available at http://localhost:3000
```

## 📊 Sample Data

The application includes 5 sample customers with complete profiles:

| ID | Name | Email | Phone | Location | Status |
|----|------|-------|-------|----------|--------|
| 1 | John Smith | john.smith@email.com | +1-555-0123 | New York, NY | Active |
| 2 | Sarah Johnson | sarah.johnson@email.com | +1-555-0456 | Los Angeles, CA | Active |
| 3 | Michael Brown | michael.brown@email.com | +1-555-0789 | Chicago, IL | Inactive |
| 4 | Emily Davis | emily.davis@email.com | +1-555-0321 | Miami, FL | Active |
| 5 | David Wilson | david.wilson@email.com | +1-555-0654 | Seattle, WA | Active |

Each customer record includes:
- Personal information (name, email, phone)
- Complete address (street, city, state, zip, country)
- Important dates (date of birth, customer since)
- Account status (active/inactive)

## 🔌 API Endpoints

### Base Information
- **GET /** - API overview and documentation
- **GET /health** - Health check endpoint

### Customer Management

#### Get All Customers
```bash
# JSON format (default)
curl http://localhost:3000/customers

# Plain text format
curl "http://localhost:3000/customers?format=text"

# HTML format (web page)
curl "http://localhost:3000/customers?format=html"
```

#### Get Customer by ID
```bash
# Get customer with ID 1
curl http://localhost:3000/customers/1

# Get customer details in text format
curl "http://localhost:3000/customers/1?format=text"

# Get customer details as HTML page
curl "http://localhost:3000/customers/1?format=html"
```

#### Search Customers
```bash
# Search by first name
curl "http://localhost:3000/customers/search/john"

# Search by last name
curl "http://localhost:3000/customers/search/smith"

# Search by email domain
curl "http://localhost:3000/customers/search/email.com"

# Search results in HTML format
curl "http://localhost:3000/customers/search/john?format=html"
```

#### Filter Customers by Status
```bash
# Get active customers only
curl "http://localhost:3000/customers/active"
curl "http://localhost:3000/customers/active?format=text"
curl "http://localhost:3000/customers/active?format=html"

# Get inactive customers only
curl "http://localhost:3000/customers/inactive"
curl "http://localhost:3000/customers/inactive?format=text"
curl "http://localhost:3000/customers/inactive?format=html"
```

## 📋 Response Formats

### JSON Format (Default)
Returns structured JSON data suitable for API integration:
```json
{
  "customers": [...],
  "total": 5,
  "timestamp": "2025-09-24T21:22:32.774Z"
}
```

### Text Format (`?format=text`)
Returns clean, readable plain text:
```
Total Customers: 5

1. John Smith (john.smith@email.com) - active
2. Sarah Johnson (sarah.johnson@email.com) - active
3. Michael Brown (michael.brown@email.com) - inactive
...
```

### HTML Format (`?format=html`)
Returns styled web pages with:
- Tables with proper formatting
- Color-coded status indicators (green for active, red for inactive)
- Navigation links between pages
- Professional styling

## 🧪 Testing Examples

### Basic API Testing
```bash
# Test API health
curl http://localhost:3000/health

# Get API overview
curl http://localhost:3000/

# List all customers
curl http://localhost:3000/customers
```

### Customer Lookup Testing
```bash
# Get specific customer
curl http://localhost:3000/customers/2

# Search for customers
curl "http://localhost:3000/customers/search/sarah"

# Filter by status
curl "http://localhost:3000/customers/active"
```

### Format Testing
```bash
# Test different response formats
curl "http://localhost:3000/customers?format=text"
curl "http://localhost:3000/customers?format=html"
curl "http://localhost:3000/customers/1?format=html"
```

## 🔒 Security Features

This application demonstrates several security best practices:

### Container Security
- **Non-root user**: Runs as `nodejs` user (UID 1001)
- **Minimal base image**: Uses `node:18-alpine3.17`
- **No unnecessary packages**: Only production dependencies
- **Read-only filesystem**: Container filesystem is read-only

### Application Security
- **Input validation**: Proper parameter validation
- **Error handling**: Graceful error responses
- **No sensitive data**: Sample data only, no real PII
- **Health checks**: Built-in health monitoring

### Kubernetes Security
- **Security contexts**: Proper user and group settings
- **Resource limits**: CPU and memory constraints
- **Health probes**: Liveness and readiness checks
- **Service accounts**: Dedicated service account

## 🛠️ Development

### Project Structure
```
app/
├── server.js          # Main application file
├── package.json       # Node.js dependencies
├── Dockerfile         # Container definition
├── Dockerfile.vulnerable  # Intentionally vulnerable version
└── README.md          # This file
```

### Dependencies
- **express**: Web framework
- **node:18-alpine3.17**: Base container image

### Scripts
```bash
# Start the application
npm start

# Run tests (placeholder)
npm test
```

## 🚀 Deployment

### Docker Deployment
```bash
# Build and run locally
docker build -t secure-app:latest .
docker run -p 3000:3000 secure-app:latest

# Push to registry
docker tag secure-app:latest your-registry/secure-app:latest
docker push your-registry/secure-app:latest
```

### Kubernetes Deployment
```bash
# Deploy to Kubernetes
kubectl apply -f ../k8s/deployment.yaml

# Check deployment status
kubectl get pods -n secure-app

# Port forward for testing
kubectl port-forward -n secure-app deployment/secure-app 3000:3000
```

## 🔍 Security Scanning

This application is designed to work with various security scanning tools:

- **Trivy**: Container vulnerability scanning
- **Kubesec**: Kubernetes security analysis
- **Conftest**: Policy validation with OPA
- **Semgrep**: Static application security testing
- **TruffleHog**: Secret scanning

## 📚 Learning Objectives

This application helps you learn:

1. **Container Security**: Building secure Docker images
2. **API Development**: RESTful API design and implementation
3. **Security Scanning**: Using various security tools
4. **Kubernetes Security**: Secure pod and deployment configurations
5. **DevSecOps**: Integrating security into CI/CD pipelines

## 🤝 Contributing

This is a learning application. Feel free to:
- Add more sample customers
- Implement additional API endpoints
- Enhance security features
- Improve documentation

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

**Container won't start:**
```bash
# Check Docker is running
docker ps

# Check container logs
docker logs secure-app-container
```

**API not responding:**
```bash
# Check if container is running
docker ps

# Test health endpoint
curl http://localhost:3000/health
```

**Port conflicts:**
```bash
# Use different port
docker run -p 8080:3000 secure-app:latest
# Then test: curl http://localhost:8080/
```

---

**Version**: 3.0.0  
**Last Updated**: September 2025  
**Maintainer**: SecureApp Team