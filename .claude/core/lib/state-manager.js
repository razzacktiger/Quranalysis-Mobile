"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.readState = readState;
exports.writeState = writeState;
exports.stateExists = stateExists;
exports.getProject = getProject;
exports.updateProject = updateProject;
exports.setActiveWork = setActiveWork;
exports.addBlocker = addBlocker;
exports.removeBlocker = removeBlocker;
exports.updateEpicProgress = updateEpicProgress;
exports.getTasks = getTasks;
exports.getTask = getTask;
exports.createTask = createTask;
exports.updateTask = updateTask;
exports.deleteTask = deleteTask;
exports.getNextTask = getNextTask;
exports.getBugs = getBugs;
exports.getBug = getBug;
exports.createBug = createBug;
exports.updateBug = updateBug;
exports.getOpenBugs = getOpenBugs;
exports.getSession = getSession;
exports.startSession = startSession;
exports.setActiveTask = setActiveTask;
exports.recordTaskCompletion = recordTaskCompletion;
exports.recordFileRead = recordFileRead;
exports.updateSessionTotals = updateSessionTotals;
exports.addSessionNote = addSessionNote;
exports.endSession = endSession;
exports.getMetrics = getMetrics;
exports.updateMetrics = updateMetrics;
exports.recordTaskMetrics = recordTaskMetrics;
exports.addSignal = addSignal;
exports.removeSignal = removeSignal;
exports.getLearningsIndex = getLearningsIndex;
exports.searchLearnings = searchLearnings;
exports.getLearningsByCategory = getLearningsByCategory;
exports.getLearningsByTag = getLearningsByTag;
exports.addLearningEntry = addLearningEntry;
exports.query = query;
exports.getSchemaPath = getSchemaPath;
exports.initializeState = initializeState;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// =============================================================================
// Configuration
// =============================================================================
const STATE_DIR = path.join(__dirname, '../../state');
const SCHEMAS_DIR = path.join(__dirname, '../schemas');
// =============================================================================
// Core Read/Write Functions
// =============================================================================
/**
 * Read a JSON state file.
 */
function readState(filename) {
    const filepath = path.join(STATE_DIR, filename);
    if (!fs.existsSync(filepath)) {
        throw new Error(`State file not found: ${filepath}`);
    }
    const content = fs.readFileSync(filepath, 'utf-8');
    return JSON.parse(content);
}
/**
 * Write a JSON state file with pretty formatting.
 */
function writeState(filename, data) {
    const filepath = path.join(STATE_DIR, filename);
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2) + '\n');
}
/**
 * Check if a state file exists.
 */
function stateExists(filename) {
    return fs.existsSync(path.join(STATE_DIR, filename));
}
// =============================================================================
// Project State
// =============================================================================
/**
 * Get the current project state.
 */
function getProject() {
    return readState('project.json');
}
/**
 * Update project state with partial updates.
 */
function updateProject(updates) {
    const project = getProject();
    const updated = { ...project, ...updates };
    writeState('project.json', updated);
    return updated;
}
/**
 * Set the active work context.
 */
function setActiveWork(active) {
    const project = getProject();
    project.active = { ...project.active, ...active };
    writeState('project.json', project);
    return project;
}
/**
 * Add a blocker.
 */
function addBlocker(description, severity) {
    const project = getProject();
    project.blockers.push({
        description,
        severity,
        created_at: new Date().toISOString().split('T')[0]
    });
    writeState('project.json', project);
    return project;
}
/**
 * Remove a blocker by index or description.
 */
function removeBlocker(indexOrDescription) {
    const project = getProject();
    if (typeof indexOrDescription === 'number') {
        project.blockers.splice(indexOrDescription, 1);
    }
    else {
        project.blockers = project.blockers.filter(b => b.description !== indexOrDescription);
    }
    writeState('project.json', project);
    return project;
}
/**
 * Update epic progress.
 */
