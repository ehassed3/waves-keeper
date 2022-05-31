import { AssetDetail } from 'ui/services/Background';
import * as React from 'react';
import { NftCard, NftCover, NftFooter } from 'nfts/nftCard';
import { ipfsUrl } from 'nfts/signArt/constants';
import { useAppSelector } from 'ui/store';
import { NFT } from 'nfts/utils';
import * as styles from 'nfts/nftCard.module.css';

export function SignArtCard({
  nft,
  onInfoClick,
  mode = 'name',
}: {
  nft: AssetDetail;
  mode: 'name' | 'creator';
  onInfoClick: (assetId: string) => void;
  onSendClick: (assetId: string) => void;
}) {
  const nfts = useAppSelector(state => state.nfts);
  const nftInfo = nfts[nft.id]?.vendor === NFT.SignArt ? nfts[nft.id] : null;
  const count =
    mode === 'creator'
      ? Object.values(nfts).filter(nft => nft.creator === nftInfo?.creator)
          .length
      : 0;

  return (
    <NftCard>
      <NftCover
        src={nftInfo && ipfsUrl + nftInfo.fgImage}
        isVideo={nftInfo?.isVideo}
        onClick={() => onInfoClick(nft.id)}
      />
      <NftFooter>
        {mode === 'name' && <div className={styles.title}>{nftInfo?.name}</div>}
        {mode === 'creator' && (
          <>
            <div className={styles.title}>{nftInfo?.creator}</div>
            <div>{count}</div>
          </>
        )}
      </NftFooter>
    </NftCard>
  );
}
