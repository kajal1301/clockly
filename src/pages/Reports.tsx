
import React, { useState } from 'react';
import { Calendar, Download, File, Filter, FilePieChart } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { calculateTotalHours, formatTime, cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

// Mock data
const mockTimeEntries = [
  {
    id: 'entry-1',
    description: 'Design homepage wireframes',
    projectId: 'project-1',
    projectName: 'Website Redesign',
    startTime: '2023-10-22T08:30:00Z',
    endTime: '2023-10-22T10:45:00Z',
    duration: 8100, // 2h 15m in seconds
  },
  {
    id: 'entry-2',
    description: 'Team meeting',
    projectId: 'project-4',
    projectName: 'Client Consultation',
    startTime: '2023-10-22T13:00:00Z',
    endTime: '2023-10-22T14:00:00Z',
    duration: 3600, // 1h in seconds
  },
  {
    id: 'entry-3',
    description: 'Develop login feature',
    projectId: 'project-2',
    projectName: 'Mobile App Development',
    startTime: '2023-10-23T09:00:00Z',
    endTime: '2023-10-23T12:30:00Z',
    duration: 12600, // 3h 30m in seconds
  },
  {
    id: 'entry-4',
    description: 'Create social media assets',
    projectId: 'project-3',
    projectName: 'Marketing Campaign',
    startTime: '2023-10-23T14:00:00Z',
    endTime: '2023-10-23T16:15:00Z',
    duration: 8100, // 2h 15m in seconds
  },
  {
    id: 'entry-5',
    description: 'Client call',
    projectId: 'project-4',
    projectName: 'Client Consultation',
    startTime: '2023-10-24T10:00:00Z',
    endTime: '2023-10-24T11:00:00Z',
    duration: 3600, // 1h in seconds
  },
];

const mockProjects = [
  { id: 'project-1', name: 'Website Redesign', color: '#3b82f6' },
  { id: 'project-2', name: 'Mobile App Development', color: '#10b981' },
  { id: 'project-3', name: 'Marketing Campaign', color: '#f59e0b' },
  { id: 'project-4', name: 'Client Consultation', color: '#8b5cf6' },
];

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedProject, setSelectedProject] = useState('all');
  
  // Helper functions for reporting
  const getProjectEntries = (projectId: string) => {
    if (projectId === 'all') return mockTimeEntries;
    return mockTimeEntries.filter(entry => entry.projectId === projectId);
  };
  
  const getProjectColor = (projectId: string) => {
    const project = mockProjects.find(p => p.id === projectId);
    return project ? project.color : '#cbd5e1';
  };
  
  const getProjectEntriesTotalHours = (projectId: string) => {
    const entries = getProjectEntries(projectId);
    return calculateTotalHours(entries);
  };
  
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };
  
  // Data for charts
  const projectData = mockProjects.map(project => ({
    name: project.name,
    hours: getProjectEntriesTotalHours(project.id),
    color: project.color,
  }));
  
  const dailyData = [
    { name: 'Mon', hours: 5.5 },
    { name: 'Tue', hours: 6.2 },
    { name: 'Wed', hours: 7.8 },
    { name: 'Thu', hours: 4.3 },
    { name: 'Fri', hours: 3.7 },
    { name: 'Sat', hours: 2.0 },
    { name: 'Sun', hours: 0.5 },
  ];
  
  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-dark p-3 rounded-lg text-sm">
          <p className="font-medium">{label}</p>
          <p className="text-primary">{`${payload[0].value} hours`}</p>
        </div>
      );
    }
    return null;
  };
  
  // Handler for export
  const handleExport = (format: 'pdf' | 'csv') => {
    toast({
      title: `Report exported as ${format.toUpperCase()}`,
      description: `Your report has been exported successfully.`,
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Reports</h1>
              <p className="text-muted-foreground mt-1">
                Analyze and export your time data
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0 w-full md:w-auto">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {mockProjects.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => handleExport('pdf')}>
                  <FilePieChart className="h-4 w-4" />
                  <span className="sr-only">Export as PDF</span>
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleExport('csv')}>
                  <File className="h-4 w-4" />
                  <span className="sr-only">Export as CSV</span>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="glass rounded-xl p-5 mb-8 animate-fade-in">
            <h2 className="text-lg font-medium mb-6">Time Overview</h2>
            
            <Tabs defaultValue="daily">
              <TabsList className="mb-4">
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="projects">By Project</TabsTrigger>
              </TabsList>
              
              <TabsContent value="daily" className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dailyData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${value}h`}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
                    <Bar
                      dataKey="hours"
                      radius={[4, 4, 0, 0]}
                      fill="rgba(56, 189, 248, 0.9)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="projects" className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={projectData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      innerRadius={60}
                      dataKey="hours"
                      stroke="rgba(255, 255, 255, 0.2)"
                    >
                      {projectData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      layout="horizontal" 
                      verticalAlign="bottom" 
                      align="center"
                      wrapperStyle={{ marginTop: '20px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="glass rounded-xl p-5 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium">Time Entries</h2>
              
              <div className="flex items-center text-sm">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Showing:</span>
                <span className="font-medium ml-1">
                  {selectedPeriod === 'day' ? 'Today' : 
                   selectedPeriod === 'week' ? 'This Week' : 
                   selectedPeriod === 'month' ? 'This Month' : 
                   selectedPeriod === 'quarter' ? 'This Quarter' : 'This Year'}
                </span>
                {selectedProject !== 'all' && (
                  <span className="ml-1">
                    for{' '}
                    <span className="font-medium">
                      {mockProjects.find(p => p.id === selectedProject)?.name}
                    </span>
                  </span>
                )}
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-3 font-medium">Description</th>
                    <th className="pb-3 font-medium">Project</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {getProjectEntries(selectedProject).map(entry => (
                    <tr key={entry.id} className="border-b border-border/50 hover:bg-muted/20">
                      <td className="py-3">{entry.description}</td>
                      <td className="py-3">
                        <div className="flex items-center">
                          <div 
                            className="h-3 w-3 rounded-full mr-2" 
                            style={{ backgroundColor: getProjectColor(entry.projectId) }}
                          />
                          {entry.projectName}
                        </div>
                      </td>
                      <td className="py-3">
                        {new Date(entry.startTime).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3 font-medium font-mono">
                        {formatDuration(entry.duration)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-between items-center mt-6">
              <p className="text-sm text-muted-foreground">
                Total hours: <span className="font-medium">{getProjectEntriesTotalHours(selectedProject).toFixed(1)}h</span>
              </p>
              
              <div className="flex gap-2">
                <Button onClick={() => handleExport('pdf')} size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
                <Button variant="outline" onClick={() => handleExport('csv')} size="sm">
                  <File className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Reports;