function updateEpicProgress(epicId, updates) {
    const project = getProject();
    project.progress[epicId] = { ...project.progress[epicId], ...updates };
    writeState('project.json', project);
    return project;
}
// =============================================================================
// Tasks
// =============================================================================
/**
 * Get all tasks, optionally filtered.
 */
function getTasks(filter) {
    const state = readState('tasks.json');
    let tasks = state.tasks;
    if (filter) {
        if (filter.epic_id) {
            tasks = tasks.filter(t => t.epic_id === filter.epic_id);
        }
        if (filter.feature_id) {
            tasks = tasks.filter(t => t.feature_id === filter.feature_id);
        }
        if (filter.status) {
            const statuses = Array.isArray(filter.status) ? filter.status : [filter.status];
            tasks = tasks.filter(t => statuses.includes(t.status));
        }
        if (filter.type) {
            tasks = tasks.filter(t => t.type === filter.type);
        }
        if (filter.size) {
            tasks = tasks.filter(t => t.size === filter.size);
        }
    }
    return tasks;
}
/**
 * Get a single task by ID.
 */
function getTask(id) {
    const state = readState('tasks.json');
    return state.tasks.find(t => t.id === id);
}
/**
 * Create a new task.
 */
function createTask(task) {
    const state = readState('tasks.json');
    // Check for duplicate ID
    if (state.tasks.some(t => t.id === task.id)) {
        throw new Error(`Task with ID ${task.id} already exists`);
    }
    state.tasks.push(task);
    writeState('tasks.json', state);
    return task;
}
/**
 * Update an existing task.
 */
function updateTask(id, updates) {
    const state = readState('tasks.json');
    const index = state.tasks.findIndex(t => t.id === id);
    if (index === -1) {
        throw new Error(`Task ${id} not found`);
    }
    state.tasks[index] = { ...state.tasks[index], ...updates };
    writeState('tasks.json', state);
    return state.tasks[index];
}
/**
 * Delete a task.
 */
function deleteTask(id) {
    const state = readState('tasks.json');
    const initialLength = state.tasks.length;
    state.tasks = state.tasks.filter(t => t.id !== id);
    if (state.tasks.length < initialLength) {
        writeState('tasks.json', state);
        return true;
    }
    return false;
}
/**
 * Get the next pending task for a feature.
 */
function getNextTask(epicId, featureId) {
    const tasks = getTasks({
        epic_id: epicId,
        feature_id: featureId,
        status: 'pending'
    });
    return tasks[0];
}
// =============================================================================
// Bugs
// =============================================================================
/**
 * Get all bugs, optionally filtered.
 */
function getBugs(filter) {
    const state = readState('bugs.json');
    let bugs = state.bugs;
    if (filter) {
        if (filter.epic_id) {
            bugs = bugs.filter(b => b.epic_id === filter.epic_id);
        }
        if (filter.feature_id) {
            bugs = bugs.filter(b => b.feature_id === filter.feature_id);
        }
        if (filter.status) {
            const statuses = Array.isArray(filter.status) ? filter.status : [filter.status];
            bugs = bugs.filter(b => statuses.includes(b.status));
        }
        if (filter.severity) {
            const severities = Array.isArray(filter.severity) ? filter.severity : [filter.severity];
            bugs = bugs.filter(b => severities.includes(b.severity));
        }
        if (filter.found_in) {
            bugs = bugs.filter(b => b.found_in === filter.found_in);
        }
    }
    return bugs;
}
/**
 * Get a single bug by ID.
 */
function getBug(id) {
    const state = readState('bugs.json');
    return state.bugs.find(b => b.id === id);
}
/**
 * Create a new bug.
 */
function createBug(bug) {
    const state = readState('bugs.json');
    if (state.bugs.some(b => b.id === bug.id)) {
        throw new Error(`Bug with ID ${bug.id} already exists`);
    }
    state.bugs.push(bug);
    writeState('bugs.json', state);
    return bug;
}
/**
 * Update an existing bug.
 */
