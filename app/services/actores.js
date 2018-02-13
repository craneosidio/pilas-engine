import Service from "@ember/service";
import config from "pilas-engine/config/environment";
import Ember from "ember";
import { task, timeout } from "ember-concurrency";

export default Service.extend({
  iniciado: false,
  data: null,
  lista_de_actores: [1],

  tareaConseguirActores: task(function*() {
    yield timeout(500);

    let metadata = yield Ember.$.ajax({
      mimeType: "application/json",
      dataType: "json",
      url: `${config.rootURL}actores/actores.json`
    });

    for (let i = 0; i < metadata.actores.length; i++) {
      let actor = metadata.actores[i];

      let data = yield Ember.$.ajax({
        url: `${config.rootURL}actores/${actor.archivo}`
      });

      actor.codigo = data;
    }

    this.set("lista_de_actores", metadata.actores);

    return metadata;
  }).drop(),

  iniciar() {
    return this.get("tareaConseguirActores").perform();
  }
});
