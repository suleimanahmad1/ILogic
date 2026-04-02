import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { LogOut, Trash2, Plus, Mail, FileText, LayoutDashboard, FolderOpen } from "lucide-react";

type Tab = "messages" | "projects" | "content" | "resume";

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("messages");

  useEffect(() => {
    checkAuth();
  }, []);

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

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background text-foreground">Loading...</div>;

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "messages", label: "Messages", icon: <Mail className="w-4 h-4" /> },
    { key: "projects", label: "Projects", icon: <FolderOpen className="w-4 h-4" /> },
    { key: "content", label: "Content", icon: <FileText className="w-4 h-4" /> },
    { key: "resume", label: "Resume", icon: <LayoutDashboard className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="glass border-b border-border/50 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gradient">Admin Dashboard</h1>
        <Button variant="ghost" size="sm" onClick={handleLogout}><LogOut className="w-4 h-4 mr-2" /> Logout</Button>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map(t => (
            <Button key={t.key} variant={tab === t.key ? "default" : "outline"} size="sm" onClick={() => setTab(t.key)} className="flex items-center gap-2">
              {t.icon} {t.label}
            </Button>
          ))}
        </div>

        {tab === "messages" && <MessagesTab />}
        {tab === "projects" && <ProjectsTab />}
        {tab === "content" && <ContentTab />}
        {tab === "resume" && <ResumeTab />}
      </div>
    </div>
  );
};

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
    toast.success("Message deleted");
  };

  if (loading) return <p>Loading messages...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Contact Messages ({messages.length})</h2>
      {messages.length === 0 ? <p className="text-muted-foreground">No messages yet.</p> : messages.map(m => (
        <div key={m.id} className="glass rounded-lg p-4 flex justify-between items-start gap-4">
          <div>
            <p className="font-medium">{m.name} &lt;{m.email}&gt;</p>
            <p className="text-sm text-muted-foreground mt-1">{m.message}</p>
            <p className="text-xs text-muted-foreground mt-2">{new Date(m.created_at).toLocaleString()}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => deleteMessage(m.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
        </div>
      ))}
    </div>
  );
};

const ProjectsTab = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", description: "", tech_stack: "", url: "" });

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    const { data } = await supabase.from("projects").select("*").order("sort_order");
    setProjects(data || []);
    setLoading(false);
  };

  const addProject = async () => {
    if (!form.title.trim()) { toast.error("Title required"); return; }
    const { error } = await supabase.from("projects").insert({
      title: form.title,
      description: form.description,
      tech_stack: form.tech_stack.split(",").map(s => s.trim()).filter(Boolean),
      url: form.url || null,
    });
    if (error) { toast.error(error.message); return; }
    setForm({ title: "", description: "", tech_stack: "", url: "" });
    fetchProjects();
    toast.success("Project added");
  };

  const deleteProject = async (id: string) => {
    await supabase.from("projects").delete().eq("id", id);
    setProjects(prev => prev.filter(p => p.id !== id));
    toast.success("Project deleted");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="glass rounded-lg p-4 space-y-3">
        <h3 className="font-semibold flex items-center gap-2"><Plus className="w-4 h-4" /> Add Project</h3>
        <Input placeholder="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
        <Textarea placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        <Input placeholder="Tech Stack (comma separated)" value={form.tech_stack} onChange={e => setForm(f => ({ ...f, tech_stack: e.target.value }))} />
        <Input placeholder="URL (optional)" value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} />
        <Button onClick={addProject}>Add Project</Button>
      </div>
      <div className="space-y-3">
        {projects.map(p => (
          <div key={p.id} className="glass rounded-lg p-4 flex justify-between items-start">
            <div>
              <p className="font-medium">{p.title}</p>
              <p className="text-sm text-muted-foreground">{p.description}</p>
              {p.tech_stack?.length > 0 && <p className="text-xs text-primary mt-1">{p.tech_stack.join(", ")}</p>}
            </div>
            <Button variant="ghost" size="icon" onClick={() => deleteProject(p.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
};

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
    toast.success(`${key} saved`);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      {keys.map(key => (
        <div key={key} className="glass rounded-lg p-4 space-y-2">
          <label className="text-sm font-medium capitalize">{key.replace(/_/g, " ")}</label>
          <Textarea value={content[key] || ""} onChange={e => setContent(c => ({ ...c, [key]: e.target.value }))} rows={3} />
          <Button size="sm" onClick={() => saveContent(key)}>Save</Button>
        </div>
      ))}
    </div>
  );
};

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
    if (error) { toast.error(error.message); } else { toast.success("Resume uploaded!"); fetchFiles(); }
    setUploading(false);
  };

  const deleteFile = async (name: string) => {
    await supabase.storage.from("resumes").remove([name]);
    fetchFiles();
    toast.success("File deleted");
  };

  const getPublicUrl = (name: string) => {
    const { data } = supabase.storage.from("resumes").getPublicUrl(name);
    return data.publicUrl;
  };

  return (
    <div className="space-y-4">
      <div className="glass rounded-lg p-4">
        <h3 className="font-semibold mb-3">Upload Resume</h3>
        <Input type="file" accept=".pdf,.doc,.docx" onChange={handleUpload} disabled={uploading} />
        {uploading && <p className="text-sm text-muted-foreground mt-2">Uploading...</p>}
      </div>
      <div className="space-y-2">
        {files.map(f => (
          <div key={f.name} className="glass rounded-lg p-3 flex justify-between items-center">
            <a href={getPublicUrl(f.name)} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">{f.name}</a>
            <Button variant="ghost" size="icon" onClick={() => deleteFile(f.name)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