function updateBug(id, updates) {
    const state = readState('bugs.json');
    const index = state.bugs.findIndex(b => b.id === id);
    if (index === -1) {
        throw new Error(`Bug ${id} not found`);
    }
    state.bugs[index] = { ...state.bugs[index], ...updates };
    writeState('bugs.json', state);
    return state.bugs[index];
}
/**
 * Get open bugs for a feature.
 */
function getOpenBugs(epicId, featureId) {
    return getBugs({
        epic_id: epicId,
        feature_id: featureId,
        status: 'open'
    });
}
// =============================================================================
// Session
// =============================================================================
/**
 * Get the current session state.
 */
function getSession() {
    return readState('session.json');
}
/**
 * Start a new session.
 */
function startSession(epicId, branch) {
    const session = {
        $schema: '../core/schemas/session.schema.json',
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
            tool_calls: 0
        },
        files_read: [],
        notes: []
    };
    writeState('session.json', session);
    return session;
}
/**
 * Set the active task for the session.
 */
function setActiveTask(task) {
    const session = getSession();
    session.active_task = task;
    writeState('session.json', session);
    return session;
}
/**
 * Record a completed task in the session.
 */
function recordTaskCompletion(taskData) {
    const session = getSession();
    session.completed_tasks.push(taskData);
    session.totals.tasks_completed++;
    session.totals.tokens += taskData.tokens || 0;
    session.totals.tool_calls += taskData.tools || 0;
    session.active_task = null;
    writeState('session.json', session);
    return session;
}
/**
 * Add a file to the files_read list.
 */
function recordFileRead(filepath) {
    const session = getSession();
    if (!session.files_read.includes(filepath)) {
        session.files_read.push(filepath);
    }
    writeState('session.json', session);
    return session;
}
/**
 * Update session totals.
 */
function updateSessionTotals(totals) {
    const session = getSession();
    session.totals = { ...session.totals, ...totals };
    writeState('session.json', session);
    return session;
}
/**
 * Add a session note.
 */
function addSessionNote(note) {
    const session = getSession();
    session.notes.push(note);
    writeState('session.json', session);
    return session;
}
/**
 * End the current session and archive it.
 */
function endSession(durationMinutes) {
    const session = getSession();
    const archiveDate = new Date().toISOString().split('T')[0];
    // Find next archive number for today
    const archiveDir = path.join(STATE_DIR, 'archive');
    if (!fs.existsSync(archiveDir)) {
        fs.mkdirSync(archiveDir, { recursive: true });
    }
    const existingArchives = fs.readdirSync(archiveDir)
        .filter(f => f.startsWith(`session-${archiveDate}`));
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
            turns: session.completed_tasks.reduce((sum, t) => sum + (t.turns || 0), 0),
            duration_minutes: durationMinutes,
            notes: session.notes.join('; ')
        });
        // Keep only last 20 sessions
        metrics.sessions.recent = metrics.sessions.recent.slice(0, 20);
        // Recalculate averages
        const recentSessions = metrics.sessions.recent;
        if (recentSessions.length > 0) {
            metrics.sessions.averages.tasks_per_session =
                recentSessions.reduce((sum, s) => sum + (s.tasks_completed || 0), 0) / recentSessions.length;
            metrics.sessions.averages.tokens_per_session =
                recentSessions.reduce((sum, s) => sum + (s.tokens || 0), 0) / recentSessions.length;
            const totalTasks = recentSessions.reduce((sum, s) => sum + (s.tasks_completed || 0), 0);
            const totalTokens = recentSessions.reduce((sum, s) => sum + (s.tokens || 0), 0);
            metrics.sessions.averages.tokens_per_task = totalTasks > 0 ? totalTokens / totalTasks : 0;
        }
        writeState('metrics.json', metrics);
    }
    // Reset session
    const newSession = startSession('', '');
    newSession.started = null;
    newSession.epic_id = null;
    newSession.branch = null;
    writeState('session.json', newSession);
    return { archived: archiveFilename, session };
}
// =============================================================================
// Metrics
// =============================================================================
/**
 * Get metrics state.
 */
