
// This is a mock database service that would be replaced with a real database connection
// like Firebase, Supabase, or a custom API in a production application

// Types for our database models
export interface Customer {
  id: string;
  name: string;
  email?: string;
  company?: string;
  createdAt: Date;
}

export interface TimeEntry {
  id: string;
  description: string;
  projectId: string;
  customerId: string;
  startTime: string;
  endTime: string;
  duration: number; // in seconds
  billable: boolean;
  createdAt: Date;
  userId: string; // the user who tracked this time
}

export interface Project {
  id: string;
  name: string;
  customerId?: string; // optional, can be a general project
  active: boolean;
  createdAt: Date;
}

// Mock customer data
const customers: Customer[] = [
  {
    id: 'customer-1',
    name: 'Acme Corporation',
    email: 'contact@acmecorp.com',
    company: 'Acme Corp',
    createdAt: new Date('2023-01-15')
  },
  {
    id: 'customer-2',
    name: 'TechSolutions Inc',
    email: 'info@techsolutions.com',
    company: 'TechSolutions',
    createdAt: new Date('2023-02-20')
  },
  {
    id: 'customer-3',
    name: 'Global Marketing Group',
    email: 'hello@gmg.com',
    company: 'GMG',
    createdAt: new Date('2023-03-10')
  }
];

// Mock projects with customer associations
const projects: Project[] = [
  {
    id: 'project-1',
    name: 'Website Redesign',
    customerId: 'customer-1',
    active: true,
    createdAt: new Date('2023-04-05')
  },
  {
    id: 'project-2',
    name: 'Mobile App Development',
    customerId: 'customer-1',
    active: true,
    createdAt: new Date('2023-05-12')
  },
  {
    id: 'project-3',
    name: 'Marketing Campaign',
    customerId: 'customer-2',
    active: true,
    createdAt: new Date('2023-06-18')
  },
  {
    id: 'project-4',
    name: 'Client Consultation',
    customerId: 'customer-3',
    active: true,
    createdAt: new Date('2023-07-22')
  },
  {
    id: 'project-5',
    name: 'Internal Projects',
    active: true,
    createdAt: new Date('2023-01-01')
  }
];

// Local storage for time entries (mock database)
let timeEntries: TimeEntry[] = [];

// Load any existing data from localStorage when the app starts
try {
  const storedEntries = localStorage.getItem('timeEntries');
  if (storedEntries) {
    timeEntries = JSON.parse(storedEntries);
  }
} catch (error) {
  console.error('Failed to load time entries from localStorage:', error);
}

// Save data to localStorage when it changes (mock database persistence)
const saveToLocalStorage = () => {
  try {
    localStorage.setItem('timeEntries', JSON.stringify(timeEntries));
  } catch (error) {
    console.error('Failed to save time entries to localStorage:', error);
  }
};

// Database service functions
export const db = {
  // Customer methods
  customers: {
    getAll: (): Customer[] => {
      return [...customers];
    },
    getById: (id: string): Customer | undefined => {
      return customers.find(customer => customer.id === id);
    }
  },
  
  // Project methods
  projects: {
    getAll: (): Project[] => {
      return [...projects];
    },
    getByCustomerId: (customerId: string): Project[] => {
      return projects.filter(project => project.customerId === customerId);
    },
    getById: (id: string): Project | undefined => {
      return projects.find(project => project.id === id);
    }
  },
  
  // Time entries methods
  timeEntries: {
    getAll: (): TimeEntry[] => {
      return [...timeEntries];
    },
    getByUserId: (userId: string): TimeEntry[] => {
      return timeEntries.filter(entry => entry.userId === userId);
    },
    getByCustomerId: (customerId: string): TimeEntry[] => {
      return timeEntries.filter(entry => entry.customerId === customerId);
    },
    getByProjectId: (projectId: string): TimeEntry[] => {
      return timeEntries.filter(entry => entry.projectId === projectId);
    },
    create: (entry: Omit<TimeEntry, 'id' | 'createdAt'>): TimeEntry => {
      const newEntry: TimeEntry = {
        ...entry,
        id: Math.random().toString(36).substring(2, 9),
        createdAt: new Date()
      };
      
      timeEntries.push(newEntry);
      saveToLocalStorage();
      return newEntry;
    },
    update: (id: string, updates: Partial<TimeEntry>): TimeEntry | null => {
      const index = timeEntries.findIndex(entry => entry.id === id);
      if (index === -1) return null;
      
      const updatedEntry = { ...timeEntries[index], ...updates };
      timeEntries[index] = updatedEntry;
      saveToLocalStorage();
      return updatedEntry;
    },
    delete: (id: string): boolean => {
      const initialLength = timeEntries.length;
      timeEntries = timeEntries.filter(entry => entry.id !== id);
      saveToLocalStorage();
      return timeEntries.length < initialLength;
    }
  }
};
