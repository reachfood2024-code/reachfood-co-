import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Sessions: Track unique visitor sessions
  sessions: defineTable({
    sessionId: v.string(), // UUID
    visitorId: v.string(), // Persistent visitor ID from localStorage
    userAgent: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    referrer: v.optional(v.string()),
    landingPage: v.optional(v.string()),
    country: v.optional(v.string()),
    city: v.optional(v.string()),
    deviceType: v.optional(v.union(v.literal("desktop"), v.literal("mobile"), v.literal("tablet"))),
    startedAt: v.number(), // timestamp
    endedAt: v.optional(v.number()),
    pageCount: v.number(),
  })
    .index("by_sessionId", ["sessionId"])
    .index("by_visitorId", ["visitorId"])
    .index("by_startedAt", ["startedAt"]),

  // Page Views: Individual page visits
  pageViews: defineTable({
    sessionId: v.string(),
    pagePath: v.string(),
    pageTitle: v.optional(v.string()),
    durationSeconds: v.optional(v.number()),
    scrollDepth: v.optional(v.number()), // 0-100
  })
    .index("by_sessionId", ["sessionId"])
    .index("by_pagePath", ["pagePath"]),

  // Events: Generic event tracking
  events: defineTable({
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
    eventData: v.any(), // Flexible JSON data
    pagePath: v.optional(v.string()),
  })
    .index("by_eventType", ["eventType"])
    .index("by_visitorId", ["visitorId"])
    .index("by_sessionId", ["sessionId"]),

  // Email Subscriptions: Newsletter signups
  emailSubscriptions: defineTable({
    email: v.string(),
    emailHash: v.string(), // For privacy in dashboard display
    source: v.union(
      v.literal("homepage"),
      v.literal("footer"),
      v.literal("checkout"),
      v.literal("popup"),
      v.literal("other")
    ),
    visitorId: v.optional(v.string()),
    sessionId: v.optional(v.string()),
    subscribedAt: v.number(),
    unsubscribedAt: v.optional(v.number()),
    isActive: v.boolean(),
  })
    .index("by_email", ["email"])
    .index("by_subscribedAt", ["subscribedAt"])
    .index("by_isActive", ["isActive"]),

  // Orders: Completed purchases
  orders: defineTable({
    orderNumber: v.string(), // Human-readable: ORD-001234
    sessionId: v.optional(v.string()),
    visitorId: v.optional(v.string()),
    // Customer info
    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.optional(v.string()),
    // Shipping
    shippingAddress: v.any(), // JSON object
    shippingMethod: v.optional(v.string()),
    // Financials
    subtotal: v.number(),
    shippingCost: v.number(),
    tax: v.number(),
    discount: v.number(),
    total: v.number(),
    currency: v.union(v.literal("USD"), v.literal("SAR")),
    // Status
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled"),
      v.literal("refunded")
    ),
    // Timestamps
    orderedAt: v.number(),
    shippedAt: v.optional(v.number()),
    deliveredAt: v.optional(v.number()),
  })
    .index("by_orderNumber", ["orderNumber"])
    .index("by_status", ["status"])
    .index("by_orderedAt", ["orderedAt"])
    .index("by_visitorId", ["visitorId"]),

  // Order Items: Products in each order
  orderItems: defineTable({
    orderId: v.id("orders"),
    productId: v.string(),
    productName: v.string(),
    quantity: v.number(),
    unitPrice: v.number(),
    totalPrice: v.number(),
  })
    .index("by_orderId", ["orderId"])
    .index("by_productId", ["productId"]),

  // Cart Events: Add/remove cart tracking
  cartEvents: defineTable({
    sessionId: v.optional(v.string()),
    visitorId: v.string(),
    eventType: v.union(v.literal("add"), v.literal("remove"), v.literal("update_quantity")),
    productId: v.string(),
    productName: v.optional(v.string()),
    quantity: v.number(),
    unitPrice: v.optional(v.number()),
  })
    .index("by_visitorId", ["visitorId"])
    .index("by_productId", ["productId"])
    .index("by_eventType", ["eventType"]),

  // Daily Metrics: Pre-aggregated daily stats
  dailyMetrics: defineTable({
    date: v.string(), // YYYY-MM-DD format
    // Traffic
    totalSessions: v.number(),
    uniqueVisitors: v.number(),
    totalPageViews: v.number(),
    // Engagement
    addToCartEvents: v.number(),
    emailSignups: v.number(),
    // Sales
    totalOrders: v.number(),
    completedOrders: v.number(),
    totalRevenue: v.number(),
    averageOrderValue: v.optional(v.number()),
    // Conversion
    cartConversionRate: v.optional(v.number()),
    visitorConversionRate: v.optional(v.number()),
  }).index("by_date", ["date"]),

  // Subscriptions: Meal plan subscription requests
  subscriptions: defineTable({
    subscriptionNumber: v.string(), // Human-readable: SUB-001234
    // Customer info
    customerName: v.string(),
    customerPhone: v.string(),
    customerEmail: v.string(),
    // Plan details
    planId: v.string(),
    planName: v.string(),
    mealsPerDay: v.number(),
    totalMeals: v.number(),
    subscriptionDays: v.number(),
    // Pricing
    priceUsd: v.number(),
    priceSar: v.number(),
    currency: v.union(v.literal("USD"), v.literal("SAR")),
    // Status
    status: v.union(
      v.literal("pending"),
      v.literal("contacted"),
      v.literal("confirmed"),
      v.literal("active"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    // Notes
    adminNotes: v.optional(v.string()),
    // Timestamps
    submittedAt: v.number(),
    contactedAt: v.optional(v.number()),
    confirmedAt: v.optional(v.number()),
  })
    .index("by_subscriptionNumber", ["subscriptionNumber"])
    .index("by_status", ["status"])
    .index("by_submittedAt", ["submittedAt"])
    .index("by_customerEmail", ["customerEmail"]),

  // Counter for generating order/subscription numbers
  counters: defineTable({
    name: v.string(), // "orders" or "subscriptions"
    value: v.number(),
  }).index("by_name", ["name"]),
});
