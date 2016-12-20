/**
 * Key used for specifying an error message for required fields
 *
 * Example:
 * ```
 * {
 *   path: ['email'],
 *   label: 'Email',
 *   type: 'email',
 *   required: true,
 *   validations: {
 *     [required]: {text: 'A valid email is required'},
 *   },
 * }
 * ```
 */
export const required = 'required'

/**
 * Validate an input against a regex
 *
 * Example:
 * ```
 * {
 *   path: ['email'],
 *   label: 'Email',
 *   type: 'email',
 *   validations: {
 *     email: {
 *       text: 'The email is invalid',
 *       validation: pattern(emailRegex),
 *     },
 *   },
 * }
 * ```
 */
export const pattern = (pattern: RegExp) => (value: string) => pattern.test(value)
