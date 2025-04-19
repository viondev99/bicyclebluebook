/* eslint-disable no-new-func */
import _get from 'lodash/get';

import defaultLanguage from '../lang/en.json';

function render(template: string, args: Object) {
  return new Function(...[...Object.keys(args), `return \`${template}\``])(...(Object as any).values(args));
}

export default function t(path: string | string[], params?: any) {
  const res = _get(defaultLanguage, path);
  if (res) {
    if (params) {
      return render(res, params);
    }
    return res;
  }
  console.error(`cannot find path \`${path}\` for language en`);
  return `en.${path}`;
}
