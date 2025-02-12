import type { ReactNode } from 'react';
import {
    Tooltip as DefaultTooltip,
    type TooltipProps as DefaultTooltipProps,
    OverlayArrow,
} from 'react-aria-components';

interface TooltipProps extends Omit<DefaultTooltipProps, 'children'> {
    children: ReactNode;
}

export const Tooltip = ({ children, ...props }: TooltipProps) => {
    return (
        <DefaultTooltip
            className="bg-slate-600"
            {...props}
        >
            <OverlayArrow>
                <svg
                    width={8}
                    height={8}
                    viewBox="0 0 8 8"
                >
                    <path d="M0 0 L4 4 L8 0" />
                </svg>
            </OverlayArrow>
            {children}
        </DefaultTooltip>
    );
};
