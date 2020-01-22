export function setMeta (p: {
  tagName?: string
  name?: string
  property?: string
  content: string
}) {
  if (p.tagName) {
    let el = document.head.getElementsByTagName(p.tagName)[0]
    if (!el) {
      el = document.createElement(p.tagName)
      document.head.append(el)
    }
    (el as any).innerText = p.content
  } else {
    let el: HTMLMetaElement | null = null
    if (p.name) {
      el = document.head.querySelector(`meta[name="${p.name}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.name = p.name
        document.head.append(el)
      }
    } else if (p.property) {
      el = document.head.querySelector(`meta[property="${p.property}"]`)
      if (!el) {
        el = document.createElement('meta');
        (el as any).property = p.property
        document.head.append(el)
      }
    }

    if (el) {
      el.content = p.content
    }
  }
}