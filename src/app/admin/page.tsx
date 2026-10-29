'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { districts, getDistrictName } from '@/lib/districts';
import { serviceCategories } from '@/lib/categories';
import { createClient } from '@/lib/supabase/client';
import type { TechnicianWithServices, ServiceCategory } from '@/lib/types';
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  LogOut,
  AlertTriangle,
  Loader2,
  X,
  Check,
  Search,
  CheckCircle2,
  Clock,
  Phone,
  MessageSquare,
  MapPin,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

type TabType = 'all' | 'pending' | 'published';

interface FormState {
  id?: string;
  name: string;
  categoryId: string;
  districtCode: string;
  town: string;
  phone: string;
  whatsappNumber: string;
  priceLkr: string;
  descriptionEn: string;
  descriptionSi: string;
  published: boolean;
  verified: boolean;
}

const initialFormState: FormState = {
  name: '',
  categoryId: serviceCategories[0].id,
  districtCode: 'CMB',
  town: '',
  phone: '',
  whatsappNumber: '',
  priceLkr: '',
  descriptionEn: '',
  descriptionSi: '',
  published: true,
  verified: false,
};

export default function AdminDashboard() {
  const { locale, t } = useI18n();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [technicians, setTechnicians] = useState<TechnicianWithServices[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>(serviceCategories);
  const [filterSearch, setFilterSearch] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [reviewTech, setReviewTech] = useState<TechnicianWithServices | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState<FormState>(initialFormState);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Load Auth & Technicians
  const fetchTechnicians = async () => {
    try {
      const supabase = createClient();

      // Fetch categories
      const { data: dbCategories } = await supabase
        .from('service_categories')
        .select('*')
        .order('name_en');
      if (dbCategories && dbCategories.length > 0) {
        setCategories(dbCategories);
      }

      // Fetch technicians with services and districts
      const { data, error } = await supabase
        .from('technicians')
        .select(`
          *,
          district:districts(*),
          services:technician_services(
            category:service_categories(*)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formatted: TechnicianWithServices[] = data.map((t: any) => ({
          ...t,
          services: t.services?.map((ts: any) => ts.category).filter(Boolean) || [],
          district: t.district || districts.find((d) => d.code === t.district_code)!,
        }));
        setTechnicians(formatted);
      }
    } catch (err: any) {
      console.error('Error fetching technicians:', err);
    }
  };

  useEffect(() => {
    async function checkAuthAndLoad() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.replace('/admin/login');
          return;
        }

        const { data: adminRecord } = await supabase
          .from('admin_users')
          .select('id')
          .eq('id', user.id)
          .maybeSingle();

        if (!adminRecord) {
          await supabase.auth.signOut();
          router.replace('/admin/login');
          return;
        }

        await fetchTechnicians();
        setLoading(false);
      } catch {
        router.replace('/admin/login');
      }
    }

    checkAuthAndLoad();
  }, [router]);

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignored
    }
    router.replace('/admin/login');
  };

  // Open Add modal
  const openAddModal = () => {
    setForm({
      ...initialFormState,
      categoryId: categories[0]?.id || '',
    });
    setFormError('');
    setModalOpen(true);
  };

  // Open Edit modal
  const openEditModal = (tech: TechnicianWithServices) => {
    setForm({
      id: tech.id,
      name: tech.name,
      categoryId: tech.services[0]?.id || categories[0]?.id || '',
      districtCode: tech.district_code,
      town: tech.town,
      phone: tech.phone,
      whatsappNumber: tech.whatsapp_number,
      priceLkr: tech.indicative_price_lkr ? String(tech.indicative_price_lkr) : '',
      descriptionEn: tech.description_en,
      descriptionSi: tech.description_si,
      published: tech.published,
      verified: tech.verified,
    });
    setFormError('');
    setModalOpen(true);
  };

  // Save technician (Insert or Update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);

    try {
      const supabase = createClient();

      // Generate slug
      const baseSlug = form.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const uniqueSuffix = Math.random().toString(36).substring(2, 6);
      const slug = form.id
        ? (technicians.find((t) => t.id === form.id)?.slug || `${baseSlug}-${uniqueSuffix}`)
        : `${baseSlug}-${uniqueSuffix}`;

      const techPayload = {
        name: form.name.trim(),
        slug,
        district_code: form.districtCode,
        town: form.town.trim(),
        phone: form.phone.trim(),
        whatsapp_number: form.whatsappNumber.trim() || form.phone.trim(),
        indicative_price_lkr: form.priceLkr ? parseInt(form.priceLkr, 10) : null,
        description_en: form.descriptionEn.trim(),
        description_si: form.descriptionSi.trim(),
        published: form.published,
        verified: form.verified,
        is_demo: false,
      };

      let techId = form.id;

      if (form.id) {
        // Update
        const { error: updateError } = await supabase
          .from('technicians')
          .update(techPayload)
          .eq('id', form.id);
        if (updateError) throw updateError;
      } else {
        // Insert
        const { data: newTech, error: insertError } = await supabase
          .from('technicians')
          .insert(techPayload)
          .select('id')
          .single();
        if (insertError) throw insertError;
        techId = newTech.id;
      }

      // Update service category junction
      if (techId && form.categoryId) {
        // Delete old relations and insert new one
        await supabase.from('technician_services').delete().eq('technician_id', techId);
        await supabase.from('technician_services').insert({
          technician_id: techId,
          category_id: form.categoryId,
        });
      }

      await fetchTechnicians();
      setModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save technician');
    } finally {
      setSaving(false);
    }
  };

  // Toggle publish status
  const handleTogglePublish = async (tech: TechnicianWithServices) => {
    setActionLoading(tech.id);
    try {
      const supabase = createClient();
      const newStatus = !tech.published;

      // Optimistic update
      setTechnicians((prev) =>
        prev.map((t) => (t.id === tech.id ? { ...t, published: newStatus } : t))
      );

      const { error } = await supabase
        .from('technicians')
        .update({ published: newStatus })
        .eq('id', tech.id);

      if (error) throw error;
      setToastMessage(newStatus ? `${tech.name} is now published on the website.` : `${tech.name} has been unpublished.`);
    } catch (err) {
      console.error('Failed to toggle publish:', err);
      await fetchTechnicians(); // Revert on error
    } finally {
      setActionLoading(null);
    }
  };

  // Approve technician (immediately published & verified on site)
  const handleApprove = async (tech: TechnicianWithServices) => {
    setActionLoading(tech.id);
    try {
      const supabase = createClient();
      setTechnicians((prev) =>
        prev.map((t) => (t.id === tech.id ? { ...t, published: true, verified: true } : t))
      );

      const { error } = await supabase
        .from('technicians')
        .update({ published: true, verified: true })
        .eq('id', tech.id);

      if (error) throw error;
      setToastMessage(`✓ Approved! ${tech.name} is now live on FixLanka.`);
      if (reviewTech?.id === tech.id) setReviewTech(null);
    } catch (err: any) {
      console.error('Failed to approve technician:', err);
      alert(`Approval error: ${err.message}`);
      await fetchTechnicians();
    } finally {
      setActionLoading(null);
    }
  };

  // Reject technician application
  const handleReject = async (tech: TechnicianWithServices) => {
    if (!window.confirm(`Are you sure you want to reject and remove the registration application for "${tech.name}"?`)) {
      return;
    }

    setActionLoading(tech.id);
    try {
      const supabase = createClient();
      const { error } = await supabase.from('technicians').delete().eq('id', tech.id);
      if (error) throw error;

      setTechnicians((prev) => prev.filter((t) => t.id !== tech.id));
      setToastMessage(`Registration application for ${tech.name} was rejected and removed.`);
      if (reviewTech?.id === tech.id) setReviewTech(null);
    } catch (err: any) {
      console.error('Failed to reject technician:', err);
      alert(`Rejection error: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Delete technician
  const handleDelete = async (id: string) => {
    setActionLoading(id);
    try {
      const supabase = createClient();
      const { error } = await supabase.from('technicians').delete().eq('id', id);
      if (error) throw error;

      setTechnicians((prev) => prev.filter((t) => t.id !== id));
      setDeleteConfirmId(null);
      setToastMessage('Technician listing deleted successfully.');
    } catch (err: any) {
      alert(`Failed to delete technician: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Counts for tabs
  const pendingCount = useMemo(() => technicians.filter((t) => !t.published).length, [technicians]);
  const publishedCount = useMemo(() => technicians.filter((t) => t.published).length, [technicians]);

  // Filtered view with Tab and Search
  const filteredTechs = useMemo(() => {
    let list = technicians;
    if (activeTab === 'pending') {
      list = list.filter((t) => !t.published);
    } else if (activeTab === 'published') {
      list = list.filter((t) => t.published);
    }

    if (!filterSearch.trim()) return list;
    const q = filterSearch.toLowerCase();
    return list.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.town.toLowerCase().includes(q) ||
        t.district?.name_en.toLowerCase().includes(q) ||
        t.services.some((s) => s.name_en.toLowerCase().includes(q))
    );
  }, [technicians, activeTab, filterSearch]);

  if (loading) {
    return (
      <main className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Toast notification banner */}
        {toastMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold text-sm flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-600" />
              <span>{toastMessage}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-emerald-700 hover:text-emerald-900 p-1"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-navy">{t.admin.dashboard}</h1>
            <p className="text-sm text-navy-light mt-1">
              Review registrations, approve profiles, and manage live listings
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl
                         font-medium text-sm hover:bg-primary-hover transition-colors shadow-sm cursor-pointer"
            >
              <Plus size={16} />
              {t.admin.addTechnician}
            </button>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-navy-light
                         hover:text-danger hover:bg-red-50 rounded-xl transition-colors cursor-pointer border border-border"
            >
              <LogOut size={16} />
              {t.admin.signOut}
            </button>
          </div>
        </div>

        {/* Tabs: All, Pending Approvals, Live */}
        <div className="flex items-center gap-2 mb-6 border-b border-border pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'all'
                ? 'bg-navy text-white shadow-xs'
                : 'text-slate-600 hover:text-navy hover:bg-slate-100'
            }`}
          >
            <span>{t.admin.allTab}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              activeTab === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {technicians.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'pending'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-navy hover:bg-slate-100'
            }`}
          >
            <Clock size={15} />
            <span>{t.admin.pendingTab}</span>
            {pendingCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500 text-white font-extrabold animate-pulse">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('published')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'published'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-navy hover:bg-slate-100'
            }`}
          >
            <CheckCircle2 size={15} />
            <span>{t.admin.publishedTab}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              activeTab === 'published' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {publishedCount}
            </span>
          </button>
        </div>

        {/* Search filter */}
        <div className="mb-6 flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-border shadow-2xs max-w-md">
          <Search size={18} className="text-navy-light" />
          <input
            type="text"
            placeholder="Search technicians by name, town, or service..."
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            className="w-full bg-transparent text-sm border-0 focus:outline-none text-navy placeholder:text-navy-light"
          />
          {filterSearch && (
            <button onClick={() => setFilterSearch('')} className="text-navy-light hover:text-navy">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Listings table */}
        {filteredTechs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-border p-8">
            <p className="text-navy font-medium text-base mb-1">
              {activeTab === 'pending' ? t.admin.noPending : t.admin.noTechnicians}
            </p>
            <p className="text-navy-light text-sm mb-4">
              {activeTab === 'pending'
                ? 'All registration applications have been reviewed.'
                : 'Click below to add a technician listing manually.'}
            </p>
            {activeTab !== 'pending' && (
              <button
                onClick={openAddModal}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover"
              >
                <Plus size={16} />
                {t.admin.addTechnician}
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-slate-50/75">
                    <th className="text-left px-5 py-3.5 font-semibold text-navy">
                      {t.admin.nameLabel}
                    </th>
                    <th className="text-left px-5 py-3.5 font-semibold text-navy hidden sm:table-cell">
                      {t.admin.servicesLabel}
                    </th>
                    <th className="text-left px-5 py-3.5 font-semibold text-navy hidden md:table-cell">
                      Location
                    </th>
                    <th className="text-left px-5 py-3.5 font-semibold text-navy hidden lg:table-cell">
                      Price (LKR)
                    </th>
                    <th className="text-left px-5 py-3.5 font-semibold text-navy">
                      Status
                    </th>
                    <th className="text-right px-5 py-3.5 font-semibold text-navy">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredTechs.map((tech) => (
                    <tr
                      key={tech.id}
                      className={`hover:bg-slate-50/50 transition-colors ${
                        !tech.published ? 'bg-amber-50/20' : ''
                      }`}
                    >
                      <td className="px-5 py-4">
                        <div className="font-semibold text-navy flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setReviewTech(tech)}
                            className="hover:text-blue-600 text-left font-bold"
                          >
                            {tech.name}
                          </button>
                          {tech.verified && (
                            <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              ✓ Verified
                            </span>
                          )}
                          {!tech.published && (
                            <span className="inline-flex items-center text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                              New
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-navy-light mt-0.5">
                          {tech.phone || 'No phone'} {tech.town ? `· ${tech.town}` : ''}
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {tech.services?.map((s) => (
                            <span
                              key={s.slug || s.id}
                              className="inline-block px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
                            >
                              {s.name_en}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-navy-light hidden md:table-cell">
                        <span className="font-medium text-navy">{tech.town || '—'}</span>
                        <span className="text-xs block text-slate-500">
                          {getDistrictName(tech.district_code, locale)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-navy font-medium hidden lg:table-cell">
                        {tech.indicative_price_lkr
                          ? `LKR ${tech.indicative_price_lkr.toLocaleString()}`
                          : '—'}
                      </td>
                      <td className="px-5 py-4">
                        {tech.published ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            {t.admin.published}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                            <Clock size={12} className="text-amber-600" />
                            {t.admin.pending}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        {!tech.published ? (
                          /* Pending Application Approval Actions */
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setReviewTech(tech)}
                              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                              title="Review full application"
                            >
                              Review
                            </button>
                            <button
                              type="button"
                              onClick={() => handleApprove(tech)}
                              disabled={actionLoading === tech.id}
                              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer shadow-xs"
                              title={t.admin.approve}
                            >
                              {actionLoading === tech.id ? (
                                <Loader2 size={13} className="animate-spin" />
                              ) : (
                                <Check size={13} strokeWidth={3} />
                              )}
                              <span>Approve</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReject(tech)}
                              disabled={actionLoading === tech.id}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors cursor-pointer"
                              title={t.admin.reject}
                            >
                              <X size={13} />
                              <span>Reject</span>
                            </button>
                          </div>
                        ) : (
                          /* Standard published row actions */
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              title={t.admin.unpublish}
                              onClick={() => handleTogglePublish(tech)}
                              disabled={actionLoading === tech.id}
                              className="p-1.5 rounded-lg border border-border hover:bg-slate-100 text-navy-light hover:text-navy cursor-pointer transition-colors"
                            >
                              {actionLoading === tech.id ? (
                                <Loader2 size={16} className="animate-spin text-primary" />
                              ) : (
                                <EyeOff size={16} />
                              )}
                            </button>
                            <button
                              title={t.admin.editTechnician}
                              onClick={() => openEditModal(tech)}
                              className="p-1.5 rounded-lg border border-border hover:bg-slate-100 text-navy-light hover:text-navy cursor-pointer transition-colors"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              title={t.admin.deleteTechnician}
                              onClick={() => setDeleteConfirmId(tech.id)}
                              className="p-1.5 rounded-lg border border-border hover:bg-red-50 text-navy-light hover:text-red-600 cursor-pointer transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Detailed Application Review Modal */}
        {reviewTech && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl border border-border max-w-xl w-full p-6 sm:p-8 shadow-2xl my-8">
              <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 mb-1">
                    <Clock size={12} />
                    {reviewTech.published ? 'Published Listing' : 'Registration Application'}
                  </span>
                  <h2 className="text-xl font-black text-navy">{reviewTech.name}</h2>
                </div>
                <button
                  onClick={() => setReviewTech(null)}
                  className="text-slate-400 hover:text-navy p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-5 text-sm">
                {/* Contact info cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      <Phone size={13} className="text-blue-600" />
                      <span>Phone Number</span>
                    </div>
                    {reviewTech.phone ? (
                      <a
                        href={`tel:${reviewTech.phone}`}
                        className="font-bold text-blue-600 hover:underline flex items-center gap-1.5"
                      >
                        {reviewTech.phone}
                        <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span className="text-slate-400 font-medium">None</span>
                    )}
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      <MessageSquare size={13} className="text-emerald-600" />
                      <span>WhatsApp</span>
                    </div>
                    {reviewTech.whatsapp_number ? (
                      <a
                        href={`https://wa.me/${reviewTech.whatsapp_number.replace('+', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-emerald-600 hover:underline flex items-center gap-1.5"
                      >
                        {reviewTech.whatsapp_number}
                        <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span className="text-slate-400 font-medium">None</span>
                    )}
                  </div>
                </div>

                {/* Location & Services */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-slate-700">
                    <MapPin size={16} className="text-primary shrink-0" />
                    <span className="font-bold">{reviewTech.town}</span>
                    <span className="text-slate-500">
                      ({getDistrictName(reviewTech.district_code, locale)} District)
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Applied Services
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {reviewTech.services?.map((s) => (
                        <span
                          key={s.id || s.slug}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-100 text-blue-800"
                        >
                          {s.name_en}
                        </span>
                      ))}
                    </div>
                  </div>

                  {reviewTech.indicative_price_lkr && (
                    <div className="pt-2 border-t border-slate-200">
                      <span className="text-xs text-slate-500">Starting rate: </span>
                      <span className="font-extrabold text-navy">
                        LKR {reviewTech.indicative_price_lkr.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Description */}
                {(reviewTech.description_en || reviewTech.description_si) && (
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Applicant Experience & Notes
                    </span>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed text-xs sm:text-sm">
                      {reviewTech.description_en || reviewTech.description_si}
                    </div>
                  </div>
                )}
              </div>

              {/* Review Actions */}
              <div className="mt-8 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setReviewTech(null)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold text-sm cursor-pointer"
                >
                  Close
                </button>
                {!reviewTech.published ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleReject(reviewTech)}
                      disabled={actionLoading === reviewTech.id}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-sm cursor-pointer transition-colors"
                    >
                      Reject Application
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApprove(reviewTech)}
                      disabled={actionLoading === reviewTech.id}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm cursor-pointer transition-colors shadow-sm flex items-center justify-center gap-1.5"
                    >
                      {actionLoading === reviewTech.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Check size={16} strokeWidth={3} />
                      )}
                      <span>Approve & Publish Immediately</span>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleTogglePublish(reviewTech)}
                    disabled={actionLoading === reviewTech.id}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-bold text-sm cursor-pointer"
                  >
                    Unpublish
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl border border-border max-w-xl w-full p-6 shadow-xl my-8">
              <div className="flex items-center justify-between pb-4 border-b border-border mb-5">
                <h2 className="text-lg font-bold text-navy">
                  {form.id ? t.admin.editTechnician : t.admin.addTechnician}
                </h2>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-navy-light hover:text-navy p-1 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              {formError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-start gap-2">
                  <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Kamal Perera"
                    className="w-full px-3.5 py-2 rounded-xl border border-border text-sm focus:border-primary focus:outline-none"
                  />
                </div>

                {/* Service Category & District */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1">
                      Primary Service *
                    </label>
                    <select
                      value={form.categoryId}
                      onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-border text-sm focus:border-primary focus:outline-none bg-white"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name_en} ({c.name_si})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1">
                      District *
                    </label>
                    <select
                      value={form.districtCode}
                      onChange={(e) => setForm({ ...form, districtCode: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-border text-sm focus:border-primary focus:outline-none bg-white"
                    >
                      {districts.map((d) => (
                        <option key={d.code} value={d.code}>
                          {d.name_en} ({d.name_si})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Town & Starting Price */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1">
                      Town / City *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.town}
                      onChange={(e) => setForm({ ...form, town: e.target.value })}
                      placeholder="e.g. Nugegoda"
                      className="w-full px-3.5 py-2 rounded-xl border border-border text-sm focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1">
                      Starting Price (LKR)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="500"
                      value={form.priceLkr}
                      onChange={(e) => setForm({ ...form, priceLkr: e.target.value })}
                      placeholder="e.g. 2500"
                      className="w-full px-3.5 py-2 rounded-xl border border-border text-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                {/* Phone & WhatsApp */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="077 123 4567"
                      className="w-full px-3.5 py-2 rounded-xl border border-border text-sm focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1">
                      WhatsApp Number
                    </label>
                    <input
                      type="text"
                      value={form.whatsappNumber}
                      onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                      placeholder="077 123 4567"
                      className="w-full px-3.5 py-2 rounded-xl border border-border text-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                {/* Description EN */}
                <div>
                  <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1">
                    Description (English)
                  </label>
                  <textarea
                    rows={2}
                    value={form.descriptionEn}
                    onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })}
                    placeholder="Brief description of experience, specialties..."
                    className="w-full px-3.5 py-2 rounded-xl border border-border text-sm focus:border-primary focus:outline-none"
                  />
                </div>

                {/* Description SI */}
                <div>
                  <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1">
                    Description (Sinhala)
                  </label>
                  <textarea
                    rows={2}
                    value={form.descriptionSi}
                    onChange={(e) => setForm({ ...form, descriptionSi: e.target.value })}
                    placeholder="අත්දැකීම් සහ සේවාවන් පිළිබඳ විස්තරය..."
                    className="w-full px-3.5 py-2 rounded-xl border border-border text-sm focus:border-primary focus:outline-none font-sinhala"
                  />
                </div>

                {/* Toggles */}
                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-navy">
                    <input
                      type="checkbox"
                      checked={form.published}
                      onChange={(e) => setForm({ ...form, published: e.target.checked })}
                      className="w-4 h-4 rounded text-primary focus:ring-0 cursor-pointer"
                    />
                    Published (Visible on site)
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-navy">
                    <input
                      type="checkbox"
                      checked={form.verified}
                      onChange={(e) => setForm({ ...form, verified: e.target.checked })}
                      className="w-4 h-4 rounded text-primary focus:ring-0 cursor-pointer"
                    />
                    Verified Pro Badge
                  </label>
                </div>

                {/* Modal Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-navy-light hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-primary rounded-xl hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    {saving && <Loader2 size={16} className="animate-spin" />}
                    {form.id ? 'Save Changes' : 'Create Listing'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete confirmation modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-2xl border border-border max-w-sm w-full p-6 shadow-xl">
              <h2 className="text-lg font-bold text-navy mb-2">
                {t.admin.deleteTechnician}
              </h2>
              <p className="text-sm text-navy-light mb-6">
                Are you sure you want to delete this listing? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 text-sm font-medium text-navy-light hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  {t.admin.cancel}
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  disabled={actionLoading === deleteConfirmId}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {actionLoading === deleteConfirmId && <Loader2 size={14} className="animate-spin" />}
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
