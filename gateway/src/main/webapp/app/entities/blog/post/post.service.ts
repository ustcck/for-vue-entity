import axios from 'axios';

import buildPaginationQueryOpts from '@/shared/sort/sorts';

import { IPost } from '@/shared/model/blog/post.model';

const baseApiUrl = 'services/blog/api/posts';

export default class PostService {
  public find(id: number): Promise<IPost> {
    return new Promise<IPost>(resolve => {
      axios.get(`${baseApiUrl}/${id}`).then(function(res) {
        resolve(res.data);
      });
    });
  }

  public retrieve(paginationQuery?: any): Promise<any> {
    return new Promise<any>(resolve => {
      axios.get(baseApiUrl + `?${buildPaginationQueryOpts(paginationQuery)}`).then(function(res) {
        resolve(res);
      });
    });
  }

  public delete(id: number): Promise<any> {
    return new Promise<any>(resolve => {
      axios.delete(`${baseApiUrl}/${id}`).then(function(res) {
        resolve(res);
      });
    });
  }

  public create(entity: IPost): Promise<IPost> {
    return new Promise<IPost>(resolve => {
      axios.post(`${baseApiUrl}`, entity).then(function(res) {
        resolve(res.data);
      });
    });
  }

  public update(entity: IPost): Promise<IPost> {
    return new Promise<IPost>(resolve => {
      axios.put(`${baseApiUrl}`, entity).then(function(res) {
        resolve(res.data);
      });
    });
  }
}
