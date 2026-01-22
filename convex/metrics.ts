import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Migration helper: Import daily metrics
export const migrateDailyMetrics = mutation({
  args: {
    date: v.string(),
    totalSessions: v.number(),
    uniqueVisitors: v.number(),
    totalPageViews: v.number(),
    addToCartEvents: v.number(),
    emailSignups: v.number(),
    totalOrders: v.number(),
    completedOrders: v.number(),
    totalRevenue: v.number(),
  },
  handler: async (ctx, args) => {
    // Check if already exists
    const existing = await ctx.db
      .query("dailyMetrics")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .first();

    if (existing) {
      // Update existing record
      await ctx.db.patch(existing._id, {
        totalSessions: args.totalSessions,
        uniqueVisitors: args.uniqueVisitors,
        totalPageViews: args.totalPageViews,
        addToCartEvents: args.addToCartEvents,
        emailSignups: args.emailSignups,
        totalOrders: args.totalOrders,
        completedOrders: args.completedOrders,
        totalRevenue: args.totalRevenue,
      });
      return { status: "updated" };
    }

    await ctx.db.insert("dailyMetrics", {
      date: args.date,
      totalSessions: args.totalSessions,
      uniqueVisitors: args.uniqueVisitors,
      totalPageViews: args.totalPageViews,
      addToCartEvents: args.addToCartEvents,
      emailSignups: args.emailSignups,
      totalOrders: args.totalOrders,
      completedOrders: args.completedOrders,
      totalRevenue: args.totalRevenue,
    });

    return { status: "migrated" };
  },
});

// Helper: Get timestamp for N days ago
function daysAgo(days: number): number {
  return Date.now() - days * 24 * 60 * 60 * 1000;
}

// Helper: Format date as YYYY-MM-DD
function formatDate(timestamp: number): string {
  return new Date(timestamp).toISOString().split("T")[0];
}

