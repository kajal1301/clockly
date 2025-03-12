
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, BarChart, Zap, Calendar, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const features = [
  {
    icon: <Clock className="h-6 w-6" />,
    title: 'Effortless Time Tracking',
    description: 'Start and stop timers with a single click. Track time from anywhere, on any device.',
  },
  {
    icon: <BarChart className="h-6 w-6" />,
    title: 'Insightful Reports',
    description: 'Visualize your time data with beautiful charts and detailed reports.',
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: 'Boost Productivity',
    description: 'Identify time-wasting activities and optimize your workflow.',
  },
  {
    icon: <Calendar className="h-6 w-6" />,
    title: 'Project Management',
    description: 'Organize your work into projects and tasks. Set deadlines and track progress.',
  },
];

const testimonials = [
  {
    quote: "TimeFlow has transformed how our team tracks time. It's intuitive, beautiful, and has significantly improved our billing accuracy.",
    name: 'Sarah Johnson',
    title: 'Design Director',
    company: 'Designify',
  },
  {
    quote: "I've tried many time trackers, but TimeFlow stands out with its elegant interface and powerful features. It's become an essential part of my workflow.",
    name: 'Michael Chen',
    title: 'Freelance Developer',
  },
  {
    quote: "Since adopting TimeFlow, our project estimates have become 40% more accurate. The insights we've gained have been invaluable.",
    name: 'Emily Rodriguez',
    title: 'Project Manager',
    company: 'Innovate Inc',
  },
];

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="glass p-6 rounded-xl transition-all duration-300 hover:shadow-md animate-fade-in">
    <div className="p-3 bg-primary/10 rounded-full w-fit text-primary mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-medium mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

const Testimonial = ({ quote, name, title, company, className }: { 
  quote: string; 
  name: string; 
  title: string; 
  company?: string;
  className?: string;
}) => (
  <div className={cn("p-6 rounded-xl backdrop-blur-sm animate-slide-up", className)}>
    <div className="mb-4 text-xl leading-relaxed">"{quote}"</div>
    <div>
      <div className="font-medium">{name}</div>
      <div className="text-sm text-muted-foreground">
        {title}{company ? `, ${company}` : ''}
      </div>
    </div>
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="py-24 md:py-32 overflow-hidden">
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center bg-muted px-3 py-1 rounded-full text-sm font-medium mb-6 animate-fade-in">
                <Gift className="h-4 w-4 mr-2 text-primary" />
                <span>Free 30-day trial, no credit card required</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6 animate-fade-in">
                Track your time with <span className="text-primary">precision</span> and <span className="text-primary">elegance</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 animate-fade-in">
                A beautiful, intuitive time tracking solution that helps you stay productive and make the most of your time.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
                <Button size="lg" asChild>
                  <Link to="/signup">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                
                <Button variant="outline" size="lg" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
              </div>
            </div>
            
            <div className="mt-16 relative">
              <div className="glass rounded-xl overflow-hidden shadow-xl animate-fade-in">
                <img 
                  src="https://cdn.pixabay.com/photo/2018/03/10/12/00/teamwork-3213924_1280.jpg" 
                  alt="TimeFlow Dashboard"
                  className="w-full object-cover rounded-xl animate-fade-in"
                />
              </div>
              
              <div className="absolute -bottom-6 -right-6 -z-10 h-40 w-40 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute -top-6 -left-6 -z-10 h-40 w-40 bg-primary/20 rounded-full blur-3xl" />
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-semibold tracking-tight mb-4">
                Designed for productivity
              </h2>
              <p className="text-lg text-muted-foreground">
                TimeFlow combines beautiful design with powerful features to help you work smarter.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <FeatureCard 
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-semibold tracking-tight mb-4">
                Loved by professionals
              </h2>
              <p className="text-lg text-muted-foreground">
                Here's what people are saying about TimeFlow.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Testimonial
                  key={index}
                  quote={testimonial.quote}
                  name={testimonial.name}
                  title={testimonial.title}
                  company={testimonial.company}
                  className={cn(
                    index === 0 && "bg-primary/5 border border-primary/10",
                    index === 1 && "glass",
                    index === 2 && "bg-muted border border-border"
                  )}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-semibold tracking-tight mb-4">
                Ready to optimize your time?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of professionals who trust TimeFlow to track their time and boost productivity.
              </p>
              
              <Button size="lg" asChild>
                <Link to="/signup">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
