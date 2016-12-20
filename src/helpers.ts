import {path as getPath} from 'ramda'
import {FieldConfig} from './index'
import {required} from './validation'

/**
 * Check is two arrays are equal (same length and all elements are ===)
 */
export function isEqual(a: Array<any>, b: Array<any>) {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
}

export function isValid(fields: Array<FieldConfig>, updatedObject) {
  const validatedFields = [] as Array<FieldConfig>
  let valid = true

  for (const field of fields) {
    if (!field || (field as any).props) {
      validatedFields.push(field)
      continue
    }

    const value = getValue(field.path, updatedObject)

    if (field.required && value === '') {
      valid = false
      validatedFields.push(Object.assign({}, field, {validationError: required}))
      continue
    }

    let fieldValid = true
    if (field.validations) {
      for (const [type, validation] of Object.entries(field.validations)) {
        if (value && validation.validation && !validation.validation(value)) {
          fieldValid = false
          validatedFields.push(Object.assign({}, field, {validationError: type}))
          break
        }
      }
      if (!fieldValid) {
        valid = false
        continue
      }
    }

    if (field.error) {
      valid = false
    }

    if (fieldValid) {
      validatedFields.push(field)
    }
  }

  return {validatedFields, valid}
}

export function getValue(path, updatedObject) {
  const value = getPath(path, updatedObject)
  if (value === undefined || value === null) return ''

  return value
}
