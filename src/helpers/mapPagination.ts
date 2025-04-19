import pick from 'lodash/pick';

export default function mapPagination(data: object) {
  return pick(data, ['totalItem', 'page', 'pageSize', 'totalPage']);
}
