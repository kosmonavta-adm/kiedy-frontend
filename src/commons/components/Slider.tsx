import type { SliderState } from '@react-stately/slider';
import type { SliderProps as DefaultSliderProps } from '@react-types/slider';
import { GripVertical } from 'lucide-react';
import { Fragment, type ReactNode, useId, useState } from 'react';
import { Slider as DefaultSlider, SliderThumb, SliderTrack } from 'react-aria-components';

import { Label } from '@/commons/components/Label';
import { cxTw } from '@/commons/utils';

interface SliderProps extends DefaultSliderProps {
  label?: ReactNode;
  tooltipContent?: (value: number | number[]) => ReactNode;
}

const getPercentValue = (value: number): string => value * 100 + '%';

function getTrackPosition(state: SliderState, index: number) {
  if (state.values.length > 1) {
    return {
      left: getPercentValue(state.getThumbPercent(index)),
      right: getPercentValue(state.getThumbPercent(index + 1)),
      width: getPercentValue(state.getThumbPercent(index + 1) - state.getThumbPercent(index)),
    };
  }

  return {
    left: 0,
    right: getPercentValue(state.getThumbPercent(index)),
    width: getPercentValue(state.getThumbPercent(index)),
  };
}

function getTooltipPosition(state: SliderState, index: number) {
  if (state.values.length > 1) {
    return {
      zIndex: index,
      left: getPercentValue((state.getThumbPercent(index + 1) + state.getThumbPercent(index)) / 2),
    };
  }

  return {
    zIndex: index,
    left: getPercentValue(state.getThumbPercent(index)),
  };
}

export function Slider({ label, onChange, onChangeEnd, tooltipContent, ...props }: SliderProps) {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const id = useId();

  return (
    <DefaultSlider
      id={id}
      onChange={(args) => {
        setIsTooltipOpen(true);
        onChange?.(args);
      }}
      onChangeEnd={(args) => {
        setIsTooltipOpen(false);
        onChangeEnd?.(args);
      }}
      className="flex flex-col gap-4"
      {...props}
    >
      {label && <Label htmlFor={id}>{label}</Label>}

      <SliderTrack
        className="relative h-2 rounded-full bg-blue-300/40"
        onHoverChange={setIsTooltipOpen}
      >
        {({ state }) =>
          state.values.map((_, i) => {
            return (
              <Fragment key={i}>
                {i % 2 === 0 && (
                  <>
                    <div
                      className={`absolute top-[50%] h-2 translate-y-[-50%] rounded-full bg-blue-500`}
                      style={getTrackPosition(state, i)}
                    />
                    {isTooltipOpen && (
                      <div
                        className="absolute bottom-[100%] w-fit -translate-y-4 translate-x-[-50%] text-nowrap rounded border border-neutral-200/50 bg-white px-4 py-2 text-center shadow-lg"
                        style={getTooltipPosition(state, i)}
                      >
                        {state.values.length === 1
                          ? tooltipContent?.(state.values[i])
                          : tooltipContent?.([state.values[i], state.values[i + 1]])}
                      </div>
                    )}
                  </>
                )}

                <SliderThumb
                  key={i}
                  index={i}
                  aria-label="test"
                  className={({ isDragging }) =>
                    cxTw(
                      'top-[50%] flex h-6 w-4 cursor-grab justify-center rounded border-2 border-neutral-600 bg-white outline-none outline-4 outline-white ring-black transition focus-visible:ring-2',
                      isDragging && 'cursor-grabbing bg-neutral-100'
                    )
                  }
                >
                  <GripVertical className="m-auto h-5 w-3" />
                </SliderThumb>
              </Fragment>
            );
          })
        }
      </SliderTrack>
    </DefaultSlider>
  );
}
