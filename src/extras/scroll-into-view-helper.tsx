import * as React from 'react'
import {Component, ReactType} from 'react'
import {findDOMNode} from 'react-dom'
import wrapDisplayName from 'recompose/wrapDisplayName'
import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed'

export type HOC = (ReactType) => ReactType
export type Settings = {
  /**
   * Scroll time in ms
   */
  duration?: number
}

/**
 * A HOC that keeps state for the [[scrollIntoView]] helper.
 *
 * It provides setAllowScrollIntoView and scroller as props to the wrapped components.
 *
 *  - setAllowScrollIntoView: is a function that should be called to enable/disable scrolling.
 *    For example, call `setAllowScrollIntoView(true)` when the user saves the form
 *
 *  - scroller: is an object that should passed as the first argument to [[scollIntoView]].
 *    It should never be accessed directly
 */
export const withScrollIntoView: (settings?: Settings) => HOC = ({duration = 200} = {}) =>
  WrappedComponent => class extends Component<any, {allowScroll: boolean}> {
    static displayName = wrapDisplayName(WrappedComponent, 'withScrollIntoView')

    state = {allowScroll: true}
    animationSettings = {duration}
    setAllowScrollIntoView = allowScroll => this.setState({allowScroll})

    render() {
      return (
        <WrappedComponent {...this.props}
          setAllowScrollIntoView={this.setAllowScrollIntoView}
          scroller={this}
        />
      )
    }
  }

/**
 * A helper function to scroll the first field with a validationError property
 * into view.
 *
 * Parameters:
 *  - scroller: The scroller prop from the [[withScrollIntoView]] HOC
 *  - fields: The fields to wrap
 *
 * Example:
 * ```typescript
 * <FormHelper
 *   value={{}}
 *   onSave={user => {
 *     setAllowScrollIntoView(true)
 *     return signIn(user)
 *   }}
 *   fields={scrollIntoView(scroller, [
 *     {path: ['username'], label: 'Username',
 *      validationError: missingUser && 'missingUser', validations: {
 *        missingUser: {text: 'The username does not exist'},
 *      }},
 *     {path: ['password'], label: 'Password', type: 'password',
 *      validationError: invalidPassword && 'invalidPassword', validations: {
 *        invalidPassword: {text: 'Invalid Password'},
 *      }},
 *   ])}
 * />
 * ```
 */
export function scrollIntoView(scroller, fields: Array<any>) {
  if (!scroller.state.allowScroll) return fields

  let allowScroll = true
  let hasScrolled = false

  return fields.map(field => {
    if (!allowScroll) return field

    if (field.validationError) {
      scroller.setAllowScrollIntoView(false)
      allowScroll = false

      return {
        ...field,
        ref(ref) {
          if (hasScrolled || !ref || !scroller.state.allowScroll) return null

          const element = findDOMNode(ref)

          scrollIntoViewIfNeeded(element, true, scroller.animationSettings)
          hasScrolled = true
        },
      }
    }

    return field
  })
}
