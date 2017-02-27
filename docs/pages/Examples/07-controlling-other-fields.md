---
title: Controlling other fields
imports:
  '{FormHelper}': '../../../dist/src/index'
  '{Input}': 'react-toolbox/lib/input'
---
```store example
<FormHelper
  inputComponent={Input}
  onSave={user => this.setState({user})}
  onChange={user => this.setState({user})}
  value={this.state.user}
  fields={[
    {path: ['name'], icon: 'face', label: 'Name', onChange: updated => {
      const oldUser = this.state.user || {}
      
      // Update the displayName only if it matches with the previous name
      return oldUser.name === oldUser.displayName
        ? {...updated, displayName: updated.name}
        : updated
    }},
    {path: ['displayName'], icon: 'account_circle', label: 'Display Name'},
  ]}
/>
```
#### Controlling other fields
Sometimes you need to controll other fields based on the field the user typed in. 
Maybe to provide a default value or to display a preview of something.

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
    User info: {JSON.stringify(this.state.user)}
  </p>
</div>
```
