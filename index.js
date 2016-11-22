// Generated by CoffeeScript 1.10.0
(function() {
  "use strict";
  var AdvancedTimingPlugin, Phaser, isFinite,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Phaser = this.Phaser;

  isFinite = Number.isFinite;

  Phaser.Plugin.AdvancedTiming = AdvancedTimingPlugin = (function(superClass) {
    extend(AdvancedTimingPlugin, superClass);

    function AdvancedTimingPlugin() {
      return AdvancedTimingPlugin.__super__.constructor.apply(this, arguments);
    }

    AdvancedTimingPlugin.MODE_GRAPH = "graph";

    AdvancedTimingPlugin.MODE_METER = "meter";

    AdvancedTimingPlugin.MODE_TEXT = "text";

    AdvancedTimingPlugin.MODE_DEFAULT = AdvancedTimingPlugin.MODE_TEXT;

    AdvancedTimingPlugin.colors = {
      ORANGE: "#FF851B",
      RED: "#FF4136",
      WHITE: "#FFFFFF",
      YELLOW: "#FFDC00"
    };

    AdvancedTimingPlugin.hexColors = {
      AQUA: 0x7FDBFF,
      BLUE: 0x0074D9,
      GRAY: 0x666666,
      GREEN: 0x2ECC40,
      LIME: 0x01FF70,
      YELLOW: 0xFFDC00
    };

    AdvancedTimingPlugin.modes = [AdvancedTimingPlugin.MODE_DEFAULT, AdvancedTimingPlugin.MODE_GRAPH, AdvancedTimingPlugin.MODE_METER, AdvancedTimingPlugin.MODE_TEXT];

    AdvancedTimingPlugin.renderTypes = [null, "CANVAS", "WEBGL", "HEADLESS"];

    AdvancedTimingPlugin.prototype.alpha = 0.75;

    AdvancedTimingPlugin.prototype.enableResumeHandler = true;

    AdvancedTimingPlugin.prototype._mode = null;

    Object.defineProperty(AdvancedTimingPlugin.prototype, "mode", {
      get: function() {
        return this._mode;
      },
      set: function(val) {
        if (val === this._mode) {
          return this._mode;
        }
        switch (val) {
          case this.constructor.MODE_GRAPH:
          case this.constructor.MODE_METER:
          case this.constructor.MODE_TEXT:
            this._mode = val;
            this.add();
            this.activeDisplay = this.display[this._mode];
            if (this.game.debug.graph) {
              this.game.debug.graph(this.group);
            }
            break;
          default:
            throw new Error("No such mode: '" + val + "'");
        }
        this.refresh();
        return this._mode;
      }
    });

    AdvancedTimingPlugin.prototype.name = "Advanced Timing Plugin";

    AdvancedTimingPlugin.prototype.init = function(options) {
      var game;
      game = this.game;
      game.time.advancedTiming = true;
      this.group = game.make.group(null, "advancedTimingPlugin", true);
      this.position = new Phaser.Point;
      this.renderType = this.constructor.renderTypes[game.renderType];
      this.reset();
      game.onResume.add(this.onResume, this);
      game.debug.gameInfo = this.debugGameInfo.bind(this);
      game.debug.gameTimeInfo = this.debugGameTimeInfo.bind(this);
      this.display = {};
      if (!(options != null ? options.mode : void 0)) {
        this.mode = this.constructor.MODE_DEFAULT;
      }
      if (options) {
        Phaser.Utils.extend(this, options);
      }
    };

    AdvancedTimingPlugin.prototype.update = function() {
      this.group.visible = this.visible;
      if (this.visible) {
        if (this.graphGroup && this.graphGroup.visible) {
          this.updateGraph();
        }
        if (this.meters && this.meters.visible) {
          this.updateMeters();
        }
        if (this.text && this.text.visible) {
          this.updateText();
        }
      }
    };

    AdvancedTimingPlugin.prototype.destroy = function() {
      AdvancedTimingPlugin.__super__.destroy.apply(this, arguments);
      this.graph.destroy();
      this.group.destroy();
    };

    AdvancedTimingPlugin.prototype.add = function() {
      switch (this._mode) {
        case this.constructor.MODE_GRAPH:
          if (!this.graphGroup) {
            this.addGraph();
          }
          break;
        case this.constructor.MODE_METER:
          if (!this.meters) {
            this.addMeters();
          }
          break;
        case this.constructor.MODE_TEXT:
          if (!this.text) {
            this.addText();
          }
          break;
        default:
          throw new Error("Nothing to add (bad mode: " + this._mode + ")");
      }
    };

    AdvancedTimingPlugin.prototype.addGraph = function(x, y) {
      var desiredFps, desiredMs, height, ref, style, width;
      if (x == null) {
        x = this.position.x;
      }
      if (y == null) {
        y = this.position.y;
      }
      desiredFps = this.game.time.desiredFps;
      desiredMs = this.desiredMs();
      style = {
        fill: "white",
        font: "10px monospace"
      };
      this.graphGroup = this.game.add.group(this.group, "advancedTimingPluginGraphGroup");
      this.graph = this.game.make.bitmapData(60, 60, "advancedTimingPluginGraph");
      this.graph.fill(0, 0, 0);
      this.graphX = 0;
      this.graphImage = this.game.add.image(x, y, this.graph, null, this.graphGroup);
      this.graphImage.alpha = this.alpha;
      this.graphImage.scale.set(2);
      this.graphImage.smoothed = false;
      ref = this.graphImage, width = ref.width, height = ref.height;
      y = this.graphImage.scale.y;
      this.game.add.text(width, height - y * desiredFps, desiredFps + " fps", style, this.graphGroup);
      this.game.add.text(width, height - y * desiredMs, desiredMs + " ms", style, this.graphGroup);
      this.display[this.constructor.MODE_GRAPH] = this.graphGroup;
    };

    AdvancedTimingPlugin.prototype.addMeters = function(x, y) {
      var bt, hexColors, px;
      if (x == null) {
        x = this.position.x;
      }
      if (y == null) {
        y = this.position.y;
      }
      hexColors = this.constructor.hexColors;
      bt = this.game.make.bitmapData(1, 1).fill(255, 255, 255);
      px = bt.generateTexture("advancedTimingPlugin:pixel");
      bt.destroy();
      this.meters = this.game.add.group(this.group, "advancedTimingPluginMeters");
      this.meters.alpha = this.alpha;
      this.meters.classType = Phaser.Image;
      this.meters.x = x;
      this.meters.y = y;
      this.desiredFpsMeter = this.meters.create(0, 0, px);
      this.desiredFpsMeter.height = 10;
      this.desiredFpsMeter.tint = hexColors.GRAY;
      this.fpsMeter = this.meters.create(0, 0, px);
      this.fpsMeter.height = 10;
      this.fpsMeter.tint = hexColors.BLUE;
      this.desiredMsMeter = this.meters.create(0, 10, px);
      this.desiredMsMeter.height = 10;
      this.desiredMsMeter.tint = hexColors.GRAY;
      this.elapsedMeter = this.meters.create(0, 10, px);
      this.elapsedMeter.height = 10;
      this.elapsedMeter.tint = hexColors.GREEN;
      this.msMeter = this.meters.create(0, 10, px);
      this.msMeter.height = 10;
      this.msMeter.tint = hexColors.YELLOW;
      this.display[this.constructor.MODE_METER] = this.meters;
    };

    AdvancedTimingPlugin.prototype.addText = function(x, y) {
      if (x == null) {
        x = this.position.x;
      }
      if (y == null) {
        y = this.position.y;
      }
      this.text = this.game.add.text(x, y, null, {
        fill: this.constructor.colors.WHITE,
        font: this.game.debug.font
      }, this.group);
      this.text.name = "advancedTimingPluginText";
      this.display[this.constructor.MODE_TEXT] = this.text;
    };

    AdvancedTimingPlugin.prototype.debugGameInfo = function(x, y, color) {
      var debug, game;
      game = this.game;
      debug = game.debug;
      debug.start(x, y, color);
      debug.line("forceSingleUpdate:  " + game.forceSingleUpdate);
      debug.line("lastCount:          " + game._lastCount);
      debug.line("lockRender:         " + game.lockRender);
      debug.line("renderType:         " + this.renderType);
      debug.line("spiraling:          " + game._spiraling);
      debug.line("updatesThisFrame:   " + game.updatesThisFrame);
      debug.stop();
    };

    AdvancedTimingPlugin.prototype.debugGameTimeInfo = function(x, y, color) {
      var debug, game, time;
      game = this.game;
      debug = game.debug, time = game.time;
      debug.start(x, y, color);
      debug.line("desiredFps:         " + time.desiredFps);
      debug.line("elapsed:            " + time.elapsed + " ms " + (this.elapsedRangeStr()));
      debug.line("elapsedMS:          " + time.elapsedMS + " ms");
      debug.line("fps:                " + time.fps + " " + (this.fpsRangeStr()));
      debug.line("physicsElapsedMS:   " + (time.physicsElapsedMS.toFixed(2)) + " ms");
      debug.line("slowMotion:         " + time.slowMotion);
      debug.line("suggestedFps:       " + time.suggestedFps);
      debug.stop();
    };

    AdvancedTimingPlugin.prototype.desiredMs = function() {
      return Math.ceil(1000 / this.game.time.desiredFps);
    };

    AdvancedTimingPlugin.prototype.elapsedRange = function() {
      return this.game.time.msMax - this.game.time.msMin;
    };

    AdvancedTimingPlugin.prototype.elapsedRangeStr = function() {
      var msMax, msMin, ref;
      ref = this.game.time, msMax = ref.msMax, msMin = ref.msMin;
      if (isFinite(msMax) && isFinite(msMin)) {
        return "(" + msMin + "–" + msMax + ")";
      } else {
        return "";
      }
    };

    AdvancedTimingPlugin.prototype.fpsColor = function(fps) {
      var colors, desiredFps;
      if (fps == null) {
        fps = this.game.time.fps;
      }
      desiredFps = this.game.time.desiredFps;
      colors = this.constructor.colors;
      switch (false) {
        case !(fps < (desiredFps / 2)):
          return colors.ORANGE;
        case !(fps < desiredFps):
          return colors.YELLOW;
        default:
          return colors.WHITE;
      }
    };

    AdvancedTimingPlugin.prototype.fpsRange = function() {
      return this.game.time.fpsMax - this.game.time.fpsMin;
    };

    AdvancedTimingPlugin.prototype.fpsRangeStr = function() {
      var fpsMax, fpsMin, ref;
      ref = this.game.time, fpsMax = ref.fpsMax, fpsMin = ref.fpsMin;
      if (isFinite(fpsMax) && isFinite(fpsMin)) {
        return "(" + fpsMin + "–" + fpsMax + ")";
      } else {
        return "";
      }
    };

    AdvancedTimingPlugin.prototype.onResume = function() {
      this.reset();
    };

    AdvancedTimingPlugin.prototype.refresh = function() {
      var name, obj, ref;
      ref = this.display;
      for (name in ref) {
        obj = ref[name];
        obj.visible = name === this._mode;
      }
    };

    AdvancedTimingPlugin.prototype.reset = function(fpsMin, fpsMax, msMin, msMax) {
      var time;
      if (fpsMin == null) {
        fpsMin = Infinity;
      }
      if (fpsMax == null) {
        fpsMax = 0;
      }
      if (msMin == null) {
        msMin = Infinity;
      }
      if (msMax == null) {
        msMax = 0;
      }
      time = this.game.time;
      time.fpsMin = fpsMin;
      time.fpsMax = fpsMax;
      time.msMin = msMin;
      time.msMax = msMax;
    };

    AdvancedTimingPlugin.prototype.resetElapsed = function() {
      var time;
      time = this.game.time;
      time.elapsed = time.now - time.prevTime;
    };

    AdvancedTimingPlugin.prototype.updateGraph = function() {
      var _spiraling, elapsed, elapsedMS, forceSingleUpdate, fps, graph, graphX, height, ref, ref1, updatesThisFrame;
      ref = this.game, forceSingleUpdate = ref.forceSingleUpdate, _spiraling = ref._spiraling, updatesThisFrame = ref.updatesThisFrame;
      ref1 = this.game.time, elapsed = ref1.elapsed, elapsedMS = ref1.elapsedMS, fps = ref1.fps;
      graph = this.graph, graphX = this.graphX;
      height = graph.height;
      graph.rect(this.graphX, 0, 1, height, "black").update();
      if (fps <= height) {
        graph.setPixel(graphX, height - fps, 0, 0x66, 0xff);
      }
      if (elapsed <= height) {
        graph.setPixel(graphX, height - elapsed, 0, 0xff, 0x66);
      }
      if (elapsed !== elapsedMS && elapsed <= height) {
        graph.setPixel(graphX, height - elapsedMS, 0xff, 0xff, 0);
      }
      if (!forceSingleUpdate) {
        graph.setPixel(graphX, height - updatesThisFrame, 0, 0x33, 0x99);
      }
      if (_spiraling > 0) {
        graph.setPixel(graphX, height - _spiraling, 0xff, 0x33, 0);
      }
      this.graphX += 1;
      this.graphX %= graph.width;
    };

    AdvancedTimingPlugin.prototype.updateMeters = function() {
      var desiredFps, elapsed, elapsedMS, fps, ref;
      ref = this.game.time, desiredFps = ref.desiredFps, elapsed = ref.elapsed, elapsedMS = ref.elapsedMS, fps = ref.fps;
      this.desiredFpsMeter.scale.x = desiredFps;
      this.fpsMeter.scale.x = fps;
      this.desiredMsMeter.scale.x = this.desiredMs();
      this.msMeter.scale.x = elapsedMS;
      this.elapsedMeter.scale.x = elapsed;
    };

    AdvancedTimingPlugin.prototype.updateText = function() {
      var fps;
      fps = this.game.time.fps;
      this.text.text = fps + " fps";
      this.text.style.fill = this.fpsColor(fps);
    };

    return AdvancedTimingPlugin;

  })(Phaser.Plugin);

}).call(this);