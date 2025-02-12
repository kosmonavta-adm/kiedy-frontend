import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { format } from 'date-fns/format';
import { formatDuration } from 'date-fns/formatDuration';
import { formatISO } from 'date-fns/formatISO';
import { intervalToDuration } from 'date-fns/intervalToDuration';
import { pl } from 'date-fns/locale';
import { setMinutes } from 'date-fns/setMinutes';
import { startOfDay } from 'date-fns/startOfDay';
import { LoaderCircle, X } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/commons/components/Button';
import { Input } from '@/commons/components/Input';
import { Slider } from '@/commons/components/Slider';
import { WeekCalendar } from '@/commons/components/WeekCalendar';

import { CreateMeetingEntity } from '@/features/meeting/create-meeting/CreateMeetingEntity';
import { DialogBeforeDayDeletion } from '@/features/meeting/create-meeting/DialogBeforeDayDeletion';
import { useCreateMeeting } from '@/features/meeting/create-meeting/useCreateMeeting';

const MINUTES_IN_DAY = 60 * 24;

const getFormattedKeyValue = (value: Date) => formatISO(value, { representation: 'date' });

export function CreateMeetingForm() {
  const navigate = useNavigate();

  const [isDialogBeforeDayDeletionOpen, setIsDialogBeforeDayDeletionOpen] = useState<number | undefined>();

  const createMeeting = useCreateMeeting();

  const form = useForm({
    defaultValues: {
      name: '',
      duration: 30,
      availability: [{ slot: [{ beginning: 60 * 9, ending: 60 * 14 }], date: getFormattedKeyValue(new Date()) }],
    },
    resolver: zodResolver(CreateMeetingEntity),
  });

  const availabilityFields = useFieldArray({ control: form.control, name: 'availability' });

  const availability = useWatch({ control: form.control, name: 'availability' });
  const meetingDuration = useWatch({ control: form.control, name: 'duration' });

  const handleSuccessSubmit = async (data: z.infer<typeof CreateMeetingEntity>) => {
    console.log(data);
    const response = await createMeeting.mutateAsync(data);
    const meetingId = (await response.json()) as number;

    await navigate({ to: `/${meetingId}`, search: { afterCreation: true } });
  };

  const handleDeleteDay = (index: number) => {
    availabilityFields.remove(index);
    setIsDialogBeforeDayDeletionOpen(undefined);
  };

  const selectedDays = availability.map((day) => new Date(day.date));

  return (
    <form
      className="gap-18 m-auto flex w-fit flex-col"
      onSubmit={form.handleSubmit(handleSuccessSubmit, (e) => console.log(e))}
    >
      <WeekCalendar
        onSelectedDate={(selectedDates, selectedDate) => {
          const selectedDateIndex = availabilityFields.fields.findIndex(
            (field) => field.date === getFormattedKeyValue(selectedDate)
          );
          const isDateNotSelected = selectedDateIndex !== -1;

          if (isDateNotSelected) {
            availabilityFields.remove(selectedDateIndex);
          } else {
            availabilityFields.append({
              slot: [{ beginning: 0, ending: 240 }],
              date: getFormattedKeyValue(selectedDate),
            });
          }
        }}
        selectedDates={selectedDays}
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
            {availabilityFields.fields.map((durationField, durationFieldIndex) => (
              <Controller
                key={durationField.id}
                name={`availability.${durationFieldIndex}.slot`}
                control={form.control}
                render={({ field }) => {
                  console.log(
                    'render',
                    field.value.flatMap(({ beginning, ending }) => [beginning, ending])
                  );
                  return (
                    <div className="flex flex-col gap-8 rounded-md bg-neutral-50/50 p-4 shadow">
                      <Slider
                        value={field.value.flatMap(({ beginning, ending }) => [beginning, ending])}
                        label={
                          <div className="flex w-full">
                            <div className={'flex flex-col'}>
                              <span>{format(durationField.date, 'd MMMM', { locale: pl })}</span>
                              <span className="text-neutral-600">
                                {format(durationField.date, 'EEEE', { locale: pl })}
                              </span>
                            </div>

                            <div className="ml-auto flex flex-col gap-3">
                              {field?.value?.reduce<ReactNode[]>((result, { beginning, ending }, index) => {
                                result.push(
                                  <p
                                    key={index}
                                    className="flex items-center justify-end gap-2 leading-none"
                                  >
                                    <span>
                                      {format(setMinutes(startOfDay(new Date()), beginning), 'HH:mm')}
                                      {' - '}
                                      {format(setMinutes(startOfDay(new Date()), ending), 'HH:mm')}
                                    </span>
                                    <Button
                                      isPending={field.value.length === 2}
                                      onPress={() => {
                                        availabilityFields.update(durationFieldIndex, {
                                          ...durationField,
                                          slot: [...field.value.toSpliced(index, 1)],
                                        });
                                      }}
                                      variant="icon"
                                      className="h-4 w-4"
                                    >
                                      <X />
                                    </Button>
                                  </p>
                                );

                                return result;
                              }, [])}
                            </div>
                          </div>
                        }
                        minValue={0}
                        maxValue={MINUTES_IN_DAY}
                        step={meetingDuration}
                        onChange={(value) => {
                          if (Array.isArray(value) === false) return;
                          field.onChange(
                            value.reduce<{ beginning: number; ending: number }[]>((result, item, index) => {
                              if (index % 2 === 0) {
                                result.push({ beginning: item, ending: 0 });
                              } else {
                                result.at(-1)!.ending = item;
                              }
                              return result;
                            }, [])
                          );
                        }}
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
                          onPress={() => setIsDialogBeforeDayDeletionOpen(durationFieldIndex)}
                        >
                          Usuń dzień
                        </Button>
                        <DialogBeforeDayDeletion
                          isOpen={isDialogBeforeDayDeletionOpen === durationFieldIndex}
                          onOpenChange={() => setIsDialogBeforeDayDeletionOpen(undefined)}
                          onConfirm={() => handleDeleteDay(durationFieldIndex)}
                        />
                        <Button
                          isPending={field.value.length === 6}
                          onPress={() => {
                            const lastThumbPosition = field.value?.at(-1)?.ending ?? 0;
                            const firstThumbPosition = field.value?.at(0)?.beginning ?? 0;

                            console.log('lastThumbPosition', lastThumbPosition);

                            if (lastThumbPosition < MINUTES_IN_DAY - meetingDuration) {
                              availabilityFields.update(durationFieldIndex, {
                                ...durationField,
                                slot: [
                                  ...(field.value ?? []),
                                  { beginning: lastThumbPosition + meetingDuration, ending: MINUTES_IN_DAY },
                                ],
                              });
                            }

                            if (firstThumbPosition > meetingDuration) {
                              availabilityFields.update(durationFieldIndex, {
                                ...durationField,
                                slot: [
                                  { beginning: 0, ending: firstThumbPosition - meetingDuration },
                                  ...(field.value ?? []),
                                ],
                              });
                            }
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
          isPending={selectedDays.length === 0 || createMeeting.isPending}
          type="submit"
        >
          Stwórz
          {createMeeting.isPending && <LoaderCircle className="animate-spin" />}
        </Button>
      </div>
    </form>
  );
}
