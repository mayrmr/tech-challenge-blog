# Tech Challenge - Blog Escolar

Blog educacional com autenticação de professores/alunos, posts com comentários e curtidas, e gestão de usuários. O projeto tem três partes:

- **`backend/`** — API REST (Node.js + Express + MongoDB)
- **`frontend-react/`** — site web (React + Vite)
- **`frontend-mobile/`** — app mobile (React Native + Expo + TypeScript, hooks e componentes funcionais, Context API)

Todas as três consomem a mesma API. O backend precisa estar rodando antes dos dois frontends.

## Pré-requisitos

- [Docker](https://www.docker.com/) e Docker Compose
- Node.js 18+ e npm

## 1. Backend

```bash
cd backend
docker-compose up --build
```

Sobe a API em `http://localhost:3000` e o MongoDB junto.

## 1. Frontend web (`frontend-react`)

```bash
cd frontend-react
docker-compose up --build
```

Abra **http://localhost:5173** no navegador.

<details>
<summary>Alternativa sem Docker</summary>

```bash
cd frontend-react
npm install
npm run dev
```
</details>

## 3. App mobile (`frontend-mobile`)

```bash
cd frontend-mobile
npm install
```

**Acesso**:

| Comando | O que faz | Quando usar |
| --- | --- | --- |
| `npx expo start --web` | Abre a UI no navegador (`http://localhost:8081`) | Ver/testar rápido, sem celular nem emulador |
| `npx expo start --android` | Abre num emulador Android | Precisa do Android Studio/SDK instalado |


## Arquitetura

- Autenticação via JWT (`Authorization: Bearer <token>`), perfil `professor`/`aluno`, verificado nos endpoints protegidos por `authMiddleware` + `professorMiddleware`.
- Cadastro de usuários (`POST /auth/register`) exige token de professor — não existe mais formulário público de cadastro em nenhum dos front-ends. Web e mobile só oferecem a tela de cadastro dentro da área logada, para professores.
- CRUD de usuários em `/users` (listar com filtro `?perfil=`, editar, excluir), professor-only; um professor não pode excluir a própria conta.
- **App mobile**: `AuthProvider` (`src/contexts/AuthContext.tsx`) guarda `{ user, token, isLoading }` em `useReducer`, hidrata do `AsyncStorage` na inicialização e expõe `login()`/`logout()`. `RootNavigator` alterna entre a stack de autenticação (só `Login`) e a stack autenticada com base nesse estado. A stack autenticada usa um `Header` customizado como navbar superior persistente, com atalhos para "Publicações" e "Usuários" visíveis apenas quando `user.perfil === 'professor'`. As telas `PostForm`, `UserList` e `UserForm` usam o hook `useProfessorGuard`, que redireciona de volta caso um aluno tente acessá-las diretamente — reforço no cliente do que o backend já impõe. `src/services/api.ts` cria a instância Axios com interceptor que injeta o token em toda requisição.
