import sanitizeHtmlLib from 'sanitize-html';

/**
 * Sanitize rich-text HTML coming from the admin editor before it is stored and
 * later rendered with dangerouslySetInnerHTML on the public site. This is the
 * primary defense against stored XSS.
 */
export function sanitizeRichText(dirty = '') {
  return sanitizeHtmlLib(String(dirty), {
    allowedTags: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr', 'span', 'div',
      'strong', 'b', 'em', 'i', 'u', 's', 'blockquote', 'code', 'pre',
      'ul', 'ol', 'li',
      'a', 'img',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
    ],
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height'],
      span: ['style'],
      '*': ['class'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    // Only allow safe inline styles.
    allowedStyles: {
      '*': {
        'text-align': [/^left$/, /^right$/, /^center$/, /^justify$/],
        'color': [/^#(0x)?[0-9a-f]+$/i, /^rgb\(/i],
      },
    },
    transformTags: {
      // Force external links to be safe.
      a: (tagName, attribs) => {
        const out = { ...attribs };
        if (out.target === '_blank') out.rel = 'noopener noreferrer';
        return { tagName, attribs: out };
      },
    },
  });
}

export default sanitizeRichText;
