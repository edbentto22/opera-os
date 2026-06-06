import { useState, useEffect, useRef, createContext, useContext } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";

const WHATSAPP_URL = "https://wa.me/5575991879786?text=Quero%20meu%20diagn%C3%B3stico%20gratuito%20OPERA%20OS";

const ModalCtx = createContext<{ open: () => void }>({
  open: () => {},
});

function useModal() {
  return useContext(ModalCtx);
}

function DiagnosticoModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    nome: "", empresa: "", email: "", whatsapp: "",
    faturamento: "", origem: "",
  });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const WEBHOOK_URL = "https://triviumlabs.sg.larksuite.com/base/automation/webhook/event/BG02aZvhzwUXXrhKi8HlZfzAgsf";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        // no-cors evita o preflight CORS — funciona em localhost e em opera.catalise.me
        // o payload chega normalmente no webhook; apenas não lemos a resposta
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
          nome: form.nome,
          empresa: form.empresa,
          email: form.email,
          whatsapp: form.whatsapp,
          faturamento: form.faturamento,
          como_conheceu: form.origem,
          origem: "OPERA OS — Landing Page",
          data_envio: new Date().toISOString(),
        }),
      });
      // com no-cors não conseguimos ler status — assumimos sucesso se não houve exceção
      setSent(true);
    } catch {
      alert("Erro de rede. Verifique sua conexão e tente novamente.");
    } finally {
      setSending(false);
    }
  };

  // close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px",
    background: "var(--base)", border: "1px solid var(--border-var)",
    color: "var(--text)", fontFamily: "var(--app-font-sans)", fontSize: "0.88rem",
    outline: "none", transition: "border-color 0.2s",
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--app-font-mono)", fontSize: "0.55rem",
    letterSpacing: "0.16em", textTransform: "uppercase",
    color: "var(--text-3)", display: "block", marginBottom: 6,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9000,
        background: "rgba(20,20,20,0.55)",
        backdropFilter: "blur(8px) saturate(120%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={e => e.stopPropagation()}
        style={{
          background: "var(--base)",
          border: "1px solid var(--border-var)",
          width: "100%", maxWidth: 540,
          maxHeight: "90dvh", overflowY: "auto",
          position: "relative",
        }}
      >
        {/* Header */}
        <div style={{
          padding: "1.6rem 2rem 1.2rem",
          borderBottom: "1px solid var(--border-var)",
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        }}>
          <div>
            <p style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.55rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--acid)", marginBottom: 6 }}>Catalise.me</p>
            <h2 style={{ fontFamily: "var(--app-font-sans)", fontWeight: 800, fontSize: "1.35rem", letterSpacing: "-0.02em", color: "var(--text)", lineHeight: 1.1 }}>
              Diagnóstico<br /><span style={{ color: "var(--acid)" }}>Gratuito</span>
            </h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", fontSize: "1.3rem", lineHeight: 1, padding: 4, marginTop: 2 }} aria-label="Fechar">✕</button>
        </div>

        {/* Body */}
        <div style={{ padding: "1.8rem 2rem 2rem" }}>
          {sent ? (
            <div style={{ textAlign: "center", padding: "2rem 0" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>✅</div>
              <h3 style={{ fontFamily: "var(--app-font-sans)", fontWeight: 700, fontSize: "1.1rem", color: "var(--text)", marginBottom: 8 }}>Recebemos seu pedido!</h3>
              <p style={{ fontFamily: "var(--app-font-sans)", fontSize: "0.88rem", color: "var(--text-3)", lineHeight: 1.7 }}>Entraremos em contato em até <strong style={{ color: "var(--text)" }}>24 horas</strong> para agendar seu diagnóstico.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              <div className="form-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={labelStyle}>Nome *</label>
                  <input required value={form.nome} onChange={set("nome")} placeholder="Seu nome" style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = "var(--acid)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "var(--border-var)")} />
                </div>
                <div>
                  <label style={labelStyle}>Empresa *</label>
                  <input required value={form.empresa} onChange={set("empresa")} placeholder="Nome da empresa" style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = "var(--acid)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "var(--border-var)")} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>E-mail *</label>
                <input required type="email" value={form.email} onChange={set("email")} placeholder="seu@email.com" style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = "var(--acid)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "var(--border-var)")} />
              </div>
              <div>
                <label style={labelStyle}>WhatsApp *</label>
                <input required value={form.whatsapp} onChange={set("whatsapp")} placeholder="(00) 90000-0000" style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = "var(--acid)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "var(--border-var)")} />
              </div>
              <div>
                <label style={labelStyle}>Faturamento médio mensal *</label>
                <select required value={form.faturamento} onChange={set("faturamento")}
                  style={{ ...inputStyle, appearance: "none", cursor: "pointer", color: form.faturamento ? "var(--text)" : "var(--text-3)" }}
                  onFocus={e => (e.currentTarget.style.borderColor = "var(--acid)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "var(--border-var)")}>
                  <option value="" disabled>Selecione uma faixa</option>
                  <option value="abaixo50k">Abaixo de R$ 50 mil</option>
                  <option value="50a100k">Entre R$ 50 mil – R$ 100 mil</option>
                  <option value="acima100k">Mais de R$ 100 mil</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Como ficou sabendo sobre nós? *</label>
                <select required value={form.origem} onChange={set("origem")}
                  style={{ ...inputStyle, appearance: "none", cursor: "pointer", color: form.origem ? "var(--text)" : "var(--text-3)" }}
                  onFocus={e => (e.currentTarget.style.borderColor = "var(--acid)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "var(--border-var)")}>
                  <option value="" disabled>Selecione uma opção</option>
                  <option value="google">Google</option>
                  <option value="instagram">Instagram</option>
                  <option value="evento">Evento</option>
                  <option value="indicacao">Indicação</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
              <button type="submit" disabled={sending} style={{
                width: "100%", padding: "13px", marginTop: 4,
                background: sending ? "var(--acid-dim)" : "var(--acid)",
                color: "var(--base)", border: "none", cursor: sending ? "not-allowed" : "pointer",
                fontFamily: "var(--app-font-mono)", fontSize: "0.65rem", letterSpacing: "0.16em",
                textTransform: "uppercase", fontWeight: 700, transition: "background 0.2s",
              }}>
                {sending ? "Enviando..." : "Solicitar diagnóstico gratuito →"}
              </button>
              <p style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.52rem", letterSpacing: "0.1em", color: "var(--border-md)", textAlign: "center" }}>
                Sem compromisso · Resposta em até 24h
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Reveals a heading word-by-word, staggered — inspired by Imperial Ebolgheri's title reveals */
function WordReveal({ text, className = "", style = {}, delay = 0 }: {
  text: string; className?: string; style?: React.CSSProperties; delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const words = text.split(" ");
  return (
    <span ref={ref} className={className} style={{ display: "block", overflow: "hidden", ...style }}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          style={{ display: "inline-block", marginRight: "0.3em" }}
          initial={{ y: "110%", opacity: 0 }}
          animate={inView ? { y: "0%", opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: delay + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

/** Magnetic cursor — follows mouse with spring physics */
function MagneticCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const dotX = useSpring(cursorX, { stiffness: 900, damping: 50 });
  const dotY = useSpring(cursorY, { stiffness: 900, damping: 50 });
  const ringX = useSpring(cursorX, { stiffness: 120, damping: 22 });
  const ringY = useSpring(cursorY, { stiffness: 120, damping: 22 });
  const [hoveringCta, setHoveringCta] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    const onEnter = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setHoveringCta(!!(t.closest("button") || t.closest("a")));
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", onEnter);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", onEnter);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Dot */}
      <motion.div
        style={{
          position: "fixed", top: 0, left: 0, zIndex: 9999,
          pointerEvents: "none",
          x: dotX, y: dotY,
          translateX: "-50%", translateY: "-50%",
          width: hoveringCta ? 8 : 6, height: hoveringCta ? 8 : 6,
          background: "var(--acid)",
          borderRadius: "50%",
          transition: "width 0.2s, height 0.2s",
        }}
      />
      {/* Ring */}
      <motion.div
        style={{
          position: "fixed", top: 0, left: 0, zIndex: 9998,
          pointerEvents: "none",
          x: ringX, y: ringY,
          translateX: "-50%", translateY: "-50%",
          width: hoveringCta ? 44 : 28, height: hoveringCta ? 44 : 28,
          border: "1.5px solid var(--acid)",
          borderRadius: "50%",
          opacity: hoveringCta ? 0.7 : 0.35,
          transition: "width 0.3s, height 0.3s, opacity 0.3s",
        }}
      />
    </>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const { open } = useModal();

  useEffect(() => {
    const handler = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      setShowSticky(y > 600);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 800,
        padding: "0 clamp(1rem, 3vw, 3rem)", height: 75,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: scrolled ? "rgba(245,246,245,0.95)" : "rgba(245,246,245,0.6)",
        backdropFilter: "blur(20px) saturate(150%)",
        borderBottom: `1px solid ${scrolled ? "var(--border-var)" : "transparent"}`,
        transition: "all 0.3s ease",
      }}>
        <a href="#" aria-label="Catalise.me">
          <img src="/logo-catalise-me.svg" alt="Catalise.me" style={{ height: 46, width: "auto", display: "block" }} />
        </a>
        <div className="nav-links" style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          {(["O Método", "Entregáveis", "Investimento"] as const).map((label, i) => (
            <a key={i} href={["#fases", "#entregaveis", "#investimento"][i]}
              className="nav-link-item"
              style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.58rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-3)", transition: "color 0.12s ease" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--acid)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-3)")}
            >{label}</a>
          ))}
          <button onClick={open} style={{
            fontFamily: "var(--app-font-mono)", fontSize: "0.58rem",
            letterSpacing: "0.14em", textTransform: "uppercase",
            color: "var(--base)", background: "var(--acid)",
            padding: "7px 16px", fontWeight: 600, transition: "background 0.12s ease",
            border: "none", cursor: "pointer",
          }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--acid-2)")}
            onMouseLeave={e => (e.currentTarget.style.background = "var(--acid)")}
          >Quero meu diagnóstico</button>
        </div>
      </nav>

      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={showSticky ? { y: 0, opacity: 1 } : { y: 80, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 700,
          background: "var(--base-2)", borderTop: "1px solid var(--border-var)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "0.9rem clamp(1rem, 3vw, 3rem)",
        }}
      >
        <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-3)" }}>
          OPERA OS — <span style={{ color: "var(--acid)" }}>Diagnóstico gratuito disponível</span>
        </span>
        <button onClick={open} style={{
          fontFamily: "var(--app-font-mono)", fontSize: "0.7rem", letterSpacing: "0.12em",
          textTransform: "uppercase", background: "var(--acid)", color: "var(--base)",
          padding: "10px 24px", fontWeight: 600, display: "inline-flex", alignItems: "center",
          border: "none", cursor: "pointer",
        }}>Solicitar agora →</button>
      </motion.div>
    </>
  );
}

function OperaRow({ letter, word, desc, tag }: { letter: string; word: string; desc: string; tag: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: 16,
        padding: "clamp(12px,2vw,18px) clamp(14px,2.5vw,22px)",
        background: hovered ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.5)",
        border: `1px solid ${hovered ? "var(--acid)" : "rgba(0,0,0,0.08)"}`,
        boxShadow: hovered
          ? "inset 0 1px 0 rgba(107,158,17,0.15), 0 8px 32px -8px rgba(0,0,0,0.12)"
          : "inset 0 1px 0 rgba(0,0,0,0.03), 0 4px 16px -4px rgba(0,0,0,0.06)",
        transform: hovered ? "translateX(6px) translateY(-1px)" : "none",
        transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
        cursor: "default",
      }}
    >
      <span style={{
        fontFamily: "var(--app-font-display)", fontSize: "clamp(2rem,4vw,3.2rem)",
        color: hovered ? "var(--acid)" : "var(--border-md)", lineHeight: 1,
        minWidth: "clamp(32px,4.5vw,52px)",
        transition: "all 0.3s ease",
      }}>{letter}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "var(--app-font-sans)", fontWeight: 600, fontSize: "clamp(0.78rem,1.3vw,0.95rem)", color: "var(--text)", minWidth: 120 }}>{word}</div>
        <div style={{ fontFamily: "var(--app-font-mono)", fontSize: "clamp(0.46rem,0.85vw,0.58rem)", letterSpacing: "0.1em", color: "var(--text-3)", textTransform: "uppercase" }}>{desc}</div>
      </div>
      <span style={{
        fontFamily: "var(--app-font-mono)", fontSize: "0.5rem", letterSpacing: "0.12em",
        color: "var(--acid-dim)", textTransform: "uppercase", background: "var(--acid-pale)",
        padding: "3px 7px", border: "1px solid var(--acid-pale-border)", whiteSpace: "nowrap",
      }}>{tag}</span>
    </div>
  );
}

