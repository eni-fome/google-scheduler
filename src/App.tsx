import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';
import {
    useSession,
    useSupabaseClient,
    useSessionContext,
} from '@supabase/auth-helpers-react';
import Form from './components/Form';
import { RecurrenceType, Task, Event } from './types'


function App() {
    const [start, setStart] = useState<Date>(new Date());
    const [end, setEnd] = useState<Date>(new Date());
    const [eventName, setEventName] = useState<string>('');
    const [eventDescription, setEventDescription] = useState<string>('');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [recurrence, setRecurrence] = useState<RecurrenceType>('none');
    const [showForm, setShowForm] = useState(true);
    const [showTasksList, setShowTasksList] = useState(true);
    const [updatedTask, setUpdatedTask] = useState<Task | null>(null);
    // const [editingEvent, setEditingEvent] = useState<Task | null>(null);

    const session = useSession();
    const supabase = useSupabaseClient();
    const { isLoading } = useSessionContext();

    useEffect(() => {
        if (session) {
            fetchCalendarEvents();
        }
    }, [session]);

    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const formatDate = (date: any) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: userTimeZone,
        }).format(date);
    };

    const recurrenceRule = (recurrence: 'daily' | 'weekly' | 'monthly') =>
        `RRULE:FREQ=${recurrence.toUpperCase()}`;

    const convertRecurrence = (
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

    if (isLoading) {
        return <></>;
    }

    async function googleSignIn() {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                scopes: 'https://www.googleapis.com/auth/calendar',
            },
        });
        if (error) {
            alert('Error logging in to Google provider with Supabase');
            console.log(error);
        }
    }

    async function signOut() {
        await supabase.auth.signOut();
    }
    async function createCalendarEvent(task: Task) {
        console.log('Creating calendar event');

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
                'https://www.googleapis.com/calendar/v3/calendars/primary/events',
                {
                    method: 'POST',
                    headers: {
                        Authorization:
                            'Bearer ' + (session?.provider_token || ''),
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

    const handleCreateTask = async () => {
        const newTask = {
            start,
            end,
            eventName,
            eventDescription,
            recurrence,
        };

        await createCalendarEvent(newTask);

        setStart(new Date());
        setEnd(new Date());
        setEventName('');
        setEventDescription('');
        setRecurrence('none');
    };



    async function fetchCalendarEvents() {
        try {
            const response = await fetch(
                'https://www.googleapis.com/calendar/v3/calendars/primary/events',
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

    async function editEvent(eventId: string, task: Task) {
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
                        Authorization: `Bearer ${
                            session?.provider_token || ''
                        }`,
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
        fetchCalendarEvents();
    }

    const startEditingEvent = (task: Task) => {
        setUpdatedTask(task); // Use updatedTask for editing
        setStart(task.start);
        setEnd(task.end);
        setEventName(task.eventName);
        setEventDescription(task.eventDescription);
        setRecurrence(task.recurrence);
    };

    const handleEditTask = async (taskId: string | undefined) => {
        // Find the task in the tasks array
        const taskIndex = tasks.findIndex((task) => task.id === taskId);

        if (taskIndex !== -1) {
            const updatedTask = {
                ...tasks[taskIndex],
                eventName,
                eventDescription,
                start,
                end,
                recurrence,
            };

            // Update Google Calendar Event
            await editEvent(taskId as string, updatedTask);

            // Update Local State
            const newTasks = [...tasks];
            newTasks[taskIndex] = updatedTask;

            setTasks(newTasks);

            // Clear Form
            setEventName('');
            setEventDescription('');
            setStart(new Date());
            setEnd(new Date());
            setRecurrence('none');
            setUpdatedTask(null); // Reset updatedTask
        }
    };

    async function deleteEvent(eventId: string) {
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
        fetchCalendarEvents();
    }


    return (
        <div className="App">
            <div style={{ width: '400px', margin: '30px auto' }}>
                {session ? (
                    <>
                        <h2>Hey there {session.user.email}</h2>
                        <button onClick={() => setShowForm(!showForm)}>
                            {showForm ? 'Close' : 'Add Task'}
                        </button>
                        {showForm && (
                          <Form
                start={start}
                end={end}
                eventName={eventName}
                eventDescription={eventDescription}
                recurrence={recurrence}
                setStart={setStart}
                setEnd={setEnd}
                setEventName={setEventName}
                setEventDescription={setEventDescription}
                setRecurrence={setRecurrence}
                updatedTask={updatedTask}
                handleCreateTask={handleCreateTask}
                handleEditTask={handleEditTask}
              />
                        )}

                        <button
                            onClick={() => setShowTasksList(!showTasksList)}
                        >
                            {showTasksList
                                ? 'Hide Tasks List'
                                : 'Show Tasks List'}
                        </button>
                        {showTasksList && (
                            <ul>
                                {tasks.map((task) => (
                                    <li key={task.id}>
                                        {`${task.eventName} - From ${formatDate(
                                            task.start,
                                        )} to ${formatDate(task.end)}`}
                                        <div>Recurrence: {task.recurrence}</div>
                                        <button
                                            onClick={() =>
                                                startEditingEvent(task)
                                            }
                                        >
                                            📝
                                        </button>
                                        <button
                                            onClick={() =>
                                                task.id && deleteEvent(task.id)
                                            }
                                        >
                                            ❌
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <button className="signout" onClick={signOut}>
                            Sign Out
                        </button>
                    </>
                ) : (
                    <>
                        <button onClick={googleSignIn}>
                            Sign In With Google
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default App;
