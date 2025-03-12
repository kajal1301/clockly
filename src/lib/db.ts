
// This file integrates with Supabase to provide database services
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a fallback for development without Supabase configuration
export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

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

// Local storage keys for fallback storage
const STORAGE_KEYS = {
  CUSTOMERS: 'timeTracker_customers',
  PROJECTS: 'timeTracker_projects',
  TIME_ENTRIES: 'timeTracker_timeEntries',
};

// Helper functions for local storage fallback
const getFromStorage = <T>(key: string): T[] => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return [];
  }
};

const saveToStorage = <T>(key: string, data: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
  }
};

const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Database service functions
export const db = {
  // Customer methods
  customers: {
    getAll: async (): Promise<Customer[]> => {
      if (supabase) {
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .order('name');
        
        if (error) {
          console.error('Error fetching customers:', error);
          return [];
        }
        
        return data || [];
      } else {
        // Fallback to localStorage
        return getFromStorage<Customer>(STORAGE_KEYS.CUSTOMERS);
      }
    },
    getById: async (id: string): Promise<Customer | null> => {
      if (supabase) {
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
      } else {
        // Fallback to localStorage
        const customers = getFromStorage<Customer>(STORAGE_KEYS.CUSTOMERS);
        return customers.find(c => c.id === id) || null;
      }
    },
    create: async (customer: Omit<Customer, 'id' | 'created_at'>): Promise<Customer | null> => {
      if (supabase) {
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
      } else {
        // Fallback to localStorage
        const newCustomer: Customer = {
          ...customer,
          id: generateId(),
          created_at: new Date().toISOString()
        };
        
        const customers = getFromStorage<Customer>(STORAGE_KEYS.CUSTOMERS);
        customers.push(newCustomer);
        saveToStorage(STORAGE_KEYS.CUSTOMERS, customers);
        
        return newCustomer;
      }
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
  console.log('Checking database connection...');
  
  if (supabase) {
    try {
      // Test the connection
      const { error } = await supabase.from('customers').select('count').limit(1);
      
      if (error) {
        console.error('Supabase connection error:', error);
        // If tables don't exist yet, we can create them
        // This would typically be done through migrations in a production app
        
        // For demo purposes, we'll try to create the tables if they don't exist
        await createTablesIfNeeded();
      } else {
        console.log('Connected to Supabase successfully');
      }
    } catch (error) {
      console.error('Error initializing Supabase:', error);
    }
  } else {
    console.log('Using localStorage fallback (Supabase not configured)');
    
    // Initialize with some demo data if empty
    initializeLocalStorageData();
  }
};

// Function to create Supabase tables if they don't exist
const createTablesIfNeeded = async (): Promise<void> => {
  if (!supabase) return;
  
  console.log('Attempting to create tables if they don\'t exist...');
  
  // Note: This is a simplified approach. In a production app,
  // you would use migrations or the Supabase dashboard to set up tables
  try {
    // Create customers table
    const createCustomers = await supabase.rpc('create_table_if_not_exists', {
      table_name: 'customers',
      definition: `
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        name text NOT NULL,
        email text,
        company text,
        created_at timestamp with time zone DEFAULT now()
      `
    });
    
    // Create projects table
    const createProjects = await supabase.rpc('create_table_if_not_exists', {
      table_name: 'projects',
      definition: `
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        name text NOT NULL,
        customer_id uuid REFERENCES customers(id),
        active boolean DEFAULT true,
        created_at timestamp with time zone DEFAULT now()
      `
    });
    
    // Create time_entries table
    const createTimeEntries = await supabase.rpc('create_table_if_not_exists', {
      table_name: 'time_entries',
      definition: `
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        description text NOT NULL,
        project_id uuid REFERENCES projects(id),
        customer_id uuid REFERENCES customers(id),
        start_time timestamp with time zone NOT NULL,
        end_time timestamp with time zone NOT NULL,
        duration integer NOT NULL,
        billable boolean DEFAULT true,
        user_id uuid NOT NULL,
        created_at timestamp with time zone DEFAULT now()
      `
    });
    
    console.log('Tables created or already exist');
  } catch (error) {
    console.error('Error creating tables:', error);
    console.log('Tables will need to be created manually in the Supabase dashboard');
  }
};

// Function to initialize localStorage with demo data if empty
const initializeLocalStorageData = (): void => {
  // Check if customers exist, if not add some demo data
  const customers = getFromStorage<Customer>(STORAGE_KEYS.CUSTOMERS);
  if (customers.length === 0) {
    const demoCustomers: Customer[] = [
      { id: 'c1', name: 'Acme Inc', email: 'contact@acme.com', company: 'Acme', created_at: new Date().toISOString() },
      { id: 'c2', name: 'Globex', email: 'info@globex.com', company: 'Globex Corp', created_at: new Date().toISOString() },
      { id: 'c3', name: 'Umbrella Corp', email: 'hello@umbrella.com', company: 'Umbrella', created_at: new Date().toISOString() }
    ];
    saveToStorage(STORAGE_KEYS.CUSTOMERS, demoCustomers);
  }
  
  // Check if projects exist, if not add some demo data
  const projects = getFromStorage<Project>(STORAGE_KEYS.PROJECTS);
  if (projects.length === 0) {
    const demoProjects: Project[] = [
      { id: 'p1', name: 'Website Redesign', customer_id: 'c1', active: true, created_at: new Date().toISOString() },
      { id: 'p2', name: 'Mobile App', customer_id: 'c1', active: true, created_at: new Date().toISOString() },
      { id: 'p3', name: 'Marketing Campaign', customer_id: 'c2', active: true, created_at: new Date().toISOString() },
      { id: 'p4', name: 'Internal Tools', customer_id: 'c3', active: true, created_at: new Date().toISOString() }
    ];
    saveToStorage(STORAGE_KEYS.PROJECTS, demoProjects);
  }
  
  // We don't pre-populate time entries - those are created by the user
};
