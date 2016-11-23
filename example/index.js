// Generated by CoffeeScript 1.10.0
(function() {
  "use strict";
  var BUNNIES_PER_EMIT, BUNNY_COUNT, BUNNY_INTERVAL, BUNNY_LIFESPAN, Phaser, dat, debugSettings, debugSettingsGui, emitterGui, gameGui, gameScaleGui, gameTimeGui, pluginGui;

  dat = this.dat, Phaser = this.Phaser;

  BUNNY_COUNT = 1e4;

  BUNNY_LIFESPAN = 4000;

  BUNNY_INTERVAL = 100;

  BUNNIES_PER_EMIT = 10;

  debugSettings = {
    "debug.gameInfo()": false,
    "debug.gameTimeInfo()": false
  };

  debugSettingsGui = function(_debugSettings, gui) {
    var i, key, len, ref;
    ref = Object.keys(_debugSettings);
    for (i = 0, len = ref.length; i < len; i++) {
      key = ref[i];
      gui.add(_debugSettings, key);
    }
    return gui;
  };

  emitterGui = function(emitter, gui) {
    gui.add(emitter, "_flowQuantity", 0, 100, 5);
    gui.add(emitter, "on");
    return gui;
  };

  gameGui = function(game, gui) {
    gui.add(game, "forceSingleUpdate");
    gui.add(game, "lockRender");
    gui.add(game, "paused");
    return gui;
  };

  gameScaleGui = function(scale, gui) {
    gui.add(scale, "fullScreenScaleMode", {
      NO_SCALE: Phaser.ScaleManager.NO_SCALE,
      RESIZE: Phaser.ScaleManager.RESIZE,
      SHOW_ALL: Phaser.ScaleManager.SHOW_ALL
    });
    gui.add(scale, "scaleMode", {
      NO_SCALE: Phaser.ScaleManager.NO_SCALE,
      RESIZE: Phaser.ScaleManager.RESIZE,
      SHOW_ALL: Phaser.ScaleManager.SHOW_ALL
    });
    return gui.add(scale, "startFullScreen");
  };

  gameTimeGui = function(time, gui) {
    gui.add(time, "desiredFps", 5, 120, 5);
    gui.add(time, "refresh");
    gui.add(time, "reset");
    gui.add(time, "slowMotion", 0, 2, 0.25);
    return gui;
  };

  pluginGui = function(plugin, gui) {
    var constructor;
    constructor = plugin.constructor;
    gui.add(plugin, "active");
    gui.add(plugin, "mode", constructor.modes);
    gui.add(plugin, "reset");
    gui.add(plugin, "visible");
    return gui;
  };

  this.GAME = new Phaser.Game({
    antialias: true,
    height: 600,
    renderer: Phaser.AUTO,
    resolution: 1,
    scaleMode: Phaser.ScaleManager.SHOW_ALL,
    width: 600,
    state: {
      init: function() {
        var game;
        game = this.game;
        if (!game.timing) {
          game.timing = game.plugins.add(Phaser.Plugin.AdvancedTiming);
        }
        game.clearBeforeRender = false;
        game.forceSingleUpdate = false;
        game.debug.font = "12px monospace";
        game.debug.lineHeight = 15;
        game.scale.fullScreenScaleMode = game.scale.scaleMode;
        game.scale.parentIsWindow = true;
        game.tweens.frameBased = true;
        game.input.destroy();
      },
      preload: function() {
        this.load.baseURL = "https://examples.phaser.io/assets/";
        this.load.crossOrigin = "anonymous";
        this.load.image("bunny", "sprites/wabbit.png");
        this.load.image("sky", "skies/cavern2.png");
      },
      create: function() {
        var emitter, pluginGuiFolder, world;
        world = this.world;
        this.add.image(0, 0, "sky");
        emitter = this.emitter = this.add.emitter(world.bounds.left, world.centerY, BUNNY_COUNT);
        emitter.makeParticles("bunny");
        emitter.flow(BUNNY_LIFESPAN, BUNNY_INTERVAL, BUNNIES_PER_EMIT);
        this.add.tween(emitter).to({
          emitX: world.width
        }, 2000, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
        this.gui = new dat.GUI({
          width: 320
        });
        emitterGui(emitter, this.gui.addFolder("bunnies"));
        gameGui(this.game, this.gui.addFolder("game"));
        gameScaleGui(this.game.scale, this.gui.addFolder("game.scale"));
        gameTimeGui(this.game.time, this.gui.addFolder("game.time"));
        pluginGui(this.game.timing, pluginGuiFolder = this.gui.addFolder("plugin"));
        pluginGuiFolder.open();
        debugSettingsGui(debugSettings, this.gui.addFolder("debug"));
      },
      render: function() {
        var debug;
        debug = this.game.debug;
        if (debugSettings["debug.gameInfo()"]) {
          debug.gameInfo(300, 20);
        }
        if (debugSettings["debug.gameTimeInfo()"]) {
          debug.gameTimeInfo(300, 120);
        }
      },
      shutdown: function() {
        this.gui.destroy();
      }
    }
  });

}).call(this);
