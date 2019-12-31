import { IBlog } from '@/shared/model/blog/blog.model';
import { ITag } from '@/shared/model/blog/tag.model';

export interface IPost {
  id?: number;
  title?: string;
  content?: any;
  date?: Date;
  blog?: IBlog;
  tags?: ITag[];
}

export class Post implements IPost {
  constructor(
    public id?: number,
    public title?: string,
    public content?: any,
    public date?: Date,
    public blog?: IBlog,
    public tags?: ITag[]
  ) {}
}
