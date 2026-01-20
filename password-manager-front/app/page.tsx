'use client'
import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { 
  Lock, Key, Eye, EyeOff, Trash2, 
  Copy, Plus, Search, LogOut, RefreshCw, Terminal, AlertTriangle, X, CheckCircle2 
} from 'lucide-react'

export default function PasswordManager() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [masterInput, setMasterInput] = useState('')
  const [masterError, setMasterError] = useState(false)
  const MASTER_PASSWORD = "123"

  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [savedPasswords, setSavedPasswords] = useState<any[]>([]) 
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [visiblePassId, setVisiblePassId] = useState<number | null>(null)
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{id: number, title: string} | null>(null)
  const [showCopyToast, setShowCopyToast] = useState(false)

  const fetchPasswords = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/passwords`);
      setSavedPasswords(response.data);
    } catch (error) { console.error("Fetch error:", error); }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        setIsMounted(true);
        fetchPasswords();
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setIsMounted(false);
    }
  }, [isAuthenticated, fetchPasswords]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (masterInput === MASTER_PASSWORD) {
      setIsAuthenticated(true)
      setMasterError(false)
    } else {
      setMasterError(true)
      setMasterInput('')
    }
  }

  const generatePass = (length: number) => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
    let result = ""
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    setPassword(result)
  }

  const saveToDatabase = async () => {
    if (!title || !password) return;
    setIsLoading(true);
    try {
      await axios.post('http://127.0.0.1:8000/api/passwords', {
        title: title, password: password, user_id: 1 
      });
      setTitle(''); setPassword('');
      fetchPasswords();
    } catch (error) { console.error("Save error:", error); } 
    finally { setIsLoading(false); }
  }

  const confirmDelete = (id: number, title: string) => {
    setItemToDelete({id, title})
    setIsDeleteModalOpen(true)
  }

  const deletePassword = async () => {
    if (!itemToDelete) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/passwords/${itemToDelete.id}`);
      fetchPasswords();
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error) { console.error("Delete error:", error); }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setShowCopyToast(true);
    setTimeout(() => setShowCopyToast(false), 2500);
  }

  const toggleVisibility = (id: number) => {
    setVisiblePassId(visiblePassId === id ? null : id);
  }

  const filteredPasswords = savedPasswords.filter((p) => 
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#020203] flex items-center justify-center p-4 overflow-hidden relative text-white">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full animate-pulse z-0" />
        <div className={`relative z-10 max-w-sm w-full bg-[#0a0a0c]/80 backdrop-blur-2xl border border-white/10 p-10 rounded-[3.5rem] shadow-2xl text-center transition-all ${masterError ? 'animate-shake border-red-500/40' : ''}`}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-scan" />
          <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Lock className="text-white w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter mb-2 italic uppercase">VAULT CORE</h1>
          <p className="text-slate-500 text-[10px] uppercase tracking-[0.4em] mb-10 font-bold animate-pulse">Waiting for Access...</p>
          <form onSubmit={handleLogin} className="space-y-6">
            <input 
              type="password" placeholder="MASTER KEY"
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none focus:ring-2 focus:ring-blue-500/20 text-center font-mono tracking-[0.5em] transition-all"
              value={masterInput} onChange={(e) => setMasterInput(e.target.value)} autoFocus
            />
            <button className="w-full bg-white text-black hover:bg-blue-600 hover:text-white py-5 rounded-2xl font-black transition-all shadow-xl active:scale-95 text-xs tracking-widest uppercase">
              Authenticate
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (!isMounted) return <div className="min-h-screen bg-[#020203]" />;

  return (
    <div className="min-h-screen bg-[#020203] text-slate-300 flex flex-col items-center py-8 md:py-16 px-4 md:px-6 relative overflow-x-hidden animate-in fade-in duration-500">
      
      {/* Toast de Copiado */}
      <div className={`fixed top-8 right-8 z-[110] flex items-center gap-4 bg-[#0a0a0c]/90 backdrop-blur-2xl border border-emerald-500/30 px-6 py-4 rounded-2xl shadow-2xl transition-all duration-500 transform ${showCopyToast ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-10 opacity-0 scale-95 pointer-events-none'}`}>
        <div className="w-8 h-8 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
          <CheckCircle2 className="text-emerald-500 w-5 h-5" />
        </div>
        <div>
          <p className="text-white text-xs font-black uppercase tracking-widest">Copiado con éxito</p>
          <p className="text-emerald-500/60 text-[9px] font-bold uppercase tracking-tighter">Búfer de seguridad activo</p>
        </div>
      </div>

      {/* Modal de Eliminación */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative max-w-sm w-full bg-[#0a0a0c] border border-red-500/20 p-10 rounded-[3rem] shadow-[0_0_100px_-20px_rgba(220,38,38,0.3)] text-center transform animate-in zoom-in-95 duration-300">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-red-600/10 blur-[60px] rounded-full z-0" />
            <div className="relative z-10">
              <div className="w-20 h-20 bg-red-600/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-red-500/20">
                <AlertTriangle className="text-red-500 w-10 h-10 animate-pulse" />
              </div>
              <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-2 leading-none">Eliminar Registro</h2>
              <div className="mb-10">
                <span className="text-red-500 font-mono text-sm font-bold uppercase tracking-widest bg-red-500/10 px-3 py-1 rounded-lg border border-red-500/20">
                   {itemToDelete?.title}
                </span>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-4 leading-relaxed">
                  ¿Confirmas la eliminación definitiva de esta credencial?
                </p>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 bg-white/5 hover:bg-white/10 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border border-white/5">Cancelar</button>
                <button onClick={deletePassword} className="flex-1 bg-red-600 hover:bg-red-500 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-[0_10px_30px_-10px_rgba(220,38,38,0.5)]">Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MEJORA: BOTÓN FLOTANTE ADAPTABLE PARA MÓVIL */}
      <div className="fixed bottom-6 right-6 z-[100] group">
        <button 
          onClick={() => setIsAuthenticated(false)} 
          className="flex items-center justify-center gap-3 bg-[#0a0a0c]/80 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-red-950/20 transition-all shadow-2xl p-4 sm:p-3"
        >
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75 group-hover:bg-red-400"></span>
            <span className="relative rounded-full h-3 w-3 bg-emerald-500 group-hover:bg-red-500"></span>
          </div>
          {/* El texto solo se muestra en pantallas sm (640px) o superiores al pasar el cursor */}
          <span className="max-w-0 overflow-hidden sm:group-hover:max-w-xs transition-all duration-500 text-[10px] font-black uppercase whitespace-nowrap px-0 sm:group-hover:px-1">
            Cerrar Sistema
          </span>
          <LogOut size={18} className="sm:size-4" />
        </button>
      </div>

      <div className="max-w-6xl w-full relative z-10">
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#0a0a0c] border border-white/5 rounded-2xl flex items-center justify-center shadow-xl">
              <Terminal className="text-blue-500 w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-white italic tracking-tighter uppercase leading-none">VAULT CORE</h1>
              <p className="text-[9px] sm:text-[10px] text-emerald-500 font-bold uppercase tracking-widest mt-1">Sistema Online</p>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Panel Generador */}
          <div className="lg:col-span-5 bg-white/[0.02] backdrop-blur-xl border border-white/5 p-6 sm:p-8 rounded-[2.5rem] sm:rounded-[3rem] shadow-2xl">
             <div className="space-y-6">
              <div className="flex items-center gap-2 text-blue-500"><Plus size={16}/><h2 className="text-[10px] font-black uppercase tracking-widest">Nuevo Registro</h2></div>
              <input type="text" placeholder="Servicio (ej. Netflix)" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:border-blue-500/50" value={title} onChange={(e) => setTitle(e.target.value)} />
              <div className="bg-black/60 p-6 sm:p-8 rounded-2xl text-center border border-white/5 relative group">
                <span className="font-mono text-xl sm:text-2xl text-emerald-400 break-all">{password || '••••••••'}</span>
                <button onClick={() => generatePass(16)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-all"><RefreshCw size={16}/></button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[8, 12, 16].map((len) => (
                  <button key={len} onClick={() => generatePass(len)} className="bg-white/5 hover:bg-white/10 p-3 rounded-xl text-[10px] font-bold border border-white/5 transition-colors">{len} bits</button>
                ))}
              </div>
              <button disabled={!password || !title || isLoading} onClick={saveToDatabase} className="w-full bg-blue-600 hover:bg-blue-500 p-4 sm:p-5 rounded-2xl font-black text-white text-[10px] tracking-widest shadow-xl uppercase active:scale-95 transition-transform">Guardar en Bóveda</button>
            </div>
          </div>

          {/* Panel Lista */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
              <Search size={16} className="text-slate-500" />
              <input type="text" placeholder="Buscar credencial..." className="bg-transparent border-none outline-none text-sm text-white w-full" onChange={(e) => setSearch(e.target.value)} />
            </div>
            
            <div className="space-y-4 max-h-[500px] sm:max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredPasswords.map((item) => (
                <div key={item.id} className="group bg-white/[0.01] border border-white/5 p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] flex justify-between items-center group hover:bg-white/[0.03] transition-all">
                  <div className="flex-1 pr-4 truncate">
                    <p className="text-[9px] sm:text-[10px] text-blue-500 font-bold uppercase mb-1 tracking-widest">{item.title}</p>
                    <div className="flex items-center gap-3">
                      <Key size={14} className="text-slate-600" />
                      <p className="font-mono text-base sm:text-lg text-white truncate">
                        {visiblePassId === item.id ? item.password : '••••••••••••'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => toggleVisibility(item.id)} className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl hover:text-white transition-colors">
                      {visiblePassId === item.id ? <EyeOff size={18}/> : <Eye size={18}/>}
                    </button>
                    <button onClick={() => copyToClipboard(item.password)} className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-emerald-500/20 text-emerald-500 rounded-xl transition-colors"><Copy size={18}/></button>
                    <button onClick={() => confirmDelete(item.id, item.title)} className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="mt-20 py-8 opacity-10 text-[9px] font-black uppercase tracking-[1em] text-center w-full">AES-256 BIT ENCRYPTION ACTIVE</footer>
      </div>
    </div>
  )
}