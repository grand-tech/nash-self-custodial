import {Actions, ActionTypes} from './actions';
interface CounterState {
  value: number;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: CounterState = {
  value: 0,
  status: 'idle',
};

export const reducer = (
  state: CounterState | undefined = initialState,
  action: ActionTypes,
): CounterState => {
  switch (action.type) {
    case Actions.INCREMENT:
      let v = state.value + 1;
      return {
        ...state,
        value: v,
      };
    case Actions.DECREMENT:
      let x = state.value - 1;
      return {
        ...state,
        value: x,
      };
    case Actions.INCREMENT_BY_AMOUNT:
      let y = state.value + action.amount;
      return {
        ...state,
        value: y,
      };
    case Actions.INCREMENT_BY_AMOUNT:
      let z = state.value + action.amount;
      return {
        ...state,
        value: z,
      };
    case Actions.INCREMENT_ASYNC_COMPLETE:
      return {
        ...state,
        value: action.result,
      };

    default:
      return state;
  }
};
