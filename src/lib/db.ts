import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import Database from "better-sqlite3";
import { hashPassword } from "./password";
import { partners as seedPartners } from "@/data/partners";
import { portfolio as seedPortfolio } from "@/data/portfolio";
import { news as seedNews } from "@/data/news";

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), "data", "app.db");

declare global {
  var __appDb: Database.Database | undefined;
}

// better-sqlite3's busy_timeout only covers waiting for an already-open
// connection's lock; it does not cover the brief window where multiple
// Next.js build workers race to create the file and switch journal modes
// for the first time. Retry those specific operations on top of it.
function withBusyRetry<T>(fn: () => T): T {
  const maxAttempts = 30;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return fn();
    } catch (error) {
      const isBusy = error instanceof Error && /SQLITE_BUSY|database is locked/i.test(error.message);
      if (!isBusy || attempt === maxAttempts) throw error;
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 300);
    }
  }
  throw new Error("unreachable");
}

function createConnection() {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const connection = new Database(DB_PATH);
  // Next.js build/dev spins up several worker processes that open this file
  // concurrently; this must be set before any other statement (including the
  // journal_mode switch below) so contended writes wait instead of throwing.
  connection.pragma("busy_timeout = 10000");
  connection.pragma("journal_mode = WAL");
  return connection;
}

const db = globalThis.__appDb ?? withBusyRetry(createConnection);
globalThis.__appDb = db;

