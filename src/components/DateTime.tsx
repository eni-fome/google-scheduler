import React from 'react';

const DateTimePicker = ({
  date,
  time,
  onDateChange,
  onTimeChange
}: any) => {
  return (
    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    <div>
      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
      <p>Date of your event</p>
      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
      <input type="date" value={date.toISOString().split('T')[0]} onChange={(e) => onDateChange(new Date(e.target.value))} />
      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
      <p>Time of your event</p>
      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
      <input type="time" value={time} onChange={(e) => onTimeChange(e.target.value)} />
    </div>
  );
}

export default DateTimePicker;
