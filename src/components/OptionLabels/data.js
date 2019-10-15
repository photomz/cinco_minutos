import spanishdict from '../../assets/images/spanishdict.png';
import wordreference from '../../assets/images/wordreference.png';
import nanoid from 'nanoid/non-secure';
export default {
  actionableLabels: [
    { name: 'Verb Check', toggleableAction: 'verbCheck', icon: 'pencil', key: nanoid() },
    {
      name: 'Add To Collection',
      toggleableAction: 'addingCollection',
      icon: 'list',
      key: nanoid(),
    },
  ],
  externalRedirects: [
    {
      name: 'SpanishDict',
      prefix: 'https://www.spanishdict.com/conjugate/',
      postfix: '',
      src: spanishdict,
      key: nanoid(),
    },
    {
      name: 'WordReference',
      prefix: 'https://www.wordreference.com/es/en/translation.asp?spen=',
      postfix: '',
      src: wordreference,
      key: nanoid(),
    },
  ],
};
