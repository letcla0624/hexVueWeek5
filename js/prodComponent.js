const api_url = "https://vue3-course-api.hexschool.io/v2";
const api_path = "letcla";

export default {
  props: ["id", "load"],
  data() {
    return {
      product: {},
      qty: 1,
    };
  },
  template: "#productModal",
  watch: {
    // 監控產品id
    id() {
      this.getProduct();
    },
  },
  methods: {
    openModal() {
      this.modal.show();
    },
    closeModal() {
      this.modal.hide();
    },
    // 取得詳細產品內容
    getProduct() {
      axios
        .get(`${api_url}/api/${api_path}/product/${this.id}`)
        .then((res) => {
          this.product = res.data.product;
        })
        .catch((err) => {
          console.dir(err);
        });
    },
    addToCartInModal() {
      this.$emit("add-cart", this.product.id, this.qty);
    },
  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal);
  },
};
