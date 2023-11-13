<template>
  <div class="container">
    <div class="logo">
      <h1 class="titulo-titulo-substituicao">Substituição de páginas - RAM</h1>
    </div>

    <div class="informacoes">
      <BotaoPadrao
        class="mb-05 altura-botao"
        :texto="'FIFO'"
        @click="redirecionar('fifo')"
      />
            <BotaoPadrao
        class="mb-05 altura-botao"
        :texto="'LFU'"
        @click="redirecionar('lfu')"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "Menu",

  data() {
    return {};
  },

  methods: {
    redirecionar(pagina) {
      const rotas = {
        fifo: "/fifo",
        lfu: "/lfu",
      };

      const rotaDestino = rotas[pagina];

      if (rotaDestino) {
        this.$router.push(rotaDestino);
      }
    },
  },
};
</script>

<style lang="scss" scoped src="./styles.scss" />
