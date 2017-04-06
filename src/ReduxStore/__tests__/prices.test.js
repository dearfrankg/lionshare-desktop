import pricesStore from '../prices'
import { assocPath } from 'ramda'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

const prices = new pricesStore()
const reducer = prices.reducer

process.env.API_URL = 'http://localhost:3005'
process.env.WS_URL = 'ws://localhost:3005'
const API_URL = process.env.API_URL


const initialState = {
  rateData: {},
  marketData: {},
  period: 'day',
  isLoaded: false,
  error: null
}

const loadedState = {
  rateData: {
    BTC: [
      1127.41, 1134.47, 1126.84, 1122.24, 1123.21, 1130.99,
      1128.98, 1132.99, 1146, 1153, 1153.21, 1156.22, 1158.11
    ]
  },
  marketData: {},
  period: 'day',
  isLoaded: true,
  error: null
}

const assertActionWorks = (actionFn, expectation) => {
  const hasPayload = ('payload' in expectation)
  const actual = hasPayload
    ? actionFn(expectation.payload)
    : actionFn()
  const expected = expectation
  expect(actual).toEqual(expected)
}

describe('prices store', () => {
  const actions = prices.getActions()
  const pricesData = {
    data: {
      BTC: [
        1127.41, 1134.47, 1126.84, 1122.24, 1123.21, 1130.99,
        1128.98, 1132.99, 1146, 1153, 1153.21, 1156.22, 1158.11
      ]
    }
  }
  const marketData = {
    data: {
      BTC: 1158.11
    }
  }

  afterEach(() => {
    nock.cleanAll()
  })

  describe('actions', () => {

    describe('fetchDataRequest action', () => {
      it('should return fetch-data-request object with no payload', () => {
        assertActionWorks(
          prices.fetchDataRequest,
          { type: 'fetch-data-request' }
        )
      })
    })

    describe('fetchDataSuccess action', () => {
      it('should return fetch-data-success object with success payload', () => {
        assertActionWorks(
          prices.fetchDataSuccess,
          { type: 'fetch-data-success', payload: 'success-payload' }
        )
      })
    })

    describe('fetchDataFailure action', () => {
      it('should return fetch-data-failure object with failure payload', () => {
        assertActionWorks(
          prices.fetchDataFailure,
          { type: 'fetch-data-failure', payload: 'failure-payload' }
        )
      })
    })

    describe('fetchData action', () => {
      it('should fetch data and handle success', () => {
        nock(API_URL)
          .get(`/api/prices?period=${ 'day' }`)
          .reply(200, pricesData)

        nock(API_URL)
          .get(`/api/markets`)
          .reply(200, marketData)

        const store = mockStore({ period: 'day' })
        return store.dispatch(prices.fetchData())
          .then(() => {
            const actual = store.getActions()
            const expected = [
              { type: 'fetch-data-request' },
              { type: 'fetch-data-success',
                payload: {
                  rateData: pricesData.data,
                  marketData: marketData.data
                }
              }
            ]
            expect(actual).toEqual(expected)
          })
      })

      it('should fetch data and handle failure', () => {
        nock(API_URL)
          .get(`/api/prices?period=${ 'day' }`)
          .reply(404)

        nock(API_URL)
          .get(`/api/markets`)
          .reply(404)

        const store = mockStore({ period: 'day' })
        return store.dispatch(prices.fetchData())
          .then(() => {
            const actual = store.getActions()
            const expected = [
              { type: 'fetch-data-request' },
              { type: 'fetch-data-failure',
                payload: 'Error loading content, please check your connection and try again.'
              }
            ]
            expect(actual).toEqual(expected)
          })
      })
    })

    describe('updatePrice action', () => {
      it('should return update-price object with message payload', () => {
        assertActionWorks(
          prices.updatePrice,
          { type: 'update-price', payload: 'message-payload' }
        )
      })
    })

    describe('connectToWebsocket action', () => {
      it('should return connect-to-websocket object with no payload', () => {

      })
    })

    describe('setPeriod action', () => {
      it('should return set-period object with period payload', () => {
        assertActionWorks(
          prices.setPeriod,
          { type: 'set-period', payload: 'period-payload' }
        )
      })
    })

    describe('selectPeriod action', () => {
      it('should dispatch setPeriod and fetchData actions', () => {
        nock(API_URL)
          .get(`/api/prices?period=${ 'day' }`)
          .reply(200, pricesData)

        nock(API_URL)
          .get(`/api/markets`)
          .reply(200, marketData)

        const store = mockStore({ period: 'day' })
        return store.dispatch(prices.selectPeriod('month'))
          .then(() => {
            const actual = store.getActions()
            const expected = [
              { type: 'set-period', payload: 'month' },
              { type: 'fetch-data-request' }
            ]
            expect(actual).toEqual(expected)
          })
      })
    })
  })

  describe('reducer', () => {
    describe('empty action', () => {
      it('should return the initial state', () => {
        const actual = reducer(undefined, {})
        const expected = initialState
        expect(actual).toEqual(expected)
      })
    })

    describe('fetchDataRequest action', () => {
      it('should return the initial state', () => {
        const actual = reducer(initialState, prices.fetchDataRequest())
        const expected = initialState
        expect(actual).toEqual(expected)
      })
    })

    describe('fetchDataSuccess action', () => {
      it('should set state for rateData and marketData', () => {
        const actual = reducer(initialState, prices.fetchDataSuccess({
          rateData: pricesData.data,
          marketData: marketData.data
        }))
        const expected = {
          ...initialState,
          rateData: pricesData.data,
          marketData: marketData.data
        }
        expect(actual).toEqual(expected)
      })
    })

    describe('fetchDataFailure action', () => {
      it('should set state for error', () => {
        const actual = reducer(initialState, prices.fetchDataFailure('error: 321'))
        const expected = {
          ...initialState,
          error: 'error: 321'
        }
        expect(actual).toEqual(expected)
      })
    })

    describe('updatePrice action', () => {
      describe('when isLoaded is true', () => {
        it('should set state for currency price', () => {
          const state = {...loadedState}
          const message = {
            data: JSON.stringify({
              cryptoCurrency: 'BTC',
              price: 1200.50
            })
          }
          const actual = reducer(state, prices.updatePrice(message))
          const index = state.rateData['BTC'].length -1
          const expected = assocPath(['rateData', 'BTC', index])(1200.50)(state)
          expect(actual).toEqual(expected)
        })
      })

      describe('when isLoaded is false', () => {
        it('should not change state', () => {
          const state = {
            ...loadedState,
            isLoaded: false
          }
          const message = {
            data: JSON.stringify({
              cryptoCurrency: 'BTC',
              price: 1200.50
            })
          }
          const actual = reducer(state, prices.updatePrice(message))
          const expected = state
          expect(actual).toEqual(expected)
        })
      })
    })

    describe('connectToWebsocket action', () => {
      xit('should reconnect to websocket', () => {
        // const state = { }
        // const actual = reducer(state, prices.toggleCurrenciesAll())
        // const expected = {...initialState}
        // expect(actual).toEqual(expected)
      })
    })


    describe('setPeriod action', () => {
      it('should set state for period', () => {
        const state = {...initialState}
        const actual = reducer(state, prices.setPeriod('month'))
        const expected = {
          ...state,
          period: 'month'
        }
        expect(actual).toEqual(expected)
      })
    })
  })

  describe('other', () => {
    describe('getActions', () => {
      it('should return an object with all the actions', () => {
        const actions = prices.getActions()
        const actionNames = Object.keys(actions)
        let actual, expected
        actual = actionNames
        expected = ['fetchData', 'updatePrice', 'connectToWebsocket', 'selectPeriod' ]
        expect(actual).toEqual(expected)
        actual = actionNames.filter(name => typeof actions[name] === 'function').length
        expected = 4
      })
    })
  })
})
