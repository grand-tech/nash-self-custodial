export enum Actions {
  INCREMENT = 'COUNTER/INCREMENT',
  DECREMENT = 'COUNTER/DECREMENT',
  INCREMENT_BY_AMOUNT = 'COUNTER/INCREMENT_BY_AMOUNT',
  INCREMENT_ASYNC = 'COUNTER/INCREMENT_ASYNC',
  INCREMENT_ASYNC_COMPLETE = 'COUNTER/INCREMENT_ASYNC_COMPLETE',
}

export interface IncrementAction {
  type: Actions.INCREMENT;
}

export interface DecrementAction {
  type: Actions.DECREMENT;
}

export interface IncrementByAmountAction {
  type: Actions.INCREMENT_BY_AMOUNT;
  amount: number;
}

export interface IncrementAsyncAction {
  type: Actions.INCREMENT_ASYNC;
  amount: number;
}

export interface IncrementAsyncCompleteAction {
  type: Actions.INCREMENT_ASYNC_COMPLETE;
  result: number;
}

/**
 * Create a generic action type.
 */
export type ActionTypes =
  | IncrementAction
  | DecrementAction
  | IncrementByAmountAction
  | IncrementAsyncCompleteAction
  | IncrementAsyncAction;

export function incrementCount(): IncrementAction {
  return {
    type: Actions.INCREMENT,
  };
}

export function decrementCount(): DecrementAction {
  return {
    type: Actions.DECREMENT,
  };
}

export function incrementCountByAmount(
  amount: number,
): IncrementByAmountAction {
  return {
    type: Actions.INCREMENT_BY_AMOUNT,
    amount,
  };
}

export function incrementCountAsync(amount: number): IncrementAsyncAction {
  return {
    type: Actions.INCREMENT_ASYNC,
    amount,
  };
}

export function incrementCountAsyncComplete(
  result: number,
): IncrementAsyncCompleteAction {
  return {
    type: Actions.INCREMENT_ASYNC_COMPLETE,
    result,
  };
}
