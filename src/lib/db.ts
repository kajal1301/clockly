
// This file integrates with Supabase to provide database services
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Types for our database models
export interface Customer {
  id: string;
  name: string;
  email?: string;
  company?: string;
  created_at?: string;
}

export interface TimeEntry {
  id: string;
  description: string;
  project_id: string;
  customer_id: string;
  start_time: string;
  end_time: string;
  duration: number; // in seconds
  billable: boolean;
  created_at?: string;
  user_id: string; // the user who tracked this time
}

export interface Project {
  id: string;
  name: string;
  customer_id?: string; // optional, can be a general project
  active: boolean;
  created_at?: string;
}

// Database service functions
export const db = {
  // Customer methods
  customers: {
    getAll: async (): Promise<Customer[]> => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching customers:', error);
        return [];
      }
      
      return data || [];
    },
    getById: async (id: string): Promise<Customer | null> => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching customer:', error);
        return null;
      }
      
      return data;
    },
    create: async (customer: Omit<Customer, 'id' | 'created_at'>): Promise<Customer | null> => {
      const { data, error } = await supabase
        .from('customers')
        .insert(customer)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating customer:', error);
        return null;
      }
      
      return data;
    }
  },
  
  // Project methods
  projects: {
    getAll: async (): Promise<Project[]> => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching projects:', error);
        return [];
      }
      
      return data || [];
    },
    getByCustomerId: async (customerId: string): Promise<Project[]> => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('customer_id', customerId)
        .order('name');
      
      if (error) {
        console.error('Error fetching projects by customer:', error);
        return [];
      }
      
      return data || [];
    },
    getById: async (id: string): Promise<Project | null> => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching project:', error);
        return null;
      }
      
      return data;
    },
    create: async (project: Omit<Project, 'id' | 'created_at'>): Promise<Project | null> => {
      const { data, error } = await supabase
        .from('projects')
        .insert(project)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating project:', error);
        return null;
      }
      
      return data;
    }
  },
  
  // Time entries methods
  timeEntries: {
    getAll: async (): Promise<TimeEntry[]> => {
      const { data, error } = await supabase
        .from('time_entries')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching time entries:', error);
        return [];
      }
      
      return data || [];
    },
    getByUserId: async (userId: string): Promise<TimeEntry[]> => {
      const { data, error } = await supabase
        .from('time_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching time entries by user:', error);
        return [];
      }
      
      return data || [];
    },
    getByCustomerId: async (customerId: string): Promise<TimeEntry[]> => {
      const { data, error } = await supabase
        .from('time_entries')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching time entries by customer:', error);
        return [];
      }
      
      return data || [];
    },
    getByProjectId: async (projectId: string): Promise<TimeEntry[]> => {
      const { data, error } = await supabase
        .from('time_entries')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching time entries by project:', error);
        return [];
      }
      
      return data || [];
    },
    create: async (entry: Omit<TimeEntry, 'id' | 'created_at'>): Promise<TimeEntry | null> => {
      const { data, error } = await supabase
        .from('time_entries')
        .insert(entry)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating time entry:', error);
        return null;
      }
      
      return data;
    },
    update: async (id: string, updates: Partial<TimeEntry>): Promise<TimeEntry | null> => {
      const { data, error } = await supabase
        .from('time_entries')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating time entry:', error);
        return null;
      }
      
      return data;
    },
    delete: async (id: string): Promise<boolean> => {
      const { error } = await supabase
        .from('time_entries')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting time entry:', error);
        return false;
      }
      
      return true;
    }
  }
};

// Helper function to initialize the database if needed
export const initializeDatabase = async (): Promise<void> => {
  console.log('Checking database schema...');
  
  // In a real application, you would check if tables exist
  // and create them if they don't. For now, we'll just log a message.
  console.log('Database initialized.');
};
