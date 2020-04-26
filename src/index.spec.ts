
import { parseDOM } from 'htmlparser2'
import { Element } from "domhandler";
import generator from '.'

// Add an `attributes` prop to the Element for now, to make it possible for Jest to render DOM nodes.
Object.defineProperty(Element.prototype, "attributes", {
  get() {
    return Object.keys(this.attribs).map(name => ({
      name,
      value: this.attribs[name]
    }));
  },
  configurable: true,
  enumerable: false
});

describe("Generator", () => {
  test("parseDOM", () => {
    const dom = parseDOM("<a foo><b><c><?foo>Yay!")
    generator(dom)
    expect(dom).toMatchSnapshot()
  })
})