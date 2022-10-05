import { useState, useEffect } from 'react'

const initBeforeUnLoad = (showExitPrompt) => {
  window.onbeforeunload = (event) => {
    if (showExitPrompt) {
      const e = event || window.event
      e.preventDefault()
      if (e) {
        e.returnValue = ''
      }
      return ''
    }
  }
}

// Hook
export default function useExitPrompt(bool) {
  const [showExitPrompt, setShowExitPrompt] = useState(bool)

  if (typeof window !== "undefined") {
    console.log("YYY")
    window.onload = function() {
      initBeforeUnLoad(showExitPrompt)
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("YES")
      initBeforeUnLoad(showExitPrompt)
    }
  }, [showExitPrompt])

  return [showExitPrompt, setShowExitPrompt]
}