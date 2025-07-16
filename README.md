# Transcende_me_if_you_can
(og) https://github.com/Canybardeloton/Transcende_me_if_you_can

Ft_transcendence : 155

General : 25
- Docker
- Typescript
- Mozilla

Web : 20
- Major module: Use a framework to build the backend. // All
- Minor module: Use a framework or a toolkit to build the frontend. // All
- Minor module: Use a database for the backend. // Jojo

User Management : 20
- Major module: Standard user management, authentication, users across tournaments. // Armel
- Major module: Implementing a remote authentication. // Armel - Arthur

Gameplay and user experience : 30
- Major module: Remote players // Diego
- Major module: Multiplayer (more than 2 players in the same game). // Diego
- Major module: Live Chat // Jojo

AI-Algo : 15
- Major module: Introduce an AI opponent. // Diego
- Minor module: User and game stats dashboards // Diego

Cybersecurity : 20
- Major module: Implement WAF/ModSecurity with a hardened configuration and HashiCorp Vault for secrets management. // Yichun
- Major module: Implement Two-Factor Authentication (2FA) and JWT. // Yichun - Arthur

Devops : 15
- Major module: Infrastructure setup for log management. // Arthur
- Minor module: Monitoring system. // Arthur

Accessibility : 10
- Minor module: Supports multiple languages.
- Minor module: Server-Side Rendering (SSR) integration. // Jojo

*****************************

FROM ARTHUR

To run the docker:

- Download "Dev Container" from Microsoft on Vs Code
- Make sure your port 3000 is free
- Inside VsCode, ctrl shift P to open menu & type Dev Container, (rebuild) reopen in container.

- Now you inside the container, BE CAREFUL WITH THIS, every you will do inside your container
	is also done in your repo on your computer, its a bind mount so make sure what you do.
	For exemple load 2 VsCode, connect one with the container & open another one in VsCode via
	your folder, everything you type in VsCode will appear in the other one.

- To run server: npm run dev

- Run the script if you want to reset docker images & containers, be aware, this script will remove
	all the Docker environment.


*****************************

FROM CHUN NOTES

### CheckList

### 🔐 Cybersecurity
☐ Install ModSecurity + OWASP CRS <br/>
☐ Test SQLi/XSS payloads<br/>
☐ Setup Vault server (KV)<br/>
☐ Store API keys in Vault<br/>
☐ JWT token creation + middleware<br/>
☐ 2FA (Google Authenticator)<br/>
☐ Secure .env + HTTPS setup<br/>

### 🛠 DevOps Monitoring
☐ Install Prometheus<br/>
☐ Add Node Exporter<br/>
☐ Add custom metrics (backend)<br/>
☐ Install Grafana + create dashboards<br/>
☐ Setup alerting rules<br/>

### 🧱 Microservices Design
☐ Split Auth/User/Game as services<br/>
☐ Dockerize each service<br/>
☐ Use JWT for inter-service API<br/>
☐ Use docker-compose to orchestrate<br/>
☐ Write README & API docs<br/>

### ✅ Final Integration
☐ Vault + JWT integration test<br/>
☐ WAF + login route test<br/>
☐ Prometheus + dashboard validation<br/>
☐ End-to-end flow test<br/>

---
- Super Brief for TypeScript : 
https://hackmd.io/@QBrv51OvRPqs9dJjL2YIig/HyjiAvH8lg

