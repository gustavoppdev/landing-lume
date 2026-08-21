import type { Metadata } from "next";
import { Schibsted_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Heading e corpo são a mesma família (plan.md §1.1). As variáveis usam os
// nomes que o `@theme inline` do preset já consome — por isso a mono entra como
// `--font-geist-mono`, e nenhuma linha do `@theme inline` é tocada (plan.md §2).
const sans = Schibsted_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const mono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Lume · Estética avançada facial na Savassi, BH",
  description:
    "Avaliação facial presencial de 50 minutos com biomédica esteta na Savassi. Protocolos montados caso a caso, com valores na página.",
};

// `scroll-smooth` vai no <html>, não no <body>: `scroll-behavior` não propaga
// do body para o viewport (diferente de `overflow`), então no body ele não faz
// nada. Decisão do usuário — registrada em `plan.md` §1.6. O
// `prefers-reduced-motion` que a AGENTS.md §4 regra 10 exige está no
// `globals.css`, junto do token.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${sans.variable} ${mono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
