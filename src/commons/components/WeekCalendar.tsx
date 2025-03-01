import { addDays } from 'date-fns/addDays';
import { format } from 'date-fns/format';
import { formatISO } from 'date-fns/formatISO';
import { pl } from 'date-fns/locale';
import { toDate } from 'date-fns/toDate';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from 'react-aria-components';

import { ViewportWrapper } from '@/commons/components/ViewportWrapper';
import { cxTw, transformSetToArray } from '@/commons/utils';

type WeekCalendarProps = {
  onSelectedDate: (selectedDates: Date[], selectedDate: Date) => void;
  selectedDates: Date[];
};

const getFormatedDate = (date: Date) => formatISO(date, { representation: 'date' });
const checkIsSelectedDate = (date: Date, selectedDates: Set<string>) => selectedDates.has(getFormatedDate(date));

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
    <div className="flex gap-4">
      <Button
        className={({ isPending, isHovered, isPressed, isFocused }) =>
          cxTw(
            'flex grow cursor-pointer items-center justify-center text-neutral-600 transition-colors',
            isHovered || (isFocused && 'text-neutral-700'),
            isPressed && 'text-neutral-800',
            isPending && 'cursor-not-allowed text-neutral-200'
          )
        }
        isPending={isFirstWeek}
        onPress={handlePrevWeek}
      >
        <ChevronLeft />
      </Button>

      <ViewportWrapper
        xMargin={128 + 24 * 2}
        isSnapActive={false}
      >
        <div className="flex gap-2">
          {week.map((day) => {
            const isSelectedDate = checkIsSelectedDate(day, internalSelectedDates);

            return (
              <Button
                key={getFormatedDate(day)}
                type="button"
                className={({ isHovered, isPressed, isFocusVisible }) =>
                  cxTw(
                    'border-3 group relative flex w-28 cursor-pointer flex-col rounded-lg border-neutral-100 outline-none transition-colors',
                    (isHovered || isFocusVisible) && 'border-neutral-200',
                    isPressed && 'border-neutral-300',
                    isSelectedDate && 'border-blue-500 font-bold'
                  )
                }
                onPress={() => {
                  handleSelectedDay(isSelectedDate, day);

                  onSelectedDate(
                    transformSetToArray(internalSelectedDates, (item) => toDate(item)),
                    day
                  );
                }}
              >
                <span
                  className={cxTw(
                    'relative top-0 w-full bg-neutral-100 transition-colors',
                    isSelectedDate === false &&
                      'group-data-[focused="true"]:bg-neutral-200 group-data-[hovered="true"]:bg-neutral-200 group-data-[pressed="true"]:bg-neutral-300',
                    isSelectedDate && 'bg-blue-500 text-white'
                  )}
                >
                  {format(day, 'LLLL', { locale: pl })}
                </span>
                <span className="pt-1">{format(day, 'd', { locale: pl })}</span>
                <span className="pb-1">{format(day, 'EEE', { locale: pl })}</span>
              </Button>
            );
          })}
        </div>
      </ViewportWrapper>
      <Button
        className={({ isPending, isHovered, isPressed }) =>
          cxTw(
            'flex grow cursor-pointer items-center justify-center text-neutral-600 transition-colors',
            isHovered && 'text-neutral-700',
            isPressed && 'text-neutral-800',
            isPending && 'cursor-not-allowed text-neutral-400'
          )
        }
        onPress={handleNextWeek}
      >
        <ChevronRight />
      </Button>
    </div>
  );
};
