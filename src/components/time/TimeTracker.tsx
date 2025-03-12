
import React, { useState, useEffect } from 'react';
import { Play, Pause, Plus, Clock } from 'lucide-react';
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

interface TimeTrackerProps {
  projects: { id: string; name: string }[];
  onTimeEntryCreate: (entry: any) => void;
}

const TimeTracker = ({ projects, onTimeEntryCreate }: TimeTrackerProps) => {
  const [isTracking, setIsTracking] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [description, setDescription] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);
  const [manualEntry, setManualEntry] = useState({
    hours: '',
    minutes: '',
    description: '',
    project: '',
  });
  
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
  
  const handleStartStop = () => {
    if (isTracking) {
      // Stop tracking and create entry
      if (seconds > 0) {
        onTimeEntryCreate({
          id: Date.now().toString(),
          description: description || 'Untitled task',
          projectId: selectedProject,
          startTime: new Date(Date.now() - seconds * 1000).toISOString(),
          endTime: new Date().toISOString(),
          duration: seconds,
        });
      }
      
      // Reset tracker
      setSeconds(0);
      setDescription('');
      setSelectedProject('');
    }
    
    setIsTracking(!isTracking);
  };
  
  const handleManualEntry = (e: React.FormEvent) => {
    e.preventDefault();
    
    const hours = parseInt(manualEntry.hours || '0');
    const minutes = parseInt(manualEntry.minutes || '0');
    const totalSeconds = (hours * 3600) + (minutes * 60);
    
    if (totalSeconds > 0) {
      onTimeEntryCreate({
        id: Date.now().toString(),
        description: manualEntry.description || 'Untitled task',
        projectId: manualEntry.project,
        startTime: new Date(Date.now() - totalSeconds * 1000).toISOString(),
        endTime: new Date().toISOString(),
        duration: totalSeconds,
      });
      
      // Reset form
      setManualEntry({
        hours: '',
        minutes: '',
        description: '',
        project: '',
      });
    }
    
    setIsManualEntryOpen(false);
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
          value={selectedProject}
          onValueChange={setSelectedProject}
          disabled={isTracking}
        >
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Project" />
          </SelectTrigger>
          <SelectContent>
            {projects.map(project => (
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
      
      <div className="mt-4 flex justify-end">
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
                <Label htmlFor="manualProject">Project</Label>
                <Select
                  value={manualEntry.project}
                  onValueChange={(value) => setManualEntry({...manualEntry, project: value})}
                >
                  <SelectTrigger id="manualProject">
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
