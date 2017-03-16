/// <reference types="jest" />
import {FieldConfig} from '../index'
import {scrollIntoView} from './scroll-into-view-helper'

function mockScroller(allowScroll = true) {
  return {
    state: {
      allowScroll,
    },
    setAllowScrollIntoView(allowScroll: boolean) {
      setImmediate(() => {
        this.state.allowScroll = allowScroll
      })
    },
  }
}

declare const global: any
global.HTMLElement = function (withParent = true) {
  this.nodeType = 1
  if (withParent) {
    this.parentNode = new (HTMLElement as any)(false)
  }
}

describe('scroll-into-view-helper', () => {
  it('should set a ref of the first field with an validationError', () => {
    expect(
      scrollIntoView(mockScroller(), [
        {},
        {validationError: 'error'},
        {validationError: 'error2'},
      ] as Array<FieldConfig>)
    ).toMatchSnapshot()
  })

  it('should not set a ref if allowScroll is false', () => {
    expect(
      scrollIntoView(mockScroller(false), [
        {},
        {validationError: 'error'},
        {validationError: 'error2'},
      ] as Array<FieldConfig>)
    ).toMatchSnapshot()
  })

  it('should scroll to the ref', () => {
    const [{ref}] = scrollIntoView(mockScroller(), [
      {validationError: 'error'},
    ] as Array<FieldConfig>) as any

    const mockElement: any = new HTMLElement()
    ref(mockElement)
    expect(typeof mockElement.parentNode['scrollTop']).toBe('number')
  })
})
