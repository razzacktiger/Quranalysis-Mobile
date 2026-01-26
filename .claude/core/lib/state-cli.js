#!/usr/bin/env node
"use strict";
/**
 * State CLI - Command-line interface for Claude workflow state management
 *
 * This CLI wraps the state-manager functions for use in scripts and automation.
 * After any state mutation, it automatically regenerates human-readable views.
 *
 * Usage:
 *   node state-cli.js <command> [options]
 *
 * Examples:
 *   node state-cli.js get-status
 *   node state-cli.js get-task 5.1.1
 *   node state-cli.js update-task 5.1.1 --status complete --tokens 1500
 *   node state-cli.js regenerate-views
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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const state = __importStar(require("./state-manager"));
// =============================================================================
// Configuration
// =============================================================================
const LIB_DIR = __dirname;
const CLAUDE_DIR = path.join(LIB_DIR, '../..');
const STATUS_DIR = path.join(CLAUDE_DIR, 'status');
const META_SESSION_DIR = path.join(CLAUDE_DIR, 'meta', 'session');
// =============================================================================
// View Generation
// =============================================================================
/**
 * Generate status/CURRENT.md from state/project.json
 */
function generateStatusMarkdown(project) {
    const lines = [
        '# Current Status',
        '',
        '> **Auto-generated from `state/project.json`** - This is a human-readable view of the JSON state.',
        '',
        '## Active Work',
        '',
        '| Field | Value |',
        '|-------|-------|',
        `| **Epic** | ${project.active.epic_id || 'None'} |`,
        `| **Feature** | ${project.active.feature_id || 'None'} |`,
        `| **Task** | ${project.active.task_id || 'None active'} |`,
        `| **Branch** | ${project.active.branch ? '`' + project.active.branch + '`' : 'None'} |`,
        `| **Session Started** | ${project.active.session_started || 'Not started'} |`,
        '',
        '## Blockers',
        ''
    ];
    if (project.blockers.length === 0) {
        lines.push('_No blockers currently._');
    }
    else {
        lines.push('| Description | Severity | Created |');
        lines.push('|-------------|----------|---------|');
        for (const blocker of project.blockers) {
            lines.push(`| ${blocker.description} | ${blocker.severity || '-'} | ${blocker.created_at || '-'} |`);
        }
    }
    lines.push('');
    lines.push('## Epic Progress');
    lines.push('');
    lines.push('| Epic | Status | Progress |');
    lines.push('|------|--------|----------|');
    for (const [epicId, progress] of Object.entries(project.progress)) {
        const statusEmoji = progress.status === 'archived' ? '✅ Archived' :
            progress.status === 'complete' ? '✅ Complete' :
                progress.status === 'active' ? '🔄 Active' :
                    progress.status === 'blocked' ? '🚫 Blocked' : progress.status;
        const percent = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;
        lines.push(`| ${epicId} | ${statusEmoji} | ${progress.completed}/${progress.total} (${percent}%) |`);
    }
    lines.push('');
    lines.push('## Project Notes');
    lines.push('');
    if (project.notes.length === 0) {
        lines.push('_No notes._');
    }
    else {
        for (const note of project.notes) {
            lines.push(`- ${note}`);
        }
    }
    lines.push('');
    lines.push('---');
    lines.push('');
    lines.push('## Quick Actions');
    lines.push('');
    lines.push('- **Start new task:** `/next-task`');
    lines.push('- **View tasks:** `state/tasks.json`');
    lines.push('- **View bugs:** `state/bugs.json`');
    lines.push('- **End session:** `/end-session`');
    lines.push('');
    lines.push('---');
    lines.push('');
    lines.push('_Last updated: See `state/project.json` for authoritative data._');
    return lines.join('\n') + '\n';
}
/**
 * Generate meta/session/CURRENT.md from state/session.json
 */
