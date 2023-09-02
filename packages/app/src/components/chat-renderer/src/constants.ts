export enum AuthorType {
  Normal = 0,
  Member,
  Admin,
  Owner,
}

export const AUTHOR_TYPE_NORMAL = AuthorType.Normal
export const AUTHOR_TYPE_MEMBER = AuthorType.Member
export const AUTHOR_TYPE_ADMIN = AuthorType.Admin
export const AUTHOR_TYPE_OWNER = AuthorType.Owner
export const AUTHRO_TYPE_NORMAL = AUTHOR_TYPE_NORMAL
export const AUTHRO_TYPE_MEMBER = AUTHOR_TYPE_MEMBER
export const AUTHRO_TYPE_ADMIN = AUTHOR_TYPE_ADMIN
export const AUTHRO_TYPE_OWNER = AUTHOR_TYPE_OWNER

export const AUTHOR_TYPE_TO_TEXT = [
  '',
  'member', // 舰队
  'moderator', // 房管
  'owner', // 主播
]

export const GUARD_LEVEL_TO_TEXT_KEY = [
  '',
  'chat.guardLevel1',
  'chat.guardLevel2',
  'chat.guardLevel3',
]

export const MESSAGE_TYPE_TEXT = 0
export const MESSAGE_TYPE_GIFT = 1
export const MESSAGE_TYPE_MEMBER = 2
export const MESSAGE_TYPE_SUPER_CHAT = 3
export const MESSAGE_TYPE_DEL = 4
export const MESSAGE_TYPE_UPDATE = 5

export const CONTENT_TYPE_TEXT = 0
export const CONTENT_TYPE_IMAGE = 1

// 美元 -> 人民币 汇率
const EXCHANGE_RATE = 7
export const PRICE_CONFIGS = [
  { // $100红
    price: 100 * EXCHANGE_RATE,
    colors: {
      contentBg: 'rgba(230,33,23,1)',
      headerBg: 'rgba(208,0,0,1)',
      header: 'rgba(255,255,255,1)',
      authorName: 'rgba(255,255,255,0.701961)',
      time: 'rgba(255,255,255,0.501961)',
      content: 'rgba(255,255,255,1)',
    },
    pinTime: 60,
  },
  { // $50品红
    price: 50 * EXCHANGE_RATE,
    colors: {
      contentBg: 'rgba(233,30,99,1)',
      headerBg: 'rgba(194,24,91,1)',
      header: 'rgba(255,255,255,1)',
      authorName: 'rgba(255,255,255,0.701961)',
      time: 'rgba(255,255,255,0.501961)',
      content: 'rgba(255,255,255,1)',
    },
    pinTime: 30,
  },
  { // $20橙
    price: 20 * EXCHANGE_RATE,
    colors: {
      contentBg: 'rgba(245,124,0,1)',
      headerBg: 'rgba(230,81,0,1)',
      header: 'rgba(255,255,255,0.87451)',
      authorName: 'rgba(255,255,255,0.701961)',
      time: 'rgba(255,255,255,0.501961)',
      content: 'rgba(255,255,255,0.87451)',
    },
    pinTime: 10,
  },
  { // $10黄
    price: 10 * EXCHANGE_RATE,
    colors: {
      contentBg: 'rgba(255,202,40,1)',
      headerBg: 'rgba(255,179,0,1)',
      header: 'rgba(0,0,0,0.87451)',
      authorName: 'rgba(0,0,0,0.541176)',
      time: 'rgba(0,0,0,0.501961)',
      content: 'rgba(0,0,0,0.87451)',
    },
    pinTime: 5,
  },
  { // $5绿
    price: 5 * EXCHANGE_RATE,
    colors: {
      contentBg: 'rgba(29,233,182,1)',
      headerBg: 'rgba(0,191,165,1)',
      header: 'rgba(0,0,0,1)',
      authorName: 'rgba(0,0,0,0.541176)',
      time: 'rgba(0,0,0,0.501961)',
      content: 'rgba(0,0,0,1)',
    },
    pinTime: 2,
  },
  { // $2浅蓝
    price: 2 * EXCHANGE_RATE,
    colors: {
      contentBg: 'rgba(0,229,255,1)',
      headerBg: 'rgba(0,184,212,1)',
      header: 'rgba(0,0,0,1)',
      authorName: 'rgba(0,0,0,0.701961)',
      time: 'rgba(0,0,0,0.501961)',
      content: 'rgba(0,0,0,1)',
    },
    pinTime: 0,
  },
  { // $1蓝
    price: EXCHANGE_RATE,
    colors: {
      contentBg: 'rgba(30,136,229,1)',
      headerBg: 'rgba(21,101,192,1)',
      header: 'rgba(255,255,255,1)',
      authorName: 'rgba(255,255,255,0.701961)',
      time: 'rgba(255,255,255,0.501961)',
      content: 'rgba(255,255,255,1)',
    },
    pinTime: 0,
  },
]
