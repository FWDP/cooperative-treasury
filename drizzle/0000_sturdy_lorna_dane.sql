CREATE TABLE `audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`proposal_id` text NOT NULL,
	`user_id` text NOT NULL,
	`action` text NOT NULL,
	`tx_hash` text,
	`timestamp` integer NOT NULL,
	FOREIGN KEY (`proposal_id`) REFERENCES `proposals`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `proposals` (
	`id` text PRIMARY KEY NOT NULL,
	`treasury_id` text NOT NULL,
	`creator_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`amount` real NOT NULL,
	`currency` text DEFAULT 'XLM' NOT NULL,
	`recipient_address` text NOT NULL,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`required_approvals` integer DEFAULT 1 NOT NULL,
	`created_at` integer NOT NULL,
	`executed_at` integer,
	FOREIGN KEY (`treasury_id`) REFERENCES `treasuries`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`creator_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `treasuries` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`contract_address` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `treasuries_contract_address_unique` ON `treasuries` (`contract_address`);--> statement-breakpoint
CREATE TABLE `treasury_members` (
	`treasury_id` text NOT NULL,
	`user_id` text NOT NULL,
	`roles` text NOT NULL,
	`joined_at` integer NOT NULL,
	FOREIGN KEY (`treasury_id`) REFERENCES `treasuries`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`stellar_address` text NOT NULL,
	`name` text,
	`avatar_url` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_stellar_address_unique` ON `users` (`stellar_address`);