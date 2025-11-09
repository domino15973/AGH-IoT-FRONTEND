import {api} from "./api";
import type {ApiEnvelope, ValueRecord, StatusRecord} from "../types/iot";

const byNewest = <T extends { date: string }>(a: T, b: T) =>
    new Date(b.date).getTime() - new Date(a.date).getTime();

export async function fetchLatestTemperature() {
    const {data} = await api.get<ApiEnvelope<ValueRecord>>("/api/db/temperatures");
    const latest = [...data.data.data].sort(byNewest)[0];
    return latest;
}

export async function fetchLatestHumidity() {
    const {data} = await api.get<ApiEnvelope<ValueRecord>>("/api/db/humidities");
    const latest = [...data.data.data].sort(byNewest)[0];
    return latest;
}

export async function fetchLatestWaterLevel() {
    const {data} = await api.get<ApiEnvelope<ValueRecord>>("/api/db/water-levels");
    const latest = [...data.data.data].sort(byNewest)[0];
    return latest;
}

export async function fetchLatestLightIntensity() {
    const {data} = await api.get<ApiEnvelope<ValueRecord>>("/api/db/light-intensity");
    const latest = [...data.data.data].sort(byNewest)[0];
    return latest;
}

export async function fetchLatestDiodesStatus() {
    const {data} = await api.get<ApiEnvelope<StatusRecord>>("/api/db/diodes");
    const latest = [...data.data.data].sort(byNewest)[0];
    return latest;
}
