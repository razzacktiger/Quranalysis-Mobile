/**
 * State Manager - Centralized state access for Claude workflow
 *
 * This utility provides a single source of truth for all workflow state,
 * enabling consistent access across multiple AI agents.
 *
 * Usage by agents:
 *   import * as state from '.claude/lib/state-manager';
 *   const project = state.getProject();
 *   state.updateTask('5.1.1', { status: 'complete' });
 */

import * as fs from "fs";
import * as path from "path";

// =============================================================================
// Types
// =============================================================================

export interface ProjectState {
  $schema?: string;
  version: string;
  active: {
    epic_id: string | null;
    feature_id: string | null;
    task_id: string | null;
    branch: string | null;
    session_started: string | null;
  };
  blockers: Array<{
    description: string;
    severity?: "low" | "medium" | "high" | "critical";
    created_at?: string;
  }>;
  progress: Record<
    string,
    {
      status: "active" | "complete" | "archived" | "blocked";
      completed: number;
      total: number;
    }
  >;
  notes: string[];
}

export interface Task {
  id: string;
  epic_id: string;
  feature_id: string;
  name: string;
  size?: "S" | "M" | "L" | "XL";
  type?: "UI" | "API" | "Setup" | "Test" | "Bug" | "Meta";
  status: "pending" | "in_progress" | "complete" | "blocked" | "cancelled";
  files?: string[];
  deps?: string[];
  acceptance_criteria?: string[];
  test_command?: string;
  completed_at?: string | null;
  metrics?: {
    tokens?: number;
    turns?: number;
    tools?: number;
    agent?: string | null;
    overhead?: number;
  } | null;
  notes?: string;
}

export interface TasksState {
  $schema?: string;
  tasks: Task[];
}

export interface Bug {
  id: string;
  epic_id?: string;
  feature_id?: string;
  severity: 1 | 2 | 3 | 4;
  status: "open" | "in_progress" | "fixed" | "wont_fix" | "duplicate";
  title: string;
  description?: string;
  found_in?:
    | "implementation"
    | "code_review"
    | "human_qa"
    | "production"
    | "testing";
  found_date?: string;
  fixed_date?: string | null;
  files?: string[];
  root_cause?: string;
  fix_summary?: string;
  related_task?: string | null;
}

export interface BugsState {
  $schema?: string;
  bugs: Bug[];
}

export interface SessionTask {
  task_id: string;
  tokens?: number;
  turns?: number;
  tools?: number;
  agent?: string | null;
  bugs_caught?: number;
}

export interface SessionState {
  $schema?: string;
  started: string | null;
  epic_id: string | null;
  branch: string | null;
  active_task: {
    id: string;
    name: string;
    type?: string;
    size?: string;
    started_at?: string;
  } | null;
  active_agents: Array<{
    name: string;
    task_id?: string;
    started_at?: string;
  }>;
  completed_tasks: SessionTask[];
  totals: {
    tasks_completed: number;
    tokens: number;
    context_percent: number;
    tool_calls: number;
  };
  files_read: string[];
  notes: string[];
}

export interface SessionSummary {
  date: string;
  epic_id: string;
  tasks_completed?: number;
  tokens?: number;
  context_percent?: number;
  turns?: number;
  duration_minutes?: number;
  notes?: string;
}

export interface MetricsState {
  $schema?: string;
  sessions: {
    recent: SessionSummary[];
    averages: {
      tasks_per_session?: number;
      tokens_per_session?: number;
      tokens_per_task?: number;
    };
  };
  by_task_type: Record<
    string,
    {
      count: number;
      avg_tokens?: number;
      avg_turns?: number;
    }
  >;
  by_task_size: Record<
    string,
    {
      count: number;
      avg_tokens?: number;
    }
  >;
  tools: {
    frequency: Record<string, number>;
    agents: Record<
      string,
      {
        uses: number;
        bugs_caught?: number;
        avg_tokens?: number;
      }
    >;
  };
  quality: {
    bugs_by_stage: Record<string, number>;
    bugs_by_severity: Record<string, number>;
  };
  signals: {
    green: string[];
    yellow: string[];
    red: string[];
  };
}

export interface LearningEntry {
  id: string;
  category: string;
  title: string;
  file: string;
  line_start?: number;
  line_end?: number;
  tags?: string[];
  summary?: string;
  key_points?: string[];
}