withBusyRetry(() =>
  db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS portfolio_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    gradient TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS partners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    field TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS news_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL DEFAULT '',
    message TEXT NOT NULL,
    forwarded_to_bale INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS merchant_domains (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    domain TEXT NOT NULL,
    merchant_id TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS payment_gateways (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    domain_id INTEGER NOT NULL REFERENCES merchant_domains(id),
    card_number TEXT NOT NULL,
    card_holder_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS gateway_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    gateway_id INTEGER NOT NULL REFERENCES payment_gateways(id),
    authority TEXT NOT NULL UNIQUE,
    amount INTEGER NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    mobile TEXT NOT NULL DEFAULT '',
    callback_url TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    tracking_note TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    decided_at TEXT
  );
`)
);

function seedIfEmpty() {
  const portfolioCount = db.prepare("SELECT COUNT(*) AS c FROM portfolio_items").get() as { c: number };
  if (portfolioCount.c === 0) {
    const insert = db.prepare(
      "INSERT INTO portfolio_items (title, category, description, gradient) VALUES (@title, @category, @description, @gradient)"
    );
    const insertMany = db.transaction((items: typeof seedPortfolio) => {
      for (const item of items) insert.run(item);
    });
    insertMany(seedPortfolio);
  }

  const partnersCount = db.prepare("SELECT COUNT(*) AS c FROM partners").get() as { c: number };
  if (partnersCount.c === 0) {
    const insert = db.prepare("INSERT INTO partners (name, field) VALUES (@name, @field)");
    const insertMany = db.transaction((items: typeof seedPartners) => {
      for (const item of items) insert.run(item);
    });
    insertMany(seedPartners);
  }

  const newsCount = db.prepare("SELECT COUNT(*) AS c FROM news_items").get() as { c: number };
  if (newsCount.c === 0) {
    const insert = db.prepare("INSERT INTO news_items (date, title, excerpt) VALUES (@date, @title, @excerpt)");
    const insertMany = db.transaction((items: typeof seedNews) => {
      for (const item of [...items].reverse()) insert.run(item);
    });
    insertMany(seedNews);
  }
}

withBusyRetry(seedIfEmpty);

// --- Settings ---

export function getSetting(key: string): string | undefined {
  const row = db.prepare("SELECT value FROM settings WHERE key = ?").get(key) as
    | { value: string }
    | undefined;
  return row?.value;
}

export function setSetting(key: string, value: string): void {
  db.prepare(
    "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
  ).run(key, value);
}

export function getSiteLogo(): string | undefined {
  return getSetting("site_logo") || undefined;
}

export function setSiteLogo(dataUrl: string): void {
  setSetting("site_logo", dataUrl);
}

export function clearSiteLogo(): void {
  setSetting("site_logo", "");
}

export type KavenegarConfig = {
  apiKey?: string;
  sender?: string;
  apiKeySource: "settings" | "env" | "none";
};

// A key/sender saved from the admin panel always wins; the KAVENEGAR_API_KEY
// and KAVENEGAR_SENDER env vars are just the initial default for a fresh install.
export function getKavenegarConfig(): KavenegarConfig {
  const dbKey = getSetting("kavenegar_api_key");
  const envKey = process.env.KAVENEGAR_API_KEY;

  return {
    apiKey: dbKey || envKey || undefined,
    sender: getSetting("kavenegar_sender") || process.env.KAVENEGAR_SENDER || undefined,
    apiKeySource: dbKey ? "settings" : envKey ? "env" : "none",
  };
}

export function getOrCreateAdminPasswordHash(): string {
  let hash = getSetting("admin_password_hash");
  if (!hash) {
    const generated = process.env.ADMIN_DEFAULT_PASSWORD || crypto.randomBytes(6).toString("hex");
    hash = hashPassword(generated);
    setSetting("admin_password_hash", hash);
    console.log(
      `\n[admin] رمز عبور اولیه پنل مدیریت ساخته شد: ${generated}\n[admin] لطفاً پس از ورود آن را از بخش تنظیمات تغییر دهید.\n`
    );
  }
  return hash;
}

export function getSessionSecret(): string {
  if (process.env.ADMIN_SESSION_SECRET) return process.env.ADMIN_SESSION_SECRET;
  let secret = getSetting("session_secret");
  if (!secret) {
    secret = crypto.randomBytes(32).toString("hex");
    setSetting("session_secret", secret);
  }
  return secret;
}

// --- Portfolio ---

export type PortfolioRow = {
  id: number;
  title: string;
  category: string;
  description: string;
  gradient: string;
  created_at: string;
};

export function listPortfolio(): PortfolioRow[] {
  return db.prepare("SELECT * FROM portfolio_items ORDER BY id ASC").all() as PortfolioRow[];
}

export function createPortfolioItem(data: Omit<PortfolioRow, "id" | "created_at">): PortfolioRow {
  const result = db
    .prepare(
      "INSERT INTO portfolio_items (title, category, description, gradient) VALUES (@title, @category, @description, @gradient)"
    )
    .run(data);
  return db.prepare("SELECT * FROM portfolio_items WHERE id = ?").get(result.lastInsertRowid) as PortfolioRow;
}

export function updatePortfolioItem(
  id: number,
  data: Omit<PortfolioRow, "id" | "created_at">
): PortfolioRow | undefined {
  db.prepare(
    "UPDATE portfolio_items SET title = @title, category = @category, description = @description, gradient = @gradient WHERE id = @id"
  ).run({ ...data, id });
  return db.prepare("SELECT * FROM portfolio_items WHERE id = ?").get(id) as PortfolioRow | undefined;
}

export function deletePortfolioItem(id: number): void {
  db.prepare("DELETE FROM portfolio_items WHERE id = ?").run(id);
}

// --- Partners ---

export type PartnerRow = {
  id: number;
  name: string;
  field: string;
  created_at: string;
};

export function listPartners(): PartnerRow[] {
  return db.prepare("SELECT * FROM partners ORDER BY id ASC").all() as PartnerRow[];
}

export function createPartner(data: Omit<PartnerRow, "id" | "created_at">): PartnerRow {
  const result = db.prepare("INSERT INTO partners (name, field) VALUES (@name, @field)").run(data);
  return db.prepare("SELECT * FROM partners WHERE id = ?").get(result.lastInsertRowid) as PartnerRow;
}

export function updatePartner(id: number, data: Omit<PartnerRow, "id" | "created_at">): PartnerRow | undefined {
  db.prepare("UPDATE partners SET name = @name, field = @field WHERE id = @id").run({ ...data, id });
  return db.prepare("SELECT * FROM partners WHERE id = ?").get(id) as PartnerRow | undefined;
}

export function deletePartner(id: number): void {
  db.prepare("DELETE FROM partners WHERE id = ?").run(id);
}

// --- News ---

export type NewsRow = {
  id: number;
  date: string;
  title: string;
  excerpt: string;
  created_at: string;
};

export function listNews(limit?: number): NewsRow[] {
  const query = "SELECT * FROM news_items ORDER BY id DESC" + (limit ? " LIMIT ?" : "");
  return (limit ? db.prepare(query).all(limit) : db.prepare(query).all()) as NewsRow[];
}

export function createNewsItem(data: Omit<NewsRow, "id" | "created_at">): NewsRow {
  const result = db
    .prepare("INSERT INTO news_items (date, title, excerpt) VALUES (@date, @title, @excerpt)")
    .run(data);
  return db.prepare("SELECT * FROM news_items WHERE id = ?").get(result.lastInsertRowid) as NewsRow;
}

export function updateNewsItem(id: number, data: Omit<NewsRow, "id" | "created_at">): NewsRow | undefined {
  db.prepare("UPDATE news_items SET date = @date, title = @title, excerpt = @excerpt WHERE id = @id").run({
    ...data,
    id,
  });
  return db.prepare("SELECT * FROM news_items WHERE id = ?").get(id) as NewsRow | undefined;
}

export function deleteNewsItem(id: number): void {
  db.prepare("DELETE FROM news_items WHERE id = ?").run(id);
}

// --- Newsletter subscribers ---

export type SubscriberRow = {
  id: number;
  phone: string;
  created_at: string;
};

export function listSubscribers(): SubscriberRow[] {
  return db.prepare("SELECT * FROM newsletter_subscribers ORDER BY id DESC").all() as SubscriberRow[];
}

export function countSubscribers(): number {
  const row = db.prepare("SELECT COUNT(*) AS c FROM newsletter_subscribers").get() as { c: number };
  return row.c;
}

export function createSubscriber(phone: string): { ok: true; row: SubscriberRow } | { ok: false; reason: "duplicate" } {
  try {
    const result = db.prepare("INSERT INTO newsletter_subscribers (phone) VALUES (?)").run(phone);
    const row = db
      .prepare("SELECT * FROM newsletter_subscribers WHERE id = ?")
      .get(result.lastInsertRowid) as SubscriberRow;
    return { ok: true, row };
  } catch {
    return { ok: false, reason: "duplicate" };
  }
}

export function deleteSubscriber(id: number): void {
  db.prepare("DELETE FROM newsletter_subscribers WHERE id = ?").run(id);
}

// --- Contact messages ---

export type ContactMessageRow = {
  id: number;
  name: string;
  phone: string;
  email: string;
  message: string;
  forwarded_to_bale: number;
  created_at: string;
};

export function listMessages(): ContactMessageRow[] {
  return db.prepare("SELECT * FROM contact_messages ORDER BY id DESC").all() as ContactMessageRow[];
}

export function createMessage(
  data: Pick<ContactMessageRow, "name" | "phone" | "email" | "message">
): ContactMessageRow {
  const result = db
    .prepare("INSERT INTO contact_messages (name, phone, email, message) VALUES (@name, @phone, @email, @message)")
    .run(data);
  return db.prepare("SELECT * FROM contact_messages WHERE id = ?").get(result.lastInsertRowid) as ContactMessageRow;
}

export function markMessageForwarded(id: number): void {
  db.prepare("UPDATE contact_messages SET forwarded_to_bale = 1 WHERE id = ?").run(id);
}

export function deleteMessage(id: number): void {
  db.prepare("DELETE FROM contact_messages WHERE id = ?").run(id);
}

// --- Merchant domains ---

export type MerchantDomainRow = {
  id: number;
  name: string;
  domain: string;
  merchant_id: string;
  status: "active" | "inactive";
  created_at: string;
};

export function listDomains(): MerchantDomainRow[] {
  return db.prepare("SELECT * FROM merchant_domains ORDER BY id DESC").all() as MerchantDomainRow[];
}

export function getDomainByMerchantId(merchantId: string): MerchantDomainRow | undefined {
  return db.prepare("SELECT * FROM merchant_domains WHERE merchant_id = ?").get(merchantId) as
    | MerchantDomainRow
    | undefined;
}

export function createDomain(data: { name: string; domain: string }): MerchantDomainRow {
  const merchantId = crypto.randomUUID();
  const result = db
    .prepare("INSERT INTO merchant_domains (name, domain, merchant_id) VALUES (@name, @domain, @merchant_id)")
    .run({ ...data, merchant_id: merchantId });
  return db.prepare("SELECT * FROM merchant_domains WHERE id = ?").get(result.lastInsertRowid) as MerchantDomainRow;
}

export function updateDomain(
  id: number,
  data: { name: string; domain: string; status: "active" | "inactive" }
): MerchantDomainRow | undefined {
  db.prepare("UPDATE merchant_domains SET name = @name, domain = @domain, status = @status WHERE id = @id").run({
    ...data,
    id,
  });
  return db.prepare("SELECT * FROM merchant_domains WHERE id = ?").get(id) as MerchantDomainRow | undefined;
}

export function deleteDomain(id: number): void {
  db.prepare("DELETE FROM merchant_domains WHERE id = ?").run(id);
}

// --- Payment gateways ---

export type PaymentGatewayRow = {
  id: number;
  domain_id: number;
  card_number: string;
  card_holder_name: string;
  status: "active" | "inactive";
  created_at: string;
};

export type PaymentGatewayWithDomainRow = PaymentGatewayRow & {
  domain_name: string;
  domain: string;
  merchant_id: string;
};

const gatewayWithDomainQuery = `
  SELECT g.*, d.name AS domain_name, d.domain AS domain, d.merchant_id AS merchant_id
  FROM payment_gateways g
  JOIN merchant_domains d ON d.id = g.domain_id
`;

export function listGateways(): PaymentGatewayWithDomainRow[] {
  return db.prepare(`${gatewayWithDomainQuery} ORDER BY g.id DESC`).all() as PaymentGatewayWithDomainRow[];
}

export function getActiveGatewayByMerchantId(merchantId: string): PaymentGatewayWithDomainRow | undefined {
  return db
    .prepare(`${gatewayWithDomainQuery} WHERE d.merchant_id = ? AND g.status = 'active' AND d.status = 'active'`)
    .get(merchantId) as PaymentGatewayWithDomainRow | undefined;
}

export function createGateway(data: {
  domain_id: number;
  card_number: string;
  card_holder_name: string;
}): PaymentGatewayRow {
  const result = db
    .prepare(
      "INSERT INTO payment_gateways (domain_id, card_number, card_holder_name) VALUES (@domain_id, @card_number, @card_holder_name)"
    )
    .run(data);
  return db.prepare("SELECT * FROM payment_gateways WHERE id = ?").get(result.lastInsertRowid) as PaymentGatewayRow;
}

export function updateGateway(
  id: number,
  data: { domain_id: number; card_number: string; card_holder_name: string; status: "active" | "inactive" }
): PaymentGatewayRow | undefined {
  db.prepare(
    "UPDATE payment_gateways SET domain_id = @domain_id, card_number = @card_number, card_holder_name = @card_holder_name, status = @status WHERE id = @id"
  ).run({ ...data, id });
  return db.prepare("SELECT * FROM payment_gateways WHERE id = ?").get(id) as PaymentGatewayRow | undefined;
}

export function deleteGateway(id: number): void {
  db.prepare("DELETE FROM payment_gateways WHERE id = ?").run(id);
}

// --- Gateway transactions ---

export type TransactionStatus = "pending" | "confirmed" | "rejected";

export type GatewayTransactionRow = {
  id: number;
  gateway_id: number;
  authority: string;
  amount: number;
  description: string;
  mobile: string;
  callback_url: string;
  status: TransactionStatus;
  tracking_note: string;
  created_at: string;
  decided_at: string | null;
};

export type TransactionWithGatewayRow = GatewayTransactionRow & {
  card_number: string;
  card_holder_name: string;
  domain_name: string;
  merchant_id: string;
};

const transactionWithGatewayQuery = `
  SELECT t.*, g.card_number AS card_number, g.card_holder_name AS card_holder_name,
         d.name AS domain_name, d.merchant_id AS merchant_id
  FROM gateway_transactions t
  JOIN payment_gateways g ON g.id = t.gateway_id
  JOIN merchant_domains d ON d.id = g.domain_id
`;

export function listTransactions(): TransactionWithGatewayRow[] {
  return db.prepare(`${transactionWithGatewayQuery} ORDER BY t.id DESC`).all() as TransactionWithGatewayRow[];
}

export function getTransactionByAuthority(authority: string): TransactionWithGatewayRow | undefined {
  return db.prepare(`${transactionWithGatewayQuery} WHERE t.authority = ?`).get(authority) as
    | TransactionWithGatewayRow
    | undefined;
}

export function createTransaction(data: {
  gateway_id: number;
  amount: number;
  description: string;
  mobile: string;
  callback_url: string;
}): GatewayTransactionRow {
  const authority = crypto.randomUUID();
  const result = db
    .prepare(
      "INSERT INTO gateway_transactions (gateway_id, authority, amount, description, mobile, callback_url) VALUES (@gateway_id, @authority, @amount, @description, @mobile, @callback_url)"
    )
    .run({ ...data, authority });
  return db.prepare("SELECT * FROM gateway_transactions WHERE id = ?").get(result.lastInsertRowid) as GatewayTransactionRow;
}

export function setTransactionTrackingNote(authority: string, trackingNote: string): void {
  db.prepare("UPDATE gateway_transactions SET tracking_note = ? WHERE authority = ? AND status = 'pending'").run(
    trackingNote,
    authority
  );
}

export function decideTransaction(
  id: number,
  status: "confirmed" | "rejected"
): TransactionWithGatewayRow | undefined {
  db.prepare(
    "UPDATE gateway_transactions SET status = @status, decided_at = datetime('now') WHERE id = @id AND status = 'pending'"
  ).run({ id, status });
  return db.prepare(`${transactionWithGatewayQuery} WHERE t.id = ?`).get(id) as TransactionWithGatewayRow | undefined;
}
