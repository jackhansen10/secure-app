# SecureApp DevSecOps Project

A hands-on learning project for container security, Kubernetes hardening, and DevSecOps practices using free tools and GitHub Actions.

## 🎯 What You'll Learn

- **Container Security**: Dockerfile best practices, vulnerability scanning, image hardening
- **Kubernetes Security**: RBAC, Network Policies, Pod Security Standards, admission controllers
- **DevSecOps Pipeline**: Shift-left security, automated scanning, policy as code
- **Security Tools**: Trivy, Semgrep, Kubesec, OPA, TruffleHog

## 🚀 Features

- ✅ Automated security scanning on every PR
- ✅ Container vulnerability detection
- ✅ Secret leak prevention
- ✅ Kubernetes manifest security validation
- ✅ Policy as code enforcement
- ✅ Secure and vulnerable examples for comparison
- ✅ Complete CI/CD pipeline with security gates

## 🛠 Tech Stack

**Application:**
- Node.js/Express (simple web app)
- Docker (containerization)

**Security Tools (All Free):**
- [Trivy](https://trivy.dev/) - Vulnerability scanner
- [Semgrep](https://semgrep.dev/) - Static analysis
- [TruffleHog](https://trufflesecurity.com/trufflehog) - Secret detection
- [Hadolint](https://github.com/hadolint/hadolint) - Dockerfile linter
- [Kubesec](https://kubesec.io/) - K8s security scanner
- [OPA Conftest](https://www.conftest.dev/) - Policy testing

**Platform:**
- GitHub Actions (CI/CD)
- Docker Hub (container registry)
- Kubernetes (local: kind/minikube)

## 📁 Project Structure

```
secure-app/
├── README.md
├── .gitignore
├── app/
│   ├── package.json
│   ├── server.js
│   ├── Dockerfile
│   └── Dockerfile.vulnerable
├── k8s/
│   ├── namespace.yaml
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── networkpolicy.yaml
│   └── rbac.yaml
├── policies/
│   ├── security-policy.rego
│   └── dockerfile-policy.rego
├── .github/
│   └── workflows/
│       ├── security-scan.yml
│       ├── container-scan.yml
│       └── k8s-deploy.yml
└── security/
    ├── trivy.yaml
    ├── semgrep.yml
    └── kubesec-scan.sh
```

## 🚀 Quick Start

### Prerequisites
- Git
- Docker Desktop
- GitHub account
- Docker Hub account (free)
- [kind](https://kind.sigs.k8s.io/docs/user/quick-start/) or [minikube](https://minikube.sigs.k8s.io/docs/start/) for local Kubernetes

### 1. Repository Setup

```bash
# Fork or create new repository on GitHub
git clone https://github.com/YOUR_USERNAME/secure-app.git
cd secure-app

# Create directory structure
mkdir -p app k8s policies .github/workflows security

# Copy all the files from this README into their respective directories
```

### 2. GitHub Configuration

**Set up repository secrets:**
1. Go to your repo → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add these secrets:
   - `DOCKERHUB_USERNAME`: Your Docker Hub username
   - `DOCKERHUB_TOKEN`: Create in Docker Hub → Account Settings → Security

**Enable GitHub Actions:**
- GitHub Actions will run automatically on push/PR once you commit the workflow files

### 3. Local Development Setup

```bash
# Build and test locally
cd app
docker build -t secure-app:local -f Dockerfile .
docker run -p 3000:3000 secure-app:local

# Test the app
curl http://localhost:3000
curl http://localhost:3000/health
```

### 4. Deploy to Local Kubernetes

```bash
# Start kind cluster
kind create cluster --name secure-app

# Apply Kubernetes manifests
kubectl apply -f k8s/

# Port forward to access app
kubectl port-forward -n secure-app service/secure-app-service 8080:80

# Test
curl http://localhost:8080
```

### 2. Create Sample Application

**app/package.json:**
```json
{
  "name": "secure-app",
  "version": "1.0.0",
  "description": "Sample app for DevSecOps learning",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "test": "echo \"No tests yet\" && exit 0"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

**app/server.js:**
```javascript
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({ 
    message: 'Hello from SecureApp!', 
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
```

### 3. Docker Configuration

**app/Dockerfile (Secure Version):**
```dockerfile
# Use specific version and non-root base image
FROM node:18-alpine3.17

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Copy application code
COPY --chown=nodejs:nodejs server.js ./

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start application
CMD ["node", "server.js"]
```

**app/Dockerfile.vulnerable (For Learning):**
```dockerfile
# Intentionally vulnerable for learning purposes
FROM node:16  # Outdated version

# Run as root (bad practice)
WORKDIR /app

# Copy everything (including secrets)
COPY . .

# Install all dependencies including dev
RUN npm install

# Expose unnecessary ports
EXPOSE 3000 22 5432

# Hardcoded secrets (bad practice)
ENV DATABASE_PASSWORD=supersecret123
ENV API_KEY=sk-1234567890abcdef

# Run as root
CMD ["node", "server.js"]
```

### 4. Kubernetes Manifests

**k8s/namespace.yaml:**
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: secure-app
  labels:
    name: secure-app
    security.policy/enforce: "true"
```

**k8s/deployment.yaml:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: secure-app
  namespace: secure-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: secure-app
  template:
    metadata:
      labels:
        app: secure-app
    spec:
      serviceAccountName: secure-app-sa
      securityContext:
        runAsNonRoot: true
        runAsUser: 1001
        fsGroup: 1001
      containers:
      - name: secure-app
        image: YOUR_DOCKERHUB_USERNAME/secure-app:latest
        ports:
        - containerPort: 3000
        securityContext:
          allowPrivilegeEscalation: false
          capabilities:
            drop:
            - ALL
          readOnlyRootFilesystem: true
          runAsNonRoot: true
          runAsUser: 1001
        resources:
          limits:
            cpu: 500m
            memory: 512Mi
          requests:
            cpu: 100m
            memory: 128Mi
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

### 5. GitHub Actions Workflows

**.github/workflows/security-scan.yml:**
```yaml
name: Security Scan

on:
  pull_request:
    branches: [ main ]
  push:
    branches: [ main ]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
      with:
        fetch-depth: 0
    
    - name: Run Semgrep
      uses: semgrep/semgrep-action@v1
      with:
        config: >-
          p/security-audit
          p/secrets
          p/dockerfile
        
    - name: Run TruffleHog OSS
      uses: trufflesecurity/trufflehog@main
      with:
        path: ./
        base: main
        head: HEAD
        extra_args: --debug --only-verified
        
    - name: Run Trivy filesystem scan
      uses: aquasecurity/trivy-action@master
      with:
        scan-type: 'fs'
        scan-ref: '.'
        format: 'sarif'
        output: 'trivy-results.sarif'
        
    - name: Upload Trivy scan results to GitHub Security tab
      uses: github/codeql-action/upload-sarif@v2
      if: always()
      with:
        sarif_file: 'trivy-results.sarif'
```

**.github/workflows/container-scan.yml:**
```yaml
name: Container Security Scan

on:
  push:
    branches: [ main ]
    paths: 
      - 'app/**'
      - 'Dockerfile*'

jobs:
  container-security:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Build Docker image
      run: |
        cd app
        docker build -t secure-app:${{ github.sha }} -f Dockerfile .
        
    - name: Run Trivy vulnerability scanner
      uses: aquasecurity/trivy-action@master
      with:
        image-ref: 'secure-app:${{ github.sha }}'
        format: 'table'
        exit-code: '1'
        ignore-unfixed: true
        severity: 'CRITICAL,HIGH'
        
    - name: Run Hadolint Dockerfile linter
      uses: hadolint/hadolint-action@v3.1.0
      with:
        dockerfile: app/Dockerfile
        
    - name: Build and push to Docker Hub (on success)
      if: success()
      uses: docker/build-push-action@v4
      with:
        context: ./app
        push: true
        tags: ${{ secrets.DOCKERHUB_USERNAME }}/secure-app:latest
```

### 6. Security Policies

**policies/security-policy.rego:**
```rego
package kubernetes.admission

deny[msg] {
  input.request.kind.kind == "Pod"
  input.request.object.spec.securityContext.runAsRoot == true
  msg := "Containers must not run as root"
}

deny[msg] {
  input.request.kind.kind == "Pod"
  container := input.request.object.spec.containers[_]
  not container.securityContext.readOnlyRootFilesystem
  msg := "Containers must use read-only root filesystem"
}
```

## 🔒 Security Features Demonstrated

### Container Security
- **Secure Base Images**: Uses specific, minimal Alpine images
- **Non-root User**: Containers run as unprivileged user
- **Read-only Filesystem**: Prevents runtime modifications
- **Resource Limits**: CPU and memory constraints
- **Health Checks**: Application health monitoring
- **Vulnerability Scanning**: Automated with Trivy

### Kubernetes Security
- **RBAC**: Role-based access control with minimal permissions
- **Network Policies**: Restricts pod-to-pod communication
- **Pod Security**: Security contexts and standards
- **Secret Management**: Proper handling of sensitive data
- **Admission Controllers**: Policy enforcement at deployment

### DevSecOps Pipeline
- **Shift-Left Security**: Security checks in development phase
- **Automated Scanning**: Every PR triggers security scans
- **Policy as Code**: Infrastructure and security policies in Git
- **Security Gates**: Fail builds on security violations
- **Compliance Reporting**: Security scan results in GitHub

## 🧪 Learning Exercises

### Beginner (Week 1-2)
- [ ] Compare `Dockerfile` vs `Dockerfile.vulnerable`
- [ ] Run Trivy scan locally: `trivy image secure-app:local`
- [ ] Trigger GitHub Actions and review security reports
- [ ] Fix a vulnerability found by Trivy
- [ ] Add a secret to code and see TruffleHog catch it

### Intermediate (Week 3-4)
- [ ] Deploy to local Kubernetes cluster
- [ ] Test network policies with `kubectl exec`
- [ ] Create custom OPA policies in `policies/`
- [ ] Add resource quotas and limit ranges
- [ ] Implement Pod Security Standards

### Advanced (Week 5-6)
- [ ] Add Falco for runtime security monitoring
- [ ] Implement GitOps with ArgoCD
- [ ] Create custom admission controller
- [ ] Add compliance scanning (CIS benchmarks)
- [ ] Set up security dashboards with Grafana

## 📊 Security Dashboards

The project includes automated security reporting:

- **GitHub Security Tab**: Vulnerability alerts and code scanning results
- **Actions Summary**: Build and security scan status
- **Pull Request Checks**: Automated security reviews
- **Container Registry**: Vulnerability reports for images

## 🔧 Local Security Testing

```bash
# Run security scans locally
./security/kubesec-scan.sh
trivy config k8s/
semgrep --config=auto app/
hadolint app/Dockerfile

# Test policies with Conftest
conftest test k8s/deployment.yaml --policy policies/
```

## Setup Instructions

1. **Create GitHub Repository:**
   - Create new repo called `secure-app`
   - Clone locally and create the directory structure above

2. **Configure GitHub Secrets:**
   - Go to Settings > Secrets and Variables > Actions
   - Add: `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN`

3. **Set up Docker Hub:**
   - Create free Docker Hub account
   - Create access token for GitHub Actions

4. **Local Development:**
   - Install Docker and kind/minikube
   - Use Cursor with recommended extensions:
     - Docker
     - Kubernetes
     - YAML
     - GitLens

## 📚 Learning Resources

### Documentation
- [Trivy Documentation](https://trivy.dev/)
- [Semgrep Rules Explorer](https://semgrep.dev/explore)
- [Kubernetes Security Best Practices](https://kubernetes.io/docs/concepts/security/)
- [OWASP Container Security Guide](https://owasp.org/www-project-container-security/)
- [CIS Kubernetes Benchmark](https://www.cisecurity.org/benchmark/kubernetes)

### Security Standards
- [NIST Container Security Guide](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-190.pdf)
- [Pod Security Standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/)
- [Docker Security Best Practices](https://docs.docker.com/develop/security-best-practices/)

### Tools Documentation
- [OPA Policy Language](https://www.openpolicyagent.org/docs/latest/policy-language/)
- [Falco Rules](https://falco.org/docs/rules/)
- [GitHub Actions Security](https://docs.github.com/en/actions/security-guides)

## 🤝 Contributing

This is a learning project - feel free to:
- Add more security scenarios
- Improve the policies
- Add new tools integration
- Share your learning experiences
- Report issues or suggest improvements

## 🆘 Troubleshooting

**GitHub Actions failing?**
- Check you've added the required secrets
- Verify Docker Hub token has push permissions
- Review the Actions logs for specific errors

**Kubernetes deployment issues?**
- Ensure your cluster is running: `kubectl cluster-info`
- Check pod status: `kubectl get pods -n secure-app`
- View logs: `kubectl logs -n secure-app deployment/secure-app`

**Security scans finding issues?**
- This is expected! Use them as learning opportunities
- Compare secure vs vulnerable examples
- Check the tool documentation for remediation guidance

## 📄 License

MIT License - feel free to use this for learning and teaching!

---

**🎯 Goal**: By the end of this project, you'll understand how to build secure containerized applications with automated security testing and Kubernetes hardening. Perfect for your DevSecOps portfolio!