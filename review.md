# ComparisonRecorder.tsx - Technical Review

## High-Level Overview

**ComparisonRecorder** is a real-time pose-based exercise monitoring component that uses MediaPipe's PoseLandmarker AI model to detect body positions, calculate biomechanical joint angles, and automatically count exercise repetitions with form quality assessment. The system operates in two modes: **template-based** (learns exercise patterns) and **signal-based** (detects movements from angle derivatives). It provides live visual feedback and audio cues to guide users through physiotherapy exercises.

---

## Core Functionality Architecture

### 1. **Pose Detection Pipeline**
The component establishes a continuous video processing loop:
- **Video Source**: Live webcam feed or test video file
- **AI Model**: MediaPipe PoseLandmarker (full float16 model on GPU)
- **Detection Frequency**: Per-frame (requestAnimationFrame)
- **Landmark Output**: 33 body landmarks (joints) with (x, y) coordinates

### 2. **Angle Calculation System**
Converts 33 raw landmarks into biomechanical joint angles:
- **3-Point Angle Calculation**: Computes angles between 3 consecutive joints (e.g., hip-knee-ankle for knee angle)
- **Segment Angles**: Calculates limb tilt relative to vertical axis (useful for postural analysis)
- **Coverage**: Elbows, knees, hips, shoulders, arm/forearm/leg segments, head orientation

### 3. **Signal Smoothing**
Applies real-time digital filtering to reduce sensor noise:
- **Filter Type**: OneEuroFilter (exponential smoothing with derivative-aware adaptation)
- **Purpose**: Stabilizes jittery angle readings while preserving genuine movement transitions
- **Per-Angle Tracking**: Independent filter instance per joint angle

### 4. **Rep Detection (Dual Strategy)**

#### **Template-Based Rep Counting** (Primary)
- Requires a learned exercise pattern (LearnedExerciseTemplate)
- Maps continuous angles to discrete states (e.g., "flexed", "extended", "W-position")
- Detects reps by state transitions: start → peak → start (completes one cycle)
- Advantage: Exercise-specific, handles complex multi-phase movements
- Used when a reference or learned template exists

#### **Signal-Based Rep Counting** (Fallback)
- Uses derivative (velocity) of primary angle over time
- Detects direction reversals (up→down: peak, down→up: trough)
- Counts rep when ROM between peak and trough exceeds threshold
- Includes hysteresis to prevent double-counting and noise sensitivity
- Advantage: Generic, requires no template

### 5. **Rep Quality Classification**
For each completed rep, the system evaluates:
- **Valid Rep**: ROM reaches acceptable reference range (e.g., 150° extension, 90° flexion)
- **Good Rep**: ROM reaches "ideal" range (may exceed reference for progression)
- **Invalid Rep**: Insufficient ROM or form errors

Quality tracking persists across frame boundaries (recorded at peak detection, evaluated at rep completion).

### 6. **Live Feedback System**
Three parallel feedback mechanisms:

**Audio Feedback**:
- Multilingual audio cues (English & Urdu) for different movement phases
- Exercise-specific: Knee extension vs. Scap wall slides have different instructions
- Cooldown mechanism (2.5s) prevents repetitive audio bombardment
- Supports: "move up", "move down", "hold position", "correction needed"

**Visual Feedback** (Canvas Overlay):
- Live skeleton drawing with joint landmarks connected by lines
- Angle value annotations positioned at each joint
- Color-coded rep counter box indicating quality (red/yellow/green/blue)

**Threshold Status Indicator**:
- Phase-aware feedback: "rest" (at start position) vs. active phases
- Dynamic threshold comparison: Below Reference → Valid ROM → Ideal ROM
- Sticky peak tracking (maintains highest angle in current cycle until reset)

### 7. **Form Scoring**
Real-time calculation of exercise form quality (0-100):
- Compares current angles against learned template ranges
- Penalizes deviation from ideal form
- Session average computed from all non-rest frames
- Persisted in formScoreSamplesRef for post-session analysis

