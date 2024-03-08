import React from 'react';

interface GridProps {
  handleCellClick: (startTime: Date) => void;
  timeIntervals: (startTime: Date, endTime: Date) => Date[];
}

const Grid: React.FC<GridProps> = ({ handleCellClick, timeIntervals }) => {
  // Initialize time intervals using the provided function
  const startTime = new Date();
  startTime.setHours(0, 0, 0, 0); // Set to midnight
  const endTime = new Date();
  endTime.setHours(23, 59, 59, 999); // Set to end of day
  const intervals = timeIntervals(startTime, endTime);

  // Click handler for grid cells
  const handleClick = (startTime: Date) => {
    handleCellClick(startTime);
  };

  return (
    <div className="grid">
      {intervals.map((time, index) => (
        <div
          key={index}
          className="grid-cell"
          onClick={() => handleClick(time)}
        >
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      ))}
    </div>
  );
};

export default Grid;
