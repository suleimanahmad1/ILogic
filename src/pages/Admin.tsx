import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { isAdminUser } from "@/lib/adminAuth";
import { signOutIfNotAllowed, UNAUTHORIZED_LOGIN_MESSAGE } from "@/lib/allowedAdmin";
import AdminImageField from "@/components/admin/AdminImageField";
import { adminInput, adminSelect } from "@/components/admin/adminUi";
import {
  AdminFormCard,
  AdminField,
  AdminFieldGrid,
  AdminFormDivider,
  AdminFormActions,
  AdminListHeader,
  AdminEntryCard,
} from "@/components/admin/AdminFormLayout";
import { sortByPinned } from "@/lib/sortByPinned";
import { ArrowLeft, LogOut, Plus, Trash2, Sparkles, Mail, Inbox, Pencil, FolderOpen, GraduationCap, Award, SquareStack, Pin, PinOff } from "lucide-react";
import AdminInboxPage from "@/components/admin/AdminInboxPage";
import type { ContactMessage } from "@/lib/contactInbox";
import { getUnreadCount, removeMessageFromRead, subscribeInboxRead } from "@/lib/inboxRead";

const db = supabase as any;
const STORAGE_BUCKET = "website-images";
type EducationRow = { id: string; institute: string; degree: string; start_date: string | null; end_date: string | null; year: string | null; image_url: string | null; sort_order: number | null };
type SkillCategoryRow = { id: string; name: string; sort_order: number | null };
type SkillItemRow = { id: string; category_id: string; name: string; sort_order: number | null };
type CertificationRow = { id: string; image_url: string | null; image?: string | null; course_name?: string | null; name?: string | null; code: string | null; url: string | null; description: string | null; is_pinned?: boolean | null; created_at?: string | null };
type ProjectRow = { id: string; project_name?: string | null; title?: string | null; technology?: string | null; tech_stack?: string[] | null; image_url: string | null; github_url: string | null; live_url: string | null; description: string | null; url: string | null; is_pinned?: boolean | null; created_at?: string | null };

type PageKey = "contact" | "inbox" | "skills" | "education" | "certifications" | "projects";