function getMetrics() {
    return readState('metrics.json');
}
/**
 * Update metrics state.
 */
function updateMetrics(updates) {
    const metrics = getMetrics();
    const updated = { ...metrics, ...updates };
    writeState('metrics.json', updated);
    return updated;
}
/**
 * Record task metrics by type and size.
 */
function recordTaskMetrics(task) {
    const metrics = getMetrics();
    if (task.type && task.metrics?.tokens) {
        if (!metrics.by_task_type[task.type]) {
            metrics.by_task_type[task.type] = { count: 0, avg_tokens: 0, avg_turns: 0 };
        }
        const typeMetrics = metrics.by_task_type[task.type];
        const newCount = typeMetrics.count + 1;
        typeMetrics.avg_tokens = ((typeMetrics.avg_tokens || 0) * typeMetrics.count + task.metrics.tokens) / newCount;
        typeMetrics.avg_turns = ((typeMetrics.avg_turns || 0) * typeMetrics.count + (task.metrics.turns || 0)) / newCount;
        typeMetrics.count = newCount;
    }
    if (task.size && task.metrics?.tokens) {
        if (!metrics.by_task_size[task.size]) {
            metrics.by_task_size[task.size] = { count: 0, avg_tokens: 0 };
        }
        const sizeMetrics = metrics.by_task_size[task.size];
        const newCount = sizeMetrics.count + 1;
        sizeMetrics.avg_tokens = ((sizeMetrics.avg_tokens || 0) * sizeMetrics.count + task.metrics.tokens) / newCount;
        sizeMetrics.count = newCount;
    }
    if (task.metrics?.agent) {
        if (!metrics.tools.agents[task.metrics.agent]) {
            metrics.tools.agents[task.metrics.agent] = { uses: 0, bugs_caught: 0, avg_tokens: 0 };
        }
        const agentMetrics = metrics.tools.agents[task.metrics.agent];
        agentMetrics.uses++;
        const tokens = task.metrics.tokens || 0;
        agentMetrics.avg_tokens = ((agentMetrics.avg_tokens || 0) * (agentMetrics.uses - 1) + tokens) / agentMetrics.uses;
    }
    writeState('metrics.json', metrics);
}
/**
 * Add a signal (green/yellow/red).
 */
function addSignal(type, message) {
    const metrics = getMetrics();
    if (!metrics.signals[type].includes(message)) {
        metrics.signals[type].push(message);
    }
    writeState('metrics.json', metrics);
    return metrics;
}
/**
 * Remove a signal.
 */
function removeSignal(type, message) {
    const metrics = getMetrics();
    metrics.signals[type] = metrics.signals[type].filter(s => s !== message);
    writeState('metrics.json', metrics);
    return metrics;
}
// =============================================================================
// Learnings
// =============================================================================
/**
 * Get the learnings index.
 */
function getLearningsIndex() {
    return readState('learnings-index.json');
}
/**
 * Search learnings by text query.
 */
function searchLearnings(query) {
    const index = getLearningsIndex();
    const lowerQuery = query.toLowerCase();
    return index.entries.filter(entry => entry.title.toLowerCase().includes(lowerQuery) ||
        entry.summary?.toLowerCase().includes(lowerQuery) ||
        entry.tags?.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
        entry.key_points?.some(point => point.toLowerCase().includes(lowerQuery)));
}
/**
 * Get learnings by category.
 */
function getLearningsByCategory(category) {
    const index = getLearningsIndex();
    const entryIds = index.by_category[category] || [];
    return index.entries.filter(e => entryIds.includes(e.id));
}
/**
 * Get learnings by tag.
 */
