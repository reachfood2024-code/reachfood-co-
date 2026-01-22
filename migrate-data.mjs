// Migration script to move data from Render backend to Convex
import { ConvexHttpClient } from "convex/browser";
import { api } from "./convex/_generated/api.js";

const CONVEX_URL = "https://colorful-hippopotamus-267.convex.cloud";
const RENDER_API = "https://reachfood-api-frhk.onrender.com/api/v1";

const client = new ConvexHttpClient(CONVEX_URL);

async function fetchFromRender(endpoint) {
  const res = await fetch(`${RENDER_API}${endpoint}`);
  const data = await res.json();
  return data.data;
}

async function migrateSubscriptions() {
  console.log("Migrating subscriptions...");
  const data = await fetchFromRender("/subscriptions?limit=100");

  for (const sub of data.subscriptions) {
    const result = await client.mutation(api.subscriptions.createWithNumber, {
      subscriptionNumber: sub.id,
      customerName: sub.name,
      customerPhone: sub.phone,
      customerEmail: sub.email,
      planId: sub.plan_id,
      planName: sub.plan_name,
      mealsPerDay: sub.meals_per_day,
      totalMeals: sub.total_meals,
      subscriptionDays: sub.subscription_days,
      priceUsd: sub.price_usd,
      priceSar: sub.price_sar,
      currency: sub.currency,
      status: sub.status,
      adminNotes: sub.admin_notes,
      submittedAt: new Date(sub.submitted_at).getTime(),
    });
    console.log(`  ${result.status}: ${sub.id}`);
  }
  console.log(`Done! Processed ${data.subscriptions.length} subscriptions`);
}

async function migrateOrders() {
  console.log("\nMigrating orders...");
  const data = await fetchFromRender("/orders?limit=100");

  for (const order of data.recentOrders) {
    const result = await client.mutation(api.orders.createWithNumber, {
      orderNumber: order.id,
      customerName: order.customer,
      customerEmail: "migrated@reachfood.co",
      total: order.amount,
      currency: order.currency,
      status: order.status,
      orderedAt: new Date(order.date).getTime(),
      productName: order.product,
    });
    console.log(`  ${result.status}: ${order.id}`);
  }
  console.log(`Done! Processed ${data.recentOrders.length} orders`);
}

async function migrateEmails() {
  console.log("Migrating email subscriptions...");
  const data = await fetchFromRender("/metrics/emails?limit=100");

  for (const email of data.emailSubscriptions) {
    const result = await client.mutation(api.tracking.migrateEmail, {
      email: email.email,
      source: email.source,
      subscribedAt: new Date(email.subscribedAt).getTime(),
      isActive: email.isActive,
    });
    console.log(`  ${result.status}: ${email.email}`);
  }
  console.log(`Done! Processed ${data.emailSubscriptions.length} emails`);
}

async function migrateDailyMetrics() {
  console.log("\nMigrating daily metrics...");
  const data = await fetchFromRender("/metrics/trends?range=365");

  // Combine all trends into daily metrics
  const dailyData = new Map();

  // Process user behavior
  for (const item of data.userBehaviorTrend || []) {
    const date = item.date.split("T")[0];
    if (!dailyData.has(date)) {
      dailyData.set(date, { date, totalSessions: 0, uniqueVisitors: 0, totalPageViews: 0, addToCartEvents: 0, emailSignups: 0, totalOrders: 0, completedOrders: 0, totalRevenue: 0 });
    }
    const d = dailyData.get(date);
    d.totalPageViews = item.pageViews;
    d.uniqueVisitors = item.uniqueVisitors;
    d.totalSessions = item.uniqueVisitors;
  }

  // Process add to cart
  for (const item of data.addToCartTrend || []) {
    const date = item.date.split("T")[0];
    if (!dailyData.has(date)) {
      dailyData.set(date, { date, totalSessions: 0, uniqueVisitors: 0, totalPageViews: 0, addToCartEvents: 0, emailSignups: 0, totalOrders: 0, completedOrders: 0, totalRevenue: 0 });
    }
    dailyData.get(date).addToCartEvents = item.value;
  }

  // Process orders
  for (const item of data.ordersTrend || []) {
    const date = item.date.split("T")[0];
    if (!dailyData.has(date)) {
      dailyData.set(date, { date, totalSessions: 0, uniqueVisitors: 0, totalPageViews: 0, addToCartEvents: 0, emailSignups: 0, totalOrders: 0, completedOrders: 0, totalRevenue: 0 });
    }
    const d = dailyData.get(date);
    d.totalOrders = item.orders;
    d.completedOrders = item.orders;
    d.totalRevenue = item.revenue;
  }

  // Process email signups
  for (const item of data.emailSubmissionsTrend || []) {
    const date = item.date.split("T")[0];
    if (!dailyData.has(date)) {
      dailyData.set(date, { date, totalSessions: 0, uniqueVisitors: 0, totalPageViews: 0, addToCartEvents: 0, emailSignups: 0, totalOrders: 0, completedOrders: 0, totalRevenue: 0 });
    }
    dailyData.get(date).emailSignups = item.value;
  }

  // Insert into Convex
  for (const [date, metrics] of dailyData) {
    const result = await client.mutation(api.metrics.migrateDailyMetrics, metrics);
    console.log(`  ${result.status}: ${date}`);
  }

  console.log(`Done! Processed ${dailyData.size} daily records`);
}

async function main() {
  console.log("Starting data migration to Convex...\n");

  try {
    await migrateEmails();
    await migrateSubscriptions();
    await migrateOrders();
    await migrateDailyMetrics();
    console.log("\n Migration complete!");
  } catch (error) {
    console.error("\n Migration failed:", error);
  }
}

main();
