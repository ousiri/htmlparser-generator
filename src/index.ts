
// import { parseDOM } from 'htmlparser2'
import { Node, DataNode, Element, NodeWithChildren } from 'domhandler'
import * as entities from 'entities'

const selfCloseTagMap = new Map([
  ['area', true],
  ['base', true],
  ['br', true],
  ['col', true],
  ['embed', true],
  ['hr', true],
  ['img', true],
  ['input', true],
  ['link', true],
  ['meta', true],
  ['param', true],
  ['source', true],
  ['track', true],
  ['wbr', true],
  ['command', true],
  ['keygen', true],
  ['menuitem', true],
])

export interface GeneratorOptions {
  disableAttrEscape?: boolean
  dumpEmptyAttri?: boolean
  beforeEach?: (node: Node, parent: NodeWithChildren | null) => Node
}

const defaultOptions: GeneratorOptions = {
  disableAttrEscape: false,
  dumpEmptyAttri: false,
  beforeEach: undefined,
}

function escapeAttr(attr: string, disableAttrEscape: boolean = false) {
  if (!attr) return attr
  return disableAttrEscape ? attr : entities.escape(attr)
}

function dfs(node: Node[] | Node, options: GeneratorOptions): string {
  if (Array.isArray(node)) {
    return node.map(n => dfs(n, options)).join('')
  }
  if (options.beforeEach) {
    node = options.beforeEach(node, node.parent)
  }
  const dataNode = node as DataNode
  const el = node as Element
  // console.log(node)
  if (el.type === 'text') {
    return dataNode.data
  } /* else if(el.type === 'doctype') { // couldn't find doctype example
    return ''
  } */ else if (el.type === 'cdata') {
    return `<![CDATA[${dfs(el.children, options)}]]>`
  } else if (el.type === 'directive') {
    return `<${dataNode.data}>`
  } else if (el.type === 'comment') {
    return `<!--${dataNode.data}-->`
  } else if (['style', 'script', 'tag'].includes(el.type)) {
    let ans = '<' + el.name
    if (el.attribs && Object.keys(el.attribs).length) {
      ans += ' ' + Object.keys(el.attribs).map(key => {
        const val = el.attribs[key]
        return key + (options.dumpEmptyAttri && !val ? '' : `="${escapeAttr(val, options.disableAttrEscape)}"`)
      }).join(' ')
    }
    if (el.children?.length) {
      ans += '>' + dfs(el.children, options) + `</${el.name}>`
    } else {
      if (selfCloseTagMap.has(el.name)) {
        ans += '/>'
      } else {
        ans += `></${el.name}>`
      }
    }
    return ans
  }
  return ''
}

function generator(dom: Node[], userOptions: GeneratorOptions = {}): string {
  const options: GeneratorOptions = { ...defaultOptions, ...userOptions }
  return dfs(dom, options)
}

export default generator

// export default generator

// console.log(generator(parseDOM("<a foo><b><c><?foo>Yay!")))

// console.log(generator(parseDOM(`<!doctype html><html><body></body></html>`)))

// console.log(generator(parseDOM(`<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd"><html><head></head><body></body></html>`)))
// console.log(generator(parseDOM(`<![CDATA[<sender>John Smith</sender>]]>`, { recognizeCDATA: true, xmlMode: true })))

// console.log(generator(parseDOM(
//   `<!DOCTYPE html><html><title>The Title</title><body>Hello world</body></html>`
// )))

// javascript:alert(&#39;Haello&#39;);

// console.log(generator(parseDOM('<__proto__>')))
// console.log(generator(parseDOM("<p><script type=\"text/template\"><h1>Heading1</h1></script></p>")))