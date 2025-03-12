
import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProjectCard from '@/components/projects/ProjectCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

// Mock data
const mockProjects = [
  {
    id: 'project-1',
    name: 'Website Redesign',
    description: 'Redesigning the company website with modern UI/UX principles.',
    color: '#3b82f6',
    progress: 65,
    totalHours: 24.5,
    members: [
      { id: 'user-1', name: 'John Doe', avatar: '' },
      { id: 'user-2', name: 'Jane Smith', avatar: '' },
      { id: 'user-3', name: 'Mike Johnson', avatar: '' },
    ],
  },
  {
    id: 'project-2',
    name: 'Mobile App Development',
    description: 'Building a mobile app for iOS and Android platforms.',
    color: '#10b981',
    progress: 35,
    totalHours: 18.2,
    members: [
      { id: 'user-1', name: 'John Doe', avatar: '' },
      { id: 'user-4', name: 'Sarah Wilson', avatar: '' },
    ],
  },
  {
    id: 'project-3',
    name: 'Marketing Campaign',
    description: 'Q4 marketing campaign for product launch.',
    color: '#f59e0b',
    progress: 85,
    totalHours: 12.8,
    members: [
      { id: 'user-3', name: 'Mike Johnson', avatar: '' },
      { id: 'user-5', name: 'Emily Brown', avatar: '' },
      { id: 'user-6', name: 'David Lee', avatar: '' },
      { id: 'user-7', name: 'Lisa Wang', avatar: '' },
    ],
  },
  {
    id: 'project-4',
    name: 'Client Consultation',
    description: 'Ongoing consultation for enterprise clients.',
    color: '#8b5cf6',
    progress: 15,
    totalHours: 8.5,
    members: [
      { id: 'user-2', name: 'Jane Smith', avatar: '' },
      { id: 'user-3', name: 'Mike Johnson', avatar: '' },
    ],
  },
];

const Projects = () => {
  const [projects, setProjects] = useState(mockProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    color: '#3b82f6',
  });
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleCreateProject = () => {
    if (!projectForm.name.trim()) {
      toast({
        title: "Project name is required",
        variant: "destructive",
      });
      return;
    }
    
    const newProject = {
      id: `project-${Date.now()}`,
      name: projectForm.name,
      description: projectForm.description,
      color: projectForm.color,
      progress: 0,
      totalHours: 0,
      members: [], // In a real app, you would add the current user
    };
    
    setProjects([newProject, ...projects]);
    setIsCreating(false);
    setProjectForm({ name: '', description: '', color: '#3b82f6' });
    
    toast({
      title: "Project created",
      description: `${projectForm.name} has been successfully created.`,
    });
  };
  
  const handleEditProject = (id: string) => {
    const project = projects.find(p => p.id === id);
    if (project) {
      setProjectForm({
        name: project.name,
        description: project.description,
        color: project.color,
      });
      setEditingProject(id);
      setIsCreating(true);
    }
  };
  
  const handleUpdateProject = () => {
    if (!projectForm.name.trim() || !editingProject) return;
    
    setProjects(projects.map(project => 
      project.id === editingProject
        ? { ...project, name: projectForm.name, description: projectForm.description, color: projectForm.color }
        : project
    ));
    
    setIsCreating(false);
    setEditingProject(null);
    setProjectForm({ name: '', description: '', color: '#3b82f6' });
    
    toast({
      title: "Project updated",
      description: `${projectForm.name} has been successfully updated.`,
    });
  };
  
  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(project => project.id !== id));
    
    toast({
      title: "Project deleted",
      description: "The project has been successfully deleted.",
    });
  };
  
  const handleDialogClose = () => {
    setIsCreating(false);
    setEditingProject(null);
    setProjectForm({ name: '', description: '', color: '#3b82f6' });
  };
  
  // Color options
  const colorOptions = [
    { value: '#3b82f6', label: 'Blue' },
    { value: '#10b981', label: 'Green' },
    { value: '#f59e0b', label: 'Orange' },
    { value: '#8b5cf6', label: 'Purple' },
    { value: '#ec4899', label: 'Pink' },
    { value: '#ef4444', label: 'Red' },
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
              <p className="text-muted-foreground mt-1">
                Manage your active projects
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  className="pl-9 w-full sm:w-64"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              
              <Dialog open={isCreating} onOpenChange={setIsCreating}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Project
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingProject ? 'Edit Project' : 'Create New Project'}
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="projectName">Project Name</Label>
                      <Input
                        id="projectName"
                        placeholder="Enter project name"
                        value={projectForm.name}
                        onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="projectDescription">Description</Label>
                      <Textarea
                        id="projectDescription"
                        placeholder="Enter project description"
                        rows={3}
                        value={projectForm.description}
                        onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Project Color</Label>
                      <div className="flex flex-wrap gap-2">
                        {colorOptions.map(color => (
                          <button
                            key={color.value}
                            type="button"
                            className={`w-8 h-8 rounded-full transition-all ${
                              projectForm.color === color.value ? 'ring-2 ring-offset-2 ring-primary' : ''
                            }`}
                            style={{ backgroundColor: color.value }}
                            onClick={() => setProjectForm({ ...projectForm, color: color.value })}
                            aria-label={`Select ${color.label} color`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" onClick={handleDialogClose}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button 
                      onClick={editingProject ? handleUpdateProject : handleCreateProject}
                      disabled={!projectForm.name.trim()}
                    >
                      {editingProject ? 'Update Project' : 'Create Project'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          {filteredProjects.length === 0 ? (
            <div className="text-center glass rounded-xl py-16 px-4 animate-fade-in">
              <h3 className="text-lg font-medium mb-2">No projects found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery
                  ? `No results for "${searchQuery}"`
                  : "You haven't created any projects yet"}
              </p>
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Project
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onEdit={handleEditProject}
                  onDelete={handleDeleteProject}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Projects;
