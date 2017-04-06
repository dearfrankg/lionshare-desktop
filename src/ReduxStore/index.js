import { combineReducers } from 'redux'
import { createStore } from 'redux'
import UiStore from './ui'
import PricesStore from './prices'

const ui = new UiStore()
const prices = new PricesStore()

const rootReducer = combineReducers({
  ui: ui.reducer,
  prices: prices.reducer
})

const createStoreWithMiddleware = applyMiddleware(
  reduxThunk,
)(createStore)


export default createStoreWithMiddleware(rootReducer)
