Array.prototype.remove = function(el) {
  return this.splice(this.indexOf(el), 1);
}
const InstrumentEnum = Object.freeze({
  BONGO: 0,
  KEYBOARD: 1,
  MEOW: 3,
  CYMBAL: 4,
  MARIMBA: 5,
  TAMBOURINE: 6,
  COWBELL: 7
})
const KeyEnum = Object.freeze({
  "A": 1,
  "D": 0,
  "1": 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "0": 0,
  " ": 0,
  "C": 1,
  "Q": 1,
  "W": 2,
  "E": 3,
  "R": 4,
  "T": 5,
  "Y": 6, // QWERTY-Layout
  "Z": 6, // QWERTZ-Layout
  "U": 7,
  "I": 8,
  "O": 9,
  "P": 0,
  "B": 1,
  "F": 1
})
const InstrumentPerKeyEnum = Object.freeze({
  "A": InstrumentEnum.BONGO,
  "D": InstrumentEnum.BONGO,
  "1": InstrumentEnum.KEYBOARD,
  "2": InstrumentEnum.KEYBOARD,
  "3": InstrumentEnum.KEYBOARD,
  "4": InstrumentEnum.KEYBOARD,
  "5": InstrumentEnum.KEYBOARD,
  "6": InstrumentEnum.KEYBOARD,
  "7": InstrumentEnum.KEYBOARD,
  "8": InstrumentEnum.KEYBOARD,
  "9": InstrumentEnum.KEYBOARD,
  "0": InstrumentEnum.KEYBOARD,
  " ": InstrumentEnum.MEOW,
  "C": InstrumentEnum.CYMBAL,
  "Q": InstrumentEnum.MARIMBA,
  "W": InstrumentEnum.MARIMBA,
  "E": InstrumentEnum.MARIMBA,
  "R": InstrumentEnum.MARIMBA,
  "T": InstrumentEnum.MARIMBA,
  "Y": InstrumentEnum.MARIMBA, // QWERTY-Layout
  "Z": InstrumentEnum.MARIMBA, // QWERTZ-Layout
  "U": InstrumentEnum.MARIMBA,
  "I": InstrumentEnum.MARIMBA,
  "O": InstrumentEnum.MARIMBA,
  "P": InstrumentEnum.MARIMBA,
  "B": InstrumentEnum.TAMBOURINE,
  "F": InstrumentEnum.COWBELL
})
const ClickKeyEquivalentEnum = Object.freeze({
  "1": "A",
  "2": " ",
  "3": "D"
})
const TapKeyEquivalentEnum = Object.freeze({
  "tap-left": {
    "BONGO": ["A"]
  },
  "tap-right": {
    "BONGO": ["D"],
    "CYMBAL": ["C"],
    "TAMBOURINE": ["B"],
    "COWBELL": ["F"]
  },
  "tap-space": {
    "MEOW": [" "]
  },
  "tap-1": {
    "KEYBOARD": ["1"],
    "MARIMBA": ["Q"]
  },
  "tap-2": {
    "KEYBOARD": ["2"],
    "MARIMBA": ["W"]
  },
  "tap-3": {
    "KEYBOARD": ["3"],
    "MARIMBA": ["E"]
  },
  "tap-4": {
    "KEYBOARD": ["4"],
    "MARIMBA": ["R"]
  },
  "tap-5": {
    "KEYBOARD": ["5"],
    "MARIMBA": ["T"]
  },
  "tap-6": {
    "KEYBOARD": ["6"],
    "MARIMBA": ["Y", "Z"]
  },
  "tap-7": {
    "KEYBOARD": ["7"],
    "MARIMBA": ["U"]
  },
  "tap-8": {
    "KEYBOARD": ["8"],
    "MARIMBA": ["I"]
  },
  "tap-9": {
    "KEYBOARD": ["9"],
    "MARIMBA": ["O"]
  },
  "tap-0": {
    "KEYBOARD": ["0"],
    "MARIMBA": ["P"]
  }
})
const TapKeysPerLayerEnum = Object.freeze({
  "layer-bongo": ["tap-left", "tap-right"],
  "layer-keyboard": ["tap-keys"],
  "layer-meow": ["tap-space"],
  "layer-cymbal": ["tap-right"],
  "layer-marimba": ["tap-keys"],
  "layer-tambourine": ["tap-right"],
  "layer-cowbell": ["tap-right"]
})
const LayersPerInstrumentEnum = Object.freeze({
  "layer-bongo": InstrumentEnum.BONGO,
  "layer-keyboard": InstrumentEnum.KEYBOARD,
  "layer-meow": InstrumentEnum.MEOW,
  "layer-cymbal": InstrumentEnum.CYMBAL,
  "layer-marimba": InstrumentEnum.MARIMBA,
  "layer-tambourine": InstrumentEnum.TAMBOURINE,
  "layer-cowbell": InstrumentEnum.COWBELL
})
var pressed = [];
var currentLayer;
var allLayers = [];
for (var tapKeysPerInstrument of Object.values(TapKeysPerLayerEnum)) {
  allLayers.push(...tapKeysPerInstrument);
}
allLayers = [...new Set(allLayers)];
$(document).ready(function() {
  lowLag.init({
    'urlPrefix': '../sounds/',
    'debug': 'none'
  });
  $.load("bongo", 0, 1);
  $.load("keyboard", 0, 9);
  $.load("marimba", 0, 9);
  $.loadSimple("meow");
  $.loadSimple("cymbal");
  $.loadSimple("tambourine");
  $.loadSimple("cowbell");
  $.layers("layer-bongo");
  $("select#select-instrument").on("change", function() {
    $.layers($(this).val());
  });
});
$.loadSimple = function(file) {
  for (i = 0; i <= 1; i++) {
    lowLag.load([file + ".mp3", file + ".wav"], file + i);
  }
}
$.load = function(file, start, end) {
  for (i = start; i <= end; i++) {
    lowLag.load([file + i + ".mp3", file + i + ".wav"], file + i);
  }
}
$.wait = function(callback, ms) {
  return window.setTimeout(callback, ms);
}
$.play = function(instrument, key, state) {
  var instrumentName = Object.keys(InstrumentEnum).find(k => InstrumentEnum[k] === instrument).toLowerCase();
  var commonKey = KeyEnum[key];
  if (commonKey !== undefined) {
    var id = "#" + (instrument == InstrumentEnum.MEOW ? "mouth" : "paw-" + ((instrument == InstrumentEnum.BONGO ? commonKey : commonKey <= 5 && commonKey != 0 ? 0 : 1) == 0 ? "left" : "right"));
    if (state == true) {
      if (jQuery.inArray(commonKey, pressed) !== -1) {
        return;
      }
      pressed.push(commonKey);
      if (instrument != InstrumentEnum.MEOW) {
        $(".instruments>div").each(function(index) {
          $(this).css("visibility", ($(this).attr("id") === instrumentName) ? "visible" : "hidden");
        });
      }
      lowLag.play(instrumentName + commonKey);
      $.layers(Object.keys(LayersPerInstrumentEnum).find(k => LayersPerInstrumentEnum[k] == instrument), true);
    } else {
      pressed.remove(commonKey);
    }
    $(id).css("background-position-x", (state ? "-800px" : "0"));
    if (typeof echoCompanions === "function") {
      echoCompanions(instrument, commonKey, state);
    }
  }
}
$.layers = function(selectedLayer) {
  if (selectedLayer !== currentLayer) {
    currentLayer = selectedLayer;
    var layers = TapKeysPerLayerEnum[selectedLayer];
    if (layers != undefined) {
      for (var layer of allLayers) {
        $("#" + layer).css("display", layers.includes(layer) ? "inline-block" : "none");
      }
      var instrument = LayersPerInstrumentEnum[selectedLayer];
      var instrumentName = Object.keys(InstrumentEnum).find(k => InstrumentEnum[k] === instrument).toLowerCase();
      if (instrument != InstrumentEnum.MEOW) {
        $(".instruments>div").each(function(index) {
          $(this).css("visibility", ($(this).attr("id") === instrumentName) ? "visible" : "hidden");
        });
      }
    }
    var layerPerKey = Object.keys(LayersPerInstrumentEnum);
    for (var i = 0; i < layerPerKey.length; i++) {
      if (layerPerKey[i] === selectedLayer) {
        $("select#select-instrument>option:eq(" + i + ")").prop("selected", true);
      }
    }
  }
}
$(document).bind("contextmenu", function(e) {
  e.preventDefault();
});
$(document).on("mousedown mouseup", function(e) {
  if (!window.matchMedia("(pointer: coarse)").matches && !$(e.target).is("a, a *")) {
    var keyboardEquivalent = ClickKeyEquivalentEnum[e.which];
    if (keyboardEquivalent != undefined) {
      var instrument = InstrumentPerKeyEnum[keyboardEquivalent.toUpperCase()];
      var key = KeyEnum[keyboardEquivalent.toUpperCase()];
      if (instrument != undefined && key != undefined) {
        $.play(instrument, key, e.type === "mousedown");
      }
    }
  }
});
$(document).on("keydown keyup", function(e) {
  var instrument = InstrumentPerKeyEnum[e.key.toUpperCase()];
  if (instrument != undefined) {
    e.preventDefault();
    $.play(instrument, e.key.toUpperCase(), e.type === "keydown");
  }
});
$(document).on("touchstart touchend", function(e) {
  if (e.target.classList.contains("layer")) {
    if (e.type === "touchstart") {
      $(e.target).addClass("highlight");
      $.layers(e.target.id, true);
    } else {
      $(e.target).removeClass("highlight");
    }
  } else {
    var instrument = LayersPerInstrumentEnum[currentLayer];
    if (instrument != undefined) {
      var keys = TapKeyEquivalentEnum[e.target.id];
      if (keys != undefined) {
        var instrumentName = Object.keys(InstrumentEnum).find(k => InstrumentEnum[k] === instrument);
        if (instrumentName != undefined && keys[instrumentName] != undefined) {
          for (var key of keys[instrumentName]) {
            if (key != undefined) {
              if (e.type === "touchstart") {
                $(e.target).addClass("highlight");
              } else {
                $(e.target).removeClass("highlight");
              }
              $.play(instrument, key, e.type === "touchstart");
            }
          }
        }
      }
    }
  }
});

