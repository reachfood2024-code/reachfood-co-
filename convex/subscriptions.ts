import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Helper: Generate subscription number
async function generateSubscriptionNumber(ctx: any): Promise<string> {
  const counter = await ctx.db
    .query("counters")
    .withIndex("by_name", (q: any) => q.eq("name", "subscriptions"))
    .first();

  let subCount = 1;
  if (counter) {
    subCount = counter.value + 1;
    await ctx.db.patch(counter._id, { value: subCount });
  } else {
    await ctx.db.insert("counters", { name: "subscriptions", value: 1 });
  }

  return `SUB-${String(subCount).padStart(6, "0")}`;
}

// Migration helper: Create with existing number
export const createWithNumber = mutation({
  args: {
    subscriptionNumber: v.string(),
    customerName: v.string(),
    customerPhone: v.string(),
    customerEmail: v.string(),
    planId: v.string(),
    planName: v.string(),
    mealsPerDay: v.number(),
    totalMeals: v.number(),
    subscriptionDays: v.number(),
    priceUsd: v.number(),
    priceSar: v.number(),
    currency: v.union(v.literal("USD"), v.literal("SAR")),
    status: v.string(),
    adminNotes: v.optional(v.union(v.string(), v.null())),
    submittedAt: v.number(),
  },
  handler: async (ctx, args) => {
    // Check if already exists
    const existing = await ctx.db
      .query("subscriptions")
      .withIndex("by_subscriptionNumber", (q) =>
        q.eq("subscriptionNumber", args.subscriptionNumber)
      )
      .first();

    if (existing) {
      return { status: "already_exists", subscriptionNumber: args.subscriptionNumber };
    }

    const validStatus = ["pending", "contacted", "confirmed", "active", "completed", "cancelled"].includes(args.status)
      ? args.status as "pending" | "contacted" | "confirmed" | "active" | "completed" | "cancelled"
      : "pending";

    await ctx.db.insert("subscriptions", {
      subscriptionNumber: args.subscriptionNumber,
      customerName: args.customerName,
      customerPhone: args.customerPhone,
      customerEmail: args.customerEmail,
      planId: args.planId,
      planName: args.planName,
      mealsPerDay: args.mealsPerDay,
      totalMeals: args.totalMeals,
      subscriptionDays: args.subscriptionDays,
      priceUsd: args.priceUsd,
      priceSar: args.priceSar,
      currency: args.currency,
      status: validStatus,
      adminNotes: args.adminNotes || undefined,
      submittedAt: args.submittedAt,
    });

    // Update counter to match
    const numPart = parseInt(args.subscriptionNumber.replace("SUB-", ""));
    const counter = await ctx.db
      .query("counters")
      .withIndex("by_name", (q) => q.eq("name", "subscriptions"))
      .first();

    if (counter) {
      if (counter.value < numPart) {
        await ctx.db.patch(counter._id, { value: numPart });
      }
    } else {
      await ctx.db.insert("counters", { name: "subscriptions", value: numPart });
    }

    return { status: "migrated", subscriptionNumber: args.subscriptionNumber };
  },
});

// List all subscriptions
export const list = query({
  args: {
    limit: v.optional(v.number()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;

    let subscriptionsQuery;
    if (args.status && args.status !== "all") {
      subscriptionsQuery = ctx.db
        .query("subscriptions")
        .withIndex("by_status", (q) => q.eq("status", args.status as any))
        .order("desc");
    } else {
      subscriptionsQuery = ctx.db.query("subscriptions").order("desc");
    }

    const subscriptions = await subscriptionsQuery.take(limit);

    // Get count by status
    const allSubscriptions = await ctx.db.query("subscriptions").collect();
    const stats = {
      pending: allSubscriptions.filter((s) => s.status === "pending").length,
      contacted: allSubscriptions.filter((s) => s.status === "contacted").length,
      confirmed: allSubscriptions.filter((s) => s.status === "confirmed").length,
      active: allSubscriptions.filter((s) => s.status === "active").length,
      completed: allSubscriptions.filter((s) => s.status === "completed").length,
      cancelled: allSubscriptions.filter((s) => s.status === "cancelled").length,
      total: allSubscriptions.length,
    };

    return {
      subscriptions: subscriptions.map((sub) => ({
        id: sub.subscriptionNumber,
        name: sub.customerName,
        phone: sub.customerPhone,
        email: sub.customerEmail,
        plan_id: sub.planId,
        plan_name: sub.planName,
        meals_per_day: sub.mealsPerDay,
        total_meals: sub.totalMeals,
        subscription_days: sub.subscriptionDays,
        price_usd: sub.priceUsd,
        price_sar: sub.priceSar,
        currency: sub.currency,
        status: sub.status,
        admin_notes: sub.adminNotes,
        date: new Date(sub.submittedAt).toISOString().split("T")[0],
        submitted_at: sub.submittedAt,
      })),
      stats,
    };
  },
});

// Create new subscription
export const create = mutation({
  args: {
    name: v.string(),
    phone: v.string(),
    email: v.string(),
    planId: v.string(),
    planName: v.optional(v.string()),
    mealsPerDay: v.optional(v.number()),
    totalMeals: v.optional(v.number()),
    priceUSD: v.optional(v.number()),
    priceSAR: v.optional(v.number()),
    currency: v.optional(v.union(v.literal("USD"), v.literal("SAR"))),
    subscriptionDays: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const {
      name,
      phone,
      email,
      planId,
      planName,
      mealsPerDay = 1,
      totalMeals = 26,
      priceUSD = 0,
      priceSAR = 0,
      currency = "USD",
      subscriptionDays = 26,
    } = args;

    // Generate subscription number
    const subscriptionNumber = await generateSubscriptionNumber(ctx);

    // Insert subscription
    await ctx.db.insert("subscriptions", {
      subscriptionNumber,
      customerName: name,
      customerPhone: phone,
      customerEmail: email,
      planId,
      planName: planName || planId,
      mealsPerDay,
      totalMeals,
      subscriptionDays,
      priceUsd: priceUSD,
      priceSar: priceSAR,
      currency,
      status: "pending",
      submittedAt: Date.now(),
    });

    return { subscriptionNumber, status: "created" };
  },
});

// Get subscription details
export const getBySubscriptionNumber = query({
  args: {
    subscriptionNumber: v.string(),
  },
  handler: async (ctx, args) => {
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_subscriptionNumber", (q) =>
        q.eq("subscriptionNumber", args.subscriptionNumber)
      )
      .first();

    return subscription ? { subscription } : null;
  },
});

// Update subscription status
export const updateStatus = mutation({
  args: {
    subscriptionNumber: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("contacted"),
      v.literal("confirmed"),
      v.literal("active"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    adminNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { subscriptionNumber, status, adminNotes } = args;

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_subscriptionNumber", (q) =>
        q.eq("subscriptionNumber", subscriptionNumber)
      )
      .first();

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    const updates: any = { status };

    // Set timestamp based on status
    if (status === "contacted") {
      updates.contactedAt = Date.now();
    } else if (status === "confirmed") {
      updates.confirmedAt = Date.now();
    }

    // Add admin notes if provided
    if (adminNotes !== undefined) {
      updates.adminNotes = adminNotes;
    }

    await ctx.db.patch(subscription._id, updates);

    return { subscriptionNumber, status, adminNotes: updates.adminNotes };
  },
});
