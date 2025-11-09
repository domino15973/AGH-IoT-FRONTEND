export type RecordBase = {
    _id: string;
    date: string; // ISO
    __v?: number;
};

export type ValueRecord = RecordBase & { value: number };
export type StatusRecord = RecordBase & { status: boolean };

export type ApiEnvelope<T> = {
    success: boolean;
    data: {
        data: T[];
        pagination: { total: number; count: number; limit: number; skip: number };
    };
    message: string;
    timestamp: string;
};