export interface LearningsIndex {
  $schema?: string;
  entries: LearningEntry[];
  by_category: Record<string, string[]>;
  by_tag: Record<string, string[]>;
}

export interface TaskFilter {
  epic_id?: string;
  feature_id?: string;
  status?: Task["status"] | Task["status"][];
  type?: Task["type"];
  size?: Task["size"];
}

export interface BugFilter {
  epic_id?: string;
  feature_id?: string;
  status?: Bug["status"] | Bug["status"][];
  severity?: number | number[];
  found_in?: Bug["found_in"];
}

// =============================================================================
// Configuration
// =============================================================================

const STATE_DIR = path.join(__dirname, "../../state");
const SCHEMAS_DIR = path.join(__dirname, "../schemas");

// =============================================================================
// Core Read/Write Functions
// =============================================================================

/**
 * Read a JSON state file.
 */
export function readState<T>(filename: string): T {
  const filepath = path.join(STATE_DIR, filename);
  if (!fs.existsSync(filepath)) {
    throw new Error(`State file not found: ${filepath}`);
  }
  const content = fs.readFileSync(filepath, "utf-8");
  return JSON.parse(content) as T;
}

/**
 * Write a JSON state file with pretty formatting.
 */
export function writeState<T>(filename: string, data: T): void {
  const filepath = path.join(STATE_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2) + "\n");
}

/**
 * Check if a state file exists.
 */
export function stateExists(filename: string): boolean {
  return fs.existsSync(path.join(STATE_DIR, filename));
}

// =============================================================================
// Project State
// =============================================================================

/**
 * Get the current project state.
 */
export function getProject(): ProjectState {
  return readState<ProjectState>("project.json");
}

/**
 * Update project state with partial updates.
 */
export function updateProject(updates: Partial<ProjectState>): ProjectState {
  const project = getProject();
  const updated = { ...project, ...updates } as ProjectState;
  writeState("project.json", updated);
  return updated;
}

/**
 * Set the active work context.
 */
export function setActiveWork(
  active: Partial<ProjectState["active"]>,
): ProjectState {
  const project = getProject();
  project.active = { ...project.active, ...active };
  writeState("project.json", project);
  return project;
}

/**
 * Add a blocker.
 */
export function addBlocker(
  description: string,
  severity?: "low" | "medium" | "high" | "critical",
): ProjectState {
  const project = getProject();
  project.blockers.push({
    description,
    severity,
    created_at: new Date().toISOString().split("T")[0],
  });
  writeState("project.json", project);
  return project;
}

/**
 * Remove a blocker by index or description.
 */
export function removeBlocker(
  indexOrDescription: number | string,
): ProjectState {
  const project = getProject();
  if (typeof indexOrDescription === "number") {
    project.blockers.splice(indexOrDescription, 1);
  } else {
    project.blockers = project.blockers.filter(
      (b) => b.description !== indexOrDescription,
    );
  }
  writeState("project.json", project);
  return project;
}

/**
 * Update epic progress.
 */
export function updateEpicProgress(
  epicId: string,
  updates: Partial<ProjectState["progress"][string]>,
): ProjectState {
  const project = getProject();
  project.progress[epicId] = { ...project.progress[epicId], ...updates };
  writeState("project.json", project);
  return project;
}

// =============================================================================
// Tasks
// =============================================================================

/**
 * Get all tasks, optionally filtered.
 */
export function getTasks(filter?: TaskFilter): Task[] {
  const state = readState<TasksState>("tasks.json");
  let tasks = state.tasks;

  if (filter) {
    if (filter.epic_id) {
      tasks = tasks.filter((t) => t.epic_id === filter.epic_id);
    }
    if (filter.feature_id) {
      tasks = tasks.filter((t) => t.feature_id === filter.feature_id);
    }
    if (filter.status) {
      const statuses = Array.isArray(filter.status)
        ? filter.status
        : [filter.status];
      tasks = tasks.filter((t) => statuses.includes(t.status));
    }
    if (filter.type) {
      tasks = tasks.filter((t) => t.type === filter.type);
    }
    if (filter.size) {
      tasks = tasks.filter((t) => t.size === filter.size);
    }
  }

  return tasks;
}

/**
 * Get a single task by ID.
 */
export function getTask(id: string): Task | undefined {
  const state = readState<TasksState>("tasks.json");
  return state.tasks.find((t) => t.id === id);
}

