import { CSSProperties, FC } from "react"
import clsx from 'clsx'

type Props = {
    size?: number
    className?: string
    style?: CSSProperties
    onClick?: () => void
}

const Chevron: FC<Props> = ({
    size = 16,
    className,
    style,
    onClick,
}) => {
    const classes = clsx(
        "bg-transparent cursor-pointer stroke-base-100",
        className
    )

    return (
        <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            onClick={onClick && onClick}
            className={classes}
            style={{
                ...style,
                transformOrigin: `${size * 0.25}px ${size * 0.4}px`,
            }}
        >
            <path
                fill="none"
                strokeWidth="2"
                d={`M0 0 L${size * 0.5} ${size * 0.5} L0 ${size}`}
            />
        </svg>
    )
}

export default Chevron