---

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ Video Input (Webcam or File)                                │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│ MediaPipe PoseLandmarker (per-frame detection)              │
│ Outputs: 33 landmarks with x,y coordinates & confidence    │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│ calculateAllAngles() - Raw angle extraction                 │
│ Produces: 16+ joint angles + segment angles + head yaw      │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│ smoothAngles() - OneEuroFilter application                  │
│ Output: Noise-reduced angles for downstream processing      │
└──────────────────────┬──────────────────────────────────────┘
                       │
         ┌─────────────┼─────────────┐
         │             │             │
    ┌────▼────┐   ┌────▼────┐   ┌───▼────┐
    │ Storage │   │ Display │   │Analysis│
    └────┬────┘   └────┬────┘   └───┬────┘
         │             │             │
         ▼             ▼             ▼
    angleHistory  Canvas Drawing  Rep Detection
    [10s buffer]  [Skeleton +     [FSM or Signal]
                   Annotations]
                                    │
                ┌───────────────────┼───────────────────┐
                │                   │                   │
         ┌──────▼─────┐      ┌──────▼──────┐    ┌──────▼──────┐
         │ Rep Count  │      │ Form Score  │    │ Audio/Visual│
         │ Tracking   │      │ Calculation │    │  Feedback   │
         └────────────┘      └─────────────┘    └─────────────┘
                │                   │                   │
                └───────────────────┴───────────────────┘
                             │
                    ┌────────▼─────────┐
                    │  Session Summary │
                    │  (End of workout)│
                    └──────────────────┘
