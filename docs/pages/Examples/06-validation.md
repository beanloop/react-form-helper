---
title: Validation
imports:
  '{FormHelper, pattern, required}': '../../../dist/src/index'
  '{cloneElement}': 'react'
  '{Button, IconButton}': 'react-toolbox/lib/button'
  '{Dropdown}': 'react-toolbox/lib/dropdown'
  '{FontIcon}': 'react-toolbox/lib/font_icon'
  '{Input}': 'react-toolbox/lib/input'
  '{Row}': 'styled-material/dist/src/layout'
---
```store example
<FormHelper
  saveButton='Save'
  buttonComponent={Button}
  buttonProps={{
    primary: true,
  }}
  inputComponent={Input}
  onSave={user => this.setState({user})}
  value={this.state.user}
  fields={[
    {path: ['name'], icon: 'face', label: 'Name', required: true, validations: {
      [required]: {text: 'Name is required'},
    }},
    {path: ['email'], icon: 'email', label: 'Email', required: true, validations: {
      [required]: {text: 'Email is required'},
      format: {
        text: 'Must be valid',
        // Validation takes a function to validate the field.
        // The provided pattern function takes a Regexp and
        // returns a validation function.
        validation: pattern(/^[^@]{1,60}@\w{1,50}\.\w{2,15}$/),
      },
    }},
    {path: ['phone'], icon: 'phone', label: 'Phone', validations: {
      format: {
        text: 'Must be valid', 
        validation: pattern(/^[0-9]{5,10}$/),
      },
    }},
  ]}
/>
```
#### Validation

###### Code
```stored example jsx
```

###### Demo
```render
<div>
  {store.example}
</div>
```

###### State
```render
<div>
  <p>
    User: {JSON.stringify(this.state.user, null, ' ')}
  </p>
</div>
```

#### Avoiding a lot of errors at once
If you have a form with multiple required fields you probably
don't want to display a required error for all of them when
the user opens the form. To avoid that you can set `errorOnTouched`
{' '} to only show the error after the user have interacted with the field.

###### Code
```code jsx
<FormHelper
  errorOnTouched
  // ...
/>
```

###### Demo
```render
<div>
  {cloneElement(store.example, {errorOnTouched: true})}
</div>
```

#### Server Side Validation
Some things can not be validated on the client alone. By setting
the validationError property on a field it will display that error
even if the validation function is missing or returns true.
```store server
<FormHelper
  saveButton='Save'
  buttonComponent={Button}
  buttonProps={{
    primary: true,
  }}
  inputComponent={Input}
  onSave={user => this.setState({user})}
  value={{email: 'admin@example.com'}}
  fields={[
    {path: ['email'], icon: 'email', label: 'Email', 
      validationError: 'unique', 
      validations: {
        unique: {text: 'The email is already registered'},
      },
    },
  ]}
/>
```

###### Code
```stored server jsx
```

###### Demo
```render
<div>
  {store.server}
</div>
```
