import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { LogOut, Trash2, Plus, Mail, FileText, LayoutDashboard, FolderOpen, Award, Edit2, Check, X, Upload, Sparkles } from "lucide-react";

type Tab = "messages" | "projects" | "certificates" | "skills" | "content" | "resume";

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("messages");

  useEffect(() => { checkAuth(); }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate("/admin-login"); return; }
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin");
    if (!roles || roles.length === 0) { navigate("/admin-login"); return; }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin-login");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background text-foreground text-sm">Loading...</div>;

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "messages", label: "Messages", icon: <Mail className="w-3.5 h-3.5" /> },
    { key: "projects", label: "Projects", icon: <FolderOpen className="w-3.5 h-3.5" /> },
    { key: "certificates", label: "Certificates", icon: <Award className="w-3.5 h-3.5" /> },
    { key: "skills", label: "Skills", icon: <Sparkles className="w-3.5 h-3.5" /> },
    { key: "content", label: "Content", icon: <FileText className="w-3.5 h-3.5" /> },
    { key: "resume", label: "Resume", icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/40 px-6 py-3.5 flex items-center justify-between bg-card/40 backdrop-blur-sm">
        <h1 className="text-lg font-semibold text-gradient">Admin</h1>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-xs"><LogOut className="w-3.5 h-3.5 mr-1.5" /> Logout</Button>
      </header>

      <div className="container mx-auto px-4 py-5 max-w-4xl">
        <div className="flex gap-1.5 mb-6 overflow-x-auto pb-1">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                tab === t.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground border border-border/40"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {tab === "messages" && <MessagesTab />}
        {tab === "projects" && <ProjectsTab />}
        {tab === "certificates" && <CertificatesTab />}
        {tab === "skills" && <SkillsTab />}
        {tab === "content" && <ContentTab />}
        {tab === "resume" && <ResumeTab />}
      </div>
    </div>
  );
};

/* ─── Messages ─── */
const MessagesTab = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchMessages(); }, []);

  const fetchMessages = async () => {
    const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    setMessages(data || []);
    setLoading(false);
  };

  const deleteMessage = async (id: string) => {
    await supabase.from("contact_messages").delete().eq("id", id);
    setMessages(prev => prev.filter(m => m.id !== id));
    toast.success("Deleted");
  };

  if (loading) return <p className="text-sm text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">{messages.length} message(s)</p>
      {messages.length === 0 ? <p className="text-sm text-muted-foreground">No messages yet.</p> : messages.map(m => (
        <div key={m.id} className="rounded-lg border border-border/40 bg-card/40 p-4 flex justify-between items-start gap-3">
          <div className="min-w-0">
            <p className="font-medium text-sm truncate">{m.name} · <span className="text-muted-foreground">{m.email}</span></p>
            <p className="text-xs text-muted-foreground mt-1.5 whitespace-pre-wrap">{m.message}</p>
            <p className="text-[10px] text-muted-foreground/60 mt-2">{new Date(m.created_at).toLocaleString()}</p>
          </div>
          <Button variant="ghost" size="icon" className="flex-shrink-0 h-7 w-7" onClick={() => deleteMessage(m.id)}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
        </div>
      ))}
    </div>
  );
};