// Dashboard KPIs
export const summary = query({
  args: {
    range: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const days = args.range || 30;
    const currentStart = daysAgo(days);
    const previousStart = daysAgo(days * 2);

    // Current period - Sessions
    const currentSessions = await ctx.db
      .query("sessions")
      .filter((q) => q.gte(q.field("startedAt"), currentStart))
      .collect();

    // Previous period - Sessions
    const previousSessions = await ctx.db
      .query("sessions")
      .filter((q) =>
        q.and(
          q.gte(q.field("startedAt"), previousStart),
          q.lt(q.field("startedAt"), currentStart)
        )
      )
      .collect();

    // Current period - Cart events
    const currentCartEvents = await ctx.db
      .query("cartEvents")
      .filter((q) =>
        q.and(
          q.eq(q.field("eventType"), "add"),
          q.gte(q.field("_creationTime"), currentStart)
        )
      )
      .collect();

    const previousCartEvents = await ctx.db
      .query("cartEvents")
      .filter((q) =>
        q.and(
          q.eq(q.field("eventType"), "add"),
          q.gte(q.field("_creationTime"), previousStart),
          q.lt(q.field("_creationTime"), currentStart)
        )
      )
      .collect();

    // Email subscriptions
    const currentEmails = await ctx.db
      .query("emailSubscriptions")
      .filter((q) => q.gte(q.field("subscribedAt"), currentStart))
      .collect();

    const previousEmails = await ctx.db
      .query("emailSubscriptions")
      .filter((q) =>
        q.and(
          q.gte(q.field("subscribedAt"), previousStart),
          q.lt(q.field("subscribedAt"), currentStart)
        )
      )
      .collect();

    // Orders
    const currentOrders = await ctx.db
      .query("orders")
      .filter((q) =>
        q.and(
          q.gte(q.field("orderedAt"), currentStart),
          q.neq(q.field("status"), "cancelled"),
          q.neq(q.field("status"), "refunded")
        )
      )
      .collect();

    const previousOrders = await ctx.db
      .query("orders")
      .filter((q) =>
        q.and(
          q.gte(q.field("orderedAt"), previousStart),
          q.lt(q.field("orderedAt"), currentStart),
          q.neq(q.field("status"), "cancelled"),
          q.neq(q.field("status"), "refunded")
        )
      )
      .collect();

    // Calculate metrics
    const currentUniqueVisitors = new Set(currentSessions.map((s) => s.visitorId)).size;
    const previousUniqueVisitors = new Set(previousSessions.map((s) => s.visitorId)).size;

    const currentRevenue = currentOrders.reduce((sum, o) => sum + o.total, 0);
    const previousRevenue = previousOrders.reduce((sum, o) => sum + o.total, 0);

    const calcChange = (curr: number, prev: number): number => {
      if (prev === 0) return curr > 0 ? 100 : 0;
      return Number((((curr - prev) / prev) * 100).toFixed(1));
    };

    const conversionRate =
      currentUniqueVisitors > 0
        ? ((currentOrders.length / currentUniqueVisitors) * 100).toFixed(1)
        : "0";
    const prevConversionRate =
      previousUniqueVisitors > 0
        ? ((previousOrders.length / previousUniqueVisitors) * 100).toFixed(1)
        : "0";

    return {
      metrics: {
        totalUsers: {
          label: "Total Users",
          value: currentUniqueVisitors,
          change: calcChange(currentUniqueVisitors, previousUniqueVisitors),
          trend: currentUniqueVisitors >= previousUniqueVisitors ? "up" : "down",
          period: `vs previous ${days} days`,
        },
        addToCartEvents: {
          label: "Add to Cart",
          value: currentCartEvents.length,
          change: calcChange(currentCartEvents.length, previousCartEvents.length),
          trend: currentCartEvents.length >= previousCartEvents.length ? "up" : "down",
          period: `vs previous ${days} days`,
        },
        emailSubmissions: {
          label: "Email Signups",
          value: currentEmails.length,
          change: calcChange(currentEmails.length, previousEmails.length),
          trend: currentEmails.length >= previousEmails.length ? "up" : "down",
          period: `vs previous ${days} days`,
        },
        completedOrders: {
          label: "Orders",
          value: currentOrders.length,
          change: calcChange(currentOrders.length, previousOrders.length),
          trend: currentOrders.length >= previousOrders.length ? "up" : "down",
          period: `vs previous ${days} days`,
        },
        revenue: {
          label: "Revenue",
          value: currentRevenue,
          change: calcChange(currentRevenue, previousRevenue),
          trend: currentRevenue >= previousRevenue ? "up" : "down",
          period: `vs previous ${days} days`,
          prefix: "$",
        },
        conversionRate: {
          label: "Conversion",
          value: parseFloat(conversionRate),
          change: (parseFloat(conversionRate) - parseFloat(prevConversionRate)).toFixed(1),
          trend: parseFloat(conversionRate) >= parseFloat(prevConversionRate) ? "up" : "down",
          period: `vs previous ${days} days`,
          suffix: "%",
        },
      },
    };
  },
});

// Time series data for trends
export const trends = query({
  args: {
    range: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const days = args.range || 30;
    const startTime = daysAgo(days);

    // Get all relevant data
    const sessions = await ctx.db
      .query("sessions")
      .filter((q) => q.gte(q.field("startedAt"), startTime))
      .collect();

    const orders = await ctx.db
      .query("orders")
      .filter((q) =>
        q.and(
          q.gte(q.field("orderedAt"), startTime),
          q.neq(q.field("status"), "cancelled"),
          q.neq(q.field("status"), "refunded")
        )
      )
      .collect();

    const cartEvents = await ctx.db
      .query("cartEvents")
      .filter((q) =>
        q.and(
          q.eq(q.field("eventType"), "add"),
          q.gte(q.field("_creationTime"), startTime)
        )
      )
      .collect();

    const emails = await ctx.db
      .query("emailSubscriptions")
      .filter((q) => q.gte(q.field("subscribedAt"), startTime))
      .collect();

    // Group by date
    const sessionsByDate = new Map<string, { pageViews: number; visitors: Set<string> }>();
    const ordersByDate = new Map<string, { orders: number; revenue: number }>();
    const cartByDate = new Map<string, number>();
    const emailsByDate = new Map<string, number>();

    sessions.forEach((s) => {
      const date = formatDate(s.startedAt);
      const existing = sessionsByDate.get(date) || { pageViews: 0, visitors: new Set() };
      existing.pageViews += s.pageCount;
      existing.visitors.add(s.visitorId);
      sessionsByDate.set(date, existing);
    });

    orders.forEach((o) => {
      const date = formatDate(o.orderedAt);
      const existing = ordersByDate.get(date) || { orders: 0, revenue: 0 };
      existing.orders += 1;
      existing.revenue += o.total;
      ordersByDate.set(date, existing);
    });

    cartEvents.forEach((c) => {
      const date = formatDate(c._creationTime);
      cartByDate.set(date, (cartByDate.get(date) || 0) + 1);
    });

    emails.forEach((e) => {
      const date = formatDate(e.subscribedAt);
      emailsByDate.set(date, (emailsByDate.get(date) || 0) + 1);
    });

    // Convert to arrays sorted by date
    const dates = Array.from(
      new Set([
        ...sessionsByDate.keys(),
        ...ordersByDate.keys(),
        ...cartByDate.keys(),
        ...emailsByDate.keys(),
      ])
    ).sort();

    return {
      userBehaviorTrend: dates.map((date) => ({
        date,
        pageViews: sessionsByDate.get(date)?.pageViews || 0,
        uniqueVisitors: sessionsByDate.get(date)?.visitors.size || 0,
      })),
      ordersTrend: dates.map((date) => ({
        date,
        orders: ordersByDate.get(date)?.orders || 0,
        revenue: ordersByDate.get(date)?.revenue || 0,
      })),
      addToCartTrend: dates.map((date) => ({
        date,
        value: cartByDate.get(date) || 0,
      })),
      emailSubmissionsTrend: dates.map((date) => ({
        date,
        value: emailsByDate.get(date) || 0,
      })),
    };
  },
});

