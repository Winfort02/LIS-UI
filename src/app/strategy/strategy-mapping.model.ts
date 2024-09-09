import { inject } from '@angular/core';
import { IStrategyMapping } from './strategy-mapping.interface';
import { CommonService } from '../services/common.service';
import { CommonPropertyMapping } from '../interfaces/CommonMapping';

export class StrategyMapping<T extends CommonPropertyMapping>
  implements IStrategyMapping<T>
{
  commonService = inject(CommonService);

  createdAtMapping(data: T[]): T[] {
    return data.map((data: T) => ({
      ...data,
      createdAt: this.commonService.dateFormmater(data.createdAt as Date),
    }));
  }

  dobMapping(data: T[]): T[] {
    return data.map((data: T) => ({
      ...data,
      createdAt: this.commonService.dateFormmater(data.createdAt as Date),
      date_of_birth: this.commonService.dobFormat(
        data.date_of_birth as Date
      ),
    }));
  }

  dobSingleMapping(data: T): T {
    return {
      ...data,
      createdAt: this.commonService.dateFormmater(data.createdAt as Date),
      date_of_birth: this.commonService.dobFormat(
        data.date_of_birth as Date
      ),
    };
  }

  singleMapping(data: T): T {
    return {
      ...data,
      createdAt: this.commonService.dateFormmater(data.createdAt as Date),
    };
  }
}