/**
 * Create a new task.
 */
export function createTask(task: Task): Task {
  const state = readState<TasksState>("tasks.json");

  // Check for duplicate ID
  if (state.tasks.some((t) => t.id === task.id)) {
    throw new Error(`Task with ID ${task.id} already exists`);
  }

  state.tasks.push(task);
  writeState("tasks.json", state);
  return task;
}

/**
 * Update an existing task.
 */
export function updateTask(id: string, updates: Partial<Task>): Task {
  const state = readState<TasksState>("tasks.json");
  const index = state.tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    throw new Error(`Task ${id} not found`);
  }

  state.tasks[index] = { ...state.tasks[index], ...updates };
  writeState("tasks.json", state);
  return state.tasks[index];
}

/**
 * Delete a task.
 */
export function deleteTask(id: string): boolean {
  const state = readState<TasksState>("tasks.json");
  const initialLength = state.tasks.length;
  state.tasks = state.tasks.filter((t) => t.id !== id);

  if (state.tasks.length < initialLength) {
    writeState("tasks.json", state);
    return true;
  }
  return false;
}

/**
 * Get the next pending task for a feature.
 */
export function getNextTask(
  epicId?: string,
  featureId?: string,
): Task | undefined {
  const tasks = getTasks({
    epic_id: epicId,
    feature_id: featureId,
    status: "pending",
  });
  return tasks[0];
}

// =============================================================================
// Bugs
// =============================================================================

/**
 * Get all bugs, optionally filtered.
 */
export function getBugs(filter?: BugFilter): Bug[] {
  const state = readState<BugsState>("bugs.json");
  let bugs = state.bugs;

  if (filter) {
    if (filter.epic_id) {
      bugs = bugs.filter((b) => b.epic_id === filter.epic_id);
    }
    if (filter.feature_id) {
      bugs = bugs.filter((b) => b.feature_id === filter.feature_id);
    }
    if (filter.status) {
      const statuses = Array.isArray(filter.status)
        ? filter.status
        : [filter.status];
      bugs = bugs.filter((b) => statuses.includes(b.status));
    }
    if (filter.severity) {
      const severities = Array.isArray(filter.severity)
        ? filter.severity
        : [filter.severity];
      bugs = bugs.filter((b) => severities.includes(b.severity));
    }
    if (filter.found_in) {
      bugs = bugs.filter((b) => b.found_in === filter.found_in);
    }
  }

  return bugs;
}

/**
 * Get a single bug by ID.
 */
export function getBug(id: string): Bug | undefined {
  const state = readState<BugsState>("bugs.json");
  return state.bugs.find((b) => b.id === id);
}

/**
 * Create a new bug.
 */
export function createBug(bug: Bug): Bug {
  const state = readState<BugsState>("bugs.json");

  if (state.bugs.some((b) => b.id === bug.id)) {
    throw new Error(`Bug with ID ${bug.id} already exists`);
  }

  state.bugs.push(bug);
  writeState("bugs.json", state);
  return bug;
}

/**
 * Update an existing bug.
 */
export function updateBug(id: string, updates: Partial<Bug>): Bug {
  const state = readState<BugsState>("bugs.json");
  const index = state.bugs.findIndex((b) => b.id === id);

  if (index === -1) {
    throw new Error(`Bug ${id} not found`);
  }

  state.bugs[index] = { ...state.bugs[index], ...updates };
  writeState("bugs.json", state);
  return state.bugs[index];
}

/**
 * Get open bugs for a feature.
 */
export function getOpenBugs(epicId?: string, featureId?: string): Bug[] {
  return getBugs({
    epic_id: epicId,
    feature_id: featureId,
    status: "open",
  });
}

// =============================================================================
// Session
// =============================================================================

/**
 * Get the current session state.
 */
export function getSession(): SessionState {
  return readState<SessionState>("session.json");
}

/**
 * Start a new session.
 */
export function startSession(epicId: string, branch: string): SessionState {
  const session: SessionState = {
    $schema: "../core/schemas/session.schema.json",
    started: new Date().toISOString(),
    epic_id: epicId,
    branch: branch,
    active_task: null,
    active_agents: [],
    completed_tasks: [],
    totals: {
      tasks_completed: 0,
      tokens: 0,
      context_percent: 0,
      tool_calls: 0,
    },
    files_read: [],
    notes: [],
  };
  writeState("session.json", session);
  return session;
}

