package kubernetes.admission

# Deny containers running as root
deny[msg] {
  input.request.kind.kind == "Pod"
  input.request.object.spec.securityContext.runAsRoot == true
  msg := "Containers must not run as root"
}

# Deny containers without read-only root filesystem
deny[msg] {
  input.request.kind.kind == "Pod"
  container := input.request.object.spec.containers[_]
  not container.securityContext.readOnlyRootFilesystem
  msg := "Containers must use read-only root filesystem"
}

# Deny containers without resource limits
deny[msg] {
  input.request.kind.kind == "Pod"
  container := input.request.object.spec.containers[_]
  not container.resources.limits
  msg := "Containers must have resource limits defined"
}

# Deny containers without resource requests
deny[msg] {
  input.request.kind.kind == "Pod"
  container := input.request.object.spec.containers[_]
  not container.resources.requests
  msg := "Containers must have resource requests defined"
}

# Deny containers with privileged access
deny[msg] {
  input.request.kind.kind == "Pod"
  container := input.request.object.spec.containers[_]
  container.securityContext.privileged == true
  msg := "Containers must not run in privileged mode"
}

# Deny containers that allow privilege escalation
deny[msg] {
  input.request.kind.kind == "Pod"
  container := input.request.object.spec.containers[_]
  container.securityContext.allowPrivilegeEscalation == true
  msg := "Containers must not allow privilege escalation"
}

# Deny containers without security context
deny[msg] {
  input.request.kind.kind == "Pod"
  container := input.request.object.spec.containers[_]
  not container.securityContext
  msg := "Containers must have security context defined"
}

# Deny containers without capability drops
deny[msg] {
  input.request.kind.kind == "Pod"
  container := input.request.object.spec.containers[_]
  not container.securityContext.capabilities.drop
  msg := "Containers must drop capabilities"
}

# Deny containers without ALL capability drop
deny[msg] {
  input.request.kind.kind == "Pod"
  container := input.request.object.spec.containers[_]
  container.securityContext.capabilities.drop
  not contains(container.securityContext.capabilities.drop, "ALL")
  msg := "Containers must drop ALL capabilities"
}

# Deny deployments without service account
deny[msg] {
  input.request.kind.kind == "Deployment"
  not input.request.object.spec.template.spec.serviceAccountName
  msg := "Deployments must specify a service account"
}

# Deny containers without liveness probe
deny[msg] {
  input.request.kind.kind == "Deployment"
  container := input.request.object.spec.template.spec.containers[_]
  not container.livenessProbe
  msg := "Containers must have liveness probe defined"
}

# Deny containers without readiness probe
deny[msg] {
  input.request.kind.kind == "Deployment"
  container := input.request.object.spec.template.spec.containers[_]
  not container.readinessProbe
  msg := "Containers must have readiness probe defined"
}