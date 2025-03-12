
import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TimeTracker from '@/components/time/TimeTracker';
import DashboardStats from '@/components/dashboard/DashboardStats';
import TimeChart from '@/components/dashboard/TimeChart';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { db, TimeEntry, Project, Customer } from '@/lib/db';
import { toast } from 'sonner';

const Dashboard = () => {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [date, setDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  
  // Load data from our database service
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real app with authentication, we'd filter by the current user
        const timeEntriesData = await db.timeEntries.getAll();
        const projectsData = await db.projects.getAll();
        const customersData = await db.customers.getAll();
        
        setTimeEntries(timeEntriesData);
        setProjects(projectsData);
        setCustomers(customersData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Chart data
  const generateWeeklyData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => {
      // In a real app, this would filter entries by the day
      const randomHours = Math.random() * 8 + 1;
      return { name: day, hours: randomHours };
    });
  };
  
  const generateProjectData = () => {
    // Generate random colors for projects
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
    
    return projects.slice(0, 5).map((project, index) => {
      // In a real app, this would calculate actual hours per project
      const randomHours = Math.random() * 15 + 2;
      return {
        name: project.name,
        hours: randomHours,
        color: colors[index % colors.length]
      };
    });
  };
  
  // Generate mock weekly and project data
  const weeklyData = generateWeeklyData();
  const projectData = generateProjectData();
  
  // Calculate stats based on time entries
  const calculateStats = () => {
    // In a real app, these would be calculated from actual time entries
    const hoursToday = timeEntries
      .filter(entry => {
        const entryDate = new Date(entry.end_time);
        const today = new Date();
        return (
          entryDate.getDate() === today.getDate() &&
          entryDate.getMonth() === today.getMonth() &&
          entryDate.getFullYear() === today.getFullYear()
        );
      })
      .reduce((total, entry) => total + (entry.duration / 3600), 0);
    
    // Get the number of hours for the current week
    const hoursThisWeek = timeEntries
      .filter(entry => {
        const entryDate = new Date(entry.end_time);
        const today = new Date();
        const firstDayOfWeek = new Date(today);
        firstDayOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)); // Monday
        firstDayOfWeek.setHours(0, 0, 0, 0);
        return entryDate >= firstDayOfWeek;
      })
      .reduce((total, entry) => total + (entry.duration / 3600), 0);
    
    // Count unique project IDs in time entries to get active projects
    const activeProjectIds = new Set(timeEntries.map(entry => entry.project_id));
    
    return {
      hoursToday,
      hoursThisWeek,
      activeProjects: activeProjectIds.size
    };
  };
  
  const stats = calculateStats();
  
  const handleTimeEntryCreate = (entry: TimeEntry) => {
    setTimeEntries(prev => [entry, ...prev]);
  };
  
  const getProjectNameById = (id: string) => {
    const project = projects.find(p => p.id === id);
    return project ? project.name : 'Untitled Project';
  };
  
  const getCustomerNameById = (id: string) => {
    const customer = customers.find(c => c.id === id);
    return customer ? customer.name : 'Unknown Customer';
  };
  
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };
  
  const formatTimeRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    const format = (date: Date) => {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    };
    
    return `${format(startDate)} - ${format(endDate)}`;
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Track your time and productivity
              </p>
            </div>
            
            <div className="flex items-center mt-4 md:mt-0">
              <div className="pill pill-primary flex items-center">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                <span>{formatDate(date)}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-8">
            <TimeTracker 
              onTimeEntryCreate={handleTimeEntryCreate}
            />
            
            <DashboardStats stats={stats} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <TimeChart 
                weeklyData={weeklyData}
                projectData={projectData}
              />
              
              <div className="glass rounded-xl p-5 animate-fade-in">
                <h3 className="font-medium mb-4">Recent Activity</h3>
                
                {timeEntries.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No time entries for today</p>
                    <Button variant="link" size="sm" className="mt-2">
                      View previous days
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {timeEntries.slice(0, 5).map(entry => (
                      <div key={entry.id} className="pb-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{entry.description}</h4>
                            <div className="text-sm text-muted-foreground">
                              <div>{getProjectNameById(entry.projectId)}</div>
                              <div>{getCustomerNameById(entry.customerId)}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {formatDuration(entry.duration)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatTimeRange(entry.startTime, entry.endTime)}
                            </p>
                            {entry.billable && (
                              <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full">
                                Billable
                              </span>
                            )}
                          </div>
                        </div>
                        <Separator className="mt-4" />
                      </div>
                    ))}
                    
                    <div className="text-center pt-2">
                      <Button variant="link" size="sm">
                        View all time entries
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
