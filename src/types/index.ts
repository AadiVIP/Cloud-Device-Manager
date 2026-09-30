export type DeviceStatus = 'Empty' | 'In Progress' | 'Active' | 'Completed' | 'Error';

export interface Profile {
  id: string;
  email: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  devices?: Device[];
}

export interface Device {
  id: string;
  category_id: string;
  user_id: string;
  name: string;
  device_id: string | null;
  status: DeviceStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CategoryWithDevices extends Category {
  devices: Device[];
}

export interface CreateCategoryDTO {
  name: string;
}

export interface UpdateCategoryDTO {
  name: string;
}

export interface CreateDeviceDTO {
  category_id: string;
  name: string;
  device_id?: string | null;
  status?: DeviceStatus;
  notes?: string | null;
}

export interface UpdateDeviceDTO {
  name?: string;
  device_id?: string | null;
  status?: DeviceStatus;
  notes?: string | null;
  category_id?: string;
}

export type StatusFilterOption = 'All' | DeviceStatus;

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  title?: string;
}
