interface IPaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

interface IPaginationLinks {
  first: string;
  previous: string;
  next: string;
  last: string;
}

interface IPaginationOptions {
  page: number;
  limit: number;
  route: string;
}

interface Pagination<T> {
  items: T[];
  meta: IPaginationMeta;
  links: IPaginationLinks;
}

export { IPaginationMeta, IPaginationLinks, IPaginationOptions, Pagination };