function Hero() {
  const { open } = useModal();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={heroRef} id="hero" style={{
      minHeight: "100dvh", display: "flex", alignItems: "center",
      background: "var(--base)", overflow: "hidden", paddingTop: 75, position: "relative",
    }}>
      {/* Parallax video layer */}
      <motion.div style={{ position: "absolute", inset: 0, zIndex: 0, y: videoY }}>
        <video src="/hero-bg.mp4" autoPlay loop muted playsInline
          style={{ width: "100%", height: "115%", objectFit: "cover", opacity: 0.75, pointerEvents: "none" }}
        />
      </motion.div>

      <div style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        background: "linear-gradient(to right, var(--base) 0%, rgba(245,246,245,0.85) 40%, rgba(245,246,245,0.2) 100%)",
      }} />
      <div style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        backgroundImage: "linear-gradient(rgba(107,158,17,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(107,158,17,0.018) 1px, transparent 1px)",
        backgroundSize: "64px 64px", animation: "gridDrift 30s linear infinite",
      }} />

      {/* Content with subtle parallax upward */}
      <motion.div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 800, margin: "0 auto", padding: "clamp(2rem,4vw,4rem) clamp(1rem,3vw,3rem)", y: contentY, opacity }}>
        <div>
          <div>
            <FadeUp>
              <div style={{
                fontFamily: "var(--app-font-mono)", fontSize: "0.6rem",
                letterSpacing: "0.26em", textTransform: "uppercase",
                color: "var(--acid)", display: "flex", alignItems: "center",
                gap: 12, marginBottom: "2rem",
              }}>
                <motion.span
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  style={{ width: 28, height: 1, background: "var(--acid)", flexShrink: 0, display: "block" }}
                />
                CATALISE.ME · SISTEMA OPERACIONAL DE PROCESSOS & IA
              </div>
            </FadeUp>

            {/* Word-by-word title reveal wrapped in semantic h1 */}
            <h1 style={{ marginBottom: "1.8rem", display: "block" }}>
              <WordReveal
                text="OPERA"
                delay={0.1}
                style={{
                  fontFamily: "var(--app-font-sans)", fontWeight: 800,
                  fontSize: "clamp(2.8rem,6vw,5.8rem)", lineHeight: 1.05, letterSpacing: "-0.03em",
                  color: "var(--text)",
                }}
              />
              <WordReveal
                text="OS"
                delay={0.18}
                style={{
                  fontFamily: "var(--app-font-sans)", fontWeight: 800,
                  fontSize: "clamp(2.8rem,6vw,5.8rem)", lineHeight: 1.05, letterSpacing: "-0.03em",
                  color: "var(--acid)",
                }}
              />
            </h1>

            <FadeUp delay={0.32}>
              <p style={{ fontFamily: "var(--app-font-sans)", fontSize: "clamp(0.95rem,1.6vw,1.1rem)", color: "var(--text-2)", lineHeight: 1.7, marginBottom: "2rem", maxWidth: "54ch" }}>
                Sua operação cresceu até onde dava sozinha. O <strong style={{ color: "var(--text)" }}>Opera OS</strong> é o sistema operacional definitivo que integra os seus processos com IA. Conectamos CRM, automações e agentes de atendimento em um único ecossistema unificado para acelerar seu negócio.
              </p>
            </FadeUp>
            <FadeUp delay={0.42}>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
                <BtnPrimary onClick={open}>Quero meu diagnóstico gratuito →</BtnPrimary>
                <BtnGhost href="#fases">Ver o método</BtnGhost>
              </div>
              <p style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.56rem", letterSpacing: "0.1em", color: "var(--border-md)" }}>
                Timeline: <em style={{ color: "var(--acid)", fontStyle: "normal" }}>10–12 semanas</em> · Integra{" "}
                <em style={{ color: "var(--acid)", fontStyle: "normal" }}>CRM comercial</em>, <em style={{ color: "var(--acid)", fontStyle: "normal" }}>automações</em> e <em style={{ color: "var(--acid)", fontStyle: "normal" }}>IA</em>
              </p>
            </FadeUp>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function Marquee() {
  const items = ["HOTELARIA", "CLÍNICAS & SAÚDE", "AUTOESCOLAS", "IMOBILIÁRIAS", "ACADEMIAS", "ESCRITÓRIOS JURÍDICOS", "CONTABILIDADES", "E-COMMERCE", "RESTAURANTES", "AGÊNCIAS", "ESCOLAS", "CLÍNICAS ESTÉTICAS"];
  const doubled = [...items, ...items];
  return (
    <div style={{ background: "var(--base-2)", borderTop: "1px solid var(--border-var)", borderBottom: "1px solid var(--border-var)", overflow: "hidden", padding: "1.2rem 0" }}>
      <div style={{ display: "flex", animation: "marquee 30s linear infinite", width: "max-content" }}>
        {doubled.map((item, i) => (
          <span key={i} style={{
            fontFamily: "var(--app-font-mono)", fontSize: "0.6rem",
            letterSpacing: "0.22em", textTransform: "uppercase",
            color: "var(--text-3)", whiteSpace: "nowrap", padding: "0 2.5rem",
            display: "flex", alignItems: "center", gap: "2.5rem",
          }}>
            <span style={{ color: "var(--text-2)" }}>{item}</span>
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--acid)", display: "inline-block", flexShrink: 0 }} />
          </span>
        ))}
      </div>
    </div>
  );
}

