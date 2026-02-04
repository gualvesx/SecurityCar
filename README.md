# 🚗 SecurityCar

O **SecurityCar** é uma API REST desenvolvida em **Java** utilizando o framework **Spring Boot**. O sistema foi projetado para gerenciar operações relacionadas a veículos, oferecendo um backend robusto para controle de inventário ou sistemas de monitoramento automotivo.

## 🛠️ Tecnologias

* **Linguagem:** Java 17
* **Framework:** Spring Boot 3+
* **Gerenciador de Dependências:** Maven
* **Banco de Dados:** H2 Database (Console) / MySQL
* **Persistência:** Spring Data JPA (Hibernate)
* **Ferramentas:** Lombok, Spring Web

## 🏗️ Estrutura do Projeto

A aplicação segue o padrão de camadas do Spring:
- `Controller`: Exposição dos endpoints REST.
- `Service`: Camada de regras de negócio e lógica da aplicação.
- `Repository`: Interface de comunicação com o banco de dados via JPA.
- `Entity`: Mapeamento das tabelas do banco de dados.
- `DTO (Data Transfer Object)`: Objetos para tráfego de dados seguro entre camadas.

## ✨ Funcionalidades

- [x] **CRUD de Veículos:** Cadastro, leitura, atualização e exclusão de automóveis.
- [x] **Persistência de Dados:** Armazenamento relacional de informações veiculares.
- [x] **Validação:** Garantia de integridade dos dados enviados via API.
- [x] **Tratamento de Exceções:** Respostas HTTP amigáveis para erros de negócio.

## 🚀 Como Executar

### Pré-requisitos
* JDK 17 ou superior instalado.
* Maven instalado (opcional, pode usar o `./mvnw`).

### Passo a Passo

1. **Clonar o repositório:**
   ```bash
   git clone [https://github.com/gualvesx/SecurityCar.git](https://github.com/gualvesx/SecurityCar.git)
   cd SecurityCar
   

   
