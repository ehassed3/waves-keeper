import { BaseInfo, BaseNft, NftVendor } from 'nfts/index';
import { capitalize } from 'nfts/utils';
import {
  DucklingAdjectives,
  ducklingsApiUrl,
  DucklingsDescription,
} from 'nfts/ducklings/constants';

export interface DucklingInfo extends BaseInfo {
  vendor: NftVendor.Ducklings;
  growthLevel: number;
}

export class Duckling extends BaseNft<DucklingInfo> {
  private get adj(): string {
    const indexes = [16, 10, 1, 9, 9, 7];
    const adjNumber = indexes.reduce(
      (acc, index) => acc + this.id.charCodeAt(index),
      0
    );

    return DucklingAdjectives[adjNumber % DucklingAdjectives.length];
  }

  private get name_(): string {
    const indexes2 = [10, 4, 2, 0, 2, 1];
    const nameNumber = indexes2.reduce(
      (acc, index) => acc + this.id.charCodeAt(index),
      0
    );
    const ducklingNames = Object.keys(DucklingsDescription);
    return ducklingNames[nameNumber % ducklingNames.length];
  }

  get displayCreator(): string {
    return 'Ducklings';
  }

  get displayName(): string {
    return `${capitalize(this.adj)} ${capitalize(this.name_)}`;
  }

  get marketplaceUrl(): string {
    return `https://wavesducks.com/duckling/${this.id}`;
  }

  get description(): string {
    return DucklingsDescription[this.name_];
  }

  get foreground() {
    let fileIndex = Math.trunc(this.info.growthLevel / 25);
    fileIndex = fileIndex < 4 ? fileIndex : 3;
    return ducklingsApiUrl + `duckling-${fileIndex}.svg`;
  }
}
