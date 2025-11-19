import React from 'react';
import RevealAnimation from './RevealAnimation';
import ImageWithFallback from './ImageWithFallback';
import { Card, CardContent } from './ui/card';
import { Binoculars, Goal } from "lucide-react";

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-24 px-4 tech-gradient">
      <div className="max-w-7xl mx-auto">

        {/* TITLE BADGE */}
        <RevealAnimation>
          <span className="inline-block py-1 px-3 mb-4 text-xs tracking-wider uppercase rounded-full bg-secondary text-primary font-medium">
            About Us
          </span>
        </RevealAnimation>

        {/* HEADING */}
        <RevealAnimation delay={100}>
          <h2 className="text-3xl md:text-4xl font-bold mb-12 tracking-tight text-white">
            Fostering Innovation & Entrepreneurship
          </h2>
        </RevealAnimation>

        {/* MAIN GRID */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">

          {/* IMAGE */}
          <RevealAnimation delay={200}>
            <div className="rounded-xl overflow-hidden shadow-2xl border border-white/10">
              <ImageWithFallback
                src="/images/e-cell-induction-new.png"
                alt="E-Cell Students"
                className="w-full h-auto object-cover rounded-xl"
              />
            </div>
          </RevealAnimation>

          {/* TEXT CONTENT */}
          <div className="space-y-6">

            <RevealAnimation delay={300}>
              <p className="text-lg text-gray-200 leading-relaxed">
                Entrepreneurship Cell is a student body based in SCSIT, DAVV Indore that aims at
                fostering entrepreneurial spirit among young aspirants by providing a platform
                and resources to turn ideas into successful ventures.
              </p>
            </RevealAnimation>

            <RevealAnimation delay={400}>
              <p className="text-lg text-gray-200 leading-relaxed">
                E-Cell strives to establish a thriving, ever-growing startup ecosystem on campus.
                We aim to magnify reach and create a diverse pool of investors, mentors, and
                thought-leaders to guide emerging entrepreneurs.
              </p>
            </RevealAnimation>

            {/* STATS */}
            <RevealAnimation delay={500}>
              <div className="pt-4 grid grid-cols-2 gap-6 text-center">

                {[
                  { value: "10+", label: "Events Organized" },
                  { value: "1300+", label: "Students Impacted" },
                  { value: "6+", label: "Startups Incubated" },
                  { value: "15+", label: "Industry Partners" },
                ].map((stat, i) => (
                  <div key={i} className="space-y-1">
                    <h3 className="text-5xl font-bold text-blue-400">{stat.value}</h3>
                    <p className="text-sm font-medium text-sky-200">{stat.label}</p>
                  </div>
                ))}

              </div>
            </RevealAnimation>
          </div>
        </div>

        {/* MISSION & VISION */}
        <div className="grid md:grid-cols-2 gap-10">

          {/* Mission */}
          <RevealAnimation delay={600}>
            <Card className="bg-white/10 backdrop-blur-md h-56 border border-white/20 shadow-xl rounded-xl">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-secondary text-primary mr-4">
                    <Goal />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Our Mission</h3>
                </div>
                <p className="text-gray-200 leading-relaxed">
                  To build an entrepreneurial culture by equipping students with skills, resources,
                  and mentorship needed to transform ideas into impactful ventures. We seek to bridge
                  academia and industry while nurturing a high-growth startup ecosystem.
                </p>
              </CardContent>
            </Card>
          </RevealAnimation>

          {/* Vision */}
          <RevealAnimation delay={700}>
            <Card className="bg-white/10 backdrop-blur-md h-56 border border-white/20 shadow-xl rounded-xl">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-secondary text-primary mr-4">
                    <Binoculars />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Our Vision</h3>
                </div>
                <p className="text-gray-200 leading-relaxed">
                  To become a leading platform that inspires innovation, supports disruptive ideas,
                  and nurtures a generation of change-makers who contribute to sustainable
                  technological and societal growth.
                </p>
              </CardContent>
            </Card>
          </RevealAnimation>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;
