# Design System — Catalise.me

> Documento de referência de branding para todos os projetos da Catalise.me.  
> Versão extraída do OPERA OS Landing Page (maio/2026).

---

## Identidade da Marca

**Catalise.me** é uma catalisadora de IA para negócios. O visual reflete isso: preciso, técnico e com energia latente. Não é uma SaaS genérica, não é uma agência criativa. É um sistema operacional para negócios — limpo, denso, vivo.

**Produtos ativos:**
- **OPERA OS** — Sistema operacional com IA para implantação em empresas de serviços
- **opera.catalise.me** — Landing page oficial do OPERA OS

**Register:** brand (o design é o produto; não é dashboard de tool)

---

## Estratégia de Cor

**Estratégia: Committed**  
Uma cor de acento saturada (acid green) carrega identidade e energia. O restante da superfície é off-white silencioso. O acento aparece em CTAs, destaques tipográficos, ícones de status e interações hover — nunca como decoração.

### Paleta Oficial

| Token CSS | Valor | Uso |
|---|---|---|
| `--acid` | `#6b9e11` | CTA buttons, highlights, ícones de check, texto em destaque |
| `--acid-2` | `#55800a` | Hover state do CTA (darkened) |
| `--acid-dim` | `#1e3300` | Disabled state, fundo de badge dark |
| `--acid-pale` | `rgba(107,158,17, 0.08)` | Fundo de badge/chip leve |
| `--acid-pale-border` | `rgba(107,158,17, 0.25)` | Borda de badge/chip |
| `--ember` | `#d92600` | Alertas, erros, estado destrutivo |
| `--ember-pale` | `rgba(217,38,0, 0.08)` | Fundo de alerta de erro |
| `--base` | `#f5f6f5` | Background principal (off-white com toque verde) |
| `--base-2` | `#eceeec` | Superfície secundária (footer, nav scrolled, sticky bar) |
| `--text` | `#141414` | Texto primário (charcoal quase-preto) |
| `--text-2` | `#3a3a3a` | Texto body/parágrafos |
| `--text-3` | `#626262` | Texto secundário, labels, subtítulos |
| `--border-var` | `#d8dad8` | Bordas suaves (separadores, inputs) |
| `--border-md` | `#9ea29e` | Bordas médias (ghost buttons, grid lines) |
| `--border-hard` | `#141414` | Bordas de alta contraste |

### Regras de Cor

- **Nunca** `#000` ou `#fff` puros. Sempre a versão com tint verde.
- Acid green aparece em ≤ 15% da área visual total.
- Seções escuras (quase-preto) são exceção pontual para contraste dramático — não o padrão.
- Seleção de texto: `background: var(--acid); color: var(--base)`.

---

## Tipografia

### Famílias

| Papel | Família | Variável CSS |
|---|---|---|
| **Display / Grandes títulos** | Bebas Neue | `var(--app-font-display)` |
| **Sans / Body / UI** | Geist | `var(--app-font-sans)` |
| **Mono / Labels / Tags / CTAs** | Geist Mono | `var(--app-font-mono)` |

**Import Google Fonts:**
```css
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Geist:wght@300;400;500;600;700;800;900&family=Geist+Mono:wght@300;400;500;600&display=swap');
```

### Escala Tipográfica

| Nível | Tamanho | Peso | Família | Uso |
|---|---|---|---|---|
| Hero H1 | `clamp(2.8rem, 6vw, 5.8rem)` | 800 | Geist | Título principal da página |
| Section H2 | `clamp(2.2rem, 5vw, 4rem)` | 800 | Geist | Títulos de seção |
| Section H2 Dramatic | `clamp(2.8rem, 8vw, 7rem)` | 800 | Geist | Títulos com quebra dramática (ex: DÚ/VI/DAS) |
| Sub-heading | `clamp(1.1rem, 2vw, 1.5rem)` | 600-700 | Geist | Sub-seções |
| Body | `clamp(0.95rem, 1.6vw, 1.1rem)` | 400 | Geist | Parágrafos longos |
| Body Small | `0.85–0.92rem` | 400-500 | Geist | Respostas de FAQ, listas de entregáveis |
| Label / Tag | `0.55–0.65rem` | 400-600 | Geist Mono | Labels uppercase, eyebrows |
| CTA / Button | `0.65–0.7rem` | 600-700 | Geist Mono | Botões, CTAs |

### Regras Tipográficas

- `letter-spacing` em labels monospace: `0.12em` a `0.26em` — sempre uppercase.
- `line-height` em títulos grandes: `0.9–1.0` (comprimido).
- `line-height` em body: `1.7–1.8`.
- `letter-spacing` em títulos: `-0.02em` a `-0.04em` (tracking negativo).
- Body text: máx. `54–65ch` de largura.

---

## Espaçamento e Layout

### Container Principal

```css
max-width: 1400px;
margin: 0 auto;
padding: 0 clamp(1rem, 3vw, 3rem);
```

### Sections

```css
padding: clamp(3rem, 6vw, 6rem) clamp(1rem, 3vw, 3rem);
```

### Seções de impacto (hero/CTA)

```css
padding: clamp(5rem, 10vw, 10rem) clamp(1rem, 3vw, 3rem);
```

### Grids

- 2 colunas texto + conteúdo: `grid-template-columns: 1fr 1.6fr`
- 3 colunas features: `grid-template-columns: repeat(3, 1fr)` com `gap: 1px`
- 2 colunas simétrico: `grid-template-columns: repeat(2, 1fr)`

### Border Radius

**Zero em todos os elementos de UI.** Sem `border-radius`. Bordas são sempre retas — parte da identidade técnica/sistêmica.

---

## Motion e Animação

### Easing Padrão

```css
--ease-expo: cubic-bezier(0.16, 1, 0.3, 1);
```

