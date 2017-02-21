import {isValid} from './helpers'
import {required} from './validation'

describe('helpers', () => {
  describe('isValid', () => {
    it('should return false if any of the fields have an error property', () => {
      const fields = [
        {path: ['a']},
        {path: ['b'], error: 'error'},
        {path: ['c']},
      ]

      expect(isValid(fields, {})).toEqual({validatedFields: fields, valid: false})
    })

    it('should return false if any of the fields have an validationError property', () => {
      const fields = [
        {path: ['a']},
        {path: ['b'], validationError: 'error'},
        {path: ['c']},
      ]

      expect(isValid(fields, {})).toEqual({validatedFields: fields, valid: false})
    })

    it('should return false if any of the fields fail their validation', () => {
      const validation = value => value === 'B'
      const fields = [
        {path: ['a']},
        {path: ['b'], validations: {isUppercase: {text: 'Must be uppercase', validation}}},
        {path: ['c']},
      ]
      const validatedFields = [
        {path: ['a']},
        {path: ['b'], validations: {isUppercase: {text: 'Must be uppercase', validation}}, validationError: 'isUppercase'},
        {path: ['c']},
      ]

      expect(isValid(fields, {b: 'b'})).toEqual({validatedFields, valid: false})
    })

    it('should return false if any of the fields are required but missing', () => {
      const fields = [
        {path: ['a']},
        {path: ['b'], required: true},
        {path: ['c']},
      ]
      const validatedFields = [
        {path: ['a']},
        {path: ['b'], required: true, validationError: required},
        {path: ['c']},
      ]

      expect(isValid(fields, {})).toEqual({validatedFields, valid: false})
    })

    it('should return true if the fields validate', () => {
      const validation = value => value !== 'A'
      const fields = [
        {path: ['a']},
        {path: ['b'], required: true, validations: {isNotA: {text: '', validation}}},
        {path: ['c'], validations: {isNotA: {text: '', validation}}},
      ]

      expect(isValid(fields, {b: 'B'})).toEqual({validatedFields: fields, valid: true})
    })
  })
})
