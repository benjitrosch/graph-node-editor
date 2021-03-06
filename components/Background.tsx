import { forwardRef, RefObject } from "react"

import { Position } from "../types/bounds"

type Props = {
    offset: Position,
    zoom: number,
    className: string
}

const Background = forwardRef<HTMLDivElement, Props>(({
    offset,
    zoom,
    className
}, ref) => {    
    const size = 32

    return (
        <div
            ref={ref}
            className={className}
        >
            <svg
                style={{
                    width: '100%',
                    height: '100%',
                }}
            >
                <defs>
                    <pattern
                        id="grid"
                        x={offset.x}
                        y={offset.y}
                        width={size * zoom}
                        height={size * zoom}
                        patternUnits="userSpaceOnUse"
                    >
                        <path
                            className="stroke-base-400"
                            d={`M ${size * zoom} 0 L 0 0 0 ${size * zoom}`}
                            fill="none"
                            strokeWidth="0.5"/>
                    </pattern>
                </defs>

                <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="url(#grid)"
                />
            </svg>
        </div>
    )
})

Background.displayName = "Background"

export default Background