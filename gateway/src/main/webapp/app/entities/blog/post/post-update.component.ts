import { Component, Inject } from 'vue-property-decorator';

import { mixins } from 'vue-class-component';
import JhiDataUtils from '@/shared/data/data-utils.service';

import { numeric, required, minLength, maxLength } from 'vuelidate/lib/validators';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import parseISO from 'date-fns/parseISO';
import { DATE_TIME_LONG_FORMAT } from '@/shared/date/filters';

import BlogService from '../blog/blog.service';
import { IBlog } from '@/shared/model/blog/blog.model';

import TagService from '../tag/tag.service';
import { ITag } from '@/shared/model/blog/tag.model';

import AlertService from '@/shared/alert/alert.service';
import { IPost, Post } from '@/shared/model/blog/post.model';
import PostService from './post.service';

const validations: any = {
  post: {
    title: {
      required
    },
    content: {
      required
    },
    date: {
      required
    }
  }
};

@Component({
  validations
})
export default class PostUpdate extends mixins(JhiDataUtils) {
  @Inject('alertService') private alertService: () => AlertService;
  @Inject('postService') private postService: () => PostService;
  public post: IPost = new Post();

  @Inject('blogService') private blogService: () => BlogService;

  public blogs: IBlog[] = [];

  @Inject('tagService') private tagService: () => TagService;

  public tags: ITag[] = [];
  public isSaving = false;

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.postId) {
        vm.retrievePost(to.params.postId);
      }
      vm.initRelationships();
    });
  }

  created(): void {
    this.post.tags = [];
  }

  public save(): void {
    this.isSaving = true;
    if (this.post.id) {
      this.postService()
        .update(this.post)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('gatewayApp.blogPost.updated', { param: param.id });
          this.alertService().showAlert(message, 'info');
        });
    } else {
      this.postService()
        .create(this.post)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('gatewayApp.blogPost.created', { param: param.id });
          this.alertService().showAlert(message, 'success');
        });
    }
  }

  public convertDateTimeFromServer(date: Date): string {
    if (date) {
      return format(date, DATE_TIME_LONG_FORMAT);
    }
    return null;
  }

  public updateInstantField(field, event) {
    if (event.target.value) {
      this.post[field] = parse(event.target.value, DATE_TIME_LONG_FORMAT, new Date());
    } else {
      this.post[field] = null;
    }
  }

  public updateZonedDateTimeField(field, event) {
    if (event.target.value) {
      this.post[field] = parse(event.target.value, DATE_TIME_LONG_FORMAT, new Date());
    } else {
      this.post[field] = null;
    }
  }

  public retrievePost(postId): void {
    this.postService()
      .find(postId)
      .then(res => {
        res.date = new Date(res.date);
        this.post = res;
      });
  }

  public previousState(): void {
    this.$router.go(-1);
  }

  public initRelationships(): void {
    this.blogService()
      .retrieve()
      .then(res => {
        this.blogs = res.data;
      });
    this.tagService()
      .retrieve()
      .then(res => {
        this.tags = res.data;
      });
  }

  public getSelected(selectedVals, option): any {
    if (selectedVals) {
      for (let i = 0; i < selectedVals.length; i++) {
        if (option.id === selectedVals[i].id) {
          return selectedVals[i];
        }
      }
    }
    return option;
  }
}
