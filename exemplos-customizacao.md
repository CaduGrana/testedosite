# Exemplos Práticos de Customização

## 🎨 Cenários Comuns de Personalização

### 1. Mudando para um Tema Azul
```css
:root {
  --color-primary: #3b82f6;           /* Azul */
  --color-primary-hover: #2563eb;     /* Azul escuro */
  --color-primary-active: #1d4ed8;    /* Azul mais escuro */
  --color-secondary: rgba(59, 130, 246, 0.12);
  --color-focus-ring: rgba(59, 130, 246, 0.4);
}
```

### 2. Tema Roxo Moderno
```css
:root {
  --color-primary: #8b5cf6;           /* Roxo */
  --color-primary-hover: #7c3aed;     /* Roxo escuro */
  --color-primary-active: #6d28d9;    /* Roxo mais escuro */
  --color-secondary: rgba(139, 92, 246, 0.12);
  --color-focus-ring: rgba(139, 92, 246, 0.4);
}
```

### 3. Tema Verde Natureza
```css
:root {
  --color-primary: #10b981;           /* Verde */
  --color-primary-hover: #059669;     /* Verde escuro */
  --color-primary-active: #047857;    /* Verde mais escuro */
  --color-secondary: rgba(16, 185, 129, 0.12);
  --color-focus-ring: rgba(16, 185, 129, 0.4);
}
```

### 4. Mudando Tipografia para Roboto
```css
:root {
  --font-family-base: 'Roboto', sans-serif;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
}

/* Adicione no head do HTML */
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### 5. Aumentando Espaçamentos para Layout Mais Arejado
```css
:root {
  --spacing-xs: 0.5rem;       /* 8px ao invés de 4px */
  --spacing-sm: 0.75rem;      /* 12px ao invés de 8px */
  --spacing-md: 1.5rem;       /* 24px ao invés de 16px */
  --spacing-lg: 2rem;         /* 32px ao invés de 24px */
  --spacing-xl: 3rem;         /* 48px ao invés de 32px */
}
```

### 6. Customizando Bordas (Mais Arredondadas)
```css
:root {
  --border-radius-sm: 0.5rem;     /* 8px */
  --border-radius-md: 0.75rem;    /* 12px */
  --border-radius-lg: 1rem;       /* 16px */
  --border-radius-xl: 1.5rem;     /* 24px */
}
```

### 7. Adicionando Cor de Destaque Personalizada
```css
:root {
  --color-accent: #f59e0b;         /* Laranja */
  --color-accent-hover: #d97706;   /* Laranja escuro */
  --color-accent-light: rgba(245, 158, 11, 0.1);
}

/* Use em componentes específicos */
.btn--accent {
  background-color: var(--color-accent);
  color: white;
}

.btn--accent:hover {
  background-color: var(--color-accent-hover);
}
```

### 8. Tema Escuro Personalizado
```css
[data-theme="dark"] {
  --color-background: #1a1a1a;      /* Fundo mais suave */
  --color-surface: #2d2d2d;         /* Superfícies mais claras */
  --color-text: #e5e5e5;            /* Texto mais suave */
  --color-text-secondary: #a3a3a3;  /* Texto secundário */
  --color-border: rgba(255, 255, 255, 0.1);
}
```

## 🔧 Adicionando Novos Componentes

### Criando um Card de Destaque
```css
.card--featured {
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  color: white;
  border: none;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.card--featured .card__title {
  color: white;
}

.card--featured .card__text {
  color: rgba(255, 255, 255, 0.9);
}
```

### Botão com Gradiente
```css
.btn--gradient {
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  border: none;
  color: white;
  position: relative;
  overflow: hidden;
}

.btn--gradient:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}
```

### Animação de Loading
```css
.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

## 📱 Customizações Responsivas

### Alterando Comportamento Mobile
```css
/* Botões empilhados no mobile */
@media (max-width: 640px) {
  .hero__actions {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  .btn {
    width: 100%;
  }
}
```

### Menu Mobile Personalizado
```css
@media (max-width: 768px) {
  .nav {
    position: fixed;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--color-surface);
    flex-direction: column;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
    transition: top 0.3s ease;
  }
  
  .nav--open {
    top: 60px; /* Altura do header */
  }
}
```

## 💡 Dicas de Melhores Práticas

1. **Sempre use variáveis CSS** ao invés de valores fixos
2. **Teste mudanças no tema escuro** automaticamente
3. **Mantenha proporções** entre elementos relacionados
4. **Use rem/em** para tamanhos escaláveis
5. **Teste responsividade** em diferentes dispositivos

## 🚀 Como Aplicar uma Mudança Completa

1. **Escolha seu esquema de cores** (exemplo: tema azul)
2. **Atualize as variáveis principais** no topo do CSS
3. **Teste nos dois temas** (claro e escuro)
4. **Ajuste detalhes específicos** se necessário
5. **Teste responsividade** em mobile

Exemplo completo para tema azul profissional:
```css
:root {
  --color-primary: #1e40af;
  --color-primary-hover: #1d4ed8;
  --color-secondary: rgba(30, 64, 175, 0.12);
  --color-accent: #0ea5e9;
  --color-background: #f8fafc;
  --color-surface: #ffffff;
  --color-text: #1e293b;
}
```