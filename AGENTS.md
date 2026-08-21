<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md — Landing Pages de Conversão para WhatsApp

Engenheiro front-end sênior implementando **páginas únicas focadas em um clique de WhatsApp**, em Next.js + Tailwind v4 + shadcn/ui (Base UI). Aqui ficam **todas as regras fixas**; os arquivos de `specs/` têm só o que varia por projeto.

---

## 1. Stack e código

- Next.js 16 (App Router), Tailwind v4, shadcn/ui (Base UI), TypeScript, Motion (animações) e Lucide (ícones).
- `pnpm` sempre.
- Server Components por padrão. `use client` só em: `WhatsappButton.tsx`, qualquer arquivo dentro de `src/components/motion/` e `src/components/ui/`(shadcn).
- Imagens em `src/assets`, com import estático, consumidas por `Image` do next/image.
- Classes utilitárias do Tailwind direto no elemento; só vira util/variant reutilizável se repetir em mais de um lugar.
- Animação via wrapper — seção em si nunca vira Client Component por causa de animação. `<Animate>` recebe `children` e aplica a transição; o conteúdo (texto, imagem) renderiza no servidor.
  - `as`: `"reveal"` (bloco inteiro entra como unidade, default) | `"stagger"` (filhos diretos entram em sequência, delay incremental fixo)
  - `variant`: `"fade"` | `"fadeUp"` (default) | `"scaleIn"` — só anima `transform`/`opacity`, nunca propriedade que recalcula layout
  - Duração, ease e intervalo do `stagger` são de `plan.md` §1.6, declarados como constantes no `Animate` — nunca herdados do default da lib, que muda por propriedade
  - `prefers-reduced-motion` tratado **dentro** do `Animate` — se ativo, renderiza os filhos direto, sem transição; não é opt-in por seção
  - **Nada que seja candidato a LCP entra em `Animate`** — imagem do hero, H1, qualquer bloco acima da dobra que carregue o maior elemento visual. Animação de entrada só marca o LCP quando o elemento fica visível, e isso é depois da hidratação. O resto do hero pode usar `reveal` + `fade`; `stagger` no hero, nunca
  - Proibido: parallax, vídeo de fundo em autoplay
  - Contador animado e hover/micro-interação não usam `Animate` — contador é componente próprio, hover é Tailwind puro no elemento (`hover:scale-105 transition-transform`)
- Botões: as **chaves** de `variant` e `size` do `buttonVariants` são as nativas do preset e mantêm o nome (`default | outline | secondary | ghost | destructive | link` · `default | xs | sm | lg | icon…`). O que se ajusta é o **valor** de cada chave, dentro do cva, para bater com os tokens e medidas do `plan.md`. Nunca concatene cor, altura ou raio por fora — o cva resolve um valor só por chave. Chave nova é exceção registrada em `plan.md` §1.5.
- Mantenha o código simples e direto, nao adicione complexidade desnecessaria, sem código duplicado, redundante ou desnecessário.
- Comentarios somente se houver necessidade de explicar algo complexo.
- Tudo em inglês, exceto comentarios e conteúdo exibido na página.
- PascalCase em componentes, exceção para os do shadcn/ui (`src/components/ui/*`).
- `src/config.ts` é a única fonte para número, mensagens e texto de CTA.
- `src/app/globals.css` para tokens de estilos.
- `src/components/sections/*` para sections.
- `src/components/WhatsappButton.tsx` para CTA e Tracking.
- Para botões que são links use `<a className={cn(buttonVariants({ variant, size: "lg" }), className)}>`. O `Button` do Base UI injeta `type="button"` no elemento renderizado (ou `role="button"`, com `nativeButton={false}`) — nos dois casos o `<a>` deixa de ser anunciado como link.

---

## 2. Ciclo de cada feature

1. Ler `specs/tasks/index.md` e o arquivo da feature. Da `spec.md` e do `plan.md`, **só as seções que o mapa de leitura do `index.md` marca para esta feature** — `spec.md` §3 pelas linhas das seções da própria feature, não inteira. Na dúvida sobre um caso que o mapa não cobre, leia a seção inteira: o mapa corta releitura, nunca conferência.
2. **Reler o arquivo da feature contra a `spec.md` e o `plan.md` de hoje.** Ele foi escrito antes das features anteriores mudarem esses documentos: item que contradiz a spec de agora é **erro do arquivo**, não critério a cumprir. Corrija o arquivo antes de implementar.
3. Perguntar só se a ambiguidade afeta a conversão.
4. Escrever `prompts/<n>-<name>.md` — **máximo 700 palavras**, conferidas com `wc -w`, não estimadas. Não coube: você está escrevendo código em prosa, reescreva mais curto. Dividir a feature aqui não é a saída — cada feature carrega um piso fixo de leitura, e dividir dobra esse piso. Quem divide é o design (`PROMPT-DESIGN.md`, passo 8).
5. Pedir aprovação: "Prompt pronto em `prompts/<n>-<name>.md`. Posso executar?" Implementar só depois do sim.
6. Fechar: branch → prompt → implementação → verificações → commit → deploy (o ritual completo está em `specs/tasks/index.md`)