function generateSessionMarkdown(session) {
    const lines = [
        '# Current Session',
        '',
        '> **Auto-generated from `state/session.json`** - This is a human-readable view of the JSON state.',
        '',
        '## Session Info',
        '',
        '| Field | Value |',
        '|-------|-------|',
        `| **Started** | ${session.started || 'Not started'} |`,
        `| **Epic** | ${session.epic_id || '-'} |`,
        `| **Branch** | ${session.branch || '-'} |`,
        `| **Active Task** | ${session.active_task ? session.active_task.id + ' - ' + session.active_task.name : 'None'} |`,
        '',
        '## Active Agents',
        ''
    ];
    if (session.active_agents.length === 0) {
        lines.push('_No agents currently running._');
    }
    else {
        lines.push('| Agent | Task | Started |');
        lines.push('|-------|------|---------|');
        for (const agent of session.active_agents) {
            lines.push(`| ${agent.name} | ${agent.task_id || '-'} | ${agent.started_at || '-'} |`);
        }
    }
    lines.push('');
    lines.push('## Completed Tasks This Session');
    lines.push('');
    lines.push('| Task | Tokens | Turns | Tools | Agent | Bugs |');
    lines.push('|------|--------|-------|-------|-------|------|');
    if (session.completed_tasks.length === 0) {
        lines.push('| _None yet_ | - | - | - | - | - |');
    }
    else {
        for (const task of session.completed_tasks) {
            lines.push(`| ${task.task_id} | ${task.tokens || '-'} | ${task.turns || '-'} | ${task.tools || '-'} | ${task.agent || '-'} | ${task.bugs_caught || 0} |`);
        }
    }
    lines.push('');
    lines.push('## Running Totals');
    lines.push('');
    lines.push('| Metric | Value |');
    lines.push('|--------|-------|');
    lines.push(`| Tasks Completed | ${session.totals.tasks_completed} |`);
    lines.push(`| Tokens Used | ${session.totals.tokens} |`);
    lines.push(`| Context % | ${session.totals.context_percent}% |`);
    lines.push(`| Tool Calls | ${session.totals.tool_calls} |`);
    lines.push('');
    lines.push('## Files Read This Session');
    lines.push('');
    if (session.files_read.length === 0) {
        lines.push('_No files tracked yet._');
    }
    else {
        for (const file of session.files_read.slice(0, 20)) {
            lines.push(`- \`${file}\``);
        }
        if (session.files_read.length > 20) {
            lines.push(`- _...and ${session.files_read.length - 20} more_`);
        }
    }
    lines.push('');
    lines.push('## Session Notes');
    lines.push('');
    if (session.notes.length === 0) {
        lines.push('_No notes yet._');
    }
    else {
        for (const note of session.notes) {
            lines.push(`- ${note}`);
        }
    }
    lines.push('');
    lines.push('---');
    lines.push('');
    lines.push('## Session Controls');
    lines.push('');
    lines.push('- **Start session:** `/start-session [epic_id]`');
    lines.push('- **Dispatch agent:** `/agent-dispatch [task_id]`');
    lines.push('- **Complete task:** `/complete-task`');
    lines.push('- **End session:** `/end-session`');
    lines.push('');
    lines.push('---');
    lines.push('');
    lines.push('_Source of truth: `state/session.json`_');
    return lines.join('\n') + '\n';
}
/**
 * Regenerate all human-readable view files from JSON state
 */
