import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns/format';
import { formatDuration } from 'date-fns/formatDuration';
import { formatISO } from 'date-fns/formatISO';
import { intervalToDuration } from 'date-fns/intervalToDuration';
import { pl } from 'date-fns/locale';
import { setMinutes } from 'date-fns/setMinutes';
import { startOfDay } from 'date-fns/startOfDay';
import { Button, TooltipTrigger } from 'react-aria-components';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import { Input } from '~/commons/components/Input';
import { Slider } from '~/commons/components/Slider';
import { Tooltip } from '~/commons/components/Tooltip';
import { WeekCalendar } from '~/commons/components/WeekCalendar';

import { MeetingEntity } from '~/features/meeting/MeetingEntity';
import { CreateMeetingEntity } from '~/features/meeting/create-meeting/CreateMeetingEntity';
import { useCreateMeeting } from '~/features/meeting/create-meeting/useCreateMeeting';

type CreateMeetingProps = {
  onCreateMeeting?: (data: z.infer<typeof MeetingEntity>) => void;
};

const MINUTES_IN_DAY = 60 * 24;

const getFormattedKeyValue = (value: Date) => formatISO(value, { representation: 'date' });

export function CreateMeetingForm({ onCreateMeeting }: CreateMeetingProps) {
  const createMeeting = useCreateMeeting();

  const form = useForm({
    defaultValues: {
      name: '',
      selectedDays: [new Date()],
      duration: 30,
      availability: [{ thumbs: [0, 240], key: getFormattedKeyValue(new Date()) }],
    },
    resolver: zodResolver(CreateMeetingEntity),
  });

  const durationFields = useFieldArray({ control: form.control, name: 'availability' });
  console.log('durationFields', durationFields);

  const selectedDays = useWatch({ control: form.control, name: 'selectedDays' });
  const meetingDuration = useWatch({ control: form.control, name: 'duration' });

  const handleSuccessSubmit = async (data: z.infer<typeof CreateMeetingEntity>) => {
    const response = await createMeeting.mutateAsync(data);
    const meetingId = (await response.json()) as number;
    onCreateMeeting?.({ ...data, id: meetingId });
  };

  return (
    <form
      className="flex max-w-xl flex-col gap-8"
      onSubmit={form.handleSubmit(handleSuccessSubmit, (e) => console.log(e))}
    >
      <Controller
        control={form.control}
        render={({ field }) => (
          <WeekCalendar
            onSelectedDate={(selectedDates, selectedDate) => {
              console.log(selectedDate);
              field.onChange(selectedDates);
              const selectedDateIndex = durationFields.fields.findIndex(
                (field) => field.key === getFormattedKeyValue(selectedDate)
              );
              const isDateNotSelected = selectedDateIndex !== -1;

              if (isDateNotSelected) {
                durationFields.remove(selectedDateIndex);
              } else {
                durationFields.append({
                  thumbs: [0, 240],
                  key: getFormattedKeyValue(selectedDate),
                });
              }
            }}
            selectedDates={field.value}
          />
        )}
        name="selectedDays"
      />

      <Controller
        name="duration"
        control={form.control}
        render={({ field }) => {
          console.log(field);
          const estimatedMeetingDuration = formatDuration(
            intervalToDuration({ start: 0, end: field.value * 60 * 1000 }),
            {
              locale: pl,
            }
          );
          console.log(estimatedMeetingDuration);
          return (
            <>
              <Slider
                label="Przewidywany czas trwania spotkania"
                value={field.value}
                minValue={15}
                maxValue={60 * 3}
                step={15}
                onChange={field.onChange}
                tooltipContent={(value) => {
                  return <p>{value}</p>;
                }}
              />
              <p>{estimatedMeetingDuration}</p>
            </>
          );
        }}
      />

      {durationFields.fields.map((durationField, index) => (
        <Controller
          key={durationField.id}
          name={`availability.${index}.thumbs`}
          control={form.control}
          render={({ field }) => {
            return (
              <>
                <Slider
                  value={field.value}
                  label={<span>{format(durationField.key, 'dd.MM')}</span>}
                  minValue={0}
                  maxValue={MINUTES_IN_DAY}
                  step={meetingDuration}
                  onChange={field.onChange}
                  tooltipContent={(value) => {
                    if (Array.isArray(value) === false) return;

                    return (
                      <p>
                        {format(setMinutes(startOfDay(new Date()), value[0]), 'HH:mm')} -{' '}
                        {format(setMinutes(startOfDay(new Date()), value[1]), 'HH:mm')}
                      </p>
                    );
                  }}
                />
                <button
                  onClick={() => {
                    durationFields.update(index, {
                      ...durationField,
                      thumbs: [
                        ...(field.value ?? []),
                        field.value?.at(-1) ?? 0 + meetingDuration,
                        field.value?.at(-1) ?? 0 + meetingDuration * 2,
                      ],
                    });
                  }}
                >
                  Dodaj zakres
                </button>
              </>
            );
          }}
        />
      ))}

      <Input
        {...form.register('name')}
        label="Nazwa spotkania"
      />
      <TooltipTrigger>
        <Button type="submit">wyślij</Button>

        <Tooltip>Test</Tooltip>
      </TooltipTrigger>
    </form>
  );
}