Conteúdo do prompt, somente: decisões assumidas · arquivos a alterar · **critérios de aceite** · como testar à mão. Dado que já mora em outro arquivo se **referencia pela seção** — a linha de imagem da `plan.md` §1.7, o texto da `spec.md` §3 — nunca se recopia: cópia é o que estoura o limite, e é ela que envelhece sem ninguém notar.

Os critérios de aceite saem em **dois blocos coláveis, executados pelo agente** — nunca em frases numeradas: "não medi" tem a mesma aparência de "medi e passou".

- um bloco ` ```sh ` — `grep`, `wc -c`, `pnpm build`: o que o terminal decide
- um bloco ` ```js ` — `getComputedStyle`, `getBoundingClientRect`: o que só existe na página renderizada, colado junto da chamada do `verify()`

Cada linha imprime o valor que decide, não um `true` mudo. O que não vira comando (ordem visual, sensação de peso) desce para "como testar à mão", e é curto.

**O `grep` do critério enxerga o comentário.** Um critério que procura o
literal que o comentário do arquivo usa para explicar a decisão volta contando
a explicação — quatro features seguidas caíram nisso. Escreva o comentário sem
o literal, ou ancore o `grep` no que só existe no JSX (`className="…"`,
`<Tag`), nunca na palavra solta.

```sh
grep -rl "priority" src/ | wc -l    # esperado: 0 — deprecado no Next 16
grep -rl "preload" src/ | wc -l     # esperado: 1 — só o hero
```

```js
getComputedStyle(document.querySelector("h1")).fontSize; // esperado: 34px em 390
document.querySelector("h1").getBoundingClientRect().bottom <=
  document.querySelector("img").getBoundingClientRect().top;
```

---

## 3. Mapa de propriedade

Um fato, um arquivo; os outros referenciam por seção, nunca recopiam.

- `AGENTS.md` - regras fixas de produto, stack e código
- `specs/spec.md` - conteúdo, copy, compliance, aceite, meta de performance
- `specs/plan.md` - tokens, tipografia, dimensões, imagens (inclusive alt), técnico
- `specs/tasks/index.md` - ritual, condições do projeto e manifesto de cobertura; uma feature por arquivo em `specs/tasks/`
- `specs/images-prompts.md` - prompt de geração de cada imagem, derivado de `plan.md` §1.7
- `specs/design-reference/` - o design de referência (`.dc.html` e/ou imagem). **Abre no browser, não se lê como texto** — o `support.js` ao lado é runtime gerado do editor, inútil para implementar e caro para ler. Estrutura, ritmo e comportamento vêm daqui; medida, não: essa é do `plan.md` §1.3
- `specs/friction-log.md` - o que travou nesta execução, uma entrada curta por feature, **append-only e nunca relido**. Achado que muda o próximo projeto não mora aqui: vai para o documento que o deixou passar (a tabela no cabeçalho do log diz qual).

Nunca invente conteúdo, cor, texto ou exigência de compliance fora desses arquivos. Se falta, pergunte.

---

## 4. Regras de produto (não negociáveis)

Cada regra traz o motivo.

1. Conversão única. um objetivo: o clique no Whatsapp.
2. Botão idêntico em toda a página, mesmo texto, formato e ícone; só a ênfase varia em função do fundo, registradas em `plan.md`.
3. Scroll único, sem navegação, sem abas, sem modais antes do CTA, rota legal (política de privacidade) é compliance, somente no footer e com peso visual baixo. Mini-nav por âncora é exceção conforme design.
4. Mobile-first estrito, testar em 360-390px antes de qualquer outro tamanho. CTA visível ou a no máximo 1 scroll.
5. **Mensagem pré-preenchida, uma por seção.** `https://wa.me/55XXXXXXXXXXX?text=<encodeURIComponent(msg)>` — nunca abre conversa vazia. É a mensagem que diz de qual seção veio o lead.
6. **Performance.** Piso: LCP < 2,5s e CLS < 0,1 em 4G — a `spec.md` §4 pode apertar, nunca afrouxar. Toda imagem de conteúdo via `next/image`, `preload` só no hero (ele é o LCP) — no Next 16 o `priority` está deprecado em favor de `preload`. Página pré-renderizada em build. Animação só com `transform`/`opacity` — outra propriedade recalcula layout e derruba o CLS.
7. **Prova antes da promessa.** Toda alegação de resultado tem prova na mesma seção ou na imediatamente seguinte. Nunca resultado individual garantido em linguagem absoluta — faixa ou tendência.
8. **Credibilidade.** Registro profissional visível se a profissão tiver. Depoimento, foto e case exigem autorização antes do ar. Exigência específica do nicho vai em `spec.md`.
9. **Página enxuta.** Seção que não reduz objeção, não gera confiança e não empurra para o CTA é cortada.
10. **Acessibilidade.** Contraste AA em todo texto (inclusive apoio, rótulo pequeno e fundo escuro). `aria-label` em cada CTA descrevendo o contexto em linguagem humana, nunca a chave interna. Alt descritivo em toda imagem. Cada CTA é um único stop de Tab, e **`tabIndex={0}` em elemento sem ação é regressão, não solução** — cada um é mais um stop antes do CTA, e "foco visível no card" se cumpre no elemento que já é interativo ou não se cumpre. Foco visível em todo elemento interativo — o `buttonVariants` do preset costuma trazer o anel de foco pronto (confira no seu); qualquer elemento fora dele (link avulso, item de FAQ) precisa do mesmo tratamento, nunca `outline: none` sem substituto. `prefers-reduced-motion` respeitado em toda animação, sem exceção.
11. **Rastreamento.** Todo clique dispara `whatsapp_click` com a seção de origem, e a UTM da URL de entrada é capturada — sem isso, campanha paga não se otimiza.

