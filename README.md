## ***Importante: Este projeto se trata de um trabalho exploratório da faculdade sobre react. Nunca deixe credenciais de acesso de forma fixa no código.***

# Playlist Manager

Este é um aplicativo de gerenciamento de playlists desenvolvido com React e TypeScript. O projeto permite que usuários criem, editem e gerenciem suas playlists de música, com sistema de autenticação e navegação entre diferentes seções.

## 🛠️ Tecnologias Utilizadas

### Core
- **React** (v19.1.1) - Biblioteca principal para construção da interface
- **TypeScript** (v5.9.3) - Superset do JavaScript que adiciona tipagem estática
- **Vite** (v7.1.7) - Build tool moderna para desenvolvimento rápido

### Gerenciamento de Estado
- **Redux Toolkit** (v2.9.0) - Gerenciamento de estado da aplicação
- **React Redux** (v9.2.0) - Integração do Redux com React

### Roteamento
- **React Router DOM** (v7.9.3) - Gerenciamento de rotas da aplicação

## 📁 Estrutura do Projeto

```
src/
├── components/      # Componentes reutilizáveis
│   ├── Loading/     
│   ├── Navbar/      
│   └── PrivateRoute/
├── pages/          # Páginas da aplicação
│   ├── AlbumDetail/
│   ├── Home/
│   ├── Login/
│   ├── Music/
│   ├── PlaylistDetail/
│   └── Playlists/
├── store/          # Configuração Redux
│   └── slices/
│       ├── musicSlice.ts
│       ├── playlistSlice.ts
│       └── userSlice.ts
├── hooks/          # Hooks customizados
└── types/          # Definições de tipos TypeScript
```

## 🔄 Fluxo da Aplicação

1. **Autenticação**
   - Sistema de login implementado através do `userSlice`
   - Rotas protegidas usando o componente `PrivateRoute`
   - Restauração automática da sessão ao iniciar a aplicação

2. **Gerenciamento de Estado**
   - `userSlice`: Gerencia estado do usuário e autenticação
   - `playlistSlice`: Controle das playlists do usuário
   - `musicSlice`: Gerenciamento do catálogo de músicas

3. **Navegação**
   - Sistema de rotas com proteção por autenticação
   - Navegação entre playlists, detalhes de álbuns e músicas
   - Layout consistente com Navbar persistente


## 💻 Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Compila TypeScript e constrói versão de produção
- `npm run lint`: Executa verificação de código com ESLint
- `npm run preview`: Visualiza a versão de produção localmente

## 🔮 Melhorias Futuras (TODO)

### 1. Otimização de Gerenciamento de Estado
- [ ] Migrar chamadas API para RTK Query
  - [ ] Configurar baseQuery com interceptors para autenticação
  - [ ] Implementar endpoints para playlists
  - [ ] Implementar endpoints para músicas
  - [ ] Adicionar cache e invalidação automática

### 2. Melhorias na Autenticação
- [ ] Implementar sistema de refresh token
- [ ] Adicionar persistência de autenticação com redux-persist
- [ ] Criar interceptor para tratamento de token expirado
- [ ] Implementar logout automático em token inválido
- [ ] Adicionar sistema de renovação automática do token

### 3. Otimização de Performance
- [ ] Implementar lazy loading para todas as rotas
- [ ] Adicionar Suspense com fallback de loading
- [ ] Configurar code splitting por rota
- [ ] Otimizar bundle size
- [ ] Implementar pre-fetching de rotas comuns

### 4. Melhorias na Estrutura
- [ ] Criar pasta `services/` para lógica de API
- [ ] Adicionar pasta `constants/` para configurações
- [ ] Implementar pasta `utils/` para funções auxiliares
- [ ] Criar pasta `layouts/` para templates
- [ ] Adicionar tipos TypeScript mais específicos

### 5. Qualidade de Código
- [ ] Adicionar testes unitários com Jest/Testing Library
- [ ] Configurar Storybook para documentação de componentes
- [ ] Implementar logging estruturado

### 6. UX/UI
- [ ] Adicionar feedback visual para ações do usuário
- [ ] Melhorar responsividade
- [ ] Adicionar temas claro/escuro
- [ ] Implementar animações de transição
