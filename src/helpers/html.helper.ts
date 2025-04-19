import sanitizeHtml from 'sanitize-html';

export function safelySetHtml(html: string) {
  return (
    sanitizeHtml(html, {
      allowedTags: [
        'h3',
        'h4',
        'h5',
        'h6',
        'blockquote',
        'p',
        'a',
        'ul',
        'ol',
        'nl',
        'li',
        'b',
        'i',
        'strong',
        'em',
        'strike',
        'code',
        'hr',
        'br',
        'div',
        'table',
        'thead',
        'caption',
        'tbody',
        'tr',
        'th',
        'td',
        'pre',
      ],
      transformTags: {
        // eslint-disable-next-line
        a: function extraTag(tagName: string, attrs: Object): any {
          return {
            tagName,
            attribs: {
              ...attrs,
              target: '_blank',
            },
          };
        },
      },
    }) || ''
  );
}
