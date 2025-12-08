"use client"



import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getExercise } from "@/lib/storage"
import { analyzeVideoForPose } from "@/lib/pose-analyzer"
import { getExerciseConfig } from "@/lib/exercise-config"
import type { LearnedExerciseTemplate } from "@/lib/exercise-state-learner"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Upload, Loader2, CheckCircle2, XCircle, Video } from "lucide-react"
import { ComparisonRecorder } from "@/components/comparison-recorder"



interface ComparisonResult {

  similarity: number
  referenceReps: number
  uploadedReps: number
  details: {
    referenceTemplate: LearnedExerciseTemplate
    uploadedTemplate: LearnedExerciseTemplate
    stateMatches: { [key: string]: number }
    angleDeviations: { [key: string]: number }
  }

}



export default function ComparePage() {
  const params = useParams()
  const [exercise, setExercise] = useState<any>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [videoError, setVideoError] = useState<string | null>(null)
  const [inputMethod, setInputMethod] = useState<'upload' | 'webcam' | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)


  useEffect(() => {
    const ex = getExercise(params.id as string)
    if (ex) {
      console.log("Loaded exercise:", ex)
      console.log("Video URL:", ex.videoUrl)
      setExercise(ex)
    }
  }, [params.id])


  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('video/')) {
      setUploadedFile(file)
      setUploadedVideoUrl(URL.createObjectURL(file))
      setComparisonResult(null)
      setError(null)
    } else {
      setError("Please upload a valid video file")
    }
  }


  const handleVideoRecorded = (videoBlob: Blob) => {
    console.log("[ComparePage] Video recorded, blob size:", videoBlob.size)
    const file = new File([videoBlob], 'recorded-video.webm', { type: 'video/webm' })
    setUploadedFile(file)
    setUploadedVideoUrl(URL.createObjectURL(videoBlob))
    setComparisonResult(null)
    setError(null)
  }


  const compareVideos = async () => {
    if (!uploadedFile || !exercise) return


    setIsAnalyzing(true)
    setError(null)


    try {
      console.log("Starting video comparison...")
      // Check if reference video already has a learned template
      let referenceTemplate: LearnedExerciseTemplate
      if (exercise.learnedTemplate) {
        console.log("Using stored reference template")
        referenceTemplate = exercise.learnedTemplate
      } else {
        console.warn("No stored template found, analyzing reference video...")
        const referenceBlob = await fetch(exercise.videoUrl).then(r => r.blob())
        const referenceAnalysis = await analyzeVideoForPose(
          referenceBlob,
          undefined,
          { name: exercise.name, type: exercise.type }
        )
        if (!referenceAnalysis.learnedTemplate) {
          throw new Error("Failed to learn reference exercise template")
        }
        referenceTemplate = referenceAnalysis.learnedTemplate
      }


      console.log(" Analyzing uploaded video...")
      const exerciseConfig = getExerciseConfig(exercise.type)
      const anglesOfInterest = exerciseConfig?.anglesOfInterest
      console.log(`Exercise type: ${exercise.type}`)
      console.log(`Exercise config:`, exerciseConfig)
      console.log(`Using angles of interest:`, anglesOfInterest)
      if (!anglesOfInterest || anglesOfInterest.length === 0) {
        console.warn("No angles of interest found, template learning may not work")
      }
      const uploadedAnalysis = await analyzeVideoForPose(
        uploadedFile,
        anglesOfInterest,
        { name: exercise.name, type: exercise.type }
      )
      console.log("Uploaded analysis result:", uploadedAnalysis)
      console.log("Has learned template?", !!uploadedAnalysis.learnedTemplate)


      if (!uploadedAnalysis.learnedTemplate) {
        throw new Error(`Failed to learn uploaded exercise template. Video may be too short or no valid poses detected. Joint angles found: ${uploadedAnalysis.jointAngles.length}`)
      }


      console.log("Comparing templates...")
      const comparison = compareTemplates(
        referenceTemplate,
        uploadedAnalysis.learnedTemplate
      )


      setComparisonResult(comparison)
      console.log("Comparison complete:", comparison)
    } catch (err) {
      console.error("❌ Error comparing videos:", err)
      setError(err instanceof Error ? err.message : "Failed to compare videos")
    } finally {
      setIsAnalyzing(false)
    }
  }


  const compareTemplates = (
    reference: LearnedExerciseTemplate,
    uploaded: LearnedExerciseTemplate
  ): ComparisonResult => {
    const stateMatches: { [key: string]: number } = {}
    const angleDeviations: { [key: string]: number } = {}



    reference.states.forEach((refState) => {
      const closestMatch = uploaded.states.reduce((best, upState) => {
        const similarity = calculateStateSimilarity(refState, upState)
        return similarity > best.similarity ? { state: upState, similarity } : best
      }, { state: uploaded.states[0], similarity: 0 })


      stateMatches[refState.name] = closestMatch.similarity
    })


    const allAngles = new Set<string>()
    reference.states.forEach(s =>
      Object.keys(s.angleRanges).forEach(angle => allAngles.add(angle))
    )


    allAngles.forEach(angleName => {
      const refAngles = reference.states
        .map(s => s.angleRanges[angleName]?.mean)
        .filter(a => a !== undefined) as number[]
      const upAngles = uploaded.states
        .map(s => s.angleRanges[angleName]?.mean)
        .filter(a => a !== undefined) as number[]


      if (refAngles.length > 0 && upAngles.length > 0) {
        const refAvg = refAngles.reduce((a, b) => a + b, 0) / refAngles.length
        const upAvg = upAngles.reduce((a, b) => a + b, 0) / upAngles.length
        angleDeviations[angleName] = Math.abs(refAvg - upAvg)
      }
    })


    const stateSimilarity = Object.values(stateMatches).reduce((a, b) => a + b, 0) / Object.values(stateMatches).length
    const angleAccuracy = 100 - Math.min(100,
      Object.values(angleDeviations).reduce((a, b) => a + b, 0) / Object.values(angleDeviations).length
    )
    const overallSimilarity = (stateSimilarity * 0.6 + angleAccuracy * 0.4)


    return {
      similarity: Math.round(overallSimilarity),
      referenceReps: reference.recommendedReps,
      uploadedReps: uploaded.recommendedReps,
      details: {
        referenceTemplate: reference,
        uploadedTemplate: uploaded,
        stateMatches,
        angleDeviations,
      }
    }
  }


  const calculateStateSimilarity = (state1: any, state2: any): number => {
    const angles1 = Object.keys(state1.angleRanges)
    const angles2 = Object.keys(state2.angleRanges)
    const commonAngles = angles1.filter(a => angles2.includes(a))


    if (commonAngles.length === 0) return 0


    const similarities = commonAngles.map(angle => {
      const mean1 = state1.angleRanges[angle].mean
      const mean2 = state2.angleRanges[angle].mean
      const diff = Math.abs(mean1 - mean2)
      return Math.max(0, 100 - (diff / 180) * 100)
    })


    return similarities.reduce((a, b) => a + b, 0) / similarities.length
  }


  if (!exercise) {
    return (
      <main className="min-h-screen bg-background p-8">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Exercise not found</p>
            <Link href="/">
              <Button className="mt-4">Back Home</Button>
            </Link>
          </Card>
        </div>
      </main>
    )
  }


  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="outline">← Back</Button>
          </Link>
        </div>


        <div>
          <h1 className="text-3xl font-bold mb-2">Compare Videos - {exercise.name}</h1>
          <p className="text-muted-foreground">Upload a video or record using your webcam to compare against the reference exercise</p>
        </div>


        {/* Input Method Selection */}
        {!inputMethod && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card
              className="p-6 cursor-pointer hover:border-primary transition-colors"
              onClick={() => setInputMethod('upload')}
            >
              <div className="text-center space-y-3">
                <Upload className="w-12 h-12 mx-auto text-primary" />
                <h3 className="text-lg font-semibold">Upload Video</h3>
                <p className="text-sm text-muted-foreground">
                  Upload a pre-recorded video file from your device
                </p>
              </div>
            </Card>
            <Card
              className="p-6 cursor-pointer hover:border-primary transition-colors"
              onClick={() => setInputMethod('webcam')}
            >
              <div className="text-center space-y-3">
                <Video className="w-12 h-12 mx-auto text-primary" />
                <h3 className="text-lg font-semibold">Record with Webcam</h3>
                <p className="text-sm text-muted-foreground">
                  Record a new video using your webcam with real-time pose detection
                </p>
              </div>
            </Card>
          </div>
        )}


        {/* Video Upload Section */}
        {inputMethod === 'upload' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Upload Video for Comparison</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setInputMethod(null)
                  setUploadedFile(null)
                  setUploadedVideoUrl(null)
                  setComparisonResult(null)
                }}
              >
                Change Method
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <Input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileUpload}
                className="flex-1"
              />
              {uploadedFile && (
                <Button
                  onClick={compareVideos}
                  disabled={isAnalyzing}
                  className="gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Compare Videos
                    </>
                  )}
                </Button>
              )}
            </div>
            {error && (
              <div className="mt-4 p-3 bg-destructive/10 border border-destructive rounded-md">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
          </Card>
        )}


        {/* Webcam Recording Section */}
        {inputMethod === 'webcam' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Record Using Webcam</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setInputMethod(null)
                  setUploadedFile(null)
                  setUploadedVideoUrl(null)
                  setComparisonResult(null)
                }}
              >
                Change Method
              </Button>
            </div>
            <ComparisonRecorder 
              onVideoRecorded={handleVideoRecorded}
              anglesOfInterest={["right_knee"]}
              exerciseName={exercise?.name}
              exerciseType={exercise?.type}
              enableTestMode={true}
            />
            {uploadedFile && (
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Video recorded successfully!</p>
                  <Button
                    onClick={compareVideos}
                    disabled={isAnalyzing}
                    className="gap-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Compare Videos
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            )}
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive rounded-md">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
          </div>
        )}


        {/* Video Display Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Reference Video */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Reference Video</h2>
            <Card className="p-4 bg-muted aspect-video flex items-center justify-center rounded-lg overflow-hidden">
              {videoError && (
                <div className="text-sm text-destructive p-4 text-center">
                  <p className="font-semibold mb-2">Video Load Error:</p>
                  <p>{videoError}</p>
                  <p className="text-xs mt-2 opacity-70">URL: {exercise.videoUrl}</p>
                </div>
              )}
              <video
                ref={videoRef}
                controls
                className="w-full h-full object-contain rounded"
                crossOrigin="anonymous"
                onError={(e) => {
                  console.error("❌ Video load error:", e)
                  console.error("Video URL:", exercise.videoUrl)
                  console.error("Error event:", e.currentTarget.error)
                  setVideoError(
                    e.currentTarget.error
                      ? `Error ${e.currentTarget.error.code}: ${e.currentTarget.error.message}`
                      : "Failed to load video"
                  )
                }}
                onLoadedData={() => {
                  console.log("Video loaded successfully")
                  setVideoError(null)
                }}
              >
                <source src={exercise.videoUrl} type="video/webm" />
                <source src={exercise.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </Card>
          </div>


          {/* Uploaded Video */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Your Video</h2>
            <Card className="p-4 bg-muted aspect-video flex items-center justify-center rounded-lg overflow-hidden">
              {uploadedVideoUrl ? (
                <video
                  controls
                  className="w-full h-full object-contain rounded"
                >
                  <source src={uploadedVideoUrl} type="video/webm" />
                  <source src={uploadedVideoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="text-center text-muted-foreground">
                  <Upload className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Upload a video to compare</p>
                </div>
              )}
            </Card>
          </div>
        </div>


        {/* Comparison Results */}
        {comparisonResult && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Comparison Results</h2>
            {/* Overall Similarity */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold">Overall Similarity</span>
                <span className={`text-3xl font-bold ${comparisonResult.similarity >= 80 ? 'text-green-500' :
                  comparisonResult.similarity >= 60 ? 'text-yellow-500' :
                    'text-red-500'
                  }`}>
                  {comparisonResult.similarity}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
                <div
                  className={`h-full transition-all ${comparisonResult.similarity >= 80 ? 'bg-green-500' :
                    comparisonResult.similarity >= 60 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                  style={{ width: `${comparisonResult.similarity}%` }}
                />
              </div>
            </div>


            {/* Rep Counts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card className="p-4 bg-blue-50 dark:bg-blue-950/20">
                <div className="text-sm text-muted-foreground mb-1">Reference Reps</div>
                <div className="text-3xl font-bold">{comparisonResult.referenceReps}</div>
              </Card>
              <Card className="p-4 bg-purple-50 dark:bg-purple-950/20">
                <div className="text-sm text-muted-foreground mb-1">Your Reps</div>
                <div className="text-3xl font-bold">{comparisonResult.uploadedReps}</div>
              </Card>
            </div>


            {/* State Matches */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">State Accuracy</h3>
              <div className="space-y-2">
                {Object.entries(comparisonResult.details.stateMatches).map(([state, similarity]) => (
                  <div key={state} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{state}</span>
                        <span className="text-sm text-muted-foreground">{Math.round(similarity)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full ${similarity >= 80 ? 'bg-green-500' :
                            similarity >= 60 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                          style={{ width: `${similarity}%` }}
                        />
                      </div>
                    </div>
                    {similarity >= 80 ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                ))}
              </div>
            </div>


            {/* Angle Deviations */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Angle Deviations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(comparisonResult.details.angleDeviations).map(([angle, deviation]) => (
                  <Card key={angle} className={`p-3 ${deviation < 10 ? 'bg-green-50 dark:bg-green-950/20' :
                    deviation < 20 ? 'bg-yellow-50 dark:bg-yellow-950/20' :
                      'bg-red-50 dark:bg-red-950/20'
                    }`}>
                    <div className="text-xs text-muted-foreground mb-1">{angle}</div>
                    <div className="text-xl font-bold">±{Math.round(deviation)}°</div>
                  </Card>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>
    </main>
  )

}

