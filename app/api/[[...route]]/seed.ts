import { Hono } from "hono";
import { exec } from "child_process";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { config } from "dotenv";
import { subDays } from "date-fns";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { categories, accounts, transactions } from "@/db/schema";
import { eachDayOfInterval, format } from 'date-fns';
import { convertAmountToMiliunits } from "@/lib/utils";
import { db } from "@/db/drizzle";


const app = new Hono();


app.get("/", clerkMiddleware(), 
  async (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const SEED_USER_ID = auth.userId;
    const SEED_CATEGORIES = [
      { id: "category_1", name: "食物", userId: SEED_USER_ID, plaidId: null },
      { id: "category_2", name: "租金", userId: SEED_USER_ID, plaidId: null },
      { id: "category_3", name: "公用", userId: SEED_USER_ID, plaidId: null },
    ];
    const SEED_ACCOUNTS = [
      { id: "account_1",name: "信用卡", userId: SEED_USER_ID, plaidId: null },
      { id: "account_2", name: "储蓄", userId: SEED_USER_ID, plaidId: null },
    ];
    const defaultTo = new Date();
    const defaultFrom = subDays(defaultTo, 90);

    const SEED_TRANSACTIONS: typeof transactions.$inferSelect[] = [];
    const generateRandomAmount = (category: typeof categories.$inferInsert) => {
      switch (category.name) {
        case "租金":
          return Math.random() * 400 + 90; // Rent will likely be a larger amount
        case "公用":
          return Math.random() * 200 + 50;
        case "食物":
          return Math.random() * 30 + 10;
        case "运输":
        case "健康":
          return Math.random() * 50 + 15;
        case "娱乐":
        case "服装":
        case "Miscellaneous":
          return Math.random() * 100 + 20;
        default:
          return Math.random() * 50 + 10;
      }
    };
    const generateTransactionsForDay = (day: Date) => {
      const numTransactions = Math.floor(Math.random() * 4) + 1; // 1 to 4 transactions per day
      for (let i = 0; i < numTransactions; i++) {
        const category = SEED_CATEGORIES[Math.floor(Math.random() * SEED_CATEGORIES.length)];
        const isExpense = Math.random() > 0.6; // 60% chance of being an expense
        const amount = generateRandomAmount(category);
        const formattedAmount = convertAmountToMiliunits(isExpense ? -amount : amount); // Negative for expenses
    
        SEED_TRANSACTIONS.push({
          id: `transaction_${format(day, "yyyy-MM-dd")}_${i}`,
          accountId: SEED_ACCOUNTS[0].id, // Assuming always using the first account for simplicity
          categoryId: category.id,
          date: day,
          amount: formattedAmount,
          payee: "Merchant",
          notes: "Random transaction",
        });
      }
    };
    const generateTransactions = () => {
      const days = eachDayOfInterval({ start: defaultFrom, end: defaultTo });
      days.forEach(day => generateTransactionsForDay(day));
    };
    generateTransactions();

    // Reset database
    await db.delete(transactions).execute();
    await db.delete(accounts).execute();
    await db.delete(categories).execute();
    // Seed categories
    await db.insert(categories).values(SEED_CATEGORIES).execute();
    // Seed accounts
    await db.insert(accounts).values(SEED_ACCOUNTS).execute();
    // Seed transactions
    await db.insert(transactions).values(SEED_TRANSACTIONS).execute();
    return c.json({ message: "执行成功" });

  });

export default app;