function getLearningsByTag(tag) {
    const index = getLearningsIndex();
    const entryIds = index.by_tag[tag] || [];
    return index.entries.filter(e => entryIds.includes(e.id));
}
/**
 * Add a learning entry to the index.
 */
function addLearningEntry(entry) {
    const index = getLearningsIndex();
    // Remove existing entry with same ID
    index.entries = index.entries.filter(e => e.id !== entry.id);
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
    writeState('learnings-index.json', index);
    return index;
}
// =============================================================================
// Generic Query Function
// =============================================================================
/**
 * Generic query function for multi-agent use.
 * Supports basic filtering on any collection.
 */
function query(collection, filter) {
    let data;
    switch (collection) {
        case 'tasks':
            data = getTasks();
            break;
        case 'bugs':
            data = getBugs();
            break;
        case 'learnings':
            data = getLearningsIndex().entries;
            break;
        case 'sessions':
            data = getMetrics().sessions.recent;
            break;
        default:
            throw new Error(`Unknown collection: ${collection}`);
    }
    // Apply filters
    return data.filter(item => {
        for (const [key, value] of Object.entries(filter)) {
            const itemValue = item[key];
            if (Array.isArray(value)) {
                if (!value.includes(itemValue))
                    return false;
            }
            else if (itemValue !== value) {
                return false;
            }
        }
        return true;
    });
}
// =============================================================================
// Utility Functions
// =============================================================================
/**
 * Deep merge two objects.
 */
function deepMerge(target, source) {
    const result = { ...target };
    for (const key of Object.keys(source)) {
        const sourceValue = source[key];
        const targetValue = target[key];
        if (sourceValue !== null &&
            typeof sourceValue === 'object' &&
            !Array.isArray(sourceValue) &&
            targetValue !== null &&
            typeof targetValue === 'object' &&
            !Array.isArray(targetValue)) {
            result[key] = deepMerge(targetValue, sourceValue);
        }
        else if (sourceValue !== undefined) {
            result[key] = sourceValue;
        }
    }
    return result;
}
/**
 * Get schema path for validation.
 */
function getSchemaPath(schemaName) {
    return path.join(SCHEMAS_DIR, `${schemaName}.schema.json`);
}
/**
 * Initialize empty state files if they don't exist.
 */
function initializeState() {
    const defaults = {
        'project.json': {
            $schema: '../core/schemas/project.schema.json',
            version: '3.0.0',
            active: {
                epic_id: null,
                feature_id: null,
                task_id: null,
                branch: null,
                session_started: null
            },
            blockers: [],
            progress: {},
            notes: []
        },
        'session.json': {
            $schema: '../core/schemas/session.schema.json',
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
                tool_calls: 0
            },
            files_read: [],
            notes: []
        },
        'tasks.json': {
            $schema: '../core/schemas/tasks.schema.json',
            tasks: []
        },
        'bugs.json': {
            $schema: '../core/schemas/bugs.schema.json',
            bugs: []
        },
        'metrics.json': {
            $schema: '../core/schemas/metrics.schema.json',
            sessions: {
                recent: [],
                averages: {
                    tasks_per_session: 0,
                    tokens_per_session: 0,
                    tokens_per_task: 0
                }
            },
            by_task_type: {},
            by_task_size: {},
            tools: {
                frequency: {},
                agents: {}
            },
            quality: {
                bugs_by_stage: {},
                bugs_by_severity: {}
            },
            signals: {
                green: [],
                yellow: [],
                red: []
            }
        },
        'learnings-index.json': {
            $schema: '../core/schemas/learnings.schema.json',
            entries: [],
            by_category: {},
            by_tag: {}
        }
    };
    for (const [filename, defaultData] of Object.entries(defaults)) {
        if (!stateExists(filename)) {
            writeState(filename, defaultData);
        }
    }
}
