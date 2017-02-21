import {pattern} from './validation'

describe('validation', () => {
  describe('pattern', () => {
    it('should validate against the passed regex', () => {
      expect(pattern(/a/)('a')).toBe(true)
      expect(pattern(/a/)('b')).toBe(false)
      expect(pattern(/b/)('b')).toBe(true)
    })
  })
})
