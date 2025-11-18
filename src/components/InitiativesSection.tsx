
import React from 'react';
import RevealAnimation from './RevealAnimation';
import ImageWithFallback from './ImageWithFallback';

interface InitiativeCardProps {
  title: string;
  description: string;
  imageSrc: string;
  delay?: number;
}

const InitiativeCard: React.FC<InitiativeCardProps> = ({ title, description, imageSrc, delay = 0 }) => {
  return (
    <RevealAnimation delay={delay} className="h-full">
      <div className="bg-white dark:bg-black rounded-lg overflow-hidden shadow-md h-full transition-all duration-300 hover:shadow-xl group">
        <div className="overflow-hidden h-48">
          <ImageWithFallback 
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-3 text-blue-600">{title}</h3>
          <p className="text-gray-700 dark:text-gray-300">{description}</p>
        </div>
      </div>
    </RevealAnimation>
  );
};

const InitiativesSection: React.FC = () => {
  const initiatives = [
    {
      title: "E-Summit",
      description: "Our annual flagship event bringing together entrepreneurs, investors, and students for networking, competitions, and inspiring talks.",
      imageSrc: "https://images.unsplash.com/photo-1559223607-a43c990c692c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    },
    {
      title: "Startup Incubation",
      description: "A program to support early-stage startups with resources, mentorship, and funding opportunities to help them grow and succeed.",
      imageSrc: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    },
    {
      title: "Workshop Series",
      description: "Regular workshops on various aspects of entrepreneurship and business to help students develop necessary skills and knowledge.",
      imageSrc: "https://images.unsplash.com/photo-1544531585-9847b68c8c86?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    },
    {
      title: "Pitch Competition",
      description: "Platform for students to present their business ideas to a panel of judges and win prizes and mentorship opportunities.",
      imageSrc: "https://images.unsplash.com/photo-1533750516278-4555388a4a06?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
    },
    {
      title: "Mentorship Program",
      description: "Connecting students with experienced entrepreneurs and industry professionals for guidance and support.",
      imageSrc: "https://images.unsplash.com/photo-1558403194-611308249627?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    },
    {
      title: "Innovation Lab",
      description: "A creative space where students can work on their projects, collaborate with peers, and access resources to bring their ideas to life.",
      imageSrc: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    }
  ];

  return (
    <section id="initiatives" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <RevealAnimation>
          <span className="inline-block py-1 px-3 mb-3 text-xs tracking-wider uppercase rounded-full bg-secondary text-primary font-medium">Our Initiatives</span>
        </RevealAnimation>
        
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12">
          <RevealAnimation delay={100}>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Programs & Events</h2>
          </RevealAnimation>
          
          <RevealAnimation delay={200}>
            <p className="text-muted-foreground max-w-md mt-4 md:mt-0">
              Discover our diverse range of programs designed to support entrepreneurial journeys at every stage.
            </p>
          </RevealAnimation>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {initiatives.map((initiative, index) => (
            <InitiativeCard
              key={index}
              title={initiative.title}
              description={initiative.description}
              imageSrc={initiative.imageSrc}
              delay={100 * (index + 1)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default InitiativesSection;
