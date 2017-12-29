declare module 'react-json-view'{
  class ReactJson extends React.Component<{
    src: any
    theme: string
    name: string
    collapsed: boolean | number
  }>{}

  export default ReactJson
}

declare module 'jq-web'{
  export default function jq(object: any, query: string): any
}