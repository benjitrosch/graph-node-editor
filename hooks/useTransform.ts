import { useEffect, useRef, useState } from "react"

import { Position } from "../types/bounds"

const useTransform = (
    k = 1,
    x = 0,
    y = 0,
) => {
    const [zoom, setZoom] = useState<number>(k)
    const [translation, setTranslation] = useState<Position>({ x, y })

    const ref = useRef<HTMLDivElement>(null)

    const onScroll = (e: WheelEvent) => {
        setZoom(zoom + (e.deltaY * 0.01))
    }

    useEffect(() => {
        const element = ref.current

        if (element != null) {
            element.addEventListener("wheel", onScroll, { passive: true} )
            return () => {
                element.removeEventListener("wheel", onScroll)
            }
        }
    }, [])

    return {
        ref,
        zoom,
        translation,
    }
}

export default useTransform