type PageConfig = { id: PageKey; label: string; icon: React.ComponentType<{ className?: string }> };

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState<PageKey>("contact");

  const [contactId, setContactId] = useState<string | null>(null);
  const [contactInfo, setContactInfo] = useState({ email: "", phone: "", address: "" });

  const [education, setEducation] = useState<EducationRow[]>([]);
  const [educationForm, setEducationForm] = useState({ institute: "", degree: "", startDate: "", endDate: "", year: "", image: "" });
  const [editingEducationId, setEditingEducationId] = useState<string | null>(null);

  const [skillCategories, setSkillCategories] = useState<SkillCategoryRow[]>([]);
  const [skillItems, setSkillItems] = useState<SkillItemRow[]>([]);
  const [skillCategoryName, setSkillCategoryName] = useState("");
  const [skillItemForm, setSkillItemForm] = useState({ categoryId: "", name: "" });
  const [editingSkillItemId, setEditingSkillItemId] = useState<string | null>(null);

  const [certifications, setCertifications] = useState<CertificationRow[]>([]);
  const [certForm, setCertForm] = useState({ image: "", courseName: "", code: "", url: "", description: "" });
  const [editingCertificationId, setEditingCertificationId] = useState<string | null>(null);

  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [projectForm, setProjectForm] = useState({ image: "", projectName: "", technology: "", github: "", live: "", description: "" });
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const pages: PageConfig[] = useMemo(() => ([
    { id: "contact", label: "Contact", icon: Mail },
    { id: "inbox", label: "Inbox", icon: Inbox },
    { id: "skills", label: "Skills", icon: SquareStack },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "certifications", label: "Certifications", icon: Award },
    { id: "projects", label: "Projects", icon: FolderOpen },
  ]), []);

  useEffect(() => {
    checkAuth();
    void loadAdminData();
  }, []);

  useEffect(() => {
    const syncUnread = () => setUnreadCount(getUnreadCount(messages));
    syncUnread();
    return subscribeInboxRead(syncUnread);
  }, [messages]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/admin-login");
      return;
    }
    if (!(await signOutIfNotAllowed(user.email))) {
      toast.error(UNAUTHORIZED_LOGIN_MESSAGE);
      navigate("/admin-login");
      return;
    }
    if (!(await isAdminUser(user.id))) {
      await supabase.auth.signOut();
      toast.error("Admin verify nahi hua. Supabase par fix-admin-login.sql chalao, phir refresh karke login.");
      navigate("/admin-login");
      return;
    }
    setLoading(false);
  };

  const loadAdminData = async () => {
    const [contactRes, educationRes, categoriesRes, itemsRes, certRes, projectsRes, messagesRes] = await Promise.all([
      db.from("contact_info").select("*").limit(1).maybeSingle(),
      db.from("education").select("*").order("sort_order", { ascending: true }),
      db.from("skills_categories").select("*").order("sort_order", { ascending: true }),
      db.from("skills_items").select("*").order("sort_order", { ascending: true }),
      db.from("certifications").select("*").order("created_at", { ascending: true }),
      db.from("projects").select("*").order("created_at", { ascending: true }),
      db.from("contact_messages").select("*").order("created_at", { ascending: false }),
    ]);

    const contact = contactRes.data as { id: string; email: string; phone: string; address: string } | null;
    setContactId(contact?.id ?? null);
    setContactInfo({ email: contact?.email || "", phone: contact?.phone || "", address: contact?.address || "" });

    setEducation((educationRes.data || []) as EducationRow[]);
    setSkillCategories((categoriesRes.data || []) as SkillCategoryRow[]);
    setSkillItems((itemsRes.data || []) as SkillItemRow[]);
    setCertifications(sortByPinned((certRes.data || []) as CertificationRow[]));
    setProjects(sortByPinned((projectsRes.data || []) as ProjectRow[]));
    if (messagesRes.error) {
      const msg = messagesRes.error.message;
      if (/contact_messages/i.test(msg) && /schema cache|does not exist|not find/i.test(msg)) {
        toast.error("Inbox table missing — run supabase/apply-contact-messages.sql in Supabase SQL Editor.", { id: "contact-messages-missing" });
      }
      setMessages([]);
    } else {
      setMessages((messagesRes.data || []) as ContactMessage[]);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin-login");
  };

  const uploadImage = async (file: File) => {
    const ext = file.name.split(".").pop() || "png";
    const path = `admin-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, { upsert: true });
    if (error) {
      toast.error(error.message.toLowerCase().includes("bucket") ? `Storage bucket "${STORAGE_BUCKET}" not found.` : error.message);
      return null;
    }
    return supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl;
  };

  const saveContact = async () => {
    const payload = contactInfo;
    const { data, error } = contactId
      ? await db.from("contact_info").update(payload).eq("id", contactId).select("id").maybeSingle()
      : await db.from("contact_info").insert(payload).select("id").maybeSingle();
    if (error) return toast.error(error.message);
    if (!contactId) setContactId(data?.id ?? null);
    toast.success("Contact info saved");
  };

  const saveEducation = async () => {
    if (!educationForm.institute.trim() || !educationForm.degree.trim()) {
      return toast.error("Institute and degree are required");
    }
    const yearValue = educationForm.year.trim() || [educationForm.startDate.trim(), educationForm.endDate.trim()].filter(Boolean).join(" - ") || null;
    const payload = {
      institute: educationForm.institute.trim(),
      degree: educationForm.degree.trim(),
      start_date: educationForm.startDate.trim() || null,
      end_date: educationForm.endDate.trim() || null,
      year: yearValue,
      image_url: educationForm.image.trim() || null,
    };
    const { error } = editingEducationId
      ? await db.from("education").update(payload).eq("id", editingEducationId)
      : await db.from("education").insert({ ...payload, sort_order: education.length + 1 });
    if (error) return toast.error(error.message);
    toast.success(editingEducationId ? "Education updated" : "Education added");
    setEducationForm({ institute: "", degree: "", startDate: "", endDate: "", year: "", image: "" });
    setEditingEducationId(null);
    void loadAdminData();
  };

  const editEducation = (row: EducationRow) => {
    setEditingEducationId(row.id);
    setEducationForm({
      institute: row.institute,
      degree: row.degree,
      startDate: row.start_date || "",
      endDate: row.end_date || "",
      year: row.year || "",
      image: row.image_url || "",
    });
    setActivePage("education");
  };

  const deleteEducation = async (id: string) => {
    const { error } = await db.from("education").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    void loadAdminData();
  };

  const saveSkillCategory = async () => {
    if (!skillCategoryName.trim()) return toast.error("Category name is required");
    const { error } = await db.from("skills_categories").insert({ name: skillCategoryName, sort_order: skillCategories.length + 1 });
    if (error) return toast.error(error.message);
    toast.success("Category added");
    setSkillCategoryName("");
    void loadAdminData();
  };

  const saveSkillItem = async () => {
    if (!skillItemForm.categoryId || !skillItemForm.name.trim()) return toast.error("Category and skill name are required");
    const payload = { category_id: skillItemForm.categoryId, name: skillItemForm.name };
    const { error } = editingSkillItemId
      ? await db.from("skills_items").update(payload).eq("id", editingSkillItemId)
      : await db.from("skills_items").insert({ ...payload, sort_order: skillItems.length + 1 });
    if (error) return toast.error(error.message);
    toast.success(editingSkillItemId ? "Skill updated" : "Skill added");
    setSkillItemForm({ categoryId: "", name: "" });
    setEditingSkillItemId(null);
    void loadAdminData();
  };

  const editSkillItem = (row: SkillItemRow) => {
    setEditingSkillItemId(row.id);
    setSkillItemForm({ categoryId: row.category_id, name: row.name });
    setActivePage("skills");
  };

  const deleteSkillItem = async (id: string) => {
    const { error } = await db.from("skills_items").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    void loadAdminData();
  };

  const deleteSkillCategory = async (id: string) => {
    const { error } = await db.from("skills_categories").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Category deleted");
    void loadAdminData();
  };

  const saveCertification = async () => {
    if (!certForm.courseName.trim()) return toast.error("Course name is required");
    const imageUrl = certForm.image.trim() || null;
    const payload = {
      image: imageUrl,
      image_url: imageUrl,
      course_name: certForm.courseName.trim(),
      name: certForm.courseName.trim(),
      code: certForm.code.trim() || null,
      url: certForm.url.trim() || null,
      description: certForm.description.trim() || null,
    };
    const { error } = editingCertificationId
      ? await db.from("certifications").update(payload).eq("id", editingCertificationId)
      : await db.from("certifications").insert(payload);
    if (error) return toast.error(error.message);
    toast.success(editingCertificationId ? "Certification updated" : "Certification added");
    setCertForm({ image: "", courseName: "", code: "", url: "", description: "" });
    setEditingCertificationId(null);
    void loadAdminData();
  };

  const editCertification = (row: CertificationRow) => {
    setEditingCertificationId(row.id);
    setCertForm({
      image: row.image_url || row.image || "",
      courseName: row.course_name || row.name || "",
      code: row.code || "",
      url: row.url || "",
      description: row.description || "",
    });
    setActivePage("certifications");
  };

  const deleteCertification = async (id: string) => {
    const { error } = await db.from("certifications").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    void loadAdminData();
  };

  const toggleCertificationPin = async (row: CertificationRow) => {
    const next = !row.is_pinned;
    const { error } = await db.from("certifications").update({ is_pinned: next }).eq("id", row.id);
    if (error) {
      if (/is_pinned/i.test(error.message)) {
        toast.error("Run supabase/apply-pin-columns.sql in Supabase SQL Editor.");
      } else {
        toast.error(error.message);
      }
      return;
    }
    toast.success(next ? "Certificate pinned" : "Certificate unpinned");
    void loadAdminData();
  };

  const saveProject = async () => {
    if (!projectForm.projectName.trim() || !projectForm.technology.trim()) {
      return toast.error("Project name and technology are required");
    }
    const payload = {
      image_url: projectForm.image.trim() || null,
      project_name: projectForm.projectName.trim(),
      title: projectForm.projectName.trim(),
      technology: projectForm.technology.trim(),
      tech_stack: projectForm.technology.split(",").map((value) => value.trim()).filter(Boolean),
      live_url: projectForm.live.trim() || null,
      github_url: projectForm.github.trim() || null,
      description: projectForm.description.trim() || null,
      url: projectForm.live.trim() || null,
    };
    const { error } = editingProjectId
      ? await db.from("projects").update(payload).eq("id", editingProjectId)
      : await db.from("projects").insert(payload);
    if (error) return toast.error(error.message);
    toast.success(editingProjectId ? "Project updated" : "Project added");
    setProjectForm({ image: "", projectName: "", technology: "", github: "", live: "", description: "" });
    setEditingProjectId(null);
    void loadAdminData();
  };

  const editProject = (row: ProjectRow) => {
    setEditingProjectId(row.id);
    setProjectForm({
      image: row.image_url || "",
      projectName: row.project_name || row.title || "",
      technology: row.technology || (row.tech_stack || []).join(", "),
      github: row.github_url || "",
      live: row.live_url || "",
      description: row.description || "",
    });
    setActivePage("projects");
  };

  const toggleProjectPin = async (row: ProjectRow) => {
    const next = !row.is_pinned;
    const { error } = await db.from("projects").update({ is_pinned: next }).eq("id", row.id);
    if (error) {
      if (/is_pinned/i.test(error.message)) {
        toast.error("Run supabase/apply-pin-columns.sql in Supabase SQL Editor.");
      } else {
        toast.error(error.message);
      }
      return;
    }
    toast.success(next ? "Project pinned" : "Project unpinned");
    void loadAdminData();
  };

  const deleteProject = async (id: string) => {
    const { error } = await db.from("projects").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    void loadAdminData();
  };

  const deleteInboxMessage = async (id: string): Promise<boolean> => {
    const { error } = await db.from("contact_messages").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return false;
    }
    setMessages((prev) => prev.filter((item) => item.id !== id));
    removeMessageFromRead(id);
    toast.success("Message removed");
    return true;
  };

  const pageButtonClass = (page: PageKey) =>
    `w-full flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-all ${activePage === page ? "border-primary/40 bg-primary/10 text-foreground" : "border-transparent bg-muted/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground"}`;

  const renderInboxPage = () => (
    <AdminInboxPage
      messages={messages}
      onDelete={deleteInboxMessage}
      onRefresh={() => void loadAdminData()}
      onMessageRead={() => setUnreadCount(getUnreadCount(messages))}
      replyFromEmail={contactInfo.email}
    />
  );

  const renderContactPage = () => (
    <AdminFormCard icon={Mail} title="Contact info" subtitle="Shown on the site footer and contact section.">
      <AdminFieldGrid cols={3}>
        <AdminField label="Email" required>
          <Input value={contactInfo.email} onChange={(e) => setContactInfo((c) => ({ ...c, email: e.target.value }))} className={adminInput} />
        </AdminField>
        <AdminField label="Phone">
          <Input value={contactInfo.phone} onChange={(e) => setContactInfo((c) => ({ ...c, phone: e.target.value }))} className={adminInput} />
        </AdminField>
        <AdminField label="Address">
          <Input value={contactInfo.address} onChange={(e) => setContactInfo((c) => ({ ...c, address: e.target.value }))} className={adminInput} />
        </AdminField>
      </AdminFieldGrid>
      <AdminFormActions saveLabel="contact" onSave={saveContact} />
    </AdminFormCard>
  );

  const renderSkillsPage = () => (
    <div className="space-y-6">
      <AdminFormCard icon={SquareStack} title="Skill category" subtitle="Group skills (e.g. Languages, AI, Web).">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            value={skillCategoryName}
            onChange={(e) => setSkillCategoryName(e.target.value)}
            placeholder="e.g. AI & ML"
            className={`${adminInput} flex-1`}
          />
          <Button onClick={saveSkillCategory} size="sm" className="rounded-full shrink-0">
            <Plus className="w-4 h-4 mr-1.5" /> Add category
          </Button>
        </div>
      </AdminFormCard>

      <AdminFormCard icon={Sparkles} title="Skill" subtitle="Pick a category, then add the skill name.">
        <AdminFieldGrid>
          <AdminField label="Category" required>
            <select
              value={skillItemForm.categoryId}
              onChange={(e) => setSkillItemForm((s) => ({ ...s, categoryId: e.target.value }))}
              className={adminSelect}
            >
              <option value="">Choose category</option>
              {skillCategories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </AdminField>
          <AdminField label="Skill name" required>
            <Input
              value={skillItemForm.name}
              onChange={(e) => setSkillItemForm((s) => ({ ...s, name: e.target.value }))}
              placeholder="e.g. Python, React"
              className={adminInput}
            />
          </AdminField>
        </AdminFieldGrid>
        <AdminFormActions
          saveLabel="skill"
          editing={!!editingSkillItemId}
          onSave={saveSkillItem}
          onCancel={() => { setSkillItemForm({ categoryId: "", name: "" }); setEditingSkillItemId(null); }}
          disabled={!skillItemForm.categoryId || !skillItemForm.name.trim()}
        />
      </AdminFormCard>

      <div className="space-y-3">
        <AdminListHeader title="Your skills" count={skillCategories.length} />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {skillCategories.map((category) => (
            <AdminEntryCard key={category.id}>
              <div className="flex items-center justify-between gap-2 mb-3">
                <h3 className="font-mono text-[11px] text-primary tracking-wider uppercase">{category.name}</h3>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => deleteSkillCategory(category.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 min-h-[2rem]">
                {skillItems.filter((item) => item.category_id === category.id).length === 0 ? (
                  <p className="text-xs text-muted-foreground">No skills yet</p>
                ) : (
                  skillItems
                    .filter((item) => item.category_id === category.id)
                    .map((item) => (
                      <span
                        key={item.id}
                        className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-border/40 bg-background/50"
                      >
                        {item.name}
                        <button type="button" onClick={() => editSkillItem(item)} className="text-primary hover:opacity-80">
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button type="button" onClick={() => deleteSkillItem(item.id)} className="text-destructive hover:opacity-80">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                )}
              </div>
            </AdminEntryCard>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEducationPage = () => (
    <div className="space-y-6">
      <AdminFormCard icon={GraduationCap} title="Education entry" subtitle="Institute and degree are required.">
        <AdminFieldGrid>
          <AdminField label="Institute" required>
            <Input value={educationForm.institute} onChange={(e) => setEducationForm((s) => ({ ...s, institute: e.target.value }))} placeholder="University name" className={adminInput} />
          </AdminField>
          <AdminField label="Degree / course" required>
            <Input value={educationForm.degree} onChange={(e) => setEducationForm((s) => ({ ...s, degree: e.target.value }))} placeholder="BS Computer Science" className={adminInput} />
          </AdminField>
        </AdminFieldGrid>

        <AdminFormDivider label="Dates" />
        <AdminFieldGrid>
          <AdminField label="Start">
            <Input value={educationForm.startDate} onChange={(e) => setEducationForm((s) => ({ ...s, startDate: e.target.value }))} placeholder="2022" className={adminInput} />
          </AdminField>
          <AdminField label="End">
            <Input value={educationForm.endDate} onChange={(e) => setEducationForm((s) => ({ ...s, endDate: e.target.value }))} placeholder="2026" className={adminInput} />
          </AdminField>
        </AdminFieldGrid>
        <AdminField label="Display label">
          <Input value={educationForm.year} onChange={(e) => setEducationForm((s) => ({ ...s, year: e.target.value }))} placeholder="2022 – 2026" className={`${adminInput} max-w-md`} />
        </AdminField>

        <AdminFormDivider label="Photo" />
        <AdminImageField value={educationForm.image} onChange={(url) => setEducationForm((s) => ({ ...s, image: url }))} onUpload={uploadImage} />

        <AdminFormActions
          saveLabel="education"
          editing={!!editingEducationId}
          onSave={saveEducation}
          onCancel={() => { setEducationForm({ institute: "", degree: "", startDate: "", endDate: "", year: "", image: "" }); setEditingEducationId(null); }}
          disabled={!educationForm.institute.trim() || !educationForm.degree.trim()}
        />
      </AdminFormCard>

      <div className="space-y-3">
        <AdminListHeader title="Saved entries" count={education.length} />
        {education.map((row) => (
          <AdminEntryCard key={row.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex gap-3 min-w-0">
              {row.image_url ? <img src={row.image_url} alt="" className="h-14 w-14 rounded-lg object-cover border border-border/30 shrink-0" /> : null}
              <div>
                <p className="font-medium text-sm">{row.degree}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{row.institute}</p>
                {(row.year || row.start_date || row.end_date) ? (
                  <p className="text-[11px] text-primary/90 mt-1.5 font-mono">{row.year || [row.start_date, row.end_date].filter(Boolean).join(" – ")}</p>
                ) : null}
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => editEducation(row)}><Pencil className="w-4 h-4 text-primary" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteEducation(row.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
            </div>
          </AdminEntryCard>
        ))}
      </div>
    </div>
  );

  const renderCertificationsPage = () => (
    <div className="space-y-6">
      <AdminFormCard icon={Award} title="Certification" subtitle="Course name is required.">
        <AdminFieldGrid>
          <AdminField label="Course name" required>
            <Input value={certForm.courseName} onChange={(e) => setCertForm((s) => ({ ...s, courseName: e.target.value }))} placeholder="AWS Solutions Architect" className={adminInput} />
          </AdminField>
          <AdminField label="Credential ID">
            <Input value={certForm.code} onChange={(e) => setCertForm((s) => ({ ...s, code: e.target.value }))} placeholder="ABC-123" className={adminInput} />
          </AdminField>
          <AdminField label="Verify link" className="md:col-span-2">
            <Input type="url" value={certForm.url} onChange={(e) => setCertForm((s) => ({ ...s, url: e.target.value }))} placeholder="https://..." className={adminInput} />
          </AdminField>
        </AdminFieldGrid>

        <AdminFormDivider label="Details" />
        <AdminField label="Description">
          <Textarea value={certForm.description} onChange={(e) => setCertForm((s) => ({ ...s, description: e.target.value }))} placeholder="Short summary" rows={3} className={`${adminInput} min-h-[88px]`} />
        </AdminField>

        <AdminFormDivider label="Certificate image" />
        <AdminImageField value={certForm.image} onChange={(url) => setCertForm((s) => ({ ...s, image: url }))} onUpload={uploadImage} fullImagePreview />

        <AdminFormActions
          saveLabel="certification"
          editing={!!editingCertificationId}
          onSave={saveCertification}
          onCancel={() => { setCertForm({ image: "", courseName: "", code: "", url: "", description: "" }); setEditingCertificationId(null); }}
          disabled={!certForm.courseName.trim()}
        />
      </AdminFormCard>

      <div className="space-y-3">
        <AdminListHeader title="Saved certifications" count={certifications.length} />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {certifications.map((cert) => (
            <AdminEntryCard key={cert.id} className={`flex flex-col gap-3 ${cert.is_pinned ? "border-primary/40 ring-1 ring-primary/15" : ""}`}>
              {cert.is_pinned ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-primary uppercase tracking-wider">
                  <Pin className="w-3 h-3" /> Pinned
                </span>
              ) : null}
              {(cert.image_url || cert.image) ? (
                <img src={cert.image_url || cert.image || ""} alt={cert.course_name || cert.name || "Certificate"} className="w-full max-h-48 rounded-lg object-contain bg-muted/15 border border-border/25" />
              ) : null}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm leading-snug">{cert.course_name || cert.name}</p>
                {cert.code ? <p className="text-xs text-muted-foreground mt-1 font-mono">ID: {cert.code}</p> : null}
                {cert.description ? <p className="text-xs text-muted-foreground mt-2 line-clamp-3 leading-relaxed">{cert.description}</p> : null}
              </div>
              <div className="flex items-center gap-1 pt-1 border-t border-border/25">
                <Button variant="ghost" size="icon" className="h-8 w-8" title={cert.is_pinned ? "Unpin" : "Pin to top"} onClick={() => toggleCertificationPin(cert)}>
                  {cert.is_pinned ? <PinOff className="w-4 h-4 text-primary" /> : <Pin className="w-4 h-4 text-muted-foreground" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => editCertification(cert)}><Pencil className="w-4 h-4 text-primary" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteCertification(cert.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            </AdminEntryCard>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProjectsPage = () => (
    <div className="space-y-6">
      <AdminFormCard icon={FolderOpen} title="Project" subtitle="Name and technology are required.">
        <AdminFieldGrid>
          <AdminField label="Project name" required>
            <Input value={projectForm.projectName} onChange={(e) => setProjectForm((s) => ({ ...s, projectName: e.target.value }))} placeholder="InferenceLogic CMS" className={adminInput} />
          </AdminField>
          <AdminField label="Technology" required>
            <Input value={projectForm.technology} onChange={(e) => setProjectForm((s) => ({ ...s, technology: e.target.value }))} placeholder="React, Supabase, Tailwind" className={adminInput} />
          </AdminField>
        </AdminFieldGrid>

        <AdminFormDivider label="Links" />
        <AdminFieldGrid>
          <AdminField label="GitHub">
            <Input type="url" value={projectForm.github} onChange={(e) => setProjectForm((s) => ({ ...s, github: e.target.value }))} placeholder="https://github.com/..." className={adminInput} />
          </AdminField>
          <AdminField label="Live demo">
            <Input type="url" value={projectForm.live} onChange={(e) => setProjectForm((s) => ({ ...s, live: e.target.value }))} placeholder="https://..." className={adminInput} />
          </AdminField>
        </AdminFieldGrid>

        <AdminFormDivider label="Overview" />
        <AdminField label="Description">
          <Textarea value={projectForm.description} onChange={(e) => setProjectForm((s) => ({ ...s, description: e.target.value }))} placeholder="What the project does" rows={3} className={`${adminInput} min-h-[88px]`} />
        </AdminField>

        <AdminFormDivider label="Screenshot" />
        <AdminImageField value={projectForm.image} onChange={(url) => setProjectForm((s) => ({ ...s, image: url }))} onUpload={uploadImage} fullImagePreview />

        <AdminFormActions
          saveLabel="project"
          editing={!!editingProjectId}
          onSave={saveProject}
          onCancel={() => { setProjectForm({ image: "", projectName: "", technology: "", github: "", live: "", description: "" }); setEditingProjectId(null); }}
          disabled={!projectForm.projectName.trim() || !projectForm.technology.trim()}
        />
      </AdminFormCard>

      <div className="space-y-3">
        <AdminListHeader title="Saved projects" count={projects.length} />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <AdminEntryCard key={project.id} className={`flex flex-col gap-3 ${project.is_pinned ? "border-primary/40 ring-1 ring-primary/15" : ""}`}>
              {project.is_pinned ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-primary uppercase tracking-wider">
                  <Pin className="w-3 h-3" /> Pinned
                </span>
              ) : null}
              {project.image_url ? (
                <img src={project.image_url} alt={project.project_name || project.title || "Project"} className="w-full max-h-48 rounded-lg object-contain bg-muted/15 border border-border/25" />
              ) : null}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{project.project_name || project.title}</p>
                <p className="text-xs text-primary/80 mt-1">{project.technology || (project.tech_stack || []).join(", ")}</p>
                {project.description ? <p className="text-xs text-muted-foreground mt-2 line-clamp-3 leading-relaxed">{project.description}</p> : null}
                <div className="mt-2 flex flex-wrap gap-3 text-xs">
                  {project.github_url ? <a className="text-primary hover:underline" href={project.github_url} target="_blank" rel="noreferrer">GitHub</a> : null}
                  {project.live_url ? <a className="text-primary hover:underline" href={project.live_url} target="_blank" rel="noreferrer">Live</a> : null}
                </div>
              </div>
              <div className="flex items-center gap-1 pt-1 border-t border-border/25">
                <Button variant="ghost" size="icon" className="h-8 w-8" title={project.is_pinned ? "Unpin" : "Pin to top"} onClick={() => toggleProjectPin(project)}>
                  {project.is_pinned ? <PinOff className="w-4 h-4 text-primary" /> : <Pin className="w-4 h-4 text-muted-foreground" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => editProject(project)}><Pencil className="w-4 h-4 text-primary" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteProject(project.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            </AdminEntryCard>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-foreground text-sm">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto max-w-6xl px-4 py-6 md:py-8">
        <div className="rounded-2xl border border-border/50 bg-card/30 overflow-hidden">
          <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-border/50 px-4 py-4 md:px-6 bg-muted/10">
            <div>
              <Link to="/" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary mb-2">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to site
              </Link>
              <h1 className="text-xl md:text-2xl font-semibold">Content manager</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Edit portfolio sections</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="w-fit shrink-0">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </header>

          <div className="grid gap-0 lg:grid-cols-[240px_1fr]">
            <aside className="border-b lg:border-b-0 lg:border-r border-border/50 bg-muted/5 p-3 md:p-4 lg:sticky lg:top-0 lg:h-[calc(100vh-5rem)] lg:overflow-auto">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 px-1">Sections</p>
              <div className="space-y-1">
                {pages.map((page) => {
                  const Icon = page.icon;
                  const badge = page.id === "inbox" && unreadCount > 0 ? unreadCount : null;
                  return (
                    <button key={page.id} onClick={() => setActivePage(page.id)} className={pageButtonClass(page.id)}>
                      <Icon className={`w-4 h-4 ${activePage === page.id ? "text-primary" : "text-muted-foreground"}`} />
                      <span className="font-medium text-sm flex-1">{page.label}</span>
                      {badge !== null ? (
                        <span className="text-[10px] font-mono tabular-nums px-1.5 py-0.5 rounded-full bg-primary/20 text-primary">
                          {badge > 99 ? "99+" : badge}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </aside>

            <section className="p-4 md:p-6 bg-background/50 min-h-[420px]">
              {activePage === "contact" && renderContactPage()}
              {activePage === "inbox" && renderInboxPage()}
              {activePage === "skills" && renderSkillsPage()}
              {activePage === "education" && renderEducationPage()}
              {activePage === "certifications" && renderCertificationsPage()}
              {activePage === "projects" && renderProjectsPage()}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
