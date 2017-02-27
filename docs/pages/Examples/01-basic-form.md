---
title: Basic Form
imports:
  '{FormHelper}': '../../../dist/src/index'
---
```store example
<FormHelper
  saveButton='Login'
  onSave={credentials => this.setState({credentials})}
  fields={[
    {path: ['email'], label: 'Email'},
    {path: ['password'], label: 'Password', type: 'password'},
    {path: ['rememberMe'], label: 'Remember me', type: 'checkbox'},
  ]}
/>
```
#### Basic form
A very basic sign in form.

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
