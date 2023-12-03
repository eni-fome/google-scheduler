import './App.css';
import { useSession, useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';
import DateTimePicker from 'react-datetime-picker';
import { useState } from 'react';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

function App() {
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [tasks, setTasks] = useState([]); // Maintain a list of tasks
  const [recurrence, setRecurrence] = useState("none"); // 'none', 'daily', 'weekly', 'monthly'

  const session = useSession(); // tokens, when session exists we have a user
  const supabase = useSupabaseClient(); // talk to supabase!
  const { isLoading } = useSessionContext();

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
      alert("Error logging in to Google provider with Supabase");
      console.log(error);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  const handleRemoveTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  async function createCalendarEvent(task) {
    console.log("Creating calendar event");

    // Automatically detect the user's time zone
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const formatDate = (date) => {
      return date.toISOString().replace(/(\.\d{3})\d+/, "$1"); // Remove milliseconds
    };

    const recurrenceRule = (recurrence) => {
      switch (recurrence) {
        case 'daily':
          return 'RRULE:FREQ=DAILY';
        case 'weekly':
          return 'RRULE:FREQ=WEEKLY';
        case 'monthly':
          return 'RRULE:FREQ=MONTHLY';
        default:
          return '';
      }
    };

    const event = {
      'summary': task.eventName,
      'description': task.eventDescription,
      'start': {
        'dateTime': formatDate(task.start),
        'timeZone': userTimeZone,
      },
      'end': {
        'dateTime': formatDate(task.end),
        'timeZone': userTimeZone,
      },
      'recurrence': [recurrenceRule(task.recurrence)],
    };

    try {
      const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
        method: "POST",
        headers: {
          'Authorization': 'Bearer ' + session.provider_token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data);
      alert("Event created, check your Google Calendar!");
    } catch (error) {
      console.error(error);
      alert("Error creating event. Please try again.");
    }
  }

  const handleCreateTask = () => {
    const newTask = {
      start,
      end,
      eventName,
      eventDescription,
      recurrence,
    };
    setTasks([...tasks, newTask]); // Add the new task to the list
    // Clear the input fields after creating a task
    setStart(new Date());
    setEnd(new Date());
    setEventName("");
    setEventDescription("");
    setRecurrence("none");
  };

  const handlePushToCalendar = async () => {
    for (const task of tasks) {
      await createCalendarEvent(task); // Create events one at a time
    }
    setTasks([]); // Clear the tasks list after pushing to calendar
  };

  return (
    <div className="App">
      <div style={{ width: "400px", margin: "30px auto" }}>
        {session ? (
          <>
            <h2>Hey there {session.user.email}</h2>
            <p>Start of your event</p>
            <DateTimePicker onChange={setStart} value={start} />
            <p>End of your event</p>
            <DateTimePicker onChange={setEnd} value={end} />
            <p>Event name</p>
            <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} />
            <p>Event description</p>
            <input type="text" value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} />
            <p>Recurrence</p>
            <select value={recurrence} onChange={(e) => setRecurrence(e.target.value)}>
              <option value="none">None</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <hr />
            <button onClick={handleCreateTask}>Create Task</button>
            <ul>
              {tasks.map((task, index) => (
                <li key={index}>
                  {`${task.eventName} - ${task.start.toISOString()} to ${task.end.toISOString()} - Recurrence: ${task.recurrence}`}
                  <button onClick={() => handleRemoveTask(index)}>Remove Recurrence</button>
                </li>
              ))}
            </ul>
            <button onClick={handlePushToCalendar}>Push to Google Calendar</button>
            <p></p>
            <button className="signout" onClick={signOut}>
              Sign Out
            </button>
          </>
        ) : (
          <>
            <button onClick={googleSignIn}>Sign In With Google</button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
