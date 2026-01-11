import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface FieldCoordinator {
  id: string;
  name: string;
  photo_url?: string;
  created_at: string;
}

export interface FieldFacilitator {
  id: string;
  fc_id: string;
  photo_url: string;
  name: string;
  nik: string;
  phone: string;
  address: string;
  birth_place: string;
  birth_date: string;
  account_number: string;
  bank_name: string;
  account_holder: string;
  username?: string;
  password?: string;
  created_at: string;
  field_coordinators?: FieldCoordinator;
}

export interface AppSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  created_at: string;
  updated_at: string;
}

export interface ButtonSetting {
  id: string;
  button_key: string;
  button_name: string;
  category: 'home' | 'tkh_attendance' | 'recap_attendance';
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}

// App Settings functions
export const getAppSetting = async (key: string): Promise<string> => {
  const { data, error } = await supabase
    .from('app_settings')
    .select('setting_value')
    .eq('setting_key', key)
    .single();
  
  if (error) {
    console.error('Error getting app setting:', error);
    // Return default values if error
    const defaults: { [key: string]: string } = {
      'header_photo': 'https://i.postimg.cc/ZnWHPbw9/T4-T-Logo-Baru-2-1.jpg',
      'roster_photo': 'https://via.placeholder.com/600x300/e5f3ff/1e40af?text=Jadwal+Roster',
      'payment_photo': 'https://via.placeholder.com/600x300/f0fdf4/16a34a?text=Info+Pembayaran'
    };
    return defaults[key] || '';
  }
  
  return data?.setting_value || '';
};

export const updateAppSetting = async (key: string, value: string): Promise<void> => {
  const { error } = await supabase
    .from('app_settings')
    .upsert({ 
      setting_key: key, 
      setting_value: value,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'setting_key'
    });
  
  if (error) {
    console.error('Error updating app setting:', error);
    throw error;
  }
};

export const getAllAppSettings = async (): Promise<{ [key: string]: string }> => {
  const { data, error } = await supabase
    .from('app_settings')
    .select('setting_key, setting_value');
  
  if (error) {
    console.error('Error getting all app settings:', error);
    return {
      'header_photo': 'https://i.postimg.cc/ZnWHPbw9/T4-T-Logo-Baru-2-1.jpg',
      'roster_photo': 'https://via.placeholder.com/600x300/e5f3ff/1e40af?text=Jadwal+Roster',
      'payment_photo': 'https://via.placeholder.com/600x300/f0fdf4/16a34a?text=Info+Pembayaran'
    };
  }
  
  const settings: { [key: string]: string } = {};
  data?.forEach(setting => {
    settings[setting.setting_key] = setting.setting_value;
  });
  
  return settings;
};

// Database functions
export const getFieldCoordinators = async (): Promise<FieldCoordinator[]> => {
  const { data, error } = await supabase
    .from('field_coordinators')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data || [];
};

export const getFieldFacilitatorsByFC = async (fcId: string): Promise<FieldFacilitator[]> => {
  const { data, error } = await supabase
    .from('field_facilitators')
    .select(`
      *,
      field_coordinators (
        id,
        name
      )
    `)
    .eq('fc_id', fcId)
    .order('name')
    .limit(100);
  
  if (error) throw error;
  return data || [];
};

export const getAllFieldFacilitators = async (): Promise<FieldFacilitator[]> => {
  const { data, error } = await supabase
    .from('field_facilitators')
    .select(`
      *,
      field_coordinators (
        id,
        name
      )
    `)
    .order('name')
    .limit(500);
  
  if (error) throw error;
  return data || [];
};

export const addFieldFacilitator = async (ff: Omit<FieldFacilitator, 'id' | 'created_at' | 'field_coordinators'>): Promise<FieldFacilitator> => {
  const { data, error } = await supabase
    .from('field_facilitators')
    .insert(ff)
    .select(`
      *,
      field_coordinators (
        id,
        name
      )
    `)
    .single();
  
  if (error) throw error;
  return data;
};

export const updateFieldFacilitator = async (id: string, updates: Partial<FieldFacilitator>): Promise<FieldFacilitator> => {
  const { data, error } = await supabase
    .from('field_facilitators')
    .update(updates)
    .eq('id', id)
    .select(`
      *,
      field_coordinators (
        id,
        name
      )
    `)
    .single();
  
  if (error) throw error;
  return data;
};

export const updateFieldCoordinator = async (id: string, updates: Partial<FieldCoordinator>): Promise<FieldCoordinator> => {
  const { data, error } = await supabase
    .from('field_coordinators')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteFieldFacilitator = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('field_facilitators')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

export const bulkInsertFieldFacilitators = async (facilitators: Omit<FieldFacilitator, 'id' | 'created_at' | 'field_coordinators'>[]): Promise<FieldFacilitator[]> => {
  const { data, error } = await supabase
    .from('field_facilitators')
    .insert(facilitators)
    .select(`
      *,
      field_coordinators (
        id,
        name
      )
    `);
  
  if (error) throw error;
  return data || [];
};

// Button Settings functions
export const getAllButtonSettings = async (): Promise<ButtonSetting[]> => {
  const { data, error } = await supabase
    .from('button_settings')
    .select('*')
    .order('category, button_name');

  if (error) {
    console.error('Error getting button settings:', error);
    return [];
  }

  return data || [];
};

export const updateButtonSetting = async (id: string, isEnabled: boolean): Promise<void> => {
  const { error } = await supabase
    .from('button_settings')
    .update({
      is_enabled: isEnabled,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating button setting:', error);
    throw error;
  }
};

// Helper function to convert file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};