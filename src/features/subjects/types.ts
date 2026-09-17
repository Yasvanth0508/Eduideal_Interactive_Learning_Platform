export interface SubjectDetail {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  thumbnailUrl: string | null;
  displayOrder: number;
  isPublished: boolean;
}

export interface ChapterDetail {
  id: string;
  subjectId: string;
  name: string;
  slug: string;
  description: string | null;
  displayOrder: number;
  isPublished: boolean;
}

export interface TopicListItem {
  id: string;
  chapterId: string;
  name: string;
  slug: string;
  description: string | null;
  displayOrder: number;
  isPublished: boolean;
  createdAt: Date | string | null;
  updatedAt: Date | string | null;
}

export interface ChapterWithTopics extends ChapterDetail {
  subjectName: string;
  subjectSlug: string;
  topics: TopicListItem[];
}

export interface TopicDetail extends TopicListItem {
  chapterName: string;
  chapterSlug: string;
  subjectName: string;
  subjectSlug: string;
}
