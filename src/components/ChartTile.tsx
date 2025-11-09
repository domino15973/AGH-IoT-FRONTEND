import React, {useEffect, useState} from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import axios from "axios";

type Range = "1d" | "3d" | "7d";

interface ChartTileProps {
    title: string;
    endpoint: string;
    unit: string;
    color: string;
    savedRange?: string;
    onRangeChange?: (range: string) => void;
}

export default function ChartTile({
                                      title,
                                      endpoint,
                                      unit = "",
                                      color = "#84cc16",
                                      savedRange,
                                      onRangeChange,
                                  }: ChartTileProps) {
    const [range, setRange] = useState<Range>((savedRange as Range) || "1d");
    const [data, setData] = useState<{ date: string; value: number }[]>([]);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const getRangeDates = (range: Range) => {
        const end = new Date();
        const start = new Date();
        if (range === "3d") start.setDate(end.getDate() - 3);
        else if (range === "7d") start.setDate(end.getDate() - 7);
        else start.setDate(end.getDate() - 1);
        return {
            startDate: start.toISOString().split("T")[0],
            endDate: end.toISOString().split("T")[0],
        };
    };

    useEffect(() => {
        onRangeChange?.(range);
    }, [range]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setErr(null);
            const {startDate, endDate} = getRangeDates(range);
            try {
                const res = await axios.get(`${endpoint}?startDate=${startDate}&endDate=${endDate}`);
                const arr = res.data?.data?.data || [];
                const formatted = arr.map((x: any) => ({
                    date: new Date(x.date).toLocaleString(),
                    value: x.value ?? (x.status ? 1 : 0),
                }));
                setData(formatted);
            } catch {
                setErr("Failed to load chart data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [endpoint, range]);

    return (
        <div className="flex flex-col w-full h-full mt-6">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
                    {title}
                </h2>
                <div className="flex gap-2">
                    {["1d", "3d", "7d"].map((r) => (
                        <button
                            key={r}
                            onClick={() => setRange(r as Range)}
                            className={`px-2 py-1 text-xs rounded-md ${
                                range === r
                                    ? "bg-lime-500 text-black"
                                    : "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700"
                            }`}
                        >
                            {r === "1d" ? "1 Day" : r === "3d" ? "3 Days" : "7 Days"}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex-1 flex items-center justify-center text-zinc-500 text-sm">
                    Loading...
                </div>
            ) : err ? (
                <div className="flex-1 flex items-center justify-center text-red-500 text-sm">
                    {err}
                </div>
            ) : data.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-zinc-500 text-sm">
                    No data available
                </div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{top: 10, right: 10, left: -10, bottom: 10}}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#555" opacity={0.2}/>
                        <XAxis
                            dataKey="date"
                            tick={{fontSize: 10, fill: "currentColor"}}
                            interval="preserveStartEnd"
                        />
                        <YAxis
                            tick={{fontSize: 10, fill: "currentColor"}}
                            domain={["auto", "auto"]}
                            tickFormatter={(v) => `${v}${unit}`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(0,0,0,0.8)",
                                border: "none",
                                color: "#fff",
                            }}
                            formatter={(v) => [`${v}${unit}`, title]}
                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke={color}
                            strokeWidth={2}
                            dot={false}
                            activeDot={{r: 4}}
                        />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}
