import * as React from "react"

import { cn } from "@/lib/utils"

export function useMediaQuery(query) {
  const [value, setValue] = React.useState(false)

  React.useEffect(() => {
    function onChange(event) {
      setValue(event.matches)
    }

    const result = matchMedia(query)
    setValue(result.matches)
    result.addEventListener("change", onChange)

    return () => result.removeEventListener("change", onChange)
  }, [query])

  return value
}

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  return useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
}