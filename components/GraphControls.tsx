import clsx from "clsx"
import { FC } from "react"

type Props = {
    locked: boolean
    zoomIn: () => void
    zoomOut: () => void
    toggleLocked: () => void
    toggleFullscreen: () => void
}

const GraphControls: FC<Props> = ({
    locked,
    zoomIn,
    zoomOut,
    toggleLocked,
    toggleFullscreen,
}) => {
    const buttonclasses = clsx(
        "w-8 h-8 bg-base-500 hover:bg-base-400 text-base-100"
    )

    return (
        <div
            className="absolute z-50 flex flex-col items-center justify-between bottom-0 right-0 m-4 gap-0.5 bg-base-300 border border-base-300 font-bold text-xl shadow-[0_0_8px_rgba(0,0,0,0.5)]"
        >
            <button
                className={buttonclasses}
                onClick={zoomIn}
            >
                +
            </button>

            <button
                className={buttonclasses}
                onClick={zoomOut}
            >
                -
            </button>

            <button
                className={buttonclasses}
                onClick={toggleLocked}
            >
                {locked ? '🔒' : '🔓'}
            </button>

            <button
                className={buttonclasses}
                onClick={toggleFullscreen}
            >
                🖥️
            </button>
        </div>
    )
}

export default GraphControls