function DorCard({ num, title, desc, stat }: { num: string; title: string; desc: string; stat: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: hovered ? "var(--text)" : "var(--base)", padding: "1.5rem 1.2rem", transition: "background 0.18s ease", cursor: "default", height: "100%" }}
    >
      <h3 style={{ fontFamily: "var(--app-font-mono)", fontWeight: 700, fontSize: "0.95rem", color: hovered ? "var(--base)" : "var(--text)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em", transition: "color 0.18s ease" }}>{title}</h3>
      <p style={{ fontSize: "0.8rem", color: hovered ? "var(--base-2)" : "var(--text-2)", lineHeight: 1.6, fontFamily: "var(--app-font-mono)", transition: "color 0.18s ease" }}>{desc}</p>
      <div style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.6rem", letterSpacing: "0.1em", color: "var(--ember)", marginTop: "1rem", paddingTop: "0.8rem", borderTop: `1px solid ${hovered ? "rgba(255,255,255,0.15)" : "var(--border-var)"}`, transition: "border-color 0.18s ease" }}>{stat}</div>
    </div>
  );
}

function Problema() {
  const pains = [
    { num: "01", title: "Operação manual e reativa", desc: "Processos que dependem de memória, de planilha ou da presença física do dono. Se para uma hora, o negócio sente.", stat: "→ Média: 286h/ano perdidas em sistemas desconectados" },
    { num: "02", title: "Leads que somem sem resposta", desc: "Oportunidades chegam fora do horário, sem atendimento, e vão embora para o concorrente que respondeu primeiro.", stat: "→ Probabilidade de conversão cai 80% após 15 min" },
    { num: "03", title: "Decisões sem dado", desc: "O gestor toma decisões de preço, marketing e equipe baseado em intuição. Sem painel, sem histórico, sem projeção.", stat: "→ 67% dos gestores não têm KPIs atualizados em tempo real" },
    { num: "04", title: "Crescer aumenta o caos", desc: "Mais clientes, mais problemas. Mais receita, mais equipe. O negócio escala o trabalho — não o resultado.", stat: "→ Sem sistemas: cada cliente novo custa mais do que o anterior" },
    { num: "05", title: "Dono refém do próprio negócio", desc: "Abriu para ter liberdade. Virou o sistema central de tudo. Checkout às 12h. Sua cabeça nunca para.", stat: "→ O negócio deveria trabalhar por você. Não o contrário." },
  ];
  return (
    <section id="problema" style={{ background: "var(--base-2)", borderTop: "1px solid var(--border-var)", padding: "clamp(3rem,6vw,6rem) clamp(1rem,3vw,3rem)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div className="grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", marginBottom: "4rem" }}>
          <FadeUp>
            <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.58rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: "1rem", display: "block" }}>// O diagnóstico real</span>
            <h2 style={{ fontFamily: "var(--app-font-sans)", fontWeight: 800, fontSize: "clamp(2.5rem,6vw,5rem)", lineHeight: 0.95, letterSpacing: "-0.03em", color: "var(--text)" }}>
              Seu negócio<br />funciona.<br /><span style={{ color: "var(--acid)" }}>Mas precisa</span><br />se integrar
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div style={{ marginTop: "3rem" }}>
              <p style={{ fontSize: "0.92rem", color: "var(--text-3)", lineHeight: 1.85, maxWidth: "48ch", marginBottom: "1rem" }}>
                Existe uma diferença brutal entre um negócio que <strong style={{ color: "var(--text-2)", fontWeight: 500 }}>sobrevive do esforço diário</strong> e um negócio que <strong style={{ color: "var(--text-2)", fontWeight: 500 }}>funciona por sistemas inteligentes.</strong>
              </p>
              <p style={{ fontSize: "0.92rem", color: "var(--text-3)", lineHeight: 1.85, maxWidth: "48ch" }}>
                O primeiro depende de você para tudo. O segundo trabalha enquanto você dorme. A maioria dos negócios brasileiros ainda está no primeiro grupo — não por falta de vontade, mas por falta da arquitetura certa.
              </p>
            </div>
          </FadeUp>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))", gap: 1 }}>
          {pains.map((p, i) => <FadeUp key={i} delay={i * 0.07}><DorCard {...p} /></FadeUp>)}
        </div>
      </div>
    </section>
  );
}

