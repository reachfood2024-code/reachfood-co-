import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Helper: Ensure session exists in database
async function ensureSession(
  ctx: any,
  sessionId: string | undefined,
  visitorId: string,
  landingPage: string = "/"
): Promise<string | undefined> {
  if (!sessionId) return undefined;

  const existing = await ctx.db
    .query("sessions")
    .withIndex("by_sessionId", (q: any) => q.eq("sessionId", sessionId))
    .first();

  if (existing) {
    return sessionId;
  }

  // Auto-create session
  await ctx.db.insert("sessions", {
    sessionId,
    visitorId,
    landingPage,
    startedAt: Date.now(),
    pageCount: 0,
  });

  return sessionId;
}

// Start/update session
export const startSession = mutation({
  args: {
    visitorId: v.string(),
    sessionId: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    referrer: v.optional(v.string()),
    landingPage: v.optional(v.string()),
    deviceType: v.optional(v.union(v.literal("desktop"), v.literal("mobile"), v.literal("tablet"))),
  },
  handler: async (ctx, args) => {
    const { visitorId, sessionId, userAgent, referrer, landingPage, deviceType } = args;
    const newSessionId = sessionId || crypto.randomUUID();

    // Check if session exists
    const existing = await ctx.db
      .query("sessions")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", sessionId || ""))
      .first();

    if (existing) {
      // Update existing session
      await ctx.db.patch(existing._id, {
        pageCount: existing.pageCount + 1,
      });
      return { sessionId: existing.sessionId, status: "updated" };
    }

    // Create new session
    await ctx.db.insert("sessions", {
      sessionId: newSessionId,
      visitorId,
      userAgent,
      referrer,
      landingPage,
      deviceType,
      startedAt: Date.now(),
      pageCount: 1,
    });

    return { sessionId: newSessionId, status: "created" };
  },
});

// Track page view
export const trackPageView = mutation({
  args: {
    sessionId: v.optional(v.string()),
    visitorId: v.string(),
    pagePath: v.string(),
    pageTitle: v.optional(v.string()),
    duration: v.optional(v.number()),
    scrollDepth: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { sessionId, visitorId, pagePath, pageTitle, duration, scrollDepth } = args;

    // Ensure session exists
    const validSessionId = await ensureSession(ctx, sessionId, visitorId, pagePath);

    await ctx.db.insert("pageViews", {
      sessionId: validSessionId || "",
      pagePath,
      pageTitle,
      durationSeconds: duration,
      scrollDepth,
    });

    return { status: "tracked" };
  },
});

// Track generic event
export const trackEvent = mutation({
  args: {
    sessionId: v.optional(v.string()),
    visitorId: v.string(),
    eventType: v.union(
      v.literal("page_view"),
      v.literal("add_to_cart"),
      v.literal("remove_from_cart"),
      v.literal("checkout_start"),
      v.literal("order_complete"),
      v.literal("email_signup"),
      v.literal("product_view"),
      v.literal("search"),
      v.literal("filter_use")
    ),
    eventData: v.optional(v.any()),
    pagePath: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { sessionId, visitorId, eventType, eventData, pagePath } = args;

    // Ensure session exists
    const validSessionId = await ensureSession(ctx, sessionId, visitorId, pagePath || "/");

    await ctx.db.insert("events", {
      sessionId: validSessionId,
      visitorId,
      eventType,
      eventData: eventData || {},
      pagePath,
    });

    return { status: "tracked" };
  },
});

// Track cart event
export const trackCart = mutation({
  args: {
    sessionId: v.optional(v.string()),
    visitorId: v.string(),
    eventType: v.union(v.literal("add"), v.literal("remove"), v.literal("update_quantity")),
    productId: v.string(),
    productName: v.optional(v.string()),
    quantity: v.number(),
    unitPrice: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { sessionId, visitorId, eventType, productId, productName, quantity, unitPrice } = args;

    // Ensure session exists
    const validSessionId = await ensureSession(ctx, sessionId, visitorId);

    await ctx.db.insert("cartEvents", {
      sessionId: validSessionId,
      visitorId,
      eventType,
      productId,
      productName,
      quantity,
      unitPrice,
    });

    return { status: "tracked" };
  },
});

// Track email signup
// Migration helper: Import existing email
export const migrateEmail = mutation({
  args: {
    email: v.string(),
    source: v.string(),
    subscribedAt: v.number(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Check if email already exists
    const existing = await ctx.db
      .query("emailSubscriptions")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      return { status: "already_exists" };
    }

    const emailHash = args.email.substring(0, 1) + "***" + args.email.substring(args.email.indexOf("@") - 1);
    const validSource = ["homepage", "footer", "checkout", "popup", "other"].includes(args.source)
      ? args.source as "homepage" | "footer" | "checkout" | "popup" | "other"
      : "other";

    await ctx.db.insert("emailSubscriptions", {
      email: args.email,
      emailHash,
      source: validSource,
      subscribedAt: args.subscribedAt,
      isActive: args.isActive,
    });

    return { status: "migrated" };
  },
});

export const trackEmail = mutation({
  args: {
    email: v.string(),
    source: v.optional(v.union(
      v.literal("homepage"),
      v.literal("footer"),
      v.literal("checkout"),
      v.literal("popup"),
      v.literal("other")
    )),
    visitorId: v.optional(v.string()),
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { email, source, visitorId, sessionId } = args;

    // Ensure session exists if provided
    if (sessionId && visitorId) {
      await ensureSession(ctx, sessionId, visitorId);
    }

    // Check if email already exists
    const existing = await ctx.db
      .query("emailSubscriptions")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existing && existing.isActive) {
      return { status: "already_subscribed" };
    }

    // Create hash for privacy
    const emailHash = email.substring(0, 1) + "***" + email.substring(email.indexOf("@") - 1);

    await ctx.db.insert("emailSubscriptions", {
      email,
      emailHash,
      source: source || "other",
      visitorId,
      sessionId,
      subscribedAt: Date.now(),
      isActive: true,
    });

    return { status: "subscribed" };
  },
});
