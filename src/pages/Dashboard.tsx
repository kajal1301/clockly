
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

// Mock data - in a real app, this would come from an API
const mockProjects = [
  { id: 'project-1', name: 'Website Redesign' },
  { id: 'project-2', name: 'Mobile App Development' },
  { id: 'project-3', name: 'Marketing Campaign' },
  { id: 'project-4', name: 'Client Consultation' },
];

const mockTimeEntries = [
  {
    id: 'entry-1',
    description: 'Design homepage wireframes',
    projectId: 'project-1',
    startTime: '2023-10-22T08:30:00Z',
    endTime: '2023-10-22T10:45:00Z',
    duration: 8100, // 2h 15m in seconds
  },
  {
    id: 'entry-2',
    description: 'Team meeting',
    projectId: 'project-4',
    startTime: '2023-10-22T13:00:00Z',
    endTime: '2023-10-22T14:00:00Z',
    duration: 3600, // 1h in seconds
  },
];

const mockWeeklyData = [
  { name: 'Mon', hours: 6.5 },
  { name: 'Tue', hours: 7.2 },
  { name: 'Wed', hours: 8.1 },
  { name: 'Thu', hours: 6.8 },
  { name: 'Fri', hours: 5.5 },
  { name: 'Sat', hours: 2.0 },
  { name: 'Sun', hours: 0.5 },
];

const mockProjectData = [
  { name: 'Website Redesign', hours: 12.5, color: '#3b82f6' },
  { name: 'Mobile App', hours: 8.2, color: '#10b981' },
  { name: 'Marketing', hours: 6.8, color: '#f59e0b' },
  { name: 'Consultation', hours: 4.5, color: '#8b5cf6' },
];

const mockStats = {
  hoursToday: 3.25,
  hoursThisWeek: 28.2,
  activeProjects: 4,
};

interface TimeEntry {
  id: string;
  description: string;
  projectId: string;
  startTime: string;
  endTime: string;
  duration: number;
}

const Dashboard = () => {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(mockTimeEntries);
  const [date, setDate] = useState(new Date());
  
  useEffect(() => {
    // In a real app, this would fetch data from an API
    // based on the selected date
  }, [date]);
  
  const handleTimeEntryCreate = (entry: TimeEntry) => {
    setTimeEntries(prev => [entry, ...prev]);
  };
  
  const getProjectNameById = (id: string) => {
    const project = mockProjects.find(p => p.id === id);
    return project ? project.name : 'Untitled Project';
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
              projects={mockProjects}
              onTimeEntryCreate={handleTimeEntryCreate}
            />
            
            <DashboardStats stats={mockStats} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <TimeChart 
                weeklyData={mockWeeklyData}
                projectData={mockProjectData}
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
                    {timeEntries.map(entry => (
                      <div key={entry.id} className="pb-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{entry.description}</h4>
                            <p className="text-sm text-muted-foreground">
                              {getProjectNameById(entry.projectId)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {formatDuration(entry.duration)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatTimeRange(entry.startTime, entry.endTime)}
                            </p>
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
