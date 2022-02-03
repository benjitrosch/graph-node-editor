import { useEffect, useRef, useState } from "react"

import { Position } from "../types/bounds"

export enum DragState {
    IDLE    = 0,
    ACTIVE  = 1, 
    MOVE    = 2,
}

export const useDrag = (
    x = 0,
    y = 0,
    offsetX = 0,
    offsetY = 0
) => {
    const [state, setState] = useState(DragState.IDLE)   
    const [elementBelow, setElementBelow] = useState<string | null>(null)

    const [mouse, setMouse] = useState<Position>({ x, y })
    const [position, setPosition] = useState<Position>({ x, y })
    const [delta, setDelta] = useState<Position>({ x, y })
    
    const ref = useRef<HTMLDivElement>(null)

    const onMouseDown = (e: MouseEvent) => {
        e.stopPropagation()

        const parentElement = ref.current?.offsetParent as HTMLElement
        if (e.button !== 0 || !ref.current || !parentElement) {
            return
        }

        setMouse({
            x: e.x - parentElement.offsetLeft,
            y: e.y - parentElement.offsetTop
        })

        setDelta({
            x: e.x - parentElement.offsetLeft - ref.current.offsetLeft,
            y: e.y - parentElement.offsetTop - ref.current.offsetTop
        })

        setState(DragState.ACTIVE)
    }

    const onMouseMove = (e: MouseEvent) => {
        e.stopPropagation()

        const parentElement = ref.current?.offsetParent as HTMLElement
        if (!(state === DragState.ACTIVE || state === DragState.MOVE) || !ref.current || !parentElement) {
            return
        }

        setState(DragState.MOVE)
        
        setMouse({
            x: e.x - parentElement.offsetLeft,
            y: e.y - parentElement.offsetTop
        })
        
        setPosition({
            x: e.x - delta.x - parentElement.offsetLeft + offsetX,
            y: e.y - delta.y - parentElement.offsetTop + offsetY
        })
    }

    const onMouseUp = (e: MouseEvent) => {
        const elementBelow = e.target as Element
        const id = elementBelow.id
        setElementBelow(id === '' ? null : id)

        setState(DragState.IDLE)
    }

    const onClick = () => {
        setState(DragState.IDLE)
    }

    useEffect(() => {
        const element = ref.current

        if (element != null) {
            element.addEventListener("mousedown", onMouseDown)
            return () => {
                element.removeEventListener("mousedown", onMouseDown)
            }
        }
    }, [])

    useEffect(() => {
        if (state === DragState.ACTIVE || state === DragState.MOVE) {
            document.addEventListener("mouseup", onMouseUp)
            document.addEventListener("mousemove", onMouseMove)
            document.addEventListener("click", onClick)
        } else {
            document.removeEventListener("mouseup", onMouseUp)
            document.removeEventListener("mousemove", onMouseMove)
            document.removeEventListener("click", onClick)
        }

        return () => {
            document.removeEventListener("mouseup", onMouseUp)
            document.removeEventListener("mousemove", onMouseMove)
            document.removeEventListener("click", onClick)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state])

    return {
        ref,
        state,
        mouse,
        position,
        delta,
        elementBelow,
    }
}

export default useDrag
