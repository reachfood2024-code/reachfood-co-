import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Helper: Generate order number
async function generateOrderNumber(ctx: any): Promise<string> {
  const counter = await ctx.db
    .query("counters")
    .withIndex("by_name", (q: any) => q.eq("name", "orders"))
    .first();

  let orderCount = 1;
  if (counter) {
    orderCount = counter.value + 1;
    await ctx.db.patch(counter._id, { value: orderCount });
  } else {
    await ctx.db.insert("counters", { name: "orders", value: 1 });
  }

  return `ORD-${String(orderCount).padStart(6, "0")}`;
}

// Helper: Ensure session exists
async function ensureSession(
  ctx: any,
  sessionId: string | undefined,
  visitorId: string | undefined
): Promise<string | undefined> {
  if (!sessionId || !visitorId) return undefined;

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
    landingPage: "/checkout",
    startedAt: Date.now(),
    pageCount: 0,
  });

  return sessionId;
}

// Migration helper: Create with existing order number
export const createWithNumber = mutation({
  args: {
    orderNumber: v.string(),
    customerName: v.string(),
    customerEmail: v.string(),
    total: v.number(),
    currency: v.union(v.literal("USD"), v.literal("SAR")),
    status: v.string(),
    orderedAt: v.number(),
    productName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if already exists
    const existing = await ctx.db
      .query("orders")
      .withIndex("by_orderNumber", (q) => q.eq("orderNumber", args.orderNumber))
      .first();

    if (existing) {
      return { status: "already_exists", orderNumber: args.orderNumber };
    }

    const validStatus = ["pending", "processing", "shipped", "delivered", "cancelled", "refunded"].includes(args.status)
      ? args.status as "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded"
      : "pending";

    // Create order
    const orderId = await ctx.db.insert("orders", {
      orderNumber: args.orderNumber,
      customerName: args.customerName,
      customerEmail: args.customerEmail,
      shippingAddress: {},
      subtotal: args.total,
      shippingCost: 0,
      tax: 0,
      discount: 0,
      total: args.total,
      currency: args.currency,
      status: validStatus,
      orderedAt: args.orderedAt,
    });

    // Create order item if product name provided
    if (args.productName) {
      await ctx.db.insert("orderItems", {
        orderId,
        productId: "migrated",
        productName: args.productName,
        quantity: 1,
        unitPrice: args.total,
        totalPrice: args.total,
      });
    }

    // Update counter to match
    const numPart = parseInt(args.orderNumber.replace("ORD-", ""));
    const counter = await ctx.db
      .query("counters")
      .withIndex("by_name", (q) => q.eq("name", "orders"))
      .first();

    if (counter) {
      if (counter.value < numPart) {
        await ctx.db.patch(counter._id, { value: numPart });
      }
    } else {
      await ctx.db.insert("counters", { name: "orders", value: numPart });
    }

    return { status: "migrated", orderNumber: args.orderNumber };
  },
});

// List recent orders
export const list = query({
  args: {
    limit: v.optional(v.number()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;

    let ordersQuery = ctx.db.query("orders").order("desc");

    if (args.status) {
      ordersQuery = ctx.db
        .query("orders")
        .withIndex("by_status", (q) => q.eq("status", args.status as any))
        .order("desc");
    }

    const orders = await ordersQuery.take(limit);

    // Get product for each order
    const ordersWithProducts = await Promise.all(
      orders.map(async (order) => {
        const items = await ctx.db
          .query("orderItems")
          .withIndex("by_orderId", (q) => q.eq("orderId", order._id))
          .first();

        return {
          id: order.orderNumber,
          customer: order.customerName,
          amount: order.total,
          status: order.status,
          date: new Date(order.orderedAt).toISOString().split("T")[0],
          currency: order.currency,
          product: items?.productName || "Multiple items",
        };
      })
    );

    return { recentOrders: ordersWithProducts };
  },
});

// Create new order
export const create = mutation({
  args: {
    sessionId: v.optional(v.string()),
    visitorId: v.optional(v.string()),
    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.optional(v.string()),
    shippingAddress: v.any(),
    items: v.array(
      v.object({
        productId: v.string(),
        productName: v.string(),
        quantity: v.number(),
        unitPrice: v.number(),
        totalPrice: v.number(),
      })
    ),
    subtotal: v.number(),
    shippingCost: v.optional(v.number()),
    tax: v.optional(v.number()),
    discount: v.optional(v.number()),
    total: v.number(),
    currency: v.optional(v.union(v.literal("USD"), v.literal("SAR"))),
  },
  handler: async (ctx, args) => {
    const {
      sessionId,
      visitorId,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      subtotal,
      shippingCost = 0,
      tax = 0,
      discount = 0,
      total,
      currency = "USD",
    } = args;

    // Ensure session exists
    const validSessionId = await ensureSession(ctx, sessionId, visitorId);

    // Generate order number
    const orderNumber = await generateOrderNumber(ctx);

    // Insert order
    const orderId = await ctx.db.insert("orders", {
      orderNumber,
      sessionId: validSessionId,
      visitorId,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      subtotal,
      shippingCost,
      tax,
      discount,
      total,
      currency,
      status: "pending",
      orderedAt: Date.now(),
    });

    // Insert order items
    for (const item of items) {
      await ctx.db.insert("orderItems", {
        orderId,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      });
    }

    // Track order complete event
    if (validSessionId && visitorId) {
      await ctx.db.insert("events", {
        sessionId: validSessionId,
        visitorId,
        eventType: "order_complete",
        eventData: { orderNumber, total, itemCount: items.length },
        pagePath: "/checkout",
      });
    }

    return { orderNumber, status: "created" };
  },
});

// Get order details
export const getByOrderNumber = query({
  args: {
    orderNumber: v.string(),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db
      .query("orders")
      .withIndex("by_orderNumber", (q) => q.eq("orderNumber", args.orderNumber))
      .first();

    if (!order) {
      return null;
    }

    const items = await ctx.db
      .query("orderItems")
      .withIndex("by_orderId", (q) => q.eq("orderId", order._id))
      .collect();

    return { order, items };
  },
});

// Update order status
export const updateStatus = mutation({
  args: {
    orderNumber: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled"),
      v.literal("refunded")
    ),
  },
  handler: async (ctx, args) => {
    const { orderNumber, status } = args;

    const order = await ctx.db
      .query("orders")
      .withIndex("by_orderNumber", (q) => q.eq("orderNumber", orderNumber))
      .first();

    if (!order) {
      throw new Error("Order not found");
    }

    const updates: any = { status };

    if (status === "shipped") {
      updates.shippedAt = Date.now();
    } else if (status === "delivered") {
      updates.deliveredAt = Date.now();
    }

    await ctx.db.patch(order._id, updates);

    return { orderNumber, status };
  },
});

// Delete order
export const deleteOrder = mutation({
  args: {
    orderNumber: v.string(),
  },
  handler: async (ctx, args) => {
    const { orderNumber } = args;

    const order = await ctx.db
      .query("orders")
      .withIndex("by_orderNumber", (q) => q.eq("orderNumber", orderNumber))
      .first();

    if (!order) {
      throw new Error("Order not found");
    }

    // Delete all associated order items first
    const orderItems = await ctx.db
      .query("orderItems")
      .withIndex("by_orderId", (q) => q.eq("orderId", order._id))
      .collect();

    for (const item of orderItems) {
      await ctx.db.delete(item._id);
    }

    // Delete the order
    await ctx.db.delete(order._id);

    return { orderNumber, status: "deleted" };
  },
});
