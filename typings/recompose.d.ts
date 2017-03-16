declare module 'recompose/wrapDisplayName' {
  import {ReactType} from 'react'

  export default function wrapDisplayName(component: ReactType, wrapName: string): string
}