/**
 * Set the active task for the session.
 */
export function setActiveTask(task: SessionState["active_task"]): SessionState {
  const session = getSession();
  session.active_task = task;
  writeState("session.json", session);
  return session;
}

/**
 * Record a completed task in the session.
 */
export function recordTaskCompletion(taskData: SessionTask): SessionState {
  const session = getSession();
  session.completed_tasks.push(taskData);
  session.totals.tasks_completed++;
  session.totals.tokens += taskData.tokens || 0;
  session.totals.tool_calls += taskData.tools || 0;
  session.active_task = null;
  writeState("session.json", session);
  return session;
}

/**
 * Add a file to the files_read list.
 */
export function recordFileRead(filepath: string): SessionState {
  const session = getSession();
  if (!session.files_read.includes(filepath)) {
    session.files_read.push(filepath);
  }
  writeState("session.json", session);
  return session;
}

/**
 * Update session totals.
 */
export function updateSessionTotals(
  totals: Partial<SessionState["totals"]>,
): SessionState {
  const session = getSession();
  session.totals = { ...session.totals, ...totals };
  writeState("session.json", session);
  return session;
}

/**
 * Add a session note.
 */
export function addSessionNote(note: string): SessionState {
  const session = getSession();
  session.notes.push(note);
  writeState("session.json", session);
  return session;
}

/**
 * End the current session and archive it.
 */
export function endSession(durationMinutes?: number): {
  archived: string;
  session: SessionState;
} {
  const session = getSession();
  const archiveDate = new Date().toISOString().split("T")[0];

  // Find next archive number for today
  const archiveDir = path.join(STATE_DIR, "archive");
  if (!fs.existsSync(archiveDir)) {
    fs.mkdirSync(archiveDir, { recursive: true });
  }

  const existingArchives = fs
    .readdirSync(archiveDir)
    .filter((f) => f.startsWith(`session-${archiveDate}`));
  const archiveNum = existingArchives.length + 1;
  const archiveFilename = `session-${archiveDate}-${archiveNum}.json`;

  // Archive current session
  writeState(`archive/${archiveFilename}`, session);

  // Add to metrics
  if (session.epic_id) {
    const metrics = getMetrics();
    metrics.sessions.recent.unshift({
      date: archiveDate,
      epic_id: session.epic_id,
      tasks_completed: session.totals.tasks_completed,
      tokens: session.totals.tokens,
      context_percent: session.totals.context_percent,
      turns: session.completed_tasks.reduce(
        (sum, t) => sum + (t.turns || 0),
        0,
      ),
      duration_minutes: durationMinutes,
      notes: session.notes.join("; "),
    });

    // Keep only last 20 sessions
    metrics.sessions.recent = metrics.sessions.recent.slice(0, 20);

    // Recalculate averages
    const recentSessions = metrics.sessions.recent;
    if (recentSessions.length > 0) {
      metrics.sessions.averages.tasks_per_session =
        recentSessions.reduce((sum, s) => sum + (s.tasks_completed || 0), 0) /
        recentSessions.length;
      metrics.sessions.averages.tokens_per_session =
        recentSessions.reduce((sum, s) => sum + (s.tokens || 0), 0) /
        recentSessions.length;
      const totalTasks = recentSessions.reduce(
        (sum, s) => sum + (s.tasks_completed || 0),
        0,
      );
      const totalTokens = recentSessions.reduce(
        (sum, s) => sum + (s.tokens || 0),
        0,
      );
      metrics.sessions.averages.tokens_per_task =
        totalTasks > 0 ? totalTokens / totalTasks : 0;
    }

    writeState("metrics.json", metrics);
  }

  // Reset session
  const newSession = startSession("", "");
  newSession.started = null;
  newSession.epic_id = null;
  newSession.branch = null;
  writeState("session.json", newSession);

  return { archived: archiveFilename, session };
}

// =============================================================================
// Metrics
// =============================================================================

/**
 * Get metrics state.
 */
export function getMetrics(): MetricsState {
  return readState<MetricsState>("metrics.json");
}

/**
 * Update metrics state.
 */
export function updateMetrics(updates: Partial<MetricsState>): MetricsState {
  const metrics = getMetrics();
  const updated = { ...metrics, ...updates } as MetricsState;
  writeState("metrics.json", updated);
  return updated;
}