function OQueE() {
  return (
    <section id="oque" style={{ background: "var(--base)", overflow: "hidden", position: "relative", borderTop: "1px solid var(--border-var)", padding: "clamp(3rem,6vw,6rem) clamp(1rem,3vw,3rem)" }}>
      <video src="/background.mp4" autoPlay loop muted playsInline
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.5, pointerEvents: "none", zIndex: 0 }}
      />
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(90deg, var(--base) 0%, rgba(245,246,245,0.75) 100%)", pointerEvents: "none", zIndex: 1 }} />
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(107,158,17,0.04) 0%, transparent 70%)", pointerEvents: "none", zIndex: 2 }} />

      <div style={{ position: "relative", zIndex: 3, maxWidth: 1400, margin: "0 auto" }}>
        <div className="grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }}>
          <div>
            <FadeUp>
              <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.58rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: "1rem", display: "block" }}>// O que é o OPERA OS</span>
            </FadeUp>
            <FadeUp delay={0.08}>
              <h2 style={{ fontFamily: "var(--app-font-sans)", fontWeight: 800, fontSize: "clamp(1.8rem,3.2vw,2.8rem)", lineHeight: 1.1, marginBottom: "1.5rem", letterSpacing: "-0.025em" }}>
                Uma infraestrutura<br />que integra e<br /><em style={{ color: "var(--acid)", fontStyle: "normal" }}>acelera</em> sua operação
              </h2>
            </FadeUp>
            <FadeUp delay={0.14}>
              <p style={{ fontSize: "0.92rem", color: "var(--text-3)", lineHeight: 1.85, marginBottom: "1rem", maxWidth: "50ch" }}>
                O OPERA OS é o sistema operacional com IA da Catalise.me. Em 10 a 12 semanas, instalamos a infraestrutura operacional completa no seu negócio — passando por diagnóstico, planejamento, CRM comercial, automações de processos, presença digital e agentes inteligentes de atendimento.
              </p>
              <p style={{ fontSize: "0.92rem", color: "var(--text-3)", lineHeight: 1.85, marginBottom: "1.5rem", maxWidth: "50ch" }}>
                <strong style={{ color: "var(--text-2)", fontWeight: 500 }}>O que entregamos não são ferramentas soltas.</strong> É um ecossistema integrado onde cada peça conversa com as outras — o agente de IA que atende pelo WhatsApp alimenta o CRM que orienta o time de vendas que reporta no dashboard que informa as decisões do gestor.
              </p>
            </FadeUp>
            <FadeUp delay={0.2}>
              <ul style={{ listStyle: "none", marginTop: "1.5rem" }}>
                {[
                  { icon: "✗", c: "var(--ember)", text: <span>Não é <strong>agência de marketing</strong> que entrega campanha e vai embora</span> },
                  { icon: "✗", c: "var(--ember)", text: <span>Não é <strong>consultoria</strong> que entrega relatório e você implementa sozinho</span> },
                  { icon: "✗", c: "var(--ember)", text: <span>Não é <strong>software isolado</strong> que resolve um problema e cria outros três</span> },
                  { icon: "✓", c: "var(--acid)", text: <span><strong>É o sistema operacional completo</strong> do seu negócio — construído, integrado e funcionando</span> },
                ].map((item, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "0.65rem 0", borderBottom: i < 3 ? "1px solid var(--border-var)" : "none", fontSize: "0.82rem" }}>
                    <span style={{ color: item.c, fontFamily: "var(--app-font-mono)", fontSize: "0.75rem", flexShrink: 0, marginTop: "0.1rem" }}>{item.icon}</span>
                    <span style={{ color: "var(--text-3)", lineHeight: 1.5 }}>{item.text}</span>
                  </li>
                ))}
              </ul>
            </FadeUp>
          </div>

          <FadeUp delay={0.2}>
            <div style={{
              background: "var(--base-2)",
              border: "1px solid var(--border-var)",
              padding: "2.5rem",
              position: "relative",
              overflow: "hidden",
            }}>
              <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.58rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--acid)", marginBottom: "1rem", display: "block" }}>* Sistema Operacional com IA</span>
              <div style={{ fontFamily: "var(--app-font-sans)", fontWeight: 800, fontSize: "clamp(1.8rem,3.5vw,2.8rem)", color: "var(--text)", lineHeight: 1, marginBottom: "1.2rem", letterSpacing: "-0.025em" }}>
                OPERA<br /><span style={{ color: "var(--acid)" }}>OS</span>
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-3)", lineHeight: 1.8, marginBottom: "1.5rem" }}>
                Um sistema operacional não é um app. <strong style={{ color: "var(--text-2)", fontWeight: 500 }}>É a infraestrutura que faz tudo funcionar junto.</strong> O OPERA OS instala essa infraestrutura no seu negócio — com IA em cada camada que importa.
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 5 }}>
                {[
                  ["Presença digital", ": site, blog, páginas de venda otimizadas"],
                  ["Agentes de IA", ": atendimento 24/7 treinado no seu negócio"],
                  ["CRM Agêntico", ": kanban comercial, funil, dashboard"],
                  ["Automações", ": jornada completa do cliente automatizada"],
                  ["Stack de atendimento", ": Atendimento integrado e configurado"],
                  ["Funil de vendas", ": estrutura completa de captação e conversão"],
                  ["Estratégia de canais", ": direto vs intermediários otimizado"],
                  ["Treinamento da equipe", ": onboarding e documentação completos"],
                ].map(([bold, rest], i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: "0.76rem", color: "var(--text-3)", lineHeight: 1.4 }}>
                    <span style={{ color: "var(--acid)", flexShrink: 0, fontSize: "0.68rem", marginTop: "0.1rem" }}>✓</span>
                    <span><strong style={{ color: "var(--text-2)", fontWeight: 500 }}>{bold}</strong>{rest}</span>
                  </li>
                ))}
              </ul>
              <div style={{ position: "absolute", bottom: "-1rem", right: "-0.5rem", fontFamily: "var(--app-font-display)", fontSize: "7rem", color: "rgba(107,158,17,0.04)", lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>OS</div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

function FaseRow({ letter, name, week, tagline, desc, items, entregavel, entregavelDesc, index }: {
  letter: string; name: string; week: string; tagline: string;
  desc: React.ReactNode; items: string[]; entregavel: string; entregavelDesc: string; index: number;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <FadeUp delay={index * 0.07}>
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        className="fase-row"
        style={{
          display: "grid", gridTemplateColumns: "100px 1fr 280px", gap: "3rem",
          padding: "2.5rem 0", borderBottom: "1px solid var(--border-var)",
          paddingLeft: hovered ? "0.5rem" : 0, transition: "padding-left 0.3s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div>
          <div style={{ fontFamily: "var(--app-font-display)", fontSize: "clamp(3.5rem,7vw,6rem)", color: hovered ? "var(--acid)" : "var(--border-md)", lineHeight: 0.85, transition: "color 0.3s ease" }}>{letter}</div>
          <div style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.52rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--border-md)", marginTop: 4 }}>{week}</div>
        </div>
        <div>
          <h3 style={{ fontFamily: "var(--app-font-sans)", fontWeight: 700, fontSize: "clamp(0.85rem,1.5vw,1rem)", color: "var(--text)", marginBottom: "0.3rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>{name}</h3>
          <div style={{ fontFamily: "var(--app-font-sans)", fontStyle: "italic", fontSize: "clamp(0.8rem,1.3vw,0.92rem)", color: "var(--acid)", marginBottom: "1rem", fontWeight: 300 }}>{tagline}</div>
          <p style={{ fontSize: "0.82rem", color: "var(--text-3)", lineHeight: 1.8 }}>{desc}</p>
          <ul style={{ listStyle: "none", marginTop: "1rem" }}>
            {items.map((item, i) => (
              <li key={i} style={{ fontSize: "0.76rem", color: "var(--text-3)", padding: "0.3rem 0", display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ color: "var(--acid-dim)", flexShrink: 0, fontFamily: "var(--app-font-mono)" }}>—</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.52rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--border-md)", marginBottom: "0.8rem", display: "block" }}>Entregável</span>
          <div style={{ background: "var(--acid-pale)", border: "1px solid var(--acid-pale-border)", padding: "1rem 1.2rem" }}>
            <div style={{ fontWeight: 600, fontSize: "0.82rem", color: "var(--acid)", marginBottom: "0.35rem" }}>{entregavel}</div>
            <p style={{ fontSize: "0.72rem", color: "var(--text-3)", lineHeight: 1.6 }}>{entregavelDesc}</p>
          </div>
        </div>
      </div>
    </FadeUp>
  );
}

function Fases() {
  const fases = [
    {
      letter: "O", name: "Organização", week: "Sem. 1–2",
      tagline: '"Entendemos como seu negócio realmente funciona."',
      desc: <span>Diagnóstico profundo da operação atual. Mapeamos cada processo — do primeiro contato do cliente até o pós-venda. Auditamos presença digital, canais de atendimento, ferramentas em uso e fluxos internos. <strong style={{ color: "var(--text-2)", fontWeight: 500 }}>Identificamos e classificamos todos os gargalos por impacto financeiro real.</strong></span>,
      items: ["Entrevistas com gestor e equipe-chave", "Mapeamento completo da jornada do cliente", "Auditoria digital: site, redes, canais, OTAs", "Identificação e priorização de gargalos"],
      entregavel: "Relatório de Organização",
      entregavelDesc: "Mapa visual completo da operação com todos os gargalos identificados, classificados por impacto e priorizados para ação.",
    },
    {
      letter: "P", name: "Planejamento", week: "Sem. 2–3",
      tagline: '"Definimos o que mudar, em que ordem e com que resultado."',
      desc: <span>Com os gargalos mapeados, definimos o escopo completo do OPERA OS. <strong style={{ color: "var(--text-2)", fontWeight: 500 }}>A ordem de implementação importa tanto quanto o que implementar</strong> — priorizamos por impacto financeiro imediato e viabilidade técnica, garantindo ROI desde as primeiras semanas.</span>,
      items: ["Definição do escopo completo de entregáveis", "Priorização por impacto financeiro e viabilidade", "Definição de KPIs e metas mensuráveis", "Roadmap detalhado das 10–12 semanas"],
      entregavel: "Plano Estratégico do OPERA OS",
      entregavelDesc: "Documento mestre com escopo fechado, timeline, KPIs projetados e ROI esperado por iniciativa. O contrato operacional do projeto.",
    },
    {
      letter: "E", name: "Estratégia", week: "Sem. 3–4",
      tagline: '"Desenhamos a arquitetura completa antes de escrever uma linha de código."',
      desc: <span>Blueprint técnico e operacional de todos os sistemas. <strong style={{ color: "var(--text-2)", fontWeight: 500 }}>IA sem estratégia é automação de caos.</strong> Aqui definimos quais agentes, quais automações, como tudo se conecta — e como cada peça serve ao objetivo de negócio, não à tecnologia.</span>,
      items: ["Arquitetura de IA: agentes, fluxos e integrações", "Estratégia de conteúdo: site, blog, páginas de venda", "Estrutura do funil de captação e conversão", "Design do Matika para o processo comercial específico"],
      entregavel: "Arquitetura do OPERA OS",
      entregavelDesc: "Blueprint visual e técnico completo — fluxos, integrações, responsabilidades e sequência de implantação.",
    },
    {
      letter: "R", name: "Realização", week: "Sem. 4–8",
      tagline: '"Aqui o negócio muda. O que era manual vira sistema."',
      desc: <span>A fase mais intensa. Construímos, integramos e ativamos todos os sistemas. Site vai ao ar, agente de IA entra em operação, Matika é configurado, automações começam a rodar. <strong style={{ color: "var(--text-2)", fontWeight: 500 }}>A equipe é treinada. A documentação é entregue. O negócio passa a operar de forma catalisada.</strong></span>,
      items: ["Construção e ativação de todos os entregáveis", "Integração de todos os sistemas entre si", "Testes de funcionamento e validação", "Onboarding da equipe e documentação operacional"],
      entregavel: "OPERA OS Ativo",
      entregavelDesc: "Todos os sistemas funcionando, integrados e testados. Equipe treinada. Documentação entregue.",
    },
    {
      letter: "A", name: "Afinação", week: "Sem. 8–10",
      tagline: '"Nenhum sistema sai perfeito do papel. A realidade calibra o que a teoria planejou."',
      desc: <span>Monitoramos os primeiros 30 dias de operação real. Ajustamos prompts do agente de IA com base em conversas reais. Calibramos automações, revisamos KPIs e <strong style={{ color: "var(--text-2)", fontWeight: 500 }}>entregamos o sistema no ponto exato</strong> — funcionando para o seu negócio específico, não para um caso genérico.</span>,
      items: ["Ajuste fino dos agentes de IA com dados reais", "Calibração de automações e fluxos", "Revisão de KPIs vs projeção", "Validação final e entrega do sistema certificado"],
      entregavel: "Relatório de Afinação + Sistema Certificado",
      entregavelDesc: "OPERA OS validado em produção real. Relatório completo de performance vs projeção.",
    },
  ];

  return (
    <section id="fases" style={{ background: "var(--base-2)", borderTop: "1px solid var(--border-var)", padding: "clamp(3rem,6vw,6rem) clamp(1rem,3vw,3rem)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <FadeUp>
          <div style={{ marginBottom: "4rem" }}>
            <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.58rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-3)", display: "block", marginBottom: "1rem" }}>// O método</span>
            <h2 style={{ fontFamily: "var(--app-font-sans)", fontWeight: 900, fontSize: "clamp(2.8rem,7vw,7rem)", lineHeight: 0.92, letterSpacing: "-0.04em" }}>
              O MÉTODO<br /><span style={{ color: "var(--acid)" }}>OPERA.</span>
            </h2>
            <p style={{ fontSize: "0.92rem", color: "var(--text-3)", lineHeight: 1.85, maxWidth: "50ch", marginTop: "1.2rem" }}>
              Cinco fases. Uma transformação completa. Cada etapa tem entregáveis claros, timeline definido e resultado mensurável. Nada de processo interminável sem fim à vista.
            </p>
          </div>
        </FadeUp>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {fases.map((fase, i) => <FaseRow key={i} {...fase} index={i} />)}
        </div>
      </div>
    </section>
  );
}

function EntCat({ icon, name, items }: { icon: string; name: string; items: string[] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: hovered ? "var(--text)" : "var(--base)", padding: "1.5rem 1.2rem", transition: "background 0ms", cursor: "default", height: "100%" }}
    >
      <div style={{ width: 32, height: 32, marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${hovered ? "var(--base)" : "var(--border-md)"}`, fontSize: "1rem", transition: "border-color 0ms" }}>{icon}</div>
      <h3 style={{ fontFamily: "var(--app-font-mono)", fontWeight: 700, fontSize: "0.85rem", color: hovered ? "var(--base)" : "var(--text)", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em", transition: "color 0ms" }}>{name}</h3>
      <ul style={{ listStyle: "none" }}>
        {items.map((item, i) => (
          <li key={i} style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.76rem", color: hovered ? "var(--base)" : "var(--text-3)", padding: "0.4rem 0", borderBottom: i < items.length - 1 ? `1px solid ${hovered ? "rgba(255,255,255,0.15)" : "var(--border-var)"}` : "none", display: "flex", gap: 8, alignItems: "flex-start", transition: "color 0ms, border-color 0ms" }}>
            <span style={{ color: hovered ? "var(--base)" : "var(--acid)", flexShrink: 0, fontSize: "0.72rem", marginTop: "0.05rem", transition: "color 0ms" }}>{">"}</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Entregaveis() {
  const cats = [
    { icon: "🌐", name: "Presença Digital", items: ["Site otimizado para SEO e conversão", "Blog estruturado com primeiros conteúdos", "Páginas de venda por produto/serviço", "GEO — visibilidade em ChatGPT e Gemini", "Schema Markup e dados estruturados"] },
    { icon: "🤖", name: "Inteligência com IA", items: ["Agente de IA no WhatsApp (24/7)", "Base de conhecimento RAG treinada", "Qualificação automática de leads", "Respostas contextuais sem alucinação", "Análise de sentimento e alertas"] },
    { icon: "📋", name: "CRM Agêntico", items: ["Kanban comercial configurado", "Funil de vendas estruturado", "Dashboard de performance em tempo real", "Integração com OTAs e canais", "Agenda de follow-up automatizada"] },
    { icon: "⚡", name: "Automações", items: ["Confirmação automática de reserva/pedido", "Fluxos de pré-atendimento e boas-vindas", "Pesquisa de satisfação automatizada", "Reativação de clientes inativos", "Solicitação de avaliação pós-serviço"] },
    { icon: "💬", name: "Stack de Atendimento", items: ["Hub de atendimento integrado", "Histórico unificado de conversas", "Múltiplos canais num painel só", "Distribuição automática de atendimentos", "Relatórios de atendimento por agente"] },
    { icon: "🎯", name: "Estratégia e Treinamento", items: ["Planejamento estratégico completo", "Estrutura de funil de captação", "Onboarding da equipe (presencial/remoto)", "Documentação operacional completa", "Playbook de uso dos sistemas"] },
  ];

  return (
    <section id="entregaveis" style={{ background: "var(--base)", borderTop: "1px solid var(--border-var)", padding: "clamp(3rem,6vw,6rem) clamp(1rem,3vw,3rem)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", marginBottom: "4rem" }}>
          <FadeUp>
            <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.58rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: "1rem", display: "block" }}>// O que você recebe</span>
            <h2 style={{ fontFamily: "var(--app-font-sans)", fontWeight: 800, fontSize: "clamp(2.2rem,5vw,4.5rem)", lineHeight: 0.95, letterSpacing: "-0.03em" }}>
              Tudo que<br />seu negócio<br />precisa para<br /><span style={{ color: "var(--acid)" }}>acelerar.</span>
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p style={{ fontSize: "0.9rem", color: "var(--text-3)", lineHeight: 1.85, maxWidth: "48ch", marginTop: "3rem" }}>
              O escopo final é definido na Fase O — porque cada negócio tem lacunas diferentes. Mas o OPERA OS sempre entrega o <strong style={{ color: "var(--text-2)", fontWeight: 500 }}>ecossistema completo</strong>: presença, inteligência, automação e operação integrados numa única arquitetura.
            </p>
          </FadeUp>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))", gap: 1 }}>
          {cats.map((cat, i) => <FadeUp key={i} delay={i * 0.06}><EntCat {...cat} /></FadeUp>)}
        </div>
      </div>
    </section>
  );
}

function AnteDepois() {
  const rows = [
    ["Opera no improviso. Cada dia é uma surpresa.", "Opera por sistemas.", "Fluxos inteligentes que rodam sem supervisão."],
    ["Decisões baseadas em intuição e experiência pessoal.", "Dado em tempo real.", "Dashboard vivo para cada decisão relevante."],
    ["Leads somem fora do horário comercial sem resposta.", "IA atende 24/7.", "Nenhum lead perde-se por falta de resposta."],
    ["Conhecimento preso nas pessoas — se saem, vai com elas.", "Conhecimento na estrutura.", "Sistemas operam independente de quem está."],
    ["Crescer significa mais trabalho, mais equipe, mais caos.", "Escala sem caos.", "Mais clientes, mesma equipe, mais resultado."],
    ["Dono presente em tudo. Negócio para quando ele para.", "Negócio autônomo.", "Funciona enquanto o dono descansa ou cresce."],
    ["Ferramentas soltas que não conversam entre si.", "Ecossistema integrado.", "Cada peça alimenta e potencializa as outras."],
    ["Relatórios do mês passado quando já é tarde para mudar.", "Visibilidade em tempo real.", "Decisão informada antes que o problema aconteça."],
  ];

  return (
    <section id="antesdepois" style={{ background: "var(--base-2)", borderTop: "1px solid var(--border-var)", padding: "clamp(3rem,6vw,6rem) clamp(1rem,3vw,3rem)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <FadeUp>
          <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.58rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: "1rem", display: "block" }}>// A transformação real</span>
          <h2 style={{ fontFamily: "var(--app-font-sans)", fontWeight: 800, fontSize: "clamp(2.2rem,5vw,4.5rem)", lineHeight: 0.95, letterSpacing: "-0.03em", marginBottom: "3rem" }}>
            Antes e<br /><span style={{ color: "var(--acid)" }}>depois</span><br />do OPERA OS.
          </h2>
        </FadeUp>
        <FadeUp delay={0.1}>
          <div className="antedepois-grid" style={{ display: "grid", gridTemplateColumns: "1fr 60px 1fr", gap: 0 }}>
            <div>
              <div style={{ padding: "1.2rem 1.8rem", fontFamily: "var(--app-font-mono)", fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", borderBottom: "2px solid var(--ember)", background: "var(--ember-pale)", color: "var(--ember)" }}>✗ Antes do OPERA OS</div>
              {rows.map(([antes], i) => (
                <div key={i} style={{ padding: "0.85rem 1.8rem", borderBottom: i < rows.length - 1 ? "1px solid var(--border-var)" : "none", fontSize: "0.8rem", color: "var(--text-3)", lineHeight: 1.55 }}>{antes}</div>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "1.2rem" }}>
              <span style={{ fontFamily: "var(--app-font-sans)", fontWeight: 900, fontSize: "1.4rem", color: "var(--acid)", lineHeight: 1 }}>→</span>
            </div>
            <div>
              <div style={{ padding: "1.2rem 1.8rem", fontFamily: "var(--app-font-mono)", fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", borderBottom: "2px solid var(--acid)", background: "var(--acid-pale)", color: "var(--acid)" }}>✓ Depois do OPERA OS</div>
              {rows.map(([, bold, rest], i) => (
                <div key={i} style={{ padding: "0.85rem 1.8rem", borderBottom: i < rows.length - 1 ? "1px solid var(--border-var)" : "none", fontSize: "0.8rem", color: "var(--text-2)", lineHeight: 1.55 }}>
                  <strong style={{ color: "var(--acid)", fontWeight: 600, display: "block", marginBottom: "0.1rem" }}>{bold}</strong>
                  {rest}
                </div>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

function ParaQuem() {
  const sim = [
    ["Negócio com operação consolidada", "Você já vende, já tem clientes — mas o processo é manual e depende de você para tudo."],
    ["Faturamento a partir de R$100.000/mês", "O investimento no OPERA OS é recuperado nos primeiros 60–90 dias de operação catalisada."],
    ["Decisor comprometido com a transformação", "Não buscamos clientes que querem testar. Buscamos líderes que querem transformar."],
    ["Equipe de ao menos 2 pessoas", "O OPERA OS potencializa equipes — não substitui a operação humana do negócio."],
    ["Setor de serviços B2C ou B2B", "Hotelaria, clínicas, autoescolas, imobiliárias, educação, jurídico e outros nichos de serviço."],
  ];
  const nao = [
    ["Negócio em fase de validação", "Se ainda está testando o modelo de negócio, o OPERA OS não é a prioridade agora."],
    ["Expectativa de resultado imediato", "Transformação real leva 10–12 semanas. Se precisa de resultado em 2 semanas, essa não é a solução."],
    ["Resistência à mudança de processo", "O OPERA OS muda como o negócio opera. Quem não quer mudar não deve contratar."],
    ["Busca por solução pontual", "Se o problema é só o site ou só o WhatsApp, temos soluções menores. O OPERA OS é transformação total."],
  ];

  return (
    <section id="paraquem" style={{ background: "var(--base)", borderTop: "1px solid var(--border-var)", padding: "clamp(3rem,6vw,6rem) clamp(1rem,3vw,3rem)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <FadeUp>
          <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.58rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: "2rem", display: "block" }}>// Fit do produto</span>
        </FadeUp>
        <div className="grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem" }}>
          <FadeUp delay={0.08}>
            <h3 style={{ fontFamily: "var(--app-font-sans)", fontWeight: 900, fontSize: "clamp(1.6rem,3vw,2.5rem)", lineHeight: 0.95, marginBottom: "2.5rem", letterSpacing: "-0.02em", color: "var(--acid)" }}>O OPERA OS<br />é para você.</h3>
            <ul style={{ listStyle: "none" }}>
              {sim.map(([strong, desc], i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "0.85rem 0", borderBottom: "1px solid var(--border-var)", fontSize: "0.85rem", color: "var(--text-3)", lineHeight: 1.5 }}>
                  <span style={{ color: "var(--acid)", fontSize: "0.75rem", flexShrink: 0, marginTop: "0.15rem", fontFamily: "var(--app-font-mono)" }}>✓</span>
                  <div><strong style={{ color: "var(--text-2)", fontWeight: 600, display: "block" }}>{strong}</strong>{desc}</div>
                </li>
              ))}
            </ul>
          </FadeUp>
          <FadeUp delay={0.16}>
            <h3 style={{ fontFamily: "var(--app-font-sans)", fontWeight: 900, fontSize: "clamp(1.6rem,3vw,2.5rem)", lineHeight: 0.95, marginBottom: "2.5rem", letterSpacing: "-0.02em", color: "var(--border-md)", textDecoration: "line-through", textDecorationColor: "var(--ember)", textDecorationThickness: "2px" }}>Não é<br />para você.</h3>
            <ul style={{ listStyle: "none" }}>
              {nao.map(([strong, desc], i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "0.85rem 0", borderBottom: "1px solid var(--border-var)", fontSize: "0.85rem", color: "var(--text-3)", lineHeight: 1.5 }}>
                  <span style={{ color: "var(--ember)", fontSize: "0.75rem", flexShrink: 0, marginTop: "0.15rem", fontFamily: "var(--app-font-mono)" }}>✗</span>
                  <div><strong style={{ color: "var(--text-2)", fontWeight: 600, display: "block" }}>{strong}</strong>{desc}</div>
                </li>
              ))}
            </ul>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

function Investimento() {
  return (
    <section id="investimento" style={{ background: "#0b0d0b", color: "var(--base)", overflow: "hidden", position: "relative", padding: "clamp(3rem,6vw,6rem) clamp(1rem,3vw,3rem)" }}>
      <div style={{ position: "absolute", right: "-2rem", top: "50%", transform: "translateY(-50%)", fontFamily: "var(--app-font-display)", fontSize: "clamp(8rem,16vw,20rem)", color: "rgba(255,255,255,0.02)", lineHeight: 1, pointerEvents: "none", whiteSpace: "nowrap", userSelect: "none" }}>OPERA OS</div>
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1400, margin: "0 auto" }}>
        <div className="grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }}>
          <FadeUp>
            <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: "1rem", display: "block" }}>// Investimento</span>
            <h2 style={{ fontFamily: "var(--app-font-sans)", fontWeight: 800, fontSize: "clamp(1.6rem,3vw,2.8rem)", lineHeight: 1.1, color: "var(--base)", marginBottom: "1.5rem", letterSpacing: "-0.025em" }}>
              O 'sistema nervoso'<br />que conecta todos<br />os setores com IA
            </h2>
            <div style={{ margin: "2rem 0" }}>
              <div style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", textDecoration: "line-through", marginBottom: "0.3rem", letterSpacing: "0.06em", filter: "blur(6px)", userSelect: "none", pointerEvents: "none" }}>De: projetos similares no mercado R$80k–R$120k</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 4, filter: "blur(12px)", userSelect: "none", pointerEvents: "none" }}>
                <span style={{ fontFamily: "var(--app-font-sans)", fontWeight: 900, fontSize: "clamp(2rem,5vw,4rem)", color: "var(--base)", letterSpacing: "-0.04em", lineHeight: 1 }}>R$25k</span>
                <span style={{ fontFamily: "var(--app-font-sans)", fontWeight: 900, fontSize: "clamp(1.2rem,3vw,2.2rem)", color: "rgba(255,255,255,0.5)", letterSpacing: "-0.03em", lineHeight: 1.2 }}>– R$40k</span>
              </div>
              <p style={{ fontFamily: "var(--app-font-sans)", fontWeight: 600, fontSize: "0.95rem", color: "var(--base)", marginTop: "1rem", maxWidth: "40ch", lineHeight: 1.6 }}>Orçamento após diagnóstico personalizado</p>
            </div>
            <ul style={{ listStyle: "none", marginBottom: "2rem" }}>
              {[
                <span>Todas as <strong>5 fases do método OPERA</strong></span>,
                <span><strong>CRM agêntico</strong> configurado</span>,
                <span><strong>Agentes de IA</strong> treinados no seu negócio</span>,
                <span><strong>Site + páginas de venda</strong> otizados</span>,
                <span><strong>Automações</strong> completas</span>,
                <span><strong>Hub de atendimento</strong> configurado e integrado</span>,
                <span><strong>Treinamento da equipe</strong> e documentação</span>,
                <span>Suporte durante toda a implantação</span>,
              ].map((item, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "0.5rem 0", borderBottom: "1px solid rgba(255,255,255,0.1)", fontSize: "0.82rem", color: "rgba(255,255,255,0.65)" }}>
                  <span style={{ color: "var(--acid)", flexShrink: 0, marginTop: "0.05rem" }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <ModalOpenBtn />
          </FadeUp>

          <FadeUp delay={0.15}>
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {[
                { tag: "Diagnóstico gratuito", title: "Fase O — Organização", desc: "Para clientes qualificados, o diagnóstico completo da operação é gratuito. Mapeamos seus processos, identificamos os gargalos e apresentamos o plano do OPERA OS personalizado para o seu negócio.", price: "Grátis" },
                { tag: "Implantação completa", title: "OPERA OS — Projeto Completo", desc: "As 5 fases completas. Todos os entregáveis. Sistema operando ao final das 10–12 semanas. Inclui CRM agêntico, agentes de IA, automações, site, funil e treinamento.", price: "Orçamento sob consulta" },
                { tag: "Pós-implantação", title: "Retainer de Evolução", desc: "Manutenção, otimização contínua dos agentes, novos fluxos, relatórios mensais e suporte consultivo. O sistema evolui junto com o negócio.", price: "Orçamento sob consulta" },
              ].map((card, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.03)", padding: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.52rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", display: "block", marginBottom: "0.5rem" }}>{card.tag}</span>
                  <div style={{ fontFamily: "var(--app-font-sans)", fontWeight: 700, fontSize: "0.92rem", color: "var(--base)", marginBottom: "0.5rem" }}>{card.title}</div>
                  <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: "0.8rem" }}>{card.desc}</p>
                  <div style={{ fontFamily: "var(--app-font-sans)", fontWeight: 800, fontSize: "clamp(0.9rem,2vw,1.3rem)", color: "var(--base)", letterSpacing: "-0.02em" }}>{card.price}</div>
                </div>
              ))}
              <div style={{ background: "rgba(255,255,255,0.02)", padding: "1.5rem", border: "1px dashed rgba(255,255,255,0.1)" }}>
                <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.52rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", display: "block", marginBottom: "0.5rem" }}>Não está pronto para o OPERA OS?</span>
                <div style={{ fontFamily: "var(--app-font-sans)", fontWeight: 700, fontSize: "0.88rem", color: "var(--base)", marginBottom: "0.4rem" }}>Consultoria Estratégica de 1 Semana</div>
                <p style={{ fontSize: "0.76rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: "0.6rem" }}>Uma semana de imersão no seu negócio. Diagnóstico, mapeamento de processos e plano de ação detalhado para você implementar no ritmo que fizer sentido.</p>
                <div style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.68rem", color: "rgba(255,255,255,0.55)", letterSpacing: "0.08em" }}>R$2.500 · Crédito integral na contratação do OPERA OS</div>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

function Processo() {
  const steps = [
    { num: "01", title: "Solicite o diagnóstico", desc: "Preencha o formulário ou fale pelo WhatsApp. Nossa equipe entra em contato em até 24h para qualificar e agendar." },
    { num: "02", title: "Reunião de diagnóstico", desc: "Sessão de 90 minutos onde entendemos sua operação em profundidade. Gratuita para perfis qualificados." },
    { num: "03", title: "Apresentação do plano", desc: "Apresentamos o plano completo do OPERA OS com escopo, timeline, KPIs e investimento definidos para sua realidade." },
    { num: "04", title: "Aprovação e início", desc: "Contrato assinado, cronograma definido. A Fase O começa na semana seguinte à aprovação." },
    { num: "05", title: "10–12 semanas depois", desc: "Seu negócio opera de forma catalisada. Sistemas funcionando, equipe treinada, resultados mensuráveis." },
  ];

  return (
    <section id="processo" style={{ background: "var(--base-2)", borderTop: "1px solid var(--border-var)", padding: "clamp(3rem,6vw,6rem) clamp(1rem,3vw,3rem)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <FadeUp>
          <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.58rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: "1rem", display: "block" }}>// Como começar</span>
          <h2 style={{ fontFamily: "var(--app-font-sans)", fontWeight: 800, fontSize: "clamp(2.2rem,5vw,4rem)", lineHeight: 0.95, letterSpacing: "-0.03em", marginBottom: "3rem" }}>
            Próximos<br /><span style={{ color: "var(--acid)" }}>passos.</span>
          </h2>
        </FadeUp>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: "2rem" }}>
          {steps.map((step, i) => (
            <FadeUp key={i} delay={i * 0.07}>
              <div style={{ borderTop: `2px solid ${i === 0 ? "var(--acid)" : "var(--border-var)"}`, paddingTop: "1.5rem" }}>
                <div style={{ fontFamily: "var(--app-font-mono)", fontSize: "2rem", fontWeight: 700, color: "var(--border-md)", marginBottom: "1rem", letterSpacing: "0.1em" }}>{step.num}</div>
                <h3 style={{ fontFamily: "var(--app-font-sans)", fontWeight: 700, fontSize: "0.92rem", color: "var(--text)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>{step.title}</h3>
                <p style={{ fontSize: "0.8rem", color: "var(--text-3)", lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const items = [
    { q: "Funciona para qualquer segmento de negócio?", a: "O OPERA OS foi desenhado para negócios de serviços — hotelaria, clínicas, autoescolas, imobiliárias, educação, jurídico e outros segmentos onde o atendimento, o funil de vendas e a operação são os gargalos centrais. Se você vende serviços e tem operação consolidada, o OPERA OS se adapta ao seu contexto." },
    { q: "Minha equipe precisa saber de tecnologia?", a: <span>Não. Todo o onboarding é feito pela Catalise.me. A equipe recebe treinamento prático no uso de cada sistema, e toda a documentação é entregue em linguagem operacional — não técnica. <strong>Você não precisa de TI para usar o OPERA OS.</strong></span> },
    { q: "O que acontece depois das 10–12 semanas?", a: "O OPERA OS é entregue funcionando e documentado. Você pode operar de forma independente. Para clientes que desejam evolução contínua — novos agentes, novas automações, otimização dos sistemas, relatórios mensais — oferecemos o Retainer de Evolução (sob consulta), que inclui a licença do CRM agêntico." },
    { q: "O CRM agêntico tem custo adicional?", a: "Não durante a implantação. A licença do CRM é inclusa no OPERA OS e continua inclusa no Retainer de Evolução. Se após a implantação você optar por operar sem o retainer, discutimos a continuidade da licença separadamente." },
    { q: "Como funciona a definição de valores do projeto?", a: "O escopo é definido na Fase O — porque cada negócio tem lacunas diferentes. Uma empresa sem site, sem CRM e sem nenhuma automação precisa de mais camadas do que uma que já tem parte da estrutura. O investimento é fechado sob medida na apresentação do plano, antes de qualquer comprometimento financeiro da sua parte." },
    { q: "E se eu não me sentir pronto para o OPERA OS completo?", a: <span>Temos a <strong>Consultoria Estratégica de 1 Semana</strong>: uma imersão no seu negócio que entrega diagnóstico, mapeamento de processos e plano de ação por R$2.500. Se você contratar o OPERA OS depois, esse valor é creditado integralmente.</span> },
  ];

  return (
    <section id="faq" style={{ background: "var(--base)", borderTop: "1px solid var(--border-var)", padding: "clamp(3rem,6vw,6rem) clamp(1rem,3vw,3rem)" }}>
      <div className="faq-grid" style={{ maxWidth: 1400, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "4rem", alignItems: "start" }}>
        <FadeUp>
          <h2 style={{ fontFamily: "var(--app-font-sans)", fontWeight: 800, fontSize: "clamp(2.2rem,5vw,4rem)", lineHeight: 0.95, letterSpacing: "-0.03em" }}>
            Dúvidas<br /><span style={{ color: "var(--acid)" }}>Frequentes.</span>
          </h2>
        </FadeUp>
        <FadeUp delay={0.1}>
          <div>
            {items.map((item, i) => (
              <div key={i} style={{ borderBottom: "1px solid var(--border-var)" }}>
                <button onClick={() => setOpen(open === i ? null : i)}
                  style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.3rem 0", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--app-font-sans)", fontWeight: 500, fontSize: "0.92rem", color: open === i ? "var(--acid)" : "var(--text)", textAlign: "left", gap: 16, transition: "color 0.2s ease" }}
                >
                  <span>{item.q}</span>
                  <span style={{ fontFamily: "var(--app-font-mono)", fontSize: "1.1rem", color: "var(--acid)", flexShrink: 0, transform: open === i ? "rotate(45deg)" : "none", transition: "transform 0.3s ease", display: "inline-block" }}>+</span>
                </button>
                <motion.div initial={false} animate={{ height: open === i ? "auto" : 0, opacity: open === i ? 1 : 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} style={{ overflow: "hidden" }}>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-3)", lineHeight: 1.8, paddingBottom: "1.3rem" }}>{item.a}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

function CtaFinal() {
  const { open } = useModal();
  return (
    <section id="ctafinal" style={{ background: "var(--base)", borderTop: "1px solid var(--border-var)", position: "relative", overflow: "hidden", padding: "clamp(5rem,10vw,10rem) clamp(1rem,3vw,3rem)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", textAlign: "center" }}>
      {[1, 2, 3, 4].map(i => (
        <div key={i} style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: `${i * 200}px`, height: `${i * 200}px`, border: "1px solid rgba(168,232,64,0.06)", borderRadius: "50%", pointerEvents: "none", animation: `ringPulse ${3 + i}s ease-out ${i * 0.8}s infinite` }} />
      ))}
      <div style={{ position: "relative", zIndex: 2 }}>
        <FadeUp>
          <p style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.6rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: "1.5rem" }}>A catálise começa aqui</p>
          <h2 style={{ fontFamily: "var(--app-font-sans)", fontWeight: 800, fontSize: "clamp(2.2rem,5vw,4rem)", lineHeight: 0.95, letterSpacing: "-0.03em", marginBottom: "2rem" }}>
            Sua empresa já tem corpo.<br /><span style={{ color: "var(--acid)" }}>Vamos instalar o sistema nervoso.</span>
          </h2>
          <p style={{ fontSize: "clamp(0.9rem,1.5vw,1rem)", color: "var(--text-3)", lineHeight: 1.7, marginBottom: "2.5rem" }}>
            Diagnóstico gratuito para perfis qualificados.<br />
            90 minutos que mudam a forma como você vê sua operação.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            <BtnPrimary onClick={open}>Quero meu diagnóstico gratuito →</BtnPrimary>
            <BtnGhost href={WHATSAPP_URL} target="_blank">Falar pelo WhatsApp</BtnGhost>
          </div>
          <p style={{ fontFamily: "var(--app-font-mono)", fontSize: "0.56rem", letterSpacing: "0.1em", color: "var(--border-md)" }}>
            Sem compromisso · Resposta em até 24h · <em style={{ fontStyle: "normal", color: "var(--acid)" }}>catalise.me</em>
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

function ModalOpenBtn({ label = "Quero meu diagn\u00f3stico gratuito \u2192" }: { label?: string }) {
  const { open } = useModal();
  return (
    <button onClick={open} style={{ display: "inline-flex", alignItems: "center", fontFamily: "var(--app-font-mono)", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", background: "var(--acid)", color: "#0b0d0b", padding: "13px 30px", fontWeight: 600, border: "none", cursor: "pointer" }}>
      {label}
    </button>
  );
}

function BtnPrimary({ children, href, target, onClick }: { children: React.ReactNode; href?: string; target?: string; onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);
  const style = { display: "inline-flex" as const, alignItems: "center" as const, gap: 8, fontFamily: "var(--app-font-mono)", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase" as const, background: hovered ? "var(--acid-2)" : "var(--acid)", color: "var(--base)", padding: "13px 30px", fontWeight: 600, transition: "background 0.2s ease", border: "none", cursor: "pointer" };
  if (onClick) return (
    <button onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={style}>{children}</button>
  );
  return (
    <a href={href} target={target}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={style}
    >{children}</a>
  );
}

function BtnGhost({ children, href, target, onClick }: { children: React.ReactNode; href?: string; target?: string; onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);
  const style = { display: "inline-flex" as const, alignItems: "center" as const, gap: 8, fontFamily: "var(--app-font-mono)", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase" as const, background: hovered ? "var(--text)" : "transparent", color: hovered ? "var(--base)" : "var(--text)", padding: "12px 28px", border: `1px solid ${hovered ? "var(--text)" : "var(--border-md)"}`, transition: "all 0.2s ease", cursor: "pointer" };
  if (onClick) return (
    <button onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={style}>{children}</button>
  );
  return (
    <a href={href} target={target}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={style}
    >{children}</a>
  );
}

function Footer() {
  return (
    <footer style={{ background: "var(--base-2)", borderTop: "1px solid var(--border-var)", padding: "1.5rem clamp(1rem,3vw,3rem)", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "var(--app-font-mono)", fontSize: "0.56rem", letterSpacing: "0.12em", color: "var(--text-3)", flexWrap: "wrap", gap: "0.5rem" }}>
      <span>© 2026 — <em style={{ fontStyle: "normal", color: "var(--acid)" }}>Catalise.me</em> — Catalisadora de IA</span>
      <span>OPERA OS · Sistema Operacional com IA · Bahia, Brasil</span>
    </footer>
  );
}

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => { setModalOpen(true); document.body.style.overflow = "hidden"; };
  const closeModal = () => { setModalOpen(false); document.body.style.overflow = ""; };

  return (
    <ModalCtx.Provider value={{ open: openModal }}>
      {/* Magnetic cursor — only renders on pointer devices */}
      <MagneticCursor />

      {/* Page entrance fade */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Nav />
        <Hero />
        <Marquee />
        <Problema />
        <OQueE />
        <Fases />
        <Entregaveis />
        <AnteDepois />
        <ParaQuem />
        <Investimento />
        <Processo />
        <FAQ />
        <CtaFinal />
        <Footer />
      </motion.main>
      <AnimatePresence>
        {modalOpen && <DiagnosticoModal onClose={closeModal} />}
      </AnimatePresence>
    </ModalCtx.Provider>
  );
}
