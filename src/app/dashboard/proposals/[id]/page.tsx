"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Copy, FileText, Send } from "lucide-react";
import Link from "next/link";

export default function ProposalDetailsPage() {
  const params = useParams();
  const router = useRouter();
  
  // Mock Data for prototype
  const [hasApproved, setHasApproved] = useState(false);
  const proposalId = params.id as string;
  const proposal = {
    id: proposalId || "P-104",
    title: "Monthly Server Hosting",
    description: "This proposal requests funds to cover our AWS and Vercel hosting costs for the upcoming month. The infrastructure supports our cooperative governance portal.",
    amount: 150.00,
    currency: "USDC",
    recipientAddress: "GBX...7L9M",
    creator: "Alice (Treasurer)",
    createdAt: "Oct 24, 2023",
    status: hasApproved ? "Approved" : "Pending Approval",
    approvalsCount: hasApproved ? 1 : 0,
    requiredApprovals: 1
  };

  const handleApprove = () => {
    setHasApproved(true);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-50 font-sans pb-12">
      {/* Navbar */}
      <nav className="flex items-center p-4 max-w-7xl mx-auto border-b border-white/5 bg-black/50 sticky top-0 z-50 backdrop-blur-md">
        <Link href="/dashboard" className="flex items-center text-zinc-400 hover:text-purple-400 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>
      </nav>

      <main className="p-6 max-w-5xl mx-auto mt-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Proposal Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-zinc-900/40 border-zinc-800/50 backdrop-blur-xl shadow-2xl h-full">
                <CardHeader className="border-b border-zinc-800/50 pb-6">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="outline" className={`
                      ${proposal.status === "Pending Approval" ? "border-yellow-500/50 text-yellow-500 bg-yellow-500/10" : ""}
                      ${proposal.status === "Approved" ? "border-green-500/50 text-green-500 bg-green-500/10" : ""}
                    `}>
                      {proposal.status}
                    </Badge>
                    <span className="font-mono text-zinc-500 text-sm">{proposal.id}</span>
                  </div>
                  <CardTitle className="text-3xl font-serif text-white leading-tight">{proposal.title}</CardTitle>
                  <CardDescription className="text-zinc-400 mt-2 text-base">
                    Proposed by <span className="text-zinc-200">{proposal.creator}</span> on {proposal.createdAt}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-2">Description</h3>
                    <p className="text-zinc-300 leading-relaxed bg-zinc-950/50 p-4 rounded-lg border border-zinc-800/50">
                      {proposal.description}
                    </p>
                  </div>
                  
                  <Separator className="bg-zinc-800" />
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-1">Amount</h3>
                      <p className="text-2xl font-mono text-white">{proposal.amount.toFixed(2)} <span className="text-lg text-purple-400">{proposal.currency}</span></p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-1">Recipient</h3>
                      <div className="flex items-center gap-2">
                        <p className="text-base font-mono text-zinc-200 bg-zinc-800/50 px-2 py-1 rounded border border-zinc-700">{proposal.recipientAddress}</p>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800">
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar: Approval Status & Actions */}
            <div className="space-y-6">
              <Card className="bg-zinc-900/40 border-zinc-800/50 backdrop-blur-xl shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-zinc-100">Approval Status</CardTitle>
                  <CardDescription className="text-zinc-400">Multi-sig requirements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-zinc-300">Approvals</span>
                      <span className="text-white font-mono">{proposal.approvalsCount} / {proposal.requiredApprovals}</span>
                    </div>
                    <Progress value={(proposal.approvalsCount / proposal.requiredApprovals) * 100} className="h-2 bg-zinc-800 [&>div]:bg-purple-500" />
                  </div>
                  
                  <Separator className="bg-zinc-800" />
                  
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Signatures</h3>
                    {hasApproved ? (
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-green-500/50 bg-green-500/10">
                          <CheckCircle2 className="w-5 h-5 text-green-500 m-auto" />
                        </Avatar>
                        <span className="text-sm text-zinc-200">You (Signed)</span>
                      </div>
                    ) : (
                      <p className="text-sm text-zinc-500 italic">Waiting for signatures...</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="bg-zinc-900/20 border-t border-zinc-800/50 pt-6">
                  {!hasApproved ? (
                    <Button onClick={handleApprove} className="w-full bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)] gap-2">
                      <FileText className="w-4 h-4" /> Sign & Approve
                    </Button>
                  ) : (
                    <Button disabled className="w-full bg-green-600/20 text-green-500 border border-green-500/50 gap-2 opacity-100">
                      <CheckCircle2 className="w-4 h-4" /> Ready to Execute
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </div>

          </div>
        </motion.div>
      </main>
    </div>
  );
}
