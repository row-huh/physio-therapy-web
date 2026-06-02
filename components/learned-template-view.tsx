"use client"

import { Card } from "./ui/card"
import { Button } from "./ui/button"
import type { LearnedExerciseTemplate } from "@/lib/exercise-state-learner"
import type { PoseV2Template } from "@/lib/template-learner"

type AnyTemplate = PoseV2Template | LearnedExerciseTemplate

interface LearnedTemplateViewProps {
  template: AnyTemplate
  onSaveTemplate?: () => void
}

export function LearnedTemplateView({ template, onSaveTemplate }: LearnedTemplateViewProps) {
  const isV2 = (template as PoseV2Template).templateVersion === 2
  const v2 = isV2 ? (template as PoseV2Template) : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Learned Exercise Template</h2>
            {v2 ? (
              <p className="text-muted-foreground">
                Primary signal: <strong>{v2.primarySignal?.feature ?? "—"}</strong>{" "}
                ({v2.primarySignal?.direction}) ·{" "}
                {v2.bilateral ? "Bilateral" : "Unilateral"}
              </p>
            ) : (
              <p className="text-muted-foreground">
                Automatically detected <strong>{template.states.length} key states</strong> from your reference video
              </p>
            )}
          </div>

          {v2 && (
            <div
              className={`text-sm font-semibold px-3 py-1 rounded-full ${
                v2.quality.confidence >= 70
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : v2.quality.confidence >= 40
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              }`}
            >
              {v2.quality.confidence}% confidence
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
          <div>
            <div className="text-sm text-muted-foreground">Duration</div>
            <div className="text-lg font-semibold">{template.totalDuration.toFixed(1)}s</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Detected Reps</div>
            <div className="text-lg font-semibold">{template.recommendedReps}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">FPS</div>
            <div className="text-lg font-semibold">{template.metadata.fps}</div>
          </div>
        </div>

        {/* V2: Primary signal summary */}
        {v2?.primarySignal?.feature && (
          <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="bg-muted/50 rounded-md p-2">
              <div className="text-xs text-muted-foreground">Rest value</div>
              <div className="font-semibold">{v2.primarySignal.restValue.toFixed(1)}°</div>
            </div>
            <div className="bg-muted/50 rounded-md p-2">
              <div className="text-xs text-muted-foreground">Peak value</div>
              <div className="font-semibold">{v2.primarySignal.peakValue.toFixed(1)}°</div>
            </div>
            <div className="bg-muted/50 rounded-md p-2">
              <div className="text-xs text-muted-foreground">Amplitude</div>
              <div className="font-semibold">{v2.primarySignal.amplitude.toFixed(1)}°</div>
            </div>
            <div className="bg-muted/50 rounded-md p-2">
              <div className="text-xs text-muted-foreground">Cycle consistency</div>
              <div className="font-semibold">{Math.round(v2.quality.cycleConsistency * 100)}%</div>
            </div>
          </div>
        )}
      </Card>

      {/* V2 warnings */}
      {v2 && v2.quality.warnings.length > 0 && (
        <Card className="p-4 border-yellow-300 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-700">
          <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Template Warnings</h3>
          <ul className="space-y-1">
            {v2.quality.warnings.map((w, i) => (
              <li key={i} className="text-sm text-yellow-800 dark:text-yellow-200">• {w}</li>
            ))}
          </ul>
        </Card>
      )}

      {/* V2: Active features */}
      {v2 && v2.activeFeatures.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xl font-semibold">Active Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {v2.activeFeatures.map((feat) => (
              <Card key={feat.name} className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium capitalize">{feat.name.replace(/_/g, " ")}</span>
                  {feat.name === v2.primarySignal?.feature && (
                    <span className="text-xs bg-primary text-primary-foreground rounded px-2 py-0.5">Primary</span>
                  )}
                </div>
                <div className="text-2xl font-bold">{feat.amplitude.toFixed(1)}°</div>
                <div className="text-xs text-muted-foreground">
                  Range: {feat.min.toFixed(1)}° – {feat.max.toFixed(1)}° ·{" "}
                  vis: {Math.round(feat.visibility * 100)}%
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* V2: Rep segments */}
      {v2 && v2.repSegments.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xl font-semibold">Detected Repetitions</h3>
          <div className="flex flex-wrap gap-2">
            {v2.repSegments.map((rep, i) => (
              <div
                key={i}
                className={`rounded-lg px-3 py-2 text-sm ${
                  rep.hasDropout
                    ? "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200"
                    : "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                }`}
              >
                <div className="font-medium">Rep {i + 1}</div>
                <div className="text-xs">
                  {rep.startTime.toFixed(1)}s – {rep.endTime.toFixed(1)}s ({rep.duration.toFixed(1)}s)
                  {rep.hasDropout && " ⚠ dropout"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legacy: States (v1 or v2 with synthesised states) */}
      {!v2 && template.states.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Detected States</h3>

          {template.states.map((state, index) => (
            <Card key={state.id} className="p-6">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold">
                  {index + 1}
                </div>

                <div className="flex-1">
                  <h4 className="text-lg font-semibold mb-1">{state.name}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{state.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                    {Object.entries(state.angleRanges).map(([angleName, range]) => (
                      <div key={angleName} className="bg-muted/50 rounded-md p-3">
                        <div className="text-sm font-medium capitalize">
                          {angleName.replace(/_/g, " ")}
                        </div>
                        <div className="text-2xl font-bold mt-1">
                          {Math.round(range.mean)}°
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Range: {Math.round(range.min)}° – {Math.round(range.max)}° (±{Math.round(range.stdDev)}°)
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-sm">
                    <strong>Appears {state.occurrences.length} time(s):</strong>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {state.occurrences.map((occ, occIdx) => (
                        <span
                          key={occIdx}
                          className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded px-2 py-1 text-xs"
                        >
                          {occ.startTime.toFixed(1)}s – {occ.endTime.toFixed(1)}s ({occ.duration.toFixed(1)}s)
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Exercise flow (legacy) */}
      {!v2 && template.repSequence.length > 0 && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Exercise Flow</h3>
          <div className="flex items-center gap-2 flex-wrap">
            {template.repSequence.map((stateId, index) => {
              const state = template.states.find((s) => s.id === stateId)
              return (
                <div key={index} className="flex items-center gap-2">
                  <div className="bg-primary text-primary-foreground rounded-lg px-4 py-2 font-medium">
                    {state?.name || stateId}
                  </div>
                  {index < template.repSequence.length - 1 && (
                    <span className="text-2xl text-muted-foreground">→</span>
                  )}
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {onSaveTemplate && (
        <div className="flex justify-end">
          <Button onClick={onSaveTemplate} size="lg">
            Save Template for Comparisons
          </Button>
        </div>
      )}
    </div>
  )
}
