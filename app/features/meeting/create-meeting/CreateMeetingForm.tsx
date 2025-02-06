import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns/format';
import { formatDuration } from 'date-fns/formatDuration';
import { formatISO } from 'date-fns/formatISO';
import { intervalToDuration } from 'date-fns/intervalToDuration';
import { pl } from 'date-fns/locale';
import { setMinutes } from 'date-fns/setMinutes';
import { startOfDay } from 'date-fns/startOfDay';
import { type ReactNode, useState } from 'react';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '~/commons/components/Button';
import { Input } from '~/commons/components/Input';
import { Slider } from '~/commons/components/Slider';
import { WeekCalendar } from '~/commons/components/WeekCalendar';

import { MeetingEntity } from '~/features/meeting/MeetingEntity';
import { CreateMeetingEntity } from '~/features/meeting/create-meeting/CreateMeetingEntity';
import { DialogBeforeDayDeletion } from '~/features/meeting/create-meeting/DialogBeforeDayDeletion';
import { useCreateMeeting } from '~/features/meeting/create-meeting/useCreateMeeting';

type CreateMeetingProps = {
  onCreateMeeting?: (data: z.infer<typeof MeetingEntity>) => void;
};

const MINUTES_IN_DAY = 60 * 24;

const getFormattedKeyValue = (value: Date) => formatISO(value, { representation: 'date' });

export function CreateMeetingForm({ onCreateMeeting }: CreateMeetingProps) {
  const [isDialogBeforeDayDeletionOpen, setIsDialogBeforeDayDeletionOpen] = useState<number | undefined>();

  const createMeeting = useCreateMeeting();

  const form = useForm({
    defaultValues: {
      name: '',
      selectedDays: [new Date()],
      duration: 30,
      availability: [{ thumbs: [60 * 9, 60 * 14], key: getFormattedKeyValue(new Date()) }],
    },
    resolver: zodResolver(CreateMeetingEntity),
  });

  const durationFields = useFieldArray({ control: form.control, name: 'availability' });

  const selectedDays = useWatch({ control: form.control, name: 'selectedDays' });
  const meetingDuration = useWatch({ control: form.control, name: 'duration' });

  const handleSuccessSubmit = async (data: z.infer<typeof CreateMeetingEntity>) => {
    const response = await createMeeting.mutateAsync(data);
    const meetingId = (await response.json()) as number;
    onCreateMeeting?.({ ...data, id: meetingId });
  };

  const handleDeleteDay = (index: number) => {
    form.setValue(
      'selectedDays',
      selectedDays.filter((day) => getFormattedKeyValue(day) !== getFormattedKeyValue(selectedDays[index]))
    );
    durationFields.remove(index);
    setIsDialogBeforeDayDeletionOpen(undefined);
  };

  return (
    <form
      className="m-auto flex w-fit flex-col gap-18"
      onSubmit={form.handleSubmit(handleSuccessSubmit, (e) => console.log(e))}
    >
      <Controller
        control={form.control}
        render={({ field }) => (
          <WeekCalendar
            onSelectedDate={(selectedDates, selectedDate) => {
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
      <div className="m-auto flex w-full max-w-xl flex-col gap-12">
        <Controller
          name="duration"
          control={form.control}
          render={({ field }) => {
            const getEstimatedMeetingDuration = (value: number) =>
              formatDuration(intervalToDuration({ start: 0, end: value * 60 * 1000 }), {
                locale: pl,
              });

            return (
              <div className="flex flex-col gap-4">
                <Slider
                  label={
                    <>
                      <span className="font-bold">Przewidywany czas trwania spotkania:</span>
                      <span className="ml-auto flex">{getEstimatedMeetingDuration(field.value)}</span>
                    </>
                  }
                  value={field.value}
                  minValue={15}
                  maxValue={60 * 3}
                  step={15}
                  onChange={field.onChange}
                  tooltipContent={(value) => {
                    if (Array.isArray(value)) return;
                    return <p>{getEstimatedMeetingDuration(value)}</p>;
                  }}
                />
              </div>
            );
          }}
        />

        <div className="flex flex-col gap-4">
          <p className="font-bold">Dostępność:</p>
          <div className="flex flex-col gap-6">
            {durationFields.fields.map((durationField, index) => (
              <Controller
                key={durationField.id}
                name={`availability.${index}.thumbs`}
                control={form.control}
                render={({ field }) => {
                  return (
                    <div className="flex flex-col gap-8 rounded-md bg-neutral-50/50 p-4 shadow">
                      <Slider
                        value={field.value}
                        label={
                          <div className="flex w-full">
                            <div className={'flex flex-col'}>
                              <span>{format(durationField.key, 'd MMMM', { locale: pl })}</span>
                              <span className="text-neutral-600">
                                {format(durationField.key, 'EEEE', { locale: pl })}
                              </span>
                            </div>

                            <div className="ml-auto flex flex-col">
                              {field.value.reduce<ReactNode[]>((result, date, index, array) => {
                                if (index % 2 === 0) {
                                  result.push(
                                    <p
                                      key={date}
                                      className="text-right"
                                    >
                                      <span>{format(setMinutes(startOfDay(new Date()), date), 'HH:mm')}</span>
                                      {' - '}
                                      <span>
                                        {format(setMinutes(startOfDay(new Date()), array[index + 1]), 'HH:mm')}
                                      </span>
                                    </p>
                                  );
                                }

                                return result;
                              }, [])}
                            </div>
                          </div>
                        }
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
                      <div className="flex justify-between">
                        <Button
                          variant="destructive"
                          onPress={() => setIsDialogBeforeDayDeletionOpen(index)}
                        >
                          Usuń dzień
                        </Button>
                        <DialogBeforeDayDeletion
                          isOpen={isDialogBeforeDayDeletionOpen === index}
                          onOpenChange={() => setIsDialogBeforeDayDeletionOpen(undefined)}
                          onConfirm={() => handleDeleteDay(index)}
                        />
                        <Button
                          isPending={field.value.length === 6}
                          onPress={() => {
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
                        </Button>
                      </div>
                    </div>
                  );
                }}
              />
            ))}
          </div>
        </div>

        <Input
          {...form.register('name')}
          label="Nazwa spotkania"
        />

        <Button
          isPending={selectedDays.length === 0}
          type="submit"
        >
          Stwórz
        </Button>
      </div>
    </form>
  );
}
