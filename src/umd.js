import * as properties from './'

for (let property in properties) {
  if (property !== 'default') {
    Object.defineProperty(properties.default, property, {
      value: properties[property]
    })
  }
}

export default properties.default
