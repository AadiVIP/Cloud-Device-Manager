import React, { useState } from 'react';
import { useDeviceManager } from '../hooks/useDeviceManager';
import { Navbar } from '../components/common/Navbar';
import { SearchBar } from '../components/common/SearchBar';
import { StatusFilter } from '../components/common/StatusFilter';
import { CategoryCard } from '../components/category/CategoryCard';
import { AddCategoryDialog } from '../components/category/AddCategoryDialog';
import { EditCategoryDialog } from '../components/category/EditCategoryDialog';
import { AddDeviceDialog } from '../components/device/AddDeviceDialog';
import { EditDeviceDialog } from '../components/device/EditDeviceDialog';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { SupabaseConfigBanner } from '../components/common/SupabaseConfigBanner';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Category, Device, DeviceStatus } from '../types';
import {
  Plus,
  ChevronsUpDown,
  RefreshCw,
  FolderPlus,
  Server,
  Activity,
  CheckCircle2,
  Clock,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    categories,
    filteredData,
    loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    collapsedCategories,
    toggleCategoryCollapse,
    collapseAll,
    expandAll,
    addCategory,
    updateCategory,
    deleteCategory,
    addDevice,
    updateDevice,
    updateDeviceStatus,
    deleteDevice,
    refreshData,
    stats,
  } = useDeviceManager();

  // Modals state
  const [addCatOpen, setAddCatOpen] = useState(false);
  const [editCatTarget, setEditCatTarget] = useState<Category | null>(null);

  const [addDeviceTarget, setAddDeviceTarget] = useState<{
    categoryId: string;
    categoryName: string;
  } | null>(null);
  const [editDeviceTarget, setEditDeviceTarget] = useState<Device | null>(null);

  // Deletion modals state
  const [deleteCatTarget, setDeleteCatTarget] = useState<Category | null>(null);
  const [deleteDeviceTarget, setDeleteDeviceTarget] = useState<Device | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Are all collapsed?
  const allCollapsed =
    categories.length > 0 &&
    categories.every((c) => collapsedCategories[c.id] === true);

  const toggleAllCollapse = () => {
    if (allCollapsed) {
      expandAll();
    } else {
      collapseAll();
    }
  };

  // Confirm Category Delete
  const handleConfirmDeleteCategory = async () => {
    if (!deleteCatTarget) return;
    try {
      setIsDeleting(true);
      await deleteCategory(deleteCatTarget.id, deleteCatTarget.name);
      setDeleteCatTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // Confirm Device Delete
  const handleConfirmDeleteDevice = async () => {
    if (!deleteDeviceTarget) return;
    try {
      setIsDeleting(true);
      await deleteDevice(deleteDeviceTarget.id, deleteDeviceTarget.name);
      setDeleteDeviceTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <Navbar onAddCategory={() => setAddCatOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Banner if Supabase not configured in .env */}
        <SupabaseConfigBanner />

        {/* Fleet KPI Quick Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Server className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-medium text-slate-400 truncate">Categories</div>
              <div className="text-lg font-bold text-slate-100">{stats.totalCategories}</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center shrink-0">
              <Activity className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-medium text-slate-400 truncate">Total Devices</div>
              <div className="text-lg font-bold text-slate-100">{stats.totalDevices}</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-medium text-slate-400 truncate">Active</div>
              <div className="text-lg font-bold text-emerald-400">{stats.active}</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-medium text-slate-400 truncate">In Progress</div>
              <div className="text-lg font-bold text-amber-400">{stats.inProgress}</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-800 text-slate-400 border border-slate-700/60 flex items-center justify-center shrink-0">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-medium text-slate-400 truncate">Empty</div>
              <div className="text-lg font-bold text-slate-300">{stats.empty}</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center shrink-0">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-medium text-slate-400 truncate">Errors</div>
              <div className="text-lg font-bold text-rose-400">{stats.error}</div>
            </div>
          </div>
        </div>

        {/* Filter & Controls Toolbar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md">
          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search category, device, ID, or notes..."
            />
          </div>

          {/* Status Filter and Expand/Collapse Controls */}
          <div className="flex items-center justify-between md:justify-end gap-3 flex-wrap">
            <StatusFilter
              currentFilter={statusFilter}
              onFilterChange={setStatusFilter}
              counts={{
                total: stats.totalDevices,
                empty: stats.empty,
                inProgress: stats.inProgress,
                active: stats.active,
                completed: stats.completed,
                error: stats.error,
              }}
            />

            <div className="flex items-center gap-2">
              {categories.length > 0 && (
                <button
                  type="button"
                  onClick={toggleAllCollapse}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors"
                  title={allCollapsed ? 'Expand All' : 'Collapse All'}
                >
                  <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden sm:inline">
                    {allCollapsed ? 'Expand All' : 'Collapse All'}
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={refreshData}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors"
                title="Refresh data from Supabase"
                aria-label="Refresh"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Cards List / Content Area */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <LoadingSpinner size="lg" label="Synchronizing with Supabase..." />
          </div>
        ) : categories.length === 0 ? (
          /* Empty State - No Categories */
          <div className="py-16 px-6 text-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/30 max-w-xl mx-auto my-8">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
              <FolderPlus className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-100">No Categories Yet</h3>
            <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
              Create your first category (such as <span className="text-slate-200 font-medium">Genplay</span>, <span className="text-slate-200 font-medium">CC Cloud</span>, or <span className="text-slate-200 font-medium">Edge Nodes</span>) to start organizing devices.
            </p>
            <button
              onClick={() => setAddCatOpen(true)}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              Create First Category
            </button>
          </div>
        ) : filteredData.length === 0 ? (
          /* Filtered search found 0 results */
          <div className="py-16 px-4 text-center rounded-2xl border border-slate-800 bg-slate-900/20 max-w-lg mx-auto">
            <p className="text-base font-semibold text-slate-200">No matching devices or categories</p>
            <p className="text-xs text-slate-400 mt-1.5">
              Try adjusting your search query or reset the status filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('All');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-800 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Responsive Categories Grid */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
            {filteredData.map(({ category, devices, totalDeviceCount }) => (
              <CategoryCard
                key={category.id}
                category={category}
                devices={devices}
                totalDeviceCount={totalDeviceCount}
                isCollapsed={Boolean(collapsedCategories[category.id])}
                onToggleCollapse={() => toggleCategoryCollapse(category.id)}
                onRename={(cat) => setEditCatTarget(cat)}
                onDelete={(cat) => setDeleteCatTarget(cat)}
                onAddDevice={(cat) =>
                  setAddDeviceTarget({ categoryId: cat.id, categoryName: cat.name })
                }
                onEditDevice={(dev) => setEditDeviceTarget(dev)}
                onDeleteDevice={(dev) => setDeleteDeviceTarget(dev)}
                onStatusChange={(deviceId, newStatus) =>
                  updateDeviceStatus(deviceId, newStatus)
                }
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Action Button (FAB) on Mobile */}
      <div className="fixed bottom-6 right-6 sm:hidden z-30">
        <button
          onClick={() => setAddCatOpen(true)}
          className="w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-2xl shadow-indigo-600/50 active:scale-95 transition-transform border border-indigo-400/30"
          aria-label="Add Category"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* Modals & Dialogs */}
      <AddCategoryDialog
        isOpen={addCatOpen}
        onClose={() => setAddCatOpen(false)}
        onSave={async (name) => {
          return await addCategory({ name });
        }}
      />

      <EditCategoryDialog
        category={editCatTarget}
        isOpen={Boolean(editCatTarget)}
        onClose={() => setEditCatTarget(null)}
        onSave={async (id, name) => {
          return await updateCategory(id, { name });
        }}
      />

      <AddDeviceDialog
        isOpen={Boolean(addDeviceTarget)}
        categoryId={addDeviceTarget?.categoryId || ''}
        categoryName={addDeviceTarget?.categoryName || ''}
        onClose={() => setAddDeviceTarget(null)}
        onSave={async (dto) => {
          return await addDevice(dto);
        }}
      />

      <EditDeviceDialog
        device={editDeviceTarget}
        categories={categories}
        isOpen={Boolean(editDeviceTarget)}
        onClose={() => setEditDeviceTarget(null)}
        onSave={async (id, updates) => {
          return await updateDevice(id, updates);
        }}
      />

      {/* Delete Category Confirmation */}
      <ConfirmModal
        isOpen={Boolean(deleteCatTarget)}
        onClose={() => setDeleteCatTarget(null)}
        onConfirm={handleConfirmDeleteCategory}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteCatTarget?.name}"? All devices inside this category will also be permanently deleted.`}
        confirmLabel="Delete Category"
        isLoading={isDeleting}
        variant="danger"
      />

      {/* Delete Device Confirmation */}
      <ConfirmModal
        isOpen={Boolean(deleteDeviceTarget)}
        onClose={() => setDeleteDeviceTarget(null)}
        onConfirm={handleConfirmDeleteDevice}
        title="Delete Device"
        message={`Are you sure you want to delete device "${deleteDeviceTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete Device"
        isLoading={isDeleting}
        variant="danger"
      />
    </div>
  );
};
