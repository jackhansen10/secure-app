# 🔒 Secure App - Security Learning Repository

A comprehensive security-focused application repository designed for learning, exploration, and demonstrating security best practices in modern application development.

## 🎯 Purpose

This repository serves as a **hands-on learning platform** for understanding:
- **Container Security** - Secure vs vulnerable Docker configurations
- **Kubernetes Security** - Production-ready K8s manifests with security policies
- **CI/CD Security** - Automated security scanning in GitHub Actions
- **Policy-as-Code** - OPA/Conftest security policy enforcement
- **Security Scanning** - Multiple security tools integration

## 🚀 Quick Start

### Prerequisites
- Docker
- Kubernetes cluster (minikube, kind, or cloud)
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/jackhansen10/secure-app.git
   cd secure-app
   ```

2. **Build and run the secure application**
   ```bash
   cd app
   docker build -f Dockerfile -t secure-app:latest .
   docker run -p 3000:3000 secure-app:latest
   ```

3. **Test the vulnerable version (for learning)**
   ```bash
   docker build -f Dockerfile.vulnerable -t vulnerable-app:latest .
   docker run -p 3000:3000 vulnerable-app:latest
   ```

4. **Access the application**
   - Visit: http://localhost:3000
   - Health check: http://localhost:3000/health

## 📚 Learning Path

### Phase 1: Understanding Security Issues
1. **Compare Dockerfiles**
   - `app/Dockerfile` - Secure implementation
   - `app/Dockerfile.vulnerable` - Intentionally vulnerable for learning

2. **Key Security Concepts to Learn:**
   - **Base Image Security** - Using specific, non-root base images
   - **User Context** - Running as non-root user
   - **Resource Limits** - Preventing resource exhaustion
   - **Capability Management** - Dropping unnecessary capabilities
   - **Read-only Filesystem** - Immutable container filesystem
   - **Secret Management** - Avoiding hardcoded secrets

### Phase 2: Kubernetes Security
1. **Explore K8s Manifests** (`k8s/` directory)
   - `deployment.yaml` - Production-ready deployment
   - `namespace.yaml` - Isolated namespace

2. **Security Features Demonstrated:**
   - Non-root user execution
   - Resource limits and requests
   - Security contexts
   - Health probes
   - Service account usage

### Phase 3: Policy-as-Code
1. **OPA Policies** (`policies/security-policy.rego`)
   - 12 comprehensive security rules
   - Automated policy validation
   - Policy-as-Code principles

2. **Test Policies Locally:**
   ```bash
   # Install Conftest
   curl -sSfL https://github.com/open-policy-agent/conftest/releases/download/v0.50.0/conftest_0.50.0_Darwin_x86_64.tar.gz | tar -xz
   
   # Test policies
   ./conftest test k8s/ --policy policies/ --output table
   ```

### Phase 4: CI/CD Security Integration
1. **GitHub Actions Workflows:**
   - `security-scan.yml` - Comprehensive security scanning
   - `container-scan.yml` - Container vulnerability scanning
   - `k8s-security.yml` - Kubernetes security validation

2. **Security Tools Integrated:**
   - **Semgrep** - Static analysis
   - **Trivy** - Vulnerability scanning
   - **TruffleHog** - Secret detection
   - **Kubesec** - Kubernetes security scoring
   - **Conftest** - Policy validation
   - **Hadolint** - Dockerfile linting

## 🔍 Security Scanning Tools

### Container Security
```bash
# Install Trivy
curl -sSfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh

# Scan container images
trivy image secure-app:latest
trivy image vulnerable-app:latest

# Compare results to see security differences
```

### Kubernetes Security
```bash
# Install Kubesec
curl -sSfL https://github.com/controlplaneio/kubesec/releases/download/v2.11.5/kubesec_darwin_amd64.tar.gz | tar -xz

# Scan K8s manifests
./kubesec scan k8s/deployment.yaml
```

### Static Analysis
```bash
# Install Semgrep
pip install semgrep

# Run security rules
semgrep --config=p/security-audit .
semgrep --config=p/dockerfile .
```

## 🛠️ Hands-On Exercises

### Exercise 1: Fix Vulnerable Dockerfile
1. Copy `Dockerfile.vulnerable` to `Dockerfile.exercise`
2. Fix the security issues:
   - Update base image
   - Add non-root user
   - Set resource limits
   - Drop capabilities
   - Remove hardcoded secrets

### Exercise 2: Create Security Policy
1. Add a new policy to `policies/security-policy.rego`
2. Test it against your K8s manifests
3. See it enforced in CI/CD

### Exercise 3: Add Security Scanning
1. Create a new GitHub Action workflow
2. Integrate additional security tools
3. Configure failure conditions

## 📊 Security Metrics

### Current Security Score
- **Kubesec Score**: 11/15 points
- **Conftest Policies**: 12/12 passing
- **Vulnerability Scan**: Clean (secure image)
- **Secret Scan**: Clean

### Areas for Improvement
- Add AppArmor policies (+3 Kubesec points)
- Add Seccomp profiles (+1 Kubesec point)
- Use UID > 10000 (+1 Kubesec point)

## 🔧 Troubleshooting

### Common Issues

**Docker build fails:**
```bash
# Check Dockerfile syntax
docker build --no-cache -f Dockerfile .
```

**Conftest policy errors:**
```bash
# Validate Rego syntax
conftest test k8s/ --policy policies/ --output json
```

**Kubernetes deployment issues:**
```bash
# Check K8s manifest syntax
kubectl apply --dry-run=client -f k8s/deployment.yaml
```

## 🤝 Contributing

This repository is designed for learning and exploration. Feel free to:
- Add new security policies
- Create additional vulnerable examples
- Enhance security scanning workflows
- Improve documentation

## 📖 Additional Resources

- [Docker Security Best Practices](https://docs.docker.com/develop/security-best-practices/)
- [Kubernetes Security Best Practices](https://kubernetes.io/docs/concepts/security/)
- [OPA Policy Language](https://www.openpolicyagent.org/docs/latest/policy-language/)
- [Trivy Documentation](https://aquasecurity.github.io/trivy/)
- [Semgrep Rules](https://semgrep.dev/rules)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Happy Learning! 🎓** This repository is your playground for understanding modern application security. Start with the vulnerable examples, understand the issues, then explore the secure implementations.