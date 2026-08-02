"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";

export default function CreateProposalPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    // Simulate API delay for prototype
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-50 font-sans pb-12">
      {/* Navbar (Simplified for sub-pages) */}
      <nav className="flex items-center p-4 max-w-7xl mx-auto border-b border-white/5 bg-black/50 sticky top-0 z-50 backdrop-blur-md">
        <Link href="/dashboard" className="flex items-center text-zinc-400 hover:text-purple-400 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>
      </nav>

      <main className="p-6 max-w-3xl mx-auto mt-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="bg-zinc-900/40 border-zinc-800/50 backdrop-blur-xl shadow-2xl">
            <CardHeader className="border-b border-zinc-800/50 pb-6">
              <CardTitle className="text-2xl font-serif text-white">Create New Proposal</CardTitle>
              <CardDescription className="text-zinc-400">
                Submit a spending request for the multi-sig treasury. This will require member approvals before execution.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-zinc-300">Proposal Title</Label>
                  <Input id="title" placeholder="e.g. Monthly Server Hosting" required className="bg-zinc-950 border-zinc-800 focus-visible:ring-purple-500/50 text-zinc-100" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-zinc-300">Description / Justification</Label>
                  <Textarea id="description" placeholder="Provide context for this spending request..." required className="min-h-[120px] bg-zinc-950 border-zinc-800 focus-visible:ring-purple-500/50 text-zinc-100" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-zinc-300">Amount</Label>
                    <Input id="amount" type="number" step="0.01" min="0" placeholder="0.00" required className="bg-zinc-950 border-zinc-800 focus-visible:ring-purple-500/50 text-zinc-100 font-mono" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-zinc-300">Asset</Label>
                    <Select defaultValue="USDC">
                      <SelectTrigger className="bg-zinc-950 border-zinc-800 focus:ring-purple-500/50 text-zinc-100">
                        <SelectValue placeholder="Select asset" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                        <SelectItem value="USDC">USDC (Stellar)</SelectItem>
                        <SelectItem value="XLM">XLM (Lumens)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recipient" className="text-zinc-300">Recipient Stellar Address</Label>
                  <Input id="recipient" placeholder="G..." required pattern="^G[A-Z0-9]{55}$" className="bg-zinc-950 border-zinc-800 focus-visible:ring-purple-500/50 text-zinc-100 font-mono" />
                  <p className="text-xs text-zinc-500">Must be a valid Stellar public key (starts with G, 56 characters long).</p>
                </div>

              </form>
            </CardContent>
            <CardFooter className="bg-zinc-900/20 border-t border-zinc-800/50 pt-6 flex justify-end gap-4">
              <Button type="button" variant="ghost" onClick={() => router.push("/dashboard")} className="text-zinc-400 hover:text-white hover:bg-zinc-800">
                Cancel
              </Button>
              <Button type="button" onClick={() => handleSubmit()} disabled={isSubmitting} className="bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)] gap-2">
                {isSubmitting ? "Submitting..." : (
                  <>
                    <Send className="w-4 h-4" /> Propose Transaction
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
