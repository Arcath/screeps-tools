import * as React from 'react'
import {shallow} from 'enzyme'
import Enzyme = require('enzyme')
import * as Adapter from 'enzyme-adapter-react-16'
import {MemoryViewer} from '../src/views/memory-viewer'

let testData = {
  foo: {
    bar: 'test'
  }
}

describe('Memory Viewer', () => {
  beforeAll(() => {
    Enzyme.configure({ adapter: new Adapter() });
  })

  it('should query data', () => {
    const viewer = shallow(<MemoryViewer />)

    viewer.instance().setState({data: testData, oData: testData, query: '.foo.bar'})
  })
})