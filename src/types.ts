export type RecurrenceType = 'daily' | 'weekly' | 'monthly' | 'none';

export interface Task {
    id?: string;
    start: Date;
    end: Date;
    eventName: string;
    eventDescription: string;
    recurrence: RecurrenceType;
}

export interface Event {
    summary: string;
    description: string;
    start: { dateTime: string; timeZone: string };
    end: { dateTime: string; timeZone: string };
    recurrence?: string[];
}