Exceção a qualquer regra acima se declara em `spec.md` §1 com **o quê · por quê · o que continua de pé apesar da exceção**. Nunca silenciosa.

---

## 5. Verificações

Adicionar a `package.json`, se não existir.

Ao fim de toda feature, nesta ordem:

```
pnpm typecheck        # tsc --noEmit
pnpm lint
pnpm build            # a rota / deve aparecer como estática (○)
git diff              # lido, não só rodado
```

Os três comandos acima passam com o conteúdo corrompido, o diff é a única verificação que lê texto.

Critério de aceite é número a atingir, nunca instrução a cumprir. Ex: "Aplicar a paleta do plan" pode ser cumprido com a página reprovando contraste AA; "AA ≥ 4,5:1 no texto sobre a foto do hero" pega o erro.

Nas features que envolvem imagem, layout ou deploy, some:

- Comparação lado a lado com `specs/design-reference/`, em mobile e desktop — divergência aceita é registrada no arquivo da feature em `specs/tasks/`
- Link `wa.me` aberto em **celular real**, não emulador
- `pnpm approve-builds` se a instalação bloqueou build script (`sharp`, `unrs-resolver`)

**Lighthouse não é verificação de feature** — nas features de conteúdo o número mede meia página. O lugar dele é `n-seo-analytics` (o elemento de LCP é o certo?), `n-review` (a métrica bate a meta?) e `n-launch` (bate em produção?). Sem CLI no projeto: `pnpm dlx lighthouse@latest`. Leia o JSON, não o resumo de métricas — ele não diz a causa, e as chaves mudam entre versões maiores.

Nunca afirme que uma verificação passou sem executá-la. Reporte a saída.

### Armadilhas conhecidas

Defeitos reprodutíveis de ferramenta. **Os comandos do bloco acima são cegos para todos eles.** As duas primeiras já estão resolvidas em `public/verify.js` (copiado na feature 0): medi-las à mão é refazer erro conhecido.

**1. Janela que não pinta reprova animação que funciona.** Opacidade depende de `requestAnimationFrame`, e a janela da automação nem sempre produz quadros — `visibilityState === "visible"` não garante nada, `hasFocus()` falso congela igual. Idem largura: a janela tem piso e mente sobre o `innerWidth`. **Não meça isso à mão**: o `verify()` conta os ticks antes de julgar, mede largura em iframe e devolve "NÃO MEDIDO" em vez de reprovação falsa; com a janela parada, rode em duas fases (`prep` · screenshot · `read`).

**2. O hex do comentário não é a cor que o browser pinta.** `oklch(0.964 0.004 92)` anotado como `#F6F5F2` renderiza `#F4F3F0` — 4,54:1 vira 4,46:1 e reprova AA. Contraste é sempre na **cor renderizada**, e é o `verify()` quem mede (`getComputedStyle` devolve `lab()` no Chrome; ler aqueles números como RGB reprova a página inteira em silêncio). O que sobra para você: `var(--token)` inexistente não falha, **herda** — provar que o token existe antes de transformar a leitura em veredito.

**3. Ambiente lido como bug de código.** Os dois sintomas abaixo são idênticos ao de código quebrado e os dois fecham com um `curl -s localhost:3000 | grep` da classe ou atributo esperado no HTML servido — 1 comando, antes de qualquer medição:

- `next start` antigo ainda vivo na porta: o novo morre com `EADDRINUSE` num log que ninguém lê e tudo é medido contra o build anterior. `ss -tlnp | grep ':3000'` acha o PID certo — `pkill -f "next start"` mata o próprio shell, e `head -1` num `ss` pega processo alheio.
- **o shell é `fish`**: `VAR=valor cmd` não passa env nenhuma. É `env VAR=valor cmd`. Env que não chegou tem o sintoma exato de wiring quebrado.

---

## 6. Escopo

Construa apenas: conteúdo da spec.md, estilo do plan.md, botão de WhatsApp, analytics do clique, otimização de imagem.

Não adicione sem pedido explícito: backend, API routes, banco, autenticação, formulário com envio, múltiplas páginas, CMS, state management.

Na dúvida: mantenha simples · pergunte de forma objetiva em vez de presumir · salve o prompt antes de codar.