```

---

## Key State Management

### **useRef Tracking**
- `videoRef`: HTML video element (webcam/file stream)
- `canvasRef`: Canvas for pose skeleton drawing
- `poseRef`: MediaPipe PoseLandmarker instance
- `streamRef`: MediaStream object (camera permissions)
- `rafRef`: Animation frame request ID (for cleanup)
- `angleHistoryRef`: Circular 10-second buffer of angles
- `primaryAngleHistoryRef`: 12-second history of primary angle only
- `repFSMRef`: Finite state machine for signal-based rep detection
- `angleFiltersRef`: Map of OneEuroFilter instances (one per angle)
- `repWasValidRef` / `repWasGoodRef`: Rep quality flags (recorded at peak, used at completion)
- `lastRepTimestampRef`: Cooldown tracker for rep counting
- `formScoreSamplesRef`: Session history of form scores (for averaging)
- `sessionStartTimeRef`: Timestamp when workout began

### **useState Tracking**
- `repCount`, `correctRepCount`, `incorrectRepCount`: Rep counters
- `currentAngles`: Latest angle values (for UI display)
- `currentState`, `templateState`: Discrete exercise state labels
- `liveThresholdStatus`: Quality indicator ("rest" | "below" | "valid" | "good")
- `formScore`: Current frame form quality (0-100)
- `repErrors`, `errorSummary`: Error analysis across reps
- `sessionEnded`, `sessionSummary`: Post-session data snapshot

---

## Function Catalog

### **Core Angle Computation**

| Function | Purpose | Input | Output |
|----------|---------|-------|--------|
| `calculateAngle(a, b, c)` | Computes 3-point angle (e.g., hip-knee-ankle) using atan2 | 3 landmark arrays [x,y] | Number (0-180°) |
| `calculateSegmentAngleFromVertical(start, end)` | Calculates limb tilt relative to vertical axis | start & end landmarks | Number (degrees from vertical) |
| `calculateAllAngles(landmarks)` | Extracts all 16+ biomechanical angles from pose landmarks | Pose Landmark array (33 joints) | JointAngleData object |
| `smoothAngles(rawAngles, timestamp)` | Applies OneEuroFilter to each angle independently | Raw angles + timestamp | Smoothed angles (noise-reduced) |

### **State & Exercise Classification**

| Function | Purpose | Input | Output |
|----------|---------|-------|--------|
| `determineExerciseState(angles)` | Converts continuous angle → discrete label ("flexed"/"extended"/"transition") | Smoothed angles | String state label |
| `classifyRepQuality(cycleHistory, primaryAngleName)` | Checks if ROM reaches acceptable thresholds (extended min + flexed max) | 1.5s angle history + primary angle name | Boolean (valid/invalid) |
| `computeRepMinMax(cycleHistory, primaryAngleName)` | Extracts min/max angle in completed rep cycle | 1.5s angle history + primary angle name | {min, max, primary} or null |
| `mapToTemplateState(angles, template, anglesOfInterest, primary)` | [Imported] Maps continuous angles to nearest template state cluster | Smoothed angles + template metadata | Template state object or null |

### **Rep Detection & Counting**

| Function | Purpose | Input | Output |
|----------|---------|-------|--------|
| `updateRepCount(state)` | Signal-based rep FSM: detects peaks/troughs from angle velocity | Discrete state label | Updates rep count state |
| `updateRepCountFromSignal()` | [Fallback] Pure signal analysis without templates—uses derivative peaks/troughs | Angle history (last 30 frames) | Updates rep count state |
| `getRepThresholds()` | Computes midpoint between start & peak angles (used for rep FSM up/down phases) | [Uses refs: template, resolved primary] | {up: number, down: number} |
| `resolvePrimaryAngle(anglesOfInterest, template)` | [Imported] Selects best angle to track (handles left/right limb ambiguity) | List of angle names + template | Single primary angle name |

### **Video & Playback Control**

| Function | Purpose | Input | Output |
|----------|---------|-------|--------|
| `openWebcam()` | Requests camera permission, initializes pose model, starts detection loop | — | Updates streaming state, starts raf loop |
| `handleTestVideoUpload(event)` | Loads video file from input, replaces webcam source, initializes pose | File input event | Video URL → loads metadata → starts detection |
| `togglePlayPause()` | Play/pause button for test mode videos | — | Pauses or resumes video.play() |
| `resetTestVideo()` | Resets video to 0s, clears all tracking buffers & state | — | Resets video + all refs/state for replay |
| `stopTestMode()` | Saves session, stops video, cancels animation loop, resets all state | — | Cleanup + state reset |
| `endSession()` | Saves session snapshot, stops webcam stream, cancels raf | — | saveAndEndSession() + cleanup |

### **Audio Feedback**

| Function | Purpose | Input | Output |
|----------|---------|-------|--------|
| `playAudio(src, label)` | Plays audio file with cooldown & repetition prevention | Audio URL + label string | Plays audio or no-op if cooldown/duplicate |
| `getAudioFeedback(lang)` | Returns exercise-specific audio file paths (Knee vs. Scap) | Language ("en" \| "ur") | Nested object with paths for each movement phase |

### **Form Scoring & Error Analysis**

| Function | Purpose | Input | Output |
|----------|---------|-------|--------|
| `computeFormScore(angles, template, anglesOfInterest, primary)` | [Imported] Calculates form quality as % deviation from template | Smoothed angles + template metadata | Number 0-100 |
| `calculateRepError(angles, template, anglesOfInterest, repNum, timestamp)` | [Imported] Computes detailed rep error (angle mismatches, timing issues) | Frame data + template + rep metadata | RepError object or null |
| `analyzeRepTrends(errors)` | [Imported] Summarizes error patterns across multiple reps | Array of RepError objects | RepErrorSummary {trends, patterns} |
| `getErrorFeedback(error)` | [Imported] Converts RepError → human-readable feedback string | RepError object | String feedback message |

### **Session Management**

| Function | Purpose | Input | Output |
|----------|---------|-------|--------|
| `saveAndEndSession()` | Snapshots all session data (rep count, form score, duration) before reset | — | Sets sessionSummary state + calls onSessionEnd callback |

### **Canvas Rendering**

| Function | Purpose | Input | Output |
|----------|---------|-------|--------|
| `drawAngleAnnotations(ctx, landmarks, angles)` | Renders angle values as text overlays at joint positions on canvas | Canvas context + landmarks + angles | Draws text on canvas (side effect) |
| `startPoseLoop()` | Main animation loop: requests pose → calculates angles → updates UI → renders | — | Recursive requestAnimationFrame loop |
| Inline `render()` function | Per-frame processing: detection, angle extraction, smoothing, rep counting, canvas drawing | — | Single frame update + schedules next frame |

### **Initialization & Cleanup**

| Function | Purpose | Input | Output |
|----------|---------|-------|--------|
| `initPose()` | Downloads MediaPipe WASM, creates PoseLandmarker instance with GPU delegate | — | Initializes poseRef |
| useEffect cleanup | Stops camera stream, cancels animation loop, closes pose model, releases resources | — | Cleanup on unmount |

---

## Key Algorithm Details

### **Finite State Machine (Rep Detection)**
```
FSM States: 'idle' → 'down' (flexed) → 'up' (extended) → 'down' (next rep)
Trigger 1: Upward crossing of midpoint threshold (angle ≥ up threshold AND velocity > 0)
Trigger 2: Downward crossing below midpoint (angle ≤ down threshold AND velocity < 0)
Rep Count: Only incremented when:
  - Delta (peak - valley) ≥ MIN_PEAK_DELTA (15°)
  - Cooldown elapsed since last rep (≥ 0.6s)
  - ROM validation passed
