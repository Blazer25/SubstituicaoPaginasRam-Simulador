<template>
  <div class="container">
    <div class="logo">
      <h1 class="titulo-titulo-substituicao">LFU</h1>
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
        <p class="tituloProcessamento">RESULTADO LFU</p>
        <br />
        <div style="margin: 1rem">
          <table>
            <tbody>
              <tr v-for="(item, index) in referenciasExibir" :key="index">
                <th>{{ item.referencia }}</th>
                <td>
                  <span>{{ item.conteudo.join(", ") }}</span>
                  <span
                    style="margin-left: 3rem"
                    :class="item.faltaPagina ? 'verde' : 'vermelho'"
                    >{{ item.faltaPagina ? "SIM" : "NÃO" }}</span
                  >
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
        <br />
        <br />
        <p class="texto-contraste">Frequência dos frames RAM:</p>
        <div style="margin: 1rem">
          <table>
            <tbody>
              <tr v-for="(item, index) in totalFrequenciaFrames" :key="index">
                <th>Frame: {{ item.frame }}</th>
                <td>
                  <span>{{ item.frquencia }}</span>
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
  name: "LFU",

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
      totalFrequenciaFrames: [],

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
      this.paginarMemoriaLfu();
      this.setarPaginasFaltas();
      this.setarValorFinalDaRam();
      this.setarTotalFrquenciaFrames();
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
          frequencia: 0,
          conteudo: [],
        });
      }
    },

    paginarMemoriaLfu() {
      for (let i = 0; i < this.quantidadeReferencias; i++) {
        const referenciaAtual = this.referencias[i].referencia;
        let paginaSubstituida = null;

        // Verifica se já existe
        const paginaExistente = this.frames.find((pagina) =>
          pagina.conteudo.includes(referenciaAtual)
        );

        if (!paginaExistente) {
          // Falta de página
          this.referencias[i].faltaPagina = true;

          // LFU
          paginaSubstituida = this.frames.reduce((paginaMenosUsada, pagina) => {
            return pagina.frequencia < paginaMenosUsada.frequencia
              ? pagina
              : paginaMenosUsada;
          });

          // Atualiza a página substituída
          paginaSubstituida.conteudo = [referenciaAtual];
          paginaSubstituida.frequencia++;
        } else {
          // Atualizar a frequência da página existente
          paginaExistente.frequencia++;
        }

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

    setarTotalFrquenciaFrames() {
      this.totalFrequenciaFrames = this.frames.map((frame) => {
        return {
          frame: frame.frame,
          frquencia: frame.frequencia,
        };
      });
    },

    abrirModalResultados() {
      this.modal.resultado = true;
    },

    fecharModalResultados() {
      this.modal.resultado = false;
      window.location.reload();
    },
  },

  watch: {},
};
</script>

<style lang="scss" scoped src="./styles.scss" />
