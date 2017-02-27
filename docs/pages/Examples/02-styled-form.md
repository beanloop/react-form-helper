---
title: Styled Form
imports:
  '{FormHelper}': '../../../dist/src/index'
---
```store example
<FormHelper
  saveButton='Login'
  buttonProps={{
    style: {padding: 8, background: 'lightblue', border: 'none'},
  }}
  onSave={credentials => this.setState({credentials})}
  fields={[
    {
      path: ['email'], 
      label: 'Email', 
      style: {border: '2px solid lightblue'},
      divProps: {style: {padding: 8}},
      labelSpanProps: {style: {display: 'inline-block', width: 120}},
    },
    {
      path: ['password'], 
      label: 'Password', 
      type: 'password', 
      style: {border: '2px solid lightblue'},
      divProps: {style: {padding: 8}},
      labelSpanProps: {style: {display: 'inline-block', width: 120}},
    },
    {
      path: ['rememberMe'], 
      label: 'Remember me', 
      type: 'checkbox', 
      divProps: {style: {padding: 8}},
      labelSpanProps: {style: {display: 'inline-block', width: 120}},
    },
  ]}
/>
```
#### Styled form
Extra properties in the field definitions is passed down to the input
component. There are also a `buttonProps` prop on the form and `divPops`,
`labelProps` and `labelSpanProps` fields on the field definitions to pass
down extra props to the corresponding components. This lets you control 
their behavior and for example add styles.

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
