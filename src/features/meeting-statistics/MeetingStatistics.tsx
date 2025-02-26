import { format } from 'date-fns/format';
import { ReactNode, useState } from 'react';
import { z } from 'zod';

import { Button } from '@/commons/components/Button';
import { ViewportWrapper } from '@/commons/components/OverflowWrapper';
import { Tooltip, TooltipTrigger } from '@/commons/components/Tooltip';

import { Box } from '@/features/meeting-statistics/internal/Box';
import { TimeButton } from '@/features/meeting-statistics/internal/TimeButton';
import { transformToStatistics } from '@/features/meeting-statistics/meetingStatisticsTooling';
import { meetingEntity } from '@/features/pick-time-slot/api-calls/getMeeting';

type MeetingStatisticsProps = {
  meeting: z.infer<typeof meetingEntity>;
};

export function MeetingStatistics({ meeting }: MeetingStatisticsProps) {
  const { slotsPickedByAll, slotsSortedByPopularity, allAttendees } = transformToStatistics(meeting);
  const [expandedColumns, setExpandedColumns] = useState(() => meeting.availability.map(() => false));

  return (
    <div className="top-16 flex h-fit xl:sticky">
      {slotsPickedByAll.length > 0 ? (
        <div className="mx-auto flex flex-col gap-16">
          <p className="text-center text-2xl font-bold text-neutral-700">
            Dobra wiadomość! Są terminy, które pasują wszystkim.
          </p>
          <ViewportWrapper>
            {slotsPickedByAll.map(([date, slots]) => (
              <Box>
                <div className="flex flex-col gap-1">
                  <p className="text-center text-2xl">{format(date, 'dd.MM.yyyy')}</p>
                  <ul className="flex flex-col gap-2">
                    {slots.map((slot) => (
                      <li>
                        <time className="font-medium text-neutral-100">{format(slot, 'HH:mm')}</time>
                      </li>
                    ))}
                  </ul>
                </div>
              </Box>
            ))}
          </ViewportWrapper>
        </div>
      ) : (
        <div className="flex flex-col gap-16">
          <p className="text-center text-2xl font-bold text-neutral-700">
            Niestety żadna godzina nie pasuje wszystkim.
          </p>

          <ViewportWrapper>
            {slotsSortedByPopularity.map(([date, slots], index) => (
              <Box key={index}>
                <div className="flex w-fit flex-col gap-4">
                  <p className="text-center text-2xl">{format(date, 'dd.MM.yyyy')}</p>
                  <ul className="flex flex-col gap-2">
                    {slots.slice(0, expandedColumns[index] ? Infinity : 5).map((slot) => (
                      <li>
                        <TooltipTrigger delay={200}>
                          <TimeButton>
                            <time className="font-bold">{format(slot.time, 'HH:mm')}</time>
                            <span className="font-normal">{`(${slot.popularity} z ${allAttendees} osób)`}</span>
                          </TimeButton>
                          <Tooltip>{slot.attendees.join(', ')}</Tooltip>
                        </TooltipTrigger>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  onPress={() =>
                    setExpandedColumns((prevValue) => {
                      const newValues = [...prevValue];
                      newValues[index] = !newValues[index];
                      return newValues;
                    })
                  }
                >
                  {expandedColumns[index] ? 'Ukryj' : 'Zobacz więcej'}
                </Button>
              </Box>
            ))}
          </ViewportWrapper>
        </div>
      )}
    </div>
  );
}
