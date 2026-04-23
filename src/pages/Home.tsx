import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { BugCatcherGame } from '@/components/BugCatcherGame';
import { EnrollDialog } from '@/components/EnrollDialog';
import { ReferrerLeaderboard } from '@/components/ReferrerLeaderboard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Code2, Terminal, Cpu, CheckCircle2, Mail, MessageCircle, ArrowRight, Star, ChevronRight, Zap, User } from 'lucide-react';

export default function Home() {
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [enrollTier, setEnrollTier] = useState<'beginner' | 'pro'>('pro');

  const openEnroll = (tier: 'beginner' | 'pro') => {
    setEnrollTier(tier);
    setEnrollOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary/30 selection:text-primary">
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono font-bold text-lg">
            <Terminal className="w-5 h-5 text-primary" />
            <span>Master<span className="text-primary">Coding</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#curriculum" className="hover:text-foreground transition-colors">Curriculum</a>
            <a href="#about" className="hover:text-foreground transition-colors">About Reynold</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <Button onClick={() => openEnroll('pro')} size="sm" className="font-mono text-xs">
              ENROLL NOW
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex items-center pt-16">
        {/* Background Image & Overlay */}
        <motion.div style={{ y: yHero }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background z-0" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(22,163,74,0.15),transparent_60%)] z-10" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px] z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10" />
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono font-semibold">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              OPEN FOR ENROLLMENT
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight">
              MasterCoding <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-300">
                with Reynold.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
              Stop copying tutorials. Start building real software. Master programming languages from beginner basics to full-stack architecture with a top-tier developer educator.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Button onClick={() => openEnroll('pro')} size="lg" className="h-14 px-8 text-base font-mono gap-2 shadow-[0_0_40px_-10px_rgba(22,163,74,0.5)] hover:shadow-[0_0_60px_-15px_rgba(22,163,74,0.6)] transition-all">
                START LEARNING <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="h-14 px-8 text-base font-mono border-border/50 hover:bg-card" asChild>
                <a href="#curriculum">VIEW CURRICULUM</a>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative hidden md:block"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent blur-3xl rounded-full" />
            <div className="relative border border-border/50 bg-card/40 backdrop-blur-md rounded-2xl p-6 shadow-2xl">
              <div className="flex gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <pre className="font-mono text-sm text-muted-foreground overflow-x-auto">
                <code className="block text-primary">const</code> instructor = {'{'}
                <br/>  name: <span className="text-blue-300">"Reynold Mwendia"</span>,
                <br/>  role: <span className="text-blue-300">"Full-Stack Educator"</span>,
                <br/>  mission: <span className="text-blue-300">"Turn beginners into pros"</span>,
                <br/>  languages: [<span className="text-emerald-300">"JS"</span>, <span className="text-emerald-300">"Python"</span>, <span className="text-emerald-300">"Go"</span>],
                <br/>{'}'};
                <br/><br/>
                <code className="block text-primary">function</code> <span className="text-yellow-200">startJourney</span>(student) {'{'}
                <br/>  <code className="text-primary">return</code> instructor.mentor(student);
                <br/>{'}'}
              </pre>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Curriculum Highlights */}
      <section id="curriculum" className="py-24 bg-card/30 border-y border-border/30 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">From zero to full-stack.</h2>
            <p className="text-muted-foreground text-lg">A structured, no-BS curriculum designed to make you hireable.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Code2, title: "Fundamentals", desc: "Master the syntax, logic, and core concepts of modern programming languages." },
              { icon: Zap, title: "Frontend Mastery", desc: "Build interactive, highly polished user interfaces that feel alive." },
              { icon: Cpu, title: "Backend Architecture", desc: "Design robust APIs, manage databases, and deploy scalable servers." }
            ].map((feature, i) => (
              <Card key={i} className="bg-background/50 border-border/40 p-8 hover:border-primary/50 transition-colors group">
                <feature.icon className="w-10 h-10 text-primary mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mini Game Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-4xl font-bold">Code is logic.<br/>Debugging is an art.</h2>
              <p className="text-lg text-muted-foreground">
                Before you write complex architecture, you need to spot the errors. Test your reflexes and squash the bugs in our terminal arena.
              </p>
              <ul className="space-y-3 font-mono text-sm text-muted-foreground pt-4">
                <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-primary" /> Find the bugs</li>
                <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-primary" /> Click to terminate</li>
                <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-primary" /> Beat the clock</li>
              </ul>
            </div>
            <div className="lg:col-span-7">
              <BugCatcherGame />
            </div>
          </div>
        </div>
      </section>

      {/* About Reynold */}
      <section id="about" className="py-24 bg-card/30 border-y border-border/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-square md:aspect-[4/5] rounded-2xl overflow-hidden border border-border/50 relative bg-gradient-to-br from-primary/20 via-card to-background flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(22,163,74,0.2),transparent_60%)]" />
                <div className="relative text-center space-y-4 p-8">
                  <div className="w-32 h-32 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto">
                    <User className="w-16 h-16 text-primary" />
                  </div>
                  <p className="font-mono text-primary text-2xl font-bold">Reynold Mwendia</p>
                  <p className="font-mono text-muted-foreground text-sm">Founder & Lead Instructor</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              </div>
              
              {/* Floating badge */}
              <div className="absolute -bottom-6 -right-6 bg-card border border-border p-4 rounded-xl shadow-xl hidden md:flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-primary" fill="currentColor" />
                </div>
                <div>
                  <div className="font-bold text-xl">100+</div>
                  <div className="text-sm text-muted-foreground font-mono">Students Mentored</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-3xl md:text-5xl font-bold">Meet Reynold.</h2>
              <p className="text-xl text-primary font-mono">Senior Developer & Educator</p>
              <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                <p>
                  I built MasterCoding because I was tired of theoretical tutorials that don't prepare you for real engineering jobs.
                </p>
                <p>
                  My teaching philosophy is simple: we write code. A lot of it. We break things, we debug them, and we build production-ready applications from scratch.
                </p>
              </div>
              <div className="pt-6">
                <Button variant="outline" className="font-mono">Read Full Story</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ReferrerLeaderboard />

      {/* Pricing Section */}
      <section id="pricing" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">Invest in your career.</h2>
            <p className="text-muted-foreground text-lg">Straightforward pricing. No hidden fees. Choose the track that fits your goals.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Tier 1 */}
            <Card className="bg-background/40 border-border/40 p-8 flex flex-col hover:border-border transition-colors">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Beginner Core</h3>
                <p className="text-muted-foreground min-h-[48px]">Basics of programming languages</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-muted-foreground">KSh</span>
                  <span className="text-5xl font-bold">1,500</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8 flex-1">
                {[
                  "Introduction to programming logic",
                  "Core computer science fundamentals",
                  "First steps in beginner languages",
                  "Basic syntax and structure",
                  "Access to community forum"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              
              <Button onClick={() => openEnroll('beginner')} variant="outline" className="w-full h-12 font-mono text-base border-border/50">
                START BASICS
              </Button>
            </Card>

            {/* Tier 2 (Featured) */}
            <Card className="bg-card border-primary/50 p-8 flex flex-col relative shadow-[0_0_40px_-15px_rgba(22,163,74,0.3)]">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 rounded-bl-xl rounded-tr-xl font-mono text-sm font-bold">
                RECOMMENDED
              </div>
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2 text-primary">Full Stack Pro</h3>
                <p className="text-muted-foreground min-h-[48px]">Full learning of all programming languages</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-primary/80">KSh</span>
                  <span className="text-5xl font-bold">6,000</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8 flex-1">
                {[
                  "Everything in Beginner Core",
                  "Mastery of all major languages",
                  "Full-stack web & app development",
                  "Real-world portfolio projects",
                  "1-on-1 mentorship & code reviews",
                  "Interview prep & resume building"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              
              <Button onClick={() => openEnroll('pro')} className="w-full h-12 font-mono text-base bg-primary hover:bg-primary/90 text-primary-foreground">
                ENROLL AS PRO
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 bg-card/20 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <div className="flex items-center gap-2 font-mono font-bold text-2xl mb-4">
                <Terminal className="w-6 h-6 text-primary" />
                <span>Master<span className="text-primary">Coding</span></span>
              </div>
              <p className="text-muted-foreground text-lg max-w-sm mb-6">
                Building the next generation of elite software engineers.
              </p>
            </div>
            
            <div className="md:justify-self-end">
              <h4 className="font-bold text-lg mb-6 font-mono">CONNECT</h4>
              <div className="space-y-4">
                <a href="mailto:reynoldmwendia@gmail.com" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                  <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  reynoldmwendia@gmail.com
                </a>
                <a href="https://wa.me/254786282873" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                  <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  0786 282 873
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border/30 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground font-mono">
            <p>© {new Date().getFullYear()} MasterCoding with Reynold. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground">Terms</a>
              <a href="#" className="hover:text-foreground">Privacy</a>
            </div>
          </div>
        </div>
      </footer>

      <EnrollDialog open={enrollOpen} onOpenChange={setEnrollOpen} tier={enrollTier} />
    </div>
  );
}
