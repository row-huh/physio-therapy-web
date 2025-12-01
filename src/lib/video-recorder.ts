export async function startVideoRecording(
  stream: MediaStream,
): Promise<{ blob: () => Promise<Blob>; stop: () => void }> {
  const mediaRecorder = new MediaRecorder(stream)
  const chunks: BlobPart[] = []

  mediaRecorder.ondataavailable = (event) => {
    chunks.push(event.data)
  }

  mediaRecorder.start()

  return {
    stop: () => {
      mediaRecorder.stop()
    },
    blob: () =>
      new Promise((resolve) => {
        mediaRecorder.onstop = () => {
          resolve(new Blob(chunks, { type: "video/webm" }))
        }
      }),
  }
}

export async function getWebcamStream(): Promise<MediaStream> {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
    audio: false,
  })
  return stream
}

export function drawSkeletonOnCanvas(canvas: HTMLCanvasElement, pose: any) {
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const keypoints = pose.keypoints
  if (!keypoints || keypoints.length === 0) return

  // Skeleton connections (bone pairs)
  const connections = [
    // Head
    [0, 1], // NOSE to LEFT_EYE
    [0, 2], // NOSE to RIGHT_EYE
    [1, 3], // LEFT_EYE to LEFT_EAR
    [2, 4], // RIGHT_EYE to RIGHT_EAR
    // Arms
    [5, 7], // LEFT_SHOULDER to LEFT_ELBOW
    [7, 9], // LEFT_ELBOW to LEFT_WRIST
    [6, 8], // RIGHT_SHOULDER to RIGHT_ELBOW
    [8, 10], // RIGHT_ELBOW to RIGHT_WRIST
    // Body
    [5, 6], // LEFT_SHOULDER to RIGHT_SHOULDER
    [5, 11], // LEFT_SHOULDER to LEFT_HIP
    [6, 12], // RIGHT_SHOULDER to RIGHT_HIP
    [11, 12], // LEFT_HIP to RIGHT_HIP
    // Legs
    [11, 13], // LEFT_HIP to LEFT_KNEE
    [13, 15], // LEFT_KNEE to LEFT_ANKLE
    [12, 14], // RIGHT_HIP to RIGHT_KNEE
    [14, 16], // RIGHT_KNEE to RIGHT_ANKLE
  ]

  // Draw bones/connections
  ctx.strokeStyle = "#00ff00"
  ctx.lineWidth = 2

  for (const [i, j] of connections) {
    if (i < keypoints.length && j < keypoints.length) {
      const kp1 = keypoints[i]
      const kp2 = keypoints[j]

      // Only draw if both keypoints have good confidence
      if (kp1.score > 0.2 && kp2.score > 0.2) {
        ctx.beginPath()
        ctx.moveTo(kp1.x, kp1.y)
        ctx.lineTo(kp2.x, kp2.y)
        ctx.stroke()
      }
    }
  }

  // Draw keypoints as circles
  for (const kp of keypoints) {
    if (kp.score > 0.2) {
      ctx.fillStyle = kp.score > 0.5 ? "#00ff00" : "#ffff00"
      ctx.beginPath()
      ctx.arc(kp.x, kp.y, 4, 0, 2 * Math.PI)
      ctx.fill()
    }
  }
}
