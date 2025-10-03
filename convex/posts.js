import { v } from "convex/values";
import { internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";

// Get user draft (there can only be one)
export const getUserDraft = query({
  handler: async (ctx) => {
    const user = await ctx.runQuery(internal.users.getCurrentUser);
    const draft = await ctx.db
      .query("posts")
      .filter((q) =>
        q.and(
          q.eq(q.field("authorId"), user._id),
          q.eq(q.field("status"), "draft")
        )
      )
      .unique();

    return draft;
  },
});

// Create New Post
export const createNewPost = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    status: v.union(v.literal("draft"), v.literal("published")),
    tags: v.array(v.string()),
    category: v.optional(v.string()),
    featuredImage: v.optional(v.string()),
    scheduledFor: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(internal.users.getCurrentUser);

    const draft = await ctx.db
      .query("posts")
      .filter((q) =>
        q.and(
          q.eq(q.field("authorId"), user._id),
          q.eq(q.field("status"), "draft")
        )
      )
      .unique();

    const now = Date.now();

    //   If publishing & we have an existing draft, update it to published
    if (args.status === "published" && draft) {
      await ctx.db.patch(draft._id, {
        title: args.title,
        content: args.content,
        status: "published",
        tags: args.tags || [],
        category: args.category,
        featuredImage: args.featuredImage,
        updatedAt: now,
        publishedAt: now,
        scheduledFor: args.scheduledFor,
      });

      return draft._id;
    }
    // If creating a draft and we have an existing draft, update it
    if (args.status === "draft" && draft) {
      await ctx.db.patch(draft._id, {
        title: args.title,
        content: args.content,
        tags: args.tags || [],
        category: args.category,
        featuredImage: args.featuredImage,
        scheduledFor: args.scheduledFor,
      });

      return draft._id;
    }

    // Create a new post (either first draft or direct publish)
    const postId = await ctx.db.insert("posts", {
      title: args.title,
      content: args.content,
      status: args.status,
      authorId: user._id,
      tags: args.tags || [],
      category: args.category,
      featuredImage: args.featuredImage,
      createdAt: now,
      likeCount: 0,
      updatedAt: now,
      viewCount: 0,
      publishedAt: args.status === "published" ? now : undefined,
      scheduledFor: args.scheduledFor,
    });

    return postId;
  },
});

// Update Post
export const updatePost = mutation({
  args: {
    id: v.id("posts"),
    title: v.string(),
    content: v.string(),
    status: v.union(v.literal("draft"), v.literal("published")),
    tags: v.array(v.string()),
    category: v.optional(v.string()),
    featuredImage: v.optional(v.string()),
    scheduledFor: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(internal.users.getCurrentUser);

    const post = await ctx.db.get(args.id);
    if (!post) {
      throw new Error("Post not found");
    }

    if (post.authorId !== user._id) {
      throw new Error("Not authorized to update this post");
    }

    const now = Date.now();
    const updatedData = {
      updatedAt: now,
    };

    // Add provided fields to change
    if (args.title !== undefined) {
      updatedData.title = args.title;
    }
    if (args.content !== undefined) {
      updatedData.content = args.content;
    }
    if (args.tags !== undefined) {
      updatedData.tags = args.tags;
    }
    if (args.category !== undefined) {
      updatedData.category = args.category;
    }
    if (args.featuredImage !== undefined) {
      updatedData.featuredImage = args.featuredImage;
    }
    if (args.scheduledFor !== undefined) {
      updatedData.scheduledFor = args.scheduledFor;
    }

    if (args.status !== undefined) {
      updatedData.status = args.status;

      if (args.status === "published" && post.status === "draft") {
        updatedData.publishedAt = now;
      }
    }

    await ctx.db.patch(args.id, updatedData);
    return args.id;
  },
});

export const getUserPosts = query({
  args: {
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    // Get user from database
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
      .unique();

    if (!user) {
      return [];
    }

    let query = ctx.db
      .query("posts")
      .filter((q) => q.eq(q.field("authorId"), user._id));

    // Filter by status if provided
    if (args.status) {
      query = query.filter((q) => q.eq(q.field("status"), args.status));
    }

    const posts = await query.order("desc").collect();

    // Add username to each post
    return posts.map((post) => ({
      ...post,
      username: user.username,
    }));
  },
});

// Get a single post by ID
export const getById = query({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Delete a post
export const deletePost = mutation({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get user from database
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    // Get the post
    const post = await ctx.db.get(args.id);
    if (!post) {
      throw new Error("Post not found");
    }

    // Check if user owns the post
    if (post.authorId !== user._id) {
      throw new Error("Not authorized to delete this post");
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});