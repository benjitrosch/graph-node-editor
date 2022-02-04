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
            className="relative w-full h-fit flex items-center justify-between gap-8 p-1 bg-[#2e2e2e] border-t-2 border-[#323232] text-[#999999] text-xs"
        >
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#38362f] border border-[#f7d964]" />

                <span>{title}</span>
            </div>

            <div className="flex items-center gap-2">
                <span
                    className="px-1 text-white bg-[#555555] border border-[#777777] rounded"
                >
                    {value}
                </span>

                <div className="w-2 h-2 rounded-full bg-[#c9bb82] border border-[#f7d964]" />
            </div>
        </div>
    )
}

export default DataRow