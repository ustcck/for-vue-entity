import { mixins } from 'vue-class-component';

import { Component, Inject } from 'vue-property-decorator';
import Vue2Filters from 'vue2-filters';
import { IBlog } from '@/shared/model/blog/blog.model';
import AlertMixin from '@/shared/alert/alert.mixin';

import BlogService from './blog.service';

@Component
export default class Blog extends mixins(Vue2Filters.mixin, AlertMixin) {
  @Inject('blogService') private blogService: () => BlogService;
  private removeId: number = null;
  public blogs: IBlog[] = [];

  public isFetching = false;

  public mounted(): void {
    this.retrieveAllBlogs();
  }

  public clear(): void {
    this.retrieveAllBlogs();
  }

  public retrieveAllBlogs(): void {
    this.isFetching = true;

    this.blogService()
      .retrieve()
      .then(
        res => {
          this.blogs = res.data;
          this.isFetching = false;
        },
        err => {
          this.isFetching = false;
        }
      );
  }

  public prepareRemove(instance: IBlog): void {
    this.removeId = instance.id;
  }

  public removeBlog(): void {
    this.blogService()
      .delete(this.removeId)
      .then(() => {
        const message = this.$t('gatewayApp.blogBlog.deleted', { param: this.removeId });
        this.alertService().showAlert(message, 'danger');
        this.getAlertFromStore();

        this.removeId = null;
        this.retrieveAllBlogs();
        this.closeDialog();
      });
  }

  public closeDialog(): void {
    (<any>this.$refs.removeEntity).hide();
  }
}
