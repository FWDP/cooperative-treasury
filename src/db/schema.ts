import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(), // We'll use the Stellar wallet address or UUID
  stellarAddress: text("stellar_address").notNull().unique(),
  name: text("name"),
  avatarUrl: text("avatar_url"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const treasuries = sqliteTable("treasuries", {
  id: text("id").primaryKey(), // UUID
  name: text("name").notNull(),
  description: text("description"),
  contractAddress: text("contract_address").notNull().unique(), // The Soroban contract address
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const treasuryMembers = sqliteTable("treasury_members", {
  treasuryId: text("treasury_id").notNull().references(() => treasuries.id),
  userId: text("user_id").notNull().references(() => users.id),
  roles: text("roles", { mode: "json" }).$type<string[]>().notNull().$defaultFn(() => ["VIEWER"]),
  joinedAt: integer("joined_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const proposals = sqliteTable("proposals", {
  id: text("id").primaryKey(), // UUID
  treasuryId: text("treasury_id").notNull().references(() => treasuries.id),
  creatorId: text("creator_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  amount: real("amount").notNull(),
  currency: text("currency").notNull().default("XLM"),
  recipientAddress: text("recipient_address").notNull(),
  status: text("status", { enum: ["PENDING", "APPROVED", "EXECUTED", "REJECTED"] }).notNull().default("PENDING"),
  requiredApprovals: integer("required_approvals").notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  executedAt: integer("executed_at", { mode: "timestamp" }),
});

export const auditLogs = sqliteTable("audit_logs", {
  id: text("id").primaryKey(), // UUID
  proposalId: text("proposal_id").notNull().references(() => proposals.id),
  userId: text("user_id").notNull().references(() => users.id), // The user who performed the action
  action: text("action", { enum: ["CREATED", "APPROVED", "EXECUTED", "REJECTED", "REVOKED"] }).notNull(),
  txHash: text("tx_hash"), // If this action involved an on-chain transaction
  timestamp: integer("timestamp", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});
