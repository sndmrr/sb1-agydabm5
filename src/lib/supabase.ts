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

export interface Employee {
  id: string;
  name: string;
  position: string;
  unit: string;
  signature_url: string;
  require_photo_documentation: boolean;
  created_at: string;
  updated_at: string;
}

export interface AttendanceRecord {
  id: string;
  employee_id: string;
  date: string;
  work_type: 'Masuk' | 'Day Off';
  location?: string;
  activity_detail?: string;
  notes?: string;
  photo_url: string;
  created_at: string;
  updated_at: string;
  employees?: Employee;
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

// Employee CRUD functions
export const getAllEmployees = async (): Promise<Employee[]> => {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .order('name');

  if (error) throw error;
  return data || [];
};

export const getEmployeeById = async (id: string): Promise<Employee> => {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const addEmployee = async (employee: Omit<Employee, 'id' | 'created_at' | 'updated_at'>): Promise<Employee> => {
  const { data, error } = await supabase
    .from('employees')
    .insert({
      ...employee,
      updated_at: new Date().toISOString()
    })
    .select('*')
    .single();

  if (error) throw error;
  return data;
};

export const updateEmployee = async (id: string, updates: Partial<Employee>): Promise<Employee> => {
  const { data, error } = await supabase
    .from('employees')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return data;
};

export const deleteEmployee = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('employees')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Attendance Records CRUD functions
export const getAttendanceRecords = async (startDate?: string, endDate?: string): Promise<AttendanceRecord[]> => {
  let query = supabase
    .from('attendance_records')
    .select(`
      *,
      employees (
        id,
        name,
        position,
        unit
      )
    `)
    .order('date', { ascending: false })
    .order('employees(name)');

  if (startDate) {
    query = query.gte('date', startDate);
  }
  if (endDate) {
    query = query.lte('date', endDate);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
};

export const getAttendanceRecordsByEmployee = async (employeeId: string, startDate?: string, endDate?: string): Promise<AttendanceRecord[]> => {
  let query = supabase
    .from('attendance_records')
    .select(`
      *,
      employees (
        id,
        name,
        position,
        unit
      )
    `)
    .eq('employee_id', employeeId)
    .order('date', { ascending: false });

  if (startDate) {
    query = query.gte('date', startDate);
  }
  if (endDate) {
    query = query.lte('date', endDate);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
};

export const checkAttendanceExists = async (employeeId: string, date: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('attendance_records')
    .select('id')
    .eq('employee_id', employeeId)
    .eq('date', date)
    .single();

  return !error && data !== null;
};

export const addAttendanceRecord = async (record: Omit<AttendanceRecord, 'id' | 'created_at' | 'updated_at' | 'employees'>): Promise<AttendanceRecord> => {
  const { data, error } = await supabase
    .from('attendance_records')
    .insert({
      ...record,
      updated_at: new Date().toISOString()
    })
    .select(`
      *,
      employees (
        id,
        name,
        position,
        unit
      )
    `)
    .single();

  if (error) throw error;
  return data;
};

export const updateAttendanceRecord = async (id: string, updates: Partial<AttendanceRecord>): Promise<AttendanceRecord> => {
  const { data, error } = await supabase
    .from('attendance_records')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select(`
      *,
      employees (
        id,
        name,
        position,
        unit
      )
    `)
    .single();

  if (error) throw error;
  return data;
};

export const deleteAttendanceRecord = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('attendance_records')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const getAttendanceSummary = async (startDate: string, endDate: string): Promise<{ employee: Employee; present: number; dayOff: number }[]> => {
  const { data, error } = await supabase
    .from('attendance_records')
    .select(`
      employee_id,
      work_type,
      employees (
        id,
        name,
        position,
        unit
      )
    `)
    .gte('date', startDate)
    .lte('date', endDate);

  if (error) throw error;

  const summary: { [key: string]: { employee: Employee; present: number; dayOff: number } } = {};
  
  data?.forEach(record => {
    const employeeId = record.employee_id;
    if (!summary[employeeId]) {
      summary[employeeId] = {
        employee: record.employees,
        present: 0,
        dayOff: 0
      };
    }
    
    if (record.work_type === 'Masuk') {
      summary[employeeId].present++;
    } else {
      summary[employeeId].dayOff++;
    }
  });

  return Object.values(summary);
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