import prodComponent from "./prodComponent.js";

const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule("required", required);
defineRule("email", email);
defineRule("min", min);
defineRule("max", max);

loadLocaleFromURL(
  "https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json"
);

configure({
  generateMessage: localize("zh_TW"), //啟用 locale
  validateOnInput: true, // 調整為輸入字元立即進行驗證
});

const api_url = "https://vue3-course-api.hexschool.io/v2";
const api_path = "letcla";

const app = Vue.createApp({
  data() {
    return {
      cart: {
        carts: [],
      },
      products: [],
      prodId: "",
      isLoading: "",
      form: {
        user: {
          name: "",
          email: "",
          tel: "",
          address: "",
        },
        message: "",
      },
    };
  },
  components: {
    prodComponent,
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage,
  },
  methods: {
    // 取得所有產品
    getProducts() {
      axios
        .get(`${api_url}/api/${api_path}/products/all`)
        .then((res) => {
          this.products = res.data.products;
        })
        .catch((err) => {
          console.dir(err);
        });
    },
    // 打開單一產品 modal
    openProdModal(id) {
      this.prodId = id;
      this.$refs.prodModal.openModal();
    },
    // 加入購物車
    addToCart(id, qty = 1) {
      this.isLoading = id;
      this.$refs.prodModal.closeModal();
      const data = {
        product_id: id,
        qty,
      };
      axios
        .post(`${api_url}/api/${api_path}/cart`, { data })
        .then((res) => {
          this.catchCart(res);
        })
        .catch((err) => {
          this.errorCart(err);
        });
    },
    // 取得購物車
    getCart() {
      axios
        .get(`${api_url}/api/${api_path}/cart`)
        .then((res) => {
          this.cart = res.data.data;
        })
        .catch((err) => {
          this.errorCart(err);
        });
    },
    // 刪除購物車單一商品
    delCartItem(id) {
      this.isLoading = id;
      axios
        .delete(`${api_url}/api/${api_path}/cart/${id}`)
        .then((res) => {
          this.catchCart(res);
        })
        .catch((err) => {
          this.errorCart(err);
        });
    },
    // 更新購物車
    updateToCart(item) {
      this.isLoading = item.id;
      const data = {
        product_id: item.product_id,
        qty: item.qty,
      };
      axios
        .put(`${api_url}/api/${api_path}/cart/${item.id}`, { data })
        .then((res) => {
          this.catchCart(res);
        })
        .catch((err) => {
          this.errorCart(err);
        });
    },
    // 清空購物車
    delCart(carts) {
      this.isLoading = carts;
      axios
        .delete(`${api_url}/api/${api_path}/carts`)
        .then((res) => {
          this.catchCart(res);
        })
        .catch((err) => {
          this.errorCart(err);
        });
    },
    catchCart(res) {
      this.isLoading = "";
      this.getCart();
      alert(res.data.message);
    },
    errorCart(err) {
      console.dir(err);
      this.isLoading = "";
      alert(err.response.data.message);
    },
    // 表單送出
    onSubmit(user) {
      this.isLoading = Object.keys(user).length;
      axios
        .post(`${api_url}/api/${api_path}/order`, { data: this.form })
        .then((res) => {
          this.isLoading = "";
          alert(
            `${res.data.message}, 訂單編號：${res.data.create_at}, 總金額：${res.data.total}`
          );
          this.$refs.form.resetForm();
          this.getCart();
        })
        .catch((err) => {
          console.dir(err);
          this.isLoading = "";
          alert(err.response.data.message);
        });
    },
    isPhone(value) {
      const phoneNumber = /^(09)[0-9]{8}$/;
      return phoneNumber.test(value) ? true : "需要正確的電話號碼";
    },
  },
  mounted() {
    this.getProducts();
    this.getCart();
  },
});

app.mount("#app");