/**
 * Record task metrics by type and size.
 */
export function recordTaskMetrics(task: Task): void {
  const metrics = getMetrics();

  if (task.type && task.metrics?.tokens) {
    if (!metrics.by_task_type[task.type]) {
      metrics.by_task_type[task.type] = {
        count: 0,
        avg_tokens: 0,
        avg_turns: 0,
      };
    }
    const typeMetrics = metrics.by_task_type[task.type];
    const newCount = typeMetrics.count + 1;
    typeMetrics.avg_tokens =
      ((typeMetrics.avg_tokens || 0) * typeMetrics.count +
        task.metrics.tokens) /
      newCount;
    typeMetrics.avg_turns =
      ((typeMetrics.avg_turns || 0) * typeMetrics.count +
        (task.metrics.turns || 0)) /
      newCount;
    typeMetrics.count = newCount;
  }

  if (task.size && task.metrics?.tokens) {
    if (!metrics.by_task_size[task.size]) {
      metrics.by_task_size[task.size] = { count: 0, avg_tokens: 0 };
    }
    const sizeMetrics = metrics.by_task_size[task.size];
    const newCount = sizeMetrics.count + 1;
    sizeMetrics.avg_tokens =
      ((sizeMetrics.avg_tokens || 0) * sizeMetrics.count +
        task.metrics.tokens) /
      newCount;
    sizeMetrics.count = newCount;
  }

  if (task.metrics?.agent) {
    if (!metrics.tools.agents[task.metrics.agent]) {
      metrics.tools.agents[task.metrics.agent] = {
        uses: 0,
        bugs_caught: 0,
        avg_tokens: 0,
      };
    }
    const agentMetrics = metrics.tools.agents[task.metrics.agent];
    agentMetrics.uses++;
    const tokens = task.metrics.tokens || 0;
    agentMetrics.avg_tokens =
      ((agentMetrics.avg_tokens || 0) * (agentMetrics.uses - 1) + tokens) /
      agentMetrics.uses;
  }

  writeState("metrics.json", metrics);
}

/**
 * Add a signal (green/yellow/red).
 */
export function addSignal(
  type: "green" | "yellow" | "red",
  message: string,
): MetricsState {
  const metrics = getMetrics();
  if (!metrics.signals[type].includes(message)) {
    metrics.signals[type].push(message);
  }
  writeState("metrics.json", metrics);
  return metrics;
}

/**
 * Remove a signal.
 */
export function removeSignal(
  type: "green" | "yellow" | "red",
  message: string,
): MetricsState {
  const metrics = getMetrics();
  metrics.signals[type] = metrics.signals[type].filter((s) => s !== message);
  writeState("metrics.json", metrics);
  return metrics;
}

// =============================================================================
// Learnings
// =============================================================================

/**
 * Get the learnings index.
 */
export function getLearningsIndex(): LearningsIndex {
  return readState<LearningsIndex>("learnings-index.json");
}

/**
 * Search learnings by text query.
 */
export function searchLearnings(query: string): LearningEntry[] {
  const index = getLearningsIndex();
  const lowerQuery = query.toLowerCase();

  return index.entries.filter(
    (entry) =>
      entry.title.toLowerCase().includes(lowerQuery) ||
      entry.summary?.toLowerCase().includes(lowerQuery) ||
      entry.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
      entry.key_points?.some((point) =>
        point.toLowerCase().includes(lowerQuery),
      ),
  );
}

/**
 * Get learnings by category.
 */
export function getLearningsByCategory(category: string): LearningEntry[] {
  const index = getLearningsIndex();
  const entryIds = index.by_category[category] || [];
  return index.entries.filter((e) => entryIds.includes(e.id));
}

/**
 * Get learnings by tag.
 */
export function getLearningsByTag(tag: string): LearningEntry[] {
  const index = getLearningsIndex();
  const entryIds = index.by_tag[tag] || [];
  return index.entries.filter((e) => entryIds.includes(e.id));
}

/**
 * Add a learning entry to the index.
 */
