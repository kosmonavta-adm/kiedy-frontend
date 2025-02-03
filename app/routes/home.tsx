import type { Route } from './+types/home';
import { CreateMeeting } from '~/features/meeting/create-meeting/CreateMeeting';

export function meta({}: Route.MetaArgs) {
    return [{ title: 'New React Router App' }, { name: 'description', content: 'Welcome to React Router!' }];
}

export default function Home() {

    return (
        <>
            <CreateMeeting />
        </>
    );
}
