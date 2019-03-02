import { createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers'

const middleware = createReactNavigationReduxMiddleware(
  state => state.nav,
)

export default middleware

