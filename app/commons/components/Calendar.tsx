import { DayPicker } from 'react-day-picker';
import { type FieldPath, type FieldValues, type UseControllerProps, useController } from 'react-hook-form';

import { Label } from '~/commons/components/Label';

type CalendarProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> = UseControllerProps<
    TFieldValues,
    TName
> & {
    label?: string;
};

export const Calendar = <TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
    control,
    name,
    label,
    ...props
}: CalendarProps<TFieldValues, TName>) => {
    const { field } = useController({
        name,
        control,
    });

    return (
        <div>
            {label && <Label>{label}</Label>}
            <DayPicker
                mode="multiple"
                selected={field.value}
                onSelect={field.onChange}
                {...props}
                classNames={{
                    months: 'grid gap-8 relative w-fit',
                    month_caption: 'flex justify-center',
                    caption_label: 'font-medium',
                    nav: 'absolute h-6 space-x-1 flex justify-between w-full items-center',
                    button_previous: 'left-0 absolute',
                    button_next: 'right-0 absolute',
                    weekdays: 'grid grid-cols-7',
                    weekday: 'flex items-center justify-center font-medium',
                    weeks: 'flex flex-col gap-1',
                    week: 'grid grid-cols-7 gap-1',
                    day: 'flex items-center justify-center',
                    day_button:
                        'flex aria-disabled:cursor-default p-1 cursor-pointer rounded aria-selected:hover:bg-opacity-80',
                    selected: 'bg-blue-400 [&>*]:text-white rounded',
                    outside: 'day-outside opacity-50 aria-selected:bg-accent/50 aria-selected:opacity-30',
                    disabled: '[&>*]:text-neutral-100',
                    hidden: 'invisible',
                }}
            />
        </div>
    );
};
