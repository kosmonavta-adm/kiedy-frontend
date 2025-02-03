import { addDays } from 'date-fns/addDays';
import { format } from 'date-fns/format';
import { formatISO } from 'date-fns/formatISO';
import { pl } from 'date-fns/locale';
import { toDate } from 'date-fns/toDate';
import { useState } from 'react';

import { cxTw, transformSetToArray } from '~/commons/utils';

type WeekCalendarProps = {
    onSelectedDate: (selectedDates: Date[], selectedDate: Date) => void;
    selectedDates: Date[];
};

const getFormatedDate = (date: Date) => formatISO(date, { representation: 'date' });
const checkIsSelectedDate = (date: Date, selectedDates: Set<String>) => selectedDates.has(getFormatedDate(date));

export const WeekCalendar = ({ onSelectedDate, selectedDates }: WeekCalendarProps) => {
    const [weekIndex, setWeekIndex] = useState(0);
    const internalSelectedDates = new Set(selectedDates.map(getFormatedDate));

    const week = new Array(7).fill(undefined).map((_, dayIndex) => addDays(new Date(), dayIndex + weekIndex));

    const handleNextWeek = () => setWeekIndex((prevWeekIndex) => prevWeekIndex + 7);
    const handlePrevWeek = () => setWeekIndex((prevWeekIndex) => prevWeekIndex - 7);
    const handleSelectedDay = (isSelectedDate: boolean, day: Date) => {
        if (isSelectedDate) {
            internalSelectedDates.delete(getFormatedDate(day));
        } else {
            internalSelectedDates.add(getFormatedDate(day));
        }
    };

    const isFirstWeek = weekIndex === 0;

    return (
        <div className="flex gap-2">
            <button
                disabled={isFirstWeek}
                onClick={handlePrevWeek}
            >
                prev
            </button>

            {week.map((day) => {
                const isSelectedDate = checkIsSelectedDate(day, internalSelectedDates);

                return (
                    <button
                        type="button"
                        className={cxTw(isSelectedDate && 'font-bold', 'p-2')}
                        onClick={() => {
                            handleSelectedDay(isSelectedDate, day);

                            onSelectedDate(
                                transformSetToArray(internalSelectedDates, (item) => toDate(item)),
                                day
                            );
                        }}
                    >
                        {format(day, 'd.MM (E)', { locale: pl })}
                    </button>
                );
            })}
            <button onClick={handleNextWeek}> next</button>
        </div>
    );
};