/* ─── Projects ─── */
const ProjectsTab = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", description: "", tech_stack: "", url: "", github_url: "", live_url: "", image_url: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    const { data } = await supabase.from("projects").select("*").order("sort_order");
    setProjects(data || []);
    setLoading(false);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("project-images").upload(path, file);
      if (error) { toast.error(error.message); return null; }
      const { data } = supabase.storage.from("project-images").getPublicUrl(path);
      return data.publicUrl;
    } finally {
      setUploading(false);
    }
  };

  const addProject = async () => {
    if (!form.title.trim()) { toast.error("Title required"); return; }
    const { error } = await supabase.from("projects").insert({
      title: form.title,
      description: form.description,
      tech_stack: form.tech_stack.split(",").map(s => s.trim()).filter(Boolean),
      url: form.url || null,
      github_url: form.github_url || null,
      live_url: form.live_url || null,
      image_url: form.image_url || null,
    });
    if (error) { toast.error(error.message); return; }
    setForm({ title: "", description: "", tech_stack: "", url: "", github_url: "", live_url: "", image_url: "" });
    fetchProjects();
    toast.success("Project added");
  };

  const startEdit = (p: any) => {
    setEditId(p.id);
    setEditForm({
      title: p.title,
      description: p.description,
      tech_stack: p.tech_stack?.join(", ") || "",
      url: p.url || "",
      github_url: p.github_url || "",
      live_url: p.live_url || "",
      image_url: p.image_url || "",
    });
  };

  const saveEdit = async () => {
    if (!editId) return;
    const { error } = await supabase.from("projects").update({
      title: editForm.title,
      description: editForm.description,
      tech_stack: editForm.tech_stack.split(",").map((s: string) => s.trim()).filter(Boolean),
      url: editForm.url || null,
      github_url: editForm.github_url || null,
      live_url: editForm.live_url || null,
      image_url: editForm.image_url || null,
    }).eq("id", editId);
    if (error) { toast.error(error.message); return; }
    setEditId(null);
    fetchProjects();
    toast.success("Updated");
  };

  const deleteProject = async (id: string) => {
    await supabase.from("projects").delete().eq("id", id);
    setProjects(prev => prev.filter(p => p.id !== id));
    toast.success("Deleted");
  };

  if (loading) return <p className="text-sm text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border/40 bg-card/40 p-4 space-y-2.5">
        <h3 className="text-sm font-medium flex items-center gap-1.5"><Plus className="w-3.5 h-3.5" /> Add Project</h3>
        <Input placeholder="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="text-sm" />
        <Textarea placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className="text-sm" />
        <Input placeholder="Tech Stack (comma separated)" value={form.tech_stack} onChange={e => setForm(f => ({ ...f, tech_stack: e.target.value }))} className="text-sm" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Input placeholder="GitHub URL (optional)" value={form.github_url} onChange={e => setForm(f => ({ ...f, github_url: e.target.value }))} className="text-sm" />
          <Input placeholder="Live URL (optional)" value={form.live_url} onChange={e => setForm(f => ({ ...f, live_url: e.target.value }))} className="text-sm" />
          <Input placeholder="Other URL (optional)" value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} className="text-sm" />
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border/40 cursor-pointer text-xs hover:bg-muted/40">
            <Upload className="w-3.5 h-3.5" /> {uploading ? "Uploading..." : "Upload Image"}
            <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
              const file = e.target.files?.[0]; if (!file) return;
              const url = await uploadImage(file);
              if (url) { setForm(f => ({ ...f, image_url: url })); toast.success("Image uploaded"); }
            }} />
          </label>
          {form.image_url && <img src={form.image_url} alt="" className="w-10 h-10 rounded object-cover" />}
        </div>
        <Button size="sm" onClick={addProject} className="text-xs">Add</Button>
      </div>


      <div className="space-y-2.5">
        {projects.map(p => (
          <div key={p.id} className="rounded-lg border border-border/40 bg-card/40 p-3.5">
            {editId === p.id ? (
              <div className="space-y-2">
                <Input value={editForm.title} onChange={e => setEditForm((f: any) => ({ ...f, title: e.target.value }))} className="text-sm" />
                <Textarea value={editForm.description} onChange={e => setEditForm((f: any) => ({ ...f, description: e.target.value }))} rows={2} className="text-sm" />
                <Input placeholder="Tech Stack" value={editForm.tech_stack} onChange={e => setEditForm((f: any) => ({ ...f, tech_stack: e.target.value }))} className="text-sm" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Input placeholder="GitHub URL" value={editForm.github_url} onChange={e => setEditForm((f: any) => ({ ...f, github_url: e.target.value }))} className="text-sm" />
                  <Input placeholder="Live URL" value={editForm.live_url} onChange={e => setEditForm((f: any) => ({ ...f, live_url: e.target.value }))} className="text-sm" />
                  <Input placeholder="Other URL" value={editForm.url} onChange={e => setEditForm((f: any) => ({ ...f, url: e.target.value }))} className="text-sm" />
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border/40 cursor-pointer text-xs hover:bg-muted/40">
                    <Upload className="w-3.5 h-3.5" /> {uploading ? "Uploading..." : "Replace Image"}
                    <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                      const file = e.target.files?.[0]; if (!file) return;
                      const url = await uploadImage(file);
                      if (url) { setEditForm((f: any) => ({ ...f, image_url: url })); toast.success("Image uploaded"); }
                    }} />
                  </label>
                  {editForm.image_url && <img src={editForm.image_url} alt="" className="w-10 h-10 rounded object-cover" />}
                </div>
                <div className="flex gap-1.5">
                  <Button size="sm" onClick={saveEdit} className="text-xs"><Check className="w-3 h-3 mr-1" /> Save</Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditId(null)} className="text-xs"><X className="w-3 h-3 mr-1" /> Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start gap-3">
                <div className="min-w-0 flex gap-3">
                  {p.image_url && <img src={p.image_url} alt="" className="w-14 h-14 rounded object-cover flex-shrink-0" />}
                  <div className="min-w-0">
                  <p className="font-medium text-sm">{p.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{p.description}</p>
                  {p.tech_stack?.length > 0 && <p className="text-[10px] text-primary mt-1">{p.tech_stack.join(", ")}</p>}
                  <div className="flex gap-3 mt-1 text-[10px] text-muted-foreground">
                    {p.github_url && <span>GitHub ✓</span>}
                    {p.live_url && <span>Live ✓</span>}
                    {p.url && <span>URL ✓</span>}
                  </div>
                  </div>
                </div>

                <div className="flex gap-0.5 flex-shrink-0">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEdit(p)}><Edit2 className="w-3.5 h-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteProject(p.id)}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Certificates ─── */
const CertificatesTab = () => {
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", organization: "", year: "", code: "", url: "", description: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  useEffect(() => { fetchCerts(); }, []);

  const fetchCerts = async () => {
    const { data } = await supabase.from("certificates").select("*").order("sort_order");
    setCerts(data || []);
    setLoading(false);
  };

  const addCert = async () => {
    if (!form.name.trim() || !form.organization.trim()) { toast.error("Name & Organization required"); return; }
    const { error } = await supabase.from("certificates").insert({
      name: form.name,
      organization: form.organization,
      year: form.year,
      code: form.code || null,
      url: form.url || null,
      description: form.description || null,
    });
    if (error) { toast.error(error.message); return; }
    setForm({ name: "", organization: "", year: "", code: "", url: "", description: "" });
    fetchCerts();
    toast.success("Certificate added");
  };

  const startEdit = (c: any) => {
    setEditId(c.id);
    setEditForm({ name: c.name, organization: c.organization, year: c.year, code: c.code || "", url: c.url || "", description: c.description || "" });
  };

  const saveEdit = async () => {
    if (!editId) return;
    const { error } = await supabase.from("certificates").update({
      name: editForm.name,
      organization: editForm.organization,
      year: editForm.year,
      code: editForm.code || null,
      url: editForm.url || null,
      description: editForm.description || null,
    }).eq("id", editId);
    if (error) { toast.error(error.message); return; }
    setEditId(null);
    fetchCerts();
    toast.success("Updated");
  };

  const deleteCert = async (id: string) => {
    await supabase.from("certificates").delete().eq("id", id);
    setCerts(prev => prev.filter(c => c.id !== id));
    toast.success("Deleted");
  };

  if (loading) return <p className="text-sm text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border/40 bg-card/40 p-4 space-y-2.5">
        <h3 className="text-sm font-medium flex items-center gap-1.5"><Plus className="w-3.5 h-3.5" /> Add Certificate</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Input placeholder="Certificate Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="text-sm" />
          <Input placeholder="Organization" value={form.organization} onChange={e => setForm(f => ({ ...f, organization: e.target.value }))} className="text-sm" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Input placeholder="Year" value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} className="text-sm" />
          <Input placeholder="Code (optional)" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} className="text-sm" />
          <Input placeholder="URL (optional)" value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} className="text-sm" />
        </div>
        <Textarea placeholder="Description (optional)" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className="text-sm" />
        <Button size="sm" onClick={addCert} className="text-xs">Add</Button>
      </div>


      <div className="space-y-2.5">
        {certs.map(c => (
          <div key={c.id} className="rounded-lg border border-border/40 bg-card/40 p-3.5">
            {editId === c.id ? (
              <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Input value={editForm.name} onChange={e => setEditForm((f: any) => ({ ...f, name: e.target.value }))} className="text-sm" />
                  <Input value={editForm.organization} onChange={e => setEditForm((f: any) => ({ ...f, organization: e.target.value }))} className="text-sm" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Input placeholder="Year" value={editForm.year} onChange={e => setEditForm((f: any) => ({ ...f, year: e.target.value }))} className="text-sm" />
                  <Input placeholder="Code" value={editForm.code} onChange={e => setEditForm((f: any) => ({ ...f, code: e.target.value }))} className="text-sm" />
                  <Input placeholder="URL" value={editForm.url} onChange={e => setEditForm((f: any) => ({ ...f, url: e.target.value }))} className="text-sm" />
                </div>
                <Textarea placeholder="Description" value={editForm.description} onChange={e => setEditForm((f: any) => ({ ...f, description: e.target.value }))} rows={2} className="text-sm" />

                <div className="flex gap-1.5">
                  <Button size="sm" onClick={saveEdit} className="text-xs"><Check className="w-3 h-3 mr-1" /> Save</Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditId(null)} className="text-xs"><X className="w-3 h-3 mr-1" /> Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-sm">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.organization} · {c.year}</p>
                  {c.code && <p className="text-[10px] font-mono text-primary/70 mt-0.5">Code: {c.code}</p>}
                </div>
                <div className="flex gap-0.5 flex-shrink-0">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEdit(c)}><Edit2 className="w-3.5 h-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteCert(c.id)}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Content ─── */
const ContentTab = () => {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const keys = ["about_text", "hero_subtitle", "footer_text"];

  useEffect(() => { fetchContent(); }, []);

  const fetchContent = async () => {
    const { data } = await supabase.from("portfolio_content").select("*");
    const map: Record<string, string> = {};
    data?.forEach(d => { map[d.key] = d.value; });
    setContent(map);
    setLoading(false);
  };

  const saveContent = async (key: string) => {
    const value = content[key] || "";
    const { error } = await supabase.from("portfolio_content").upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
    if (error) { toast.error(error.message); return; }
    toast.success("Saved");
  };

  if (loading) return <p className="text-sm text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-4">
      {keys.map(key => (
        <div key={key} className="rounded-xl border border-border/40 bg-card/40 p-4 space-y-2">
          <label className="text-xs font-medium capitalize text-muted-foreground">{key.replace(/_/g, " ")}</label>
          <Textarea value={content[key] || ""} onChange={e => setContent(c => ({ ...c, [key]: e.target.value }))} rows={3} className="text-sm" />
          <Button size="sm" onClick={() => saveContent(key)} className="text-xs">Save</Button>
        </div>
      ))}
    </div>
  );
};

/* ─── Resume ─── */
const ResumeTab = () => {
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<any[]>([]);

  useEffect(() => { fetchFiles(); }, []);

  const fetchFiles = async () => {
    const { data } = await supabase.storage.from("resumes").list("", { limit: 20, sortBy: { column: "created_at", order: "desc" } });
    setFiles(data || []);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fileName = `resume_${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from("resumes").upload(fileName, file);
    if (error) { toast.error(error.message); } else { toast.success("Uploaded!"); fetchFiles(); }
    setUploading(false);
  };

  const deleteFile = async (name: string) => {
    await supabase.storage.from("resumes").remove([name]);
    fetchFiles();
    toast.success("Deleted");
  };

  const getPublicUrl = (name: string) => supabase.storage.from("resumes").getPublicUrl(name).data.publicUrl;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border/40 bg-card/40 p-4">
        <h3 className="text-sm font-medium mb-2.5">Upload Resume</h3>
        <Input type="file" accept=".pdf,.doc,.docx" onChange={handleUpload} disabled={uploading} className="text-sm" />
        {uploading && <p className="text-xs text-muted-foreground mt-2">Uploading...</p>}
      </div>
      <div className="space-y-2">
        {files.map(f => (
          <div key={f.name} className="rounded-lg border border-border/40 bg-card/40 p-3 flex justify-between items-center">
            <a href={getPublicUrl(f.name)} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs truncate">{f.name}</a>
            <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0" onClick={() => deleteFile(f.name)}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
