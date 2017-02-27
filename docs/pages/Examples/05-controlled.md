---
title: Controlled
imports:
  '{FormHelper}': '../../../dist/src/index'
  '{Button}': 'react-toolbox/lib/button'
  '{Input}': 'react-toolbox/lib/input'
---
```store example
<FormHelper
  inputComponent={Input}
  onSave={credentials => this.setState({credentials})}
  onChange={credentials => this.setState({credentials})}
  value={this.state.credentials}
  fields={[
    {path: ['email'], icon: 'email', label: 'Email'},
  ]}
/>
```
#### Controlled
The form can be made into an controlled component by passing an
onChange function. This can be useful if you have an more advanced
use case and for examples use multiple forms, need to react to changes
while they are beeing typed or similar.
In this case you don't need a saveButton, but you will still need to
pass an onSave function as that will be called when the user submits
the form in other ways, with the keyboard for example.

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
    Credentials: {JSON.stringify(this.state.credentials)}
  </p>
</div>
```
