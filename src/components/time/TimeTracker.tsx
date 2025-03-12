
import React, { useState, useEffect } from 'react';
import { Play, Pause, Plus, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { formatTime } from '@/lib/utils';
import { db, TimeEntry, Customer, Project } from '@/lib/db';
import { toast } from 'sonner';

interface TimeTrackerProps {
  onTimeEntryCreate: (entry: TimeEntry) => void;
}

const TimeTracker = ({ onTimeEntryCreate }: TimeTrackerProps) => {
  const [isTracking, setIsTracking] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [description, setDescription] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [isBillable, setIsBillable] = useState(true);
  const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [manualEntry, setManualEntry] = useState({
    hours: '',
    minutes: '',
    description: '',
    project: '',
    customer: '',
    billable: true
  });
  
  // Load customers and projects on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const customersData = await db.customers.getAll();
        setCustomers(customersData);
        
        const projectsData = await db.projects.getAll();
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load customers and projects');
      }
    };
    
    fetchData();
  }, []);
  
  // Filter projects when customer changes
  useEffect(() => {
    if (selectedCustomer) {
      const fetchProjects = async () => {
        try {
          const customerProjects = await db.projects.getByCustomerId(selectedCustomer);
          setFilteredProjects(customerProjects);
          
          // Reset project selection if the current project doesn't belong to this customer
          const currentProjectBelongsToCustomer = customerProjects.some(
            project => project.id === selectedProject
          );
          
          if (!currentProjectBelongsToCustomer) {
            setSelectedProject('');
          }
        } catch (error) {
          console.error('Error fetching projects for customer:', error);
        }
      };
      
      fetchProjects();
    } else {
      setFilteredProjects(projects);
    }
  }, [selectedCustomer, projects, selectedProject]);
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isTracking) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking]);
  
  const handleStartStop = async () => {
    if (isTracking) {
      // Stop tracking and create entry
      if (seconds > 0) {
        if (!selectedProject) {
          toast.error("Please select a project before stopping the timer");
          return;
        }
        
        setIsLoading(true);
        
        try {
          const newEntry = {
            description: description || 'Untitled task',
            project_id: selectedProject,
            customer_id: selectedCustomer || 
              projects.find(p => p.id === selectedProject)?.customer_id || '',
            start_time: new Date(Date.now() - seconds * 1000).toISOString(),
            end_time: new Date().toISOString(),
            duration: seconds,
            billable: isBillable,
            user_id: 'current-user' // In a real app, this would be the logged-in user's ID
          };
          
          const entry = await db.timeEntries.create(newEntry);
          
          if (entry) {
            onTimeEntryCreate(entry);
            toast.success("Time entry saved successfully!");
          } else {
            toast.error("Failed to save time entry");
          }
        } catch (error) {
          console.error('Error creating time entry:', error);
          toast.error("An error occurred while saving the time entry");
        } finally {
          setIsLoading(false);
        }
      }
      
      // Reset tracker
      setSeconds(0);
      setDescription('');
    }
    
    setIsTracking(!isTracking);
  };
  
  const handleManualEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const hours = parseInt(manualEntry.hours || '0');
    const minutes = parseInt(manualEntry.minutes || '0');
    const totalSeconds = (hours * 3600) + (minutes * 60);
    
    if (totalSeconds <= 0) {
      toast.error("Please enter a valid time duration");
      return;
    }
    
    if (!manualEntry.project) {
      toast.error("Please select a project");
      return;
    }
    
    const selectedProjectObj = projects.find(p => p.id === manualEntry.project);
    const customerId = manualEntry.customer || selectedProjectObj?.customer_id || '';
    
    if (!customerId && !manualEntry.customer) {
      toast.error("Please select a customer");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const newEntry = {
        description: manualEntry.description || 'Untitled task',
        project_id: manualEntry.project,
        customer_id: customerId,
        start_time: new Date(Date.now() - totalSeconds * 1000).toISOString(),
        end_time: new Date().toISOString(),
        duration: totalSeconds,
        billable: manualEntry.billable,
        user_id: 'current-user' // In a real app, this would be the logged-in user's ID
      };
      
      const entry = await db.timeEntries.create(newEntry);
      
      if (entry) {
        onTimeEntryCreate(entry);
        toast.success("Time entry saved successfully!");
        
        // Reset form
        setManualEntry({
          hours: '',
          minutes: '',
          description: '',
          project: '',
          customer: '',
          billable: true
        });
        
        setIsManualEntryOpen(false);
      } else {
        toast.error("Failed to save time entry");
      }
    } catch (error) {
      console.error('Error creating manual time entry:', error);
      toast.error("An error occurred while saving the time entry");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle customer change in manual entry form
  const handleManualCustomerChange = (customerId: string) => {
    setManualEntry({...manualEntry, customer: customerId, project: ''});
  };
  
  return (
    <div className="glass rounded-xl p-4">
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What are you working on?"
          disabled={isTracking}
          className="flex-grow"
        />
        
        <Select
          value={selectedCustomer}
          onValueChange={setSelectedCustomer}
          disabled={isTracking}
        >
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Customer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-customers">All Customers</SelectItem>
            {customers.map(customer => (
              <SelectItem key={customer.id} value={customer.id}>
                {customer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select
          value={selectedProject}
          onValueChange={setSelectedProject}
          disabled={isTracking}
        >
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Project" />
          </SelectTrigger>
          <SelectContent>
            {filteredProjects.map(project => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="flex-shrink-0 flex items-center gap-2">
          <div className="w-20 text-xl font-medium font-mono tabular-nums text-center">
            {formatTime(seconds)}
          </div>
          
          <Button
            onClick={handleStartStop}
            variant={isTracking ? "destructive" : "default"}
            size="icon"
            className="h-10 w-10 rounded-full"
          >
            {isTracking ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
      
      <div className="mt-4 flex justify-between">
        <div className="flex items-center">
          <label className="flex items-center space-x-2 text-sm">
            <input 
              type="checkbox" 
              checked={isBillable} 
              onChange={() => setIsBillable(!isBillable)}
              disabled={isTracking}
              className="rounded border-gray-300"
            />
            <span>Billable</span>
          </label>
        </div>
        
        <Dialog open={isManualEntryOpen} onOpenChange={setIsManualEntryOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-xs">
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add time manually
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add time entry manually</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleManualEntry} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hours">Hours</Label>
                  <Input
                    id="hours"
                    type="number"
                    min="0"
                    max="24"
                    placeholder="0"
                    value={manualEntry.hours}
                    onChange={(e) => setManualEntry({...manualEntry, hours: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minutes">Minutes</Label>
                  <Input
                    id="minutes"
                    type="number"
                    min="0"
                    max="59"
                    placeholder="0"
                    value={manualEntry.minutes}
                    onChange={(e) => setManualEntry({...manualEntry, minutes: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="manualDescription">Description</Label>
                <Input
                  id="manualDescription"
                  placeholder="What did you work on?"
                  value={manualEntry.description}
                  onChange={(e) => setManualEntry({...manualEntry, description: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="manualCustomer">Customer</Label>
                <Select
                  value={manualEntry.customer}
                  onValueChange={handleManualCustomerChange}
                >
                  <SelectTrigger id="manualCustomer">
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map(customer => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="manualProject">Project</Label>
                <Select
                  value={manualEntry.project}
                  onValueChange={(value) => setManualEntry({...manualEntry, project: value})}
                >
                  <SelectTrigger id="manualProject">
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {manualEntry.customer 
                      ? projects.filter(p => p.customer_id === manualEntry.customer).map(project => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))
                      : projects.map(project => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))
                    }
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center">
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={manualEntry.billable} 
                    onChange={() => setManualEntry({...manualEntry, billable: !manualEntry.billable})}
                    className="rounded border-gray-300"
                  />
                  <span>Billable</span>
                </label>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button type="submit">Save entry</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TimeTracker;
