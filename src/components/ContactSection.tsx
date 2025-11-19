import React, { useState } from "react";
import RevealAnimation from "./RevealAnimation";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

const ContactSection: React.FC = () => {
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: formState,
      });

      if (error) throw error;

      setIsSent(true);
      toast({
        title: "Message Sent!",
        description: "Thank you for reaching out. We'll get back to you soon.",
      });

      setFormState({ name: "", email: "", message: "" });

      setTimeout(() => setIsSent(false), 5000);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Left Section */}
          <div>
            <RevealAnimation>
              <span className="inline-block py-1 px-3 mb-3 text-xs tracking-wider uppercase rounded-full bg-secondary text-primary font-medium">
                Get In Touch
              </span>
            </RevealAnimation>

            <RevealAnimation delay={120}>
              <h2 className="text-3xl text-white md:text-4xl font-bold tracking-tight mb-6">
                Have Questions?
              </h2>
            </RevealAnimation>

            <RevealAnimation delay={200}>
              <p className="text-muted-foreground mb-8">
                Interested in our initiatives or want to collaborate? Fill out the
                form and our team will get back to you shortly.
              </p>
            </RevealAnimation>

            {/* Contact Info */}
            <RevealAnimation delay={300}>
              <div className="space-y-6">
                {/*<div className="flex items-start">
                  <div className="mr-3 p-3 rounded-full bg-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Phone</h3>
                    <p className="text-muted-foreground">+1 (123) 456-7890</p>
                  </div>
                </div>*/}

                {/* Email */}
                <div className="flex items-start">
                  <div className="mr-3 p-3 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      className="text-primary"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
                      <polyline points="3 7 12 13 21 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-primary text-lg font-semibold">Email</h3>
                    <p className="text-muted-foreground">ecellscsit@gmail.com</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start">
                  <div className="mr-3 p-3 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      className="text-primary"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-primary text-lg font-semibold">Location</h3>
                    <p className="text-muted-foreground">
                      SCSIT, Takshashila Campus, Khandwa Road, Indore, MP 452020
                    </p>
                  </div>
                </div>
              </div>
            </RevealAnimation>
          </div>

          {/* Right Section - Form */}
          <RevealAnimation delay={250}>
            <Card className="bg-background/80 backdrop-blur-xl border border-white/10 shadow-2xl p-6 md:p-8 rounded-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Name */}
                <div>
                  <Label className="text-base font-medium">Name</Label>
                  <Input
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                    className="mt-1 text-black"
                  />
                </div>

                {/* Email */}
                <div>
                  <Label className="text-base font-medium">Email</Label>
                  <Input
                    type="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    required
                    placeholder="Your email"
                    className="mt-1 text-black"
                  />
                </div>

                {/* Message */}
                <div>
                  <Label className="text-base font-medium">Message</Label>
                  <Textarea
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    rows={5}
                    required
                    placeholder="Your message"
                    className="mt-1 resize-none text-black"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSending || isSent}
                  className="w-full py-3 font-medium transition-all duration-200 hover:scale-[1.02] shadow-lg disabled:opacity-70"
                >
                  {isSending ? "Sending..." : isSent ? "Message Sent ✓" : "Send Message"}
                </Button>
              </form>
            </Card>
          </RevealAnimation>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
