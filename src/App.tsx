import React from 'react';
import { useEffect } from 'react';
import './App.css';
import {useSession, useSupabaseClient, useSessionContext} from '@supabase/auth-helpers-react';
import Form from './components/Form';
import { Task } from './types';
import { formatDate } from './utils';
import { createCalendarEvent } from './components/calendarFunctions/createEvent';
import { fetchCalendarEvents } from './components/calendarFunctions/fetchEvents';
import { editEvent } from './components/calendarFunctions/editEvent';
import { deleteEvent } from './components/calendarFunctions/deleteEvent';
import { useTaskState } from './useTaskState';

function App() {
    const {
        start,
        setStart,
        end,
        setEnd,
        eventName,
        setEventName,
        eventDescription,
        setEventDescription,
        tasks,
        setTasks,
        recurrence,
        setRecurrence,
        showForm,
        setShowForm,
        showTasksList,
        setShowTasksList,
        updatedTask,
        setUpdatedTask,
    } = useTaskState();

    const session = useSession();
    const supabase = useSupabaseClient();
    const { isLoading } = useSessionContext();
    const apiUrl ='https://www.googleapis.com/calendar/v3/calendars/primary/events';

    useEffect(() => {
        if (session) {
            fetchCalendarEvents(session, apiUrl, setTasks);
        }
    }, [session]);

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

    const handleCreateTask = async () => {
        const newTask = {
            start,
            end,
            eventName,
            eventDescription,
            recurrence,
        };

        await createCalendarEvent(
            newTask,
            session,
            apiUrl,
            fetchCalendarEvents,
        );

        setStart(new Date());
        setEnd(new Date());
        setEventName('');
        setEventDescription('');
        setRecurrence('none');
    };

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
            if (updatedTask) {
                await editEvent(
                    taskId,
                    updatedTask,
                    session,
                    apiUrl,
                    setTasks,
                    setUpdatedTask,
                );
            }

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
                                                task.id &&
                                                deleteEvent(
                                                    task.id,
                                                    setTasks,
                                                    session,
                                                    apiUrl,
                                                )
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
