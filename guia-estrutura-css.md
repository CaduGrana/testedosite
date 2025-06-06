# Guia da Nova Estrutura CSS Modular

## 📁 Estrutura de Arquivos Reorganizada

Sua aplicação agora foi reorganizada com uma estrutura muito mais limpa e modular:

```
clockwork/
├── index.html          # Página principal com navegação
├── style.css           # CSS principal organizado em seções
├── app.js             # JavaScript modular com classes
└── README.md          # Documentação

Estrutura CSS Interna (organizada em seções):
├── Variables          # Variáveis globais (cores, tamanhos, fontes)
├── Reset & Base       # Estilos base e reset
├── Typography         # Sistema tipográfico
├── Layout             # Grid e containers
├── Components         # Componentes reutilizáveis
├── Forms              # Estilos de formulários
├── Themes             # Sistema de temas claro/escuro
└── Responsive         # Media queries
```

## 🎨 Sistema de Variáveis CSS

### Cores Principais
```css
--color-primary: #21808d        /* Azul-verde principal */
--color-primary-hover: #1d7480  /* Hover do primário */
--color-text: #13343b           /* Texto principal */
--color-background: #fcfcf9     /* Fundo principal */
--color-surface: #fffffd        /* Superfícies/cards */
```

### Como Personalizar Cores
Para alterar a identidade visual, basta modificar as variáveis no início do CSS:

```css
:root {
  /* Mude estas variáveis para personalizar toda a aplicação */
  --color-primary: #sua-cor-aqui;
  --color-secondary: #sua-cor-secundaria;
  --color-background: #seu-fundo;
}
```

## 🔧 Facilidades de Customização

### 1. Tema Claro/Escuro
O sistema já inclui variáveis automáticas para modo escuro:
```css
[data-theme="dark"] {
  --color-background: #0f172a;
  --color-text: #f1f5f9;
  /* Todas as cores se adaptam automaticamente */
}
```

### 2. Tipografia Modular
```css
--font-size-xs: 0.75rem;    /* 12px */
--font-size-sm: 0.875rem;   /* 14px */
--font-size-base: 1rem;     /* 16px */
--font-size-lg: 1.125rem;   /* 18px */
--font-size-xl: 1.25rem;    /* 20px */
```

### 3. Espaçamentos Consistentes
```css
--spacing-xs: 0.25rem;      /* 4px */
--spacing-sm: 0.5rem;       /* 8px */
--spacing-md: 1rem;         /* 16px */
--spacing-lg: 1.5rem;       /* 24px */
--spacing-xl: 2rem;         /* 32px */
```

## 🎯 Componentes Reutilizáveis

### Botões
```css
.btn                    /* Botão base */
.btn--primary          /* Botão primário */
.btn--secondary        /* Botão secundário */
.btn--small           /* Botão pequeno */
.btn--large           /* Botão grande */
```

### Cards
```css
.card                  /* Card base */
.card--elevated       /* Card com sombra */
.card--bordered       /* Card com borda */
```

### Formulários
```css
.form-group           /* Grupo de campo */
.form-control         /* Input/select/textarea */
.form-label           /* Label do campo */
.form-error           /* Mensagem de erro */
```

## 📱 Sistema Responsivo

A aplicação inclui breakpoints organizados:
```css
/* Mobile first approach */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

## 🚀 Como Fazer Alterações Comuns

### Mudar Cor Principal
1. Encontre `:root` no início do CSS
2. Altere `--color-primary` para sua cor preferida
3. A aplicação inteira se adaptará automaticamente

### Alterar Tipografia
1. Modifique `--font-family-base` para sua fonte preferida
2. Ajuste os tamanhos em `--font-size-*` se necessário

### Personalizar Espaçamentos
1. Ajuste as variáveis `--spacing-*` para seu gosto
2. Todos os componentes se adaptarão automaticamente

### Adicionar Novas Cores
```css
:root {
  --color-custom: #sua-cor;
  --color-custom-hover: #cor-hover;
}
```

## 💡 Vantagens da Nova Estrutura

1. **Manutenção Fácil**: Tudo organizado em seções claras
2. **Personalização Rápida**: Altere variáveis, não código
3. **Consistência**: Componentes seguem padrões uniformes
4. **Responsividade**: Design adaptável automático
5. **Temas**: Sistema de claro/escuro incluído
6. **Modularidade**: Adicione novos componentes facilmente

## 🔍 Estrutura JavaScript

O JavaScript também foi modularizado:
- **AppState**: Gerencia estado global
- **ThemeManager**: Controla temas
- **PageManager**: Navegação entre páginas
- **FormManager**: Validação de formulários
- **CalendarManager**: Lógica do calendário

Esta nova estrutura torna muito mais fácil manter e expandir sua aplicação!