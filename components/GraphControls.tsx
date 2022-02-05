import clsx from "clsx"
import { FC } from "react"

type Props = {
    locked: boolean
    zoomIn: () => void
    zoomOut: () => void
    toggleLocked: (value: boolean) => void
}

const GraphControls: FC<Props> = ({
    locked,
    zoomIn,
    zoomOut,
    toggleLocked,
}) => {
    const buttonclasses = clsx(
        "w-8 h-8 bg-[#2e2e2e] hover:bg-[#323232] text-[#999999]"
    )

    return (
        <div
            className="absolute z-50 flex flex-col items-center justify-between bottom-0 right-0 m-4 gap-0.5 bg-[#555555] border border-[#555555] font-bold text-xl shadow-[0_0_8px_rgba(0,0,0,0.5)]"
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
                onClick={() => toggleLocked(!locked)}
            >
                {locked ? '🔒' : '🔓'}
            </button>
        </div>
    )
}

export default GraphControls