export function addLearningEntry(entry: LearningEntry): LearningsIndex {
  const index = getLearningsIndex();

  // Remove existing entry with same ID
  index.entries = index.entries.filter((e) => e.id !== entry.id);
  index.entries.push(entry);

  // Update category index
  if (!index.by_category[entry.category]) {
    index.by_category[entry.category] = [];
  }
  if (!index.by_category[entry.category].includes(entry.id)) {
    index.by_category[entry.category].push(entry.id);
  }

  // Update tag index
  if (entry.tags) {
    for (const tag of entry.tags) {
      if (!index.by_tag[tag]) {
        index.by_tag[tag] = [];
      }
      if (!index.by_tag[tag].includes(entry.id)) {
        index.by_tag[tag].push(entry.id);
      }
    }
  }

  writeState("learnings-index.json", index);
  return index;
}

// =============================================================================
// Generic Query Function
// =============================================================================

/**
 * Generic query function for multi-agent use.
 * Supports basic filtering on any collection.
 */
export function query<T>(
  collection: "tasks" | "bugs" | "learnings" | "sessions",
  filter: Record<string, unknown>,
): T[] {
  let data: unknown[];

  switch (collection) {
    case "tasks":
      data = getTasks();
      break;
    case "bugs":
      data = getBugs();
      break;
    case "learnings":
      data = getLearningsIndex().entries;
      break;
    case "sessions":
      data = getMetrics().sessions.recent;
      break;
    default:
      throw new Error(`Unknown collection: ${collection}`);
  }

  // Apply filters
  return data.filter((item) => {
    for (const [key, value] of Object.entries(filter)) {
      const itemValue = (item as Record<string, unknown>)[key];

      if (Array.isArray(value)) {
        if (!value.includes(itemValue)) return false;
      } else if (itemValue !== value) {
        return false;
      }
    }
    return true;
  }) as T[];
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Deep merge two objects.
 */
function deepMerge<T extends Record<string, unknown>>(
  target: T,
  source: Partial<T>,
): T {
  const result = { ...target };

  for (const key of Object.keys(source) as Array<keyof T>) {
    const sourceValue = source[key];
    const targetValue = target[key];

    if (
      sourceValue !== null &&
      typeof sourceValue === "object" &&
      !Array.isArray(sourceValue) &&
      targetValue !== null &&
      typeof targetValue === "object" &&
      !Array.isArray(targetValue)
    ) {
      result[key] = deepMerge(
        targetValue as Record<string, unknown>,
        sourceValue as Record<string, unknown>,
      ) as T[keyof T];
    } else if (sourceValue !== undefined) {
      result[key] = sourceValue as T[keyof T];
    }
  }

  return result;
}

/**
 * Get schema path for validation.
 */
export function getSchemaPath(schemaName: string): string {
  return path.join(SCHEMAS_DIR, `${schemaName}.schema.json`);
}

/**
 * Initialize empty state files if they don't exist.
 */
export function initializeState(): void {
  const defaults: Record<string, unknown> = {
    "project.json": {
      $schema: "../core/schemas/project.schema.json",
      version: "3.0.0",
      active: {
        epic_id: null,
        feature_id: null,
        task_id: null,
        branch: null,
        session_started: null,
      },
      blockers: [],
      progress: {},
      notes: [],
    },
    "session.json": {
      $schema: "../core/schemas/session.schema.json",
      started: null,
      epic_id: null,
      branch: null,
      active_task: null,
      active_agents: [],
      completed_tasks: [],
      totals: {
        tasks_completed: 0,
        tokens: 0,
        context_percent: 0,
        tool_calls: 0,
      },
      files_read: [],
      notes: [],
    },
    "tasks.json": {
      $schema: "../core/schemas/tasks.schema.json",
      tasks: [],
    },
    "bugs.json": {
      $schema: "../core/schemas/bugs.schema.json",
      bugs: [],
    },
    "metrics.json": {
      $schema: "../core/schemas/metrics.schema.json",
      sessions: {
        recent: [],
        averages: {
          tasks_per_session: 0,
          tokens_per_session: 0,
          tokens_per_task: 0,
        },
      },
      by_task_type: {},
      by_task_size: {},
      tools: {
        frequency: {},
        agents: {},
      },
      quality: {
        bugs_by_stage: {},
        bugs_by_severity: {},
      },
      signals: {
        green: [],
        yellow: [],
        red: [],
      },
    },
    "learnings-index.json": {
      $schema: "../core/schemas/learnings.schema.json",
      entries: [],
      by_category: {},
      by_tag: {},
    },
  };

  for (const [filename, defaultData] of Object.entries(defaults)) {
    if (!stateExists(filename)) {
      writeState(filename, defaultData);
    }
  }
}