var link_StrayRogue = "<a href=\"https://twitter.com/StrayRogue\" target=\"_blank\">@StrayRogue</a>";
var link_DitzyFlama = "<a href=\"https://twitter.com/DitzyFlama\" target=\"_blank\">@DitzyFlama</a>";
var link_EricHuber = "<a href=\"https://eric.gg/?utm_source=bongo.cat\" target=\"_blank\">Eric Huber</a>";
var i18n_map = {
  "Bongos": {
    "en": "Bongos",
    "ca": "Bongos"},
  "Cymbal": {
    "en": "Cymbal",
    "ca": "Plat"},
  "Cowbell": {
    "en": "Cowbell",
    "ca": "Esquellot"},
  "Tambourine": {
    "en": "Tambourine",
    "ca": "Pandereta"},
  "Meow": {
    "en": "Meow",
    "ca": "Miol"},
  "SPACE": {
    "en": "SPACE",
    "ca": "ESPAI"},
  "Piano": {
    "en": "Piano",
    "ca": "Piano"},
  "Marimba": {
    "en": "Marimba",
    "ca": "Marimba"},
  "Keyboard": {
    "en": "Keyboard",
    "ca": "Teclat"},
  "LEFT": {
    "en": "LEFT",
    "ca": "ESQUERRA"},
  "RIGHT": {
    "en": "RIGHT",
    "ca": "DRETA"},
  "MEOW": {
    "en": "MEOW",
    "ca": "MIOL"},
  "other-lang": {
    "en": "<a href=\"/?lang=ca\">En català</a>",
    "ca": "<a href=\"/?lang=en\">In English</a>"},
  "courtesy": {
    "en": "Art courtesy of "+link_StrayRogue,
    "ca": "Art per cortesia de "+link_StrayRogue},
  "meme": {
    "en": "Meme by "+link_DitzyFlama,
    "ca": "Meme de "+link_DitzyFlama},
  "website": {
    "en": "Website by "+link_EricHuber,
    "ca": "Lloc web d&#39"+link_EricHuber},
  "cookies": {
    "en": "This website uses cookies to analyze traffic via anonymized and aggregated data.",
    "ca": "Aquest lloc web utilitza galetes per analitzar el trànsit mitjançant dades agregades i anonimitzades."}
};

