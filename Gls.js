// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
      define(['kaitai-struct/KaitaiStream'], factory);
    } else if (typeof module === 'object' && module.exports) {
      module.exports = factory(require('kaitai-struct/KaitaiStream'));
    } else {
      root.Gls = factory(root.KaitaiStream);
    }
  }(typeof self !== 'undefined' ? self : this, function (KaitaiStream) {
  var Gls = (function() {
    Gls.FileFormats = Object.freeze({
      WAV: 0,
      OGG: 1,
  
      0: "WAV",
      1: "OGG",
    });
  
    Gls.BandTypes = Object.freeze({
      SINUS: 0,
      ARCTAN: 1,
      HARDCLIP: 2,
      FUZZYMOUTH: 3,
      INYOURFUZZ: 4,
      FUZZYBOOTS: 5,
      SMOOTH: 6,
  
      0: "SINUS",
      1: "ARCTAN",
      2: "HARDCLIP",
      3: "FUZZYMOUTH",
      4: "INYOURFUZZ",
      5: "FUZZYBOOTS",
      6: "SMOOTH",
    });
  
    Gls.Waveforms = Object.freeze({
      TRIANGLE: 0,
      SINUS: 1,
      SAWTOOTH: 2,
      SQUARE: 3,
  
      0: "TRIANGLE",
      1: "SINUS",
      2: "SAWTOOTH",
      3: "SQUARE",
    });
  
    function Gls(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;
  
      this._read();
    }
    Gls.prototype._read = function() {
      this.magic = this._io.readBytes(4);
      if (!((KaitaiStream.byteArrayCompare(this.magic, [32, 115, 108, 103]) == 0))) {
        throw new KaitaiStream.ValidationNotEqualError([32, 115, 108, 103], this.magic, this._io, "/seq/0");
      }
      this.version = this._io.readU4le();
      this.mode = this._io.readU4le();
      this.bitrate = this._io.readU4le();
      this.noop = this._io.readBytes(32);
      this.numberOfEngineLoops = this._io.readU4le();
      this.numberOfExhaustLoops = this._io.readU4le();
      this.engineloopfiles = [];
      for (var i = 0; i < this.numberOfEngineLoops; i++) {
        this.engineloopfiles.push(new Loopfile(this._io, this, this._root));
      }
      this.startfile = new Startstopfile(this._io, this, this._root);
      this.stopfile = new Startstopfile(this._io, this, this._root);
      this.engineLoad = new Load(this._io, this, this._root);
      this.stopFadems = this._io.readU4le();
      this.startFadems = this._io.readU4le();
      this.startRpm = this._io.readU4le();
      this.startUseEqualPowerFade = this._io.readBitsIntBe(8);
      this._io.alignToByte();
      this.ignore = this._io.readBytes(3);
      this.rpmFadeMaxTimeMs = this._io.readU4le();
      this.exhaustLoops = [];
      for (var i = 0; i < this.numberOfExhaustLoops; i++) {
        this.exhaustLoops.push(new Loopfile(this._io, this, this._root));
      }
      this.exhaustLoad = new Load(this._io, this, this._root);
    }
  
    var Band = Gls.Band = (function() {
      function Band(_io, _parent, _root) {
        this._io = _io;
        this._parent = _parent;
        this._root = _root || this;
  
        this._read();
      }
      Band.prototype._read = function() {
        this.frequency = this._io.readF4le();
        this.gaindb = this._io.readF4le();
        this.qualityFactor = this._io.readF4le();
      }
  
      return Band;
    })();
  
    var Load = Gls.Load = (function() {
      function Load(_io, _parent, _root) {
        this._io = _io;
        this._parent = _parent;
        this._root = _root || this;
  
        this._read();
      }
      Load.prototype._read = function() {
        this.inputGain = this._io.readF4le();
        this.outputGain = this._io.readF4le();
        this.banddistortionLowMaxfrequency = this._io.readF4le();
        this.banddistortionMidMaxfrequency = this._io.readF4le();
        this.banddistortionLowType = this._io.readU4le();
        this.banddistortionMidType = this._io.readU4le();
        this.banddistortionHighType = this._io.readU4le();
        this.loadOrderDistortionBeforeEq = this._io.readBitsIntBe(8);
        this.loadInvertwetValue = this._io.readBitsIntBe(8);
        this._io.alignToByte();
        this.loadLoadpointsNumberOfLoadpoints = this._io.readU4le();
        this.loadpoints = [];
        for (var i = 0; i < this.loadLoadpointsNumberOfLoadpoints; i++) {
          this.loadpoints.push(new Loadpoint(this._io, this, this._root));
        }
        this.waveform = this._io.readU4le();
        this.loadLfoHarmonic = this._io.readU4le();
        this.loadLfoFadeStartRpm = this._io.readF4le();
        this.loadLfoFadeEndRpm = this._io.readF4le();
        this.loadLfoFadeMinScale = this._io.readF4le();
      }
  
      return Load;
    })();
  
    var Loadpoint = Gls.Loadpoint = (function() {
      function Loadpoint(_io, _parent, _root) {
        this._io = _io;
        this._parent = _parent;
        this._root = _root || this;
  
        this._read();
      }
      Loadpoint.prototype._read = function() {
        this.load = this._io.readF4le();
        this.wet = this._io.readF4le();
        this.dry = this._io.readF4le();
        this.gainDb = this._io.readF4le();
        this.eqNumBands = this._io.readU4le();
        this.band = [];
        for (var i = 0; i < this.eqNumBands; i++) {
          this.band.push(new Band(this._io, this, this._root));
        }
        this.banddistortionLowDrive = this._io.readF4le();
        this.banddistortionMidDrive = this._io.readF4le();
        this.banddistortionHighDrive = this._io.readF4le();
        this.lfoAmplitudedb = this._io.readF4le();
        this.lfoOffsetb = this._io.readF4le();
      }
  
      return Loadpoint;
    })();
  
    var Startstopfile = Gls.Startstopfile = (function() {
      function Startstopfile(_io, _parent, _root) {
        this._io = _io;
        this._parent = _parent;
        this._root = _root || this;
  
        this._read();
      }
      Startstopfile.prototype._read = function() {
        this.file = new File(this._io, this, this._root);
        this.gainVoltage = this._io.readF4le();
      }
  
      return Startstopfile;
    })();
  
    var Loopfile = Gls.Loopfile = (function() {
      function Loopfile(_io, _parent, _root) {
        this._io = _io;
        this._parent = _parent;
        this._root = _root || this;
  
        this._read();
      }
      Loopfile.prototype._read = function() {
        this.rpmMin = this._io.readF4le();
        this.rpmMax = this._io.readF4le();
        this.rpmRoot = this._io.readF4le();
        this.file = new File(this._io, this, this._root);
      }
  
      return Loopfile;
    })();
  
    var File = Gls.File = (function() {
      function File(_io, _parent, _root) {
        this._io = _io;
        this._parent = _parent;
        this._root = _root || this;
  
        this._read();
      }
      File.prototype._read = function() {
        this.fileFormat = this._io.readU4le();
        this.numberOfSamples = this._io.readU4le();
        this.filelength = this._io.readU4le();
        if (this.fileFormat == Gls.FileFormats.OGG) {
          this.filecontents = this._io.readBytes(this.filelength);
        }
        if (this.fileFormat == Gls.FileFormats.WAV) {
          this.filecontentswav = [];
          for (var i = 0; i < Math.floor(this.filelength / 2); i++) {
            this.filecontentswav.push(this._io.readS2le());
          }
        }
      }
  
      return File;
    })();
  
    return Gls;
  })();
  return Gls;
  }));
  