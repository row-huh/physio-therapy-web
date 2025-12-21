// deduct rep error by comparing performed angles to learned template

import type { LearnedExerciseTemplate } from "./exercise-state-learner"

export interface RepError {
  repNumber: number
  timestamp: number
  errors: {
    [angleName: string]: {
      expected: number 
      actual: number 
      error: number 
      percentError: number 
    }
  }
  overallError: number
  formScore: number 
  stateName: string 
}

export interface RepErrorSummary {
  repErrors: RepError[]
  averageError: number
  bestRep: number
  worstRep: number
  errorTrend: "improving" | "declining" | "stable"
  commonMistakes: string[]
}


export function calculateRepError(
  angles: { [key: string]: number },
  template: LearnedExerciseTemplate,
  anglesOfInterest: string[],
  repNumber: number,
  timestamp: number
): RepError | null {
  const primary = anglesOfInterest[0]
  const currentAngle = angles[primary]
  
  if (currentAngle === undefined) return null

  const candidates = template.states.filter(s => s.angleRanges[primary])
  if (candidates.length === 0) return null

  const nearestState = candidates.reduce((best, state) => {
    const stateMean = state.angleRanges[primary].mean
    const distance = Math.abs(currentAngle - stateMean)
    const bestDistance = Math.abs(currentAngle - best.angleRanges[primary].mean)
    return distance < bestDistance ? state : best
  }, candidates[0])

  const errors: RepError["errors"] = {}
  let totalError = 0
  let errorCount = 0

  anglesOfInterest.forEach(angleName => {
    const actual = angles[angleName]
    const stats = nearestState.angleRanges[angleName]
    
    if (actual === undefined || !stats) return

    const { mean, min, max, stdDev } = stats
    const error = Math.abs(actual - mean)
    const range = max - min
    const percentError = range > 0 ? (error / range) * 100 : 0

    errors[angleName] = {
      expected: mean,
      actual,
      error,
      percentError
    }

    totalError += error
    errorCount++
  })

  if (errorCount === 0) return null

  const overallError = totalError / errorCount

  const formScore = Math.max(0, Math.min(100, 100 - (overallError / 2)))

  return {
    repNumber,
    timestamp,
    errors,
    overallError,
    formScore,
    stateName: nearestState.name
  }
}


export function analyzeRepTrends(repErrors: RepError[]): RepErrorSummary {
  if (repErrors.length === 0) {
    return {
      repErrors: [],
      averageError: 0,
      bestRep: 0,
      worstRep: 0,
      errorTrend: "stable",
      commonMistakes: []
    }
  }

  const averageError = repErrors.reduce((sum, rep) => sum + rep.overallError, 0) / repErrors.length

  const bestRep = repErrors.reduce((best, rep) => 
    rep.overallError < best.overallError ? rep : best
  ).repNumber

  const worstRep = repErrors.reduce((worst, rep) => 
    rep.overallError > worst.overallError ? rep : worst
  ).repNumber

  let errorTrend: "improving" | "declining" | "stable" = "stable"
  if (repErrors.length >= 4) {
    const midpoint = Math.floor(repErrors.length / 2)
    const firstHalfAvg = repErrors.slice(0, midpoint).reduce((sum, rep) => sum + rep.overallError, 0) / midpoint
    const secondHalfAvg = repErrors.slice(midpoint).reduce((sum, rep) => sum + rep.overallError, 0) / (repErrors.length - midpoint)
    
    const improvementThreshold = 2 // degrees
    if (firstHalfAvg - secondHalfAvg > improvementThreshold) {
      errorTrend = "improving"
    } else if (secondHalfAvg - firstHalfAvg > improvementThreshold) {
      errorTrend = "declining"
    }
  }

  const angleMistakes = new Map<string, number>()
  repErrors.forEach(rep => {
    Object.entries(rep.errors).forEach(([angleName, error]) => {
      const current = angleMistakes.get(angleName) || 0
      angleMistakes.set(angleName, current + error.percentError)
    })
  })

  const commonMistakes: string[] = []
  angleMistakes.forEach((totalPercent, angleName) => {
    const avgPercent = totalPercent / repErrors.length
    if (avgPercent > 20) { 
      const readableName = angleName.replace(/_/g, " ")
      commonMistakes.push(`${readableName} (${avgPercent.toFixed(0)}% off)`)
    }
  })

  return {
    repErrors,
    averageError,
    bestRep,
    worstRep,
    errorTrend,
    commonMistakes
  }
}


export function getErrorFeedback(repError: RepError | null): string {
  if (!repError) return "Keep moving..."

  const { overallError, errors } = repError

  if (overallError < 5) {
    return "✓ Perfect form!"
  } else if (overallError < 10) {
    return "Good form, minor adjustments"
  } else if (overallError < 20) {
    const worstAngle = Object.entries(errors).reduce((worst, [name, error]) => 
      error.error > worst.error ? { name, ...error } : worst
    , { name: "", error: 0, expected: 0, actual: 0, percentError: 0 })

    const direction = worstAngle.actual > worstAngle.expected ? "less" : "more"
    const readableName = worstAngle.name.replace(/_/g, " ")
    return `Adjust ${readableName} - ${direction} bend`
  } else {
    return "⚠ Check your form"
  }
}
