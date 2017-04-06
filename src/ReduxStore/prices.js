import { createAction, handleActions } from 'redux-actions'
import _ from 'lodash'
import numeral from 'numeral'
import ReconnectingWebsocket from 'reconnecting-websocket'
import { assocPath } from 'ramda'
import fetch from 'isomorphic-fetch'

import { currencyColors } from '../utils/currencies'

const PRICES_STORE_KEY = 'PRICES_STORE_KEY'

export default class PricesStore {
  initialState = {
    rateData: {},
    marketData: {},
    period: 'day',
    isLoaded: false,
    error: null
  }

  // actions
  fetchDataRequest = createAction('fetch-data-request')
  fetchDataSuccess = createAction('fetch-data-success')
  fetchDataFailure = createAction('fetch-data-failure')
  fetchData = () => {
    return (dispatch, getState) => {
      dispatch(this.fetchDataRequest())

      const API_URL = process.env.API_URL
      // API_URL is an env var set by webpack
      const state = getState()
      const p1 = fetch(`${API_URL}/api/prices?period=${ state.period }`).then(res => res.json())
      const p2 = fetch(`${API_URL}/api/markets`).then(res => res.json())

      return Promise.all([p1, p2]).then(
        (values) => {
          // success
          dispatch(this.fetchDataSuccess({
            rateData: values[0].data,
            marketData: values[1].data
          }))
        },
        (reason) => {
          // failure
          const { isLoaded } = getState()
          if (!isLoaded) {
            // Only show the error if the first load fails
            const error = 'Error loading content, please check your connection and try again.'
            dispatch(this.fetchDataFailure(error))
          }

          setTimeout(() => {
            dispatch(this.fetchData())
          }, 2000)
        })
    }
  }
  updatePrice = createAction('update-price')
  connectToWebsocket = createAction('connect-to-websocket')
  setPeriod = createAction('set-period')
  selectPeriod = (period) => {
    return (dispatch, getState) => {
      dispatch(this.setPeriod(period))
      dispatch(this.fetchData())
      return Promise.resolve()
    }
  }

  // reducers
  reducer = handleActions({
    ['fetch-data-request']: (state, action) => {
      return { ...state }
    },

    ['fetch-data-success']: (state, action) => {
      return {
        ...state,
        rateData: action.payload.rateData,
        marketData: action.payload.marketData,
      }
    },

    ['fetch-data-failure']: (state, action) => {
      return {
        ...state,
        error: action.payload
      }
    },

    ['update-price']: (state, action) => {
      const message = action.payload
      const data = JSON.parse(message.data)
      const cryptoCurrency = data.cryptoCurrency
      const price = parseFloat(data.price)
      if (state.isLoaded) {
        const index = state.rateData[cryptoCurrency].length -1
        return assocPath(['rateData', cryptoCurrency, index])(price)(state)
      }
      return state
    },

    ['set-period']: (state, action) => {
      return {
        ...state,
        period: action.payload
      }
    },

  }, this.initialState)

  // other

  getActions = () => {
    return {
      fetchData: this.fetchData,
      updatePrice: this.updatePrice,
      connectToWebsocket: this.connectToWebsocket,
      selectPeriod: this.selectPeriod
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
    // const data = localStorage.getItem(UI_STORE_KEY)
    // if (data) this.fromJSON(data)

    // WE CAN DO THIS IN INDEX.JS
    // Persist store to localStorage
    // autorun(() => {
    //   localStorage.setItem(UI_STORE_KEY, this.toJSON())
    // })
  }

*/
