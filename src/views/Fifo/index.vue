<template>
  <div class="container">
    <div class="logo">
      <h1 class="titulo-titulo-substituicao">FIFO</h1>
    </div>

    <div class="informacoes">
      <div class="w-65">
        <div class="input-registrar">
          <label>Quantos frames gostaria de utilizar?</label>
          <input
            type="text"
            v-model="quantidadeFrames"
            placeholder="Digite aqui o valor..."
          />
        </div>
        <div class="input-registrar">
          <label>Quais serão suas referências de memória?</label>
          <input
            type="text"
            v-model="referenciasMemoria"
            placeholder="Digite aqui o valor..."
          />
        </div>

        <BotaoPadrao
          class="botao"
          :texto="'Processar'"
          @click:botaoPadrao="executarProcessamentoMemoria"
          :disabled="verificaSePodeInserirDadosIniciais"
        />
      </div>
    </div>
    <div v-if="modal.resultado" style="padding: 5rem">
      <ModalPadrao v-if="modal.resultado" @fechar-modal="fecharModalResultados">
        <p class="tituloProcessamento">RESULTADO FIFO</p>
        <br />
        <div style="margin: 1rem">
          <table>
            <tbody>
              <tr v-for="(item, index) in referenciasExibir" :key="index">
                <th>{{ item.referencia }}</th>
                <td>
                  <span>{{ item.conteudo.join(", ") }}</span>
                  <span style="margin-left: 3rem;" :class="item.faltaPagina ? 'verde' : 'vermelho'">{{
                    item.faltaPagina ? "SIM" : "NÃO"
                  }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <br />
        <p class="texto-contraste">
          Total de falta de páginas: {{ totalPaginasFaltas }}
        </p>
        <br />
        <br />
        <!-- <p>Valor RAM: {{ valorFinalRam }}</p> -->

        <p class="texto-contraste">Valor final RAM:</p>
        <div style="margin: 1rem">
          <table>
            <tbody>
              <tr v-for="(item, index) in valorFinalRam" :key="index">
                <th>Frame: {{ item.frame }}</th>
                <td>
                  <span>{{ item.ram }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ModalPadrao>
    </div>
  </div>
</template>

<script>
export default {
  name: "FIFO",

  data() {
    return {
      quantidadeFrames: null,
      quantidadeReferencias: null,
      referenciasMemoria: null,
      valorFinalRam: null,

      variavelControle: 1,
      totalPaginasFaltas: 0,

      referencias: [],
      frames: [],
      referenciasExibir: [],

      modal: {
        resultado: false,
      },
    };
  },

  computed: {
    verificaSePodeInserirDadosIniciais() {
      const regex = /[^0-9]/;
      return (
        !this.quantidadeFrames ||
        this.quantidadeFrames <= 0 ||
        regex.test(this.quantidadeFrames) ||
        !this.referenciasMemoria ||
        this.referenciasMemoria <= 0 ||
        regex.test(this.referenciasMemoria)
      );
    },
  },

  methods: {
    executarProcessamentoMemoria() {
      this.setarQuantidadeFrames();
      this.setarReferencias();
      this.setarQuantidadeReferencias();
      this.montarCapaFrames();
      this.paginarMemoriaFifo();
      this.setarPaginasFaltas();
      this.setarValorFinalDaRam();
      this.abrirModalResultados();
    },

    setarQuantidadeFrames() {
      this.quantidadeFrames = Number(this.quantidadeFrames);
    },

    setarReferencias() {
      const referenciasConvertidas = this.referenciasMemoria
        .split("")
        .map(Number);
      this.referencias = referenciasConvertidas.map((referencia) => {
        return {
          referencia: referencia,
          faltaPagina: false,
        };
      });
    },

    setarQuantidadeReferencias() {
      this.quantidadeReferencias = this.referencias.length;
    },

    montarCapaFrames() {
      for (let i = 0; i < this.quantidadeFrames; i++) {
        this.frames.push({
          frame: i + 1,
          tempo: 0,
          conteudo: [],
        });
      }
    },

    paginarMemoriaFifo() {
      for (let i = 0; i < this.quantidadeReferencias; i++) {
        const referenciaAtual = this.referencias[i].referencia;
        let paginaSubstituida = null;

        // Verifica ref na memória
        const paginaExistente = this.frames.find((pagina) =>
          pagina.conteudo.includes(referenciaAtual)
        );

        // Falta de página
        if (!paginaExistente) {
          this.referencias[i].faltaPagina = true;

          // FIFO
          paginaSubstituida = this.frames.reduce((paginaMaisAntiga, pagina) => {
            return pagina.tempo < paginaMaisAntiga.tempo
              ? pagina
              : paginaMaisAntiga;
          });

          // Atualiza a página substituida
          paginaSubstituida.conteudo = [referenciaAtual];
          paginaSubstituida.tempo = this.variavelControle;
        }

        this.variavelControle++;

        this.referenciasExibir.push({
          referencia: referenciaAtual,
          conteudo: this.frames.map((pagina) => pagina.conteudo).flat(),
          faltaPagina: this.referencias[i].faltaPagina,
        });
      }
    },

    setarPaginasFaltas() {
      this.totalPaginasFaltas = this.referencias.filter(
        (referencia) => referencia.faltaPagina
      ).length;
    },

    setarValorFinalDaRam() {
      let frame = 1;
      const ramFlat = this.frames.map((frame) => frame.conteudo).flat();
      this.valorFinalRam = ramFlat.map((ram) => {
        return {
          frame: frame++,
          ram: ram,
        };
      });
    },

    abrirModalResultados() {
      this.modal.resultado = true;
    },

    fecharModalResultados() {
      this.modal.resultado = false;
      window.location.reload()
    },
  },

  watch: {},
};
</script>

<style lang="scss" scoped src="./styles.scss" />
