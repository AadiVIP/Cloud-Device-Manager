import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { categoryService } from '../services/categoryService';
import { deviceService } from '../services/deviceService';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  Category,
  Device,
  CreateCategoryDTO,
  UpdateCategoryDTO,
  CreateDeviceDTO,
  UpdateDeviceDTO,
  StatusFilterOption,
  DeviceStatus,
} from '../types';

export function useDeviceManager() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<StatusFilterOption>('All');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  // Fetch initial data
  const fetchData = useCallback(async () => {
    if (!user || !isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [fetchedCats, fetchedDevs] = await Promise.all([
        categoryService.fetchCategories(),
        deviceService.fetchDevices(),
      ]);
      setCategories(fetchedCats);
      setDevices(fetchedDevs);
    } catch (err: any) {
      console.error('Failed to load data:', err);
      showToast(err.message || 'Failed to load categories and devices', 'error', 'Error Loading Data');
    } finally {
      setLoading(false);
    }
  }, [user, showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Set up Supabase Realtime subscriptions
  useEffect(() => {
    if (!user || !isSupabaseConfigured()) return;

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'categories', filter: `user_id=eq.${user.id}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newCat = payload.new as Category;
            setCategories((prev) => {
              if (prev.some((c) => c.id === newCat.id)) return prev;
              return [...prev, newCat];
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedCat = payload.new as Category;
            setCategories((prev) =>
              prev.map((c) => (c.id === updatedCat.id ? { ...c, ...updatedCat } : c))
            );
          } else if (payload.eventType === 'DELETE') {
            const deletedId = (payload.old as { id: string }).id;
            setCategories((prev) => prev.filter((c) => c.id !== deletedId));
            setDevices((prev) => prev.filter((d) => d.category_id !== deletedId));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'devices', filter: `user_id=eq.${user.id}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newDev = payload.new as Device;
            setDevices((prev) => {
              if (prev.some((d) => d.id === newDev.id)) return prev;
              return [...prev, newDev];
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedDev = payload.new as Device;
            setDevices((prev) =>
              prev.map((d) => (d.id === updatedDev.id ? { ...d, ...updatedDev } : d))
            );
          } else if (payload.eventType === 'DELETE') {
            const deletedId = (payload.old as { id: string }).id;
            setDevices((prev) => prev.filter((d) => d.id !== deletedId));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // CATEGORY ACTIONS
  const addCategory = async (dto: CreateCategoryDTO): Promise<boolean> => {
    if (!dto.name.trim()) {
      showToast('Category name is required', 'warning');
      return false;
    }

    try {
      const created = await categoryService.createCategory(dto);
      // Ensure local state updates immediately
      setCategories((prev) => {
        if (prev.some((c) => c.id === created.id)) return prev;
        return [...prev, created];
      });
      showToast(`Category "${created.name}" created`, 'success');
      return true;
    } catch (err: any) {
      console.error('Create category error:', err);
      showToast(err.message || 'Failed to create category', 'error', 'Creation Failed');
      return false;
    }
  };

  const updateCategory = async (id: string, dto: UpdateCategoryDTO): Promise<boolean> => {
    if (!dto.name.trim()) {
      showToast('Category name cannot be empty', 'warning');
      return false;
    }

    const originalCategories = [...categories];
    // Optimistic update
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name: dto.name.trim() } : c))
    );

    try {
      await categoryService.updateCategory(id, dto);
      showToast('Category renamed successfully', 'success');
      return true;
    } catch (err: any) {
      // Rollback
      setCategories(originalCategories);
      console.error('Update category error:', err);
      showToast(err.message || 'Failed to rename category', 'error', 'Update Failed');
      return false;
    }
  };

  const deleteCategory = async (id: string, categoryName: string): Promise<boolean> => {
    const originalCategories = [...categories];
    const originalDevices = [...devices];

    // Optimistic removal
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setDevices((prev) => prev.filter((d) => d.category_id !== id));

    try {
      await categoryService.deleteCategory(id);
      showToast(`Category "${categoryName}" deleted`, 'info');
      return true;
    } catch (err: any) {
      // Rollback
      setCategories(originalCategories);
      setDevices(originalDevices);
      console.error('Delete category error:', err);
      showToast(err.message || 'Failed to delete category', 'error', 'Delete Failed');
      return false;
    }
  };

  // DEVICE ACTIONS
  const addDevice = async (dto: CreateDeviceDTO): Promise<boolean> => {
    if (!dto.name.trim()) {
      showToast('Device name is required', 'warning');
      return false;
    }

    try {
      const created = await deviceService.createDevice(dto);
      // Ensure local state updates immediately
      setDevices((prev) => {
        if (prev.some((d) => d.id === created.id)) return prev;
        return [...prev, created];
      });
      showToast(`Device "${created.name}" added`, 'success');
      return true;
    } catch (err: any) {
      console.error('Create device error:', err);
      showToast(err.message || 'Failed to create device', 'error', 'Creation Failed');
      return false;
    }
  };

  const updateDevice = async (id: string, dto: UpdateDeviceDTO): Promise<boolean> => {
    const originalDevices = [...devices];

    // Optimistic update
    setDevices((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          return {
            ...d,
            name: dto.name !== undefined ? dto.name.trim() : d.name,
            device_id: dto.device_id !== undefined ? (dto.device_id?.trim() || null) : d.device_id,
            status: dto.status !== undefined ? dto.status : d.status,
            notes: dto.notes !== undefined ? (dto.notes?.trim() || null) : d.notes,
            category_id: dto.category_id !== undefined ? dto.category_id : d.category_id,
            updated_at: new Date().toISOString(),
          };
        }
        return d;
      })
    );

    try {
      await deviceService.updateDevice(id, dto);
      showToast('Device updated successfully', 'success');
      return true;
    } catch (err: any) {
      // Rollback
      setDevices(originalDevices);
      console.error('Update device error:', err);
      showToast(err.message || 'Failed to update device', 'error', 'Update Failed');
      return false;
    }
  };

  const updateDeviceStatus = async (id: string, status: DeviceStatus): Promise<boolean> => {
    const originalDevices = [...devices];

    // Quick optimistic status change
    setDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status, updated_at: new Date().toISOString() } : d))
    );

    try {
      await deviceService.updateDevice(id, { status });
      showToast(`Status updated to "${status}"`, 'success');
      return true;
    } catch (err: any) {
      setDevices(originalDevices);
      console.error('Update status error:', err);
      showToast(err.message || 'Failed to update status', 'error', 'Status Update Failed');
      return false;
    }
  };

  const deleteDevice = async (id: string, deviceName: string): Promise<boolean> => {
    const originalDevices = [...devices];

    // Optimistic removal
    setDevices((prev) => prev.filter((d) => d.id !== id));

    try {
      await deviceService.deleteDevice(id);
      showToast(`Device "${deviceName}" deleted`, 'info');
      return true;
    } catch (err: any) {
      setDevices(originalDevices);
      console.error('Delete device error:', err);
      showToast(err.message || 'Failed to delete device', 'error', 'Delete Failed');
      return false;
    }
  };

  // Toggle Collapse/Expand
  const toggleCategoryCollapse = (categoryId: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const collapseAll = () => {
    const state: Record<string, boolean> = {};
    categories.forEach((cat) => {
      state[cat.id] = true;
    });
    setCollapsedCategories(state);
  };

  const expandAll = () => {
    setCollapsedCategories({});
  };

  // Search & Filter Logic
  const filteredData = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return categories.map((cat) => {
      // Find devices belonging to this category
      const catDevices = devices.filter((d) => d.category_id === cat.id);

      // Check if category name matches
      const categoryMatches = !query || cat.name.toLowerCase().includes(query);

      // Filter devices inside category
      const matchedDevices = catDevices.filter((dev) => {
        // Status filter
        if (statusFilter !== 'All' && dev.status !== statusFilter) {
          return false;
        }

        // If search query is present
        if (query) {
          const devNameMatch = dev.name.toLowerCase().includes(query);
          const devIdMatch = dev.device_id ? dev.device_id.toLowerCase().includes(query) : false;
          const notesMatch = dev.notes ? dev.notes.toLowerCase().includes(query) : false;

          // If the category itself matched the query, include all devices (that match status filter)
          if (categoryMatches) {
            return true;
          }

          return devNameMatch || devIdMatch || notesMatch;
        }

        return true;
      });

      return {
        category: cat,
        devices: matchedDevices,
        totalDeviceCount: catDevices.length,
        // Show category if it matches the query, or if it has matching devices
        isVisible: categoryMatches ? (statusFilter === 'All' ? true : matchedDevices.length > 0) : matchedDevices.length > 0,
      };
    }).filter((item) => item.isVisible);
  }, [categories, devices, searchQuery, statusFilter]);

  const totalDeviceCount = devices.length;
  const activeDeviceCount = devices.filter((d) => d.status === 'Active').length;
  const inProgressDeviceCount = devices.filter((d) => d.status === 'In Progress').length;
  const emptyDeviceCount = devices.filter((d) => d.status === 'Empty').length;
  const errorDeviceCount = devices.filter((d) => d.status === 'Error').length;
  const completedDeviceCount = devices.filter((d) => d.status === 'Completed').length;

  return {
    categories,
    devices,
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
    refreshData: fetchData,
    stats: {
      totalCategories: categories.length,
      totalDevices: totalDeviceCount,
      active: activeDeviceCount,
      inProgress: inProgressDeviceCount,
      empty: emptyDeviceCount,
      completed: completedDeviceCount,
      error: errorDeviceCount,
    },
  };
}
