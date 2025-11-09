import React, {useEffect, useState} from "react";
import {
    fetchLatestTemperature,
    fetchLatestHumidity,
    fetchLatestWaterLevel,
    fetchLatestLightIntensity,
    fetchLatestDiodesStatus,
} from "../services/iot";

type Latest = {
    temperature?: { value: number; date: string };
    humidity?: { value: number; date: string };
    water?: { value: number; date: string };
    light?: { value: number; date: string };
    diodes?: { status: boolean; date: string };
};

export default function OverviewTile() {
    const [data, setData] = useState<Latest>({});
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const [t, h, w, l, d] = await Promise.all([
                    fetchLatestTemperature(),
                    fetchLatestHumidity(),
                    fetchLatestWaterLevel(),
                    fetchLatestLightIntensity(),
                    fetchLatestDiodesStatus(),
                ]);

                if (!mounted) return;
                setData({
                    temperature: t ? {value: t.value, date: t.date} : undefined,
                    humidity: h ? {value: h.value, date: h.date} : undefined,
                    water: w ? {value: w.value, date: w.date} : undefined,
                    light: l ? {value: l.value, date: l.date} : undefined,
                    diodes: d ? {status: d.status, date: d.date} : undefined,
                });
                setErr(null);
            } catch {
                setErr("Failed to load overview");
            } finally {
                setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    if (loading)
        return (
            <div className="w-full h-64 flex items-center justify-center text-zinc-400">
                Loading...
            </div>
        );

    if (err)
        return (
            <div className="text-sm text-red-500 w-full text-center">{err}</div>
        );

    const fmt = (iso?: string) =>
        iso ? new Date(iso).toLocaleString() : "-";

    const latestDate = [
        data.temperature?.date,
        data.humidity?.date,
        data.water?.date,
        data.light?.date,
        data.diodes?.date,
    ]
        .filter(Boolean)
        .sort((a, b) => new Date(b!).getTime() - new Date(a!).getTime())[0];

    const items = [
        {
            key: "temperature",
            label: "Temperature",
            value: `${data.temperature?.value ?? "-"} °C`,
            icon: "/temperature.svg",
        },
        {
            key: "humidity",
            label: "Humidity",
            value: `${data.humidity?.value ?? "-"} %`,
            icon: "/humidity.svg",
        },
        {
            key: "water",
            label: "Water level",
            value: `${data.water?.value ?? "-"} %`,
            icon: "/water_level.svg",
        },
        {
            key: "light",
            label: "Light intensity",
            value: `${data.light?.value ?? "-"} %`,
            icon: "/light.svg",
        },
        {
            key: "diodes",
            label: "Status",
            value: data.diodes
                ? data.diodes.status
                    ? "Problem"
                    : "OK"
                : "-",
            icon: data.diodes?.status ? "/diode_on.svg" : "/diode_off.svg",
        },
    ];

    return (
        <div
            className="w-full h-full flex flex-col p-4 rounded-xl bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-200 transition-colors">
            <h2 className="text-lg font-semibold text-lime-600 dark:text-lime-400 mb-4 text-center">
                Current Values
            </h2>
            <div className="flex flex-col gap-3 flex-grow">
                {items.map((i) => (
                    <div
                        key={i.key}
                        className="flex items-center justify-between bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors rounded-lg px-3 py-3"
                    >
                        <div className="flex items-center gap-3">
                            <img src={i.icon} alt={i.label} className="w-5 h-5 opacity-80"/>
                            <span className="text-sm font-medium">{i.label}</span>
                        </div>
                        <div className="text-base font-bold text-lime-600 dark:text-lime-400">
                            {i.value}
                        </div>
                    </div>
                ))}
            </div>
            <div className="text-xs text-center text-gray-600 dark:text-gray-400 mt-3">
                Last update: {fmt(latestDate)}
            </div>
        </div>
    );
}
