import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  rootPath: text("root_path").notNull(),
  framework: text("framework"),
  language: text("language"),
  buildTool: text("build_tool"),
  status: text("status").default("pending"),
  lastScanned: timestamp("last_scanned"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  lastScanned: true,
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export const codeModules = pgTable("code_modules", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: text("type").notNull(),
  filePath: text("file_path").notNull(),
  description: text("description"),
  dependencies: jsonb("dependencies").$type<string[]>().default([]),
  exports: jsonb("exports").$type<string[]>().default([]),
  linesOfCode: integer("lines_of_code").default(0),
});

export const insertCodeModuleSchema = createInsertSchema(codeModules).omit({
  id: true,
});

export type InsertCodeModule = z.infer<typeof insertCodeModuleSchema>;
export type CodeModule = typeof codeModules.$inferSelect;

export const components = pgTable("components", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: text("type").notNull(),
  filePath: text("file_path").notNull(),
  moduleId: integer("module_id"),
  props: jsonb("props").$type<string[]>().default([]),
  state: jsonb("state").$type<string[]>().default([]),
  description: text("description"),
});

export const insertComponentSchema = createInsertSchema(components).omit({
  id: true,
});

export type InsertComponent = z.infer<typeof insertComponentSchema>;
export type Component = typeof components.$inferSelect;

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  filePath: text("file_path").notNull(),
  methods: jsonb("methods").$type<string[]>().default([]),
  dependencies: jsonb("dependencies").$type<string[]>().default([]),
  description: text("description"),
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
});

export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

export const routes = pgTable("routes", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  path: text("path").notNull(),
  componentName: text("component_name"),
  filePath: text("file_path"),
  guards: jsonb("guards").$type<string[]>().default([]),
  children: jsonb("children").$type<string[]>().default([]),
});

export const insertRouteSchema = createInsertSchema(routes).omit({
  id: true,
});

export type InsertRoute = z.infer<typeof insertRouteSchema>;
export type Route = typeof routes.$inferSelect;

export const dependencies = pgTable("dependencies", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  version: text("version"),
  type: text("type").notNull(),
  category: text("category"),
});

export const insertDependencySchema = createInsertSchema(dependencies).omit({
  id: true,
});

export type InsertDependency = z.infer<typeof insertDependencySchema>;
export type Dependency = typeof dependencies.$inferSelect;

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id"),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  fileReferences: jsonb("file_references").$type<string[]>().default([]),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export const projectMetrics = pgTable("project_metrics", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  totalFiles: integer("total_files").default(0),
  totalLines: integer("total_lines").default(0),
  totalComponents: integer("total_components").default(0),
  totalServices: integer("total_services").default(0),
  totalDirectives: integer("total_directives").default(0),
  totalPipes: integer("total_pipes").default(0),
  totalModules: integer("total_modules").default(0),
  totalRoutes: integer("total_routes").default(0),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertProjectMetricsSchema = createInsertSchema(projectMetrics).omit({
  id: true,
  updatedAt: true,
});

export type InsertProjectMetrics = z.infer<typeof insertProjectMetricsSchema>;
export type ProjectMetrics = typeof projectMetrics.$inferSelect;

export interface ArchitectureNode {
  id: string;
  label: string;
  type: string;
  filePath?: string;
  children?: ArchitectureNode[];
}

export interface CodeFlow {
  id: string;
  name: string;
  steps: FlowStep[];
}

export interface FlowStep {
  id: string;
  type: string;
  name: string;
  filePath?: string;
  description?: string;
}

export interface FileTreeNode {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: FileTreeNode[];
  language?: string;
  size?: number;
}
