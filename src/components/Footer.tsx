import React from 'react';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const handleScroll = (id: string) => (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="py-12 px-4 sm:px-6 border-t">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-cols-1 md:flex-cols-3 justify-between px-10 md:mr-16">
          <div className="col-span-1">
            <a href="#" className="text-2xl max-w-[70px] h-auto font-bold tracking-tighter mb-6 inline-block">
              <img src="/images/Ecell_transparent_svg.png" alt="E-Cell Logo" />
            </a>
            <p className="text-muted-foreground font-bold text-3xl mb-4">
              E-Cell, SCSIT
            </p>
            <p className="text-muted-foreground mb-6">
              Empowering students to innovate and lead through entrepreneurship.
            </p>
            <div className="flex space-x-4">
              {[
                { name: "twitter", icon: <Twitter size={20} />, color: "bg-[#1DA1F2]", url: "https://x.com/ecell_scsit" },
                { name: "instagram", icon: <Instagram size={20} />, color: "bg-[#E4405F]", url: "https://www.instagram.com/ecell_scsit" },
                { name: "linkedin", icon: <Linkedin size={20} />, color: "bg-[#0A66C2]", url: "https://www.linkedin.com/company/ecell-scsit/" }
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 flex items-center justify-center rounded-full ${social.color} text-white hover:opacity-90 transition-opacity duration-300`}
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {["About", "Team", "Events", "Initiatives", "Contact"].map((link) => (
                <li key={link}>
                  <a 
                    href={`#${link.toLowerCase().replace(' ', '-')}`}
                    onClick={handleScroll(link.toLowerCase().replace(' ', '-'))}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t text-center">
          <p className="text-muted-foreground text-sm">
            © {currentYear} Entrepreneurship Cell. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm">
            Created by Gourav Patidar <a href="https://my-3d-portfolio-liard.vercel.app/" className="text-blue-500 hover:underline" target="_blank">Gourav's Portfolio</a> | Divya Nagar 
            <a href="https://divya-green.vercel.app/" className="text-blue-500 hover:underline" target="_blank"> Divya's Portfolio</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
