import { INCREMENT, DECREMENT } from './constant'

export const createIncrementAction = val => ({ type: INCREMENT, data: val })
export const createDecrementAction = val => ({ type: DECREMENT, data: val })