# Comparison Algorithm — Problems & Fix Plan

## Problems Identified

### Problem 1: "Primary angle" is inconsistent across systems
There are 4+ different ways the primary angle gets chosen:
- Dual-threshold block: `anglesOfInterest[0]` → always `left_knee`
- `getDriverAngle()`: biggest range in template states → could be `left_leg_segment`
- `updateRepCountFromSignal`: hardcoded `['left_knee', 'right_knee']`, tracks both independently
- Dynamic primary selection (line ~1155): picks knee with more movement in last 15 frames, flips mid-session
- Feedback engine: `anglesOfInterest[0]` from constructor → always `left_knee`

**Effect**: State mapping uses one angle, threshold uses another, rep detection uses a third. System says "Ready" while the leg is moving because it's watching the wrong signal.

### Problem 2: No validation that the right body part is moving
For knee-extension, 6 angles are tracked. `mapToTemplateState` uses Euclidean distance across ALL 6. Hand movement shifts hip/shoulder landmarks which shifts computed knee angle. If 2-3 angles accidentally match a template state, the state flips. Signal-based rep detector tracks both knees independently and counts whichever oscillates — even if it's noise from arm movement.

### Problem 3: Threshold status stuck on "rest" when referenceTemplate is null
The dual-threshold block only runs when `referenceTemplate` prop exists. If the DB template column is null, `frameThresholdStatus` is permanently "rest". The feedback engine sees "rest" every frame and never fires active-phase nudges.

### Problem 4: Feedback engine phase detection diverges from threshold block
Engine has its own phase tracking (`lastPhase`) based on `primaryVal < midpoint`. But `thresholdStatus` is computed by the recorder's dual-threshold block using `repCyclePeakRef` (sticky peak). These can disagree — engine thinks "active" but threshold says "rest".

### Problem 5: Rep detection fires on wrong angle / both sides simultaneously
`updateRepCountFromSignal` for knee-extension tracks both `left_knee` and `right_knee` independently. Body sway can trigger both. Global cooldown is only 1 second — not enough to prevent double-count.

### Problem 6: Hardcoded thresholds don't match the template
Signal-based rep detector uses `PEAK_MIN = 135`, `TROUGH_MAX = 125` for knee-extension. But the actual reference template might have peak at 155° and start at 80°. Hardcoded values reject valid reps or accept bad ones.

### Problem 7: Two rep-counting systems run simultaneously
1. Template-based: `mapToTemplateState` → start↔peak state transitions
2. Signal-based: `updateRepCountFromSignal` → derivative + peak/trough detection

Both call `setRepCount(prev => prev + 1)` independently. Single rep can get double-counted, or one counts noise the other ignores.

---

## Fix Plan (Increments)

### Increment 1: Single source of truth for the primary angle ✅
One function used everywhere that picks which angle to watch.
- Create `getPrimaryAngle(exerciseType, anglesOfInterest, template?)` 
- For knee-extension: use template's driver angle to pick left_knee or right_knee. No dynamic flipping mid-session.
- Replace all call sites with this single function
- Feedback engine, dual-threshold block, rep detector, state mapper all use same angle

### Increment 2: Make feedback engine self-contained (remove thresholdStatus dependency) ✅
Engine computes status internally from primaryVal + its own ref/ideal peaks.
- Remove `thresholdStatus` from `tick()` interface
- Works regardless of whether `referenceTemplate` prop exists

### Increment 3: Kill duplicate rep counter — one system only ✅
- When template available: use ONLY template-based state-transition rep detection
- When no template: fall back to signal-based
- Never run both simultaneously

### Increment 4: Template-aware thresholds instead of hardcoded ones ✅
- Extract `refPeak` and `refStart` from template for primary angle
- Valid rep = primary angle reached `refPeak * TOLERANCE` and returned near `refStart`
- Remove hardcoded `PEAK_MIN`/`TROUGH_MAX` constants

### Increment 5: Validate that the right body part is moving (TODO)
- Before counting rep, check primary angle delta exceeds minimum ROM threshold (e.g. 20°)
- Only count movement from primary angle joints
- Weight primary angle 3× heavier in state matcher Euclidean distance
