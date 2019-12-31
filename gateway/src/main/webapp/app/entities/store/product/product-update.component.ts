import { Component, Inject } from 'vue-property-decorator';

import { mixins } from 'vue-class-component';
import JhiDataUtils from '@/shared/data/data-utils.service';

import { numeric, required, minLength, maxLength } from 'vuelidate/lib/validators';

import AlertService from '@/shared/alert/alert.service';
import { IProduct, Product } from '@/shared/model/store/product.model';
import ProductService from './product.service';

const validations: any = {
  product: {
    title: {
      required
    },
    price: {
      required,
      numeric
    },
    image: {}
  }
};

@Component({
  validations
})
export default class ProductUpdate extends mixins(JhiDataUtils) {
  @Inject('alertService') private alertService: () => AlertService;
  @Inject('productService') private productService: () => ProductService;
  public product: IProduct = new Product();
  public isSaving = false;

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.productId) {
        vm.retrieveProduct(to.params.productId);
      }
    });
  }

  public save(): void {
    this.isSaving = true;
    if (this.product.id) {
      this.productService()
        .update(this.product)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('gatewayApp.storeProduct.updated', { param: param.id });
          this.alertService().showAlert(message, 'info');
        });
    } else {
      this.productService()
        .create(this.product)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('gatewayApp.storeProduct.created', { param: param.id });
          this.alertService().showAlert(message, 'success');
        });
    }
  }

  public retrieveProduct(productId): void {
    this.productService()
      .find(productId)
      .then(res => {
        this.product = res;
      });
  }

  public previousState(): void {
    this.$router.go(-1);
  }

  public clearInputImage(field, fieldContentType, idInput): void {
    if (this.product && field && fieldContentType) {
      if (this.product.hasOwnProperty(field)) {
        this.product[field] = null;
      }
      if (this.product.hasOwnProperty(fieldContentType)) {
        this.product[fieldContentType] = null;
      }
      if (idInput) {
        (<any>this).$refs[idInput] = null;
      }
    }
  }

  public initRelationships(): void {}
}
