"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, Shield, PieChart, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-50 selection:bg-purple-500/30 overflow-hidden relative font-sans">
      {/* Background Glow Effects - purple accents on black */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-900/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            CT
          </div>
          <span className="font-semibold text-xl tracking-tight text-zinc-100">Cooperative Treasury</span>
        </div>
        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#" className="hover:text-purple-400 transition-colors">Governance</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Treasury</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Community</a>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-500 text-white border-0 shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all">
            Connect Wallet
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center px-4 pt-32 pb-24 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/30 border border-purple-500/20 text-purple-300 text-sm mb-8 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            Stellar Testnet Live
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-extrabold tracking-tight mb-6 text-white drop-shadow-sm">
            Decentralized Governance <br className="hidden md:block" /> for Cooperatives.
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            A smart-contract-powered treasury requiring multiple approvals. Secure, transparent, and community-driven fund management.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-500 text-white rounded-full px-8 h-12 text-base font-semibold shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all border-0">
              Enter App <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base font-semibold border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:bg-zinc-800 hover:text-white backdrop-blur-sm transition-all">
              Read Docs
            </Button>
          </div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-32"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          {[
            {
              title: "Multi-Sig Security",
              description: "Require multiple member approvals before any funds are released, ensuring democratic control.",
              icon: Shield
            },
            {
              title: "Transparent Allocation",
              description: "Track every spending proposal and treasury balance with immutable ledger transparency.",
              icon: PieChart
            },
            {
              title: "Community Driven",
              description: "Empower NGOs, student organizations, and cooperatives to manage shared resources safely.",
              icon: Users
            }
          ].map((feature, i) => (
            <Card key={i} className="bg-zinc-900/40 border-zinc-800/50 backdrop-blur-xl hover:bg-zinc-900/80 hover:border-purple-500/30 transition-all duration-300 group text-left shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-zinc-800/50 flex items-center justify-center mb-4 border border-zinc-700/50 group-hover:bg-purple-950/30 group-hover:border-purple-500/30 transition-colors">
                  <feature.icon className="w-6 h-6 text-zinc-400 group-hover:text-purple-400" />
                </div>
                <CardTitle className="text-xl text-zinc-100">{feature.title}</CardTitle>
                <CardDescription className="text-zinc-400 text-base mt-2">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
