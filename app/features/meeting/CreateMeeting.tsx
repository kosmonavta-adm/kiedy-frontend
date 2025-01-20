import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Calendar } from '~/commons/components/Calendar';
import { Input } from '~/commons/components/Input';

export const CreateMeeting = () => {
    const createMeetSchema = z.object({ name: z.string(), date: z.array(z.date()) });

    const form = useForm({ defaultValues: { name: '', date: [new Date()] }, resolver: zodResolver(createMeetSchema) });

    const handleSuccesSubmit = async (data: z.infer<typeof createMeetSchema>) => {

    };

    return (
        <form
            className="flex max-w-64 flex-col gap-8"
            onSubmit={form.handleSubmit(handleSuccesSubmit)}
        >
            <Input
                autoFocus
                {...form.register('name')}
                label="Nazwa spotkania"
            />
            <Calendar
                label="Data spotkania"
                control={form.control}
                name="date"
            />
            <button type="submit">wyślij</button>
        </form>
    );
};
