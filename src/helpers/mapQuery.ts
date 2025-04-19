import get from 'lodash/get';

export default function mapQuery(query: object) {
  return {
    ...query,
    page: get(query, 'page', 1),
    pageSize: get(query, 'pageSize', 20),
  };
}

export function transformSearchToQuery<P = any>(conditions: P) {
  let searchString = '';
  let queryParamsCount = 1;
  Object.keys(conditions).forEach((key, index, arr) => {
    const value = conditions[key as keyof P];

    if (value) {
      if (queryParamsCount !== 1) {
        searchString += ';';
      }
      searchString += `${key}:${value}`;
      queryParamsCount += 1;
    }
  });

  return searchString;
}
