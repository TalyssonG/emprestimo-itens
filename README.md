# Sistema de Empréstimos com Node.js, Express e MongoDB

Este projeto é um sistema de gerenciamento de **empréstimos de itens**, desenvolvido utilizando **Node.js**, **Express** e **MongoDB**. A aplicação oferece APIs para gerenciar **usuários**, **itens** e controlar os **empréstimos** e **devoluções** de maneira eficiente.

## Visão Geral

A aplicação foi projetada para fornecer uma solução simples e escalável para gerenciar itens e seus respectivos empréstimos. As principais funcionalidades incluem a criação, visualização, atualização e exclusão de **usuários** e **itens**, além de permitir que itens sejam emprestados a usuários, rastreando o status de cada item (emprestado ou disponível).

### O que este projeto oferece:

- Gerenciamento completo de **usuários** com CRUD.
- Gerenciamento de **itens** com CRUD e funcionalidades de empréstimos e devoluções.
- Relacionamento entre usuários e itens, permitindo rastrear quem está com qual item.
- Histórico de **data de empréstimo** e **data de devolução**.

## Funcionalidades

### 1. Gerenciamento de Empréstimos:
- **Empréstimos e Devoluções**:
  - Itens podem ser emprestados para usuários e posteriormente devolvidos.
  - Controle automático de disponibilidade do item após devolução.

### 2. CRUD de Usuários:

---

"Temos rotas para criar, ler, atualizar e deletar usuários. Por exemplo, a rota **POST** cria um novo usuário com nome e email, e retorna o ID gerado."

---

### 3. CRUD de Itens:

---

"Da mesma forma, gerenciamos itens. A rota **POST** cria um item, marcando-o como disponível para empréstimo inicialmente."

---

## Endpoints da API

### Usuários

- **Criar Usuário**  
  `POST /usuarios/:nome/:email`  
  Cria um novo usuário com os parâmetros nome e email fornecidos.

- **Listar Usuários**  
  `GET /usuarios`  
  Retorna todos os usuários cadastrados.

- **Buscar Usuário por ID**  
  `GET /usuarios/:id`  
  Retorna um usuário específico pelo ID.

- **Atualizar Usuário**  
  `PUT /usuarios/:id`  
  Atualiza os dados de um usuário pelo ID.

- **Deletar Usuário**  
  `DELETE /usuarios/:id`  
  Deleta um usuário específico pelo ID.

### Itens

- **Criar Item**  
  `POST /itens/`  
  Cria um novo item. Inicialmente, o item é marcado como **não emprestado**.

- **Listar Itens**  
  `GET /itens`  
  Retorna todos os itens cadastrados.

- **Buscar Item por ID**  
  `GET /itens/:id`  
  Retorna um item específico pelo ID.

- **Atualizar Item**  
  `PUT /itens/:id`  
  Atualiza os dados de um item específico pelo ID.

- **Deletar Item**  
  `DELETE /itens/:id`  
  Remove um item específico pelo ID.

- **Deletar Todos os Itens**  
  `DELETE /itens/`  
  Remove todos os itens cadastrados.

### Empréstimos

- **Emprestar Item**  
  `POST /itens/:id/emprestar/:usuarioId`  
  Marca um item como emprestado para um usuário específico, identificados pelos IDs.

- **Devolver Item**  
  `POST /itens/:id/devolver/:usuarioId`  
  Registra a devolução de um item emprestado, liberando-o para novos empréstimos.

## Instalação e Configuração

### Pré-requisitos

- **Node.js**: Certifique-se de ter o Node.js instalado na sua máquina.
- **MongoDB**: Um servidor MongoDB deve estar rodando localmente ou remotamente.

### Como rodar o projeto

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git
