import * as React from 'react'

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
