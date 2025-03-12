
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getInitials } from '@/lib/utils';

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description: string;
    color: string;
    progress: number;
    totalHours: number;
    members: Array<{
      id: string;
      name: string;
      avatar?: string;
    }>;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ProjectCard = ({ project, onEdit, onDelete }: ProjectCardProps) => {
  const { id, name, description, color, progress, totalHours, members } = project;
  
  return (
    <div className="group glass hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden">
      <div 
        className="h-2" 
        style={{ backgroundColor: color }}
      />
      
      <div className="p-5 space-y-4">
        <div className="flex justify-between items-start">
          <Link to={`/projects/${id}`} className="block group-hover:text-primary transition-colors">
            <h3 className="font-medium text-lg">{name}</h3>
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(id)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(id)}
                className="text-destructive"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex -space-x-2">
            {members.slice(0, 3).map(member => (
              <Avatar key={member.id} className="border-2 border-background h-8 w-8">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback className="text-xs">
                  {getInitials(member.name)}
                </AvatarFallback>
              </Avatar>
            ))}
            
            {members.length > 3 && (
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background">
                +{members.length - 3}
              </div>
            )}
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span>{totalHours.toFixed(1)}h</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
