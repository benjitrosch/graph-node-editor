import { forwardRef, RefObject } from "react"

import { Position } from "../types/bounds"

type Props = {
    offset: Position,
    ref: RefObject<HTMLDivElement>
    className: string
}

const Background = forwardRef<HTMLDivElement, Props>(({
    offset,
    className
}, ref) => {    
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
                        width="32"
                        height="32"
                        patternUnits="userSpaceOnUse"
                    >
                        <path
                            d="M 32 0 L 0 0 0 32"
                            fill="none"
                            stroke="gray"
                            strokeWidth="0.5"/>
                    </pattern>
                </defs>

                <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="url(#grid)"
                    stroke="#000000"
                    strokeWidth={2}
                />
            </svg>
        </div>
    )
})

Background.displayName = "Background"

export default Background