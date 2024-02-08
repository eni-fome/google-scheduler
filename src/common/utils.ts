import { RecurrenceType } from './types';

export const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const formatDate = (date: any) => {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: userTimeZone,
    }).format(date);
};

export const recurrenceRule = (recurrence: 'daily' | 'weekly' | 'monthly') =>
    `RRULE:FREQ=${recurrence.toUpperCase()}`;

export const convertRecurrence = (
    recurrenceString: string[] | undefined,
): RecurrenceType => {
    if (recurrenceString && recurrenceString[0].includes('DAILY')) {
        return 'daily';
    }
    if (recurrenceString && recurrenceString[0].includes('WEEKLY')) {
        return 'weekly';
    }
    if (recurrenceString && recurrenceString[0].includes('MONTHLY')) {
        return 'monthly';
    }
    return 'none';
};
