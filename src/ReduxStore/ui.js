import { createAction, handleActions } from 'redux-actions'
import { CURRENCIES } from '../utils/currencies'

const UI_STORE_KEY = 'UI_STORE_KEY'
const AVAILABLE_VIEWS = [
  'prices',
  'portfolio',
  'settings',
]

export default class UiStore {
  initialState = {
    view: AVAILABLE_VIEWS[0],
    visibleCurrencies: CURRENCIES.map(currency => currency.symbol)
  }

  // actions
  changeView = createAction('change-view')
  toggleCurrency = createAction('toggle-currency')
  toggleCurrenciesAll = createAction('toggle-currency-all')
  toggleCurrenciesNone = createAction('toggle-currency-none')

  // reducers
  reducer = handleActions({
    ['change-view']: (state, action) => {
      if (AVAILABLE_VIEWS.includes(action.payload)) {
        return {
          ...state,
          view: action.payload
        }
      }
    },

    ['toggle-currency']: (state, action) => {
      const currency = action.payload
      const visibleCurrencies = [...state.visibleCurrencies]
      if (visibleCurrencies.includes(currency)) {
          return {
            ...state,
            visibleCurrencies: visibleCurrencies.filter(c => c !== currency)
          }
      } else {
          visibleCurrencies.push(currency)
          return {
            ...state,
            visibleCurrencies
          }
      }
    },

    ['toggle-currency-all']: (state, action) => {
      return {
        ...state,
        visibleCurrencies: CURRENCIES.map(currency => currency.symbol)
      }
    },

    ['toggle-currency-none']: (state, action) => {
      return {
        ...state,
        visibleCurrencies: []
      }
    },

  }, this.initialState);

  // other

  getActions = () => {
    return {
      changeView: this.changeView,
      toggleCurrency: this.toggleCurrency,
      toggleCurrenciesAll: this.toggleCurrenciesAll,
      toggleCurrenciesNone: this.toggleCurrenciesNone
    }
  }
}


/*

  // other

  // NOT NEEDED WE USE getState()
  // toJSON = () => (
  //   JSON.stringify({
  //     view: this.view,
  //     visibleCurrencies: this.visibleCurrencies,
  //   })
  // )

  constructor() {
    // Rehydrate store from persisted data
    // const data = localStorage.getItem(UI_STORE_KEY);
    // if (data) this.fromJSON(data);

    // WE CAN DO THIS IN INDEX.JS
    // Persist store to localStorage
    // autorun(() => {
    //   localStorage.setItem(UI_STORE_KEY, this.toJSON());
    // });
  }

*/
