import { Task } from "../../types";
import { convertRecurrence } from "../../utils";

export async function fetchCalendarEvents(
    session: { provider_token?: string | null } | null,
    apiUrl: string,
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>
) {
    try {
        const response = await fetch(
            apiUrl,
            {
                headers: {
                    Authorization:
                        'Bearer ' + (session?.provider_token || ''),
                },
            },
        );

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        const transformedTasks: Task[] = data.items
            .map((item: any) => {
                // Check if start and end dates are present
                if (
                    !item.start ||
                    !item.start.dateTime ||
                    !item.end ||
                    !item.end.dateTime
                ) {
                    console.warn(
                        'Skipping an event with missing start/end dates:',
                        item,
                    );
                    return null; // Return null or some default value for missing dates
                }

                // Check if the event was created with your app
                if (
                    !item.description?.includes(
                        '[Created with MyCalendarApp]',
                    )
                ) {
                    return null; // Skip events not created with your app
                }

                return {
                    id: item.id,
                    start: new Date(item.start.dateTime),
                    end: new Date(item.end.dateTime),
                    eventName: item.summary,
                    eventDescription: item.description || '',
                    recurrence: convertRecurrence(item.recurrence),
                };
            })
            .filter((task: Task | null) => task !== null);

        setTasks(transformedTasks);
    } catch (error) {
        console.error(error);
        // Handle errors
    }
}

