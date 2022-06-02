import { AssetDetail } from 'ui/services/Background';
import { fetchAll as fetchAllSignArts } from 'nfts/signArt/utils';
import { fetchAll as fetchAllDucks } from 'nfts/ducks/utils';
import { fetchAll as fetchAllDucklings } from 'nfts/ducklings/utils';

import { signArtDApp } from 'nfts/signArt/constants';
import { ducksDApps } from 'nfts/ducks/constants';
import { ducklingsDApp } from 'nfts/ducklings/constants';
import { ducksArtefactsDApp } from 'nfts/duckArtifacts/constants';
import { fetchAll as fetchAllArtefacts } from 'nfts/duckArtifacts/utils';
import { NftDetails, NftInfo, NftVendor } from 'nfts/index';
import { Duckling } from 'nfts/ducklings';
import { Duck } from 'nfts/ducks';
import { SignArt } from 'nfts/signArt';
import { DucksArtefact } from 'nfts/duckArtifacts';
import { Unknown } from 'nfts/unknown';

export type Nft = ReturnType<typeof createNft>;

export function createNft(asset: AssetDetail, info: NftInfo) {
  if (!asset) {
    return null;
  }

  switch (info?.vendor) {
    case NftVendor.Ducklings:
      return new Duckling(asset, info);
    case NftVendor.Ducks:
      return new Duck(asset, info);
    case NftVendor.DucksArtefact:
      return new DucksArtefact(asset, info);
    case NftVendor.SignArt:
      return new SignArt(asset, info);
    default:
      return new Unknown(asset);
  }
}

export function nftType(nft: AssetDetail): NftVendor {
  if (!nft) {
    return null;
  }
  if (nft?.issuer === signArtDApp) {
    return NftVendor.SignArt;
  }
  if (ducksDApps.includes(nft?.issuer)) {
    return NftVendor.Ducks;
  }

  if (nft?.issuer === ducklingsDApp) {
    return NftVendor.Ducklings;
  }

  if (nft?.issuer === ducksArtefactsDApp) {
    return NftVendor.DucksArtefact;
  }

  return NftVendor.Unknown;
}

export async function fetchAllNfts(
  nfts: NftDetails[]
): Promise<Array<NftInfo>> {
  const ducks = [];
  const babyDucks = [];
  const ducksArtefacts = [];
  const signArts = [];

  for (const nft of nfts) {
    switch (this.nftType(nft)) {
      case NftVendor.Ducks:
        ducks.push(nft);
        break;
      case NftVendor.Ducklings:
        babyDucks.push(nft);
        break;
      case NftVendor.DucksArtefact:
        ducksArtefacts.push(nft);
        break;
      case NftVendor.SignArt:
        signArts.push(nft);
        break;
    }
  }

  return Array.prototype.flat.call(
    await Promise.all([
      fetchAllSignArts(signArts).catch(() => []),
      fetchAllDucks(ducks).catch(() => []),
      fetchAllArtefacts(ducksArtefacts).catch(() => []),
      fetchAllDucklings(babyDucks).catch(() => []),
    ])
  );
}

export function capitalize(str: string): string {
  if (!str) {
    return str;
  }

  return str.charAt(0).toUpperCase() + str.slice(1);
}
