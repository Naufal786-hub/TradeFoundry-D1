import { useEffect, useState } from "react";
import { auth, db, firebaseConfigured } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, setDoc, doc } from "firebase/firestore";
import { Activity, Bell, CalendarDays, CandlestickChart, LogOut, MessageSquare, Newspaper, Shield, Users } from "lucide-react";

const plans = [
  { name: "1 Bulan", price: "Rp1.200.000" },
  { name: "2 Bulan", price: "Rp2.000.000" },
  { name: "1 Tahun", price: "Rp8.900.000" }
];

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("general");
  const [error, setError] = useState("");
  const [trial, setTrial] = useState(null);

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, setUser);
  }, []);

  useEffect(() => {
    if (!db || !user) return;
    const q = query(collection(db, "rooms", room, "messages"), orderBy("createdAt", "asc"));
    return onSnapshot(q, snap => setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, [user, room]);

  useEffect(() => {
    if (!db || !user) return;
    return onSnapshot(doc(db, "users", user.uid), snap => {
      if (snap.exists()) setTrial(snap.data().trialStartedAt?.toDate?.() || null);
    });
  }, [user]);

  async function submitAuth(e) {
    e.preventDefault(); setError("");
    if (!firebaseConfigured) { setError("Firebase belum dikonfigurasi. Ikuti README.md dulu."); return; }
    try {
      if (mode === "register") {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", result.user.uid), {
          email, displayName: email.split("@")[0], role: "member",
          trialStartedAt: serverTimestamp(), createdAt: serverTimestamp()
        });
      } else await signInWithEmailAndPassword(auth, email, password);
    } catch (err) { setError(err.message); }
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!message.trim() || !db || !user) return;
    await addDoc(collection(db, "rooms", room, "messages"), {
      text: message.trim(), uid: user.uid, email: user.email,
      createdAt: serverTimestamp()
    });
    setMessage("");
  }

  const trialEnd = trial ? new Date(trial.getTime() + 3 * 86400000) : null;
  const daysLeft = trialEnd ? Math.max(0, Math.ceil((trialEnd - Date.now()) / 86400000)) : null;

  if (!user) return <main className="auth-wrap">
    <section className="auth-card">
      <div className="brand-mark">TF</div><p className="eyebrow">LEARN / ANALYZE / TRADE / GROW</p>
      <h1>TRADE<span>FOUNDRY</span></h1><p className="muted">Your market intelligence workspace.</p>
      <form onSubmit={submitAuth}>
        <label>Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="nama@email.com"/>
        <label>Password</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} required minLength="6" placeholder="Minimal 6 karakter"/>
        {error && <p className="error">{error}</p>}
        <button className="primary">{mode === "login" ? "Masuk" : "Buat akun"}</button>
      </form>
      <p className="switch" onClick={()=>setMode(mode === "login" ? "register" : "login")}>{mode === "login" ? "Belum punya akun? Daftar" : "Sudah punya akun? Masuk"}</p>
      {!firebaseConfigured && <p className="warning">Mode preview: hubungkan Firebase untuk mengaktifkan login dan chat.</p>}
    </section>
  </main>;

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="logo"><b>TF</b><span>TRADEFOUNDRY<small>INTELLIGENCE TERMINAL</small></span></div>
      <p className="nav-label">WORKSPACE</p>
      <a className="active"><CandlestickChart/> Market Overview</a><a><Activity/> Intermarket</a><a><Newspaper/> News Feed</a><a><CalendarDays/> Economic Calendar</a>
      <p className="nav-label">COMMUNITY</p>
      <a><MessageSquare/> Member Chat</a><a><Users/> Members</a>
      <div className="sidebar-bottom"><a><Bell/> Notifications</a><a><Shield/> Admin Console</a></div>
    </aside>
    <main className="main">
      <header><div><p className="eyebrow">MARKET INTELLIGENCE / OVERVIEW</p><h2>Good trading, {user.email?.split("@")[0]}</h2></div><button className="ghost" onClick={()=>signOut(auth)}><LogOut size={16}/> Keluar</button></header>
      <section className="trial-banner"><div><b>{daysLeft === null ? "TRIAL STATUS" : daysLeft > 0 ? `TRIAL AKTIF · ${daysLeft} HARI TERSISA` : "TRIAL BERAKHIR"}</b><p>Akses premium TradeFoundry selama 3 hari sejak akun dibuat.</p></div><span>MEMBERSHIP</span></section>
      <section className="stats">
        <article><small>GOLD / XAUUSD</small><strong>Market feed belum terhubung</strong><em>Connect data provider</em></article>
        <article><small>US DOLLAR INDEX</small><strong>—</strong><em>DXY monitor</em></article>
        <article><small>US 10Y YIELD</small><strong>—</strong><em>Yield monitor</em></article>
        <article><small>MARKET SENTIMENT</small><strong>Awaiting data</strong><em>Intermarket signal</em></article>
      </section>
      <section className="grid-main">
        <article className="panel chart-panel"><div className="panel-head"><div><small>PRIMARY INSTRUMENT</small><h3>XAUUSD · GOLD SPOT</h3></div><span className="live-dot">● DEMO</span></div><div className="chart-placeholder"><CandlestickChart size={42}/><p>Chart & live pricing akan dihubungkan pada tahap integrasi market data.</p></div></article>
        <article className="panel"><div className="panel-head"><div><small>MEMBERSHIP</small><h3>Pilih paket akses</h3></div></div>{plans.map(p=><div className="plan" key={p.name}><span>{p.name}</span><b>{p.price}</b></div>)}<p className="muted tiny">Pembayaran belum aktif. Integrasi gateway dan verifikasi server diperlukan sebelum menerima transaksi.</p></article>
      </section>
      <section className="panel chat-panel"><div className="panel-head"><div><small>COMMUNITY / REALTIME</small><h3>Member Chat</h3></div><select value={room} onChange={e=>setRoom(e.target.value)}><option value="general">General</option><option value="xauusd">XAUUSD</option><option value="fundamental">Fundamental</option><option value="technical">Technical</option></select></div>
        <div className="messages">{messages.map(m=><div className="message" key={m.id}><b>{m.email || "Member"}</b><p>{m.text}</p></div>)}{messages.length===0 && <p className="muted">Belum ada pesan di room ini.</p>}</div>
        <form className="chat-form" onSubmit={sendMessage}><input value={message} onChange={e=>setMessage(e.target.value)} placeholder="Tulis pesan ke komunitas..."/><button className="primary">Kirim</button></form>
      </section>
      <footer>TRADEFOUNDRY V2 · BUILDING THE NEXT GENERATION OF TRADERS</footer>
    </main>
  </div>;
}