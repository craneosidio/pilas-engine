/// <reference path="utilidades.ts"/>

var HOST = "file://";

if (window.location.host) {
  HOST = `http://${window.location.host}`;
}

class Pilas {
  game: Phaser.Game;

  mensajes: Mensajes;
  depurador: Depurador;
  utilidades: Utilidades;
  escenas: Escenas;
  control: Control;
  historia: Historia;
  sonidos: any;
  actores: Actores;
  animaciones: Animaciones;
  Phaser: any;

  recursos: any;

  fisica: Fisica;

  modo: any;
  _ancho: number;
  _alto: number;

  cursor_x: number = 0;
  cursor_y: number = 0;

  constructor() {
    this.Phaser = Phaser;

    this.mensajes = new Mensajes(this);
    this.depurador = new Depurador(this);
    this.utilidades = new Utilidades(this);
    this.escenas = new Escenas(this);
    this.historia = new Historia(this);
    this.sonidos = {};
    this.actores = new Actores(this);
    this.animaciones = new Animaciones(this);
    this.fisica = new Fisica(this);
  }

  get escena() {
    return this.escenas.escena_actual;
  }

  iniciar_phaser(ancho: number, alto: number, recursos: any) {
    let self = this;

    this.recursos = recursos;
    var configuracion = this.crear_configuracion(ancho, alto);

    var game = new Phaser.Game(configuracion);

    this._ancho = ancho;
    this._alto = alto;
    this.game = game;

    this.control = new Control(this);
  }

  definir_modo(nombre, datos) {
    try {
      this.game.scene.stop("ModoCargador");
      this.game.scene.stop("ModoEjecucion");
      this.game.scene.stop("ModoEditor");
      this.game.scene.stop("ModoPausa");
    } catch (e) {
      console.warn(e);
    }

    this.modo = this.game.scene.getScene(nombre);
    this.game.scene.start(nombre, datos);
  }

  crear_configuracion(ancho, alto) {
    return {
      type: Phaser.AUTO,
      parent: "game",
      width: ancho,
      height: alto,
      backgroundColor: "#5d5d5d",
      disableContextMenu: true,
      input: {
        keyboard: true,
        mouse: true,
        touch: true,
        gamepad: true
      },
      scene: [ModoCargador, ModoEditor, ModoEjecucion, ModoPausa],
      physics: {
        default: "matter",
        matter: {
          gravity: {
            y: 1
          },
          debug: true
        }
      }
    };
  }

  reproducir_sonido(nombre: string) {
    var music = this.modo.sound.add(nombre);
    music.play();
  }

  obtener_actores() {
    return this.escena.actores;
  }

  obtener_cantidad_de_actores() {
    return this.obtener_actores().length;
  }

  obtener_actores_en(_x: number, _y: number) {
    let { x, y } = this.utilidades.convertir_coordenada_de_pilas_a_phaser(_x, _y);
    let actores = this.obtener_actores();

    return actores.filter(actor => {
      return actor.sprite.getBounds()["contains"](x, y);
    });
  }

  escena_actual() {
    return this.escena;
  }

  pausar() {
    this.game.loop.sleep();
  }

  continuar() {
    this.game.loop.wake();
  }
}

var pilas = new Pilas();
