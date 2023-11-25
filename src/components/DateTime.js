import React from 'react';

const DateTimePicker = ({ date, time, onDateChange, onTimeChange }) => {
  return (
    <div>
      <p>Date of your event</p>
      <input type="date" value={date.toISOString().split('T')[0]} onChange={(e) => onDateChange(new Date(e.target.value))} />
      <p>Time of your event</p>
      <input type="time" value={time} onChange={(e) => onTimeChange(e.target.value)} />
    </div>
  );
}

export default DateTimePicker;
