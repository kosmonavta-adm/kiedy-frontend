import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';

import { CreateMeetingForm } from '@/features/meeting/create-meeting/CreateMeetingForm';

export const Route = createFileRoute('/')({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <main className="flex p-12">
      <CreateMeetingForm />
    </main>
  );
}
