declare module 'react-calendar-heatmap' {
    import React from 'react';

    export interface ReactCalendarHeatmapValue {
        date: string | Date;
        count?: number;
        [key: string]: any;
    }

    export interface ReactCalendarHeatmapProps {
        values: ReactCalendarHeatmapValue[];
        startDate: Date | string;
        endDate: Date | string;
        classForValue?: (value: ReactCalendarHeatmapValue) => string;
        tooltipDataAttrs?:
        | { [key: string]: string }
        | ((value: ReactCalendarHeatmapValue) => { [key: string]: string });
        [key: string]: any;
    }

    const CalendarHeatmap: React.FC<ReactCalendarHeatmapProps>;
    export default CalendarHeatmap;
} 