function regenerateViews() {
    // Ensure directories exist
    if (!fs.existsSync(STATUS_DIR)) {
        fs.mkdirSync(STATUS_DIR, { recursive: true });
    }
    if (!fs.existsSync(META_SESSION_DIR)) {
        fs.mkdirSync(META_SESSION_DIR, { recursive: true });
    }
    // Generate status/CURRENT.md from state/project.json
    const project = state.getProject();
    const statusMd = generateStatusMarkdown(project);
    fs.writeFileSync(path.join(STATUS_DIR, 'CURRENT.md'), statusMd);
    console.log('✓ Regenerated status/CURRENT.md');
    // Generate meta/session/CURRENT.md from state/session.json
    const session = state.getSession();
    const sessionMd = generateSessionMarkdown(session);
    fs.writeFileSync(path.join(META_SESSION_DIR, 'CURRENT.md'), sessionMd);
    console.log('✓ Regenerated meta/session/CURRENT.md');
}
// =============================================================================
// CLI Commands
// =============================================================================
function printHelp() {
    console.log(`
State CLI - Claude Workflow State Management

Usage: node state-cli.js <command> [options]

Commands:
  get-status                       Show current project status
  regenerate-views                 Regenerate CURRENT.md files from JSON state

Task Operations:
  get-task <id>                    Get task by ID
  update-task <id> [options]       Update task fields
    --status <status>              pending|in_progress|complete|blocked|cancelled
    --tokens <n>                   Token count
    --tools <n>                    Tool call count
  get-next-task [options]          Get next pending task
    --epic <epic-id>               Filter by epic
  list-tasks [options]             List tasks
    --epic <epic-id>               Filter by epic
    --status <status>              Filter by status

Bug Operations:
  get-bug <id>                     Get bug by ID
  update-bug <id> [options]        Update bug fields
    --status <status>              open|in_progress|fixed|wont_fix|duplicate
  list-bugs [options]              List bugs
    --epic <epic-id>               Filter by epic
    --status <status>              Filter by status

Session Operations:
  start-session <epic-id> <branch> Start a new session
  end-session                      End and archive current session
  record-task <task-id> [options]  Record completed task in session
    --tokens <n>                   Token count
    --tools <n>                    Tool call count

Project Operations:
  set-active [options]             Set active work context
    --epic <epic-id>               Set active epic
    --feature <feature-id>         Set active feature
    --task <task-id>               Set active task

Examples:
  node state-cli.js get-status
  node state-cli.js get-task 5.1.1
  node state-cli.js update-task 5.1.1 --status complete --tokens 1500
  node state-cli.js list-tasks --epic EPIC-5-PROFILE --status pending
  node state-cli.js start-session EPIC-5-PROFILE epic-5-profile
  node state-cli.js regenerate-views
`);
}
function parseArgs(args) {
    const command = args[0] || 'help';
    const positional = [];
    const options = {};
    for (let i = 1; i < args.length; i++) {
        const arg = args[i];
        if (arg.startsWith('--')) {
            const key = arg.slice(2);
            const value = args[i + 1] || '';
            if (!value.startsWith('--')) {
                options[key] = value;
                i++;
            }
            else {
                options[key] = 'true';
            }
        }
        else {
            positional.push(arg);
        }
    }
    return { command, positional, options };
}
function formatJson(obj) {
    return JSON.stringify(obj, null, 2);
}
// =============================================================================
// Main
// =============================================================================
function main() {
    const args = process.argv.slice(2);
    const { command, positional, options } = parseArgs(args);
    try {
        switch (command) {
            case 'help':
            case '--help':
            case '-h':
                printHelp();
                break;
            case 'get-status': {
                const project = state.getProject();
                console.log(formatJson(project));
                break;
            }
            case 'regenerate-views':
                regenerateViews();
                break;
            // Task Operations
            case 'get-task': {
                const taskId = positional[0];
                if (!taskId) {
                    console.error('Error: Task ID required');
                    process.exit(1);
                }
                const task = state.getTask(taskId);
                if (task) {
                    console.log(formatJson(task));
                }
                else {
                    console.error(`Task ${taskId} not found`);
                    process.exit(1);
                }
                break;
            }
            case 'update-task': {
                const taskId = positional[0];
                if (!taskId) {
                    console.error('Error: Task ID required');
                    process.exit(1);
                }
                const updates = {};
                if (options.status) {
                    updates.status = options.status;
                }
                if (options.tokens || options.tools) {
                    updates.metrics = {
                        tokens: options.tokens ? parseInt(options.tokens, 10) : undefined,
                        tools: options.tools ? parseInt(options.tools, 10) : undefined
                    };
                }
                const updated = state.updateTask(taskId, updates);
                console.log(formatJson(updated));
                regenerateViews();
                break;
            }
            case 'get-next-task': {
                const task = state.getNextTask(options.epic);
                if (task) {
                    console.log(formatJson(task));
                }
                else {
                    console.log('No pending tasks found');
                }
                break;
            }
            case 'list-tasks': {
                const filter = {};
                if (options.epic)
                    filter.epic_id = options.epic;
                if (options.status)
                    filter.status = options.status;
                const tasks = state.getTasks(filter);
                console.log(formatJson(tasks));
                break;
            }
            // Bug Operations
            case 'get-bug': {
                const bugId = positional[0];
                if (!bugId) {
                    console.error('Error: Bug ID required');
                    process.exit(1);
                }
                const bug = state.getBug(bugId);
                if (bug) {
                    console.log(formatJson(bug));
                }
                else {
                    console.error(`Bug ${bugId} not found`);
                    process.exit(1);
                }
                break;
            }
            case 'update-bug': {
                const bugId = positional[0];
                if (!bugId) {
                    console.error('Error: Bug ID required');
                    process.exit(1);
                }
                const bugUpdates = {};
                if (options.status) {
                    bugUpdates.status = options.status;
                }
                const updatedBug = state.updateBug(bugId, bugUpdates);
                console.log(formatJson(updatedBug));
                regenerateViews();
                break;
            }
            case 'list-bugs': {
                const bugFilter = {};
                if (options.epic)
                    bugFilter.epic_id = options.epic;
                if (options.status)
                    bugFilter.status = options.status;
                const bugs = state.getBugs(bugFilter);
                console.log(formatJson(bugs));
                break;
            }
            // Session Operations
            case 'start-session': {
                const epicId = positional[0];
                const branch = positional[1];
                if (!epicId || !branch) {
                    console.error('Error: Epic ID and branch required');
                    console.error('Usage: start-session <epic-id> <branch>');
                    process.exit(1);
                }
                const session = state.startSession(epicId, branch);
                console.log(formatJson(session));
                regenerateViews();
                break;
            }
            case 'end-session': {
                const durationMinutes = options.duration ? parseInt(options.duration, 10) : undefined;
                const result = state.endSession(durationMinutes);
                console.log(`Session archived to: ${result.archived}`);
                console.log(formatJson(result.session));
                regenerateViews();
                break;
            }
            case 'record-task': {
                const recordTaskId = positional[0];
                if (!recordTaskId) {
                    console.error('Error: Task ID required');
                    process.exit(1);
                }
                const taskData = {
                    task_id: recordTaskId,
                    tokens: options.tokens ? parseInt(options.tokens, 10) : undefined,
                    tools: options.tools ? parseInt(options.tools, 10) : undefined
                };
                const updatedSession = state.recordTaskCompletion(taskData);
                console.log(formatJson(updatedSession));
                regenerateViews();
                break;
            }
            // Project Operations
            case 'set-active': {
                const activeUpdates = {};
                if (options.epic)
                    activeUpdates.epic_id = options.epic;
                if (options.feature)
                    activeUpdates.feature_id = options.feature;
                if (options.task)
                    activeUpdates.task_id = options.task;
                const project = state.setActiveWork(activeUpdates);
                console.log(formatJson(project.active));
                regenerateViews();
                break;
            }
            default:
                console.error(`Unknown command: ${command}`);
                console.error('Run with --help for usage information');
                process.exit(1);
        }
    }
    catch (error) {
        console.error('Error:', error instanceof Error ? error.message : error);
        process.exit(1);
    }
}
main();
