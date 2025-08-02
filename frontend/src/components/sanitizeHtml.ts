export function sanitizeHtml(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const ALLOWED_TAGS = ['b', 'i', 'u', 'strong', 'em', 'p', 'br'];
  const ALLOWED_ATTRS: { [key: string]: string[] } = {
    'a': ['href'],
    'img': ['src', 'alt'],
  };

  function sanitizeElement(el: Element) {
    // Remove disallowed tags
    if (!ALLOWED_TAGS.includes(el.tagName.toLowerCase()) &&
        !(el.tagName.toLowerCase() in ALLOWED_ATTRS)) {
      el.remove();
      return;
    }

    // Remove dangerous attributes
    [...el.attributes].forEach(attr => {
      const tag = el.tagName.toLowerCase();
      const name = attr.name.toLowerCase();

      const allowed = ALLOWED_ATTRS[tag] || [];
      if (!allowed.includes(name)) {
        el.removeAttribute(attr.name);
      }
      if (name.startsWith('on')) {
        el.removeAttribute(attr.name); // Remove event handlers like onerror, onclick
      }
    });

    // Recurse into children
    [...el.children].forEach(sanitizeElement);
  }

  [...doc.body.children].forEach(sanitizeElement);
  return doc.body.innerHTML;
}
