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

function createConnection() {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const connection = new Database(DB_PATH);
  connection.pragma("journal_mode = WAL");
  // Next.js build/dev spins up several worker processes that open this
  // file concurrently; wait for the writer lock instead of throwing.
  connection.pragma("busy_timeout = 5000");
  return connection;
}

const db = globalThis.__appDb ?? createConnection();
globalThis.__appDb = db;

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
`);

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

seedIfEmpty();

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
