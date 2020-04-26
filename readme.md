
htmlparser-generator

Highly inspired by htmlparser-to-html.

## Usage

```js
const htmlparser2 = require('htmlparser2')
const { generator } = require('htmlparser-generator')

console.log(
  generator(htmlparser2.parseDOM('<h1>test</h1>'))
)
```

Output:

```
<h1>test</h1>
```

## options

disableAttrEscape
dumpEmptyAttri
beforeEach
