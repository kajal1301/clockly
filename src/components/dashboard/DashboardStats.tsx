
import React from 'react';
import { ArrowUpRight, ClockIcon, CalendarIcon, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard = ({ title, value, description, icon, trend }: StatCardProps) => {
  return (
    <div className="glass rounded-xl p-5 animate-fade-in">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-semibold mt-1">{value}</h3>
        </div>
        <div className="p-2 bg-primary/10 rounded-full text-primary">
          {icon}
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{description}</p>
        
        {trend && (
          <div className={cn(
            "flex items-center text-xs font-medium",
            trend.isPositive ? "text-green-600" : "text-red-600"
          )}>
            <ArrowUpRight className={cn(
              "h-3 w-3 mr-1",
              !trend.isPositive && "rotate-180"
            )} />
            <span>{trend.value}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

interface DashboardStatsProps {
  stats: {
    hoursToday: number;
    hoursThisWeek: number;
    activeProjects: number;
  };
}

const DashboardStats = ({ stats }: DashboardStatsProps) => {
  const { hoursToday, hoursThisWeek, activeProjects } = stats;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <StatCard
        title="Today's Hours"
        value={`${hoursToday.toFixed(1)}h`}
        description="Hours tracked today"
        icon={<ClockIcon className="h-5 w-5" />}
        trend={{ value: 12, isPositive: true }}
      />
      
      <StatCard
        title="This Week"
        value={`${hoursThisWeek.toFixed(1)}h`}
        description="Hours tracked this week"
        icon={<CalendarIcon className="h-5 w-5" />}
        trend={{ value: 8, isPositive: true }}
      />
      
      <StatCard
        title="Active Projects"
        value={activeProjects}
        description="Projects in progress"
        icon={<Briefcase className="h-5 w-5" />}
      />
    </div>
  );
};

export default DashboardStats;
