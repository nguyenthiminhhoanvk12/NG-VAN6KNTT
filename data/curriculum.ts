import { Chapter } from '../types';

export const CURRICULUM: Chapter[] = [
  {
    id: 'unit1',
    title: 'Bài 1: Tôi và các bạn',
    lessons: [
      { id: 'u1.1', title: 'Bài học đường đời đầu tiên', chapterId: 'unit1', description: 'Trích Dế Mèn phiêu lưu ký - Tô Hoài' },
      { id: 'u1.2', title: 'Nếu cậu muốn có một người bạn...', chapterId: 'unit1', description: 'Trích Hoàng tử bé' },
      { id: 'u1.3', title: 'Thực hành tiếng Việt: Từ đơn và từ phức', chapterId: 'unit1' },
      { id: 'u1.review', title: 'Ôn tập Bài 1', chapterId: 'unit1' },
    ]
  },
  {
    id: 'unit2',
    title: 'Bài 2: Gõ cửa trái tim',
    lessons: [
      { id: 'u2.1', title: 'Chuyện cổ tích về loài người', chapterId: 'unit2', description: 'Thơ - Xuân Quỳnh' },
      { id: 'u2.2', title: 'Mây và sóng', chapterId: 'unit2', description: 'Thơ - Rabindranath Tagore' },
      { id: 'u2.3', title: 'Thực hành tiếng Việt: Ẩn dụ', chapterId: 'unit2' },
      { id: 'u2.review', title: 'Ôn tập Bài 2', chapterId: 'unit2' },
    ]
  },
  {
    id: 'unit3',
    title: 'Bài 3: Yêu thương và chia sẻ',
    lessons: [
      { id: 'u3.1', title: 'Cô bé bán diêm', chapterId: 'unit3', description: 'Truyện cổ tích - Andersen' },
      { id: 'u3.2', title: 'Gió lạnh đầu mùa', chapterId: 'unit3', description: 'Truyện ngắn - Thạch Lam' },
      { id: 'u3.3', title: 'Thực hành tiếng Việt: Cụm động từ, cụm tính từ', chapterId: 'unit3' },
      { id: 'u3.review', title: 'Ôn tập Bài 3', chapterId: 'unit3' },
    ]
  },
  {
    id: 'unit4',
    title: 'Bài 4: Quê hương yêu dấu',
    lessons: [
      { id: 'u4.1', title: 'Chùm ca dao về quê hương đất nước', chapterId: 'unit4', description: 'Ca dao dân ca' },
      { id: 'u4.2', title: 'Việt Nam quê hương ta', chapterId: 'unit4', description: 'Thơ - Nguyễn Đình Thi' },
      { id: 'u4.3', title: 'Thực hành tiếng Việt: Từ đồng âm và từ đa nghĩa', chapterId: 'unit4' },
      { id: 'u4.review', title: 'Ôn tập Bài 4', chapterId: 'unit4' },
    ]
  },
  {
    id: 'unit5',
    title: 'Bài 5: Những nẻo đường xứ sở',
    lessons: [
      { id: 'u5.1', title: 'Cô Tô', chapterId: 'unit5', description: 'Kí - Nguyễn Tuân' },
      { id: 'u5.2', title: 'Hang Én', chapterId: 'unit5', description: 'Kí - Hà My' },
      { id: 'u5.3', title: 'Thực hành tiếng Việt: Hoán dụ', chapterId: 'unit5' },
      { id: 'u5.review', title: 'Ôn tập Bài 5', chapterId: 'unit5' },
    ]
  },
  {
    id: 'unit6',
    title: 'Bài 6: Chuyện kể về những người anh hùng',
    lessons: [
      { id: 'u6.1', title: 'Thánh Gióng', chapterId: 'unit6', description: 'Truyền thuyết' },
      { id: 'u6.2', title: 'Sơn Tinh, Thủy Tinh', chapterId: 'unit6', description: 'Truyền thuyết' },
      { id: 'u6.3', title: 'Thực hành tiếng Việt: Từ mượn', chapterId: 'unit6' },
      { id: 'u6.review', title: 'Ôn tập Bài 6', chapterId: 'unit6' },
    ]
  },
  {
    id: 'unit7',
    title: 'Bài 7: Thế giới cổ tích',
    lessons: [
      { id: 'u7.1', title: 'Thạch Sanh', chapterId: 'unit7', description: 'Cổ tích' },
      { id: 'u7.2', title: 'Cây khế', chapterId: 'unit7', description: 'Cổ tích' },
      { id: 'u7.review', title: 'Ôn tập Bài 7', chapterId: 'unit7' },
    ]
  }
];

export const getNextLessonId = (currentId: string): string | null => {
  const allLessons = CURRICULUM.flatMap(c => c.lessons);
  const index = allLessons.findIndex(l => l.id === currentId);
  if (index >= 0 && index < allLessons.length - 1) {
    return allLessons[index + 1].id;
  }
  return null;
};