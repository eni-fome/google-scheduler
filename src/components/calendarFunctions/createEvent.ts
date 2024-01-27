import { Task, Event } from '../../types'; 
import { userTimeZone, recurrenceRule } from '../../utils'; 

export async function createCalendarEvent(
  task: Task,  
  session: { provider_token?: string | null } | null,
  apiUrl: string,
  fetchCalendarEvents: any
): Promise<void> {
    console.log('Creating calendar event');
    const token = session?.provider_token || '';

    const event: Event = {
        summary: task.eventName,
        description: `${task.eventDescription} [Created with MyCalendarApp]`,
        start: {
            dateTime: task.start.toISOString(),
            timeZone: userTimeZone,
        },
        end: {
            dateTime: task.end.toISOString(),
            timeZone: userTimeZone,
        },
    };

    if (task.recurrence !== 'none') {
        event.recurrence = [recurrenceRule(task.recurrence)];
    }

    try {
        const response = await fetch(
            apiUrl,
            {
                method: 'POST',
                headers: {
                    Authorization:
                        'Bearer ' + (token),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(event),
            },
        );

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data);
        alert('Event created, check your Google Calendar!');
    } catch (error) {
        console.error(error);
        alert('Error creating event. Please try again.');
    }
    fetchCalendarEvents();
}
