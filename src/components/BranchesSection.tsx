{/*
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Network, Blocks } from 'lucide-react';
import RevealAnimation from './RevealAnimation';

interface Branch {
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'Active' | 'Coming Soon';
  details: string[];
}

const branches: Branch[] = [
  {
    title: "IOT Club",
    description: "Exploring the Internet of Things and connected devices",
    icon: <Network className="w-12 h-12 text-blue-500" />,
    status: "Active",
    details: [
      "Smart device development",
      "Sensor integration workshops",
      "Arduino & Raspberry Pi projects",
      "Industrial IoT solutions"
    ]
  },
  {
    title: "Blockchain Club",
    description: "Diving into distributed ledger technology and cryptocurrencies",
    icon: <Blocks className="w-12 h-12 text-green-500" />,
    status: "Active",
    details: [
      "Smart contract development",
      "DeFi applications",
      "NFT creation workshops",
      "Cryptocurrency trading strategies"
    ]
  }
];

const BranchesSection: React.FC = () => {
  return (
    <section id="branches" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <RevealAnimation>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Branches
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Specialized communities within E-Cell focusing on cutting-edge technologies
            </p>
          </div>
        </RevealAnimation>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {branches.map((branch, index) => (
            <RevealAnimation key={branch.title} delay={index * 160}>
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    {branch.icon}
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <CardTitle className="text-xl text-white">
                      {branch.title}
                    </CardTitle>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      branch.status === 'Active' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    }`}>
                      {branch.status}
                    </span>
                  </div>
                  <CardDescription className="text-white/70">
                    {branch.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {branch.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start text-white/80">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-sm">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </RevealAnimation>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BranchesSection;
*/}
