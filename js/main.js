Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },

    template: `
    <div class="product">
      <div class="product-image">
        <img :src="image" :alt="altText"/>
      </div>
      <div class="product-info">
        <h1>{{ title }}</h1>
        <p v-if="inStock">In stock</p>
        <p v-else :class="{ textOutOf: !inStock }">Out of Stock</p>
        <p>{{ sale }}</p>

        <product-details :details="details"></product-details>

        <p>Shipping: {{ shipping }}</p>
        <div
          class="color-box"
          v-for="(variant, index) in variants"
          :key="variant.variantId"
          :style="{ backgroundColor: variant.variantColor }"
          @mouseover="updateProduct(index)"
          :class="{ active: selectedVariant === index }"
        ></div>

        <button
          v-on:click="addToCart"
          :disabled="!inStock"
          :class="{ disabledButton: !inStock }"
        >
          Add to cart
        </button>

        <button v-on:click="deleteToCart" :disabled="cart.length === 0">Delete last item</button>
      </div>
    </div>
  `,
    data() {
        return {
            product: "Socks",
            brand: 'Vue Mastery',
            altText: "A pair of socks",
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10,
                    onSale: true
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0,
                }
            ],

            selectedVariant: 0,
            cart: 0
        };
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage || './assets/default-image.jpg'; // Защита от пустого изображения
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity > 0;
        },
        sale() {
            const variant = this.variants[this.selectedVariant];
            return variant.onSale ? `${this.brand} ${this.product} is on sale!` : `${this.brand} ${this.product} is not on sale`;
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
        }
    },
    methods: {
        updateProduct(index) {
            this.selectedVariant = index;
        },
        addToCart() {
            this.$emit('add-to-cart',
                this.variants[this.selectedVariant].variantId);
        },

        deleteToCart() {
            this.$emit('delete-to-cart')
        }
    }
});

Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template: `
    <div class="product-details">
      <ul>
        <li v-for="(detail, index) in details" :key="index">{{ detail }}</li>
      </ul>
    </div>
  `
});

let app = new Vue({
    el: '#app',
    data: {
        premium: true,  // Премиум статус
        cart: []        // Массив товаров в корзине
    },
    methods: {
        // Метод для добавления товара в корзину
        updateCart(id) {
            this.cart.push(id);
        },

        // Метод для удаления последнего товара из корзины
        deleteCart() {
            if (this.cart.length > 0) {
                this.cart.pop();  // Удаляем последний товар из корзины
            }
        }
    }
});
