import { Task } from "../../types";
import { fetchCalendarEvents } from "./fetchEvents";

export async function deleteEvent(eventId: string,    setTasks: React.Dispatch<React.SetStateAction<Task[]>>,
    session: { provider_token?: string | null } | null,
    apiUrl: string,) {
    try {
        const response = await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
            {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${
                        session?.provider_token || ''
                    }`,
                },
            },
        );

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        // Handle successful deletion
    } catch (error) {
        console.error(error);
        // Handle errors
    }
    fetchCalendarEvents(session, apiUrl, setTasks);
}