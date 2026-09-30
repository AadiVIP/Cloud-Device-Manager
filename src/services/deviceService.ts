import { supabase } from '../lib/supabase';
import { Device, CreateDeviceDTO, UpdateDeviceDTO } from '../types';

export const deviceService = {
  async fetchDevices(categoryId?: string): Promise<Device[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('You must be logged in to view devices.');

    let query = supabase
      .from('devices')
      .select('*')
      .order('created_at', { ascending: true });

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data as Device[]) || [];
  },

  async createDevice(dto: CreateDeviceDTO): Promise<Device> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('You must be logged in to create a device.');

    const trimmedName = dto.name.trim();
    if (!trimmedName) {
      throw new Error('Device name cannot be empty.');
    }

    const payload = {
      category_id: dto.category_id,
      user_id: user.id,
      name: trimmedName,
      device_id: dto.device_id && dto.device_id.trim() ? dto.device_id.trim() : null,
      status: dto.status || 'Empty',
      notes: dto.notes && dto.notes.trim() ? dto.notes.trim() : null,
    };

    const { data, error } = await supabase
      .from('devices')
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return data as Device;
  },

  async updateDevice(id: string, dto: UpdateDeviceDTO): Promise<Device> {
    const payload: Partial<Device> = {};

    if (dto.name !== undefined) {
      const trimmed = dto.name.trim();
      if (!trimmed) {
        throw new Error('Device name cannot be empty.');
      }
      payload.name = trimmed;
    }

    if (dto.device_id !== undefined) {
      payload.device_id = dto.device_id && dto.device_id.trim() ? dto.device_id.trim() : null;
    }

    if (dto.status !== undefined) {
      payload.status = dto.status;
    }

    if (dto.notes !== undefined) {
      payload.notes = dto.notes && dto.notes.trim() ? dto.notes.trim() : null;
    }

    if (dto.category_id !== undefined) {
      payload.category_id = dto.category_id;
    }

    const { data, error } = await supabase
      .from('devices')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Device;
  },

  async deleteDevice(id: string): Promise<void> {
    const { error } = await supabase
      .from('devices')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
