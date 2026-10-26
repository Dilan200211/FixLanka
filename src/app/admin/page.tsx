'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { demoTechnicians } from '@/lib/demo-data';
import { getCategoryName } from '@/lib/categories';
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  LogOut,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { locale, t } = useI18n();
  const [technicians] = useState(demoTechnicians);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // TODO: Replace with actual Supabase auth check
  // For now, show a placeholder dashboard with demo data

  return (
    <main className="min-h-screen bg-surface">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold text-navy">{t.admin.dashboard}</h1>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-navy-light
                         hover:text-danger transition-colors"
            >
              <LogOut size={16} />
              {t.admin.signOut}
            </Link>
          </div>
        </div>

        {/* Info banner */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 mb-6">
          <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            This dashboard is showing demo data. Connect Supabase to manage real technician listings.
          </p>
        </div>

        {/* Add button */}
        <div className="mb-6">
          <button
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl
                       font-medium text-sm hover:bg-primary-hover transition-colors"
          >
            <Plus size={16} />
            {t.admin.addTechnician}
          </button>
        </div>

        {/* Listings table */}
        {technicians.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-navy-light">{t.admin.noTechnicians}</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface">
                    <th className="text-left px-4 py-3 font-medium text-navy-light">
                      {t.admin.nameLabel}
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-navy-light hidden sm:table-cell">
                      {t.admin.servicesLabel}
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-navy-light hidden md:table-cell">
                      {t.admin.districtLabel}
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-navy-light">
                      Status
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-navy-light">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {technicians.map((tech) => (
                    <tr
                      key={tech.id}
                      className="border-b border-border last:border-0 hover:bg-surface-hover transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="font-medium text-navy">
                          {tech.name}
                        </span>
                        <span className="block text-xs text-navy-light sm:hidden">
                          {tech.services
                            ?.map((s) => getCategoryName(s, locale))
                            .join(', ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {tech.services?.map((s) => (
                            <span
                              key={s.slug}
                              className="badge badge-muted text-[11px]"
                            >
                              {getCategoryName(s, locale)}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-navy-light hidden md:table-cell">
                        {locale === 'si'
                          ? tech.district?.name_si
                          : tech.district?.name_en}
                      </td>
                      <td className="px-4 py-3">
                        {tech.published ? (
                          <span className="badge badge-success">
                            {t.admin.published}
                          </span>
                        ) : (
                          <span className="badge badge-warning">
                            {t.admin.draft}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            title={
                              tech.published
                                ? t.admin.unpublish
                                : t.admin.publish
                            }
                            className="p-1.5 rounded-lg hover:bg-surface transition-colors text-navy-light hover:text-navy"
                          >
                            {tech.published ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </button>
                          <button
                            title={t.admin.editTechnician}
                            className="p-1.5 rounded-lg hover:bg-surface transition-colors text-navy-light hover:text-navy"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            title={t.admin.deleteTechnician}
                            onClick={() => setDeleteConfirm(tech.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-navy-light hover:text-danger"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Delete confirmation modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
            <div className="bg-white rounded-2xl border border-border max-w-sm w-full p-6">
              <h2 className="text-lg font-semibold text-navy mb-2">
                {t.admin.deleteTechnician}
              </h2>
              <p className="text-sm text-navy-light mb-6">
                {t.admin.confirmDelete}
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-sm font-medium text-navy-light hover:bg-surface
                             rounded-lg transition-colors"
                >
                  {t.admin.cancel}
                </button>
                <button
                  onClick={() => {
                    // TODO: Implement actual delete with Supabase
                    setDeleteConfirm(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-danger rounded-lg
                             hover:opacity-90 transition-opacity"
                >
                  {t.admin.deleteTechnician}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
