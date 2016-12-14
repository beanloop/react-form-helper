import {lensPath, path as getPath, set} from 'ramda'
import {CSSProperties, Component, ReactChild, ReactElement, ReactType, cloneElement} from 'react'

export const required = 'required'

function isEqual(a, b) {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
}

function isValid(fields: Array<FieldConfig>, updatedObject) {
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

export const pattern = pattern => value => pattern.test(value)

export const findValidationErrors = (error, validatedObject, ignorePath) => {
  const validationError = error.graphQLErrors.find(e => e.type === 'ValidationError')
  if (!validationError) return null

  return {
    type: validationError.type,
    errors: validationError.errors.map(error => {
      const path = error.path || [error.field]
      if (path[0] === ignorePath) {
        path.shift()
      }

      return {
        type: error.type,
        path,
        value: getValue(path, validatedObject)
      }
    })
  }
}


export function getValue(path, updatedObject) {
  const value = getPath(path, updatedObject)
  if (value === undefined || value === null) return ''

  return value
}

export type FieldConfig = {
  path: Array<string>
  component?: ReactType
  required?: boolean
  error?: string
  validationError?: string
  validations?: {
    [validationError: string]: {
      text: string
      validation?: (value) => boolean
    }
  }
}

export type Properties<T, I> = {
  fields: Array<FieldConfig & I>
  object: T
  onSave: (savedObject: T) => Promise<any>|void
  onUpdate?: (updatedObject: T, valid: boolean) => void
  actions?: ((updatedObject: T) => ReactChild|Array<ReactChild>)|ReactChild|Array<ReactChild>
  saveButton?: ReactChild
  formComponent?: ReactType
  inputComponent?: ReactType
  buttonComponent?: ReactType
  style?: CSSProperties
  formId?: string
  dirtyCheck?: boolean
  disabled?: boolean
  validationErrors?: any
}

export type Props<T> = {
 fields: Array<ReactElement<any>|FieldConfig>
 object: T
 onSave: (savedObject: T) => Promise<any>|void
 onUpdate?: (updatedObject: T, valid: boolean) => void
 actions: Function
 saveButton: {}
 formId: string
 dirtyCheck: {}
 disabled: true
}

const BrowserButton = ({disabled, children}) =>
  <button disabled={disabled}>
    {children}
  </button>

const BrowserInput = ({error, onChange, ...props}) =>
  <input {...props} onChange={e => onChange((e.target as HTMLInputElement).value)} />

export class FormHelper extends Component<Properties<any, any>, {}> {
  unmounted = false
  state = {
    loading: false,
    updatedObject: null,
  }

  componentDidMount() {
    const {fields, object, onUpdate} = this.props
    if (onUpdate && isValid(fields, object)) {
      onUpdate(object, true)
    }
  }

  componentWillUnmount() {
    this.unmounted = true
  }

  setLoading(loading) {
    if (!this.unmounted) {
      this.setState({loading})
    }
  }

  render() {
    const {
      style,
      fields,
      object,
      onSave,
      onUpdate,
      saveButton,
      formComponent: Form = 'form',
      inputComponent: Input = BrowserInput,
      buttonComponent: Button = BrowserButton,
      formId,
      dirtyCheck,
      disabled,
    } = this.props
    let {updatedObject, loading} = this.state

    let changed = !!onUpdate || !dirtyCheck

    updatedObject = onUpdate
      ? object
      : updatedObject || object

    const {validatedFields, valid} = isValid(fields, updatedObject)

    let {actions = null} = this.props
    if (typeof actions === 'function') {
      actions = actions(updatedObject)
    }

    return (
      <Form id={formId} style={style} onSubmit={e => {
        e.preventDefault()
        const returnValue = onSave(updatedObject)
        if (returnValue && returnValue.then && returnValue.catch) {
          this.setLoading(true)
          returnValue
            .catch(error => {
              this.setLoading(false)
              throw error
            })
            .then(() => this.setLoading(false))
        }
      }}>
        {validatedFields.map((field: any, i: any) => {
          if (!field) return null
          if (field.props) return cloneElement(field, {key: i})

          const {path, validations, validationError, ...inputProps} = field

          if (getPath(path, updatedObject) !== getPath(field.path, object)) {
            changed = true
          }

          const value = getValue(field.path, updatedObject)

          if (validationError) {
            const validation = validations && validations[field.validationError]
            Object.assign(inputProps, {error: (validation && validation.text) || ''})
          }

          const Field = field.component || Input

          return (
            <div key={i}>
              <Field value={value} disabled={disabled} {...inputProps} onChange={value => {
                const newUpdatedObject = set(lensPath(path), value, updatedObject)
                if (onUpdate) {
                  onUpdate(newUpdatedObject, isValid(fields, newUpdatedObject).valid)
                } else {
                  this.setState({updatedObject: newUpdatedObject})
                }
              }} />
            </div>
          )
        })}
          {saveButton &&
            <Button object={updatedObject} loading={loading} disabled={!changed || !valid || disabled}>
              {saveButton}
            </Button>
          }
      </Form>
    )
  }
}
