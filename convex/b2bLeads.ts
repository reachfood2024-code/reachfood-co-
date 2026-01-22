import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Submit a new B2B lead
export const submit = mutation({
  args: {
    email: v.string(),
    businessName: v.optional(v.string()),
    contactName: v.optional(v.string()),
    phone: v.optional(v.string()),
    message: v.optional(v.string()),
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if email already exists
    const existing = await ctx.db
      .query("b2bLeads")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();

    if (existing) {
      // Update existing lead with new info
      await ctx.db.patch(existing._id, {
        businessName: args.businessName || existing.businessName,
        contactName: args.contactName || existing.contactName,
        phone: args.phone || existing.phone,
        message: args.message || existing.message,
      });
      return { status: "updated", id: existing._id };
    }

    // Create new lead
    const id = await ctx.db.insert("b2bLeads", {
      email: args.email.toLowerCase(),
      businessName: args.businessName,
      contactName: args.contactName,
      phone: args.phone,
      message: args.message,
      status: "new",
      source: args.source || "homepage",
      submittedAt: Date.now(),
    });

    return { status: "created", id };
  },
});

// List all B2B leads
export const list = query({
  args: {
    limit: v.optional(v.number()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;

    let leads;
    if (args.status) {
      leads = await ctx.db
        .query("b2bLeads")
        .withIndex("by_status")
        .order("desc")
        .take(limit);
      leads = leads.filter(l => l.status === args.status);
    } else {
      leads = await ctx.db
        .query("b2bLeads")
        .order("desc")
        .take(limit);
    }

    return {
      leads: leads.map((lead) => ({
        id: lead._id,
        email: lead.email,
        businessName: lead.businessName || "-",
        contactName: lead.contactName || "-",
        phone: lead.phone || "-",
        message: lead.message || "-",
        status: lead.status,
        source: lead.source,
        submittedAt: lead.submittedAt,
        contactedAt: lead.contactedAt,
        notes: lead.notes,
        date: new Date(lead.submittedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      })),
      total: leads.length,
    };
  },
});

// Update B2B lead status
export const updateStatus = mutation({
  args: {
    id: v.id("b2bLeads"),
    status: v.union(
      v.literal("new"),
      v.literal("contacted"),
      v.literal("qualified"),
      v.literal("converted"),
      v.literal("not_interested")
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updates: any = { status: args.status };

    if (args.status === "contacted") {
      updates.contactedAt = Date.now();
    }

    if (args.notes !== undefined) {
      updates.notes = args.notes;
    }

    await ctx.db.patch(args.id, updates);
    return { status: "updated" };
  },
});

// Delete B2B lead
export const deleteLead = mutation({
  args: {
    id: v.id("b2bLeads"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { status: "deleted" };
  },
});

// Get B2B lead stats
export const stats = query({
  handler: async (ctx) => {
    const allLeads = await ctx.db.query("b2bLeads").collect();

    return {
      total: allLeads.length,
      new: allLeads.filter((l) => l.status === "new").length,
      contacted: allLeads.filter((l) => l.status === "contacted").length,
      qualified: allLeads.filter((l) => l.status === "qualified").length,
      converted: allLeads.filter((l) => l.status === "converted").length,
      notInterested: allLeads.filter((l) => l.status === "not_interested").length,
    };
  },
});
