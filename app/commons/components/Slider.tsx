import type { SliderState } from '@react-stately/slider';
import type { SliderProps as DefaultSliderProps } from '@react-types/slider';
import { Fragment, type ReactNode, useId, useState } from 'react';
import { Slider as DefaultSlider, SliderThumb, SliderTrack } from 'react-aria-components';

import { Label } from '~/commons/components/Label';

interface SliderProps extends DefaultSliderProps {
  label?: ReactNode;
  tooltipContent?: (value: number | number[]) => ReactNode;
}

function getTrackPosition(state: SliderState, index: number) {
  if (state.values.length > 1) {
    return {
      left: state.getThumbPercent(index) * 100 + '%',
      right: state.getThumbPercent(index + 1) * 100 + '%',
      width: (state.getThumbPercent(index + 1) - state.getThumbPercent(index)) * 100 + '%',
    };
  }

  return {
    left: 0,
    right: state.getThumbPercent(index) * 100 + '%',
    width: state.getThumbPercent(index) * 100 + '%',
  };
}

function getTooltipPosition(state: SliderState, index: number) {
  if (state.values.length > 1) {
    return {
      zIndex: index,
      left: ((state.getThumbPercent(index + 1) + state.getThumbPercent(index)) / 2) * 100 + '%',
    };
  }

  return {
    zIndex: index,
    left: state.getThumbPercent(index) * 100 + '%',
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
      {...props}
    >
      {label && (
        <Label
          htmlFor={id}
          className="flex-1"
        >
          {label}
        </Label>
      )}

      <SliderTrack
        className="relative h-2 rounded-full bg-blue-400/40"
        onHoverChange={setIsTooltipOpen}
      >
        {({ state }) =>
          state.values.map((_, i) => {
            return (
              <Fragment key={i}>
                {i % 2 === 0 && (
                  <>
                    <div
                      className="absolute top-[50%] h-2 translate-y-[-50%] rounded-full bg-blue-600"
                      style={getTrackPosition(state, i)}
                    />
                    {isTooltipOpen && (
                      <div
                        className="absolute top-[200%] w-32 translate-x-[-50%] border bg-blue-50 p-2 text-center text-nowrap"
                        style={getTooltipPosition(state, i)}
                      >
                        {tooltipContent?.([state.values[i], state.values[i + 1]])}
                      </div>
                    )}
                  </>
                )}

                <SliderThumb
                  key={i}
                  index={i}
                  aria-label="test"
                  className="dragging:bg-purple-100 top-[50%] h-7 w-7 rounded-full border border-solid border-purple-800/75 bg-white ring-black transition outline-none focus-visible:ring-2"
                />
              </Fragment>
            );
          })
        }
      </SliderTrack>
    </DefaultSlider>
  );
}
