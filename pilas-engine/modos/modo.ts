class Modo extends Phaser.Scene {
  matter: any;
  actores: any;
  pilas: Pilas;
  fps: any;
  graphics: any;

  constructor(data) {
    super(data);
  }

  create(datos) {
    this.fps = this.add.bitmapText(5, 5, "impact", "FPS");
    this.crear_canvas_de_depuracion();
    this.pilas = datos.pilas;
  }

  destacar_actor_por_id(id) {
    let actor = this.obtener_actor_por_id(id);

    if (actor) {
      actor.destacar();
    }
  }

  crear_canvas_de_depuracion() {
    let graphics = this.add.graphics({ x: 0, y: 0 });
    graphics.depth = 200;
    this.graphics = graphics;
  }

  update(actores) {
    this.graphics.clear();

    actores = actores || this.actores;

    if (this.pilas.depurador.modo_posicion_activado) {
      actores.map(sprite => {
        this.dibujar_punto_de_control(this.graphics, sprite.x, sprite.y);
      });
    }

    if (this.fps) {
      if (this.pilas.depurador.mostrar_fps) {
        this.fps.alpha = 1;
        this.fps.text = "FPS: " + Math.round(this.pilas.game.loop["actualFps"]);
      } else {
        this.fps.alpha = 0;
      }
    }
  }

  crear_fondo(fondo) {
    this.fondo = this.add.tileSprite(0, 0, this.ancho, this.alto, fondo);
    this.fondo.depth = -1000;
    this.fondo.setOrigin(0);
  }

  obtener_actor_por_id(id) {
    return this.pilas.modo.actores.filter(e => e.id === id)[0];
  }

  actualizar_sprite_desde_datos(sprite, actor) {
    let coordenada = this.pilas.utilidades.convertir_coordenada_de_pilas_a_phaser(actor.x, actor.y);

    sprite.id = actor.id;
    sprite.x = coordenada.x;
    sprite.y = coordenada.y;
    sprite.angle = -actor.rotacion;
    sprite.scaleX = actor.escala_x;
    sprite.scaleY = actor.escala_y;
    sprite.setOrigin(actor.centro_x, actor.centro_y);
    sprite.alpha = 1 - actor.transparencia / 100;

    if (sprite.figura) {
      this.pilas.Phaser.Physics.Matter.Matter.World.remove(this.pilas.modo.matter.world.localWorld, sprite.figura);
    }

    if (actor.figura) {
      sprite.figura = this.crear_figura_estatica_para(actor);
    }

    sprite.setFlipX(actor.espejado);
    sprite.setFlipY(actor.espejado_vertical);
  }

  crear_figura_estatica_para(actor) {
    let coordenada = this.pilas.utilidades.convertir_coordenada_de_pilas_a_phaser(actor.x, actor.y);
    let angulo = this.pilas.utilidades.convertir_angulo_a_radianes(-actor.rotacion);

    if (actor.figura === "rectangulo") {
      return this.matter.add.rectangle(coordenada.x, coordenada.y, actor.figura_ancho, actor.figura_alto, {
        isStatic: true,
        angle: angulo
      });
    }

    if (actor.figura === "circulo") {
      return this.matter.add.circle(coordenada.x, coordenada.y, actor.figura_radio, { isStatic: true });
    }

    throw Error(`No se reconoce la figura ${actor.figura} en este modo.`);
  }

  posicionar_la_camara(datos_de_la_escena) {
    this.cameras.cameras[0].setScroll(datos_de_la_escena.camara_x, -datos_de_la_escena.camara_y);
  }

  actualizar_posicion(posicion: any = null) {
    throw Error("No se puede actualizar posicion en este modo. Solo se puede en el modo pausa.");
  }

  dibujar_punto_de_control(graphics, x, y) {
    graphics.fillStyle(0xffffff, 1);
    graphics.fillRect(x - 3, y - 3, 6, 6);
    graphics.fillStyle(0x000000, 1);
    graphics.fillRect(x - 2, y - 2, 4, 4);
  }
}
