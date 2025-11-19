import React from 'react';
import { Instagram, Linkedin, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const handleScroll = (id: string) => (
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    event.preventDefault();
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const socialLinks = [
    {
      name: "twitter",
      icon: <Twitter size={20} />,
      color: "bg-[#1DA1F2]",
      url: "https://x.com/ecell_scsit",
    },
    {
      name: "instagram",
      icon: <Instagram size={20} />,
      color: "bg-[#E4405F]",
      url: "https://www.instagram.com/ecell_scsit",
    },
    {
      name: "linkedin",
      icon: <Linkedin size={20} />,
      color: "bg-[#0A66C2]",
      url: "https://www.linkedin.com/company/ecell-scsit/",
    },
  ];

  const quickLinks = [
    { label: "About", id: "about" },
    { label: "Team", id: "team" },
    { label: "Events", id: "events" },
    { label: "Initiatives", id: "initiatives" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <footer className="py-12 px-4 sm:px-6 border-t bg-primary/10">
      <div className="max-w-7xl mx-auto">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-6">

          {/* Column 1 */}
          <div>
            <a
              href="#"
              className="inline-block mb-4 w-20 md:w-24 hover:opacity-90 transition"
            >
              <img
                src="/images/Ecell_transparent_svg.png"
                alt="E-Cell Logo"
                className="w-full h-auto"
              />
            </a>

            <p className="font-bold text-3xl text-primary mb-2">E-Cell, SCSIT</p>

            <p className="text-muted-foreground mb-6">
              Empowering students to innovate and lead through entrepreneurship.
            </p>

            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className={`w-10 h-10 flex items-center justify-center rounded-full ${social.color} text-white hover:scale-105 transition-transform duration-300 shadow-md`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-background">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={handleScroll(link.id)}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 cursor-pointer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-background">
              Contact Us
            </h3>
            <p className="text-muted-foreground">
              SCSIT, Takshashila Campus,
              <br /> Indore, MP – 452020
            </p>
            <p className="text-muted-foreground mt-2">
              Email:{" "}
              <a
                href="mailto:ecellscsit@gmail.com"
                className="text-primary hover:underline"
              >
                ecellscsit@gmail.com
              </a>
            </p>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t text-center">
          <p className="text-muted-foreground text-sm">
            © {currentYear} Entrepreneurship Cell, SCSIT — All rights reserved.
          </p>

          <p className="text-muted-foreground text-sm mt-2">
            Meet the developers:&nbsp;
            <a
              href="https://my-3d-portfolio-liard.vercel.app/"
              className="text-blue-500 hover:underline"
              target="_blank"
            >
              Gourav Patidar
            </a>{" "}
            |{" "}
            <a
              href="https://divya-green.vercel.app/"
              className="text-blue-500 hover:underline"
              target="_blank"
            >
              Divya Nagar
            </a>{" "}
            |{" "}
            <a
              href="http://abnjain.me/"
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Abhinav Jain
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
