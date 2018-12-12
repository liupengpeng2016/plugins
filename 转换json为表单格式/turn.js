function formData (obj = {}, prefix = '') {
  const keys = Object.keys(obj)
  let result = ''
  const handlePrefix = str => prefix ? prefix + '[' + str + ']' : str
  keys.forEach(val => {
    if (typeof obj[val] === 'object') {
      result += formData(obj[val], handlePrefix(val)) + '&'
    } else {
      result += handlePrefix(encodeURIComponent(val)) + '=' + encodeURIComponent(obj[val]) + '&'
    }
  })
  return result.slice(0, -1)
}