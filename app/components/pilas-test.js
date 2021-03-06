import { later } from "@ember/runloop";
import { inject as service } from "@ember/service";
import Component from "@ember/component";

export default Component.extend({
  classNames: ["flex", "absolute", "absolute--fill"],
  bus: service(),
  compilador: service(),
  espera: 2,
  proyecto: null,

  didInsertElement() {
    this.set("proyecto", {
      titulo: "Proyecto para pilas-test",
      ancho: 500,
      alto: 500,
      codigos: {
        escenas: [
          {
            nombre: "principal",
            codigo: `class principal extends Escena {
          iniciar() {
          }

          actualizar() {
          }
        }`
          }
        ],
        actores: []
      },
      escenas: [
        {
          nombre: "principal",
          id: 1,
          camara_x: 0,
          camara_y: 0,
          actores: []
        }
      ]
    });
    this.get("bus").on("finaliza_carga", this, "finaliza_carga");
    this.get("bus").on("cuando_termina_de_iniciar_ejecucion", this, "cuando_termina_de_iniciar_ejecucion");
  },

  willDestroyElement() {
    this.get("bus").off("finaliza_carga", this, "finaliza_carga");
    this.get("bus").off("cuando_termina_de_iniciar_ejecucion", this, "cuando_termina_de_iniciar_ejecucion");
  },

  finaliza_carga(pilas) {
    let proyecto = this.get("proyecto");
    let resultado = this.get("compilador").compilar_proyecto(proyecto);

    let datos = {
      nombre_de_la_escena_inicial: "principal",
      codigo: resultado.codigo,
      proyecto: proyecto
    };

    this.get("bus").trigger("ejecutar_proyecto", datos);

    if (this.get("cuandoTerminaLaEspera")) {
      later(() => {
        this.get("cuandoTerminaLaEspera")(pilas, this.get("compilador"));
      }, this.get("espera") * 1000);
    }
  },

  cuando_termina_de_iniciar_ejecucion(pilas, contexto) {
    this.get("cuandoInicia")(pilas, contexto);
  }
});
