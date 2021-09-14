import { Action, ActionReducerMapBuilder, Draft } from '@reduxjs/toolkit';

type ActionWithData = Action & {
  data: any;
};

type Options<State> = {
  listeners: {
    [listener in string]: (state: Draft<State>, action: ActionWithData) => void;
  };
};

export default function addSseEventsListeners<State>(
  eventsPrefix: string,
  builder: ActionReducerMapBuilder<State>,
  options: Options<State>
) {
  Object.entries(options.listeners).forEach(([eventName, listener]) => {
    builder.addCase(`${eventsPrefix}/${eventName}`, (state, action) => {
      listener(state, action as ActionWithData);
    });
  });
}
