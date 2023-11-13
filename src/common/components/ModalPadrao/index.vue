<template>
  <transition name="modal-fade">
    <div class="modal-overlay">
      <div class="modal">
        <div class="fechar" @click="fecharModal" v-if="botaoFechar">
          <img
            class="icone-fechar"
            src="../../../assets/images/icones/close-icon.svg"
            alt="Botão de fechar modal"
          />
        </div>
        <div class="overflow-auto" style="padding: 4rem;">
        <slot />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "ModalPadrao",

  data() {
    return {};
  },

  props: {
    botaoFechar: {
      type: Boolean,
      required: false,
      default: true,
    },
  },

  methods: {
    fecharModal() {
      this.$emit("fechar-modal");
    },
  },
};
</script>

<style lang="scss" scoped src="./styles.scss" />
