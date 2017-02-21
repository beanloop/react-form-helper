import * as React from 'react'
import {snap} from 'tscomp'
import {FormHelper} from './index'

describe('FormHelper', () => {
  it('should render the passed fields', () => {
    snap(
      <FormHelper
        value={{a: 'a'}}
        onSave={() => null}
        fields={[
          {path: ['a']},
          {path: ['b']},
        ]}
      />
    )
  })

  it('should render using specified components', () => {
    snap(
      <FormHelper
        inputComponent='some-input'
        value={{a: 'a', c: 'c'}}
        onSave={() => null}
        fields={[
          {path: ['a']},
          {path: ['b']},
          {component: 'other-input', path: ['c']},
          {component: 'other-input', path: ['d']},
        ]}
      />
    )
  })

  it('should not pass errors to the browser inputs', () => {
    snap(
      <FormHelper
        value={{}}
        onSave={() => null}
        fields={[
          {path: ['a'], error: 'a error'},
          {path: ['b'], validationError: 'b', validations: {b: {text: 'b error'}}},
          {path: ['c'], validations: {c: {text: 'c error', validation: () => false}}},
        ]}
      />
    )
  })

  it('should pass errors to custom inputs', () => {
    snap(
      <FormHelper
        inputComponent='input'
        value={{c: 'value'}}
        onSave={() => null}
        fields={[
          {path: ['a'], error: 'a error'},
          {path: ['b'], validationError: 'b', validations: {b: {text: 'b error'}}},
          {path: ['c'], validations: {c: {text: 'c error', validation: () => false}}},
        ]}
      />
    )
  })

  it('should not run custom validators on no value', () => {
    snap(
      <FormHelper
        inputComponent='input'
        value={{}}
        onSave={() => null}
        fields={[
          {path: ['a'], validations: {a: {text: 'a error', validation: () => {throw 'should not be called'}}}},
        ]}
      />
    )
  })

  it('should pass errors to untouched inputs if errorOnTouched is true', () => {
    snap(
      <FormHelper
        errorOnTouched
        inputComponent='input'
        value={{c: 'value'}}
        onSave={() => null}
        fields={[
          {path: ['a'], error: 'a error'},
          {path: ['b'], validationError: 'b', validations: {b: {text: 'b error'}}},
          {path: ['c'], validations: {c: {text: 'c error', validation: () => false}}},
        ]}
      />
    )
  })
})
