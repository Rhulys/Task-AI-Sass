# 🚀 TaskFlow AI - Intelligent Task Management

O TaskFlow AI é uma plataforma SaaS experimental que integra Machine Learning ao ecossistema Full Stack para resolver um problema real: estimativas de tempo imprecisas em projetos de software.

## 🧠 O Diferencial: Predição com TensorFlow.js
Diferente de listas de tarefas comuns, este projeto utiliza TensorFlow.js para calcular automaticamente o tempo estimado de entrega.
- **Engine:** Rede Neural Sequencial treinada em ambiente Node.js.
- **Entradas (Features):** O modelo processa Complexidade (1-5) e Categoria (Frontend, Backend, Design) para gerar a estimativa.
- **Tratamento de Dados:** Implementação de função de ativação ReLU para garantir resultados positivos e normalização de dados categóricos.
- **Ciclo de Feedback:** O sistema captura o tempo real gasto em tarefas concluídas, criando uma base de dados para o futuro fine-tuning do modelo.
- **Gargalos de Produtividade:** O sistema analisa a carga de trabalho atual e emite alertas automáticos quando a densidade de tarefas complexas ameaça o prazo da sprint.

## 🛠 Funcionalidades
-- **Autenticação Robusta:** Sistema de Login e Registro utilizando JWT (JSON Web Tokens) e criptografia de senhas com bcrypt.
- **CRUD Inteligente:** Criação, edição e exclusão de tarefas com sincronização via GraphQL.
- **Recálculo em Tempo Real:** Alterar a complexidade de uma tarefa dispara automaticamente uma nova inferência da IA.
- **UX Fluida & Interativa:** Interface animada com Framer Motion, proporcionando transições de estado suaves e feedbacks visuais modernos.
- **API Performance:** Consultas otimizadas via GraphQL, reduzindo o overfetching e garantindo uma interface extremamente rápida.

## 🛠 Tech Stack
- **Frontend:** Next.js 14 (App Router), Tailwind CSS, Framer Motion, Apollo Client.
- **Backend:** Node.js, TypeScript, Apollo Server (GraphQL).
- **Security:** JWT (JSON Web Token), BcryptJS.
- **Database:** MongoDB (Mongoose).
- **IA:** TensorFlow.js.

## 🏗 Arquitetura
O projeto segue o padrão de **Clean Architecture**, separando as preocupações entre:
- `Services`: Lógica de IA e processamento.
- `Resolvers`: Interface GraphQL.
- `Models`: Esquemas de dados persistentes.
- `Hooks & Context:` Gerenciamento de estado global e persistência de sessão no Frontend.

## 🏃 Como rodar o projeto
1. Clone o repositório.
2. No `/backend`: `npm install` -> `Crie um .env com sua MONGO_URI e JWT_SECRET` -> `npm run dev`.
3. No `/frontend`: `npm install` -> `npm run dev`.
4. Configure o `.env` com sua `MONGO_URI`.