import { NodeDataTypes } from "../types/nodes"

type Props<T> = {
    title: string
    value: T
}

const DataRow = 
    <T extends NodeDataTypes>
({
    title,
    value
}: Props<T>): JSX.Element => {
    return (
        <div
        className="relative w-full h-fit flex items-center justify-between gap-8 border-t border-black text-xs"
    >
        <span>{title}</span>
        <span>{value}</span>
    </div>
    )
}

export default DataRow