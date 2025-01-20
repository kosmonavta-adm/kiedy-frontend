import type { ReactNode } from 'react';

type PageContainerProps = {
    children: ReactNode;
};

export const PageContainer = ({ children }: PageContainerProps) => {
    return <div className="flex m-auto justify-center items-center">{children}</div>;
};
