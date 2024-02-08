import { Task, Event } from '../../common/types';
import { userTimeZone, recurrenceRule } from '../../common/utils';
import { fetchCalendarEvents } from './fetchEvents';

export async function editEvent(
    eventId: string | undefined,
    task: Task,
    session: { provider_token?: string | null } | null,
    apiUrl: string,
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>,
    updatedTask: React.Dispatch<React.SetStateAction<Task | null>>,
) {
    const event: Event = {
        summary: task.eventName,
        description: task.eventDescription,
        start: {
            dateTime: task.start.toISOString(),
            timeZone: userTimeZone,
        },
        end: { dateTime: task.end.toISOString(), timeZone: userTimeZone },
    };

    if (task.recurrence !== 'none') {
        event.recurrence = [recurrenceRule(task.recurrence)];
    } else {
        event.recurrence = []; // Clear recurrence if it's set to 'none'
    }

    try {
        const response = await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
            {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${session?.provider_token || ''}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(event),
            },
        );

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const jsonResponse = await response.json();
        console.log('Update successful:', jsonResponse);
    } catch (error) {
        console.error('Error during event update:', error);
        // Optionally log the entire request details for debugging
        console.log('Request details:', eventId, updatedTask);
    }
    fetchCalendarEvents(session, apiUrl, setTasks);
}
