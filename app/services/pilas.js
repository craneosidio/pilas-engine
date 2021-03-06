import { Promise as EmberPromise } from 'rsvp';
import Service from "@ember/service";

export default Service.extend({
  cargando: true,

  inicializarPilas(iframeElement) {
    this.set("iframe", iframeElement);
    this.set("cargando", true);

    return new EmberPromise(success => {
      var codigo = "pilasengine.iniciar('canvas')";
      let pilas = iframeElement.contentWindow.eval(codigo);

      pilas.eventos.cuando_carga.conectar(() => {
        this.set("cargando", false);
        success(pilas);
      });
    });
  },

  liberarRecursos() {
    this.set("cargando", true);
  }
});
