# Tech Challenge - Blog Escolar

Blog educacional com autenticação de professores/alunos, posts com comentários e curtidas, e gestão de usuários. O projeto tem três partes:

- **`backend/`** — API REST (Node.js + Express + MongoDB)
- **`frontend-react/`** — site web (React + Vite)
- **`frontend-mobile/`** — app mobile (React Native + Expo + TypeScript, hooks e componentes funcionais, Context API)

Todas as três consomem a mesma API. O backend precisa estar rodando antes dos dois frontends.

## Pré-requisitos

- [Docker](https://www.docker.com/) e Docker Compose (recomendado, evita instalar Node/Mongo na máquina)
- Node.js 18+ e npm (necessário de qualquer forma para rodar o app mobile)

## 1. Backend

```bash
cd backend
docker-compose up --build
```

Sobe a API em `http://localhost:3000` e o MongoDB junto (fica tudo persistido num volume Docker).

### Criar o primeiro professor (obrigatório na primeira vez)

O cadastro de usuários só pode ser feito por um professor já logado — então é preciso criar o primeiro manualmente, uma única vez:

```bash
docker-compose run --rm app npm run seed
```

Isso cria (ou reaproveita se já existir):

- **email:** `may@professora.com.br`
- **senha:** `123456`

Use essas credenciais pra logar em qualquer um dos três front-ends. Esse professor pode então cadastrar outros alunos/professores pela tela "Usuários".

<details>
<summary>Alternativa sem Docker</summary>

```bash
cd backend
npm install
npm run dev      # sobe a API (precisa de um MongoDB rodando em localhost:27017)
npm run seed      # cria o professor bootstrap
```
</details>

## 2. Frontend web (`frontend-react`)

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

Configuração da URL da API: edite `frontend-mobile/.env` (`EXPO_PUBLIC_API_URL`) se não for usar o padrão `http://localhost:3000`. Valores comuns:

| Ambiente | Valor de `EXPO_PUBLIC_API_URL` |
| --- | --- |
| Simulador iOS / `expo start --web` | `http://localhost:3000` |
| Emulador Android | `http://10.0.2.2:3000` |
| Dispositivo físico (Expo Go) | `http://<IP-da-sua-máquina-na-rede>:3000` |

Depois de editar `.env`, reinicie o Metro para o valor ser recarregado.

**Formas de abrir**, da mais simples pra mais completa:

| Comando | O que faz | Quando usar |
| --- | --- | --- |
| `npx expo start --web` | Abre a UI no navegador (`http://localhost:8081`) | Ver/testar rápido, sem celular nem emulador |
| `npx expo start` | Gera QR code pra escanear com o app **Expo Go** | Celular físico na mesma rede Wi-Fi/rede local do PC |
| `npx expo start --android` | Abre num emulador Android | Precisa do Android Studio/SDK instalado |

> **Nota sobre WSL2**: se você roda isso dentro do WSL2 (Windows), o modo padrão (`npx expo start`, sem flags) só é alcançável pelo celular se a rede espelhada do WSL2 estiver ativada (`networkingMode=mirrored` no `.wslconfig` do Windows + `wsl --shutdown`) — por padrão o WSL2 fica atrás de um NAT que o celular na Wi-Fi não enxerga. O modo `--web` acima não tem esse problema (o WSL2 encaminha `localhost` normalmente). Evite `--tunnel`: depende de um serviço ngrok compartilhado embutido em versões antigas do Expo CLI que está instável.

## Credenciais e permissões

| Ação | Aluno | Professor |
| --- | --- | --- |
| Ver posts, comentar, curtir | ✅ | ✅ |
| Editar/excluir próprio comentário | ✅ | ✅ |
| Editar/excluir comentário de outra pessoa | ❌ | ✅ |
| Criar/editar/excluir post | ❌ | ✅ |
| Ver lista de usuários | ❌ | ✅ |
| Cadastrar/editar/excluir aluno ou professor | ❌ | ✅ |

Login do professor bootstrap: `may@professora.com.br` / `123456` (criado pelo `npm run seed` do backend).

## Arquitetura

- Autenticação via JWT (`Authorization: Bearer <token>`), perfil `professor`/`aluno`, verificado nos endpoints protegidos por `authMiddleware` + `professorMiddleware`.
- Cadastro de usuários (`POST /auth/register`) exige token de professor — não existe mais formulário público de cadastro em nenhum dos front-ends. Web e mobile só oferecem a tela de cadastro dentro da área logada, para professores.
- CRUD de usuários em `/users` (listar com filtro `?perfil=`, editar, excluir), professor-only; um professor não pode excluir a própria conta.
- **App mobile**: `AuthProvider` (`src/contexts/AuthContext.tsx`) guarda `{ user, token, isLoading }` em `useReducer`, hidrata do `AsyncStorage` na inicialização e expõe `login()`/`logout()`. `RootNavigator` alterna entre a stack de autenticação (só `Login`) e a stack autenticada com base nesse estado. A stack autenticada usa um `Header` customizado como navbar superior persistente, com atalhos para "Publicações" e "Usuários" visíveis apenas quando `user.perfil === 'professor'`. As telas `PostForm`, `UserList` e `UserForm` usam o hook `useProfessorGuard`, que redireciona de volta caso um aluno tente acessá-las diretamente — reforço no cliente do que o backend já impõe. `src/services/api.ts` cria a instância Axios com interceptor que injeta o token em toda requisição.
- **Estrutura do app mobile**:
  ```
  frontend-mobile/
    App.tsx                     # ponto de entrada: providers + navegação
    src/
      components/                # Button, TextField, Header (navbar superior)
      contexts/AuthContext.tsx   # estado de autenticação (Context API + useReducer)
      hooks/useProfessorGuard.ts # bloqueia telas de professor para alunos
      navigation/                 # RootNavigator, tipos das stacks
      screens/                    # Login, Home, PostDetail, PostForm, UserList, UserForm
      services/api.ts             # instância axios + injeção de token
      theme/colors.ts              # paleta clara/escura (portada do frontend-react)
      types/                       # tipos compartilhados (User, Post, Comment)
  ```

## Referência de endpoints

| Método | Rota | Autenticação | Descrição |
| --- | --- | --- | --- |
| POST | `/auth/login` | Pública | Login (email + senha), retorna token JWT + usuário |
| POST | `/auth/register` | **Professor** | Cria aluno ou professor |
| GET | `/posts` | Pública | Lista posts |
| GET | `/posts/:id` | Pública | Detalhe do post |
| POST | `/posts` | **Professor** | Cria post (multipart, campo `anexo` opcional) |
| PUT | `/posts/:id` | **Professor** | Edita post |
| DELETE | `/posts/:id` | **Professor** | Exclui post |
| POST | `/posts/:id/like` | Pública | Curtir/descurtir post |
| GET | `/posts/:id/comments` | Pública | Lista comentários do post |
| POST | `/posts/:id/comments` | Pública | Cria comentário |
| PUT | `/comments/:id` | Dono do comentário ou professor | Edita comentário |
| DELETE | `/comments/:id` | Dono do comentário ou professor | Exclui comentário |
| POST | `/comments/:id/like` | Pública | Curtir/descurtir comentário |
| GET | `/users?perfil=aluno\|professor` | **Professor** | Lista usuários (filtro opcional) |
| GET | `/users/:id` | **Professor** | Detalhe de um usuário |
| PUT | `/users/:id` | **Professor** | Edita usuário (nome/email/perfil/senha opcional) |
| DELETE | `/users/:id` | **Professor** | Exclui usuário (não permite excluir a própria conta) |

## Nota sobre requisitos técnicos

O `frontend-react` é o site web original do projeto — em React puro (JavaScript, hooks e componentes funcionais), mas **não** em TypeScript nem React Native. O `frontend-mobile` é a implementação em **TypeScript + React Native**, com hooks e componentes funcionais em toda a base (sem classes) e gerenciamento de estado via Context API.