// Product performance
export const products = query({
  args: {
    range: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const days = args.range || 30;
    const startTime = daysAgo(days);

    // Get orders in date range
    const orders = await ctx.db
      .query("orders")
      .filter((q) =>
        q.and(
          q.gte(q.field("orderedAt"), startTime),
          q.neq(q.field("status"), "cancelled"),
          q.neq(q.field("status"), "refunded")
        )
      )
      .collect();

    // Get all order items for these orders
    const productStats = new Map<string, { orders: number; revenue: number }>();

    for (const order of orders) {
      const items = await ctx.db
        .query("orderItems")
        .withIndex("by_orderId", (q) => q.eq("orderId", order._id))
        .collect();

      items.forEach((item) => {
        const existing = productStats.get(item.productName) || { orders: 0, revenue: 0 };
        existing.orders += item.quantity;
        existing.revenue += item.totalPrice;
        productStats.set(item.productName, existing);
      });
    }

    // Convert to array and sort by orders
    const ordersByProduct = Array.from(productStats.entries())
      .map(([name, stats]) => ({
        name,
        orders: stats.orders,
        revenue: stats.revenue,
      }))
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 10);

    return { ordersByProduct };
  },
});

// Traffic sources
export const traffic = query({
  args: {
    range: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const days = args.range || 30;
    const startTime = daysAgo(days);

    const sessions = await ctx.db
      .query("sessions")
      .filter((q) => q.gte(q.field("startedAt"), startTime))
      .collect();

    // Categorize by source
    const sourceStats = new Map<string, number>();

    sessions.forEach((s) => {
      let source = "Direct";
      const referrer = s.referrer || "";

      if (referrer.includes("google")) {
        source = "Organic Search";
      } else if (
        referrer.includes("facebook") ||
        referrer.includes("instagram") ||
        referrer.includes("twitter")
      ) {
        source = "Social Media";
      } else if (referrer) {
        source = "Referral";
      }

      sourceStats.set(source, (sourceStats.get(source) || 0) + 1);
    });

    const total = sessions.length || 1;

    const trafficSources = Array.from(sourceStats.entries())
      .map(([source, visits]) => ({
        source,
        visits,
        percentage: ((visits / total) * 100).toFixed(1),
      }))
      .sort((a, b) => b.visits - a.visits);

    return { trafficSources };
  },
});

// Email subscriptions list
export const emails = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 100;

    const emailList = await ctx.db
      .query("emailSubscriptions")
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("desc")
      .take(limit);

    return {
      emailSubscriptions: emailList.map((e) => ({
        id: e._id,
        email: e.email,
        source: e.source || "footer",
        subscribedAt: e.subscribedAt,
        isActive: e.isActive,
      })),
      total: emailList.length,
    };
  },
});
