import { createStore, applyMiddleware, compose } from 'redux'

import Reducers from './store/reducers'

import { CWindow } from 'window.d.ts'
declare let window: CWindow

const Store = createStore(
	Reducers,
	{},
	compose(
		(typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined') ? window.__REDUX_DEVTOOLS_EXTENSION__() : (f: any) => f
	)
)

export {
	Store
}