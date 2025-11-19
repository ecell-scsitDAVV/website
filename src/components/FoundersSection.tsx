import React from "react";
import RevealAnimation from "./RevealAnimation";
import ImageWithFallback from "./ImageWithFallback";

const founders = [
  {
    name: "Suraj Karan Singh",
    role: "Founder",
    img: "/images/suraj.jpg",
    quote:
      "E-Cell was founded not as a student club, but as a mindset — a platform for dreamers, doers, and disruptors to challenge norms with passion and purpose.",
    tagline: "Be The Few, Be The Fearless",
  },
  {
    name: "Harsh Soni",
    role: "Co-Founder",
    img: "/images/harsh.jpg",
    quote:
      "E-Cell is a launchpad for ambition — a space where ideas, innovation, and collaboration transform dreams into reality for every member.",
    tagline: "",
  },
];

const FoundersSection: React.FC = () => {
  return (
    <section className="py-10 tech-gradient relative">
      <div className="container mx-auto px-4 relative z-10">

        {/* Section Heading */}
        <RevealAnimation>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-14 text-white tracking-tight">
            Our Leadership
          </h2>
        </RevealAnimation>

        {/* Card Grid */}
        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">

          {founders.map((f, index) => (
            <RevealAnimation key={f.name}>
              <div className="glass-effect rounded-2xl shadow-xl p-8 border border-white/20
                              hover:border-white/30 hover:scale-[1.02] transition-all duration-300
                              h-[380px] flex flex-col justify-between">

                {/* Profile Section */}
                <div className="text-center">
                  <div className="w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden 
                                  border-4 border-primary/30 shadow-lg">
                    <ImageWithFallback
                      src={f.img}
                      alt={f.name}
                      className="w-full h-full"
                    />
                  </div>

                  <h3 className="text-2xl font-bold text-white">{f.name}</h3>
                  <p className="text-primary text-sm font-semibold mt-1">{f.role}</p>
                </div>

                {/* Quote Section */}
                <blockquote className="text-center px-2">
                  <p className="text-white/70 leading-relaxed italic text-sm">
                    "{f.quote}"
                  </p>

                  {f.tagline && (
                    <p className="text-primary font-bold tracking-wide mt-3">
                      {f.tagline}
                    </p>
                  )}
                </blockquote>

              </div>
            </RevealAnimation>
          ))}

        </div>
      </div>
    </section>
  );
};

export default FoundersSection;