Usar em todas as transições de UI. É um ease-out exponencial: rápido no início, suave no final.

### FadeUp (componente padrão de reveal)

```tsx
initial={{ opacity: 0, y: 24 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
```

Acionar via `useInView` com `once: true, margin: "-80px"`.

### Regras de Motion

- Revelar elementos ao scroll com `FadeUp` — nunca all-at-once.
- `delay` escalonado: `0`, `0.08`, `0.14`, `0.2`... para hierarquia visual.
- Hover de cards: `translateX(4px) translateY(-2px)` — leve, preciso.
- Sticky bar: slide-up (`y: 80 → 0`) ao ultrapassar 600px de scroll.
- Modal: fade + `y: 32 → 0` + `scale: 0.97 → 1`.
- **Nunca:** bounce, elastic, animação de layout CSS, rotação.

---

## Componentes Padrão

### Nav

```
height: 75px
position: fixed, top
backdrop-filter: blur(20px) saturate(150%)
background: rgba(245,246,245, 0.6) → 0.95 ao scrollar
border-bottom: aparece ao scrollar
Logo: 48px height
Links: Geist Mono, 0.58rem, uppercase, 0.2em letter-spacing
CTA button: fundo acid, sem borda, sem radius
```

### CTA Primary Button

```css
font-family: Geist Mono, uppercase
font-size: 0.65–0.7rem
letter-spacing: 0.12–0.16em
background: var(--acid)
color: var(--base)  /* ou #0b0d0b */
padding: 13px 30px
border: none
border-radius: 0
cursor: pointer
transition: background 0.2s ease
hover: var(--acid-2)
```

### Ghost Button

```css
font-family: Geist Mono, uppercase
font-size: 0.7rem
background: transparent
color: var(--text)
padding: 12px 28px
border: 1px solid var(--border-md)
border-radius: 0
hover: background var(--text), color var(--base), border var(--text)
```

### Input / Select

```css
padding: 10px 14px
background: var(--base)
border: 1px solid var(--border-var)
color: var(--text)
font-family: Geist, sans-serif
font-size: 0.88rem
border-radius: 0
outline: none
focus: border-color → var(--acid)
```

### Label de Formulário

```css
font-family: Geist Mono
font-size: 0.55rem
letter-spacing: 0.16em
text-transform: uppercase
color: var(--text-3)
margin-bottom: 6px
```

### Chips / Badges

```css
font-family: Geist Mono
font-size: 0.48–0.55rem
letter-spacing: 0.12em
text-transform: uppercase
color: var(--acid)  /* ou var(--acid-dim) para dark */
background: var(--acid-pale)
padding: 3px 7px
border: 1px solid var(--acid-pale-border)
border-radius: 0
```

### Eyebrow / Seção Label

```
Geist Mono · 0.6rem · uppercase · letter-spacing 0.22em · color var(--text-3)
Geralmente acompanhado de uma linha: width 28px, height 1px, background var(--acid)
```

### Separador de Seção

```css
border-top: 1px solid var(--border-var)
```

---

## Padrões de Copywriting

### Tom de Voz

- **Preciso.** Sem metáforas vagas. Nomes técnicos reais.
- **Direto.** Frase afirmativa. Sem perguntas retóricas abertas.
- **Sistêmico.** Fala em termos de sistema, método, estrutura.
- **Confiante.** Não vende. Apresenta.

### Padrões de Título

- Títulos dramáticos em seções laterais: quebra em sílabas com `<br />` + acento colorido na última linha.
- Títulos de seção: sentença afirmativa em caixa alta ou título case.
- Evitar: pontuação excessiva, exclamações, perguntas retóricas genéricas.

### CTAs

- Formato: `Verbo + objeto + seta →`
- Ex: "Quero meu diagnóstico gratuito →", "Ver o método", "Solicitar agora →"
- Labels monospace uppercase sem artigos longos.

---

## Animações Keyframe Globais

```css
/* Marquee horizontal */
@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

/* Grid flutuante (hero background) */
@keyframes gridDrift {
  from { background-position: 0 0; }
  to { background-position: 64px 64px; }
}

/* Pulso de anel (CTA final) */
@keyframes ringPulse {
  0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.6; }
  100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
}
```

---

## Acessibilidade

- Contraste mínimo AA em todos os textos de corpo.
- `aria-label` em todos os ícones e botões sem texto visível.
- Fechar modal via `Escape`.
- Foco gerenciado em modais (scroll bloqueado no body enquanto aberto).
- Links e botões com estados de hover/focus visíveis.

---

## Antipadrões — Nunca Usar

| Padrão | Motivo |
|---|---|
| `border-radius` em cards/inputs/buttons | Contrário à identidade técnica |
| `box-shadow` decorativo | Flat é a linguagem; profundidade vem de movimento |
| Gradiente de texto (`background-clip: text`) | Decorativo, nunca semântico |
| Cards iguais em grid | Monótono — variar proporções e conteúdo |
| Modais como primeira solução | Esgotar alternativas inline primeiro |
| Border-left colorida como acento de card | Usar fundo tintado ou borda completa |
| `#000` ou `#fff` puros | Sempre tintado para o verde do sistema |
| Bounce / elastic em animações | Ease-out expo apenas |

---

## Integração e Deploy

| Item | Valor |
|---|---|
| Domínio principal | `catalise.me` |
| Produto OPERA OS | `opera.catalise.me` |
| Dev server | `npm run dev` (Vite, porta 5173) |
| Build | `npm run build` |
| Stack | React + TypeScript + Vite + Framer Motion |
| Webhook de lead | `https://triviumlabs.sg.larksuite.com/...` |
| CORS (webhook) | `mode: 'no-cors'`, `Content-Type: text/plain` |
