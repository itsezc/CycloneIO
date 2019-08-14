import { createStore, applyMiddleware, compose } from 'redux'

import Reducers from './store/reducers'

import { CycloneWindow } from 'window.d.ts'
declare let window: CycloneWindow

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