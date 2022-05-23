import * as React from 'react';
import { AssetDetail } from 'ui/services/Background';
import * as styles from './nftDuck.module.css';
import { NftCard } from './nftCard';
import cn from 'classnames';

const duckColors = {
  B: 'ADD8E6',
  R: 'FFA07A',
  Y: 'F8EE9D',
  G: 'D9F6B3',
  U: 'CD6F86',
};

const duckGenerationNames = {
  H: 'Hero',
  I: 'Ideal',
  J: 'Jackpot',
  K: 'Knight',
  L: 'Lord',
  M: 'Magical',
  N: 'Natural',
  O: 'Obstinate',
  G: 'Genesis',
};

const Ducks = {
  AAAAAAAA: { name: 'Elon' },
  BBBBBBBB: { name: 'Satoshi' },
  CCCCCCCC: { name: 'Doge' },
  DDDDDDDD: { name: 'Bogdanoff' },
  EEEEEEEE: { name: 'Chad' },
  FFFFFFFF: { name: 'Harold' },
  GGGGGGGG: { name: 'Pepe' },
  HHHHHHHH: { name: 'El Risitas' },
  IIIIIIII: { name: 'Druck' },
  KKKKKKKK: { name: 'Drama Queen' },
  WWWWWWWW: { name: 'Sasha', unique: true },
  WWWWWWWP: { name: 'Phoenix', unique: true },
  WWWWWWW1: { name: 'Joel Bad Crypto', unique: true },
  WWWWWWW2: { name: 'Travis Bad Crypto', unique: true },
  WWWWWWWM: { name: 'Mani', unique: true },
  WWWWWWWS: { name: 'Swop Punk', unique: true },
  WWWWWWWF: { name: 'Forklog', unique: true },
  WWWWSXSR: { name: 'Spencer X', unique: true },
  WWWWWSX2: { name: 'BABY BOOMER', unique: true },
  WWWWWSX3: { name: 'Spencer Z', unique: true },
  WWWWWSX4: { name: 'Spencer Y', unique: true },
  WWWWLUCK: { name: 'LUCK & WISDOM', unique: true },
  WWWWWYAN: { name: 'Petr Yan', unique: true },
  WWWWHELL: { name: 'Deaduck', unique: true },
  WWWSQUID: { name: 'DuckSquid', unique: true },
  WWWNACHO: { name: 'Nacho', unique: true },
  WWWWWASH: { name: 'Punk Ash', unique: true },
  WWWWVOVA: { name: 'Vladimir Zhuravlev', unique: true },
  WWWWRIKY: { name: 'Riky', unique: true },
  WWTURTLE: { name: 'Black Turtle', unique: true },
  WWSPORTY: { name: 'Sporty Duck', unique: true },
  WWWWANNA: { name: 'Anna Nifontova ', unique: true },
  WWWIGNAT: { name: 'Ignat Golovatyuk', unique: true },
  WWWWBALL: { name: 'Quarterduck', unique: true },
  WWWCUPID: { name: 'Cupiduck', unique: true },
  WWWDAISY: { name: 'Daisy', unique: true },
  WWWWMARG: { name: 'Margaret Hamilton', unique: true },
  WWZETKIN: { name: 'Clara Zetkin', unique: true },
  WWJOSEPH: { name: 'Joseph Madara', unique: true },
  WWWDASHA: { name: 'Dasha The Queen ❤️', unique: true },
  WAWWDIMA: { name: 'Dima Ivanov', unique: true },
  WWWAVTWO: { name: 'Muscle Doge', unique: true },
  WWWBVTWO: { name: 'Muscle Doge', unique: true },
  WWWCVTWO: { name: 'Muscle Doge', unique: true },
  WWWDVTWO: { name: 'Muscle Doge', unique: true },
  WWWEVTWO: { name: 'Muscle Doge', unique: true },
  WWWFVTWO: { name: 'Muscle Doge', unique: true },
  WWWGVTWO: { name: 'Muscle Doge', unique: true },
  WWWHVTWO: { name: 'Muscle Doge', unique: true },
  WWWIVTWO: { name: 'Muscle Doge', unique: true },
  WWWJVTWO: { name: 'Muscle Doge', unique: true },
  WWAMAHER: { name: 'Maher Coleman', unique: true },
  WWBMAHER: { name: 'Maher Coleman', unique: true },
  WWCMAHER: { name: 'Maher Coleman', unique: true },
  WWDMAHER: { name: 'Maher Coleman', unique: true },
  WWEMAHER: { name: 'Maher Coleman', unique: true },
  WWFMAHER: { name: 'Maher Coleman', unique: true },
  WWGMAHER: { name: 'Maher Coleman', unique: true },
  WWHMAHER: { name: 'Maher Coleman', unique: true },
  WWIMAHER: { name: 'Maher Coleman', unique: true },
  WWPUZZLE: { name: 'Puzzle Duck', unique: true },
  A: ['e', 'l', 'o', 'n', 'n', 'o', 'l', 'e'],
  B: ['s', 'a', 't', 'o', 's', 'h', 'i', 't'],
  C: ['d', 'o', 'g', 'e', 'e', 'g', 'o', 'd'],
  D: ['b', 'o', 'g', 'd', 'a', 'n', 'o', 'f'],
  E: ['c', 'h', 'a', 'd', 'a', 'd', 'c', 'h'],
  F: ['h', 'a', 'r', 'o', 'l', 'd', '', ''],
  G: ['p', 'e', 'p', 'e', 'p', 'e', 'p', 'e'],
  H: ['e', 'l', ' ', 'r', 'i', 's', 'i', 'tas'],
  I: ['d', 'r', 'u', 'c', 'k', 'j', 'e', 'nya'],
  K: ['dr', 'a', 'm', 'a', ' ', 'q', 'ue', 'en'],
  S: ['Cool '],
  T: ['Xmax '],
  W: ['S', 'a', 's', 'h', 'a', 'g', 'o', 'd'],
};

function generateName(genotype: string): string {
  const name = genotype
    .split('')
    .map((gene, index) => Ducks[gene]?.[index])
    .join('')
    .toLowerCase();
  return name.charAt(0).toUpperCase() + name.substring(1, name.length);
}

export function NftDuck({
  nft,
  onInfoClick,
}: {
  nft: AssetDetail;
  onInfoClick: (assetId: string) => void;
  onSendClick: (assetId: string) => void;
}) {
  const [isLoading, setLoading] = React.useState(true);

  const [, genoType, generationColor] = nft.name.split('-');
  // const generation = generationColor[0];
  // const generationName = duckGenerationNames[generation] ?? generation;
  const duckName = Ducks[genoType]
    ? Ducks[genoType].name
    : generateName(genoType);
  const color = generationColor[1];

  const backgroundColor = `#${duckColors[color]}`;
  const imageUrl = `https://wavesducks.com/api/v1/ducks/${genoType}.svg?color=${color}`;

  const backgroundImage =
    genoType === 'WWWWLUCK' &&
    'url("https://wavesducks.com/ducks/pokras-background.svg")';

  return (
    <NftCard>
      <img
        src={imageUrl}
        className={cn(styles.cover, isLoading && 'skeleton-glow')}
        style={{
          backgroundImage,
          backgroundColor,
        }}
        onLoad={() => setLoading(false)}
        onClick={() => onInfoClick(nft.id)}
      />
      <div className={styles.footer}>{duckName}</div>
    </NftCard>
  );
}
