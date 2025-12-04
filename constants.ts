import { Unit } from './types';

export const CURRICULUM: Unit[] = [
  {
    id: 'unit-1',
    number: 1,
    title: 'Tôi và các bạn',
    theme: 'Truyện đồng thoại',
    lessons: [
      {
        id: 'u1-l1',
        title: 'Bài học đường đời đầu tiên',
        description: 'Trích "Dế Mèn phiêu lưu ký" - Tô Hoài',
        topic: 'Truyện đồng thoại',
        texts: ['Bài học đường đời đầu tiên']
      },
      {
        id: 'u1-l2',
        title: 'Nếu cậu muốn có một người bạn',
        description: 'Trích "Hoàng tử bé" - Antoine de Saint-Exupéry',
        topic: 'Truyện đồng thoại',
        texts: ['Nếu cậu muốn có một người bạn']
      }
    ]
  },
  {
    id: 'unit-2',
    number: 2,
    title: 'Gõ cửa trái tim',
    theme: 'Thơ',
    lessons: [
      {
        id: 'u2-l1',
        title: 'Chuyện cổ tích về loài người',
        description: 'Thơ - Xuân Quỳnh',
        topic: 'Thơ',
        texts: ['Chuyện cổ tích về loài người']
      },
      {
        id: 'u2-l2',
        title: 'Mây và sóng',
        description: 'Thơ - Rabindranath Tagore',
        topic: 'Thơ',
        texts: ['Mây và sóng']
      }
    ]
  },
  {
    id: 'unit-3',
    number: 3,
    title: 'Yêu thương và chia sẻ',
    theme: 'Truyện ngắn',
    lessons: [
      {
        id: 'u3-l1',
        title: 'Cô bé bán diêm',
        description: 'Truyện cổ tích - Hans Christian Andersen',
        topic: 'Truyện cổ tích',
        texts: ['Cô bé bán diêm']
      },
      {
        id: 'u3-l2',
        title: 'Gió lạnh đầu mùa',
        description: 'Truyện ngắn - Thạch Lam',
        topic: 'Truyện ngắn',
        texts: ['Gió lạnh đầu mùa']
      }
    ]
  },
  {
    id: 'unit-4',
    number: 4,
    title: 'Quê hương yêu dấu',
    theme: 'Thơ - Ca dao',
    lessons: [
      {
        id: 'u4-l1',
        title: 'Chùm ca dao về quê hương đất nước',
        description: 'Ca dao dân ca',
        topic: 'Ca dao',
        texts: ['Ca dao Việt Nam']
      },
      {
        id: 'u4-l2',
        title: 'Việt Nam quê hương ta',
        description: 'Thơ - Nguyễn Đình Thi',
        topic: 'Thơ lục bát',
        texts: ['Việt Nam quê hương ta']
      }
    ]
  },
  {
    id: 'unit-5',
    number: 5,
    title: 'Những nẻo đường xứ sở',
    theme: 'Kí',
    lessons: [
      {
        id: 'u5-l1',
        title: 'Cô Tô',
        description: 'Kí - Nguyễn Tuân',
        topic: 'Kí',
        texts: ['Cô Tô']
      },
      {
        id: 'u5-l2',
        title: 'Hang Én',
        description: 'Kí - Hà My',
        topic: 'Kí',
        texts: ['Hang Én']
      }
    ]
  }
];

export const WELCOME_MESSAGE = "Chào em! Thầy là trợ lý ảo Văn học. Em muốn ôn tập bài nào hôm nay, hay cần giúp đỡ về kỹ năng viết đoạn văn? Hãy chọn một bài học bên trái để bắt đầu nhé!";