```

### **Form Quality Sticky Status**
The system tracks the **peak angle reached in the current rep cycle** separately from the actual current angle. This prevents threshold status from flickering:
1. At peak state transition: Record whether rom ≥ refPeak*tolerance (valid) or ≥ idealPeak*tolerance (good)
2. Store flags in repWasValidRef/repWasGoodRef
3. At rep completion: Use stored flags (not re-evaluate)
4. Reset flags and peak when returning to start state

### **Angle History Circular Buffer**
- Maintains last 10s of angle data (automatically pruned)
- Used for rep cycle analysis, form scoring, trend detection
- Also separate 12s buffer for primary angle only (used in feedback engine)

### **Template-Based State Mapping**
When a learned template exists:
1. Current angles mapped to nearest template state (cluster)
2. Reps counted by state sequence: start → peak → start
3. "Visited peak" flag ensures rep only counted once even if user lingers at peak
4. Handles complex exercises (scap wall slides) with non-monotonic ROM ranges

---

## Performance Characteristics

| Aspect | Details |
|--------|---------|
| **Frame Rate** | Browser's requestAnimationFrame (typically 60 FPS, GPU-limited) |
| **Detection Latency** | MediaPipe GPU inference: ~10-30ms per frame |
| **Memory Usage** | 10-12s angle history × ~20 angles = ~10KB + Model weights (~7MB) |
| **Filtering Overhead** | One EuroFilter per angle: minimal (~1% CPU per angle) |
| **Cooldown Periods** | 2.5s audio cooldown, 0.6s rep cooldown, 1.0s signal-based rep cooldown |
| **Buffer Management** | Circular time-window pruning (10s window) prevents unbounded memory growth |

---

## Integration Points

### **External Dependencies**
- `@mediapipe/tasks-vision`: PoseLandmarker model + drawing utilities
- `@/lib/rep-error-calculator`: Error analysis functions (calculateRepError, analyzeRepTrends, getErrorFeedback)
- `@/lib/filters`: OneEuroFilter for angle smoothing
- `@/lib/exercise-state-learner`: LearnedExerciseTemplate interface
- `@/lib/feedback-generator`: RealtimeFeedbackEngine for multimodal feedback
- `@/lib/template-storage`: getTemplatesByExerciseType (loads learned templates from localStorage)
- `shadcn/ui`: Button, Card components for UI

### **Props Interface**
```typescript
{
  onVideoRecorded?: (blob: Blob) => void        // Future: save recorded video
  onSessionEnd?: (data: SessionEndData) => void // Post-session callback
  anglesOfInterest?: string[]                   // Which angles to track
  exerciseName?: string                         // Exercise identifier
  exerciseType?: string                         // "knee-extension" | "scap-wall-slides"
  enableTestMode?: boolean                      // Show video upload button
  referenceTemplate?: LearnedExerciseTemplate   // Doctor-provided form model
  idealTemplate?: LearnedExerciseTemplate       // Advanced form target (progression)
  allowProgression?: boolean                    // Enable ideal ROM feedback
  fullscreen?: boolean                          // Full-screen or embedded mode
}
```

---

## Known Issues & TODOs

1. **Hardcoded State Thresholds** (Line 630-637): Fixed angle ranges (70°, 150°) for state classification instead of template-derived values
2. **Head Yaw Tracking** (Multiple): Out-of-scope feature, marked for removal but not fully implemented
3. **Fallback Defaults**: Hardcoded 140°/100° thresholds when no template (Line 283)
4. **Pre-existing TS Errors**: Non-auth-related bugs in component

---

## Session Data Output

```typescript
interface SessionEndData {
  reps_completed: number      // Total rep count
  valid_reps: number          // Reps meeting reference ROM
  good_reps: number           // Reps exceeding ideal ROM
  form_score: number          // Average form quality (0-100)
  duration_seconds: number    // Workout duration
}
```

---

## Summary

**ComparisonRecorder** is a sophisticated real-time biofeedback system that bridges AI-powered pose detection with physiotherapy exercise monitoring. It employs dual-layer rep detection (template-aware + signal-aware), live form scoring, and multimodal feedback (audio + visual) to guide users through exercises while automatically quantifying performance metrics. The architecture prioritizes robustness (fallback strategies, noise filtering, hysteresis) and extensibility (template-based analysis, progression tracking, multilingual support).
