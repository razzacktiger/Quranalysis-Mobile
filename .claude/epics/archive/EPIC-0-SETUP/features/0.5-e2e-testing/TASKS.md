# Feature 0.5: E2E Testing Infrastructure

**Status:** ✅ Complete

## Tasks

| ID | Task | Size | Status |
|----|------|------|--------|
| 0.5.1 | Setup Maestro | M | ✅ Complete |
| 0.5.2 | Create Test Utilities | S | ✅ Complete |

---

### Task 0.5.1: Setup Maestro

**Size:** M (~700 tokens)
**Files:** `.maestro/config.yaml`, `tests/e2e/smoke.yaml`
**Deps:** 0.1.1

**Installation:**
```bash
# macOS
curl -Ls "https://get.maestro.mobile.dev" | bash

# Add to PATH if needed
export PATH="$PATH":"$HOME/.maestro/bin"
```

**Acceptance Criteria:**
- [x] Maestro CLI installed
- [x] Config file created at `.maestro/config.yaml`
- [x] Smoke test created that launches app
- [x] Smoke test passes

**Config File (.maestro/config.yaml):**
```yaml
# Maestro configuration
flows:
  - tests/e2e/**/*.yaml
```

**Smoke Test (tests/e2e/smoke.yaml):**
```yaml
appId: com.quranalysis.mobile
name: Smoke Test - App Launches
---
- launchApp
- assertVisible: ".*" # Any content visible means app launched
```

---

### Task 0.5.2: Create Test Utilities

**Size:** S (~400 tokens)
**Files:** `tests/e2e/helpers/common.yaml`
**Deps:** 0.5.1

**Acceptance Criteria:**
- [x] Common test flows created (login, navigate to tab, etc.)
- [x] Reusable across all E2E tests
- [x] Documented in file comments
