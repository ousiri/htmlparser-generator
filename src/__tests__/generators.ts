import * as helper from "../__fixtures__/test-helper"
import { parseDOM } from 'htmlparser2'
import generator from '..'

helper.createSuite("Generators", (test, cb) => {
  cb(null, generator(
    parseDOM(test.html, test.options.parser),
    test.options.generator,
  ))
})
