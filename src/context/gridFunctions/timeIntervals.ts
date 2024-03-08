export const timeIntervals = (startTime: Date, endTime: Date): Date[] => {
    const intervals: Date[] = [];
    const currentTime = new Date(startTime);

    while (currentTime <= endTime) {
        intervals.push(new Date(currentTime));
        currentTime.setMinutes(currentTime.getMinutes() + 30);
    }

    return intervals;
};
