import { useState } from "react";
import { RecurrenceType, Task } from "../common/types";


export function useTaskState() {
    const [start, setStart] = useState<Date>(new Date());
    const [end, setEnd] = useState<Date>(new Date());
    const [eventName, setEventName] = useState<string>('');
    const [eventDescription, setEventDescription] = useState<string>('');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [recurrence, setRecurrence] = useState<RecurrenceType>('none');
    const [showForm, setShowForm] = useState(true);
    const [showTasksList, setShowTasksList] = useState(true);
    const [updatedTask, setUpdatedTask] = useState<Task | null>(null);

    return {
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
    }
}