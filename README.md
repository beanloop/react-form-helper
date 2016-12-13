# react-form-helper
[![Build Status](https://travis-ci.org/beanloop/react-form-helper.svg?branch=master)](https://travis-ci.org/beanloop/react-form-helper)
[![npm version](https://badge.fury.io/js/react-form-helper.svg)](https://badge.fury.io/js/react-form-helper)
[![License](http://img.shields.io/:license-mit-blue.svg)](http://doge.mit-license.org)

React component for building forms with ease.

## Install
```
yarn add react-form-helper
npm install --save react-form-helper
```

## Usage
react-form-helper accept custom components for form, input and button,
which makes it easy to use with libraries such as react-toolbox and react-mdl.

Example below shows a simple usage using react-toolbox:

```tsx
import {FormHelper} from 'react-form-helper'
import Button from 'react-toolbox/lib/button'
import Checkbox from 'react-toolbox/lib/checkbox'
import Input from 'react-toolbox/lib/input'

const SignIn = () =>
  <FormHelper
    saveButton='Login'
    inputComponent={Input}
    buttonComponent={Button}
    onSave={credentials => signIn(dispatch, credentials)}
    object={{}}
    fields={[
      {path: ['email'], icon: 'email', label: 'Email', type: 'email'},
      {path: ['password'], icon: 'lock', label: 'Password', type: 'password'},
      {path: ['rememberMe'], component: ({value, onChange}) => (
        <Checkbox
          label='Remember me'
          checked={!!value}
          onChange={onChange}
        />
      )},
    ]}
  />
)
```

## License
react-form-helper is dual-licensed under Apache 2.0 and MIT
terms.