var supportedLanguages = {"ca": true, "en": true};
function preferredLang() {
  const urlParams = new URLSearchParams(window.location.search);
  var urlLang = urlParams.get("lang");
  if(urlLang !== null && supportedLanguages[urlLang]) {
    return urlLang;
  }

  var langs = window.navigator.languages;
  for(var i=0; i<langs.length; i++) {
    /* 2 is the length of ISO 639-1 language codes
     * which are the start of BCP-47 codes
     */
    var code = langs[i].substring(0, 2);
    var l = supportedLanguages[code];
    if(l) {
      return code;
    }
  }
  return "en";
};


function internationalize() {
  var lang = preferredLang();
  $("[i18n]").each(function() {
    var id = $(this).attr("i18n");
    this.innerHTML = i18n_map[id][lang];
  });
  $("html").attr("lang", lang);
}
window.addEventListener("languagechange", internationalize);
document.addEventListener("DOMContentLoaded", internationalize)

/* ----- Second cat (ginger kitten) -----
 * A decorative companion that fades in, echoes the player's hits a beat
 * later, and noodles on its own. It only knows bongos + meowing, voiced
 * higher (a kitten) via a small Web Audio pitch-shift over the existing
 * sounds. Plays no part in the instrument-switching logic of the main cat.
 */
