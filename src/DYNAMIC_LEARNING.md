# Dynamic Exercise State Learning System

## Overview

This system automatically learns exercise patterns from reference videos instead of requiring hardcoded states for each exercise type. It uses **unsupervised learning (k-means clustering)** to detect key poses, transitions, and timing from uploaded videos.

## How It Works

### 1. **Video Analysis**
When you upload a reference video (e.g., knee extension exercise):
- MediaPipe extracts pose landmarks for each frame
- Joint angles are calculated (e.g., knee angle, leg segment angles)
- Temporal smoothing is applied using One Euro Filter

### 2. **State Detection (K-Means Clustering)**
The system automatically clusters similar poses:
- Groups frames with similar angle configurations
- Determines optimal number of states (2-5 typically)
- Example for knee extension:
  - **State 1**: Flexed/Bent (~90° knee angle)
  - **State 2**: Extended/Straight (~180° knee angle)

### 3. **State Characterization**
For each detected state, the system calculates:
- **Mean angle**: Average angle during this state
- **Range**: Min and max angles observed
- **Standard deviation**: How stable the pose is
- **Duration**: How long each state is held
- **Occurrences**: How many times it appears

### 4. **Transition Detection**
Tracks movement between states:
- Which state transitions to which
- How long the transition takes
- Angle changes during transition
- Example: "Bent → Stretched" takes 1.2s, knee angle changes by +90°

### 5. **Template Creation**
Generates a reusable template with:
- All detected states with angle thresholds
- Transition sequence and timing
- Recommended rep count based on patterns
- Confidence score (based on consistency)

## Example Use Case: Knee Extension

### Input Video
- 10-second video of 3 knee extensions
- Angles tracked: left_knee, right_knee, leg_segment

### Output Template
```
States Detected:
1. Flexed/Bent (90°)
   - left_knee: 85-95° (mean: 90°, ±3°)
   - Duration: 2s per occurrence
   - Appears 3 times

2. Extended/Straight (178°)
   - left_knee: 170-180° (mean: 178°, ±4°)
   - Duration: 3s per occurrence (includes 2s hold)
   - Appears 3 times

Transitions:
- Bent → Stretched: 1.2s, +88° change
- Stretched → Bent: 1.5s, -88° change

Rep Sequence:
Bent → Stretched → Hold → Bent

Confidence: 87%
Recommended Reps: 3
```

## Key Features

### ✅ No Hardcoding Required
- No need to manually define angle thresholds
- System learns from actual video data
- Adapts to individual variations

### ✅ Timing Detection
- Automatically detects hold periods (minimal movement)
- Measures transition durations
- Identifies rest periods

### ✅ Multiple States
- Handles complex exercises with 3+ states
- Example: Squat could detect standing, quarter squat, half squat, full squat

### ✅ Confidence Scoring
- Evaluates template quality
- Based on:
  - Low variation within states (tight clusters)
  - Consistent patterns across reps
  - Clear state boundaries

## Technical Details

### K-Means Clustering
```typescript
// Groups frame data into k states
// Each frame is a vector of angle values
kMeansClustering(dataVectors, k=3)
// Returns clusters and centroids
```

### State Detection Algorithm
1. Convert each frame to vector: `[knee_angle, hip_angle, ...]`
2. Run k-means to group similar frames
3. For each cluster:
   - Calculate angle statistics (mean, std, min, max)
   - Detect continuous occurrences (segments)
   - Find representative frame (middle of longest segment)

### Hold Detection
```typescript
isHoldState(frames, threshold=5°)
// Returns true if angles stay within 5° for 10+ frames
```

## File Structure

### New Files Created
1. **`lib/exercise-state-learner.ts`**
   - Main learning algorithm
   - K-means clustering
   - State detection and characterization
   - Transition analysis

2. **`lib/template-storage.ts`**
   - Save/load templates from localStorage
   - Import/export functionality
   - Template management

3. **`components/learned-template-view.tsx`**
   - Visual display of learned states
   - Shows angle ranges, transitions, sequence
   - Interactive UI for viewing template details

### Modified Files
1. **`lib/pose-analyzer.ts`**
   - Added `learnedTemplate` to `PoseAnalysisResult`
   - Calls learner after video analysis
   - Passes exercise info for context

2. **`app/record/page.tsx`**
   - Displays learned template
   - Saves template to storage
   - Shows confidence and states

## Usage Flow

### Recording a Reference Exercise
1. Go to `/record` page
2. Select exercise type (e.g., "Knee Extension")
3. Record or upload video
4. System analyzes and learns states automatically
5. Review learned template with visual breakdown
6. Save template for future comparisons

### Using Template for Comparison (Future)
1. Load saved template
2. Record user performing exercise
3. Compare user's angles/timing to template
4. Provide real-time feedback on form

## Future Enhancements

### 1. Real-Time Comparison
- Compare live video to learned template
- Detect form deviations
- Provide corrective feedback

### 2. Template Refinement
- Merge multiple reference videos
- Update template with new data
- Improve accuracy over time

### 3. Exercise Variants
- Detect and learn exercise modifications
- Compare different techniques
- Store multiple templates per exercise

### 4. Visual Feedback
- Overlay skeleton comparison
- Highlight angle differences
- Show trajectory paths

### 5. Progress Tracking
- Track improvements over time
- Compare against template trends
- Generate progress reports

## Benefits

### For Physiotherapists
- Create custom exercise templates quickly
- No programming knowledge required
- Capture their specific technique
- Share templates with patients

### For Patients
- Get precise form feedback
- Visual confirmation of correct form
- Track progress objectively
- Independent practice with guidance

### For Developers
- Extensible system
- Easy to add new exercises
- No manual angle tuning
- Data-driven approach

## Example Console Output

```
🧠 Learning exercise states from video data...
Analyzing 450 data points
Angles of interest: left_knee, right_knee, left_leg_segment
Organized into 150 frames
Clustering into 3 states...
✅ Detected 3 states:
  1. Flexed/Bent (89°) - 3 occurrences
  2. Extended/Straight (177°) - 3 occurrences
  3. Intermediate (135°) - 2 occurrences (transitions)
🔄 Detected 6 transitions
📊 Sequence: Flexed → Intermediate → Extended → Intermediate → Flexed
✅ Learned template with 87% confidence
```

## Comparison to Hardcoded Approach

### Hardcoded (Old Way)
```typescript
{
  states: [
    { id: "flexed", thresholds: [{ angleName: "left_knee", min: 70, max: 110 }] },
    { id: "extended", thresholds: [{ angleName: "left_knee", min: 160, max: 180 }] }
  ],
  repSequence: ["flexed", "extended", "flexed"]
}
```
- ❌ Manual definition required
- ❌ Same thresholds for everyone
- ❌ No timing information
- ❌ Rigid, inflexible

### Learned (New Way)
```typescript
learnExerciseStates(jointAngles, "Knee Extension", "knee-extension", ["left_knee"])
```
- ✅ Automatic detection
- ✅ Personalized to video
- ✅ Includes timing/duration
- ✅ Adapts to variations
- ✅ Confidence scoring

## Try It Out!

1. Start the dev server: `npm run dev`
2. Navigate to `/record`
3. Select "Knee Extension" exercise
4. Upload or record a video showing 2-3 knee extensions
5. Wait for analysis
6. See the learned template with detected states!
7. Save the template for future use

The system will automatically detect the bent and extended positions, measure timing, and create a reusable template - no coding required!
