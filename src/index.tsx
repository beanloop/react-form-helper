import {lensPath, path as getPath, set} from 'ramda'
import * as React from 'react'
import {CSSProperties, Component, ReactChild, ReactType, cloneElement} from 'react'
import {getValue, isValid} from './helpers'

export * from './validation'

export const BrowserButton = ({loading: _, ...props}) => <button {...props} />

export const BrowserInput = ({error: _, onChange, label, divProps, labelProps, labelSpanProps, ...props}: any) =>
  <div {...divProps}>
    {label
      ? <label {...labelProps}>
          <span {...labelSpanProps}>{label}</span>
          <input {...props}
            onChange={e => onChange(
              (e.target as HTMLInputElement)[props.type === 'checkbox' ? 'checked' : 'value']
            )}
          />
        </label>
      : <input {...props}
          onChange={e => onChange(
            (e.target as HTMLInputElement)[props.type === 'checkbox' ? 'checked' : 'value'])
          }
        />
    }
  </div>

export type FieldConfig = {
  /**
   * Path to control in the object passed to FormHelper
   */
  path: Array<string>
  /**
   * Component to render, defaults to the inputComponent passed to FormHelper
   */
  component?: ReactType
  render?: (props: any) => ReactType
  label?: ReactChild
  /**
   * Callback when then field is modified.
   * It receives the full updatedObject for all fields and may return a new object
   * that is used instead.
   *
   * This is useful if you need to change more fields than the specified path.
   */
  onChange?: (updatedObject) => any
  /**
   * If the field is required
   */
  required?: boolean|((object) => boolean)
  /**
   * Specify validation messages and possibly functions
   *
   * Example:
   * ```
   * {
   *   [required]: {
   *     text: 'The field is required',
   *   },
   *   number: {
   *     text: 'Only numbers are allowed',
   *     validation: pattern(/^[0-9]+$/),
   *   },
   * }
   * ```
   */
  validations?: {
    [validationError: string]: {
      text: string
      validation?: (value) => boolean
    }
  }
  /**
   * Error in validations to display. The text property of the corresponding
   * field in validations will be displayed. Only set this if you handle
   * errors externally.
   */
  validationError?: string
  /**
   * Error to display, only set this if you handle errors externally
   * and does not use validations.
   */
  error?: string
}

export type Properties<T, I> = {
  /**
   * Fields to show in the form
   *
   * Example:
   * ```
   * [
   *   {
   *     path: ['username'],
   *     label: 'Username',
   *
   *   }
   * ]
   * ```
   */
  fields: Array<FieldConfig & I>
  /**
   * The object the form will manage.
   */
  value: T
  /**
   * Callback when the form is submitted, an updated object is passed as the only prop.
   * If a promise is returned the saveButton component will receive a loading prop set
   * to true until the promise is resolved or rejected.
   */
  onSave: (savedObject: T) => Promise<any>|void
  /**
   * Callback when any field in the form is modified.
   * If this property is set, the form becomes a controlled component and the value
   * prop must be maintained externally.
   *
   * This is useful if you nest multiple FormHelpers or need to restrict user input
   * before it appear on the screen.
   */
  onChange?: (updatedObject: T, valid: boolean) => void
  /**
   * A string or a renderd React component. This property will be passed as a child
   * to the buttonComponent
   */
  saveButton?: ReactChild
  /**
   * Component used for the form, defaults to a HTML form element.
   *
   * This is useful to set to a div if you nest multiple FormHelpers.
   */
  formComponent?: ReactType
  /**
   * Component used for fields that has not specified a different component.
   * Defaults to a HTML input element.
   *
   * Passed props are:
   *   value: The value for the field
   *   onChange: A function to be called with an updated value
   *   error: A string with an error message (if any)
   *   onBlur: If errorOnTouched is set, a function will be passed that should
   *           be called when the field looses focus.
   *
   * The component will also receive props from the field configuration that are not
   * path, validations or validationError, for example label and required.
   */
  inputComponent?: ReactType
  /**
   * Button component to render the saveButton, defaults to an HTML button element.
   *
   * Passed props are:
   *   disabled: If the button should be disabled
   *   value: The current value of the form
   *   loading: If the form is saving or not
   */
  buttonComponent?: ReactType
  buttonProps?: Object
  /**
   * A style property that is passed to the formComponent
   */
  style?: CSSProperties
  /**
   * An id property that is passed to the formComponent
   */
  formId?: string
  /**
   * Set to true to disable the saveButton if there are no changes
   */
  dirtyCheck?: boolean
  /**
   * Set to true to only show error messages for fields that have been touched
   */
  errorOnTouched?: boolean
  /**
   * Set to true to disable the saveButton
   */
  disabled?: boolean
}

export class FormHelper extends Component<Properties<any, any>, {}> {
  unmounted = false
  state = {
    loading: false,
    updatedObject: null,
    touched: {},
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
      value,
      onSave,
      onChange,
      saveButton,
      formComponent: Form = 'form',
      inputComponent: Input = BrowserInput,
      buttonComponent: Button = BrowserButton,
      buttonProps,
      formId,
      dirtyCheck,
      errorOnTouched,
      disabled,
    } = this.props
    let {updatedObject, loading} = this.state

    let changed = !!onChange || !dirtyCheck

    updatedObject = onChange
      ? value
      : updatedObject || value

    const {validatedFields, valid} = isValid(fields, updatedObject)

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

          const {render, component, path, validations, validationError, ...inputProps} = field

          if (getPath(path, updatedObject) !== getPath(field.path, value)) {
            changed = true
          }

          const fieldValue = getValue(field.path, updatedObject)

          if (validationError) {
            const validation = validations && validations[field.validationError]
            inputProps.error = (validation && validation.text) || ''
          }

          if (errorOnTouched) {
            if (!this.state.touched[path.join('.')]) {
              const oldBlur = inputProps.onBlur
              inputProps.onBlur = e => {
                this.setState({
                  touched: {
                    ...this.state.touched,
                    [path.join('.')]: true,
                  },
                })

                if (oldBlur) return oldBlur(e)
              }
              inputProps.error = undefined
            }
          }

          const props = {
            key: i,
            value: fieldValue,
            disabled,
            ...inputProps,
            onChange: value => {
              let newUpdatedObject = set(lensPath(path), value, updatedObject)
              if (field.onChange) {
                const modifiedObject = field.onChange(newUpdatedObject)
                if (modifiedObject) {
                  newUpdatedObject = modifiedObject
                }
              }
              if (onChange) {
                onChange(newUpdatedObject, isValid(fields, newUpdatedObject).valid)
              } else {
                this.setState({updatedObject: newUpdatedObject})
              }
            },
          }

          if (render) {
            return render(props)
          } else {
            const Field = component || Input
            return <Field {...props}  />
          }

        })}
          {saveButton &&
            <Button
              type='submit'
              value={updatedObject}
              loading={loading}
              disabled={!changed || !valid || disabled}
              {...buttonProps}
            >
              {saveButton}
            </Button>
          }
      </Form>
    )
  }
}