var KittenAudio = (function() {
  var ctx = null, buffers = {};
  function context() {
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (AC) { ctx = new AC(); }
    }
    return ctx;
  }
  function resume() {
    var c = context();
    if (c && c.state === "suspended") { c.resume(); }
  }
  function load(name, url) {
    var c = context();
    if (!c) { return; }
    fetch(url).then(function(r) { return r.arrayBuffer(); })
      .then(function(data) { return c.decodeAudioData(data); })
      .then(function(decoded) { buffers[name] = decoded; })
      .catch(function() {});
  }
  function play(name, rate) {
    var c = context();
    if (!c) { return; }
    resume();
    var b = buffers[name];
    if (!b) { return; }
    var src = c.createBufferSource();
    src.buffer = b;
    src.playbackRate.value = rate || 1;
    src.connect(c.destination);
    src.start(0);
  }
  return { load: load, play: play, resume: resume };
})();

var ECHO_MS = 320;  // how long after the player a companion answers

// Build a companion bound to an element id prefix (e.g. "cat2"). Each one
// echoes the player's hits a beat later and noodles on its own bongos.
function makeCompanion(prefix, opts) {
  opts = opts || {};
  var meowRate = opts.meowRate || 1.5;
  var bongoRate = opts.bongoRate || 1.25;
  var active = false;

  function setPress(part, pressed) {
    $("#" + prefix + "-" + part).css("background-position-x", pressed ? "-800px" : "0");
  }
  function targetPart(instrument, commonKey) {
    if (instrument === InstrumentEnum.MEOW) { return "mouth"; }
    var left = (instrument === InstrumentEnum.BONGO ? commonKey
      : (commonKey <= 5 && commonKey != 0 ? 0 : 1)) == 0;
    return "paw-" + (left ? "left" : "right");
  }
  function echo(instrument, commonKey, state) {
    if (!active) { return; }
    var isMeow = instrument === InstrumentEnum.MEOW;
    var part = targetPart(instrument, commonKey);
    $.wait(function() {
      setPress(part, state);
      if (state) {
        if (isMeow) { KittenAudio.play("meow", meowRate); }
        else { KittenAudio.play(part.indexOf("left") >= 0 ? "bongo1" : "bongo0", bongoRate); }
      }
    }, ECHO_MS);
  }
  function tap(part, sound, rate) {
    setPress(part, true);
    KittenAudio.play(sound, rate);
    $.wait(function() { setPress(part, false); }, 130);
  }
  function noodle() {
    if (!active) { return; }
    if (Math.random() < 0.25) {
      tap("mouth", "meow", meowRate);
    } else {
      var left = Math.random() < 0.5;
      tap(left ? "paw-left" : "paw-right", left ? "bongo1" : "bongo0", bongoRate);
    }
    schedule();
  }
  function schedule() {
    $.wait(noodle, 2500 + Math.random() * 4000);
  }
  function activate() {
    if (active) { return; }
    active = true;
    $("#" + prefix).addClass("active");
    schedule();
  }
  return { echo: echo, activate: activate };
}

var companions = [];
function echoCompanions(instrument, commonKey, state) {
  for (var i = 0; i < companions.length; i++) {
    companions[i].echo(instrument, commonKey, state);
  }
}

$(document).ready(function() {
  KittenAudio.load("meow", "sounds/meow.mp3");
  KittenAudio.load("bongo0", "sounds/bongo0.mp3");
  KittenAudio.load("bongo1", "sounds/bongo1.mp3");
  var resumeOnce = function() {
    KittenAudio.resume();
    document.removeEventListener("keydown", resumeOnce);
    document.removeEventListener("mousedown", resumeOnce);
    document.removeEventListener("touchstart", resumeOnce);
  };
  document.addEventListener("keydown", resumeOnce);
  document.addEventListener("mousedown", resumeOnce);
  document.addEventListener("touchstart", resumeOnce);

  var orange = makeCompanion("cat2", { meowRate: 1.5, bongoRate: 1.25 });
  var blue = makeCompanion("cat3", { meowRate: 1.7, bongoRate: 1.4 });
  companions.push(orange, blue);

  // Staged surprise: orange kitten after one minute, blue one after three.
  $.wait(function() { orange.activate(); }, 60000);
  $.wait(function() { blue.activate(); }, 180000);
});
