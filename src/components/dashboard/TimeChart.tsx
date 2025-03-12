
import React, { useState } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TimeChartProps {
  weeklyData: Array<{
    name: string;
    hours: number;
  }>;
  projectData: Array<{
    name: string;
    hours: number;
    color: string;
  }>;
}

const TimeChart = ({ weeklyData, projectData }: TimeChartProps) => {
  const [activeTab, setActiveTab] = useState('weekly');
  
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
  
  return (
    <div className="glass rounded-xl p-5 animate-fade-in">
      <h3 className="font-medium mb-4">Time Overview</h3>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="weekly">Weekly Activity</TabsTrigger>
          <TabsTrigger value="projects">By Project</TabsTrigger>
        </TabsList>
        
        <TabsContent value="weekly" className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weeklyData}
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
  );
};

export default TimeChart;
