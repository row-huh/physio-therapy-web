# Pose Analysis with MediaPipe

## Overview

The pose analysis system uses MediaPipe's Pose Landmarker to detect and analyze joint movements in recorded exercise videos.

## How It Works

### 1. Video Processing
- When a user records a video and clicks "Analyze & Save Exercise", the system processes the video frame by frame
- Videos are sampled at 5 FPS to balance between accuracy and performance
- Each frame is analyzed by MediaPipe to detect 33 pose landmarks

### 2. Joint Angle Calculation
For each frame, the system calculates angles for the following joints:
- **Elbows** (left & right): Angle between shoulder-elbow-wrist
- **Knees** (left & right): Angle between hip-knee-ankle
- **Hips** (left & right): Angle between shoulder-hip-knee
- **Shoulders** (left & right): Angle between elbow-shoulder-hip

The angle calculation uses the arctangent formula:
```
angle = atan2(c.y - b.y, c.x - b.x) - atan2(a.y - b.y, a.x - b.x)
```

Where `b` is the vertex (joint), and `a` and `c` are the adjacent points.

### 3. Movement Detection
The system analyzes the angle data to detect significant movements:
- **Angle Threshold**: 15° - Minimum change to consider as movement
- **Time Threshold**: 0.5s - Minimum duration to consider as a held position

For each joint, the system tracks:
- Starting angle
- Ending angle
- Duration of hold
- Total angle change (delta)
- Timestamp of when it occurred

### 4. Output Format

#### Joint Angles Array
Contains all raw angle measurements:
```typescript
{
  joint: "left_knee",
  angle: 165.4,
  timestamp: 2.3
}
```

#### Movement Sequences
Contains detected movement patterns:
```typescript
{
  joint: "right_knee",
  startAngle: 170.2,
  endAngle: 90.5,
  startTime: 1.2,
  endTime: 2.8,
  duration: 1.6,
  angleDelta: -79.7
}
```

#### Summary
A human-readable text summary of all movements detected.

## Example Use Cases

### Squat Analysis
The system would detect:
1. Knee flexion from ~170° to ~90° (going down)
2. Hold at ~90° for X seconds (bottom position)
3. Knee extension from ~90° back to ~170° (coming up)

### Bicep Curl Analysis
The system would detect:
1. Elbow flexion from ~160° to ~30° (curl up)
2. Brief hold at ~30° (contracted position)
3. Elbow extension from ~30° to ~160° (lowering)

## Integration Points

The analysis is triggered in `/app/record/page.tsx` when the user clicks "Analyze & Save Exercise" after recording a video. The analysis runs in the background with a loading indicator, then displays the results.

## Future Enhancements

Potential improvements:
- Add more joint combinations (e.g., ankle angles, spine alignment)
- Implement form quality scoring based on ideal ranges
- Compare recorded video against reference exercises
- Real-time pose analysis during recording
- Export analysis data as JSON or CSV
