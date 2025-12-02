# Angle Types in Pose Analysis

## Overview

The pose analyzer now calculates **two types of angles** to provide comprehensive movement analysis:

1. **Joint Angles** (3-point angles) - Interior angle at a joint
2. **Segment Angles** (2-point angles) - Angle of body segment relative to vertical

## 1. Joint Angles (Interior Angles)

These measure the **angle between three points**, with the middle point being the joint vertex. They represent the actual flexion/extension of a joint.

### Formula
For three points A, B, C where B is the joint:
```
θ = arccos((BA · BC) / (|BA| × |BC|))
```

### Measured Joints

| Joint | Points | Description | Range |
|-------|--------|-------------|-------|
| **Elbow** | Shoulder-Elbow-Wrist | Arm bend | 0° (fully bent) to 180° (straight) |
| **Knee** | Hip-Knee-Ankle | Leg bend | 0° (fully bent) to 180° (straight) |
| **Hip** | Shoulder-Hip-Knee | Torso-leg angle | ~90° (seated) to 180° (standing) |
| **Shoulder** | Elbow-Shoulder-Hip | Arm-torso angle | Varies by arm position |

### Visualization Colors
- **Cyan (#00ffff)**: Knee angles
- **Purple (#ff00ff)**: Elbow angles  
- **Orange (#ffaa00)**: Hip angles

### Example Use Cases

**Squats Analysis:**
```
Right Knee: 165° → 85° → 165°
(Standing → Squat → Standing)
```

**Bicep Curl:**
```
Right Elbow: 170° → 45° → 170°
(Extended → Flexed → Extended)
```

**Sit-to-Stand:**
```
Right Hip: 85° → 165°
(Seated → Standing)
```

## 2. Segment Angles (Relative to Vertical)

These measure the **angle of a body segment relative to the vertical axis**. Useful for analyzing posture and segment orientation.

### Formula
For two points Start and End:
```
θ = arctan2(dx, dy) where:
  dx = End.x - Start.x
  dy = End.y - Start.y
```

### Measured Segments

| Segment | Points | Description | 0° means |
|---------|--------|-------------|----------|
| **Thigh** | Hip-Knee | Upper leg orientation | Straight down (vertical) |
| **Lower Leg** | Knee-Ankle | Lower leg orientation | Straight down (vertical) |
| **Upper Arm** | Shoulder-Elbow | Upper arm orientation | Straight down (vertical) |
| **Forearm** | Elbow-Wrist | Forearm orientation | Straight down (vertical) |

### Visualization
- **White text** with "seg:" prefix (smaller font)
- Shown below joint angles for reference

### Example Use Cases

**Leg Raise:**
```
Left Thigh Segment: 5° → 85°
(Vertical → Raised to horizontal)
```

**Knee Extension (side view):**
```
Right Lower Leg Segment: 45° → 5°
(Bent forward → Vertical)
```

## Comparison: Joint vs Segment Angles

### Scenario: Standing to Squat

**Joint Angles** (what happens at the joints):
```
Right Knee: 175° → 90° (flexed by 85°)
Right Hip:  170° → 100° (flexed by 70°)
```

**Segment Angles** (how segments move in space):
```
Right Thigh Segment: 5° → 45° (leaned forward 40°)
Right Lower Leg Segment: 2° → 12° (slight forward tilt)
```

### Which to Use?

| Goal | Use Joint Angles | Use Segment Angles |
|------|------------------|-------------------|
| Measure flexion/extension | ✅ Yes | ❌ No |
| Analyze range of motion | ✅ Yes | ❌ No |
| Check posture alignment | ⚠️ Partial | ✅ Yes |
| Measure limb orientation | ❌ No | ✅ Yes |
| Exercise form checking | ✅ Primary | ✅ Secondary |
| Gait analysis | ✅ Both | ✅ Both |

## Movement Detection

Both angle types are tracked over time to detect movements:

### Joint Angle Movements
```
LEFT KNEE: flexed (bent) by 78.5°
(165° → 87°) at 2.3s for 1.8s
```
- "flexed" = angle decreased (bent)
- "extended" = angle increased (straightened)

### Segment Angle Movements
```
LEFT THIGH SEGMENT: raised/moved away from vertical by 42.0°
(8° → 50°) at 2.3s for 1.8s
```
- "raised" = segment moved away from vertical
- "lowered" = segment moved toward vertical

## Implementation Details

### Smoothing
Both angle types benefit from the **One Euro Filter** smoothing:
1. Raw landmarks are smoothed first
2. Angles are calculated from smoothed landmarks
3. Additional EMA smoothing on angle values

### Thresholds
```typescript
ANGLE_THRESHOLD = 20°      // Minimum change to detect movement
NOISE_THRESHOLD = 5°       // Ignore micro-movements
TIME_THRESHOLD = 0.4s      // Minimum duration to register
```

### Tracking Specific Joints
```typescript
// Track only knees
analyzeVideoForPose(videoBlob, ["left_knee", "right_knee"])

// This will calculate:
// - Left/right knee joint angles (3-point)
// - Left/right leg segment angles (2-point)
```

## Visual Legend (On Video)

When playing back analyzed video:

```
           [Shoulder]
               |
      Purple   |   Purple
      165°   [Elbow]  170°
               |
           [Wrist]
               
     Orange    |
     90°     [Hip]
               |
      Cyan     |
      85°    [Knee]    seg: 15°
               |       (white)
           [Ankle]
```

- **Large colored numbers** = Joint angles (interior)
- **Small white "seg:"** = Segment angles (relative to vertical)

## References

- **AI Fitness Trainer**: [LearnOpenCV Squat Analysis](https://learnopencv.com/ai-fitness-trainer-using-mediapipe/)
- **Angle Calculation**: Standard vector mathematics for 3-point angles
- **MediaPipe Pose**: 33-point landmark model

## Tips for Analysis

1. **For Exercise Form**: Focus on joint angles (they show actual joint movement)
2. **For Posture Check**: Use segment angles (they show body alignment)
3. **For Range of Motion**: Track joint angle min/max values
4. **For Movement Speed**: Calculate angle change per unit time
5. **For Symmetry**: Compare left vs right joint angles

## Future Enhancements

Potential additions:
- Ankle angles (knee-ankle-heel)
- Torso angle (shoulder-hip relative to vertical)
- Neck angle (shoulder-nose-ear)
- Velocity calculations (degrees per second)
- Angular acceleration
- Movement quality scoring
