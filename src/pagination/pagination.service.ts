import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  FindManyOptions,
  FindOptions,
  FindOptionsWhere,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import {
  IPaginationLinks,
  IPaginationMeta,
  IPaginationOptions,
  Pagination,
} from './interfaces/pagination.interfaces';

@Injectable()
export class PaginationService {
  constructor(private configService: ConfigService) {}

  async paginate<TEntity>(
    repository: Repository<TEntity>,
    options: IPaginationOptions & {
      where?: FindOptionsWhere<TEntity> | FindOptionsWhere<TEntity>[];
    },
  ): Promise<Pagination<TEntity>> {
    const { page, limit, route, where } = options;

    const queryBuilder = repository.createQueryBuilder('entity');

    if (where) {
      this.applyWhereConditions(queryBuilder, where);
    }

    const [items, total] = await queryBuilder
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    const paginationMeta: IPaginationMeta = {
      totalItems: total,
      itemCount: items.length,
      itemsPerPage: limit,
      totalPages,
      currentPage: page,
    };

    const baseUrl = this.configService.get('API_BASE_URL');

    const paginationLinks: IPaginationLinks = this.createPaginationLinks({
      baseUrl,
      route,
      limit,
      page,
      totalPages,
    });

    return {
      items,
      meta: paginationMeta,
      links: paginationLinks,
    };
  }

  applyWhereConditions<Entity>(
    queryBuilder: SelectQueryBuilder<Entity>,
    conditions: FindOptions<Entity> | FindManyOptions<Entity>['where'] = {},
  ): void {
    if (Array.isArray(conditions)) {
      conditions.forEach((condition) => {
        Object.entries(condition).forEach(([key, value]) => {
          if (value !== undefined) {
            queryBuilder.andWhere(`${queryBuilder.alias}.${key} = :${key}`, {
              [key]: value,
            });
          }
        });
      });
    } else {
      Object.entries(conditions).forEach(([key, value]) => {
        if (value !== undefined) {
          queryBuilder.andWhere(`${queryBuilder.alias}.${key} = :${key}`, {
            [key]: value,
          });
        }
      });
    }
  }

  createPaginationLinks({ baseUrl, route, limit, page, totalPages }) {
    const first = `${baseUrl}/${route}?page=1&limit=${limit}`;

    const previous =
      page > 1 ? `${baseUrl}/${route}?page=${page - 1}&limit=${limit}` : '';

    const next =
      page < totalPages
        ? `${baseUrl}/${route}?page=${page + 1}&limit=${limit}`
        : '';

    const last = `${baseUrl}/${route}?page=${totalPages}&limit=${limit}`;

    return {
      first,
      previous,
      next,
      last,
    };
  }
}
