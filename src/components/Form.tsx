import React from 'react';
import DateTimePicker from 'react-datetime-picker';


type RecurrenceType = 'daily' | 'weekly' | 'monthly' | 'none';

interface Task {
    id?: string;
    start: Date;
    end: Date;
    eventName: string;
    eventDescription: string;
    recurrence: RecurrenceType;
  }


interface FormProps {
  start: Date;
  end: Date;
  eventName: string;
  eventDescription: string;
  recurrence: string;
  setStart: React.Dispatch<React.SetStateAction<Date>>;
  setEnd: React.Dispatch<React.SetStateAction<Date>>;
  setEventName: React.Dispatch<React.SetStateAction<string>>;
  setEventDescription: React.Dispatch<React.SetStateAction<string>>;
  setRecurrence: React.Dispatch<React.SetStateAction<RecurrenceType>>;
  updatedTask: Task | null;
  handleCreateTask: () => void;
  handleEditTask: (taskId: string | undefined) => void;
}

const Form: React.FC<FormProps> = ({
  start,
  end,
  eventName,
  eventDescription,
  recurrence,
  setStart,
  setEnd,
  setEventName,
  setEventDescription,
  setRecurrence,
  updatedTask,
  handleCreateTask,
  handleEditTask,
}) => {
  return (
    <>
      <p>Start of your event</p>
      <DateTimePicker onChange={(date) => setStart(date || new Date())} value={start} />
      <p>End of your event</p>
      <DateTimePicker onChange={(date) => setEnd(date || new Date())} value={end} />
      <p>Event name</p>
      <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} />
      <p>Event description</p>
      <input type="text" value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} />
      <p>Recurrence</p>
      <select
  value={updatedTask ? updatedTask.recurrence : recurrence}
  onChange={(e) => setRecurrence(e.target.value as RecurrenceType)}
>
        <option value="none">None</option>
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
      </select>
      <hr />
      {updatedTask ? (
        <button onClick={() => handleEditTask(updatedTask.id)}>Update Task</button>
      ) : (
        <button onClick={handleCreateTask}>Create Task</button>
      )}
    </>
  );
};

export default Form;


// import React, { useState } from 'react';
// import DateTimePicker from 'react-datetime-picker';
// import 'react-datetime-picker/dist/DateTimePicker.css';
// import 'react-calendar/dist/Calendar.css';
// import 'react-clock/dist/Clock.css';

// type RecurrenceType = 'daily' | 'weekly' | 'monthly' | 'none';

// interface FormProps {}

// export const Form: React.FC<FormProps> = () => {
//     const [start, setStart] = useState<Date>(new Date());
//     const [end, setEnd] = useState<Date>(new Date());
//     const [eventName, setEventName] = useState<string>('');
//     const [eventDescription, setEventDescription] = useState<string>('');
//     const [recurrence, setRecurrence] = useState<RecurrenceType>('none');

//     return (
//         <div>
//             <p>Start of your event</p>
//             <DateTimePicker
//                 onChange={(date) => setStart(date || new Date())}
//                 value={start}
//             />
//             <p>End of your event</p>
//             <DateTimePicker
//                 onChange={(date) => setEnd(date || new Date())}
//                 value={end}
//             />
//             <p>Event name</p>
//             <input
//                 type="text"
//                 value={eventName}
//                 onChange={(e) => setEventName(e.target.value)}
//             />
//             <p>Event description</p>
//             <input
//                 type="text"
//                 value={eventDescription}
//                 onChange={(e) => setEventDescription(e.target.value)}
//             />
//             <p>Recurrence</p>
//             <select
//                 value={recurrence}
//                 onChange={(e) => setRecurrence(e.target.value as RecurrenceType)}
//             >
//                 <option value="none">None</option>
//                 <option value="daily">Daily</option>
//                 <option value="weekly">Weekly</option>
//                 <option value="monthly">Monthly</option>
//             </select>
//             <hr />
//         </div>
//     );
// };

// export default Form;



