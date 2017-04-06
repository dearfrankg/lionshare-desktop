import uiStore from '../ui'
import { CURRENCIES } from '../../utils/currencies'

const ui = new uiStore()
const reducer = ui.reducer
const initialState = {
  view: 'prices',
  visibleCurrencies: CURRENCIES.map(currency => currency.symbol)
}

describe('ui store', () => {
  const actions = ui.getActions()

  describe('actions', () => {
    describe('changeView action', () => {
      it('should return change-view object with no payload', () => {
        const actual = ui.changeView()
        const expected = { type: 'change-view' }
        expect(actual).toEqual(expected)
      })
    })

    describe('toggleCurrency action', () => {
      it('should return toggle-currency object with currency payload', () => {
        const actual = ui.toggleCurrency('BTC')
        const expected = { type: 'toggle-currency', payload: 'BTC' }
        expect(actual).toEqual(expected)
      })
    })

    describe('toggleCurrenciesAll action', () => {
      it('should return toggle-currency-all object with no payload', () => {
        const actual = ui.toggleCurrenciesAll()
        const expected = { type: 'toggle-currency-all' }
        expect(actual).toEqual(expected)
      })
    })

    describe('toggleCurrenciesNone action', () => {
      it('should return toggle-currency-none object with no payload', () => {
        const actual = ui.toggleCurrenciesNone()
        const expected = { type: 'toggle-currency-none' }
        expect(actual).toEqual(expected)
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

    describe('changeView action', () => {
      it('should set view', () => {
        const state = {...initialState}
        const actual = reducer(state, ui.changeView('portfolio'))
        const expected = {...initialState, view: 'portfolio'}
        expect(actual).toEqual(expected)
      })
    })

    describe('toggleCurrency action', () => {
      describe('when currency in visible currencies', () => {
        it('should remove item from visible currencies', () => {
          const state = {...initialState}
          const actual = reducer(state, ui.toggleCurrency('BTC'))
          const expected = {
            ...initialState,
            visibleCurrencies: [...state.visibleCurrencies].filter(c => c !== 'BTC')
          }
          expect(actual).toEqual(expected)
        })
      })

      describe('when currency not in visible currencies', () => {
        it('should add item into visible currencies', () => {
          const visibleCurrencies = [...initialState.visibleCurrencies]
          const state = {
            ...initialState,
            visibleCurrencies: visibleCurrencies.filter(c => c !== 'BTC')
          }
          const actual = reducer(state, ui.toggleCurrency('BTC'))
          const expected = {
            ...state,
            visibleCurrencies: [...visibleCurrencies.filter(c => c !== 'BTC'), 'BTC']
          }
          expect(actual).toEqual(expected)
        })
      })
    })

    describe('toggleCurrencyAll action', () => {
      it('should set visible currencies to contain all currencies', () => {
        const state = {
          ...initialState,
          visibleCurrencies: []
        }
        const actual = reducer(state, ui.toggleCurrenciesAll())
        const expected = {...initialState}
        expect(actual).toEqual(expected)
      })
    })

    describe('toggleCurrencyNone action', () => {
      it('should set visible currencies to contain no currencies', () => {
        const state = {...initialState}
        const actual = reducer(state, ui.toggleCurrenciesNone())
        const expected = {
          ...initialState,
          visibleCurrencies: []
        }
        expect(actual).toEqual(expected)
      })
    })
  })

  describe('other', () => {
    describe('getActions', () => {
      it('should return an object with all the actions', () => {
        const actions = ui.getActions()
        const actionNames = Object.keys(actions)
        let actual, expected
        actual = actionNames
        expected = ['changeView', 'toggleCurrency', 'toggleCurrenciesAll', 'toggleCurrenciesNone' ]
        expect(actual).toEqual(expected)
        actual = actionNames.filter(name => typeof actions[name] === 'function').length
        expected = 4
      })
    })
  })
})
