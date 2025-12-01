"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { VideoRecorder } from "@/components/video-recorder"
import { getAllExercises, getExercise } from "@/lib/pose-store"
import { calculatePoseSimilarity, type Pose } from "@/lib/pose-utils"
import Link from "next/link"

interface ComparisonResult {
  referencePose: string
  similarity: number
  feedback: string
}

export default function ComparePage() {
  const [step, setStep] = useState<"select" | "record" | "results">("select")
  const [exercises, setExercises] = useState<any[]>([])
  const [selectedExercise, setSelectedExercise] = useState<any>(null)
  const [userPoses, setUserPoses] = useState<Pose[]>([])
  const [results, setResults] = useState<ComparisonResult[]>([])

  useEffect(() => {
    setExercises(getAllExercises())
  }, [])

  const handleSelectExercise = (exerciseId: string) => {
    const exercise = getExercise(exerciseId)
    if (exercise) {
      setSelectedExercise(exercise)
      setStep("record")
    }
  }

  const handlePoseCaptured = (pose: Pose) => {
    setUserPoses([...userPoses, pose])
  }

  const generateFeedback = (similarity: number): string => {
    if (similarity > 0.85) return "Excellent form! Nearly identical to reference."
    if (similarity > 0.7) return "Good form. Minor adjustments needed."
    if (similarity > 0.5) return "Fair form. Check your alignment and depth."
    return "Needs improvement. Review the reference position."
  }

  const handleCompare = () => {
    if (userPoses.length === 0 || !selectedExercise) return

    const comparisonResults: ComparisonResult[] = []

    // Compare each user pose to all reference poses
    userPoses.forEach((userPose) => {
      selectedExercise.keyPoses.forEach((refPose: any) => {
        const similarity = calculatePoseSimilarity(userPose, refPose.pose)
        comparisonResults.push({
          referencePose: refPose.name,
          similarity,
          feedback: generateFeedback(similarity),
        })
      })
    })

    // Sort by similarity descending
    comparisonResults.sort((a, b) => b.similarity - a.similarity)
    setResults(comparisonResults)
    setStep("results")
  }

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/">
          <Button variant="outline" className="mb-6 bg-transparent">
            Back
          </Button>
        </Link>

        {step === "select" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Compare Your Exercise</h1>
              <p className="text-muted-foreground">Select a reference exercise to compare against</p>
            </div>

            {exercises.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground mb-4">No exercises created yet</p>
                <Link href="/record">
                  <Button>Create a Reference Exercise</Button>
                </Link>
              </Card>
            ) : (
              <div className="grid gap-3">
                {exercises.map((exercise) => (
                  <Card
                    key={exercise.id}
                    className="p-4 cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => handleSelectExercise(exercise.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{exercise.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {exercise.keyPoses.length} key pose{exercise.keyPoses.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <Button variant="secondary" size="sm">
                        Select
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {step === "record" && selectedExercise && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Record Your Exercise</h1>
              <p className="text-muted-foreground">
                Perform {selectedExercise.name} while the camera records your poses
              </p>
            </div>

            <VideoRecorder onPoseCaptured={handlePoseCaptured} />

            {userPoses.length > 0 && (
              <Card className="p-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                <p className="text-sm">
                  <span className="font-semibold">{userPoses.length}</span> pose{userPoses.length !== 1 ? "s" : ""}{" "}
                  captured
                </p>
              </Card>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedExercise(null)
                  setUserPoses([])
                  setStep("select")
                }}
                className="flex-1"
              >
                Back
              </Button>
              <Button onClick={handleCompare} disabled={userPoses.length === 0} className="flex-1">
                Compare Poses
              </Button>
            </div>
          </div>
        )}

        {step === "results" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Comparison Results</h1>
              <p className="text-muted-foreground">How your poses compare to the reference</p>
            </div>

            {results.length > 0 ? (
              <div className="space-y-4">
                {results.map((result, idx) => (
                  <Card key={idx} className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{result.referencePose}</h3>
                        <span className="text-lg font-bold">{(result.similarity * 100).toFixed(0)}%</span>
                      </div>

                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            result.similarity > 0.7
                              ? "bg-green-500"
                              : result.similarity > 0.5
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                          style={{ width: `${result.similarity * 100}%` }}
                        />
                      </div>

                      <p className="text-sm text-muted-foreground">{result.feedback}</p>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No comparison results available</p>
              </Card>
            )}

            <div className="flex gap-3">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  Home
                </Button>
              </Link>
              <Button
                onClick={() => {
                  setSelectedExercise(null)
                  setUserPoses([])
                  setResults([])
                  setStep("select")
                }}
                className="flex-1"
              >
                Compare Another
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
