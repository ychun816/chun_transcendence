# transcendence

Ft_transcendence : 155

General : 25

    Docker
    Typescript
    Mozilla

#### Web : 20

- Major module: Use a framework to build the backend. // All
- Minor module: Use a framework or a toolkit to build the frontend. // All
- Minor module: Use a database for the backend. // Jojo

#### User Management : 20

- Major module: Standard user management, authentication, users across tournaments. // Armel
- Major module: Implementing a remote authentication. // Armel - Arthur

#### Gameplay and user experience : 30

- Major module: Remote players // Diego
- Major module: Multiplayer (more than 2 players in the same game). // Diego
- Major module: Live Chat // Jojo

#### AI-Algo : 15

- Major module: Introduce an AI opponent. // Diego
- Minor module: User and game stats dashboards // Diego

#### Cybersecurity : 20

- Major module: Implement WAF/ModSecurity with a hardened configuration and HashiCorp Vault for secrets management. // Yichun
- Major module: Implement Two-Factor Authentication (2FA) and JWT. // Yichun - Arthur

#### Devops : 15

- Major module: Infrastructure setup for log management. // Arthur
- Minor module: Monitoring system. // Arthur

#### Accessibility : 10

- Minor module: Supports multiple languages.
- Minor module: Server-Side Rendering (SSR) integration. // Jojo

### CheckList

### 🔐 Cybersecurity
☐ Install ModSecurity + OWASP CRS
☐ Test SQLi/XSS payloads
☐ Setup Vault server (KV)
☐ Store API keys in Vault
☐ JWT token creation + middleware
☐ 2FA (Google Authenticator)
☐ Secure .env + HTTPS setup

### 🛠 DevOps Monitoring
☐ Install Prometheus
☐ Add Node Exporter
☐ Add custom metrics (backend)
☐ Install Grafana + create dashboards
☐ Setup alerting rules

### 🧱 Microservices Design
☐ Split Auth/User/Game as services
☐ Dockerize each service
☐ Use JWT for inter-service API
☐ Use docker-compose to orchestrate
☐ Write README & API docs

### ✅ Final Integration
☐ Vault + JWT integration test
☐ WAF + login route test
☐ Prometheus + dashboard validation
☐ End-to-end flow test


###  Schedule 

| Task                                | Week 1 | Week 2 | Week 3 | Week 4            |
| ----------------------------------- | ------ | ------ | ------ | ----------------- |
| Docker & docker-compose setup       | ██████ |        |        |                   |
| Backend/frontend scaffold           | ██████ |        |        |                   |
| SQLite setup                        | ██████ |        |        |                   |
| Pong game engine                    | ██████ |        |        |                   |
| HTTPS + JWT login + `.env` security | ██████ |        |        |                   |
| JWT + session-protected routes      |        | ██████ |        |                   |
| 2FA implementation                  |        | ██████ |        |                   |
| ModSecurity + OWASP CRS             |        | ██████ |        |                   |
| Vault deployment + secret migration |        | ██████ |        |                   |
| ELK stack deployment                |        |        | ██████ |                   |
| Kibana dashboards                   |        |        | ██████ |                   |
| Prometheus + exporters deployment   |        |        | ██████ |                   |
| Grafana dashboards creation         |        |        | ██████ |                   |
| Microservices refactor              |        |        |        | ██████            |
| Internal communication setup        |        |        |        | ██████            |
| Secure service-to-service API       |        |        |        | ██████            |
| Final integration testing           |        |        |        | ██████            |
| Documentation & evaluation prep     |        |        |        | ██████            |
| Bonus tasks (GDPR, dashboards)      |        |        |        | (if time permits) |

