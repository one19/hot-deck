// import { css } from '@emotion/css';

const failureBackground = `
  background-color: #c0ffee;
  background-image: url('data:image/svg+xml,\
  <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">\
  <text x="5"  y="12" font-family="Arial" font-size="10" fill="palegoldenrod" fill-opacity="1">🐛</text>\
  <text x="30" y="37" font-family="Arial" font-size="10" fill="palegoldenrod" fill-opacity="1">🐛</text>\
  <text x="55" y="62" font-family="Arial" font-size="10" fill="palegoldenrod" fill-opacity="1">🐛</text>\
  <text x="80" y="86" font-family="Arial" font-size="10" fill="palegoldenrod" fill-opacity="1">🐛</text>\
  <text x="5" y="63" font-family="Arial" font-size="10" fill="palegoldenrod" fill-opacity="1">🐛</text>\
  <text x="30" y="87" font-family="Arial" font-size="10" fill="palegoldenrod" fill-opacity="1">🐛</text>\
  <text x="55" y="11" font-family="Arial" font-size="10" fill="palegoldenrod" fill-opacity="1">🐛</text>\
  <text x="80" y="37" font-family="Arial" font-size="12" fill="palegoldenrod" fill-opacity="1">🐛</text>\
</svg>');
  background-size: 100px 100px;
  background-repeat: repeat;
`;

const rawResources = `
  background-color: #666;
  background-image: url('data:image/svg+xml,\
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="-50 -50 250 250">\
<polygon points="50,0 75,25 50,50 25,25" fill="black" fill-opacity="0.2"/>\
<polygon points="50,60 75,85 50,110 25,85" fill="black" fill-opacity="0.2"/>\
<polygon points="-5,55 20,30 45,55 20,80" fill="black" fill-opacity="0.2"/>\
<polygon points="105,55 80,30 55,55 80,80" fill="black" fill-opacity="0.2"/>\
</svg>');
  background-size: 25px 25px;
`;

/*
/ if you need to adjust the characters again on the diagonals:
      <path d="M0,0 L100,100" stroke="black" stroke-width="1"/>\
      <path d="M50,0 L100,50" stroke="black" stroke-width="1"/>\
      <path d="M0,50 L50,100" stroke="black" stroke-width="1"/>\
      <rect x="0" y="0" width="100%" height="100%" fill="none" stroke="black" stroke-width="1"/>\
*/
const money = `
  background-color: #d4af37;
  background-image: url('data:image/svg+xml,\
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">\
    <text x="5"  y="12" font-family="Arial" font-size="10" fill="palegoldenrod" fill-opacity="0.3">$</text>\
    <text x="30" y="37" font-family="Arial" font-size="10" fill="palegoldenrod" fill-opacity="0.3">€</text>\
    <text x="55" y="62" font-family="Arial" font-size="10" fill="palegoldenrod" fill-opacity="0.3">¥</text>\
    <text x="80" y="86" font-family="Arial" font-size="10" fill="palegoldenrod" fill-opacity="0.3">£</text>\
    <text x="5" y="63" font-family="Arial" font-size="10" fill="palegoldenrod" fill-opacity="0.3">₹</text>\
    <text x="30" y="87" font-family="Arial" font-size="10" fill="palegoldenrod" fill-opacity="0.3">฿</text>\
    <text x="55" y="11" font-family="Arial" font-size="10" fill="palegoldenrod" fill-opacity="0.3">₽</text>\
    <text x="80" y="37" font-family="Arial" font-size="12" fill="palegoldenrod" fill-opacity="0.3">₫</text>\
  </svg>');
  background-size: 100px 100px;
  background-repeat: repeat;
`;

const buildings = `
  background-color: #e5e5f7;
  background-image: linear-gradient(
      30deg,
      #b7b7b7 12%,
      transparent 12.5%,
      transparent 87%,
      #b7b7b7 87.5%,
      #b7b7b7
    ),
    linear-gradient(150deg, #b7b7b7 12%, transparent 12.5%, transparent 87%, #b7b7b7 87.5%, #b7b7b7),
    linear-gradient(30deg, #b7b7b7 12%, transparent 12.5%, transparent 87%, #b7b7b7 87.5%, #b7b7b7),
    linear-gradient(150deg, #b7b7b7 12%, transparent 12.5%, transparent 87%, #b7b7b7 87.5%, #b7b7b7),
    linear-gradient(
      60deg,
      #b7b7b777 25%,
      transparent 25.5%,
      transparent 75%,
      #b7b7b777 75%,
      #b7b7b777
    ),
    linear-gradient(
      60deg,
      #b7b7b777 25%,
      transparent 25.5%,
      transparent 75%,
      #b7b7b777 75%,
      #b7b7b777
    );
  background-size: 14px 25px;
  background-position:
    0 0,
    0 0,
    7px 12px,
    7px 12px,
    0 0,
    7px 12px;
`;

const actionBackground = `
  background-color: #32CD32; /* Lime green base */
  background-image: linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.2) 25%, rgba(255,255,255,0.2) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.2) 75%, rgba(255,255,255,0.2)),
                    linear-gradient(45deg, transparent 25%, rgba(0,0,0,0.2) 25%, rgba(0,0,0,0.2) 50%, transparent 50%, transparent 75%, rgba(0,0,0,0.2) 75%, rgba(0,0,0,0.2));
  background-size: 60px 60px;
  background-position: 0 0, 30px 30px;

  &::before {
    content: "";
    position: absolute;
    inset: 4px;
    border-radius: 4px;
    background:
      repeating-radial-gradient(#000 0 0.0001%,#fff 0 0.0002%)
      60% 60%/3000px 3000px,
      repeating-conic-gradient(#000 0 0.0001%,#fff 0 0.0002%)
      40% 40%/4000px 3000px;
    background-blend-mode: difference;
    filter: blur(2px) contrast(100) brightness(40);
    mix-blend-mode: lighten;
    opacity: 0.1;
  }
`;

type Props = { variant?: string };
export const getBackground = ({ variant = '' }: Props) =>
  ({ rawResources, money, buildings, actionBackground })[variant] || failureBackground;
