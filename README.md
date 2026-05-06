# 🚀 Employee Management System - Fullstack Kubernetes Orchestration

Este projeto é um laboratório completo de **Engenharia de Confiabilidade de Sites (SRE)** e **DevOps**, onde desenvolvi uma aplicação fullstack funcional orquestrada inteiramente em um cluster Kubernetes.

O foco principal não foi apenas o desenvolvimento de software, mas a criação de uma infraestrutura resiliente, segura, automatizada e escalável.

## 🏗️ Arquitetura do Sistema

A aplicação segue o padrão de microserviços desacoplados:

- **Frontend:** Desenvolvido em **Angular 21** (Standalone), empacotado com Nginx Alpine.
- **Backend:** API REST em **Node.js 24** com lógica de reconexão resiliente (Retry Strategy) e encerramento gracioso (*Graceful Shutdown*).
- **Banco de Dados:** **PostgreSQL 15** utilizando **StatefulSets** para garantir a integridade e persistência dos dados.

## 🛠️ Tecnologias e Conceitos de Infraestrutura

### 1. Orquestração e Containers
- **Kubernetes (Kind):** Gerenciamento de Pods, Deployments, Services (ClusterIP e Headless) e Ingress.
- **Docker Multi-stage Builds:** Otimização de imagens, reduzindo o tamanho das imagens finais em mais de 90%.
- **Security Context (Non-Root):** Todos os containers rodam com usuários sem privilégios administrativos para mitigar riscos de segurança.

### 2. Rede e Acesso
- **Ingress Controller (Nginx):** Roteamento de múltiplos domínios locais (`funcionarios.local` e `api.funcionarios.local`).
- **Cloudflare Tunnel (Zero Trust):** Exposição segura do cluster para a internet sem a necessidade de abertura de portas em roteadores domésticos.

### 3. Persistência e Segurança de Dados
- **Persistent Volume Claims (PVC):** Garantia de que os dados do Postgres sobrevivam a reinícios ou falhas de Pods.
- **Sealed Secrets (Bitnami):** Criptografia de credenciais sensíveis. Os segredos são "lacrados" e podem ser armazenados com segurança no repositório Git, sendo descriptografados apenas pelo controlador dentro do cluster.

### 4. Automação CI/CD
- **GitHub Actions:** Pipeline automatizada para Build e Push das imagens para o Docker Hub.
- **Self-hosted Runner:** Configurei um servidor **Debian 13** como agente do GitHub para realizar o deploy automático no cluster local assim que um `git push` é detectado na branch main.

## 🚀 Como o projeto funciona (Pipeline)

1. O desenvolvedor realiza uma alteração no código e executa um `git push`.
2. O **GitHub Actions** inicia o build das imagens Docker na nuvem.
3. As imagens são enviadas para o **Docker Hub**.
4. O **Runner local (Debian 13)** recebe o sinal de deploy.
5. O comando `kubectl rollout restart` é executado, e o Kubernetes atualiza os serviços com **Zero Downtime**.

## 📸 Demonstração

<img width="779" height="529" alt="image" src="https://github.com/user-attachments/assets/a2e1fe54-7e32-4813-b838-e12e2824fe71" />


---
Projetado e implementado com foco em boas práticas de Cloud Native e SRE. ☸️🐳
