"use client";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowUpRight, DollarSign, Activity, FileText, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWalletStore } from "@/lib/store";

const activeProposals = [
  { id: "P-104", title: "Monthly Server Hosting", amount: 150, currency: "USDC", status: "Pending Approval", approvals: 0 },
  { id: "P-103", title: "Community Event Sponsorship", amount: 500, currency: "XLM", status: "Approved", approvals: 1 },
  { id: "P-102", title: "Design Assets", amount: 75, currency: "USDC", status: "Executed", approvals: 1 },
];

const members = [
  { name: "Alice (Treasurer)", role: "treasurer", address: "GBAX...9T2Q" },
  { name: "Bob (Member)", role: "member", address: "GDCF...4P1M" },
  { name: "Charlie (Member)", role: "member", address: "GXYA...7L8N" },
];

export default function Dashboard() {
  const { address, balance, fetchBalance, disconnectWallet, isFetchingBalance } = useWalletStore();
  const router = useRouter();

  useEffect(() => {
    if (address) {
      fetchBalance();
    }
  }, [address, fetchBalance]);

  const handleDisconnect = () => {
    disconnectWallet();
    router.push("/");
  };

  const displayAddress = address 
    ? `${address.substring(0, 4)}...${address.substring(address.length - 4)}`
    : "Not Connected";

  return (
    <div className="min-h-screen bg-black text-zinc-50 selection:bg-purple-500/30 font-sans pb-12">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-4 max-w-7xl mx-auto border-b border-white/5 bg-black/50 sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center font-bold text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]">
            CT
          </div>
          <span className="font-semibold text-lg text-zinc-100">Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-zinc-400 hidden sm:block">
            Connected: <span className="text-purple-400 font-mono">{displayAddress}</span>
          </div>
          <Button onClick={handleDisconnect} variant="outline" className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300">
            Disconnect
          </Button>
        </div>
      </nav>

      <main className="p-6 max-w-7xl mx-auto space-y-8 mt-4">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-white tracking-tight">FWDP Cooperative</h1>
            <p className="text-zinc-400 mt-1">Manage treasury funds, proposals, and approvals.</p>
          </div>
          <Link href="/dashboard/create-proposal">
            <Button className="bg-purple-600 hover:bg-purple-500 text-white border-0 shadow-[0_0_15px_rgba(147,51,234,0.3)] gap-2">
              <FileText className="w-4 h-4" /> Create Proposal
            </Button>
          </Link>
        </div>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-zinc-900/40 border-zinc-800/50 backdrop-blur-xl shadow-lg hover:border-purple-500/30 transition-colors h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">Total USDC Balance</CardTitle>
                <DollarSign className="w-4 h-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">4,250.00</div>
                <p className="text-xs text-zinc-500 mt-1">+12.5% from last month</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-zinc-900/40 border-zinc-800/50 backdrop-blur-xl shadow-lg hover:border-purple-500/30 transition-colors h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">Total XLM Balance</CardTitle>
                <Activity className="w-4 h-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                {isFetchingBalance ? (
                  <div className="h-9 w-32 bg-zinc-800/80 rounded animate-pulse my-1"></div>
                ) : (
                  <div className="text-3xl font-bold text-white">{balance ? parseFloat(balance).toFixed(2) : "0.00"}</div>
                )}
                <p className="text-xs text-zinc-500 mt-1">Live Testnet Balance</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-zinc-900/40 border-zinc-800/50 backdrop-blur-xl shadow-lg hover:border-purple-500/30 transition-colors h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">Approvals Required</CardTitle>
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">1 <span className="text-lg text-zinc-500 font-normal">of 3 members</span></div>
                <p className="text-xs text-zinc-500 mt-1">Multi-sig threshold active</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Proposals */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2">
            <Card className="bg-zinc-900/40 border-zinc-800/50 backdrop-blur-xl shadow-lg h-full">
              <CardHeader>
                <CardTitle className="text-xl text-zinc-100">Recent Proposals</CardTitle>
                <CardDescription className="text-zinc-400">A list of recent spending requests.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader className="border-b border-zinc-800">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-zinc-500">ID</TableHead>
                      <TableHead className="text-zinc-500">Title</TableHead>
                      <TableHead className="text-zinc-500">Amount</TableHead>
                      <TableHead className="text-zinc-500">Status</TableHead>
                      <TableHead className="text-right text-zinc-500">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeProposals.map((proposal) => (
                      <TableRow key={proposal.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20">
                        <TableCell className="font-mono text-zinc-400">{proposal.id}</TableCell>
                        <TableCell className="font-medium text-zinc-200">{proposal.title}</TableCell>
                        <TableCell className="text-zinc-300">{proposal.amount.toFixed(2)} {proposal.currency}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`
                            ${proposal.status === "Pending Approval" ? "border-yellow-500/50 text-yellow-500 bg-yellow-500/10" : ""}
                            ${proposal.status === "Approved" ? "border-green-500/50 text-green-500 bg-green-500/10" : ""}
                            ${proposal.status === "Executed" ? "border-purple-500/50 text-purple-400 bg-purple-500/10" : ""}
                          `}>
                            {proposal.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/dashboard/proposals/${proposal.id}`}>
                            <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20">
                              View <ArrowUpRight className="ml-1 w-3 h-3" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>

          {/* Members Sidebar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className="bg-zinc-900/40 border-zinc-800/50 backdrop-blur-xl shadow-lg h-full">
              <CardHeader>
                <CardTitle className="text-xl text-zinc-100">Treasury Signers</CardTitle>
                <CardDescription className="text-zinc-400">Authorized members</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {members.map((member, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Avatar className="h-10 w-10 border border-zinc-800 bg-zinc-900">
                      <AvatarFallback className="bg-purple-900/50 text-purple-300">{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-zinc-200">{member.name}</span>
                      <span className="text-xs font-mono text-zinc-500">{member.address}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
