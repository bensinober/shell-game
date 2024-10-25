/**
 * Relu Activation, aka Rectified Linear Unit Activation
 * @description https://en.wikipedia.org/wiki/Rectifier_(neural_networks)
 */
function activate$3(weight) {
    return Math.max(0, weight);
}
/**
 * Relu derivative
 */
function measure$3(weight, delta) {
    if (weight <= 0) {
        return 0;
    }
    return delta;
}

var relu$2 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    activate: activate$3,
    measure: measure$3
});

/**
 * sigmoid activation
 */
function activate$2(value) {
    return 1 / (1 + Math.exp(-value));
}
/**
 * sigmoid derivative
 */
function measure$2(weight, error) {
    return weight * (1 - weight) * error;
}

var sigmoid$2 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    activate: activate$2,
    measure: measure$2
});

/**
 * Hyperbolic tan
 */
function activate$1(weight) {
    return Math.tanh(weight);
}
/**
 * @description grad for z = tanh(x) is (1 - z^2)
 */
function measure$1(weight, error) {
    return (1 - weight * weight) * error;
}

var tanh$2 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    activate: activate$1,
    measure: measure$1
});

/**
 * Leaky Relu Activation, aka Leaky Rectified Linear Unit Activation
 * @description https://en.wikipedia.org/wiki/Rectifier_(neural_networks)
 */
function activate(weight) {
    return weight > 0 ? weight : 0.01 * weight;
}
/**
 * Leaky Relu derivative
 */
function measure(weight, error) {
    return weight > 0 ? error : 0.01 * error;
}

var leakyRelu$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    activate: activate,
    measure: measure
});

var index$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    relu: relu$2,
    sigmoid: sigmoid$2,
    tanh: tanh$2,
    leakyRelu: leakyRelu$1
});

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, basedir, module) {
  return module = {
    path: basedir,
    exports: {},
    require: function (path, base) {
      return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
    }
  }, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
  throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var gpuBrowser = createCommonjsModule(function (module, exports) {
/**
 * gpu.js
 * http://gpu.rocks/
 *
 * GPU Accelerated JavaScript
 *
 * @version 2.16.0
 * @date Wed Nov 16 2022 15:48:37 GMT-0500 (Eastern Standard Time)
 *
 * @license MIT
 * The MIT License
 *
 * Copyright (c) 2022 gpu.js Team
 */(function(f){{module.exports=f();}})(function(){return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof commonjsRequire&&commonjsRequire;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t);}return n[i].exports}for(var u="function"==typeof commonjsRequire&&commonjsRequire,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  (global = global || self, factory(global.acorn = {}));
}(this, function (exports) {

  var reservedWords = {
    3: "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile",
    5: "class enum extends super const export import",
    6: "enum",
    strict: "implements interface let package private protected public static yield",
    strictBind: "eval arguments"
  };


  var ecma5AndLessKeywords = "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this";

  var keywords = {
    5: ecma5AndLessKeywords,
    "5module": ecma5AndLessKeywords + " export import",
    6: ecma5AndLessKeywords + " const class extends export import super"
  };

  var keywordRelationalOperator = /^in(stanceof)?$/;


  var nonASCIIidentifierStartChars = "\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u037f\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u052f\u0531-\u0556\u0559\u0560-\u0588\u05d0-\u05ea\u05ef-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u0860-\u086a\u08a0-\u08b4\u08b6-\u08bd\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u09fc\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0af9\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c39\u0c3d\u0c58-\u0c5a\u0c60\u0c61\u0c80\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d54-\u0d56\u0d5f-\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e86-\u0e8a\u0e8c-\u0ea3\u0ea5\u0ea7-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f5\u13f8-\u13fd\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f8\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1878\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191e\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19b0-\u19c9\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4b\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1c80-\u1c88\u1c90-\u1cba\u1cbd-\u1cbf\u1ce9-\u1cec\u1cee-\u1cf3\u1cf5\u1cf6\u1cfa\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2118-\u211d\u2124\u2126\u2128\u212a-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309b-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312f\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fef\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua69d\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua7bf\ua7c2-\ua7c6\ua7f7-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua8fd\ua8fe\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\ua9e0-\ua9e4\ua9e6-\ua9ef\ua9fa-\ua9fe\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa7e-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uab30-\uab5a\uab5c-\uab67\uab70-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc";
  var nonASCIIidentifierChars = "\u200c\u200d\xb7\u0300-\u036f\u0387\u0483-\u0487\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u0669\u0670\u06d6-\u06dc\u06df-\u06e4\u06e7\u06e8\u06ea-\u06ed\u06f0-\u06f9\u0711\u0730-\u074a\u07a6-\u07b0\u07c0-\u07c9\u07eb-\u07f3\u07fd\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0859-\u085b\u08d3-\u08e1\u08e3-\u0903\u093a-\u093c\u093e-\u094f\u0951-\u0957\u0962\u0963\u0966-\u096f\u0981-\u0983\u09bc\u09be-\u09c4\u09c7\u09c8\u09cb-\u09cd\u09d7\u09e2\u09e3\u09e6-\u09ef\u09fe\u0a01-\u0a03\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a66-\u0a71\u0a75\u0a81-\u0a83\u0abc\u0abe-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ae2\u0ae3\u0ae6-\u0aef\u0afa-\u0aff\u0b01-\u0b03\u0b3c\u0b3e-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b66-\u0b6f\u0b82\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd7\u0be6-\u0bef\u0c00-\u0c04\u0c3e-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0c66-\u0c6f\u0c81-\u0c83\u0cbc\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0ce6-\u0cef\u0d00-\u0d03\u0d3b\u0d3c\u0d3e-\u0d44\u0d46-\u0d48\u0d4a-\u0d4d\u0d57\u0d62\u0d63\u0d66-\u0d6f\u0d82\u0d83\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0de6-\u0def\u0df2\u0df3\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0e50-\u0e59\u0eb1\u0eb4-\u0ebc\u0ec8-\u0ecd\u0ed0-\u0ed9\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f3e\u0f3f\u0f71-\u0f84\u0f86\u0f87\u0f8d-\u0f97\u0f99-\u0fbc\u0fc6\u102b-\u103e\u1040-\u1049\u1056-\u1059\u105e-\u1060\u1062-\u1064\u1067-\u106d\u1071-\u1074\u1082-\u108d\u108f-\u109d\u135d-\u135f\u1369-\u1371\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b4-\u17d3\u17dd\u17e0-\u17e9\u180b-\u180d\u1810-\u1819\u18a9\u1920-\u192b\u1930-\u193b\u1946-\u194f\u19d0-\u19da\u1a17-\u1a1b\u1a55-\u1a5e\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1ab0-\u1abd\u1b00-\u1b04\u1b34-\u1b44\u1b50-\u1b59\u1b6b-\u1b73\u1b80-\u1b82\u1ba1-\u1bad\u1bb0-\u1bb9\u1be6-\u1bf3\u1c24-\u1c37\u1c40-\u1c49\u1c50-\u1c59\u1cd0-\u1cd2\u1cd4-\u1ce8\u1ced\u1cf4\u1cf7-\u1cf9\u1dc0-\u1df9\u1dfb-\u1dff\u203f\u2040\u2054\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2cef-\u2cf1\u2d7f\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua620-\ua629\ua66f\ua674-\ua67d\ua69e\ua69f\ua6f0\ua6f1\ua802\ua806\ua80b\ua823-\ua827\ua880\ua881\ua8b4-\ua8c5\ua8d0-\ua8d9\ua8e0-\ua8f1\ua8ff-\ua909\ua926-\ua92d\ua947-\ua953\ua980-\ua983\ua9b3-\ua9c0\ua9d0-\ua9d9\ua9e5\ua9f0-\ua9f9\uaa29-\uaa36\uaa43\uaa4c\uaa4d\uaa50-\uaa59\uaa7b-\uaa7d\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uaaeb-\uaaef\uaaf5\uaaf6\uabe3-\uabea\uabec\uabed\uabf0-\uabf9\ufb1e\ufe00-\ufe0f\ufe20-\ufe2f\ufe33\ufe34\ufe4d-\ufe4f\uff10-\uff19\uff3f";

  var nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]");
  var nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");

  nonASCIIidentifierStartChars = nonASCIIidentifierChars = null;


  var astralIdentifierStartCodes = [0,11,2,25,2,18,2,1,2,14,3,13,35,122,70,52,268,28,4,48,48,31,14,29,6,37,11,29,3,35,5,7,2,4,43,157,19,35,5,35,5,39,9,51,157,310,10,21,11,7,153,5,3,0,2,43,2,1,4,0,3,22,11,22,10,30,66,18,2,1,11,21,11,25,71,55,7,1,65,0,16,3,2,2,2,28,43,28,4,28,36,7,2,27,28,53,11,21,11,18,14,17,111,72,56,50,14,50,14,35,477,28,11,0,9,21,155,22,13,52,76,44,33,24,27,35,30,0,12,34,4,0,13,47,15,3,22,0,2,0,36,17,2,24,85,6,2,0,2,3,2,14,2,9,8,46,39,7,3,1,3,21,2,6,2,1,2,4,4,0,19,0,13,4,159,52,19,3,21,0,33,47,21,1,2,0,185,46,42,3,37,47,21,0,60,42,14,0,72,26,230,43,117,63,32,0,161,7,3,38,17,0,2,0,29,0,11,39,8,0,22,0,12,45,20,0,35,56,264,8,2,36,18,0,50,29,113,6,2,1,2,37,22,0,26,5,2,1,2,31,15,0,328,18,270,921,103,110,18,195,2749,1070,4050,582,8634,568,8,30,114,29,19,47,17,3,32,20,6,18,689,63,129,74,6,0,67,12,65,1,2,0,29,6135,9,754,9486,286,50,2,18,3,9,395,2309,106,6,12,4,8,8,9,5991,84,2,70,2,1,3,0,3,1,3,3,2,11,2,0,2,6,2,64,2,3,3,7,2,6,2,27,2,3,2,4,2,0,4,6,2,339,3,24,2,24,2,30,2,24,2,30,2,24,2,30,2,24,2,30,2,24,2,7,2357,44,11,6,17,0,370,43,1301,196,60,67,8,0,1205,3,2,26,2,1,2,0,3,0,2,9,2,3,2,0,2,0,7,0,5,0,2,0,2,0,2,2,2,1,2,0,3,0,2,0,2,0,2,0,2,0,2,1,2,0,3,3,2,6,2,3,2,3,2,0,2,9,2,16,6,2,2,4,2,16,4421,42710,42,4148,12,221,3,5761,15,7472,3104,541];

  var astralIdentifierCodes = [509,0,227,0,150,4,294,9,1368,2,2,1,6,3,41,2,5,0,166,1,574,3,9,9,525,10,176,2,54,14,32,9,16,3,46,10,54,9,7,2,37,13,2,9,6,1,45,0,13,2,49,13,9,3,4,9,83,11,7,0,161,11,6,9,7,3,56,1,2,6,3,1,3,2,10,0,11,1,3,6,4,4,193,17,10,9,5,0,82,19,13,9,214,6,3,8,28,1,83,16,16,9,82,12,9,9,84,14,5,9,243,14,166,9,232,6,3,6,4,0,29,9,41,6,2,3,9,0,10,10,47,15,406,7,2,7,17,9,57,21,2,13,123,5,4,0,2,1,2,6,2,0,9,9,49,4,2,1,2,4,9,9,330,3,19306,9,135,4,60,6,26,9,1014,0,2,54,8,3,19723,1,5319,4,4,5,9,7,3,6,31,3,149,2,1418,49,513,54,5,49,9,0,15,0,23,4,2,14,1361,6,2,16,3,6,2,1,2,4,262,6,10,9,419,13,1495,6,110,6,6,9,792487,239];

  function isInAstralSet(code, set) {
    var pos = 0x10000;
    for (var i = 0; i < set.length; i += 2) {
      pos += set[i];
      if (pos > code) { return false }
      pos += set[i + 1];
      if (pos >= code) { return true }
    }
  }


  function isIdentifierStart(code, astral) {
    if (code < 65) { return code === 36 }
    if (code < 91) { return true }
    if (code < 97) { return code === 95 }
    if (code < 123) { return true }
    if (code <= 0xffff) { return code >= 0xaa && nonASCIIidentifierStart.test(String.fromCharCode(code)) }
    if (astral === false) { return false }
    return isInAstralSet(code, astralIdentifierStartCodes)
  }


  function isIdentifierChar(code, astral) {
    if (code < 48) { return code === 36 }
    if (code < 58) { return true }
    if (code < 65) { return false }
    if (code < 91) { return true }
    if (code < 97) { return code === 95 }
    if (code < 123) { return true }
    if (code <= 0xffff) { return code >= 0xaa && nonASCIIidentifier.test(String.fromCharCode(code)) }
    if (astral === false) { return false }
    return isInAstralSet(code, astralIdentifierStartCodes) || isInAstralSet(code, astralIdentifierCodes)
  }





  var TokenType = function TokenType(label, conf) {
    if ( conf === void 0 ) conf = {};

    this.label = label;
    this.keyword = conf.keyword;
    this.beforeExpr = !!conf.beforeExpr;
    this.startsExpr = !!conf.startsExpr;
    this.isLoop = !!conf.isLoop;
    this.isAssign = !!conf.isAssign;
    this.prefix = !!conf.prefix;
    this.postfix = !!conf.postfix;
    this.binop = conf.binop || null;
    this.updateContext = null;
  };

  function binop(name, prec) {
    return new TokenType(name, {beforeExpr: true, binop: prec})
  }
  var beforeExpr = {beforeExpr: true}, startsExpr = {startsExpr: true};


  var keywords$1 = {};

  function kw(name, options) {
    if ( options === void 0 ) options = {};

    options.keyword = name;
    return keywords$1[name] = new TokenType(name, options)
  }

  var types = {
    num: new TokenType("num", startsExpr),
    regexp: new TokenType("regexp", startsExpr),
    string: new TokenType("string", startsExpr),
    name: new TokenType("name", startsExpr),
    eof: new TokenType("eof"),

    bracketL: new TokenType("[", {beforeExpr: true, startsExpr: true}),
    bracketR: new TokenType("]"),
    braceL: new TokenType("{", {beforeExpr: true, startsExpr: true}),
    braceR: new TokenType("}"),
    parenL: new TokenType("(", {beforeExpr: true, startsExpr: true}),
    parenR: new TokenType(")"),
    comma: new TokenType(",", beforeExpr),
    semi: new TokenType(";", beforeExpr),
    colon: new TokenType(":", beforeExpr),
    dot: new TokenType("."),
    question: new TokenType("?", beforeExpr),
    arrow: new TokenType("=>", beforeExpr),
    template: new TokenType("template"),
    invalidTemplate: new TokenType("invalidTemplate"),
    ellipsis: new TokenType("...", beforeExpr),
    backQuote: new TokenType("`", startsExpr),
    dollarBraceL: new TokenType("${", {beforeExpr: true, startsExpr: true}),


    eq: new TokenType("=", {beforeExpr: true, isAssign: true}),
    assign: new TokenType("_=", {beforeExpr: true, isAssign: true}),
    incDec: new TokenType("++/--", {prefix: true, postfix: true, startsExpr: true}),
    prefix: new TokenType("!/~", {beforeExpr: true, prefix: true, startsExpr: true}),
    logicalOR: binop("||", 1),
    logicalAND: binop("&&", 2),
    bitwiseOR: binop("|", 3),
    bitwiseXOR: binop("^", 4),
    bitwiseAND: binop("&", 5),
    equality: binop("==/!=/===/!==", 6),
    relational: binop("</>/<=/>=", 7),
    bitShift: binop("<</>>/>>>", 8),
    plusMin: new TokenType("+/-", {beforeExpr: true, binop: 9, prefix: true, startsExpr: true}),
    modulo: binop("%", 10),
    star: binop("*", 10),
    slash: binop("/", 10),
    starstar: new TokenType("**", {beforeExpr: true}),

    _break: kw("break"),
    _case: kw("case", beforeExpr),
    _catch: kw("catch"),
    _continue: kw("continue"),
    _debugger: kw("debugger"),
    _default: kw("default", beforeExpr),
    _do: kw("do", {isLoop: true, beforeExpr: true}),
    _else: kw("else", beforeExpr),
    _finally: kw("finally"),
    _for: kw("for", {isLoop: true}),
    _function: kw("function", startsExpr),
    _if: kw("if"),
    _return: kw("return", beforeExpr),
    _switch: kw("switch"),
    _throw: kw("throw", beforeExpr),
    _try: kw("try"),
    _var: kw("var"),
    _const: kw("const"),
    _while: kw("while", {isLoop: true}),
    _with: kw("with"),
    _new: kw("new", {beforeExpr: true, startsExpr: true}),
    _this: kw("this", startsExpr),
    _super: kw("super", startsExpr),
    _class: kw("class", startsExpr),
    _extends: kw("extends", beforeExpr),
    _export: kw("export"),
    _import: kw("import", startsExpr),
    _null: kw("null", startsExpr),
    _true: kw("true", startsExpr),
    _false: kw("false", startsExpr),
    _in: kw("in", {beforeExpr: true, binop: 7}),
    _instanceof: kw("instanceof", {beforeExpr: true, binop: 7}),
    _typeof: kw("typeof", {beforeExpr: true, prefix: true, startsExpr: true}),
    _void: kw("void", {beforeExpr: true, prefix: true, startsExpr: true}),
    _delete: kw("delete", {beforeExpr: true, prefix: true, startsExpr: true})
  };


  var lineBreak = /\r\n?|\n|\u2028|\u2029/;
  var lineBreakG = new RegExp(lineBreak.source, "g");

  function isNewLine(code, ecma2019String) {
    return code === 10 || code === 13 || (!ecma2019String && (code === 0x2028 || code === 0x2029))
  }

  var nonASCIIwhitespace = /[\u1680\u2000-\u200a\u202f\u205f\u3000\ufeff]/;

  var skipWhiteSpace = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g;

  var ref = Object.prototype;
  var hasOwnProperty = ref.hasOwnProperty;
  var toString = ref.toString;


  function has(obj, propName) {
    return hasOwnProperty.call(obj, propName)
  }

  var isArray = Array.isArray || (function (obj) { return (
    toString.call(obj) === "[object Array]"
  ); });

  function wordsRegexp(words) {
    return new RegExp("^(?:" + words.replace(/ /g, "|") + ")$")
  }


  var Position = function Position(line, col) {
    this.line = line;
    this.column = col;
  };

  Position.prototype.offset = function offset (n) {
    return new Position(this.line, this.column + n)
  };

  var SourceLocation = function SourceLocation(p, start, end) {
    this.start = start;
    this.end = end;
    if (p.sourceFile !== null) { this.source = p.sourceFile; }
  };


  function getLineInfo(input, offset) {
    for (var line = 1, cur = 0;;) {
      lineBreakG.lastIndex = cur;
      var match = lineBreakG.exec(input);
      if (match && match.index < offset) {
        ++line;
        cur = match.index + match[0].length;
      } else {
        return new Position(line, offset - cur)
      }
    }
  }


  var defaultOptions = {
    ecmaVersion: 10,
    sourceType: "script",
    onInsertedSemicolon: null,
    onTrailingComma: null,
    allowReserved: null,
    allowReturnOutsideFunction: false,
    allowImportExportEverywhere: false,
    allowAwaitOutsideFunction: false,
    allowHashBang: false,
    locations: false,
    onToken: null,
    onComment: null,
    ranges: false,
    program: null,
    sourceFile: null,
    directSourceFile: null,
    preserveParens: false
  };


  function getOptions(opts) {
    var options = {};

    for (var opt in defaultOptions)
      { options[opt] = opts && has(opts, opt) ? opts[opt] : defaultOptions[opt]; }

    if (options.ecmaVersion >= 2015)
      { options.ecmaVersion -= 2009; }

    if (options.allowReserved == null)
      { options.allowReserved = options.ecmaVersion < 5; }

    if (isArray(options.onToken)) {
      var tokens = options.onToken;
      options.onToken = function (token) { return tokens.push(token); };
    }
    if (isArray(options.onComment))
      { options.onComment = pushComment(options, options.onComment); }

    return options
  }

  function pushComment(options, array) {
    return function(block, text, start, end, startLoc, endLoc) {
      var comment = {
        type: block ? "Block" : "Line",
        value: text,
        start: start,
        end: end
      };
      if (options.locations)
        { comment.loc = new SourceLocation(this, startLoc, endLoc); }
      if (options.ranges)
        { comment.range = [start, end]; }
      array.push(comment);
    }
  }

  var
      SCOPE_TOP = 1,
      SCOPE_FUNCTION = 2,
      SCOPE_VAR = SCOPE_TOP | SCOPE_FUNCTION,
      SCOPE_ASYNC = 4,
      SCOPE_GENERATOR = 8,
      SCOPE_ARROW = 16,
      SCOPE_SIMPLE_CATCH = 32,
      SCOPE_SUPER = 64,
      SCOPE_DIRECT_SUPER = 128;

  function functionFlags(async, generator) {
    return SCOPE_FUNCTION | (async ? SCOPE_ASYNC : 0) | (generator ? SCOPE_GENERATOR : 0)
  }

  var
      BIND_NONE = 0, 
      BIND_VAR = 1, 
      BIND_LEXICAL = 2, 
      BIND_FUNCTION = 3, 
      BIND_SIMPLE_CATCH = 4, 
      BIND_OUTSIDE = 5; 

  var Parser = function Parser(options, input, startPos) {
    this.options = options = getOptions(options);
    this.sourceFile = options.sourceFile;
    this.keywords = wordsRegexp(keywords[options.ecmaVersion >= 6 ? 6 : options.sourceType === "module" ? "5module" : 5]);
    var reserved = "";
    if (options.allowReserved !== true) {
      for (var v = options.ecmaVersion;; v--)
        { if (reserved = reservedWords[v]) { break } }
      if (options.sourceType === "module") { reserved += " await"; }
    }
    this.reservedWords = wordsRegexp(reserved);
    var reservedStrict = (reserved ? reserved + " " : "") + reservedWords.strict;
    this.reservedWordsStrict = wordsRegexp(reservedStrict);
    this.reservedWordsStrictBind = wordsRegexp(reservedStrict + " " + reservedWords.strictBind);
    this.input = String(input);

    this.containsEsc = false;


    if (startPos) {
      this.pos = startPos;
      this.lineStart = this.input.lastIndexOf("\n", startPos - 1) + 1;
      this.curLine = this.input.slice(0, this.lineStart).split(lineBreak).length;
    } else {
      this.pos = this.lineStart = 0;
      this.curLine = 1;
    }

    this.type = types.eof;
    this.value = null;
    this.start = this.end = this.pos;
    this.startLoc = this.endLoc = this.curPosition();

    this.lastTokEndLoc = this.lastTokStartLoc = null;
    this.lastTokStart = this.lastTokEnd = this.pos;

    this.context = this.initialContext();
    this.exprAllowed = true;

    this.inModule = options.sourceType === "module";
    this.strict = this.inModule || this.strictDirective(this.pos);

    this.potentialArrowAt = -1;

    this.yieldPos = this.awaitPos = this.awaitIdentPos = 0;
    this.labels = [];
    this.undefinedExports = {};

    if (this.pos === 0 && options.allowHashBang && this.input.slice(0, 2) === "#!")
      { this.skipLineComment(2); }

    this.scopeStack = [];
    this.enterScope(SCOPE_TOP);

    this.regexpState = null;
  };

  var prototypeAccessors = { inFunction: { configurable: true },inGenerator: { configurable: true },inAsync: { configurable: true },allowSuper: { configurable: true },allowDirectSuper: { configurable: true },treatFunctionsAsVar: { configurable: true } };

  Parser.prototype.parse = function parse () {
    var node = this.options.program || this.startNode();
    this.nextToken();
    return this.parseTopLevel(node)
  };

  prototypeAccessors.inFunction.get = function () { return (this.currentVarScope().flags & SCOPE_FUNCTION) > 0 };
  prototypeAccessors.inGenerator.get = function () { return (this.currentVarScope().flags & SCOPE_GENERATOR) > 0 };
  prototypeAccessors.inAsync.get = function () { return (this.currentVarScope().flags & SCOPE_ASYNC) > 0 };
  prototypeAccessors.allowSuper.get = function () { return (this.currentThisScope().flags & SCOPE_SUPER) > 0 };
  prototypeAccessors.allowDirectSuper.get = function () { return (this.currentThisScope().flags & SCOPE_DIRECT_SUPER) > 0 };
  prototypeAccessors.treatFunctionsAsVar.get = function () { return this.treatFunctionsAsVarInScope(this.currentScope()) };

  Parser.prototype.inNonArrowFunction = function inNonArrowFunction () { return (this.currentThisScope().flags & SCOPE_FUNCTION) > 0 };

  Parser.extend = function extend () {
      var plugins = [], len = arguments.length;
      while ( len-- ) plugins[ len ] = arguments[ len ];

    var cls = this;
    for (var i = 0; i < plugins.length; i++) { cls = plugins[i](cls); }
    return cls
  };

  Parser.parse = function parse (input, options) {
    return new this(options, input).parse()
  };

  Parser.parseExpressionAt = function parseExpressionAt (input, pos, options) {
    var parser = new this(options, input, pos);
    parser.nextToken();
    return parser.parseExpression()
  };

  Parser.tokenizer = function tokenizer (input, options) {
    return new this(options, input)
  };

  Object.defineProperties( Parser.prototype, prototypeAccessors );

  var pp = Parser.prototype;


  var literal = /^(?:'((?:\\.|[^'])*?)'|"((?:\\.|[^"])*?)")/;
  pp.strictDirective = function(start) {
    for (;;) {
      skipWhiteSpace.lastIndex = start;
      start += skipWhiteSpace.exec(this.input)[0].length;
      var match = literal.exec(this.input.slice(start));
      if (!match) { return false }
      if ((match[1] || match[2]) === "use strict") { return true }
      start += match[0].length;

      skipWhiteSpace.lastIndex = start;
      start += skipWhiteSpace.exec(this.input)[0].length;
      if (this.input[start] === ";")
        { start++; }
    }
  };


  pp.eat = function(type) {
    if (this.type === type) {
      this.next();
      return true
    } else {
      return false
    }
  };


  pp.isContextual = function(name) {
    return this.type === types.name && this.value === name && !this.containsEsc
  };


  pp.eatContextual = function(name) {
    if (!this.isContextual(name)) { return false }
    this.next();
    return true
  };


  pp.expectContextual = function(name) {
    if (!this.eatContextual(name)) { this.unexpected(); }
  };


  pp.canInsertSemicolon = function() {
    return this.type === types.eof ||
      this.type === types.braceR ||
      lineBreak.test(this.input.slice(this.lastTokEnd, this.start))
  };

  pp.insertSemicolon = function() {
    if (this.canInsertSemicolon()) {
      if (this.options.onInsertedSemicolon)
        { this.options.onInsertedSemicolon(this.lastTokEnd, this.lastTokEndLoc); }
      return true
    }
  };


  pp.semicolon = function() {
    if (!this.eat(types.semi) && !this.insertSemicolon()) { this.unexpected(); }
  };

  pp.afterTrailingComma = function(tokType, notNext) {
    if (this.type === tokType) {
      if (this.options.onTrailingComma)
        { this.options.onTrailingComma(this.lastTokStart, this.lastTokStartLoc); }
      if (!notNext)
        { this.next(); }
      return true
    }
  };


  pp.expect = function(type) {
    this.eat(type) || this.unexpected();
  };


  pp.unexpected = function(pos) {
    this.raise(pos != null ? pos : this.start, "Unexpected token");
  };

  function DestructuringErrors() {
    this.shorthandAssign =
    this.trailingComma =
    this.parenthesizedAssign =
    this.parenthesizedBind =
    this.doubleProto =
      -1;
  }

  pp.checkPatternErrors = function(refDestructuringErrors, isAssign) {
    if (!refDestructuringErrors) { return }
    if (refDestructuringErrors.trailingComma > -1)
      { this.raiseRecoverable(refDestructuringErrors.trailingComma, "Comma is not permitted after the rest element"); }
    var parens = isAssign ? refDestructuringErrors.parenthesizedAssign : refDestructuringErrors.parenthesizedBind;
    if (parens > -1) { this.raiseRecoverable(parens, "Parenthesized pattern"); }
  };

  pp.checkExpressionErrors = function(refDestructuringErrors, andThrow) {
    if (!refDestructuringErrors) { return false }
    var shorthandAssign = refDestructuringErrors.shorthandAssign;
    var doubleProto = refDestructuringErrors.doubleProto;
    if (!andThrow) { return shorthandAssign >= 0 || doubleProto >= 0 }
    if (shorthandAssign >= 0)
      { this.raise(shorthandAssign, "Shorthand property assignments are valid only in destructuring patterns"); }
    if (doubleProto >= 0)
      { this.raiseRecoverable(doubleProto, "Redefinition of __proto__ property"); }
  };

  pp.checkYieldAwaitInDefaultParams = function() {
    if (this.yieldPos && (!this.awaitPos || this.yieldPos < this.awaitPos))
      { this.raise(this.yieldPos, "Yield expression cannot be a default value"); }
    if (this.awaitPos)
      { this.raise(this.awaitPos, "Await expression cannot be a default value"); }
  };

  pp.isSimpleAssignTarget = function(expr) {
    if (expr.type === "ParenthesizedExpression")
      { return this.isSimpleAssignTarget(expr.expression) }
    return expr.type === "Identifier" || expr.type === "MemberExpression"
  };

  var pp$1 = Parser.prototype;



  pp$1.parseTopLevel = function(node) {
    var exports = {};
    if (!node.body) { node.body = []; }
    while (this.type !== types.eof) {
      var stmt = this.parseStatement(null, true, exports);
      node.body.push(stmt);
    }
    if (this.inModule)
      { for (var i = 0, list = Object.keys(this.undefinedExports); i < list.length; i += 1)
        {
          var name = list[i];

          this.raiseRecoverable(this.undefinedExports[name].start, ("Export '" + name + "' is not defined"));
        } }
    this.adaptDirectivePrologue(node.body);
    this.next();
    node.sourceType = this.options.sourceType;
    return this.finishNode(node, "Program")
  };

  var loopLabel = {kind: "loop"}, switchLabel = {kind: "switch"};

  pp$1.isLet = function(context) {
    if (this.options.ecmaVersion < 6 || !this.isContextual("let")) { return false }
    skipWhiteSpace.lastIndex = this.pos;
    var skip = skipWhiteSpace.exec(this.input);
    var next = this.pos + skip[0].length, nextCh = this.input.charCodeAt(next);
    if (nextCh === 91) { return true } 
    if (context) { return false }

    if (nextCh === 123) { return true } 
    if (isIdentifierStart(nextCh, true)) {
      var pos = next + 1;
      while (isIdentifierChar(this.input.charCodeAt(pos), true)) { ++pos; }
      var ident = this.input.slice(next, pos);
      if (!keywordRelationalOperator.test(ident)) { return true }
    }
    return false
  };

  pp$1.isAsyncFunction = function() {
    if (this.options.ecmaVersion < 8 || !this.isContextual("async"))
      { return false }

    skipWhiteSpace.lastIndex = this.pos;
    var skip = skipWhiteSpace.exec(this.input);
    var next = this.pos + skip[0].length;
    return !lineBreak.test(this.input.slice(this.pos, next)) &&
      this.input.slice(next, next + 8) === "function" &&
      (next + 8 === this.input.length || !isIdentifierChar(this.input.charAt(next + 8)))
  };


  pp$1.parseStatement = function(context, topLevel, exports) {
    var starttype = this.type, node = this.startNode(), kind;

    if (this.isLet(context)) {
      starttype = types._var;
      kind = "let";
    }


    switch (starttype) {
    case types._break: case types._continue: return this.parseBreakContinueStatement(node, starttype.keyword)
    case types._debugger: return this.parseDebuggerStatement(node)
    case types._do: return this.parseDoStatement(node)
    case types._for: return this.parseForStatement(node)
    case types._function:
      if ((context && (this.strict || context !== "if" && context !== "label")) && this.options.ecmaVersion >= 6) { this.unexpected(); }
      return this.parseFunctionStatement(node, false, !context)
    case types._class:
      if (context) { this.unexpected(); }
      return this.parseClass(node, true)
    case types._if: return this.parseIfStatement(node)
    case types._return: return this.parseReturnStatement(node)
    case types._switch: return this.parseSwitchStatement(node)
    case types._throw: return this.parseThrowStatement(node)
    case types._try: return this.parseTryStatement(node)
    case types._const: case types._var:
      kind = kind || this.value;
      if (context && kind !== "var") { this.unexpected(); }
      return this.parseVarStatement(node, kind)
    case types._while: return this.parseWhileStatement(node)
    case types._with: return this.parseWithStatement(node)
    case types.braceL: return this.parseBlock(true, node)
    case types.semi: return this.parseEmptyStatement(node)
    case types._export:
    case types._import:
      if (this.options.ecmaVersion > 10 && starttype === types._import) {
        skipWhiteSpace.lastIndex = this.pos;
        var skip = skipWhiteSpace.exec(this.input);
        var next = this.pos + skip[0].length, nextCh = this.input.charCodeAt(next);
        if (nextCh === 40) 
          { return this.parseExpressionStatement(node, this.parseExpression()) }
      }

      if (!this.options.allowImportExportEverywhere) {
        if (!topLevel)
          { this.raise(this.start, "'import' and 'export' may only appear at the top level"); }
        if (!this.inModule)
          { this.raise(this.start, "'import' and 'export' may appear only with 'sourceType: module'"); }
      }
      return starttype === types._import ? this.parseImport(node) : this.parseExport(node, exports)

    default:
      if (this.isAsyncFunction()) {
        if (context) { this.unexpected(); }
        this.next();
        return this.parseFunctionStatement(node, true, !context)
      }

      var maybeName = this.value, expr = this.parseExpression();
      if (starttype === types.name && expr.type === "Identifier" && this.eat(types.colon))
        { return this.parseLabeledStatement(node, maybeName, expr, context) }
      else { return this.parseExpressionStatement(node, expr) }
    }
  };

  pp$1.parseBreakContinueStatement = function(node, keyword) {
    var isBreak = keyword === "break";
    this.next();
    if (this.eat(types.semi) || this.insertSemicolon()) { node.label = null; }
    else if (this.type !== types.name) { this.unexpected(); }
    else {
      node.label = this.parseIdent();
      this.semicolon();
    }

    var i = 0;
    for (; i < this.labels.length; ++i) {
      var lab = this.labels[i];
      if (node.label == null || lab.name === node.label.name) {
        if (lab.kind != null && (isBreak || lab.kind === "loop")) { break }
        if (node.label && isBreak) { break }
      }
    }
    if (i === this.labels.length) { this.raise(node.start, "Unsyntactic " + keyword); }
    return this.finishNode(node, isBreak ? "BreakStatement" : "ContinueStatement")
  };

  pp$1.parseDebuggerStatement = function(node) {
    this.next();
    this.semicolon();
    return this.finishNode(node, "DebuggerStatement")
  };

  pp$1.parseDoStatement = function(node) {
    this.next();
    this.labels.push(loopLabel);
    node.body = this.parseStatement("do");
    this.labels.pop();
    this.expect(types._while);
    node.test = this.parseParenExpression();
    if (this.options.ecmaVersion >= 6)
      { this.eat(types.semi); }
    else
      { this.semicolon(); }
    return this.finishNode(node, "DoWhileStatement")
  };


  pp$1.parseForStatement = function(node) {
    this.next();
    var awaitAt = (this.options.ecmaVersion >= 9 && (this.inAsync || (!this.inFunction && this.options.allowAwaitOutsideFunction)) && this.eatContextual("await")) ? this.lastTokStart : -1;
    this.labels.push(loopLabel);
    this.enterScope(0);
    this.expect(types.parenL);
    if (this.type === types.semi) {
      if (awaitAt > -1) { this.unexpected(awaitAt); }
      return this.parseFor(node, null)
    }
    var isLet = this.isLet();
    if (this.type === types._var || this.type === types._const || isLet) {
      var init$1 = this.startNode(), kind = isLet ? "let" : this.value;
      this.next();
      this.parseVar(init$1, true, kind);
      this.finishNode(init$1, "VariableDeclaration");
      if ((this.type === types._in || (this.options.ecmaVersion >= 6 && this.isContextual("of"))) && init$1.declarations.length === 1) {
        if (this.options.ecmaVersion >= 9) {
          if (this.type === types._in) {
            if (awaitAt > -1) { this.unexpected(awaitAt); }
          } else { node.await = awaitAt > -1; }
        }
        return this.parseForIn(node, init$1)
      }
      if (awaitAt > -1) { this.unexpected(awaitAt); }
      return this.parseFor(node, init$1)
    }
    var refDestructuringErrors = new DestructuringErrors;
    var init = this.parseExpression(true, refDestructuringErrors);
    if (this.type === types._in || (this.options.ecmaVersion >= 6 && this.isContextual("of"))) {
      if (this.options.ecmaVersion >= 9) {
        if (this.type === types._in) {
          if (awaitAt > -1) { this.unexpected(awaitAt); }
        } else { node.await = awaitAt > -1; }
      }
      this.toAssignable(init, false, refDestructuringErrors);
      this.checkLVal(init);
      return this.parseForIn(node, init)
    } else {
      this.checkExpressionErrors(refDestructuringErrors, true);
    }
    if (awaitAt > -1) { this.unexpected(awaitAt); }
    return this.parseFor(node, init)
  };

  pp$1.parseFunctionStatement = function(node, isAsync, declarationPosition) {
    this.next();
    return this.parseFunction(node, FUNC_STATEMENT | (declarationPosition ? 0 : FUNC_HANGING_STATEMENT), false, isAsync)
  };

  pp$1.parseIfStatement = function(node) {
    this.next();
    node.test = this.parseParenExpression();
    node.consequent = this.parseStatement("if");
    node.alternate = this.eat(types._else) ? this.parseStatement("if") : null;
    return this.finishNode(node, "IfStatement")
  };

  pp$1.parseReturnStatement = function(node) {
    if (!this.inFunction && !this.options.allowReturnOutsideFunction)
      { this.raise(this.start, "'return' outside of function"); }
    this.next();


    if (this.eat(types.semi) || this.insertSemicolon()) { node.argument = null; }
    else { node.argument = this.parseExpression(); this.semicolon(); }
    return this.finishNode(node, "ReturnStatement")
  };

  pp$1.parseSwitchStatement = function(node) {
    this.next();
    node.discriminant = this.parseParenExpression();
    node.cases = [];
    this.expect(types.braceL);
    this.labels.push(switchLabel);
    this.enterScope(0);


    var cur;
    for (var sawDefault = false; this.type !== types.braceR;) {
      if (this.type === types._case || this.type === types._default) {
        var isCase = this.type === types._case;
        if (cur) { this.finishNode(cur, "SwitchCase"); }
        node.cases.push(cur = this.startNode());
        cur.consequent = [];
        this.next();
        if (isCase) {
          cur.test = this.parseExpression();
        } else {
          if (sawDefault) { this.raiseRecoverable(this.lastTokStart, "Multiple default clauses"); }
          sawDefault = true;
          cur.test = null;
        }
        this.expect(types.colon);
      } else {
        if (!cur) { this.unexpected(); }
        cur.consequent.push(this.parseStatement(null));
      }
    }
    this.exitScope();
    if (cur) { this.finishNode(cur, "SwitchCase"); }
    this.next(); 
    this.labels.pop();
    return this.finishNode(node, "SwitchStatement")
  };

  pp$1.parseThrowStatement = function(node) {
    this.next();
    if (lineBreak.test(this.input.slice(this.lastTokEnd, this.start)))
      { this.raise(this.lastTokEnd, "Illegal newline after throw"); }
    node.argument = this.parseExpression();
    this.semicolon();
    return this.finishNode(node, "ThrowStatement")
  };


  var empty = [];

  pp$1.parseTryStatement = function(node) {
    this.next();
    node.block = this.parseBlock();
    node.handler = null;
    if (this.type === types._catch) {
      var clause = this.startNode();
      this.next();
      if (this.eat(types.parenL)) {
        clause.param = this.parseBindingAtom();
        var simple = clause.param.type === "Identifier";
        this.enterScope(simple ? SCOPE_SIMPLE_CATCH : 0);
        this.checkLVal(clause.param, simple ? BIND_SIMPLE_CATCH : BIND_LEXICAL);
        this.expect(types.parenR);
      } else {
        if (this.options.ecmaVersion < 10) { this.unexpected(); }
        clause.param = null;
        this.enterScope(0);
      }
      clause.body = this.parseBlock(false);
      this.exitScope();
      node.handler = this.finishNode(clause, "CatchClause");
    }
    node.finalizer = this.eat(types._finally) ? this.parseBlock() : null;
    if (!node.handler && !node.finalizer)
      { this.raise(node.start, "Missing catch or finally clause"); }
    return this.finishNode(node, "TryStatement")
  };

  pp$1.parseVarStatement = function(node, kind) {
    this.next();
    this.parseVar(node, false, kind);
    this.semicolon();
    return this.finishNode(node, "VariableDeclaration")
  };

  pp$1.parseWhileStatement = function(node) {
    this.next();
    node.test = this.parseParenExpression();
    this.labels.push(loopLabel);
    node.body = this.parseStatement("while");
    this.labels.pop();
    return this.finishNode(node, "WhileStatement")
  };

  pp$1.parseWithStatement = function(node) {
    if (this.strict) { this.raise(this.start, "'with' in strict mode"); }
    this.next();
    node.object = this.parseParenExpression();
    node.body = this.parseStatement("with");
    return this.finishNode(node, "WithStatement")
  };

  pp$1.parseEmptyStatement = function(node) {
    this.next();
    return this.finishNode(node, "EmptyStatement")
  };

  pp$1.parseLabeledStatement = function(node, maybeName, expr, context) {
    for (var i$1 = 0, list = this.labels; i$1 < list.length; i$1 += 1)
      {
      var label = list[i$1];

      if (label.name === maybeName)
        { this.raise(expr.start, "Label '" + maybeName + "' is already declared");
    } }
    var kind = this.type.isLoop ? "loop" : this.type === types._switch ? "switch" : null;
    for (var i = this.labels.length - 1; i >= 0; i--) {
      var label$1 = this.labels[i];
      if (label$1.statementStart === node.start) {
        label$1.statementStart = this.start;
        label$1.kind = kind;
      } else { break }
    }
    this.labels.push({name: maybeName, kind: kind, statementStart: this.start});
    node.body = this.parseStatement(context ? context.indexOf("label") === -1 ? context + "label" : context : "label");
    this.labels.pop();
    node.label = expr;
    return this.finishNode(node, "LabeledStatement")
  };

  pp$1.parseExpressionStatement = function(node, expr) {
    node.expression = expr;
    this.semicolon();
    return this.finishNode(node, "ExpressionStatement")
  };


  pp$1.parseBlock = function(createNewLexicalScope, node) {
    if ( createNewLexicalScope === void 0 ) createNewLexicalScope = true;
    if ( node === void 0 ) node = this.startNode();

    node.body = [];
    this.expect(types.braceL);
    if (createNewLexicalScope) { this.enterScope(0); }
    while (!this.eat(types.braceR)) {
      var stmt = this.parseStatement(null);
      node.body.push(stmt);
    }
    if (createNewLexicalScope) { this.exitScope(); }
    return this.finishNode(node, "BlockStatement")
  };


  pp$1.parseFor = function(node, init) {
    node.init = init;
    this.expect(types.semi);
    node.test = this.type === types.semi ? null : this.parseExpression();
    this.expect(types.semi);
    node.update = this.type === types.parenR ? null : this.parseExpression();
    this.expect(types.parenR);
    node.body = this.parseStatement("for");
    this.exitScope();
    this.labels.pop();
    return this.finishNode(node, "ForStatement")
  };


  pp$1.parseForIn = function(node, init) {
    var isForIn = this.type === types._in;
    this.next();

    if (
      init.type === "VariableDeclaration" &&
      init.declarations[0].init != null &&
      (
        !isForIn ||
        this.options.ecmaVersion < 8 ||
        this.strict ||
        init.kind !== "var" ||
        init.declarations[0].id.type !== "Identifier"
      )
    ) {
      this.raise(
        init.start,
        ((isForIn ? "for-in" : "for-of") + " loop variable declaration may not have an initializer")
      );
    } else if (init.type === "AssignmentPattern") {
      this.raise(init.start, "Invalid left-hand side in for-loop");
    }
    node.left = init;
    node.right = isForIn ? this.parseExpression() : this.parseMaybeAssign();
    this.expect(types.parenR);
    node.body = this.parseStatement("for");
    this.exitScope();
    this.labels.pop();
    return this.finishNode(node, isForIn ? "ForInStatement" : "ForOfStatement")
  };


  pp$1.parseVar = function(node, isFor, kind) {
    node.declarations = [];
    node.kind = kind;
    for (;;) {
      var decl = this.startNode();
      this.parseVarId(decl, kind);
      if (this.eat(types.eq)) {
        decl.init = this.parseMaybeAssign(isFor);
      } else if (kind === "const" && !(this.type === types._in || (this.options.ecmaVersion >= 6 && this.isContextual("of")))) {
        this.unexpected();
      } else if (decl.id.type !== "Identifier" && !(isFor && (this.type === types._in || this.isContextual("of")))) {
        this.raise(this.lastTokEnd, "Complex binding patterns require an initialization value");
      } else {
        decl.init = null;
      }
      node.declarations.push(this.finishNode(decl, "VariableDeclarator"));
      if (!this.eat(types.comma)) { break }
    }
    return node
  };

  pp$1.parseVarId = function(decl, kind) {
    decl.id = this.parseBindingAtom();
    this.checkLVal(decl.id, kind === "var" ? BIND_VAR : BIND_LEXICAL, false);
  };

  var FUNC_STATEMENT = 1, FUNC_HANGING_STATEMENT = 2, FUNC_NULLABLE_ID = 4;


  pp$1.parseFunction = function(node, statement, allowExpressionBody, isAsync) {
    this.initFunction(node);
    if (this.options.ecmaVersion >= 9 || this.options.ecmaVersion >= 6 && !isAsync) {
      if (this.type === types.star && (statement & FUNC_HANGING_STATEMENT))
        { this.unexpected(); }
      node.generator = this.eat(types.star);
    }
    if (this.options.ecmaVersion >= 8)
      { node.async = !!isAsync; }

    if (statement & FUNC_STATEMENT) {
      node.id = (statement & FUNC_NULLABLE_ID) && this.type !== types.name ? null : this.parseIdent();
      if (node.id && !(statement & FUNC_HANGING_STATEMENT))
        { this.checkLVal(node.id, (this.strict || node.generator || node.async) ? this.treatFunctionsAsVar ? BIND_VAR : BIND_LEXICAL : BIND_FUNCTION); }
    }

    var oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
    this.yieldPos = 0;
    this.awaitPos = 0;
    this.awaitIdentPos = 0;
    this.enterScope(functionFlags(node.async, node.generator));

    if (!(statement & FUNC_STATEMENT))
      { node.id = this.type === types.name ? this.parseIdent() : null; }

    this.parseFunctionParams(node);
    this.parseFunctionBody(node, allowExpressionBody, false);

    this.yieldPos = oldYieldPos;
    this.awaitPos = oldAwaitPos;
    this.awaitIdentPos = oldAwaitIdentPos;
    return this.finishNode(node, (statement & FUNC_STATEMENT) ? "FunctionDeclaration" : "FunctionExpression")
  };

  pp$1.parseFunctionParams = function(node) {
    this.expect(types.parenL);
    node.params = this.parseBindingList(types.parenR, false, this.options.ecmaVersion >= 8);
    this.checkYieldAwaitInDefaultParams();
  };


  pp$1.parseClass = function(node, isStatement) {
    this.next();

    var oldStrict = this.strict;
    this.strict = true;

    this.parseClassId(node, isStatement);
    this.parseClassSuper(node);
    var classBody = this.startNode();
    var hadConstructor = false;
    classBody.body = [];
    this.expect(types.braceL);
    while (!this.eat(types.braceR)) {
      var element = this.parseClassElement(node.superClass !== null);
      if (element) {
        classBody.body.push(element);
        if (element.type === "MethodDefinition" && element.kind === "constructor") {
          if (hadConstructor) { this.raise(element.start, "Duplicate constructor in the same class"); }
          hadConstructor = true;
        }
      }
    }
    node.body = this.finishNode(classBody, "ClassBody");
    this.strict = oldStrict;
    return this.finishNode(node, isStatement ? "ClassDeclaration" : "ClassExpression")
  };

  pp$1.parseClassElement = function(constructorAllowsSuper) {
    var this$1 = this;

    if (this.eat(types.semi)) { return null }

    var method = this.startNode();
    var tryContextual = function (k, noLineBreak) {
      if ( noLineBreak === void 0 ) noLineBreak = false;

      var start = this$1.start, startLoc = this$1.startLoc;
      if (!this$1.eatContextual(k)) { return false }
      if (this$1.type !== types.parenL && (!noLineBreak || !this$1.canInsertSemicolon())) { return true }
      if (method.key) { this$1.unexpected(); }
      method.computed = false;
      method.key = this$1.startNodeAt(start, startLoc);
      method.key.name = k;
      this$1.finishNode(method.key, "Identifier");
      return false
    };

    method.kind = "method";
    method.static = tryContextual("static");
    var isGenerator = this.eat(types.star);
    var isAsync = false;
    if (!isGenerator) {
      if (this.options.ecmaVersion >= 8 && tryContextual("async", true)) {
        isAsync = true;
        isGenerator = this.options.ecmaVersion >= 9 && this.eat(types.star);
      } else if (tryContextual("get")) {
        method.kind = "get";
      } else if (tryContextual("set")) {
        method.kind = "set";
      }
    }
    if (!method.key) { this.parsePropertyName(method); }
    var key = method.key;
    var allowsDirectSuper = false;
    if (!method.computed && !method.static && (key.type === "Identifier" && key.name === "constructor" ||
        key.type === "Literal" && key.value === "constructor")) {
      if (method.kind !== "method") { this.raise(key.start, "Constructor can't have get/set modifier"); }
      if (isGenerator) { this.raise(key.start, "Constructor can't be a generator"); }
      if (isAsync) { this.raise(key.start, "Constructor can't be an async method"); }
      method.kind = "constructor";
      allowsDirectSuper = constructorAllowsSuper;
    } else if (method.static && key.type === "Identifier" && key.name === "prototype") {
      this.raise(key.start, "Classes may not have a static property named prototype");
    }
    this.parseClassMethod(method, isGenerator, isAsync, allowsDirectSuper);
    if (method.kind === "get" && method.value.params.length !== 0)
      { this.raiseRecoverable(method.value.start, "getter should have no params"); }
    if (method.kind === "set" && method.value.params.length !== 1)
      { this.raiseRecoverable(method.value.start, "setter should have exactly one param"); }
    if (method.kind === "set" && method.value.params[0].type === "RestElement")
      { this.raiseRecoverable(method.value.params[0].start, "Setter cannot use rest params"); }
    return method
  };

  pp$1.parseClassMethod = function(method, isGenerator, isAsync, allowsDirectSuper) {
    method.value = this.parseMethod(isGenerator, isAsync, allowsDirectSuper);
    return this.finishNode(method, "MethodDefinition")
  };

  pp$1.parseClassId = function(node, isStatement) {
    if (this.type === types.name) {
      node.id = this.parseIdent();
      if (isStatement)
        { this.checkLVal(node.id, BIND_LEXICAL, false); }
    } else {
      if (isStatement === true)
        { this.unexpected(); }
      node.id = null;
    }
  };

  pp$1.parseClassSuper = function(node) {
    node.superClass = this.eat(types._extends) ? this.parseExprSubscripts() : null;
  };


  pp$1.parseExport = function(node, exports) {
    this.next();
    if (this.eat(types.star)) {
      this.expectContextual("from");
      if (this.type !== types.string) { this.unexpected(); }
      node.source = this.parseExprAtom();
      this.semicolon();
      return this.finishNode(node, "ExportAllDeclaration")
    }
    if (this.eat(types._default)) { 
      this.checkExport(exports, "default", this.lastTokStart);
      var isAsync;
      if (this.type === types._function || (isAsync = this.isAsyncFunction())) {
        var fNode = this.startNode();
        this.next();
        if (isAsync) { this.next(); }
        node.declaration = this.parseFunction(fNode, FUNC_STATEMENT | FUNC_NULLABLE_ID, false, isAsync);
      } else if (this.type === types._class) {
        var cNode = this.startNode();
        node.declaration = this.parseClass(cNode, "nullableID");
      } else {
        node.declaration = this.parseMaybeAssign();
        this.semicolon();
      }
      return this.finishNode(node, "ExportDefaultDeclaration")
    }
    if (this.shouldParseExportStatement()) {
      node.declaration = this.parseStatement(null);
      if (node.declaration.type === "VariableDeclaration")
        { this.checkVariableExport(exports, node.declaration.declarations); }
      else
        { this.checkExport(exports, node.declaration.id.name, node.declaration.id.start); }
      node.specifiers = [];
      node.source = null;
    } else { 
      node.declaration = null;
      node.specifiers = this.parseExportSpecifiers(exports);
      if (this.eatContextual("from")) {
        if (this.type !== types.string) { this.unexpected(); }
        node.source = this.parseExprAtom();
      } else {
        for (var i = 0, list = node.specifiers; i < list.length; i += 1) {
          var spec = list[i];

          this.checkUnreserved(spec.local);
          this.checkLocalExport(spec.local);
        }

        node.source = null;
      }
      this.semicolon();
    }
    return this.finishNode(node, "ExportNamedDeclaration")
  };

  pp$1.checkExport = function(exports, name, pos) {
    if (!exports) { return }
    if (has(exports, name))
      { this.raiseRecoverable(pos, "Duplicate export '" + name + "'"); }
    exports[name] = true;
  };

  pp$1.checkPatternExport = function(exports, pat) {
    var type = pat.type;
    if (type === "Identifier")
      { this.checkExport(exports, pat.name, pat.start); }
    else if (type === "ObjectPattern")
      { for (var i = 0, list = pat.properties; i < list.length; i += 1)
        {
          var prop = list[i];

          this.checkPatternExport(exports, prop);
        } }
    else if (type === "ArrayPattern")
      { for (var i$1 = 0, list$1 = pat.elements; i$1 < list$1.length; i$1 += 1) {
        var elt = list$1[i$1];

          if (elt) { this.checkPatternExport(exports, elt); }
      } }
    else if (type === "Property")
      { this.checkPatternExport(exports, pat.value); }
    else if (type === "AssignmentPattern")
      { this.checkPatternExport(exports, pat.left); }
    else if (type === "RestElement")
      { this.checkPatternExport(exports, pat.argument); }
    else if (type === "ParenthesizedExpression")
      { this.checkPatternExport(exports, pat.expression); }
  };

  pp$1.checkVariableExport = function(exports, decls) {
    if (!exports) { return }
    for (var i = 0, list = decls; i < list.length; i += 1)
      {
      var decl = list[i];

      this.checkPatternExport(exports, decl.id);
    }
  };

  pp$1.shouldParseExportStatement = function() {
    return this.type.keyword === "var" ||
      this.type.keyword === "const" ||
      this.type.keyword === "class" ||
      this.type.keyword === "function" ||
      this.isLet() ||
      this.isAsyncFunction()
  };


  pp$1.parseExportSpecifiers = function(exports) {
    var nodes = [], first = true;
    this.expect(types.braceL);
    while (!this.eat(types.braceR)) {
      if (!first) {
        this.expect(types.comma);
        if (this.afterTrailingComma(types.braceR)) { break }
      } else { first = false; }

      var node = this.startNode();
      node.local = this.parseIdent(true);
      node.exported = this.eatContextual("as") ? this.parseIdent(true) : node.local;
      this.checkExport(exports, node.exported.name, node.exported.start);
      nodes.push(this.finishNode(node, "ExportSpecifier"));
    }
    return nodes
  };


  pp$1.parseImport = function(node) {
    this.next();
    if (this.type === types.string) {
      node.specifiers = empty;
      node.source = this.parseExprAtom();
    } else {
      node.specifiers = this.parseImportSpecifiers();
      this.expectContextual("from");
      node.source = this.type === types.string ? this.parseExprAtom() : this.unexpected();
    }
    this.semicolon();
    return this.finishNode(node, "ImportDeclaration")
  };


  pp$1.parseImportSpecifiers = function() {
    var nodes = [], first = true;
    if (this.type === types.name) {
      var node = this.startNode();
      node.local = this.parseIdent();
      this.checkLVal(node.local, BIND_LEXICAL);
      nodes.push(this.finishNode(node, "ImportDefaultSpecifier"));
      if (!this.eat(types.comma)) { return nodes }
    }
    if (this.type === types.star) {
      var node$1 = this.startNode();
      this.next();
      this.expectContextual("as");
      node$1.local = this.parseIdent();
      this.checkLVal(node$1.local, BIND_LEXICAL);
      nodes.push(this.finishNode(node$1, "ImportNamespaceSpecifier"));
      return nodes
    }
    this.expect(types.braceL);
    while (!this.eat(types.braceR)) {
      if (!first) {
        this.expect(types.comma);
        if (this.afterTrailingComma(types.braceR)) { break }
      } else { first = false; }

      var node$2 = this.startNode();
      node$2.imported = this.parseIdent(true);
      if (this.eatContextual("as")) {
        node$2.local = this.parseIdent();
      } else {
        this.checkUnreserved(node$2.imported);
        node$2.local = node$2.imported;
      }
      this.checkLVal(node$2.local, BIND_LEXICAL);
      nodes.push(this.finishNode(node$2, "ImportSpecifier"));
    }
    return nodes
  };

  pp$1.adaptDirectivePrologue = function(statements) {
    for (var i = 0; i < statements.length && this.isDirectiveCandidate(statements[i]); ++i) {
      statements[i].directive = statements[i].expression.raw.slice(1, -1);
    }
  };
  pp$1.isDirectiveCandidate = function(statement) {
    return (
      statement.type === "ExpressionStatement" &&
      statement.expression.type === "Literal" &&
      typeof statement.expression.value === "string" &&
      (this.input[statement.start] === "\"" || this.input[statement.start] === "'")
    )
  };

  var pp$2 = Parser.prototype;


  pp$2.toAssignable = function(node, isBinding, refDestructuringErrors) {
    if (this.options.ecmaVersion >= 6 && node) {
      switch (node.type) {
      case "Identifier":
        if (this.inAsync && node.name === "await")
          { this.raise(node.start, "Cannot use 'await' as identifier inside an async function"); }
        break

      case "ObjectPattern":
      case "ArrayPattern":
      case "RestElement":
        break

      case "ObjectExpression":
        node.type = "ObjectPattern";
        if (refDestructuringErrors) { this.checkPatternErrors(refDestructuringErrors, true); }
        for (var i = 0, list = node.properties; i < list.length; i += 1) {
          var prop = list[i];

        this.toAssignable(prop, isBinding);
          if (
            prop.type === "RestElement" &&
            (prop.argument.type === "ArrayPattern" || prop.argument.type === "ObjectPattern")
          ) {
            this.raise(prop.argument.start, "Unexpected token");
          }
        }
        break

      case "Property":
        if (node.kind !== "init") { this.raise(node.key.start, "Object pattern can't contain getter or setter"); }
        this.toAssignable(node.value, isBinding);
        break

      case "ArrayExpression":
        node.type = "ArrayPattern";
        if (refDestructuringErrors) { this.checkPatternErrors(refDestructuringErrors, true); }
        this.toAssignableList(node.elements, isBinding);
        break

      case "SpreadElement":
        node.type = "RestElement";
        this.toAssignable(node.argument, isBinding);
        if (node.argument.type === "AssignmentPattern")
          { this.raise(node.argument.start, "Rest elements cannot have a default value"); }
        break

      case "AssignmentExpression":
        if (node.operator !== "=") { this.raise(node.left.end, "Only '=' operator can be used for specifying default value."); }
        node.type = "AssignmentPattern";
        delete node.operator;
        this.toAssignable(node.left, isBinding);

      case "AssignmentPattern":
        break

      case "ParenthesizedExpression":
        this.toAssignable(node.expression, isBinding, refDestructuringErrors);
        break

      case "MemberExpression":
        if (!isBinding) { break }

      default:
        this.raise(node.start, "Assigning to rvalue");
      }
    } else if (refDestructuringErrors) { this.checkPatternErrors(refDestructuringErrors, true); }
    return node
  };


  pp$2.toAssignableList = function(exprList, isBinding) {
    var end = exprList.length;
    for (var i = 0; i < end; i++) {
      var elt = exprList[i];
      if (elt) { this.toAssignable(elt, isBinding); }
    }
    if (end) {
      var last = exprList[end - 1];
      if (this.options.ecmaVersion === 6 && isBinding && last && last.type === "RestElement" && last.argument.type !== "Identifier")
        { this.unexpected(last.argument.start); }
    }
    return exprList
  };


  pp$2.parseSpread = function(refDestructuringErrors) {
    var node = this.startNode();
    this.next();
    node.argument = this.parseMaybeAssign(false, refDestructuringErrors);
    return this.finishNode(node, "SpreadElement")
  };

  pp$2.parseRestBinding = function() {
    var node = this.startNode();
    this.next();

    if (this.options.ecmaVersion === 6 && this.type !== types.name)
      { this.unexpected(); }

    node.argument = this.parseBindingAtom();

    return this.finishNode(node, "RestElement")
  };


  pp$2.parseBindingAtom = function() {
    if (this.options.ecmaVersion >= 6) {
      switch (this.type) {
      case types.bracketL:
        var node = this.startNode();
        this.next();
        node.elements = this.parseBindingList(types.bracketR, true, true);
        return this.finishNode(node, "ArrayPattern")

      case types.braceL:
        return this.parseObj(true)
      }
    }
    return this.parseIdent()
  };

  pp$2.parseBindingList = function(close, allowEmpty, allowTrailingComma) {
    var elts = [], first = true;
    while (!this.eat(close)) {
      if (first) { first = false; }
      else { this.expect(types.comma); }
      if (allowEmpty && this.type === types.comma) {
        elts.push(null);
      } else if (allowTrailingComma && this.afterTrailingComma(close)) {
        break
      } else if (this.type === types.ellipsis) {
        var rest = this.parseRestBinding();
        this.parseBindingListItem(rest);
        elts.push(rest);
        if (this.type === types.comma) { this.raise(this.start, "Comma is not permitted after the rest element"); }
        this.expect(close);
        break
      } else {
        var elem = this.parseMaybeDefault(this.start, this.startLoc);
        this.parseBindingListItem(elem);
        elts.push(elem);
      }
    }
    return elts
  };

  pp$2.parseBindingListItem = function(param) {
    return param
  };


  pp$2.parseMaybeDefault = function(startPos, startLoc, left) {
    left = left || this.parseBindingAtom();
    if (this.options.ecmaVersion < 6 || !this.eat(types.eq)) { return left }
    var node = this.startNodeAt(startPos, startLoc);
    node.left = left;
    node.right = this.parseMaybeAssign();
    return this.finishNode(node, "AssignmentPattern")
  };


  pp$2.checkLVal = function(expr, bindingType, checkClashes) {
    if ( bindingType === void 0 ) bindingType = BIND_NONE;

    switch (expr.type) {
    case "Identifier":
      if (bindingType === BIND_LEXICAL && expr.name === "let")
        { this.raiseRecoverable(expr.start, "let is disallowed as a lexically bound name"); }
      if (this.strict && this.reservedWordsStrictBind.test(expr.name))
        { this.raiseRecoverable(expr.start, (bindingType ? "Binding " : "Assigning to ") + expr.name + " in strict mode"); }
      if (checkClashes) {
        if (has(checkClashes, expr.name))
          { this.raiseRecoverable(expr.start, "Argument name clash"); }
        checkClashes[expr.name] = true;
      }
      if (bindingType !== BIND_NONE && bindingType !== BIND_OUTSIDE) { this.declareName(expr.name, bindingType, expr.start); }
      break

    case "MemberExpression":
      if (bindingType) { this.raiseRecoverable(expr.start, "Binding member expression"); }
      break

    case "ObjectPattern":
      for (var i = 0, list = expr.properties; i < list.length; i += 1)
        {
      var prop = list[i];

      this.checkLVal(prop, bindingType, checkClashes);
    }
      break

    case "Property":
      this.checkLVal(expr.value, bindingType, checkClashes);
      break

    case "ArrayPattern":
      for (var i$1 = 0, list$1 = expr.elements; i$1 < list$1.length; i$1 += 1) {
        var elem = list$1[i$1];

      if (elem) { this.checkLVal(elem, bindingType, checkClashes); }
      }
      break

    case "AssignmentPattern":
      this.checkLVal(expr.left, bindingType, checkClashes);
      break

    case "RestElement":
      this.checkLVal(expr.argument, bindingType, checkClashes);
      break

    case "ParenthesizedExpression":
      this.checkLVal(expr.expression, bindingType, checkClashes);
      break

    default:
      this.raise(expr.start, (bindingType ? "Binding" : "Assigning to") + " rvalue");
    }
  };


  var pp$3 = Parser.prototype;


  pp$3.checkPropClash = function(prop, propHash, refDestructuringErrors) {
    if (this.options.ecmaVersion >= 9 && prop.type === "SpreadElement")
      { return }
    if (this.options.ecmaVersion >= 6 && (prop.computed || prop.method || prop.shorthand))
      { return }
    var key = prop.key;
    var name;
    switch (key.type) {
    case "Identifier": name = key.name; break
    case "Literal": name = String(key.value); break
    default: return
    }
    var kind = prop.kind;
    if (this.options.ecmaVersion >= 6) {
      if (name === "__proto__" && kind === "init") {
        if (propHash.proto) {
          if (refDestructuringErrors) {
            if (refDestructuringErrors.doubleProto < 0)
              { refDestructuringErrors.doubleProto = key.start; }
          } else { this.raiseRecoverable(key.start, "Redefinition of __proto__ property"); }
        }
        propHash.proto = true;
      }
      return
    }
    name = "$" + name;
    var other = propHash[name];
    if (other) {
      var redefinition;
      if (kind === "init") {
        redefinition = this.strict && other.init || other.get || other.set;
      } else {
        redefinition = other.init || other[kind];
      }
      if (redefinition)
        { this.raiseRecoverable(key.start, "Redefinition of property"); }
    } else {
      other = propHash[name] = {
        init: false,
        get: false,
        set: false
      };
    }
    other[kind] = true;
  };




  pp$3.parseExpression = function(noIn, refDestructuringErrors) {
    var startPos = this.start, startLoc = this.startLoc;
    var expr = this.parseMaybeAssign(noIn, refDestructuringErrors);
    if (this.type === types.comma) {
      var node = this.startNodeAt(startPos, startLoc);
      node.expressions = [expr];
      while (this.eat(types.comma)) { node.expressions.push(this.parseMaybeAssign(noIn, refDestructuringErrors)); }
      return this.finishNode(node, "SequenceExpression")
    }
    return expr
  };


  pp$3.parseMaybeAssign = function(noIn, refDestructuringErrors, afterLeftParse) {
    if (this.isContextual("yield")) {
      if (this.inGenerator) { return this.parseYield(noIn) }
      else { this.exprAllowed = false; }
    }

    var ownDestructuringErrors = false, oldParenAssign = -1, oldTrailingComma = -1;
    if (refDestructuringErrors) {
      oldParenAssign = refDestructuringErrors.parenthesizedAssign;
      oldTrailingComma = refDestructuringErrors.trailingComma;
      refDestructuringErrors.parenthesizedAssign = refDestructuringErrors.trailingComma = -1;
    } else {
      refDestructuringErrors = new DestructuringErrors;
      ownDestructuringErrors = true;
    }

    var startPos = this.start, startLoc = this.startLoc;
    if (this.type === types.parenL || this.type === types.name)
      { this.potentialArrowAt = this.start; }
    var left = this.parseMaybeConditional(noIn, refDestructuringErrors);
    if (afterLeftParse) { left = afterLeftParse.call(this, left, startPos, startLoc); }
    if (this.type.isAssign) {
      var node = this.startNodeAt(startPos, startLoc);
      node.operator = this.value;
      node.left = this.type === types.eq ? this.toAssignable(left, false, refDestructuringErrors) : left;
      if (!ownDestructuringErrors) {
        refDestructuringErrors.parenthesizedAssign = refDestructuringErrors.trailingComma = refDestructuringErrors.doubleProto = -1;
      }
      if (refDestructuringErrors.shorthandAssign >= node.left.start)
        { refDestructuringErrors.shorthandAssign = -1; } 
      this.checkLVal(left);
      this.next();
      node.right = this.parseMaybeAssign(noIn);
      return this.finishNode(node, "AssignmentExpression")
    } else {
      if (ownDestructuringErrors) { this.checkExpressionErrors(refDestructuringErrors, true); }
    }
    if (oldParenAssign > -1) { refDestructuringErrors.parenthesizedAssign = oldParenAssign; }
    if (oldTrailingComma > -1) { refDestructuringErrors.trailingComma = oldTrailingComma; }
    return left
  };


  pp$3.parseMaybeConditional = function(noIn, refDestructuringErrors) {
    var startPos = this.start, startLoc = this.startLoc;
    var expr = this.parseExprOps(noIn, refDestructuringErrors);
    if (this.checkExpressionErrors(refDestructuringErrors)) { return expr }
    if (this.eat(types.question)) {
      var node = this.startNodeAt(startPos, startLoc);
      node.test = expr;
      node.consequent = this.parseMaybeAssign();
      this.expect(types.colon);
      node.alternate = this.parseMaybeAssign(noIn);
      return this.finishNode(node, "ConditionalExpression")
    }
    return expr
  };


  pp$3.parseExprOps = function(noIn, refDestructuringErrors) {
    var startPos = this.start, startLoc = this.startLoc;
    var expr = this.parseMaybeUnary(refDestructuringErrors, false);
    if (this.checkExpressionErrors(refDestructuringErrors)) { return expr }
    return expr.start === startPos && expr.type === "ArrowFunctionExpression" ? expr : this.parseExprOp(expr, startPos, startLoc, -1, noIn)
  };


  pp$3.parseExprOp = function(left, leftStartPos, leftStartLoc, minPrec, noIn) {
    var prec = this.type.binop;
    if (prec != null && (!noIn || this.type !== types._in)) {
      if (prec > minPrec) {
        var logical = this.type === types.logicalOR || this.type === types.logicalAND;
        var op = this.value;
        this.next();
        var startPos = this.start, startLoc = this.startLoc;
        var right = this.parseExprOp(this.parseMaybeUnary(null, false), startPos, startLoc, prec, noIn);
        var node = this.buildBinary(leftStartPos, leftStartLoc, left, right, op, logical);
        return this.parseExprOp(node, leftStartPos, leftStartLoc, minPrec, noIn)
      }
    }
    return left
  };

  pp$3.buildBinary = function(startPos, startLoc, left, right, op, logical) {
    var node = this.startNodeAt(startPos, startLoc);
    node.left = left;
    node.operator = op;
    node.right = right;
    return this.finishNode(node, logical ? "LogicalExpression" : "BinaryExpression")
  };


  pp$3.parseMaybeUnary = function(refDestructuringErrors, sawUnary) {
    var startPos = this.start, startLoc = this.startLoc, expr;
    if (this.isContextual("await") && (this.inAsync || (!this.inFunction && this.options.allowAwaitOutsideFunction))) {
      expr = this.parseAwait();
      sawUnary = true;
    } else if (this.type.prefix) {
      var node = this.startNode(), update = this.type === types.incDec;
      node.operator = this.value;
      node.prefix = true;
      this.next();
      node.argument = this.parseMaybeUnary(null, true);
      this.checkExpressionErrors(refDestructuringErrors, true);
      if (update) { this.checkLVal(node.argument); }
      else if (this.strict && node.operator === "delete" &&
               node.argument.type === "Identifier")
        { this.raiseRecoverable(node.start, "Deleting local variable in strict mode"); }
      else { sawUnary = true; }
      expr = this.finishNode(node, update ? "UpdateExpression" : "UnaryExpression");
    } else {
      expr = this.parseExprSubscripts(refDestructuringErrors);
      if (this.checkExpressionErrors(refDestructuringErrors)) { return expr }
      while (this.type.postfix && !this.canInsertSemicolon()) {
        var node$1 = this.startNodeAt(startPos, startLoc);
        node$1.operator = this.value;
        node$1.prefix = false;
        node$1.argument = expr;
        this.checkLVal(expr);
        this.next();
        expr = this.finishNode(node$1, "UpdateExpression");
      }
    }

    if (!sawUnary && this.eat(types.starstar))
      { return this.buildBinary(startPos, startLoc, expr, this.parseMaybeUnary(null, false), "**", false) }
    else
      { return expr }
  };


  pp$3.parseExprSubscripts = function(refDestructuringErrors) {
    var startPos = this.start, startLoc = this.startLoc;
    var expr = this.parseExprAtom(refDestructuringErrors);
    if (expr.type === "ArrowFunctionExpression" && this.input.slice(this.lastTokStart, this.lastTokEnd) !== ")")
      { return expr }
    var result = this.parseSubscripts(expr, startPos, startLoc);
    if (refDestructuringErrors && result.type === "MemberExpression") {
      if (refDestructuringErrors.parenthesizedAssign >= result.start) { refDestructuringErrors.parenthesizedAssign = -1; }
      if (refDestructuringErrors.parenthesizedBind >= result.start) { refDestructuringErrors.parenthesizedBind = -1; }
    }
    return result
  };

  pp$3.parseSubscripts = function(base, startPos, startLoc, noCalls) {
    var maybeAsyncArrow = this.options.ecmaVersion >= 8 && base.type === "Identifier" && base.name === "async" &&
        this.lastTokEnd === base.end && !this.canInsertSemicolon() && this.input.slice(base.start, base.end) === "async";
    while (true) {
      var element = this.parseSubscript(base, startPos, startLoc, noCalls, maybeAsyncArrow);
      if (element === base || element.type === "ArrowFunctionExpression") { return element }
      base = element;
    }
  };

  pp$3.parseSubscript = function(base, startPos, startLoc, noCalls, maybeAsyncArrow) {
    var computed = this.eat(types.bracketL);
    if (computed || this.eat(types.dot)) {
      var node = this.startNodeAt(startPos, startLoc);
      node.object = base;
      node.property = computed ? this.parseExpression() : this.parseIdent(this.options.allowReserved !== "never");
      node.computed = !!computed;
      if (computed) { this.expect(types.bracketR); }
      base = this.finishNode(node, "MemberExpression");
    } else if (!noCalls && this.eat(types.parenL)) {
      var refDestructuringErrors = new DestructuringErrors, oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
      this.yieldPos = 0;
      this.awaitPos = 0;
      this.awaitIdentPos = 0;
      var exprList = this.parseExprList(types.parenR, this.options.ecmaVersion >= 8, false, refDestructuringErrors);
      if (maybeAsyncArrow && !this.canInsertSemicolon() && this.eat(types.arrow)) {
        this.checkPatternErrors(refDestructuringErrors, false);
        this.checkYieldAwaitInDefaultParams();
        if (this.awaitIdentPos > 0)
          { this.raise(this.awaitIdentPos, "Cannot use 'await' as identifier inside an async function"); }
        this.yieldPos = oldYieldPos;
        this.awaitPos = oldAwaitPos;
        this.awaitIdentPos = oldAwaitIdentPos;
        return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), exprList, true)
      }
      this.checkExpressionErrors(refDestructuringErrors, true);
      this.yieldPos = oldYieldPos || this.yieldPos;
      this.awaitPos = oldAwaitPos || this.awaitPos;
      this.awaitIdentPos = oldAwaitIdentPos || this.awaitIdentPos;
      var node$1 = this.startNodeAt(startPos, startLoc);
      node$1.callee = base;
      node$1.arguments = exprList;
      base = this.finishNode(node$1, "CallExpression");
    } else if (this.type === types.backQuote) {
      var node$2 = this.startNodeAt(startPos, startLoc);
      node$2.tag = base;
      node$2.quasi = this.parseTemplate({isTagged: true});
      base = this.finishNode(node$2, "TaggedTemplateExpression");
    }
    return base
  };


  pp$3.parseExprAtom = function(refDestructuringErrors) {
    if (this.type === types.slash) { this.readRegexp(); }

    var node, canBeArrow = this.potentialArrowAt === this.start;
    switch (this.type) {
    case types._super:
      if (!this.allowSuper)
        { this.raise(this.start, "'super' keyword outside a method"); }
      node = this.startNode();
      this.next();
      if (this.type === types.parenL && !this.allowDirectSuper)
        { this.raise(node.start, "super() call outside constructor of a subclass"); }
      if (this.type !== types.dot && this.type !== types.bracketL && this.type !== types.parenL)
        { this.unexpected(); }
      return this.finishNode(node, "Super")

    case types._this:
      node = this.startNode();
      this.next();
      return this.finishNode(node, "ThisExpression")

    case types.name:
      var startPos = this.start, startLoc = this.startLoc, containsEsc = this.containsEsc;
      var id = this.parseIdent(false);
      if (this.options.ecmaVersion >= 8 && !containsEsc && id.name === "async" && !this.canInsertSemicolon() && this.eat(types._function))
        { return this.parseFunction(this.startNodeAt(startPos, startLoc), 0, false, true) }
      if (canBeArrow && !this.canInsertSemicolon()) {
        if (this.eat(types.arrow))
          { return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id], false) }
        if (this.options.ecmaVersion >= 8 && id.name === "async" && this.type === types.name && !containsEsc) {
          id = this.parseIdent(false);
          if (this.canInsertSemicolon() || !this.eat(types.arrow))
            { this.unexpected(); }
          return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id], true)
        }
      }
      return id

    case types.regexp:
      var value = this.value;
      node = this.parseLiteral(value.value);
      node.regex = {pattern: value.pattern, flags: value.flags};
      return node

    case types.num: case types.string:
      return this.parseLiteral(this.value)

    case types._null: case types._true: case types._false:
      node = this.startNode();
      node.value = this.type === types._null ? null : this.type === types._true;
      node.raw = this.type.keyword;
      this.next();
      return this.finishNode(node, "Literal")

    case types.parenL:
      var start = this.start, expr = this.parseParenAndDistinguishExpression(canBeArrow);
      if (refDestructuringErrors) {
        if (refDestructuringErrors.parenthesizedAssign < 0 && !this.isSimpleAssignTarget(expr))
          { refDestructuringErrors.parenthesizedAssign = start; }
        if (refDestructuringErrors.parenthesizedBind < 0)
          { refDestructuringErrors.parenthesizedBind = start; }
      }
      return expr

    case types.bracketL:
      node = this.startNode();
      this.next();
      node.elements = this.parseExprList(types.bracketR, true, true, refDestructuringErrors);
      return this.finishNode(node, "ArrayExpression")

    case types.braceL:
      return this.parseObj(false, refDestructuringErrors)

    case types._function:
      node = this.startNode();
      this.next();
      return this.parseFunction(node, 0)

    case types._class:
      return this.parseClass(this.startNode(), false)

    case types._new:
      return this.parseNew()

    case types.backQuote:
      return this.parseTemplate()

    case types._import:
      if (this.options.ecmaVersion >= 11) {
        return this.parseExprImport()
      } else {
        return this.unexpected()
      }

    default:
      this.unexpected();
    }
  };

  pp$3.parseExprImport = function() {
    var node = this.startNode();
    this.next(); 
    switch (this.type) {
    case types.parenL:
      return this.parseDynamicImport(node)
    default:
      this.unexpected();
    }
  };

  pp$3.parseDynamicImport = function(node) {
    this.next(); 

    node.source = this.parseMaybeAssign();

    if (!this.eat(types.parenR)) {
      var errorPos = this.start;
      if (this.eat(types.comma) && this.eat(types.parenR)) {
        this.raiseRecoverable(errorPos, "Trailing comma is not allowed in import()");
      } else {
        this.unexpected(errorPos);
      }
    }

    return this.finishNode(node, "ImportExpression")
  };

  pp$3.parseLiteral = function(value) {
    var node = this.startNode();
    node.value = value;
    node.raw = this.input.slice(this.start, this.end);
    if (node.raw.charCodeAt(node.raw.length - 1) === 110) { node.bigint = node.raw.slice(0, -1); }
    this.next();
    return this.finishNode(node, "Literal")
  };

  pp$3.parseParenExpression = function() {
    this.expect(types.parenL);
    var val = this.parseExpression();
    this.expect(types.parenR);
    return val
  };

  pp$3.parseParenAndDistinguishExpression = function(canBeArrow) {
    var startPos = this.start, startLoc = this.startLoc, val, allowTrailingComma = this.options.ecmaVersion >= 8;
    if (this.options.ecmaVersion >= 6) {
      this.next();

      var innerStartPos = this.start, innerStartLoc = this.startLoc;
      var exprList = [], first = true, lastIsComma = false;
      var refDestructuringErrors = new DestructuringErrors, oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, spreadStart;
      this.yieldPos = 0;
      this.awaitPos = 0;
      while (this.type !== types.parenR) {
        first ? first = false : this.expect(types.comma);
        if (allowTrailingComma && this.afterTrailingComma(types.parenR, true)) {
          lastIsComma = true;
          break
        } else if (this.type === types.ellipsis) {
          spreadStart = this.start;
          exprList.push(this.parseParenItem(this.parseRestBinding()));
          if (this.type === types.comma) { this.raise(this.start, "Comma is not permitted after the rest element"); }
          break
        } else {
          exprList.push(this.parseMaybeAssign(false, refDestructuringErrors, this.parseParenItem));
        }
      }
      var innerEndPos = this.start, innerEndLoc = this.startLoc;
      this.expect(types.parenR);

      if (canBeArrow && !this.canInsertSemicolon() && this.eat(types.arrow)) {
        this.checkPatternErrors(refDestructuringErrors, false);
        this.checkYieldAwaitInDefaultParams();
        this.yieldPos = oldYieldPos;
        this.awaitPos = oldAwaitPos;
        return this.parseParenArrowList(startPos, startLoc, exprList)
      }

      if (!exprList.length || lastIsComma) { this.unexpected(this.lastTokStart); }
      if (spreadStart) { this.unexpected(spreadStart); }
      this.checkExpressionErrors(refDestructuringErrors, true);
      this.yieldPos = oldYieldPos || this.yieldPos;
      this.awaitPos = oldAwaitPos || this.awaitPos;

      if (exprList.length > 1) {
        val = this.startNodeAt(innerStartPos, innerStartLoc);
        val.expressions = exprList;
        this.finishNodeAt(val, "SequenceExpression", innerEndPos, innerEndLoc);
      } else {
        val = exprList[0];
      }
    } else {
      val = this.parseParenExpression();
    }

    if (this.options.preserveParens) {
      var par = this.startNodeAt(startPos, startLoc);
      par.expression = val;
      return this.finishNode(par, "ParenthesizedExpression")
    } else {
      return val
    }
  };

  pp$3.parseParenItem = function(item) {
    return item
  };

  pp$3.parseParenArrowList = function(startPos, startLoc, exprList) {
    return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), exprList)
  };


  var empty$1 = [];

  pp$3.parseNew = function() {
    if (this.containsEsc) { this.raiseRecoverable(this.start, "Escape sequence in keyword new"); }
    var node = this.startNode();
    var meta = this.parseIdent(true);
    if (this.options.ecmaVersion >= 6 && this.eat(types.dot)) {
      node.meta = meta;
      var containsEsc = this.containsEsc;
      node.property = this.parseIdent(true);
      if (node.property.name !== "target" || containsEsc)
        { this.raiseRecoverable(node.property.start, "The only valid meta property for new is new.target"); }
      if (!this.inNonArrowFunction())
        { this.raiseRecoverable(node.start, "new.target can only be used in functions"); }
      return this.finishNode(node, "MetaProperty")
    }
    var startPos = this.start, startLoc = this.startLoc, isImport = this.type === types._import;
    node.callee = this.parseSubscripts(this.parseExprAtom(), startPos, startLoc, true);
    if (isImport && node.callee.type === "ImportExpression") {
      this.raise(startPos, "Cannot use new with import()");
    }
    if (this.eat(types.parenL)) { node.arguments = this.parseExprList(types.parenR, this.options.ecmaVersion >= 8, false); }
    else { node.arguments = empty$1; }
    return this.finishNode(node, "NewExpression")
  };


  pp$3.parseTemplateElement = function(ref) {
    var isTagged = ref.isTagged;

    var elem = this.startNode();
    if (this.type === types.invalidTemplate) {
      if (!isTagged) {
        this.raiseRecoverable(this.start, "Bad escape sequence in untagged template literal");
      }
      elem.value = {
        raw: this.value,
        cooked: null
      };
    } else {
      elem.value = {
        raw: this.input.slice(this.start, this.end).replace(/\r\n?/g, "\n"),
        cooked: this.value
      };
    }
    this.next();
    elem.tail = this.type === types.backQuote;
    return this.finishNode(elem, "TemplateElement")
  };

  pp$3.parseTemplate = function(ref) {
    if ( ref === void 0 ) ref = {};
    var isTagged = ref.isTagged; if ( isTagged === void 0 ) isTagged = false;

    var node = this.startNode();
    this.next();
    node.expressions = [];
    var curElt = this.parseTemplateElement({isTagged: isTagged});
    node.quasis = [curElt];
    while (!curElt.tail) {
      if (this.type === types.eof) { this.raise(this.pos, "Unterminated template literal"); }
      this.expect(types.dollarBraceL);
      node.expressions.push(this.parseExpression());
      this.expect(types.braceR);
      node.quasis.push(curElt = this.parseTemplateElement({isTagged: isTagged}));
    }
    this.next();
    return this.finishNode(node, "TemplateLiteral")
  };

  pp$3.isAsyncProp = function(prop) {
    return !prop.computed && prop.key.type === "Identifier" && prop.key.name === "async" &&
      (this.type === types.name || this.type === types.num || this.type === types.string || this.type === types.bracketL || this.type.keyword || (this.options.ecmaVersion >= 9 && this.type === types.star)) &&
      !lineBreak.test(this.input.slice(this.lastTokEnd, this.start))
  };


  pp$3.parseObj = function(isPattern, refDestructuringErrors) {
    var node = this.startNode(), first = true, propHash = {};
    node.properties = [];
    this.next();
    while (!this.eat(types.braceR)) {
      if (!first) {
        this.expect(types.comma);
        if (this.options.ecmaVersion >= 5 && this.afterTrailingComma(types.braceR)) { break }
      } else { first = false; }

      var prop = this.parseProperty(isPattern, refDestructuringErrors);
      if (!isPattern) { this.checkPropClash(prop, propHash, refDestructuringErrors); }
      node.properties.push(prop);
    }
    return this.finishNode(node, isPattern ? "ObjectPattern" : "ObjectExpression")
  };

  pp$3.parseProperty = function(isPattern, refDestructuringErrors) {
    var prop = this.startNode(), isGenerator, isAsync, startPos, startLoc;
    if (this.options.ecmaVersion >= 9 && this.eat(types.ellipsis)) {
      if (isPattern) {
        prop.argument = this.parseIdent(false);
        if (this.type === types.comma) {
          this.raise(this.start, "Comma is not permitted after the rest element");
        }
        return this.finishNode(prop, "RestElement")
      }
      if (this.type === types.parenL && refDestructuringErrors) {
        if (refDestructuringErrors.parenthesizedAssign < 0) {
          refDestructuringErrors.parenthesizedAssign = this.start;
        }
        if (refDestructuringErrors.parenthesizedBind < 0) {
          refDestructuringErrors.parenthesizedBind = this.start;
        }
      }
      prop.argument = this.parseMaybeAssign(false, refDestructuringErrors);
      if (this.type === types.comma && refDestructuringErrors && refDestructuringErrors.trailingComma < 0) {
        refDestructuringErrors.trailingComma = this.start;
      }
      return this.finishNode(prop, "SpreadElement")
    }
    if (this.options.ecmaVersion >= 6) {
      prop.method = false;
      prop.shorthand = false;
      if (isPattern || refDestructuringErrors) {
        startPos = this.start;
        startLoc = this.startLoc;
      }
      if (!isPattern)
        { isGenerator = this.eat(types.star); }
    }
    var containsEsc = this.containsEsc;
    this.parsePropertyName(prop);
    if (!isPattern && !containsEsc && this.options.ecmaVersion >= 8 && !isGenerator && this.isAsyncProp(prop)) {
      isAsync = true;
      isGenerator = this.options.ecmaVersion >= 9 && this.eat(types.star);
      this.parsePropertyName(prop, refDestructuringErrors);
    } else {
      isAsync = false;
    }
    this.parsePropertyValue(prop, isPattern, isGenerator, isAsync, startPos, startLoc, refDestructuringErrors, containsEsc);
    return this.finishNode(prop, "Property")
  };

  pp$3.parsePropertyValue = function(prop, isPattern, isGenerator, isAsync, startPos, startLoc, refDestructuringErrors, containsEsc) {
    if ((isGenerator || isAsync) && this.type === types.colon)
      { this.unexpected(); }

    if (this.eat(types.colon)) {
      prop.value = isPattern ? this.parseMaybeDefault(this.start, this.startLoc) : this.parseMaybeAssign(false, refDestructuringErrors);
      prop.kind = "init";
    } else if (this.options.ecmaVersion >= 6 && this.type === types.parenL) {
      if (isPattern) { this.unexpected(); }
      prop.kind = "init";
      prop.method = true;
      prop.value = this.parseMethod(isGenerator, isAsync);
    } else if (!isPattern && !containsEsc &&
               this.options.ecmaVersion >= 5 && !prop.computed && prop.key.type === "Identifier" &&
               (prop.key.name === "get" || prop.key.name === "set") &&
               (this.type !== types.comma && this.type !== types.braceR)) {
      if (isGenerator || isAsync) { this.unexpected(); }
      prop.kind = prop.key.name;
      this.parsePropertyName(prop);
      prop.value = this.parseMethod(false);
      var paramCount = prop.kind === "get" ? 0 : 1;
      if (prop.value.params.length !== paramCount) {
        var start = prop.value.start;
        if (prop.kind === "get")
          { this.raiseRecoverable(start, "getter should have no params"); }
        else
          { this.raiseRecoverable(start, "setter should have exactly one param"); }
      } else {
        if (prop.kind === "set" && prop.value.params[0].type === "RestElement")
          { this.raiseRecoverable(prop.value.params[0].start, "Setter cannot use rest params"); }
      }
    } else if (this.options.ecmaVersion >= 6 && !prop.computed && prop.key.type === "Identifier") {
      if (isGenerator || isAsync) { this.unexpected(); }
      this.checkUnreserved(prop.key);
      if (prop.key.name === "await" && !this.awaitIdentPos)
        { this.awaitIdentPos = startPos; }
      prop.kind = "init";
      if (isPattern) {
        prop.value = this.parseMaybeDefault(startPos, startLoc, prop.key);
      } else if (this.type === types.eq && refDestructuringErrors) {
        if (refDestructuringErrors.shorthandAssign < 0)
          { refDestructuringErrors.shorthandAssign = this.start; }
        prop.value = this.parseMaybeDefault(startPos, startLoc, prop.key);
      } else {
        prop.value = prop.key;
      }
      prop.shorthand = true;
    } else { this.unexpected(); }
  };

  pp$3.parsePropertyName = function(prop) {
    if (this.options.ecmaVersion >= 6) {
      if (this.eat(types.bracketL)) {
        prop.computed = true;
        prop.key = this.parseMaybeAssign();
        this.expect(types.bracketR);
        return prop.key
      } else {
        prop.computed = false;
      }
    }
    return prop.key = this.type === types.num || this.type === types.string ? this.parseExprAtom() : this.parseIdent(this.options.allowReserved !== "never")
  };


  pp$3.initFunction = function(node) {
    node.id = null;
    if (this.options.ecmaVersion >= 6) { node.generator = node.expression = false; }
    if (this.options.ecmaVersion >= 8) { node.async = false; }
  };


  pp$3.parseMethod = function(isGenerator, isAsync, allowDirectSuper) {
    var node = this.startNode(), oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;

    this.initFunction(node);
    if (this.options.ecmaVersion >= 6)
      { node.generator = isGenerator; }
    if (this.options.ecmaVersion >= 8)
      { node.async = !!isAsync; }

    this.yieldPos = 0;
    this.awaitPos = 0;
    this.awaitIdentPos = 0;
    this.enterScope(functionFlags(isAsync, node.generator) | SCOPE_SUPER | (allowDirectSuper ? SCOPE_DIRECT_SUPER : 0));

    this.expect(types.parenL);
    node.params = this.parseBindingList(types.parenR, false, this.options.ecmaVersion >= 8);
    this.checkYieldAwaitInDefaultParams();
    this.parseFunctionBody(node, false, true);

    this.yieldPos = oldYieldPos;
    this.awaitPos = oldAwaitPos;
    this.awaitIdentPos = oldAwaitIdentPos;
    return this.finishNode(node, "FunctionExpression")
  };


  pp$3.parseArrowExpression = function(node, params, isAsync) {
    var oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;

    this.enterScope(functionFlags(isAsync, false) | SCOPE_ARROW);
    this.initFunction(node);
    if (this.options.ecmaVersion >= 8) { node.async = !!isAsync; }

    this.yieldPos = 0;
    this.awaitPos = 0;
    this.awaitIdentPos = 0;

    node.params = this.toAssignableList(params, true);
    this.parseFunctionBody(node, true, false);

    this.yieldPos = oldYieldPos;
    this.awaitPos = oldAwaitPos;
    this.awaitIdentPos = oldAwaitIdentPos;
    return this.finishNode(node, "ArrowFunctionExpression")
  };


  pp$3.parseFunctionBody = function(node, isArrowFunction, isMethod) {
    var isExpression = isArrowFunction && this.type !== types.braceL;
    var oldStrict = this.strict, useStrict = false;

    if (isExpression) {
      node.body = this.parseMaybeAssign();
      node.expression = true;
      this.checkParams(node, false);
    } else {
      var nonSimple = this.options.ecmaVersion >= 7 && !this.isSimpleParamList(node.params);
      if (!oldStrict || nonSimple) {
        useStrict = this.strictDirective(this.end);
        if (useStrict && nonSimple)
          { this.raiseRecoverable(node.start, "Illegal 'use strict' directive in function with non-simple parameter list"); }
      }
      var oldLabels = this.labels;
      this.labels = [];
      if (useStrict) { this.strict = true; }

      this.checkParams(node, !oldStrict && !useStrict && !isArrowFunction && !isMethod && this.isSimpleParamList(node.params));
      node.body = this.parseBlock(false);
      node.expression = false;
      this.adaptDirectivePrologue(node.body.body);
      this.labels = oldLabels;
    }
    this.exitScope();

    if (this.strict && node.id) { this.checkLVal(node.id, BIND_OUTSIDE); }
    this.strict = oldStrict;
  };

  pp$3.isSimpleParamList = function(params) {
    for (var i = 0, list = params; i < list.length; i += 1)
      {
      var param = list[i];

      if (param.type !== "Identifier") { return false
    } }
    return true
  };


  pp$3.checkParams = function(node, allowDuplicates) {
    var nameHash = {};
    for (var i = 0, list = node.params; i < list.length; i += 1)
      {
      var param = list[i];

      this.checkLVal(param, BIND_VAR, allowDuplicates ? null : nameHash);
    }
  };


  pp$3.parseExprList = function(close, allowTrailingComma, allowEmpty, refDestructuringErrors) {
    var elts = [], first = true;
    while (!this.eat(close)) {
      if (!first) {
        this.expect(types.comma);
        if (allowTrailingComma && this.afterTrailingComma(close)) { break }
      } else { first = false; }

      var elt = (void 0);
      if (allowEmpty && this.type === types.comma)
        { elt = null; }
      else if (this.type === types.ellipsis) {
        elt = this.parseSpread(refDestructuringErrors);
        if (refDestructuringErrors && this.type === types.comma && refDestructuringErrors.trailingComma < 0)
          { refDestructuringErrors.trailingComma = this.start; }
      } else {
        elt = this.parseMaybeAssign(false, refDestructuringErrors);
      }
      elts.push(elt);
    }
    return elts
  };

  pp$3.checkUnreserved = function(ref) {
    var start = ref.start;
    var end = ref.end;
    var name = ref.name;

    if (this.inGenerator && name === "yield")
      { this.raiseRecoverable(start, "Cannot use 'yield' as identifier inside a generator"); }
    if (this.inAsync && name === "await")
      { this.raiseRecoverable(start, "Cannot use 'await' as identifier inside an async function"); }
    if (this.keywords.test(name))
      { this.raise(start, ("Unexpected keyword '" + name + "'")); }
    if (this.options.ecmaVersion < 6 &&
      this.input.slice(start, end).indexOf("\\") !== -1) { return }
    var re = this.strict ? this.reservedWordsStrict : this.reservedWords;
    if (re.test(name)) {
      if (!this.inAsync && name === "await")
        { this.raiseRecoverable(start, "Cannot use keyword 'await' outside an async function"); }
      this.raiseRecoverable(start, ("The keyword '" + name + "' is reserved"));
    }
  };


  pp$3.parseIdent = function(liberal, isBinding) {
    var node = this.startNode();
    if (this.type === types.name) {
      node.name = this.value;
    } else if (this.type.keyword) {
      node.name = this.type.keyword;

      if ((node.name === "class" || node.name === "function") &&
          (this.lastTokEnd !== this.lastTokStart + 1 || this.input.charCodeAt(this.lastTokStart) !== 46)) {
        this.context.pop();
      }
    } else {
      this.unexpected();
    }
    this.next(!!liberal);
    this.finishNode(node, "Identifier");
    if (!liberal) {
      this.checkUnreserved(node);
      if (node.name === "await" && !this.awaitIdentPos)
        { this.awaitIdentPos = node.start; }
    }
    return node
  };


  pp$3.parseYield = function(noIn) {
    if (!this.yieldPos) { this.yieldPos = this.start; }

    var node = this.startNode();
    this.next();
    if (this.type === types.semi || this.canInsertSemicolon() || (this.type !== types.star && !this.type.startsExpr)) {
      node.delegate = false;
      node.argument = null;
    } else {
      node.delegate = this.eat(types.star);
      node.argument = this.parseMaybeAssign(noIn);
    }
    return this.finishNode(node, "YieldExpression")
  };

  pp$3.parseAwait = function() {
    if (!this.awaitPos) { this.awaitPos = this.start; }

    var node = this.startNode();
    this.next();
    node.argument = this.parseMaybeUnary(null, false);
    return this.finishNode(node, "AwaitExpression")
  };

  var pp$4 = Parser.prototype;


  pp$4.raise = function(pos, message) {
    var loc = getLineInfo(this.input, pos);
    message += " (" + loc.line + ":" + loc.column + ")";
    var err = new SyntaxError(message);
    err.pos = pos; err.loc = loc; err.raisedAt = this.pos;
    throw err
  };

  pp$4.raiseRecoverable = pp$4.raise;

  pp$4.curPosition = function() {
    if (this.options.locations) {
      return new Position(this.curLine, this.pos - this.lineStart)
    }
  };

  var pp$5 = Parser.prototype;

  var Scope = function Scope(flags) {
    this.flags = flags;
    this.var = [];
    this.lexical = [];
    this.functions = [];
  };


  pp$5.enterScope = function(flags) {
    this.scopeStack.push(new Scope(flags));
  };

  pp$5.exitScope = function() {
    this.scopeStack.pop();
  };

  pp$5.treatFunctionsAsVarInScope = function(scope) {
    return (scope.flags & SCOPE_FUNCTION) || !this.inModule && (scope.flags & SCOPE_TOP)
  };

  pp$5.declareName = function(name, bindingType, pos) {
    var redeclared = false;
    if (bindingType === BIND_LEXICAL) {
      var scope = this.currentScope();
      redeclared = scope.lexical.indexOf(name) > -1 || scope.functions.indexOf(name) > -1 || scope.var.indexOf(name) > -1;
      scope.lexical.push(name);
      if (this.inModule && (scope.flags & SCOPE_TOP))
        { delete this.undefinedExports[name]; }
    } else if (bindingType === BIND_SIMPLE_CATCH) {
      var scope$1 = this.currentScope();
      scope$1.lexical.push(name);
    } else if (bindingType === BIND_FUNCTION) {
      var scope$2 = this.currentScope();
      if (this.treatFunctionsAsVar)
        { redeclared = scope$2.lexical.indexOf(name) > -1; }
      else
        { redeclared = scope$2.lexical.indexOf(name) > -1 || scope$2.var.indexOf(name) > -1; }
      scope$2.functions.push(name);
    } else {
      for (var i = this.scopeStack.length - 1; i >= 0; --i) {
        var scope$3 = this.scopeStack[i];
        if (scope$3.lexical.indexOf(name) > -1 && !((scope$3.flags & SCOPE_SIMPLE_CATCH) && scope$3.lexical[0] === name) ||
            !this.treatFunctionsAsVarInScope(scope$3) && scope$3.functions.indexOf(name) > -1) {
          redeclared = true;
          break
        }
        scope$3.var.push(name);
        if (this.inModule && (scope$3.flags & SCOPE_TOP))
          { delete this.undefinedExports[name]; }
        if (scope$3.flags & SCOPE_VAR) { break }
      }
    }
    if (redeclared) { this.raiseRecoverable(pos, ("Identifier '" + name + "' has already been declared")); }
  };

  pp$5.checkLocalExport = function(id) {
    if (this.scopeStack[0].lexical.indexOf(id.name) === -1 &&
        this.scopeStack[0].var.indexOf(id.name) === -1) {
      this.undefinedExports[id.name] = id;
    }
  };

  pp$5.currentScope = function() {
    return this.scopeStack[this.scopeStack.length - 1]
  };

  pp$5.currentVarScope = function() {
    for (var i = this.scopeStack.length - 1;; i--) {
      var scope = this.scopeStack[i];
      if (scope.flags & SCOPE_VAR) { return scope }
    }
  };

  pp$5.currentThisScope = function() {
    for (var i = this.scopeStack.length - 1;; i--) {
      var scope = this.scopeStack[i];
      if (scope.flags & SCOPE_VAR && !(scope.flags & SCOPE_ARROW)) { return scope }
    }
  };

  var Node = function Node(parser, pos, loc) {
    this.type = "";
    this.start = pos;
    this.end = 0;
    if (parser.options.locations)
      { this.loc = new SourceLocation(parser, loc); }
    if (parser.options.directSourceFile)
      { this.sourceFile = parser.options.directSourceFile; }
    if (parser.options.ranges)
      { this.range = [pos, 0]; }
  };


  var pp$6 = Parser.prototype;

  pp$6.startNode = function() {
    return new Node(this, this.start, this.startLoc)
  };

  pp$6.startNodeAt = function(pos, loc) {
    return new Node(this, pos, loc)
  };


  function finishNodeAt(node, type, pos, loc) {
    node.type = type;
    node.end = pos;
    if (this.options.locations)
      { node.loc.end = loc; }
    if (this.options.ranges)
      { node.range[1] = pos; }
    return node
  }

  pp$6.finishNode = function(node, type) {
    return finishNodeAt.call(this, node, type, this.lastTokEnd, this.lastTokEndLoc)
  };


  pp$6.finishNodeAt = function(node, type, pos, loc) {
    return finishNodeAt.call(this, node, type, pos, loc)
  };


  var TokContext = function TokContext(token, isExpr, preserveSpace, override, generator) {
    this.token = token;
    this.isExpr = !!isExpr;
    this.preserveSpace = !!preserveSpace;
    this.override = override;
    this.generator = !!generator;
  };

  var types$1 = {
    b_stat: new TokContext("{", false),
    b_expr: new TokContext("{", true),
    b_tmpl: new TokContext("${", false),
    p_stat: new TokContext("(", false),
    p_expr: new TokContext("(", true),
    q_tmpl: new TokContext("`", true, true, function (p) { return p.tryReadTemplateToken(); }),
    f_stat: new TokContext("function", false),
    f_expr: new TokContext("function", true),
    f_expr_gen: new TokContext("function", true, false, null, true),
    f_gen: new TokContext("function", false, false, null, true)
  };

  var pp$7 = Parser.prototype;

  pp$7.initialContext = function() {
    return [types$1.b_stat]
  };

  pp$7.braceIsBlock = function(prevType) {
    var parent = this.curContext();
    if (parent === types$1.f_expr || parent === types$1.f_stat)
      { return true }
    if (prevType === types.colon && (parent === types$1.b_stat || parent === types$1.b_expr))
      { return !parent.isExpr }

    if (prevType === types._return || prevType === types.name && this.exprAllowed)
      { return lineBreak.test(this.input.slice(this.lastTokEnd, this.start)) }
    if (prevType === types._else || prevType === types.semi || prevType === types.eof || prevType === types.parenR || prevType === types.arrow)
      { return true }
    if (prevType === types.braceL)
      { return parent === types$1.b_stat }
    if (prevType === types._var || prevType === types._const || prevType === types.name)
      { return false }
    return !this.exprAllowed
  };

  pp$7.inGeneratorContext = function() {
    for (var i = this.context.length - 1; i >= 1; i--) {
      var context = this.context[i];
      if (context.token === "function")
        { return context.generator }
    }
    return false
  };

  pp$7.updateContext = function(prevType) {
    var update, type = this.type;
    if (type.keyword && prevType === types.dot)
      { this.exprAllowed = false; }
    else if (update = type.updateContext)
      { update.call(this, prevType); }
    else
      { this.exprAllowed = type.beforeExpr; }
  };


  types.parenR.updateContext = types.braceR.updateContext = function() {
    if (this.context.length === 1) {
      this.exprAllowed = true;
      return
    }
    var out = this.context.pop();
    if (out === types$1.b_stat && this.curContext().token === "function") {
      out = this.context.pop();
    }
    this.exprAllowed = !out.isExpr;
  };

  types.braceL.updateContext = function(prevType) {
    this.context.push(this.braceIsBlock(prevType) ? types$1.b_stat : types$1.b_expr);
    this.exprAllowed = true;
  };

  types.dollarBraceL.updateContext = function() {
    this.context.push(types$1.b_tmpl);
    this.exprAllowed = true;
  };

  types.parenL.updateContext = function(prevType) {
    var statementParens = prevType === types._if || prevType === types._for || prevType === types._with || prevType === types._while;
    this.context.push(statementParens ? types$1.p_stat : types$1.p_expr);
    this.exprAllowed = true;
  };

  types.incDec.updateContext = function() {
  };

  types._function.updateContext = types._class.updateContext = function(prevType) {
    if (prevType.beforeExpr && prevType !== types.semi && prevType !== types._else &&
        !(prevType === types._return && lineBreak.test(this.input.slice(this.lastTokEnd, this.start))) &&
        !((prevType === types.colon || prevType === types.braceL) && this.curContext() === types$1.b_stat))
      { this.context.push(types$1.f_expr); }
    else
      { this.context.push(types$1.f_stat); }
    this.exprAllowed = false;
  };

  types.backQuote.updateContext = function() {
    if (this.curContext() === types$1.q_tmpl)
      { this.context.pop(); }
    else
      { this.context.push(types$1.q_tmpl); }
    this.exprAllowed = false;
  };

  types.star.updateContext = function(prevType) {
    if (prevType === types._function) {
      var index = this.context.length - 1;
      if (this.context[index] === types$1.f_expr)
        { this.context[index] = types$1.f_expr_gen; }
      else
        { this.context[index] = types$1.f_gen; }
    }
    this.exprAllowed = true;
  };

  types.name.updateContext = function(prevType) {
    var allowed = false;
    if (this.options.ecmaVersion >= 6 && prevType !== types.dot) {
      if (this.value === "of" && !this.exprAllowed ||
          this.value === "yield" && this.inGeneratorContext())
        { allowed = true; }
    }
    this.exprAllowed = allowed;
  };


  var ecma9BinaryProperties = "ASCII ASCII_Hex_Digit AHex Alphabetic Alpha Any Assigned Bidi_Control Bidi_C Bidi_Mirrored Bidi_M Case_Ignorable CI Cased Changes_When_Casefolded CWCF Changes_When_Casemapped CWCM Changes_When_Lowercased CWL Changes_When_NFKC_Casefolded CWKCF Changes_When_Titlecased CWT Changes_When_Uppercased CWU Dash Default_Ignorable_Code_Point DI Deprecated Dep Diacritic Dia Emoji Emoji_Component Emoji_Modifier Emoji_Modifier_Base Emoji_Presentation Extender Ext Grapheme_Base Gr_Base Grapheme_Extend Gr_Ext Hex_Digit Hex IDS_Binary_Operator IDSB IDS_Trinary_Operator IDST ID_Continue IDC ID_Start IDS Ideographic Ideo Join_Control Join_C Logical_Order_Exception LOE Lowercase Lower Math Noncharacter_Code_Point NChar Pattern_Syntax Pat_Syn Pattern_White_Space Pat_WS Quotation_Mark QMark Radical Regional_Indicator RI Sentence_Terminal STerm Soft_Dotted SD Terminal_Punctuation Term Unified_Ideograph UIdeo Uppercase Upper Variation_Selector VS White_Space space XID_Continue XIDC XID_Start XIDS";
  var ecma10BinaryProperties = ecma9BinaryProperties + " Extended_Pictographic";
  var ecma11BinaryProperties = ecma10BinaryProperties;
  var unicodeBinaryProperties = {
    9: ecma9BinaryProperties,
    10: ecma10BinaryProperties,
    11: ecma11BinaryProperties
  };

  var unicodeGeneralCategoryValues = "Cased_Letter LC Close_Punctuation Pe Connector_Punctuation Pc Control Cc cntrl Currency_Symbol Sc Dash_Punctuation Pd Decimal_Number Nd digit Enclosing_Mark Me Final_Punctuation Pf Format Cf Initial_Punctuation Pi Letter L Letter_Number Nl Line_Separator Zl Lowercase_Letter Ll Mark M Combining_Mark Math_Symbol Sm Modifier_Letter Lm Modifier_Symbol Sk Nonspacing_Mark Mn Number N Open_Punctuation Ps Other C Other_Letter Lo Other_Number No Other_Punctuation Po Other_Symbol So Paragraph_Separator Zp Private_Use Co Punctuation P punct Separator Z Space_Separator Zs Spacing_Mark Mc Surrogate Cs Symbol S Titlecase_Letter Lt Unassigned Cn Uppercase_Letter Lu";

  var ecma9ScriptValues = "Adlam Adlm Ahom Ahom Anatolian_Hieroglyphs Hluw Arabic Arab Armenian Armn Avestan Avst Balinese Bali Bamum Bamu Bassa_Vah Bass Batak Batk Bengali Beng Bhaiksuki Bhks Bopomofo Bopo Brahmi Brah Braille Brai Buginese Bugi Buhid Buhd Canadian_Aboriginal Cans Carian Cari Caucasian_Albanian Aghb Chakma Cakm Cham Cham Cherokee Cher Common Zyyy Coptic Copt Qaac Cuneiform Xsux Cypriot Cprt Cyrillic Cyrl Deseret Dsrt Devanagari Deva Duployan Dupl Egyptian_Hieroglyphs Egyp Elbasan Elba Ethiopic Ethi Georgian Geor Glagolitic Glag Gothic Goth Grantha Gran Greek Grek Gujarati Gujr Gurmukhi Guru Han Hani Hangul Hang Hanunoo Hano Hatran Hatr Hebrew Hebr Hiragana Hira Imperial_Aramaic Armi Inherited Zinh Qaai Inscriptional_Pahlavi Phli Inscriptional_Parthian Prti Javanese Java Kaithi Kthi Kannada Knda Katakana Kana Kayah_Li Kali Kharoshthi Khar Khmer Khmr Khojki Khoj Khudawadi Sind Lao Laoo Latin Latn Lepcha Lepc Limbu Limb Linear_A Lina Linear_B Linb Lisu Lisu Lycian Lyci Lydian Lydi Mahajani Mahj Malayalam Mlym Mandaic Mand Manichaean Mani Marchen Marc Masaram_Gondi Gonm Meetei_Mayek Mtei Mende_Kikakui Mend Meroitic_Cursive Merc Meroitic_Hieroglyphs Mero Miao Plrd Modi Modi Mongolian Mong Mro Mroo Multani Mult Myanmar Mymr Nabataean Nbat New_Tai_Lue Talu Newa Newa Nko Nkoo Nushu Nshu Ogham Ogam Ol_Chiki Olck Old_Hungarian Hung Old_Italic Ital Old_North_Arabian Narb Old_Permic Perm Old_Persian Xpeo Old_South_Arabian Sarb Old_Turkic Orkh Oriya Orya Osage Osge Osmanya Osma Pahawh_Hmong Hmng Palmyrene Palm Pau_Cin_Hau Pauc Phags_Pa Phag Phoenician Phnx Psalter_Pahlavi Phlp Rejang Rjng Runic Runr Samaritan Samr Saurashtra Saur Sharada Shrd Shavian Shaw Siddham Sidd SignWriting Sgnw Sinhala Sinh Sora_Sompeng Sora Soyombo Soyo Sundanese Sund Syloti_Nagri Sylo Syriac Syrc Tagalog Tglg Tagbanwa Tagb Tai_Le Tale Tai_Tham Lana Tai_Viet Tavt Takri Takr Tamil Taml Tangut Tang Telugu Telu Thaana Thaa Thai Thai Tibetan Tibt Tifinagh Tfng Tirhuta Tirh Ugaritic Ugar Vai Vaii Warang_Citi Wara Yi Yiii Zanabazar_Square Zanb";
  var ecma10ScriptValues = ecma9ScriptValues + " Dogra Dogr Gunjala_Gondi Gong Hanifi_Rohingya Rohg Makasar Maka Medefaidrin Medf Old_Sogdian Sogo Sogdian Sogd";
  var ecma11ScriptValues = ecma10ScriptValues + " Elymaic Elym Nandinagari Nand Nyiakeng_Puachue_Hmong Hmnp Wancho Wcho";
  var unicodeScriptValues = {
    9: ecma9ScriptValues,
    10: ecma10ScriptValues,
    11: ecma11ScriptValues
  };

  var data = {};
  function buildUnicodeData(ecmaVersion) {
    var d = data[ecmaVersion] = {
      binary: wordsRegexp(unicodeBinaryProperties[ecmaVersion] + " " + unicodeGeneralCategoryValues),
      nonBinary: {
        General_Category: wordsRegexp(unicodeGeneralCategoryValues),
        Script: wordsRegexp(unicodeScriptValues[ecmaVersion])
      }
    };
    d.nonBinary.Script_Extensions = d.nonBinary.Script;

    d.nonBinary.gc = d.nonBinary.General_Category;
    d.nonBinary.sc = d.nonBinary.Script;
    d.nonBinary.scx = d.nonBinary.Script_Extensions;
  }
  buildUnicodeData(9);
  buildUnicodeData(10);
  buildUnicodeData(11);

  var pp$8 = Parser.prototype;

  var RegExpValidationState = function RegExpValidationState(parser) {
    this.parser = parser;
    this.validFlags = "gim" + (parser.options.ecmaVersion >= 6 ? "uy" : "") + (parser.options.ecmaVersion >= 9 ? "s" : "");
    this.unicodeProperties = data[parser.options.ecmaVersion >= 11 ? 11 : parser.options.ecmaVersion];
    this.source = "";
    this.flags = "";
    this.start = 0;
    this.switchU = false;
    this.switchN = false;
    this.pos = 0;
    this.lastIntValue = 0;
    this.lastStringValue = "";
    this.lastAssertionIsQuantifiable = false;
    this.numCapturingParens = 0;
    this.maxBackReference = 0;
    this.groupNames = [];
    this.backReferenceNames = [];
  };

  RegExpValidationState.prototype.reset = function reset (start, pattern, flags) {
    var unicode = flags.indexOf("u") !== -1;
    this.start = start | 0;
    this.source = pattern + "";
    this.flags = flags;
    this.switchU = unicode && this.parser.options.ecmaVersion >= 6;
    this.switchN = unicode && this.parser.options.ecmaVersion >= 9;
  };

  RegExpValidationState.prototype.raise = function raise (message) {
    this.parser.raiseRecoverable(this.start, ("Invalid regular expression: /" + (this.source) + "/: " + message));
  };

  RegExpValidationState.prototype.at = function at (i) {
    var s = this.source;
    var l = s.length;
    if (i >= l) {
      return -1
    }
    var c = s.charCodeAt(i);
    if (!this.switchU || c <= 0xD7FF || c >= 0xE000 || i + 1 >= l) {
      return c
    }
    var next = s.charCodeAt(i + 1);
    return next >= 0xDC00 && next <= 0xDFFF ? (c << 10) + next - 0x35FDC00 : c
  };

  RegExpValidationState.prototype.nextIndex = function nextIndex (i) {
    var s = this.source;
    var l = s.length;
    if (i >= l) {
      return l
    }
    var c = s.charCodeAt(i), next;
    if (!this.switchU || c <= 0xD7FF || c >= 0xE000 || i + 1 >= l ||
        (next = s.charCodeAt(i + 1)) < 0xDC00 || next > 0xDFFF) {
      return i + 1
    }
    return i + 2
  };

  RegExpValidationState.prototype.current = function current () {
    return this.at(this.pos)
  };

  RegExpValidationState.prototype.lookahead = function lookahead () {
    return this.at(this.nextIndex(this.pos))
  };

  RegExpValidationState.prototype.advance = function advance () {
    this.pos = this.nextIndex(this.pos);
  };

  RegExpValidationState.prototype.eat = function eat (ch) {
    if (this.current() === ch) {
      this.advance();
      return true
    }
    return false
  };

  function codePointToString(ch) {
    if (ch <= 0xFFFF) { return String.fromCharCode(ch) }
    ch -= 0x10000;
    return String.fromCharCode((ch >> 10) + 0xD800, (ch & 0x03FF) + 0xDC00)
  }

  pp$8.validateRegExpFlags = function(state) {
    var validFlags = state.validFlags;
    var flags = state.flags;

    for (var i = 0; i < flags.length; i++) {
      var flag = flags.charAt(i);
      if (validFlags.indexOf(flag) === -1) {
        this.raise(state.start, "Invalid regular expression flag");
      }
      if (flags.indexOf(flag, i + 1) > -1) {
        this.raise(state.start, "Duplicate regular expression flag");
      }
    }
  };

  pp$8.validateRegExpPattern = function(state) {
    this.regexp_pattern(state);

    if (!state.switchN && this.options.ecmaVersion >= 9 && state.groupNames.length > 0) {
      state.switchN = true;
      this.regexp_pattern(state);
    }
  };

  pp$8.regexp_pattern = function(state) {
    state.pos = 0;
    state.lastIntValue = 0;
    state.lastStringValue = "";
    state.lastAssertionIsQuantifiable = false;
    state.numCapturingParens = 0;
    state.maxBackReference = 0;
    state.groupNames.length = 0;
    state.backReferenceNames.length = 0;

    this.regexp_disjunction(state);

    if (state.pos !== state.source.length) {
      if (state.eat(0x29 )) {
        state.raise("Unmatched ')'");
      }
      if (state.eat(0x5D ) || state.eat(0x7D )) {
        state.raise("Lone quantifier brackets");
      }
    }
    if (state.maxBackReference > state.numCapturingParens) {
      state.raise("Invalid escape");
    }
    for (var i = 0, list = state.backReferenceNames; i < list.length; i += 1) {
      var name = list[i];

      if (state.groupNames.indexOf(name) === -1) {
        state.raise("Invalid named capture referenced");
      }
    }
  };

  pp$8.regexp_disjunction = function(state) {
    this.regexp_alternative(state);
    while (state.eat(0x7C )) {
      this.regexp_alternative(state);
    }

    if (this.regexp_eatQuantifier(state, true)) {
      state.raise("Nothing to repeat");
    }
    if (state.eat(0x7B )) {
      state.raise("Lone quantifier brackets");
    }
  };

  pp$8.regexp_alternative = function(state) {
    while (state.pos < state.source.length && this.regexp_eatTerm(state))
      { }
  };

  pp$8.regexp_eatTerm = function(state) {
    if (this.regexp_eatAssertion(state)) {
      if (state.lastAssertionIsQuantifiable && this.regexp_eatQuantifier(state)) {
        if (state.switchU) {
          state.raise("Invalid quantifier");
        }
      }
      return true
    }

    if (state.switchU ? this.regexp_eatAtom(state) : this.regexp_eatExtendedAtom(state)) {
      this.regexp_eatQuantifier(state);
      return true
    }

    return false
  };

  pp$8.regexp_eatAssertion = function(state) {
    var start = state.pos;
    state.lastAssertionIsQuantifiable = false;

    if (state.eat(0x5E ) || state.eat(0x24 )) {
      return true
    }

    if (state.eat(0x5C )) {
      if (state.eat(0x42 ) || state.eat(0x62 )) {
        return true
      }
      state.pos = start;
    }

    if (state.eat(0x28 ) && state.eat(0x3F )) {
      var lookbehind = false;
      if (this.options.ecmaVersion >= 9) {
        lookbehind = state.eat(0x3C );
      }
      if (state.eat(0x3D ) || state.eat(0x21 )) {
        this.regexp_disjunction(state);
        if (!state.eat(0x29 )) {
          state.raise("Unterminated group");
        }
        state.lastAssertionIsQuantifiable = !lookbehind;
        return true
      }
    }

    state.pos = start;
    return false
  };

  pp$8.regexp_eatQuantifier = function(state, noError) {
    if ( noError === void 0 ) noError = false;

    if (this.regexp_eatQuantifierPrefix(state, noError)) {
      state.eat(0x3F );
      return true
    }
    return false
  };

  pp$8.regexp_eatQuantifierPrefix = function(state, noError) {
    return (
      state.eat(0x2A ) ||
      state.eat(0x2B ) ||
      state.eat(0x3F ) ||
      this.regexp_eatBracedQuantifier(state, noError)
    )
  };
  pp$8.regexp_eatBracedQuantifier = function(state, noError) {
    var start = state.pos;
    if (state.eat(0x7B )) {
      var min = 0, max = -1;
      if (this.regexp_eatDecimalDigits(state)) {
        min = state.lastIntValue;
        if (state.eat(0x2C ) && this.regexp_eatDecimalDigits(state)) {
          max = state.lastIntValue;
        }
        if (state.eat(0x7D )) {
          if (max !== -1 && max < min && !noError) {
            state.raise("numbers out of order in {} quantifier");
          }
          return true
        }
      }
      if (state.switchU && !noError) {
        state.raise("Incomplete quantifier");
      }
      state.pos = start;
    }
    return false
  };

  pp$8.regexp_eatAtom = function(state) {
    return (
      this.regexp_eatPatternCharacters(state) ||
      state.eat(0x2E ) ||
      this.regexp_eatReverseSolidusAtomEscape(state) ||
      this.regexp_eatCharacterClass(state) ||
      this.regexp_eatUncapturingGroup(state) ||
      this.regexp_eatCapturingGroup(state)
    )
  };
  pp$8.regexp_eatReverseSolidusAtomEscape = function(state) {
    var start = state.pos;
    if (state.eat(0x5C )) {
      if (this.regexp_eatAtomEscape(state)) {
        return true
      }
      state.pos = start;
    }
    return false
  };
  pp$8.regexp_eatUncapturingGroup = function(state) {
    var start = state.pos;
    if (state.eat(0x28 )) {
      if (state.eat(0x3F ) && state.eat(0x3A )) {
        this.regexp_disjunction(state);
        if (state.eat(0x29 )) {
          return true
        }
        state.raise("Unterminated group");
      }
      state.pos = start;
    }
    return false
  };
  pp$8.regexp_eatCapturingGroup = function(state) {
    if (state.eat(0x28 )) {
      if (this.options.ecmaVersion >= 9) {
        this.regexp_groupSpecifier(state);
      } else if (state.current() === 0x3F ) {
        state.raise("Invalid group");
      }
      this.regexp_disjunction(state);
      if (state.eat(0x29 )) {
        state.numCapturingParens += 1;
        return true
      }
      state.raise("Unterminated group");
    }
    return false
  };

  pp$8.regexp_eatExtendedAtom = function(state) {
    return (
      state.eat(0x2E ) ||
      this.regexp_eatReverseSolidusAtomEscape(state) ||
      this.regexp_eatCharacterClass(state) ||
      this.regexp_eatUncapturingGroup(state) ||
      this.regexp_eatCapturingGroup(state) ||
      this.regexp_eatInvalidBracedQuantifier(state) ||
      this.regexp_eatExtendedPatternCharacter(state)
    )
  };

  pp$8.regexp_eatInvalidBracedQuantifier = function(state) {
    if (this.regexp_eatBracedQuantifier(state, true)) {
      state.raise("Nothing to repeat");
    }
    return false
  };

  pp$8.regexp_eatSyntaxCharacter = function(state) {
    var ch = state.current();
    if (isSyntaxCharacter(ch)) {
      state.lastIntValue = ch;
      state.advance();
      return true
    }
    return false
  };
  function isSyntaxCharacter(ch) {
    return (
      ch === 0x24  ||
      ch >= 0x28  && ch <= 0x2B  ||
      ch === 0x2E  ||
      ch === 0x3F  ||
      ch >= 0x5B  && ch <= 0x5E  ||
      ch >= 0x7B  && ch <= 0x7D 
    )
  }

  pp$8.regexp_eatPatternCharacters = function(state) {
    var start = state.pos;
    var ch = 0;
    while ((ch = state.current()) !== -1 && !isSyntaxCharacter(ch)) {
      state.advance();
    }
    return state.pos !== start
  };

  pp$8.regexp_eatExtendedPatternCharacter = function(state) {
    var ch = state.current();
    if (
      ch !== -1 &&
      ch !== 0x24  &&
      !(ch >= 0x28  && ch <= 0x2B ) &&
      ch !== 0x2E  &&
      ch !== 0x3F  &&
      ch !== 0x5B  &&
      ch !== 0x5E  &&
      ch !== 0x7C 
    ) {
      state.advance();
      return true
    }
    return false
  };

  pp$8.regexp_groupSpecifier = function(state) {
    if (state.eat(0x3F )) {
      if (this.regexp_eatGroupName(state)) {
        if (state.groupNames.indexOf(state.lastStringValue) !== -1) {
          state.raise("Duplicate capture group name");
        }
        state.groupNames.push(state.lastStringValue);
        return
      }
      state.raise("Invalid group");
    }
  };

  pp$8.regexp_eatGroupName = function(state) {
    state.lastStringValue = "";
    if (state.eat(0x3C )) {
      if (this.regexp_eatRegExpIdentifierName(state) && state.eat(0x3E )) {
        return true
      }
      state.raise("Invalid capture group name");
    }
    return false
  };

  pp$8.regexp_eatRegExpIdentifierName = function(state) {
    state.lastStringValue = "";
    if (this.regexp_eatRegExpIdentifierStart(state)) {
      state.lastStringValue += codePointToString(state.lastIntValue);
      while (this.regexp_eatRegExpIdentifierPart(state)) {
        state.lastStringValue += codePointToString(state.lastIntValue);
      }
      return true
    }
    return false
  };

  pp$8.regexp_eatRegExpIdentifierStart = function(state) {
    var start = state.pos;
    var ch = state.current();
    state.advance();

    if (ch === 0x5C  && this.regexp_eatRegExpUnicodeEscapeSequence(state)) {
      ch = state.lastIntValue;
    }
    if (isRegExpIdentifierStart(ch)) {
      state.lastIntValue = ch;
      return true
    }

    state.pos = start;
    return false
  };
  function isRegExpIdentifierStart(ch) {
    return isIdentifierStart(ch, true) || ch === 0x24  || ch === 0x5F 
  }

  pp$8.regexp_eatRegExpIdentifierPart = function(state) {
    var start = state.pos;
    var ch = state.current();
    state.advance();

    if (ch === 0x5C  && this.regexp_eatRegExpUnicodeEscapeSequence(state)) {
      ch = state.lastIntValue;
    }
    if (isRegExpIdentifierPart(ch)) {
      state.lastIntValue = ch;
      return true
    }

    state.pos = start;
    return false
  };
  function isRegExpIdentifierPart(ch) {
    return isIdentifierChar(ch, true) || ch === 0x24  || ch === 0x5F  || ch === 0x200C  || ch === 0x200D 
  }

  pp$8.regexp_eatAtomEscape = function(state) {
    if (
      this.regexp_eatBackReference(state) ||
      this.regexp_eatCharacterClassEscape(state) ||
      this.regexp_eatCharacterEscape(state) ||
      (state.switchN && this.regexp_eatKGroupName(state))
    ) {
      return true
    }
    if (state.switchU) {
      if (state.current() === 0x63 ) {
        state.raise("Invalid unicode escape");
      }
      state.raise("Invalid escape");
    }
    return false
  };
  pp$8.regexp_eatBackReference = function(state) {
    var start = state.pos;
    if (this.regexp_eatDecimalEscape(state)) {
      var n = state.lastIntValue;
      if (state.switchU) {
        if (n > state.maxBackReference) {
          state.maxBackReference = n;
        }
        return true
      }
      if (n <= state.numCapturingParens) {
        return true
      }
      state.pos = start;
    }
    return false
  };
  pp$8.regexp_eatKGroupName = function(state) {
    if (state.eat(0x6B )) {
      if (this.regexp_eatGroupName(state)) {
        state.backReferenceNames.push(state.lastStringValue);
        return true
      }
      state.raise("Invalid named reference");
    }
    return false
  };

  pp$8.regexp_eatCharacterEscape = function(state) {
    return (
      this.regexp_eatControlEscape(state) ||
      this.regexp_eatCControlLetter(state) ||
      this.regexp_eatZero(state) ||
      this.regexp_eatHexEscapeSequence(state) ||
      this.regexp_eatRegExpUnicodeEscapeSequence(state) ||
      (!state.switchU && this.regexp_eatLegacyOctalEscapeSequence(state)) ||
      this.regexp_eatIdentityEscape(state)
    )
  };
  pp$8.regexp_eatCControlLetter = function(state) {
    var start = state.pos;
    if (state.eat(0x63 )) {
      if (this.regexp_eatControlLetter(state)) {
        return true
      }
      state.pos = start;
    }
    return false
  };
  pp$8.regexp_eatZero = function(state) {
    if (state.current() === 0x30  && !isDecimalDigit(state.lookahead())) {
      state.lastIntValue = 0;
      state.advance();
      return true
    }
    return false
  };

  pp$8.regexp_eatControlEscape = function(state) {
    var ch = state.current();
    if (ch === 0x74 ) {
      state.lastIntValue = 0x09; 
      state.advance();
      return true
    }
    if (ch === 0x6E ) {
      state.lastIntValue = 0x0A; 
      state.advance();
      return true
    }
    if (ch === 0x76 ) {
      state.lastIntValue = 0x0B; 
      state.advance();
      return true
    }
    if (ch === 0x66 ) {
      state.lastIntValue = 0x0C; 
      state.advance();
      return true
    }
    if (ch === 0x72 ) {
      state.lastIntValue = 0x0D; 
      state.advance();
      return true
    }
    return false
  };

  pp$8.regexp_eatControlLetter = function(state) {
    var ch = state.current();
    if (isControlLetter(ch)) {
      state.lastIntValue = ch % 0x20;
      state.advance();
      return true
    }
    return false
  };
  function isControlLetter(ch) {
    return (
      (ch >= 0x41  && ch <= 0x5A ) ||
      (ch >= 0x61  && ch <= 0x7A )
    )
  }

  pp$8.regexp_eatRegExpUnicodeEscapeSequence = function(state) {
    var start = state.pos;

    if (state.eat(0x75 )) {
      if (this.regexp_eatFixedHexDigits(state, 4)) {
        var lead = state.lastIntValue;
        if (state.switchU && lead >= 0xD800 && lead <= 0xDBFF) {
          var leadSurrogateEnd = state.pos;
          if (state.eat(0x5C ) && state.eat(0x75 ) && this.regexp_eatFixedHexDigits(state, 4)) {
            var trail = state.lastIntValue;
            if (trail >= 0xDC00 && trail <= 0xDFFF) {
              state.lastIntValue = (lead - 0xD800) * 0x400 + (trail - 0xDC00) + 0x10000;
              return true
            }
          }
          state.pos = leadSurrogateEnd;
          state.lastIntValue = lead;
        }
        return true
      }
      if (
        state.switchU &&
        state.eat(0x7B ) &&
        this.regexp_eatHexDigits(state) &&
        state.eat(0x7D ) &&
        isValidUnicode(state.lastIntValue)
      ) {
        return true
      }
      if (state.switchU) {
        state.raise("Invalid unicode escape");
      }
      state.pos = start;
    }

    return false
  };
  function isValidUnicode(ch) {
    return ch >= 0 && ch <= 0x10FFFF
  }

  pp$8.regexp_eatIdentityEscape = function(state) {
    if (state.switchU) {
      if (this.regexp_eatSyntaxCharacter(state)) {
        return true
      }
      if (state.eat(0x2F )) {
        state.lastIntValue = 0x2F; 
        return true
      }
      return false
    }

    var ch = state.current();
    if (ch !== 0x63  && (!state.switchN || ch !== 0x6B )) {
      state.lastIntValue = ch;
      state.advance();
      return true
    }

    return false
  };

  pp$8.regexp_eatDecimalEscape = function(state) {
    state.lastIntValue = 0;
    var ch = state.current();
    if (ch >= 0x31  && ch <= 0x39 ) {
      do {
        state.lastIntValue = 10 * state.lastIntValue + (ch - 0x30 );
        state.advance();
      } while ((ch = state.current()) >= 0x30  && ch <= 0x39 )
      return true
    }
    return false
  };

  pp$8.regexp_eatCharacterClassEscape = function(state) {
    var ch = state.current();

    if (isCharacterClassEscape(ch)) {
      state.lastIntValue = -1;
      state.advance();
      return true
    }

    if (
      state.switchU &&
      this.options.ecmaVersion >= 9 &&
      (ch === 0x50  || ch === 0x70 )
    ) {
      state.lastIntValue = -1;
      state.advance();
      if (
        state.eat(0x7B ) &&
        this.regexp_eatUnicodePropertyValueExpression(state) &&
        state.eat(0x7D )
      ) {
        return true
      }
      state.raise("Invalid property name");
    }

    return false
  };
  function isCharacterClassEscape(ch) {
    return (
      ch === 0x64  ||
      ch === 0x44  ||
      ch === 0x73  ||
      ch === 0x53  ||
      ch === 0x77  ||
      ch === 0x57 
    )
  }

  pp$8.regexp_eatUnicodePropertyValueExpression = function(state) {
    var start = state.pos;

    if (this.regexp_eatUnicodePropertyName(state) && state.eat(0x3D )) {
      var name = state.lastStringValue;
      if (this.regexp_eatUnicodePropertyValue(state)) {
        var value = state.lastStringValue;
        this.regexp_validateUnicodePropertyNameAndValue(state, name, value);
        return true
      }
    }
    state.pos = start;

    if (this.regexp_eatLoneUnicodePropertyNameOrValue(state)) {
      var nameOrValue = state.lastStringValue;
      this.regexp_validateUnicodePropertyNameOrValue(state, nameOrValue);
      return true
    }
    return false
  };
  pp$8.regexp_validateUnicodePropertyNameAndValue = function(state, name, value) {
    if (!has(state.unicodeProperties.nonBinary, name))
      { state.raise("Invalid property name"); }
    if (!state.unicodeProperties.nonBinary[name].test(value))
      { state.raise("Invalid property value"); }
  };
  pp$8.regexp_validateUnicodePropertyNameOrValue = function(state, nameOrValue) {
    if (!state.unicodeProperties.binary.test(nameOrValue))
      { state.raise("Invalid property name"); }
  };

  pp$8.regexp_eatUnicodePropertyName = function(state) {
    var ch = 0;
    state.lastStringValue = "";
    while (isUnicodePropertyNameCharacter(ch = state.current())) {
      state.lastStringValue += codePointToString(ch);
      state.advance();
    }
    return state.lastStringValue !== ""
  };
  function isUnicodePropertyNameCharacter(ch) {
    return isControlLetter(ch) || ch === 0x5F 
  }

  pp$8.regexp_eatUnicodePropertyValue = function(state) {
    var ch = 0;
    state.lastStringValue = "";
    while (isUnicodePropertyValueCharacter(ch = state.current())) {
      state.lastStringValue += codePointToString(ch);
      state.advance();
    }
    return state.lastStringValue !== ""
  };
  function isUnicodePropertyValueCharacter(ch) {
    return isUnicodePropertyNameCharacter(ch) || isDecimalDigit(ch)
  }

  pp$8.regexp_eatLoneUnicodePropertyNameOrValue = function(state) {
    return this.regexp_eatUnicodePropertyValue(state)
  };

  pp$8.regexp_eatCharacterClass = function(state) {
    if (state.eat(0x5B )) {
      state.eat(0x5E );
      this.regexp_classRanges(state);
      if (state.eat(0x5D )) {
        return true
      }
      state.raise("Unterminated character class");
    }
    return false
  };

  pp$8.regexp_classRanges = function(state) {
    while (this.regexp_eatClassAtom(state)) {
      var left = state.lastIntValue;
      if (state.eat(0x2D ) && this.regexp_eatClassAtom(state)) {
        var right = state.lastIntValue;
        if (state.switchU && (left === -1 || right === -1)) {
          state.raise("Invalid character class");
        }
        if (left !== -1 && right !== -1 && left > right) {
          state.raise("Range out of order in character class");
        }
      }
    }
  };

  pp$8.regexp_eatClassAtom = function(state) {
    var start = state.pos;

    if (state.eat(0x5C )) {
      if (this.regexp_eatClassEscape(state)) {
        return true
      }
      if (state.switchU) {
        var ch$1 = state.current();
        if (ch$1 === 0x63  || isOctalDigit(ch$1)) {
          state.raise("Invalid class escape");
        }
        state.raise("Invalid escape");
      }
      state.pos = start;
    }

    var ch = state.current();
    if (ch !== 0x5D ) {
      state.lastIntValue = ch;
      state.advance();
      return true
    }

    return false
  };

  pp$8.regexp_eatClassEscape = function(state) {
    var start = state.pos;

    if (state.eat(0x62 )) {
      state.lastIntValue = 0x08; 
      return true
    }

    if (state.switchU && state.eat(0x2D )) {
      state.lastIntValue = 0x2D; 
      return true
    }

    if (!state.switchU && state.eat(0x63 )) {
      if (this.regexp_eatClassControlLetter(state)) {
        return true
      }
      state.pos = start;
    }

    return (
      this.regexp_eatCharacterClassEscape(state) ||
      this.regexp_eatCharacterEscape(state)
    )
  };

  pp$8.regexp_eatClassControlLetter = function(state) {
    var ch = state.current();
    if (isDecimalDigit(ch) || ch === 0x5F ) {
      state.lastIntValue = ch % 0x20;
      state.advance();
      return true
    }
    return false
  };

  pp$8.regexp_eatHexEscapeSequence = function(state) {
    var start = state.pos;
    if (state.eat(0x78 )) {
      if (this.regexp_eatFixedHexDigits(state, 2)) {
        return true
      }
      if (state.switchU) {
        state.raise("Invalid escape");
      }
      state.pos = start;
    }
    return false
  };

  pp$8.regexp_eatDecimalDigits = function(state) {
    var start = state.pos;
    var ch = 0;
    state.lastIntValue = 0;
    while (isDecimalDigit(ch = state.current())) {
      state.lastIntValue = 10 * state.lastIntValue + (ch - 0x30 );
      state.advance();
    }
    return state.pos !== start
  };
  function isDecimalDigit(ch) {
    return ch >= 0x30  && ch <= 0x39 
  }

  pp$8.regexp_eatHexDigits = function(state) {
    var start = state.pos;
    var ch = 0;
    state.lastIntValue = 0;
    while (isHexDigit(ch = state.current())) {
      state.lastIntValue = 16 * state.lastIntValue + hexToInt(ch);
      state.advance();
    }
    return state.pos !== start
  };
  function isHexDigit(ch) {
    return (
      (ch >= 0x30  && ch <= 0x39 ) ||
      (ch >= 0x41  && ch <= 0x46 ) ||
      (ch >= 0x61  && ch <= 0x66 )
    )
  }
  function hexToInt(ch) {
    if (ch >= 0x41  && ch <= 0x46 ) {
      return 10 + (ch - 0x41 )
    }
    if (ch >= 0x61  && ch <= 0x66 ) {
      return 10 + (ch - 0x61 )
    }
    return ch - 0x30 
  }

  pp$8.regexp_eatLegacyOctalEscapeSequence = function(state) {
    if (this.regexp_eatOctalDigit(state)) {
      var n1 = state.lastIntValue;
      if (this.regexp_eatOctalDigit(state)) {
        var n2 = state.lastIntValue;
        if (n1 <= 3 && this.regexp_eatOctalDigit(state)) {
          state.lastIntValue = n1 * 64 + n2 * 8 + state.lastIntValue;
        } else {
          state.lastIntValue = n1 * 8 + n2;
        }
      } else {
        state.lastIntValue = n1;
      }
      return true
    }
    return false
  };

  pp$8.regexp_eatOctalDigit = function(state) {
    var ch = state.current();
    if (isOctalDigit(ch)) {
      state.lastIntValue = ch - 0x30; 
      state.advance();
      return true
    }
    state.lastIntValue = 0;
    return false
  };
  function isOctalDigit(ch) {
    return ch >= 0x30  && ch <= 0x37 
  }

  pp$8.regexp_eatFixedHexDigits = function(state, length) {
    var start = state.pos;
    state.lastIntValue = 0;
    for (var i = 0; i < length; ++i) {
      var ch = state.current();
      if (!isHexDigit(ch)) {
        state.pos = start;
        return false
      }
      state.lastIntValue = 16 * state.lastIntValue + hexToInt(ch);
      state.advance();
    }
    return true
  };


  var Token = function Token(p) {
    this.type = p.type;
    this.value = p.value;
    this.start = p.start;
    this.end = p.end;
    if (p.options.locations)
      { this.loc = new SourceLocation(p, p.startLoc, p.endLoc); }
    if (p.options.ranges)
      { this.range = [p.start, p.end]; }
  };


  var pp$9 = Parser.prototype;


  pp$9.next = function(ignoreEscapeSequenceInKeyword) {
    if (!ignoreEscapeSequenceInKeyword && this.type.keyword && this.containsEsc)
      { this.raiseRecoverable(this.start, "Escape sequence in keyword " + this.type.keyword); }
    if (this.options.onToken)
      { this.options.onToken(new Token(this)); }

    this.lastTokEnd = this.end;
    this.lastTokStart = this.start;
    this.lastTokEndLoc = this.endLoc;
    this.lastTokStartLoc = this.startLoc;
    this.nextToken();
  };

  pp$9.getToken = function() {
    this.next();
    return new Token(this)
  };

  if (typeof Symbol !== "undefined")
    { pp$9[Symbol.iterator] = function() {
      var this$1 = this;

      return {
        next: function () {
          var token = this$1.getToken();
          return {
            done: token.type === types.eof,
            value: token
          }
        }
      }
    }; }


  pp$9.curContext = function() {
    return this.context[this.context.length - 1]
  };


  pp$9.nextToken = function() {
    var curContext = this.curContext();
    if (!curContext || !curContext.preserveSpace) { this.skipSpace(); }

    this.start = this.pos;
    if (this.options.locations) { this.startLoc = this.curPosition(); }
    if (this.pos >= this.input.length) { return this.finishToken(types.eof) }

    if (curContext.override) { return curContext.override(this) }
    else { this.readToken(this.fullCharCodeAtPos()); }
  };

  pp$9.readToken = function(code) {
    if (isIdentifierStart(code, this.options.ecmaVersion >= 6) || code === 92 )
      { return this.readWord() }

    return this.getTokenFromCode(code)
  };

  pp$9.fullCharCodeAtPos = function() {
    var code = this.input.charCodeAt(this.pos);
    if (code <= 0xd7ff || code >= 0xe000) { return code }
    var next = this.input.charCodeAt(this.pos + 1);
    return (code << 10) + next - 0x35fdc00
  };

  pp$9.skipBlockComment = function() {
    var startLoc = this.options.onComment && this.curPosition();
    var start = this.pos, end = this.input.indexOf("*/", this.pos += 2);
    if (end === -1) { this.raise(this.pos - 2, "Unterminated comment"); }
    this.pos = end + 2;
    if (this.options.locations) {
      lineBreakG.lastIndex = start;
      var match;
      while ((match = lineBreakG.exec(this.input)) && match.index < this.pos) {
        ++this.curLine;
        this.lineStart = match.index + match[0].length;
      }
    }
    if (this.options.onComment)
      { this.options.onComment(true, this.input.slice(start + 2, end), start, this.pos,
                             startLoc, this.curPosition()); }
  };

  pp$9.skipLineComment = function(startSkip) {
    var start = this.pos;
    var startLoc = this.options.onComment && this.curPosition();
    var ch = this.input.charCodeAt(this.pos += startSkip);
    while (this.pos < this.input.length && !isNewLine(ch)) {
      ch = this.input.charCodeAt(++this.pos);
    }
    if (this.options.onComment)
      { this.options.onComment(false, this.input.slice(start + startSkip, this.pos), start, this.pos,
                             startLoc, this.curPosition()); }
  };


  pp$9.skipSpace = function() {
    loop: while (this.pos < this.input.length) {
      var ch = this.input.charCodeAt(this.pos);
      switch (ch) {
      case 32: case 160: 
        ++this.pos;
        break
      case 13:
        if (this.input.charCodeAt(this.pos + 1) === 10) {
          ++this.pos;
        }
      case 10: case 8232: case 8233:
        ++this.pos;
        if (this.options.locations) {
          ++this.curLine;
          this.lineStart = this.pos;
        }
        break
      case 47: 
        switch (this.input.charCodeAt(this.pos + 1)) {
        case 42: 
          this.skipBlockComment();
          break
        case 47:
          this.skipLineComment(2);
          break
        default:
          break loop
        }
        break
      default:
        if (ch > 8 && ch < 14 || ch >= 5760 && nonASCIIwhitespace.test(String.fromCharCode(ch))) {
          ++this.pos;
        } else {
          break loop
        }
      }
    }
  };


  pp$9.finishToken = function(type, val) {
    this.end = this.pos;
    if (this.options.locations) { this.endLoc = this.curPosition(); }
    var prevType = this.type;
    this.type = type;
    this.value = val;

    this.updateContext(prevType);
  };


  pp$9.readToken_dot = function() {
    var next = this.input.charCodeAt(this.pos + 1);
    if (next >= 48 && next <= 57) { return this.readNumber(true) }
    var next2 = this.input.charCodeAt(this.pos + 2);
    if (this.options.ecmaVersion >= 6 && next === 46 && next2 === 46) { 
      this.pos += 3;
      return this.finishToken(types.ellipsis)
    } else {
      ++this.pos;
      return this.finishToken(types.dot)
    }
  };

  pp$9.readToken_slash = function() { 
    var next = this.input.charCodeAt(this.pos + 1);
    if (this.exprAllowed) { ++this.pos; return this.readRegexp() }
    if (next === 61) { return this.finishOp(types.assign, 2) }
    return this.finishOp(types.slash, 1)
  };

  pp$9.readToken_mult_modulo_exp = function(code) { 
    var next = this.input.charCodeAt(this.pos + 1);
    var size = 1;
    var tokentype = code === 42 ? types.star : types.modulo;

    if (this.options.ecmaVersion >= 7 && code === 42 && next === 42) {
      ++size;
      tokentype = types.starstar;
      next = this.input.charCodeAt(this.pos + 2);
    }

    if (next === 61) { return this.finishOp(types.assign, size + 1) }
    return this.finishOp(tokentype, size)
  };

  pp$9.readToken_pipe_amp = function(code) { 
    var next = this.input.charCodeAt(this.pos + 1);
    if (next === code) { return this.finishOp(code === 124 ? types.logicalOR : types.logicalAND, 2) }
    if (next === 61) { return this.finishOp(types.assign, 2) }
    return this.finishOp(code === 124 ? types.bitwiseOR : types.bitwiseAND, 1)
  };

  pp$9.readToken_caret = function() { 
    var next = this.input.charCodeAt(this.pos + 1);
    if (next === 61) { return this.finishOp(types.assign, 2) }
    return this.finishOp(types.bitwiseXOR, 1)
  };

  pp$9.readToken_plus_min = function(code) { 
    var next = this.input.charCodeAt(this.pos + 1);
    if (next === code) {
      if (next === 45 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 62 &&
          (this.lastTokEnd === 0 || lineBreak.test(this.input.slice(this.lastTokEnd, this.pos)))) {
        this.skipLineComment(3);
        this.skipSpace();
        return this.nextToken()
      }
      return this.finishOp(types.incDec, 2)
    }
    if (next === 61) { return this.finishOp(types.assign, 2) }
    return this.finishOp(types.plusMin, 1)
  };

  pp$9.readToken_lt_gt = function(code) { 
    var next = this.input.charCodeAt(this.pos + 1);
    var size = 1;
    if (next === code) {
      size = code === 62 && this.input.charCodeAt(this.pos + 2) === 62 ? 3 : 2;
      if (this.input.charCodeAt(this.pos + size) === 61) { return this.finishOp(types.assign, size + 1) }
      return this.finishOp(types.bitShift, size)
    }
    if (next === 33 && code === 60 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 45 &&
        this.input.charCodeAt(this.pos + 3) === 45) {
      this.skipLineComment(4);
      this.skipSpace();
      return this.nextToken()
    }
    if (next === 61) { size = 2; }
    return this.finishOp(types.relational, size)
  };

  pp$9.readToken_eq_excl = function(code) { 
    var next = this.input.charCodeAt(this.pos + 1);
    if (next === 61) { return this.finishOp(types.equality, this.input.charCodeAt(this.pos + 2) === 61 ? 3 : 2) }
    if (code === 61 && next === 62 && this.options.ecmaVersion >= 6) { 
      this.pos += 2;
      return this.finishToken(types.arrow)
    }
    return this.finishOp(code === 61 ? types.eq : types.prefix, 1)
  };

  pp$9.getTokenFromCode = function(code) {
    switch (code) {
    case 46: 
      return this.readToken_dot()

    case 40: ++this.pos; return this.finishToken(types.parenL)
    case 41: ++this.pos; return this.finishToken(types.parenR)
    case 59: ++this.pos; return this.finishToken(types.semi)
    case 44: ++this.pos; return this.finishToken(types.comma)
    case 91: ++this.pos; return this.finishToken(types.bracketL)
    case 93: ++this.pos; return this.finishToken(types.bracketR)
    case 123: ++this.pos; return this.finishToken(types.braceL)
    case 125: ++this.pos; return this.finishToken(types.braceR)
    case 58: ++this.pos; return this.finishToken(types.colon)
    case 63: ++this.pos; return this.finishToken(types.question)

    case 96: 
      if (this.options.ecmaVersion < 6) { break }
      ++this.pos;
      return this.finishToken(types.backQuote)

    case 48: 
      var next = this.input.charCodeAt(this.pos + 1);
      if (next === 120 || next === 88) { return this.readRadixNumber(16) } 
      if (this.options.ecmaVersion >= 6) {
        if (next === 111 || next === 79) { return this.readRadixNumber(8) } 
        if (next === 98 || next === 66) { return this.readRadixNumber(2) } 
      }

    case 49: case 50: case 51: case 52: case 53: case 54: case 55: case 56: case 57: 
      return this.readNumber(false)

    case 34: case 39: 
      return this.readString(code)


    case 47: 
      return this.readToken_slash()

    case 37: case 42: 
      return this.readToken_mult_modulo_exp(code)

    case 124: case 38: 
      return this.readToken_pipe_amp(code)

    case 94: 
      return this.readToken_caret()

    case 43: case 45: 
      return this.readToken_plus_min(code)

    case 60: case 62: 
      return this.readToken_lt_gt(code)

    case 61: case 33: 
      return this.readToken_eq_excl(code)

    case 126: 
      return this.finishOp(types.prefix, 1)
    }

    this.raise(this.pos, "Unexpected character '" + codePointToString$1(code) + "'");
  };

  pp$9.finishOp = function(type, size) {
    var str = this.input.slice(this.pos, this.pos + size);
    this.pos += size;
    return this.finishToken(type, str)
  };

  pp$9.readRegexp = function() {
    var escaped, inClass, start = this.pos;
    for (;;) {
      if (this.pos >= this.input.length) { this.raise(start, "Unterminated regular expression"); }
      var ch = this.input.charAt(this.pos);
      if (lineBreak.test(ch)) { this.raise(start, "Unterminated regular expression"); }
      if (!escaped) {
        if (ch === "[") { inClass = true; }
        else if (ch === "]" && inClass) { inClass = false; }
        else if (ch === "/" && !inClass) { break }
        escaped = ch === "\\";
      } else { escaped = false; }
      ++this.pos;
    }
    var pattern = this.input.slice(start, this.pos);
    ++this.pos;
    var flagsStart = this.pos;
    var flags = this.readWord1();
    if (this.containsEsc) { this.unexpected(flagsStart); }

    var state = this.regexpState || (this.regexpState = new RegExpValidationState(this));
    state.reset(start, pattern, flags);
    this.validateRegExpFlags(state);
    this.validateRegExpPattern(state);

    var value = null;
    try {
      value = new RegExp(pattern, flags);
    } catch (e) {
    }

    return this.finishToken(types.regexp, {pattern: pattern, flags: flags, value: value})
  };


  pp$9.readInt = function(radix, len) {
    var start = this.pos, total = 0;
    for (var i = 0, e = len == null ? Infinity : len; i < e; ++i) {
      var code = this.input.charCodeAt(this.pos), val = (void 0);
      if (code >= 97) { val = code - 97 + 10; } 
      else if (code >= 65) { val = code - 65 + 10; } 
      else if (code >= 48 && code <= 57) { val = code - 48; } 
      else { val = Infinity; }
      if (val >= radix) { break }
      ++this.pos;
      total = total * radix + val;
    }
    if (this.pos === start || len != null && this.pos - start !== len) { return null }

    return total
  };

  pp$9.readRadixNumber = function(radix) {
    var start = this.pos;
    this.pos += 2; 
    var val = this.readInt(radix);
    if (val == null) { this.raise(this.start + 2, "Expected number in radix " + radix); }
    if (this.options.ecmaVersion >= 11 && this.input.charCodeAt(this.pos) === 110) {
      val = typeof BigInt !== "undefined" ? BigInt(this.input.slice(start, this.pos)) : null;
      ++this.pos;
    } else if (isIdentifierStart(this.fullCharCodeAtPos())) { this.raise(this.pos, "Identifier directly after number"); }
    return this.finishToken(types.num, val)
  };


  pp$9.readNumber = function(startsWithDot) {
    var start = this.pos;
    if (!startsWithDot && this.readInt(10) === null) { this.raise(start, "Invalid number"); }
    var octal = this.pos - start >= 2 && this.input.charCodeAt(start) === 48;
    if (octal && this.strict) { this.raise(start, "Invalid number"); }
    var next = this.input.charCodeAt(this.pos);
    if (!octal && !startsWithDot && this.options.ecmaVersion >= 11 && next === 110) {
      var str$1 = this.input.slice(start, this.pos);
      var val$1 = typeof BigInt !== "undefined" ? BigInt(str$1) : null;
      ++this.pos;
      if (isIdentifierStart(this.fullCharCodeAtPos())) { this.raise(this.pos, "Identifier directly after number"); }
      return this.finishToken(types.num, val$1)
    }
    if (octal && /[89]/.test(this.input.slice(start, this.pos))) { octal = false; }
    if (next === 46 && !octal) { 
      ++this.pos;
      this.readInt(10);
      next = this.input.charCodeAt(this.pos);
    }
    if ((next === 69 || next === 101) && !octal) { 
      next = this.input.charCodeAt(++this.pos);
      if (next === 43 || next === 45) { ++this.pos; } 
      if (this.readInt(10) === null) { this.raise(start, "Invalid number"); }
    }
    if (isIdentifierStart(this.fullCharCodeAtPos())) { this.raise(this.pos, "Identifier directly after number"); }

    var str = this.input.slice(start, this.pos);
    var val = octal ? parseInt(str, 8) : parseFloat(str);
    return this.finishToken(types.num, val)
  };


  pp$9.readCodePoint = function() {
    var ch = this.input.charCodeAt(this.pos), code;

    if (ch === 123) { 
      if (this.options.ecmaVersion < 6) { this.unexpected(); }
      var codePos = ++this.pos;
      code = this.readHexChar(this.input.indexOf("}", this.pos) - this.pos);
      ++this.pos;
      if (code > 0x10FFFF) { this.invalidStringToken(codePos, "Code point out of bounds"); }
    } else {
      code = this.readHexChar(4);
    }
    return code
  };

  function codePointToString$1(code) {
    if (code <= 0xFFFF) { return String.fromCharCode(code) }
    code -= 0x10000;
    return String.fromCharCode((code >> 10) + 0xD800, (code & 1023) + 0xDC00)
  }

  pp$9.readString = function(quote) {
    var out = "", chunkStart = ++this.pos;
    for (;;) {
      if (this.pos >= this.input.length) { this.raise(this.start, "Unterminated string constant"); }
      var ch = this.input.charCodeAt(this.pos);
      if (ch === quote) { break }
      if (ch === 92) { 
        out += this.input.slice(chunkStart, this.pos);
        out += this.readEscapedChar(false);
        chunkStart = this.pos;
      } else {
        if (isNewLine(ch, this.options.ecmaVersion >= 10)) { this.raise(this.start, "Unterminated string constant"); }
        ++this.pos;
      }
    }
    out += this.input.slice(chunkStart, this.pos++);
    return this.finishToken(types.string, out)
  };


  var INVALID_TEMPLATE_ESCAPE_ERROR = {};

  pp$9.tryReadTemplateToken = function() {
    this.inTemplateElement = true;
    try {
      this.readTmplToken();
    } catch (err) {
      if (err === INVALID_TEMPLATE_ESCAPE_ERROR) {
        this.readInvalidTemplateToken();
      } else {
        throw err
      }
    }

    this.inTemplateElement = false;
  };

  pp$9.invalidStringToken = function(position, message) {
    if (this.inTemplateElement && this.options.ecmaVersion >= 9) {
      throw INVALID_TEMPLATE_ESCAPE_ERROR
    } else {
      this.raise(position, message);
    }
  };

  pp$9.readTmplToken = function() {
    var out = "", chunkStart = this.pos;
    for (;;) {
      if (this.pos >= this.input.length) { this.raise(this.start, "Unterminated template"); }
      var ch = this.input.charCodeAt(this.pos);
      if (ch === 96 || ch === 36 && this.input.charCodeAt(this.pos + 1) === 123) { 
        if (this.pos === this.start && (this.type === types.template || this.type === types.invalidTemplate)) {
          if (ch === 36) {
            this.pos += 2;
            return this.finishToken(types.dollarBraceL)
          } else {
            ++this.pos;
            return this.finishToken(types.backQuote)
          }
        }
        out += this.input.slice(chunkStart, this.pos);
        return this.finishToken(types.template, out)
      }
      if (ch === 92) { 
        out += this.input.slice(chunkStart, this.pos);
        out += this.readEscapedChar(true);
        chunkStart = this.pos;
      } else if (isNewLine(ch)) {
        out += this.input.slice(chunkStart, this.pos);
        ++this.pos;
        switch (ch) {
        case 13:
          if (this.input.charCodeAt(this.pos) === 10) { ++this.pos; }
        case 10:
          out += "\n";
          break
        default:
          out += String.fromCharCode(ch);
          break
        }
        if (this.options.locations) {
          ++this.curLine;
          this.lineStart = this.pos;
        }
        chunkStart = this.pos;
      } else {
        ++this.pos;
      }
    }
  };

  pp$9.readInvalidTemplateToken = function() {
    for (; this.pos < this.input.length; this.pos++) {
      switch (this.input[this.pos]) {
      case "\\":
        ++this.pos;
        break

      case "$":
        if (this.input[this.pos + 1] !== "{") {
          break
        }

      case "`":
        return this.finishToken(types.invalidTemplate, this.input.slice(this.start, this.pos))

      }
    }
    this.raise(this.start, "Unterminated template");
  };


  pp$9.readEscapedChar = function(inTemplate) {
    var ch = this.input.charCodeAt(++this.pos);
    ++this.pos;
    switch (ch) {
    case 110: return "\n" 
    case 114: return "\r" 
    case 120: return String.fromCharCode(this.readHexChar(2)) 
    case 117: return codePointToString$1(this.readCodePoint()) 
    case 116: return "\t" 
    case 98: return "\b" 
    case 118: return "\u000b" 
    case 102: return "\f" 
    case 13: if (this.input.charCodeAt(this.pos) === 10) { ++this.pos; } 
    case 10: 
      if (this.options.locations) { this.lineStart = this.pos; ++this.curLine; }
      return ""
    case 56:
    case 57:
      if (inTemplate) {
        var codePos = this.pos - 1;

        this.invalidStringToken(
          codePos,
          "Invalid escape sequence in template string"
        );

        return null
      }
    default:
      if (ch >= 48 && ch <= 55) {
        var octalStr = this.input.substr(this.pos - 1, 3).match(/^[0-7]+/)[0];
        var octal = parseInt(octalStr, 8);
        if (octal > 255) {
          octalStr = octalStr.slice(0, -1);
          octal = parseInt(octalStr, 8);
        }
        this.pos += octalStr.length - 1;
        ch = this.input.charCodeAt(this.pos);
        if ((octalStr !== "0" || ch === 56 || ch === 57) && (this.strict || inTemplate)) {
          this.invalidStringToken(
            this.pos - 1 - octalStr.length,
            inTemplate
              ? "Octal literal in template string"
              : "Octal literal in strict mode"
          );
        }
        return String.fromCharCode(octal)
      }
      if (isNewLine(ch)) {
        return ""
      }
      return String.fromCharCode(ch)
    }
  };


  pp$9.readHexChar = function(len) {
    var codePos = this.pos;
    var n = this.readInt(16, len);
    if (n === null) { this.invalidStringToken(codePos, "Bad character escape sequence"); }
    return n
  };


  pp$9.readWord1 = function() {
    this.containsEsc = false;
    var word = "", first = true, chunkStart = this.pos;
    var astral = this.options.ecmaVersion >= 6;
    while (this.pos < this.input.length) {
      var ch = this.fullCharCodeAtPos();
      if (isIdentifierChar(ch, astral)) {
        this.pos += ch <= 0xffff ? 1 : 2;
      } else if (ch === 92) { 
        this.containsEsc = true;
        word += this.input.slice(chunkStart, this.pos);
        var escStart = this.pos;
        if (this.input.charCodeAt(++this.pos) !== 117) 
          { this.invalidStringToken(this.pos, "Expecting Unicode escape sequence \\uXXXX"); }
        ++this.pos;
        var esc = this.readCodePoint();
        if (!(first ? isIdentifierStart : isIdentifierChar)(esc, astral))
          { this.invalidStringToken(escStart, "Invalid Unicode escape"); }
        word += codePointToString$1(esc);
        chunkStart = this.pos;
      } else {
        break
      }
      first = false;
    }
    return word + this.input.slice(chunkStart, this.pos)
  };


  pp$9.readWord = function() {
    var word = this.readWord1();
    var type = types.name;
    if (this.keywords.test(word)) {
      type = keywords$1[word];
    }
    return this.finishToken(type, word)
  };


  var version = "7.1.0";

  Parser.acorn = {
    Parser: Parser,
    version: version,
    defaultOptions: defaultOptions,
    Position: Position,
    SourceLocation: SourceLocation,
    getLineInfo: getLineInfo,
    Node: Node,
    TokenType: TokenType,
    tokTypes: types,
    keywordTypes: keywords$1,
    TokContext: TokContext,
    tokContexts: types$1,
    isIdentifierChar: isIdentifierChar,
    isIdentifierStart: isIdentifierStart,
    Token: Token,
    isNewLine: isNewLine,
    lineBreak: lineBreak,
    lineBreakG: lineBreakG,
    nonASCIIwhitespace: nonASCIIwhitespace
  };


  function parse(input, options) {
    return Parser.parse(input, options)
  }


  function parseExpressionAt(input, pos, options) {
    return Parser.parseExpressionAt(input, pos, options)
  }


  function tokenizer(input, options) {
    return Parser.tokenizer(input, options)
  }

  exports.Node = Node;
  exports.Parser = Parser;
  exports.Position = Position;
  exports.SourceLocation = SourceLocation;
  exports.TokContext = TokContext;
  exports.Token = Token;
  exports.TokenType = TokenType;
  exports.defaultOptions = defaultOptions;
  exports.getLineInfo = getLineInfo;
  exports.isIdentifierChar = isIdentifierChar;
  exports.isIdentifierStart = isIdentifierStart;
  exports.isNewLine = isNewLine;
  exports.keywordTypes = keywords$1;
  exports.lineBreak = lineBreak;
  exports.lineBreakG = lineBreakG;
  exports.nonASCIIwhitespace = nonASCIIwhitespace;
  exports.parse = parse;
  exports.parseExpressionAt = parseExpressionAt;
  exports.tokContexts = types$1;
  exports.tokTypes = types;
  exports.tokenizer = tokenizer;
  exports.version = version;

  Object.defineProperty(exports, '__esModule', { value: true });

}));

},{}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
function glWiretap(gl, options = {}) {
  const {
    contextName = 'gl',
    throwGetError,
    useTrackablePrimitives,
    readPixelsFile,
    recording = [],
    variables = {},
    onReadPixels,
    onUnrecognizedArgumentLookup,
  } = options;
  const proxy = new Proxy(gl, { get: listen });
  const contextVariables = [];
  const entityNames = {};
  let imageCount = 0;
  let indent = '';
  let readPixelsVariableName;
  return proxy;
  function listen(obj, property) {
    switch (property) {
      case 'addComment': return addComment;
      case 'checkThrowError': return checkThrowError;
      case 'getReadPixelsVariableName': return readPixelsVariableName;
      case 'insertVariable': return insertVariable;
      case 'reset': return reset;
      case 'setIndent': return setIndent;
      case 'toString': return toString;
      case 'getContextVariableName': return getContextVariableName;
    }
    if (typeof gl[property] === 'function') {
      return function() { 
        switch (property) {
          case 'getError':
            if (throwGetError) {
              recording.push(`${indent}if (${contextName}.getError() !== ${contextName}.NONE) throw new Error('error');`);
            } else {
              recording.push(`${indent}${contextName}.getError();`); 
            }
            return gl.getError();
          case 'getExtension': {
            const variableName = `${contextName}Variables${contextVariables.length}`;
            recording.push(`${indent}const ${variableName} = ${contextName}.getExtension('${arguments[0]}');`);
            const extension = gl.getExtension(arguments[0]);
            if (extension && typeof extension === 'object') {
              const tappedExtension = glExtensionWiretap(extension, {
                getEntity,
                useTrackablePrimitives,
                recording,
                contextName: variableName,
                contextVariables,
                variables,
                indent,
                onUnrecognizedArgumentLookup,
              });
              contextVariables.push(tappedExtension);
              return tappedExtension;
            } else {
              contextVariables.push(null);
            }
            return extension;
          }
          case 'readPixels':
            const i = contextVariables.indexOf(arguments[6]);
            let targetVariableName;
            if (i === -1) {
              const variableName = getVariableName(arguments[6]);
              if (variableName) {
                targetVariableName = variableName;
                recording.push(`${indent}${variableName}`);
              } else {
                targetVariableName = `${contextName}Variable${contextVariables.length}`;
                contextVariables.push(arguments[6]);
                recording.push(`${indent}const ${targetVariableName} = new ${arguments[6].constructor.name}(${arguments[6].length});`);
              }
            } else {
              targetVariableName = `${contextName}Variable${i}`;
            }
            readPixelsVariableName = targetVariableName;
            const argumentAsStrings = [
              arguments[0],
              arguments[1],
              arguments[2],
              arguments[3],
              getEntity(arguments[4]),
              getEntity(arguments[5]),
              targetVariableName
            ];
            recording.push(`${indent}${contextName}.readPixels(${argumentAsStrings.join(', ')});`);
            if (readPixelsFile) {
              writePPM(arguments[2], arguments[3]);
            }
            if (onReadPixels) {
              onReadPixels(targetVariableName, argumentAsStrings);
            }
            return gl.readPixels.apply(gl, arguments);
          case 'drawBuffers':
            recording.push(`${indent}${contextName}.drawBuffers([${argumentsToString(arguments[0], { contextName, contextVariables, getEntity, addVariable, variables, onUnrecognizedArgumentLookup } )}]);`);
            return gl.drawBuffers(arguments[0]);
        }
        let result = gl[property].apply(gl, arguments);
        switch (typeof result) {
          case 'undefined':
            recording.push(`${indent}${methodCallToString(property, arguments)};`);
            return;
          case 'number':
          case 'boolean':
            if (useTrackablePrimitives && contextVariables.indexOf(trackablePrimitive(result)) === -1) {
              recording.push(`${indent}const ${contextName}Variable${contextVariables.length} = ${methodCallToString(property, arguments)};`);
              contextVariables.push(result = trackablePrimitive(result));
              break;
            }
          default:
            if (result === null) {
              recording.push(`${methodCallToString(property, arguments)};`);
            } else {
              recording.push(`${indent}const ${contextName}Variable${contextVariables.length} = ${methodCallToString(property, arguments)};`);
            }

            contextVariables.push(result);
        }
        return result;
      }
    }
    entityNames[gl[property]] = property;
    return gl[property];
  }
  function toString() {
    return recording.join('\n');
  }
  function reset() {
    while (recording.length > 0) {
      recording.pop();
    }
  }
  function insertVariable(name, value) {
    variables[name] = value;
  }
  function getEntity(value) {
    const name = entityNames[value];
    if (name) {
      return contextName + '.' + name;
    }
    return value;
  }
  function setIndent(spaces) {
    indent = ' '.repeat(spaces);
  }
  function addVariable(value, source) {
    const variableName = `${contextName}Variable${contextVariables.length}`;
    recording.push(`${indent}const ${variableName} = ${source};`);
    contextVariables.push(value);
    return variableName;
  }
  function writePPM(width, height) {
    const sourceVariable = `${contextName}Variable${contextVariables.length}`;
    const imageVariable = `imageDatum${imageCount}`;
    recording.push(`${indent}let ${imageVariable} = ["P3\\n# ${readPixelsFile}.ppm\\n", ${width}, ' ', ${height}, "\\n255\\n"].join("");`);
    recording.push(`${indent}for (let i = 0; i < ${imageVariable}.length; i += 4) {`);
    recording.push(`${indent}  ${imageVariable} += ${sourceVariable}[i] + ' ' + ${sourceVariable}[i + 1] + ' ' + ${sourceVariable}[i + 2] + ' ';`);
    recording.push(`${indent}}`);
    recording.push(`${indent}if (typeof require !== "undefined") {`);
    recording.push(`${indent}  require('fs').writeFileSync('./${readPixelsFile}.ppm', ${imageVariable});`);
    recording.push(`${indent}}`);
    imageCount++;
  }
  function addComment(value) {
    recording.push(`${indent}// ${value}`);
  }
  function checkThrowError() {
    recording.push(`${indent}(() => {
${indent}const error = ${contextName}.getError();
${indent}if (error !== ${contextName}.NONE) {
${indent}  const names = Object.getOwnPropertyNames(gl);
${indent}  for (let i = 0; i < names.length; i++) {
${indent}    const name = names[i];
${indent}    if (${contextName}[name] === error) {
${indent}      throw new Error('${contextName} threw ' + name);
${indent}    }
${indent}  }
${indent}}
${indent}})();`);
  }
  function methodCallToString(method, args) {
    return `${contextName}.${method}(${argumentsToString(args, { contextName, contextVariables, getEntity, addVariable, variables, onUnrecognizedArgumentLookup })})`;
  }

  function getVariableName(value) {
    if (variables) {
      for (const name in variables) {
        if (variables[name] === value) {
          return name;
        }
      }
    }
    return null;
  }

  function getContextVariableName(value) {
    const i = contextVariables.indexOf(value);
    if (i !== -1) {
      return `${contextName}Variable${i}`;
    }
    return null;
  }
}

function glExtensionWiretap(extension, options) {
  const proxy = new Proxy(extension, { get: listen });
  const extensionEntityNames = {};
  const {
    contextName,
    contextVariables,
    getEntity,
    useTrackablePrimitives,
    recording,
    variables,
    indent,
    onUnrecognizedArgumentLookup,
  } = options;
  return proxy;
  function listen(obj, property) {
    if (typeof obj[property] === 'function') {
      return function() {
        switch (property) {
          case 'drawBuffersWEBGL':
            recording.push(`${indent}${contextName}.drawBuffersWEBGL([${argumentsToString(arguments[0], { contextName, contextVariables, getEntity: getExtensionEntity, addVariable, variables, onUnrecognizedArgumentLookup })}]);`);
            return extension.drawBuffersWEBGL(arguments[0]);
        }
        let result = extension[property].apply(extension, arguments);
        switch (typeof result) {
          case 'undefined':
            recording.push(`${indent}${methodCallToString(property, arguments)};`);
            return;
          case 'number':
          case 'boolean':
            if (useTrackablePrimitives && contextVariables.indexOf(trackablePrimitive(result)) === -1) {
              recording.push(`${indent}const ${contextName}Variable${contextVariables.length} = ${methodCallToString(property, arguments)};`);
              contextVariables.push(result = trackablePrimitive(result));
            } else {
              recording.push(`${indent}const ${contextName}Variable${contextVariables.length} = ${methodCallToString(property, arguments)};`);
              contextVariables.push(result);
            }
            break;
          default:
            if (result === null) {
              recording.push(`${methodCallToString(property, arguments)};`);
            } else {
              recording.push(`${indent}const ${contextName}Variable${contextVariables.length} = ${methodCallToString(property, arguments)};`);
            }
            contextVariables.push(result);
        }
        return result;
      };
    }
    extensionEntityNames[extension[property]] = property;
    return extension[property];
  }

  function getExtensionEntity(value) {
    if (extensionEntityNames.hasOwnProperty(value)) {
      return `${contextName}.${extensionEntityNames[value]}`;
    }
    return getEntity(value);
  }

  function methodCallToString(method, args) {
    return `${contextName}.${method}(${argumentsToString(args, { contextName, contextVariables, getEntity: getExtensionEntity, addVariable, variables, onUnrecognizedArgumentLookup })})`;
  }

  function addVariable(value, source) {
    const variableName = `${contextName}Variable${contextVariables.length}`;
    contextVariables.push(value);
    recording.push(`${indent}const ${variableName} = ${source};`);
    return variableName;
  }
}

function argumentsToString(args, options) {
  const { variables, onUnrecognizedArgumentLookup } = options;
  return (Array.from(args).map((arg) => {
    const variableName = getVariableName(arg);
    if (variableName) {
      return variableName;
    }
    return argumentToString(arg, options);
  }).join(', '));

  function getVariableName(value) {
    if (variables) {
      for (const name in variables) {
        if (!variables.hasOwnProperty(name)) continue;
        if (variables[name] === value) {
          return name;
        }
      }
    }
    if (onUnrecognizedArgumentLookup) {
      return onUnrecognizedArgumentLookup(value);
    }
    return null;
  }
}

function argumentToString(arg, options) {
  const { contextName, contextVariables, getEntity, addVariable, onUnrecognizedArgumentLookup } = options;
  if (typeof arg === 'undefined') {
    return 'undefined';
  }
  if (arg === null) {
    return 'null';
  }
  const i = contextVariables.indexOf(arg);
  if (i > -1) {
    return `${contextName}Variable${i}`;
  }
  switch (arg.constructor.name) {
    case 'String':
      const hasLines = /\n/.test(arg);
      const hasSingleQuotes = /'/.test(arg);
      const hasDoubleQuotes = /"/.test(arg);
      if (hasLines) {
        return '`' + arg + '`';
      } else if (hasSingleQuotes && !hasDoubleQuotes) {
        return '"' + arg + '"';
      } else if (!hasSingleQuotes && hasDoubleQuotes) {
        return "'" + arg + "'";
      } else {
        return '\'' + arg + '\'';
      }
    case 'Number': return getEntity(arg);
    case 'Boolean': return getEntity(arg);
    case 'Array':
      return addVariable(arg, `new ${arg.constructor.name}([${Array.from(arg).join(',')}])`);
    case 'Float32Array':
    case 'Uint8Array':
    case 'Uint16Array':
    case 'Int32Array':
      return addVariable(arg, `new ${arg.constructor.name}(${JSON.stringify(Array.from(arg))})`);
    default:
      if (onUnrecognizedArgumentLookup) {
        const instantiationString = onUnrecognizedArgumentLookup(arg);
        if (instantiationString) {
          return instantiationString;
        }
      }
      throw new Error(`unrecognized argument type ${arg.constructor.name}`);
  }
}

function trackablePrimitive(value) {
  return new value.constructor(value);
}

if (typeof module !== 'undefined') {
  module.exports = { glWiretap, glExtensionWiretap };
}

if (typeof window !== 'undefined') {
  glWiretap.glExtensionWiretap = glExtensionWiretap;
  window.glWiretap = glWiretap;
}

},{}],4:[function(require,module,exports){
function setupArguments(args) {
  const newArguments = new Array(args.length);
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.toArray) {
      newArguments[i] = arg.toArray();
    } else {
      newArguments[i] = arg;
    }
  }
  return newArguments;
}

function mock1D() {
  const args = setupArguments(arguments);
  const row = new Float32Array(this.output.x);
  for (let x = 0; x < this.output.x; x++) {
    this.thread.x = x;
    this.thread.y = 0;
    this.thread.z = 0;
    row[x] = this._fn.apply(this, args);
  }
  return row;
}

function mock2D() {
  const args = setupArguments(arguments);
  const matrix = new Array(this.output.y);
  for (let y = 0; y < this.output.y; y++) {
    const row = new Float32Array(this.output.x);
    for (let x = 0; x < this.output.x; x++) {
      this.thread.x = x;
      this.thread.y = y;
      this.thread.z = 0;
      row[x] = this._fn.apply(this, args);
    }
    matrix[y] = row;
  }
  return matrix;
}

function mock2DGraphical() {
  const args = setupArguments(arguments);
  for (let y = 0; y < this.output.y; y++) {
    for (let x = 0; x < this.output.x; x++) {
      this.thread.x = x;
      this.thread.y = y;
      this.thread.z = 0;
      this._fn.apply(this, args);
    }
  }
}

function mock3D() {
  const args = setupArguments(arguments);
  const cube = new Array(this.output.z);
  for (let z = 0; z < this.output.z; z++) {
    const matrix = new Array(this.output.y);
    for (let y = 0; y < this.output.y; y++) {
      const row = new Float32Array(this.output.x);
      for (let x = 0; x < this.output.x; x++) {
        this.thread.x = x;
        this.thread.y = y;
        this.thread.z = z;
        row[x] = this._fn.apply(this, args);
      }
      matrix[y] = row;
    }
    cube[z] = matrix;
  }
  return cube;
}

function apiDecorate(kernel) {
  kernel.setOutput = (output) => {
    kernel.output = setupOutput(output);
    if (kernel.graphical) {
      setupGraphical(kernel);
    }
  };
  kernel.toJSON = () => {
    throw new Error('Not usable with gpuMock');
  };
  kernel.setConstants = (flag) => {
    kernel.constants = flag;
    return kernel;
  };
  kernel.setGraphical = (flag) => {
    kernel.graphical = flag;
    return kernel;
  };
  kernel.setCanvas = (flag) => {
    kernel.canvas = flag;
    return kernel;
  };
  kernel.setContext = (flag) => {
    kernel.context = flag;
    return kernel;
  };
  kernel.destroy = () => {};
  kernel.validateSettings = () => {};
  if (kernel.graphical && kernel.output) {
    setupGraphical(kernel);
  }
  kernel.exec = function() {
    return new Promise((resolve, reject) => {
      try {
        resolve(kernel.apply(kernel, arguments));
      } catch(e) {
        reject(e);
      }
    });
  };
  kernel.getPixels = (flip) => {
    const {x, y} = kernel.output;
    return flip ? flipPixels(kernel._imageData.data, x, y) : kernel._imageData.data.slice(0);
  };
  kernel.color = function(r, g, b, a) {
    if (typeof a === 'undefined') {
      a = 1;
    }

    r = Math.floor(r * 255);
    g = Math.floor(g * 255);
    b = Math.floor(b * 255);
    a = Math.floor(a * 255);

    const width = kernel.output.x;
    const height = kernel.output.y;

    const x = kernel.thread.x;
    const y = height - kernel.thread.y - 1;

    const index = x + y * width;

    kernel._colorData[index * 4 + 0] = r;
    kernel._colorData[index * 4 + 1] = g;
    kernel._colorData[index * 4 + 2] = b;
    kernel._colorData[index * 4 + 3] = a;
  };

  const mockMethod = () => kernel;
  const methods = [
    'setWarnVarUsage',
    'setArgumentTypes',
    'setTactic',
    'setOptimizeFloatMemory',
    'setDebug',
    'setLoopMaxIterations',
    'setConstantTypes',
    'setFunctions',
    'setNativeFunctions',
    'setInjectedNative',
    'setPipeline',
    'setPrecision',
    'setOutputToTexture',
    'setImmutable',
    'setStrictIntegers',
    'setDynamicOutput',
    'setHardcodeConstants',
    'setDynamicArguments',
    'setUseLegacyEncoder',
    'setWarnVarUsage',
    'addSubKernel',
  ];
  for (let i = 0; i < methods.length; i++) {
    kernel[methods[i]] = mockMethod;
  }
  return kernel;
}

function setupGraphical(kernel) {
  const {x, y} = kernel.output;
  if (kernel.context && kernel.context.createImageData) {
    const data = new Uint8ClampedArray(x * y * 4);
    kernel._imageData = kernel.context.createImageData(x, y);
    kernel._colorData = data;
  } else {
    const data = new Uint8ClampedArray(x * y * 4);
    kernel._imageData = { data };
    kernel._colorData = data;
  }
}

function setupOutput(output) {
  let result = null;
  if (output.length) {
    if (output.length === 3) {
      const [x,y,z] = output;
      result = { x, y, z };
    } else if (output.length === 2) {
      const [x,y] = output;
      result = { x, y };
    } else {
      const [x] = output;
      result = { x };
    }
  } else {
    result = output;
  }
  return result;
}

function gpuMock(fn, settings = {}) {
  const output = settings.output ? setupOutput(settings.output) : null;
  function kernel() {
    if (kernel.output.z) {
      return mock3D.apply(kernel, arguments);
    } else if (kernel.output.y) {
      if (kernel.graphical) {
        return mock2DGraphical.apply(kernel, arguments);
      }
      return mock2D.apply(kernel, arguments);
    } else {
      return mock1D.apply(kernel, arguments);
    }
  }
  kernel._fn = fn;
  kernel.constants = settings.constants || null;
  kernel.context = settings.context || null;
  kernel.canvas = settings.canvas || null;
  kernel.graphical = settings.graphical || false;
  kernel._imageData = null;
  kernel._colorData = null;
  kernel.output = output;
  kernel.thread = {
    x: 0,
    y: 0,
    z: 0
  };
  return apiDecorate(kernel);
}

function flipPixels(pixels, width, height) {
  const halfHeight = height / 2 | 0; 
  const bytesPerRow = width * 4;
  const temp = new Uint8ClampedArray(width * 4);
  const result = pixels.slice(0);
  for (let y = 0; y < halfHeight; ++y) {
    const topOffset = y * bytesPerRow;
    const bottomOffset = (height - y - 1) * bytesPerRow;

    temp.set(result.subarray(topOffset, topOffset + bytesPerRow));

    result.copyWithin(topOffset, bottomOffset, bottomOffset + bytesPerRow);

    result.set(temp, bottomOffset);
  }
  return result;
}

module.exports = {
  gpuMock
};

},{}],5:[function(require,module,exports){
const { utils } = require('./utils');

function alias(name, source) {
  const fnString = source.toString();
  return new Function(`return function ${ name } (${ utils.getArgumentNamesFromString(fnString).join(', ') }) {
${ utils.getFunctionBodyFromString(fnString) }
}`)();
}

module.exports = {
  alias
};
},{"./utils":114}],6:[function(require,module,exports){
const { FunctionNode } = require('../function-node');

class CPUFunctionNode extends FunctionNode {
  astFunction(ast, retArr) {

    if (!this.isRootKernel) {
      retArr.push('function');
      retArr.push(' ');
      retArr.push(this.name);
      retArr.push('(');

      for (let i = 0; i < this.argumentNames.length; ++i) {
        const argumentName = this.argumentNames[i];

        if (i > 0) {
          retArr.push(', ');
        }
        retArr.push('user_');
        retArr.push(argumentName);
      }

      retArr.push(') {\n');
    }

    for (let i = 0; i < ast.body.body.length; ++i) {
      this.astGeneric(ast.body.body[i], retArr);
      retArr.push('\n');
    }

    if (!this.isRootKernel) {
      retArr.push('}\n');
    }
    return retArr;
  }

  astReturnStatement(ast, retArr) {
    const type = this.returnType || this.getType(ast.argument);

    if (!this.returnType) {
      this.returnType = type;
    }

    if (this.isRootKernel) {
      retArr.push(this.leadingReturnStatement);
      this.astGeneric(ast.argument, retArr);
      retArr.push(';\n');
      retArr.push(this.followingReturnStatement);
      retArr.push('continue;\n');
    } else if (this.isSubKernel) {
      retArr.push(`subKernelResult_${ this.name } = `);
      this.astGeneric(ast.argument, retArr);
      retArr.push(';');
      retArr.push(`return subKernelResult_${ this.name };`);
    } else {
      retArr.push('return ');
      this.astGeneric(ast.argument, retArr);
      retArr.push(';');
    }
    return retArr;
  }

  astLiteral(ast, retArr) {

    if (isNaN(ast.value)) {
      throw this.astErrorOutput(
        'Non-numeric literal not supported : ' + ast.value,
        ast
      );
    }

    retArr.push(ast.value);

    return retArr;
  }

  astBinaryExpression(ast, retArr) {
    retArr.push('(');
    this.astGeneric(ast.left, retArr);
    retArr.push(ast.operator);
    this.astGeneric(ast.right, retArr);
    retArr.push(')');
    return retArr;
  }

  astIdentifierExpression(idtNode, retArr) {
    if (idtNode.type !== 'Identifier') {
      throw this.astErrorOutput(
        'IdentifierExpression - not an Identifier',
        idtNode
      );
    }

    switch (idtNode.name) {
      case 'Infinity':
        retArr.push('Infinity');
        break;
      default:
        if (this.constants && this.constants.hasOwnProperty(idtNode.name)) {
          retArr.push('constants_' + idtNode.name);
        } else {
          retArr.push('user_' + idtNode.name);
        }
    }

    return retArr;
  }

  astForStatement(forNode, retArr) {
    if (forNode.type !== 'ForStatement') {
      throw this.astErrorOutput('Invalid for statement', forNode);
    }

    const initArr = [];
    const testArr = [];
    const updateArr = [];
    const bodyArr = [];
    let isSafe = null;

    if (forNode.init) {
      this.pushState('in-for-loop-init');
      this.astGeneric(forNode.init, initArr);
      for (let i = 0; i < initArr.length; i++) {
        if (initArr[i].includes && initArr[i].includes(',')) {
          isSafe = false;
        }
      }
      this.popState('in-for-loop-init');
    } else {
      isSafe = false;
    }

    if (forNode.test) {
      this.astGeneric(forNode.test, testArr);
    } else {
      isSafe = false;
    }

    if (forNode.update) {
      this.astGeneric(forNode.update, updateArr);
    } else {
      isSafe = false;
    }

    if (forNode.body) {
      this.pushState('loop-body');
      this.astGeneric(forNode.body, bodyArr);
      this.popState('loop-body');
    }

    if (isSafe === null) {
      isSafe = this.isSafe(forNode.init) && this.isSafe(forNode.test);
    }

    if (isSafe) {
      retArr.push(`for (${initArr.join('')};${testArr.join('')};${updateArr.join('')}){\n`);
      retArr.push(bodyArr.join(''));
      retArr.push('}\n');
    } else {
      const iVariableName = this.getInternalVariableName('safeI');
      if (initArr.length > 0) {
        retArr.push(initArr.join(''), ';\n');
      }
      retArr.push(`for (let ${iVariableName}=0;${iVariableName}<LOOP_MAX;${iVariableName}++){\n`);
      if (testArr.length > 0) {
        retArr.push(`if (!${testArr.join('')}) break;\n`);
      }
      retArr.push(bodyArr.join(''));
      retArr.push(`\n${updateArr.join('')};`);
      retArr.push('}\n');
    }
    return retArr;
  }

  astWhileStatement(whileNode, retArr) {
    if (whileNode.type !== 'WhileStatement') {
      throw this.astErrorOutput(
        'Invalid while statement',
        whileNode
      );
    }

    retArr.push('for (let i = 0; i < LOOP_MAX; i++) {');
    retArr.push('if (');
    this.astGeneric(whileNode.test, retArr);
    retArr.push(') {\n');
    this.astGeneric(whileNode.body, retArr);
    retArr.push('} else {\n');
    retArr.push('break;\n');
    retArr.push('}\n');
    retArr.push('}\n');

    return retArr;
  }

  astDoWhileStatement(doWhileNode, retArr) {
    if (doWhileNode.type !== 'DoWhileStatement') {
      throw this.astErrorOutput(
        'Invalid while statement',
        doWhileNode
      );
    }

    retArr.push('for (let i = 0; i < LOOP_MAX; i++) {');
    this.astGeneric(doWhileNode.body, retArr);
    retArr.push('if (!');
    this.astGeneric(doWhileNode.test, retArr);
    retArr.push(') {\n');
    retArr.push('break;\n');
    retArr.push('}\n');
    retArr.push('}\n');

    return retArr;

  }

  astAssignmentExpression(assNode, retArr) {
    const declaration = this.getDeclaration(assNode.left);
    if (declaration && !declaration.assignable) {
      throw this.astErrorOutput(`Variable ${assNode.left.name} is not assignable here`, assNode);
    }
    this.astGeneric(assNode.left, retArr);
    retArr.push(assNode.operator);
    this.astGeneric(assNode.right, retArr);
    return retArr;
  }

  astBlockStatement(bNode, retArr) {
    if (this.isState('loop-body')) {
      this.pushState('block-body'); 
      for (let i = 0; i < bNode.body.length; i++) {
        this.astGeneric(bNode.body[i], retArr);
      }
      this.popState('block-body');
    } else {
      retArr.push('{\n');
      for (let i = 0; i < bNode.body.length; i++) {
        this.astGeneric(bNode.body[i], retArr);
      }
      retArr.push('}\n');
    }
    return retArr;
  }

  astVariableDeclaration(varDecNode, retArr) {
    retArr.push(`${varDecNode.kind} `);
    const { declarations } = varDecNode;
    for (let i = 0; i < declarations.length; i++) {
      if (i > 0) {
        retArr.push(',');
      }
      const declaration = declarations[i];
      const info = this.getDeclaration(declaration.id);
      if (!info.valueType) {
        info.valueType = this.getType(declaration.init);
      }
      this.astGeneric(declaration, retArr);
    }
    if (!this.isState('in-for-loop-init')) {
      retArr.push(';');
    }
    return retArr;
  }

  astIfStatement(ifNode, retArr) {
    retArr.push('if (');
    this.astGeneric(ifNode.test, retArr);
    retArr.push(')');
    if (ifNode.consequent.type === 'BlockStatement') {
      this.astGeneric(ifNode.consequent, retArr);
    } else {
      retArr.push(' {\n');
      this.astGeneric(ifNode.consequent, retArr);
      retArr.push('\n}\n');
    }

    if (ifNode.alternate) {
      retArr.push('else ');
      if (ifNode.alternate.type === 'BlockStatement' || ifNode.alternate.type === 'IfStatement') {
        this.astGeneric(ifNode.alternate, retArr);
      } else {
        retArr.push(' {\n');
        this.astGeneric(ifNode.alternate, retArr);
        retArr.push('\n}\n');
      }
    }
    return retArr;

  }

  astSwitchStatement(ast, retArr) {
    const { discriminant, cases } = ast;
    retArr.push('switch (');
    this.astGeneric(discriminant, retArr);
    retArr.push(') {\n');
    for (let i = 0; i < cases.length; i++) {
      if (cases[i].test === null) {
        retArr.push('default:\n');
        this.astGeneric(cases[i].consequent, retArr);
        if (cases[i].consequent && cases[i].consequent.length > 0) {
          retArr.push('break;\n');
        }
        continue;
      }
      retArr.push('case ');
      this.astGeneric(cases[i].test, retArr);
      retArr.push(':\n');
      if (cases[i].consequent && cases[i].consequent.length > 0) {
        this.astGeneric(cases[i].consequent, retArr);
        retArr.push('break;\n');
      }
    }
    retArr.push('\n}');
  }

  astThisExpression(tNode, retArr) {
    retArr.push('_this');
    return retArr;
  }

  astMemberExpression(mNode, retArr) {
    const {
      signature,
      type,
      property,
      xProperty,
      yProperty,
      zProperty,
      name,
      origin
    } = this.getMemberExpressionDetails(mNode);
    switch (signature) {
      case 'this.thread.value':
        retArr.push(`_this.thread.${ name }`);
        return retArr;
      case 'this.output.value':
        switch (name) {
          case 'x':
            retArr.push('outputX');
            break;
          case 'y':
            retArr.push('outputY');
            break;
          case 'z':
            retArr.push('outputZ');
            break;
          default:
            throw this.astErrorOutput('Unexpected expression', mNode);
        }
        return retArr;
      case 'value':
        throw this.astErrorOutput('Unexpected expression', mNode);
      case 'value[]':
      case 'value[][]':
      case 'value[][][]':
      case 'value.value':
        if (origin === 'Math') {
          retArr.push(Math[name]);
          return retArr;
        }
        switch (property) {
          case 'r':
            retArr.push(`user_${ name }[0]`);
            return retArr;
          case 'g':
            retArr.push(`user_${ name }[1]`);
            return retArr;
          case 'b':
            retArr.push(`user_${ name }[2]`);
            return retArr;
          case 'a':
            retArr.push(`user_${ name }[3]`);
            return retArr;
        }
        break;
      case 'this.constants.value':
      case 'this.constants.value[]':
      case 'this.constants.value[][]':
      case 'this.constants.value[][][]':
        break;
      case 'fn()[]':
        this.astGeneric(mNode.object, retArr);
        retArr.push('[');
        this.astGeneric(mNode.property, retArr);
        retArr.push(']');
        return retArr;
      case 'fn()[][]':
        this.astGeneric(mNode.object.object, retArr);
        retArr.push('[');
        this.astGeneric(mNode.object.property, retArr);
        retArr.push(']');
        retArr.push('[');
        this.astGeneric(mNode.property, retArr);
        retArr.push(']');
        return retArr;
      default:
        throw this.astErrorOutput('Unexpected expression', mNode);
    }

    if (!mNode.computed) {
      switch (type) {
        case 'Number':
        case 'Integer':
        case 'Float':
        case 'Boolean':
          retArr.push(`${origin}_${name}`);
          return retArr;
      }
    }

    const markupName = `${origin}_${name}`;

    switch (type) {
      case 'Array(2)':
      case 'Array(3)':
      case 'Array(4)':
      case 'Matrix(2)':
      case 'Matrix(3)':
      case 'Matrix(4)':
      case 'HTMLImageArray':
      case 'ArrayTexture(1)':
      case 'ArrayTexture(2)':
      case 'ArrayTexture(3)':
      case 'ArrayTexture(4)':
      case 'HTMLImage':
      default:
        let size;
        let isInput;
        if (origin === 'constants') {
          const constant = this.constants[name];
          isInput = this.constantTypes[name] === 'Input';
          size = isInput ? constant.size : null;
        } else {
          isInput = this.isInput(name);
          size = isInput ? this.argumentSizes[this.argumentNames.indexOf(name)] : null;
        }
        retArr.push(`${ markupName }`);
        if (zProperty && yProperty) {
          if (isInput) {
            retArr.push('[(');
            this.astGeneric(zProperty, retArr);
            retArr.push(`*${ this.dynamicArguments ? '(outputY * outputX)' : size[1] * size[0] })+(`);
            this.astGeneric(yProperty, retArr);
            retArr.push(`*${ this.dynamicArguments ? 'outputX' : size[0] })+`);
            this.astGeneric(xProperty, retArr);
            retArr.push(']');
          } else {
            retArr.push('[');
            this.astGeneric(zProperty, retArr);
            retArr.push(']');
            retArr.push('[');
            this.astGeneric(yProperty, retArr);
            retArr.push(']');
            retArr.push('[');
            this.astGeneric(xProperty, retArr);
            retArr.push(']');
          }
        } else if (yProperty) {
          if (isInput) {
            retArr.push('[(');
            this.astGeneric(yProperty, retArr);
            retArr.push(`*${ this.dynamicArguments ? 'outputX' : size[0] })+`);
            this.astGeneric(xProperty, retArr);
            retArr.push(']');
          } else {
            retArr.push('[');
            this.astGeneric(yProperty, retArr);
            retArr.push(']');
            retArr.push('[');
            this.astGeneric(xProperty, retArr);
            retArr.push(']');
          }
        } else if (typeof xProperty !== 'undefined') {
          retArr.push('[');
          this.astGeneric(xProperty, retArr);
          retArr.push(']');
        }
    }
    return retArr;
  }

  astCallExpression(ast, retArr) {
    if (ast.type !== 'CallExpression') {
      throw this.astErrorOutput('Unknown CallExpression', ast);
    }
    let functionName = this.astMemberExpressionUnroll(ast.callee);

    if (this.calledFunctions.indexOf(functionName) < 0) {
      this.calledFunctions.push(functionName);
    }

    this.isAstMathFunction(ast);

    if (this.onFunctionCall) {
      this.onFunctionCall(this.name, functionName, ast.arguments);
    }

    retArr.push(functionName);

    retArr.push('(');
    const targetTypes = this.lookupFunctionArgumentTypes(functionName) || [];
    for (let i = 0; i < ast.arguments.length; ++i) {
      const argument = ast.arguments[i];

      let argumentType = this.getType(argument);
      if (!targetTypes[i]) {
        this.triggerImplyArgumentType(functionName, i, argumentType, this);
      }

      if (i > 0) {
        retArr.push(', ');
      }
      this.astGeneric(argument, retArr);
    }
    retArr.push(')');

    return retArr;
  }

  astArrayExpression(arrNode, retArr) {
    const returnType = this.getType(arrNode);
    const arrLen = arrNode.elements.length;
    const elements = [];
    for (let i = 0; i < arrLen; ++i) {
      const element = [];
      this.astGeneric(arrNode.elements[i], element);
      elements.push(element.join(''));
    }
    switch (returnType) {
      case 'Matrix(2)':
      case 'Matrix(3)':
      case 'Matrix(4)':
        retArr.push(`[${elements.join(', ')}]`);
        break;
      default:
        retArr.push(`new Float32Array([${elements.join(', ')}])`);
    }
    return retArr;
  }

  astDebuggerStatement(arrNode, retArr) {
    retArr.push('debugger;');
    return retArr;
  }
}

module.exports = {
  CPUFunctionNode
};
},{"../function-node":10}],7:[function(require,module,exports){
const { utils } = require('../../utils');

function constantsToString(constants, types) {
  const results = [];
  for (const name in types) {
    if (!types.hasOwnProperty(name)) continue;
    const type = types[name];
    const constant = constants[name];
    switch (type) {
      case 'Number':
      case 'Integer':
      case 'Float':
      case 'Boolean':
        results.push(`${name}:${constant}`);
        break;
      case 'Array(2)':
      case 'Array(3)':
      case 'Array(4)':
      case 'Matrix(2)':
      case 'Matrix(3)':
      case 'Matrix(4)':
        results.push(`${name}:new ${constant.constructor.name}(${JSON.stringify(Array.from(constant))})`);
        break;
    }
  }
  return `{ ${ results.join() } }`;
}

function cpuKernelString(cpuKernel, name) {
  const header = [];
  const thisProperties = [];
  const beforeReturn = [];

  const useFunctionKeyword = !/^function/.test(cpuKernel.color.toString());

  header.push(
    '  const { context, canvas, constants: incomingConstants } = settings;',
    `  const output = new Int32Array(${JSON.stringify(Array.from(cpuKernel.output))});`,
    `  const _constantTypes = ${JSON.stringify(cpuKernel.constantTypes)};`,
    `  const _constants = ${constantsToString(cpuKernel.constants, cpuKernel.constantTypes)};`
  );

  thisProperties.push(
    '    constants: _constants,',
    '    context,',
    '    output,',
    '    thread: {x: 0, y: 0, z: 0},'
  );

  if (cpuKernel.graphical) {
    header.push(`  const _imageData = context.createImageData(${cpuKernel.output[0]}, ${cpuKernel.output[1]});`);
    header.push(`  const _colorData = new Uint8ClampedArray(${cpuKernel.output[0]} * ${cpuKernel.output[1]} * 4);`);

    const colorFn = utils.flattenFunctionToString((useFunctionKeyword ? 'function ' : '') + cpuKernel.color.toString(), {
      thisLookup: (propertyName) => {
        switch (propertyName) {
          case '_colorData':
            return '_colorData';
          case '_imageData':
            return '_imageData';
          case 'output':
            return 'output';
          case 'thread':
            return 'this.thread';
        }
        return JSON.stringify(cpuKernel[propertyName]);
      },
      findDependency: (object, name) => {
        return null;
      }
    });

    const getPixelsFn = utils.flattenFunctionToString((useFunctionKeyword ? 'function ' : '') + cpuKernel.getPixels.toString(), {
      thisLookup: (propertyName) => {
        switch (propertyName) {
          case '_colorData':
            return '_colorData';
          case '_imageData':
            return '_imageData';
          case 'output':
            return 'output';
          case 'thread':
            return 'this.thread';
        }
        return JSON.stringify(cpuKernel[propertyName]);
      },
      findDependency: () => {
        return null;
      }
    });

    thisProperties.push(
      '    _imageData,',
      '    _colorData,',
      `    color: ${colorFn},`
    );

    beforeReturn.push(
      `  kernel.getPixels = ${getPixelsFn};`
    );
  }

  const constantTypes = [];
  const constantKeys = Object.keys(cpuKernel.constantTypes);
  for (let i = 0; i < constantKeys.length; i++) {
    constantTypes.push(cpuKernel.constantTypes[constantKeys]);
  }
  if (cpuKernel.argumentTypes.indexOf('HTMLImageArray') !== -1 || constantTypes.indexOf('HTMLImageArray') !== -1) {
    const flattenedImageTo3DArray = utils.flattenFunctionToString((useFunctionKeyword ? 'function ' : '') + cpuKernel._imageTo3DArray.toString(), {
      doNotDefine: ['canvas'],
      findDependency: (object, name) => {
        if (object === 'this') {
          return (useFunctionKeyword ? 'function ' : '') + cpuKernel[name].toString();
        }
        return null;
      },
      thisLookup: (propertyName) => {
        switch (propertyName) {
          case 'canvas':
            return;
          case 'context':
            return 'context';
        }
      }
    });
    beforeReturn.push(flattenedImageTo3DArray);
    thisProperties.push(`    _mediaTo2DArray,`);
    thisProperties.push(`    _imageTo3DArray,`);
  } else if (cpuKernel.argumentTypes.indexOf('HTMLImage') !== -1 || constantTypes.indexOf('HTMLImage') !== -1) {
    const flattenedImageTo2DArray = utils.flattenFunctionToString((useFunctionKeyword ? 'function ' : '') + cpuKernel._mediaTo2DArray.toString(), {
      findDependency: (object, name) => {
        return null;
      },
      thisLookup: (propertyName) => {
        switch (propertyName) {
          case 'canvas':
            return 'settings.canvas';
          case 'context':
            return 'settings.context';
        }
        throw new Error('unhandled thisLookup');
      }
    });
    beforeReturn.push(flattenedImageTo2DArray);
    thisProperties.push(`    _mediaTo2DArray,`);
  }

  return `function(settings) {
${ header.join('\n') }
for (const p in _constantTypes) {
if (!_constantTypes.hasOwnProperty(p)) continue;
const type = _constantTypes[p];
switch (type) {
  case 'Number':
  case 'Integer':
  case 'Float':
  case 'Boolean':
  case 'Array(2)':
  case 'Array(3)':
  case 'Array(4)':
  case 'Matrix(2)':
  case 'Matrix(3)':
  case 'Matrix(4)':
    if (incomingConstants.hasOwnProperty(p)) {
      console.warn('constant ' + p + ' of type ' + type + ' cannot be resigned');
    }
    continue;
}
if (!incomingConstants.hasOwnProperty(p)) {
  throw new Error('constant ' + p + ' not found');
}
_constants[p] = incomingConstants[p];
}
const kernel = (function() {
${cpuKernel._kernelString}
})
.apply({ ${thisProperties.join('\n')} });
${ beforeReturn.join('\n') }
return kernel;
}`;
}

module.exports = {
  cpuKernelString
};
},{"../../utils":114}],8:[function(require,module,exports){
const { Kernel } = require('../kernel');
const { FunctionBuilder } = require('../function-builder');
const { CPUFunctionNode } = require('./function-node');
const { utils } = require('../../utils');
const { cpuKernelString } = require('./kernel-string');

class CPUKernel extends Kernel {
  static getFeatures() {
    return this.features;
  }
  static get features() {
    return Object.freeze({
      kernelMap: true,
      isIntegerDivisionAccurate: true
    });
  }
  static get isSupported() {
    return true;
  }
  static isContextMatch(context) {
    return false;
  }
  static get mode() {
    return 'cpu';
  }

  static nativeFunctionArguments() {
    return null;
  }

  static nativeFunctionReturnType() {
    throw new Error(`Looking up native function return type not supported on ${this.name}`);
  }

  static combineKernels(combinedKernel) {
    return combinedKernel;
  }

  static getSignature(kernel, argumentTypes) {
    return 'cpu' + (argumentTypes.length > 0 ? ':' + argumentTypes.join(',') : '');
  }

  constructor(source, settings) {
    super(source, settings);
    this.mergeSettings(source.settings || settings);

    this._imageData = null;
    this._colorData = null;
    this._kernelString = null;
    this._prependedString = [];
    this.thread = {
      x: 0,
      y: 0,
      z: 0
    };
    this.translatedSources = null;
  }

  initCanvas() {
    if (typeof document !== 'undefined') {
      return document.createElement('canvas');
    } else if (typeof OffscreenCanvas !== 'undefined') {
      return new OffscreenCanvas(0, 0);
    }
  }

  initContext() {
    if (!this.canvas) return null;
    return this.canvas.getContext('2d');
  }

  initPlugins(settings) {
    return [];
  }

  validateSettings(args) {
    if (!this.output || this.output.length === 0) {
      if (args.length !== 1) {
        throw new Error('Auto output only supported for kernels with only one input');
      }

      const argType = utils.getVariableType(args[0], this.strictIntegers);
      if (argType === 'Array') {
        this.output = utils.getDimensions(argType);
      } else if (argType === 'NumberTexture' || argType === 'ArrayTexture(4)') {
        this.output = args[0].output;
      } else {
        throw new Error('Auto output not supported for input type: ' + argType);
      }
    }

    if (this.graphical) {
      if (this.output.length !== 2) {
        throw new Error('Output must have 2 dimensions on graphical mode');
      }
    }

    this.checkOutput();
  }

  translateSource() {
    this.leadingReturnStatement = this.output.length > 1 ? 'resultX[x] = ' : 'result[x] = ';
    if (this.subKernels) {
      const followingReturnStatement = [];
      for (let i = 0; i < this.subKernels.length; i++) {
        const {
          name
        } = this.subKernels[i];
        followingReturnStatement.push(this.output.length > 1 ? `resultX_${ name }[x] = subKernelResult_${ name };\n` : `result_${ name }[x] = subKernelResult_${ name };\n`);
      }
      this.followingReturnStatement = followingReturnStatement.join('');
    }
    const functionBuilder = FunctionBuilder.fromKernel(this, CPUFunctionNode);
    this.translatedSources = functionBuilder.getPrototypes('kernel');
    if (!this.graphical && !this.returnType) {
      this.returnType = functionBuilder.getKernelResultType();
    }
  }

  build() {
    if (this.built) return;
    this.setupConstants();
    this.setupArguments(arguments);
    this.validateSettings(arguments);
    this.translateSource();

    if (this.graphical) {
      const {
        canvas,
        output
      } = this;
      if (!canvas) {
        throw new Error('no canvas available for using graphical output');
      }
      const width = output[0];
      const height = output[1] || 1;
      canvas.width = width;
      canvas.height = height;
      this._imageData = this.context.createImageData(width, height);
      this._colorData = new Uint8ClampedArray(width * height * 4);
    }

    const kernelString = this.getKernelString();
    this.kernelString = kernelString;

    if (this.debug) {
      console.log('Function output:');
      console.log(kernelString);
    }

    try {
      this.run = new Function([], kernelString).bind(this)();
    } catch (e) {
      console.error('An error occurred compiling the javascript: ', e);
    }
    this.buildSignature(arguments);
    this.built = true;
  }

  color(r, g, b, a) {
    if (typeof a === 'undefined') {
      a = 1;
    }

    r = Math.floor(r * 255);
    g = Math.floor(g * 255);
    b = Math.floor(b * 255);
    a = Math.floor(a * 255);

    const width = this.output[0];
    const height = this.output[1];

    const x = this.thread.x;
    const y = height - this.thread.y - 1;

    const index = x + y * width;

    this._colorData[index * 4 + 0] = r;
    this._colorData[index * 4 + 1] = g;
    this._colorData[index * 4 + 2] = b;
    this._colorData[index * 4 + 3] = a;
  }

  getKernelString() {
    if (this._kernelString !== null) return this._kernelString;

    let kernelThreadString = null;
    let {
      translatedSources
    } = this;
    if (translatedSources.length > 1) {
      translatedSources = translatedSources.filter(fn => {
        if (/^function/.test(fn)) return fn;
        kernelThreadString = fn;
        return false;
      });
    } else {
      kernelThreadString = translatedSources.shift();
    }
    return this._kernelString = `  const LOOP_MAX = ${ this._getLoopMaxString() };
${ this.injectedNative || '' }
const _this = this;
${ this._resultKernelHeader() }
${ this._processConstants() }
return (${ this.argumentNames.map(argumentName => 'user_' + argumentName).join(', ') }) => {
${ this._prependedString.join('') }
${ this._earlyThrows() }
${ this._processArguments() }
${ this.graphical ? this._graphicalKernelBody(kernelThreadString) : this._resultKernelBody(kernelThreadString) }
${ translatedSources.length > 0 ? translatedSources.join('\n') : '' }
};`;
  }

  toString() {
    return cpuKernelString(this);
  }

  _getLoopMaxString() {
    return (
      this.loopMaxIterations ?
      ` ${ parseInt(this.loopMaxIterations) };` :
      ' 1000;'
    );
  }

  _processConstants() {
    if (!this.constants) return '';

    const result = [];
    for (let p in this.constants) {
      const type = this.constantTypes[p];
      switch (type) {
        case 'HTMLCanvas':
        case 'OffscreenCanvas':
        case 'HTMLImage':
        case 'ImageBitmap':
        case 'ImageData':
        case 'HTMLVideo':
          result.push(`    const constants_${p} = this._mediaTo2DArray(this.constants.${p});\n`);
          break;
        case 'HTMLImageArray':
          result.push(`    const constants_${p} = this._imageTo3DArray(this.constants.${p});\n`);
          break;
        case 'Input':
          result.push(`    const constants_${p} = this.constants.${p}.value;\n`);
          break;
        default:
          result.push(`    const constants_${p} = this.constants.${p};\n`);
      }
    }
    return result.join('');
  }

  _earlyThrows() {
    if (this.graphical) return '';
    if (this.immutable) return '';
    if (!this.pipeline) return '';
    const arrayArguments = [];
    for (let i = 0; i < this.argumentTypes.length; i++) {
      if (this.argumentTypes[i] === 'Array') {
        arrayArguments.push(this.argumentNames[i]);
      }
    }
    if (arrayArguments.length === 0) return '';
    const checks = [];
    for (let i = 0; i < arrayArguments.length; i++) {
      const argumentName = arrayArguments[i];
      const checkSubKernels = this._mapSubKernels(subKernel => `user_${argumentName} === result_${subKernel.name}`).join(' || ');
      checks.push(`user_${argumentName} === result${checkSubKernels ? ` || ${checkSubKernels}` : ''}`);
    }
    return `if (${checks.join(' || ')}) throw new Error('Source and destination arrays are the same.  Use immutable = true');`;
  }

  _processArguments() {
    const result = [];
    for (let i = 0; i < this.argumentTypes.length; i++) {
      const variableName = `user_${this.argumentNames[i]}`;
      switch (this.argumentTypes[i]) {
        case 'HTMLCanvas':
        case 'OffscreenCanvas':
        case 'HTMLImage':
        case 'ImageBitmap':
        case 'ImageData':
        case 'HTMLVideo':
          result.push(`    ${variableName} = this._mediaTo2DArray(${variableName});\n`);
          break;
        case 'HTMLImageArray':
          result.push(`    ${variableName} = this._imageTo3DArray(${variableName});\n`);
          break;
        case 'Input':
          result.push(`    ${variableName} = ${variableName}.value;\n`);
          break;
        case 'ArrayTexture(1)':
        case 'ArrayTexture(2)':
        case 'ArrayTexture(3)':
        case 'ArrayTexture(4)':
        case 'NumberTexture':
        case 'MemoryOptimizedNumberTexture':
          result.push(`
if (${variableName}.toArray) {
  if (!_this.textureCache) {
    _this.textureCache = [];
    _this.arrayCache = [];
  }
  const textureIndex = _this.textureCache.indexOf(${variableName});
  if (textureIndex !== -1) {
    ${variableName} = _this.arrayCache[textureIndex];
  } else {
    _this.textureCache.push(${variableName});
    ${variableName} = ${variableName}.toArray();
    _this.arrayCache.push(${variableName});
  }
}`);
          break;
      }
    }
    return result.join('');
  }

  _mediaTo2DArray(media) {
    const canvas = this.canvas;
    const width = media.width > 0 ? media.width : media.videoWidth;
    const height = media.height > 0 ? media.height : media.videoHeight;
    if (canvas.width < width) {
      canvas.width = width;
    }
    if (canvas.height < height) {
      canvas.height = height;
    }
    const ctx = this.context;
    let pixelsData;
    if (media.constructor === ImageData) {
      pixelsData = media.data;
    } else {
      ctx.drawImage(media, 0, 0, width, height);
      pixelsData = ctx.getImageData(0, 0, width, height).data;
    }
    const imageArray = new Array(height);
    let index = 0;
    for (let y = height - 1; y >= 0; y--) {
      const row = imageArray[y] = new Array(width);
      for (let x = 0; x < width; x++) {
        const pixel = new Float32Array(4);
        pixel[0] = pixelsData[index++] / 255; 
        pixel[1] = pixelsData[index++] / 255; 
        pixel[2] = pixelsData[index++] / 255; 
        pixel[3] = pixelsData[index++] / 255; 
        row[x] = pixel;
      }
    }
    return imageArray;
  }

  getPixels(flip) {
    const [width, height] = this.output;
    return flip ? utils.flipPixels(this._imageData.data, width, height) : this._imageData.data.slice(0);
  }

  _imageTo3DArray(images) {
    const imagesArray = new Array(images.length);
    for (let i = 0; i < images.length; i++) {
      imagesArray[i] = this._mediaTo2DArray(images[i]);
    }
    return imagesArray;
  }

  _resultKernelHeader() {
    if (this.graphical) return '';
    if (this.immutable) return '';
    if (!this.pipeline) return '';
    switch (this.output.length) {
      case 1:
        return this._mutableKernel1DResults();
      case 2:
        return this._mutableKernel2DResults();
      case 3:
        return this._mutableKernel3DResults();
    }
  }

  _resultKernelBody(kernelString) {
    switch (this.output.length) {
      case 1:
        return (!this.immutable && this.pipeline ? this._resultMutableKernel1DLoop(kernelString) : this._resultImmutableKernel1DLoop(kernelString)) + this._kernelOutput();
      case 2:
        return (!this.immutable && this.pipeline ? this._resultMutableKernel2DLoop(kernelString) : this._resultImmutableKernel2DLoop(kernelString)) + this._kernelOutput();
      case 3:
        return (!this.immutable && this.pipeline ? this._resultMutableKernel3DLoop(kernelString) : this._resultImmutableKernel3DLoop(kernelString)) + this._kernelOutput();
      default:
        throw new Error('unsupported size kernel');
    }
  }

  _graphicalKernelBody(kernelThreadString) {
    switch (this.output.length) {
      case 2:
        return this._graphicalKernel2DLoop(kernelThreadString) + this._graphicalOutput();
      default:
        throw new Error('unsupported size kernel');
    }
  }

  _graphicalOutput() {
    return `
this._imageData.data.set(this._colorData);
this.context.putImageData(this._imageData, 0, 0);
return;`
  }

  _getKernelResultTypeConstructorString() {
    switch (this.returnType) {
      case 'LiteralInteger':
      case 'Number':
      case 'Integer':
      case 'Float':
        return 'Float32Array';
      case 'Array(2)':
      case 'Array(3)':
      case 'Array(4)':
        return 'Array';
      default:
        if (this.graphical) {
          return 'Float32Array';
        }
        throw new Error(`unhandled returnType ${ this.returnType }`);
    }
  }

  _resultImmutableKernel1DLoop(kernelString) {
    const constructorString = this._getKernelResultTypeConstructorString();
    return `  const outputX = _this.output[0];
const result = new ${constructorString}(outputX);
${ this._mapSubKernels(subKernel => `const result_${ subKernel.name } = new ${constructorString}(outputX);\n`).join('    ') }
${ this._mapSubKernels(subKernel => `let subKernelResult_${ subKernel.name };\n`).join('    ') }
for (let x = 0; x < outputX; x++) {
  this.thread.x = x;
  this.thread.y = 0;
  this.thread.z = 0;
  ${ kernelString }
}`;
  }

  _mutableKernel1DResults() {
    const constructorString = this._getKernelResultTypeConstructorString();
    return `  const outputX = _this.output[0];
const result = new ${constructorString}(outputX);
${ this._mapSubKernels(subKernel => `const result_${ subKernel.name } = new ${constructorString}(outputX);\n`).join('    ') }
${ this._mapSubKernels(subKernel => `let subKernelResult_${ subKernel.name };\n`).join('    ') }`;
  }

  _resultMutableKernel1DLoop(kernelString) {
    return `  const outputX = _this.output[0];
for (let x = 0; x < outputX; x++) {
  this.thread.x = x;
  this.thread.y = 0;
  this.thread.z = 0;
  ${ kernelString }
}`;
  }

  _resultImmutableKernel2DLoop(kernelString) {
    const constructorString = this._getKernelResultTypeConstructorString();
    return `  const outputX = _this.output[0];
const outputY = _this.output[1];
const result = new Array(outputY);
${ this._mapSubKernels(subKernel => `const result_${ subKernel.name } = new Array(outputY);\n`).join('    ') }
${ this._mapSubKernels(subKernel => `let subKernelResult_${ subKernel.name };\n`).join('    ') }
for (let y = 0; y < outputY; y++) {
  this.thread.z = 0;
  this.thread.y = y;
  const resultX = result[y] = new ${constructorString}(outputX);
  ${ this._mapSubKernels(subKernel => `const resultX_${ subKernel.name } = result_${subKernel.name}[y] = new ${constructorString}(outputX);\n`).join('') }
  for (let x = 0; x < outputX; x++) {
    this.thread.x = x;
    ${ kernelString }
  }
}`;
  }

  _mutableKernel2DResults() {
    const constructorString = this._getKernelResultTypeConstructorString();
    return `  const outputX = _this.output[0];
const outputY = _this.output[1];
const result = new Array(outputY);
${ this._mapSubKernels(subKernel => `const result_${ subKernel.name } = new Array(outputY);\n`).join('    ') }
${ this._mapSubKernels(subKernel => `let subKernelResult_${ subKernel.name };\n`).join('    ') }
for (let y = 0; y < outputY; y++) {
  const resultX = result[y] = new ${constructorString}(outputX);
  ${ this._mapSubKernels(subKernel => `const resultX_${ subKernel.name } = result_${subKernel.name}[y] = new ${constructorString}(outputX);\n`).join('') }
}`;
  }

  _resultMutableKernel2DLoop(kernelString) {
    const constructorString = this._getKernelResultTypeConstructorString();
    return `  const outputX = _this.output[0];
const outputY = _this.output[1];
for (let y = 0; y < outputY; y++) {
  this.thread.z = 0;
  this.thread.y = y;
  const resultX = result[y];
  ${ this._mapSubKernels(subKernel => `const resultX_${ subKernel.name } = result_${subKernel.name}[y] = new ${constructorString}(outputX);\n`).join('') }
  for (let x = 0; x < outputX; x++) {
    this.thread.x = x;
    ${ kernelString }
  }
}`;
  }

  _graphicalKernel2DLoop(kernelString) {
    return `  const outputX = _this.output[0];
const outputY = _this.output[1];
for (let y = 0; y < outputY; y++) {
  this.thread.z = 0;
  this.thread.y = y;
  for (let x = 0; x < outputX; x++) {
    this.thread.x = x;
    ${ kernelString }
  }
}`;
  }

  _resultImmutableKernel3DLoop(kernelString) {
    const constructorString = this._getKernelResultTypeConstructorString();
    return `  const outputX = _this.output[0];
const outputY = _this.output[1];
const outputZ = _this.output[2];
const result = new Array(outputZ);
${ this._mapSubKernels(subKernel => `const result_${ subKernel.name } = new Array(outputZ);\n`).join('    ') }
${ this._mapSubKernels(subKernel => `let subKernelResult_${ subKernel.name };\n`).join('    ') }
for (let z = 0; z < outputZ; z++) {
  this.thread.z = z;
  const resultY = result[z] = new Array(outputY);
  ${ this._mapSubKernels(subKernel => `const resultY_${ subKernel.name } = result_${subKernel.name}[z] = new Array(outputY);\n`).join('      ') }
  for (let y = 0; y < outputY; y++) {
    this.thread.y = y;
    const resultX = resultY[y] = new ${constructorString}(outputX);
    ${ this._mapSubKernels(subKernel => `const resultX_${ subKernel.name } = resultY_${subKernel.name}[y] = new ${constructorString}(outputX);\n`).join('        ') }
    for (let x = 0; x < outputX; x++) {
      this.thread.x = x;
      ${ kernelString }
    }
  }
}`;
  }

  _mutableKernel3DResults() {
    const constructorString = this._getKernelResultTypeConstructorString();
    return `  const outputX = _this.output[0];
const outputY = _this.output[1];
const outputZ = _this.output[2];
const result = new Array(outputZ);
${ this._mapSubKernels(subKernel => `const result_${ subKernel.name } = new Array(outputZ);\n`).join('    ') }
${ this._mapSubKernels(subKernel => `let subKernelResult_${ subKernel.name };\n`).join('    ') }
for (let z = 0; z < outputZ; z++) {
  const resultY = result[z] = new Array(outputY);
  ${ this._mapSubKernels(subKernel => `const resultY_${ subKernel.name } = result_${subKernel.name}[z] = new Array(outputY);\n`).join('      ') }
  for (let y = 0; y < outputY; y++) {
    const resultX = resultY[y] = new ${constructorString}(outputX);
    ${ this._mapSubKernels(subKernel => `const resultX_${ subKernel.name } = resultY_${subKernel.name}[y] = new ${constructorString}(outputX);\n`).join('        ') }
  }
}`;
  }

  _resultMutableKernel3DLoop(kernelString) {
    return `  const outputX = _this.output[0];
const outputY = _this.output[1];
const outputZ = _this.output[2];
for (let z = 0; z < outputZ; z++) {
  this.thread.z = z;
  const resultY = result[z];
  for (let y = 0; y < outputY; y++) {
    this.thread.y = y;
    const resultX = resultY[y];
    for (let x = 0; x < outputX; x++) {
      this.thread.x = x;
      ${ kernelString }
    }
  }
}`;
  }

  _kernelOutput() {
    if (!this.subKernels) {
      return '\n    return result;';
    }
    return `\n    return {
  result: result,
  ${ this.subKernels.map(subKernel => `${ subKernel.property }: result_${ subKernel.name }`).join(',\n      ') }
};`;
  }

  _mapSubKernels(fn) {
    return this.subKernels === null ? [''] :
      this.subKernels.map(fn);
  }

  destroy(removeCanvasReference) {
    if (removeCanvasReference) {
      delete this.canvas;
    }
  }

  static destroyContext(context) {}

  toJSON() {
    const json = super.toJSON();
    json.functionNodes = FunctionBuilder.fromKernel(this, CPUFunctionNode).toJSON();
    return json;
  }

  setOutput(output) {
    super.setOutput(output);
    const [width, height] = this.output;
    if (this.graphical) {
      this._imageData = this.context.createImageData(width, height);
      this._colorData = new Uint8ClampedArray(width * height * 4);
    }
  }

  prependString(value) {
    if (this._kernelString) throw new Error('Kernel already built');
    this._prependedString.push(value);
  }

  hasPrependString(value) {
    return this._prependedString.indexOf(value) > -1;
  }
}

module.exports = {
  CPUKernel
};
},{"../../utils":114,"../function-builder":9,"../kernel":36,"./function-node":6,"./kernel-string":7}],9:[function(require,module,exports){
class FunctionBuilder {
  static fromKernel(kernel, FunctionNode, extraNodeOptions) {
    const {
      kernelArguments,
      kernelConstants,
      argumentNames,
      argumentSizes,
      argumentBitRatios,
      constants,
      constantBitRatios,
      debug,
      loopMaxIterations,
      nativeFunctions,
      output,
      optimizeFloatMemory,
      precision,
      plugins,
      source,
      subKernels,
      functions,
      leadingReturnStatement,
      followingReturnStatement,
      dynamicArguments,
      dynamicOutput,
    } = kernel;

    const argumentTypes = new Array(kernelArguments.length);
    const constantTypes = {};

    for (let i = 0; i < kernelArguments.length; i++) {
      argumentTypes[i] = kernelArguments[i].type;
    }

    for (let i = 0; i < kernelConstants.length; i++) {
      const kernelConstant = kernelConstants[i];
      constantTypes[kernelConstant.name] = kernelConstant.type;
    }

    const needsArgumentType = (functionName, index) => {
      return functionBuilder.needsArgumentType(functionName, index);
    };

    const assignArgumentType = (functionName, index, type) => {
      functionBuilder.assignArgumentType(functionName, index, type);
    };

    const lookupReturnType = (functionName, ast, requestingNode) => {
      return functionBuilder.lookupReturnType(functionName, ast, requestingNode);
    };

    const lookupFunctionArgumentTypes = (functionName) => {
      return functionBuilder.lookupFunctionArgumentTypes(functionName);
    };

    const lookupFunctionArgumentName = (functionName, argumentIndex) => {
      return functionBuilder.lookupFunctionArgumentName(functionName, argumentIndex);
    };

    const lookupFunctionArgumentBitRatio = (functionName, argumentName) => {
      return functionBuilder.lookupFunctionArgumentBitRatio(functionName, argumentName);
    };

    const triggerImplyArgumentType = (functionName, i, argumentType, requestingNode) => {
      functionBuilder.assignArgumentType(functionName, i, argumentType, requestingNode);
    };

    const triggerImplyArgumentBitRatio = (functionName, argumentName, calleeFunctionName, argumentIndex) => {
      functionBuilder.assignArgumentBitRatio(functionName, argumentName, calleeFunctionName, argumentIndex);
    };

    const onFunctionCall = (functionName, calleeFunctionName, args) => {
      functionBuilder.trackFunctionCall(functionName, calleeFunctionName, args);
    };

    const onNestedFunction = (ast, source) => {
      const argumentNames = [];
      for (let i = 0; i < ast.params.length; i++) {
        argumentNames.push(ast.params[i].name);
      }
      const nestedFunction = new FunctionNode(source, Object.assign({}, nodeOptions, {
        returnType: null,
        ast,
        name: ast.id.name,
        argumentNames,
        lookupReturnType,
        lookupFunctionArgumentTypes,
        lookupFunctionArgumentName,
        lookupFunctionArgumentBitRatio,
        needsArgumentType,
        assignArgumentType,
        triggerImplyArgumentType,
        triggerImplyArgumentBitRatio,
        onFunctionCall,
      }));
      nestedFunction.traceFunctionAST(ast);
      functionBuilder.addFunctionNode(nestedFunction);
    };

    const nodeOptions = Object.assign({
      isRootKernel: false,
      onNestedFunction,
      lookupReturnType,
      lookupFunctionArgumentTypes,
      lookupFunctionArgumentName,
      lookupFunctionArgumentBitRatio,
      needsArgumentType,
      assignArgumentType,
      triggerImplyArgumentType,
      triggerImplyArgumentBitRatio,
      onFunctionCall,
      optimizeFloatMemory,
      precision,
      constants,
      constantTypes,
      constantBitRatios,
      debug,
      loopMaxIterations,
      output,
      plugins,
      dynamicArguments,
      dynamicOutput,
    }, extraNodeOptions || {});

    const rootNodeOptions = Object.assign({}, nodeOptions, {
      isRootKernel: true,
      name: 'kernel',
      argumentNames,
      argumentTypes,
      argumentSizes,
      argumentBitRatios,
      leadingReturnStatement,
      followingReturnStatement,
    });

    if (typeof source === 'object' && source.functionNodes) {
      return new FunctionBuilder().fromJSON(source.functionNodes, FunctionNode);
    }

    const rootNode = new FunctionNode(source, rootNodeOptions);

    let functionNodes = null;
    if (functions) {
      functionNodes = functions.map((fn) => new FunctionNode(fn.source, {
        returnType: fn.returnType,
        argumentTypes: fn.argumentTypes,
        output,
        plugins,
        constants,
        constantTypes,
        constantBitRatios,
        optimizeFloatMemory,
        precision,
        lookupReturnType,
        lookupFunctionArgumentTypes,
        lookupFunctionArgumentName,
        lookupFunctionArgumentBitRatio,
        needsArgumentType,
        assignArgumentType,
        triggerImplyArgumentType,
        triggerImplyArgumentBitRatio,
        onFunctionCall,
        onNestedFunction,
      }));
    }

    let subKernelNodes = null;
    if (subKernels) {
      subKernelNodes = subKernels.map((subKernel) => {
        const { name, source } = subKernel;
        return new FunctionNode(source, Object.assign({}, nodeOptions, {
          name,
          isSubKernel: true,
          isRootKernel: false,
        }));
      });
    }

    const functionBuilder = new FunctionBuilder({
      kernel,
      rootNode,
      functionNodes,
      nativeFunctions,
      subKernelNodes
    });

    return functionBuilder;
  }

  constructor(settings) {
    settings = settings || {};
    this.kernel = settings.kernel;
    this.rootNode = settings.rootNode;
    this.functionNodes = settings.functionNodes || [];
    this.subKernelNodes = settings.subKernelNodes || [];
    this.nativeFunctions = settings.nativeFunctions || [];
    this.functionMap = {};
    this.nativeFunctionNames = [];
    this.lookupChain = [];
    this.functionNodeDependencies = {};
    this.functionCalls = {};

    if (this.rootNode) {
      this.functionMap['kernel'] = this.rootNode;
    }

    if (this.functionNodes) {
      for (let i = 0; i < this.functionNodes.length; i++) {
        this.functionMap[this.functionNodes[i].name] = this.functionNodes[i];
      }
    }

    if (this.subKernelNodes) {
      for (let i = 0; i < this.subKernelNodes.length; i++) {
        this.functionMap[this.subKernelNodes[i].name] = this.subKernelNodes[i];
      }
    }

    if (this.nativeFunctions) {
      for (let i = 0; i < this.nativeFunctions.length; i++) {
        const nativeFunction = this.nativeFunctions[i];
        this.nativeFunctionNames.push(nativeFunction.name);
      }
    }
  }

  addFunctionNode(functionNode) {
    if (!functionNode.name) throw new Error('functionNode.name needs set');
    this.functionMap[functionNode.name] = functionNode;
    if (functionNode.isRootKernel) {
      this.rootNode = functionNode;
    }
  }

  traceFunctionCalls(functionName, retList) {
    functionName = functionName || 'kernel';
    retList = retList || [];

    if (this.nativeFunctionNames.indexOf(functionName) > -1) {
      const nativeFunctionIndex = retList.indexOf(functionName);
      if (nativeFunctionIndex === -1) {
        retList.push(functionName);
      } else {
        const dependantNativeFunctionName = retList.splice(nativeFunctionIndex, 1)[0];
        retList.push(dependantNativeFunctionName);
      }
      return retList;
    }

    const functionNode = this.functionMap[functionName];
    if (functionNode) {
      const functionIndex = retList.indexOf(functionName);
      if (functionIndex === -1) {
        retList.push(functionName);
        functionNode.toString(); 
        for (let i = 0; i < functionNode.calledFunctions.length; ++i) {
          this.traceFunctionCalls(functionNode.calledFunctions[i], retList);
        }
      } else {
        const dependantFunctionName = retList.splice(functionIndex, 1)[0];
        retList.push(dependantFunctionName);
      }
    }

    return retList;
  }

  getPrototypeString(functionName) {
    return this.getPrototypes(functionName).join('\n');
  }

  getPrototypes(functionName) {
    if (this.rootNode) {
      this.rootNode.toString();
    }
    if (functionName) {
      return this.getPrototypesFromFunctionNames(this.traceFunctionCalls(functionName, []).reverse());
    }
    return this.getPrototypesFromFunctionNames(Object.keys(this.functionMap));
  }

  getStringFromFunctionNames(functionList) {
    const ret = [];
    for (let i = 0; i < functionList.length; ++i) {
      const node = this.functionMap[functionList[i]];
      if (node) {
        ret.push(this.functionMap[functionList[i]].toString());
      }
    }
    return ret.join('\n');
  }

  getPrototypesFromFunctionNames(functionList) {
    const ret = [];
    for (let i = 0; i < functionList.length; ++i) {
      const functionName = functionList[i];
      const functionIndex = this.nativeFunctionNames.indexOf(functionName);
      if (functionIndex > -1) {
        ret.push(this.nativeFunctions[functionIndex].source);
        continue;
      }
      const node = this.functionMap[functionName];
      if (node) {
        ret.push(node.toString());
      }
    }
    return ret;
  }

  toJSON() {
    return this.traceFunctionCalls(this.rootNode.name).reverse().map(name => {
      const nativeIndex = this.nativeFunctions.indexOf(name);
      if (nativeIndex > -1) {
        return {
          name,
          source: this.nativeFunctions[nativeIndex].source
        };
      } else if (this.functionMap[name]) {
        return this.functionMap[name].toJSON();
      } else {
        throw new Error(`function ${ name } not found`);
      }
    });
  }

  fromJSON(jsonFunctionNodes, FunctionNode) {
    this.functionMap = {};
    for (let i = 0; i < jsonFunctionNodes.length; i++) {
      const jsonFunctionNode = jsonFunctionNodes[i];
      this.functionMap[jsonFunctionNode.settings.name] = new FunctionNode(jsonFunctionNode.ast, jsonFunctionNode.settings);
    }
    return this;
  }

  getString(functionName) {
    if (functionName) {
      return this.getStringFromFunctionNames(this.traceFunctionCalls(functionName).reverse());
    }
    return this.getStringFromFunctionNames(Object.keys(this.functionMap));
  }

  lookupReturnType(functionName, ast, requestingNode) {
    if (ast.type !== 'CallExpression') {
      throw new Error(`expected ast type of "CallExpression", but is ${ ast.type }`);
    }
    if (this._isNativeFunction(functionName)) {
      return this._lookupNativeFunctionReturnType(functionName);
    } else if (this._isFunction(functionName)) {
      const node = this._getFunction(functionName);
      if (node.returnType) {
        return node.returnType;
      } else {
        for (let i = 0; i < this.lookupChain.length; i++) {
          if (this.lookupChain[i].ast === ast) {
            if (node.argumentTypes.length === 0 && ast.arguments.length > 0) {
              const args = ast.arguments;
              for (let j = 0; j < args.length; j++) {
                this.lookupChain.push({
                  name: requestingNode.name,
                  ast: args[i],
                  requestingNode
                });
                node.argumentTypes[j] = requestingNode.getType(args[j]);
                this.lookupChain.pop();
              }
              return node.returnType = node.getType(node.getJsAST());
            }

            throw new Error('circlical logic detected!');
          }
        }
        this.lookupChain.push({
          name: requestingNode.name,
          ast,
          requestingNode
        });
        const type = node.getType(node.getJsAST());
        this.lookupChain.pop();
        return node.returnType = type;
      }
    }

    return null;
  }

  _getFunction(functionName) {
    if (!this._isFunction(functionName)) ;
    return this.functionMap[functionName];
  }

  _isFunction(functionName) {
    return Boolean(this.functionMap[functionName]);
  }

  _getNativeFunction(functionName) {
    for (let i = 0; i < this.nativeFunctions.length; i++) {
      if (this.nativeFunctions[i].name === functionName) return this.nativeFunctions[i];
    }
    return null;
  }

  _isNativeFunction(functionName) {
    return Boolean(this._getNativeFunction(functionName));
  }

  _lookupNativeFunctionReturnType(functionName) {
    let nativeFunction = this._getNativeFunction(functionName);
    if (nativeFunction) {
      return nativeFunction.returnType;
    }
    throw new Error(`Native function ${ functionName } not found`);
  }

  lookupFunctionArgumentTypes(functionName) {
    if (this._isNativeFunction(functionName)) {
      return this._getNativeFunction(functionName).argumentTypes;
    } else if (this._isFunction(functionName)) {
      return this._getFunction(functionName).argumentTypes;
    }
    return null;
  }

  lookupFunctionArgumentName(functionName, argumentIndex) {
    return this._getFunction(functionName).argumentNames[argumentIndex];
  }

  lookupFunctionArgumentBitRatio(functionName, argumentName) {
    if (!this._isFunction(functionName)) {
      throw new Error('function not found');
    }
    if (this.rootNode.name === functionName) {
      const i = this.rootNode.argumentNames.indexOf(argumentName);
      if (i !== -1) {
        return this.rootNode.argumentBitRatios[i];
      }
    }
    const node = this._getFunction(functionName);
    const i = node.argumentNames.indexOf(argumentName);
    if (i === -1) {
      throw new Error('argument not found');
    }
    const bitRatio = node.argumentBitRatios[i];
    if (typeof bitRatio !== 'number') {
      throw new Error('argument bit ratio not found');
    }
    return bitRatio;
  }

  needsArgumentType(functionName, i) {
    if (!this._isFunction(functionName)) return false;
    const fnNode = this._getFunction(functionName);
    return !fnNode.argumentTypes[i];
  }

  assignArgumentType(functionName, i, argumentType, requestingNode) {
    if (!this._isFunction(functionName)) return;
    const fnNode = this._getFunction(functionName);
    if (!fnNode.argumentTypes[i]) {
      fnNode.argumentTypes[i] = argumentType;
    }
  }

  assignArgumentBitRatio(functionName, argumentName, calleeFunctionName, argumentIndex) {
    const node = this._getFunction(functionName);
    if (this._isNativeFunction(calleeFunctionName)) return null;
    const calleeNode = this._getFunction(calleeFunctionName);
    const i = node.argumentNames.indexOf(argumentName);
    if (i === -1) {
      throw new Error(`Argument ${argumentName} not found in arguments from function ${functionName}`);
    }
    const bitRatio = node.argumentBitRatios[i];
    if (typeof bitRatio !== 'number') {
      throw new Error(`Bit ratio for argument ${argumentName} not found in function ${functionName}`);
    }
    if (!calleeNode.argumentBitRatios) {
      calleeNode.argumentBitRatios = new Array(calleeNode.argumentNames.length);
    }
    const calleeBitRatio = calleeNode.argumentBitRatios[i];
    if (typeof calleeBitRatio === 'number') {
      if (calleeBitRatio !== bitRatio) {
        throw new Error(`Incompatible bit ratio found at function ${functionName} at argument ${argumentName}`);
      }
      return calleeBitRatio;
    }
    calleeNode.argumentBitRatios[i] = bitRatio;
    return bitRatio;
  }

  trackFunctionCall(functionName, calleeFunctionName, args) {
    if (!this.functionNodeDependencies[functionName]) {
      this.functionNodeDependencies[functionName] = new Set();
      this.functionCalls[functionName] = [];
    }
    this.functionNodeDependencies[functionName].add(calleeFunctionName);
    this.functionCalls[functionName].push(args);
  }

  getKernelResultType() {
    return this.rootNode.returnType || this.rootNode.getType(this.rootNode.ast);
  }

  getSubKernelResultType(index) {
    const subKernelNode = this.subKernelNodes[index];
    let called = false;
    for (let functionCallIndex = 0; functionCallIndex < this.rootNode.functionCalls.length; functionCallIndex++) {
      const functionCall = this.rootNode.functionCalls[functionCallIndex];
      if (functionCall.ast.callee.name === subKernelNode.name) {
        called = true;
      }
    }
    if (!called) {
      throw new Error(`SubKernel ${ subKernelNode.name } never called by kernel`);
    }
    return subKernelNode.returnType || subKernelNode.getType(subKernelNode.getJsAST());
  }

  getReturnTypes() {
    const result = {
      [this.rootNode.name]: this.rootNode.getType(this.rootNode.ast),
    };
    const list = this.traceFunctionCalls(this.rootNode.name);
    for (let i = 0; i < list.length; i++) {
      const functionName = list[i];
      const functionNode = this.functionMap[functionName];
      result[functionName] = functionNode.getType(functionNode.ast);
    }
    return result;
  }
}

module.exports = {
  FunctionBuilder
};
},{}],10:[function(require,module,exports){
const acorn = require('acorn');
const { utils } = require('../utils');
const { FunctionTracer } = require('./function-tracer');

class FunctionNode {
  constructor(source, settings) {
    if (!source && !settings.ast) {
      throw new Error('source parameter is missing');
    }
    settings = settings || {};
    this.source = source;
    this.ast = null;
    this.name = typeof source === 'string' ? settings.isRootKernel ?
      'kernel' :
      (settings.name || utils.getFunctionNameFromString(source)) : null;
    this.calledFunctions = [];
    this.constants = {};
    this.constantTypes = {};
    this.constantBitRatios = {};
    this.isRootKernel = false;
    this.isSubKernel = false;
    this.debug = null;
    this.functions = null;
    this.identifiers = null;
    this.contexts = null;
    this.functionCalls = null;
    this.states = [];
    this.needsArgumentType = null;
    this.assignArgumentType = null;
    this.lookupReturnType = null;
    this.lookupFunctionArgumentTypes = null;
    this.lookupFunctionArgumentBitRatio = null;
    this.triggerImplyArgumentType = null;
    this.triggerImplyArgumentBitRatio = null;
    this.onNestedFunction = null;
    this.onFunctionCall = null;
    this.optimizeFloatMemory = null;
    this.precision = null;
    this.loopMaxIterations = null;
    this.argumentNames = (typeof this.source === 'string' ? utils.getArgumentNamesFromString(this.source) : null);
    this.argumentTypes = [];
    this.argumentSizes = [];
    this.argumentBitRatios = null;
    this.returnType = null;
    this.output = [];
    this.plugins = null;
    this.leadingReturnStatement = null;
    this.followingReturnStatement = null;
    this.dynamicOutput = null;
    this.dynamicArguments = null;
    this.strictTypingChecking = false;
    this.fixIntegerDivisionAccuracy = null;

    if (settings) {
      for (const p in settings) {
        if (!settings.hasOwnProperty(p)) continue;
        if (!this.hasOwnProperty(p)) continue;
        this[p] = settings[p];
      }
    }

    this.literalTypes = {};

    this.validate();
    this._string = null;
    this._internalVariableNames = {};
  }

  validate() {
    if (typeof this.source !== 'string' && !this.ast) {
      throw new Error('this.source not a string');
    }

    if (!this.ast && !utils.isFunctionString(this.source)) {
      throw new Error('this.source not a function string');
    }

    if (!this.name) {
      throw new Error('this.name could not be set');
    }

    if (this.argumentTypes.length > 0 && this.argumentTypes.length !== this.argumentNames.length) {
      throw new Error(`argumentTypes count of ${ this.argumentTypes.length } exceeds ${ this.argumentNames.length }`);
    }

    if (this.output.length < 1) {
      throw new Error('this.output is not big enough');
    }
  }

  isIdentifierConstant(name) {
    if (!this.constants) return false;
    return this.constants.hasOwnProperty(name);
  }

  isInput(argumentName) {
    return this.argumentTypes[this.argumentNames.indexOf(argumentName)] === 'Input';
  }

  pushState(state) {
    this.states.push(state);
  }

  popState(state) {
    if (this.state !== state) {
      throw new Error(`Cannot popState ${ state } when in ${ this.state }`);
    }
    this.states.pop();
  }

  isState(state) {
    return this.state === state;
  }

  get state() {
    return this.states[this.states.length - 1];
  }

  astMemberExpressionUnroll(ast) {
    if (ast.type === 'Identifier') {
      return ast.name;
    } else if (ast.type === 'ThisExpression') {
      return 'this';
    }

    if (ast.type === 'MemberExpression') {
      if (ast.object && ast.property) {
        if (ast.object.hasOwnProperty('name') && ast.object.name !== 'Math') {
          return this.astMemberExpressionUnroll(ast.property);
        }

        return (
          this.astMemberExpressionUnroll(ast.object) +
          '.' +
          this.astMemberExpressionUnroll(ast.property)
        );
      }
    }

    if (ast.hasOwnProperty('expressions')) {
      const firstExpression = ast.expressions[0];
      if (firstExpression.type === 'Literal' && firstExpression.value === 0 && ast.expressions.length === 2) {
        return this.astMemberExpressionUnroll(ast.expressions[1]);
      }
    }

    throw this.astErrorOutput('Unknown astMemberExpressionUnroll', ast);
  }

  getJsAST(inParser) {
    if (this.ast) {
      return this.ast;
    }
    if (typeof this.source === 'object') {
      this.traceFunctionAST(this.source);
      return this.ast = this.source;
    }

    inParser = inParser || acorn;
    if (inParser === null) {
      throw new Error('Missing JS to AST parser');
    }

    const ast = Object.freeze(inParser.parse(`const parser_${ this.name } = ${ this.source };`, {
      locations: true
    }));
    const functionAST = ast.body[0].declarations[0].init;
    this.traceFunctionAST(functionAST);

    if (!ast) {
      throw new Error('Failed to parse JS code');
    }

    return this.ast = functionAST;
  }

  traceFunctionAST(ast) {
    const { contexts, declarations, functions, identifiers, functionCalls } = new FunctionTracer(ast);
    this.contexts = contexts;
    this.identifiers = identifiers;
    this.functionCalls = functionCalls;
    this.functions = functions;
    for (let i = 0; i < declarations.length; i++) {
      const declaration = declarations[i];
      const { ast, inForLoopInit, inForLoopTest } = declaration;
      const { init } = ast;
      const dependencies = this.getDependencies(init);
      let valueType = null;

      if (inForLoopInit && inForLoopTest) {
        valueType = 'Integer';
      } else {
        if (init) {
          const realType = this.getType(init);
          switch (realType) {
            case 'Integer':
            case 'Float':
            case 'Number':
              if (init.type === 'MemberExpression') {
                valueType = realType;
              } else {
                valueType = 'Number';
              }
              break;
            case 'LiteralInteger':
              valueType = 'Number';
              break;
            default:
              valueType = realType;
          }
        }
      }
      declaration.valueType = valueType;
      declaration.dependencies = dependencies;
      declaration.isSafe = this.isSafeDependencies(dependencies);
    }

    for (let i = 0; i < functions.length; i++) {
      this.onNestedFunction(functions[i], this.source);
    }
  }

  getDeclaration(ast) {
    for (let i = 0; i < this.identifiers.length; i++) {
      const identifier = this.identifiers[i];
      if (ast === identifier.ast) {
        return identifier.declaration;
      }
    }
    return null;
  }

  getVariableType(ast) {
    if (ast.type !== 'Identifier') {
      throw new Error(`ast of ${ast.type} not "Identifier"`);
    }
    let type = null;
    const argumentIndex = this.argumentNames.indexOf(ast.name);
    if (argumentIndex === -1) {
      const declaration = this.getDeclaration(ast);
      if (declaration) {
        return declaration.valueType;
      }
    } else {
      const argumentType = this.argumentTypes[argumentIndex];
      if (argumentType) {
        type = argumentType;
      }
    }
    if (!type && this.strictTypingChecking) {
      throw new Error(`Declaration of ${name} not found`);
    }
    return type;
  }

  getLookupType(type) {
    if (!typeLookupMap.hasOwnProperty(type)) {
      throw new Error(`unknown typeLookupMap ${ type }`);
    }
    return typeLookupMap[type];
  }

  getConstantType(constantName) {
    if (this.constantTypes[constantName]) {
      const type = this.constantTypes[constantName];
      if (type === 'Float') {
        return 'Number';
      } else {
        return type;
      }
    }
    throw new Error(`Type for constant "${ constantName }" not declared`);
  }

  toString() {
    if (this._string) return this._string;
    return this._string = this.astGeneric(this.getJsAST(), []).join('').trim();
  }

  toJSON() {
    const settings = {
      source: this.source,
      name: this.name,
      constants: this.constants,
      constantTypes: this.constantTypes,
      isRootKernel: this.isRootKernel,
      isSubKernel: this.isSubKernel,
      debug: this.debug,
      output: this.output,
      loopMaxIterations: this.loopMaxIterations,
      argumentNames: this.argumentNames,
      argumentTypes: this.argumentTypes,
      argumentSizes: this.argumentSizes,
      returnType: this.returnType,
      leadingReturnStatement: this.leadingReturnStatement,
      followingReturnStatement: this.followingReturnStatement,
    };

    return {
      ast: this.ast,
      settings
    };
  }

  getType(ast) {
    if (Array.isArray(ast)) {
      return this.getType(ast[ast.length - 1]);
    }
    switch (ast.type) {
      case 'BlockStatement':
        return this.getType(ast.body);
      case 'ArrayExpression':
        const childType = this.getType(ast.elements[0]);
        switch (childType) {
          case 'Array(2)':
          case 'Array(3)':
          case 'Array(4)':
            return `Matrix(${ast.elements.length})`;
        }
        return `Array(${ ast.elements.length })`;
      case 'Literal':
        const literalKey = this.astKey(ast);
        if (this.literalTypes[literalKey]) {
          return this.literalTypes[literalKey];
        }
        if (Number.isInteger(ast.value)) {
          return 'LiteralInteger';
        } else if (ast.value === true || ast.value === false) {
          return 'Boolean';
        } else {
          return 'Number';
        }
        case 'AssignmentExpression':
          return this.getType(ast.left);
        case 'CallExpression':
          if (this.isAstMathFunction(ast)) {
            return 'Number';
          }
          if (!ast.callee || !ast.callee.name) {
            if (ast.callee.type === 'SequenceExpression' && ast.callee.expressions[ast.callee.expressions.length - 1].property.name) {
              const functionName = ast.callee.expressions[ast.callee.expressions.length - 1].property.name;
              this.inferArgumentTypesIfNeeded(functionName, ast.arguments);
              return this.lookupReturnType(functionName, ast, this);
            }
            if (this.getVariableSignature(ast.callee, true) === 'this.color') {
              return null;
            }
            if (ast.callee.type === 'MemberExpression' && ast.callee.object && ast.callee.property && ast.callee.property.name && ast.arguments) {
              const functionName = ast.callee.property.name;
              this.inferArgumentTypesIfNeeded(functionName, ast.arguments);
              return this.lookupReturnType(functionName, ast, this);
            }
            throw this.astErrorOutput('Unknown call expression', ast);
          }
          if (ast.callee && ast.callee.name) {
            const functionName = ast.callee.name;
            this.inferArgumentTypesIfNeeded(functionName, ast.arguments);
            return this.lookupReturnType(functionName, ast, this);
          }
          throw this.astErrorOutput(`Unhandled getType Type "${ ast.type }"`, ast);
        case 'LogicalExpression':
          return 'Boolean';
        case 'BinaryExpression':
          switch (ast.operator) {
            case '%':
            case '/':
              if (this.fixIntegerDivisionAccuracy) {
                return 'Number';
              } else {
                break;
              }
              case '>':
              case '<':
                return 'Boolean';
              case '&':
              case '|':
              case '^':
              case '<<':
              case '>>':
              case '>>>':
                return 'Integer';
          }
          const type = this.getType(ast.left);
          if (this.isState('skip-literal-correction')) return type;
          if (type === 'LiteralInteger') {
            const rightType = this.getType(ast.right);
            if (rightType === 'LiteralInteger') {
              if (ast.left.value % 1 === 0) {
                return 'Integer';
              } else {
                return 'Float';
              }
            }
            return rightType;
          }
          return typeLookupMap[type] || type;
        case 'UpdateExpression':
          return this.getType(ast.argument);
        case 'UnaryExpression':
          if (ast.operator === '~') {
            return 'Integer';
          }
          return this.getType(ast.argument);
        case 'VariableDeclaration': {
          const declarations = ast.declarations;
          let lastType;
          for (let i = 0; i < declarations.length; i++) {
            const declaration = declarations[i];
            lastType = this.getType(declaration);
          }
          if (!lastType) {
            throw this.astErrorOutput(`Unable to find type for declaration`, ast);
          }
          return lastType;
        }
        case 'VariableDeclarator':
          const declaration = this.getDeclaration(ast.id);
          if (!declaration) {
            throw this.astErrorOutput(`Unable to find declarator`, ast);
          }

          if (!declaration.valueType) {
            throw this.astErrorOutput(`Unable to find declarator valueType`, ast);
          }

          return declaration.valueType;
        case 'Identifier':
          if (ast.name === 'Infinity') {
            return 'Number';
          }
          if (this.isAstVariable(ast)) {
            const signature = this.getVariableSignature(ast);
            if (signature === 'value') {
              return this.getCheckVariableType(ast);
            }
          }
          const origin = this.findIdentifierOrigin(ast);
          if (origin && origin.init) {
            return this.getType(origin.init);
          }
          return null;
        case 'ReturnStatement':
          return this.getType(ast.argument);
        case 'MemberExpression':
          if (this.isAstMathFunction(ast)) {
            switch (ast.property.name) {
              case 'ceil':
                return 'Integer';
              case 'floor':
                return 'Integer';
              case 'round':
                return 'Integer';
            }
            return 'Number';
          }
          if (this.isAstVariable(ast)) {
            const variableSignature = this.getVariableSignature(ast);
            switch (variableSignature) {
              case 'value[]':
                return this.getLookupType(this.getCheckVariableType(ast.object));
              case 'value[][]':
                return this.getLookupType(this.getCheckVariableType(ast.object.object));
              case 'value[][][]':
                return this.getLookupType(this.getCheckVariableType(ast.object.object.object));
              case 'value[][][][]':
                return this.getLookupType(this.getCheckVariableType(ast.object.object.object.object));
              case 'value.thread.value':
              case 'this.thread.value':
                return 'Integer';
              case 'this.output.value':
                return this.dynamicOutput ? 'Integer' : 'LiteralInteger';
              case 'this.constants.value':
                return this.getConstantType(ast.property.name);
              case 'this.constants.value[]':
                return this.getLookupType(this.getConstantType(ast.object.property.name));
              case 'this.constants.value[][]':
                return this.getLookupType(this.getConstantType(ast.object.object.property.name));
              case 'this.constants.value[][][]':
                return this.getLookupType(this.getConstantType(ast.object.object.object.property.name));
              case 'this.constants.value[][][][]':
                return this.getLookupType(this.getConstantType(ast.object.object.object.object.property.name));
              case 'fn()[]':
              case 'fn()[][]':
              case 'fn()[][][]':
                return this.getLookupType(this.getType(ast.object));
              case 'value.value':
                if (this.isAstMathVariable(ast)) {
                  return 'Number';
                }
                switch (ast.property.name) {
                  case 'r':
                  case 'g':
                  case 'b':
                  case 'a':
                    return this.getLookupType(this.getCheckVariableType(ast.object));
                }
                case '[][]':
                  return 'Number';
            }
            throw this.astErrorOutput('Unhandled getType MemberExpression', ast);
          }
          throw this.astErrorOutput('Unhandled getType MemberExpression', ast);
        case 'ConditionalExpression':
          return this.getType(ast.consequent);
        case 'FunctionDeclaration':
        case 'FunctionExpression':
          const lastReturn = this.findLastReturn(ast.body);
          if (lastReturn) {
            return this.getType(lastReturn);
          }
          return null;
        case 'IfStatement':
          return this.getType(ast.consequent);
        case 'SequenceExpression':
          return this.getType(ast.expressions[ast.expressions.length - 1]);
        default:
          throw this.astErrorOutput(`Unhandled getType Type "${ ast.type }"`, ast);
    }
  }

  getCheckVariableType(ast) {
    const type = this.getVariableType(ast);
    if (!type) {
      throw this.astErrorOutput(`${ast.type} is not defined`, ast);
    }
    return type;
  }

  inferArgumentTypesIfNeeded(functionName, args) {
    for (let i = 0; i < args.length; i++) {
      if (!this.needsArgumentType(functionName, i)) continue;
      const type = this.getType(args[i]);
      if (!type) {
        throw this.astErrorOutput(`Unable to infer argument ${i}`, args[i]);
      }
      this.assignArgumentType(functionName, i, type);
    }
  }

  isAstMathVariable(ast) {
    const mathProperties = [
      'E',
      'PI',
      'SQRT2',
      'SQRT1_2',
      'LN2',
      'LN10',
      'LOG2E',
      'LOG10E',
    ];
    return ast.type === 'MemberExpression' &&
      ast.object && ast.object.type === 'Identifier' &&
      ast.object.name === 'Math' &&
      ast.property &&
      ast.property.type === 'Identifier' &&
      mathProperties.indexOf(ast.property.name) > -1;
  }

  isAstMathFunction(ast) {
    const mathFunctions = [
      'abs',
      'acos',
      'acosh',
      'asin',
      'asinh',
      'atan',
      'atan2',
      'atanh',
      'cbrt',
      'ceil',
      'clz32',
      'cos',
      'cosh',
      'expm1',
      'exp',
      'floor',
      'fround',
      'imul',
      'log',
      'log2',
      'log10',
      'log1p',
      'max',
      'min',
      'pow',
      'random',
      'round',
      'sign',
      'sin',
      'sinh',
      'sqrt',
      'tan',
      'tanh',
      'trunc',
    ];
    return ast.type === 'CallExpression' &&
      ast.callee &&
      ast.callee.type === 'MemberExpression' &&
      ast.callee.object &&
      ast.callee.object.type === 'Identifier' &&
      ast.callee.object.name === 'Math' &&
      ast.callee.property &&
      ast.callee.property.type === 'Identifier' &&
      mathFunctions.indexOf(ast.callee.property.name) > -1;
  }

  isAstVariable(ast) {
    return ast.type === 'Identifier' || ast.type === 'MemberExpression';
  }

  isSafe(ast) {
    return this.isSafeDependencies(this.getDependencies(ast));
  }

  isSafeDependencies(dependencies) {
    return dependencies && dependencies.every ? dependencies.every(dependency => dependency.isSafe) : true;
  }

  getDependencies(ast, dependencies, isNotSafe) {
    if (!dependencies) {
      dependencies = [];
    }
    if (!ast) return null;
    if (Array.isArray(ast)) {
      for (let i = 0; i < ast.length; i++) {
        this.getDependencies(ast[i], dependencies, isNotSafe);
      }
      return dependencies;
    }
    switch (ast.type) {
      case 'AssignmentExpression':
        this.getDependencies(ast.left, dependencies, isNotSafe);
        this.getDependencies(ast.right, dependencies, isNotSafe);
        return dependencies;
      case 'ConditionalExpression':
        this.getDependencies(ast.test, dependencies, isNotSafe);
        this.getDependencies(ast.alternate, dependencies, isNotSafe);
        this.getDependencies(ast.consequent, dependencies, isNotSafe);
        return dependencies;
      case 'Literal':
        dependencies.push({
          origin: 'literal',
          value: ast.value,
          isSafe: isNotSafe === true ? false : ast.value > -Infinity && ast.value < Infinity && !isNaN(ast.value)
        });
        break;
      case 'VariableDeclarator':
        return this.getDependencies(ast.init, dependencies, isNotSafe);
      case 'Identifier':
        const declaration = this.getDeclaration(ast);
        if (declaration) {
          dependencies.push({
            name: ast.name,
            origin: 'declaration',
            isSafe: isNotSafe ? false : this.isSafeDependencies(declaration.dependencies),
          });
        } else if (this.argumentNames.indexOf(ast.name) > -1) {
          dependencies.push({
            name: ast.name,
            origin: 'argument',
            isSafe: false,
          });
        } else if (this.strictTypingChecking) {
          throw new Error(`Cannot find identifier origin "${ast.name}"`);
        }
        break;
      case 'FunctionDeclaration':
        return this.getDependencies(ast.body.body[ast.body.body.length - 1], dependencies, isNotSafe);
      case 'ReturnStatement':
        return this.getDependencies(ast.argument, dependencies);
      case 'BinaryExpression':
      case 'LogicalExpression':
        isNotSafe = (ast.operator === '/' || ast.operator === '*');
        this.getDependencies(ast.left, dependencies, isNotSafe);
        this.getDependencies(ast.right, dependencies, isNotSafe);
        return dependencies;
      case 'UnaryExpression':
      case 'UpdateExpression':
        return this.getDependencies(ast.argument, dependencies, isNotSafe);
      case 'VariableDeclaration':
        return this.getDependencies(ast.declarations, dependencies, isNotSafe);
      case 'ArrayExpression':
        dependencies.push({
          origin: 'declaration',
          isSafe: true,
        });
        return dependencies;
      case 'CallExpression':
        dependencies.push({
          origin: 'function',
          isSafe: true,
        });
        return dependencies;
      case 'MemberExpression':
        const details = this.getMemberExpressionDetails(ast);
        switch (details.signature) {
          case 'value[]':
            this.getDependencies(ast.object, dependencies, isNotSafe);
            break;
          case 'value[][]':
            this.getDependencies(ast.object.object, dependencies, isNotSafe);
            break;
          case 'value[][][]':
            this.getDependencies(ast.object.object.object, dependencies, isNotSafe);
            break;
          case 'this.output.value':
            if (this.dynamicOutput) {
              dependencies.push({
                name: details.name,
                origin: 'output',
                isSafe: false,
              });
            }
            break;
        }
        if (details) {
          if (details.property) {
            this.getDependencies(details.property, dependencies, isNotSafe);
          }
          if (details.xProperty) {
            this.getDependencies(details.xProperty, dependencies, isNotSafe);
          }
          if (details.yProperty) {
            this.getDependencies(details.yProperty, dependencies, isNotSafe);
          }
          if (details.zProperty) {
            this.getDependencies(details.zProperty, dependencies, isNotSafe);
          }
          return dependencies;
        }
        case 'SequenceExpression':
          return this.getDependencies(ast.expressions, dependencies, isNotSafe);
        default:
          throw this.astErrorOutput(`Unhandled type ${ ast.type } in getDependencies`, ast);
    }
    return dependencies;
  }

  getVariableSignature(ast, returnRawValue) {
    if (!this.isAstVariable(ast)) {
      throw new Error(`ast of type "${ ast.type }" is not a variable signature`);
    }
    if (ast.type === 'Identifier') {
      return 'value';
    }
    const signature = [];
    while (true) {
      if (!ast) break;
      if (ast.computed) {
        signature.push('[]');
      } else if (ast.type === 'ThisExpression') {
        signature.unshift('this');
      } else if (ast.property && ast.property.name) {
        if (
          ast.property.name === 'x' ||
          ast.property.name === 'y' ||
          ast.property.name === 'z'
        ) {
          signature.unshift(returnRawValue ? '.' + ast.property.name : '.value');
        } else if (
          ast.property.name === 'constants' ||
          ast.property.name === 'thread' ||
          ast.property.name === 'output'
        ) {
          signature.unshift('.' + ast.property.name);
        } else {
          signature.unshift(returnRawValue ? '.' + ast.property.name : '.value');
        }
      } else if (ast.name) {
        signature.unshift(returnRawValue ? ast.name : 'value');
      } else if (ast.callee && ast.callee.name) {
        signature.unshift(returnRawValue ? ast.callee.name + '()' : 'fn()');
      } else if (ast.elements) {
        signature.unshift('[]');
      } else {
        signature.unshift('unknown');
      }
      ast = ast.object;
    }

    const signatureString = signature.join('');
    if (returnRawValue) {
      return signatureString;
    }

    const allowedExpressions = [
      'value',
      'value[]',
      'value[][]',
      'value[][][]',
      'value[][][][]',
      'value.value',
      'value.thread.value',
      'this.thread.value',
      'this.output.value',
      'this.constants.value',
      'this.constants.value[]',
      'this.constants.value[][]',
      'this.constants.value[][][]',
      'this.constants.value[][][][]',
      'fn()[]',
      'fn()[][]',
      'fn()[][][]',
      '[][]',
    ];
    if (allowedExpressions.indexOf(signatureString) > -1) {
      return signatureString;
    }
    return null;
  }

  build() {
    return this.toString().length > 0;
  }

  astGeneric(ast, retArr) {
    if (ast === null) {
      throw this.astErrorOutput('NULL ast', ast);
    } else {
      if (Array.isArray(ast)) {
        for (let i = 0; i < ast.length; i++) {
          this.astGeneric(ast[i], retArr);
        }
        return retArr;
      }

      switch (ast.type) {
        case 'FunctionDeclaration':
          return this.astFunctionDeclaration(ast, retArr);
        case 'FunctionExpression':
          return this.astFunctionExpression(ast, retArr);
        case 'ReturnStatement':
          return this.astReturnStatement(ast, retArr);
        case 'Literal':
          return this.astLiteral(ast, retArr);
        case 'BinaryExpression':
          return this.astBinaryExpression(ast, retArr);
        case 'Identifier':
          return this.astIdentifierExpression(ast, retArr);
        case 'AssignmentExpression':
          return this.astAssignmentExpression(ast, retArr);
        case 'ExpressionStatement':
          return this.astExpressionStatement(ast, retArr);
        case 'EmptyStatement':
          return this.astEmptyStatement(ast, retArr);
        case 'BlockStatement':
          return this.astBlockStatement(ast, retArr);
        case 'IfStatement':
          return this.astIfStatement(ast, retArr);
        case 'SwitchStatement':
          return this.astSwitchStatement(ast, retArr);
        case 'BreakStatement':
          return this.astBreakStatement(ast, retArr);
        case 'ContinueStatement':
          return this.astContinueStatement(ast, retArr);
        case 'ForStatement':
          return this.astForStatement(ast, retArr);
        case 'WhileStatement':
          return this.astWhileStatement(ast, retArr);
        case 'DoWhileStatement':
          return this.astDoWhileStatement(ast, retArr);
        case 'VariableDeclaration':
          return this.astVariableDeclaration(ast, retArr);
        case 'VariableDeclarator':
          return this.astVariableDeclarator(ast, retArr);
        case 'ThisExpression':
          return this.astThisExpression(ast, retArr);
        case 'SequenceExpression':
          return this.astSequenceExpression(ast, retArr);
        case 'UnaryExpression':
          return this.astUnaryExpression(ast, retArr);
        case 'UpdateExpression':
          return this.astUpdateExpression(ast, retArr);
        case 'LogicalExpression':
          return this.astLogicalExpression(ast, retArr);
        case 'MemberExpression':
          return this.astMemberExpression(ast, retArr);
        case 'CallExpression':
          return this.astCallExpression(ast, retArr);
        case 'ArrayExpression':
          return this.astArrayExpression(ast, retArr);
        case 'DebuggerStatement':
          return this.astDebuggerStatement(ast, retArr);
        case 'ConditionalExpression':
          return this.astConditionalExpression(ast, retArr);
      }

      throw this.astErrorOutput('Unknown ast type : ' + ast.type, ast);
    }
  }
  astErrorOutput(error, ast) {
    if (typeof this.source !== 'string') {
      return new Error(error);
    }

    const debugString = utils.getAstString(this.source, ast);
    const leadingSource = this.source.substr(ast.start);
    const splitLines = leadingSource.split(/\n/);
    const lineBefore = splitLines.length > 0 ? splitLines[splitLines.length - 1] : 0;
    return new Error(`${error} on line ${ splitLines.length }, position ${ lineBefore.length }:\n ${ debugString }`);
  }

  astDebuggerStatement(arrNode, retArr) {
    return retArr;
  }

  astConditionalExpression(ast, retArr) {
    if (ast.type !== 'ConditionalExpression') {
      throw this.astErrorOutput('Not a conditional expression', ast);
    }
    retArr.push('(');
    this.astGeneric(ast.test, retArr);
    retArr.push('?');
    this.astGeneric(ast.consequent, retArr);
    retArr.push(':');
    this.astGeneric(ast.alternate, retArr);
    retArr.push(')');
    return retArr;
  }

  astFunction(ast, retArr) {
    throw new Error(`"astFunction" not defined on ${ this.constructor.name }`);
  }

  astFunctionDeclaration(ast, retArr) {
    if (this.isChildFunction(ast)) {
      return retArr;
    }
    return this.astFunction(ast, retArr);
  }
  astFunctionExpression(ast, retArr) {
    if (this.isChildFunction(ast)) {
      return retArr;
    }
    return this.astFunction(ast, retArr);
  }
  isChildFunction(ast) {
    for (let i = 0; i < this.functions.length; i++) {
      if (this.functions[i] === ast) {
        return true;
      }
    }
    return false;
  }
  astReturnStatement(ast, retArr) {
    return retArr;
  }
  astLiteral(ast, retArr) {
    this.literalTypes[this.astKey(ast)] = 'Number';
    return retArr;
  }
  astBinaryExpression(ast, retArr) {
    return retArr;
  }
  astIdentifierExpression(ast, retArr) {
    return retArr;
  }
  astAssignmentExpression(ast, retArr) {
    return retArr;
  }
  astExpressionStatement(esNode, retArr) {
    this.astGeneric(esNode.expression, retArr);
    retArr.push(';');
    return retArr;
  }
  astEmptyStatement(eNode, retArr) {
    return retArr;
  }
  astBlockStatement(ast, retArr) {
    return retArr;
  }
  astIfStatement(ast, retArr) {
    return retArr;
  }
  astSwitchStatement(ast, retArr) {
    return retArr;
  }
  astBreakStatement(brNode, retArr) {
    retArr.push('break;');
    return retArr;
  }
  astContinueStatement(crNode, retArr) {
    retArr.push('continue;\n');
    return retArr;
  }
  astForStatement(ast, retArr) {
    return retArr;
  }
  astWhileStatement(ast, retArr) {
    return retArr;
  }
  astDoWhileStatement(ast, retArr) {
    return retArr;
  }
  astVariableDeclarator(iVarDecNode, retArr) {
    this.astGeneric(iVarDecNode.id, retArr);
    if (iVarDecNode.init !== null) {
      retArr.push('=');
      this.astGeneric(iVarDecNode.init, retArr);
    }
    return retArr;
  }
  astThisExpression(ast, retArr) {
    return retArr;
  }
  astSequenceExpression(sNode, retArr) {
    const { expressions } = sNode;
    const sequenceResult = [];
    for (let i = 0; i < expressions.length; i++) {
      const expression = expressions[i];
      const expressionResult = [];
      this.astGeneric(expression, expressionResult);
      sequenceResult.push(expressionResult.join(''));
    }
    if (sequenceResult.length > 1) {
      retArr.push('(', sequenceResult.join(','), ')');
    } else {
      retArr.push(sequenceResult[0]);
    }
    return retArr;
  }
  astUnaryExpression(uNode, retArr) {
    const unaryResult = this.checkAndUpconvertBitwiseUnary(uNode, retArr);
    if (unaryResult) {
      return retArr;
    }

    if (uNode.prefix) {
      retArr.push(uNode.operator);
      this.astGeneric(uNode.argument, retArr);
    } else {
      this.astGeneric(uNode.argument, retArr);
      retArr.push(uNode.operator);
    }

    return retArr;
  }

  checkAndUpconvertBitwiseUnary(uNode, retArr) {}

  astUpdateExpression(uNode, retArr) {
    if (uNode.prefix) {
      retArr.push(uNode.operator);
      this.astGeneric(uNode.argument, retArr);
    } else {
      this.astGeneric(uNode.argument, retArr);
      retArr.push(uNode.operator);
    }

    return retArr;
  }
  astLogicalExpression(logNode, retArr) {
    retArr.push('(');
    this.astGeneric(logNode.left, retArr);
    retArr.push(logNode.operator);
    this.astGeneric(logNode.right, retArr);
    retArr.push(')');
    return retArr;
  }
  astMemberExpression(ast, retArr) {
    return retArr;
  }
  astCallExpression(ast, retArr) {
    return retArr;
  }
  astArrayExpression(ast, retArr) {
    return retArr;
  }

  getMemberExpressionDetails(ast) {
    if (ast.type !== 'MemberExpression') {
      throw this.astErrorOutput(`Expression ${ ast.type } not a MemberExpression`, ast);
    }
    let name = null;
    let type = null;
    const variableSignature = this.getVariableSignature(ast);
    switch (variableSignature) {
      case 'value':
        return null;
      case 'value.thread.value':
      case 'this.thread.value':
      case 'this.output.value':
        return {
          signature: variableSignature,
            type: 'Integer',
            name: ast.property.name
        };
      case 'value[]':
        if (typeof ast.object.name !== 'string') {
          throw this.astErrorOutput('Unexpected expression', ast);
        }
        name = ast.object.name;
        return {
          name,
          origin: 'user',
            signature: variableSignature,
            type: this.getVariableType(ast.object),
            xProperty: ast.property
        };
      case 'value[][]':
        if (typeof ast.object.object.name !== 'string') {
          throw this.astErrorOutput('Unexpected expression', ast);
        }
        name = ast.object.object.name;
        return {
          name,
          origin: 'user',
            signature: variableSignature,
            type: this.getVariableType(ast.object.object),
            yProperty: ast.object.property,
            xProperty: ast.property,
        };
      case 'value[][][]':
        if (typeof ast.object.object.object.name !== 'string') {
          throw this.astErrorOutput('Unexpected expression', ast);
        }
        name = ast.object.object.object.name;
        return {
          name,
          origin: 'user',
            signature: variableSignature,
            type: this.getVariableType(ast.object.object.object),
            zProperty: ast.object.object.property,
            yProperty: ast.object.property,
            xProperty: ast.property,
        };
      case 'value[][][][]':
        if (typeof ast.object.object.object.object.name !== 'string') {
          throw this.astErrorOutput('Unexpected expression', ast);
        }
        name = ast.object.object.object.object.name;
        return {
          name,
          origin: 'user',
            signature: variableSignature,
            type: this.getVariableType(ast.object.object.object.object),
            zProperty: ast.object.object.property,
            yProperty: ast.object.property,
            xProperty: ast.property,
        };
      case 'value.value':
        if (typeof ast.property.name !== 'string') {
          throw this.astErrorOutput('Unexpected expression', ast);
        }
        if (this.isAstMathVariable(ast)) {
          name = ast.property.name;
          return {
            name,
            origin: 'Math',
            type: 'Number',
            signature: variableSignature,
          };
        }
        switch (ast.property.name) {
          case 'r':
          case 'g':
          case 'b':
          case 'a':
            name = ast.object.name;
            return {
              name,
              property: ast.property.name,
                origin: 'user',
                signature: variableSignature,
                type: 'Number'
            };
          default:
            throw this.astErrorOutput('Unexpected expression', ast);
        }
        case 'this.constants.value':
          if (typeof ast.property.name !== 'string') {
            throw this.astErrorOutput('Unexpected expression', ast);
          }
          name = ast.property.name;
          type = this.getConstantType(name);
          if (!type) {
            throw this.astErrorOutput('Constant has no type', ast);
          }
          return {
            name,
            type,
            origin: 'constants',
              signature: variableSignature,
          };
        case 'this.constants.value[]':
          if (typeof ast.object.property.name !== 'string') {
            throw this.astErrorOutput('Unexpected expression', ast);
          }
          name = ast.object.property.name;
          type = this.getConstantType(name);
          if (!type) {
            throw this.astErrorOutput('Constant has no type', ast);
          }
          return {
            name,
            type,
            origin: 'constants',
              signature: variableSignature,
              xProperty: ast.property,
          };
        case 'this.constants.value[][]': {
          if (typeof ast.object.object.property.name !== 'string') {
            throw this.astErrorOutput('Unexpected expression', ast);
          }
          name = ast.object.object.property.name;
          type = this.getConstantType(name);
          if (!type) {
            throw this.astErrorOutput('Constant has no type', ast);
          }
          return {
            name,
            type,
            origin: 'constants',
            signature: variableSignature,
            yProperty: ast.object.property,
            xProperty: ast.property,
          };
        }
        case 'this.constants.value[][][]': {
          if (typeof ast.object.object.object.property.name !== 'string') {
            throw this.astErrorOutput('Unexpected expression', ast);
          }
          name = ast.object.object.object.property.name;
          type = this.getConstantType(name);
          if (!type) {
            throw this.astErrorOutput('Constant has no type', ast);
          }
          return {
            name,
            type,
            origin: 'constants',
            signature: variableSignature,
            zProperty: ast.object.object.property,
            yProperty: ast.object.property,
            xProperty: ast.property,
          };
        }
        case 'fn()[]':
        case 'fn()[][]':
        case '[][]':
          return {
            signature: variableSignature,
              property: ast.property,
          };
        default:
          throw this.astErrorOutput('Unexpected expression', ast);
    }
  }

  findIdentifierOrigin(astToFind) {
    const stack = [this.ast];

    while (stack.length > 0) {
      const atNode = stack[0];
      if (atNode.type === 'VariableDeclarator' && atNode.id && atNode.id.name && atNode.id.name === astToFind.name) {
        return atNode;
      }
      stack.shift();
      if (atNode.argument) {
        stack.push(atNode.argument);
      } else if (atNode.body) {
        stack.push(atNode.body);
      } else if (atNode.declarations) {
        stack.push(atNode.declarations);
      } else if (Array.isArray(atNode)) {
        for (let i = 0; i < atNode.length; i++) {
          stack.push(atNode[i]);
        }
      }
    }
    return null;
  }

  findLastReturn(ast) {
    const stack = [ast || this.ast];

    while (stack.length > 0) {
      const atNode = stack.pop();
      if (atNode.type === 'ReturnStatement') {
        return atNode;
      }
      if (atNode.type === 'FunctionDeclaration') {
        continue;
      }
      if (atNode.argument) {
        stack.push(atNode.argument);
      } else if (atNode.body) {
        stack.push(atNode.body);
      } else if (atNode.declarations) {
        stack.push(atNode.declarations);
      } else if (Array.isArray(atNode)) {
        for (let i = 0; i < atNode.length; i++) {
          stack.push(atNode[i]);
        }
      } else if (atNode.consequent) {
        stack.push(atNode.consequent);
      } else if (atNode.cases) {
        stack.push(atNode.cases);
      }
    }
    return null;
  }

  getInternalVariableName(name) {
    if (!this._internalVariableNames.hasOwnProperty(name)) {
      this._internalVariableNames[name] = 0;
    }
    this._internalVariableNames[name]++;
    if (this._internalVariableNames[name] === 1) {
      return name;
    }
    return name + this._internalVariableNames[name];
  }

  astKey(ast, separator = ',') {
    if (!ast.start || !ast.end) throw new Error('AST start and end needed');
    return `${ast.start}${separator}${ast.end}`;
  }
}

const typeLookupMap = {
  'Number': 'Number',
  'Float': 'Float',
  'Integer': 'Integer',
  'Array': 'Number',
  'Array(2)': 'Number',
  'Array(3)': 'Number',
  'Array(4)': 'Number',
  'Matrix(2)': 'Number',
  'Matrix(3)': 'Number',
  'Matrix(4)': 'Number',
  'Array2D': 'Number',
  'Array3D': 'Number',
  'Input': 'Number',
  'HTMLCanvas': 'Array(4)',
  'OffscreenCanvas': 'Array(4)',
  'HTMLImage': 'Array(4)',
  'ImageBitmap': 'Array(4)',
  'ImageData': 'Array(4)',
  'HTMLVideo': 'Array(4)',
  'HTMLImageArray': 'Array(4)',
  'NumberTexture': 'Number',
  'MemoryOptimizedNumberTexture': 'Number',
  'Array1D(2)': 'Array(2)',
  'Array1D(3)': 'Array(3)',
  'Array1D(4)': 'Array(4)',
  'Array2D(2)': 'Array(2)',
  'Array2D(3)': 'Array(3)',
  'Array2D(4)': 'Array(4)',
  'Array3D(2)': 'Array(2)',
  'Array3D(3)': 'Array(3)',
  'Array3D(4)': 'Array(4)',
  'ArrayTexture(1)': 'Number',
  'ArrayTexture(2)': 'Array(2)',
  'ArrayTexture(3)': 'Array(3)',
  'ArrayTexture(4)': 'Array(4)',
};

module.exports = {
  FunctionNode
};
},{"../utils":114,"./function-tracer":11,"acorn":1}],11:[function(require,module,exports){
const { utils } = require('../utils');

function last(array) {
  return array.length > 0 ? array[array.length - 1] : null;
}

const states = {
  trackIdentifiers: 'trackIdentifiers',
  memberExpression: 'memberExpression',
  inForLoopInit: 'inForLoopInit'
};

class FunctionTracer {
  constructor(ast) {
    this.runningContexts = [];
    this.functionContexts = [];
    this.contexts = [];
    this.functionCalls = [];
    this.declarations = [];
    this.identifiers = [];
    this.functions = [];
    this.returnStatements = [];
    this.trackedIdentifiers = null;
    this.states = [];
    this.newFunctionContext();
    this.scan(ast);
  }

  isState(state) {
    return this.states[this.states.length - 1] === state;
  }

  hasState(state) {
    return this.states.indexOf(state) > -1;
  }

  pushState(state) {
    this.states.push(state);
  }

  popState(state) {
    if (this.isState(state)) {
      this.states.pop();
    } else {
      throw new Error(`Cannot pop the non-active state "${state}"`);
    }
  }

  get currentFunctionContext() {
    return last(this.functionContexts);
  }

  get currentContext() {
    return last(this.runningContexts);
  }

  newFunctionContext() {
    const newContext = { '@contextType': 'function' };
    this.contexts.push(newContext);
    this.functionContexts.push(newContext);
  }

  newContext(run) {
    const newContext = Object.assign({ '@contextType': 'const/let' }, this.currentContext);
    this.contexts.push(newContext);
    this.runningContexts.push(newContext);
    run();
    const { currentFunctionContext } = this;
    for (const p in currentFunctionContext) {
      if (!currentFunctionContext.hasOwnProperty(p) || newContext.hasOwnProperty(p)) continue;
      newContext[p] = currentFunctionContext[p];
    }
    this.runningContexts.pop();
    return newContext;
  }

  useFunctionContext(run) {
    const functionContext = last(this.functionContexts);
    this.runningContexts.push(functionContext);
    run();
    this.runningContexts.pop();
  }

  getIdentifiers(run) {
    const trackedIdentifiers = this.trackedIdentifiers = [];
    this.pushState(states.trackIdentifiers);
    run();
    this.trackedIdentifiers = null;
    this.popState(states.trackIdentifiers);
    return trackedIdentifiers;
  }

  getDeclaration(name) {
    const { currentContext, currentFunctionContext, runningContexts } = this;
    const declaration = currentContext[name] || currentFunctionContext[name] || null;

    if (
      !declaration &&
      currentContext === currentFunctionContext &&
      runningContexts.length > 0
    ) {
      const previousRunningContext = runningContexts[runningContexts.length - 2];
      if (previousRunningContext[name]) {
        return previousRunningContext[name];
      }
    }

    return declaration;
  }

  scan(ast) {
    if (!ast) return;
    if (Array.isArray(ast)) {
      for (let i = 0; i < ast.length; i++) {
        this.scan(ast[i]);
      }
      return;
    }
    switch (ast.type) {
      case 'Program':
        this.useFunctionContext(() => {
          this.scan(ast.body);
        });
        break;
      case 'BlockStatement':
        this.newContext(() => {
          this.scan(ast.body);
        });
        break;
      case 'AssignmentExpression':
      case 'LogicalExpression':
        this.scan(ast.left);
        this.scan(ast.right);
        break;
      case 'BinaryExpression':
        this.scan(ast.left);
        this.scan(ast.right);
        break;
      case 'UpdateExpression':
        if (ast.operator === '++') {
          const declaration = this.getDeclaration(ast.argument.name);
          if (declaration) {
            declaration.suggestedType = 'Integer';
          }
        }
        this.scan(ast.argument);
        break;
      case 'UnaryExpression':
        this.scan(ast.argument);
        break;
      case 'VariableDeclaration':
        if (ast.kind === 'var') {
          this.useFunctionContext(() => {
            ast.declarations = utils.normalizeDeclarations(ast);
            this.scan(ast.declarations);
          });
        } else {
          ast.declarations = utils.normalizeDeclarations(ast);
          this.scan(ast.declarations);
        }
        break;
      case 'VariableDeclarator': {
        const { currentContext } = this;
        const inForLoopInit = this.hasState(states.inForLoopInit);
        const declaration = {
          ast: ast,
          context: currentContext,
          name: ast.id.name,
          origin: 'declaration',
          inForLoopInit,
          inForLoopTest: null,
          assignable: currentContext === this.currentFunctionContext || (!inForLoopInit && !currentContext.hasOwnProperty(ast.id.name)),
          suggestedType: null,
          valueType: null,
          dependencies: null,
          isSafe: null,
        };
        if (!currentContext[ast.id.name]) {
          currentContext[ast.id.name] = declaration;
        }
        this.declarations.push(declaration);
        this.scan(ast.id);
        this.scan(ast.init);
        break;
      }
      case 'FunctionExpression':
      case 'FunctionDeclaration':
        if (this.runningContexts.length === 0) {
          this.scan(ast.body);
        } else {
          this.functions.push(ast);
        }
        break;
      case 'IfStatement':
        this.scan(ast.test);
        this.scan(ast.consequent);
        if (ast.alternate) this.scan(ast.alternate);
        break;
      case 'ForStatement': {
        let testIdentifiers;
        const context = this.newContext(() => {
          this.pushState(states.inForLoopInit);
          this.scan(ast.init);
          this.popState(states.inForLoopInit);

          testIdentifiers = this.getIdentifiers(() => {
            this.scan(ast.test);
          });

          this.scan(ast.update);
          this.newContext(() => {
            this.scan(ast.body);
          });
        });

        if (testIdentifiers) {
          for (const p in context) {
            if (p === '@contextType') continue;
            if (testIdentifiers.indexOf(p) > -1) {
              context[p].inForLoopTest = true;
            }
          }
        }
        break;
      }
      case 'DoWhileStatement':
      case 'WhileStatement':
        this.newContext(() => {
          this.scan(ast.body);
          this.scan(ast.test);
        });
        break;
      case 'Identifier': {
        if (this.isState(states.trackIdentifiers)) {
          this.trackedIdentifiers.push(ast.name);
        }
        this.identifiers.push({
          context: this.currentContext,
          declaration: this.getDeclaration(ast.name),
          ast,
        });
        break;
      }
      case 'ReturnStatement':
        this.returnStatements.push(ast);
        this.scan(ast.argument);
        break;
      case 'MemberExpression':
        this.pushState(states.memberExpression);
        this.scan(ast.object);
        this.scan(ast.property);
        this.popState(states.memberExpression);
        break;
      case 'ExpressionStatement':
        this.scan(ast.expression);
        break;
      case 'SequenceExpression':
        this.scan(ast.expressions);
        break;
      case 'CallExpression':
        this.functionCalls.push({
          context: this.currentContext,
          ast,
        });
        this.scan(ast.arguments);
        break;
      case 'ArrayExpression':
        this.scan(ast.elements);
        break;
      case 'ConditionalExpression':
        this.scan(ast.test);
        this.scan(ast.alternate);
        this.scan(ast.consequent);
        break;
      case 'SwitchStatement':
        this.scan(ast.discriminant);
        this.scan(ast.cases);
        break;
      case 'SwitchCase':
        this.scan(ast.test);
        this.scan(ast.consequent);
        break;

      case 'ThisExpression':
      case 'Literal':
      case 'DebuggerStatement':
      case 'EmptyStatement':
      case 'BreakStatement':
      case 'ContinueStatement':
        break;
      default:
        throw new Error(`unhandled type "${ast.type}"`);
    }
  }
}

module.exports = {
  FunctionTracer,
};
},{"../utils":114}],12:[function(require,module,exports){
const { glWiretap } = require('gl-wiretap');
const { utils } = require('../../utils');

function toStringWithoutUtils(fn) {
  return fn.toString()
    .replace('=>', '')
    .replace(/^function /, '')
    .replace(/utils[.]/g, '/*utils.*/');
}

function glKernelString(Kernel, args, originKernel, setupContextString, destroyContextString) {
  if (!originKernel.built) {
    originKernel.build.apply(originKernel, args);
  }
  args = args ? Array.from(args).map(arg => {
    switch (typeof arg) {
      case 'boolean':
        return new Boolean(arg);
      case 'number':
        return new Number(arg);
      default:
        return arg;
    }
  }) : null;
  const postResult = [];
  const context = glWiretap(originKernel.context, {
    useTrackablePrimitives: true,
    onReadPixels: (targetName) => {
      if (kernel.subKernels) {
        if (!subKernelsResultVariableSetup) {
          postResult.push(`    const result = { result: ${getRenderString(targetName, kernel)} };`);
          subKernelsResultVariableSetup = true;
        } else {
          const property = kernel.subKernels[subKernelsResultIndex++].property;
          postResult.push(`    result${isNaN(property) ? '.' + property : `[${property}]`} = ${getRenderString(targetName, kernel)};`);
        }
        if (subKernelsResultIndex === kernel.subKernels.length) {
          postResult.push('    return result;');
        }
        return;
      }
      if (targetName) {
        postResult.push(`    return ${getRenderString(targetName, kernel)};`);
      } else {
        postResult.push(`    return null;`);
      }
    },
    onUnrecognizedArgumentLookup: (argument) => {
      const argumentName = findKernelValue(argument, kernel.kernelArguments, [], context);
      if (argumentName) {
        return argumentName;
      }
      const constantName = findKernelValue(argument, kernel.kernelConstants, constants ? Object.keys(constants).map(key => constants[key]) : [], context);
      if (constantName) {
        return constantName;
      }
      return null;
    }
  });
  let subKernelsResultVariableSetup = false;
  let subKernelsResultIndex = 0;
  const {
    source,
    canvas,
    output,
    pipeline,
    graphical,
    loopMaxIterations,
    constants,
    optimizeFloatMemory,
    precision,
    fixIntegerDivisionAccuracy,
    functions,
    nativeFunctions,
    subKernels,
    immutable,
    argumentTypes,
    constantTypes,
    kernelArguments,
    kernelConstants,
    tactic,
  } = originKernel;
  const kernel = new Kernel(source, {
    canvas,
    context,
    checkContext: false,
    output,
    pipeline,
    graphical,
    loopMaxIterations,
    constants,
    optimizeFloatMemory,
    precision,
    fixIntegerDivisionAccuracy,
    functions,
    nativeFunctions,
    subKernels,
    immutable,
    argumentTypes,
    constantTypes,
    tactic,
  });
  let result = [];
  context.setIndent(2);
  kernel.build.apply(kernel, args);
  result.push(context.toString());
  context.reset();

  kernel.kernelArguments.forEach((kernelArgument, i) => {
    switch (kernelArgument.type) {
      case 'Integer':
      case 'Boolean':
      case 'Number':
      case 'Float':
      case 'Array':
      case 'Array(2)':
      case 'Array(3)':
      case 'Array(4)':
      case 'HTMLCanvas':
      case 'HTMLImage':
      case 'HTMLVideo':
        context.insertVariable(`uploadValue_${kernelArgument.name}`, kernelArgument.uploadValue);
        break;
      case 'HTMLImageArray':
        for (let imageIndex = 0; imageIndex < args[i].length; imageIndex++) {
          const arg = args[i];
          context.insertVariable(`uploadValue_${kernelArgument.name}[${imageIndex}]`, arg[imageIndex]);
        }
        break;
      case 'Input':
        context.insertVariable(`uploadValue_${kernelArgument.name}`, kernelArgument.uploadValue);
        break;
      case 'MemoryOptimizedNumberTexture':
      case 'NumberTexture':
      case 'Array1D(2)':
      case 'Array1D(3)':
      case 'Array1D(4)':
      case 'Array2D(2)':
      case 'Array2D(3)':
      case 'Array2D(4)':
      case 'Array3D(2)':
      case 'Array3D(3)':
      case 'Array3D(4)':
      case 'ArrayTexture(1)':
      case 'ArrayTexture(2)':
      case 'ArrayTexture(3)':
      case 'ArrayTexture(4)':
        context.insertVariable(`uploadValue_${kernelArgument.name}`, args[i].texture);
        break;
      default:
        throw new Error(`unhandled kernelArgumentType insertion for glWiretap of type ${kernelArgument.type}`);
    }
  });
  result.push('/** start of injected functions **/');
  result.push(`function ${toStringWithoutUtils(utils.flattenTo)}`);
  result.push(`function ${toStringWithoutUtils(utils.flatten2dArrayTo)}`);
  result.push(`function ${toStringWithoutUtils(utils.flatten3dArrayTo)}`);
  result.push(`function ${toStringWithoutUtils(utils.flatten4dArrayTo)}`);
  result.push(`function ${toStringWithoutUtils(utils.isArray)}`);
  if (kernel.renderOutput !== kernel.renderTexture && kernel.formatValues) {
    result.push(
      `  const renderOutput = function ${toStringWithoutUtils(kernel.formatValues)};`
    );
  }
  result.push('/** end of injected functions **/');
  result.push(`  const innerKernel = function (${kernel.kernelArguments.map(kernelArgument => kernelArgument.varName).join(', ')}) {`);
  context.setIndent(4);
  kernel.run.apply(kernel, args);
  if (kernel.renderKernels) {
    kernel.renderKernels();
  } else if (kernel.renderOutput) {
    kernel.renderOutput();
  }
  result.push('    /** start setup uploads for kernel values **/');
  kernel.kernelArguments.forEach(kernelArgument => {
    result.push('    ' + kernelArgument.getStringValueHandler().split('\n').join('\n    '));
  });
  result.push('    /** end setup uploads for kernel values **/');
  result.push(context.toString());
  if (kernel.renderOutput === kernel.renderTexture) {
    context.reset();
    const framebufferName = context.getContextVariableName(kernel.framebuffer);
    if (kernel.renderKernels) {
      const results = kernel.renderKernels();
      const textureName = context.getContextVariableName(kernel.texture.texture);
      result.push(`    return {
  result: {
    texture: ${ textureName },
    type: '${ results.result.type }',
    toArray: ${ getToArrayString(results.result, textureName, framebufferName) }
  },`);
      const { subKernels, mappedTextures } = kernel;
      for (let i = 0; i < subKernels.length; i++) {
        const texture = mappedTextures[i];
        const subKernel = subKernels[i];
        const subKernelResult = results[subKernel.property];
        const subKernelTextureName = context.getContextVariableName(texture.texture);
        result.push(`
  ${subKernel.property}: {
    texture: ${ subKernelTextureName },
    type: '${ subKernelResult.type }',
    toArray: ${ getToArrayString(subKernelResult, subKernelTextureName, framebufferName) }
  },`);
      }
      result.push(`    };`);
    } else {
      const rendered = kernel.renderOutput();
      const textureName = context.getContextVariableName(kernel.texture.texture);
      result.push(`    return {
    texture: ${ textureName },
    type: '${ rendered.type }',
    toArray: ${ getToArrayString(rendered, textureName, framebufferName) }
  };`);
    }
  }
  result.push(`    ${destroyContextString ? '\n' + destroyContextString + '    ': ''}`);
  result.push(postResult.join('\n'));
  result.push('  };');
  if (kernel.graphical) {
    result.push(getGetPixelsString(kernel));
    result.push(`  innerKernel.getPixels = getPixels;`);
  }
  result.push('  return innerKernel;');

  let constantsUpload = [];
  kernelConstants.forEach((kernelConstant) => {
    constantsUpload.push(`${kernelConstant.getStringValueHandler()}`);
  });
  return `function kernel(settings) {
const { context, constants } = settings;
${constantsUpload.join('')}
${setupContextString ? setupContextString : ''}
${result.join('\n')}
}`;
}

function getRenderString(targetName, kernel) {
  const readBackValue = kernel.precision === 'single' ? targetName : `new Float32Array(${targetName}.buffer)`;
  if (kernel.output[2]) {
    return `renderOutput(${readBackValue}, ${kernel.output[0]}, ${kernel.output[1]}, ${kernel.output[2]})`;
  }
  if (kernel.output[1]) {
    return `renderOutput(${readBackValue}, ${kernel.output[0]}, ${kernel.output[1]})`;
  }

  return `renderOutput(${readBackValue}, ${kernel.output[0]})`;
}

function getGetPixelsString(kernel) {
  const getPixels = kernel.getPixels.toString();
  const useFunctionKeyword = !/^function/.test(getPixels);
  return utils.flattenFunctionToString(`${useFunctionKeyword ? 'function ' : ''}${ getPixels }`, {
    findDependency: (object, name) => {
      if (object === 'utils') {
        return `const ${name} = ${utils[name].toString()};`;
      }
      return null;
    },
    thisLookup: (property) => {
      if (property === 'context') {
        return null;
      }
      if (kernel.hasOwnProperty(property)) {
        return JSON.stringify(kernel[property]);
      }
      throw new Error(`unhandled thisLookup ${ property }`);
    }
  });
}

function getToArrayString(kernelResult, textureName, framebufferName) {
  const toArray = kernelResult.toArray.toString();
  const useFunctionKeyword = !/^function/.test(toArray);
  const flattenedFunctions = utils.flattenFunctionToString(`${useFunctionKeyword ? 'function ' : ''}${ toArray }`, {
    findDependency: (object, name) => {
      if (object === 'utils') {
        return `const ${name} = ${utils[name].toString()};`;
      } else if (object === 'this') {
        if (name === 'framebuffer') {
          return '';
        }
        return `${useFunctionKeyword ? 'function ' : ''}${kernelResult[name].toString()}`;
      } else {
        throw new Error('unhandled fromObject');
      }
    },
    thisLookup: (property, isDeclaration) => {
      if (property === 'texture') {
        return textureName;
      }
      if (property === 'context') {
        if (isDeclaration) return null;
        return 'gl';
      }
      if (kernelResult.hasOwnProperty(property)) {
        return JSON.stringify(kernelResult[property]);
      }
      throw new Error(`unhandled thisLookup ${ property }`);
    }
  });
  return `() => {
function framebuffer() { return ${framebufferName}; };
${flattenedFunctions}
return toArray();
}`;
}

function findKernelValue(argument, kernelValues, values, context, uploadedValues) {
  if (argument === null) return null;
  if (kernelValues === null) return null;
  switch (typeof argument) {
    case 'boolean':
    case 'number':
      return null;
  }
  if (
    typeof HTMLImageElement !== 'undefined' &&
    argument instanceof HTMLImageElement
  ) {
    for (let i = 0; i < kernelValues.length; i++) {
      const kernelValue = kernelValues[i];
      if (kernelValue.type !== 'HTMLImageArray' && kernelValue) continue;
      if (kernelValue.uploadValue !== argument) continue;
      const variableIndex = values[i].indexOf(argument);
      if (variableIndex === -1) continue;
      const variableName = `uploadValue_${kernelValue.name}[${variableIndex}]`;
      context.insertVariable(variableName, argument);
      return variableName;
    }
  }

  for (let i = 0; i < kernelValues.length; i++) {
    const kernelValue = kernelValues[i];
    if (argument !== kernelValue.uploadValue) continue;
    const variable = `uploadValue_${kernelValue.name}`;
    context.insertVariable(variable, kernelValue);
    return variable;
  }
  return null;
}

module.exports = {
  glKernelString
};
},{"../../utils":114,"gl-wiretap":3}],13:[function(require,module,exports){
const { Kernel } = require('../kernel');
const { utils } = require('../../utils');
const { GLTextureArray2Float } = require('./texture/array-2-float');
const { GLTextureArray2Float2D } = require('./texture/array-2-float-2d');
const { GLTextureArray2Float3D } = require('./texture/array-2-float-3d');
const { GLTextureArray3Float } = require('./texture/array-3-float');
const { GLTextureArray3Float2D } = require('./texture/array-3-float-2d');
const { GLTextureArray3Float3D } = require('./texture/array-3-float-3d');
const { GLTextureArray4Float } = require('./texture/array-4-float');
const { GLTextureArray4Float2D } = require('./texture/array-4-float-2d');
const { GLTextureArray4Float3D } = require('./texture/array-4-float-3d');
const { GLTextureFloat } = require('./texture/float');
const { GLTextureFloat2D } = require('./texture/float-2d');
const { GLTextureFloat3D } = require('./texture/float-3d');
const { GLTextureMemoryOptimized } = require('./texture/memory-optimized');
const { GLTextureMemoryOptimized2D } = require('./texture/memory-optimized-2d');
const { GLTextureMemoryOptimized3D } = require('./texture/memory-optimized-3d');
const { GLTextureUnsigned } = require('./texture/unsigned');
const { GLTextureUnsigned2D } = require('./texture/unsigned-2d');
const { GLTextureUnsigned3D } = require('./texture/unsigned-3d');
const { GLTextureGraphical } = require('./texture/graphical');

class GLKernel extends Kernel {
  static get mode() {
    return 'gpu';
  }

  static getIsFloatRead() {
    const kernelString = `function kernelFunction() {
  return 1;
}`;
    const kernel = new this(kernelString, {
      context: this.testContext,
      canvas: this.testCanvas,
      validate: false,
      output: [1],
      precision: 'single',
      returnType: 'Number',
      tactic: 'speed',
    });
    kernel.build();
    kernel.run();
    const result = kernel.renderOutput();
    kernel.destroy(true);
    return result[0] === 1;
  }

  static getIsIntegerDivisionAccurate() {
    function kernelFunction(v1, v2) {
      return v1[this.thread.x] / v2[this.thread.x];
    }
    const kernel = new this(kernelFunction.toString(), {
      context: this.testContext,
      canvas: this.testCanvas,
      validate: false,
      output: [2],
      returnType: 'Number',
      precision: 'unsigned',
      tactic: 'speed',
    });
    const args = [
      [6, 6030401],
      [3, 3991]
    ];
    kernel.build.apply(kernel, args);
    kernel.run.apply(kernel, args);
    const result = kernel.renderOutput();
    kernel.destroy(true);
    return result[0] === 2 && result[1] === 1511;
  }

  static getIsSpeedTacticSupported() {
    function kernelFunction(value) {
      return value[this.thread.x];
    }
    const kernel = new this(kernelFunction.toString(), {
      context: this.testContext,
      canvas: this.testCanvas,
      validate: false,
      output: [4],
      returnType: 'Number',
      precision: 'unsigned',
      tactic: 'speed',
    });
    const args = [
      [0, 1, 2, 3]
    ];
    kernel.build.apply(kernel, args);
    kernel.run.apply(kernel, args);
    const result = kernel.renderOutput();
    kernel.destroy(true);
    return Math.round(result[0]) === 0 && Math.round(result[1]) === 1 && Math.round(result[2]) === 2 && Math.round(result[3]) === 3;
  }

  static get testCanvas() {
    throw new Error(`"testCanvas" not defined on ${ this.name }`);
  }

  static get testContext() {
    throw new Error(`"testContext" not defined on ${ this.name }`);
  }

  static getFeatures() {
    const gl = this.testContext;
    const isDrawBuffers = this.getIsDrawBuffers();
    return Object.freeze({
      isFloatRead: this.getIsFloatRead(),
      isIntegerDivisionAccurate: this.getIsIntegerDivisionAccurate(),
      isSpeedTacticSupported: this.getIsSpeedTacticSupported(),
      isTextureFloat: this.getIsTextureFloat(),
      isDrawBuffers,
      kernelMap: isDrawBuffers,
      channelCount: this.getChannelCount(),
      maxTextureSize: this.getMaxTextureSize(),
      lowIntPrecision: gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_INT),
      lowFloatPrecision: gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_FLOAT),
      mediumIntPrecision: gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_INT),
      mediumFloatPrecision: gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT),
      highIntPrecision: gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT),
      highFloatPrecision: gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT),
    });
  }

  static setupFeatureChecks() {
    throw new Error(`"setupFeatureChecks" not defined on ${ this.name }`);
  }

  static getSignature(kernel, argumentTypes) {
    return kernel.getVariablePrecisionString() + (argumentTypes.length > 0 ? ':' + argumentTypes.join(',') : '');
  }

  setFixIntegerDivisionAccuracy(fix) {
    this.fixIntegerDivisionAccuracy = fix;
    return this;
  }

  setPrecision(flag) {
    this.precision = flag;
    return this;
  }

  setFloatTextures(flag) {
    utils.warnDeprecated('method', 'setFloatTextures', 'setOptimizeFloatMemory');
    this.floatTextures = flag;
    return this;
  }

  static nativeFunctionArguments(source) {
    const argumentTypes = [];
    const argumentNames = [];
    const states = [];
    const isStartingVariableName = /^[a-zA-Z_]/;
    const isVariableChar = /[a-zA-Z_0-9]/;
    let i = 0;
    let argumentName = null;
    let argumentType = null;
    while (i < source.length) {
      const char = source[i];
      const nextChar = source[i + 1];
      const state = states.length > 0 ? states[states.length - 1] : null;

      if (state === 'FUNCTION_ARGUMENTS' && char === '/' && nextChar === '*') {
        states.push('MULTI_LINE_COMMENT');
        i += 2;
        continue;
      } else if (state === 'MULTI_LINE_COMMENT' && char === '*' && nextChar === '/') {
        states.pop();
        i += 2;
        continue;
      }

      else if (state === 'FUNCTION_ARGUMENTS' && char === '/' && nextChar === '/') {
        states.push('COMMENT');
        i += 2;
        continue;
      } else if (state === 'COMMENT' && char === '\n') {
        states.pop();
        i++;
        continue;
      }

      else if (state === null && char === '(') {
        states.push('FUNCTION_ARGUMENTS');
        i++;
        continue;
      } else if (state === 'FUNCTION_ARGUMENTS') {
        if (char === ')') {
          states.pop();
          break;
        }
        if (char === 'f' && nextChar === 'l' && source[i + 2] === 'o' && source[i + 3] === 'a' && source[i + 4] === 't' && source[i + 5] === ' ') {
          states.push('DECLARE_VARIABLE');
          argumentType = 'float';
          argumentName = '';
          i += 6;
          continue;
        } else if (char === 'i' && nextChar === 'n' && source[i + 2] === 't' && source[i + 3] === ' ') {
          states.push('DECLARE_VARIABLE');
          argumentType = 'int';
          argumentName = '';
          i += 4;
          continue;
        } else if (char === 'v' && nextChar === 'e' && source[i + 2] === 'c' && source[i + 3] === '2' && source[i + 4] === ' ') {
          states.push('DECLARE_VARIABLE');
          argumentType = 'vec2';
          argumentName = '';
          i += 5;
          continue;
        } else if (char === 'v' && nextChar === 'e' && source[i + 2] === 'c' && source[i + 3] === '3' && source[i + 4] === ' ') {
          states.push('DECLARE_VARIABLE');
          argumentType = 'vec3';
          argumentName = '';
          i += 5;
          continue;
        } else if (char === 'v' && nextChar === 'e' && source[i + 2] === 'c' && source[i + 3] === '4' && source[i + 4] === ' ') {
          states.push('DECLARE_VARIABLE');
          argumentType = 'vec4';
          argumentName = '';
          i += 5;
          continue;
        }
      }

      else if (state === 'DECLARE_VARIABLE') {
        if (argumentName === '') {
          if (char === ' ') {
            i++;
            continue;
          }
          if (!isStartingVariableName.test(char)) {
            throw new Error('variable name is not expected string');
          }
        }
        argumentName += char;
        if (!isVariableChar.test(nextChar)) {
          states.pop();
          argumentNames.push(argumentName);
          argumentTypes.push(typeMap[argumentType]);
        }
      }

      i++;
    }
    if (states.length > 0) {
      throw new Error('GLSL function was not parsable');
    }
    return {
      argumentNames,
      argumentTypes,
    };
  }

  static nativeFunctionReturnType(source) {
    return typeMap[source.match(/int|float|vec[2-4]/)[0]];
  }

  static combineKernels(combinedKernel, lastKernel) {
    combinedKernel.apply(null, arguments);
    const {
      texSize,
      context,
      threadDim
    } = lastKernel.texSize;
    let result;
    if (lastKernel.precision === 'single') {
      const w = texSize[0];
      const h = Math.ceil(texSize[1] / 4);
      result = new Float32Array(w * h * 4 * 4);
      context.readPixels(0, 0, w, h * 4, context.RGBA, context.FLOAT, result);
    } else {
      const bytes = new Uint8Array(texSize[0] * texSize[1] * 4);
      context.readPixels(0, 0, texSize[0], texSize[1], context.RGBA, context.UNSIGNED_BYTE, bytes);
      result = new Float32Array(bytes.buffer);
    }

    result = result.subarray(0, threadDim[0] * threadDim[1] * threadDim[2]);

    if (lastKernel.output.length === 1) {
      return result;
    } else if (lastKernel.output.length === 2) {
      return utils.splitArray(result, lastKernel.output[0]);
    } else if (lastKernel.output.length === 3) {
      const cube = utils.splitArray(result, lastKernel.output[0] * lastKernel.output[1]);
      return cube.map(function(x) {
        return utils.splitArray(x, lastKernel.output[0]);
      });
    }
  }

  constructor(source, settings) {
    super(source, settings);
    this.transferValues = null;
    this.formatValues = null;
    this.TextureConstructor = null;
    this.renderOutput = null;
    this.renderRawOutput = null;
    this.texSize = null;
    this.translatedSource = null;
    this.compiledFragmentShader = null;
    this.compiledVertexShader = null;
    this.switchingKernels = null;
    this._textureSwitched = null;
    this._mappedTextureSwitched = null;
  }

  checkTextureSize() {
    const { features } = this.constructor;
    if (this.texSize[0] > features.maxTextureSize || this.texSize[1] > features.maxTextureSize) {
      throw new Error(`Texture size [${this.texSize[0]},${this.texSize[1]}] generated by kernel is larger than supported size [${features.maxTextureSize},${features.maxTextureSize}]`);
    }
  }

  translateSource() {
    throw new Error(`"translateSource" not defined on ${this.constructor.name}`);
  }

  pickRenderStrategy(args) {
    if (this.graphical) {
      this.renderRawOutput = this.readPackedPixelsToUint8Array;
      this.transferValues = (pixels) => pixels;
      this.TextureConstructor = GLTextureGraphical;
      return null;
    }
    if (this.precision === 'unsigned') {
      this.renderRawOutput = this.readPackedPixelsToUint8Array;
      this.transferValues = this.readPackedPixelsToFloat32Array;
      if (this.pipeline) {
        this.renderOutput = this.renderTexture;
        if (this.subKernels !== null) {
          this.renderKernels = this.renderKernelsToTextures;
        }
        switch (this.returnType) {
          case 'LiteralInteger':
          case 'Float':
          case 'Number':
          case 'Integer':
            if (this.output[2] > 0) {
              this.TextureConstructor = GLTextureUnsigned3D;
              return null;
            } else if (this.output[1] > 0) {
              this.TextureConstructor = GLTextureUnsigned2D;
              return null;
            } else {
              this.TextureConstructor = GLTextureUnsigned;
              return null;
            }
            case 'Array(2)':
            case 'Array(3)':
            case 'Array(4)':
              return this.requestFallback(args);
        }
      } else {
        if (this.subKernels !== null) {
          this.renderKernels = this.renderKernelsToArrays;
        }
        switch (this.returnType) {
          case 'LiteralInteger':
          case 'Float':
          case 'Number':
          case 'Integer':
            this.renderOutput = this.renderValues;
            if (this.output[2] > 0) {
              this.TextureConstructor = GLTextureUnsigned3D;
              this.formatValues = utils.erect3DPackedFloat;
              return null;
            } else if (this.output[1] > 0) {
              this.TextureConstructor = GLTextureUnsigned2D;
              this.formatValues = utils.erect2DPackedFloat;
              return null;
            } else {
              this.TextureConstructor = GLTextureUnsigned;
              this.formatValues = utils.erectPackedFloat;
              return null;
            }
            case 'Array(2)':
            case 'Array(3)':
            case 'Array(4)':
              return this.requestFallback(args);
        }
      }
    } else if (this.precision === 'single') {
      this.renderRawOutput = this.readFloatPixelsToFloat32Array;
      this.transferValues = this.readFloatPixelsToFloat32Array;
      if (this.pipeline) {
        this.renderOutput = this.renderTexture;
        if (this.subKernels !== null) {
          this.renderKernels = this.renderKernelsToTextures;
        }
        switch (this.returnType) {
          case 'LiteralInteger':
          case 'Float':
          case 'Number':
          case 'Integer': {
            if (this.optimizeFloatMemory) {
              if (this.output[2] > 0) {
                this.TextureConstructor = GLTextureMemoryOptimized3D;
                return null;
              } else if (this.output[1] > 0) {
                this.TextureConstructor = GLTextureMemoryOptimized2D;
                return null;
              } else {
                this.TextureConstructor = GLTextureMemoryOptimized;
                return null;
              }
            } else {
              if (this.output[2] > 0) {
                this.TextureConstructor = GLTextureFloat3D;
                return null;
              } else if (this.output[1] > 0) {
                this.TextureConstructor = GLTextureFloat2D;
                return null;
              } else {
                this.TextureConstructor = GLTextureFloat;
                return null;
              }
            }
          }
          case 'Array(2)': {
            if (this.output[2] > 0) {
              this.TextureConstructor = GLTextureArray2Float3D;
              return null;
            } else if (this.output[1] > 0) {
              this.TextureConstructor = GLTextureArray2Float2D;
              return null;
            } else {
              this.TextureConstructor = GLTextureArray2Float;
              return null;
            }
          }
          case 'Array(3)': {
            if (this.output[2] > 0) {
              this.TextureConstructor = GLTextureArray3Float3D;
              return null;
            } else if (this.output[1] > 0) {
              this.TextureConstructor = GLTextureArray3Float2D;
              return null;
            } else {
              this.TextureConstructor = GLTextureArray3Float;
              return null;
            }
          }
          case 'Array(4)': {
            if (this.output[2] > 0) {
              this.TextureConstructor = GLTextureArray4Float3D;
              return null;
            } else if (this.output[1] > 0) {
              this.TextureConstructor = GLTextureArray4Float2D;
              return null;
            } else {
              this.TextureConstructor = GLTextureArray4Float;
              return null;
            }
          }
        }
      }
      this.renderOutput = this.renderValues;
      if (this.subKernels !== null) {
        this.renderKernels = this.renderKernelsToArrays;
      }
      if (this.optimizeFloatMemory) {
        switch (this.returnType) {
          case 'LiteralInteger':
          case 'Float':
          case 'Number':
          case 'Integer': {
            if (this.output[2] > 0) {
              this.TextureConstructor = GLTextureMemoryOptimized3D;
              this.formatValues = utils.erectMemoryOptimized3DFloat;
              return null;
            } else if (this.output[1] > 0) {
              this.TextureConstructor = GLTextureMemoryOptimized2D;
              this.formatValues = utils.erectMemoryOptimized2DFloat;
              return null;
            } else {
              this.TextureConstructor = GLTextureMemoryOptimized;
              this.formatValues = utils.erectMemoryOptimizedFloat;
              return null;
            }
          }
          case 'Array(2)': {
            if (this.output[2] > 0) {
              this.TextureConstructor = GLTextureArray2Float3D;
              this.formatValues = utils.erect3DArray2;
              return null;
            } else if (this.output[1] > 0) {
              this.TextureConstructor = GLTextureArray2Float2D;
              this.formatValues = utils.erect2DArray2;
              return null;
            } else {
              this.TextureConstructor = GLTextureArray2Float;
              this.formatValues = utils.erectArray2;
              return null;
            }
          }
          case 'Array(3)': {
            if (this.output[2] > 0) {
              this.TextureConstructor = GLTextureArray3Float3D;
              this.formatValues = utils.erect3DArray3;
              return null;
            } else if (this.output[1] > 0) {
              this.TextureConstructor = GLTextureArray3Float2D;
              this.formatValues = utils.erect2DArray3;
              return null;
            } else {
              this.TextureConstructor = GLTextureArray3Float;
              this.formatValues = utils.erectArray3;
              return null;
            }
          }
          case 'Array(4)': {
            if (this.output[2] > 0) {
              this.TextureConstructor = GLTextureArray4Float3D;
              this.formatValues = utils.erect3DArray4;
              return null;
            } else if (this.output[1] > 0) {
              this.TextureConstructor = GLTextureArray4Float2D;
              this.formatValues = utils.erect2DArray4;
              return null;
            } else {
              this.TextureConstructor = GLTextureArray4Float;
              this.formatValues = utils.erectArray4;
              return null;
            }
          }
        }
      } else {
        switch (this.returnType) {
          case 'LiteralInteger':
          case 'Float':
          case 'Number':
          case 'Integer': {
            if (this.output[2] > 0) {
              this.TextureConstructor = GLTextureFloat3D;
              this.formatValues = utils.erect3DFloat;
              return null;
            } else if (this.output[1] > 0) {
              this.TextureConstructor = GLTextureFloat2D;
              this.formatValues = utils.erect2DFloat;
              return null;
            } else {
              this.TextureConstructor = GLTextureFloat;
              this.formatValues = utils.erectFloat;
              return null;
            }
          }
          case 'Array(2)': {
            if (this.output[2] > 0) {
              this.TextureConstructor = GLTextureArray2Float3D;
              this.formatValues = utils.erect3DArray2;
              return null;
            } else if (this.output[1] > 0) {
              this.TextureConstructor = GLTextureArray2Float2D;
              this.formatValues = utils.erect2DArray2;
              return null;
            } else {
              this.TextureConstructor = GLTextureArray2Float;
              this.formatValues = utils.erectArray2;
              return null;
            }
          }
          case 'Array(3)': {
            if (this.output[2] > 0) {
              this.TextureConstructor = GLTextureArray3Float3D;
              this.formatValues = utils.erect3DArray3;
              return null;
            } else if (this.output[1] > 0) {
              this.TextureConstructor = GLTextureArray3Float2D;
              this.formatValues = utils.erect2DArray3;
              return null;
            } else {
              this.TextureConstructor = GLTextureArray3Float;
              this.formatValues = utils.erectArray3;
              return null;
            }
          }
          case 'Array(4)': {
            if (this.output[2] > 0) {
              this.TextureConstructor = GLTextureArray4Float3D;
              this.formatValues = utils.erect3DArray4;
              return null;
            } else if (this.output[1] > 0) {
              this.TextureConstructor = GLTextureArray4Float2D;
              this.formatValues = utils.erect2DArray4;
              return null;
            } else {
              this.TextureConstructor = GLTextureArray4Float;
              this.formatValues = utils.erectArray4;
              return null;
            }
          }
        }
      }
    } else {
      throw new Error(`unhandled precision of "${this.precision}"`);
    }

    throw new Error(`unhandled return type "${this.returnType}"`);
  }

  getKernelString() {
    throw new Error(`abstract method call`);
  }

  getMainResultTexture() {
    switch (this.returnType) {
      case 'LiteralInteger':
      case 'Float':
      case 'Integer':
      case 'Number':
        return this.getMainResultNumberTexture();
      case 'Array(2)':
        return this.getMainResultArray2Texture();
      case 'Array(3)':
        return this.getMainResultArray3Texture();
      case 'Array(4)':
        return this.getMainResultArray4Texture();
      default:
        throw new Error(`unhandled returnType type ${ this.returnType }`);
    }
  }

  getMainResultKernelNumberTexture() {
    throw new Error(`abstract method call`);
  }
  getMainResultSubKernelNumberTexture() {
    throw new Error(`abstract method call`);
  }
  getMainResultKernelArray2Texture() {
    throw new Error(`abstract method call`);
  }
  getMainResultSubKernelArray2Texture() {
    throw new Error(`abstract method call`);
  }
  getMainResultKernelArray3Texture() {
    throw new Error(`abstract method call`);
  }
  getMainResultSubKernelArray3Texture() {
    throw new Error(`abstract method call`);
  }
  getMainResultKernelArray4Texture() {
    throw new Error(`abstract method call`);
  }
  getMainResultSubKernelArray4Texture() {
    throw new Error(`abstract method call`);
  }
  getMainResultGraphical() {
    throw new Error(`abstract method call`);
  }
  getMainResultMemoryOptimizedFloats() {
    throw new Error(`abstract method call`);
  }
  getMainResultPackedPixels() {
    throw new Error(`abstract method call`);
  }

  getMainResultString() {
    if (this.graphical) {
      return this.getMainResultGraphical();
    } else if (this.precision === 'single') {
      if (this.optimizeFloatMemory) {
        return this.getMainResultMemoryOptimizedFloats();
      }
      return this.getMainResultTexture();
    } else {
      return this.getMainResultPackedPixels();
    }
  }

  getMainResultNumberTexture() {
    return utils.linesToString(this.getMainResultKernelNumberTexture()) +
      utils.linesToString(this.getMainResultSubKernelNumberTexture());
  }

  getMainResultArray2Texture() {
    return utils.linesToString(this.getMainResultKernelArray2Texture()) +
      utils.linesToString(this.getMainResultSubKernelArray2Texture());
  }

  getMainResultArray3Texture() {
    return utils.linesToString(this.getMainResultKernelArray3Texture()) +
      utils.linesToString(this.getMainResultSubKernelArray3Texture());
  }

  getMainResultArray4Texture() {
    return utils.linesToString(this.getMainResultKernelArray4Texture()) +
      utils.linesToString(this.getMainResultSubKernelArray4Texture());
  }

  getFloatTacticDeclaration() {
    const variablePrecision = this.getVariablePrecisionString(this.texSize, this.tactic);
    return `precision ${variablePrecision} float;\n`;
  }

  getIntTacticDeclaration() {
    return `precision ${this.getVariablePrecisionString(this.texSize, this.tactic, true)} int;\n`;
  }

  getSampler2DTacticDeclaration() {
    return `precision ${this.getVariablePrecisionString(this.texSize, this.tactic)} sampler2D;\n`;
  }

  getSampler2DArrayTacticDeclaration() {
    return `precision ${this.getVariablePrecisionString(this.texSize, this.tactic)} sampler2DArray;\n`;
  }

  renderTexture() {
    return this.immutable ? this.texture.clone() : this.texture;
  }
  readPackedPixelsToUint8Array() {
    if (this.precision !== 'unsigned') throw new Error('Requires this.precision to be "unsigned"');
    const {
      texSize,
      context: gl
    } = this;
    const result = new Uint8Array(texSize[0] * texSize[1] * 4);
    gl.readPixels(0, 0, texSize[0], texSize[1], gl.RGBA, gl.UNSIGNED_BYTE, result);
    return result;
  }

  readPackedPixelsToFloat32Array() {
    return new Float32Array(this.readPackedPixelsToUint8Array().buffer);
  }

  readFloatPixelsToFloat32Array() {
    if (this.precision !== 'single') throw new Error('Requires this.precision to be "single"');
    const {
      texSize,
      context: gl
    } = this;
    const w = texSize[0];
    const h = texSize[1];
    const result = new Float32Array(w * h * 4);
    gl.readPixels(0, 0, w, h, gl.RGBA, gl.FLOAT, result);
    return result;
  }

  getPixels(flip) {
    const {
      context: gl,
      output
    } = this;
    const [width, height] = output;
    const pixels = new Uint8Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    return new Uint8ClampedArray((flip ? pixels : utils.flipPixels(pixels, width, height)).buffer);
  }

  renderKernelsToArrays() {
    const result = {
      result: this.renderOutput(),
    };
    for (let i = 0; i < this.subKernels.length; i++) {
      result[this.subKernels[i].property] = this.mappedTextures[i].toArray();
    }
    return result;
  }

  renderKernelsToTextures() {
    const result = {
      result: this.renderOutput(),
    };
    if (this.immutable) {
      for (let i = 0; i < this.subKernels.length; i++) {
        result[this.subKernels[i].property] = this.mappedTextures[i].clone();
      }
    } else {
      for (let i = 0; i < this.subKernels.length; i++) {
        result[this.subKernels[i].property] = this.mappedTextures[i];
      }
    }
    return result;
  }

  resetSwitchingKernels() {
    const existingValue = this.switchingKernels;
    this.switchingKernels = null;
    return existingValue;
  }

  setOutput(output) {
    const newOutput = this.toKernelOutput(output);
    if (this.program) {
      if (!this.dynamicOutput) {
        throw new Error('Resizing a kernel with dynamicOutput: false is not possible');
      }
      const newThreadDim = [newOutput[0], newOutput[1] || 1, newOutput[2] || 1];
      const newTexSize = utils.getKernelTextureSize({
        optimizeFloatMemory: this.optimizeFloatMemory,
        precision: this.precision,
      }, newThreadDim);
      const oldTexSize = this.texSize;
      if (oldTexSize) {
        const oldPrecision = this.getVariablePrecisionString(oldTexSize, this.tactic);
        const newPrecision = this.getVariablePrecisionString(newTexSize, this.tactic);
        if (oldPrecision !== newPrecision) {
          if (this.debug) {
            console.warn('Precision requirement changed, asking GPU instance to recompile');
          }
          this.switchKernels({
            type: 'outputPrecisionMismatch',
            precision: newPrecision,
            needed: output
          });
          return;
        }
      }
      this.output = newOutput;
      this.threadDim = newThreadDim;
      this.texSize = newTexSize;
      const { context: gl } = this;
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
      this.updateMaxTexSize();
      this.framebuffer.width = this.texSize[0];
      this.framebuffer.height = this.texSize[1];
      gl.viewport(0, 0, this.maxTexSize[0], this.maxTexSize[1]);
      this.canvas.width = this.maxTexSize[0];
      this.canvas.height = this.maxTexSize[1];
      if (this.texture) {
        this.texture.delete();
      }
      this.texture = null;
      this._setupOutputTexture();
      if (this.mappedTextures && this.mappedTextures.length > 0) {
        for (let i = 0; i < this.mappedTextures.length; i++) {
          this.mappedTextures[i].delete();
        }
        this.mappedTextures = null;
        this._setupSubOutputTextures();
      }
    } else {
      this.output = newOutput;
    }
    return this;
  }
  renderValues() {
    return this.formatValues(
      this.transferValues(),
      this.output[0],
      this.output[1],
      this.output[2]
    );
  }
  switchKernels(reason) {
    if (this.switchingKernels) {
      this.switchingKernels.push(reason);
    } else {
      this.switchingKernels = [reason];
    }
  }
  getVariablePrecisionString(textureSize = this.texSize, tactic = this.tactic, isInt = false) {
    if (!tactic) {
      if (!this.constructor.features.isSpeedTacticSupported) return 'highp';
      const low = this.constructor.features[isInt ? 'lowIntPrecision' : 'lowFloatPrecision'];
      const medium = this.constructor.features[isInt ? 'mediumIntPrecision' : 'mediumFloatPrecision'];
      const high = this.constructor.features[isInt ? 'highIntPrecision' : 'highFloatPrecision'];
      const requiredSize = Math.log2(textureSize[0] * textureSize[1]);
      if (requiredSize <= low.rangeMax) {
        return 'lowp';
      } else if (requiredSize <= medium.rangeMax) {
        return 'mediump';
      } else if (requiredSize <= high.rangeMax) {
        return 'highp';
      } else {
        throw new Error(`The required size exceeds that of the ability of your system`);
      }
    }
    switch (tactic) {
      case 'speed':
        return 'lowp';
      case 'balanced':
        return 'mediump';
      case 'precision':
        return 'highp';
      default:
        throw new Error(`Unknown tactic "${tactic}" use "speed", "balanced", "precision", or empty for auto`);
    }
  }

  updateTextureArgumentRefs(kernelValue, arg) {
    if (!this.immutable) return;
    if (this.texture.texture === arg.texture) {
      const { prevArg } = kernelValue;
      if (prevArg) {
        if (prevArg.texture._refs === 1) {
          this.texture.delete();
          this.texture = prevArg.clone();
          this._textureSwitched = true;
        }
        prevArg.delete();
      }
      kernelValue.prevArg = arg.clone();
    } else if (this.mappedTextures && this.mappedTextures.length > 0) {
      const { mappedTextures } = this;
      for (let i = 0; i < mappedTextures.length; i++) {
        const mappedTexture = mappedTextures[i];
        if (mappedTexture.texture === arg.texture) {
          const { prevArg } = kernelValue;
          if (prevArg) {
            if (prevArg.texture._refs === 1) {
              mappedTexture.delete();
              mappedTextures[i] = prevArg.clone();
              this._mappedTextureSwitched[i] = true;
            }
            prevArg.delete();
          }
          kernelValue.prevArg = arg.clone();
          return;
        }
      }
    }
  }

  onActivate(previousKernel) {
    this._textureSwitched = true;
    this.texture = previousKernel.texture;
    if (this.mappedTextures) {
      for (let i = 0; i < this.mappedTextures.length; i++) {
        this._mappedTextureSwitched[i] = true;
      }
      this.mappedTextures = previousKernel.mappedTextures;
    }
  }

  initCanvas() {}
}

const typeMap = {
  int: 'Integer',
  float: 'Number',
  vec2: 'Array(2)',
  vec3: 'Array(3)',
  vec4: 'Array(4)',
};

module.exports = {
  GLKernel
};
},{"../../utils":114,"../kernel":36,"./texture/array-2-float":16,"./texture/array-2-float-2d":14,"./texture/array-2-float-3d":15,"./texture/array-3-float":19,"./texture/array-3-float-2d":17,"./texture/array-3-float-3d":18,"./texture/array-4-float":22,"./texture/array-4-float-2d":20,"./texture/array-4-float-3d":21,"./texture/float":25,"./texture/float-2d":23,"./texture/float-3d":24,"./texture/graphical":26,"./texture/memory-optimized":30,"./texture/memory-optimized-2d":28,"./texture/memory-optimized-3d":29,"./texture/unsigned":33,"./texture/unsigned-2d":31,"./texture/unsigned-3d":32}],14:[function(require,module,exports){
const { utils } = require('../../../utils');
const { GLTextureFloat } = require('./float');

class GLTextureArray2Float2D extends GLTextureFloat {
  constructor(settings) {
    super(settings);
    this.type = 'ArrayTexture(2)';
  }
  toArray() {
    return utils.erect2DArray2(this.renderValues(), this.output[0], this.output[1]);
  }
}

module.exports = {
  GLTextureArray2Float2D
};
},{"../../../utils":114,"./float":25}],15:[function(require,module,exports){
const { utils } = require('../../../utils');
const { GLTextureFloat } = require('./float');

class GLTextureArray2Float3D extends GLTextureFloat {
  constructor(settings) {
    super(settings);
    this.type = 'ArrayTexture(2)';
  }
  toArray() {
    return utils.erect3DArray2(this.renderValues(), this.output[0], this.output[1], this.output[2]);
  }
}

module.exports = {
  GLTextureArray2Float3D
};
},{"../../../utils":114,"./float":25}],16:[function(require,module,exports){
const { utils } = require('../../../utils');
const { GLTextureFloat } = require('./float');

class GLTextureArray2Float extends GLTextureFloat {
  constructor(settings) {
    super(settings);
    this.type = 'ArrayTexture(2)';
  }
  toArray() {
    return utils.erectArray2(this.renderValues(), this.output[0], this.output[1]);
  }
}

module.exports = {
  GLTextureArray2Float
};
},{"../../../utils":114,"./float":25}],17:[function(require,module,exports){
const { utils } = require('../../../utils');
const { GLTextureFloat } = require('./float');

class GLTextureArray3Float2D extends GLTextureFloat {
  constructor(settings) {
    super(settings);
    this.type = 'ArrayTexture(3)';
  }
  toArray() {
    return utils.erect2DArray3(this.renderValues(), this.output[0], this.output[1]);
  }
}

module.exports = {
  GLTextureArray3Float2D
};
},{"../../../utils":114,"./float":25}],18:[function(require,module,exports){
const { utils } = require('../../../utils');
const { GLTextureFloat } = require('./float');

class GLTextureArray3Float3D extends GLTextureFloat {
  constructor(settings) {
    super(settings);
    this.type = 'ArrayTexture(3)';
  }
  toArray() {
    return utils.erect3DArray3(this.renderValues(), this.output[0], this.output[1], this.output[2]);
  }
}

module.exports = {
  GLTextureArray3Float3D
};
},{"../../../utils":114,"./float":25}],19:[function(require,module,exports){
const { utils } = require('../../../utils');
const { GLTextureFloat } = require('./float');

class GLTextureArray3Float extends GLTextureFloat {
  constructor(settings) {
    super(settings);
    this.type = 'ArrayTexture(3)';
  }
  toArray() {
    return utils.erectArray3(this.renderValues(), this.output[0]);
  }
}

module.exports = {
  GLTextureArray3Float
};
},{"../../../utils":114,"./float":25}],20:[function(require,module,exports){
const { utils } = require('../../../utils');
const { GLTextureFloat } = require('./float');

class GLTextureArray4Float2D extends GLTextureFloat {
  constructor(settings) {
    super(settings);
    this.type = 'ArrayTexture(4)';
  }
  toArray() {
    return utils.erect2DArray4(this.renderValues(), this.output[0], this.output[1]);
  }
}

module.exports = {
  GLTextureArray4Float2D
};
},{"../../../utils":114,"./float":25}],21:[function(require,module,exports){
const { utils } = require('../../../utils');
const { GLTextureFloat } = require('./float');

class GLTextureArray4Float3D extends GLTextureFloat {
  constructor(settings) {
    super(settings);
    this.type = 'ArrayTexture(4)';
  }
  toArray() {
    return utils.erect3DArray4(this.renderValues(), this.output[0], this.output[1], this.output[2]);
  }
}

module.exports = {
  GLTextureArray4Float3D
};
},{"../../../utils":114,"./float":25}],22:[function(require,module,exports){
const { utils } = require('../../../utils');
const { GLTextureFloat } = require('./float');

class GLTextureArray4Float extends GLTextureFloat {
  constructor(settings) {
    super(settings);
    this.type = 'ArrayTexture(4)';
  }
  toArray() {
    return utils.erectArray4(this.renderValues(), this.output[0]);
  }
}

module.exports = {
  GLTextureArray4Float
};
},{"../../../utils":114,"./float":25}],23:[function(require,module,exports){
const { utils } = require('../../../utils');
const { GLTextureFloat } = require('./float');

class GLTextureFloat2D extends GLTextureFloat {
  constructor(settings) {
    super(settings);
    this.type = 'ArrayTexture(1)';
  }
  toArray() {
    return utils.erect2DFloat(this.renderValues(), this.output[0], this.output[1]);
  }
}

module.exports = {
  GLTextureFloat2D
};
},{"../../../utils":114,"./float":25}],24:[function(require,module,exports){
const { utils } = require('../../../utils');
const { GLTextureFloat } = require('./float');

class GLTextureFloat3D extends GLTextureFloat {
  constructor(settings) {
    super(settings);
    this.type = 'ArrayTexture(1)';
  }
  toArray() {
    return utils.erect3DFloat(this.renderValues(), this.output[0], this.output[1], this.output[2]);
  }
}

module.exports = {
  GLTextureFloat3D
};
},{"../../../utils":114,"./float":25}],25:[function(require,module,exports){
const { utils } = require('../../../utils');
const { GLTexture } = require('./index');

class GLTextureFloat extends GLTexture {
  get textureType() {
    return this.context.FLOAT;
  }
  constructor(settings) {
    super(settings);
    this.type = 'ArrayTexture(1)';
  }
  renderRawOutput() {
    const gl = this.context;
    const size = this.size;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer());
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      this.texture,
      0
    );
    const result = new Float32Array(size[0] * size[1] * 4);
    gl.readPixels(0, 0, size[0], size[1], gl.RGBA, gl.FLOAT, result);
    return result;
  }
  renderValues() {
    if (this._deleted) return null;
    return this.renderRawOutput();
  }
  toArray() {
    return utils.erectFloat(this.renderValues(), this.output[0]);
  }
}

module.exports = {
  GLTextureFloat
};
},{"../../../utils":114,"./index":27}],26:[function(require,module,exports){
const { GLTextureUnsigned } = require('./unsigned');

class GLTextureGraphical extends GLTextureUnsigned {
  constructor(settings) {
    super(settings);
    this.type = 'ArrayTexture(4)';
  }
  toArray() {
    return this.renderValues();
  }
}

module.exports = {
  GLTextureGraphical
};
},{"./unsigned":33}],27:[function(require,module,exports){
const { Texture } = require('../../../texture');

class GLTexture extends Texture {
  get textureType() {
    throw new Error(`"textureType" not implemented on ${ this.name }`);
  }

  clone() {
    return new this.constructor(this);
  }

  beforeMutate() {
    if (this.texture._refs > 1) {
      this.newTexture();
      return true;
    }
    return false;
  }

  cloneTexture() {
    this.texture._refs--;
    const { context: gl, size, texture, kernel } = this;
    if (kernel.debug) {
      console.warn('cloning internal texture');
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer());
    selectTexture(gl, texture);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    const target = gl.createTexture();
    selectTexture(gl, target);
    gl.texImage2D(gl.TEXTURE_2D, 0, this.internalFormat, size[0], size[1], 0, this.textureFormat, this.textureType, null);
    gl.copyTexSubImage2D(gl.TEXTURE_2D, 0, 0, 0, 0, 0, size[0], size[1]);
    target._refs = 1;
    this.texture = target;
  }

  newTexture() {
    this.texture._refs--;
    const gl = this.context;
    const size = this.size;
    const kernel = this.kernel;
    if (kernel.debug) {
      console.warn('new internal texture');
    }
    const target = gl.createTexture();
    selectTexture(gl, target);
    gl.texImage2D(gl.TEXTURE_2D, 0, this.internalFormat, size[0], size[1], 0, this.textureFormat, this.textureType, null);
    target._refs = 1;
    this.texture = target;
  }

  clear() {
    if (this.texture._refs) {
      this.texture._refs--;
      const gl = this.context;
      const target = this.texture = gl.createTexture();
      selectTexture(gl, target);
      const size = this.size;
      target._refs = 1;
      gl.texImage2D(gl.TEXTURE_2D, 0, this.internalFormat, size[0], size[1], 0, this.textureFormat, this.textureType, null);
    }
    const { context: gl, texture } = this;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer());
    gl.bindTexture(gl.TEXTURE_2D, texture);
    selectTexture(gl, texture);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  delete() {
    if (this._deleted) return;
    this._deleted = true;
    if (this.texture._refs) {
      this.texture._refs--;
      if (this.texture._refs) return;
    }
    this.context.deleteTexture(this.texture);
  }

  framebuffer() {
    if (!this._framebuffer) {
      this._framebuffer = this.kernel.getRawValueFramebuffer(this.size[0], this.size[1]);
    }
    return this._framebuffer;
  }
}

function selectTexture(gl, texture) {
  gl.activeTexture(gl.TEXTURE15);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
}

module.exports = { GLTexture };
},{"../../../texture":113}],28:[function(require,module,exports){
const { utils } = require('../../../utils');
const { GLTextureFloat } = require('./float');

class GLTextureMemoryOptimized2D extends GLTextureFloat {
  constructor(settings) {
    super(settings);
    this.type = 'MemoryOptimizedNumberTexture';
  }
  toArray() {
    return utils.erectMemoryOptimized2DFloat(this.renderValues(), this.output[0], this.output[1]);
  }
}

module.exports = {
  GLTextureMemoryOptimized2D
};
},{"../../../utils":114,"./float":25}],29:[function(require,module,exports){
const { utils } = require('../../../utils');
const { GLTextureFloat } = require('./float');

class GLTextureMemoryOptimized3D extends GLTextureFloat {
  constructor(settings) {
    super(settings);
    this.type = 'MemoryOptimizedNumberTexture';
  }
  toArray() {
    return utils.erectMemoryOptimized3DFloat(this.renderValues(), this.output[0], this.output[1], this.output[2]);
  }
}

module.exports = {
  GLTextureMemoryOptimized3D
};
},{"../../../utils":114,"./float":25}],30:[function(require,module,exports){
const { utils } = require('../../../utils');
const { GLTextureFloat } = require('./float');

class GLTextureMemoryOptimized extends GLTextureFloat {
  constructor(settings) {
    super(settings);
    this.type = 'MemoryOptimizedNumberTexture';
  }
  toArray() {
    return utils.erectMemoryOptimizedFloat(this.renderValues(), this.output[0]);
  }
}

module.exports = {
  GLTextureMemoryOptimized
};
},{"../../../utils":114,"./float":25}],31:[function(require,module,exports){
const { utils } = require('../../../utils');
const { GLTextureUnsigned } = require('./unsigned');

class GLTextureUnsigned2D extends GLTextureUnsigned {
  constructor(settings) {
    super(settings);
    this.type = 'NumberTexture';
  }
  toArray() {
    return utils.erect2DPackedFloat(this.renderValues(), this.output[0], this.output[1]);
  }
}

module.exports = {
  GLTextureUnsigned2D
};
},{"../../../utils":114,"./unsigned":33}],32:[function(require,module,exports){
const { utils } = require('../../../utils');
const { GLTextureUnsigned } = require('./unsigned');

class GLTextureUnsigned3D extends GLTextureUnsigned {
  constructor(settings) {
    super(settings);
    this.type = 'NumberTexture';
  }
  toArray() {
    return utils.erect3DPackedFloat(this.renderValues(), this.output[0], this.output[1], this.output[2]);
  }
}

module.exports = {
  GLTextureUnsigned3D
};
},{"../../../utils":114,"./unsigned":33}],33:[function(require,module,exports){
const { utils } = require('../../../utils');
const { GLTexture } = require('./index');

class GLTextureUnsigned extends GLTexture {
  get textureType() {
    return this.context.UNSIGNED_BYTE;
  }
  constructor(settings) {
    super(settings);
    this.type = 'NumberTexture';
  }
  renderRawOutput() {
    const { context: gl } = this;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer());
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      this.texture,
      0
    );
    const result = new Uint8Array(this.size[0] * this.size[1] * 4);
    gl.readPixels(0, 0, this.size[0], this.size[1], gl.RGBA, gl.UNSIGNED_BYTE, result);
    return result;
  }
  renderValues() {
    if (this._deleted) return null;
    return new Float32Array(this.renderRawOutput().buffer);
  }
  toArray() {
    return utils.erectPackedFloat(this.renderValues(), this.output[0]);
  }
}

module.exports = {
  GLTextureUnsigned
};
},{"../../../utils":114,"./index":27}],34:[function(require,module,exports){
const getContext = require('gl');
const { WebGLKernel } = require('../web-gl/kernel');
const { glKernelString } = require('../gl/kernel-string');

let isSupported = null;
let testCanvas = null;
let testContext = null;
let testExtensions = null;
let features = null;

class HeadlessGLKernel extends WebGLKernel {
  static get isSupported() {
    if (isSupported !== null) return isSupported;
    this.setupFeatureChecks();
    isSupported = testContext !== null;
    return isSupported;
  }

  static setupFeatureChecks() {
    testCanvas = null;
    testExtensions = null;
    if (typeof getContext !== 'function') return;
    try { 
      testContext = getContext(2, 2, {
        preserveDrawingBuffer: true
      });
      if (!testContext || !testContext.getExtension) return;
      testExtensions = {
        STACKGL_resize_drawingbuffer: testContext.getExtension('STACKGL_resize_drawingbuffer'),
        STACKGL_destroy_context: testContext.getExtension('STACKGL_destroy_context'),
        OES_texture_float: testContext.getExtension('OES_texture_float'),
        OES_texture_float_linear: testContext.getExtension('OES_texture_float_linear'),
        OES_element_index_uint: testContext.getExtension('OES_element_index_uint'),
        WEBGL_draw_buffers: testContext.getExtension('WEBGL_draw_buffers'),
        WEBGL_color_buffer_float: testContext.getExtension('WEBGL_color_buffer_float'),
      };
      features = this.getFeatures();
    } catch (e) {
      console.warn(e);
    }
  }

  static isContextMatch(context) {
    try {
      return context.getParameter(context.RENDERER) === 'ANGLE';
    } catch (e) {
      return false;
    }
  }

  static getIsTextureFloat() {
    return Boolean(testExtensions.OES_texture_float);
  }

  static getIsDrawBuffers() {
    return Boolean(testExtensions.WEBGL_draw_buffers);
  }

  static getChannelCount() {
    return testExtensions.WEBGL_draw_buffers ?
      testContext.getParameter(testExtensions.WEBGL_draw_buffers.MAX_DRAW_BUFFERS_WEBGL) :
      1;
  }

  static getMaxTextureSize() {
    return testContext.getParameter(testContext.MAX_TEXTURE_SIZE);
  }

  static get testCanvas() {
    return testCanvas;
  }

  static get testContext() {
    return testContext;
  }

  static get features() {
    return features;
  }

  initCanvas() {
    return {};
  }

  initContext() {
    return getContext(2, 2, {
      preserveDrawingBuffer: true
    });
  }

  initExtensions() {
    this.extensions = {
      STACKGL_resize_drawingbuffer: this.context.getExtension('STACKGL_resize_drawingbuffer'),
      STACKGL_destroy_context: this.context.getExtension('STACKGL_destroy_context'),
      OES_texture_float: this.context.getExtension('OES_texture_float'),
      OES_texture_float_linear: this.context.getExtension('OES_texture_float_linear'),
      OES_element_index_uint: this.context.getExtension('OES_element_index_uint'),
      WEBGL_draw_buffers: this.context.getExtension('WEBGL_draw_buffers'),
    };
  }

  build() {
    super.build.apply(this, arguments);
    if (!this.fallbackRequested) {
      this.extensions.STACKGL_resize_drawingbuffer.resize(this.maxTexSize[0], this.maxTexSize[1]);
    }
  }

  destroyExtensions() {
    this.extensions.STACKGL_resize_drawingbuffer = null;
    this.extensions.STACKGL_destroy_context = null;
    this.extensions.OES_texture_float = null;
    this.extensions.OES_texture_float_linear = null;
    this.extensions.OES_element_index_uint = null;
    this.extensions.WEBGL_draw_buffers = null;
  }

  static destroyContext(context) {
    const extension = context.getExtension('STACKGL_destroy_context');
    if (extension && extension.destroy) {
      extension.destroy();
    }
  }

  toString() {
    const setupContextString = `const gl = context || require('gl')(1, 1);\n`;
    const destroyContextString = `    if (!context) { gl.getExtension('STACKGL_destroy_context').destroy(); }\n`;
    return glKernelString(this.constructor, arguments, this, setupContextString, destroyContextString);
  }

  setOutput(output) {
    super.setOutput(output);
    if (this.graphical && this.extensions.STACKGL_resize_drawingbuffer) {
      this.extensions.STACKGL_resize_drawingbuffer.resize(this.maxTexSize[0], this.maxTexSize[1]);
    }
    return this;
  }
}

module.exports = {
  HeadlessGLKernel
};
},{"../gl/kernel-string":12,"../web-gl/kernel":70,"gl":2}],35:[function(require,module,exports){
class KernelValue {
  constructor(value, settings) {
    const {
      name,
      kernel,
      context,
      checkContext,
      onRequestContextHandle,
      onUpdateValueMismatch,
      origin,
      strictIntegers,
      type,
      tactic,
    } = settings;
    if (!name) {
      throw new Error('name not set');
    }
    if (!type) {
      throw new Error('type not set');
    }
    if (!origin) {
      throw new Error('origin not set');
    }
    if (origin !== 'user' && origin !== 'constants') {
      throw new Error(`origin must be "user" or "constants" value is "${ origin }"`);
    }
    if (!onRequestContextHandle) {
      throw new Error('onRequestContextHandle is not set');
    }
    this.name = name;
    this.origin = origin;
    this.tactic = tactic;
    this.varName = origin === 'constants' ? `constants.${name}` : name;
    this.kernel = kernel;
    this.strictIntegers = strictIntegers;
    this.type = value.type || type;
    this.size = value.size || null;
    this.index = null;
    this.context = context;
    this.checkContext = checkContext !== null && checkContext !== undefined ? checkContext : true;
    this.contextHandle = null;
    this.onRequestContextHandle = onRequestContextHandle;
    this.onUpdateValueMismatch = onUpdateValueMismatch;
    this.forceUploadEachRun = null;
  }

  get id() {
    return `${this.origin}_${name}`;
  }

  getSource() {
    throw new Error(`"getSource" not defined on ${ this.constructor.name }`);
  }

  updateValue(value) {
    throw new Error(`"updateValue" not defined on ${ this.constructor.name }`);
  }
}

module.exports = {
  KernelValue
};
},{}],36:[function(require,module,exports){
const { utils } = require('../utils');
const { Input } = require('../input');

class Kernel {
  static get isSupported() {
    throw new Error(`"isSupported" not implemented on ${ this.name }`);
  }

  static isContextMatch(context) {
    throw new Error(`"isContextMatch" not implemented on ${ this.name }`);
  }

  static getFeatures() {
    throw new Error(`"getFeatures" not implemented on ${ this.name }`);
  }

  static destroyContext(context) {
    throw new Error(`"destroyContext" called on ${ this.name }`);
  }

  static nativeFunctionArguments() {
    throw new Error(`"nativeFunctionArguments" called on ${ this.name }`);
  }

  static nativeFunctionReturnType() {
    throw new Error(`"nativeFunctionReturnType" called on ${ this.name }`);
  }

  static combineKernels() {
    throw new Error(`"combineKernels" called on ${ this.name }`);
  }

  constructor(source, settings) {
    if (typeof source !== 'object') {
      if (typeof source !== 'string') {
        throw new Error('source not a string');
      }
      if (!utils.isFunctionString(source)) {
        throw new Error('source not a function string');
      }
    }
    this.useLegacyEncoder = false;
    this.fallbackRequested = false;
    this.onRequestFallback = null;

    this.argumentNames = typeof source === 'string' ? utils.getArgumentNamesFromString(source) : null;
    this.argumentTypes = null;
    this.argumentSizes = null;
    this.argumentBitRatios = null;
    this.kernelArguments = null;
    this.kernelConstants = null;
    this.forceUploadKernelConstants = null;


    this.source = source;

    this.output = null;

    this.debug = false;

    this.graphical = false;

    this.loopMaxIterations = 0;

    this.constants = null;

    this.constantTypes = null;

    this.constantBitRatios = null;

    this.dynamicArguments = false;

    this.dynamicOutput = false;

    this.canvas = null;

    this.context = null;

    this.checkContext = null;

    this.gpu = null;

    this.functions = null;

    this.nativeFunctions = null;

    this.injectedNative = null;

    this.subKernels = null;

    this.validate = true;

    this.immutable = false;

    this.pipeline = false;

    this.precision = null;

    this.tactic = null;

    this.plugins = null;

    this.returnType = null;
    this.leadingReturnStatement = null;
    this.followingReturnStatement = null;
    this.optimizeFloatMemory = null;
    this.strictIntegers = false;
    this.fixIntegerDivisionAccuracy = null;
    this.built = false;
    this.signature = null;
  }

  mergeSettings(settings) {
    for (let p in settings) {
      if (!settings.hasOwnProperty(p) || !this.hasOwnProperty(p)) continue;
      switch (p) {
        case 'output':
          if (!Array.isArray(settings.output)) {
            this.setOutput(settings.output); 
            continue;
          }
          break;
        case 'functions':
          this.functions = [];
          for (let i = 0; i < settings.functions.length; i++) {
            this.addFunction(settings.functions[i]);
          }
          continue;
        case 'graphical':
          if (settings[p] && !settings.hasOwnProperty('precision')) {
            this.precision = 'unsigned';
          }
          this[p] = settings[p];
          continue;
        case 'nativeFunctions':
          if (!settings.nativeFunctions) continue;
          this.nativeFunctions = [];
          for (let i = 0; i < settings.nativeFunctions.length; i++) {
            const s = settings.nativeFunctions[i];
            const { name, source } = s;
            this.addNativeFunction(name, source, s);
          }
          continue;
      }
      this[p] = settings[p];
    }

    if (!this.canvas) this.canvas = this.initCanvas();
    if (!this.context) this.context = this.initContext();
    if (!this.plugins) this.plugins = this.initPlugins(settings);
  }
  build() {
    throw new Error(`"build" not defined on ${ this.constructor.name }`);
  }

  run() {
    throw new Error(`"run" not defined on ${ this.constructor.name }`)
  }

  initCanvas() {
    throw new Error(`"initCanvas" not defined on ${ this.constructor.name }`);
  }

  initContext() {
    throw new Error(`"initContext" not defined on ${ this.constructor.name }`);
  }

  initPlugins(settings) {
    throw new Error(`"initPlugins" not defined on ${ this.constructor.name }`);
  }

  addFunction(source, settings = {}) {
    if (source.name && source.source && source.argumentTypes && 'returnType' in source) {
      this.functions.push(source);
    } else if ('settings' in source && 'source' in source) {
      this.functions.push(this.functionToIGPUFunction(source.source, source.settings));
    } else if (typeof source === 'string' || typeof source === 'function') {
      this.functions.push(this.functionToIGPUFunction(source, settings));
    } else {
      throw new Error(`function not properly defined`);
    }
    return this;
  }

  addNativeFunction(name, source, settings = {}) {
    const { argumentTypes, argumentNames } = settings.argumentTypes ?
      splitArgumentTypes(settings.argumentTypes) :
      this.constructor.nativeFunctionArguments(source) || {};
    this.nativeFunctions.push({
      name,
      source,
      settings,
      argumentTypes,
      argumentNames,
      returnType: settings.returnType || this.constructor.nativeFunctionReturnType(source)
    });
    return this;
  }

  setupArguments(args) {
    this.kernelArguments = [];
    if (!this.argumentTypes) {
      if (!this.argumentTypes) {
        this.argumentTypes = [];
        for (let i = 0; i < args.length; i++) {
          const argType = utils.getVariableType(args[i], this.strictIntegers);
          const type = argType === 'Integer' ? 'Number' : argType;
          this.argumentTypes.push(type);
          this.kernelArguments.push({
            type
          });
        }
      }
    } else {
      for (let i = 0; i < this.argumentTypes.length; i++) {
        this.kernelArguments.push({
          type: this.argumentTypes[i]
        });
      }
    }

    this.argumentSizes = new Array(args.length);
    this.argumentBitRatios = new Int32Array(args.length);

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      this.argumentSizes[i] = arg.constructor === Input ? arg.size : null;
      this.argumentBitRatios[i] = this.getBitRatio(arg);
    }

    if (this.argumentNames.length !== args.length) {
      throw new Error(`arguments are miss-aligned`);
    }
  }

  setupConstants() {
    this.kernelConstants = [];
    let needsConstantTypes = this.constantTypes === null;
    if (needsConstantTypes) {
      this.constantTypes = {};
    }
    this.constantBitRatios = {};
    if (this.constants) {
      for (let name in this.constants) {
        if (needsConstantTypes) {
          const type = utils.getVariableType(this.constants[name], this.strictIntegers);
          this.constantTypes[name] = type;
          this.kernelConstants.push({
            name,
            type
          });
        } else {
          this.kernelConstants.push({
            name,
            type: this.constantTypes[name]
          });
        }
        this.constantBitRatios[name] = this.getBitRatio(this.constants[name]);
      }
    }
  }

  setOptimizeFloatMemory(flag) {
    this.optimizeFloatMemory = flag;
    return this;
  }

  toKernelOutput(output) {
    if (output.hasOwnProperty('x')) {
      if (output.hasOwnProperty('y')) {
        if (output.hasOwnProperty('z')) {
          return [output.x, output.y, output.z];
        } else {
          return [output.x, output.y];
        }
      } else {
        return [output.x];
      }
    } else {
      return output;
    }
  }

  setOutput(output) {
    this.output = this.toKernelOutput(output);
    return this;
  }

  setDebug(flag) {
    this.debug = flag;
    return this;
  }

  setGraphical(flag) {
    this.graphical = flag;
    this.precision = 'unsigned';
    return this;
  }

  setLoopMaxIterations(max) {
    this.loopMaxIterations = max;
    return this;
  }

  setConstants(constants) {
    this.constants = constants;
    return this;
  }

  setConstantTypes(constantTypes) {
    this.constantTypes = constantTypes;
    return this;
  }

  setFunctions(functions) {
    for (let i = 0; i < functions.length; i++) {
      this.addFunction(functions[i]);
    }
    return this;
  }

  setNativeFunctions(nativeFunctions) {
    for (let i = 0; i < nativeFunctions.length; i++) {
      const settings = nativeFunctions[i];
      const { name, source } = settings;
      this.addNativeFunction(name, source, settings);
    }
    return this;
  }

  setInjectedNative(injectedNative) {
    this.injectedNative = injectedNative;
    return this;
  }

  setPipeline(flag) {
    this.pipeline = flag;
    return this;
  }

  setPrecision(flag) {
    this.precision = flag;
    return this;
  }

  setDimensions(flag) {
    utils.warnDeprecated('method', 'setDimensions', 'setOutput');
    this.output = flag;
    return this;
  }

  setOutputToTexture(flag) {
    utils.warnDeprecated('method', 'setOutputToTexture', 'setPipeline');
    this.pipeline = flag;
    return this;
  }

  setImmutable(flag) {
    this.immutable = flag;
    return this;
  }

  setCanvas(canvas) {
    this.canvas = canvas;
    return this;
  }

  setStrictIntegers(flag) {
    this.strictIntegers = flag;
    return this;
  }

  setDynamicOutput(flag) {
    this.dynamicOutput = flag;
    return this;
  }

  setHardcodeConstants(flag) {
    utils.warnDeprecated('method', 'setHardcodeConstants');
    this.setDynamicOutput(flag);
    this.setDynamicArguments(flag);
    return this;
  }

  setDynamicArguments(flag) {
    this.dynamicArguments = flag;
    return this;
  }

  setUseLegacyEncoder(flag) {
    this.useLegacyEncoder = flag;
    return this;
  }

  setWarnVarUsage(flag) {
    utils.warnDeprecated('method', 'setWarnVarUsage');
    return this;
  }

  getCanvas() {
    utils.warnDeprecated('method', 'getCanvas');
    return this.canvas;
  }

  getWebGl() {
    utils.warnDeprecated('method', 'getWebGl');
    return this.context;
  }

  setContext(context) {
    this.context = context;
    return this;
  }

  setArgumentTypes(argumentTypes) {
    if (Array.isArray(argumentTypes)) {
      this.argumentTypes = argumentTypes;
    } else {
      this.argumentTypes = [];
      for (const p in argumentTypes) {
        if (!argumentTypes.hasOwnProperty(p)) continue;
        const argumentIndex = this.argumentNames.indexOf(p);
        if (argumentIndex === -1) throw new Error(`unable to find argument ${ p }`);
        this.argumentTypes[argumentIndex] = argumentTypes[p];
      }
    }
    return this;
  }

  setTactic(tactic) {
    this.tactic = tactic;
    return this;
  }

  requestFallback(args) {
    if (!this.onRequestFallback) {
      throw new Error(`"onRequestFallback" not defined on ${ this.constructor.name }`);
    }
    this.fallbackRequested = true;
    return this.onRequestFallback(args);
  }

  validateSettings() {
    throw new Error(`"validateSettings" not defined on ${ this.constructor.name }`);
  }

  addSubKernel(subKernel) {
    if (this.subKernels === null) {
      this.subKernels = [];
    }
    if (!subKernel.source) throw new Error('subKernel missing "source" property');
    if (!subKernel.property && isNaN(subKernel.property)) throw new Error('subKernel missing "property" property');
    if (!subKernel.name) throw new Error('subKernel missing "name" property');
    this.subKernels.push(subKernel);
    return this;
  }

  destroy(removeCanvasReferences) {
    throw new Error(`"destroy" called on ${ this.constructor.name }`);
  }

  getBitRatio(value) {
    if (this.precision === 'single') {
      return 4;
    } else if (Array.isArray(value[0])) {
      return this.getBitRatio(value[0]);
    } else if (value.constructor === Input) {
      return this.getBitRatio(value.value);
    }
    switch (value.constructor) {
      case Uint8ClampedArray:
      case Uint8Array:
      case Int8Array:
        return 1;
      case Uint16Array:
      case Int16Array:
        return 2;
      case Float32Array:
      case Int32Array:
      default:
        return 4;
    }
  }

  getPixels(flip) {
    throw new Error(`"getPixels" called on ${ this.constructor.name }`);
  }

  checkOutput() {
    if (!this.output || !utils.isArray(this.output)) throw new Error('kernel.output not an array');
    if (this.output.length < 1) throw new Error('kernel.output is empty, needs at least 1 value');
    for (let i = 0; i < this.output.length; i++) {
      if (isNaN(this.output[i]) || this.output[i] < 1) {
        throw new Error(`${ this.constructor.name }.output[${ i }] incorrectly defined as \`${ this.output[i] }\`, needs to be numeric, and greater than 0`);
      }
    }
  }

  prependString(value) {
    throw new Error(`"prependString" called on ${ this.constructor.name }`);
  }

  hasPrependString(value) {
    throw new Error(`"hasPrependString" called on ${ this.constructor.name }`);
  }

  toJSON() {
    return {
      settings: {
        output: this.output,
        pipeline: this.pipeline,
        argumentNames: this.argumentNames,
        argumentsTypes: this.argumentTypes,
        constants: this.constants,
        pluginNames: this.plugins ? this.plugins.map(plugin => plugin.name) : null,
        returnType: this.returnType,
      }
    };
  }

  buildSignature(args) {
    const Constructor = this.constructor;
    this.signature = Constructor.getSignature(this, Constructor.getArgumentTypes(this, args));
  }

  static getArgumentTypes(kernel, args) {
    const argumentTypes = new Array(args.length);
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      const type = kernel.argumentTypes[i];
      if (arg.type) {
        argumentTypes[i] = arg.type;
      } else {
        switch (type) {
          case 'Number':
          case 'Integer':
          case 'Float':
          case 'ArrayTexture(1)':
            argumentTypes[i] = utils.getVariableType(arg);
            break;
          default:
            argumentTypes[i] = type;
        }
      }
    }
    return argumentTypes;
  }

  static getSignature(kernel, argumentTypes) {
    throw new Error(`"getSignature" not implemented on ${ this.name }`);
  }

  functionToIGPUFunction(source, settings = {}) {
    if (typeof source !== 'string' && typeof source !== 'function') throw new Error('source not a string or function');
    const sourceString = typeof source === 'string' ? source : source.toString();
    let argumentTypes = [];

    if (Array.isArray(settings.argumentTypes)) {
      argumentTypes = settings.argumentTypes;
    } else if (typeof settings.argumentTypes === 'object') {
      argumentTypes = utils.getArgumentNamesFromString(sourceString)
        .map(name => settings.argumentTypes[name]) || [];
    } else {
      argumentTypes = settings.argumentTypes || [];
    }

    return {
      name: utils.getFunctionNameFromString(sourceString) || null,
      source: sourceString,
      argumentTypes,
      returnType: settings.returnType || null,
    };
  }

  onActivate(previousKernel) {}
}

function splitArgumentTypes(argumentTypesObject) {
  const argumentNames = Object.keys(argumentTypesObject);
  const argumentTypes = [];
  for (let i = 0; i < argumentNames.length; i++) {
    const argumentName = argumentNames[i];
    argumentTypes.push(argumentTypesObject[argumentName]);
  }
  return { argumentTypes, argumentNames };
}

module.exports = {
  Kernel
};
},{"../input":110,"../utils":114}],37:[function(require,module,exports){
const fragmentShader = `__HEADER__;
__FLOAT_TACTIC_DECLARATION__;
__INT_TACTIC_DECLARATION__;
__SAMPLER_2D_TACTIC_DECLARATION__;

const int LOOP_MAX = __LOOP_MAX__;

__PLUGINS__;
__CONSTANTS__;

varying vec2 vTexCoord;

float acosh(float x) {
return log(x + sqrt(x * x - 1.0));
}

float sinh(float x) {
return (pow(${Math.E}, x) - pow(${Math.E}, -x)) / 2.0;
}

float asinh(float x) {
return log(x + sqrt(x * x + 1.0));
}

float atan2(float v1, float v2) {
if (v1 == 0.0 || v2 == 0.0) return 0.0;
return atan(v1 / v2);
}

float atanh(float x) {
x = (x + 1.0) / (x - 1.0);
if (x < 0.0) {
return 0.5 * log(-x);
}
return 0.5 * log(x);
}

float cbrt(float x) {
if (x >= 0.0) {
return pow(x, 1.0 / 3.0);
} else {
return -pow(x, 1.0 / 3.0);
}
}

float cosh(float x) {
return (pow(${Math.E}, x) + pow(${Math.E}, -x)) / 2.0; 
}

float expm1(float x) {
return pow(${Math.E}, x) - 1.0; 
}

float fround(highp float x) {
return x;
}

float imul(float v1, float v2) {
return float(int(v1) * int(v2));
}

float log10(float x) {
return log2(x) * (1.0 / log2(10.0));
}

float log1p(float x) {
return log(1.0 + x);
}

float _pow(float v1, float v2) {
if (v2 == 0.0) return 1.0;
return pow(v1, v2);
}

float tanh(float x) {
float e = exp(2.0 * x);
return (e - 1.0) / (e + 1.0);
}

float trunc(float x) {
if (x >= 0.0) {
return floor(x); 
} else {
return ceil(x);
}
}

vec4 _round(vec4 x) {
return floor(x + 0.5);
}

float _round(float x) {
return floor(x + 0.5);
}

const int BIT_COUNT = 32;
int modi(int x, int y) {
return x - y * (x / y);
}

int bitwiseOr(int a, int b) {
int result = 0;
int n = 1;

for (int i = 0; i < BIT_COUNT; i++) {
if ((modi(a, 2) == 1) || (modi(b, 2) == 1)) {
  result += n;
}
a = a / 2;
b = b / 2;
n = n * 2;
if(!(a > 0 || b > 0)) {
  break;
}
}
return result;
}
int bitwiseXOR(int a, int b) {
int result = 0;
int n = 1;

for (int i = 0; i < BIT_COUNT; i++) {
if ((modi(a, 2) == 1) != (modi(b, 2) == 1)) {
  result += n;
}
a = a / 2;
b = b / 2;
n = n * 2;
if(!(a > 0 || b > 0)) {
  break;
}
}
return result;
}
int bitwiseAnd(int a, int b) {
int result = 0;
int n = 1;
for (int i = 0; i < BIT_COUNT; i++) {
if ((modi(a, 2) == 1) && (modi(b, 2) == 1)) {
  result += n;
}
a = a / 2;
b = b / 2;
n = n * 2;
if(!(a > 0 && b > 0)) {
  break;
}
}
return result;
}
int bitwiseNot(int a) {
int result = 0;
int n = 1;

for (int i = 0; i < BIT_COUNT; i++) {
if (modi(a, 2) == 0) {
  result += n;    
}
a = a / 2;
n = n * 2;
}
return result;
}
int bitwiseZeroFillLeftShift(int n, int shift) {
int maxBytes = BIT_COUNT;
for (int i = 0; i < BIT_COUNT; i++) {
if (maxBytes >= n) {
  break;
}
maxBytes *= 2;
}
for (int i = 0; i < BIT_COUNT; i++) {
if (i >= shift) {
  break;
}
n *= 2;
}

int result = 0;
int byteVal = 1;
for (int i = 0; i < BIT_COUNT; i++) {
if (i >= maxBytes) break;
if (modi(n, 2) > 0) { result += byteVal; }
n = int(n / 2);
byteVal *= 2;
}
return result;
}

int bitwiseSignedRightShift(int num, int shifts) {
return int(floor(float(num) / pow(2.0, float(shifts))));
}

int bitwiseZeroFillRightShift(int n, int shift) {
int maxBytes = BIT_COUNT;
for (int i = 0; i < BIT_COUNT; i++) {
if (maxBytes >= n) {
  break;
}
maxBytes *= 2;
}
for (int i = 0; i < BIT_COUNT; i++) {
if (i >= shift) {
  break;
}
n /= 2;
}
int result = 0;
int byteVal = 1;
for (int i = 0; i < BIT_COUNT; i++) {
if (i >= maxBytes) break;
if (modi(n, 2) > 0) { result += byteVal; }
n = int(n / 2);
byteVal *= 2;
}
return result;
}

vec2 integerMod(vec2 x, float y) {
vec2 res = floor(mod(x, y));
return res * step(1.0 - floor(y), -res);
}

vec3 integerMod(vec3 x, float y) {
vec3 res = floor(mod(x, y));
return res * step(1.0 - floor(y), -res);
}

vec4 integerMod(vec4 x, vec4 y) {
vec4 res = floor(mod(x, y));
return res * step(1.0 - floor(y), -res);
}

float integerMod(float x, float y) {
float res = floor(mod(x, y));
return res * (res > floor(y) - 1.0 ? 0.0 : 1.0);
}

int integerMod(int x, int y) {
return x - (y * int(x / y));
}

__DIVIDE_WITH_INTEGER_CHECK__;

// Here be dragons!
// DO NOT OPTIMIZE THIS CODE
// YOU WILL BREAK SOMETHING ON SOMEBODY\'S MACHINE
// LEAVE IT AS IT IS, LEST YOU WASTE YOUR OWN TIME
const vec2 MAGIC_VEC = vec2(1.0, -256.0);
const vec4 SCALE_FACTOR = vec4(1.0, 256.0, 65536.0, 0.0);
const vec4 SCALE_FACTOR_INV = vec4(1.0, 0.00390625, 0.0000152587890625, 0.0); // 1, 1/256, 1/65536
float decode32(vec4 texel) {
__DECODE32_ENDIANNESS__;
texel *= 255.0;
vec2 gte128;
gte128.x = texel.b >= 128.0 ? 1.0 : 0.0;
gte128.y = texel.a >= 128.0 ? 1.0 : 0.0;
float exponent = 2.0 * texel.a - 127.0 + dot(gte128, MAGIC_VEC);
float res = exp2(_round(exponent));
texel.b = texel.b - 128.0 * gte128.x;
res = dot(texel, SCALE_FACTOR) * exp2(_round(exponent-23.0)) + res;
res *= gte128.y * -2.0 + 1.0;
return res;
}

float decode16(vec4 texel, int index) {
int channel = integerMod(index, 2);
if (channel == 0) return texel.r * 255.0 + texel.g * 65280.0;
if (channel == 1) return texel.b * 255.0 + texel.a * 65280.0;
return 0.0;
}

float decode8(vec4 texel, int index) {
int channel = integerMod(index, 4);
if (channel == 0) return texel.r * 255.0;
if (channel == 1) return texel.g * 255.0;
if (channel == 2) return texel.b * 255.0;
if (channel == 3) return texel.a * 255.0;
return 0.0;
}

vec4 legacyEncode32(float f) {
float F = abs(f);
float sign = f < 0.0 ? 1.0 : 0.0;
float exponent = floor(log2(F));
float mantissa = (exp2(-exponent) * F);
// exponent += floor(log2(mantissa));
vec4 texel = vec4(F * exp2(23.0-exponent)) * SCALE_FACTOR_INV;
texel.rg = integerMod(texel.rg, 256.0);
texel.b = integerMod(texel.b, 128.0);
texel.a = exponent*0.5 + 63.5;
texel.ba += vec2(integerMod(exponent+127.0, 2.0), sign) * 128.0;
texel = floor(texel);
texel *= 0.003921569; // 1/255
__ENCODE32_ENDIANNESS__;
return texel;
}

// https://github.com/gpujs/gpu.js/wiki/Encoder-details
vec4 encode32(float value) {
if (value == 0.0) return vec4(0, 0, 0, 0);

float exponent;
float mantissa;
vec4  result;
float sgn;

sgn = step(0.0, -value);
value = abs(value);

exponent = floor(log2(value));

mantissa = value*pow(2.0, -exponent)-1.0;
exponent = exponent+127.0;
result   = vec4(0,0,0,0);

result.a = floor(exponent/2.0);
exponent = exponent - result.a*2.0;
result.a = result.a + 128.0*sgn;

result.b = floor(mantissa * 128.0);
mantissa = mantissa - result.b / 128.0;
result.b = result.b + exponent*128.0;

result.g = floor(mantissa*32768.0);
mantissa = mantissa - result.g/32768.0;

result.r = floor(mantissa*8388608.0);
return result/255.0;
}
// Dragons end here

int index;
ivec3 threadId;

ivec3 indexTo3D(int idx, ivec3 texDim) {
int z = int(idx / (texDim.x * texDim.y));
idx -= z * int(texDim.x * texDim.y);
int y = int(idx / texDim.x);
int x = int(integerMod(idx, texDim.x));
return ivec3(x, y, z);
}

float get32(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
int index = x + texDim.x * (y + texDim.y * z);
int w = texSize.x;
vec2 st = vec2(float(integerMod(index, w)), float(index / w)) + 0.5;
vec4 texel = texture2D(tex, st / vec2(texSize));
return decode32(texel);
}

float get16(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
int index = x + texDim.x * (y + texDim.y * z);
int w = texSize.x * 2;
vec2 st = vec2(float(integerMod(index, w)), float(index / w)) + 0.5;
vec4 texel = texture2D(tex, st / vec2(texSize.x * 2, texSize.y));
return decode16(texel, index);
}

float get8(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
int index = x + texDim.x * (y + texDim.y * z);
int w = texSize.x * 4;
vec2 st = vec2(float(integerMod(index, w)), float(index / w)) + 0.5;
vec4 texel = texture2D(tex, st / vec2(texSize.x * 4, texSize.y));
return decode8(texel, index);
}

float getMemoryOptimized32(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
int index = x + texDim.x * (y + texDim.y * z);
int channel = integerMod(index, 4);
index = index / 4;
int w = texSize.x;
vec2 st = vec2(float(integerMod(index, w)), float(index / w)) + 0.5;
vec4 texel = texture2D(tex, st / vec2(texSize));
if (channel == 0) return texel.r;
if (channel == 1) return texel.g;
if (channel == 2) return texel.b;
if (channel == 3) return texel.a;
return 0.0;
}

vec4 getImage2D(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
int index = x + texDim.x * (y + texDim.y * z);
int w = texSize.x;
vec2 st = vec2(float(integerMod(index, w)), float(index / w)) + 0.5;
return texture2D(tex, st / vec2(texSize));
}

float getFloatFromSampler2D(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
vec4 result = getImage2D(tex, texSize, texDim, z, y, x);
return result[0];
}

vec2 getVec2FromSampler2D(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
vec4 result = getImage2D(tex, texSize, texDim, z, y, x);
return vec2(result[0], result[1]);
}

vec2 getMemoryOptimizedVec2(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
int index = x + (texDim.x * (y + (texDim.y * z)));
int channel = integerMod(index, 2);
index = index / 2;
int w = texSize.x;
vec2 st = vec2(float(integerMod(index, w)), float(index / w)) + 0.5;
vec4 texel = texture2D(tex, st / vec2(texSize));
if (channel == 0) return vec2(texel.r, texel.g);
if (channel == 1) return vec2(texel.b, texel.a);
return vec2(0.0, 0.0);
}

vec3 getVec3FromSampler2D(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
vec4 result = getImage2D(tex, texSize, texDim, z, y, x);
return vec3(result[0], result[1], result[2]);
}

vec3 getMemoryOptimizedVec3(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
int fieldIndex = 3 * (x + texDim.x * (y + texDim.y * z));
int vectorIndex = fieldIndex / 4;
int vectorOffset = fieldIndex - vectorIndex * 4;
int readY = vectorIndex / texSize.x;
int readX = vectorIndex - readY * texSize.x;
vec4 tex1 = texture2D(tex, (vec2(readX, readY) + 0.5) / vec2(texSize));

if (vectorOffset == 0) {
return tex1.xyz;
} else if (vectorOffset == 1) {
return tex1.yzw;
} else {
readX++;
if (readX >= texSize.x) {
  readX = 0;
  readY++;
}
vec4 tex2 = texture2D(tex, vec2(readX, readY) / vec2(texSize));
if (vectorOffset == 2) {
  return vec3(tex1.z, tex1.w, tex2.x);
} else {
  return vec3(tex1.w, tex2.x, tex2.y);
}
}
}

vec4 getVec4FromSampler2D(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
return getImage2D(tex, texSize, texDim, z, y, x);
}

vec4 getMemoryOptimizedVec4(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
int index = x + texDim.x * (y + texDim.y * z);
int channel = integerMod(index, 2);
int w = texSize.x;
vec2 st = vec2(float(integerMod(index, w)), float(index / w)) + 0.5;
vec4 texel = texture2D(tex, st / vec2(texSize));
return vec4(texel.r, texel.g, texel.b, texel.a);
}

vec4 actualColor;
void color(float r, float g, float b, float a) {
actualColor = vec4(r,g,b,a);
}

void color(float r, float g, float b) {
color(r,g,b,1.0);
}

void color(sampler2D image) {
actualColor = texture2D(image, vTexCoord);
}

float modulo(float number, float divisor) {
if (number < 0.0) {
number = abs(number);
if (divisor < 0.0) {
  divisor = abs(divisor);
}
return -mod(number, divisor);
}
if (divisor < 0.0) {
divisor = abs(divisor);
}
return mod(number, divisor);
}

__INJECTED_NATIVE__;
__MAIN_CONSTANTS__;
__MAIN_ARGUMENTS__;
__KERNEL__;

void main(void) {
index = int(vTexCoord.s * float(uTexSize.x)) + int(vTexCoord.t * float(uTexSize.y)) * uTexSize.x;
__MAIN_RESULT__;
}`;

module.exports = {
  fragmentShader
};
},{}],38:[function(require,module,exports){
const { utils } = require('../../utils');
const { FunctionNode } = require('../function-node');

class WebGLFunctionNode extends FunctionNode {
  constructor(source, settings) {
    super(source, settings);
    if (settings && settings.hasOwnProperty('fixIntegerDivisionAccuracy')) {
      this.fixIntegerDivisionAccuracy = settings.fixIntegerDivisionAccuracy;
    }
  }

  astConditionalExpression(ast, retArr) {
    if (ast.type !== 'ConditionalExpression') {
      throw this.astErrorOutput('Not a conditional expression', ast);
    }
    const consequentType = this.getType(ast.consequent);
    const alternateType = this.getType(ast.alternate);
    if (consequentType === null && alternateType === null) {
      retArr.push('if (');
      this.astGeneric(ast.test, retArr);
      retArr.push(') {');
      this.astGeneric(ast.consequent, retArr);
      retArr.push(';');
      retArr.push('} else {');
      this.astGeneric(ast.alternate, retArr);
      retArr.push(';');
      retArr.push('}');
      return retArr;
    }
    retArr.push('(');
    this.astGeneric(ast.test, retArr);
    retArr.push('?');
    this.astGeneric(ast.consequent, retArr);
    retArr.push(':');
    this.astGeneric(ast.alternate, retArr);
    retArr.push(')');
    return retArr;
  }

  astFunction(ast, retArr) {
    if (this.isRootKernel) {
      retArr.push('void');
    } else {
      if (!this.returnType) {
        const lastReturn = this.findLastReturn();
        if (lastReturn) {
          this.returnType = this.getType(ast.body);
          if (this.returnType === 'LiteralInteger') {
            this.returnType = 'Number';
          }
        }
      }

      const { returnType } = this;
      if (!returnType) {
        retArr.push('void');
      } else {
        const type = typeMap[returnType];
        if (!type) {
          throw new Error(`unknown type ${returnType}`);
        }
        retArr.push(type);
      }
    }
    retArr.push(' ');
    retArr.push(this.name);
    retArr.push('(');

    if (!this.isRootKernel) {
      for (let i = 0; i < this.argumentNames.length; ++i) {
        const argumentName = this.argumentNames[i];

        if (i > 0) {
          retArr.push(', ');
        }
        let argumentType = this.argumentTypes[this.argumentNames.indexOf(argumentName)];
        if (!argumentType) {
          throw this.astErrorOutput(`Unknown argument ${argumentName} type`, ast);
        }
        if (argumentType === 'LiteralInteger') {
          this.argumentTypes[i] = argumentType = 'Number';
        }
        const type = typeMap[argumentType];
        if (!type) {
          throw this.astErrorOutput('Unexpected expression', ast);
        }
        const name = utils.sanitizeName(argumentName);
        if (type === 'sampler2D' || type === 'sampler2DArray') {
          retArr.push(`${type} user_${name},ivec2 user_${name}Size,ivec3 user_${name}Dim`);
        } else {
          retArr.push(`${type} user_${name}`);
        }
      }
    }

    retArr.push(') {\n');

    for (let i = 0; i < ast.body.body.length; ++i) {
      this.astGeneric(ast.body.body[i], retArr);
      retArr.push('\n');
    }

    retArr.push('}\n');
    return retArr;
  }

  astReturnStatement(ast, retArr) {
    if (!ast.argument) throw this.astErrorOutput('Unexpected return statement', ast);
    this.pushState('skip-literal-correction');
    const type = this.getType(ast.argument);
    this.popState('skip-literal-correction');

    const result = [];

    if (!this.returnType) {
      if (type === 'LiteralInteger' || type === 'Integer') {
        this.returnType = 'Number';
      } else {
        this.returnType = type;
      }
    }

    switch (this.returnType) {
      case 'LiteralInteger':
      case 'Number':
      case 'Float':
        switch (type) {
          case 'Integer':
            result.push('float(');
            this.astGeneric(ast.argument, result);
            result.push(')');
            break;
          case 'LiteralInteger':
            this.castLiteralToFloat(ast.argument, result);

            if (this.getType(ast) === 'Integer') {
              result.unshift('float(');
              result.push(')');
            }
            break;
          default:
            this.astGeneric(ast.argument, result);
        }
        break;
      case 'Integer':
        switch (type) {
          case 'Float':
          case 'Number':
            this.castValueToInteger(ast.argument, result);
            break;
          case 'LiteralInteger':
            this.castLiteralToInteger(ast.argument, result);
            break;
          default:
            this.astGeneric(ast.argument, result);
        }
        break;
      case 'Array(4)':
      case 'Array(3)':
      case 'Array(2)':
      case 'Matrix(2)':
      case 'Matrix(3)':
      case 'Matrix(4)':
      case 'Input':
        this.astGeneric(ast.argument, result);
        break;
      default:
        throw this.astErrorOutput(`unhandled return type ${this.returnType}`, ast);
    }

    if (this.isRootKernel) {
      retArr.push(`kernelResult = ${ result.join('') };`);
      retArr.push('return;');
    } else if (this.isSubKernel) {
      retArr.push(`subKernelResult_${ this.name } = ${ result.join('') };`);
      retArr.push(`return subKernelResult_${ this.name };`);
    } else {
      retArr.push(`return ${ result.join('') };`);
    }
    return retArr;
  }

  astLiteral(ast, retArr) {
    if (isNaN(ast.value)) {
      throw this.astErrorOutput(
        'Non-numeric literal not supported : ' + ast.value,
        ast
      );
    }

    const key = this.astKey(ast);
    if (Number.isInteger(ast.value)) {
      if (this.isState('casting-to-integer') || this.isState('building-integer')) {
        this.literalTypes[key] = 'Integer';
        retArr.push(`${ast.value}`);
      } else if (this.isState('casting-to-float') || this.isState('building-float')) {
        this.literalTypes[key] = 'Number';
        retArr.push(`${ast.value}.0`);
      } else {
        this.literalTypes[key] = 'Number';
        retArr.push(`${ast.value}.0`);
      }
    } else if (this.isState('casting-to-integer') || this.isState('building-integer')) {
      this.literalTypes[key] = 'Integer';
      retArr.push(Math.round(ast.value));
    } else {
      this.literalTypes[key] = 'Number';
      retArr.push(`${ast.value}`);
    }
    return retArr;
  }

  astBinaryExpression(ast, retArr) {
    if (this.checkAndUpconvertOperator(ast, retArr)) {
      return retArr;
    }

    if (this.fixIntegerDivisionAccuracy && ast.operator === '/') {
      retArr.push('divWithIntCheck(');
      this.pushState('building-float');
      switch (this.getType(ast.left)) {
        case 'Integer':
          this.castValueToFloat(ast.left, retArr);
          break;
        case 'LiteralInteger':
          this.castLiteralToFloat(ast.left, retArr);
          break;
        default:
          this.astGeneric(ast.left, retArr);
      }
      retArr.push(', ');
      switch (this.getType(ast.right)) {
        case 'Integer':
          this.castValueToFloat(ast.right, retArr);
          break;
        case 'LiteralInteger':
          this.castLiteralToFloat(ast.right, retArr);
          break;
        default:
          this.astGeneric(ast.right, retArr);
      }
      this.popState('building-float');
      retArr.push(')');
      return retArr;
    }

    retArr.push('(');
    const leftType = this.getType(ast.left) || 'Number';
    const rightType = this.getType(ast.right) || 'Number';
    if (!leftType || !rightType) {
      throw this.astErrorOutput(`Unhandled binary expression`, ast);
    }
    const key = leftType + ' & ' + rightType;
    switch (key) {
      case 'Integer & Integer':
        this.pushState('building-integer');
        this.astGeneric(ast.left, retArr);
        retArr.push(operatorMap[ast.operator] || ast.operator);
        this.astGeneric(ast.right, retArr);
        this.popState('building-integer');
        break;
      case 'Number & Float':
      case 'Float & Number':
      case 'Float & Float':
      case 'Number & Number':
        this.pushState('building-float');
        this.astGeneric(ast.left, retArr);
        retArr.push(operatorMap[ast.operator] || ast.operator);
        this.astGeneric(ast.right, retArr);
        this.popState('building-float');
        break;
      case 'LiteralInteger & LiteralInteger':
        if (this.isState('casting-to-integer') || this.isState('building-integer')) {
          this.pushState('building-integer');
          this.astGeneric(ast.left, retArr);
          retArr.push(operatorMap[ast.operator] || ast.operator);
          this.astGeneric(ast.right, retArr);
          this.popState('building-integer');
        } else {
          this.pushState('building-float');
          this.castLiteralToFloat(ast.left, retArr);
          retArr.push(operatorMap[ast.operator] || ast.operator);
          this.castLiteralToFloat(ast.right, retArr);
          this.popState('building-float');
        }
        break;

      case 'Integer & Float':
      case 'Integer & Number':
        if (ast.operator === '>' || ast.operator === '<' && ast.right.type === 'Literal') {
          if (!Number.isInteger(ast.right.value)) {
            this.pushState('building-float');
            this.castValueToFloat(ast.left, retArr);
            retArr.push(operatorMap[ast.operator] || ast.operator);
            this.astGeneric(ast.right, retArr);
            this.popState('building-float');
            break;
          }
        }
        this.pushState('building-integer');
        this.astGeneric(ast.left, retArr);
        retArr.push(operatorMap[ast.operator] || ast.operator);
        this.pushState('casting-to-integer');
        if (ast.right.type === 'Literal') {
          const literalResult = [];
          this.astGeneric(ast.right, literalResult);
          const literalType = this.getType(ast.right);
          if (literalType === 'Integer') {
            retArr.push(literalResult.join(''));
          } else {
            throw this.astErrorOutput(`Unhandled binary expression with literal`, ast);
          }
        } else {
          retArr.push('int(');
          this.astGeneric(ast.right, retArr);
          retArr.push(')');
        }
        this.popState('casting-to-integer');
        this.popState('building-integer');
        break;
      case 'Integer & LiteralInteger':
        this.pushState('building-integer');
        this.astGeneric(ast.left, retArr);
        retArr.push(operatorMap[ast.operator] || ast.operator);
        this.castLiteralToInteger(ast.right, retArr);
        this.popState('building-integer');
        break;

      case 'Number & Integer':
        this.pushState('building-float');
        this.astGeneric(ast.left, retArr);
        retArr.push(operatorMap[ast.operator] || ast.operator);
        this.castValueToFloat(ast.right, retArr);
        this.popState('building-float');
        break;
      case 'Float & LiteralInteger':
      case 'Number & LiteralInteger':
        this.pushState('building-float');
        this.astGeneric(ast.left, retArr);
        retArr.push(operatorMap[ast.operator] || ast.operator);
        this.castLiteralToFloat(ast.right, retArr);
        this.popState('building-float');
        break;
      case 'LiteralInteger & Float':
      case 'LiteralInteger & Number':
        if (this.isState('casting-to-integer')) {
          this.pushState('building-integer');
          this.castLiteralToInteger(ast.left, retArr);
          retArr.push(operatorMap[ast.operator] || ast.operator);
          this.castValueToInteger(ast.right, retArr);
          this.popState('building-integer');
        } else {
          this.pushState('building-float');
          this.astGeneric(ast.left, retArr);
          retArr.push(operatorMap[ast.operator] || ast.operator);
          this.pushState('casting-to-float');
          this.astGeneric(ast.right, retArr);
          this.popState('casting-to-float');
          this.popState('building-float');
        }
        break;
      case 'LiteralInteger & Integer':
        this.pushState('building-integer');
        this.castLiteralToInteger(ast.left, retArr);
        retArr.push(operatorMap[ast.operator] || ast.operator);
        this.astGeneric(ast.right, retArr);
        this.popState('building-integer');
        break;

      case 'Boolean & Boolean':
        this.pushState('building-boolean');
        this.astGeneric(ast.left, retArr);
        retArr.push(operatorMap[ast.operator] || ast.operator);
        this.astGeneric(ast.right, retArr);
        this.popState('building-boolean');
        break;

      case 'Float & Integer':
        this.pushState('building-float');
        this.astGeneric(ast.left, retArr);
        retArr.push(operatorMap[ast.operator] || ast.operator);
        this.castValueToFloat(ast.right, retArr);
        this.popState('building-float');
        break;

      default:
        throw this.astErrorOutput(`Unhandled binary expression between ${key}`, ast);
    }
    retArr.push(')');

    return retArr;
  }

  checkAndUpconvertOperator(ast, retArr) {
    const bitwiseResult = this.checkAndUpconvertBitwiseOperators(ast, retArr);
    if (bitwiseResult) {
      return bitwiseResult;
    }
    const upconvertableOperators = {
      '%': this.fixIntegerDivisionAccuracy ? 'integerCorrectionModulo' : 'modulo',
      '**': 'pow',
    };
    const foundOperator = upconvertableOperators[ast.operator];
    if (!foundOperator) return null;
    retArr.push(foundOperator);
    retArr.push('(');
    switch (this.getType(ast.left)) {
      case 'Integer':
        this.castValueToFloat(ast.left, retArr);
        break;
      case 'LiteralInteger':
        this.castLiteralToFloat(ast.left, retArr);
        break;
      default:
        this.astGeneric(ast.left, retArr);
    }
    retArr.push(',');
    switch (this.getType(ast.right)) {
      case 'Integer':
        this.castValueToFloat(ast.right, retArr);
        break;
      case 'LiteralInteger':
        this.castLiteralToFloat(ast.right, retArr);
        break;
      default:
        this.astGeneric(ast.right, retArr);
    }
    retArr.push(')');
    return retArr;
  }

  checkAndUpconvertBitwiseOperators(ast, retArr) {
    const upconvertableOperators = {
      '&': 'bitwiseAnd',
      '|': 'bitwiseOr',
      '^': 'bitwiseXOR',
      '<<': 'bitwiseZeroFillLeftShift',
      '>>': 'bitwiseSignedRightShift',
      '>>>': 'bitwiseZeroFillRightShift',
    };
    const foundOperator = upconvertableOperators[ast.operator];
    if (!foundOperator) return null;
    retArr.push(foundOperator);
    retArr.push('(');
    const leftType = this.getType(ast.left);
    switch (leftType) {
      case 'Number':
      case 'Float':
        this.castValueToInteger(ast.left, retArr);
        break;
      case 'LiteralInteger':
        this.castLiteralToInteger(ast.left, retArr);
        break;
      default:
        this.astGeneric(ast.left, retArr);
    }
    retArr.push(',');
    const rightType = this.getType(ast.right);
    switch (rightType) {
      case 'Number':
      case 'Float':
        this.castValueToInteger(ast.right, retArr);
        break;
      case 'LiteralInteger':
        this.castLiteralToInteger(ast.right, retArr);
        break;
      default:
        this.astGeneric(ast.right, retArr);
    }
    retArr.push(')');
    return retArr;
  }

  checkAndUpconvertBitwiseUnary(ast, retArr) {
    const upconvertableOperators = {
      '~': 'bitwiseNot',
    };
    const foundOperator = upconvertableOperators[ast.operator];
    if (!foundOperator) return null;
    retArr.push(foundOperator);
    retArr.push('(');
    switch (this.getType(ast.argument)) {
      case 'Number':
      case 'Float':
        this.castValueToInteger(ast.argument, retArr);
        break;
      case 'LiteralInteger':
        this.castLiteralToInteger(ast.argument, retArr);
        break;
      default:
        this.astGeneric(ast.argument, retArr);
    }
    retArr.push(')');
    return retArr;
  }

  castLiteralToInteger(ast, retArr) {
    this.pushState('casting-to-integer');
    this.astGeneric(ast, retArr);
    this.popState('casting-to-integer');
    return retArr;
  }

  castLiteralToFloat(ast, retArr) {
    this.pushState('casting-to-float');
    this.astGeneric(ast, retArr);
    this.popState('casting-to-float');
    return retArr;
  }

  castValueToInteger(ast, retArr) {
    this.pushState('casting-to-integer');
    retArr.push('int(');
    this.astGeneric(ast, retArr);
    retArr.push(')');
    this.popState('casting-to-integer');
    return retArr;
  }

  castValueToFloat(ast, retArr) {
    this.pushState('casting-to-float');
    retArr.push('float(');
    this.astGeneric(ast, retArr);
    retArr.push(')');
    this.popState('casting-to-float');
    return retArr;
  }

  astIdentifierExpression(idtNode, retArr) {
    if (idtNode.type !== 'Identifier') {
      throw this.astErrorOutput('IdentifierExpression - not an Identifier', idtNode);
    }

    const type = this.getType(idtNode);

    const name = utils.sanitizeName(idtNode.name);
    if (idtNode.name === 'Infinity') {
      retArr.push('3.402823466e+38');
    } else if (type === 'Boolean') {
      if (this.argumentNames.indexOf(name) > -1) {
        retArr.push(`bool(user_${name})`);
      } else {
        retArr.push(`user_${name}`);
      }
    } else {
      retArr.push(`user_${name}`);
    }

    return retArr;
  }

  astForStatement(forNode, retArr) {
    if (forNode.type !== 'ForStatement') {
      throw this.astErrorOutput('Invalid for statement', forNode);
    }

    const initArr = [];
    const testArr = [];
    const updateArr = [];
    const bodyArr = [];
    let isSafe = null;

    if (forNode.init) {
      const { declarations } = forNode.init;
      if (declarations.length > 1) {
        isSafe = false;
      }
      this.astGeneric(forNode.init, initArr);
      for (let i = 0; i < declarations.length; i++) {
        if (declarations[i].init && declarations[i].init.type !== 'Literal') {
          isSafe = false;
        }
      }
    } else {
      isSafe = false;
    }

    if (forNode.test) {
      this.astGeneric(forNode.test, testArr);
    } else {
      isSafe = false;
    }

    if (forNode.update) {
      this.astGeneric(forNode.update, updateArr);
    } else {
      isSafe = false;
    }

    if (forNode.body) {
      this.pushState('loop-body');
      this.astGeneric(forNode.body, bodyArr);
      this.popState('loop-body');
    }

    if (isSafe === null) {
      isSafe = this.isSafe(forNode.init) && this.isSafe(forNode.test);
    }

    if (isSafe) {
      const initString = initArr.join('');
      const initNeedsSemiColon = initString[initString.length - 1] !== ';';
      retArr.push(`for (${initString}${initNeedsSemiColon ? ';' : ''}${testArr.join('')};${updateArr.join('')}){\n`);
      retArr.push(bodyArr.join(''));
      retArr.push('}\n');
    } else {
      const iVariableName = this.getInternalVariableName('safeI');
      if (initArr.length > 0) {
        retArr.push(initArr.join(''), '\n');
      }
      retArr.push(`for (int ${iVariableName}=0;${iVariableName}<LOOP_MAX;${iVariableName}++){\n`);
      if (testArr.length > 0) {
        retArr.push(`if (!${testArr.join('')}) break;\n`);
      }
      retArr.push(bodyArr.join(''));
      retArr.push(`\n${updateArr.join('')};`);
      retArr.push('}\n');
    }
    return retArr;
  }

  astWhileStatement(whileNode, retArr) {
    if (whileNode.type !== 'WhileStatement') {
      throw this.astErrorOutput('Invalid while statement', whileNode);
    }

    const iVariableName = this.getInternalVariableName('safeI');
    retArr.push(`for (int ${iVariableName}=0;${iVariableName}<LOOP_MAX;${iVariableName}++){\n`);
    retArr.push('if (!');
    this.astGeneric(whileNode.test, retArr);
    retArr.push(') break;\n');
    this.astGeneric(whileNode.body, retArr);
    retArr.push('}\n');

    return retArr;
  }

  astDoWhileStatement(doWhileNode, retArr) {
    if (doWhileNode.type !== 'DoWhileStatement') {
      throw this.astErrorOutput('Invalid while statement', doWhileNode);
    }

    const iVariableName = this.getInternalVariableName('safeI');
    retArr.push(`for (int ${iVariableName}=0;${iVariableName}<LOOP_MAX;${iVariableName}++){\n`);
    this.astGeneric(doWhileNode.body, retArr);
    retArr.push('if (!');
    this.astGeneric(doWhileNode.test, retArr);
    retArr.push(') break;\n');
    retArr.push('}\n');

    return retArr;
  }


  astAssignmentExpression(assNode, retArr) {
    if (assNode.operator === '%=') {
      this.astGeneric(assNode.left, retArr);
      retArr.push('=');
      retArr.push('mod(');
      this.astGeneric(assNode.left, retArr);
      retArr.push(',');
      this.astGeneric(assNode.right, retArr);
      retArr.push(')');
    } else if (assNode.operator === '**=') {
      this.astGeneric(assNode.left, retArr);
      retArr.push('=');
      retArr.push('pow(');
      this.astGeneric(assNode.left, retArr);
      retArr.push(',');
      this.astGeneric(assNode.right, retArr);
      retArr.push(')');
    } else {
      const leftType = this.getType(assNode.left);
      const rightType = this.getType(assNode.right);
      this.astGeneric(assNode.left, retArr);
      retArr.push(assNode.operator);
      if (leftType !== 'Integer' && rightType === 'Integer') {
        retArr.push('float(');
        this.astGeneric(assNode.right, retArr);
        retArr.push(')');
      } else {
        this.astGeneric(assNode.right, retArr);
      }
      return retArr;
    }
  }

  astBlockStatement(bNode, retArr) {
    if (this.isState('loop-body')) {
      this.pushState('block-body'); 
      for (let i = 0; i < bNode.body.length; i++) {
        this.astGeneric(bNode.body[i], retArr);
      }
      this.popState('block-body');
    } else {
      retArr.push('{\n');
      for (let i = 0; i < bNode.body.length; i++) {
        this.astGeneric(bNode.body[i], retArr);
      }
      retArr.push('}\n');
    }
    return retArr;
  }

  astVariableDeclaration(varDecNode, retArr) {
    const declarations = varDecNode.declarations;
    if (!declarations || !declarations[0] || !declarations[0].init) {
      throw this.astErrorOutput('Unexpected expression', varDecNode);
    }
    const result = [];
    let lastType = null;
    const declarationSets = [];
    let declarationSet = [];
    for (let i = 0; i < declarations.length; i++) {
      const declaration = declarations[i];
      const init = declaration.init;
      const info = this.getDeclaration(declaration.id);
      const actualType = this.getType(declaration.init);
      let type = actualType;
      if (type === 'LiteralInteger') {
        if (info.suggestedType === 'Integer') {
          type = 'Integer';
        } else {
          type = 'Number';
        }
      }
      const markupType = typeMap[type];
      if (!markupType) {
        throw this.astErrorOutput(`Markup type ${ type } not handled`, varDecNode);
      }
      const declarationResult = [];
      if (actualType === 'Integer' && type === 'Integer') {
        info.valueType = 'Number';
        if (i === 0 || lastType === null) {
          declarationResult.push('float ');
        } else if (type !== lastType) {
          throw new Error('Unhandled declaration');
        }
        lastType = type;
        declarationResult.push(`user_${utils.sanitizeName(declaration.id.name)}=`);
        declarationResult.push('float(');
        this.astGeneric(init, declarationResult);
        declarationResult.push(')');
      } else {
        info.valueType = type;
        if (i === 0 || lastType === null) {
          declarationResult.push(`${markupType} `);
        } else if (type !== lastType) {
          declarationSets.push(declarationSet.join(','));
          declarationSet = [];
          declarationResult.push(`${markupType} `);
        }
        lastType = type;
        declarationResult.push(`user_${utils.sanitizeName(declaration.id.name)}=`);
        if (actualType === 'Number' && type === 'Integer') {
          if (init.left && init.left.type === 'Literal') {
            this.astGeneric(init, declarationResult);
          } else {
            declarationResult.push('int(');
            this.astGeneric(init, declarationResult);
            declarationResult.push(')');
          }
        } else if (actualType === 'LiteralInteger' && type === 'Integer') {
          this.castLiteralToInteger(init, declarationResult);
        } else {
          this.astGeneric(init, declarationResult);
        }
      }
      declarationSet.push(declarationResult.join(''));
    }

    if (declarationSet.length > 0) {
      declarationSets.push(declarationSet.join(','));
    }

    result.push(declarationSets.join(';'));

    retArr.push(result.join(''));
    retArr.push(';');
    return retArr;
  }

  astIfStatement(ifNode, retArr) {
    retArr.push('if (');
    this.astGeneric(ifNode.test, retArr);
    retArr.push(')');
    if (ifNode.consequent.type === 'BlockStatement') {
      this.astGeneric(ifNode.consequent, retArr);
    } else {
      retArr.push(' {\n');
      this.astGeneric(ifNode.consequent, retArr);
      retArr.push('\n}\n');
    }

    if (ifNode.alternate) {
      retArr.push('else ');
      if (ifNode.alternate.type === 'BlockStatement' || ifNode.alternate.type === 'IfStatement') {
        this.astGeneric(ifNode.alternate, retArr);
      } else {
        retArr.push(' {\n');
        this.astGeneric(ifNode.alternate, retArr);
        retArr.push('\n}\n');
      }
    }
    return retArr;
  }

  astSwitchStatement(ast, retArr) {
    if (ast.type !== 'SwitchStatement') {
      throw this.astErrorOutput('Invalid switch statement', ast);
    }
    const { discriminant, cases } = ast;
    const type = this.getType(discriminant);
    const varName = `switchDiscriminant${this.astKey(ast, '_')}`;
    switch (type) {
      case 'Float':
      case 'Number':
        retArr.push(`float ${varName} = `);
        this.astGeneric(discriminant, retArr);
        retArr.push(';\n');
        break;
      case 'Integer':
        retArr.push(`int ${varName} = `);
        this.astGeneric(discriminant, retArr);
        retArr.push(';\n');
        break;
    }
    if (cases.length === 1 && !cases[0].test) {
      this.astGeneric(cases[0].consequent, retArr);
      return retArr;
    }

    let fallingThrough = false;
    let defaultResult = [];
    let movingDefaultToEnd = false;
    let pastFirstIf = false;
    for (let i = 0; i < cases.length; i++) {
      if (!cases[i].test) {
        if (cases.length > i + 1) {
          movingDefaultToEnd = true;
          this.astGeneric(cases[i].consequent, defaultResult);
          continue;
        } else {
          retArr.push(' else {\n');
        }
      } else {
        if (i === 0 || !pastFirstIf) {
          pastFirstIf = true;
          retArr.push(`if (${varName} == `);
        } else {
          if (fallingThrough) {
            retArr.push(`${varName} == `);
            fallingThrough = false;
          } else {
            retArr.push(` else if (${varName} == `);
          }
        }
        if (type === 'Integer') {
          const testType = this.getType(cases[i].test);
          switch (testType) {
            case 'Number':
            case 'Float':
              this.castValueToInteger(cases[i].test, retArr);
              break;
            case 'LiteralInteger':
              this.castLiteralToInteger(cases[i].test, retArr);
              break;
          }
        } else if (type === 'Float') {
          const testType = this.getType(cases[i].test);
          switch (testType) {
            case 'LiteralInteger':
              this.castLiteralToFloat(cases[i].test, retArr);
              break;
            case 'Integer':
              this.castValueToFloat(cases[i].test, retArr);
              break;
          }
        } else {
          throw new Error('unhanlded');
        }
        if (!cases[i].consequent || cases[i].consequent.length === 0) {
          fallingThrough = true;
          retArr.push(' || ');
          continue;
        }
        retArr.push(`) {\n`);
      }
      this.astGeneric(cases[i].consequent, retArr);
      retArr.push('\n}');
    }
    if (movingDefaultToEnd) {
      retArr.push(' else {');
      retArr.push(defaultResult.join(''));
      retArr.push('}');
    }
    return retArr;
  }

  astThisExpression(tNode, retArr) {
    retArr.push('this');
    return retArr;
  }

  astMemberExpression(mNode, retArr) {
    const {
      property,
      name,
      signature,
      origin,
      type,
      xProperty,
      yProperty,
      zProperty
    } = this.getMemberExpressionDetails(mNode);
    switch (signature) {
      case 'value.thread.value':
      case 'this.thread.value':
        if (name !== 'x' && name !== 'y' && name !== 'z') {
          throw this.astErrorOutput('Unexpected expression, expected `this.thread.x`, `this.thread.y`, or `this.thread.z`', mNode);
        }
        retArr.push(`threadId.${name}`);
        return retArr;
      case 'this.output.value':
        if (this.dynamicOutput) {
          switch (name) {
            case 'x':
              if (this.isState('casting-to-float')) {
                retArr.push('float(uOutputDim.x)');
              } else {
                retArr.push('uOutputDim.x');
              }
              break;
            case 'y':
              if (this.isState('casting-to-float')) {
                retArr.push('float(uOutputDim.y)');
              } else {
                retArr.push('uOutputDim.y');
              }
              break;
            case 'z':
              if (this.isState('casting-to-float')) {
                retArr.push('float(uOutputDim.z)');
              } else {
                retArr.push('uOutputDim.z');
              }
              break;
            default:
              throw this.astErrorOutput('Unexpected expression', mNode);
          }
        } else {
          switch (name) {
            case 'x':
              if (this.isState('casting-to-integer')) {
                retArr.push(this.output[0]);
              } else {
                retArr.push(this.output[0], '.0');
              }
              break;
            case 'y':
              if (this.isState('casting-to-integer')) {
                retArr.push(this.output[1]);
              } else {
                retArr.push(this.output[1], '.0');
              }
              break;
            case 'z':
              if (this.isState('casting-to-integer')) {
                retArr.push(this.output[2]);
              } else {
                retArr.push(this.output[2], '.0');
              }
              break;
            default:
              throw this.astErrorOutput('Unexpected expression', mNode);
          }
        }
        return retArr;
      case 'value':
        throw this.astErrorOutput('Unexpected expression', mNode);
      case 'value[]':
      case 'value[][]':
      case 'value[][][]':
      case 'value[][][][]':
      case 'value.value':
        if (origin === 'Math') {
          retArr.push(Math[name]);
          return retArr;
        }
        const cleanName = utils.sanitizeName(name);
        switch (property) {
          case 'r':
            retArr.push(`user_${ cleanName }.r`);
            return retArr;
          case 'g':
            retArr.push(`user_${ cleanName }.g`);
            return retArr;
          case 'b':
            retArr.push(`user_${ cleanName }.b`);
            return retArr;
          case 'a':
            retArr.push(`user_${ cleanName }.a`);
            return retArr;
        }
        break;
      case 'this.constants.value':
        if (typeof xProperty === 'undefined') {
          switch (type) {
            case 'Array(2)':
            case 'Array(3)':
            case 'Array(4)':
              retArr.push(`constants_${ utils.sanitizeName(name) }`);
              return retArr;
          }
        }
        case 'this.constants.value[]':
        case 'this.constants.value[][]':
        case 'this.constants.value[][][]':
        case 'this.constants.value[][][][]':
          break;
        case 'fn()[]':
          this.astCallExpression(mNode.object, retArr);
          retArr.push('[');
          retArr.push(this.memberExpressionPropertyMarkup(property));
          retArr.push(']');
          return retArr;
        case 'fn()[][]':
          this.astCallExpression(mNode.object.object, retArr);
          retArr.push('[');
          retArr.push(this.memberExpressionPropertyMarkup(mNode.object.property));
          retArr.push(']');
          retArr.push('[');
          retArr.push(this.memberExpressionPropertyMarkup(mNode.property));
          retArr.push(']');
          return retArr;
        case '[][]':
          this.astArrayExpression(mNode.object, retArr);
          retArr.push('[');
          retArr.push(this.memberExpressionPropertyMarkup(property));
          retArr.push(']');
          return retArr;
        default:
          throw this.astErrorOutput('Unexpected expression', mNode);
    }

    if (mNode.computed === false) {
      switch (type) {
        case 'Number':
        case 'Integer':
        case 'Float':
        case 'Boolean':
          retArr.push(`${origin}_${utils.sanitizeName(name)}`);
          return retArr;
      }
    }

    const markupName = `${origin}_${utils.sanitizeName(name)}`;

    switch (type) {
      case 'Array(2)':
      case 'Array(3)':
      case 'Array(4)':
        this.astGeneric(mNode.object, retArr);
        retArr.push('[');
        retArr.push(this.memberExpressionPropertyMarkup(xProperty));
        retArr.push(']');
        break;
      case 'HTMLImageArray':
        retArr.push(`getImage3D(${ markupName }, ${ markupName }Size, ${ markupName }Dim, `);
        this.memberExpressionXYZ(xProperty, yProperty, zProperty, retArr);
        retArr.push(')');
        break;
      case 'ArrayTexture(1)':
        retArr.push(`getFloatFromSampler2D(${ markupName }, ${ markupName }Size, ${ markupName }Dim, `);
        this.memberExpressionXYZ(xProperty, yProperty, zProperty, retArr);
        retArr.push(')');
        break;
      case 'Array1D(2)':
      case 'Array2D(2)':
      case 'Array3D(2)':
        retArr.push(`getMemoryOptimizedVec2(${ markupName }, ${ markupName }Size, ${ markupName }Dim, `);
        this.memberExpressionXYZ(xProperty, yProperty, zProperty, retArr);
        retArr.push(')');
        break;
      case 'ArrayTexture(2)':
        retArr.push(`getVec2FromSampler2D(${ markupName }, ${ markupName }Size, ${ markupName }Dim, `);
        this.memberExpressionXYZ(xProperty, yProperty, zProperty, retArr);
        retArr.push(')');
        break;
      case 'Array1D(3)':
      case 'Array2D(3)':
      case 'Array3D(3)':
        retArr.push(`getMemoryOptimizedVec3(${ markupName }, ${ markupName }Size, ${ markupName }Dim, `);
        this.memberExpressionXYZ(xProperty, yProperty, zProperty, retArr);
        retArr.push(')');
        break;
      case 'ArrayTexture(3)':
        retArr.push(`getVec3FromSampler2D(${ markupName }, ${ markupName }Size, ${ markupName }Dim, `);
        this.memberExpressionXYZ(xProperty, yProperty, zProperty, retArr);
        retArr.push(')');
        break;
      case 'Array1D(4)':
      case 'Array2D(4)':
      case 'Array3D(4)':
        retArr.push(`getMemoryOptimizedVec4(${ markupName }, ${ markupName }Size, ${ markupName }Dim, `);
        this.memberExpressionXYZ(xProperty, yProperty, zProperty, retArr);
        retArr.push(')');
        break;
      case 'ArrayTexture(4)':
      case 'HTMLCanvas':
      case 'OffscreenCanvas':
      case 'HTMLImage':
      case 'ImageBitmap':
      case 'ImageData':
      case 'HTMLVideo':
        retArr.push(`getVec4FromSampler2D(${ markupName }, ${ markupName }Size, ${ markupName }Dim, `);
        this.memberExpressionXYZ(xProperty, yProperty, zProperty, retArr);
        retArr.push(')');
        break;
      case 'NumberTexture':
      case 'Array':
      case 'Array2D':
      case 'Array3D':
      case 'Array4D':
      case 'Input':
      case 'Number':
      case 'Float':
      case 'Integer':
        if (this.precision === 'single') {
          retArr.push(`getMemoryOptimized32(${markupName}, ${markupName}Size, ${markupName}Dim, `);
          this.memberExpressionXYZ(xProperty, yProperty, zProperty, retArr);
          retArr.push(')');
        } else {
          const bitRatio = (origin === 'user' ?
            this.lookupFunctionArgumentBitRatio(this.name, name) :
            this.constantBitRatios[name]
          );
          switch (bitRatio) {
            case 1:
              retArr.push(`get8(${markupName}, ${markupName}Size, ${markupName}Dim, `);
              break;
            case 2:
              retArr.push(`get16(${markupName}, ${markupName}Size, ${markupName}Dim, `);
              break;
            case 4:
            case 0:
              retArr.push(`get32(${markupName}, ${markupName}Size, ${markupName}Dim, `);
              break;
            default:
              throw new Error(`unhandled bit ratio of ${bitRatio}`);
          }
          this.memberExpressionXYZ(xProperty, yProperty, zProperty, retArr);
          retArr.push(')');
        }
        break;
      case 'MemoryOptimizedNumberTexture':
        retArr.push(`getMemoryOptimized32(${ markupName }, ${ markupName }Size, ${ markupName }Dim, `);
        this.memberExpressionXYZ(xProperty, yProperty, zProperty, retArr);
        retArr.push(')');
        break;
      case 'Matrix(2)':
      case 'Matrix(3)':
      case 'Matrix(4)':
        retArr.push(`${markupName}[${this.memberExpressionPropertyMarkup(yProperty)}]`);
        if (yProperty) {
          retArr.push(`[${this.memberExpressionPropertyMarkup(xProperty)}]`);
        }
        break;
      default:
        throw new Error(`unhandled member expression "${ type }"`);
    }
    return retArr;
  }

  astCallExpression(ast, retArr) {
    if (!ast.callee) {
      throw this.astErrorOutput('Unknown CallExpression', ast);
    }

    let functionName = null;
    const isMathFunction = this.isAstMathFunction(ast);

    if (isMathFunction || (ast.callee.object && ast.callee.object.type === 'ThisExpression')) {
      functionName = ast.callee.property.name;
    }
    else if (ast.callee.type === 'SequenceExpression' && ast.callee.expressions[0].type === 'Literal' && !isNaN(ast.callee.expressions[0].raw)) {
      functionName = ast.callee.expressions[1].property.name;
    } else {
      functionName = ast.callee.name;
    }

    if (!functionName) {
      throw this.astErrorOutput(`Unhandled function, couldn't find name`, ast);
    }

    switch (functionName) {
      case 'pow':
        functionName = '_pow';
        break;
      case 'round':
        functionName = '_round';
        break;
    }

    if (this.calledFunctions.indexOf(functionName) < 0) {
      this.calledFunctions.push(functionName);
    }

    if (functionName === 'random' && this.plugins && this.plugins.length > 0) {
      for (let i = 0; i < this.plugins.length; i++) {
        const plugin = this.plugins[i];
        if (plugin.functionMatch === 'Math.random()' && plugin.functionReplace) {
          retArr.push(plugin.functionReplace);
          return retArr;
        }
      }
    }

    if (this.onFunctionCall) {
      this.onFunctionCall(this.name, functionName, ast.arguments);
    }

    retArr.push(functionName);

    retArr.push('(');

    if (isMathFunction) {
      for (let i = 0; i < ast.arguments.length; ++i) {
        const argument = ast.arguments[i];
        const argumentType = this.getType(argument);
        if (i > 0) {
          retArr.push(', ');
        }

        switch (argumentType) {
          case 'Integer':
            this.castValueToFloat(argument, retArr);
            break;
          default:
            this.astGeneric(argument, retArr);
            break;
        }
      }
    } else {
      const targetTypes = this.lookupFunctionArgumentTypes(functionName) || [];
      for (let i = 0; i < ast.arguments.length; ++i) {
        const argument = ast.arguments[i];
        let targetType = targetTypes[i];
        if (i > 0) {
          retArr.push(', ');
        }
        const argumentType = this.getType(argument);
        if (!targetType) {
          this.triggerImplyArgumentType(functionName, i, argumentType, this);
          targetType = argumentType;
        }
        switch (argumentType) {
          case 'Boolean':
            this.astGeneric(argument, retArr);
            continue;
          case 'Number':
          case 'Float':
            if (targetType === 'Integer') {
              retArr.push('int(');
              this.astGeneric(argument, retArr);
              retArr.push(')');
              continue;
            } else if (targetType === 'Number' || targetType === 'Float') {
              this.astGeneric(argument, retArr);
              continue;
            } else if (targetType === 'LiteralInteger') {
              this.castLiteralToFloat(argument, retArr);
              continue;
            }
            break;
          case 'Integer':
            if (targetType === 'Number' || targetType === 'Float') {
              retArr.push('float(');
              this.astGeneric(argument, retArr);
              retArr.push(')');
              continue;
            } else if (targetType === 'Integer') {
              this.astGeneric(argument, retArr);
              continue;
            }
            break;
          case 'LiteralInteger':
            if (targetType === 'Integer') {
              this.castLiteralToInteger(argument, retArr);
              continue;
            } else if (targetType === 'Number' || targetType === 'Float') {
              this.castLiteralToFloat(argument, retArr);
              continue;
            } else if (targetType === 'LiteralInteger') {
              this.astGeneric(argument, retArr);
              continue;
            }
            break;
          case 'Array(2)':
          case 'Array(3)':
          case 'Array(4)':
            if (targetType === argumentType) {
              if (argument.type === 'Identifier') {
                retArr.push(`user_${utils.sanitizeName(argument.name)}`);
              } else if (argument.type === 'ArrayExpression' || argument.type === 'MemberExpression' || argument.type === 'CallExpression') {
                this.astGeneric(argument, retArr);
              } else {
                throw this.astErrorOutput(`Unhandled argument type ${ argument.type }`, ast);
              }
              continue;
            }
            break;
          case 'HTMLCanvas':
          case 'OffscreenCanvas':
          case 'HTMLImage':
          case 'ImageBitmap':
          case 'ImageData':
          case 'HTMLImageArray':
          case 'HTMLVideo':
          case 'ArrayTexture(1)':
          case 'ArrayTexture(2)':
          case 'ArrayTexture(3)':
          case 'ArrayTexture(4)':
          case 'Array':
          case 'Input':
            if (targetType === argumentType) {
              if (argument.type !== 'Identifier') throw this.astErrorOutput(`Unhandled argument type ${ argument.type }`, ast);
              this.triggerImplyArgumentBitRatio(this.name, argument.name, functionName, i);
              const name = utils.sanitizeName(argument.name);
              retArr.push(`user_${name},user_${name}Size,user_${name}Dim`);
              continue;
            }
            break;
        }
        throw this.astErrorOutput(`Unhandled argument combination of ${ argumentType } and ${ targetType } for argument named "${ argument.name }"`, ast);
      }
    }
    retArr.push(')');

    return retArr;
  }

  astArrayExpression(arrNode, retArr) {
    const returnType = this.getType(arrNode);

    const arrLen = arrNode.elements.length;

    switch (returnType) {
      case 'Matrix(2)':
      case 'Matrix(3)':
      case 'Matrix(4)':
        retArr.push(`mat${arrLen}(`);
        break;
      default:
        retArr.push(`vec${arrLen}(`);
    }
    for (let i = 0; i < arrLen; ++i) {
      if (i > 0) {
        retArr.push(', ');
      }
      const subNode = arrNode.elements[i];
      this.astGeneric(subNode, retArr);
    }
    retArr.push(')');

    return retArr;
  }

  memberExpressionXYZ(x, y, z, retArr) {
    if (z) {
      retArr.push(this.memberExpressionPropertyMarkup(z), ', ');
    } else {
      retArr.push('0, ');
    }
    if (y) {
      retArr.push(this.memberExpressionPropertyMarkup(y), ', ');
    } else {
      retArr.push('0, ');
    }
    retArr.push(this.memberExpressionPropertyMarkup(x));
    return retArr;
  }

  memberExpressionPropertyMarkup(property) {
    if (!property) {
      throw new Error('Property not set');
    }
    const type = this.getType(property);
    const result = [];
    switch (type) {
      case 'Number':
      case 'Float':
        this.castValueToInteger(property, result);
        break;
      case 'LiteralInteger':
        this.castLiteralToInteger(property, result);
        break;
      default:
        this.astGeneric(property, result);
    }
    return result.join('');
  }
}

const typeMap = {
  'Array': 'sampler2D',
  'Array(2)': 'vec2',
  'Array(3)': 'vec3',
  'Array(4)': 'vec4',
  'Matrix(2)': 'mat2',
  'Matrix(3)': 'mat3',
  'Matrix(4)': 'mat4',
  'Array2D': 'sampler2D',
  'Array3D': 'sampler2D',
  'Boolean': 'bool',
  'Float': 'float',
  'Input': 'sampler2D',
  'Integer': 'int',
  'Number': 'float',
  'LiteralInteger': 'float',
  'NumberTexture': 'sampler2D',
  'MemoryOptimizedNumberTexture': 'sampler2D',
  'ArrayTexture(1)': 'sampler2D',
  'ArrayTexture(2)': 'sampler2D',
  'ArrayTexture(3)': 'sampler2D',
  'ArrayTexture(4)': 'sampler2D',
  'HTMLVideo': 'sampler2D',
  'HTMLCanvas': 'sampler2D',
  'OffscreenCanvas': 'sampler2D',
  'HTMLImage': 'sampler2D',
  'ImageBitmap': 'sampler2D',
  'ImageData': 'sampler2D',
  'HTMLImageArray': 'sampler2DArray',
};

const operatorMap = {
  '===': '==',
  '!==': '!='
};

module.exports = {
  WebGLFunctionNode
};
},{"../../utils":114,"../function-node":10}],39:[function(require,module,exports){
const { WebGLKernelValueBoolean } = require('./kernel-value/boolean');
const { WebGLKernelValueFloat } = require('./kernel-value/float');
const { WebGLKernelValueInteger } = require('./kernel-value/integer');

const { WebGLKernelValueHTMLImage } = require('./kernel-value/html-image');
const { WebGLKernelValueDynamicHTMLImage } = require('./kernel-value/dynamic-html-image');

const { WebGLKernelValueHTMLVideo } = require('./kernel-value/html-video');
const { WebGLKernelValueDynamicHTMLVideo } = require('./kernel-value/dynamic-html-video');

const { WebGLKernelValueSingleInput } = require('./kernel-value/single-input');
const { WebGLKernelValueDynamicSingleInput } = require('./kernel-value/dynamic-single-input');

const { WebGLKernelValueUnsignedInput } = require('./kernel-value/unsigned-input');
const { WebGLKernelValueDynamicUnsignedInput } = require('./kernel-value/dynamic-unsigned-input');

const { WebGLKernelValueMemoryOptimizedNumberTexture } = require('./kernel-value/memory-optimized-number-texture');
const { WebGLKernelValueDynamicMemoryOptimizedNumberTexture } = require('./kernel-value/dynamic-memory-optimized-number-texture');

const { WebGLKernelValueNumberTexture } = require('./kernel-value/number-texture');
const { WebGLKernelValueDynamicNumberTexture } = require('./kernel-value/dynamic-number-texture');

const { WebGLKernelValueSingleArray } = require('./kernel-value/single-array');
const { WebGLKernelValueDynamicSingleArray } = require('./kernel-value/dynamic-single-array');

const { WebGLKernelValueSingleArray1DI } = require('./kernel-value/single-array1d-i');
const { WebGLKernelValueDynamicSingleArray1DI } = require('./kernel-value/dynamic-single-array1d-i');

const { WebGLKernelValueSingleArray2DI } = require('./kernel-value/single-array2d-i');
const { WebGLKernelValueDynamicSingleArray2DI } = require('./kernel-value/dynamic-single-array2d-i');

const { WebGLKernelValueSingleArray3DI } = require('./kernel-value/single-array3d-i');
const { WebGLKernelValueDynamicSingleArray3DI } = require('./kernel-value/dynamic-single-array3d-i');

const { WebGLKernelValueArray2 } = require('./kernel-value/array2');
const { WebGLKernelValueArray3 } = require('./kernel-value/array3');
const { WebGLKernelValueArray4 } = require('./kernel-value/array4');

const { WebGLKernelValueUnsignedArray } = require('./kernel-value/unsigned-array');
const { WebGLKernelValueDynamicUnsignedArray } = require('./kernel-value/dynamic-unsigned-array');

const kernelValueMaps = {
  unsigned: {
    dynamic: {
      'Boolean': WebGLKernelValueBoolean,
      'Integer': WebGLKernelValueInteger,
      'Float': WebGLKernelValueFloat,
      'Array': WebGLKernelValueDynamicUnsignedArray,
      'Array(2)': WebGLKernelValueArray2,
      'Array(3)': WebGLKernelValueArray3,
      'Array(4)': WebGLKernelValueArray4,
      'Array1D(2)': false,
      'Array1D(3)': false,
      'Array1D(4)': false,
      'Array2D(2)': false,
      'Array2D(3)': false,
      'Array2D(4)': false,
      'Array3D(2)': false,
      'Array3D(3)': false,
      'Array3D(4)': false,
      'Input': WebGLKernelValueDynamicUnsignedInput,
      'NumberTexture': WebGLKernelValueDynamicNumberTexture,
      'ArrayTexture(1)': WebGLKernelValueDynamicNumberTexture,
      'ArrayTexture(2)': WebGLKernelValueDynamicNumberTexture,
      'ArrayTexture(3)': WebGLKernelValueDynamicNumberTexture,
      'ArrayTexture(4)': WebGLKernelValueDynamicNumberTexture,
      'MemoryOptimizedNumberTexture': WebGLKernelValueDynamicMemoryOptimizedNumberTexture,
      'HTMLCanvas': WebGLKernelValueDynamicHTMLImage,
      'OffscreenCanvas': WebGLKernelValueDynamicHTMLImage,
      'HTMLImage': WebGLKernelValueDynamicHTMLImage,
      'ImageBitmap': WebGLKernelValueDynamicHTMLImage,
      'ImageData': WebGLKernelValueDynamicHTMLImage,
      'HTMLImageArray': false,
      'HTMLVideo': WebGLKernelValueDynamicHTMLVideo,
    },
    static: {
      'Boolean': WebGLKernelValueBoolean,
      'Float': WebGLKernelValueFloat,
      'Integer': WebGLKernelValueInteger,
      'Array': WebGLKernelValueUnsignedArray,
      'Array(2)': WebGLKernelValueArray2,
      'Array(3)': WebGLKernelValueArray3,
      'Array(4)': WebGLKernelValueArray4,
      'Array1D(2)': false,
      'Array1D(3)': false,
      'Array1D(4)': false,
      'Array2D(2)': false,
      'Array2D(3)': false,
      'Array2D(4)': false,
      'Array3D(2)': false,
      'Array3D(3)': false,
      'Array3D(4)': false,
      'Input': WebGLKernelValueUnsignedInput,
      'NumberTexture': WebGLKernelValueNumberTexture,
      'ArrayTexture(1)': WebGLKernelValueNumberTexture,
      'ArrayTexture(2)': WebGLKernelValueNumberTexture,
      'ArrayTexture(3)': WebGLKernelValueNumberTexture,
      'ArrayTexture(4)': WebGLKernelValueNumberTexture,
      'MemoryOptimizedNumberTexture': WebGLKernelValueMemoryOptimizedNumberTexture,
      'HTMLCanvas': WebGLKernelValueHTMLImage,
      'OffscreenCanvas': WebGLKernelValueHTMLImage,
      'HTMLImage': WebGLKernelValueHTMLImage,
      'ImageBitmap': WebGLKernelValueHTMLImage,
      'ImageData': WebGLKernelValueHTMLImage,
      'HTMLImageArray': false,
      'HTMLVideo': WebGLKernelValueHTMLVideo,
    }
  },
  single: {
    dynamic: {
      'Boolean': WebGLKernelValueBoolean,
      'Integer': WebGLKernelValueInteger,
      'Float': WebGLKernelValueFloat,
      'Array': WebGLKernelValueDynamicSingleArray,
      'Array(2)': WebGLKernelValueArray2,
      'Array(3)': WebGLKernelValueArray3,
      'Array(4)': WebGLKernelValueArray4,
      'Array1D(2)': WebGLKernelValueDynamicSingleArray1DI,
      'Array1D(3)': WebGLKernelValueDynamicSingleArray1DI,
      'Array1D(4)': WebGLKernelValueDynamicSingleArray1DI,
      'Array2D(2)': WebGLKernelValueDynamicSingleArray2DI,
      'Array2D(3)': WebGLKernelValueDynamicSingleArray2DI,
      'Array2D(4)': WebGLKernelValueDynamicSingleArray2DI,
      'Array3D(2)': WebGLKernelValueDynamicSingleArray3DI,
      'Array3D(3)': WebGLKernelValueDynamicSingleArray3DI,
      'Array3D(4)': WebGLKernelValueDynamicSingleArray3DI,
      'Input': WebGLKernelValueDynamicSingleInput,
      'NumberTexture': WebGLKernelValueDynamicNumberTexture,
      'ArrayTexture(1)': WebGLKernelValueDynamicNumberTexture,
      'ArrayTexture(2)': WebGLKernelValueDynamicNumberTexture,
      'ArrayTexture(3)': WebGLKernelValueDynamicNumberTexture,
      'ArrayTexture(4)': WebGLKernelValueDynamicNumberTexture,
      'MemoryOptimizedNumberTexture': WebGLKernelValueDynamicMemoryOptimizedNumberTexture,
      'HTMLCanvas': WebGLKernelValueDynamicHTMLImage,
      'OffscreenCanvas': WebGLKernelValueDynamicHTMLImage,
      'HTMLImage': WebGLKernelValueDynamicHTMLImage,
      'ImageBitmap': WebGLKernelValueDynamicHTMLImage,
      'ImageData': WebGLKernelValueDynamicHTMLImage,
      'HTMLImageArray': false,
      'HTMLVideo': WebGLKernelValueDynamicHTMLVideo,
    },
    static: {
      'Boolean': WebGLKernelValueBoolean,
      'Float': WebGLKernelValueFloat,
      'Integer': WebGLKernelValueInteger,
      'Array': WebGLKernelValueSingleArray,
      'Array(2)': WebGLKernelValueArray2,
      'Array(3)': WebGLKernelValueArray3,
      'Array(4)': WebGLKernelValueArray4,
      'Array1D(2)': WebGLKernelValueSingleArray1DI,
      'Array1D(3)': WebGLKernelValueSingleArray1DI,
      'Array1D(4)': WebGLKernelValueSingleArray1DI,
      'Array2D(2)': WebGLKernelValueSingleArray2DI,
      'Array2D(3)': WebGLKernelValueSingleArray2DI,
      'Array2D(4)': WebGLKernelValueSingleArray2DI,
      'Array3D(2)': WebGLKernelValueSingleArray3DI,
      'Array3D(3)': WebGLKernelValueSingleArray3DI,
      'Array3D(4)': WebGLKernelValueSingleArray3DI,
      'Input': WebGLKernelValueSingleInput,
      'NumberTexture': WebGLKernelValueNumberTexture,
      'ArrayTexture(1)': WebGLKernelValueNumberTexture,
      'ArrayTexture(2)': WebGLKernelValueNumberTexture,
      'ArrayTexture(3)': WebGLKernelValueNumberTexture,
      'ArrayTexture(4)': WebGLKernelValueNumberTexture,
      'MemoryOptimizedNumberTexture': WebGLKernelValueMemoryOptimizedNumberTexture,
      'HTMLCanvas': WebGLKernelValueHTMLImage,
      'OffscreenCanvas': WebGLKernelValueHTMLImage,
      'HTMLImage': WebGLKernelValueHTMLImage,
      'ImageBitmap': WebGLKernelValueHTMLImage,
      'ImageData': WebGLKernelValueHTMLImage,
      'HTMLImageArray': false,
      'HTMLVideo': WebGLKernelValueHTMLVideo,
    }
  },
};

function lookupKernelValueType(type, dynamic, precision, value) {
  if (!type) {
    throw new Error('type missing');
  }
  if (!dynamic) {
    throw new Error('dynamic missing');
  }
  if (!precision) {
    throw new Error('precision missing');
  }
  if (value.type) {
    type = value.type;
  }
  const types = kernelValueMaps[precision][dynamic];
  if (types[type] === false) {
    return null;
  } else if (types[type] === undefined) {
    throw new Error(`Could not find a KernelValue for ${ type }`);
  }
  return types[type];
}

module.exports = {
  lookupKernelValueType,
  kernelValueMaps,
};
},{"./kernel-value/array2":41,"./kernel-value/array3":42,"./kernel-value/array4":43,"./kernel-value/boolean":44,"./kernel-value/dynamic-html-image":45,"./kernel-value/dynamic-html-video":46,"./kernel-value/dynamic-memory-optimized-number-texture":47,"./kernel-value/dynamic-number-texture":48,"./kernel-value/dynamic-single-array":49,"./kernel-value/dynamic-single-array1d-i":50,"./kernel-value/dynamic-single-array2d-i":51,"./kernel-value/dynamic-single-array3d-i":52,"./kernel-value/dynamic-single-input":53,"./kernel-value/dynamic-unsigned-array":54,"./kernel-value/dynamic-unsigned-input":55,"./kernel-value/float":56,"./kernel-value/html-image":57,"./kernel-value/html-video":58,"./kernel-value/integer":60,"./kernel-value/memory-optimized-number-texture":61,"./kernel-value/number-texture":62,"./kernel-value/single-array":63,"./kernel-value/single-array1d-i":64,"./kernel-value/single-array2d-i":65,"./kernel-value/single-array3d-i":66,"./kernel-value/single-input":67,"./kernel-value/unsigned-array":68,"./kernel-value/unsigned-input":69}],40:[function(require,module,exports){
const { WebGLKernelValue } = require('./index');
const { Input } = require('../../../input');

class WebGLKernelArray extends WebGLKernelValue {
  checkSize(width, height) {
    if (!this.kernel.validate) return;
    const { maxTextureSize } = this.kernel.constructor.features;
    if (width > maxTextureSize || height > maxTextureSize) {
      if (width > height) {
        throw new Error(`Argument texture width of ${width} larger than maximum size of ${maxTextureSize} for your GPU`);
      } else if (width < height) {
        throw new Error(`Argument texture height of ${height} larger than maximum size of ${maxTextureSize} for your GPU`);
      } else {
        throw new Error(`Argument texture height and width of ${height} larger than maximum size of ${maxTextureSize} for your GPU`);
      }
    }
  }

  setup() {
    this.requestTexture();
    this.setupTexture();
    this.defineTexture();
  }

  requestTexture() {
    this.texture = this.onRequestTexture();
  }

  defineTexture() {
    const { context: gl } = this;
    gl.activeTexture(this.contextHandle);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  }

  setupTexture() {
    this.contextHandle = this.onRequestContextHandle();
    this.index = this.onRequestIndex();
    this.dimensionsId = this.id + 'Dim';
    this.sizeId = this.id + 'Size';
  }

  getBitRatio(value) {
    if (Array.isArray(value[0])) {
      return this.getBitRatio(value[0]);
    } else if (value.constructor === Input) {
      return this.getBitRatio(value.value);
    }
    switch (value.constructor) {
      case Uint8ClampedArray:
      case Uint8Array:
      case Int8Array:
        return 1;
      case Uint16Array:
      case Int16Array:
        return 2;
      case Float32Array:
      case Int32Array:
      default:
        return 4;
    }
  }

  destroy() {
    if (this.prevArg) {
      this.prevArg.delete();
    }
    this.context.deleteTexture(this.texture);
  }
}

module.exports = {
  WebGLKernelArray
};
},{"../../../input":110,"./index":59}],41:[function(require,module,exports){
const { WebGLKernelValue } = require('./index');

class WebGLKernelValueArray2 extends WebGLKernelValue {
  constructor(value, settings) {
    super(value, settings);
    this.uploadValue = value;
  }
  getSource(value) {
    if (this.origin === 'constants') {
      return `const vec2 ${this.id} = vec2(${value[0]},${value[1]});\n`;
    }
    return `uniform vec2 ${this.id};\n`;
  }

  getStringValueHandler() {
    if (this.origin === 'constants') return '';
    return `const uploadValue_${this.name} = ${this.varName};\n`;
  }

  updateValue(value) {
    if (this.origin === 'constants') return;
    this.kernel.setUniform2fv(this.id, this.uploadValue = value);
  }
}

module.exports = {
  WebGLKernelValueArray2
};
},{"./index":59}],42:[function(require,module,exports){
const { WebGLKernelValue } = require('./index');

class WebGLKernelValueArray3 extends WebGLKernelValue {
  constructor(value, settings) {
    super(value, settings);
    this.uploadValue = value;
  }
  getSource(value) {
    if (this.origin === 'constants') {
      return `const vec3 ${this.id} = vec3(${value[0]},${value[1]},${value[2]});\n`;
    }
    return `uniform vec3 ${this.id};\n`;
  }

  getStringValueHandler() {
    if (this.origin === 'constants') return '';
    return `const uploadValue_${this.name} = ${this.varName};\n`;
  }

  updateValue(value) {
    if (this.origin === 'constants') return;
    this.kernel.setUniform3fv(this.id, this.uploadValue = value);
  }
}

module.exports = {
  WebGLKernelValueArray3
};
},{"./index":59}],43:[function(require,module,exports){
const { WebGLKernelValue } = require('./index');

class WebGLKernelValueArray4 extends WebGLKernelValue {
  constructor(value, settings) {
    super(value, settings);
    this.uploadValue = value;
  }
  getSource(value) {
    if (this.origin === 'constants') {
      return `const vec4 ${this.id} = vec4(${value[0]},${value[1]},${value[2]},${value[3]});\n`;
    }
    return `uniform vec4 ${this.id};\n`;
  }

  getStringValueHandler() {
    if (this.origin === 'constants') return '';
    return `const uploadValue_${this.name} = ${this.varName};\n`;
  }

  updateValue(value) {
    if (this.origin === 'constants') return;
    this.kernel.setUniform4fv(this.id, this.uploadValue = value);
  }
}

module.exports = {
  WebGLKernelValueArray4
};
},{"./index":59}],44:[function(require,module,exports){
require('../../../utils');
const { WebGLKernelValue } = require('./index');

class WebGLKernelValueBoolean extends WebGLKernelValue {
  constructor(value, settings) {
    super(value, settings);
    this.uploadValue = value;
  }
  getSource(value) {
    if (this.origin === 'constants') {
      return `const bool ${this.id} = ${value};\n`;
    }
    return `uniform bool ${this.id};\n`;
  }

  getStringValueHandler() {
    return `const uploadValue_${this.name} = ${this.varName};\n`;
  }

  updateValue(value) {
    if (this.origin === 'constants') return;
    this.kernel.setUniform1i(this.id, this.uploadValue = value);
  }
}

module.exports = {
  WebGLKernelValueBoolean
};
},{"../../../utils":114,"./index":59}],45:[function(require,module,exports){
const { utils } = require('../../../utils');
const { WebGLKernelValueHTMLImage } = require('./html-image');

class WebGLKernelValueDynamicHTMLImage extends WebGLKernelValueHTMLImage {
  getSource() {
    return utils.linesToString([
      `uniform sampler2D ${this.id}`,
      `uniform ivec2 ${this.sizeId}`,
      `uniform ivec3 ${this.dimensionsId}`,
    ]);
  }

  updateValue(value) {
    const { width, height } = value;
    this.checkSize(width, height);
    this.dimensions = [width, height, 1];
    this.textureSize = [width, height];
    this.kernel.setUniform3iv(this.dimensionsId, this.dimensions);
    this.kernel.setUniform2iv(this.sizeId, this.textureSize);
    super.updateValue(value);
  }
}

module.exports = {
  WebGLKernelValueDynamicHTMLImage
};
},{"../../../utils":114,"./html-image":57}],46:[function(require,module,exports){
const { WebGLKernelValueDynamicHTMLImage } = require('./dynamic-html-image');

class WebGLKernelValueDynamicHTMLVideo extends WebGLKernelValueDynamicHTMLImage {}

module.exports = {
  WebGLKernelValueDynamicHTMLVideo
};
},{"./dynamic-html-image":45}],47:[function(require,module,exports){
const { utils } = require('../../../utils');
const { WebGLKernelValueMemoryOptimizedNumberTexture } = require('./memory-optimized-number-texture');

class WebGLKernelValueDynamicMemoryOptimizedNumberTexture extends WebGLKernelValueMemoryOptimizedNumberTexture {
  getSource() {
    return utils.linesToString([
      `uniform sampler2D ${this.id}`,
      `uniform ivec2 ${this.sizeId}`,
      `uniform ivec3 ${this.dimensionsId}`,
    ]);
  }

  updateValue(inputTexture) {
    this.dimensions = inputTexture.dimensions;
    this.checkSize(inputTexture.size[0], inputTexture.size[1]);
    this.textureSize = inputTexture.size;
    this.kernel.setUniform3iv(this.dimensionsId, this.dimensions);
    this.kernel.setUniform2iv(this.sizeId, this.textureSize);
    super.updateValue(inputTexture);
  }
}

module.exports = {
  WebGLKernelValueDynamicMemoryOptimizedNumberTexture
};
},{"../../../utils":114,"./memory-optimized-number-texture":61}],48:[function(require,module,exports){
const { utils } = require('../../../utils');
const { WebGLKernelValueNumberTexture } = require('./number-texture');

class WebGLKernelValueDynamicNumberTexture extends WebGLKernelValueNumberTexture {
  getSource() {
    return utils.linesToString([
      `uniform sampler2D ${this.id}`,
      `uniform ivec2 ${this.sizeId}`,
      `uniform ivec3 ${this.dimensionsId}`,
    ]);
  }

  updateValue(value) {
    this.dimensions = value.dimensions;
    this.checkSize(value.size[0], value.size[1]);
    this.textureSize = value.size;
    this.kernel.setUniform3iv(this.dimensionsId, this.dimensions);
    this.kernel.setUniform2iv(this.sizeId, this.textureSize);
    super.updateValue(value);
  }
}

module.exports = {
  WebGLKernelValueDynamicNumberTexture
};
},{"../../../utils":114,"./number-texture":62}],49:[function(require,module,exports){
const { utils } = require('../../../utils');
const { WebGLKernelValueSingleArray } = require('./single-array');

class WebGLKernelValueDynamicSingleArray extends WebGLKernelValueSingleArray {
  getSource() {
    return utils.linesToString([
      `uniform sampler2D ${this.id}`,
      `uniform ivec2 ${this.sizeId}`,
      `uniform ivec3 ${this.dimensionsId}`,
    ]);
  }

  updateValue(value) {
    this.dimensions = utils.getDimensions(value, true);
    this.textureSize = utils.getMemoryOptimizedFloatTextureSize(this.dimensions, this.bitRatio);
    this.uploadArrayLength = this.textureSize[0] * this.textureSize[1] * this.bitRatio;
    this.checkSize(this.textureSize[0], this.textureSize[1]);
    this.uploadValue = new Float32Array(this.uploadArrayLength);
    this.kernel.setUniform3iv(this.dimensionsId, this.dimensions);
    this.kernel.setUniform2iv(this.sizeId, this.textureSize);
    super.updateValue(value);
  }
}

module.exports = {
  WebGLKernelValueDynamicSingleArray
};
},{"../../../utils":114,"./single-array":63}],50:[function(require,module,exports){
const { utils } = require('../../../utils');
const { WebGLKernelValueSingleArray1DI } = require('./single-array1d-i');

class WebGLKernelValueDynamicSingleArray1DI extends WebGLKernelValueSingleArray1DI {
  getSource() {
    return utils.linesToString([
      `uniform sampler2D ${this.id}`,
      `uniform ivec2 ${this.sizeId}`,
      `uniform ivec3 ${this.dimensionsId}`,
    ]);
  }

  updateValue(value) {
    this.setShape(value);
    this.kernel.setUniform3iv(this.dimensionsId, this.dimensions);
    this.kernel.setUniform2iv(this.sizeId, this.textureSize);
    super.updateValue(value);
  }
}

module.exports = {
  WebGLKernelValueDynamicSingleArray1DI
};
},{"../../../utils":114,"./single-array1d-i":64}],51:[function(require,module,exports){
const { utils } = require('../../../utils');
const { WebGLKernelValueSingleArray2DI } = require('./single-array2d-i');

class WebGLKernelValueDynamicSingleArray2DI extends WebGLKernelValueSingleArray2DI {
  getSource() {
    return utils.linesToString([
      `uniform sampler2D ${this.id}`,
      `uniform ivec2 ${this.sizeId}`,
      `uniform ivec3 ${this.dimensionsId}`,
    ]);
  }

  updateValue(value) {
    this.setShape(value);
    this.kernel.setUniform3iv(this.dimensionsId, this.dimensions);
    this.kernel.setUniform2iv(this.sizeId, this.textureSize);
    super.updateValue(value);
  }
}

module.exports = {
  WebGLKernelValueDynamicSingleArray2DI
};
},{"../../../utils":114,"./single-array2d-i":65}],52:[function(require,module,exports){
const { utils } = require('../../../utils');
const { WebGLKernelValueSingleArray3DI } = require('./single-array3d-i');

class WebGLKernelValueDynamicSingleArray3DI extends WebGLKernelValueSingleArray3DI {
  getSource() {
    return utils.linesToString([
      `uniform sampler2D ${this.id}`,
      `uniform ivec2 ${this.sizeId}`,
      `uniform ivec3 ${this.dimensionsId}`,
    ]);
  }

  updateValue(value) {
    this.setShape(value);
    this.kernel.setUniform3iv(this.dimensionsId, this.dimensions);
    this.kernel.setUniform2iv(this.sizeId, this.textureSize);
    super.updateValue(value);
  }
}

module.exports = {
  WebGLKernelValueDynamicSingleArray3DI
};
},{"../../../utils":114,"./single-array3d-i":66}],53:[function(require,module,exports){
const { utils } = require('../../../utils');
const { WebGLKernelValueSingleInput } = require('./single-input');

class WebGLKernelValueDynamicSingleInput extends WebGLKernelValueSingleInput {
  getSource() {
    return utils.linesToString([
      `uniform sampler2D ${this.id}`,
      `uniform ivec2 ${this.sizeId}`,
      `uniform ivec3 ${this.dimensionsId}`,
    ]);
  }

  updateValue(value) {
    let [w, h, d] = value.size;
    this.dimensions = new Int32Array([w || 1, h || 1, d || 1]);
    this.textureSize = utils.getMemoryOptimizedFloatTextureSize(this.dimensions, this.bitRatio);
    this.uploadArrayLength = this.textureSize[0] * this.textureSize[1] * this.bitRatio;
    this.checkSize(this.textureSize[0], this.textureSize[1]);
    this.uploadValue = new Float32Array(this.uploadArrayLength);
    this.kernel.setUniform3iv(this.dimensionsId, this.dimensions);
    this.kernel.setUniform2iv(this.sizeId, this.textureSize);
    super.updateValue(value);
  }
}

module.exports = {
  WebGLKernelValueDynamicSingleInput
};
},{"../../../utils":114,"./single-input":67}],54:[function(require,module,exports){
const { utils } = require('../../../utils');
const { WebGLKernelValueUnsignedArray } = require('./unsigned-array');

class WebGLKernelValueDynamicUnsignedArray extends WebGLKernelValueUnsignedArray {
  getSource() {
    return utils.linesToString([
      `uniform sampler2D ${this.id}`,
      `uniform ivec2 ${this.sizeId}`,
      `uniform ivec3 ${this.dimensionsId}`,
    ]);
  }

  updateValue(value) {
    this.dimensions = utils.getDimensions(value, true);
    this.textureSize = utils.getMemoryOptimizedPackedTextureSize(this.dimensions, this.bitRatio);
    this.uploadArrayLength = this.textureSize[0] * this.textureSize[1] * (4 / this.bitRatio);
    this.checkSize(this.textureSize[0], this.textureSize[1]);
    const Type = this.getTransferArrayType(value);
    this.preUploadValue = new Type(this.uploadArrayLength);
    this.uploadValue = new Uint8Array(this.preUploadValue.buffer);
    this.kernel.setUniform3iv(this.dimensionsId, this.dimensions);
    this.kernel.setUniform2iv(this.sizeId, this.textureSize);
    super.updateValue(value);
  }
}

module.exports = {
  WebGLKernelValueDynamicUnsignedArray
};
},{"../../../utils":114,"./unsigned-array":68}],55:[function(require,module,exports){
const { utils } = require('../../../utils');
const { WebGLKernelValueUnsignedInput } = require('./unsigned-input');

class WebGLKernelValueDynamicUnsignedInput extends WebGLKernelValueUnsignedInput {
  getSource() {
    return utils.linesToString([
      `uniform sampler2D ${this.id}`,
      `uniform ivec2 ${this.sizeId}`,
      `uniform ivec3 ${this.dimensionsId}`,
    ]);
  }

  updateValue(value) {
    let [w, h, d] = value.size;
    this.dimensions = new Int32Array([w || 1, h || 1, d || 1]);
    this.textureSize = utils.getMemoryOptimizedPackedTextureSize(this.dimensions, this.bitRatio);
    this.uploadArrayLength = this.textureSize[0] * this.textureSize[1] * (4 / this.bitRatio);
    this.checkSize(this.textureSize[0], this.textureSize[1]);
    const Type = this.getTransferArrayType(value.value);
    this.preUploadValue = new Type(this.uploadArrayLength);
    this.uploadValue = new Uint8Array(this.preUploadValue.buffer);
    this.kernel.setUniform3iv(this.dimensionsId, this.dimensions);
    this.kernel.setUniform2iv(this.sizeId, this.textureSize);
    super.updateValue(value);
  }
}

module.exports = {
  WebGLKernelValueDynamicUnsignedInput
};
},{"../../../utils":114,"./unsigned-input":69}],56:[function(require,module,exports){
require('../../../utils');
const { WebGLKernelValue } = require('./index');

class WebGLKernelValueFloat extends WebGLKernelValue {
  constructor(value, settings) {
    super(value, settings);
    this.uploadValue = value;
  }
  getStringValueHandler() {
    return `const uploadValue_${this.name} = ${this.varName};\n`;
  }
  getSource(value) {
    if (this.origin === 'constants') {
      if (Number.isInteger(value)) {
        return `const float ${this.id} = ${value}.0;\n`;
      }
      return `const float ${this.id} = ${value};\n`;
    }
    return `uniform float ${this.id};\n`;
  }

  updateValue(value) {
    if (this.origin === 'constants') return;
    this.kernel.setUniform1f(this.id, this.uploadValue = value);
  }
}

module.exports = {
  WebGLKernelValueFloat
};
},{"../../../utils":114,"./index":59}],57:[function(require,module,exports){
const { utils } = require('../../../utils');
const { WebGLKernelArray } = require('./array');

class WebGLKernelValueHTMLImage extends WebGLKernelArray {
  constructor(value, settings) {
    super(value, settings);
    const { width, height } = value;
    this.checkSize(width, height);
    this.dimensions = [width, height, 1];
    this.textureSize = [width, height];
    this.uploadValue = value;
  }

  getStringValueHandler() {
    return `const uploadValue_${this.name} = ${this.varName};\n`;
  }

  getSource() {
    return utils.linesToString([
      `uniform sampler2D ${this.id}`,
      `ivec2 ${this.sizeId} = ivec2(${this.textureSize[0]}, ${this.textureSize[1]})`,
      `ivec3 ${this.dimensionsId} = ivec3(${this.dimensions[0]}, ${this.dimensions[1]}, ${this.dimensions[2]})`,
    ]);
  }

  updateValue(inputImage) {
    if (inputImage.constructor !== this.initialValueConstructor) {
      this.onUpdateValueMismatch(inputImage.constructor);
      return;
    }
    const { context: gl } = this;
    gl.activeTexture(this.contextHandle);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.uploadValue = inputImage);
    this.kernel.setUniform1i(this.id, this.index);
  }
}

module.exports = {
  WebGLKernelValueHTMLImage
};
},{"../../../utils":114,"./array":40}],58:[function(require,module,exports){
const { WebGLKernelValueHTMLImage } = require('./html-image');

class WebGLKernelValueHTMLVideo extends WebGLKernelValueHTMLImage {}

module.exports = {
  WebGLKernelValueHTMLVideo
};
},{"./html-image":57}],59:[function(require,module,exports){
const { utils } = require('../../../utils');
const { KernelValue } = require('../../kernel-value');

class WebGLKernelValue extends KernelValue {
  constructor(value, settings) {
    super(value, settings);
    this.dimensionsId = null;
    this.sizeId = null;
    this.initialValueConstructor = value.constructor;
    this.onRequestTexture = settings.onRequestTexture;
    this.onRequestIndex = settings.onRequestIndex;
    this.uploadValue = null;
    this.textureSize = null;
    this.bitRatio = null;
    this.prevArg = null;
  }

  get id() {
    return `${this.origin}_${utils.sanitizeName(this.name)}`;
  }

  setup() {}

  getTransferArrayType(value) {
    if (Array.isArray(value[0])) {
      return this.getTransferArrayType(value[0]);
    }
    switch (value.constructor) {
      case Array:
      case Int32Array:
      case Int16Array:
      case Int8Array:
        return Float32Array;
      case Uint8ClampedArray:
      case Uint8Array:
      case Uint16Array:
      case Uint32Array:
      case Float32Array:
      case Float64Array:
        return value.constructor;
    }
    console.warn('Unfamiliar constructor type.  Will go ahead and use, but likley this may result in a transfer of zeros');
    return value.constructor;
  }

  getStringValueHandler() {
    throw new Error(`"getStringValueHandler" not implemented on ${this.constructor.name}`);
  }

  getVariablePrecisionString() {
    return this.kernel.getVariablePrecisionString(this.textureSize || undefined, this.tactic || undefined);
  }

  destroy() {}
}

module.exports = {
  WebGLKernelValue
};
},{"../../../utils":114,"../../kernel-value":35}],60:[function(require,module,exports){
require('../../../utils');
const { WebGLKernelValue } = require('./index');

class WebGLKernelValueInteger extends WebGLKernelValue {
  constructor(value, settings) {
    super(value, settings);
    this.uploadValue = value;
  }
  getStringValueHandler() {
    return `const uploadValue_${this.name} = ${this.varName};\n`;
  }
  getSource(value) {
    if (this.origin === 'constants') {
      return `const int ${this.id} = ${ parseInt(value) };\n`;
    }
    return `uniform int ${this.id};\n`;
  }

  updateValue(value) {
    if (this.origin === 'constants') return;
    this.kernel.setUniform1i(this.id, this.uploadValue = value);
  }
}

module.exports = {
  WebGLKernelValueInteger
};
},{"../../../utils":114,"./index":59}],61:[function(require,module,exports){
const { utils } = require('../../../utils');
const { WebGLKernelArray } = require('./array');

const sameError = `Source and destination textures are the same.  Use immutable = true and manually cleanup kernel output texture memory with texture.delete()`;

class WebGLKernelValueMemoryOptimizedNumberTexture extends WebGLKernelArray {
  constructor(value, settings) {
    super(value, settings);
    const [width, height] = value.size;
    this.checkSize(width, height);
    this.dimensions = value.dimensions;
    this.textureSize = value.size;
    this.uploadValue = value.texture;
    this.forceUploadEachRun = true;
  }

  setup() {
    this.setupTexture();
  }

  getStringValueHandler() {
    return `const uploadValue_${this.name} = ${this.varName}.texture;\n`;
  }

  getSource() {
    return utils.linesToString([
      `uniform sampler2D ${this.id}`,
      `ivec2 ${this.sizeId} = ivec2(${this.textureSize[0]}, ${this.textureSize[1]})`,
      `ivec3 ${this.dimensionsId} = ivec3(${this.dimensions[0]}, ${this.dimensions[1]}, ${this.dimensions[2]})`,
    ]);
  }

  updateValue(inputTexture) {
    if (inputTexture.constructor !== this.initialValueConstructor) {
      this.onUpdateValueMismatch(inputTexture.constructor);
      return;
    }
    if (this.checkContext && inputTexture.context !== this.context) {
      throw new Error(`Value ${this.name} (${this.type}) must be from same context`);
    }

    const { kernel, context: gl } = this;
    if (kernel.pipeline) {
      if (kernel.immutable) {
        kernel.updateTextureArgumentRefs(this, inputTexture);
      } else {
        if (kernel.texture && kernel.texture.texture === inputTexture.texture) {
          throw new Error(sameError);
        } else if (kernel.mappedTextures) {
          const { mappedTextures } = kernel;
          for (let i = 0; i < mappedTextures.length; i++) {
            if (mappedTextures[i].texture === inputTexture.texture) {
              throw new Error(sameError);
            }
          }
        }
      }
    }

    gl.activeTexture(this.contextHandle);
    gl.bindTexture(gl.TEXTURE_2D, this.uploadValue = inputTexture.texture);
    this.kernel.setUniform1i(this.id, this.index);
  }
}

module.exports = {
  WebGLKernelValueMemoryOptimizedNumberTexture,
  sameError
};
},{"../../../utils":114,"./array":40}],62:[function(require,module,exports){
const { utils } = require('../../../utils');
const { WebGLKernelArray } = require('./array');
const { sameError } = require('./memory-optimized-number-texture');

class WebGLKernelValueNumberTexture extends WebGLKernelArray {
  constructor(value, settings) {
    super(value, settings);
    const [width, height] = value.size;
    this.checkSize(width, height);
    const { size: textureSize, dimensions } = value;
    this.bitRatio = this.getBitRatio(value);
    this.dimensions = dimensions;
    this.textureSize = textureSize;
    this.uploadValue = value.texture;
    this.forceUploadEachRun = true;
  }

  setup() {
    this.setupTexture();
  }

  getStringValueHandler() {
    return `const uploadValue_${this.name} = ${this.varName}.texture;\n`;
  }

  getSource() {
    return utils.linesToString([
      `uniform sampler2D ${this.id}`,
      `ivec2 ${this.sizeId} = ivec2(${this.textureSize[0]}, ${this.textureSize[1]})`,
      `ivec3 ${this.dimensionsId} = ivec3(${this.dimensions[0]}, ${this.dimensions[1]}, ${this.dimensions[2]})`,
    ]);
  }

  updateValue(inputTexture) {
    if (inputTexture.constructor !== this.initialValueConstructor) {
      this.onUpdateValueMismatch(inputTexture.constructor);
      return;
    }
    if (this.checkContext && inputTexture.context !== this.context) {
      throw new Error(`Value ${this.name} (${this.type}) must be from same context`);
    }

    const { kernel, context: gl } = this;
    if (kernel.pipeline) {
      if (kernel.immutable) {
        kernel.updateTextureArgumentRefs(this, inputTexture);
      } else {
        if (kernel.texture && kernel.texture.texture === inputTexture.texture) {
          throw new Error(sameError);
        } else if (kernel.mappedTextures) {
          const { mappedTextures } = kernel;
          for (let i = 0; i < mappedTextures.length; i++) {
            if (mappedTextures[i].texture === inputTexture.texture) {
              throw new Error(sameError);
            }
          }
        }
      }
    }

    gl.activeTexture(this.contextHandle);
    gl.bindTexture(gl.TEXTURE_2D, this.uploadValue = inputTexture.texture);
    this.kernel.setUniform1i(this.id, this.index);
  }
}

module.exports = {
  WebGLKernelValueNumberTexture
};
},{"../../../utils":114,"./array":40,"./memory-optimized-number-texture":61}],63:[function(require,module,exports){
const { utils } = require('../../../utils');
const { WebGLKernelArray } = require('./array');

class WebGLKernelValueSingleArray extends WebGLKernelArray {
  constructor(value, settings) {
    super(value, settings);
    this.bitRatio = 4;
    this.dimensions = utils.getDimensions(value, true);
    this.textureSize = utils.getMemoryOptimizedFloatTextureSize(this.dimensions, this.bitRatio);
    this.uploadArrayLength = this.textureSize[0] * this.textureSize[1] * this.bitRatio;
    this.checkSize(this.textureSize[0], this.textureSize[1]);
    this.uploadValue = new Float32Array(this.uploadArrayLength);
  }

  getStringValueHandler() {
    return utils.linesToString([
      `const uploadValue_${this.name} = new Float32Array(${this.uploadArrayLength})`,
      `flattenTo(${this.varName}, uploadValue_${this.name})`,
    ]);
  }

  getSource() {
    return utils.linesToString([
      `uniform sampler2D ${this.id}`,
      `ivec2 ${this.sizeId} = ivec2(${this.textureSize[0]}, ${this.textureSize[1]})`,
      `ivec3 ${this.dimensionsId} = ivec3(${this.dimensions[0]}, ${this.dimensions[1]}, ${this.dimensions[2]})`,
    ]);
  }

  updateValue(value) {
    if (value.constructor !== this.initialValueConstructor) {
      this.onUpdateValueMismatch(value.constructor);
      return;
    }
    const { context: gl } = this;
    utils.flattenTo(value, this.uploadValue);
    gl.activeTexture(this.contextHandle);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.textureSize[0], this.textureSize[1], 0, gl.RGBA, gl.FLOAT, this.uploadValue);
    this.kernel.setUniform1i(this.id, this.index);
  }
}

module.exports = {
  WebGLKernelValueSingleArray
};
},{"../../../utils":114,"./array":40}],64:[function(require,module,exports){
const { utils } = require('../../../utils');
const { WebGLKernelArray } = require('./array');

class WebGLKernelValueSingleArray1DI extends WebGLKernelArray {
  constructor(value, settings) {
    super(value, settings);
    this.bitRatio = 4;
    this.setShape(value);
  }

  setShape(value) {
    const valueDimensions = utils.getDimensions(value, true);
    this.textureSize = utils.getMemoryOptimizedFloatTextureSize(valueDimensions, this.bitRatio);
    this.dimensions = new Int32Array([valueDimensions[1], 1, 1]);
    this.uploadArrayLength = this.textureSize[0] * this.textureSize[1] * this.bitRatio;
    this.checkSize(this.textureSize[0], this.textureSize[1]);
    this.uploadValue = new Float32Array(this.uploadArrayLength);
  }

  getStringValueHandler() {
    return utils.linesToString([
      `const uploadValue_${this.name} = new Float32Array(${this.uploadArrayLength})`,
      `flattenTo(${this.varName}, uploadValue_${this.name})`,
    ]);
  }

  getSource() {
    return utils.linesToString([
      `uniform sampler2D ${this.id}`,
      `ivec2 ${this.sizeId} = ivec2(${this.textureSize[0]}, ${this.textureSize[1]})`,
      `ivec3 ${this.dimensionsId} = ivec3(${this.dimensions[0]}, ${this.dimensions[1]}, ${this.dimensions[2]})`,
    ]);
  }

  updateValue(value) {
    if (value.constructor !== this.initialValueConstructor) {
      this.onUpdateValueMismatch(value.constructor);
      return;
    }
    const { context: gl } = this;
    utils.flatten2dArrayTo(value, this.uploadValue);
    gl.activeTexture(this.contextHandle);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.textureSize[0], this.textureSize[1], 0, gl.RGBA, gl.FLOAT, this.uploadValue);
    this.kernel.setUniform1i(this.id, this.index);
  }
}

module.exports = {
  WebGLKernelValueSingleArray1DI
};
},{"../../../utils":114,"./array":40}],65:[function(require,module,exports){
const { utils } = require('../../../utils');
const { WebGLKernelArray } = require('./array');

class WebGLKernelValueSingleArray2DI extends WebGLKernelArray {
  constructor(value, settings) {
    super(value, settings);
    this.bitRatio = 4;
    this.setShape(value);
  }

  setShape(value) {
    const valueDimensions = utils.getDimensions(value, true);
    this.textureSize = utils.getMemoryOptimizedFloatTextureSize(valueDimensions, this.bitRatio);
    this.dimensions = new Int32Array([valueDimensions[1], valueDimensions[2], 1]);
    this.uploadArrayLength = this.textureSize[0] * this.textureSize[1] * this.bitRatio;
    this.checkSize(this.textureSize[0], this.textureSize[1]);
    this.uploadValue = new Float32Array(this.uploadArrayLength);
  }

  getStringValueHandler() {
    return utils.linesToString([
      `const uploadValue_${this.name} = new Float32Array(${this.uploadArrayLength})`,
      `flattenTo(${this.varName}, uploadValue_${this.name})`,
    ]);
  }

  getSource() {
    return utils.linesToString([
      `uniform sampler2D ${this.id}`,
      `ivec2 ${this.sizeId} = ivec2(${this.textureSize[0]}, ${this.textureSize[1]})`,
      `ivec3 ${this.dimensionsId} = ivec3(${this.dimensions[0]}, ${this.dimensions[1]}, ${this.dimensions[2]})`,
    ]);
  }

  updateValue(value) {
    if (value.constructor !== this.initialValueConstructor) {
      this.onUpdateValueMismatch(value.constructor);
      return;
    }
    const { context: gl } = this;
    utils.flatten3dArrayTo(value, this.uploadValue);
    gl.activeTexture(this.contextHandle);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.textureSize[0], this.textureSize[1], 0, gl.RGBA, gl.FLOAT, this.uploadValue);
    this.kernel.setUniform1i(this.id, this.index);
  }
}

module.exports = {
  WebGLKernelValueSingleArray2DI
};
},{"../../../utils":114,"./array":40}],66:[function(require,module,exports){
const { utils } = require('../../../utils');
const { WebGLKernelArray } = require('./array');

class WebGLKernelValueSingleArray3DI extends WebGLKernelArray {
  constructor(value, settings) {
    super(value, settings);
    this.bitRatio = 4;
    this.setShape(value);
  }

  setShape(value) {
    const valueDimensions = utils.getDimensions(value, true);
    this.textureSize = utils.getMemoryOptimizedFloatTextureSize(valueDimensions, this.bitRatio);
    this.dimensions = new Int32Array([valueDimensions[1], valueDimensions[2], valueDimensions[3]]);
    this.uploadArrayLength = this.textureSize[0] * this.textureSize[1] * this.bitRatio;
    this.checkSize(this.textureSize[0], this.textureSize[1]);
    this.uploadValue = new Float32Array(this.uploadArrayLength);
  }

  getStringValueHandler() {
    return utils.linesToString([
      `const uploadValue_${this.name} = new Float32Array(${this.uploadArrayLength})`,
      `flattenTo(${this.varName}, uploadValue_${this.name})`,
    ]);
  }

  getSource() {
    return utils.linesToString([
      `uniform sampler2D ${this.id}`,
      `ivec2 ${this.sizeId} = ivec2(${this.textureSize[0]}, ${this.textureSize[1]})`,
      `ivec3 ${this.dimensionsId} = ivec3(${this.dimensions[0]}, ${this.dimensions[1]}, ${this.dimensions[2]})`,
    ]);
  }

  updateValue(value) {
    if (value.constructor !== this.initialValueConstructor) {
      this.onUpdateValueMismatch(value.constructor);
      return;
    }
    const { context: gl } = this;
    utils.flatten4dArrayTo(value, this.uploadValue);
    gl.activeTexture(this.contextHandle);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.textureSize[0], this.textureSize[1], 0, gl.RGBA, gl.FLOAT, this.uploadValue);
    this.kernel.setUniform1i(this.id, this.index);
  }
}

module.exports = {
  WebGLKernelValueSingleArray3DI
};
},{"../../../utils":114,"./array":40}],67:[function(require,module,exports){
const { utils } = require('../../../utils');
const { WebGLKernelArray } = require('./array');

class WebGLKernelValueSingleInput extends WebGLKernelArray {
  constructor(value, settings) {
    super(value, settings);
    this.bitRatio = 4;
    let [w, h, d] = value.size;
    this.dimensions = new Int32Array([w || 1, h || 1, d || 1]);
    this.textureSize = utils.getMemoryOptimizedFloatTextureSize(this.dimensions, this.bitRatio);
    this.uploadArrayLength = this.textureSize[0] * this.textureSize[1] * this.bitRatio;
    this.checkSize(this.textureSize[0], this.textureSize[1]);
    this.uploadValue = new Float32Array(this.uploadArrayLength);
  }

  getStringValueHandler() {
    return utils.linesToString([
      `const uploadValue_${this.name} = new Float32Array(${this.uploadArrayLength})`,
      `flattenTo(${this.varName}.value, uploadValue_${this.name})`,
    ]);
  }

  getSource() {
    return utils.linesToString([
      `uniform sampler2D ${this.id}`,
      `ivec2 ${this.sizeId} = ivec2(${this.textureSize[0]}, ${this.textureSize[1]})`,
      `ivec3 ${this.dimensionsId} = ivec3(${this.dimensions[0]}, ${this.dimensions[1]}, ${this.dimensions[2]})`,
    ]);
  }

  updateValue(input) {
    if (input.constructor !== this.initialValueConstructor) {
      this.onUpdateValueMismatch(input.constructor);
      return;
    }
    const { context: gl } = this;
    utils.flattenTo(input.value, this.uploadValue);
    gl.activeTexture(this.contextHandle);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.textureSize[0], this.textureSize[1], 0, gl.RGBA, gl.FLOAT, this.uploadValue);
    this.kernel.setUniform1i(this.id, this.index);
  }
}

module.exports = {
  WebGLKernelValueSingleInput
};
},{"../../../utils":114,"./array":40}],68:[function(require,module,exports){
const { utils } = require('../../../utils');
const { WebGLKernelArray } = require('./array');

class WebGLKernelValueUnsignedArray extends WebGLKernelArray {
  constructor(value, settings) {
    super(value, settings);
    this.bitRatio = this.getBitRatio(value);
    this.dimensions = utils.getDimensions(value, true);
    this.textureSize = utils.getMemoryOptimizedPackedTextureSize(this.dimensions, this.bitRatio);
    this.uploadArrayLength = this.textureSize[0] * this.textureSize[1] * (4 / this.bitRatio);
    this.checkSize(this.textureSize[0], this.textureSize[1]);
    this.TranserArrayType = this.getTransferArrayType(value);
    this.preUploadValue = new this.TranserArrayType(this.uploadArrayLength);
    this.uploadValue = new Uint8Array(this.preUploadValue.buffer);
  }

  getStringValueHandler() {
    return utils.linesToString([
      `const preUploadValue_${this.name} = new ${this.TranserArrayType.name}(${this.uploadArrayLength})`,
      `const uploadValue_${this.name} = new Uint8Array(preUploadValue_${this.name}.buffer)`,
      `flattenTo(${this.varName}, preUploadValue_${this.name})`,
    ]);
  }

  getSource() {
    return utils.linesToString([
      `uniform sampler2D ${this.id}`,
      `ivec2 ${this.sizeId} = ivec2(${this.textureSize[0]}, ${this.textureSize[1]})`,
      `ivec3 ${this.dimensionsId} = ivec3(${this.dimensions[0]}, ${this.dimensions[1]}, ${this.dimensions[2]})`,
    ]);
  }

  updateValue(value) {
    if (value.constructor !== this.initialValueConstructor) {
      this.onUpdateValueMismatch(value.constructor);
      return;
    }
    const { context: gl } = this;
    utils.flattenTo(value, this.preUploadValue);
    gl.activeTexture(this.contextHandle);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.textureSize[0], this.textureSize[1], 0, gl.RGBA, gl.UNSIGNED_BYTE, this.uploadValue);
    this.kernel.setUniform1i(this.id, this.index);
  }
}

module.exports = {
  WebGLKernelValueUnsignedArray
};
},{"../../../utils":114,"./array":40}],69:[function(require,module,exports){
const { utils } = require('../../../utils');
const { WebGLKernelArray } = require('./array');

class WebGLKernelValueUnsignedInput extends WebGLKernelArray {
  constructor(value, settings) {
    super(value, settings);
    this.bitRatio = this.getBitRatio(value);
    const [w, h, d] = value.size;
    this.dimensions = new Int32Array([w || 1, h || 1, d || 1]);
    this.textureSize = utils.getMemoryOptimizedPackedTextureSize(this.dimensions, this.bitRatio);
    this.uploadArrayLength = this.textureSize[0] * this.textureSize[1] * (4 / this.bitRatio);
    this.checkSize(this.textureSize[0], this.textureSize[1]);
    this.TranserArrayType = this.getTransferArrayType(value.value);
    this.preUploadValue = new this.TranserArrayType(this.uploadArrayLength);
    this.uploadValue = new Uint8Array(this.preUploadValue.buffer);
  }

  getStringValueHandler() {
    return utils.linesToString([
      `const preUploadValue_${this.name} = new ${this.TranserArrayType.name}(${this.uploadArrayLength})`,
      `const uploadValue_${this.name} = new Uint8Array(preUploadValue_${this.name}.buffer)`,
      `flattenTo(${this.varName}.value, preUploadValue_${this.name})`,
    ]);
  }

  getSource() {
    return utils.linesToString([
      `uniform sampler2D ${this.id}`,
      `ivec2 ${this.sizeId} = ivec2(${this.textureSize[0]}, ${this.textureSize[1]})`,
      `ivec3 ${this.dimensionsId} = ivec3(${this.dimensions[0]}, ${this.dimensions[1]}, ${this.dimensions[2]})`,
    ]);
  }

  updateValue(input) {
    if (input.constructor !== this.initialValueConstructor) {
      this.onUpdateValueMismatch(value.constructor);
      return;
    }
    const { context: gl } = this;
    utils.flattenTo(input.value, this.preUploadValue);
    gl.activeTexture(this.contextHandle);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.textureSize[0], this.textureSize[1], 0, gl.RGBA, gl.UNSIGNED_BYTE, this.uploadValue);
    this.kernel.setUniform1i(this.id, this.index);
  }
}

module.exports = {
  WebGLKernelValueUnsignedInput
};
},{"../../../utils":114,"./array":40}],70:[function(require,module,exports){
const { GLKernel } = require('../gl/kernel');
const { FunctionBuilder } = require('../function-builder');
const { WebGLFunctionNode } = require('./function-node');
const { utils } = require('../../utils');
const mrud = require('../../plugins/math-random-uniformly-distributed');
const { fragmentShader } = require('./fragment-shader');
const { vertexShader } = require('./vertex-shader');
const { glKernelString } = require('../gl/kernel-string');
const { lookupKernelValueType } = require('./kernel-value-maps');

let isSupported = null;
let testCanvas = null;
let testContext = null;
let testExtensions = null;
let features = null;

const plugins = [mrud];
const canvases = [];
const maxTexSizes = {};


class WebGLKernel extends GLKernel {
  static get isSupported() {
    if (isSupported !== null) {
      return isSupported;
    }
    this.setupFeatureChecks();
    isSupported = this.isContextMatch(testContext);
    return isSupported;
  }

  static setupFeatureChecks() {
    if (typeof document !== 'undefined') {
      testCanvas = document.createElement('canvas');
    } else if (typeof OffscreenCanvas !== 'undefined') {
      testCanvas = new OffscreenCanvas(0, 0);
    }
    if (!testCanvas) return;
    testContext = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
    if (!testContext || !testContext.getExtension) return;
    testExtensions = {
      OES_texture_float: testContext.getExtension('OES_texture_float'),
      OES_texture_float_linear: testContext.getExtension('OES_texture_float_linear'),
      OES_element_index_uint: testContext.getExtension('OES_element_index_uint'),
      WEBGL_draw_buffers: testContext.getExtension('WEBGL_draw_buffers'),
    };
    features = this.getFeatures();
  }

  static isContextMatch(context) {
    if (typeof WebGLRenderingContext !== 'undefined') {
      return context instanceof WebGLRenderingContext;
    }
    return false;
  }

  static getIsTextureFloat() {
    return Boolean(testExtensions.OES_texture_float);
  }

  static getIsDrawBuffers() {
    return Boolean(testExtensions.WEBGL_draw_buffers);
  }

  static getChannelCount() {
    return testExtensions.WEBGL_draw_buffers ?
      testContext.getParameter(testExtensions.WEBGL_draw_buffers.MAX_DRAW_BUFFERS_WEBGL) :
      1;
  }

  static getMaxTextureSize() {
    return testContext.getParameter(testContext.MAX_TEXTURE_SIZE);
  }

  static lookupKernelValueType(type, dynamic, precision, value) {
    return lookupKernelValueType(type, dynamic, precision, value);
  }

  static get testCanvas() {
    return testCanvas;
  }

  static get testContext() {
    return testContext;
  }

  static get features() {
    return features;
  }

  static get fragmentShader() {
    return fragmentShader;
  }

  static get vertexShader() {
    return vertexShader;
  }

  constructor(source, settings) {
    super(source, settings);
    this.program = null;
    this.pipeline = settings.pipeline;
    this.endianness = utils.systemEndianness();
    this.extensions = {};
    this.argumentTextureCount = 0;
    this.constantTextureCount = 0;
    this.fragShader = null;
    this.vertShader = null;
    this.drawBuffersMap = null;

    this.maxTexSize = null;
    this.onRequestSwitchKernel = null;

    this.texture = null;
    this.mappedTextures = null;
    this.mergeSettings(source.settings || settings);

    this.threadDim = null;
    this.framebuffer = null;
    this.buffer = null;

    this.textureCache = [];
    this.programUniformLocationCache = {};
    this.uniform1fCache = {};
    this.uniform1iCache = {};
    this.uniform2fCache = {};
    this.uniform2fvCache = {};
    this.uniform2ivCache = {};
    this.uniform3fvCache = {};
    this.uniform3ivCache = {};
    this.uniform4fvCache = {};
    this.uniform4ivCache = {};
  }

  initCanvas() {
    if (typeof document !== 'undefined') {
      const canvas = document.createElement('canvas');
      canvas.width = 2;
      canvas.height = 2;
      return canvas;
    } else if (typeof OffscreenCanvas !== 'undefined') {
      return new OffscreenCanvas(0, 0);
    }
  }

  initContext() {
    const settings = {
      alpha: false,
      depth: false,
      antialias: false
    };
    return this.canvas.getContext('webgl', settings) || this.canvas.getContext('experimental-webgl', settings);
  }

  initPlugins(settings) {
    const pluginsToUse = [];
    const { source } = this;
    if (typeof source === 'string') {
      for (let i = 0; i < plugins.length; i++) {
        const plugin = plugins[i];
        if (source.match(plugin.functionMatch)) {
          pluginsToUse.push(plugin);
        }
      }
    } else if (typeof source === 'object') {
      if (settings.pluginNames) { 
        for (let i = 0; i < plugins.length; i++) {
          const plugin = plugins[i];
          const usePlugin = settings.pluginNames.some(pluginName => pluginName === plugin.name);
          if (usePlugin) {
            pluginsToUse.push(plugin);
          }
        }
      }
    }
    return pluginsToUse;
  }

  initExtensions() {
    this.extensions = {
      OES_texture_float: this.context.getExtension('OES_texture_float'),
      OES_texture_float_linear: this.context.getExtension('OES_texture_float_linear'),
      OES_element_index_uint: this.context.getExtension('OES_element_index_uint'),
      WEBGL_draw_buffers: this.context.getExtension('WEBGL_draw_buffers'),
      WEBGL_color_buffer_float: this.context.getExtension('WEBGL_color_buffer_float'),
    };
  }

  validateSettings(args) {
    if (!this.validate) {
      this.texSize = utils.getKernelTextureSize({
        optimizeFloatMemory: this.optimizeFloatMemory,
        precision: this.precision,
      }, this.output);
      return;
    }

    const { features } = this.constructor;

    if (this.optimizeFloatMemory === true && !features.isTextureFloat) {
      throw new Error('Float textures are not supported');
    } else if (this.precision === 'single' && !features.isFloatRead) {
      throw new Error('Single precision not supported');
    } else if (!this.graphical && this.precision === null && features.isTextureFloat) {
      this.precision = features.isFloatRead ? 'single' : 'unsigned';
    }

    if (this.subKernels && this.subKernels.length > 0 && !this.extensions.WEBGL_draw_buffers) {
      throw new Error('could not instantiate draw buffers extension');
    }

    if (this.fixIntegerDivisionAccuracy === null) {
      this.fixIntegerDivisionAccuracy = !features.isIntegerDivisionAccurate;
    } else if (this.fixIntegerDivisionAccuracy && features.isIntegerDivisionAccurate) {
      this.fixIntegerDivisionAccuracy = false;
    }

    this.checkOutput();

    if (!this.output || this.output.length === 0) {
      if (args.length !== 1) {
        throw new Error('Auto output only supported for kernels with only one input');
      }

      const argType = utils.getVariableType(args[0], this.strictIntegers);
      switch (argType) {
        case 'Array':
          this.output = utils.getDimensions(argType);
          break;
        case 'NumberTexture':
        case 'MemoryOptimizedNumberTexture':
        case 'ArrayTexture(1)':
        case 'ArrayTexture(2)':
        case 'ArrayTexture(3)':
        case 'ArrayTexture(4)':
          this.output = args[0].output;
          break;
        default:
          throw new Error('Auto output not supported for input type: ' + argType);
      }
    }

    if (this.graphical) {
      if (this.output.length !== 2) {
        throw new Error('Output must have 2 dimensions on graphical mode');
      }

      if (this.precision === 'precision') {
        this.precision = 'unsigned';
        console.warn('Cannot use graphical mode and single precision at the same time');
      }

      this.texSize = utils.clone(this.output);
      return;
    } else if (this.precision === null && features.isTextureFloat) {
      this.precision = 'single';
    }

    this.texSize = utils.getKernelTextureSize({
      optimizeFloatMemory: this.optimizeFloatMemory,
      precision: this.precision,
    }, this.output);

    this.checkTextureSize();
  }

  updateMaxTexSize() {
    const { texSize, canvas } = this;
    if (this.maxTexSize === null) {
      let canvasIndex = canvases.indexOf(canvas);
      if (canvasIndex === -1) {
        canvasIndex = canvases.length;
        canvases.push(canvas);
        maxTexSizes[canvasIndex] = [texSize[0], texSize[1]];
      }
      this.maxTexSize = maxTexSizes[canvasIndex];
    }
    if (this.maxTexSize[0] < texSize[0]) {
      this.maxTexSize[0] = texSize[0];
    }
    if (this.maxTexSize[1] < texSize[1]) {
      this.maxTexSize[1] = texSize[1];
    }
  }

  setupArguments(args) {
    this.kernelArguments = [];
    this.argumentTextureCount = 0;
    const needsArgumentTypes = this.argumentTypes === null;
    if (needsArgumentTypes) {
      this.argumentTypes = [];
    }
    this.argumentSizes = [];
    this.argumentBitRatios = [];

    if (args.length < this.argumentNames.length) {
      throw new Error('not enough arguments for kernel');
    } else if (args.length > this.argumentNames.length) {
      throw new Error('too many arguments for kernel');
    }

    const { context: gl } = this;
    let textureIndexes = 0;

    const onRequestTexture = () => {
      return this.createTexture();
    };
    const onRequestIndex = () => {
      return this.constantTextureCount + textureIndexes++;
    };
    const onUpdateValueMismatch = (constructor) => {
      this.switchKernels({
        type: 'argumentMismatch',
        needed: constructor
      });
    };
    const onRequestContextHandle = () => {
      return gl.TEXTURE0 + this.constantTextureCount + this.argumentTextureCount++;
    };

    for (let index = 0; index < args.length; index++) {
      const value = args[index];
      const name = this.argumentNames[index];
      let type;
      if (needsArgumentTypes) {
        type = utils.getVariableType(value, this.strictIntegers);
        this.argumentTypes.push(type);
      } else {
        type = this.argumentTypes[index];
      }
      const KernelValue = this.constructor.lookupKernelValueType(type, this.dynamicArguments ? 'dynamic' : 'static', this.precision, args[index]);
      if (KernelValue === null) {
        return this.requestFallback(args);
      }
      const kernelArgument = new KernelValue(value, {
        name,
        type,
        tactic: this.tactic,
        origin: 'user',
        context: gl,
        checkContext: this.checkContext,
        kernel: this,
        strictIntegers: this.strictIntegers,
        onRequestTexture,
        onRequestIndex,
        onUpdateValueMismatch,
        onRequestContextHandle,
      });
      this.kernelArguments.push(kernelArgument);
      kernelArgument.setup();
      this.argumentSizes.push(kernelArgument.textureSize);
      this.argumentBitRatios[index] = kernelArgument.bitRatio;
    }
  }

  createTexture() {
    const texture = this.context.createTexture();
    this.textureCache.push(texture);
    return texture;
  }

  setupConstants(args) {
    const { context: gl } = this;
    this.kernelConstants = [];
    this.forceUploadKernelConstants = [];
    let needsConstantTypes = this.constantTypes === null;
    if (needsConstantTypes) {
      this.constantTypes = {};
    }
    this.constantBitRatios = {};
    let textureIndexes = 0;
    for (const name in this.constants) {
      const value = this.constants[name];
      let type;
      if (needsConstantTypes) {
        type = utils.getVariableType(value, this.strictIntegers);
        this.constantTypes[name] = type;
      } else {
        type = this.constantTypes[name];
      }
      const KernelValue = this.constructor.lookupKernelValueType(type, 'static', this.precision, value);
      if (KernelValue === null) {
        return this.requestFallback(args);
      }
      const kernelValue = new KernelValue(value, {
        name,
        type,
        tactic: this.tactic,
        origin: 'constants',
        context: this.context,
        checkContext: this.checkContext,
        kernel: this,
        strictIntegers: this.strictIntegers,
        onRequestTexture: () => {
          return this.createTexture();
        },
        onRequestIndex: () => {
          return textureIndexes++;
        },
        onRequestContextHandle: () => {
          return gl.TEXTURE0 + this.constantTextureCount++;
        }
      });
      this.constantBitRatios[name] = kernelValue.bitRatio;
      this.kernelConstants.push(kernelValue);
      kernelValue.setup();
      if (kernelValue.forceUploadEachRun) {
        this.forceUploadKernelConstants.push(kernelValue);
      }
    }
  }

  build() {
    if (this.built) return;
    this.initExtensions();
    this.validateSettings(arguments);
    this.setupConstants(arguments);
    if (this.fallbackRequested) return;
    this.setupArguments(arguments);
    if (this.fallbackRequested) return;
    this.updateMaxTexSize();
    this.translateSource();
    const failureResult = this.pickRenderStrategy(arguments);
    if (failureResult) {
      return failureResult;
    }
    const { texSize, context: gl, canvas } = this;
    gl.enable(gl.SCISSOR_TEST);
    if (this.pipeline && this.precision === 'single') {
      gl.viewport(0, 0, this.maxTexSize[0], this.maxTexSize[1]);
      canvas.width = this.maxTexSize[0];
      canvas.height = this.maxTexSize[1];
    } else {
      gl.viewport(0, 0, this.maxTexSize[0], this.maxTexSize[1]);
      canvas.width = this.maxTexSize[0];
      canvas.height = this.maxTexSize[1];
    }
    const threadDim = this.threadDim = Array.from(this.output);
    while (threadDim.length < 3) {
      threadDim.push(1);
    }

    const compiledVertexShader = this.getVertexShader(arguments);
    const vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, compiledVertexShader);
    gl.compileShader(vertShader);
    this.vertShader = vertShader;

    const compiledFragmentShader = this.getFragmentShader(arguments);
    const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, compiledFragmentShader);
    gl.compileShader(fragShader);
    this.fragShader = fragShader;

    if (this.debug) {
      console.log('GLSL Shader Output:');
      console.log(compiledFragmentShader);
    }

    if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
      throw new Error('Error compiling vertex shader: ' + gl.getShaderInfoLog(vertShader));
    }
    if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
      throw new Error('Error compiling fragment shader: ' + gl.getShaderInfoLog(fragShader));
    }

    const program = this.program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    this.framebuffer = gl.createFramebuffer();
    this.framebuffer.width = texSize[0];
    this.framebuffer.height = texSize[1];
    this.rawValueFramebuffers = {};

    const vertices = new Float32Array([-1, -1,
      1, -1, -1, 1,
      1, 1
    ]);
    const texCoords = new Float32Array([
      0, 0,
      1, 0,
      0, 1,
      1, 1
    ]);

    const texCoordOffset = vertices.byteLength;

    let buffer = this.buffer;
    if (!buffer) {
      buffer = this.buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices.byteLength + texCoords.byteLength, gl.STATIC_DRAW);
    } else {
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    }

    gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);
    gl.bufferSubData(gl.ARRAY_BUFFER, texCoordOffset, texCoords);

    const aPosLoc = gl.getAttribLocation(this.program, 'aPos');
    gl.enableVertexAttribArray(aPosLoc);
    gl.vertexAttribPointer(aPosLoc, 2, gl.FLOAT, false, 0, 0);
    const aTexCoordLoc = gl.getAttribLocation(this.program, 'aTexCoord');
    gl.enableVertexAttribArray(aTexCoordLoc);
    gl.vertexAttribPointer(aTexCoordLoc, 2, gl.FLOAT, false, 0, texCoordOffset);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);

    let i = 0;
    gl.useProgram(this.program);
    for (let p in this.constants) {
      this.kernelConstants[i++].updateValue(this.constants[p]);
    }

    this._setupOutputTexture();
    if (
      this.subKernels !== null &&
      this.subKernels.length > 0
    ) {
      this._mappedTextureSwitched = {};
      this._setupSubOutputTextures();
    }
    this.buildSignature(arguments);
    this.built = true;
  }

  translateSource() {
    const functionBuilder = FunctionBuilder.fromKernel(this, WebGLFunctionNode, {
      fixIntegerDivisionAccuracy: this.fixIntegerDivisionAccuracy
    });
    this.translatedSource = functionBuilder.getPrototypeString('kernel');
    this.setupReturnTypes(functionBuilder);
  }

  setupReturnTypes(functionBuilder) {
    if (!this.graphical && !this.returnType) {
      this.returnType = functionBuilder.getKernelResultType();
    }

    if (this.subKernels && this.subKernels.length > 0) {
      for (let i = 0; i < this.subKernels.length; i++) {
        const subKernel = this.subKernels[i];
        if (!subKernel.returnType) {
          subKernel.returnType = functionBuilder.getSubKernelResultType(i);
        }
      }
    }
  }

  run() {
    const { kernelArguments, texSize, forceUploadKernelConstants, context: gl } = this;

    gl.useProgram(this.program);
    gl.scissor(0, 0, texSize[0], texSize[1]);
    if (this.dynamicOutput) {
      this.setUniform3iv('uOutputDim', new Int32Array(this.threadDim));
      this.setUniform2iv('uTexSize', texSize);
    }

    this.setUniform2f('ratio', texSize[0] / this.maxTexSize[0], texSize[1] / this.maxTexSize[1]);

    for (let i = 0; i < forceUploadKernelConstants.length; i++) {
      const constant = forceUploadKernelConstants[i];
      constant.updateValue(this.constants[constant.name]);
      if (this.switchingKernels) return;
    }
    for (let i = 0; i < kernelArguments.length; i++) {
      kernelArguments[i].updateValue(arguments[i]);
      if (this.switchingKernels) return;
    }

    if (this.plugins) {
      for (let i = 0; i < this.plugins.length; i++) {
        const plugin = this.plugins[i];
        if (plugin.onBeforeRun) {
          plugin.onBeforeRun(this);
        }
      }
    }

    if (this.graphical) {
      if (this.pipeline) {
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        if (this.immutable) {
          this._replaceOutputTexture();
        }
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        return this.immutable ? this.texture.clone() : this.texture;
      }
      gl.bindRenderbuffer(gl.RENDERBUFFER, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      return;
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    if (this.immutable) {
      this._replaceOutputTexture();
    }

    if (this.subKernels !== null) {
      if (this.immutable) {
        this._replaceSubOutputTextures();
      }
      this.drawBuffers();
    }

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  drawBuffers() {
    this.extensions.WEBGL_draw_buffers.drawBuffersWEBGL(this.drawBuffersMap);
  }

  getInternalFormat() {
    return this.context.RGBA;
  }
  getTextureFormat() {
    const { context: gl } = this;
    switch (this.getInternalFormat()) {
      case gl.RGBA:
        return gl.RGBA;
      default:
        throw new Error('Unknown internal format');
    }
  }

  _replaceOutputTexture() {
    if (this.texture.beforeMutate() || this._textureSwitched) {
      const gl = this.context;
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture.texture, 0);
      this._textureSwitched = false;
    }
  }

  _setupOutputTexture() {
    const gl = this.context;
    const texSize = this.texSize;
    if (this.texture) {
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture.texture, 0);
      return;
    }
    const texture = this.createTexture();
    gl.activeTexture(gl.TEXTURE0 + this.constantTextureCount + this.argumentTextureCount);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    const format = this.getInternalFormat();
    if (this.precision === 'single') {
      gl.texImage2D(gl.TEXTURE_2D, 0, format, texSize[0], texSize[1], 0, gl.RGBA, gl.FLOAT, null);
    } else {
      gl.texImage2D(gl.TEXTURE_2D, 0, format, texSize[0], texSize[1], 0, format, gl.UNSIGNED_BYTE, null);
    }
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    this.texture = new this.TextureConstructor({
      texture,
      size: texSize,
      dimensions: this.threadDim,
      output: this.output,
      context: this.context,
      internalFormat: this.getInternalFormat(),
      textureFormat: this.getTextureFormat(),
      kernel: this,
    });
  }

  _replaceSubOutputTextures() {
    const gl = this.context;
    for (let i = 0; i < this.mappedTextures.length; i++) {
      const mappedTexture = this.mappedTextures[i];
      if (mappedTexture.beforeMutate() || this._mappedTextureSwitched[i]) {
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i + 1, gl.TEXTURE_2D, mappedTexture.texture, 0);
        this._mappedTextureSwitched[i] = false;
      }
    }
  }

  _setupSubOutputTextures() {
    const gl = this.context;
    if (this.mappedTextures) {
      for (let i = 0; i < this.subKernels.length; i++) {
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i + 1, gl.TEXTURE_2D, this.mappedTextures[i].texture, 0);
      }
      return;
    }
    const texSize = this.texSize;
    this.drawBuffersMap = [gl.COLOR_ATTACHMENT0];
    this.mappedTextures = [];
    for (let i = 0; i < this.subKernels.length; i++) {
      const texture = this.createTexture();
      this.drawBuffersMap.push(gl.COLOR_ATTACHMENT0 + i + 1);
      gl.activeTexture(gl.TEXTURE0 + this.constantTextureCount + this.argumentTextureCount + i);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      if (this.precision === 'single') {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize[0], texSize[1], 0, gl.RGBA, gl.FLOAT, null);
      } else {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize[0], texSize[1], 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      }
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i + 1, gl.TEXTURE_2D, texture, 0);

      this.mappedTextures.push(new this.TextureConstructor({
        texture,
        size: texSize,
        dimensions: this.threadDim,
        output: this.output,
        context: this.context,
        internalFormat: this.getInternalFormat(),
        textureFormat: this.getTextureFormat(),
        kernel: this,
      }));
    }
  }

  setUniform1f(name, value) {
    if (this.uniform1fCache.hasOwnProperty(name)) {
      const cache = this.uniform1fCache[name];
      if (value === cache) {
        return;
      }
    }
    this.uniform1fCache[name] = value;
    const loc = this.getUniformLocation(name);
    this.context.uniform1f(loc, value);
  }

  setUniform1i(name, value) {
    if (this.uniform1iCache.hasOwnProperty(name)) {
      const cache = this.uniform1iCache[name];
      if (value === cache) {
        return;
      }
    }
    this.uniform1iCache[name] = value;
    const loc = this.getUniformLocation(name);
    this.context.uniform1i(loc, value);
  }

  setUniform2f(name, value1, value2) {
    if (this.uniform2fCache.hasOwnProperty(name)) {
      const cache = this.uniform2fCache[name];
      if (
        value1 === cache[0] &&
        value2 === cache[1]
      ) {
        return;
      }
    }
    this.uniform2fCache[name] = [value1, value2];
    const loc = this.getUniformLocation(name);
    this.context.uniform2f(loc, value1, value2);
  }

  setUniform2fv(name, value) {
    if (this.uniform2fvCache.hasOwnProperty(name)) {
      const cache = this.uniform2fvCache[name];
      if (
        value[0] === cache[0] &&
        value[1] === cache[1]
      ) {
        return;
      }
    }
    this.uniform2fvCache[name] = value;
    const loc = this.getUniformLocation(name);
    this.context.uniform2fv(loc, value);
  }

  setUniform2iv(name, value) {
    if (this.uniform2ivCache.hasOwnProperty(name)) {
      const cache = this.uniform2ivCache[name];
      if (
        value[0] === cache[0] &&
        value[1] === cache[1]
      ) {
        return;
      }
    }
    this.uniform2ivCache[name] = value;
    const loc = this.getUniformLocation(name);
    this.context.uniform2iv(loc, value);
  }

  setUniform3fv(name, value) {
    if (this.uniform3fvCache.hasOwnProperty(name)) {
      const cache = this.uniform3fvCache[name];
      if (
        value[0] === cache[0] &&
        value[1] === cache[1] &&
        value[2] === cache[2]
      ) {
        return;
      }
    }
    this.uniform3fvCache[name] = value;
    const loc = this.getUniformLocation(name);
    this.context.uniform3fv(loc, value);
  }

  setUniform3iv(name, value) {
    if (this.uniform3ivCache.hasOwnProperty(name)) {
      const cache = this.uniform3ivCache[name];
      if (
        value[0] === cache[0] &&
        value[1] === cache[1] &&
        value[2] === cache[2]
      ) {
        return;
      }
    }
    this.uniform3ivCache[name] = value;
    const loc = this.getUniformLocation(name);
    this.context.uniform3iv(loc, value);
  }

  setUniform4fv(name, value) {
    if (this.uniform4fvCache.hasOwnProperty(name)) {
      const cache = this.uniform4fvCache[name];
      if (
        value[0] === cache[0] &&
        value[1] === cache[1] &&
        value[2] === cache[2] &&
        value[3] === cache[3]
      ) {
        return;
      }
    }
    this.uniform4fvCache[name] = value;
    const loc = this.getUniformLocation(name);
    this.context.uniform4fv(loc, value);
  }

  setUniform4iv(name, value) {
    if (this.uniform4ivCache.hasOwnProperty(name)) {
      const cache = this.uniform4ivCache[name];
      if (
        value[0] === cache[0] &&
        value[1] === cache[1] &&
        value[2] === cache[2] &&
        value[3] === cache[3]
      ) {
        return;
      }
    }
    this.uniform4ivCache[name] = value;
    const loc = this.getUniformLocation(name);
    this.context.uniform4iv(loc, value);
  }

  getUniformLocation(name) {
    if (this.programUniformLocationCache.hasOwnProperty(name)) {
      return this.programUniformLocationCache[name];
    }
    return this.programUniformLocationCache[name] = this.context.getUniformLocation(this.program, name);
  }

  _getFragShaderArtifactMap(args) {
    return {
      HEADER: this._getHeaderString(),
      LOOP_MAX: this._getLoopMaxString(),
      PLUGINS: this._getPluginsString(),
      CONSTANTS: this._getConstantsString(),
      DECODE32_ENDIANNESS: this._getDecode32EndiannessString(),
      ENCODE32_ENDIANNESS: this._getEncode32EndiannessString(),
      DIVIDE_WITH_INTEGER_CHECK: this._getDivideWithIntegerCheckString(),
      INJECTED_NATIVE: this._getInjectedNative(),
      MAIN_CONSTANTS: this._getMainConstantsString(),
      MAIN_ARGUMENTS: this._getMainArgumentsString(args),
      KERNEL: this.getKernelString(),
      MAIN_RESULT: this.getMainResultString(),
      FLOAT_TACTIC_DECLARATION: this.getFloatTacticDeclaration(),
      INT_TACTIC_DECLARATION: this.getIntTacticDeclaration(),
      SAMPLER_2D_TACTIC_DECLARATION: this.getSampler2DTacticDeclaration(),
      SAMPLER_2D_ARRAY_TACTIC_DECLARATION: this.getSampler2DArrayTacticDeclaration(),
    };
  }

  _getVertShaderArtifactMap(args) {
    return {
      FLOAT_TACTIC_DECLARATION: this.getFloatTacticDeclaration(),
      INT_TACTIC_DECLARATION: this.getIntTacticDeclaration(),
      SAMPLER_2D_TACTIC_DECLARATION: this.getSampler2DTacticDeclaration(),
      SAMPLER_2D_ARRAY_TACTIC_DECLARATION: this.getSampler2DArrayTacticDeclaration(),
    };
  }

  _getHeaderString() {
    return (
      this.subKernels !== null ?
      '#extension GL_EXT_draw_buffers : require\n' :
      ''
    );
  }

  _getLoopMaxString() {
    return (
      this.loopMaxIterations ?
      ` ${parseInt(this.loopMaxIterations)};\n` :
      ' 1000;\n'
    );
  }

  _getPluginsString() {
    if (!this.plugins) return '\n';
    return this.plugins.map(plugin => plugin.source && this.source.match(plugin.functionMatch) ? plugin.source : '').join('\n');
  }

  _getConstantsString() {
    const result = [];
    const { threadDim, texSize } = this;
    if (this.dynamicOutput) {
      result.push(
        'uniform ivec3 uOutputDim',
        'uniform ivec2 uTexSize'
      );
    } else {
      result.push(
        `ivec3 uOutputDim = ivec3(${threadDim[0]}, ${threadDim[1]}, ${threadDim[2]})`,
        `ivec2 uTexSize = ivec2(${texSize[0]}, ${texSize[1]})`
      );
    }
    return utils.linesToString(result);
  }

  _getTextureCoordinate() {
    const subKernels = this.subKernels;
    if (subKernels === null || subKernels.length < 1) {
      return 'varying vec2 vTexCoord;\n';
    } else {
      return 'out vec2 vTexCoord;\n';
    }
  }

  _getDecode32EndiannessString() {
    return (
      this.endianness === 'LE' ?
      '' :
      '  texel.rgba = texel.abgr;\n'
    );
  }

  _getEncode32EndiannessString() {
    return (
      this.endianness === 'LE' ?
      '' :
      '  texel.rgba = texel.abgr;\n'
    );
  }

  _getDivideWithIntegerCheckString() {
    return this.fixIntegerDivisionAccuracy ?
      `float divWithIntCheck(float x, float y) {
if (floor(x) == x && floor(y) == y && integerMod(x, y) == 0.0) {
return float(int(x) / int(y));
}
return x / y;
}

float integerCorrectionModulo(float number, float divisor) {
if (number < 0.0) {
number = abs(number);
if (divisor < 0.0) {
  divisor = abs(divisor);
}
return -(number - (divisor * floor(divWithIntCheck(number, divisor))));
}
if (divisor < 0.0) {
divisor = abs(divisor);
}
return number - (divisor * floor(divWithIntCheck(number, divisor)));
}` :
      '';
  }

  _getMainArgumentsString(args) {
    const results = [];
    const { argumentNames } = this;
    for (let i = 0; i < argumentNames.length; i++) {
      results.push(this.kernelArguments[i].getSource(args[i]));
    }
    return results.join('');
  }

  _getInjectedNative() {
    return this.injectedNative || '';
  }

  _getMainConstantsString() {
    const result = [];
    const { constants } = this;
    if (constants) {
      let i = 0;
      for (const name in constants) {
        if (!this.constants.hasOwnProperty(name)) continue;
        result.push(this.kernelConstants[i++].getSource(this.constants[name]));
      }
    }
    return result.join('');
  }

  getRawValueFramebuffer(width, height) {
    if (!this.rawValueFramebuffers[width]) {
      this.rawValueFramebuffers[width] = {};
    }
    if (!this.rawValueFramebuffers[width][height]) {
      const framebuffer = this.context.createFramebuffer();
      framebuffer.width = width;
      framebuffer.height = height;
      this.rawValueFramebuffers[width][height] = framebuffer;
    }
    return this.rawValueFramebuffers[width][height];
  }

  getKernelResultDeclaration() {
    switch (this.returnType) {
      case 'Array(2)':
        return 'vec2 kernelResult';
      case 'Array(3)':
        return 'vec3 kernelResult';
      case 'Array(4)':
        return 'vec4 kernelResult';
      case 'LiteralInteger':
      case 'Float':
      case 'Number':
      case 'Integer':
        return 'float kernelResult';
      default:
        if (this.graphical) {
          return 'float kernelResult';
        } else {
          throw new Error(`unrecognized output type "${ this.returnType }"`);
        }
    }
  }
  getKernelString() {
    const result = [this.getKernelResultDeclaration()];
    const { subKernels } = this;
    if (subKernels !== null) {
      switch (this.returnType) {
        case 'Number':
        case 'Float':
        case 'Integer':
          for (let i = 0; i < subKernels.length; i++) {
            const subKernel = subKernels[i];
            result.push(
              subKernel.returnType === 'Integer' ?
              `int subKernelResult_${ subKernel.name } = 0` :
              `float subKernelResult_${ subKernel.name } = 0.0`
            );
          }
          break;
        case 'Array(2)':
          for (let i = 0; i < subKernels.length; i++) {
            result.push(
              `vec2 subKernelResult_${ subKernels[i].name }`
            );
          }
          break;
        case 'Array(3)':
          for (let i = 0; i < subKernels.length; i++) {
            result.push(
              `vec3 subKernelResult_${ subKernels[i].name }`
            );
          }
          break;
        case 'Array(4)':
          for (let i = 0; i < subKernels.length; i++) {
            result.push(
              `vec4 subKernelResult_${ subKernels[i].name }`
            );
          }
          break;
      }
    }

    return utils.linesToString(result) + this.translatedSource;
  }

  getMainResultGraphical() {
    return utils.linesToString([
      '  threadId = indexTo3D(index, uOutputDim)',
      '  kernel()',
      '  gl_FragColor = actualColor',
    ]);
  }

  getMainResultPackedPixels() {
    switch (this.returnType) {
      case 'LiteralInteger':
      case 'Number':
      case 'Integer':
      case 'Float':
        return this.getMainResultKernelPackedPixels() +
          this.getMainResultSubKernelPackedPixels();
      default:
        throw new Error(`packed output only usable with Numbers, "${this.returnType}" specified`);
    }
  }

  getMainResultKernelPackedPixels() {
    return utils.linesToString([
      '  threadId = indexTo3D(index, uOutputDim)',
      '  kernel()',
      `  gl_FragData[0] = ${this.useLegacyEncoder ? 'legacyEncode32' : 'encode32'}(kernelResult)`
    ]);
  }

  getMainResultSubKernelPackedPixels() {
    const result = [];
    if (!this.subKernels) return '';
    for (let i = 0; i < this.subKernels.length; i++) {
      const subKernel = this.subKernels[i];
      if (subKernel.returnType === 'Integer') {
        result.push(
          `  gl_FragData[${i + 1}] = ${this.useLegacyEncoder ? 'legacyEncode32' : 'encode32'}(float(subKernelResult_${this.subKernels[i].name}))`
        );
      } else {
        result.push(
          `  gl_FragData[${i + 1}] = ${this.useLegacyEncoder ? 'legacyEncode32' : 'encode32'}(subKernelResult_${this.subKernels[i].name})`
        );
      }
    }
    return utils.linesToString(result);
  }

  getMainResultMemoryOptimizedFloats() {
    const result = [
      '  index *= 4',
    ];

    switch (this.returnType) {
      case 'Number':
      case 'Integer':
      case 'Float':
        const channels = ['r', 'g', 'b', 'a'];
        for (let i = 0; i < channels.length; i++) {
          const channel = channels[i];
          this.getMainResultKernelMemoryOptimizedFloats(result, channel);
          this.getMainResultSubKernelMemoryOptimizedFloats(result, channel);
          if (i + 1 < channels.length) {
            result.push('  index += 1');
          }
        }
        break;
      default:
        throw new Error(`optimized output only usable with Numbers, ${this.returnType} specified`);
    }

    return utils.linesToString(result);
  }

  getMainResultKernelMemoryOptimizedFloats(result, channel) {
    result.push(
      '  threadId = indexTo3D(index, uOutputDim)',
      '  kernel()',
      `  gl_FragData[0].${channel} = kernelResult`
    );
  }

  getMainResultSubKernelMemoryOptimizedFloats(result, channel) {
    if (!this.subKernels) return result;
    for (let i = 0; i < this.subKernels.length; i++) {
      const subKernel = this.subKernels[i];
      if (subKernel.returnType === 'Integer') {
        result.push(
          `  gl_FragData[${i + 1}].${channel} = float(subKernelResult_${this.subKernels[i].name})`
        );
      } else {
        result.push(
          `  gl_FragData[${i + 1}].${channel} = subKernelResult_${this.subKernels[i].name}`
        );
      }
    }
  }

  getMainResultKernelNumberTexture() {
    return [
      '  threadId = indexTo3D(index, uOutputDim)',
      '  kernel()',
      '  gl_FragData[0][0] = kernelResult',
    ];
  }

  getMainResultSubKernelNumberTexture() {
    const result = [];
    if (!this.subKernels) return result;
    for (let i = 0; i < this.subKernels.length; ++i) {
      const subKernel = this.subKernels[i];
      if (subKernel.returnType === 'Integer') {
        result.push(
          `  gl_FragData[${i + 1}][0] = float(subKernelResult_${subKernel.name})`
        );
      } else {
        result.push(
          `  gl_FragData[${i + 1}][0] = subKernelResult_${subKernel.name}`
        );
      }
    }
    return result;
  }

  getMainResultKernelArray2Texture() {
    return [
      '  threadId = indexTo3D(index, uOutputDim)',
      '  kernel()',
      '  gl_FragData[0][0] = kernelResult[0]',
      '  gl_FragData[0][1] = kernelResult[1]',
    ];
  }

  getMainResultSubKernelArray2Texture() {
    const result = [];
    if (!this.subKernels) return result;
    for (let i = 0; i < this.subKernels.length; ++i) {
      result.push(
        `  gl_FragData[${i + 1}][0] = subKernelResult_${this.subKernels[i].name}[0]`,
        `  gl_FragData[${i + 1}][1] = subKernelResult_${this.subKernels[i].name}[1]`
      );
    }
    return result;
  }

  getMainResultKernelArray3Texture() {
    return [
      '  threadId = indexTo3D(index, uOutputDim)',
      '  kernel()',
      '  gl_FragData[0][0] = kernelResult[0]',
      '  gl_FragData[0][1] = kernelResult[1]',
      '  gl_FragData[0][2] = kernelResult[2]',
    ];
  }

  getMainResultSubKernelArray3Texture() {
    const result = [];
    if (!this.subKernels) return result;
    for (let i = 0; i < this.subKernels.length; ++i) {
      result.push(
        `  gl_FragData[${i + 1}][0] = subKernelResult_${this.subKernels[i].name}[0]`,
        `  gl_FragData[${i + 1}][1] = subKernelResult_${this.subKernels[i].name}[1]`,
        `  gl_FragData[${i + 1}][2] = subKernelResult_${this.subKernels[i].name}[2]`
      );
    }
    return result;
  }

  getMainResultKernelArray4Texture() {
    return [
      '  threadId = indexTo3D(index, uOutputDim)',
      '  kernel()',
      '  gl_FragData[0] = kernelResult',
    ];
  }

  getMainResultSubKernelArray4Texture() {
    const result = [];
    if (!this.subKernels) return result;
    switch (this.returnType) {
      case 'Number':
      case 'Float':
      case 'Integer':
        for (let i = 0; i < this.subKernels.length; ++i) {
          const subKernel = this.subKernels[i];
          if (subKernel.returnType === 'Integer') {
            result.push(
              `  gl_FragData[${i + 1}] = float(subKernelResult_${this.subKernels[i].name})`
            );
          } else {
            result.push(
              `  gl_FragData[${i + 1}] = subKernelResult_${this.subKernels[i].name}`
            );
          }
        }
        break;
      case 'Array(2)':
        for (let i = 0; i < this.subKernels.length; ++i) {
          result.push(
            `  gl_FragData[${i + 1}][0] = subKernelResult_${this.subKernels[i].name}[0]`,
            `  gl_FragData[${i + 1}][1] = subKernelResult_${this.subKernels[i].name}[1]`
          );
        }
        break;
      case 'Array(3)':
        for (let i = 0; i < this.subKernels.length; ++i) {
          result.push(
            `  gl_FragData[${i + 1}][0] = subKernelResult_${this.subKernels[i].name}[0]`,
            `  gl_FragData[${i + 1}][1] = subKernelResult_${this.subKernels[i].name}[1]`,
            `  gl_FragData[${i + 1}][2] = subKernelResult_${this.subKernels[i].name}[2]`
          );
        }
        break;
      case 'Array(4)':
        for (let i = 0; i < this.subKernels.length; ++i) {
          result.push(
            `  gl_FragData[${i + 1}][0] = subKernelResult_${this.subKernels[i].name}[0]`,
            `  gl_FragData[${i + 1}][1] = subKernelResult_${this.subKernels[i].name}[1]`,
            `  gl_FragData[${i + 1}][2] = subKernelResult_${this.subKernels[i].name}[2]`,
            `  gl_FragData[${i + 1}][3] = subKernelResult_${this.subKernels[i].name}[3]`
          );
        }
        break;
    }

    return result;
  }

  replaceArtifacts(src, map) {
    return src.replace(/[ ]*__([A-Z]+[0-9]*([_]?[A-Z]*[0-9]?)*)__;\n/g, (match, artifact) => {
      if (map.hasOwnProperty(artifact)) {
        return map[artifact];
      }
      throw `unhandled artifact ${artifact}`;
    });
  }

  getFragmentShader(args) {
    if (this.compiledFragmentShader !== null) {
      return this.compiledFragmentShader;
    }
    return this.compiledFragmentShader = this.replaceArtifacts(this.constructor.fragmentShader, this._getFragShaderArtifactMap(args));
  }

  getVertexShader(args) {
    if (this.compiledVertexShader !== null) {
      return this.compiledVertexShader;
    }
    return this.compiledVertexShader = this.replaceArtifacts(this.constructor.vertexShader, this._getVertShaderArtifactMap(args));
  }

  toString() {
    const setupContextString = utils.linesToString([
      `const gl = context`,
    ]);
    return glKernelString(this.constructor, arguments, this, setupContextString);
  }

  destroy(removeCanvasReferences) {
    if (!this.context) return;
    if (this.buffer) {
      this.context.deleteBuffer(this.buffer);
    }
    if (this.framebuffer) {
      this.context.deleteFramebuffer(this.framebuffer);
    }
    for (const width in this.rawValueFramebuffers) {
      for (const height in this.rawValueFramebuffers[width]) {
        this.context.deleteFramebuffer(this.rawValueFramebuffers[width][height]);
        delete this.rawValueFramebuffers[width][height];
      }
      delete this.rawValueFramebuffers[width];
    }
    if (this.vertShader) {
      this.context.deleteShader(this.vertShader);
    }
    if (this.fragShader) {
      this.context.deleteShader(this.fragShader);
    }
    if (this.program) {
      this.context.deleteProgram(this.program);
    }
    if (this.texture) {
      this.texture.delete();
      const textureCacheIndex = this.textureCache.indexOf(this.texture.texture);
      if (textureCacheIndex > -1) {
        this.textureCache.splice(textureCacheIndex, 1);
      }
      this.texture = null;
    }
    if (this.mappedTextures && this.mappedTextures.length) {
      for (let i = 0; i < this.mappedTextures.length; i++) {
        const mappedTexture = this.mappedTextures[i];
        mappedTexture.delete();
        const textureCacheIndex = this.textureCache.indexOf(mappedTexture.texture);
        if (textureCacheIndex > -1) {
          this.textureCache.splice(textureCacheIndex, 1);
        }
      }
      this.mappedTextures = null;
    }
    if (this.kernelArguments) {
      for (let i = 0; i < this.kernelArguments.length; i++) {
        this.kernelArguments[i].destroy();
      }
    }
    if (this.kernelConstants) {
      for (let i = 0; i < this.kernelConstants.length; i++) {
        this.kernelConstants[i].destroy();
      }
    }
    while (this.textureCache.length > 0) {
      const texture = this.textureCache.pop();
      this.context.deleteTexture(texture);
    }
    if (removeCanvasReferences) {
      const idx = canvases.indexOf(this.canvas);
      if (idx >= 0) {
        canvases[idx] = null;
        maxTexSizes[idx] = null;
      }
    }
    this.destroyExtensions();
    delete this.context;
    delete this.canvas;
    if (!this.gpu) return;
    const i = this.gpu.kernels.indexOf(this);
    if (i === -1) return;
    this.gpu.kernels.splice(i, 1);
  }

  destroyExtensions() {
    this.extensions.OES_texture_float = null;
    this.extensions.OES_texture_float_linear = null;
    this.extensions.OES_element_index_uint = null;
    this.extensions.WEBGL_draw_buffers = null;
  }

  static destroyContext(context) {
    const extension = context.getExtension('WEBGL_lose_context');
    if (extension) {
      extension.loseContext();
    }
  }

  toJSON() {
    const json = super.toJSON();
    json.functionNodes = FunctionBuilder.fromKernel(this, WebGLFunctionNode).toJSON();
    json.settings.threadDim = this.threadDim;
    return json;
  }
}

module.exports = {
  WebGLKernel
};
},{"../../plugins/math-random-uniformly-distributed":112,"../../utils":114,"../function-builder":9,"../gl/kernel":13,"../gl/kernel-string":12,"./fragment-shader":37,"./function-node":38,"./kernel-value-maps":39,"./vertex-shader":71}],71:[function(require,module,exports){
const vertexShader = `__FLOAT_TACTIC_DECLARATION__;
__INT_TACTIC_DECLARATION__;
__SAMPLER_2D_TACTIC_DECLARATION__;

attribute vec2 aPos;
attribute vec2 aTexCoord;

varying vec2 vTexCoord;
uniform vec2 ratio;

void main(void) {
gl_Position = vec4((aPos + vec2(1)) * ratio + vec2(-1), 0, 1);
vTexCoord = aTexCoord;
}`;

module.exports = {
  vertexShader
};
},{}],72:[function(require,module,exports){
const fragmentShader = `#version 300 es
__HEADER__;
__FLOAT_TACTIC_DECLARATION__;
__INT_TACTIC_DECLARATION__;
__SAMPLER_2D_TACTIC_DECLARATION__;
__SAMPLER_2D_ARRAY_TACTIC_DECLARATION__;

const int LOOP_MAX = __LOOP_MAX__;

__PLUGINS__;
__CONSTANTS__;

in vec2 vTexCoord;

float atan2(float v1, float v2) {
if (v1 == 0.0 || v2 == 0.0) return 0.0;
return atan(v1 / v2);
}

float cbrt(float x) {
if (x >= 0.0) {
return pow(x, 1.0 / 3.0);
} else {
return -pow(x, 1.0 / 3.0);
}
}

float expm1(float x) {
return pow(${Math.E}, x) - 1.0; 
}

float fround(highp float x) {
return x;
}

float imul(float v1, float v2) {
return float(int(v1) * int(v2));
}

float log10(float x) {
return log2(x) * (1.0 / log2(10.0));
}

float log1p(float x) {
return log(1.0 + x);
}

float _pow(float v1, float v2) {
if (v2 == 0.0) return 1.0;
return pow(v1, v2);
}

float _round(float x) {
return floor(x + 0.5);
}


const int BIT_COUNT = 32;
int modi(int x, int y) {
return x - y * (x / y);
}

int bitwiseOr(int a, int b) {
int result = 0;
int n = 1;

for (int i = 0; i < BIT_COUNT; i++) {
if ((modi(a, 2) == 1) || (modi(b, 2) == 1)) {
  result += n;
}
a = a / 2;
b = b / 2;
n = n * 2;
if(!(a > 0 || b > 0)) {
  break;
}
}
return result;
}
int bitwiseXOR(int a, int b) {
int result = 0;
int n = 1;

for (int i = 0; i < BIT_COUNT; i++) {
if ((modi(a, 2) == 1) != (modi(b, 2) == 1)) {
  result += n;
}
a = a / 2;
b = b / 2;
n = n * 2;
if(!(a > 0 || b > 0)) {
  break;
}
}
return result;
}
int bitwiseAnd(int a, int b) {
int result = 0;
int n = 1;
for (int i = 0; i < BIT_COUNT; i++) {
if ((modi(a, 2) == 1) && (modi(b, 2) == 1)) {
  result += n;
}
a = a / 2;
b = b / 2;
n = n * 2;
if(!(a > 0 && b > 0)) {
  break;
}
}
return result;
}
int bitwiseNot(int a) {
int result = 0;
int n = 1;

for (int i = 0; i < BIT_COUNT; i++) {
if (modi(a, 2) == 0) {
  result += n;    
}
a = a / 2;
n = n * 2;
}
return result;
}
int bitwiseZeroFillLeftShift(int n, int shift) {
int maxBytes = BIT_COUNT;
for (int i = 0; i < BIT_COUNT; i++) {
if (maxBytes >= n) {
  break;
}
maxBytes *= 2;
}
for (int i = 0; i < BIT_COUNT; i++) {
if (i >= shift) {
  break;
}
n *= 2;
}

int result = 0;
int byteVal = 1;
for (int i = 0; i < BIT_COUNT; i++) {
if (i >= maxBytes) break;
if (modi(n, 2) > 0) { result += byteVal; }
n = int(n / 2);
byteVal *= 2;
}
return result;
}

int bitwiseSignedRightShift(int num, int shifts) {
return int(floor(float(num) / pow(2.0, float(shifts))));
}

int bitwiseZeroFillRightShift(int n, int shift) {
int maxBytes = BIT_COUNT;
for (int i = 0; i < BIT_COUNT; i++) {
if (maxBytes >= n) {
  break;
}
maxBytes *= 2;
}
for (int i = 0; i < BIT_COUNT; i++) {
if (i >= shift) {
  break;
}
n /= 2;
}
int result = 0;
int byteVal = 1;
for (int i = 0; i < BIT_COUNT; i++) {
if (i >= maxBytes) break;
if (modi(n, 2) > 0) { result += byteVal; }
n = int(n / 2);
byteVal *= 2;
}
return result;
}

vec2 integerMod(vec2 x, float y) {
vec2 res = floor(mod(x, y));
return res * step(1.0 - floor(y), -res);
}

vec3 integerMod(vec3 x, float y) {
vec3 res = floor(mod(x, y));
return res * step(1.0 - floor(y), -res);
}

vec4 integerMod(vec4 x, vec4 y) {
vec4 res = floor(mod(x, y));
return res * step(1.0 - floor(y), -res);
}

float integerMod(float x, float y) {
float res = floor(mod(x, y));
return res * (res > floor(y) - 1.0 ? 0.0 : 1.0);
}

int integerMod(int x, int y) {
return x - (y * int(x/y));
}

__DIVIDE_WITH_INTEGER_CHECK__;

// Here be dragons!
// DO NOT OPTIMIZE THIS CODE
// YOU WILL BREAK SOMETHING ON SOMEBODY\'S MACHINE
// LEAVE IT AS IT IS, LEST YOU WASTE YOUR OWN TIME
const vec2 MAGIC_VEC = vec2(1.0, -256.0);
const vec4 SCALE_FACTOR = vec4(1.0, 256.0, 65536.0, 0.0);
const vec4 SCALE_FACTOR_INV = vec4(1.0, 0.00390625, 0.0000152587890625, 0.0); // 1, 1/256, 1/65536
float decode32(vec4 texel) {
__DECODE32_ENDIANNESS__;
texel *= 255.0;
vec2 gte128;
gte128.x = texel.b >= 128.0 ? 1.0 : 0.0;
gte128.y = texel.a >= 128.0 ? 1.0 : 0.0;
float exponent = 2.0 * texel.a - 127.0 + dot(gte128, MAGIC_VEC);
float res = exp2(round(exponent));
texel.b = texel.b - 128.0 * gte128.x;
res = dot(texel, SCALE_FACTOR) * exp2(round(exponent-23.0)) + res;
res *= gte128.y * -2.0 + 1.0;
return res;
}

float decode16(vec4 texel, int index) {
int channel = integerMod(index, 2);
return texel[channel*2] * 255.0 + texel[channel*2 + 1] * 65280.0;
}

float decode8(vec4 texel, int index) {
int channel = integerMod(index, 4);
return texel[channel] * 255.0;
}

vec4 legacyEncode32(float f) {
float F = abs(f);
float sign = f < 0.0 ? 1.0 : 0.0;
float exponent = floor(log2(F));
float mantissa = (exp2(-exponent) * F);
// exponent += floor(log2(mantissa));
vec4 texel = vec4(F * exp2(23.0-exponent)) * SCALE_FACTOR_INV;
texel.rg = integerMod(texel.rg, 256.0);
texel.b = integerMod(texel.b, 128.0);
texel.a = exponent*0.5 + 63.5;
texel.ba += vec2(integerMod(exponent+127.0, 2.0), sign) * 128.0;
texel = floor(texel);
texel *= 0.003921569; // 1/255
__ENCODE32_ENDIANNESS__;
return texel;
}

// https://github.com/gpujs/gpu.js/wiki/Encoder-details
vec4 encode32(float value) {
if (value == 0.0) return vec4(0, 0, 0, 0);

float exponent;
float mantissa;
vec4  result;
float sgn;

sgn = step(0.0, -value);
value = abs(value);

exponent = floor(log2(value));

mantissa = value*pow(2.0, -exponent)-1.0;
exponent = exponent+127.0;
result   = vec4(0,0,0,0);

result.a = floor(exponent/2.0);
exponent = exponent - result.a*2.0;
result.a = result.a + 128.0*sgn;

result.b = floor(mantissa * 128.0);
mantissa = mantissa - result.b / 128.0;
result.b = result.b + exponent*128.0;

result.g = floor(mantissa*32768.0);
mantissa = mantissa - result.g/32768.0;

result.r = floor(mantissa*8388608.0);
return result/255.0;
}
// Dragons end here

int index;
ivec3 threadId;

ivec3 indexTo3D(int idx, ivec3 texDim) {
int z = int(idx / (texDim.x * texDim.y));
idx -= z * int(texDim.x * texDim.y);
int y = int(idx / texDim.x);
int x = int(integerMod(idx, texDim.x));
return ivec3(x, y, z);
}

float get32(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
int index = x + texDim.x * (y + texDim.y * z);
int w = texSize.x;
vec2 st = vec2(float(integerMod(index, w)), float(index / w)) + 0.5;
vec4 texel = texture(tex, st / vec2(texSize));
return decode32(texel);
}

float get16(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
int index = x + (texDim.x * (y + (texDim.y * z)));
int w = texSize.x * 2;
vec2 st = vec2(float(integerMod(index, w)), float(index / w)) + 0.5;
vec4 texel = texture(tex, st / vec2(texSize.x * 2, texSize.y));
return decode16(texel, index);
}

float get8(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
int index = x + (texDim.x * (y + (texDim.y * z)));
int w = texSize.x * 4;
vec2 st = vec2(float(integerMod(index, w)), float(index / w)) + 0.5;
vec4 texel = texture(tex, st / vec2(texSize.x * 4, texSize.y));
return decode8(texel, index);
}

float getMemoryOptimized32(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
int index = x + (texDim.x * (y + (texDim.y * z)));
int channel = integerMod(index, 4);
index = index / 4;
int w = texSize.x;
vec2 st = vec2(float(integerMod(index, w)), float(index / w)) + 0.5;
index = index / 4;
vec4 texel = texture(tex, st / vec2(texSize));
return texel[channel];
}

vec4 getImage2D(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
int index = x + texDim.x * (y + texDim.y * z);
int w = texSize.x;
vec2 st = vec2(float(integerMod(index, w)), float(index / w)) + 0.5;
return texture(tex, st / vec2(texSize));
}

vec4 getImage3D(sampler2DArray tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
int index = x + texDim.x * (y + texDim.y * z);
int w = texSize.x;
vec2 st = vec2(float(integerMod(index, w)), float(index / w)) + 0.5;
return texture(tex, vec3(st / vec2(texSize), z));
}

float getFloatFromSampler2D(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
vec4 result = getImage2D(tex, texSize, texDim, z, y, x);
return result[0];
}

vec2 getVec2FromSampler2D(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
vec4 result = getImage2D(tex, texSize, texDim, z, y, x);
return vec2(result[0], result[1]);
}

vec2 getMemoryOptimizedVec2(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
int index = x + texDim.x * (y + texDim.y * z);
int channel = integerMod(index, 2);
index = index / 2;
int w = texSize.x;
vec2 st = vec2(float(integerMod(index, w)), float(index / w)) + 0.5;
vec4 texel = texture(tex, st / vec2(texSize));
if (channel == 0) return vec2(texel.r, texel.g);
if (channel == 1) return vec2(texel.b, texel.a);
return vec2(0.0, 0.0);
}

vec3 getVec3FromSampler2D(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
vec4 result = getImage2D(tex, texSize, texDim, z, y, x);
return vec3(result[0], result[1], result[2]);
}

vec3 getMemoryOptimizedVec3(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
int fieldIndex = 3 * (x + texDim.x * (y + texDim.y * z));
int vectorIndex = fieldIndex / 4;
int vectorOffset = fieldIndex - vectorIndex * 4;
int readY = vectorIndex / texSize.x;
int readX = vectorIndex - readY * texSize.x;
vec4 tex1 = texture(tex, (vec2(readX, readY) + 0.5) / vec2(texSize));

if (vectorOffset == 0) {
return tex1.xyz;
} else if (vectorOffset == 1) {
return tex1.yzw;
} else {
readX++;
if (readX >= texSize.x) {
  readX = 0;
  readY++;
}
vec4 tex2 = texture(tex, vec2(readX, readY) / vec2(texSize));
if (vectorOffset == 2) {
  return vec3(tex1.z, tex1.w, tex2.x);
} else {
  return vec3(tex1.w, tex2.x, tex2.y);
}
}
}

vec4 getVec4FromSampler2D(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
return getImage2D(tex, texSize, texDim, z, y, x);
}

vec4 getMemoryOptimizedVec4(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
int index = x + texDim.x * (y + texDim.y * z);
int channel = integerMod(index, 2);
int w = texSize.x;
vec2 st = vec2(float(integerMod(index, w)), float(index / w)) + 0.5;
vec4 texel = texture(tex, st / vec2(texSize));
return vec4(texel.r, texel.g, texel.b, texel.a);
}

vec4 actualColor;
void color(float r, float g, float b, float a) {
actualColor = vec4(r,g,b,a);
}

void color(float r, float g, float b) {
color(r,g,b,1.0);
}

float modulo(float number, float divisor) {
if (number < 0.0) {
number = abs(number);
if (divisor < 0.0) {
  divisor = abs(divisor);
}
return -mod(number, divisor);
}
if (divisor < 0.0) {
divisor = abs(divisor);
}
return mod(number, divisor);
}

__INJECTED_NATIVE__;
__MAIN_CONSTANTS__;
__MAIN_ARGUMENTS__;
__KERNEL__;

void main(void) {
index = int(vTexCoord.s * float(uTexSize.x)) + int(vTexCoord.t * float(uTexSize.y)) * uTexSize.x;
__MAIN_RESULT__;
}`;

module.exports = {
  fragmentShader
};
},{}],73:[function(require,module,exports){
const { utils } = require('../../utils');
const { WebGLFunctionNode } = require('../web-gl/function-node');

class WebGL2FunctionNode extends WebGLFunctionNode {

  astIdentifierExpression(idtNode, retArr) {
    if (idtNode.type !== 'Identifier') {
      throw this.astErrorOutput(
        'IdentifierExpression - not an Identifier',
        idtNode
      );
    }

    const type = this.getType(idtNode);

    const name = utils.sanitizeName(idtNode.name);
    if (idtNode.name === 'Infinity') {
      retArr.push('intBitsToFloat(2139095039)');
    } else if (type === 'Boolean') {
      if (this.argumentNames.indexOf(name) > -1) {
        retArr.push(`bool(user_${name})`);
      } else {
        retArr.push(`user_${name}`);
      }
    } else {
      retArr.push(`user_${name}`);
    }

    return retArr;
  }
}

module.exports = {
  WebGL2FunctionNode
};
},{"../../utils":114,"../web-gl/function-node":38}],74:[function(require,module,exports){
const { WebGL2KernelValueBoolean } = require('./kernel-value/boolean');
const { WebGL2KernelValueFloat } = require('./kernel-value/float');
const { WebGL2KernelValueInteger } = require('./kernel-value/integer');

const { WebGL2KernelValueHTMLImage } = require('./kernel-value/html-image');
const { WebGL2KernelValueDynamicHTMLImage } = require('./kernel-value/dynamic-html-image');

const { WebGL2KernelValueHTMLImageArray } = require('./kernel-value/html-image-array');
const { WebGL2KernelValueDynamicHTMLImageArray } = require('./kernel-value/dynamic-html-image-array');

const { WebGL2KernelValueHTMLVideo } = require('./kernel-value/html-video');
const { WebGL2KernelValueDynamicHTMLVideo } = require('./kernel-value/dynamic-html-video');

const { WebGL2KernelValueSingleInput } = require('./kernel-value/single-input');
const { WebGL2KernelValueDynamicSingleInput } = require('./kernel-value/dynamic-single-input');

const { WebGL2KernelValueUnsignedInput } = require('./kernel-value/unsigned-input');
const { WebGL2KernelValueDynamicUnsignedInput } = require('./kernel-value/dynamic-unsigned-input');

const { WebGL2KernelValueMemoryOptimizedNumberTexture } = require('./kernel-value/memory-optimized-number-texture');
const { WebGL2KernelValueDynamicMemoryOptimizedNumberTexture } = require('./kernel-value/dynamic-memory-optimized-number-texture');

const { WebGL2KernelValueNumberTexture } = require('./kernel-value/number-texture');
const { WebGL2KernelValueDynamicNumberTexture } = require('./kernel-value/dynamic-number-texture');

const { WebGL2KernelValueSingleArray } = require('./kernel-value/single-array');
const { WebGL2KernelValueDynamicSingleArray } = require('./kernel-value/dynamic-single-array');

const { WebGL2KernelValueSingleArray1DI } = require('./kernel-value/single-array1d-i');
const { WebGL2KernelValueDynamicSingleArray1DI } = require('./kernel-value/dynamic-single-array1d-i');

const { WebGL2KernelValueSingleArray2DI } = require('./kernel-value/single-array2d-i');
const { WebGL2KernelValueDynamicSingleArray2DI } = require('./kernel-value/dynamic-single-array2d-i');

const { WebGL2KernelValueSingleArray3DI } = require('./kernel-value/single-array3d-i');
const { WebGL2KernelValueDynamicSingleArray3DI } = require('./kernel-value/dynamic-single-array3d-i');

const { WebGL2KernelValueArray2 } = require('./kernel-value/array2');
const { WebGL2KernelValueArray3 } = require('./kernel-value/array3');
const { WebGL2KernelValueArray4 } = require('./kernel-value/array4');

const { WebGL2KernelValueUnsignedArray } = require('./kernel-value/unsigned-array');
const { WebGL2KernelValueDynamicUnsignedArray } = require('./kernel-value/dynamic-unsigned-array');

const kernelValueMaps = {
  unsigned: {
    dynamic: {
      'Boolean': WebGL2KernelValueBoolean,
      'Integer': WebGL2KernelValueInteger,
      'Float': WebGL2KernelValueFloat,
      'Array': WebGL2KernelValueDynamicUnsignedArray,
      'Array(2)': WebGL2KernelValueArray2,
      'Array(3)': WebGL2KernelValueArray3,
      'Array(4)': WebGL2KernelValueArray4,
      'Array1D(2)': false,
      'Array1D(3)': false,
      'Array1D(4)': false,
      'Array2D(2)': false,
      'Array2D(3)': false,
      'Array2D(4)': false,
      'Array3D(2)': false,
      'Array3D(3)': false,
      'Array3D(4)': false,
      'Input': WebGL2KernelValueDynamicUnsignedInput,
      'NumberTexture': WebGL2KernelValueDynamicNumberTexture,
      'ArrayTexture(1)': WebGL2KernelValueDynamicNumberTexture,
      'ArrayTexture(2)': WebGL2KernelValueDynamicNumberTexture,
      'ArrayTexture(3)': WebGL2KernelValueDynamicNumberTexture,
      'ArrayTexture(4)': WebGL2KernelValueDynamicNumberTexture,
      'MemoryOptimizedNumberTexture': WebGL2KernelValueDynamicMemoryOptimizedNumberTexture,
      'HTMLCanvas': WebGL2KernelValueDynamicHTMLImage,
      'OffscreenCanvas': WebGL2KernelValueDynamicHTMLImage,
      'HTMLImage': WebGL2KernelValueDynamicHTMLImage,
      'ImageBitmap': WebGL2KernelValueDynamicHTMLImage,
      'ImageData': WebGL2KernelValueDynamicHTMLImage,
      'HTMLImageArray': WebGL2KernelValueDynamicHTMLImageArray,
      'HTMLVideo': WebGL2KernelValueDynamicHTMLVideo,
    },
    static: {
      'Boolean': WebGL2KernelValueBoolean,
      'Float': WebGL2KernelValueFloat,
      'Integer': WebGL2KernelValueInteger,
      'Array': WebGL2KernelValueUnsignedArray,
      'Array(2)': WebGL2KernelValueArray2,
      'Array(3)': WebGL2KernelValueArray3,
      'Array(4)': WebGL2KernelValueArray4,
      'Array1D(2)': false,
      'Array1D(3)': false,
      'Array1D(4)': false,
      'Array2D(2)': false,
      'Array2D(3)': false,
      'Array2D(4)': false,
      'Array3D(2)': false,
      'Array3D(3)': false,
      'Array3D(4)': false,
      'Input': WebGL2KernelValueUnsignedInput,
      'NumberTexture': WebGL2KernelValueNumberTexture,
      'ArrayTexture(1)': WebGL2KernelValueNumberTexture,
      'ArrayTexture(2)': WebGL2KernelValueNumberTexture,
      'ArrayTexture(3)': WebGL2KernelValueNumberTexture,
      'ArrayTexture(4)': WebGL2KernelValueNumberTexture,
      'MemoryOptimizedNumberTexture': WebGL2KernelValueDynamicMemoryOptimizedNumberTexture,
      'HTMLCanvas': WebGL2KernelValueHTMLImage,
      'OffscreenCanvas': WebGL2KernelValueHTMLImage,
      'HTMLImage': WebGL2KernelValueHTMLImage,
      'ImageBitmap': WebGL2KernelValueHTMLImage,
      'ImageData': WebGL2KernelValueHTMLImage,
      'HTMLImageArray': WebGL2KernelValueHTMLImageArray,
      'HTMLVideo': WebGL2KernelValueHTMLVideo,
    }
  },
  single: {
    dynamic: {
      'Boolean': WebGL2KernelValueBoolean,
      'Integer': WebGL2KernelValueInteger,
      'Float': WebGL2KernelValueFloat,
      'Array': WebGL2KernelValueDynamicSingleArray,
      'Array(2)': WebGL2KernelValueArray2,
      'Array(3)': WebGL2KernelValueArray3,
      'Array(4)': WebGL2KernelValueArray4,
      'Array1D(2)': WebGL2KernelValueDynamicSingleArray1DI,
      'Array1D(3)': WebGL2KernelValueDynamicSingleArray1DI,
      'Array1D(4)': WebGL2KernelValueDynamicSingleArray1DI,
      'Array2D(2)': WebGL2KernelValueDynamicSingleArray2DI,
      'Array2D(3)': WebGL2KernelValueDynamicSingleArray2DI,
      'Array2D(4)': WebGL2KernelValueDynamicSingleArray2DI,
      'Array3D(2)': WebGL2KernelValueDynamicSingleArray3DI,
      'Array3D(3)': WebGL2KernelValueDynamicSingleArray3DI,
      'Array3D(4)': WebGL2KernelValueDynamicSingleArray3DI,
      'Input': WebGL2KernelValueDynamicSingleInput,
      'NumberTexture': WebGL2KernelValueDynamicNumberTexture,
      'ArrayTexture(1)': WebGL2KernelValueDynamicNumberTexture,
      'ArrayTexture(2)': WebGL2KernelValueDynamicNumberTexture,
      'ArrayTexture(3)': WebGL2KernelValueDynamicNumberTexture,
      'ArrayTexture(4)': WebGL2KernelValueDynamicNumberTexture,
      'MemoryOptimizedNumberTexture': WebGL2KernelValueDynamicMemoryOptimizedNumberTexture,
      'HTMLCanvas': WebGL2KernelValueDynamicHTMLImage,
      'OffscreenCanvas': WebGL2KernelValueDynamicHTMLImage,
      'HTMLImage': WebGL2KernelValueDynamicHTMLImage,
      'ImageBitmap': WebGL2KernelValueDynamicHTMLImage,
      'ImageData': WebGL2KernelValueDynamicHTMLImage,
      'HTMLImageArray': WebGL2KernelValueDynamicHTMLImageArray,
      'HTMLVideo': WebGL2KernelValueDynamicHTMLVideo,
    },
    static: {
      'Boolean': WebGL2KernelValueBoolean,
      'Float': WebGL2KernelValueFloat,
      'Integer': WebGL2KernelValueInteger,
      'Array': WebGL2KernelValueSingleArray,
      'Array(2)': WebGL2KernelValueArray2,
      'Array(3)': WebGL2KernelValueArray3,
      'Array(4)': WebGL2KernelValueArray4,
      'Array1D(2)': WebGL2KernelValueSingleArray1DI,
      'Array1D(3)': WebGL2KernelValueSingleArray1DI,
      'Array1D(4)': WebGL2KernelValueSingleArray1DI,
      'Array2D(2)': WebGL2KernelValueSingleArray2DI,
      'Array2D(3)': WebGL2KernelValueSingleArray2DI,
      'Array2D(4)': WebGL2KernelValueSingleArray2DI,
      'Array3D(2)': WebGL2KernelValueSingleArray3DI,
      'Array3D(3)': WebGL2KernelValueSingleArray3DI,
      'Array3D(4)': WebGL2KernelValueSingleArray3DI,
      'Input': WebGL2KernelValueSingleInput,
      'NumberTexture': WebGL2KernelValueNumberTexture,
      'ArrayTexture(1)': WebGL2KernelValueNumberTexture,
      'ArrayTexture(2)': WebGL2KernelValueNumberTexture,
      'ArrayTexture(3)': WebGL2KernelValueNumberTexture,
      'ArrayTexture(4)': WebGL2KernelValueNumberTexture,
      'MemoryOptimizedNumberTexture': WebGL2KernelValueMemoryOptimizedNumberTexture,
      'HTMLCanvas': WebGL2KernelValueHTMLImage,
      'OffscreenCanvas': WebGL2KernelValueHTMLImage,
      'HTMLImage': WebGL2KernelValueHTMLImage,
      'ImageBitmap': WebGL2KernelValueHTMLImage,
      'ImageData': WebGL2KernelValueHTMLImage,
      'HTMLImageArray': WebGL2KernelValueHTMLImageArray,
      'HTMLVideo': WebGL2KernelValueHTMLVideo,
    }
  },
};

function lookupKernelValueType(type, dynamic, precision, value) {
  if (!type) {
    throw new Error('type missing');
  }
  if (!dynamic) {
    throw new Error('dynamic missing');
  }
  if (!precision) {
    throw new Error('precision missing');
  }
  if (value.type) {
    type = value.type;
  }
  const types = kernelValueMaps[precision][dynamic];
  if (types[type] === false) {
    return null;
  } else if (types[type] === undefined) {
    throw new Error(`Could not find a KernelValue for ${ type }`);
  }
  return types[type];
}

module.exports = {
  kernelValueMaps,
  lookupKernelValueType
};
},{"./kernel-value/array2":75,"./kernel-value/array3":76,"./kernel-value/array4":77,"./kernel-value/boolean":78,"./kernel-value/dynamic-html-image":80,"./kernel-value/dynamic-html-image-array":79,"./kernel-value/dynamic-html-video":81,"./kernel-value/dynamic-memory-optimized-number-texture":82,"./kernel-value/dynamic-number-texture":83,"./kernel-value/dynamic-single-array":84,"./kernel-value/dynamic-single-array1d-i":85,"./kernel-value/dynamic-single-array2d-i":86,"./kernel-value/dynamic-single-array3d-i":87,"./kernel-value/dynamic-single-input":88,"./kernel-value/dynamic-unsigned-array":89,"./kernel-value/dynamic-unsigned-input":90,"./kernel-value/float":91,"./kernel-value/html-image":93,"./kernel-value/html-image-array":92,"./kernel-value/html-video":94,"./kernel-value/integer":95,"./kernel-value/memory-optimized-number-texture":96,"./kernel-value/number-texture":97,"./kernel-value/single-array":98,"./kernel-value/single-array1d-i":99,"./kernel-value/single-array2d-i":100,"./kernel-value/single-array3d-i":101,"./kernel-value/single-input":102,"./kernel-value/unsigned-array":103,"./kernel-value/unsigned-input":104}],75:[function(require,module,exports){
const { WebGLKernelValueArray2 } = require('../../web-gl/kernel-value/array2');

class WebGL2KernelValueArray2 extends WebGLKernelValueArray2 {}

module.exports = {
  WebGL2KernelValueArray2
};
},{"../../web-gl/kernel-value/array2":41}],76:[function(require,module,exports){
const { WebGLKernelValueArray3 } = require('../../web-gl/kernel-value/array3');

class WebGL2KernelValueArray3 extends WebGLKernelValueArray3 {}

module.exports = {
  WebGL2KernelValueArray3
};
},{"../../web-gl/kernel-value/array3":42}],77:[function(require,module,exports){
const { WebGLKernelValueArray4 } = require('../../web-gl/kernel-value/array4');

class WebGL2KernelValueArray4 extends WebGLKernelValueArray4 {}

module.exports = {
  WebGL2KernelValueArray4
};
},{"../../web-gl/kernel-value/array4":43}],78:[function(require,module,exports){
const { WebGLKernelValueBoolean } = require('../../web-gl/kernel-value/boolean');

class WebGL2KernelValueBoolean extends WebGLKernelValueBoolean {}

module.exports = {
  WebGL2KernelValueBoolean
};
},{"../../web-gl/kernel-value/boolean":44}],79:[function(require,module,exports){
const { utils } = require('../../../utils');
const { WebGL2KernelValueHTMLImageArray } = require('./html-image-array');

class WebGL2KernelValueDynamicHTMLImageArray extends WebGL2KernelValueHTMLImageArray {
  getSource() {
    const variablePrecision = this.getVariablePrecisionString();
    return utils.linesToString([
      `uniform ${ variablePrecision } sampler2DArray ${this.id}`,
      `uniform ${ variablePrecision } ivec2 ${this.sizeId}`,
      `uniform ${ variablePrecision } ivec3 ${this.dimensionsId}`,
    ]);
  }

  updateValue(images) {
    const { width, height } = images[0];
    this.checkSize(width, height);
    this.dimensions = [width, height, images.length];
    this.textureSize = [width, height];
    this.kernel.setUniform3iv(this.dimensionsId, this.dimensions);
    this.kernel.setUniform2iv(this.sizeId, this.textureSize);
    super.updateValue(images);
  }
}

module.exports = {
  WebGL2KernelValueDynamicHTMLImageArray
};
},{"../../../utils":114,"./html-image-array":92}],80:[function(require,module,exports){
const { utils } = require('../../../utils');
const { WebGLKernelValueDynamicHTMLImage } = require('../../web-gl/kernel-value/dynamic-html-image');

class WebGL2KernelValueDynamicHTMLImage extends WebGLKernelValueDynamicHTMLImage {
  getSource() {
    const variablePrecision = this.getVariablePrecisionString();
    return utils.linesToString([
      `uniform ${ variablePrecision } sampler2D ${this.id}`,
      `uniform ${ variablePrecision } ivec2 ${this.sizeId}`,
      `uniform ${ variablePrecision } ivec3 ${this.dimensionsId}`,
    ]);
  }
}

module.exports = {
  WebGL2KernelValueDynamicHTMLImage
};
},{"../../../utils":114,"../../web-gl/kernel-value/dynamic-html-image":45}],81:[function(require,module,exports){
require('../../../utils');
const { WebGL2KernelValueDynamicHTMLImage } = require('./dynamic-html-image');

class WebGL2KernelValueDynamicHTMLVideo extends WebGL2KernelValueDynamicHTMLImage {}

module.exports = {
  WebGL2KernelValueDynamicHTMLVideo
};
},{"../../../utils":114,"./dynamic-html-image":80}],82:[function(require,module,exports){
const { utils } = require('../../../utils');
const { WebGLKernelValueDynamicMemoryOptimizedNumberTexture } = require('../../web-gl/kernel-value/dynamic-memory-optimized-number-texture');

class WebGL2KernelValueDynamicMemoryOptimizedNumberTexture extends WebGLKernelValueDynamicMemoryOptimizedNumberTexture {
  getSource() {
    return utils.linesToString([
      `uniform sampler2D ${this.id}`,
      `uniform ivec2 ${this.sizeId}`,
      `uniform ivec3 ${this.dimensionsId}`,
    ]);
  }
}

module.exports = {
  WebGL2KernelValueDynamicMemoryOptimizedNumberTexture
};
},{"../../../utils":114,"../../web-gl/kernel-value/dynamic-memory-optimized-number-texture":47}],83:[function(require,module,exports){
const { utils } = require('../../../utils');
const { WebGLKernelValueDynamicNumberTexture } = require('../../web-gl/kernel-value/dynamic-number-texture');

class WebGL2KernelValueDynamicNumberTexture extends WebGLKernelValueDynamicNumberTexture {
  getSource() {
    const variablePrecision = this.getVariablePrecisionString();
    return utils.linesToString([
      `uniform ${ variablePrecision } sampler2D ${this.id}`,
      `uniform ${ variablePrecision } ivec2 ${this.sizeId}`,
      `uniform ${ variablePrecision } ivec3 ${this.dimensionsId}`,
    ]);
  }
}

module.exports = {
  WebGL2KernelValueDynamicNumberTexture
};
},{"../../../utils":114,"../../web-gl/kernel-value/dynamic-number-texture":48}],84:[function(require,module,exports){
const { utils } = require('../../../utils');
const { WebGL2KernelValueSingleArray } = require('../../web-gl2/kernel-value/single-array');

class WebGL2KernelValueDynamicSingleArray extends WebGL2KernelValueSingleArray {
  getSource() {
    const variablePrecision = this.getVariablePrecisionString();
    return utils.linesToString([
      `uniform ${ variablePrecision } sampler2D ${this.id}`,
      `uniform ${ variablePrecision } ivec2 ${this.sizeId}`,
      `uniform ${ variablePrecision } ivec3 ${this.dimensionsId}`,
    ]);
  }

  updateValue(value) {
    this.dimensions = utils.getDimensions(value, true);
    this.textureSize = utils.getMemoryOptimizedFloatTextureSize(this.dimensions, this.bitRatio);
    this.uploadArrayLength = this.textureSize[0] * this.textureSize[1] * this.bitRatio;
    this.checkSize(this.textureSize[0], this.textureSize[1]);
    this.uploadValue = new Float32Array(this.uploadArrayLength);
    this.kernel.setUniform3iv(this.dimensionsId, this.dimensions);
    this.kernel.setUniform2iv(this.sizeId, this.textureSize);
    super.updateValue(value);
  }
}

module.exports = {
  WebGL2KernelValueDynamicSingleArray
};
},{"../../../utils":114,"../../web-gl2/kernel-value/single-array":98}],85:[function(require,module,exports){
const { utils } = require('../../../utils');
const { WebGL2KernelValueSingleArray1DI } = require('../../web-gl2/kernel-value/single-array1d-i');

class WebGL2KernelValueDynamicSingleArray1DI extends WebGL2KernelValueSingleArray1DI {
  getSource() {
    const variablePrecision = this.getVariablePrecisionString();
    return utils.linesToString([
      `uniform ${ variablePrecision } sampler2D ${this.id}`,
      `uniform ${ variablePrecision } ivec2 ${this.sizeId}`,
      `uniform ${ variablePrecision } ivec3 ${this.dimensionsId}`,
    ]);
  }

  updateValue(value) {
    this.setShape(value);
    this.kernel.setUniform3iv(this.dimensionsId, this.dimensions);
    this.kernel.setUniform2iv(this.sizeId, this.textureSize);
    super.updateValue(value);
  }
}

module.exports = {
  WebGL2KernelValueDynamicSingleArray1DI
};
},{"../../../utils":114,"../../web-gl2/kernel-value/single-array1d-i":99}],86:[function(require,module,exports){
const { utils } = require('../../../utils');
const { WebGL2KernelValueSingleArray2DI } = require('../../web-gl2/kernel-value/single-array2d-i');

class WebGL2KernelValueDynamicSingleArray2DI extends WebGL2KernelValueSingleArray2DI {
  getSource() {
    const variablePrecision = this.getVariablePrecisionString();
    return utils.linesToString([
      `uniform ${ variablePrecision } sampler2D ${this.id}`,
      `uniform ${ variablePrecision } ivec2 ${this.sizeId}`,
      `uniform ${ variablePrecision } ivec3 ${this.dimensionsId}`,
    ]);
  }

  updateValue(value) {
    this.setShape(value);
    this.kernel.setUniform3iv(this.dimensionsId, this.dimensions);
    this.kernel.setUniform2iv(this.sizeId, this.textureSize);
    super.updateValue(value);
  }
}

module.exports = {
  WebGL2KernelValueDynamicSingleArray2DI
};
},{"../../../utils":114,"../../web-gl2/kernel-value/single-array2d-i":100}],87:[function(require,module,exports){
const { utils } = require('../../../utils');
const { WebGL2KernelValueSingleArray3DI } = require('../../web-gl2/kernel-value/single-array3d-i');

class WebGL2KernelValueDynamicSingleArray3DI extends WebGL2KernelValueSingleArray3DI {
  getSource() {
    const variablePrecision = this.getVariablePrecisionString();
    return utils.linesToString([
      `uniform ${ variablePrecision } sampler2D ${this.id}`,
      `uniform ${ variablePrecision } ivec2 ${this.sizeId}`,
      `uniform ${ variablePrecision } ivec3 ${this.dimensionsId}`,
    ]);
  }

  updateValue(value) {
    this.setShape(value);
    this.kernel.setUniform3iv(this.dimensionsId, this.dimensions);
    this.kernel.setUniform2iv(this.sizeId, this.textureSize);
    super.updateValue(value);
  }
}

module.exports = {
  WebGL2KernelValueDynamicSingleArray3DI
};
},{"../../../utils":114,"../../web-gl2/kernel-value/single-array3d-i":101}],88:[function(require,module,exports){
const { utils } = require('../../../utils');
const { WebGL2KernelValueSingleInput } = require('../../web-gl2/kernel-value/single-input');

class WebGL2KernelValueDynamicSingleInput extends WebGL2KernelValueSingleInput {
  getSource() {
    const variablePrecision = this.getVariablePrecisionString();
    return utils.linesToString([
      `uniform ${ variablePrecision } sampler2D ${this.id}`,
      `uniform ${ variablePrecision } ivec2 ${this.sizeId}`,
      `uniform ${ variablePrecision } ivec3 ${this.dimensionsId}`,
    ]);
  }

  updateValue(value) {
    let [w, h, d] = value.size;
    this.dimensions = new Int32Array([w || 1, h || 1, d || 1]);
    this.textureSize = utils.getMemoryOptimizedFloatTextureSize(this.dimensions, this.bitRatio);
    this.uploadArrayLength = this.textureSize[0] * this.textureSize[1] * this.bitRatio;
    this.checkSize(this.textureSize[0], this.textureSize[1]);
    this.uploadValue = new Float32Array(this.uploadArrayLength);
    this.kernel.setUniform3iv(this.dimensionsId, this.dimensions);
    this.kernel.setUniform2iv(this.sizeId, this.textureSize);
    super.updateValue(value);
  }
}

module.exports = {
  WebGL2KernelValueDynamicSingleInput
};
},{"../../../utils":114,"../../web-gl2/kernel-value/single-input":102}],89:[function(require,module,exports){
const { utils } = require('../../../utils');
const { WebGLKernelValueDynamicUnsignedArray } = require('../../web-gl/kernel-value/dynamic-unsigned-array');

class WebGL2KernelValueDynamicUnsignedArray extends WebGLKernelValueDynamicUnsignedArray {
  getSource() {
    const variablePrecision = this.getVariablePrecisionString();
    return utils.linesToString([
      `uniform ${ variablePrecision } sampler2D ${this.id}`,
      `uniform ${ variablePrecision } ivec2 ${this.sizeId}`,
      `uniform ${ variablePrecision } ivec3 ${this.dimensionsId}`,
    ]);
  }
}

module.exports = {
  WebGL2KernelValueDynamicUnsignedArray
};
},{"../../../utils":114,"../../web-gl/kernel-value/dynamic-unsigned-array":54}],90:[function(require,module,exports){
const { utils } = require('../../../utils');
const { WebGLKernelValueDynamicUnsignedInput } = require('../../web-gl/kernel-value/dynamic-unsigned-input');

class WebGL2KernelValueDynamicUnsignedInput extends WebGLKernelValueDynamicUnsignedInput {
  getSource() {
    const variablePrecision = this.getVariablePrecisionString();
    return utils.linesToString([
      `uniform ${ variablePrecision } sampler2D ${this.id}`,
      `uniform ${ variablePrecision } ivec2 ${this.sizeId}`,
      `uniform ${ variablePrecision } ivec3 ${this.dimensionsId}`,
    ]);
  }
}

module.exports = {
  WebGL2KernelValueDynamicUnsignedInput
};
},{"../../../utils":114,"../../web-gl/kernel-value/dynamic-unsigned-input":55}],91:[function(require,module,exports){
require('../../../utils');
const { WebGLKernelValueFloat } = require('../../web-gl/kernel-value/float');

class WebGL2KernelValueFloat extends WebGLKernelValueFloat {}

module.exports = {
  WebGL2KernelValueFloat
};
},{"../../../utils":114,"../../web-gl/kernel-value/float":56}],92:[function(require,module,exports){
const { utils } = require('../../../utils');
const { WebGLKernelArray } = require('../../web-gl/kernel-value/array');

class WebGL2KernelValueHTMLImageArray extends WebGLKernelArray {
  constructor(value, settings) {
    super(value, settings);
    this.checkSize(value[0].width, value[0].height);
    this.dimensions = [value[0].width, value[0].height, value.length];
    this.textureSize = [value[0].width, value[0].height];
  }
  defineTexture() {
    const { context: gl } = this;
    gl.activeTexture(this.contextHandle);
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.texture);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  }

  getStringValueHandler() {
    return `const uploadValue_${this.name} = ${this.varName};\n`;
  }
  getSource() {
    const variablePrecision = this.getVariablePrecisionString();
    return utils.linesToString([
      `uniform ${ variablePrecision } sampler2DArray ${this.id}`,
      `${ variablePrecision } ivec2 ${this.sizeId} = ivec2(${this.textureSize[0]}, ${this.textureSize[1]})`,
      `${ variablePrecision } ivec3 ${this.dimensionsId} = ivec3(${this.dimensions[0]}, ${this.dimensions[1]}, ${this.dimensions[2]})`,
    ]);
  }

  updateValue(images) {
    const { context: gl } = this;
    gl.activeTexture(this.contextHandle);
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage3D(
      gl.TEXTURE_2D_ARRAY,
      0,
      gl.RGBA,
      images[0].width,
      images[0].height,
      images.length,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null
    );
    for (let i = 0; i < images.length; i++) {
      const xOffset = 0;
      const yOffset = 0;
      const imageDepth = 1;
      gl.texSubImage3D(
        gl.TEXTURE_2D_ARRAY,
        0,
        xOffset,
        yOffset,
        i,
        images[i].width,
        images[i].height,
        imageDepth,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        this.uploadValue = images[i]
      );
    }
    this.kernel.setUniform1i(this.id, this.index);
  }
}

module.exports = {
  WebGL2KernelValueHTMLImageArray
};
},{"../../../utils":114,"../../web-gl/kernel-value/array":40}],93:[function(require,module,exports){
const { utils } = require('../../../utils');
const { WebGLKernelValueHTMLImage } = require('../../web-gl/kernel-value/html-image');

class WebGL2KernelValueHTMLImage extends WebGLKernelValueHTMLImage {
  getSource() {
    const variablePrecision = this.getVariablePrecisionString();
    return utils.linesToString([
      `uniform ${ variablePrecision } sampler2D ${this.id}`,
      `${ variablePrecision } ivec2 ${this.sizeId} = ivec2(${this.textureSize[0]}, ${this.textureSize[1]})`,
      `${ variablePrecision } ivec3 ${this.dimensionsId} = ivec3(${this.dimensions[0]}, ${this.dimensions[1]}, ${this.dimensions[2]})`,
    ]);
  }
}

module.exports = {
  WebGL2KernelValueHTMLImage
};
},{"../../../utils":114,"../../web-gl/kernel-value/html-image":57}],94:[function(require,module,exports){
require('../../../utils');
const { WebGL2KernelValueHTMLImage } = require('./html-image');

class WebGL2KernelValueHTMLVideo extends WebGL2KernelValueHTMLImage {}

module.exports = {
  WebGL2KernelValueHTMLVideo
};
},{"../../../utils":114,"./html-image":93}],95:[function(require,module,exports){
const { WebGLKernelValueInteger } = require('../../web-gl/kernel-value/integer');

class WebGL2KernelValueInteger extends WebGLKernelValueInteger {
  getSource(value) {
    const variablePrecision = this.getVariablePrecisionString();
    if (this.origin === 'constants') {
      return `const ${ variablePrecision } int ${this.id} = ${ parseInt(value) };\n`;
    }
    return `uniform ${ variablePrecision } int ${this.id};\n`;
  }

  updateValue(value) {
    if (this.origin === 'constants') return;
    this.kernel.setUniform1i(this.id, this.uploadValue = value);
  }
}

module.exports = {
  WebGL2KernelValueInteger
};
},{"../../web-gl/kernel-value/integer":60}],96:[function(require,module,exports){
const { utils } = require('../../../utils');
const { WebGLKernelValueMemoryOptimizedNumberTexture } = require('../../web-gl/kernel-value/memory-optimized-number-texture');

class WebGL2KernelValueMemoryOptimizedNumberTexture extends WebGLKernelValueMemoryOptimizedNumberTexture {
  getSource() {
    const { id, sizeId, textureSize, dimensionsId, dimensions } = this;
    const variablePrecision = this.getVariablePrecisionString();
    return utils.linesToString([
      `uniform sampler2D ${id}`,
      `${ variablePrecision } ivec2 ${sizeId} = ivec2(${textureSize[0]}, ${textureSize[1]})`,
      `${ variablePrecision } ivec3 ${dimensionsId} = ivec3(${dimensions[0]}, ${dimensions[1]}, ${dimensions[2]})`,
    ]);
  }
}

module.exports = {
  WebGL2KernelValueMemoryOptimizedNumberTexture
};
},{"../../../utils":114,"../../web-gl/kernel-value/memory-optimized-number-texture":61}],97:[function(require,module,exports){
const { utils } = require('../../../utils');
const { WebGLKernelValueNumberTexture } = require('../../web-gl/kernel-value/number-texture');

class WebGL2KernelValueNumberTexture extends WebGLKernelValueNumberTexture {
  getSource() {
    const { id, sizeId, textureSize, dimensionsId, dimensions } = this;
    const variablePrecision = this.getVariablePrecisionString();
    return utils.linesToString([
      `uniform ${ variablePrecision } sampler2D ${id}`,
      `${ variablePrecision } ivec2 ${sizeId} = ivec2(${textureSize[0]}, ${textureSize[1]})`,
      `${ variablePrecision } ivec3 ${dimensionsId} = ivec3(${dimensions[0]}, ${dimensions[1]}, ${dimensions[2]})`,
    ]);
  }
}

module.exports = {
  WebGL2KernelValueNumberTexture
};
},{"../../../utils":114,"../../web-gl/kernel-value/number-texture":62}],98:[function(require,module,exports){
const { utils } = require('../../../utils');
const { WebGLKernelValueSingleArray } = require('../../web-gl/kernel-value/single-array');

class WebGL2KernelValueSingleArray extends WebGLKernelValueSingleArray {
  getSource() {
    const variablePrecision = this.getVariablePrecisionString();
    return utils.linesToString([
      `uniform ${ variablePrecision } sampler2D ${this.id}`,
      `${ variablePrecision } ivec2 ${this.sizeId} = ivec2(${this.textureSize[0]}, ${this.textureSize[1]})`,
      `${ variablePrecision } ivec3 ${this.dimensionsId} = ivec3(${this.dimensions[0]}, ${this.dimensions[1]}, ${this.dimensions[2]})`,
    ]);
  }

  updateValue(value) {
    if (value.constructor !== this.initialValueConstructor) {
      this.onUpdateValueMismatch(value.constructor);
      return;
    }
    const { context: gl } = this;
    utils.flattenTo(value, this.uploadValue);
    gl.activeTexture(this.contextHandle);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, this.textureSize[0], this.textureSize[1], 0, gl.RGBA, gl.FLOAT, this.uploadValue);
    this.kernel.setUniform1i(this.id, this.index);
  }
}

module.exports = {
  WebGL2KernelValueSingleArray
};
},{"../../../utils":114,"../../web-gl/kernel-value/single-array":63}],99:[function(require,module,exports){
const { utils } = require('../../../utils');
const { WebGLKernelValueSingleArray1DI } = require('../../web-gl/kernel-value/single-array1d-i');

class WebGL2KernelValueSingleArray1DI extends WebGLKernelValueSingleArray1DI {
  updateValue(value) {
    if (value.constructor !== this.initialValueConstructor) {
      this.onUpdateValueMismatch(value.constructor);
      return;
    }
    const { context: gl } = this;
    utils.flattenTo(value, this.uploadValue);
    gl.activeTexture(this.contextHandle);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, this.textureSize[0], this.textureSize[1], 0, gl.RGBA, gl.FLOAT, this.uploadValue);
    this.kernel.setUniform1i(this.id, this.index);
  }
}

module.exports = {
  WebGL2KernelValueSingleArray1DI
};
},{"../../../utils":114,"../../web-gl/kernel-value/single-array1d-i":64}],100:[function(require,module,exports){
const { utils } = require('../../../utils');
const { WebGLKernelValueSingleArray2DI } = require('../../web-gl/kernel-value/single-array2d-i');

class WebGL2KernelValueSingleArray2DI extends WebGLKernelValueSingleArray2DI {
  updateValue(value) {
    if (value.constructor !== this.initialValueConstructor) {
      this.onUpdateValueMismatch(value.constructor);
      return;
    }
    const { context: gl } = this;
    utils.flattenTo(value, this.uploadValue);
    gl.activeTexture(this.contextHandle);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, this.textureSize[0], this.textureSize[1], 0, gl.RGBA, gl.FLOAT, this.uploadValue);
    this.kernel.setUniform1i(this.id, this.index);
  }
}

module.exports = {
  WebGL2KernelValueSingleArray2DI
};
},{"../../../utils":114,"../../web-gl/kernel-value/single-array2d-i":65}],101:[function(require,module,exports){
const { utils } = require('../../../utils');
const { WebGLKernelValueSingleArray3DI } = require('../../web-gl/kernel-value/single-array3d-i');

class WebGL2KernelValueSingleArray3DI extends WebGLKernelValueSingleArray3DI {
  updateValue(value) {
    if (value.constructor !== this.initialValueConstructor) {
      this.onUpdateValueMismatch(value.constructor);
      return;
    }
    const { context: gl } = this;
    utils.flattenTo(value, this.uploadValue);
    gl.activeTexture(this.contextHandle);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, this.textureSize[0], this.textureSize[1], 0, gl.RGBA, gl.FLOAT, this.uploadValue);
    this.kernel.setUniform1i(this.id, this.index);
  }
}

module.exports = {
  WebGL2KernelValueSingleArray3DI
};
},{"../../../utils":114,"../../web-gl/kernel-value/single-array3d-i":66}],102:[function(require,module,exports){
const { utils } = require('../../../utils');
const { WebGLKernelValueSingleInput } = require('../../web-gl/kernel-value/single-input');

class WebGL2KernelValueSingleInput extends WebGLKernelValueSingleInput {
  getSource() {
    const variablePrecision = this.getVariablePrecisionString();
    return utils.linesToString([
      `uniform ${ variablePrecision } sampler2D ${this.id}`,
      `${ variablePrecision } ivec2 ${this.sizeId} = ivec2(${this.textureSize[0]}, ${this.textureSize[1]})`,
      `${ variablePrecision } ivec3 ${this.dimensionsId} = ivec3(${this.dimensions[0]}, ${this.dimensions[1]}, ${this.dimensions[2]})`,
    ]);
  }

  updateValue(input) {
    const { context: gl } = this;
    utils.flattenTo(input.value, this.uploadValue);
    gl.activeTexture(this.contextHandle);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, this.textureSize[0], this.textureSize[1], 0, gl.RGBA, gl.FLOAT, this.uploadValue);
    this.kernel.setUniform1i(this.id, this.index);
  }
}

module.exports = {
  WebGL2KernelValueSingleInput
};
},{"../../../utils":114,"../../web-gl/kernel-value/single-input":67}],103:[function(require,module,exports){
const { utils } = require('../../../utils');
const { WebGLKernelValueUnsignedArray } = require('../../web-gl/kernel-value/unsigned-array');

class WebGL2KernelValueUnsignedArray extends WebGLKernelValueUnsignedArray {
  getSource() {
    const variablePrecision = this.getVariablePrecisionString();
    return utils.linesToString([
      `uniform ${ variablePrecision } sampler2D ${this.id}`,
      `${ variablePrecision } ivec2 ${this.sizeId} = ivec2(${this.textureSize[0]}, ${this.textureSize[1]})`,
      `${ variablePrecision } ivec3 ${this.dimensionsId} = ivec3(${this.dimensions[0]}, ${this.dimensions[1]}, ${this.dimensions[2]})`,
    ]);
  }
}

module.exports = {
  WebGL2KernelValueUnsignedArray
};
},{"../../../utils":114,"../../web-gl/kernel-value/unsigned-array":68}],104:[function(require,module,exports){
const { utils } = require('../../../utils');
const { WebGLKernelValueUnsignedInput } = require('../../web-gl/kernel-value/unsigned-input');

class WebGL2KernelValueUnsignedInput extends WebGLKernelValueUnsignedInput {
  getSource() {
    const variablePrecision = this.getVariablePrecisionString();
    return utils.linesToString([
      `uniform ${ variablePrecision } sampler2D ${this.id}`,
      `${ variablePrecision } ivec2 ${this.sizeId} = ivec2(${this.textureSize[0]}, ${this.textureSize[1]})`,
      `${ variablePrecision } ivec3 ${this.dimensionsId} = ivec3(${this.dimensions[0]}, ${this.dimensions[1]}, ${this.dimensions[2]})`,
    ]);
  }
}

module.exports = {
  WebGL2KernelValueUnsignedInput
};
},{"../../../utils":114,"../../web-gl/kernel-value/unsigned-input":69}],105:[function(require,module,exports){
const { WebGLKernel } = require('../web-gl/kernel');
const { WebGL2FunctionNode } = require('./function-node');
const { FunctionBuilder } = require('../function-builder');
const { utils } = require('../../utils');
const { fragmentShader } = require('./fragment-shader');
const { vertexShader } = require('./vertex-shader');
const { lookupKernelValueType } = require('./kernel-value-maps');

let isSupported = null;
let testCanvas = null;
let testContext = null;

let features = null;

class WebGL2Kernel extends WebGLKernel {
  static get isSupported() {
    if (isSupported !== null) {
      return isSupported;
    }
    this.setupFeatureChecks();
    isSupported = this.isContextMatch(testContext);
    return isSupported;
  }

  static setupFeatureChecks() {
    if (typeof document !== 'undefined') {
      testCanvas = document.createElement('canvas');
    } else if (typeof OffscreenCanvas !== 'undefined') {
      testCanvas = new OffscreenCanvas(0, 0);
    }
    if (!testCanvas) return;
    testContext = testCanvas.getContext('webgl2');
    if (!testContext || !testContext.getExtension) return;
    ({
      EXT_color_buffer_float: testContext.getExtension('EXT_color_buffer_float'),
      OES_texture_float_linear: testContext.getExtension('OES_texture_float_linear'),
    });
    features = this.getFeatures();
  }

  static isContextMatch(context) {
    if (typeof WebGL2RenderingContext !== 'undefined') {
      return context instanceof WebGL2RenderingContext;
    }
    return false;
  }

  static getFeatures() {
    const gl = this.testContext;
    return Object.freeze({
      isFloatRead: this.getIsFloatRead(),
      isIntegerDivisionAccurate: this.getIsIntegerDivisionAccurate(),
      isSpeedTacticSupported: this.getIsSpeedTacticSupported(),
      kernelMap: true,
      isTextureFloat: true,
      isDrawBuffers: true,
      channelCount: this.getChannelCount(),
      maxTextureSize: this.getMaxTextureSize(),
      lowIntPrecision: gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_INT),
      lowFloatPrecision: gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_FLOAT),
      mediumIntPrecision: gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_INT),
      mediumFloatPrecision: gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT),
      highIntPrecision: gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT),
      highFloatPrecision: gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT),
    });
  }

  static getIsTextureFloat() {
    return true;
  }

  static getChannelCount() {
    return testContext.getParameter(testContext.MAX_DRAW_BUFFERS);
  }

  static getMaxTextureSize() {
    return testContext.getParameter(testContext.MAX_TEXTURE_SIZE);
  }

  static lookupKernelValueType(type, dynamic, precision, value) {
    return lookupKernelValueType(type, dynamic, precision, value);
  }

  static get testCanvas() {
    return testCanvas;
  }

  static get testContext() {
    return testContext;
  }

  static get features() {
    return features;
  }

  static get fragmentShader() {
    return fragmentShader;
  }
  static get vertexShader() {
    return vertexShader;
  }

  initContext() {
    const settings = {
      alpha: false,
      depth: false,
      antialias: false
    };
    return this.canvas.getContext('webgl2', settings);
  }

  initExtensions() {
    this.extensions = {
      EXT_color_buffer_float: this.context.getExtension('EXT_color_buffer_float'),
      OES_texture_float_linear: this.context.getExtension('OES_texture_float_linear'),
    };
  }

  validateSettings(args) {
    if (!this.validate) {
      this.texSize = utils.getKernelTextureSize({
        optimizeFloatMemory: this.optimizeFloatMemory,
        precision: this.precision,
      }, this.output);
      return;
    }

    const { features } = this.constructor;
    if (this.precision === 'single' && !features.isFloatRead) {
      throw new Error('Float texture outputs are not supported');
    } else if (!this.graphical && this.precision === null) {
      this.precision = features.isFloatRead ? 'single' : 'unsigned';
    }

    if (this.fixIntegerDivisionAccuracy === null) {
      this.fixIntegerDivisionAccuracy = !features.isIntegerDivisionAccurate;
    } else if (this.fixIntegerDivisionAccuracy && features.isIntegerDivisionAccurate) {
      this.fixIntegerDivisionAccuracy = false;
    }

    this.checkOutput();

    if (!this.output || this.output.length === 0) {
      if (args.length !== 1) {
        throw new Error('Auto output only supported for kernels with only one input');
      }

      const argType = utils.getVariableType(args[0], this.strictIntegers);
      switch (argType) {
        case 'Array':
          this.output = utils.getDimensions(argType);
          break;
        case 'NumberTexture':
        case 'MemoryOptimizedNumberTexture':
        case 'ArrayTexture(1)':
        case 'ArrayTexture(2)':
        case 'ArrayTexture(3)':
        case 'ArrayTexture(4)':
          this.output = args[0].output;
          break;
        default:
          throw new Error('Auto output not supported for input type: ' + argType);
      }
    }

    if (this.graphical) {
      if (this.output.length !== 2) {
        throw new Error('Output must have 2 dimensions on graphical mode');
      }

      if (this.precision === 'single') {
        console.warn('Cannot use graphical mode and single precision at the same time');
        this.precision = 'unsigned';
      }

      this.texSize = utils.clone(this.output);
      return;
    } else if (!this.graphical && this.precision === null && features.isTextureFloat) {
      this.precision = 'single';
    }

    this.texSize = utils.getKernelTextureSize({
      optimizeFloatMemory: this.optimizeFloatMemory,
      precision: this.precision,
    }, this.output);

    this.checkTextureSize();
  }

  translateSource() {
    const functionBuilder = FunctionBuilder.fromKernel(this, WebGL2FunctionNode, {
      fixIntegerDivisionAccuracy: this.fixIntegerDivisionAccuracy
    });
    this.translatedSource = functionBuilder.getPrototypeString('kernel');
    this.setupReturnTypes(functionBuilder);
  }

  drawBuffers() {
    this.context.drawBuffers(this.drawBuffersMap);
  }

  getTextureFormat() {
    const { context: gl } = this;
    switch (this.getInternalFormat()) {
      case gl.R32F:
        return gl.RED;
      case gl.RG32F:
        return gl.RG;
      case gl.RGBA32F:
        return gl.RGBA;
      case gl.RGBA:
        return gl.RGBA;
      default:
        throw new Error('Unknown internal format');
    }
  }
  getInternalFormat() {
    const { context: gl } = this;

    if (this.precision === 'single') {
      if (this.pipeline) {
        switch (this.returnType) {
          case 'Number':
          case 'Float':
          case 'Integer':
            if (this.optimizeFloatMemory) {
              return gl.RGBA32F;
            } else {
              return gl.R32F;
            }
            case 'Array(2)':
              return gl.RG32F;
            case 'Array(3)': 
            case 'Array(4)':
              return gl.RGBA32F;
            default:
              throw new Error('Unhandled return type');
        }
      }
      return gl.RGBA32F;
    }
    return gl.RGBA;
  }

  _setupOutputTexture() {
    const gl = this.context;
    if (this.texture) {
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture.texture, 0);
      return;
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    const texture = gl.createTexture();
    const texSize = this.texSize;
    gl.activeTexture(gl.TEXTURE0 + this.constantTextureCount + this.argumentTextureCount);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    const format = this.getInternalFormat();
    if (this.precision === 'single') {
      gl.texStorage2D(gl.TEXTURE_2D, 1, format, texSize[0], texSize[1]);
    } else {
      gl.texImage2D(gl.TEXTURE_2D, 0, format, texSize[0], texSize[1], 0, format, gl.UNSIGNED_BYTE, null);
    }
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    this.texture = new this.TextureConstructor({
      texture,
      size: texSize,
      dimensions: this.threadDim,
      output: this.output,
      context: this.context,
      internalFormat: this.getInternalFormat(),
      textureFormat: this.getTextureFormat(),
      kernel: this,
    });
  }

  _setupSubOutputTextures() {
    const gl = this.context;
    if (this.mappedTextures) {
      for (let i = 0; i < this.subKernels.length; i++) {
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i + 1, gl.TEXTURE_2D, this.mappedTextures[i].texture, 0);
      }
      return;
    }
    const texSize = this.texSize;
    this.drawBuffersMap = [gl.COLOR_ATTACHMENT0];
    this.mappedTextures = [];
    for (let i = 0; i < this.subKernels.length; i++) {
      const texture = this.createTexture();
      this.drawBuffersMap.push(gl.COLOR_ATTACHMENT0 + i + 1);
      gl.activeTexture(gl.TEXTURE0 + this.constantTextureCount + this.argumentTextureCount + i);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      const format = this.getInternalFormat();
      if (this.precision === 'single') {
        gl.texStorage2D(gl.TEXTURE_2D, 1, format, texSize[0], texSize[1]);
      } else {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize[0], texSize[1], 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      }
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i + 1, gl.TEXTURE_2D, texture, 0);

      this.mappedTextures.push(new this.TextureConstructor({
        texture,
        size: texSize,
        dimensions: this.threadDim,
        output: this.output,
        context: this.context,
        internalFormat: this.getInternalFormat(),
        textureFormat: this.getTextureFormat(),
        kernel: this,
      }));
    }
  }

  _getHeaderString() {
    return '';
  }

  _getTextureCoordinate() {
    const subKernels = this.subKernels;
    const variablePrecision = this.getVariablePrecisionString(this.texSize, this.tactic);
    if (subKernels === null || subKernels.length < 1) {
      return `in ${ variablePrecision } vec2 vTexCoord;\n`;
    } else {
      return `out ${ variablePrecision } vec2 vTexCoord;\n`;
    }
  }

  _getMainArgumentsString(args) {
    const result = [];
    const argumentNames = this.argumentNames;
    for (let i = 0; i < argumentNames.length; i++) {
      result.push(this.kernelArguments[i].getSource(args[i]));
    }
    return result.join('');
  }

  getKernelString() {
    const result = [this.getKernelResultDeclaration()];
    const subKernels = this.subKernels;
    if (subKernels !== null) {
      result.push(
        'layout(location = 0) out vec4 data0'
      );
      switch (this.returnType) {
        case 'Number':
        case 'Float':
        case 'Integer':
          for (let i = 0; i < subKernels.length; i++) {
            const subKernel = subKernels[i];
            result.push(
              subKernel.returnType === 'Integer' ?
              `int subKernelResult_${ subKernel.name } = 0` :
              `float subKernelResult_${ subKernel.name } = 0.0`,
              `layout(location = ${ i + 1 }) out vec4 data${ i + 1 }`
            );
          }
          break;
        case 'Array(2)':
          for (let i = 0; i < subKernels.length; i++) {
            result.push(
              `vec2 subKernelResult_${ subKernels[i].name }`,
              `layout(location = ${ i + 1 }) out vec4 data${ i + 1 }`
            );
          }
          break;
        case 'Array(3)':
          for (let i = 0; i < subKernels.length; i++) {
            result.push(
              `vec3 subKernelResult_${ subKernels[i].name }`,
              `layout(location = ${ i + 1 }) out vec4 data${ i + 1 }`
            );
          }
          break;
        case 'Array(4)':
          for (let i = 0; i < subKernels.length; i++) {
            result.push(
              `vec4 subKernelResult_${ subKernels[i].name }`,
              `layout(location = ${ i + 1 }) out vec4 data${ i + 1 }`
            );
          }
          break;
      }
    } else {
      result.push(
        'out vec4 data0'
      );
    }

    return utils.linesToString(result) + this.translatedSource;
  }

  getMainResultGraphical() {
    return utils.linesToString([
      '  threadId = indexTo3D(index, uOutputDim)',
      '  kernel()',
      '  data0 = actualColor',
    ]);
  }

  getMainResultPackedPixels() {
    switch (this.returnType) {
      case 'LiteralInteger':
      case 'Number':
      case 'Integer':
      case 'Float':
        return this.getMainResultKernelPackedPixels() +
          this.getMainResultSubKernelPackedPixels();
      default:
        throw new Error(`packed output only usable with Numbers, "${this.returnType}" specified`);
    }
  }

  getMainResultKernelPackedPixels() {
    return utils.linesToString([
      '  threadId = indexTo3D(index, uOutputDim)',
      '  kernel()',
      `  data0 = ${this.useLegacyEncoder ? 'legacyEncode32' : 'encode32'}(kernelResult)`
    ]);
  }

  getMainResultSubKernelPackedPixels() {
    const result = [];
    if (!this.subKernels) return '';
    for (let i = 0; i < this.subKernels.length; i++) {
      const subKernel = this.subKernels[i];
      if (subKernel.returnType === 'Integer') {
        result.push(
          `  data${i + 1} = ${this.useLegacyEncoder ? 'legacyEncode32' : 'encode32'}(float(subKernelResult_${this.subKernels[i].name}))`
        );
      } else {
        result.push(
          `  data${i + 1} = ${this.useLegacyEncoder ? 'legacyEncode32' : 'encode32'}(subKernelResult_${this.subKernels[i].name})`
        );
      }
    }
    return utils.linesToString(result);
  }

  getMainResultKernelMemoryOptimizedFloats(result, channel) {
    result.push(
      '  threadId = indexTo3D(index, uOutputDim)',
      '  kernel()',
      `  data0.${channel} = kernelResult`
    );
  }

  getMainResultSubKernelMemoryOptimizedFloats(result, channel) {
    if (!this.subKernels) return result;
    for (let i = 0; i < this.subKernels.length; i++) {
      const subKernel = this.subKernels[i];
      if (subKernel.returnType === 'Integer') {
        result.push(
          `  data${i + 1}.${channel} = float(subKernelResult_${subKernel.name})`
        );
      } else {
        result.push(
          `  data${i + 1}.${channel} = subKernelResult_${subKernel.name}`
        );
      }
    }
  }

  getMainResultKernelNumberTexture() {
    return [
      '  threadId = indexTo3D(index, uOutputDim)',
      '  kernel()',
      '  data0[0] = kernelResult',
    ];
  }

  getMainResultSubKernelNumberTexture() {
    const result = [];
    if (!this.subKernels) return result;
    for (let i = 0; i < this.subKernels.length; ++i) {
      const subKernel = this.subKernels[i];
      if (subKernel.returnType === 'Integer') {
        result.push(
          `  data${i + 1}[0] = float(subKernelResult_${subKernel.name})`
        );
      } else {
        result.push(
          `  data${i + 1}[0] = subKernelResult_${subKernel.name}`
        );
      }
    }
    return result;
  }

  getMainResultKernelArray2Texture() {
    return [
      '  threadId = indexTo3D(index, uOutputDim)',
      '  kernel()',
      '  data0[0] = kernelResult[0]',
      '  data0[1] = kernelResult[1]',
    ];
  }

  getMainResultSubKernelArray2Texture() {
    const result = [];
    if (!this.subKernels) return result;
    for (let i = 0; i < this.subKernels.length; ++i) {
      const subKernel = this.subKernels[i];
      result.push(
        `  data${i + 1}[0] = subKernelResult_${subKernel.name}[0]`,
        `  data${i + 1}[1] = subKernelResult_${subKernel.name}[1]`
      );
    }
    return result;
  }

  getMainResultKernelArray3Texture() {
    return [
      '  threadId = indexTo3D(index, uOutputDim)',
      '  kernel()',
      '  data0[0] = kernelResult[0]',
      '  data0[1] = kernelResult[1]',
      '  data0[2] = kernelResult[2]',
    ];
  }

  getMainResultSubKernelArray3Texture() {
    const result = [];
    if (!this.subKernels) return result;
    for (let i = 0; i < this.subKernels.length; ++i) {
      const subKernel = this.subKernels[i];
      result.push(
        `  data${i + 1}[0] = subKernelResult_${subKernel.name}[0]`,
        `  data${i + 1}[1] = subKernelResult_${subKernel.name}[1]`,
        `  data${i + 1}[2] = subKernelResult_${subKernel.name}[2]`
      );
    }
    return result;
  }

  getMainResultKernelArray4Texture() {
    return [
      '  threadId = indexTo3D(index, uOutputDim)',
      '  kernel()',
      '  data0 = kernelResult',
    ];
  }

  getMainResultSubKernelArray4Texture() {
    const result = [];
    if (!this.subKernels) return result;
    for (let i = 0; i < this.subKernels.length; ++i) {
      result.push(
        `  data${i + 1} = subKernelResult_${this.subKernels[i].name}`
      );
    }
    return result;
  }

  destroyExtensions() {
    this.extensions.EXT_color_buffer_float = null;
    this.extensions.OES_texture_float_linear = null;
  }

  toJSON() {
    const json = super.toJSON();
    json.functionNodes = FunctionBuilder.fromKernel(this, WebGL2FunctionNode).toJSON();
    json.settings.threadDim = this.threadDim;
    return json;
  }
}

module.exports = {
  WebGL2Kernel
};
},{"../../utils":114,"../function-builder":9,"../web-gl/kernel":70,"./fragment-shader":72,"./function-node":73,"./kernel-value-maps":74,"./vertex-shader":106}],106:[function(require,module,exports){
const vertexShader = `#version 300 es
__FLOAT_TACTIC_DECLARATION__;
__INT_TACTIC_DECLARATION__;
__SAMPLER_2D_TACTIC_DECLARATION__;

in vec2 aPos;
in vec2 aTexCoord;

out vec2 vTexCoord;
uniform vec2 ratio;

void main(void) {
gl_Position = vec4((aPos + vec2(1)) * ratio + vec2(-1), 0, 1);
vTexCoord = aTexCoord;
}`;

module.exports = {
  vertexShader
};
},{}],107:[function(require,module,exports){
const lib = require('./index');
const GPU = lib.GPU;
for (const p in lib) {
  if (!lib.hasOwnProperty(p)) continue;
  if (p === 'GPU') continue; 
  GPU[p] = lib[p];
}

if (typeof window !== 'undefined') {
  bindTo(window);
}
if (typeof self !== 'undefined') {
  bindTo(self);
}

function bindTo(target) {
  if (target.GPU) return;
  Object.defineProperty(target, 'GPU', {
    get() {
      return GPU;
    }
  });
}

module.exports = lib;
},{"./index":109}],108:[function(require,module,exports){
const { gpuMock } = require('gpu-mock.js');
const { utils } = require('./utils');
require('./backend/kernel');
const { CPUKernel } = require('./backend/cpu/kernel');
const { HeadlessGLKernel } = require('./backend/headless-gl/kernel');
const { WebGL2Kernel } = require('./backend/web-gl2/kernel');
const { WebGLKernel } = require('./backend/web-gl/kernel');
const { kernelRunShortcut } = require('./kernel-run-shortcut');


const kernelOrder = [HeadlessGLKernel, WebGL2Kernel, WebGLKernel];

const kernelTypes = ['gpu', 'cpu'];

const internalKernels = {
  'headlessgl': HeadlessGLKernel,
  'webgl2': WebGL2Kernel,
  'webgl': WebGLKernel,
};

let validate = true;

class GPU {
  static disableValidation() {
    validate = false;
  }

  static enableValidation() {
    validate = true;
  }

  static get isGPUSupported() {
    return kernelOrder.some(Kernel => Kernel.isSupported);
  }

  static get isKernelMapSupported() {
    return kernelOrder.some(Kernel => Kernel.isSupported && Kernel.features.kernelMap);
  }

  static get isOffscreenCanvasSupported() {
    return (typeof Worker !== 'undefined' && typeof OffscreenCanvas !== 'undefined') || typeof importScripts !== 'undefined';
  }

  static get isWebGLSupported() {
    return WebGLKernel.isSupported;
  }

  static get isWebGL2Supported() {
    return WebGL2Kernel.isSupported;
  }

  static get isHeadlessGLSupported() {
    return HeadlessGLKernel.isSupported;
  }

  static get isCanvasSupported() {
    return typeof HTMLCanvasElement !== 'undefined';
  }

  static get isGPUHTMLImageArraySupported() {
    return WebGL2Kernel.isSupported;
  }

  static get isSinglePrecisionSupported() {
    return kernelOrder.some(Kernel => Kernel.isSupported && Kernel.features.isFloatRead && Kernel.features.isTextureFloat);
  }

  constructor(settings) {
    settings = settings || {};
    this.canvas = settings.canvas || null;
    this.context = settings.context || null;
    this.mode = settings.mode;
    this.Kernel = null;
    this.kernels = [];
    this.functions = [];
    this.nativeFunctions = [];
    this.injectedNative = null;
    if (this.mode === 'dev') return;
    this.chooseKernel();
    if (settings.functions) {
      for (let i = 0; i < settings.functions.length; i++) {
        this.addFunction(settings.functions[i]);
      }
    }

    if (settings.nativeFunctions) {
      for (const p in settings.nativeFunctions) {
        if (!settings.nativeFunctions.hasOwnProperty(p)) continue;
        const s = settings.nativeFunctions[p];
        const { name, source } = s;
        this.addNativeFunction(name, source, s);
      }
    }
  }

  chooseKernel() {
    if (this.Kernel) return;

    let Kernel = null;

    if (this.context) {
      for (let i = 0; i < kernelOrder.length; i++) {
        const ExternalKernel = kernelOrder[i];
        if (ExternalKernel.isContextMatch(this.context)) {
          if (!ExternalKernel.isSupported) {
            throw new Error(`Kernel type ${ExternalKernel.name} not supported`);
          }
          Kernel = ExternalKernel;
          break;
        }
      }
      if (Kernel === null) {
        throw new Error('unknown Context');
      }
    } else if (this.mode) {
      if (this.mode in internalKernels) {
        if (!validate || internalKernels[this.mode].isSupported) {
          Kernel = internalKernels[this.mode];
        }
      } else if (this.mode === 'gpu') {
        for (let i = 0; i < kernelOrder.length; i++) {
          if (kernelOrder[i].isSupported) {
            Kernel = kernelOrder[i];
            break;
          }
        }
      } else if (this.mode === 'cpu') {
        Kernel = CPUKernel;
      }
      if (!Kernel) {
        throw new Error(`A requested mode of "${this.mode}" and is not supported`);
      }
    } else {
      for (let i = 0; i < kernelOrder.length; i++) {
        if (kernelOrder[i].isSupported) {
          Kernel = kernelOrder[i];
          break;
        }
      }
      if (!Kernel) {
        Kernel = CPUKernel;
      }
    }

    if (!this.mode) {
      this.mode = Kernel.mode;
    }
    this.Kernel = Kernel;
  }

  createKernel(source, settings) {
    if (typeof source === 'undefined') {
      throw new Error('Missing source parameter');
    }
    if (typeof source !== 'object' && !utils.isFunction(source) && typeof source !== 'string') {
      throw new Error('source parameter not a function');
    }

    const kernels = this.kernels;
    if (this.mode === 'dev') {
      const devKernel = gpuMock(source, upgradeDeprecatedCreateKernelSettings(settings));
      kernels.push(devKernel);
      return devKernel;
    }

    source = typeof source === 'function' ? source.toString() : source;
    const switchableKernels = {};
    const settingsCopy = upgradeDeprecatedCreateKernelSettings(settings) || {};
    if (settings && typeof settings.argumentTypes === 'object') {
      settingsCopy.argumentTypes = Object.keys(settings.argumentTypes).map(argumentName => settings.argumentTypes[argumentName]);
    }

    function onRequestFallback(args) {
      console.warn('Falling back to CPU');
      const fallbackKernel = new CPUKernel(source, {
        argumentTypes: kernelRun.argumentTypes,
        constantTypes: kernelRun.constantTypes,
        graphical: kernelRun.graphical,
        loopMaxIterations: kernelRun.loopMaxIterations,
        constants: kernelRun.constants,
        dynamicOutput: kernelRun.dynamicOutput,
        dynamicArgument: kernelRun.dynamicArguments,
        output: kernelRun.output,
        precision: kernelRun.precision,
        pipeline: kernelRun.pipeline,
        immutable: kernelRun.immutable,
        optimizeFloatMemory: kernelRun.optimizeFloatMemory,
        fixIntegerDivisionAccuracy: kernelRun.fixIntegerDivisionAccuracy,
        functions: kernelRun.functions,
        nativeFunctions: kernelRun.nativeFunctions,
        injectedNative: kernelRun.injectedNative,
        subKernels: kernelRun.subKernels,
        strictIntegers: kernelRun.strictIntegers,
        debug: kernelRun.debug,
      });
      fallbackKernel.build.apply(fallbackKernel, args);
      const result = fallbackKernel.run.apply(fallbackKernel, args);
      kernelRun.replaceKernel(fallbackKernel);
      return result;
    }

    function onRequestSwitchKernel(reasons, args, _kernel) {
      if (_kernel.debug) {
        console.warn('Switching kernels');
      }
      let newOutput = null;
      if (_kernel.signature && !switchableKernels[_kernel.signature]) {
        switchableKernels[_kernel.signature] = _kernel;
      }
      if (_kernel.dynamicOutput) {
        for (let i = reasons.length - 1; i >= 0; i--) {
          const reason = reasons[i];
          if (reason.type === 'outputPrecisionMismatch') {
            newOutput = reason.needed;
          }
        }
      }

      const Constructor = _kernel.constructor;
      const argumentTypes = Constructor.getArgumentTypes(_kernel, args);
      const signature = Constructor.getSignature(_kernel, argumentTypes);
      const existingKernel = switchableKernels[signature];
      if (existingKernel) {
        existingKernel.onActivate(_kernel);
        return existingKernel;
      }

      const newKernel = switchableKernels[signature] = new Constructor(source, {
        argumentTypes,
        constantTypes: _kernel.constantTypes,
        graphical: _kernel.graphical,
        loopMaxIterations: _kernel.loopMaxIterations,
        constants: _kernel.constants,
        dynamicOutput: _kernel.dynamicOutput,
        dynamicArgument: _kernel.dynamicArguments,
        context: _kernel.context,
        canvas: _kernel.canvas,
        output: newOutput || _kernel.output,
        precision: _kernel.precision,
        pipeline: _kernel.pipeline,
        immutable: _kernel.immutable,
        optimizeFloatMemory: _kernel.optimizeFloatMemory,
        fixIntegerDivisionAccuracy: _kernel.fixIntegerDivisionAccuracy,
        functions: _kernel.functions,
        nativeFunctions: _kernel.nativeFunctions,
        injectedNative: _kernel.injectedNative,
        subKernels: _kernel.subKernels,
        strictIntegers: _kernel.strictIntegers,
        debug: _kernel.debug,
        gpu: _kernel.gpu,
        validate,
        returnType: _kernel.returnType,
        tactic: _kernel.tactic,
        onRequestFallback,
        onRequestSwitchKernel,
        texture: _kernel.texture,
        mappedTextures: _kernel.mappedTextures,
        drawBuffersMap: _kernel.drawBuffersMap,
      });
      newKernel.build.apply(newKernel, args);
      kernelRun.replaceKernel(newKernel);
      kernels.push(newKernel);
      return newKernel;
    }
    const mergedSettings = Object.assign({
      context: this.context,
      canvas: this.canvas,
      functions: this.functions,
      nativeFunctions: this.nativeFunctions,
      injectedNative: this.injectedNative,
      gpu: this,
      validate,
      onRequestFallback,
      onRequestSwitchKernel
    }, settingsCopy);

    const kernel = new this.Kernel(source, mergedSettings);
    const kernelRun = kernelRunShortcut(kernel);

    if (!this.canvas) {
      this.canvas = kernel.canvas;
    }

    if (!this.context) {
      this.context = kernel.context;
    }

    kernels.push(kernel);

    return kernelRun;
  }

  createKernelMap() {
    let fn;
    let settings;
    const argument2Type = typeof arguments[arguments.length - 2];
    if (argument2Type === 'function' || argument2Type === 'string') {
      fn = arguments[arguments.length - 2];
      settings = arguments[arguments.length - 1];
    } else {
      fn = arguments[arguments.length - 1];
    }

    if (this.mode !== 'dev') {
      if (!this.Kernel.isSupported || !this.Kernel.features.kernelMap) {
        if (this.mode && kernelTypes.indexOf(this.mode) < 0) {
          throw new Error(`kernelMap not supported on ${this.Kernel.name}`);
        }
      }
    }

    const settingsCopy = upgradeDeprecatedCreateKernelSettings(settings);
    if (settings && typeof settings.argumentTypes === 'object') {
      settingsCopy.argumentTypes = Object.keys(settings.argumentTypes).map(argumentName => settings.argumentTypes[argumentName]);
    }

    if (Array.isArray(arguments[0])) {
      settingsCopy.subKernels = [];
      const functions = arguments[0];
      for (let i = 0; i < functions.length; i++) {
        const source = functions[i].toString();
        const name = utils.getFunctionNameFromString(source);
        settingsCopy.subKernels.push({
          name,
          source,
          property: i,
        });
      }
    } else {
      settingsCopy.subKernels = [];
      const functions = arguments[0];
      for (let p in functions) {
        if (!functions.hasOwnProperty(p)) continue;
        const source = functions[p].toString();
        const name = utils.getFunctionNameFromString(source);
        settingsCopy.subKernels.push({
          name: name || p,
          source,
          property: p,
        });
      }
    }
    return this.createKernel(fn, settingsCopy);
  }

  combineKernels() {
    const firstKernel = arguments[0];
    const combinedKernel = arguments[arguments.length - 1];
    if (firstKernel.kernel.constructor.mode === 'cpu') return combinedKernel;
    const canvas = arguments[0].canvas;
    const context = arguments[0].context;
    const max = arguments.length - 1;
    for (let i = 0; i < max; i++) {
      arguments[i]
        .setCanvas(canvas)
        .setContext(context)
        .setPipeline(true);
    }

    return function() {
      const texture = combinedKernel.apply(this, arguments);
      if (texture.toArray) {
        return texture.toArray();
      }
      return texture;
    };
  }

  setFunctions(functions) {
    this.functions = functions;
    return this;
  }

  setNativeFunctions(nativeFunctions) {
    this.nativeFunctions = nativeFunctions;
    return this;
  }

  addFunction(source, settings) {
    this.functions.push({ source, settings });
    return this;
  }

  addNativeFunction(name, source, settings) {
    if (this.kernels.length > 0) {
      throw new Error('Cannot call "addNativeFunction" after "createKernels" has been called.');
    }
    this.nativeFunctions.push(Object.assign({ name, source }, settings));
    return this;
  }

  injectNative(source) {
    this.injectedNative = source;
    return this;
  }

  destroy() {
    return new Promise((resolve, reject) => {
      if (!this.kernels) {
        resolve();
      }
      setTimeout(() => {
        try {
          for (let i = 0; i < this.kernels.length; i++) {
            this.kernels[i].destroy(true); 
          }
          let firstKernel = this.kernels[0];
          if (firstKernel) {
            if (firstKernel.kernel) {
              firstKernel = firstKernel.kernel;
            }
            if (firstKernel.constructor.destroyContext) {
              firstKernel.constructor.destroyContext(this.context);
            }
          }
        } catch (e) {
          reject(e);
        }
        resolve();
      }, 0);
    });
  }
}


function upgradeDeprecatedCreateKernelSettings(settings) {
  if (!settings) {
    return {};
  }
  const upgradedSettings = Object.assign({}, settings);

  if (settings.hasOwnProperty('floatOutput')) {
    utils.warnDeprecated('setting', 'floatOutput', 'precision');
    upgradedSettings.precision = settings.floatOutput ? 'single' : 'unsigned';
  }
  if (settings.hasOwnProperty('outputToTexture')) {
    utils.warnDeprecated('setting', 'outputToTexture', 'pipeline');
    upgradedSettings.pipeline = Boolean(settings.outputToTexture);
  }
  if (settings.hasOwnProperty('outputImmutable')) {
    utils.warnDeprecated('setting', 'outputImmutable', 'immutable');
    upgradedSettings.immutable = Boolean(settings.outputImmutable);
  }
  if (settings.hasOwnProperty('floatTextures')) {
    utils.warnDeprecated('setting', 'floatTextures', 'optimizeFloatMemory');
    upgradedSettings.optimizeFloatMemory = Boolean(settings.floatTextures);
  }
  return upgradedSettings;
}

module.exports = {
  GPU,
  kernelOrder,
  kernelTypes
};
},{"./backend/cpu/kernel":8,"./backend/headless-gl/kernel":34,"./backend/kernel":36,"./backend/web-gl/kernel":70,"./backend/web-gl2/kernel":105,"./kernel-run-shortcut":111,"./utils":114,"gpu-mock.js":4}],109:[function(require,module,exports){
const { GPU } = require('./gpu');
const { alias } = require('./alias');
const { utils } = require('./utils');
const { Input, input } = require('./input');
const { Texture } = require('./texture');
const { FunctionBuilder } = require('./backend/function-builder');
const { FunctionNode } = require('./backend/function-node');
const { CPUFunctionNode } = require('./backend/cpu/function-node');
const { CPUKernel } = require('./backend/cpu/kernel');

const { HeadlessGLKernel } = require('./backend/headless-gl/kernel');

const { WebGLFunctionNode } = require('./backend/web-gl/function-node');
const { WebGLKernel } = require('./backend/web-gl/kernel');
const { kernelValueMaps: webGLKernelValueMaps } = require('./backend/web-gl/kernel-value-maps');

const { WebGL2FunctionNode } = require('./backend/web-gl2/function-node');
const { WebGL2Kernel } = require('./backend/web-gl2/kernel');
const { kernelValueMaps: webGL2KernelValueMaps } = require('./backend/web-gl2/kernel-value-maps');

const { GLKernel } = require('./backend/gl/kernel');

const { Kernel } = require('./backend/kernel');

const { FunctionTracer } = require('./backend/function-tracer');

const mathRandom = require('./plugins/math-random-uniformly-distributed');

module.exports = {
  alias,
  CPUFunctionNode,
  CPUKernel,
  GPU,
  FunctionBuilder,
  FunctionNode,
  HeadlessGLKernel,
  Input,
  input,
  Texture,
  utils,

  WebGL2FunctionNode,
  WebGL2Kernel,
  webGL2KernelValueMaps,

  WebGLFunctionNode,
  WebGLKernel,
  webGLKernelValueMaps,

  GLKernel,
  Kernel,
  FunctionTracer,

  plugins: {
    mathRandom
  }
};
},{"./alias":5,"./backend/cpu/function-node":6,"./backend/cpu/kernel":8,"./backend/function-builder":9,"./backend/function-node":10,"./backend/function-tracer":11,"./backend/gl/kernel":13,"./backend/headless-gl/kernel":34,"./backend/kernel":36,"./backend/web-gl/function-node":38,"./backend/web-gl/kernel":70,"./backend/web-gl/kernel-value-maps":39,"./backend/web-gl2/function-node":73,"./backend/web-gl2/kernel":105,"./backend/web-gl2/kernel-value-maps":74,"./gpu":108,"./input":110,"./plugins/math-random-uniformly-distributed":112,"./texture":113,"./utils":114}],110:[function(require,module,exports){
class Input {
  constructor(value, size) {
    this.value = value;
    if (Array.isArray(size)) {
      this.size = size;
    } else {
      this.size = new Int32Array(3);
      if (size.z) {
        this.size = new Int32Array([size.x, size.y, size.z]);
      } else if (size.y) {
        this.size = new Int32Array([size.x, size.y]);
      } else {
        this.size = new Int32Array([size.x]);
      }
    }

    const [w, h, d] = this.size;
    if (d) {
      if (this.value.length !== (w * h * d)) {
        throw new Error(`Input size ${this.value.length} does not match ${w} * ${h} * ${d} = ${(h * w * d)}`);
      }
    } else if (h) {
      if (this.value.length !== (w * h)) {
        throw new Error(`Input size ${this.value.length} does not match ${w} * ${h} = ${(h * w)}`);
      }
    } else {
      if (this.value.length !== w) {
        throw new Error(`Input size ${this.value.length} does not match ${w}`);
      }
    }

  }

  toArray() {
    const { utils } = require('./utils');
    const [w, h, d] = this.size;
    if (d) {
      return utils.erectMemoryOptimized3DFloat(this.value.subarray ? this.value : new Float32Array(this.value), w, h, d);
    } else if (h) {
      return utils.erectMemoryOptimized2DFloat(this.value.subarray ? this.value : new Float32Array(this.value), w, h);
    } else {
      return this.value;
    }
  }
}

function input(value, size) {
  return new Input(value, size);
}

module.exports = {
  Input,
  input
};
},{"./utils":114}],111:[function(require,module,exports){
const { utils } = require('./utils');

function kernelRunShortcut(kernel) {
  let run = function() {
    kernel.build.apply(kernel, arguments);
    run = function() {
      let result = kernel.run.apply(kernel, arguments);
      if (kernel.switchingKernels) {
        const reasons = kernel.resetSwitchingKernels();
        const newKernel = kernel.onRequestSwitchKernel(reasons, arguments, kernel);
        shortcut.kernel = kernel = newKernel;
        result = newKernel.run.apply(newKernel, arguments);
      }
      if (kernel.renderKernels) {
        return kernel.renderKernels();
      } else if (kernel.renderOutput) {
        return kernel.renderOutput();
      } else {
        return result;
      }
    };
    return run.apply(kernel, arguments);
  };
  const shortcut = function() {
    return run.apply(kernel, arguments);
  };
  shortcut.exec = function() {
    return new Promise((accept, reject) => {
      try {
        accept(run.apply(this, arguments));
      } catch (e) {
        reject(e);
      }
    });
  };
  shortcut.replaceKernel = function(replacementKernel) {
    kernel = replacementKernel;
    bindKernelToShortcut(kernel, shortcut);
  };

  bindKernelToShortcut(kernel, shortcut);
  return shortcut;
}

function bindKernelToShortcut(kernel, shortcut) {
  if (shortcut.kernel) {
    shortcut.kernel = kernel;
    return;
  }
  const properties = utils.allPropertiesOf(kernel);
  for (let i = 0; i < properties.length; i++) {
    const property = properties[i];
    if (property[0] === '_' && property[1] === '_') continue;
    if (typeof kernel[property] === 'function') {
      if (property.substring(0, 3) === 'add' || property.substring(0, 3) === 'set') {
        shortcut[property] = function() {
          shortcut.kernel[property].apply(shortcut.kernel, arguments);
          return shortcut;
        };
      } else {
        shortcut[property] = function() {
          return shortcut.kernel[property].apply(shortcut.kernel, arguments);
        };
      }
    } else {
      shortcut.__defineGetter__(property, () => shortcut.kernel[property]);
      shortcut.__defineSetter__(property, (value) => {
        shortcut.kernel[property] = value;
      });
    }
  }
  shortcut.kernel = kernel;
}
module.exports = {
  kernelRunShortcut
};
},{"./utils":114}],112:[function(require,module,exports){
const source = `// https://www.shadertoy.com/view/4t2SDh
//note: uniformly distributed, normalized rand, [0,1]
highp float randomSeedShift = 1.0;
highp float slide = 1.0;
uniform highp float randomSeed1;
uniform highp float randomSeed2;

highp float nrand(highp vec2 n) {
highp float result = fract(sin(dot((n.xy + 1.0) * vec2(randomSeed1 * slide, randomSeed2 * randomSeedShift), vec2(12.9898, 78.233))) * 43758.5453);
randomSeedShift = result;
if (randomSeedShift > 0.5) {
slide += 0.00009; 
} else {
slide += 0.0009;
}
return result;
}`;

const name = 'math-random-uniformly-distributed';

const functionMatch = `Math.random()`;

const functionReplace = `nrand(vTexCoord)`;

const functionReturnType = 'Number';
const onBeforeRun = (kernel) => {
  kernel.setUniform1f('randomSeed1', Math.random());
  kernel.setUniform1f('randomSeed2', Math.random());
};

const plugin = {
  name,
  onBeforeRun,
  functionMatch,
  functionReplace,
  functionReturnType,
  source
};

module.exports = plugin;
},{}],113:[function(require,module,exports){
class Texture {
  constructor(settings) {
    const {
      texture,
      size,
      dimensions,
      output,
      context,
      type = 'NumberTexture',
      kernel,
      internalFormat,
      textureFormat
    } = settings;
    if (!output) throw new Error('settings property "output" required.');
    if (!context) throw new Error('settings property "context" required.');
    if (!texture) throw new Error('settings property "texture" required.');
    if (!kernel) throw new Error('settings property "kernel" required.');
    this.texture = texture;
    if (texture._refs) {
      texture._refs++;
    } else {
      texture._refs = 1;
    }
    this.size = size;
    this.dimensions = dimensions;
    this.output = output;
    this.context = context;
    this.kernel = kernel;
    this.type = type;
    this._deleted = false;
    this.internalFormat = internalFormat;
    this.textureFormat = textureFormat;
  }

  toArray() {
    throw new Error(`Not implemented on ${this.constructor.name}`);
  }

  clone() {
    throw new Error(`Not implemented on ${this.constructor.name}`);
  }

  delete() {
    throw new Error(`Not implemented on ${this.constructor.name}`);
  }

  clear() {
    throw new Error(`Not implemented on ${this.constructor.name}`);
  }
}

module.exports = {
  Texture
};
},{}],114:[function(require,module,exports){
const acorn = require('acorn');
const { Input } = require('./input');
const { Texture } = require('./texture');

const FUNCTION_NAME = /function ([^(]*)/;
const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
const ARGUMENT_NAMES = /([^\s,]+)/g;

const utils = {
  systemEndianness() {
    return _systemEndianness;
  },
  getSystemEndianness() {
    const b = new ArrayBuffer(4);
    const a = new Uint32Array(b);
    const c = new Uint8Array(b);
    a[0] = 0xdeadbeef;
    if (c[0] === 0xef) return 'LE';
    if (c[0] === 0xde) return 'BE';
    throw new Error('unknown endianness');
  },

  isFunction(funcObj) {
    return typeof(funcObj) === 'function';
  },

  isFunctionString(fn) {
    if (typeof fn === 'string') {
      return (fn
        .slice(0, 'function'.length)
        .toLowerCase() === 'function');
    }
    return false;
  },

  getFunctionNameFromString(funcStr) {
    const result = FUNCTION_NAME.exec(funcStr);
    if (!result || result.length === 0) return null;
    return result[1].trim();
  },

  getFunctionBodyFromString(funcStr) {
    return funcStr.substring(funcStr.indexOf('{') + 1, funcStr.lastIndexOf('}'));
  },

  getArgumentNamesFromString(fn) {
    const fnStr = fn.replace(STRIP_COMMENTS, '');
    let result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if (result === null) {
      result = [];
    }
    return result;
  },

  clone(obj) {
    if (obj === null || typeof obj !== 'object' || obj.hasOwnProperty('isActiveClone')) return obj;

    const temp = obj.constructor(); 

    for (let key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        obj.isActiveClone = null;
        temp[key] = utils.clone(obj[key]);
        delete obj.isActiveClone;
      }
    }

    return temp;
  },

  isArray(array) {
    return !isNaN(array.length);
  },

  getVariableType(value, strictIntegers) {
    if (utils.isArray(value)) {
      if (value.length > 0 && value[0].nodeName === 'IMG') {
        return 'HTMLImageArray';
      }
      return 'Array';
    }

    switch (value.constructor) {
      case Boolean:
        return 'Boolean';
      case Number:
        if (strictIntegers && Number.isInteger(value)) {
          return 'Integer';
        }
        return 'Float';
      case Texture:
        return value.type;
      case Input:
        return 'Input';
    }
    if ('nodeName' in value) {
      switch (value.nodeName) {
        case 'IMG':
          return 'HTMLImage';
        case 'CANVAS':
          return 'HTMLImage';
        case 'VIDEO':
          return 'HTMLVideo';
      }
    } else if (value.hasOwnProperty('type')) {
      return value.type;
    } else if (typeof OffscreenCanvas !== 'undefined' && value instanceof OffscreenCanvas) {
      return 'OffscreenCanvas';
    } else if (typeof ImageBitmap !== 'undefined' && value instanceof ImageBitmap) {
      return 'ImageBitmap';
    } else if (typeof ImageData !== 'undefined' && value instanceof ImageData) {
      return 'ImageData';
    }
    return 'Unknown';
  },

  getKernelTextureSize(settings, dimensions) {
    let [w, h, d] = dimensions;
    let texelCount = (w || 1) * (h || 1) * (d || 1);

    if (settings.optimizeFloatMemory && settings.precision === 'single') {
      w = texelCount = Math.ceil(texelCount / 4);
    }
    if (h > 1 && w * h === texelCount) {
      return new Int32Array([w, h]);
    }
    return utils.closestSquareDimensions(texelCount);
  },

  closestSquareDimensions(length) {
    const sqrt = Math.sqrt(length);
    let high = Math.ceil(sqrt);
    let low = Math.floor(sqrt);
    while (high * low < length) {
      high--;
      low = Math.ceil(length / high);
    }
    return new Int32Array([low, Math.ceil(length / low)]);
  },

  getMemoryOptimizedFloatTextureSize(dimensions, bitRatio) {
    const totalArea = utils.roundTo((dimensions[0] || 1) * (dimensions[1] || 1) * (dimensions[2] || 1) * (dimensions[3] || 1), 4);
    const texelCount = totalArea / bitRatio;
    return utils.closestSquareDimensions(texelCount);
  },

  getMemoryOptimizedPackedTextureSize(dimensions, bitRatio) {
    const [w, h, d] = dimensions;
    const totalArea = utils.roundTo((w || 1) * (h || 1) * (d || 1), 4);
    const texelCount = totalArea / (4 / bitRatio);
    return utils.closestSquareDimensions(texelCount);
  },

  roundTo(n, d) {
    return Math.floor((n + d - 1) / d) * d;
  },
  getDimensions(x, pad) {
    let ret;
    if (utils.isArray(x)) {
      const dim = [];
      let temp = x;
      while (utils.isArray(temp)) {
        dim.push(temp.length);
        temp = temp[0];
      }
      ret = dim.reverse();
    } else if (x instanceof Texture) {
      ret = x.output;
    } else if (x instanceof Input) {
      ret = x.size;
    } else {
      throw new Error(`Unknown dimensions of ${x}`);
    }

    if (pad) {
      ret = Array.from(ret);
      while (ret.length < 3) {
        ret.push(1);
      }
    }

    return new Int32Array(ret);
  },

  flatten2dArrayTo(array, target) {
    let offset = 0;
    for (let y = 0; y < array.length; y++) {
      target.set(array[y], offset);
      offset += array[y].length;
    }
  },

  flatten3dArrayTo(array, target) {
    let offset = 0;
    for (let z = 0; z < array.length; z++) {
      for (let y = 0; y < array[z].length; y++) {
        target.set(array[z][y], offset);
        offset += array[z][y].length;
      }
    }
  },

  flatten4dArrayTo(array, target) {
    let offset = 0;
    for (let l = 0; l < array.length; l++) {
      for (let z = 0; z < array[l].length; z++) {
        for (let y = 0; y < array[l][z].length; y++) {
          target.set(array[l][z][y], offset);
          offset += array[l][z][y].length;
        }
      }
    }
  },

  flattenTo(array, target) {
    if (utils.isArray(array[0])) {
      if (utils.isArray(array[0][0])) {
        if (utils.isArray(array[0][0][0])) {
          utils.flatten4dArrayTo(array, target);
        } else {
          utils.flatten3dArrayTo(array, target);
        }
      } else {
        utils.flatten2dArrayTo(array, target);
      }
    } else {
      target.set(array);
    }
  },

  splitArray(array, part) {
    const result = [];
    for (let i = 0; i < array.length; i += part) {
      result.push(new array.constructor(array.buffer, i * 4 + array.byteOffset, part));
    }
    return result;
  },

  getAstString(source, ast) {
    const lines = Array.isArray(source) ? source : source.split(/\r?\n/g);
    const start = ast.loc.start;
    const end = ast.loc.end;
    const result = [];
    if (start.line === end.line) {
      result.push(lines[start.line - 1].substring(start.column, end.column));
    } else {
      result.push(lines[start.line - 1].slice(start.column));
      for (let i = start.line; i < end.line; i++) {
        result.push(lines[i]);
      }
      result.push(lines[end.line - 1].slice(0, end.column));
    }
    return result.join('\n');
  },

  allPropertiesOf(obj) {
    const props = [];

    do {
      props.push.apply(props, Object.getOwnPropertyNames(obj));
    } while (obj = Object.getPrototypeOf(obj));

    return props;
  },

  linesToString(lines) {
    if (lines.length > 0) {
      return lines.join(';\n') + ';\n';
    } else {
      return '\n';
    }
  },
  warnDeprecated(type, oldName, newName) {
    if (newName) {
      console.warn(`You are using a deprecated ${ type } "${ oldName }". It has been replaced with "${ newName }". Fixing, but please upgrade as it will soon be removed.`);
    } else {
      console.warn(`You are using a deprecated ${ type } "${ oldName }". It has been removed. Fixing, but please upgrade as it will soon be removed.`);
    }
  },
  flipPixels: (pixels, width, height) => {
    const halfHeight = height / 2 | 0; 
    const bytesPerRow = width * 4;
    const temp = new Uint8ClampedArray(width * 4);
    const result = pixels.slice(0);
    for (let y = 0; y < halfHeight; ++y) {
      const topOffset = y * bytesPerRow;
      const bottomOffset = (height - y - 1) * bytesPerRow;

      temp.set(result.subarray(topOffset, topOffset + bytesPerRow));

      result.copyWithin(topOffset, bottomOffset, bottomOffset + bytesPerRow);

      result.set(temp, bottomOffset);
    }
    return result;
  },
  erectPackedFloat: (array, width) => {
    return array.subarray(0, width);
  },
  erect2DPackedFloat: (array, width, height) => {
    const yResults = new Array(height);
    for (let y = 0; y < height; y++) {
      const xStart = y * width;
      const xEnd = xStart + width;
      yResults[y] = array.subarray(xStart, xEnd);
    }
    return yResults;
  },
  erect3DPackedFloat: (array, width, height, depth) => {
    const zResults = new Array(depth);
    for (let z = 0; z < depth; z++) {
      const yResults = new Array(height);
      for (let y = 0; y < height; y++) {
        const xStart = (z * height * width) + y * width;
        const xEnd = xStart + width;
        yResults[y] = array.subarray(xStart, xEnd);
      }
      zResults[z] = yResults;
    }
    return zResults;
  },
  erectMemoryOptimizedFloat: (array, width) => {
    return array.subarray(0, width);
  },
  erectMemoryOptimized2DFloat: (array, width, height) => {
    const yResults = new Array(height);
    for (let y = 0; y < height; y++) {
      const offset = y * width;
      yResults[y] = array.subarray(offset, offset + width);
    }
    return yResults;
  },
  erectMemoryOptimized3DFloat: (array, width, height, depth) => {
    const zResults = new Array(depth);
    for (let z = 0; z < depth; z++) {
      const yResults = new Array(height);
      for (let y = 0; y < height; y++) {
        const offset = (z * height * width) + (y * width);
        yResults[y] = array.subarray(offset, offset + width);
      }
      zResults[z] = yResults;
    }
    return zResults;
  },
  erectFloat: (array, width) => {
    const xResults = new Float32Array(width);
    let i = 0;
    for (let x = 0; x < width; x++) {
      xResults[x] = array[i];
      i += 4;
    }
    return xResults;
  },
  erect2DFloat: (array, width, height) => {
    const yResults = new Array(height);
    let i = 0;
    for (let y = 0; y < height; y++) {
      const xResults = new Float32Array(width);
      for (let x = 0; x < width; x++) {
        xResults[x] = array[i];
        i += 4;
      }
      yResults[y] = xResults;
    }
    return yResults;
  },
  erect3DFloat: (array, width, height, depth) => {
    const zResults = new Array(depth);
    let i = 0;
    for (let z = 0; z < depth; z++) {
      const yResults = new Array(height);
      for (let y = 0; y < height; y++) {
        const xResults = new Float32Array(width);
        for (let x = 0; x < width; x++) {
          xResults[x] = array[i];
          i += 4;
        }
        yResults[y] = xResults;
      }
      zResults[z] = yResults;
    }
    return zResults;
  },
  erectArray2: (array, width) => {
    const xResults = new Array(width);
    const xResultsMax = width * 4;
    let i = 0;
    for (let x = 0; x < xResultsMax; x += 4) {
      xResults[i++] = array.subarray(x, x + 2);
    }
    return xResults;
  },
  erect2DArray2: (array, width, height) => {
    const yResults = new Array(height);
    const XResultsMax = width * 4;
    for (let y = 0; y < height; y++) {
      const xResults = new Array(width);
      const offset = y * XResultsMax;
      let i = 0;
      for (let x = 0; x < XResultsMax; x += 4) {
        xResults[i++] = array.subarray(x + offset, x + offset + 2);
      }
      yResults[y] = xResults;
    }
    return yResults;
  },
  erect3DArray2: (array, width, height, depth) => {
    const xResultsMax = width * 4;
    const zResults = new Array(depth);
    for (let z = 0; z < depth; z++) {
      const yResults = new Array(height);
      for (let y = 0; y < height; y++) {
        const xResults = new Array(width);
        const offset = (z * xResultsMax * height) + (y * xResultsMax);
        let i = 0;
        for (let x = 0; x < xResultsMax; x += 4) {
          xResults[i++] = array.subarray(x + offset, x + offset + 2);
        }
        yResults[y] = xResults;
      }
      zResults[z] = yResults;
    }
    return zResults;
  },
  erectArray3: (array, width) => {
    const xResults = new Array(width);
    const xResultsMax = width * 4;
    let i = 0;
    for (let x = 0; x < xResultsMax; x += 4) {
      xResults[i++] = array.subarray(x, x + 3);
    }
    return xResults;
  },
  erect2DArray3: (array, width, height) => {
    const xResultsMax = width * 4;
    const yResults = new Array(height);
    for (let y = 0; y < height; y++) {
      const xResults = new Array(width);
      const offset = y * xResultsMax;
      let i = 0;
      for (let x = 0; x < xResultsMax; x += 4) {
        xResults[i++] = array.subarray(x + offset, x + offset + 3);
      }
      yResults[y] = xResults;
    }
    return yResults;
  },
  erect3DArray3: (array, width, height, depth) => {
    const xResultsMax = width * 4;
    const zResults = new Array(depth);
    for (let z = 0; z < depth; z++) {
      const yResults = new Array(height);
      for (let y = 0; y < height; y++) {
        const xResults = new Array(width);
        const offset = (z * xResultsMax * height) + (y * xResultsMax);
        let i = 0;
        for (let x = 0; x < xResultsMax; x += 4) {
          xResults[i++] = array.subarray(x + offset, x + offset + 3);
        }
        yResults[y] = xResults;
      }
      zResults[z] = yResults;
    }
    return zResults;
  },
  erectArray4: (array, width) => {
    const xResults = new Array(array);
    const xResultsMax = width * 4;
    let i = 0;
    for (let x = 0; x < xResultsMax; x += 4) {
      xResults[i++] = array.subarray(x, x + 4);
    }
    return xResults;
  },
  erect2DArray4: (array, width, height) => {
    const xResultsMax = width * 4;
    const yResults = new Array(height);
    for (let y = 0; y < height; y++) {
      const xResults = new Array(width);
      const offset = y * xResultsMax;
      let i = 0;
      for (let x = 0; x < xResultsMax; x += 4) {
        xResults[i++] = array.subarray(x + offset, x + offset + 4);
      }
      yResults[y] = xResults;
    }
    return yResults;
  },
  erect3DArray4: (array, width, height, depth) => {
    const xResultsMax = width * 4;
    const zResults = new Array(depth);
    for (let z = 0; z < depth; z++) {
      const yResults = new Array(height);
      for (let y = 0; y < height; y++) {
        const xResults = new Array(width);
        const offset = (z * xResultsMax * height) + (y * xResultsMax);
        let i = 0;
        for (let x = 0; x < xResultsMax; x += 4) {
          xResults[i++] = array.subarray(x + offset, x + offset + 4);
        }
        yResults[y] = xResults;
      }
      zResults[z] = yResults;
    }
    return zResults;
  },

  flattenFunctionToString: (source, settings) => {
    const { findDependency, thisLookup, doNotDefine } = settings;
    let flattened = settings.flattened;
    if (!flattened) {
      flattened = settings.flattened = {};
    }
    const ast = acorn.parse(source);
    const functionDependencies = [];
    let indent = 0;

    function flatten(ast) {
      if (Array.isArray(ast)) {
        const results = [];
        for (let i = 0; i < ast.length; i++) {
          results.push(flatten(ast[i]));
        }
        return results.join('');
      }
      switch (ast.type) {
        case 'Program':
          return flatten(ast.body) + (ast.body[0].type === 'VariableDeclaration' ? ';' : '');
        case 'FunctionDeclaration':
          return `function ${ast.id.name}(${ast.params.map(flatten).join(', ')}) ${ flatten(ast.body) }`;
        case 'BlockStatement': {
          const result = [];
          indent += 2;
          for (let i = 0; i < ast.body.length; i++) {
            const flat = flatten(ast.body[i]);
            if (flat) {
              result.push(' '.repeat(indent) + flat, ';\n');
            }
          }
          indent -= 2;
          return `{\n${result.join('')}}`;
        }
        case 'VariableDeclaration':
          const declarations = utils.normalizeDeclarations(ast)
            .map(flatten)
            .filter(r => r !== null);
          if (declarations.length < 1) {
            return '';
          } else {
            return `${ast.kind} ${declarations.join(',')}`;
          }
          case 'VariableDeclarator':
            if (ast.init.object && ast.init.object.type === 'ThisExpression') {
              const lookup = thisLookup(ast.init.property.name, true);
              if (lookup) {
                return `${ast.id.name} = ${flatten(ast.init)}`;
              } else {
                return null;
              }
            } else {
              return `${ast.id.name} = ${flatten(ast.init)}`;
            }
            case 'CallExpression': {
              if (ast.callee.property.name === 'subarray') {
                return `${flatten(ast.callee.object)}.${flatten(ast.callee.property)}(${ast.arguments.map(value => flatten(value)).join(', ')})`;
              }
              if (ast.callee.object.name === 'gl' || ast.callee.object.name === 'context') {
                return `${flatten(ast.callee.object)}.${flatten(ast.callee.property)}(${ast.arguments.map(value => flatten(value)).join(', ')})`;
              }
              if (ast.callee.object.type === 'ThisExpression') {
                functionDependencies.push(findDependency('this', ast.callee.property.name));
                return `${ast.callee.property.name}(${ast.arguments.map(value => flatten(value)).join(', ')})`;
              } else if (ast.callee.object.name) {
                const foundSource = findDependency(ast.callee.object.name, ast.callee.property.name);
                if (foundSource === null) {
                  return `${ast.callee.object.name}.${ast.callee.property.name}(${ast.arguments.map(value => flatten(value)).join(', ')})`;
                } else {
                  functionDependencies.push(foundSource);
                  return `${ast.callee.property.name}(${ast.arguments.map(value => flatten(value)).join(', ')})`;
                }
              } else if (ast.callee.object.type === 'MemberExpression') {
                return `${flatten(ast.callee.object)}.${ast.callee.property.name}(${ast.arguments.map(value => flatten(value)).join(', ')})`;
              } else {
                throw new Error('unknown ast.callee');
              }
            }
            case 'ReturnStatement':
              return `return ${flatten(ast.argument)}`;
            case 'BinaryExpression':
              return `(${flatten(ast.left)}${ast.operator}${flatten(ast.right)})`;
            case 'UnaryExpression':
              if (ast.prefix) {
                return `${ast.operator} ${flatten(ast.argument)}`;
              } else {
                return `${flatten(ast.argument)} ${ast.operator}`;
              }
              case 'ExpressionStatement':
                return `${flatten(ast.expression)}`;
              case 'SequenceExpression':
                return `(${flatten(ast.expressions)})`;
              case 'ArrowFunctionExpression':
                return `(${ast.params.map(flatten).join(', ')}) => ${flatten(ast.body)}`;
              case 'Literal':
                return ast.raw;
              case 'Identifier':
                return ast.name;
              case 'MemberExpression':
                if (ast.object.type === 'ThisExpression') {
                  return thisLookup(ast.property.name);
                }
                if (ast.computed) {
                  return `${flatten(ast.object)}[${flatten(ast.property)}]`;
                }
                return flatten(ast.object) + '.' + flatten(ast.property);
              case 'ThisExpression':
                return 'this';
              case 'NewExpression':
                return `new ${flatten(ast.callee)}(${ast.arguments.map(value => flatten(value)).join(', ')})`;
              case 'ForStatement':
                return `for (${flatten(ast.init)};${flatten(ast.test)};${flatten(ast.update)}) ${flatten(ast.body)}`;
              case 'AssignmentExpression':
                return `${flatten(ast.left)}${ast.operator}${flatten(ast.right)}`;
              case 'UpdateExpression':
                return `${flatten(ast.argument)}${ast.operator}`;
              case 'IfStatement':
                return `if (${flatten(ast.test)}) ${flatten(ast.consequent)}`;
              case 'ThrowStatement':
                return `throw ${flatten(ast.argument)}`;
              case 'ObjectPattern':
                return ast.properties.map(flatten).join(', ');
              case 'ArrayPattern':
                return ast.elements.map(flatten).join(', ');
              case 'DebuggerStatement':
                return 'debugger;';
              case 'ConditionalExpression':
                return `${flatten(ast.test)}?${flatten(ast.consequent)}:${flatten(ast.alternate)}`;
              case 'Property':
                if (ast.kind === 'init') {
                  return flatten(ast.key);
                }
      }
      throw new Error(`unhandled ast.type of ${ ast.type }`);
    }
    const result = flatten(ast);
    if (functionDependencies.length > 0) {
      const flattenedFunctionDependencies = [];
      for (let i = 0; i < functionDependencies.length; i++) {
        const functionDependency = functionDependencies[i];
        if (!flattened[functionDependency]) {
          flattened[functionDependency] = true;
        }
        functionDependency ? flattenedFunctionDependencies.push(utils.flattenFunctionToString(functionDependency, settings) + '\n') : '';
      }
      return flattenedFunctionDependencies.join('') + result;
    }
    return result;
  },

  normalizeDeclarations: (ast) => {
    if (ast.type !== 'VariableDeclaration') throw new Error('Ast is not of type "VariableDeclaration"');
    const normalizedDeclarations = [];
    for (let declarationIndex = 0; declarationIndex < ast.declarations.length; declarationIndex++) {
      const declaration = ast.declarations[declarationIndex];
      if (declaration.id && declaration.id.type === 'ObjectPattern' && declaration.id.properties) {
        const { properties } = declaration.id;
        for (let propertyIndex = 0; propertyIndex < properties.length; propertyIndex++) {
          const property = properties[propertyIndex];
          if (property.value.type === 'ObjectPattern' && property.value.properties) {
            for (let subPropertyIndex = 0; subPropertyIndex < property.value.properties.length; subPropertyIndex++) {
              const subProperty = property.value.properties[subPropertyIndex];
              if (subProperty.type === 'Property') {
                normalizedDeclarations.push({
                  type: 'VariableDeclarator',
                  id: {
                    type: 'Identifier',
                    name: subProperty.key.name
                  },
                  init: {
                    type: 'MemberExpression',
                    object: {
                      type: 'MemberExpression',
                      object: declaration.init,
                      property: {
                        type: 'Identifier',
                        name: property.key.name
                      },
                      computed: false
                    },
                    property: {
                      type: 'Identifier',
                      name: subProperty.key.name
                    },
                    computed: false
                  }
                });
              } else {
                throw new Error('unexpected state');
              }
            }
          } else if (property.value.type === 'Identifier') {
            normalizedDeclarations.push({
              type: 'VariableDeclarator',
              id: {
                type: 'Identifier',
                name: property.value && property.value.name ? property.value.name : property.key.name
              },
              init: {
                type: 'MemberExpression',
                object: declaration.init,
                property: {
                  type: 'Identifier',
                  name: property.key.name
                },
                computed: false
              }
            });
          } else {
            throw new Error('unexpected state');
          }
        }
      } else if (declaration.id && declaration.id.type === 'ArrayPattern' && declaration.id.elements) {
        const { elements } = declaration.id;
        for (let elementIndex = 0; elementIndex < elements.length; elementIndex++) {
          const element = elements[elementIndex];
          if (element.type === 'Identifier') {
            normalizedDeclarations.push({
              type: 'VariableDeclarator',
              id: {
                type: 'Identifier',
                name: element.name
              },
              init: {
                type: 'MemberExpression',
                object: declaration.init,
                property: {
                  type: 'Literal',
                  value: elementIndex,
                  raw: elementIndex.toString(),
                  start: element.start,
                  end: element.end
                },
                computed: true
              }
            });
          } else {
            throw new Error('unexpected state');
          }
        }
      } else {
        normalizedDeclarations.push(declaration);
      }
    }
    return normalizedDeclarations;
  },

  splitHTMLImageToRGB: (gpu, image) => {
    const rKernel = gpu.createKernel(function(a) {
      const pixel = a[this.thread.y][this.thread.x];
      return pixel.r * 255;
    }, {
      output: [image.width, image.height],
      precision: 'unsigned',
      argumentTypes: { a: 'HTMLImage' },
    });
    const gKernel = gpu.createKernel(function(a) {
      const pixel = a[this.thread.y][this.thread.x];
      return pixel.g * 255;
    }, {
      output: [image.width, image.height],
      precision: 'unsigned',
      argumentTypes: { a: 'HTMLImage' },
    });
    const bKernel = gpu.createKernel(function(a) {
      const pixel = a[this.thread.y][this.thread.x];
      return pixel.b * 255;
    }, {
      output: [image.width, image.height],
      precision: 'unsigned',
      argumentTypes: { a: 'HTMLImage' },
    });
    const aKernel = gpu.createKernel(function(a) {
      const pixel = a[this.thread.y][this.thread.x];
      return pixel.a * 255;
    }, {
      output: [image.width, image.height],
      precision: 'unsigned',
      argumentTypes: { a: 'HTMLImage' },
    });
    const result = [
      rKernel(image),
      gKernel(image),
      bKernel(image),
      aKernel(image),
    ];
    result.rKernel = rKernel;
    result.gKernel = gKernel;
    result.bKernel = bKernel;
    result.aKernel = aKernel;
    result.gpu = gpu;
    return result;
  },

  splitRGBAToCanvases: (gpu, rgba, width, height) => {
    const visualKernelR = gpu.createKernel(function(v) {
      const pixel = v[this.thread.y][this.thread.x];
      this.color(pixel.r / 255, 0, 0, 255);
    }, {
      output: [width, height],
      graphical: true,
      argumentTypes: { v: 'Array2D(4)' }
    });
    visualKernelR(rgba);

    const visualKernelG = gpu.createKernel(function(v) {
      const pixel = v[this.thread.y][this.thread.x];
      this.color(0, pixel.g / 255, 0, 255);
    }, {
      output: [width, height],
      graphical: true,
      argumentTypes: { v: 'Array2D(4)' }
    });
    visualKernelG(rgba);

    const visualKernelB = gpu.createKernel(function(v) {
      const pixel = v[this.thread.y][this.thread.x];
      this.color(0, 0, pixel.b / 255, 255);
    }, {
      output: [width, height],
      graphical: true,
      argumentTypes: { v: 'Array2D(4)' }
    });
    visualKernelB(rgba);

    const visualKernelA = gpu.createKernel(function(v) {
      const pixel = v[this.thread.y][this.thread.x];
      this.color(255, 255, 255, pixel.a / 255);
    }, {
      output: [width, height],
      graphical: true,
      argumentTypes: { v: 'Array2D(4)' }
    });
    visualKernelA(rgba);
    return [
      visualKernelR.canvas,
      visualKernelG.canvas,
      visualKernelB.canvas,
      visualKernelA.canvas,
    ];
  },

  getMinifySafeName: (fn) => {
    try {
      const ast = acorn.parse(`const value = ${fn.toString()}`);
      const { init } = ast.body[0].declarations[0];
      return init.body.name || init.body.body[0].argument.name;
    } catch (e) {
      throw new Error('Unrecognized function type.  Please use `() => yourFunctionVariableHere` or function() { return yourFunctionVariableHere; }');
    }
  },
  sanitizeName: function(name) {
    if (dollarSign.test(name)) {
      name = name.replace(dollarSign, 'S_S');
    }
    if (doubleUnderscore.test(name)) {
      name = name.replace(doubleUnderscore, 'U_U');
    } else if (singleUnderscore.test(name)) {
      name = name.replace(singleUnderscore, 'u_u');
    }
    return name;
  }
};

const dollarSign = /\$/;
const doubleUnderscore = /__/;
const singleUnderscore = /_/;

const _systemEndianness = utils.getSystemEndianness();

module.exports = {
  utils
};
},{"./input":110,"./texture":113,"acorn":1}]},{},[107])(107)
});
});

/* Functions for turning sparse hashes into arrays and vice versa */
const lookup = {
    /**
     * Performs `[{a: 1}, {b: 6, c: 7}] -> {a: 0, b: 1, c: 2}`
     * @param {Object} hashes
     * @returns {Object}
     */
    toTable(hashes) {
        const hash = hashes.reduce((memo, hash) => {
            return Object.assign(memo, hash);
        }, {});
        return lookup.toHash(hash);
    },
    /**
     * Performs `[{a: 1}, {b: 6, c: 7}] -> {a: 0, b: 1, c: 2}`
     */
    toTable2D(objects2D) {
        const table = {};
        let valueIndex = 0;
        for (let i = 0; i < objects2D.length; i++) {
            const objects = objects2D[i];
            for (let j = 0; j < objects.length; j++) {
                const object = objects[j];
                for (const p in object) {
                    if (object.hasOwnProperty(p) && !table.hasOwnProperty(p)) {
                        table[p] = valueIndex++;
                    }
                }
            }
        }
        return table;
    },
    toInputTable2D(data) {
        const table = {};
        let tableIndex = 0;
        for (let dataIndex = 0; dataIndex < data.length; dataIndex++) {
            const input = data[dataIndex].input;
            for (let i = 0; i < input.length; i++) {
                const object = input[i];
                for (const p in object) {
                    if (!object.hasOwnProperty(p))
                        continue;
                    if (!table.hasOwnProperty(p)) {
                        table[p] = tableIndex++;
                    }
                }
            }
        }
        return table;
    },
    toOutputTable2D(data) {
        const table = {};
        let tableIndex = 0;
        for (let dataIndex = 0; dataIndex < data.length; dataIndex++) {
            const output = data[dataIndex].output;
            for (let i = 0; i < output.length; i++) {
                const object = output[i];
                for (const p in object) {
                    if (!object.hasOwnProperty(p))
                        continue;
                    if (!table.hasOwnProperty(p)) {
                        table[p] = tableIndex++;
                    }
                }
            }
        }
        return table;
    },
    /**
     * performs `{a: 6, b: 7} -> {a: 0, b: 1}`
     */
    toHash(hash) {
        const lookup = {};
        let index = 0;
        const keys = Object.keys(hash);
        for (let i = 0; i < keys.length; i++) {
            lookup[keys[i]] = index++;
        }
        return lookup;
    },
    /**
     * performs `{a: 0, b: 1}, {a: 6} -> [6, 0]`
     */
    toArray(lookup, object, arrayLength) {
        const result = new Float32Array(arrayLength);
        for (const p in lookup) {
            if (!lookup.hasOwnProperty(p))
                continue;
            result[lookup[p]] = object.hasOwnProperty(p) ? object[p] : 0;
        }
        return result;
    },
    toArrayShort(lookup, object) {
        const result = [];
        for (const p in lookup) {
            if (!lookup.hasOwnProperty(p))
                continue;
            if (!object.hasOwnProperty(p))
                break;
            result[lookup[p]] = object[p];
        }
        return Float32Array.from(result);
    },
    toArrays(lookup, objects, arrayLength) {
        const result = [];
        for (let i = 0; i < objects.length; i++) {
            result.push(this.toArray(lookup, objects[i], arrayLength));
        }
        return result;
    },
    /**
     * performs `{a: 0, b: 1}, [6, 7] -> {a: 6, b: 7}`
     * @param {Object} lookup
     * @param {Array} array
     * @returns {Object}
     */
    toObject(lookup, array) {
        const object = {};
        for (const p in lookup) {
            if (!lookup.hasOwnProperty(p))
                continue;
            object[p] = array[lookup[p]];
        }
        return object;
    },
    toObjectPartial(lookup, array, offset = 0, limit = 0) {
        const object = {};
        let i = 0;
        for (const p in lookup) {
            if (!lookup.hasOwnProperty(p))
                continue;
            if (offset > 0) {
                if (i++ < offset)
                    continue;
            }
            if (limit > 0) {
                if (i++ >= limit)
                    continue;
            }
            object[p] = array[lookup[p] - offset];
        }
        return object;
    },
    dataShape(data) {
        const shape = [];
        let lastData;
        if (data.hasOwnProperty('input')) {
            shape.push('datum');
            lastData = data.input;
        }
        else if (Array.isArray(data)) {
            if (data[0] &&
                data[0].input) {
                shape.push('array', 'datum');
                lastData = data[0].input;
            }
            else if (Array.isArray(data[0])) {
                shape.push('array');
                lastData = data[0];
            }
            else {
                lastData = data;
            }
        }
        else {
            lastData = data;
        }
        let p;
        while (lastData) {
            p = Object.keys(lastData)[0];
            if (Array.isArray(lastData) ||
                typeof lastData.buffer === 'object') {
                shape.push('array');
                const possibleNumber = lastData[parseInt(p)];
                if (typeof possibleNumber === 'number') {
                    shape.push('number');
                    break;
                }
                else {
                    lastData = possibleNumber;
                }
            }
            else if (typeof lastData === 'object' &&
                typeof lastData.buffer !== 'object') {
                shape.push('object');
                const possibleNumber = lastData[p];
                if (typeof possibleNumber === 'number') {
                    shape.push('number');
                    break;
                }
                else {
                    lastData = possibleNumber;
                }
            }
            else {
                throw new Error('unhandled signature');
            }
        }
        return shape;
    },
    addKeys(value, table) {
        if (Array.isArray(value))
            return table;
        let i = Object.keys(table).length;
        for (const p in value) {
            if (!value.hasOwnProperty(p))
                continue;
            if (table.hasOwnProperty(p))
                continue;
            table[p] = i++;
        }
        return table;
    },
};

var browser = createCommonjsModule(function (module, exports) {
var __assign = (commonjsGlobal && commonjsGlobal.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.thaw = exports.Block = exports.Thaw = void 0;
/**
 * thaw an array of items
 */
var Thaw = /** @class */ (function () {
    function Thaw(items, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var _a = __assign(__assign({}, Thaw.defaultSettings), options), each = _a.each, done = _a.done;
        this.i = 0;
        this.isStopped = false;
        this.items = items;
        this.options = options;
        this.tick = function () {
            if (_this.isStopped)
                return;
            _this.timeout = setTimeout(_this.tick, 0);
            if (Thaw.thawing)
                return;
            var item = _this.items[_this.i];
            if (_this.i >= _this.items.length) {
                if (done !== null) {
                    Thaw.thawing = true;
                    done();
                    Thaw.thawing = false;
                }
                _this.isStopped = true;
                clearTimeout(_this.timeout);
                return;
            }
            if (each !== null) {
                Thaw.thawing = true;
                each(item, _this.i);
                Thaw.thawing = false;
            }
            else if (item !== undefined) {
                item();
            }
            _this.i++;
        };
        Thaw.thaws.push(this);
        if (!options.delay) {
            this.tick();
        }
    }
    Object.defineProperty(Thaw, "isThawing", {
        /**
         * returns if Thaw.js is thawing
         */
        get: function () {
            return Thaw.thawing;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Stops all Thaw instances
     */
    Thaw.stopAll = function () {
        for (var i = 0; i < Thaw.thaws.length; i++) {
            Thaw.thaws[i].stop();
        }
    };
    /**
     * readies thaw to continue
     */
    Thaw.prototype.makeReady = function () {
        if (this.isStopped) {
            this.isStopped = false;
            return true;
        }
        return false;
    };
    /**
     * Adds an item to the end of this instance of Thaw and readies Thaw to process it
     */
    Thaw.prototype.add = function (item) {
        this.items.push(item);
        if (this.makeReady()) {
            this.tick();
        }
        return this;
    };
    /**
     * Inserts an item just after the current item being processed in Thaw and readies Thaw to process it
     */
    Thaw.prototype.insert = function (item) {
        this.items.splice(this.i, 0, item);
        if (this.makeReady()) {
            this.tick();
        }
        return this;
    };
    /**
     * Adds an Array to the end of this instance of Thaw and readies Thaw to process it
     */
    Thaw.prototype.addArray = function (items) {
        this.items = this.items.concat(items);
        if (this.makeReady()) {
            this.tick();
        }
        return this;
    };
    /**
     * Inserts an Array just after the current item being processed in Thaw and readies Thaw to process them
     */
    Thaw.prototype.insertArray = function (items) {
        var before = this.items.splice(0, this.i);
        var after = this.items;
        this.items = before.concat(items, after);
        if (this.makeReady()) {
            this.tick();
        }
        return this;
    };
    /**
     * Stops this instance of Thaw
     */
    Thaw.prototype.stop = function () {
        this.isStopped = true;
        clearTimeout(this.timeout);
        if (this.options.done) {
            this.options.done();
        }
        return this;
    };
    Thaw.thawing = false;
    Thaw.thaws = [];
    Thaw.defaultSettings = {
        each: null,
        done: null
    };
    return Thaw;
}());
exports.Thaw = Thaw;
/**
 * simple thaw
 */
function thaw(items, options) {
    return new Thaw(items, options);
}
exports.thaw = thaw;
var Block = /** @class */ (function () {
    function Block(options, count) {
        if (count === void 0) { count = 200; }
        this.index = 0;
        this.thaws = [];
        this.count = count;
        this.options = options;
    }
    /**
     * add an item to the end of items
     */
    Block.prototype.add = function (item) {
        var next = this.next();
        next.add(item);
        return this;
    };
    /**
     * add an Array to the end of items
     */
    Block.prototype.addArray = function (items) {
        var next = this.next();
        next.addArray(items);
        return this;
    };
    /**
     * insert an item into items @ current position
     */
    Block.prototype.insert = function (item) {
        var next = this.next();
        next.insert(item);
        return this;
    };
    /**
     * insert and array into items @ current position
     */
    Block.prototype.insertArray = function (items) {
        var next = this.next();
        next.insertArray(items);
        return this;
    };
    /**
     * Stops all thaws in this block
     */
    Block.prototype.stop = function () {
        for (var i = 0; i < this.thaws.length; i++) {
            this.thaws[i].stop();
        }
        return this;
    };
    /**
     * Get next available in block
     */
    Block.prototype.next = function () {
        var thaw;
        var thaws = this.thaws;
        if (thaws.length < this.count) {
            thaw = new Thaw([], this.options);
            thaws.push(thaw);
        }
        else {
            thaw = thaws[this.index] || null;
        }
        this.index++;
        if (this.index >= this.count) {
            this.index = 0;
        }
        return thaw;
    };
    return Block;
}());
exports.Block = Block;
if (typeof window !== 'undefined') {
    // @ts-ignore
    window.Thaw = Thaw;
    // @ts-ignore
    window.thaw = thaw;
    // @ts-ignore
    window.Thaw.Block = Block;
}
});

function arraysToFloat32Arrays(arrays) {
    const result = [];
    for (let i = 0; i < arrays.length; i++) {
        result.push(Float32Array.from(arrays[i]));
    }
    return result;
}
function inputOutputArraysToFloat32Arrays(input, output) {
    const result = [];
    for (let i = 0; i < input.length; i++) {
        result.push(Float32Array.from(input[i]));
    }
    for (let i = 0; i < output.length; i++) {
        result.push(Float32Array.from(output[i]));
    }
    return result;
}
function arrayToFloat32Arrays(array) {
    const result = [];
    for (let i = 0; i < array.length; i++) {
        result.push(Float32Array.from([array[i]]));
    }
    return result;
}
function inputOutputArrayToFloat32Arrays(input, output) {
    const result = [];
    for (let i = 0; i < input.length; i++) {
        result.push(Float32Array.from([input[i]]));
    }
    for (let i = 0; i < output.length; i++) {
        result.push(Float32Array.from([output[i]]));
    }
    return result;
}
function arrayToFloat32Array(array) {
    return Float32Array.from(array);
}
function inputOutputObjectsToFloat32Arrays(input, output, inputTable, outputTable, inputLength, outputLength) {
    const results = [];
    for (let i = 0; i < input.length; i++) {
        const object = input[i];
        const result = new Float32Array(inputLength);
        for (const p in object) {
            if (object.hasOwnProperty(p)) {
                result[inputTable[p]] = object[p];
            }
        }
        results.push(result);
    }
    for (let i = 0; i < output.length; i++) {
        const object = output[i];
        const result = new Float32Array(outputLength);
        for (const p in object) {
            if (object.hasOwnProperty(p)) {
                result[outputTable[p]] = object[p];
            }
        }
        results.push(result);
    }
    return results;
}
function objectToFloat32Arrays(object) {
    const result = [];
    for (const p in object) {
        if (!object.hasOwnProperty(p))
            continue;
        result.push(Float32Array.from([object[p]]));
    }
    return result;
}
function inputOutputObjectToFloat32Arrays(input, output) {
    const result = [];
    for (const p in input) {
        if (!input.hasOwnProperty(p))
            continue;
        result.push(Float32Array.from([input[p]]));
    }
    for (const p in output) {
        if (!output.hasOwnProperty(p))
            continue;
        result.push(Float32Array.from([output[p]]));
    }
    return result;
}
function objectToFloat32Array(object, table, length) {
    const result = new Float32Array(length);
    for (const p in object) {
        if (object.hasOwnProperty(p)) {
            result[table[p]] = object[p];
        }
    }
    return result;
}

class LookupTable {
    constructor(data, prop) {
        this.prop = null;
        this.table = {};
        this.length = 0;
        const table = this.table;
        if (prop) {
            this.prop = prop;
            for (let i = 0; i < data.length; i++) {
                const datum = data[i];
                const object = datum[prop];
                for (const p in object) {
                    if (!object.hasOwnProperty(p))
                        continue;
                    if (table.hasOwnProperty(p))
                        continue;
                    table[p] = this.length++;
                }
            }
        }
        else if (Array.isArray(data) && Array.isArray(data[0])) {
            for (let i = 0; i < data.length; i++) {
                const array = data[i];
                for (let j = 0; j < array.length; j++) {
                    const object = array[j];
                    for (const p in object) {
                        if (!object.hasOwnProperty(p))
                            continue;
                        if (table.hasOwnProperty(p))
                            continue;
                        table[p] = this.length++;
                    }
                }
            }
        }
        else {
            for (let i = 0; i < data.length; i++) {
                const object = data[i];
                for (const p in object) {
                    if (!object.hasOwnProperty(p))
                        continue;
                    if (table.hasOwnProperty(p))
                        continue;
                    table[p] = this.length++;
                }
            }
        }
    }
}

function max(values) {
    if (Array.isArray(values) || values instanceof Float32Array) {
        return Math.max(...values);
    }
    else {
        return Math.max(...Object.values(values));
    }
}

function mse$1(errors) {
    // mean squared error
    let sum = 0;
    for (let i = 0; i < errors.length; i++) {
        sum += errors[i] ** 2;
    }
    return sum / errors.length;
}

function randomWeight() {
    return Math.random() * 0.4 - 0.2;
}

/**
 * Returns a random float between given min and max bounds (inclusive)
 * @param min Minimum value of the ranfom float
 * @param max Maximum value of the random float
 */
function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}
/**
 * Complicated math. All you need to know is that it returns a random number.
 * More info: https://en.wikipedia.org/wiki/Normal_distribution
 */
function gaussRandom() {
    if (gaussRandom.returnV) {
        gaussRandom.returnV = false;
        return gaussRandom.vVal;
    }
    const u = 2 * Math.random() - 1;
    const v = 2 * Math.random() - 1;
    const r = u * u + v * v;
    if (r === 0 || r > 1) {
        return gaussRandom();
    }
    const c = Math.sqrt((-2 * Math.log(r)) / r);
    gaussRandom.vVal = v * c; // cache this
    gaussRandom.returnV = true;
    return u * c;
}
/**
 * Returns a random integer between given min and max bounds
 * @param min Minimum value of the random integer
 * @param max Maximum value of the random integer
 */
function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
/**
 * If you know what this is: https://en.wikipedia.org/wiki/Normal_distribution
 * @param mu
 * @param std
 */
function randomN(mu, std) {
    return mu + gaussRandom() * std;
}
gaussRandom.returnV = false;
gaussRandom.vVal = 0;

var random$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    randomFloat: randomFloat,
    gaussRandom: gaussRandom,
    randomInteger: randomInteger,
    randomN: randomN
});

/**
 * Returns an array of given size, full of randomness
 */
function randos(size, std = null) {
    const array = new Float32Array(size);
    if (std === null) {
        for (let i = 0; i < size; i++) {
            array[i] = randomWeight();
        }
    }
    else {
        for (let i = 0; i < size; i++) {
            array[i] = randomFloat(-std, std);
        }
    }
    return array;
}
/**
 * Returns a 2D matrix of given size, full of randomness
 */
function randos2D(width, height, std) {
    const result = new Array(height);
    for (let y = 0; y < height; y++) {
        result[y] = randos(width, std);
    }
    return result;
}
/**
 * Returns a 3D tensor of given size, full of randomness
 */
function randos3D(width, height, depth, std) {
    const result = new Array(depth);
    for (let z = 0; z < depth; z++) {
        result[z] = randos2D(width, height, std);
    }
    return result;
}

/**
 * Returns an array of zeros
 */
function zeros$1(size) {
    return new Float32Array(size);
}

function getTypedArrayFn(value, table) {
    if (value.buffer instanceof ArrayBuffer) {
        return null;
    }
    if (Array.isArray(value)) {
        return arrayToFloat32Array;
    }
    if (!table)
        throw new Error('table is not Object');
    const { length } = Object.keys(table);
    return (v) => {
        const array = new Float32Array(length);
        for (const p in table) {
            if (!table.hasOwnProperty(p))
                continue;
            if (typeof v[p] !== 'number')
                continue;
            array[table[p]] = v[p] || 0;
        }
        return array;
    };
}
function defaults$8() {
    return {
        inputSize: 0,
        outputSize: 0,
        binaryThresh: 0.5,
    };
}
function trainDefaults$3() {
    return {
        activation: 'sigmoid',
        iterations: 20000,
        errorThresh: 0.005,
        log: false,
        logPeriod: 10,
        leakyReluAlpha: 0.01,
        learningRate: 0.3,
        momentum: 0.1,
        callbackPeriod: 10,
        timeout: Infinity,
        beta1: 0.9,
        beta2: 0.999,
        epsilon: 1e-8,
    };
}
class NeuralNetwork {
    constructor(options = {}) {
        this.options = defaults$8();
        this.trainOpts = trainDefaults$3();
        this.sizes = [];
        this.outputLayer = -1;
        this.biases = [];
        this.weights = []; // weights for bias nodes
        this.outputs = [];
        // state for training
        this.deltas = [];
        this.changes = []; // for momentum
        this.errors = [];
        this.errorCheckInterval = 1;
        this.inputLookup = null;
        this.inputLookupLength = 0;
        this.outputLookup = null;
        this.outputLookupLength = 0;
        this._formatInput = null;
        this._formatOutput = null;
        this.runInput = (input) => {
            this.setActivation();
            return this.runInput(input);
        };
        this.calculateDeltas = (output) => {
            this.setActivation();
            return this.calculateDeltas(output);
        };
        // adam
        this.biasChangesLow = [];
        this.biasChangesHigh = [];
        this.changesLow = [];
        this.changesHigh = [];
        this.iterations = 0;
        this.options = { ...this.options, ...options };
        this.updateTrainingOptions(options);
        const { inputSize, hiddenLayers, outputSize } = this.options;
        if (inputSize && outputSize) {
            this.sizes = [inputSize].concat(hiddenLayers !== null && hiddenLayers !== void 0 ? hiddenLayers : []).concat([outputSize]);
        }
    }
    /**
     *
     * Expects this.sizes to have been set
     */
    initialize() {
        if (!this.sizes.length) {
            throw new Error('Sizes must be set before initializing');
        }
        this.outputLayer = this.sizes.length - 1;
        this.biases = new Array(this.outputLayer); // weights for bias nodes
        this.weights = new Array(this.outputLayer);
        this.outputs = new Array(this.outputLayer);
        // state for training
        this.deltas = new Array(this.outputLayer);
        this.changes = new Array(this.outputLayer); // for momentum
        this.errors = new Array(this.outputLayer);
        for (let layerIndex = 0; layerIndex <= this.outputLayer; layerIndex++) {
            const size = this.sizes[layerIndex];
            this.deltas[layerIndex] = zeros$1(size);
            this.errors[layerIndex] = zeros$1(size);
            this.outputs[layerIndex] = zeros$1(size);
            if (layerIndex > 0) {
                this.biases[layerIndex] = randos(size);
                this.weights[layerIndex] = new Array(size);
                this.changes[layerIndex] = new Array(size);
                for (let nodeIndex = 0; nodeIndex < size; nodeIndex++) {
                    const prevSize = this.sizes[layerIndex - 1];
                    this.weights[layerIndex][nodeIndex] = randos(prevSize);
                    this.changes[layerIndex][nodeIndex] = zeros$1(prevSize);
                }
            }
        }
        this.setActivation();
        if (this.trainOpts.praxis === 'adam') {
            this._setupAdam();
        }
    }
    setActivation(activation) {
        const value = activation !== null && activation !== void 0 ? activation : this.trainOpts.activation;
        switch (value) {
            case 'sigmoid':
                this.runInput = this._runInputSigmoid;
                this.calculateDeltas = this._calculateDeltasSigmoid;
                break;
            case 'relu':
                this.runInput = this._runInputRelu;
                this.calculateDeltas = this._calculateDeltasRelu;
                break;
            case 'leaky-relu':
                this.runInput = this._runInputLeakyRelu;
                this.calculateDeltas = this._calculateDeltasLeakyRelu;
                break;
            case 'tanh':
                this.runInput = this._runInputTanh;
                this.calculateDeltas = this._calculateDeltasTanh;
                break;
            default:
                throw new Error(`Unknown activation ${value}. Available activations are: 'sigmoid', 'relu', 'leaky-relu', 'tanh'`);
        }
    }
    get isRunnable() {
        return this.sizes.length > 0;
    }
    run(input) {
        if (!this.isRunnable) {
            throw new Error('network not runnable');
        }
        let formattedInput;
        if (this.inputLookup) {
            formattedInput = lookup.toArray(this.inputLookup, input, this.inputLookupLength);
        }
        else {
            formattedInput = input;
        }
        this.validateInput(formattedInput);
        const output = this.runInput(formattedInput).slice(0);
        if (this.outputLookup) {
            return lookup.toObject(this.outputLookup, output);
        }
        return output;
    }
    _runInputSigmoid(input) {
        this.outputs[0] = input; // set output state of input layer
        let output = null;
        for (let layer = 1; layer <= this.outputLayer; layer++) {
            const activeLayer = this.sizes[layer];
            const activeWeights = this.weights[layer];
            const activeBiases = this.biases[layer];
            const activeOutputs = this.outputs[layer];
            for (let node = 0; node < activeLayer; node++) {
                const weights = activeWeights[node];
                let sum = activeBiases[node];
                for (let k = 0; k < weights.length; k++) {
                    sum += weights[k] * input[k];
                }
                // sigmoid
                activeOutputs[node] = 1 / (1 + Math.exp(-sum));
            }
            output = input = activeOutputs;
        }
        if (!output) {
            throw new Error('output was empty');
        }
        return output;
    }
    _runInputRelu(input) {
        this.outputs[0] = input; // set output state of input layer
        let output = null;
        for (let layer = 1; layer <= this.outputLayer; layer++) {
            const activeSize = this.sizes[layer];
            const activeWeights = this.weights[layer];
            const activeBiases = this.biases[layer];
            const activeOutputs = this.outputs[layer];
            for (let node = 0; node < activeSize; node++) {
                const weights = activeWeights[node];
                let sum = activeBiases[node];
                for (let k = 0; k < weights.length; k++) {
                    sum += weights[k] * input[k];
                }
                // relu
                activeOutputs[node] = sum < 0 ? 0 : sum;
            }
            output = input = activeOutputs;
        }
        if (!output) {
            throw new Error('output was empty');
        }
        return output;
    }
    _runInputLeakyRelu(input) {
        this.outputs[0] = input; // set output state of input layer
        const { leakyReluAlpha } = this.trainOpts;
        let output = null;
        for (let layer = 1; layer <= this.outputLayer; layer++) {
            const activeSize = this.sizes[layer];
            const activeWeights = this.weights[layer];
            const activeBiases = this.biases[layer];
            const activeOutputs = this.outputs[layer];
            for (let node = 0; node < activeSize; node++) {
                const weights = activeWeights[node];
                let sum = activeBiases[node];
                for (let k = 0; k < weights.length; k++) {
                    sum += weights[k] * input[k];
                }
                // leaky relu
                activeOutputs[node] = Math.max(sum, leakyReluAlpha * sum);
            }
            output = input = activeOutputs;
        }
        if (!output) {
            throw new Error('output was empty');
        }
        return output;
    }
    _runInputTanh(input) {
        this.outputs[0] = input; // set output state of input layer
        let output = null;
        for (let layer = 1; layer <= this.outputLayer; layer++) {
            const activeSize = this.sizes[layer];
            const activeWeights = this.weights[layer];
            const activeBiases = this.biases[layer];
            const activeOutputs = this.outputs[layer];
            for (let node = 0; node < activeSize; node++) {
                const weights = activeWeights[node];
                let sum = activeBiases[node];
                for (let k = 0; k < weights.length; k++) {
                    sum += weights[k] * input[k];
                }
                // tanh
                activeOutputs[node] = Math.tanh(sum);
            }
            output = input = activeOutputs;
        }
        if (!output) {
            throw new Error('output was empty');
        }
        return output;
    }
    /**
     *
     * Verifies network sizes are initialized
     * If they are not it will initialize them based off the data set.
     */
    verifyIsInitialized(preparedData) {
        if (this.sizes.length && this.outputLayer > 0)
            return;
        this.sizes = [];
        this.sizes.push(preparedData[0].input.length);
        if (!this.options.hiddenLayers) {
            this.sizes.push(Math.max(3, Math.floor(preparedData[0].input.length / 2)));
        }
        else {
            this.options.hiddenLayers.forEach((size) => {
                this.sizes.push(size);
            });
        }
        this.sizes.push(preparedData[0].output.length);
        this.initialize();
    }
    updateTrainingOptions(trainOpts) {
        const merged = { ...this.trainOpts, ...trainOpts };
        this.validateTrainingOptions(merged);
        this.trainOpts = merged;
        this.setLogMethod(this.trainOpts.log);
    }
    validateTrainingOptions(options) {
        const validations = {
            activation: () => {
                return ['sigmoid', 'relu', 'leaky-relu', 'tanh'].includes(options.activation);
            },
            iterations: () => {
                const val = options.iterations;
                return typeof val === 'number' && val > 0;
            },
            errorThresh: () => {
                const val = options.errorThresh;
                return typeof val === 'number' && val > 0 && val < 1;
            },
            log: () => {
                const val = options.log;
                return typeof val === 'function' || typeof val === 'boolean';
            },
            logPeriod: () => {
                const val = options.logPeriod;
                return typeof val === 'number' && val > 0;
            },
            leakyReluAlpha: () => {
                const val = options.leakyReluAlpha;
                return typeof val === 'number' && val > 0 && val < 1;
            },
            learningRate: () => {
                const val = options.learningRate;
                return typeof val === 'number' && val > 0 && val < 1;
            },
            momentum: () => {
                const val = options.momentum;
                return typeof val === 'number' && val > 0 && val < 1;
            },
            callback: () => {
                const val = options.callback;
                return typeof val === 'function' || val === undefined;
            },
            callbackPeriod: () => {
                const val = options.callbackPeriod;
                return typeof val === 'number' && val > 0;
            },
            timeout: () => {
                const val = options.timeout;
                return typeof val === 'number' && val > 0;
            },
            praxis: () => {
                const val = options.praxis;
                return !val || val === 'adam';
            },
            beta1: () => {
                const val = options.beta1;
                return val > 0 && val < 1;
            },
            beta2: () => {
                const val = options.beta2;
                return val > 0 && val < 1;
            },
            epsilon: () => {
                const val = options.epsilon;
                return val > 0 && val < 1;
            },
        };
        for (const p in validations) {
            const v = options;
            if (!validations[p]()) {
                throw new Error(`[${p}, ${v[p]}] is out of normal training range, your network will probably not train.`);
            }
        }
    }
    /**
     *
     *  Gets JSON of trainOpts object
     *    NOTE: Activation is stored directly on JSON object and not in the training options
     */
    getTrainOptsJSON() {
        const { activation, iterations, errorThresh, log, logPeriod, leakyReluAlpha, learningRate, momentum, callbackPeriod, timeout, praxis, beta1, beta2, epsilon, } = this.trainOpts;
        return {
            activation,
            iterations,
            errorThresh,
            log: typeof log === 'function'
                ? true
                : typeof log === 'boolean'
                    ? log
                    : false,
            logPeriod,
            leakyReluAlpha,
            learningRate,
            momentum,
            callbackPeriod,
            timeout: timeout === Infinity ? 'Infinity' : timeout,
            praxis,
            beta1,
            beta2,
            epsilon,
        };
    }
    setLogMethod(log) {
        if (typeof log === 'function') {
            this.trainOpts.log = log;
        }
        else if (log) {
            this.trainOpts.log = this.logTrainingStatus;
        }
        else {
            this.trainOpts.log = false;
        }
    }
    logTrainingStatus(status) {
        console.log(`iterations: ${status.iterations}, training error: ${status.error}`);
    }
    calculateTrainingError(data) {
        let sum = 0;
        for (let i = 0; i < data.length; ++i) {
            sum += this.trainPattern(data[i], true);
        }
        return sum / data.length;
    }
    trainPatterns(data) {
        for (let i = 0; i < data.length; ++i) {
            this.trainPattern(data[i]);
        }
    }
    trainingTick(data, status, endTime) {
        const { callback, callbackPeriod, errorThresh, iterations, log, logPeriod, } = this.trainOpts;
        if (status.iterations >= iterations ||
            status.error <= errorThresh ||
            Date.now() >= endTime) {
            return false;
        }
        status.iterations++;
        if (log && status.iterations % logPeriod === 0) {
            status.error = this.calculateTrainingError(data);
            log(status);
        }
        else if (status.iterations % this.errorCheckInterval === 0) {
            status.error = this.calculateTrainingError(data);
        }
        else {
            this.trainPatterns(data);
        }
        if (callback && status.iterations % callbackPeriod === 0) {
            callback({
                iterations: status.iterations,
                error: status.error,
            });
        }
        return true;
    }
    prepTraining(data, options = {}) {
        this.updateTrainingOptions(options);
        const preparedData = this.formatData(data);
        const endTime = Date.now() + this.trainOpts.timeout;
        const status = {
            error: 1,
            iterations: 0,
        };
        this.verifyIsInitialized(preparedData);
        this.validateData(preparedData);
        return {
            preparedData,
            status,
            endTime,
        };
    }
    train(data, options = {}) {
        const { preparedData, status, endTime } = this.prepTraining(data, options);
        while (true) {
            if (!this.trainingTick(preparedData, status, endTime)) {
                break;
            }
        }
        return status;
    }
    async trainAsync(data, options = {}) {
        const { preparedData, status, endTime } = this.prepTraining(data, options);
        return await new Promise((resolve, reject) => {
            try {
                const thawedTrain = new browser.Thaw(new Array(this.trainOpts.iterations), {
                    delay: true,
                    each: () => this.trainingTick(preparedData, status, endTime) ||
                        thawedTrain.stop(),
                    done: () => resolve(status),
                });
                thawedTrain.tick();
            }
            catch (trainError) {
                reject(trainError);
            }
        });
    }
    trainPattern(value, logErrorRate) {
        // forward propagate
        this.runInput(value.input);
        // back propagate
        this.calculateDeltas(value.output);
        this.adjustWeights();
        if (logErrorRate) {
            return mse$1(this.errors[this.outputLayer]);
        }
        return null;
    }
    _calculateDeltasSigmoid(target) {
        for (let layer = this.outputLayer; layer >= 0; layer--) {
            const activeSize = this.sizes[layer];
            const activeOutput = this.outputs[layer];
            const activeError = this.errors[layer];
            const activeDeltas = this.deltas[layer];
            const nextLayer = this.weights[layer + 1];
            for (let node = 0; node < activeSize; node++) {
                const output = activeOutput[node];
                let error = 0;
                if (layer === this.outputLayer) {
                    error = target[node] - output;
                }
                else {
                    const deltas = this.deltas[layer + 1];
                    for (let k = 0; k < deltas.length; k++) {
                        error += deltas[k] * nextLayer[k][node];
                    }
                }
                activeError[node] = error;
                activeDeltas[node] = error * output * (1 - output);
            }
        }
    }
    _calculateDeltasRelu(target) {
        for (let layer = this.outputLayer; layer >= 0; layer--) {
            const currentSize = this.sizes[layer];
            const currentOutputs = this.outputs[layer];
            const nextWeights = this.weights[layer + 1];
            const nextDeltas = this.deltas[layer + 1];
            const currentErrors = this.errors[layer];
            const currentDeltas = this.deltas[layer];
            for (let node = 0; node < currentSize; node++) {
                const output = currentOutputs[node];
                let error = 0;
                if (layer === this.outputLayer) {
                    error = target[node] - output;
                }
                else {
                    for (let k = 0; k < nextDeltas.length; k++) {
                        error += nextDeltas[k] * nextWeights[k][node];
                    }
                }
                currentErrors[node] = error;
                currentDeltas[node] = output > 0 ? error : 0;
            }
        }
    }
    _calculateDeltasLeakyRelu(target) {
        const alpha = this.trainOpts.leakyReluAlpha;
        for (let layer = this.outputLayer; layer >= 0; layer--) {
            const currentSize = this.sizes[layer];
            const currentOutputs = this.outputs[layer];
            const nextDeltas = this.deltas[layer + 1];
            const nextWeights = this.weights[layer + 1];
            const currentErrors = this.errors[layer];
            const currentDeltas = this.deltas[layer];
            for (let node = 0; node < currentSize; node++) {
                const output = currentOutputs[node];
                let error = 0;
                if (layer === this.outputLayer) {
                    error = target[node] - output;
                }
                else {
                    for (let k = 0; k < nextDeltas.length; k++) {
                        error += nextDeltas[k] * nextWeights[k][node];
                    }
                }
                currentErrors[node] = error;
                currentDeltas[node] = output > 0 ? error : alpha * error;
            }
        }
    }
    _calculateDeltasTanh(target) {
        for (let layer = this.outputLayer; layer >= 0; layer--) {
            const currentSize = this.sizes[layer];
            const currentOutputs = this.outputs[layer];
            const nextDeltas = this.deltas[layer + 1];
            const nextWeights = this.weights[layer + 1];
            const currentErrors = this.errors[layer];
            const currentDeltas = this.deltas[layer];
            for (let node = 0; node < currentSize; node++) {
                const output = currentOutputs[node];
                let error = 0;
                if (layer === this.outputLayer) {
                    error = target[node] - output;
                }
                else {
                    for (let k = 0; k < nextDeltas.length; k++) {
                        error += nextDeltas[k] * nextWeights[k][node];
                    }
                }
                currentErrors[node] = error;
                currentDeltas[node] = (1 - output * output) * error;
            }
        }
    }
    /**
     *
     * Changes weights of networks
     */
    adjustWeights() {
        const { learningRate, momentum } = this.trainOpts;
        for (let layer = 1; layer <= this.outputLayer; layer++) {
            const incoming = this.outputs[layer - 1];
            const activeSize = this.sizes[layer];
            const activeDelta = this.deltas[layer];
            const activeChanges = this.changes[layer];
            const activeWeights = this.weights[layer];
            const activeBiases = this.biases[layer];
            for (let node = 0; node < activeSize; node++) {
                const delta = activeDelta[node];
                for (let k = 0; k < incoming.length; k++) {
                    let change = activeChanges[node][k];
                    change = learningRate * delta * incoming[k] + momentum * change;
                    activeChanges[node][k] = change;
                    activeWeights[node][k] += change;
                }
                activeBiases[node] += learningRate * delta;
            }
        }
    }
    _setupAdam() {
        this.biasChangesLow = [];
        this.biasChangesHigh = [];
        this.changesLow = [];
        this.changesHigh = [];
        this.iterations = 0;
        for (let layer = 0; layer <= this.outputLayer; layer++) {
            const size = this.sizes[layer];
            if (layer > 0) {
                this.biasChangesLow[layer] = zeros$1(size);
                this.biasChangesHigh[layer] = zeros$1(size);
                this.changesLow[layer] = new Array(size);
                this.changesHigh[layer] = new Array(size);
                for (let node = 0; node < size; node++) {
                    const prevSize = this.sizes[layer - 1];
                    this.changesLow[layer][node] = zeros$1(prevSize);
                    this.changesHigh[layer][node] = zeros$1(prevSize);
                }
            }
        }
        this.adjustWeights = this._adjustWeightsAdam;
    }
    _adjustWeightsAdam() {
        this.iterations++;
        const { iterations } = this;
        const { beta1, beta2, epsilon, learningRate } = this.trainOpts;
        for (let layer = 1; layer <= this.outputLayer; layer++) {
            const incoming = this.outputs[layer - 1];
            const currentSize = this.sizes[layer];
            const currentDeltas = this.deltas[layer];
            const currentChangesLow = this.changesLow[layer];
            const currentChangesHigh = this.changesHigh[layer];
            const currentWeights = this.weights[layer];
            const currentBiases = this.biases[layer];
            const currentBiasChangesLow = this.biasChangesLow[layer];
            const currentBiasChangesHigh = this.biasChangesHigh[layer];
            for (let node = 0; node < currentSize; node++) {
                const delta = currentDeltas[node];
                for (let k = 0; k < incoming.length; k++) {
                    const gradient = delta * incoming[k];
                    const changeLow = currentChangesLow[node][k] * beta1 + (1 - beta1) * gradient;
                    const changeHigh = currentChangesHigh[node][k] * beta2 +
                        (1 - beta2) * gradient * gradient;
                    const momentumCorrection = changeLow / (1 - Math.pow(beta1, iterations));
                    const gradientCorrection = changeHigh / (1 - Math.pow(beta2, iterations));
                    currentChangesLow[node][k] = changeLow;
                    currentChangesHigh[node][k] = changeHigh;
                    currentWeights[node][k] +=
                        (learningRate * momentumCorrection) /
                            (Math.sqrt(gradientCorrection) + epsilon);
                }
                const biasGradient = currentDeltas[node];
                const biasChangeLow = currentBiasChangesLow[node] * beta1 + (1 - beta1) * biasGradient;
                const biasChangeHigh = currentBiasChangesHigh[node] * beta2 +
                    (1 - beta2) * biasGradient * biasGradient;
                const biasMomentumCorrection = currentBiasChangesLow[node] / (1 - Math.pow(beta1, iterations));
                const biasGradientCorrection = currentBiasChangesHigh[node] / (1 - Math.pow(beta2, iterations));
                currentBiasChangesLow[node] = biasChangeLow;
                currentBiasChangesHigh[node] = biasChangeHigh;
                currentBiases[node] +=
                    (learningRate * biasMomentumCorrection) /
                        (Math.sqrt(biasGradientCorrection) + epsilon);
            }
        }
    }
    validateData(data) {
        const inputSize = this.sizes[0];
        const outputSize = this.sizes[this.sizes.length - 1];
        const { length } = data;
        for (let i = 0; i < length; i++) {
            const { input, output } = data[i];
            if (input.length !== inputSize) {
                throw new Error(`input at index ${i} length ${input.length} must be ${inputSize}`);
            }
            if (data[i].output.length !== outputSize) {
                throw new Error(`output at index ${i} length ${output.length} must be ${outputSize}`);
            }
        }
    }
    validateInput(formattedInput) {
        const inputSize = this.sizes[0];
        if (formattedInput.length !== inputSize) {
            throw new Error(`input length ${formattedInput.length} must match options.inputSize of ${inputSize}`);
        }
    }
    formatData(data) {
        if (!Array.isArray(data[0].input)) {
            if (this.inputLookup) {
                this.inputLookupLength = Object.keys(this.inputLookup).length;
            }
            else {
                const inputLookup = new LookupTable(data, 'input');
                this.inputLookup = inputLookup.table;
                this.inputLookupLength = inputLookup.length;
            }
        }
        if (!Array.isArray(data[0].output)) {
            if (this.outputLookup) {
                this.outputLookupLength = Object.keys(this.outputLookup).length;
            }
            else {
                const lookup = new LookupTable(data, 'output');
                this.outputLookup = lookup.table;
                this.outputLookupLength = lookup.length;
            }
        }
        if (!this._formatInput) {
            this._formatInput = getTypedArrayFn(data[0].input, this.inputLookup);
        }
        if (!this._formatOutput) {
            this._formatOutput = getTypedArrayFn(data[0].output, this.outputLookup);
        }
        // turn sparse hash input into arrays with 0s as filler
        if (this._formatInput && this._formatOutput) {
            const result = [];
            for (let i = 0; i < data.length; i++) {
                result.push({
                    input: this._formatInput(data[i].input),
                    output: this._formatOutput(data[i].output),
                });
            }
            return result;
        }
        if (this._formatInput) {
            const result = [];
            for (let i = 0; i < data.length; i++) {
                result.push({
                    input: this._formatInput(data[i].input),
                    output: data[i].output,
                });
            }
            return result;
        }
        if (this._formatOutput) {
            const result = [];
            for (let i = 0; i < data.length; i++) {
                result.push({
                    input: data[i].input,
                    output: this._formatOutput(data[i].output),
                });
            }
            return result;
        }
        return data;
    }
    addFormat(data) {
        var _a, _b;
        if (!Array.isArray(data.input) || typeof data.input[0] !== 'number') {
            this.inputLookup = lookup.addKeys(data.input, (_a = this.inputLookup) !== null && _a !== void 0 ? _a : {});
            if (this.inputLookup) {
                this.inputLookupLength = Object.keys(this.inputLookup).length;
            }
        }
        if (!Array.isArray(data.output) || typeof data.output[0] !== 'number') {
            this.outputLookup = lookup.addKeys(data.output, (_b = this.outputLookup) !== null && _b !== void 0 ? _b : {});
            if (this.outputLookup) {
                this.outputLookupLength = Object.keys(this.outputLookup).length;
            }
        }
    }
    test(data) {
        const { preparedData } = this.prepTraining(data);
        // for binary classification problems with one output node
        const isBinary = preparedData[0].output.length === 1;
        // for classification problems
        const misclasses = [];
        // run each pattern through the trained network and collect
        // error and misclassification statistics
        let errorSum = 0;
        if (isBinary) {
            let falsePos = 0;
            let falseNeg = 0;
            let truePos = 0;
            let trueNeg = 0;
            for (let i = 0; i < preparedData.length; i++) {
                const output = this.runInput(preparedData[i].input);
                const target = preparedData[i].output;
                const actual = output[0] > this.options.binaryThresh ? 1 : 0;
                const expected = target[0];
                if (actual !== expected) {
                    const misclass = preparedData[i];
                    misclasses.push({
                        input: misclass.input,
                        output: misclass.output,
                        actual,
                        expected,
                    });
                }
                if (actual === 0 && expected === 0) {
                    trueNeg++;
                }
                else if (actual === 1 && expected === 1) {
                    truePos++;
                }
                else if (actual === 0 && expected === 1) {
                    falseNeg++;
                }
                else if (actual === 1 && expected === 0) {
                    falsePos++;
                }
                errorSum += mse$1(output.map((value, i) => {
                    return target[i] - value;
                }));
            }
            return {
                error: errorSum / preparedData.length,
                misclasses,
                total: preparedData.length,
                trueNeg,
                truePos,
                falseNeg,
                falsePos,
                precision: truePos > 0 ? truePos / (truePos + falsePos) : 0,
                recall: truePos > 0 ? truePos / (truePos + falseNeg) : 0,
                accuracy: (trueNeg + truePos) / preparedData.length,
            };
        }
        for (let i = 0; i < preparedData.length; i++) {
            const output = this.runInput(preparedData[i].input);
            const target = preparedData[i].output;
            const actual = output.indexOf(max(output));
            const expected = target.indexOf(max(target));
            if (actual !== expected) {
                const misclass = preparedData[i];
                misclasses.push({
                    input: misclass.input,
                    output: misclass.output,
                    actual,
                    expected,
                });
            }
            errorSum += mse$1(output.map((value, i) => {
                return target[i] - value;
            }));
        }
        return {
            error: errorSum / preparedData.length,
            misclasses,
            total: preparedData.length,
        };
    }
    toJSON() {
        var _a, _b;
        if (!this.isRunnable) {
            this.initialize();
        }
        // use Array.from, keeping json small
        const jsonLayerWeights = this.weights.map((layerWeights) => {
            return layerWeights.map((layerWeights) => Array.from(layerWeights));
        });
        const jsonLayerBiases = this.biases.map((layerBiases) => Array.from(layerBiases));
        const jsonLayers = [];
        const outputLength = this.sizes.length - 1;
        for (let i = 0; i <= outputLength; i++) {
            jsonLayers.push({
                weights: (_a = jsonLayerWeights[i]) !== null && _a !== void 0 ? _a : [],
                biases: (_b = jsonLayerBiases[i]) !== null && _b !== void 0 ? _b : [],
            });
        }
        return {
            type: 'NeuralNetwork',
            sizes: [...this.sizes],
            layers: jsonLayers,
            inputLookup: this.inputLookup ? { ...this.inputLookup } : null,
            inputLookupLength: this.inputLookupLength,
            outputLookup: this.outputLookup ? { ...this.outputLookup } : null,
            outputLookupLength: this.outputLookupLength,
            options: { ...this.options },
            trainOpts: this.getTrainOptsJSON(),
        };
    }
    fromJSON(json) {
        this.options = { ...defaults$8(), ...json.options };
        if (json.hasOwnProperty('trainOpts')) {
            const trainOpts = {
                ...json.trainOpts,
                timeout: json.trainOpts.timeout === 'Infinity'
                    ? Infinity
                    : json.trainOpts.timeout,
            };
            this.updateTrainingOptions(trainOpts);
        }
        this.sizes = json.sizes;
        this.initialize();
        this.inputLookup = json.inputLookup ? { ...json.inputLookup } : null;
        this.inputLookupLength = json.inputLookupLength;
        this.outputLookup = json.outputLookup ? { ...json.outputLookup } : null;
        this.outputLookupLength = json.outputLookupLength;
        const jsonLayers = json.layers;
        const layerWeights = this.weights.map((layerWeights, layerIndex) => {
            return jsonLayers[layerIndex].weights.map((layerWeights) => Float32Array.from(layerWeights));
        });
        const layerBiases = this.biases.map((layerBiases, layerIndex) => Float32Array.from(jsonLayers[layerIndex].biases));
        for (let i = 0; i <= this.outputLayer; i++) {
            this.weights[i] = layerWeights[i] || [];
            this.biases[i] = layerBiases[i] || [];
        }
        return this;
    }
    toFunction(cb) {
        const { activation, leakyReluAlpha } = this.trainOpts;
        let needsVar = false;
        const nodeHandle = (layerIndex, nodeIndex) => {
            if (layerIndex === 0) {
                return `(input[${nodeIndex}]||0)`;
            }
            const weights = this.weights[layerIndex][nodeIndex];
            const bias = this.biases[layerIndex][nodeIndex];
            if (!weights) {
                throw new Error(`weights at layerIndex ${layerIndex} & nodeIndex ${nodeIndex} not found`);
            }
            if (!bias) {
                throw new Error(`bias as layerIndex ${layerIndex} & nodeIndex ${nodeIndex} not found`);
            }
            const weightsArray = [];
            weights.forEach((weight, subNodeIndex) => {
                if (weight < 0) {
                    weightsArray.push(`${weight}*${nodeHandle(layerIndex - 1, subNodeIndex)}`);
                }
                else {
                    weightsArray.push(`+${weight}*${nodeHandle(layerIndex - 1, subNodeIndex)}`);
                }
            });
            const result = `(${bias.toString()}${weightsArray.join('')})`;
            switch (activation) {
                case 'sigmoid':
                    return `1/(1+1/Math.exp(${result}))`;
                case 'relu': {
                    needsVar = true;
                    return `((v=${result})<0?0:v)`;
                }
                case 'leaky-relu': {
                    needsVar = true;
                    return `Math.max((v=${result}),${leakyReluAlpha}*v)`;
                }
                case 'tanh':
                    return `Math.tanh(${result})`;
                default:
                    throw new Error(`Unknown activation ${activation}. Available activations are: 'sigmoid', 'relu', 'leaky-relu', 'tanh'`);
            }
        };
        function checkKeys(keys) {
            if (keys.find((v) => v.includes('"'))) {
                throw new Error(`key contains '"', which is not compatible`);
            }
        }
        const layersAsMath = [];
        let result;
        let inputLookup = '';
        if (this.inputLookup) {
            const keys = Object.keys(this.inputLookup);
            checkKeys(keys);
            inputLookup = `input = new Float32Array([${Object.keys(this.inputLookup)
            .map((key) => `input["${key}"]`)
            .join(',')}]);`;
        }
        if (this.sizes.length < 1)
            throw new Error('No layers');
        for (let nodeIndex = 0; nodeIndex < this.sizes[this.outputLayer]; nodeIndex++) {
            layersAsMath.push(nodeHandle(this.outputLayer, nodeIndex));
        }
        if (this.outputLookup) {
            const keys = Object.keys(this.outputLookup);
            checkKeys(keys);
            const values = keys
                .map((key, i) => `"${key}":${layersAsMath[i]}`)
                .join(',');
            result = `{${values}}`;
        }
        else {
            result = `[${layersAsMath.join(',')}]`;
        }
        const source = `${inputLookup}${needsVar ? 'var v;' : ''}return ${result};`;
        // eslint-disable-next-line @typescript-eslint/no-implied-eval,no-new-func
        return new Function('input', cb ? cb(source) : source);
    }
}

let gpuInstance = null;
/**
 * Sets up the gpu.js instance
 */
function setup(value) {
    gpuInstance = value;
}
function makeKernel(fn, settings) {
    let _gpuInstance = gpuInstance;
    if (_gpuInstance === null) {
        _gpuInstance = new gpuBrowser.GPU({ mode: 'gpu' });
        setup(_gpuInstance);
    }
    return _gpuInstance
        .createKernel(fn, settings)
        .setPipeline(true);
}
function makeKernelMap(map, fn, settings) {
    let _gpuInstance = gpuInstance;
    if (_gpuInstance === null) {
        _gpuInstance = new gpuBrowser.GPU({ mode: 'gpu' });
        setup(_gpuInstance);
    }
    return _gpuInstance
        .createKernelMap(map, fn, settings)
        .setPipeline(true);
}
/**
 * Compiles a function into a gpu.js dev mode kernel
 */
// export function makeDevKernel(
//   fn: ThreadFunction,
//   settings: makeKernelSettings
// ): IKernelRunShortcut {
//   if ('map' in settings) {
//     throw new Error('map kernels are not supported by dev kernels');
//   }
//   const gpu = new GPU({ mode: 'dev' });
//   return gpu.createKernel(fn, settings);
// }
function kernelInput(value, size) {
    return new gpuBrowser.Input(value, size);
}
/**
 * Deletes a gpu.js texture and frees VRAM
 */
function release(possibleTexture) {
    if (possibleTexture instanceof gpuBrowser.Texture) {
        possibleTexture.delete();
    }
}
/**
 * Cleans ie sets all elements to 0 of a Texture or a js array
 */
function clear(value) {
    if (value instanceof gpuBrowser.Texture) {
        value.clear();
        return;
    }
    // array
    if (Array.isArray(value)) {
        if (typeof value[0] === 'number') {
            value.fill(0);
        }
        else if (typeof value[0][0] === 'number') {
            for (let x = 0; x < value.length; x++) {
                value[x].fill(0);
            }
            return;
        }
        else if (typeof value[0][0][0] === 'number') {
            // cube
            for (let y = 0; y < value.length; y++) {
                const row = value[y];
                for (let x = 0; x < row.length; x++) {
                    row[x].fill(0);
                }
            }
            return;
        }
    }
    if (value instanceof Float32Array) {
        value.fill(0);
        return;
    }
    throw new Error('unhandled value');
}
/**
 * Clones a value
 */
function clone(value) {
    if (value instanceof gpuBrowser.Texture) {
        return value.clone();
    }
    if (value instanceof Float32Array) {
        return value.slice(0);
    }
    if (Array.isArray(value)) {
        if (typeof value[0] === 'number') {
            return value.slice(0);
        }
        else if (typeof value[0][0] === 'number') {
            const matrix = new Array(value.length);
            for (let x = 0; x < value.length; x++) {
                matrix[x] = value[x].slice(0);
            }
            return matrix;
        }
        else if (typeof value[0][0][0] === 'number') {
            const cube = new Array(value.length);
            for (let y = 0; y < value.length; y++) {
                const row = value[y];
                const matrix = new Array(row.length);
                for (let x = 0; x < row.length; x++) {
                    matrix[x] = row[x].slice(0);
                }
            }
            return cube;
        }
    }
    throw new Error('unhandled value');
}

function weightedSumSigmoid(weights, biases, inputs) {
    let sum = biases[this.thread.x];
    for (let k = 0; k < this.constants.size; k++) {
        sum += weights[this.thread.x][k] * inputs[k];
    }
    // sigmoid
    return 1 / (1 + Math.exp(-sum));
}
function weightedSumRelu(weights, biases, inputs) {
    let sum = biases[this.thread.x];
    for (let k = 0; k < this.constants.size; k++) {
        sum += weights[this.thread.x][k] * inputs[k];
    }
    // relu
    return sum < 0 ? 0 : sum;
}
function weightedSumLeakyRelu(weights, biases, inputs) {
    let sum = biases[this.thread.x];
    for (let k = 0; k < this.constants.size; k++) {
        sum += weights[this.thread.x][k] * inputs[k];
    }
    // leaky relu
    return sum < 0 ? 0 : 0.01 * sum;
}
function weightedSumTanh(weights, biases, inputs) {
    let sum = biases[this.thread.x];
    for (let k = 0; k < this.constants.size; k++) {
        sum += weights[this.thread.x][k] * inputs[k];
    }
    // tanh
    return Math.tanh(sum);
}
function calcErrorOutput(output, target) {
    return target - output;
}
function calcDeltasSigmoid(error, output) {
    // sigmoid derivative
    return error * output * (1 - output);
}
function calcDeltasRelu(error, output) {
    // relu derivative
    return output > 0 ? error : 0;
}
function calcDeltasLeakyRelu(error, output) {
    // leaky relu derivative
    return output > 0 ? error : 0.01 * error;
}
function calcDeltasTanh(error, output) {
    // tanh derivative
    return (1 - output * output) * error;
}
function calcError(x, size, nextWeights, nextDeltas) {
    let error = 0;
    for (let k = 0; k < size; k++) {
        error += nextDeltas[k] * nextWeights[k][x];
    }
    return error;
}
function calcChanges(learningRate, momentum, previousChange, delta, previousOutput) {
    return learningRate * delta * previousOutput + momentum * previousChange;
}
function addWeights(change, weight) {
    return change + weight;
}
function addBiases(biases, deltas) {
    return (biases[this.thread.x] + deltas[this.thread.x] * this.constants.learningRate);
}
// mean squared error, reimplemented for GPU
function mse(errors) {
    let sum = 0;
    for (let i = 0; i < this.constants.size; i++) {
        sum += errors[i] ** 2;
    }
    return sum / this.constants.size;
}
class NeuralNetworkGPU extends NeuralNetwork {
    constructor(options = {}) {
        super(options);
        this.texturizeInputData = () => {
            throw new Error('not yet setup');
        };
        this.forwardPropagate = [];
        this.backwardPropagate = [];
        this.changesPropagate = [];
        this.biasesPropagate = [];
        this.getMSE = () => {
            throw new Error('not yet setup');
        };
        this._addMSE = () => {
            throw new Error('not yet setup');
        };
        this._divideMSESum = () => {
            throw new Error('not yet setup');
        };
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        this.outputs = [];
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        this.deltas = [];
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        this.errors = [];
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        this.weights = [];
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        this.changes = [];
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        this.biases = [];
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        this.runInput = (input) => {
            let output;
            this.outputs[0] = input;
            for (let layer = 1; layer <= this.outputLayer; layer++) {
                release(this.outputs[layer]);
                this.outputs[layer] = this.forwardPropagate[layer](this.weights[layer], this.biases[layer], input);
                output = input = this.outputs[layer];
            }
            return output;
        };
        this.calculateDeltas = (target) => {
            for (let layer = this.outputLayer; layer > 0; layer--) {
                release(this.deltas[layer]);
                release(this.errors[layer]);
                let output;
                if (layer === this.outputLayer) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    output = this.backwardPropagate[layer](this.outputs[layer], target);
                }
                else {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    output = this.backwardPropagate[layer](this.weights[layer + 1], this.outputs[layer], this.deltas[layer + 1]);
                }
                this.deltas[layer] = output.result;
                this.errors[layer] = output.error;
            }
        };
        this.errorCheckInterval = 100;
        this.gpu = new gpuBrowser.GPU({ mode: options.mode });
    }
    initialize() {
        super.initialize();
        this.buildRunInput();
        this.buildCalculateDeltas();
        this.buildGetChanges();
        this.buildChangeBiases();
        this.buildGetMSE();
    }
    setActivation() { }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    trainPattern(value, logErrorRate) {
        // forward propagate
        this.runInput(value.input);
        // back propagate
        this.calculateDeltas(value.output);
        this.adjustWeights();
        if (logErrorRate) {
            return this.getMSE(this.errors[this.outputLayer]);
        }
        return null;
    }
    calculateTrainingError(data) {
        let sum = new Float32Array([0]);
        for (let i = 0; i < data.length; ++i) {
            const prevSum = sum;
            const error = this.trainPattern(data[i], true);
            sum = this._addMSE(sum, error);
            release(error);
            release(prevSum);
        }
        const result = this._divideMSESum(data.length, sum);
        release(sum);
        return (result instanceof gpuBrowser.Texture
            ? result.toArray()
            : result)[0];
    }
    adjustWeights() {
        this.getChanges();
        this.changeBiases();
    }
    buildRunInput() {
        let weightedSum = null;
        switch (this.trainOpts.activation) {
            case 'sigmoid':
                weightedSum = weightedSumSigmoid;
                break;
            case 'relu':
                weightedSum = weightedSumRelu;
                break;
            case 'leaky-relu':
                weightedSum = weightedSumLeakyRelu;
                break;
            case 'tanh':
                weightedSum = weightedSumTanh;
                break;
            default:
                throw new Error(`Unknown activation ${this.trainOpts.activation}. Available activations are: 'sigmoid', 'relu', 'leaky-relu', 'tanh'`);
        }
        for (let layer = 1; layer <= this.outputLayer; layer++) {
            this.forwardPropagate[layer] = this.gpu.createKernel(weightedSum, {
                output: [this.sizes[layer]],
                pipeline: true,
                constants: {
                    size: this.sizes[layer - 1],
                },
                immutable: true,
            });
        }
        this.texturizeInputData = this.gpu.createKernel(function (value) {
            return value[this.thread.x];
        }, {
            output: [this.sizes[1]],
            pipeline: true,
            immutable: true,
        });
    }
    buildCalculateDeltas() {
        let calcDeltas;
        switch (this.trainOpts.activation) {
            case 'sigmoid':
                calcDeltas = calcDeltasSigmoid;
                break;
            case 'relu':
                calcDeltas = calcDeltasRelu;
                break;
            case 'leaky-relu':
                calcDeltas = calcDeltasLeakyRelu;
                break;
            case 'tanh':
                calcDeltas = calcDeltasTanh;
                break;
            default:
                throw new Error(`Unknown activation ${this.trainOpts.activation}. Available activations are: 'sigmoid', 'relu', 'leaky-relu', 'tanh'`);
        }
        calcDeltas = gpuBrowser.alias(gpuBrowser.utils.getMinifySafeName(() => calcDeltas), calcDeltas);
        this.gpu.addFunction(calcDeltas);
        for (let layer = this.outputLayer; layer > 0; layer--) {
            if (layer === this.outputLayer) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                this.backwardPropagate[this.outputLayer] = this.gpu.createKernelMap({
                    error: calcErrorOutput,
                }, function (outputs, targets) {
                    const output = outputs[this.thread.x];
                    const target = targets[this.thread.x];
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    return calcDeltas(calcErrorOutput(output, target), output);
                }, {
                    output: [this.sizes[this.outputLayer]],
                    pipeline: true,
                    immutable: true,
                });
            }
            else {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                this.backwardPropagate[layer] = this.gpu.createKernelMap({
                    error: calcError,
                }, function (nextWeights, outputs, nextDeltas) {
                    const output = outputs[this.thread.x];
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    return calcDeltas(calcError(this.thread.x, this.constants.size, nextWeights, nextDeltas), output);
                }, {
                    output: [this.sizes[layer]],
                    pipeline: true,
                    constants: {
                        size: this.sizes[layer + 1],
                    },
                    immutable: true,
                });
            }
        }
    }
    buildGetChanges() {
        for (let layer = 1; layer <= this.outputLayer; layer++) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            this.changesPropagate[layer] = this.gpu.createKernelMap({
                weights: addWeights,
                changes: calcChanges,
            }, function (previousOutputs, deltas, weights, previousChanges) {
                const change = calcChanges(this.constants.learningRate, this.constants.momentum, previousChanges[this.thread.y][this.thread.x], deltas[this.thread.y], previousOutputs[this.thread.x]);
                return addWeights(change, weights[this.thread.y][this.thread.x]);
            }, {
                output: [this.sizes[layer - 1], this.sizes[layer]],
                pipeline: true,
                constants: {
                    size: this.sizes[layer - 1],
                    learningRate: this.trainOpts.learningRate,
                    momentum: this.trainOpts.momentum,
                },
                immutable: true,
            });
        }
    }
    getChanges() {
        for (let layer = 1; layer <= this.outputLayer; layer++) {
            const weights = this.weights[layer];
            const changes = this.changes[layer];
            const output = this.changesPropagate[layer](this.outputs[layer - 1], this.deltas[layer], weights, changes);
            release(weights);
            release(changes);
            this.weights[layer] = output.weights;
            this.changes[layer] = output.changes;
            release(output.result);
        }
    }
    buildChangeBiases() {
        for (let layer = 1; layer <= this.outputLayer; layer++) {
            this.biasesPropagate[layer] = this.gpu.createKernel(addBiases, {
                output: [this.sizes[layer]],
                pipeline: true,
                constants: {
                    learningRate: this.trainOpts.learningRate,
                },
                immutable: true,
            });
        }
    }
    changeBiases() {
        for (let layer = 1; layer <= this.outputLayer; layer++) {
            const biases = this.biases[layer];
            this.biases[layer] = this.biasesPropagate[layer](biases, this.deltas[layer]);
            release(biases);
        }
    }
    buildGetMSE() {
        this.getMSE = this.gpu.createKernel(mse, {
            output: [1],
            constants: {
                size: this.sizes[this.outputLayer],
            },
            pipeline: true,
            immutable: true,
        });
        this._addMSE = this.gpu.createKernel(function (value1, value2) {
            return value1[0] + value2[0];
        }, {
            output: [1],
            pipeline: true,
            immutable: true,
        });
        this._divideMSESum = this.gpu.createKernel(function (length, mseSum) {
            const value = mseSum[0];
            if (value > 0) {
                return value / length;
            }
            return 0;
        }, {
            output: [1],
        });
    }
    run(input) {
        if (!this.isRunnable) {
            throw new Error('network not runnable');
        }
        let formattedInput;
        if (this.inputLookup) {
            formattedInput = lookup.toArray(this.inputLookup, input, this.inputLookupLength);
        }
        else {
            formattedInput = input;
        }
        this.validateInput(formattedInput);
        const outputTextures = this.runInput(formattedInput);
        const output = outputTextures instanceof gpuBrowser.Texture
            ? outputTextures.toArray()
            : outputTextures;
        if (this.outputLookup) {
            return lookup.toObject(this.outputLookup, output);
        }
        return output;
    }
    // @ts-expect-error the underlying network works as normal, but we are working on the GPU
    prepTraining(data, options = {}) {
        this.updateTrainingOptions(options);
        const preparedData = this.formatData(data);
        const endTime = Date.now() + this.trainOpts.timeout;
        const status = {
            error: 1,
            iterations: 0,
        };
        this.verifyIsInitialized(preparedData);
        const texturizeOutputData = this.gpu.createKernel(function (value) {
            return value[this.thread.x];
        }, {
            output: [preparedData[0].output.length],
            pipeline: true,
            immutable: true,
        });
        return {
            preparedData: preparedData.map((set) => ({
                input: this.texturizeInputData(set.input),
                output: texturizeOutputData(set.output),
            })),
            status,
            endTime,
        };
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    toFunction() {
        throw new Error(`${this.constructor.name}-toFunction is not yet implemented`);
    }
    toJSON() {
        var _a, _b;
        if (this.sizes === null) {
            this.initialize();
        }
        // use Array.from, keeping json small
        const jsonLayerWeights = this.weights.map((layerWeights) => {
            return (layerWeights instanceof gpuBrowser.Texture
                ? layerWeights.toArray()
                : layerWeights).map((layerWeights) => Array.from(layerWeights));
        });
        const jsonLayerBiases = this.biases.map((layerBiases) => Array.from(layerBiases instanceof gpuBrowser.Texture
            ? layerBiases.toArray()
            : layerBiases));
        const jsonLayers = [];
        for (let i = 0; i <= this.outputLayer; i++) {
            jsonLayers.push({
                weights: (_a = jsonLayerWeights[i]) !== null && _a !== void 0 ? _a : [],
                biases: (_b = jsonLayerBiases[i]) !== null && _b !== void 0 ? _b : [],
            });
        }
        return {
            type: 'NeuralNetworkGPU',
            sizes: [...this.sizes],
            layers: jsonLayers,
            inputLookup: this.inputLookup ? { ...this.inputLookup } : null,
            inputLookupLength: this.inputLookupLength,
            outputLookup: this.outputLookup ? { ...this.outputLookup } : null,
            outputLookupLength: this.outputLookupLength,
            options: { ...this.options },
            trainOpts: this.getTrainOptsJSON(),
        };
    }
}

class UntrainedNeuralNetworkError extends Error {
    constructor(neuralNetwork) {
        super(`Cannot run a ${neuralNetwork.constructor.name} before it is trained.`);
    }
}

/**
 * An autoencoder learns to compress input data down to relevant features and reconstruct input data from its compressed representation.
 */
class AE {
    constructor(options) {
        // Create default options for the autoencoder.
        options !== null && options !== void 0 ? options : (options = {});
        // Inherit the binary threshold of the parent autoencoder.
        options.binaryThresh;
        // Inherit the hidden layers of the parent autoencoder.
        options.hiddenLayers;
        // Define the denoiser subnet's input and output sizes.
        if (options.decodedSize)
            options.decodedSize;
        // Create the denoiser subnet of the autoencoder.
        this.denoiser = new NeuralNetworkGPU(options);
    }
    /**
     * Denoise input data, removing any anomalies from the data.
     * @param {DecodedData} input
     * @returns {DecodedData}
     */
    denoise(input) {
        // Run the input through the generic denoiser.
        // This isn't the best denoiser implementation, but it's efficient.
        // Efficiency is important here because training should focus on
        // optimizing for feature extraction as quickly as possible rather than
        // denoising and anomaly detection; there are other specialized topologies
        // better suited for these tasks anyways, many of which can be implemented
        // by using an autoencoder.
        return this.denoiser.run(input);
    }
    /**
     * Decode `EncodedData` into an approximation of its original form.
     *
     * @param {EncodedData} input
     * @returns {DecodedData}
     */
    decode(input) {
        // If the decoder has not been trained yet, throw an error.
        if (!this.decoder)
            throw new UntrainedNeuralNetworkError(this);
        // Decode the encoded input.
        return this.decoder.run(input);
    }
    /**
     * Encode data to extract features, reduce dimensionality, etc.
     *
     * @param {DecodedData} input
     * @returns {EncodedData}
     */
    encode(input) {
        // If the decoder has not been trained yet, throw an error.
        if (!this.denoiser)
            throw new UntrainedNeuralNetworkError(this);
        // Process the input.
        this.denoiser.run(input);
        // Get the auto-encoded input.
        let encodedInput = this
            .encodedLayer;
        // If the encoded input is a `Texture`, convert it into an `Array`.
        if (encodedInput instanceof gpuBrowser.Texture)
            encodedInput = encodedInput.toArray();
        else
            encodedInput = encodedInput.slice(0);
        // Return the encoded input.
        return encodedInput;
    }
    /**
     * Test whether or not a data sample likely contains anomalies.
     * If anomalies are likely present in the sample, returns `true`.
     * Otherwise, returns `false`.
     *
     * @param {DecodedData} input
     * @returns {boolean}
     */
    likelyIncludesAnomalies(input, anomalyThreshold = 0.2) {
        var _a;
        // Create the anomaly vector.
        const anomalies = [];
        // Attempt to denoise the input.
        const denoised = this.denoise(input);
        // Calculate the anomaly vector.
        for (let i = 0; i < ((_a = input.length) !== null && _a !== void 0 ? _a : 0); i++) {
            anomalies[i] = Math.abs(input[i] - denoised[i]);
        }
        // Calculate the sum of all anomalies within the vector.
        const sum = anomalies.reduce((previousValue, value) => previousValue + value);
        // Calculate the mean anomaly.
        const mean = sum / input.length;
        // Return whether or not the mean anomaly rate is greater than the anomaly threshold.
        return mean > anomalyThreshold;
    }
    /**
     * Train the auto encoder.
     *
     * @param {DecodedData[]} data
     * @param {Partial<INeuralNetworkTrainOptions>} options
     * @returns {INeuralNetworkState}
     */
    train(data, options) {
        const preprocessedData = [];
        for (const datum of data) {
            preprocessedData.push({ input: datum, output: datum });
        }
        const results = this.denoiser.train(preprocessedData, options);
        this.decoder = this.createDecoder();
        return results;
    }
    /**
     * Create a new decoder from the trained denoiser.
     *
     * @returns {NeuralNetworkGPU<EncodedData, DecodedData>}
     */
    createDecoder() {
        const json = this.denoiser.toJSON();
        const layers = [];
        const sizes = [];
        for (let i = this.encodedLayerIndex; i < this.denoiser.sizes.length; i++) {
            layers.push(json.layers[i]);
            sizes.push(json.sizes[i]);
        }
        json.layers = layers;
        json.sizes = sizes;
        json.options.inputSize = json.sizes[0];
        const decoder = new NeuralNetworkGPU().fromJSON(json);
        return decoder;
    }
    /**
     * Get the layer containing the encoded representation.
     */
    get encodedLayer() {
        return this.denoiser.outputs[this.encodedLayerIndex];
    }
    /**
     * Get the offset of the encoded layer.
     */
    get encodedLayerIndex() {
        return Math.round(this.denoiser.outputs.length * 0.5) - 1;
    }
}

class CrossValidate {
    constructor(initClassifier) {
        this.json = {
            avgs: {
                error: 0,
                iterations: 0,
                testTime: 0,
                trainTime: 0,
            },
            stats: {
                total: 0,
                testSize: 0,
                trainSize: 0,
            },
            sets: [],
        };
        this.initClassifier = initClassifier;
    }
    testPartition(trainOpts, trainSet, testSet) {
        const classifier = this.initClassifier();
        const beginTrain = Date.now();
        const trainingStats = classifier.train(trainSet, trainOpts);
        const beginTest = Date.now();
        const testStats = classifier.test(testSet);
        const endTest = Date.now();
        return {
            ...testStats,
            trainTime: beginTest - beginTrain,
            testTime: endTest - beginTest,
            iterations: trainingStats.iterations,
            error: trainingStats.error,
            total: testStats.total,
            network: classifier.toJSON(),
        };
    }
    /**
     * Randomize array element order in-place.
     * Using Durstenfeld shuffle algorithm.
     * source: http://stackoverflow.com/a/12646864/1324039
     */
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }
    train(data, trainOpts = {}, k = 4) {
        if (data.length < k) {
            throw new Error(`Training set size is too small for ${data.length} k folds of ${k}`);
        }
        this.shuffleArray(data);
        const size = data.length / k;
        const avgs = {
            trainTime: 0,
            testTime: 0,
            iterations: 0,
            error: 0,
        };
        const stats = {
            total: 0,
            testSize: 0,
            trainSize: 0,
        };
        const binaryStats = {
            total: 0,
            testSize: 0,
            trainSize: 0,
            truePos: 0,
            trueNeg: 0,
            falsePos: 0,
            falseNeg: 0,
            precision: 0,
            recall: 0,
            accuracy: 0,
        };
        const results = [];
        let isBinary = null;
        for (let i = 0; i < k; i++) {
            const dclone = data.slice(0);
            const testSet = dclone.splice(i * size, size);
            const trainSet = dclone;
            const result = this.testPartition(trainOpts, trainSet, testSet);
            if (isBinary === null) {
                isBinary =
                    result.hasOwnProperty('falseNeg') &&
                        result.hasOwnProperty('falsePos') &&
                        result.hasOwnProperty('trueNeg') &&
                        result.hasOwnProperty('truePos');
                if (isBinary) {
                    Object.assign(stats, binaryStats);
                }
            }
            avgs.iterations += result.iterations;
            avgs.testTime += result.testTime;
            avgs.trainTime += result.trainTime;
            avgs.error += result.error;
            stats.total += result.total;
            if (CrossValidate.isBinaryStats(stats) &&
                CrossValidate.isBinaryPartitionResults(result)) {
                stats.accuracy += result.accuracy;
                stats.falseNeg += result.falseNeg;
                stats.falsePos += result.falsePos;
                stats.precision += result.precision;
                stats.recall += result.recall;
                stats.trueNeg += result.trueNeg;
                stats.truePos += result.truePos;
            }
            results.push(result);
        }
        avgs.error /= k;
        avgs.iterations /= k;
        avgs.testTime /= k;
        avgs.trainTime /= k;
        if (CrossValidate.isBinaryStats(stats)) {
            stats.precision = stats.truePos / (stats.truePos + stats.falsePos);
            stats.recall = stats.truePos / (stats.truePos + stats.falseNeg);
            stats.accuracy = (stats.trueNeg + stats.truePos) / stats.total;
        }
        stats.testSize = size;
        stats.trainSize = data.length - size;
        this.json = {
            avgs: avgs,
            stats: stats,
            sets: results,
        };
        return this.json;
    }
    toNeuralNetwork() {
        return this.fromJSON(this.json);
    }
    toJSON() {
        return this.json;
    }
    fromJSON(crossValidateJson) {
        const winningJSON = crossValidateJson.sets.reduce((prev, cur) => (prev.error < cur.error ? prev : cur));
        return this.initClassifier().fromJSON(winningJSON.network);
    }
}
CrossValidate.isBinaryStats = (stats) => {
    return (stats.accuracy !== undefined);
};
CrossValidate.isBinaryResults = (stats) => stats.stats.accuracy !== undefined;
CrossValidate.isBinaryPartitionResults = (stats) => stats.accuracy !==
    undefined;

/**
 * 2D Mean Squared Error
 */
function mse2d(errors) {
    let sum = 0;
    for (let y = 0; y < this.constants.height; y++) {
        for (let x = 0; x < this.constants.width; x++) {
            sum += errors[y][x] ** 2;
        }
    }
    return sum / this.constants.length;
}
class MeanSquaredError {
    constructor({ width, height }) {
        this.calculate = makeKernel(mse2d, {
            output: [1],
            constants: {
                width,
                height,
                length: width * height,
            },
            immutable: true,
        });
        this.addAbsolute = makeKernel(function (prevError, prevLayerErrors) {
            return prevError[0] + Math.abs(prevLayerErrors[0][0]);
        }, {
            output: [1],
            immutable: true,
        });
        this.add = makeKernel(function (value1, value2) {
            return value1[0] + value2[0];
        }, {
            output: [1],
            immutable: true,
        });
        this.divide = makeKernel(function (length, mseSum) {
            const value = mseSum[0];
            if (value > 0) {
                return value / length;
            }
            return 0;
        }, {
            output: [1],
            immutable: true,
        });
    }
}

const baseLayerDefaultSettings = {
    width: 1,
    height: 1,
    depth: null,
    weights: null,
    deltas: null,
    praxis: null,
    praxisOpts: null,
    cleanupDeltas: true,
};
class BaseLayer {
    constructor(settings) {
        this.praxis = null;
        this.predictKernel = null;
        this.compareKernel = null;
        if (settings) {
            this.settings = { ...baseLayerDefaultSettings, ...settings };
        }
        else {
            this.settings = { ...baseLayerDefaultSettings };
        }
        this.setupPraxis();
    }
    get width() {
        var _a;
        return (_a = this.settings.width) !== null && _a !== void 0 ? _a : 0;
    }
    get height() {
        var _a;
        return (_a = this.settings.height) !== null && _a !== void 0 ? _a : 0;
    }
    get depth() {
        var _a;
        return (_a = this.settings.depth) !== null && _a !== void 0 ? _a : 0;
    }
    get weights() {
        return this.settings.weights;
    }
    set weights(weights) {
        this.settings.weights = weights;
        if (this.settings.cleanupDeltas && this.deltas) {
            clear(this.deltas);
        }
    }
    get deltas() {
        return this.settings.deltas;
    }
    set deltas(deltas) {
        this.settings.deltas = deltas;
    }
    get id() {
        var _a;
        return (_a = this.settings.id) !== null && _a !== void 0 ? _a : '';
    }
    set id(title) {
        this.settings.id = title;
    }
    setupPraxis() {
        const { initPraxis, praxis, praxisOpts } = this.settings;
        if (!this.praxis) {
            if (initPraxis) {
                if (praxisOpts) {
                    this.praxis = initPraxis(this, praxisOpts);
                }
                else {
                    this.praxis = initPraxis(this);
                }
            }
            else if (praxis) {
                this.praxis = praxis;
            }
        }
    }
    /*
    get weights() {
      return this._weights;
    }
  
    set weights(value) {
      if (value) {
        if (value.dimensions) {
          if (value.dimensions[0] !== this.width) {
            throw new Error(`${this.constructor.name}.weights being set with improper value width`);
          }
          if (value.dimensions[1] !== this.height) {
            throw new Error(`${this.constructor.name}.weights being set with improper value height`);
          }
        } else {
          if (value[0].length !== this.width) {
            throw new Error(`${this.constructor.name}.weights being set with improper value width`);
          }
          if (value.length !== this.height) {
            throw new Error(`${this.constructor.name}.weights being set with improper value height`);
          }
        }
      }
      this._weights = value;
    }
  
    get deltas() {
      return this._deltas;
    }
  
    set deltas(value) {
      if (value) {
        if (value.dimensions) {
          if (value.dimensions[0] !== this.width) {
            throw new Error(`${this.constructor.name}.deltas being set with improper value width`);
          }
          if (value.dimensions[1] !== this.height) {
            throw new Error(`${this.constructor.name}.deltas being set with improper value height`);
          }
        } else {
          if (value[0].length !== this.width) {
            throw new Error(`${this.constructor.name}.deltas being set with improper value width`);
          }
          if (value.length !== this.height) {
            throw new Error(`${this.constructor.name}.deltas being set with improper value height`);
          }
        }
      }
      this._deltas = value;
    } */
    validate() {
        if (Number.isNaN(this.height)) {
            throw new Error(`${this.constructor.name} layer height is not a number`);
        }
        if (Number.isNaN(this.width)) {
            throw new Error(`${this.constructor.name} layer width is not a number`);
        }
        if (this.height < 1) {
            throw new Error(`${this.constructor.name} layer height is less than 1`);
        }
        if (this.width < 1) {
            throw new Error(`${this.constructor.name} layer width is less than 1`);
        }
    }
    setupKernels(isTraining) { }
    reuseKernels(layer) {
        if (layer.width !== this.width) {
            throw new Error(`${this.constructor.name} kernel width mismatch ${layer.width} is not ${this.width}`);
        }
        if (layer.height !== this.height) {
            throw new Error(`${this.constructor.name} kernel width mismatch ${layer.height} is not ${this.height}`);
        }
        if (layer.hasOwnProperty('predictKernel') && layer.predictKernel !== null) {
            if (!layer.predictKernel.immutable) {
                throw new Error(`${layer.constructor.name}.predictKernel is not reusable, set kernel.immutable = true`);
            }
            this.predictKernel = layer.predictKernel;
        }
        if (layer.hasOwnProperty('compareKernel') && layer.compareKernel !== null) {
            if (!layer.compareKernel.immutable) {
                throw new Error(`${layer.constructor.name}.compareKernel is not reusable, set kernel.immutable = true`);
            }
            this.compareKernel = layer.compareKernel;
        }
        this.praxis = layer.praxis;
    }
    predict(inputs) { }
    compare(targetValues) { }
    learn(learningRate) { }
    toArray() {
        return Array.isArray(this.weights)
            ? this.weights
            : this.weights.toArray();
    }
    toJSON() {
        return BaseLayer.toJSON(this);
    }
    static toJSON(layer) {
        const { weights } = layer;
        return {
            width: layer.width,
            height: layer.height,
            depth: layer.depth,
            weights: toUntypedArray((weights && weights instanceof gpuBrowser.Texture
                ? weights.toArray()
                : weights)),
            type: layer.constructor.name,
            praxisOpts: layer.praxis ? layer.praxis.toJSON() : null,
        };
    }
}
function toUntypedArray(weights) {
    if (weights === null)
        return null;
    if (Array.isArray(weights)) {
        if (typeof weights[0] === 'number') {
            return weights;
        }
        else if (Array.isArray(weights[0]) && typeof weights[0][0] === 'number') {
            return weights;
        }
        else if (Array.isArray(weights[0][0]) &&
            typeof weights[0][0][0] === 'number') {
            return weights;
        }
        else if (weights[0] instanceof Float32Array) {
            const matrix = weights;
            return matrix.map((row) => {
                return Array.from(row);
            });
        }
        else if (weights[0][0] instanceof Float32Array) {
            const cube = weights;
            return cube.map((matrix) => {
                return matrix.map((row) => {
                    return Array.from(row);
                });
            });
        }
    }
    else if (weights) {
        return Array.from(weights);
    }
    throw new Error('unexpected value');
}

/**
 * Returns a 2D tensor(matrix) of zeros
 */
function zeros2D(width, height) {
    const result = new Array(height);
    for (let y = 0; y < height; y++) {
        result[y] = zeros$1(width);
    }
    return result;
}

/**
 * Returns a 3D tensor of arrays
 */
function zeros3D(width, height, depth) {
    const result = new Array(depth);
    for (let z = 0; z < depth; z++) {
        result[z] = zeros2D(width, height);
    }
    return result;
}

class Activation extends BaseLayer {
    constructor(inputLayer, settings) {
        super(settings);
        this.inputLayer = inputLayer;
        const { width, height, depth } = this;
        this.predictKernel = null;
        this.compareKernel = null;
        this.validate();
        if (depth > 0) {
            this.weights = zeros3D(width, height, depth);
            this.deltas = zeros3D(width, height, depth);
        }
        else if (height > 0) {
            this.weights = zeros2D(width, height);
            this.deltas = zeros2D(width, height);
        }
        this.setupPraxis();
    }
    get width() {
        return this.inputLayer.width;
    }
    get height() {
        return this.inputLayer.height;
    }
    get depth() {
        return this.inputLayer.depth;
    }
}

class Filter extends BaseLayer {
    constructor(settings, inputLayer) {
        super();
        this.settings = settings;
        this.inputLayer = inputLayer;
    }
    get width() {
        return this.inputLayer.width;
    }
    get height() {
        return this.inputLayer.height;
    }
    get depth() {
        return this.inputLayer.depth;
    }
    get filterCount() {
        return this.settings.filterCount;
    }
    get filterWidth() {
        return this.settings.filterWidth;
    }
    get filterHeight() {
        return this.settings.filterHeight;
    }
    get filters() {
        return this.settings.filters;
    }
    set filters(filters) {
        this.settings.filters = filters;
    }
    get filterDeltas() {
        return this.settings.filterDeltas;
    }
    set filterDeltas(filterDeltas) {
        this.settings.filterDeltas = filterDeltas;
    }
}

class Internal {
    constructor() {
        this.predictKernel = null;
        this.compareKernel = null;
        this.praxis = null;
    }
    get width() {
        return this.settings.width;
    }
    get height() {
        return this.settings.height;
    }
    get depth() {
        return this.settings.depth;
    }
    get weights() {
        return this.settings.weights;
    }
    set weights(weights) {
        this.settings.weights = weights;
    }
    get deltas() {
        return this.settings.deltas;
    }
    set deltas(deltas) {
        this.settings.deltas = deltas;
    }
    toJSON() {
        return BaseLayer.toJSON(this);
    }
}

class Modifier extends BaseLayer {
    constructor(inputLayer, settings) {
        super({
            ...settings,
            width: inputLayer.width,
            height: inputLayer.height,
            depth: inputLayer.depth,
        });
        this.inputLayer = inputLayer;
    }
    validate() {
        var _a;
        super.validate();
        if (this.width !== this.inputLayer.width) {
            throw new Error(`width of ${this.width} does not match inputLayer.width of ${this.inputLayer.width}`);
        }
        if (this.height !== this.inputLayer.height) {
            throw new Error(`height of ${this.height} does not match inputLayer.height of ${this.inputLayer.height}`);
        }
        if (this.depth !== ((_a = this.inputLayer.depth) !== null && _a !== void 0 ? _a : 0)) {
            throw new Error(`depth of ${this.depth} does not match inputLayer.depth of ${this.inputLayer.depth}`);
        }
    }
}

class Operator extends BaseLayer {
    constructor(inputLayer1, inputLayer2, settings) {
        super(settings);
        this.inputLayer1 = inputLayer1;
        this.inputLayer2 = inputLayer2;
        this.validate();
        this.weights = zeros2D(this.width, this.height);
        this.deltas = zeros2D(this.width, this.height);
        this.setupPraxis();
    }
}

function compare1D(weights, targetValues) {
    return weights[this.thread.y][this.thread.x] - targetValues[this.thread.x];
}
function compare2D$5(weights, targetValues) {
    return (weights[this.thread.y][this.thread.x] -
        targetValues[this.thread.y][this.thread.x]);
}
class Target extends BaseLayer {
    constructor(settings, inputLayer) {
        super(settings);
        this.inputLayer = inputLayer;
        this.validate();
        if (this.depth) {
            throw new Error('Target layer not implemented for depth');
        }
        else if (this.height) {
            this.weights = zeros2D(this.width, this.height);
            this.deltas = zeros2D(this.width, this.height);
            this.errors = zeros2D(this.width, this.height);
        }
        else {
            this.weights = zeros$1(this.width);
            this.deltas = zeros$1(this.width);
            this.errors = zeros$1(this.width);
        }
    }
    setupKernels() {
        if (this.width === 1) {
            this.compareKernel = makeKernel(compare1D, {
                output: [this.width, this.height],
                immutable: true,
            });
        }
        else {
            this.compareKernel = makeKernel(compare2D$5, {
                output: [this.width, this.height],
                immutable: true,
            });
        }
    }
    predict() {
        // TODO: should we clone here?
        // NOTE: this looks like it shouldn't be, but the weights are immutable, and this is where they are reused.
        release(this.weights);
        this.weights = clone(this.inputLayer.weights);
    }
    compare(targetValues) {
        // this is where weights attach to deltas
        // deltas will be zero on learn, so save it in error for comparing to mse later
        release(this.deltas);
        release(this.errors);
        release(this.inputLayer.deltas);
        this.deltas = this.compareKernel(this.weights, targetValues);
        this.inputLayer.deltas = clone(this.deltas);
        this.errors = clone(this.deltas);
    }
    setupPraxis() { }
}
function target(settings, inputLayer) {
    return new Target(settings, inputLayer);
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class InternalModel {
}
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class EntryPoint extends BaseLayer {
}
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class Model extends BaseLayer {
    learn(learningRate) {
        // TODO: do we need to release here?
        const { weights: oldWeights } = this;
        if (!this.praxis)
            throw new Error('this.praxis not defined');
        this.weights = this.praxis.run(this, learningRate);
        release(oldWeights);
    }
}

class BasePraxis {
    constructor(layerTemplate, settings = {}) {
        this.layerTemplate = layerTemplate;
        this.settings = { ...settings };
        this.kernel = null;
    }
    get width() {
        return this.layerTemplate.width;
    }
    get height() {
        return this.layerTemplate.height;
    }
    get depth() {
        return this.layerTemplate.depth;
    }
    setupKernels() { }
    reuseKernels(praxis) {
        if (praxis.width !== this.width) {
            throw new Error(`${this.constructor.name} kernel width mismatch ${praxis.width} is not ${this.width}`);
        }
        if (praxis.height !== this.height) {
            throw new Error(`${this.constructor.name} kernel width mismatch ${praxis.height} is not ${this.height}`);
        }
        if (praxis.hasOwnProperty('kernel')) {
            this.kernel = praxis.kernel;
        }
    }
    toJSON() {
        return { ...this.settings };
    }
}

function update$2(weights, deltas) {
    return (weights[this.thread.y][this.thread.x] +
        this.constants.learningRate * deltas[this.thread.y][this.thread.x]);
}
const defaultSettings$1 = {
    learningRate: 0.3,
};
class ArthurDeviationBiases extends BasePraxis {
    constructor(layer, settings) {
        super(layer);
        this.settings = { ...defaultSettings$1, ...settings };
        this.kernel = null;
    }
    run(layer) {
        return this.kernel(layer.weights, layer.deltas);
    }
    setupKernels() {
        var _a;
        this.kernel = makeKernel(update$2, {
            output: [this.width, this.height],
            constants: {
                learningRate: (_a = this.settings.learningRate) !== null && _a !== void 0 ? _a : 0.01,
            },
        });
    }
}
function arthurDeviationBiases(layer, settings) {
    return new ArthurDeviationBiases(layer, settings);
}

function updateChange(value) {
    return value;
}
function update$1(changes, weights, incomingWeights, inputDeltas) {
    const lastChange = changes[this.thread.y][this.thread.x];
    const inputDelta = inputDeltas[this.thread.y][0];
    const weight = weights[this.thread.y][this.thread.x];
    const incoming = incomingWeights[this.thread.x][0];
    const change = this.constants.learningRate * inputDelta * incoming +
        this.constants.momentum * lastChange;
    return weight + change;
}
const defaultSettings = {
    learningRate: 0.3,
    momentum: 0.1,
    weightsLayer: null,
    incomingLayer: null,
    deltaLayer: null,
};
class ArthurDeviationWeights extends BasePraxis {
    constructor(layer, settings) {
        super(layer);
        this.kernelMap = null;
        this.settings = { ...defaultSettings, ...settings };
        this.changes = zeros2D(layer.width, layer.height);
    }
    get learningRate() {
        return this.settings.learningRate;
    }
    get momentum() {
        return this.settings.momentum;
    }
    get weightsLayer() {
        return this.settings.weightsLayer;
    }
    set weightsLayer(layer) {
        this.settings.weightsLayer = layer;
    }
    get deltaLayer() {
        return this.settings.deltaLayer;
    }
    set deltaLayer(layer) {
        this.settings.deltaLayer = layer;
    }
    get incomingLayer() {
        return this.settings.incomingLayer;
    }
    set incomingLayer(layer) {
        this.settings.incomingLayer = layer;
    }
    run() {
        const output = this.kernelMap(this.changes, this.weightsLayer.weights, this.incomingLayer.weights, this.deltaLayer.deltas);
        this.changes = output.changes;
        return output.result;
    }
    setupKernels() {
        this.kernelMap = makeKernelMap({
            changes: updateChange,
        }, update$1, {
            output: [this.width, this.height],
            constants: {
                learningRate: this.learningRate,
                momentum: this.momentum,
            },
        });
    }
}
function arthurDeviationWeights(layer, settings) {
    return new ArthurDeviationWeights(layer, settings);
}

function getMomentum(delta, decay, previousMomentum) {
    return previousMomentum * decay + (1 - decay) * delta * delta;
}
function clipByValue(value, max, min) {
    if (value > max) {
        return max;
    }
    if (value < min) {
        return min;
    }
    return value;
}
/**
 * @description Momentum Root Mean Square Propagation Function
 */
function update(weights, deltas, previousMomenta) {
    const delta = deltas[this.thread.y][this.thread.x];
    const clippedDelta = clipByValue(delta, this.constants.clipValue, -this.constants.clipValue);
    const weight = weights[this.thread.y][this.thread.x];
    const previousMomentum = previousMomenta[this.thread.y][this.thread.x];
    const momentum = getMomentum(delta, this.constants.decayRate, previousMomentum);
    return (weight +
        (-this.constants.learningRate * clippedDelta) /
            Math.sqrt(momentum + this.constants.smoothEps) -
        this.constants.regularizationStrength * weight);
}
const defaults$7 = {
    decayRate: 0.999,
    regularizationStrength: 0.000001,
    learningRate: 0.01,
    smoothEps: 1e-8,
    clipValue: 5,
};
class MomentumRootMeanSquaredPropagation extends BasePraxis {
    constructor(layerTemplate, settings = {}) {
        super(layerTemplate);
        this.kernelMap = null;
        this.settings = { ...defaults$7, ...settings };
        this.momenta = zeros2D(layerTemplate.width, layerTemplate.height);
    }
    get clipValue() {
        return this.settings.clipValue;
    }
    get decayRate() {
        return this.settings.decayRate;
    }
    get learningRate() {
        return this.settings.learningRate;
    }
    get regularizationStrength() {
        return this.settings.regularizationStrength;
    }
    get smoothEps() {
        return this.settings.smoothEps;
    }
    run(layer) {
        const { momenta, result } = this.kernelMap(layer.weights, layer.deltas, this.momenta);
        release(this.momenta);
        this.momenta = momenta;
        return result;
    }
    setupKernels() {
        this.kernelMap = makeKernelMap({
            momenta: getMomentum,
        }, update, {
            output: [this.width, this.height],
            constants: {
                clipValue: this.clipValue,
                decayRate: this.decayRate,
                learningRate: this.learningRate,
                regularizationStrength: this.regularizationStrength,
                smoothEps: this.smoothEps,
            },
            functions: [clipByValue],
            immutable: true,
        });
    }
}
function momentumRootMeanSquaredPropagation(layer, settings) {
    return new MomentumRootMeanSquaredPropagation(layer, settings);
}
/**
 * @description Mathematician friendly name of MomentumRootMeanSquaredPropagation class. For those that are not mere mortals
 */
const MRmsProp = MomentumRootMeanSquaredPropagation;
const mRmsProp = momentumRootMeanSquaredPropagation;

var index = /*#__PURE__*/Object.freeze({
    __proto__: null,
    ArthurDeviationBiases: ArthurDeviationBiases,
    arthurDeviationBiases: arthurDeviationBiases,
    ArthurDeviationWeights: ArthurDeviationWeights,
    arthurDeviationWeights: arthurDeviationWeights,
    MomentumRootMeanSquaredPropagation: MomentumRootMeanSquaredPropagation,
    momentumRootMeanSquaredPropagation: momentumRootMeanSquaredPropagation,
    MRmsProp: MRmsProp,
    mRmsProp: mRmsProp
});

function traverseLayersFrom(layer, cb) {
    if (layer.hasOwnProperty('inputLayer')) {
        traverseLayersFrom(layer.inputLayer, cb);
    }
    else {
        if (layer.hasOwnProperty('inputLayer1')) {
            traverseLayersFrom(layer.inputLayer1, cb);
        }
        if (layer.hasOwnProperty('inputLayer2')) {
            traverseLayersFrom(layer.inputLayer2, cb);
        }
    }
    cb(layer);
}

function flattenLayers(layers) {
    const result = layers.slice(0);
    for (let i = 0; i < result.length; i++) {
        let offset = 0;
        traverseLayersFrom(result[i], (layer) => {
            if (!result.includes(layer)) {
                result.splice(i + offset, 0, layer);
                offset++;
            }
        });
    }
    return result;
}

function checkSameSize(layer1, layer2) {
    if (layer1.width !== layer2.width) {
        throw new Error(`Layer width mismatch of ${layer1.width} and ${layer2.width}`);
    }
    if (layer1.height !== layer2.height) {
        throw new Error(`Layer height mismatch of ${layer1.height} and ${layer2.height}`);
    }
}

function predict$8(inputWeights1, inputWeights2) {
    return (inputWeights1[this.thread.y][this.thread.x] +
        inputWeights2[this.thread.y][this.thread.x]);
}
class Add extends Operator {
    get width() {
        return this.inputLayer1.width;
    }
    get height() {
        return this.inputLayer1.height;
    }
    get depth() {
        return this.inputLayer1.depth;
    }
    validate() {
        super.validate();
        checkSameSize(this.inputLayer1, this.inputLayer2);
    }
    setupKernels() {
        this.predictKernel = makeKernel(predict$8, {
            output: [this.width, this.height],
            immutable: true,
        });
    }
    predict() {
        release(this.weights);
        this.weights = this.predictKernel(this.inputLayer1.weights, this.inputLayer2.weights);
    }
    compare() {
        // TODO: Do we need release and clone here?
        release(this.inputLayer1.deltas);
        release(this.inputLayer2.deltas);
        this.inputLayer1.deltas = clone(this.deltas);
        this.inputLayer2.deltas = clone(this.deltas);
    }
}
function add$1(inputLayer1, inputLayer2, settings) {
    return new Add(inputLayer1, inputLayer2, settings);
}

const defaults$6 = {
    ...baseLayerDefaultSettings,
    std: null,
};
class Random extends Model {
    constructor(settings) {
        super();
        this.settings = { ...defaults$6, ...settings };
        this.setupPraxis();
        this.validate();
        if (!this.weights) {
            this.weights = randos2D(this.width, this.height, settings.std);
        }
        if (!this.deltas) {
            this.deltas = zeros2D(this.width, this.height);
        }
    }
    predict() { }
    compare() { }
}
function random(settings) {
    return new Random(settings);
}

function predict$7(weights1, weights2) {
    let sum = 0;
    for (let i = 0; i < this.constants.size; i++) {
        sum += weights1[this.thread.y][i] * weights2[i][this.thread.x];
    }
    return sum;
}
function compareFromX(deltas, inputDeltas, inputWeights) {
    let sum = inputDeltas[this.thread.y][this.thread.x];
    for (let i = 0; i < this.constants.size; i++) {
        sum += deltas[this.thread.y][i] * inputWeights[this.thread.x][i];
    }
    return sum;
}
function compareFromY(deltas, inputDeltas, inputWeights) {
    let sum = inputDeltas[this.thread.y][this.thread.x];
    for (let i = 0; i < this.constants.size; i++) {
        sum += deltas[i][this.thread.x] * inputWeights[i][this.thread.y];
    }
    return sum;
}
class Multiply extends Operator {
    constructor() {
        super(...arguments);
        this.compareKernel1 = null;
        this.compareKernel2 = null;
    }
    get width() {
        return this.inputLayer2.width;
    }
    set width(width) {
        throw new Error('Cannot set width on Multiply');
    }
    get height() {
        return this.inputLayer1.height;
    }
    set height(height) {
        throw new Error('Cannot set height on Multiply');
    }
    get depth() {
        return this.inputLayer1.depth;
    }
    set depth(depth) {
        throw new Error('Cannot set depth on Multiply');
    }
    validate() {
        super.validate();
        if (this.inputLayer1.width !== this.inputLayer2.height) {
            throw new Error(`Layer width mismatch of ${this.inputLayer1.width} and ${this.inputLayer2.height}`);
        }
    }
    setupKernels() {
        this.predictKernel = makeKernel(predict$7, {
            output: [this.width, this.height],
            constants: {
                size: this.inputLayer2.height,
            },
            immutable: true,
        });
        this.compareKernel1 = makeKernel(compareFromX, {
            output: [this.inputLayer1.width, this.inputLayer1.height],
            constants: {
                size: this.inputLayer2.width,
            },
            immutable: true,
        });
        this.compareKernel2 = makeKernel(compareFromY, {
            output: [this.inputLayer2.width, this.inputLayer2.height],
            constants: {
                size: this.inputLayer1.height,
            },
            immutable: true,
        });
    }
    reuseKernels(layer) {
        super.reuseKernels(layer);
        this.compareKernel1 = layer.compareKernel1;
        this.compareKernel2 = layer.compareKernel2;
    }
    predict() {
        release(this.weights);
        if (!this.predictKernel)
            throw new Error('this.predictKernel is not set');
        this.weights = this.predictKernel(this.inputLayer1.weights, this.inputLayer2.weights);
    }
    compare() {
        if (!this.compareKernel1)
            throw new Error('this.compareKernel1 not set');
        if (!this.compareKernel2)
            throw new Error('this.compareKernel2 not set');
        const inputLayer1Deltas = this.inputLayer1.deltas;
        const inputLayer2Deltas = this.inputLayer2.deltas;
        const newDeltas1 = this.compareKernel1(this.deltas, this.inputLayer1.deltas, this.inputLayer2.weights);
        const newDeltas2 = this.compareKernel2(this.deltas, this.inputLayer2.deltas, this.inputLayer1.weights);
        this.inputLayer2.deltas = newDeltas2;
        this.inputLayer1.deltas = newDeltas1;
        release(inputLayer1Deltas);
        release(inputLayer2Deltas);
    }
    setupPraxis() { }
    toJSON() {
        return {
            ...super.toJSON(),
            width: this.width,
            height: this.height,
        };
    }
}
function multiply$1(inputLayer1, inputLayer2, settings) {
    return new Multiply(inputLayer1, inputLayer2, settings);
}

function predict2D$4(inputs) {
    return 1 / (1 + Math.exp(-inputs[this.thread.y][this.thread.x]));
}
function predict3D$5(inputs) {
    return (1 / (1 + Math.exp(-inputs[this.thread.z][this.thread.y][this.thread.x])));
}
function compare2D$4(weights, deltas) {
    const weight = weights[this.thread.y][this.thread.x];
    const delta = deltas[this.thread.y][this.thread.x];
    return weight * (1 - weight) * delta;
}
function compare3D$4(weights, deltas) {
    const weight = weights[this.thread.z][this.thread.y][this.thread.x];
    const delta = deltas[this.thread.z][this.thread.y][this.thread.x];
    return weight * (1 - weight) * delta;
}
class Sigmoid extends Activation {
    setupKernels() {
        if (this.depth > 0) {
            this.predictKernel = makeKernel(predict3D$5, {
                output: [this.width, this.height, this.depth],
                functions: [activate$2],
                immutable: true,
            });
            this.compareKernel = makeKernel(compare3D$4, {
                output: [this.width, this.height, this.depth],
                functions: [measure$2],
                immutable: true,
            });
        }
        else {
            this.predictKernel = makeKernel(predict2D$4, {
                output: [this.width, this.height],
                functions: [activate$2],
                immutable: true,
            });
            this.compareKernel = makeKernel(compare2D$4, {
                output: [this.width, this.height],
                functions: [measure$2],
                immutable: true,
            });
        }
    }
    predict() {
        release(this.weights);
        this.weights = this.predictKernel(this.inputLayer.weights);
    }
    compare() {
        release(this.inputLayer.deltas);
        this.inputLayer.deltas = this.compareKernel(this.weights, this.deltas);
    }
    learn(learningRate) { }
}
function sigmoid$1(inputLayer, settings) {
    return new Sigmoid(inputLayer, settings);
}

function arthurFeedForward(settings, inputLayer) {
    const { height } = settings;
    function initWeightsPraxis(layerTemplate, settings) {
        const praxis = arthurDeviationWeights(layerTemplate, settings);
        praxis.setupKernels();
        return praxis;
    }
    function initBiasesPraxis(layerTemplate, settings) {
        const praxis = arthurDeviationBiases(layerTemplate, settings);
        praxis.setupKernels();
        return praxis;
    }
    const weightsLayer = random({
        id: 'weights',
        height,
        width: inputLayer.height,
        initPraxis: initWeightsPraxis,
    });
    const biasesLayer = random({
        id: 'biases',
        height,
        initPraxis: initBiasesPraxis,
    });
    const multiplyLayer = multiply$1(weightsLayer, inputLayer);
    const addLayer = add$1(multiplyLayer, biasesLayer);
    const sigmoidLayer = sigmoid$1(addLayer);
    const weightsPraxis = weightsLayer.praxis;
    weightsPraxis.weightsLayer = weightsLayer;
    weightsPraxis.incomingLayer = inputLayer;
    weightsPraxis.deltaLayer = sigmoidLayer;
    return sigmoidLayer;
}

function getStride(settings, defaults) {
    if (typeof settings.stride === 'number') {
        return { strideX: settings.stride, strideY: settings.stride };
    }
    else {
        let strideX = defaults.stride;
        let strideY = defaults.stride;
        if (typeof settings.strideX === 'number') {
            strideX = settings.strideX;
        }
        if (typeof settings.strideY === 'number') {
            strideY = settings.strideY;
        }
        return { strideX, strideY };
    }
}
function getPadding(settings, defaults) {
    if (typeof settings.padding === 'number') {
        return { paddingX: settings.padding, paddingY: settings.padding };
    }
    else {
        let paddingX = defaults.padding;
        let paddingY = defaults.padding;
        if (typeof settings.paddingX === 'number') {
            paddingX = settings.paddingX;
        }
        if (typeof settings.paddingY === 'number') {
            paddingY = settings.paddingY;
        }
        return { paddingX, paddingY };
    }
}

/**
 * Returns an array of a given size with each element filled with a single value
 */
function values(size, value) {
    return new Float32Array(size).fill(value);
}

function predict$6(inputs, filters, biases) {
    const startFilterX = this.constants.paddingX - this.thread.x * this.constants.strideX;
    const startInputX = this.thread.x * this.constants.strideX - this.constants.paddingX;
    const endFilterX = Math.min(this.constants.filterWidth, startFilterX + this.constants.inputWidth);
    const startFilterY = this.constants.paddingY - this.thread.y * this.constants.strideY;
    const startInputY = this.thread.y * this.constants.strideY - this.constants.paddingY;
    const endFilterY = Math.min(this.constants.filterHeight, startFilterY + this.constants.inputHeight);
    let sum = 0;
    for (let z = 0; z < this.constants.inputDepth; z++) {
        for (let filterY = Math.max(0, startFilterY), inputY = Math.max(0, startInputY); filterY < endFilterY; filterY++, inputY++) {
            for (let filterX = Math.max(0, startFilterX), inputX = Math.max(0, startInputX); filterX < endFilterX; filterX++, inputX++) {
                sum += filters[z][filterY][filterX] * inputs[z][inputY][inputX];
            }
        }
    }
    return sum + biases[this.thread.z];
}
function compareFilterDeltas$1(filterDeltas, inputs, deltas) {
    const startDeltaX = Math.max(0, Math.ceil((this.constants.paddingX - this.thread.x) / this.constants.strideX));
    const startInputX = startDeltaX * this.constants.strideX +
        this.thread.x -
        this.constants.paddingX;
    const endDeltaX = Math.min(this.constants.deltaWidth, Math.floor((this.constants.inputWidth -
        1 -
        this.thread.x +
        this.constants.paddingX) /
        this.constants.strideX) + 1);
    const startDeltaY = Math.max(0, Math.ceil((this.constants.paddingY - this.thread.y) / this.constants.strideY));
    const startInputY = startDeltaY * this.constants.strideY +
        this.thread.y -
        this.constants.paddingY;
    const endDeltaY = Math.min(this.constants.deltaHeight, Math.floor((this.constants.inputHeight -
        1 -
        this.thread.y +
        this.constants.paddingY) /
        this.constants.strideY) + 1);
    let sum = filterDeltas[this.thread.z][this.thread.y][this.thread.x];
    for (let deltaY = startDeltaY, inputY = startInputY; deltaY < endDeltaY; deltaY++, inputY += this.constants.strideY) {
        for (let deltaX = startDeltaX, inputX = startInputX; deltaX < endDeltaX; deltaX++, inputX += this.constants.strideX) {
            sum +=
                inputs[this.thread.z][inputY][inputX] *
                    deltas[this.constants.deltaZ][deltaY][deltaX];
        }
    }
    return sum;
}
function compareInputDeltas$1(inputDeltas, filters, deltas) {
    const x = this.thread.x + this.constants.paddingX;
    const startDeltaX = x < this.constants.filterWidth
        ? 0
        : Math.floor((x - this.constants.filterWidth + this.constants.strideX) /
            this.constants.strideX);
    const startFilterX = x - startDeltaX * this.constants.strideX;
    const endDeltaX = Math.min(startDeltaX + Math.floor(startFilterX / this.constants.strideX) + 1, this.constants.deltaWidth);
    const y = this.thread.y + this.constants.paddingY;
    const startDeltaY = y < this.constants.filterHeight
        ? 0
        : Math.floor((y - this.constants.filterHeight + this.constants.strideY) /
            this.constants.strideY);
    const startFilterY = y - startDeltaY * this.constants.strideY;
    const endDeltaY = Math.min(startDeltaY + Math.floor(startFilterY / this.constants.strideY) + 1, this.constants.deltaHeight);
    let sum = inputDeltas[this.thread.z][this.thread.y][this.thread.x];
    let deltaY = startDeltaY;
    for (let filterY = startFilterY; deltaY < endDeltaY; filterY -= this.constants.strideY, deltaY++) {
        let deltaX = startDeltaX;
        for (let filterX = startFilterX; deltaX < endDeltaX; filterX -= this.constants.strideX, deltaX++) {
            sum +=
                filters[this.thread.z][filterY][filterX] *
                    deltas[this.constants.deltaZ][deltaY][deltaX];
        }
    }
    return sum;
}
function compareBiases$1(biasDeltas, deltas) {
    let sum = 0;
    for (let y = 0; y < this.constants.deltaHeight; y++) {
        for (let x = 0; x < this.constants.deltaWidth; x++) {
            sum += deltas[this.thread.z][y][x];
        }
    }
    return biasDeltas[this.thread.z][this.thread.y][this.thread.x] + sum;
}
const defaults$5 = {
    stride: 0,
    padding: 0,
    bias: 0.1,
    filterCount: 1,
    filterWidth: 0,
    filterHeight: 0,
};
class Convolution extends Filter {
    constructor(settings, inputLayer) {
        var _a, _b, _c;
        super(settings, inputLayer);
        this.compareFilterDeltasKernel = null;
        this.compareInputDeltasKernel = null;
        this.compareBiasesKernel = null;
        this.settings = {
            ...defaults$5,
            ...settings,
            ...getPadding(settings, defaults$5),
            ...getStride(settings, defaults$5),
        };
        this.weights = (_a = settings.weights) !== null && _a !== void 0 ? _a : randos3D(this.width, this.height, this.depth);
        this.deltas = zeros3D(this.width, this.height, this.depth);
        this.biases = values(this.depth, this.bias);
        this.biasDeltas = (_b = settings.biasDeltas) !== null && _b !== void 0 ? _b : randos(this.depth);
        this.filters = (_c = settings.filters) !== null && _c !== void 0 ? _c : randos3D(this.filterWidth, this.filterHeight, this.filterCount);
        this.filterDeltas = zeros3D(this.filterWidth, this.filterHeight, this.filterCount);
        this.validate();
    }
    get strideX() {
        return this.settings.strideX;
    }
    get strideY() {
        return this.settings.strideY;
    }
    get paddingX() {
        return this.settings.paddingX;
    }
    get paddingY() {
        return this.settings.paddingX;
    }
    get width() {
        return Math.floor((this.inputLayer.width + this.paddingX * 2 - this.filterWidth) /
            this.strideX +
            1);
    }
    get height() {
        return Math.floor((this.inputLayer.height + this.paddingY * 2 - this.filterHeight) /
            this.strideY +
            1);
    }
    get bias() {
        return this.settings.bias;
    }
    get depth() {
        return this.filterCount;
    }
    get biases() {
        return this.settings.biases;
    }
    set biases(biases) {
        this.settings.biases = biases;
    }
    get biasDeltas() {
        return this.settings.biasDeltas;
    }
    set biasDeltas(weights) {
        this.settings.biasDeltas = weights;
    }
    get filters() {
        return this.settings.filters;
    }
    set filters(filters) {
        this.settings.filters = filters;
    }
    get filterDeltas() {
        return this.settings.filterDeltas;
    }
    set filterDeltas(filterDeltas) {
        this.settings.filterDeltas = filterDeltas;
    }
    setupKernels() {
        this.predictKernel = makeKernel(predict$6, {
            constants: {
                inputWidth: this.inputLayer.width,
                inputHeight: this.inputLayer.height,
                inputDepth: this.inputLayer.depth,
                strideX: this.strideX,
                strideY: this.strideY,
                paddingX: this.paddingX,
                paddingY: this.paddingY,
                filterWidth: this.filterWidth,
                filterHeight: this.filterHeight,
            },
            output: [this.width, this.height, this.depth],
            immutable: true,
        });
        this.compareFilterDeltasKernel = makeKernel(compareFilterDeltas$1, {
            constants: {
                deltaWidth: this.width,
                deltaHeight: this.height,
                deltaZ: this.depth,
                inputWidth: this.inputLayer.width,
                inputHeight: this.inputLayer.height,
                inputDepth: this.inputLayer.depth,
                strideX: this.strideX,
                strideY: this.strideY,
                paddingX: this.paddingX,
                paddingY: this.paddingY,
                filterWidth: this.filterWidth,
                filterHeight: this.filterHeight,
            },
            output: [this.width, this.height, this.depth],
            immutable: true,
        });
        this.compareInputDeltasKernel = makeKernel(compareInputDeltas$1, {
            constants: {
                deltaWidth: this.width,
                deltaHeight: this.height,
                deltaZ: this.depth,
                strideX: this.strideX,
                strideY: this.strideY,
                paddingX: this.paddingX,
                paddingY: this.paddingY,
                filterWidth: this.filterWidth,
                filterHeight: this.filterHeight,
                filterCount: this.filterCount,
            },
            output: [
                this.inputLayer.width,
                this.inputLayer.height,
                this.inputLayer.depth,
            ],
            immutable: true,
        });
        this.compareBiasesKernel = makeKernel(compareBiases$1, {
            output: [1, 1, this.depth],
            constants: {
                deltaWidth: this.width,
                deltaHeight: this.height,
            },
            immutable: true,
        });
    }
    predict() {
        this.weights = this.predictKernel(this.inputLayer.weights, this.filters, this.biases);
    }
    compare() {
        const { filterDeltas, biasDeltas } = this;
        this.filterDeltas = this.compareFilterDeltasKernel(filterDeltas, this.inputLayer.weights, this.deltas);
        release(filterDeltas);
        this.biasDeltas = this.compareBiasesKernel(biasDeltas, this.deltas);
        release(biasDeltas);
        release(this.deltas);
        this.deltas = this.compareInputDeltasKernel(this.filters, this.inputLayer.deltas);
        release(this.inputLayer.deltas);
        // TODO: do we need to clone here?
        this.inputLayer.deltas = clone(this.deltas);
    }
    learn(learningRate) {
        // TODO: handle filters
        // TODO: do we need to release here?
        const { weights: oldWeights } = this;
        this.weights = this.praxis.run(this, learningRate);
        release(oldWeights);
    }
}
function convolution(settings, inputLayer) {
    return new Convolution(settings, inputLayer);
}

function setDropout(dropout) {
    return dropout;
}
function trainingPredict(inputs) {
    if (setDropout(Math.random()) < this.constants.probability) {
        return 0;
    }
    return inputs[this.thread.y][this.thread.x];
}
function predict$5(inputs) {
    return inputs[this.thread.y][this.thread.x] * this.constants.probability;
}
function compare$3(dropouts, deltas) {
    if (dropouts[this.thread.y][this.thread.x] === 0) {
        return 0;
    }
    return deltas[this.thread.y][this.thread.x];
}
const dropoutDefaults = {
    ...baseLayerDefaultSettings,
    probability: 0.5,
};
class Dropout extends Filter {
    constructor(inputLayer, settings) {
        super(settings, inputLayer);
        this.predictKernelMap = null;
        this.settings = { ...dropoutDefaults, ...settings };
        this.dropouts = null;
        this.validate();
    }
    setupKernels(isTraining) {
        const output = [this.width, this.height];
        if (isTraining) {
            this.predictKernelMap = makeKernelMap({ dropouts: setDropout }, trainingPredict, {
                output,
                immutable: true,
            });
            this.compareKernel = makeKernel(compare$3, { output, immutable: true });
        }
        else {
            this.predictKernelMap = makeKernelMap({}, predict$5, { output, immutable: true });
        }
    }
    predict() {
        release(this.weights);
        if (this.dropouts) {
            release(this.dropouts);
        }
        const { result, dropouts } = this
            .predictKernelMap(this.inputLayer.weights);
        this.weights = result;
        this.dropouts = dropouts;
    }
    compare() {
        release(this.deltas);
        this.deltas = this.compareKernel(this.dropouts, this.inputLayer.deltas);
    }
}
function dropout(inputLayer, settings) {
    return new Dropout(inputLayer, settings);
}

function feedForward(settings, input) {
    const { height, praxisOpts = null } = settings;
    const weights = random({
        id: 'weights',
        height,
        width: input.height,
        praxisOpts,
    });
    const biases = random({ id: 'biases', height, praxisOpts });
    return sigmoid$1(add$1(multiply$1(weights, input, { praxisOpts }), biases, { praxisOpts }), { praxisOpts });
}

function predict$4(inputs, filters, biases) {
    let output = 0;
    let i = 0;
    for (let y = 0; y < this.constants.inputHeight; y++) {
        for (let x = 0; x < this.constants.inputWidth; x++) {
            output += inputs[y][x] * filters[this.thread.x][i];
            i++;
        }
    }
    return output + biases[this.thread.x];
}
function predict3D$4(inputs, filters, biases) {
    let output = 0;
    let i = 0;
    for (let z = 0; z < this.constants.inputDepth; z++) {
        for (let y = 0; y < this.constants.inputHeight; y++) {
            for (let x = 0; x < this.constants.inputWidth; x++) {
                output += inputs[z][y][x] * filters[this.thread.x][i];
                i++;
            }
        }
    }
    return output + biases[this.thread.x];
}
function compareInputDeltas(inputDeltas, deltas, filters) {
    let sum = 0;
    const filterX = this.thread.x + this.thread.y * this.output.x;
    for (let filterY = 0; filterY < this.constants.filterCount; filterY++) {
        sum += filters[filterY][filterX] * deltas[0][filterY];
    }
    return sum + inputDeltas[this.thread.y][this.thread.x];
}
function compareInputDeltas3D(inputDeltas, deltas, filters) {
    let sum = 0;
    const filterX = this.thread.x + this.thread.y * this.output.x;
    for (let filterY = 0; filterY < this.constants.filterCount; filterY++) {
        sum += filters[filterY][filterX] * deltas[0][filterY];
    }
    return sum + inputDeltas[this.thread.z][this.thread.y][this.thread.x];
}
function compareBiases(biases, deltas) {
    return biases[this.thread.x] + deltas[this.thread.y][this.thread.x];
}
function compareFilterDeltas(filterDeltas, inputWeights, deltas) {
    return (filterDeltas[this.thread.y][this.thread.x] +
        inputWeights[this.thread.y][this.thread.x] *
            deltas[this.constants.deltaY][this.constants.deltaX]);
}
function compareFilterDeltas3D(filterDeltas, inputWeights, deltas) {
    const inputZ = Math.floor(this.thread.x / (this.constants.inputWidth * this.constants.inputHeight));
    const inputY = Math.floor((this.thread.x -
        inputZ * this.constants.inputWidth * this.constants.inputHeight) /
        this.constants.inputWidth);
    const inputX = this.thread.x -
        this.constants.inputWidth * (inputY + this.constants.inputHeight * inputZ);
    return (filterDeltas[this.thread.y][this.thread.x] +
        inputWeights[inputZ][inputY][inputX] * deltas[0][this.thread.y]);
}
class FullyConnected extends Filter {
    constructor(settings, inputLayer) {
        super(settings, inputLayer);
        this.compareFilterDeltasKernel = null;
        this.compareInputDeltasKernel = null;
        this.compareBiasesKernel = null;
        this.settings = { ...settings };
        this.validate();
        const connectionCount = inputLayer.width * inputLayer.height * inputLayer.depth;
        this.biases = values(this.height, this.bias);
        this.biasDeltas = zeros$1(this.height);
        this.filters = randos2D(connectionCount, this.height);
        this.filterDeltas = zeros2D(connectionCount, this.height);
        if (this.depth > 0) {
            this.weights = randos3D(this.width, this.height, this.depth);
            this.deltas = zeros3D(this.width, this.height, this.depth);
        }
        else if (this.height > 0) {
            this.weights = randos2D(this.width, this.height);
            this.deltas = zeros2D(this.width, this.height);
        }
    }
    get bias() {
        return this.settings.bias;
    }
    get biases() {
        return this.settings.biases;
    }
    set biases(biases) {
        this.settings.biases = biases;
    }
    get biasDeltas() {
        return this.settings.biases;
    }
    set biasDeltas(biasDeltas) {
        this.settings.biasDeltas = biasDeltas;
    }
    validate() {
        super.validate();
        if (this.depth > 0)
            throw new Error('depth not supported');
    }
    setupKernels() {
        const { inputLayer } = this;
        const connectionCount = inputLayer.width * inputLayer.height * inputLayer.depth;
        if (inputLayer.depth > 0) {
            this.predictKernel = makeKernel(predict3D$4, {
                output: [this.width, this.height],
                constants: {
                    inputHeight: inputLayer.height,
                    inputWidth: inputLayer.width,
                    inputDepth: inputLayer.depth,
                },
            });
            this.compareFilterDeltasKernel = makeKernel(compareFilterDeltas3D, {
                output: [connectionCount, this.height],
                constants: {
                    deltaX: 0,
                    deltaY: 0,
                    inputWidth: inputLayer.width,
                    inputHeight: inputLayer.height,
                },
                immutable: true,
            });
            this.compareInputDeltasKernel = makeKernel(compareInputDeltas3D, {
                output: [inputLayer.width, inputLayer.height, inputLayer.depth],
                constants: {
                    filterCount: this.height,
                },
                immutable: true,
            });
        }
        else {
            this.predictKernel = makeKernel(predict$4, {
                output: [this.width, this.height],
                constants: {
                    inputHeight: inputLayer.height,
                    inputWidth: inputLayer.width,
                },
            });
            this.compareFilterDeltasKernel = makeKernel(compareFilterDeltas, {
                output: [connectionCount, this.height],
                constants: {
                    deltaX: 0,
                    deltaY: 0,
                    inputWidth: inputLayer.width,
                    inputHeight: inputLayer.height,
                },
            });
            this.compareInputDeltasKernel = makeKernel(compareInputDeltas, {
                output: [inputLayer.width, inputLayer.height],
                constants: {
                    filterCount: this.height,
                },
            });
        }
        this.compareBiasesKernel = makeKernel(compareBiases, {
            output: [this.width, this.height],
        });
    }
    predict() {
        this.weights = this.predictKernel(this.inputLayer.weights, this.filters, this.biases);
    }
    compare() {
        const inputLayerDeltas = this.inputLayer.deltas;
        this.inputLayer.deltas = this
            .compareInputDeltasKernel(inputLayerDeltas, this.deltas, this.filters);
        release(inputLayerDeltas);
        const { biasDeltas, filterDeltas } = this;
        // TODO: handle biasDeltas learn
        this.biasDeltas = this.compareBiasesKernel(this.biases, this.deltas);
        // TODO: handle filterDeltas learn
        this.filterDeltas = this.compareFilterDeltasKernel(filterDeltas, this.inputLayer.weights, this.deltas);
        release(biasDeltas);
        release(filterDeltas);
    }
}
function fullyConnected(settings, inputLayer) {
    return new FullyConnected(settings, inputLayer);
}

function predict$3(weights) {
    return -weights[this.thread.y][this.thread.x];
}
class Negative extends Modifier {
    constructor(inputLayer, settings) {
        super(inputLayer, settings);
        this.validate();
    }
    setupKernels() {
        this.predictKernel = makeKernel(predict$3, {
            output: [this.width, this.height],
        });
    }
    predict() {
        this.weights = this.predictKernel(this.inputLayer.weights);
    }
}
function negative(inputLayer, settings) {
    return new Negative(inputLayer, settings);
}

function predict$2(inputLayerWeights1, inputLayerWeights2) {
    return (inputLayerWeights1[this.thread.y][this.thread.x] *
        inputLayerWeights2[this.thread.y][this.thread.x]);
}
function compare$2(weights, deltas) {
    return (weights[this.thread.y][this.thread.x] * deltas[this.thread.y][this.thread.x]);
}
class MultiplyElement extends Operator {
    get width() {
        return this.inputLayer1.width;
    }
    get height() {
        return this.inputLayer1.height;
    }
    get depth() {
        return this.inputLayer1.depth;
    }
    validate() {
        super.validate();
        checkSameSize(this.inputLayer1, this.inputLayer2);
    }
    setupKernels() {
        this.predictKernel = makeKernel(predict$2, {
            output: [this.width, this.height],
            immutable: true,
        });
        this.compareKernel = makeKernel(compare$2, {
            output: [this.width, this.height],
            immutable: true,
        });
    }
    predict() {
        release(this.weights);
        this.weights = this.predictKernel(this.inputLayer1.weights, this.inputLayer2.weights);
    }
    compare() {
        release(this.inputLayer1.deltas);
        release(this.inputLayer2.deltas);
        this.inputLayer1.deltas = this.compareKernel(this.inputLayer2.weights, this.deltas);
        this.inputLayer2.deltas = this.compareKernel(this.inputLayer1.weights, this.deltas);
    }
}
function multiplyElement$1(inputLayer1, inputLayer2, settings) {
    return new MultiplyElement(inputLayer1, inputLayer2, settings);
}

function ones$1(size) {
    return new Float32Array(size).fill(1);
}
function ones2D(width, height) {
    const result = new Array(height);
    for (let y = 0; y < height; y++) {
        result[y] = ones$1(width);
    }
    return result;
}

class Ones extends Model {
    constructor(settings) {
        super(settings);
        this.validate();
        this.weights = ones2D(this.width, this.height);
        this.deltas = zeros2D(this.width, this.height);
    }
}
function ones(settings) {
    return new Ones(settings);
}

function predict2D$3(inputs) {
    return activate$1(inputs[this.thread.y][this.thread.x]);
}
function predict3D$3(inputs) {
    return activate$1(inputs[this.thread.z][this.thread.y][this.thread.x]);
}
function compare2D$3(weights, errors) {
    return measure$1(weights[this.thread.y][this.thread.x], errors[this.thread.y][this.thread.x]);
}
function compare3D$3(weights, errors) {
    return measure$1(weights[this.thread.z][this.thread.y][this.thread.x], errors[this.thread.z][this.thread.y][this.thread.x]);
}
class Tanh extends Activation {
    setupKernels() {
        if (this.depth > 0) {
            this.predictKernel = makeKernel(predict3D$3, {
                output: [this.width, this.height, this.depth],
                functions: [activate$1],
                immutable: true,
            });
            this.compareKernel = makeKernel(compare3D$3, {
                output: [this.width, this.height, this.depth],
                functions: [measure$1],
                immutable: true,
            });
        }
        else {
            this.predictKernel = makeKernel(predict2D$3, {
                output: [this.width, this.height],
                functions: [activate$1],
                immutable: true,
            });
            this.compareKernel = makeKernel(compare2D$3, {
                output: [this.width, this.height],
                functions: [measure$1],
                immutable: true,
            });
        }
    }
    predict() {
        release(this.weights);
        this.weights = this.predictKernel(this.inputLayer.weights);
    }
    compare() {
        release(this.inputLayer.deltas);
        this.inputLayer.deltas = this.compareKernel(this.weights, this.deltas);
    }
}
function tanh$1(inputLayer, settings) {
    return new Tanh(inputLayer, settings);
}

class Zeros extends Model {
    constructor(settings) {
        super(settings);
        this.validate();
        this.weights = zeros2D(this.width, this.height);
        this.deltas = zeros2D(this.width, this.height);
    }
    predict() {
        // throw new Error(`${this.constructor.name}-predict is not yet implemented`)
    }
    compare() {
        // throw new Error(`${this.constructor.name}-compare is not yet implemented`)
    }
}
function zeros(settings) {
    return new Zeros(settings);
}

function gru(settings, recurrentInput, input) {
    const { height } = settings;
    const updateGateWeights = random({ height, width: input.height });
    const updateGatePeepholes = random({ width: height, height });
    const updateGateBias = zeros({ height });
    const updateGate = sigmoid$1(add$1(add$1(multiply$1(updateGateWeights, input), multiply$1(updateGatePeepholes, recurrentInput)), updateGateBias));
    const resetGateWeights = random({ height, width: input.height });
    const resetGatePeepholes = random({ width: height, height });
    const resetGateBias = zeros({ height });
    const resetGate = sigmoid$1(add$1(add$1(multiply$1(resetGateWeights, input), multiply$1(resetGatePeepholes, recurrentInput)), resetGateBias));
    const cellWeights = random({ height, width: input.height });
    const cellPeepholes = random({ width: height, height });
    const cellBias = zeros({ height });
    const cell = tanh$1(add$1(add$1(multiply$1(cellWeights, input), multiply$1(cellPeepholes, multiplyElement$1(resetGate, recurrentInput))), cellBias));
    // compute hidden state as gated, saturated cell activations
    // negate updateGate
    return add$1(multiplyElement$1(add$1(ones({ width: updateGate.width, height: updateGate.height }), negative(updateGate)), cell), multiplyElement$1(recurrentInput, updateGate));
}

const defaults$4 = {
    weights: null,
};
class Input extends EntryPoint {
    constructor(settings) {
        super({ ...defaults$4, ...settings });
        this.reshapeInput = null;
        this.validate();
        this.reshapeInput = null;
        this.deltas = zeros2D(this.width, this.height);
    }
    setupKernels() {
        if (this.width === 1) {
            this.predict = this.predict1D;
            this.reshapeInput = makeKernel(function (value) {
                return value[this.thread.y];
            }, {
                output: [1, this.height],
                immutable: true,
            });
        }
    }
    reuseKernels(layer) {
        // super.reuseKernels(layer);
        this.reshapeInput = layer.reshapeInput;
    }
    predict(inputs) {
        if ((Array.isArray(inputs) || inputs instanceof Float32Array) &&
            typeof inputs[0] === 'number' &&
            inputs.length === this.height * this.width) {
            release(this.weights);
            this.weights = kernelInput(inputs, [this.width, this.height]);
        }
        else if (Array.isArray(inputs) &&
            inputs.length === this.height &&
            (Array.isArray(inputs[0]) || inputs[0] instanceof Float32Array) &&
            inputs[0].length === this.width) {
            this.weights = clone(inputs);
        }
        else {
            throw new Error('Inputs are not of sized correctly');
        }
    }
    predict1D(inputs) {
        if (this.weights)
            release(this.weights);
        if (this.reshapeInput) {
            this.weights = this.reshapeInput(inputs);
        }
        else {
            this.weights = inputs;
        }
    }
    compare() {
        // throw new Error(`${this.constructor.name}-compare is not yet implemented`)
    }
    learn() { }
}
function input(settings) {
    return new Input(settings);
}

function predict2D$2(inputs) {
    return activate(inputs[this.thread.y][this.thread.x]);
}
function predict3D$2(inputs) {
    return activate(inputs[this.thread.z][this.thread.y][this.thread.x]);
}
function compare2D$2(weights, deltas) {
    return measure(weights[this.thread.y][this.thread.x], deltas[this.thread.y][this.thread.x]);
}
function compare3D$2(weights, deltas) {
    return measure(weights[this.thread.z][this.thread.y][this.thread.x], deltas[this.thread.z][this.thread.y][this.thread.x]);
}
class LeakyRelu extends Activation {
    setupKernels() {
        const { width, height, depth } = this.inputLayer;
        if (this.depth > 0) {
            this.predictKernel = makeKernel(predict3D$2, {
                output: [width, height, depth],
                functions: [activate],
                immutable: true,
            });
            this.compareKernel = makeKernel(compare3D$2, {
                output: [width, height, depth],
                functions: [measure],
                immutable: true,
            });
        }
        else {
            this.predictKernel = makeKernel(predict2D$2, {
                output: [width, height],
                functions: [activate],
                immutable: true,
            });
            this.compareKernel = makeKernel(compare2D$2, {
                output: [width, height],
                functions: [measure],
                immutable: true,
            });
        }
    }
    predict() {
        release(this.weights);
        this.weights = this.predictKernel(this.inputLayer.weights);
    }
    compare() {
        const { deltas } = this;
        this.deltas = this.compareKernel(this.weights, deltas);
        release(deltas);
    }
}
function leakyRelu(inputLayer, settings) {
    return new LeakyRelu(inputLayer, settings);
}

function lstmCell(settings, input, recurrentInput) {
    const { height } = settings;
    if (typeof height !== 'number') {
        throw new Error('no settings.height given');
    }
    if (recurrentInput.setDimensions) {
        recurrentInput.setDimensions(1, height);
    }
    const inputGateWeights = random({
        width: input.height,
        height,
        std: 0.08,
        id: 'inputGateWeights',
    });
    const inputGatePeepholes = random({
        width: height,
        height,
        std: 0.08,
        id: 'inputGatePeepholes',
    });
    const inputGateBias = zeros({ width: 1, height, id: 'inputGateBias' });
    const inputGate = sigmoid$1(add$1(add$1(multiply$1(inputGateWeights, input), multiply$1(inputGatePeepholes, recurrentInput)), inputGateBias), { id: 'inputGate' });
    const forgetGateWeights = random({
        width: input.height,
        height,
        std: 0.08,
        id: 'forgetGateWeights',
    });
    const forgetGatePeepholes = random({
        width: height,
        height,
        std: 0.08,
        id: 'forgetGatePeepholes',
    });
    const forgetGateBias = zeros({ width: 1, height, id: 'forgetGateBias' });
    const forgetGate = sigmoid$1(add$1(add$1(multiply$1(forgetGateWeights, input), multiply$1(forgetGatePeepholes, recurrentInput)), forgetGateBias), { id: 'forgetGate' });
    const outputGateWeights = random({
        width: input.height,
        height,
        std: 0.08,
        id: 'outputGateWeights',
    });
    const outputGatePeepholes = random({
        width: height,
        height,
        std: 0.08,
        id: 'outputGatePeepholes',
    });
    const outputGateBias = zeros({ width: 1, height, id: 'outputGateBias' });
    const outputGate = sigmoid$1(add$1(add$1(multiply$1(outputGateWeights, input), multiply$1(outputGatePeepholes, recurrentInput)), outputGateBias), { id: 'outputGate' });
    const memoryWeights = random({
        width: input.height,
        height,
        std: 0.08,
        id: 'memoryWeights',
    });
    const memoryPeepholes = random({
        width: height,
        height,
        std: 0.08,
        id: 'memoryPeepholes',
    });
    const memoryBias = zeros({ width: 1, height, id: 'memoryBias' });
    const memory = tanh$1(add$1(add$1(multiply$1(memoryWeights, input), multiply$1(memoryPeepholes, recurrentInput)), memoryBias), { id: 'memory' });
    // compute new cell activation
    const retainCell = multiplyElement$1(forgetGate, recurrentInput, {
        id: 'retainCell',
    }); // what do we keep from cell
    const writeCell = multiplyElement$1(inputGate, memory, { id: 'writeCell' }); // what do we write to cell
    const cell = add$1(retainCell, writeCell, { id: 'cell' }); // new cell contents
    // compute hidden state as gated, saturated cell activations
    return multiplyElement$1(outputGate, tanh$1(cell), { id: 'activations' });
}

function output(settings, inputLayer) {
    const { height } = settings;
    const outputGate = random({
        height,
        width: inputLayer.height,
        id: 'outputGate',
        std: 0.08,
    });
    const output = random({ height, id: 'output', std: 0.08 });
    const outputGateConnector = multiply$1(outputGate, inputLayer, {
        id: 'outputGateConnected',
    });
    return target({ id: 'target', ...settings }, add$1(outputGateConnector, output));
}

function setSwitchY(value) {
    return value;
}
function setSwitchX(value) {
    return value;
}
function predict$1(inputs) {
    // Ends are exclusive, that is if end=4, the last item is 3
    const unclippedStartInputX = this.thread.x * this.constants.strideX - this.constants.paddingX;
    const unclippedStartInputY = this.thread.y * this.constants.strideY - this.constants.paddingY;
    const unclippedEndInputX = unclippedStartInputX + this.constants.filterWidth;
    const unclippedEndInputY = unclippedStartInputY + this.constants.filterHeight;
    const startInputX = Math.max(unclippedStartInputX, 0);
    const startInputY = Math.max(unclippedStartInputY, 0);
    const endInputX = Math.min(unclippedEndInputX, this.constants.inputWidth);
    const endInputY = Math.min(unclippedEndInputY, this.constants.inputHeight);
    let largestValue = inputs[this.thread.z][startInputY][startInputX];
    for (let y = startInputY; y < endInputY; y++) {
        for (let x = startInputX; x < endInputX; x++) {
            const input = inputs[this.thread.z][y][x];
            if (input > largestValue) {
                largestValue = input;
            }
        }
    }
    return largestValue;
}
function compare$1(deltas, switchX, switchY) {
    const xCenter = this.thread.x + 0.5;
    const yCenter = this.thread.y + 0.5;
    const invStrideX = 1 / this.constants.strideX;
    const invStrideY = 1 / this.constants.strideY;
    const startSourceX = Math.max(0, Math.ceil((xCenter - this.constants.filterWidth + this.constants.paddingX) *
        invStrideX));
    const startSourceY = Math.max(0, Math.ceil((yCenter - this.constants.filterHeight + this.constants.paddingY) *
        invStrideY));
    const endSourceX = Math.min(Math.ceil((xCenter + this.constants.paddingX) * invStrideX), this.constants.outputWidth);
    const endSourceY = Math.min(Math.ceil((yCenter + this.constants.paddingY) * invStrideY), this.constants.outputHeight);
    let result = 0;
    for (let backY = startSourceY; backY < endSourceY; backY++) {
        for (let backX = startSourceX; backX < endSourceX; backX++) {
            const switchXValue = switchX[backY][backX];
            const switchYValue = switchY[backY][backX];
            if (Math.abs(switchXValue - this.thread.x) < 0.1 &&
                Math.abs(switchYValue - this.thread.y) < 0.1) {
                result += deltas[backY][backX];
            }
        }
    }
    return result;
}
const defaults$3 = {
    padding: 0,
    stride: 0,
    filterWidth: 0,
    filterHeight: 0,
    filterCount: 0,
};
class Pool extends Filter {
    constructor(settings, inputLayer) {
        super(settings, inputLayer);
        this.predictKernelMap = null;
        this.settings = {
            ...settings,
            ...getStride(settings, defaults$3),
            ...getPadding(settings, defaults$3),
        };
        this.weights = randos3D(this.width, this.height, this.depth);
        this.deltas = zeros3D(this.width, this.height, this.depth);
        this.validate();
    }
    get strideX() {
        return this.settings.strideX;
    }
    get strideY() {
        return this.settings.strideY;
    }
    get paddingX() {
        return this.settings.paddingX;
    }
    get paddingY() {
        return this.settings.paddingY;
    }
    get width() {
        // Using floor prefers to pad less (or use negative padding) on the right
        // using ceil prefers to pad more
        return Math.ceil((this.inputLayer.width + this.paddingX * 2 - this.filterWidth) /
            this.strideX +
            1);
    }
    get height() {
        // Using floor prefers to pad less (or use negative padding) on the bottom
        // using ceil prefers to pad more
        return Math.floor((this.inputLayer.height + this.paddingY * 2 - this.filterHeight) /
            this.strideY +
            1);
    }
    get depth() {
        return this.settings.filterCount;
    }
    get filterCount() {
        // TODO: handle 1 depth?
        return this.settings.filterCount;
    }
    get switchX() {
        return this.settings.switchX;
    }
    set switchX(switchX) {
        this.settings.switchX = switchX;
    }
    get switchY() {
        return this.settings.switchY;
    }
    set switchY(switchY) {
        this.settings.switchY = switchY;
    }
    setupKernels() {
        this.predictKernelMap = makeKernelMap({
            switchX: setSwitchX,
            switchY: setSwitchY,
        }, predict$1, {
            output: [this.width, this.height, this.depth],
            constants: {
                inputWidth: this.inputLayer.width,
                inputHeight: this.inputLayer.height,
                paddingX: this.paddingX,
                paddingY: this.paddingY,
                filterHeight: this.filterHeight,
                filterWidth: this.filterWidth,
                strideX: this.strideX,
                strideY: this.strideY,
            },
        });
        this.compareKernel = makeKernel(compare$1, {
            output: [
                this.inputLayer.width,
                this.inputLayer.height,
                this.inputLayer.depth,
            ],
            constants: {
                inputWidth: this.inputLayer.width,
                inputHeight: this.inputLayer.height,
                outputWidth: this.width,
                outputHeight: this.height,
                filterWidth: this.filterWidth,
                filterHeight: this.filterHeight,
                paddingX: this.paddingX,
                paddingY: this.paddingY,
                strideX: this.strideX,
                strideY: this.strideY,
            },
        });
    }
    predict() {
        const { result: weights, switchX, switchY } = this
            .predictKernelMap(this.inputLayer.weights);
        this.switchX = switchX;
        this.switchY = switchY;
        this.weights = weights;
    }
    compare() {
        // debugger;
        // const depth = this.inputLayer.deltas.length;
        // const height = this.inputLayer.deltas[0].length;
        // const width = this.inputLayer.deltas[0][0].length;
        // const type = typeof this.inputLayer.deltas[0][0][0];
        const inputLayerDeltas = this.inputLayer.deltas;
        this.inputLayer.deltas = this.compareKernel(this.deltas, this.switchX, this.switchY);
        release(inputLayerDeltas);
        // debugger;
        // if (depth !== this.inputLayer.deltas.length) debugger;
        // if (height !== this.inputLayer.deltas[0].length) debugger;
        // if (width !== this.inputLayer.deltas[0][0].length) debugger;
        // if (type !== typeof this.inputLayer.deltas[0][0][0]) debugger;
    }
}
function pool(settings, inputLayer) {
    return new Pool(settings, inputLayer);
}

class RecurrentInput extends Internal {
    constructor(recurrentInput) {
        super();
        this.praxis = null;
        this.predictKernel = null;
        this.compareKernel = null;
        this.settings = {};
        this.recurrentInput = recurrentInput;
        this.validate();
    }
    get width() {
        return this.recurrentInput.width;
    }
    get height() {
        return this.recurrentInput.height;
    }
    get depth() {
        return this.recurrentInput.depth;
    }
    get deltas() {
        return this.recurrentInput.deltas;
    }
    set deltas(deltas) {
        const recurrentInputDeltas = this.recurrentInput.deltas;
        this.recurrentInput.deltas = deltas;
        release(recurrentInputDeltas);
    }
    get weights() {
        return this.recurrentInput.weights;
    }
    set weights(weights) {
        const recurrentInputWeights = this.recurrentInput.weights;
        this.recurrentInput.weights = weights;
        release(recurrentInputWeights);
    }
    validate() {
        BaseLayer.prototype.validate.call(this);
        if (this.width !== this.recurrentInput.width) {
            throw new Error(`${this.constructor.name} layer width ${this.width} and ${this.recurrentInput.constructor.name} width (${this.recurrentInput.width}) are not same`);
        }
        if (this.height !== this.recurrentInput.height) {
            throw new Error(`${this.constructor.name} layer height ${this.height} and ${this.recurrentInput.constructor.name} width (${this.recurrentInput.height}) are not same`);
        }
    }
    setDimensions(width, height) {
        this.recurrentInput.width = width;
        this.recurrentInput.height = height;
    }
    predict() {
        // throw new Error(`${this.constructor.name}-predict is not yet implemented`)
    }
    compare() {
        // throw new Error(`${this.constructor.name}-compare is not yet implemented`)
    }
    learn() {
        // throw new Error(`${this.constructor.name}-learn is not yet implemented`)
    }
    setupKernels() {
        // throw new Error(
        //   `${this.constructor.name}-setupKernels is not yet implemented`
        // )
    }
    reuseKernels() {
        // throw new Error(
        //   `${this.constructor.name}-reuseKernels is not yet implemented`
        // )
    }
}

class RecurrentZeros extends Internal {
    constructor(settings) {
        super();
        this.praxis = null;
        this.settings = {};
        this.predictKernel = null;
        this.compareKernel = null;
        if (settings) {
            this.settings = { ...settings };
        }
    }
    setDimensions(width, height) {
        this.praxis = null;
        this.settings = {
            ...this.settings,
            width,
            height,
            weights: zeros2D(width, height),
            deltas: zeros2D(width, height),
        };
    }
    setupKernels() {
        // throw new Error(
        //   `${this.constructor.name}-setupKernels is not yet implemented`
        // )
    }
    reuseKernels() {
        // throw new Error(
        //   `${this.constructor.name}-reuseKernels is not yet implemented`
        // )
    }
    predict() {
        // throw new Error(`${this.constructor.name}-predict is not yet implemented`)
    }
    compare() {
        // throw new Error(`${this.constructor.name}-compare is not yet implemented`)
    }
    learn(learningRate) {
        const { weights: oldWeights } = this;
        this.weights = this.praxis.run(this, learningRate);
        // this.deltas = deltas;
        release(oldWeights);
    }
}
function recurrentZeros() {
    return new RecurrentZeros();
}

function predict2D$1(inputs) {
    return activate$3(inputs[this.thread.y][this.thread.x]);
}
function compare2D$1(weights, deltas) {
    return measure$3(weights[this.thread.y][this.thread.x], deltas[this.thread.y][this.thread.x]);
}
function predict3D$1(inputs) {
    return activate$3(inputs[this.thread.z][this.thread.y][this.thread.x]);
}
function compare3D$1(weights, deltas) {
    return measure$3(weights[this.thread.z][this.thread.y][this.thread.x], deltas[this.thread.z][this.thread.y][this.thread.x]);
}
class Relu extends Activation {
    setupKernels() {
        const { width, height, depth } = this.inputLayer;
        if (depth > 0) {
            this.predictKernel = makeKernel(predict3D$1, {
                output: [width, height, depth],
                functions: [activate$3],
                immutable: true,
            });
            this.compareKernel = makeKernel(compare3D$1, {
                output: [width, height, depth],
                functions: [measure$3],
                immutable: true,
            });
        }
        else {
            this.predictKernel = makeKernel(predict2D$1, {
                output: [width, height],
                functions: [activate$3],
                immutable: true,
            });
            this.compareKernel = makeKernel(compare2D$1, {
                output: [width, height],
                functions: [measure$3],
                immutable: true,
            });
        }
    }
    predict() {
        release(this.weights);
        this.weights = this.predictKernel(this.inputLayer.weights);
    }
    compare() {
        release(this.inputLayer.deltas);
        this.inputLayer.deltas = this.compareKernel(this.weights, this.deltas);
    }
}
function relu$1(inputLayer, settings) {
    return new Relu(inputLayer, settings);
}

function rnnCell(settings, input, recurrentInput) {
    const { height } = settings;
    if (typeof height !== 'number')
        throw new Error('height not set');
    if (recurrentInput.setDimensions) {
        recurrentInput.setDimensions(1, height);
    }
    // wxh
    const weight = random({
        id: 'weight',
        height,
        width: input.height,
        std: 0.08,
    });
    // whh
    const transition = random({
        id: 'transition',
        height,
        width: height,
        std: 0.08,
    });
    // bhh
    const bias = zeros({ id: 'bias', height });
    return relu$1(add$1(add$1(multiply$1(weight, input), multiply$1(transition, recurrentInput)), bias));
}

class Regression extends BaseLayer {
    constructor(settings, inputLayer) {
        super(settings);
        this.inputLayer = inputLayer;
        this.validate();
    }
    predict() {
        release(this.weights);
        this.weights = clone(this.inputLayer.weights);
    }
    learn() {
        // throw new Error(`${this.constructor.name}-learn is not yet implemented`)
    }
}
// TODO: handle `loss += 0.5*dy*dy;` total and sum in learn
function regression(settings, inputLayer) {
    return new Regression(settings, inputLayer);
}

function getMaxValue2D(inputs) {
    let maxInput = -Infinity;
    for (let y = 0; y < this.constants.inputHeight; y++) {
        for (let x = 0; x < this.constants.inputWidth; x++) {
            const input = inputs[y][x];
            if (input > maxInput) {
                maxInput = input;
            }
        }
    }
    return maxInput;
}
function getMaxValue3D(inputs) {
    let maxInput = -Infinity;
    for (let z = 0; z < this.constants.inputDepth; z++) {
        for (let y = 0; y < this.constants.inputHeight; y++) {
            for (let x = 0; x < this.constants.inputWidth; x++) {
                const input = inputs[z][y][x];
                if (input > maxInput) {
                    maxInput = input;
                }
            }
        }
    }
    return maxInput;
}
function getSum2D(inputs) {
    let sum = 0;
    for (let y = 0; y < this.constants.inputHeight; y++) {
        for (let x = 0; x < this.constants.inputWidth; x++) {
            sum += inputs[y][x];
        }
    }
    return sum;
}
function getSum3D(inputs) {
    let sum = 0;
    for (let z = 0; z < this.constants.inputDepth; z++) {
        for (let y = 0; y < this.constants.inputHeight; y++) {
            for (let x = 0; x < this.constants.inputWidth; x++) {
                sum += inputs[z][y][x];
            }
        }
    }
    return sum;
}
function getExponentials(inputs, maxInput) {
    return Math.exp(inputs[this.thread.x] - maxInput[0]);
}
function getExponentials3D(inputs, maxInput) {
    return Math.exp(inputs[this.thread.z][this.thread.y][this.thread.x] - maxInput[0]);
}
function predict2D(exponentials, exponentialsSum) {
    return exponentials[this.thread.y][this.thread.x] / exponentialsSum[0];
}
function predict3D(exponentials, exponentialsSum) {
    return (exponentials[this.thread.z][this.thread.y][this.thread.x] /
        exponentialsSum[0]);
}
function compare2D(target, exponentials) {
    let indicator = 0;
    const index = this.thread.x + this.thread.y * this.output.x;
    if (index === target) {
        indicator = 1;
    }
    return -(indicator - exponentials[this.thread.y][this.thread.x]);
}
function compare3D(target, exponentials) {
    let indicator = 0;
    const index = this.thread.x +
        this.thread.y * this.output.x +
        this.thread.z * this.output.x * this.output.y;
    if (index === target) {
        indicator = 1;
    }
    return -(indicator - exponentials[this.thread.z][this.thread.y][this.thread.x]);
}
// TODO: handle: `return -Math.log(this.es[y]);` in learn
class SoftMax extends Modifier {
    constructor(inputLayer, settings) {
        super(inputLayer, settings);
        this.errors = null;
        this.getExponentialsKernel = null;
        this.getMaxValueKernel = null;
        this.getSumKernel = null;
        this.validate();
        if (this.depth > 0) {
            this.weights = randos3D(this.width, this.height, this.depth);
            this.deltas = zeros3D(this.width, this.height, this.depth);
        }
        else if (this.height > 0) {
            this.weights = randos2D(this.width, this.height);
            this.deltas = zeros2D(this.width, this.height);
        }
        else {
            this.weights = randos(this.width);
            this.deltas = zeros$1(this.width);
        }
    }
    setupKernels() {
        const { width, height, depth } = this;
        if (depth > 0) {
            this.getExponentialsKernel = makeKernel(getExponentials3D, {
                output: [width, height, depth],
            });
            this.getMaxValueKernel = makeKernel(getMaxValue3D, {
                output: [1, 1, 1],
                constants: {
                    inputWidth: width,
                    inputHeight: height,
                    inputDepth: depth,
                },
            });
            this.getSumKernel = makeKernel(getSum3D, {
                output: [1, 1, 1],
                constants: {
                    inputWidth: width,
                    inputHeight: height,
                    inputDepth: depth,
                },
            });
            this.predictKernel = makeKernel(predict3D, {
                output: [width, height, depth],
            });
            this.compareKernel = makeKernel(compare3D, {
                output: [width, height, depth],
                immutable: true,
            });
        }
        else {
            this.getExponentialsKernel = makeKernel(getExponentials, {
                output: [width, height],
            });
            this.getMaxValueKernel = makeKernel(getMaxValue2D, {
                output: [1, 1],
                constants: {
                    inputWidth: width,
                    inputHeight: height,
                },
            });
            this.getSumKernel = makeKernel(getSum2D, {
                output: [1, 1],
                constants: {
                    inputWidth: width,
                    inputHeight: height,
                },
            });
            this.predictKernel = makeKernel(predict2D, {
                output: [width, height],
            });
            this.compareKernel = makeKernel(compare2D, {
                output: [width, height],
                immutable: true,
            });
        }
    }
    predict() {
        const maxValue = this.getMaxValueKernel(this.inputLayer.weights);
        const exponentials = this.getExponentialsKernel(this.inputLayer.weights, maxValue);
        const exponentialsSum = this.getSumKernel(exponentials);
        this.weights = this.predictKernel(exponentials, exponentialsSum);
    }
    compare(targetValues) {
        const { deltas, errors } = this;
        this.errors = this.compareKernel(targetValues[0], deltas);
        this.deltas = clone(this.errors);
        release(deltas);
        release(errors);
        const inputLayerDeltas = this.inputLayer.deltas;
        this.inputLayer.deltas = clone(this.deltas);
        release(inputLayerDeltas);
    }
}
function softMax(inputLayer, settings) {
    return new SoftMax(inputLayer, settings);
}

class SVM extends BaseLayer {
    constructor(inputLayer, settings) {
        super(settings);
        this.inputLayer = inputLayer;
    }
    predict() {
        release(this.weights);
        this.weights = clone(this.inputLayer.weights);
        this.validate();
    }
    learn() {
        // throw new Error(`${this.constructor.name}-learn is not yet implemented`)
    }
}
// function learn(target) {
//   if (y === i) {
//     continue;
//   }
//   const ydiff = -yscore + x.w[i] + margin;
//   if (ydiff > 0) {
//     // violating dimension, apply loss
//     x.dw[i] += 1;
//     x.dw[y] -= 1;
//     loss += ydiff;
//   }
// }
function svm(inputLayer, settings) {
    return new SVM(inputLayer, settings);
}

function predict(value) {
    return value[this.thread.x][this.thread.y];
}
const compare = predict;
class Transpose extends Modifier {
    get width() {
        return this.inputLayer.height;
    }
    get height() {
        return this.inputLayer.width;
    }
    constructor(inputLayer) {
        super(inputLayer);
        this.validate();
    }
    setupKernels() {
        this.predictKernel = makeKernel(predict, {
            output: [this.height, this.width],
        });
        this.compareKernel = makeKernel(compare, {
            output: [this.width, this.height],
        });
    }
    predict() {
        this.weights = this.predictKernel(this.inputLayer.weights);
    }
    compare() {
        this.inputLayer.deltas = this.compareKernel(this.deltas);
    }
}
function transpose(inputLayer) {
    return new Transpose(inputLayer);
}

const layerTypes = {
    Activation,
    Internal,
    InternalModel,
    EntryPoint,
    Filter,
    Model,
    Modifier,
    Operator,
    Target,
};

var layer = /*#__PURE__*/Object.freeze({
    __proto__: null,
    layerTypes: layerTypes,
    Add: Add,
    add: add$1,
    arthurFeedForward: arthurFeedForward,
    BaseLayer: BaseLayer,
    baseLayerDefaultSettings: baseLayerDefaultSettings,
    Convolution: Convolution,
    convolution: convolution,
    Dropout: Dropout,
    dropout: dropout,
    feedForward: feedForward,
    FullyConnected: FullyConnected,
    fullyConnected: fullyConnected,
    gru: gru,
    Input: Input,
    input: input,
    LeakyRelu: LeakyRelu,
    leakyRelu: leakyRelu,
    lstmCell: lstmCell,
    Multiply: Multiply,
    multiply: multiply$1,
    MultiplyElement: MultiplyElement,
    multiplyElement: multiplyElement$1,
    Negative: Negative,
    negative: negative,
    Ones: Ones,
    ones: ones,
    output: output,
    Pool: Pool,
    pool: pool,
    Random: Random,
    random: random,
    RecurrentInput: RecurrentInput,
    RecurrentZeros: RecurrentZeros,
    rnnCell: rnnCell,
    Regression: Regression,
    regression: regression,
    Relu: Relu,
    relu: relu$1,
    Sigmoid: Sigmoid,
    sigmoid: sigmoid$1,
    SoftMax: SoftMax,
    softMax: softMax,
    SVM: SVM,
    svm: svm,
    Tanh: Tanh,
    tanh: tanh$1,
    Target: Target,
    target: target,
    Transpose: Transpose,
    transpose: transpose,
    Zeros: Zeros,
    zeros: zeros
});

const layerNameTypes = Object.keys(layer);
function layerFromJSON(jsonLayer, inputLayer1, inputLayer2) {
    if (!layerNameTypes.find((layerNameType) => layerNameType === jsonLayer.type)) {
        return null;
    }
    const Layer = layer[jsonLayer.type];
    if (Layer.prototype instanceof layerTypes.Filter) {
        if (!inputLayer1)
            throw new Error('inputLayer missing');
        return new Layer(jsonLayer, inputLayer1);
    }
    else if (Layer.prototype instanceof layerTypes.Activation ||
        Layer.prototype instanceof layerTypes.Modifier) {
        if (!inputLayer1)
            throw new Error('inputLayer missing');
        return new Layer(inputLayer1, jsonLayer);
    }
    else if (Layer.prototype instanceof layerTypes.Internal) {
        return new Layer(jsonLayer);
    }
    else if (Layer.prototype instanceof layerTypes.Operator) {
        if (!inputLayer1)
            throw new Error('inputLayer1 missing');
        if (!inputLayer2)
            throw new Error('inputLayer2 missing');
        return new Layer(inputLayer1, inputLayer2, jsonLayer);
    }
    else if (Layer.prototype instanceof layerTypes.InternalModel ||
        Layer.prototype instanceof layerTypes.EntryPoint ||
        Layer.prototype instanceof layerTypes.Model) {
        return new Layer(jsonLayer);
    }
    else if (Layer === Target) {
        if (!inputLayer1)
            throw new Error('inputLayer missing');
        return new Layer(jsonLayer, inputLayer1);
    }
    return null;
}

const defaults$2 = {
    learningRate: 0.3,
    binaryThresh: 0.5,
    initPraxis: (layerTemplate, settings) => {
        var _a;
        return momentumRootMeanSquaredPropagation(layerTemplate, (_a = layerTemplate.settings.praxisOpts) !== null && _a !== void 0 ? _a : settings);
    },
};
const trainDefaults$2 = {
    iterations: 20000,
    errorThresh: 0.005,
    log: false,
    logPeriod: 10,
    learningRate: 0.3,
    callbackPeriod: 10,
    errorCheckInterval: 100,
    timeout: Infinity,
};
class FeedForward {
    constructor(options = {}) {
        this.trainOpts = {};
        this.layers = null;
        this._inputLayer = null;
        this._hiddenLayers = null;
        this._outputLayer = null;
        this._model = null;
        this.meanSquaredError = null;
        this.inputLookup = null;
        this.inputLookupLength = null;
        this.outputLookup = null;
        this.outputLookupLength = null;
        this.options = { ...defaults$2, ...options };
        this._updateTrainingOptions({
            ...trainDefaults$2,
            ...options,
        });
    }
    static _validateTrainingOptions(options) {
        const { iterations, errorThresh, log, logPeriod, learningRate, callback, callbackPeriod, timeout, } = options;
        const validations = {
            iterations: () => typeof iterations === 'number' && iterations > 0,
            errorThresh: () => typeof errorThresh === 'number' && errorThresh > 0 && errorThresh < 1,
            log: () => typeof log === 'function' || typeof log === 'boolean',
            logPeriod: () => typeof logPeriod === 'number' && logPeriod > 0,
            learningRate: () => typeof learningRate === 'number' &&
                learningRate > 0 &&
                learningRate < 1,
            callback: () => typeof callback === 'function' || callback === null,
            callbackPeriod: () => typeof callbackPeriod === 'number' && callbackPeriod > 0,
            timeout: () => typeof timeout === 'number' && timeout > 0,
        };
        Object.keys(trainDefaults$2).forEach((key) => {
            if (validations.hasOwnProperty(key) && !validations[key]()) {
                const val = options[key];
                throw new Error(`[${key}, ${(val !== null && val !== void 0 ? val : 'undefined').toString()}] is out of normal training range, your network will probably not train.`);
            }
        });
    }
    /**
     * if a method is passed in method is used
     * if false passed in nothing is logged
     */
    _setLogMethod(log) {
        if (typeof log === 'function') {
            this.trainOpts.log = log;
        }
        else if (log) {
            // eslint-disable-next-line
            this.trainOpts.log = console.log;
        }
        else {
            this.trainOpts.log = false;
        }
    }
    _updateTrainingOptions(opts) {
        var _a;
        this.trainOpts = { ...trainDefaults$2, ...this.trainOpts, ...opts };
        FeedForward._validateTrainingOptions(this.trainOpts);
        this._setLogMethod((_a = opts.log) !== null && _a !== void 0 ? _a : this.trainOpts.log);
        const { callback, callbackPeriod, errorCheckInterval } = this.trainOpts;
        if (callback && callbackPeriod !== errorCheckInterval) {
            console.warn(`options.callbackPeriod with value of ${(callbackPeriod !== null && callbackPeriod !== void 0 ? callbackPeriod : 'undefined').toString()} does not match options.errorCheckInterval with value of ${(errorCheckInterval !== null && errorCheckInterval !== void 0 ? errorCheckInterval : 'undefined').toString()}, if logging error, it will repeat.  These values may need to match`);
        }
    }
    _connectOptionsLayers() {
        const { inputLayerIndex, outputLayerIndex, layers } = this.options;
        if (!layers)
            throw new Error('this.options.layers in unexpected state');
        if (typeof inputLayerIndex !== 'number')
            throw new Error('inputLayerIndex not a number');
        if (typeof outputLayerIndex !== 'number')
            throw new Error('inputLayerIndex not a number');
        const inputLayer = layers[inputLayerIndex];
        if (!inputLayer) {
            throw new Error('inputLayer not found in this.options.layers');
        }
        const outputLayer = layers[outputLayerIndex];
        if (!outputLayer) {
            throw new Error('outputLayer not found in this.options.layers');
        }
        this._inputLayer = inputLayer;
        this._hiddenLayers = layers.slice(inputLayerIndex, outputLayerIndex - inputLayerIndex);
        this._outputLayer = outputLayer;
        return layers;
    }
    _connectNewLayers() {
        const { inputLayer, outputLayer } = this.options;
        if (!inputLayer)
            throw new Error('inputLayer not defined');
        const layers = [];
        this._inputLayer = inputLayer();
        const hiddenLayers = this._connectHiddenLayers(this._inputLayer);
        if (!outputLayer)
            throw new Error('outputLayer not defined');
        this._outputLayer = outputLayer(hiddenLayers[hiddenLayers.length - 1], hiddenLayers.length);
        layers.push(this._inputLayer);
        layers.push(...hiddenLayers);
        layers.push(this._outputLayer);
        return flattenLayers(layers);
    }
    _connectHiddenLayers(previousLayer) {
        this._hiddenLayers = [];
        const result = [];
        const { hiddenLayers } = this.options;
        if (!hiddenLayers)
            throw new Error('hiddenLayers not defined');
        for (let i = 0; i < hiddenLayers.length; i++) {
            const hiddenLayer = hiddenLayers[i](previousLayer, i);
            result.push(hiddenLayer);
            this._hiddenLayers.push(hiddenLayer);
            previousLayer = hiddenLayer;
        }
        return result;
    }
    initialize() {
        this.layers = this.options.layers
            ? this._connectOptionsLayers()
            : this._connectNewLayers();
        this.initializeLayers(this.layers);
        this._model = this.layers.filter((l) => l instanceof Model);
    }
    initializeLayers(layers) {
        var _a, _b;
        for (let i = 0; i < layers.length; i++) {
            const layer = layers[i];
            // TODO: optimize for when training or just running
            layer.setupKernels(true);
            if (layer instanceof Model &&
                layer.praxis === null &&
                typeof this.options.initPraxis === 'function') {
                layer.praxis = this.options.initPraxis(layer, (_b = (_a = layer.settings.praxisOpts) !== null && _a !== void 0 ? _a : this.options.praxisOpts) !== null && _b !== void 0 ? _b : {});
                layer.praxis.setupKernels();
            }
        }
        const lastLayer = layers[layers.length - 1];
        this.meanSquaredError = new MeanSquaredError({
            width: lastLayer.width,
            height: lastLayer.height,
        });
    }
    run(input) {
        let typeSafeInput;
        if (Array.isArray(input) || input.buffer) {
            typeSafeInput = input;
        }
        else {
            if (this.inputLookup) {
                typeSafeInput = lookup.toArray(this.inputLookup, input, this.inputLookupLength);
            }
            else {
                throw new Error('input is incompatible with net');
            }
        }
        let output = this.runInput(typeSafeInput);
        if (output instanceof gpuBrowser.Texture) {
            output = output.toArray();
        }
        if (this.outputLookup) {
            return lookup.toObject(this.outputLookup, output);
        }
        return output;
    }
    runInput(input) {
        if (!this.layers)
            throw new Error('not initialized');
        this.layers[0].predict(input);
        for (let i = 1; i < this.layers.length; i++) {
            this.layers[i].predict();
        }
        return this.layers[this.layers.length - 1].weights;
    }
    train(data, options = {}) {
        const { preparedData, status, endTime } = this._prepTraining(data, options);
        let continueTicking = true;
        const calculateError = () => this._calculateTrainingError(preparedData);
        const trainPatterns = () => this._trainPatterns(preparedData);
        while (continueTicking) {
            continueTicking = this._trainingTick(status, endTime, calculateError, trainPatterns);
        }
        return status;
    }
    async trainAsync(data, options = {}) {
        const { preparedData, status, endTime } = this._prepTraining(data, options);
        return await new Promise((resolve, reject) => {
            try {
                const calculateError = () => this._calculateTrainingError(preparedData);
                const trainPatterns = () => this._trainPatterns(preparedData);
                const thawedTrain = new browser.Thaw(new Array(this.trainOpts.iterations), {
                    delay: true,
                    each: () => this._trainingTick(status, endTime, calculateError, trainPatterns) || thawedTrain.stop(),
                    done: () => resolve(status),
                });
                thawedTrain.tick();
            }
            catch (trainError) {
                reject(trainError);
            }
        });
    }
    _trainingTick(status, endTime, calculateError, trainPatterns) {
        const { trainOpts } = this;
        if (status.iterations >= trainOpts.iterations ||
            status.error <= trainOpts.errorThresh ||
            Date.now() >= endTime) {
            return false;
        }
        if (typeof trainOpts.log === 'function' &&
            status.iterations % trainOpts.logPeriod === 0) {
            status.error = calculateError();
            trainOpts.log(`iterations: ${status.iterations}, training error: ${status.error}`);
        }
        else if (status.iterations % trainOpts.errorCheckInterval ===
            0) {
            status.error = calculateError();
        }
        else {
            trainPatterns();
        }
        if (trainOpts.callback &&
            status.iterations % trainOpts.callbackPeriod === 0) {
            trainOpts.callback(Object.assign(status));
        }
        status.iterations++;
        return true;
    }
    _prepTraining(data, options) {
        this._updateTrainingOptions(options);
        const formattedData = this.formatData(data);
        const endTime = this.trainOpts.timeout
            ? Date.now() + this.trainOpts.timeout
            : 0;
        const status = {
            error: 1,
            iterations: 0,
        };
        this.verifyIsInitialized();
        return {
            preparedData: this.transferData(formattedData),
            status,
            endTime,
        };
    }
    verifyIsInitialized() {
        if (!this._model) {
            this.initialize();
        }
    }
    _calculateTrainingError(preparedData) {
        let sum = new Float32Array([0]);
        const meanSquaredError = this.meanSquaredError;
        for (let i = 0; i < preparedData.length; ++i) {
            const prevSum = sum;
            const error = this._trainPattern(preparedData[i].input, preparedData[i].output, true);
            sum = meanSquaredError.add(sum, error);
            release(error);
            release(prevSum);
        }
        const result = meanSquaredError.divide(preparedData.length, sum);
        release(sum);
        if (result instanceof gpuBrowser.Texture) {
            const resultArray = result.toArray();
            release(result);
            return resultArray[0];
        }
        return result[0];
    }
    /**
     * @param data
     * @private
     */
    _trainPatterns(data) {
        for (let i = 0; i < data.length; ++i) {
            this._trainPattern(data[i].input, data[i].output, false);
        }
    }
    _trainPattern(input, target, logErrorRate) {
        var _a;
        // forward propagate
        this.runInput(input);
        // back propagate
        this._calculateDeltas(target);
        this.adjustWeights();
        if (logErrorRate) {
            if (!((_a = this._outputLayer) === null || _a === void 0 ? void 0 : _a.errors)) {
                throw new Error('outputLayer.errors not defined');
            }
            return this.meanSquaredError.calculate(this._outputLayer.errors);
        }
        return null;
    }
    _calculateDeltas(target) {
        const layers = this.layers;
        for (let i = layers.length - 1; i > -1; i--) {
            layers[i].compare(target);
        }
    }
    /**
     *
     */
    adjustWeights() {
        const _model = this._model;
        for (let i = 0; i < _model.length; i++) {
            _model[i].learn(this.trainOpts.learningRate);
        }
    }
    /**
     *
     * @param data
     * @returns {*}
     */
    formatData(data) {
        if (!Array.isArray(data)) {
            // turn stream datum into array
            const tmp = [];
            tmp.push(data);
            data = tmp;
        }
        // turn sparse hash input into arrays with 0s as filler
        const inputDatumCheck = data[0].input;
        let formattedData;
        if (Array.isArray(data) &&
            !Array.isArray(inputDatumCheck) &&
            !(inputDatumCheck instanceof Float32Array)) {
            if (!this.inputLookup) {
                const lookupTable = new LookupTable(data, 'input');
                this.inputLookup = lookupTable.table;
                this.inputLookupLength = lookupTable.length;
            }
            formattedData = data.map((datumParam) => {
                const array = lookup.toArray(this.inputLookup, datumParam.input, this.inputLookupLength);
                return { input: array };
            }, this);
        }
        else {
            formattedData = data;
        }
        const outputDatumCheck = data[0].output;
        if (!Array.isArray(outputDatumCheck) &&
            !(outputDatumCheck instanceof Float32Array)) {
            if (!this.outputLookup) {
                const lookupTable = new LookupTable(data, 'output');
                this.outputLookup = lookupTable.table;
                this.outputLookupLength = lookupTable.length;
            }
            formattedData = data.map((datumParam, index) => {
                const array = lookup.toArray(this.outputLookup, datumParam.output, this.inputLookupLength);
                return {
                    input: formattedData[index].input,
                    output: array,
                };
            }, this);
        }
        return formattedData;
    }
    transferData(formattedData) {
        const transferredData = new Array(formattedData.length);
        const transferInput = makeKernel(function (value) {
            return value[this.thread.x];
        }, {
            output: [formattedData[0].input.length],
            immutable: true,
        });
        const transferOutput = makeKernel(function (value) {
            return value[this.thread.x];
        }, {
            output: [formattedData[0].output.length],
            immutable: true,
        });
        for (let i = 0; i < formattedData.length; i++) {
            const formattedDatum = formattedData[i];
            transferredData[i] = {
                input: transferInput(formattedDatum.input),
                output: transferOutput(formattedDatum.output),
            };
        }
        return transferredData;
    }
    /**
     *
     * @param data
     * @returns {
     *  {
     *    error: number,
     *    misclasses: Array
     *  }
     * }
     */
    test() {
        throw new Error(`${this.constructor.name}-test is not yet implemented`);
    }
    /**
     *
     */
    toJSON() {
        var _a;
        if (!this.layers) {
            this.initialize();
        }
        if (!this._model ||
            !this.layers ||
            !this._inputLayer ||
            !this._hiddenLayers ||
            !this._outputLayer) {
            throw new Error('network is not initialized');
        }
        const jsonLayers = [];
        for (let i = 0; i < this.layers.length; i++) {
            const layer = this.layers[i];
            const jsonLayer = layer.toJSON();
            if (layer.hasOwnProperty('inputLayer')) {
                jsonLayer.inputLayerIndex = this.layers.indexOf(layer.inputLayer);
            }
            else if (layer.hasOwnProperty('inputLayer1') &&
                layer.hasOwnProperty('inputLayer2')) {
                jsonLayer.inputLayer1Index = this.layers.indexOf(layer.inputLayer1);
                jsonLayer.inputLayer2Index = this.layers.indexOf(layer.inputLayer2);
            }
            jsonLayers.push(jsonLayer);
        }
        return {
            type: this.constructor.name,
            sizes: (_a = this.options.sizes) !== null && _a !== void 0 ? _a : [this._inputLayer.height]
                .concat(this._hiddenLayers.map((l) => l.height))
                .concat([this._outputLayer.height]),
            outputLayerIndex: this.layers.indexOf(this._outputLayer),
            layers: jsonLayers,
            inputLayerIndex: this.layers.indexOf(this._inputLayer),
        };
    }
    static fromJSON(json, getLayer) {
        var _a, _b, _c, _d;
        const jsonLayers = json.layers;
        const layers = [];
        const inputLayer = getLayer
            ? (_a = layerFromJSON(jsonLayers[0])) !== null && _a !== void 0 ? _a : getLayer(jsonLayers[0]) : layerFromJSON(jsonLayers[0]);
        if (!inputLayer)
            throw new Error('unable to find layer');
        layers.push(inputLayer);
        for (let i = 1; i < jsonLayers.length; i++) {
            const jsonLayer = jsonLayers[i];
            if (typeof jsonLayer.inputLayerIndex === 'undefined' &&
                typeof jsonLayer.inputLayer1Index === 'undefined' &&
                typeof jsonLayer.inputLayer2Index === 'undefined') {
                const layer = getLayer
                    ? (_b = layerFromJSON(jsonLayer)) !== null && _b !== void 0 ? _b : getLayer(jsonLayer) : layerFromJSON(jsonLayer);
                if (!layer)
                    throw new Error('unable to find layer');
                layers.push(layer);
            }
            else if (typeof jsonLayer.inputLayerIndex === 'number') {
                const inputLayer = layers[jsonLayer.inputLayerIndex];
                if (!inputLayer) {
                    throw new Error('inputLayer1 not found');
                }
                const layer = getLayer
                    ? (_c = layerFromJSON(jsonLayer, inputLayer)) !== null && _c !== void 0 ? _c : getLayer(jsonLayer, inputLayer) : layerFromJSON(jsonLayer, inputLayer);
                if (!layer)
                    throw new Error('unable to find layer');
                layers.push(layer);
            }
            else {
                if (typeof jsonLayer.inputLayer1Index !== 'number') {
                    throw new Error('Cannot create network from provided JSON. inputLayer1Index not defined.');
                }
                if (typeof jsonLayer.inputLayer2Index !== 'number') {
                    throw new Error('Cannot create network from provided JSON. inputLayer2Index not defined.');
                }
                const inputLayer1 = layers[jsonLayer.inputLayer1Index];
                const inputLayer2 = layers[jsonLayer.inputLayer2Index];
                if (inputLayer1 === undefined)
                    throw new Error(`Cannot create network from provided JSON. layer of index ${jsonLayer.inputLayer1Index} not found.`);
                if (inputLayer2 === undefined)
                    throw new Error(`Cannot create network from provided JSON. layer of index ${jsonLayer.inputLayer2Index} not found.`);
                const layer = getLayer
                    ? (_d = layerFromJSON(jsonLayer, inputLayer1, inputLayer2)) !== null && _d !== void 0 ? _d : getLayer(jsonLayer, inputLayer1, inputLayer2) : layerFromJSON(jsonLayer, inputLayer1, inputLayer2);
                if (!layer)
                    throw new Error('unable to find layer');
                layers.push(layer);
            }
        }
        return new this({ ...json, layers });
    }
    /**
     *
     * @returns {Function}
     */
    toFunction() {
        throw new Error(`${this.constructor.name}-toFunction is not yet implemented`);
    }
}

function likely(input, net) {
    if (!net) {
        throw new TypeError(`Required parameter 'net' is of type ${typeof net}. Must be of type 'brain.NeuralNetwork'`);
    }
    const output = net.run(input);
    let maxProp = null;
    let maxValue = -1;
    Object.entries(output).forEach(([key, value]) => {
        if (typeof value !== 'undefined' &&
            typeof value === 'number' &&
            value > maxValue) {
            maxProp = key;
            maxValue = value;
        }
    });
    return maxProp;
}

class RecurrentConnection extends Internal {
    constructor() {
        super(...arguments);
        this.settings = {};
        this.layer = null;
    }
    setLayer(layer) {
        this.layer = layer;
    }
    get width() {
        if (!this.layer)
            throw new Error('layer not set');
        return this.layer.width;
    }
    set width(value) {
        throw new Error(`${this.constructor.name}-width is not yet implemented`);
    }
    get height() {
        if (!this.layer)
            throw new Error('layer not set');
        return this.layer.height;
    }
    set height(value) {
        throw new Error(`${this.constructor.name}-height is not yet implemented`);
    }
    get deltas() {
        if (!this.layer)
            throw new Error('layer not set');
        return this.layer.deltas;
    }
    set deltas(deltas) {
        if (!this.layer)
            throw new Error('layer not set');
        release(this.layer.deltas);
        this.layer.deltas = deltas;
    }
    get weights() {
        if (!this.layer)
            throw new Error('layer not set');
        return this.layer.weights;
    }
    set weights(weights) {
        if (!this.layer)
            throw new Error('layer not set');
        release(this.layer.weights);
        this.layer.weights = weights;
    }
    predict() {
        // throw new Error(`${this.constructor.name}-predict is not yet implemented`)
    }
    compare() {
        // throw new Error(`${this.constructor.name}-compare is not yet implemented`)
    }
    learn() {
        throw new Error('no longer using');
    }
    setupKernels() {
        // throw new Error(
        //   `${this.constructor.name}-setupKernels is not yet implemented`
        // )
    }
    reuseKernels() {
        // throw new Error(
        //   `${this.constructor.name}-reuseKernels is not yet implemented`
        // )
    }
}

class Recurrent extends FeedForward {
    // TODO: use generics in extend
    constructor(options = {}) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        super(options);
        this.trainOpts = {};
        this._outputConnection = null;
        this._layerSets = [];
        this._hiddenLayerOutputIndices = [];
        this._model = null;
    }
    _connectLayers() {
        if (!this.options.inputLayer) {
            throw new Error('inputLayer not found');
        }
        if (!this.options.outputLayer) {
            throw new Error('outputLayer not found');
        }
        const inputLayer = this.options.inputLayer();
        const hiddenLayers = this._connectHiddenLayers(inputLayer);
        const outputLayer = this.options.outputLayer(hiddenLayers[hiddenLayers.length - 1], -1);
        return {
            inputLayer,
            hiddenLayers,
            outputLayer,
        };
    }
    _connectLayersDeep() {
        const layers = [];
        const previousLayers = this._layerSets[this._layerSets.length - 1];
        let usedHiddenLayerOutputIndex = 0;
        function findInputLayer(inputLayer) {
            const index = previousLayers.indexOf(inputLayer);
            if (index < 0)
                throw new Error('unable to find layer');
            return layers[index];
        }
        function layerSettings(layer) {
            return {
                ...layer.settings,
                weights: null,
                deltas: null,
                praxis: null,
            };
        }
        for (let i = 0; i < previousLayers.length; i++) {
            const previousLayer = previousLayers[i];
            let layer;
            if (previousLayer instanceof Activation) {
                layer = new previousLayer.constructor(findInputLayer(previousLayer.inputLayer), layerSettings(previousLayer));
            }
            else if (previousLayer instanceof EntryPoint) {
                layer = new previousLayer.constructor(layerSettings(previousLayer));
            }
            else if (previousLayer instanceof Filter) {
                layer = new previousLayer.constructor(layerSettings(previousLayer.inputLayer), findInputLayer(previousLayer.inputLayer));
            }
            else if (previousLayer instanceof Internal) {
                const previousHiddenLayerOutput = previousLayers[this._hiddenLayerOutputIndices[usedHiddenLayerOutputIndex++]];
                if (previousLayer instanceof RecurrentConnection) {
                    throw new Error('unfinished');
                }
                else if (previousLayer instanceof RecurrentInput) {
                    layer = new RecurrentInput(previousHiddenLayerOutput);
                }
                else if (previousLayer instanceof RecurrentZeros) {
                    layer = new RecurrentInput(previousHiddenLayerOutput);
                }
                else {
                    throw new Error(`hidden layer ${previousLayer.constructor.name} extends unknown hidden layer`);
                }
            }
            else if (previousLayer instanceof InternalModel ||
                previousLayer instanceof Model) {
                layer = previousLayer;
            }
            else if (previousLayer instanceof Modifier) {
                layer = new previousLayer.constructor(findInputLayer(previousLayer.inputLayer), layerSettings(previousLayer.inputLayer));
            }
            else if (previousLayer instanceof Operator) {
                layer = new previousLayer.constructor(findInputLayer(previousLayer.inputLayer1), findInputLayer(previousLayer.inputLayer2), layerSettings(previousLayer));
            }
            else if (previousLayer instanceof Target) {
                layer = new previousLayer.constructor(layerSettings(previousLayer), findInputLayer(previousLayer.inputLayer));
            }
            else {
                throw new Error(`hidden layer ${previousLayer.constructor.name} extends unknown hidden layer`);
            }
            layers.push(layer);
        }
        return layers;
    }
    _connectHiddenLayers(previousLayer) {
        const hiddenLayers = [];
        if (!this.options.hiddenLayers)
            throw new Error('hiddenLayers not defined');
        for (let i = 0; i < this.options.hiddenLayers.length; i++) {
            const recurrentInput = new RecurrentZeros();
            const hiddenLayer = this.options.hiddenLayers[i](previousLayer, recurrentInput, i);
            previousLayer = hiddenLayer;
            hiddenLayers.push(hiddenLayer);
        }
        return hiddenLayers;
    }
    initialize() {
        this._outputConnection = new RecurrentConnection();
        let layerSet;
        if (this.options.layers) {
            layerSet = this._connectOptionsLayers();
        }
        else {
            const { inputLayer, hiddenLayers, outputLayer } = this._connectLayers();
            layerSet = flattenLayers([inputLayer, ...hiddenLayers, outputLayer]);
            this._hiddenLayerOutputIndices = hiddenLayers.map((l) => layerSet.indexOf(l));
            this._inputLayer = inputLayer;
            this._hiddenLayers = hiddenLayers;
            this._outputLayer = outputLayer;
        }
        this.layers = layerSet;
        this._layerSets = [layerSet];
        this._model = layerSet.filter((l) => l instanceof Model || l instanceof InternalModel);
        this.initializeLayers(layerSet);
    }
    initializeDeep() {
        const layers = this._connectLayersDeep();
        for (let i = 0; i < layers.length; i++) {
            const layer = layers[i];
            layer.setupKernels(true);
            layer.reuseKernels(this._layerSets[0][i]);
        }
        this._layerSets.push(layers);
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    run(inputs) {
        while (this._layerSets.length <= inputs.length) {
            this.initializeDeep();
        }
        const result = this.runInputs(inputs);
        if (result instanceof gpuBrowser.Texture) {
            return result.toArray();
        }
        return result;
    }
    runInput(input) {
        throw new Error('use .runInputs()');
    }
    runInputs(inputs) {
        while (this._layerSets.length < inputs.length) {
            this.initializeDeep();
        }
        const max = inputs.length - 1; // last output will be compared with last index
        for (let x = 0; x <= max; x++) {
            const layerSet = this._layerSets[x];
            layerSet[0].predict(inputs[x]);
            for (let i = 1; i < layerSet.length; i++) {
                layerSet[i].predict();
            }
        }
        const lastLayerUsed = this._layerSets[max];
        const result = lastLayerUsed[lastLayerUsed.length - 1].weights;
        this.end();
        return result;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    train(data, options = {}) {
        const { preparedData, status, endTime } = this._prepTraining(data, options);
        let continueTicking = true;
        const calculateError = () => this._calculateTrainingError(preparedData);
        const trainPatters = () => this._trainPatterns(preparedData);
        while (continueTicking) {
            continueTicking = this._trainingTick(status, endTime, calculateError, trainPatters);
        }
        return status;
    }
    end() {
        const x = this._layerSets.length - 1;
        const lastLayerSet = this._layerSets[x];
        lastLayerSet[0].predict([new Float32Array([0])]);
        for (let i = 1; i < lastLayerSet.length; i++) {
            lastLayerSet[i].predict();
        }
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    transferData(formattedData) {
        return formattedData;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    _prepTraining(data, options) {
        this._updateTrainingOptions(options);
        const endTime = this.trainOpts.timeout
            ? Date.now() + this.trainOpts.timeout
            : 0;
        const status = {
            error: 1,
            iterations: 0,
        };
        this.verifyIsInitialized();
        return {
            preparedData: this.transferData(data),
            status,
            endTime,
        };
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    _calculateTrainingError(data) {
        if (!this.meanSquaredError) {
            throw new Error('this.meanSquaredError not setup');
        }
        let sum = new Float32Array(1);
        for (let i = 0; i < data.length; ++i) {
            const prevSum = sum;
            const error = this._trainPattern(data[i], true);
            sum = this.meanSquaredError.add(sum, error);
            release(error);
            release(prevSum);
        }
        const result = this.meanSquaredError.divide(data.length, sum);
        release(sum);
        if (result instanceof gpuBrowser.Texture) {
            const resultArray = result.toArray();
            return resultArray[0];
        }
        return result[0];
    }
    // TODO: more types
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    formatData(data) {
        return data;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    _calculateDeltas(target) {
        const lastLayerSet = this._layerSets[this._layerSets.length - 1];
        // Iterate from the second to last layer backwards, propagating 0's
        for (let i = lastLayerSet.length - 2; i >= 0; i--) {
            lastLayerSet[i].compare();
        }
        for (let x = target.length - 2; x >= 0; x--) {
            const layerSet = this._layerSets[x];
            layerSet[layerSet.length - 1].compare(target[x + 1]);
            for (let i = layerSet.length - 2; i >= 0; i--) {
                layerSet[i].compare();
            }
        }
    }
    adjustWeights() {
        var _a;
        const _model = this._model;
        for (let i = 0; i < _model.length; i++) {
            _model[i].learn((_a = this.options.learningRate) !== null && _a !== void 0 ? _a : 0);
        }
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    _trainPatterns(data) {
        for (let i = 0; i < data.length; ++i) {
            this._trainPattern(data[i], false);
        }
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    _trainPattern(inputs, logErrorRate) {
        // forward propagate
        this.runInputs(inputs);
        // back propagate
        this._calculateDeltas(inputs);
        this.adjustWeights();
        if (logErrorRate) {
            if (!this.meanSquaredError) {
                throw new Error('this.meanSquaredError not setup');
            }
            let error = new Float32Array(1);
            for (let i = 0, max = inputs.length - 2; i <= max; i++) {
                const layerSet = this._layerSets[i];
                const lastLayer = layerSet[layerSet.length - 1];
                const prevError = error;
                error = this.meanSquaredError.addAbsolute(prevError, lastLayer.errors);
                release(prevError);
            }
            return clone(this.meanSquaredError.divide(inputs.length, error));
        }
        return null;
    }
}

/**
 * A matrix
 */
class Matrix {
    constructor(rows, columns) {
        this.rows = 0;
        this.columns = 0;
        if (rows)
            this.rows = rows;
        if (columns)
            this.columns = columns;
        this.weights = zeros$1(this.rows * this.columns);
        this.deltas = zeros$1(this.rows * this.columns);
    }
    getWeight(row, col) {
        // slow but careful accessor function
        // we want row-major order
        const ix = this.columns * row + col;
        if (ix < 0 || ix >= this.weights.length) {
            throw new Error('get accessor is skewed');
        }
        return this.weights[ix];
    }
    setWeight(row, col, v) {
        // slow but careful accessor function
        const ix = this.columns * row + col;
        if (ix < 0 || ix >= this.weights.length) {
            throw new Error('set accessor is skewed');
        }
        this.weights[ix] = v;
        return this;
    }
    getDelta(row, col) {
        // slow but careful accessor function
        // we want row-major order
        const ix = this.columns * row + col;
        if (ix < 0 || ix >= this.deltas.length) {
            throw new Error('get accessor is skewed');
        }
        return this.deltas[ix];
    }
    setDelta(row, col, v) {
        // slow but careful accessor function
        const ix = this.columns * row + col;
        if (ix < 0 || ix >= this.weights.length) {
            throw new Error('set accessor is skewed');
        }
        this.deltas[ix] = v;
        return this;
    }
    toJSON() {
        return {
            rows: this.rows,
            columns: this.columns,
            weights: Array.from(this.weights.slice(0)),
        };
    }
    static fromJSON(json) {
        const matrix = new Matrix(json.rows, json.columns);
        for (let i = 0, max = json.rows * json.columns; i < max; i++) {
            matrix.weights[i] = json.weights[i]; // copy over weights
        }
        return matrix;
    }
    static fromArray(weights) {
        const matrix = new Matrix(weights.length, weights[0].length);
        matrix.fromArray(weights);
        return matrix;
    }
    deltasToArray() {
        return this.toArray('deltas');
    }
    weightsToArray() {
        return this.toArray('weights');
    }
    toArray(prop = 'weights') {
        const result = new Array(this.rows);
        this.iterate({
            row: (rowIndex) => {
                result[rowIndex] = new Array(this.columns);
            },
            column: (rowIndex, columnIndex) => {
                if (prop === 'weights') {
                    result[rowIndex][columnIndex] = this.getWeight(rowIndex, columnIndex);
                }
                else if (prop === 'deltas') {
                    result[rowIndex][columnIndex] = this.getDelta(rowIndex, columnIndex);
                }
            },
        });
        return result;
    }
    fromArray(array, prop = 'weights') {
        if (array.length !== this.rows) {
            throw new Error('rows do not match');
        }
        if (array[0].length !== this.columns) {
            throw new Error('columns do not match');
        }
        this.iterate({
            column: (rowIndex, columnIndex) => {
                const value = array[rowIndex][columnIndex];
                if (typeof value !== 'number') {
                    throw new Error('value not number');
                }
                if (prop === 'weights') {
                    this.setWeight(rowIndex, columnIndex, value);
                }
                else if (prop === 'deltas') {
                    this.setDelta(rowIndex, columnIndex, value);
                }
            },
        });
        return this;
    }
    iterate(callbacks) {
        const rows = this.rows;
        const columns = this.columns;
        for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
            if (callbacks.row) {
                callbacks.row(rowIndex);
            }
            for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
                if (callbacks.column) {
                    callbacks.column(rowIndex, columnIndex);
                }
            }
        }
        return this;
    }
}

/** return Matrix but filled with random numbers from gaussian
 */
class RandomMatrix extends Matrix {
    constructor(rows, columns, std) {
        super(rows, columns);
        this.std = std;
        for (let i = 0, max = this.weights.length; i < max; i++) {
            this.weights[i] = randomFloat(-std, std);
        }
    }
}

class DataFormatter {
    constructor(values, maxThreshold = 0) {
        this.values = values;
        this.indexTable = {};
        this.characterTable = {};
        this.characters = [];
        this.specialIndexes = [];
        this.isSetup = false;
        if (values === undefined)
            return;
        this.setup(values, maxThreshold);
    }
    setup(values, maxThreshold = 0) {
        if (this.isSetup)
            throw new Error('DataFormatter is already setup');
        this.values = values;
        // go over all characters and keep track of all unique ones seen
        // count up all characters
        this.buildCharactersFromIterable(values);
        this.buildTables(maxThreshold);
        if (values[0].input) {
            this.addInputOutput();
        }
        this.addUnrecognized();
        this.isSetup = true;
    }
    buildCharactersFromIterable(values) {
        const tempCharactersTable = {};
        for (let dataFormatterIndex = 0, dataFormatterLength = values.length; dataFormatterIndex < dataFormatterLength; dataFormatterIndex++) {
            const characters = values[dataFormatterIndex];
            // if (typeof characters === 'string') {
            //   const character = characters;
            //   if (tempCharactersTable.hasOwnProperty(character)) continue;
            //   tempCharactersTable[character] = true;
            //   this.characters.push(character);
            if (characters.hasOwnProperty('length')) {
                const iteratable = characters;
                for (let characterIndex = 0, charactersLength = iteratable.length; characterIndex < charactersLength; characterIndex++) {
                    const character = iteratable[characterIndex];
                    if (tempCharactersTable.hasOwnProperty(character))
                        continue;
                    tempCharactersTable[character] = true;
                    this.characters.push(character);
                }
            }
            else if (typeof characters === 'number') {
                if (tempCharactersTable.hasOwnProperty(characters))
                    continue;
                tempCharactersTable[characters] = true;
                this.characters.push(characters);
            }
            else if (typeof characters === 'boolean') {
                const character = characters.toString();
                if (tempCharactersTable.hasOwnProperty(character))
                    continue;
                tempCharactersTable[character] = true;
                this.characters.push(character);
            }
            else if (Array.isArray(characters) &&
                typeof characters[0] === 'string') {
                for (let i = 0; i < characters.length; i++) {
                    const character = characters[i];
                    if (tempCharactersTable.hasOwnProperty(character))
                        continue;
                    tempCharactersTable[character] = true;
                    this.characters.push(character);
                }
            }
            else if (Array.isArray(characters) &&
                (typeof characters[0] === 'number' ||
                    typeof characters[0] === 'boolean')) {
                for (let i = 0; i < characters.length; i++) {
                    const character = characters[i].toString();
                    if (tempCharactersTable.hasOwnProperty(dataFormatterIndex))
                        continue;
                    tempCharactersTable[character] = true;
                    this.characters.push(character);
                }
            }
            else if (characters.hasOwnProperty('input') &&
                characters.hasOwnProperty('output')) {
                const { input, output } = characters;
                if (Array.isArray(input)) {
                    this.addCharacters(input, tempCharactersTable);
                }
                else {
                    this.addCharacters(input.toString(), tempCharactersTable);
                }
                if (Array.isArray(output)) {
                    this.addCharacters(output, tempCharactersTable);
                }
                else {
                    this.addCharacters(output.toString(), tempCharactersTable);
                }
            }
            else {
                throw new Error('Unhandled value');
            }
        }
    }
    addCharacters(characters, charactersTable) {
        for (let i = 0; i < characters.length; i++) {
            const character = characters[i].toString();
            if (charactersTable.hasOwnProperty(character))
                continue;
            charactersTable[character] = true;
            this.characters.push(character);
        }
    }
    buildTables(maxThreshold) {
        // filter by count threshold and create pointers
        const charactersLength = this.characters.length;
        for (let characterIndex = 0; characterIndex < charactersLength; characterIndex++) {
            const character = this.characters[characterIndex];
            if (characterIndex >= maxThreshold) {
                // add character to dataFormatter
                this.indexTable[character] = characterIndex;
                this.characterTable[characterIndex] = character;
            }
        }
    }
    toIndexes(value, maxThreshold = 0) {
        const result = [];
        const { indexTable } = this;
        switch (typeof value) {
            case 'number':
            case 'boolean':
                value = value.toString();
        }
        for (let i = 0, max = value.length; i < max; i++) {
            const character = value[i].toString();
            let index = indexTable[character];
            if (index === undefined) {
                if (indexTable.unrecognized) {
                    index = indexTable.unrecognized;
                }
                else {
                    throw new Error(`unrecognized character "${character}"`);
                }
            }
            if (index < maxThreshold)
                continue;
            result.push(index);
        }
        return result;
    }
    toIndexesInputOutput(input, output, maxThreshold = 0) {
        const result = this.toIndexesValue(input, maxThreshold, true);
        if (typeof output === 'undefined')
            return result;
        return result.concat(this.toIndexesValue(output, maxThreshold, false));
    }
    toIndexesValue(value, maxThreshold, isInput) {
        if (typeof value === 'string') {
            value = value.split('');
        }
        else if (typeof value === 'number' || typeof value === 'boolean') {
            value = value.toString().split('');
        }
        else if (Array.isArray(value) &&
            (typeof value[0] === 'number' ||
                typeof value[0] === 'boolean' ||
                typeof value[0] === 'string')) {
            value = value.map((v) => v.toString());
        }
        else {
            throw new Error('unrecognized value');
        }
        if (isInput) {
            value = value.concat(['stop-input', 'start-output']);
        }
        return this.toIndexes(value, maxThreshold);
    }
    toCharacters(indices, maxThreshold = 0) {
        const result = [];
        const { indexTable, characterTable } = this;
        for (let i = 0, max = indices.length; i < max; i++) {
            const index = indices[i];
            if (index < maxThreshold)
                continue;
            let character = characterTable[index];
            if (character === undefined) {
                if (indexTable.unrecognized) {
                    character = characterTable[indexTable.unrecognized];
                }
                else {
                    throw new Error(`unrecognized index "${index}"`);
                }
            }
            else if (character !== null) {
                result.push(character.toString());
            }
        }
        return result;
    }
    toString(indices, maxThreshold) {
        return this.toCharacters(indices, maxThreshold).join('');
    }
    addInputOutput() {
        this.addSpecial('stop-input');
        this.addSpecial('start-output');
    }
    addUnrecognized() {
        this.addSpecial('unrecognized');
    }
    static fromAllPrintable(maxThreshold, values = ['\n']) {
        for (let i = 32; i <= 126; i++) {
            values.push(String.fromCharCode(i));
        }
        return new DataFormatter(values, maxThreshold);
    }
    static fromAllPrintableInputOutput(maxThreshold, values = ['\n']) {
        const dataFormatter = DataFormatter.fromAllPrintable(maxThreshold, values);
        dataFormatter.addInputOutput();
        dataFormatter.addUnrecognized();
        return dataFormatter;
    }
    static fromStringInputOutput(string, maxThreshold) {
        const values = Array.from(new Set(string)).join('');
        const dataFormatter = new DataFormatter(values.split(''), maxThreshold);
        dataFormatter.addInputOutput();
        dataFormatter.addUnrecognized();
        dataFormatter.isSetup = true;
        return dataFormatter;
    }
    static fromArrayInputOutput(data, maxThreshold) {
        const values = [];
        for (let i = 0; i < data.length; i++) {
            const datum = data[i];
            values.push(validateAndCast(datum.input), validateAndCast(datum.output));
        }
        const flatArray = Array.isArray(values)
            ? values.flat()
            : values;
        const dataFormatter = new DataFormatter(Array.from(new Set(flatArray)), maxThreshold);
        dataFormatter.addInputOutput();
        dataFormatter.addUnrecognized();
        dataFormatter.isSetup = true;
        return dataFormatter;
    }
    static fromString(string, maxThreshold = 0) {
        const values = Array.from(new Set(string)).join('');
        return new DataFormatter(values.split(''), maxThreshold);
    }
    toJSON() {
        return {
            indexTable: this.indexTable,
            characterTable: this.characterTable,
            values: this.values,
            characters: this.characters,
            specialIndexes: this.specialIndexes,
        };
    }
    /** TODO: Type better, The type of json is not "string that is a valid JSON", it is a POJO in the shape of DataFormatter.
     * this method re-hydrates the the data as an instance of DataFormatter.
     */
    static fromJSON(json) {
        const dataFormatter = new DataFormatter();
        dataFormatter.indexTable = json.indexTable;
        dataFormatter.characterTable = json.characterTable;
        dataFormatter.values = json.values;
        dataFormatter.characters = json.characters;
        dataFormatter.specialIndexes = json.specialIndexes;
        dataFormatter.isSetup = true;
        return dataFormatter;
    }
    addSpecial(special, character = null) {
        const specialIndex = (this.indexTable[special] = this.characters.length);
        this.characterTable[specialIndex] = character;
        this.specialIndexes.push(this.characters.length);
        this.characters.push(special);
    }
    toFunctionString() {
        return `
var characterTable = ${JSON.stringify(this.characterTable)};
var indexTable = ${JSON.stringify(this.indexTable)};
var characters = ${JSON.stringify(this.characters)};
var dataFormatter = {
toIndexes: function ${this.toIndexes.toString()},
toIndexesInputOutput: function ${this.toIndexesInputOutput.toString()},
toCharacters: function ${this.toCharacters.toString()},
toIndexesValue: function ${this.toIndexesValue.toString()},
};`;
    }
    formatDataIn(input, output) {
        var _a;
        if (input === undefined)
            return [];
        if (Array.isArray(input) && typeof input[0] === 'number') {
            return input;
        }
        if ((_a = this.indexTable) === null || _a === void 0 ? void 0 : _a.hasOwnProperty('stop-input')) {
            return this.toIndexesInputOutput(input, output);
        }
        return this.toIndexes(input);
    }
    formatDataOut(input, output) {
        return this.toCharacters(output).join('');
    }
    format(data) {
        if (typeof data[0] === 'number' &&
            !Array.isArray(data[0]) &&
            (!data[0].hasOwnProperty('input') || !data[0].hasOwnProperty('output'))) {
            return data;
        }
        const result = [];
        if (typeof data[0] === 'string' ||
            typeof data[0] === 'number' ||
            Array.isArray(data[0])) {
            if (!this.isSetup) {
                this.setup(data);
                for (let i = 0; i < data.length; i++) {
                    result.push(this.formatDataIn(validateAndCast(data[i])));
                }
            }
            else {
                for (let i = 0, max = data.length; i < max; i++) {
                    result.push(this.formatDataIn(data[i]));
                }
            }
        }
        else if (data[0].input && data[0].output) {
            if (!this.isSetup) {
                this.setup(data);
            }
            for (let i = 0, max = data.length; i < max; i++) {
                result.push(this.formatDataIn(validateAndCast(data[i].input), validateAndCast(data[i].output)));
            }
        }
        else {
            throw new Error('unrecognized data');
        }
        return result;
    }
}
function validateAndCast(value) {
    if (typeof value === 'string')
        return value;
    if (typeof value === 'number')
        return value.toString();
    if (typeof value === 'boolean')
        return value.toString();
    if (Array.isArray(value) && typeof value[0] === 'string')
        return value;
    if (typeof value[0] === 'boolean') {
        return value.map((v) => v.toString());
    }
    if (typeof value[0] === 'number') {
        return value.map((v) => v.toString());
    }
    throw new Error('unrecognized value, expected string[], string, number[], number, boolean[], or boolean');
}

function copy(product, left) {
    product.rows = left.rows;
    product.columns = left.columns;
    product.weights = left.weights.slice(0);
    product.deltas = left.deltas.slice(0);
}

/**
 * add {left} and {right} matrix weights into {into}
 */
function add(product, left, right) {
    for (let i = 0; i < left.weights.length; i++) {
        product.weights[i] = left.weights[i] + right.weights[i];
        product.deltas[i] = 0;
    }
}

/**
 * adds {from} deltas to {left} and {right} deltas
 */
function addB(product, left, right) {
    for (let i = 0; i < product.deltas.length; i++) {
        left.deltas[i] = product.deltas[i];
        right.deltas[i] = product.deltas[i];
    }
}

/**
 * makes matrix weights and deltas all ones
 */
function allOnes(product) {
    for (let i = 0; i < product.weights.length; i++) {
        product.weights[i] = 1;
        product.deltas[i] = 0;
    }
}

function cloneNegative(product, left) {
    product.rows = left.rows;
    product.columns = left.columns;
    product.weights = left.weights.slice(0);
    product.deltas = left.deltas.slice(0);
    for (let i = 0; i < left.weights.length; i++) {
        product.weights[i] = -left.weights[i];
        product.deltas[i] = 0;
    }
}

/**
 * multiply {left} and {right} matrix weights to {into}
 */
function multiply(product, left, right) {
    const leftRows = left.rows;
    const leftColumns = left.columns;
    const rightColumns = right.columns;
    // loop over rows of left
    for (let leftRow = 0; leftRow < leftRows; leftRow++) {
        const leftRowBase = leftColumns * leftRow;
        const rightRowBase = rightColumns * leftRow;
        // loop over cols of right
        for (let rightColumn = 0; rightColumn < rightColumns; rightColumn++) {
            // dot product loop
            let dot = 0;
            // loop over columns of left
            for (let leftColumn = 0; leftColumn < leftColumns; leftColumn++) {
                const rightColumnBase = rightColumns * leftColumn;
                const leftIndex = leftRowBase + leftColumn;
                const rightIndex = rightColumnBase + rightColumn;
                dot += left.weights[leftIndex] * right.weights[rightIndex];
                left.deltas[leftIndex] = 0;
                right.deltas[rightIndex] = 0;
            }
            product.weights[rightRowBase + rightColumn] = dot;
        }
    }
}

/**
 * multiplies {from} deltas to {left} and {right}
 */
function multiplyB(product, left, right) {
    const leftRows = left.rows;
    const leftColumns = left.columns;
    const rightColumns = right.columns;
    // loop over rows of left
    for (let leftRowRoot = 0; leftRowRoot < leftRows; leftRowRoot++) {
        const leftRowBase = leftColumns * leftRowRoot;
        const rightRowBase = rightColumns * leftRowRoot;
        // loop over cols of right
        for (let rightColumn = 0; rightColumn < rightColumns; rightColumn++) {
            // loop over columns of left
            for (let leftColumn = 0; leftColumn < leftColumns; leftColumn++) {
                const rightColumnBase = rightColumns * leftColumn;
                const leftRow = leftRowBase + leftColumn;
                const rightRow = rightColumnBase + rightColumn;
                const backPropagateValue = product.deltas[rightRowBase + rightColumn];
                left.deltas[leftRow] += right.weights[rightRow] * backPropagateValue;
                right.deltas[rightRow] += left.weights[leftRow] * backPropagateValue;
            }
        }
    }
}

function multiplyElement(product, left, right) {
    const { weights } = left;
    for (let i = 0; i < weights.length; i++) {
        product.weights[i] = left.weights[i] * right.weights[i];
        product.deltas[i] = 0;
    }
}

/**
 * multiplies {left} and {right} weight by {from} deltas into {left} and {right} deltas
 */
function multiplyElementB(product, left, right) {
    for (let i = 0; i < left.weights.length; i++) {
        left.deltas[i] = right.weights[i] * product.deltas[i];
        right.deltas[i] = left.weights[i] * product.deltas[i];
    }
}

/**
 *
 * relu {m} weights to {into} weights
 */
function relu(product, left) {
    for (let i = 0; i < left.weights.length; i++) {
        product.weights[i] = Math.max(0, left.weights[i]); // relu
        product.deltas[i] = 0;
    }
}

/**
 * adds {from} deltas to {m} deltas when {m} weights are above other a threshold of 0
 */
function reluB(product, left) {
    for (let i = 0; i < product.deltas.length; i++) {
        left.deltas[i] = left.weights[i] > 0 ? product.deltas[i] : 0;
    }
}

function rowPluck(product, left, rowPluckIndex) {
    const { columns } = left;
    const rowBase = columns * rowPluckIndex;
    for (let column = 0; column < columns; column++) {
        product.weights[column] = left.weights[rowBase + column];
        product.deltas[column] = 0;
    }
}

/**
 * adds {from} deltas into {m} deltas
 */
function rowPluckB(product, left, rowIndex) {
    const { columns } = left;
    const rowBase = columns * rowIndex;
    for (let column = 0; column < columns; column++) {
        left.deltas[rowBase + column] = product.deltas[column];
    }
}

function sigmoid(product, left) {
    // sigmoid nonlinearity
    for (let i = 0; i < left.weights.length; i++) {
        product.weights[i] = 1 / (1 + Math.exp(-left.weights[i]));
        product.deltas[i] = 0;
    }
}
// function sig(x) {
//   // helper function for computing sigmoid
//   return 1 / (1 + Math.exp(-x));
// }

function sigmoidB(product, left) {
    for (let i = 0; i < product.deltas.length; i++) {
        const mwi = product.weights[i];
        left.deltas[i] = mwi * (1 - mwi) * product.deltas[i];
    }
}

function softmax(matrix) {
    // probability volume
    const result = new Matrix(matrix.rows, matrix.columns);
    let maxVal = -999999;
    for (let i = 0; i < matrix.weights.length; i++) {
        if (matrix.weights[i] > maxVal) {
            maxVal = matrix.weights[i];
        }
    }
    let s = 0;
    for (let i = 0; i < matrix.weights.length; i++) {
        result.weights[i] = Math.exp(matrix.weights[i] - maxVal);
        s += result.weights[i];
    }
    for (let i = 0; i < matrix.weights.length; i++) {
        result.weights[i] /= s;
    }
    // no backward pass here needed
    // since we will use the computed probabilities outside
    // to set gradients directly on m
    return result;
}

function tanh(product, left) {
    // tanh nonlinearity
    for (let i = 0; i < left.weights.length; i++) {
        product.weights[i] = Math.tanh(left.weights[i]);
        product.deltas[i] = 0;
    }
}

function tanhB(product, left) {
    for (let i = 0; i < product.deltas.length; i++) {
        // grad for z = tanh(x) is (1 - z^2)
        const mwi = product.weights[i];
        left.deltas[i] = (1 - mwi * mwi) * product.deltas[i];
    }
}

class Equation {
    constructor() {
        this.states = [];
        this.inputRow = 0;
    }
    add(left, right) {
        if (left.weights.length !== right.weights.length) {
            throw new Error('misaligned matrices');
        }
        const product = new Matrix(left.rows, left.columns);
        this.states.push({
            name: 'add',
            product,
            left,
            right,
            forwardFn: add,
            backpropagationFn: addB,
        });
        return product;
    }
    allOnes(rows, columns) {
        const product = new Matrix(rows, columns);
        this.states.push({
            name: 'allOnes',
            product,
            left: product,
            forwardFn: allOnes,
            backpropagationFn: () => { },
        });
        return product;
    }
    cloneNegative(matrix) {
        const product = new Matrix(matrix.rows, matrix.columns);
        this.states.push({
            name: 'cloneNegative',
            product,
            left: matrix,
            forwardFn: cloneNegative,
            backpropagationFn: () => { },
        });
        return product;
    }
    /**
     * connects two matrices together by subtract
     */
    subtract(left, right) {
        if (left.weights.length !== right.weights.length) {
            throw new Error('misaligned matrices');
        }
        return this.add(this.add(this.allOnes(left.rows, left.columns), this.cloneNegative(left)), right);
    }
    /**
     * connects two matrices together by multiply
     */
    multiply(left, right) {
        if (left.columns !== right.rows) {
            throw new Error('misaligned matrices');
        }
        const product = new Matrix(left.rows, right.columns);
        this.states.push({
            name: 'multiply',
            product,
            left,
            right,
            forwardFn: multiply,
            backpropagationFn: multiplyB,
        });
        return product;
    }
    /**
     * connects two matrices together by multiplyElement
     */
    multiplyElement(left, right) {
        if (left.weights.length !== right.weights.length) {
            throw new Error('misaligned matrices');
        }
        const product = new Matrix(left.rows, left.columns);
        this.states.push({
            name: 'multiplyElement',
            product,
            left,
            right,
            forwardFn: multiplyElement,
            backpropagationFn: multiplyElementB,
        });
        return product;
    }
    /**
     * connects a matrix to relu
     */
    relu(matrix) {
        const product = new Matrix(matrix.rows, matrix.columns);
        this.states.push({
            name: 'relu',
            product,
            left: matrix,
            forwardFn: relu,
            backpropagationFn: reluB,
        });
        return product;
    }
    /**
     * input a matrix
     */
    input(input) {
        this.states.push({
            name: 'input',
            product: input,
            forwardFn: (product) => {
                if (!this.inputValue)
                    return;
                if (this.inputValue.length !== product.weights.length) {
                    throw new Error('this.inputValue is of wrong dimensions');
                }
                product.weights = input.weights = this.inputValue;
            },
            backpropagationFn: () => { },
        });
        return input;
    }
    /**
     * connects a matrix via a row
     */
    inputMatrixToRow(matrix) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        const product = new Matrix(matrix.columns, 1);
        this.states.push({
            name: 'inputMatrixToRow',
            product,
            left: matrix,
            get right() {
                return self.inputRow;
            },
            forwardFn: rowPluck,
            backpropagationFn: rowPluckB,
        });
        return product;
    }
    /**
     * connects a matrix to sigmoid
     */
    sigmoid(matrix) {
        const product = new Matrix(matrix.rows, matrix.columns);
        this.states.push({
            name: 'sigmoid',
            product,
            left: matrix,
            forwardFn: sigmoid,
            backpropagationFn: sigmoidB,
        });
        return product;
    }
    /**
     * connects a matrix to tanh
     */
    tanh(matrix) {
        const product = new Matrix(matrix.rows, matrix.columns);
        this.states.push({
            name: 'tanh',
            product,
            left: matrix,
            forwardFn: tanh,
            backpropagationFn: tanhB,
        });
        return product;
    }
    /**
     *
     * Observe a matrix for debugging
     */
    observe(matrix) {
        this.states.push({
            name: 'observe',
            product: new Matrix(),
            forwardFn: () => { },
            backpropagationFn: () => { },
        });
        return matrix;
    }
    /**
     * Run index through equations via forward propagation
     */
    runIndex(rowIndex = 0) {
        this.inputRow = rowIndex;
        let state = this.states[0];
        for (let i = 0, max = this.states.length; i < max; i++) {
            state = this.states[i];
            if (!state.hasOwnProperty('forwardFn'))
                continue;
            state.forwardFn(state.product, state.left, state.right);
        }
        return state.product;
    }
    /**
     * Run value through equations via forward propagation
     */
    runInput(inputValue) {
        this.inputValue = inputValue;
        let state = this.states[0];
        for (let i = 0, max = this.states.length; i < max; i++) {
            state = this.states[i];
            if (!state.hasOwnProperty('forwardFn'))
                continue;
            state.forwardFn(state.product, state.left, state.right);
        }
        return state.product;
    }
    /**
     * Run value through equations via back propagation
     */
    backpropagate() {
        let i = this.states.length;
        let state = this.states[0];
        while (i-- > 0) {
            state = this.states[i];
            if (!state.hasOwnProperty('backpropagationFn'))
                continue;
            state.backpropagationFn(state.product, state.left, state.right);
        }
        return state.product;
    }
    /**
     * Run index through equations via back propagation
     */
    backpropagateIndex(rowIndex = 0) {
        this.inputRow = rowIndex;
        let i = this.states.length;
        let state = this.states[0];
        while (i-- > 0) {
            state = this.states[i];
            if (!state.hasOwnProperty('backpropagationFn'))
                continue;
            state.backpropagationFn(state.product, state.left, state.right);
        }
        return state.product;
    }
    /**
     * Predict a target value from equation
     */
    predictTarget(input, target) {
        let errorSum = 0;
        const output = this.runInput(input);
        for (let i = 0; i < output.weights.length; i++) {
            const error = output.weights[i] - target[i];
            // set gradients into log probabilities
            errorSum += Math.abs(error);
            // write gradients into log probabilities
            output.deltas[i] = error;
        }
        return errorSum;
    }
    /**
     * Predict a target index from equation
     */
    predictTargetIndex(input, target) {
        const output = this.runIndex(input);
        // set gradients into log probabilities
        const logProbabilities = output; // interpret output as log probabilities
        const probabilities = softmax(output); // compute the softmax probabilities
        // write gradients into log probabilities
        logProbabilities.deltas = probabilities.weights.slice(0);
        logProbabilities.deltas[target] -= 1;
        // accumulate base 2 log prob and do smoothing
        return -Math.log2(probabilities.weights[target]);
    }
}

function maxI(matrix) {
    // argmax of array w
    const { weights } = matrix;
    let maxv = weights[0];
    let maxix = 0;
    for (let i = 1; i < weights.length; i++) {
        const v = weights[i];
        if (v < maxv)
            continue;
        maxix = i;
        maxv = v;
    }
    return maxix;
}

function sampleI(matrix) {
    // sample argmax from w, assuming w are
    // probabilities that sum to one
    const r = randomFloat(0, 1);
    const w = matrix.weights;
    let x = 0;
    let i = 0;
    while (true) {
        x += w[i];
        if (x > r) {
            return i;
        }
        i++;
    }
}

const trainDefaults$1 = {
    iterations: 20000,
    errorThresh: 0.005,
    log: false,
    logPeriod: 10,
    learningRate: 0.01,
    callbackPeriod: 10,
    timeout: Infinity,
};
const defaults$1 = () => {
    return {
        inputSize: 20,
        inputRange: 20,
        hiddenLayers: [20, 20],
        outputSize: 20,
        decayRate: 0.999,
        smoothEps: 1e-8,
        regc: 0.000001,
        clipval: 5,
        maxPredictionLength: 100,
        dataFormatter: new DataFormatter(),
    };
};
class RNN {
    constructor(options = {}) {
        this.options = { ...defaults$1() };
        this.trainOpts = { ...trainDefaults$1 };
        this.stepCache = {};
        this.runs = 0;
        this.ratioClipped = 0;
        this.model = Object.seal({
            isInitialized: false,
            input: new Matrix(0, 0),
            hiddenLayers: [],
            output: new Matrix(0, 0),
            equations: [],
            allMatrices: [],
            equationConnections: [],
            outputConnector: new RandomMatrix(0, 0, 0.08),
        });
        this.initialLayerInputs = [];
        this.options = { ...this.options, ...options };
        this.updateTrainingOptions({
            ...trainDefaults$1,
        });
        if (options.json) {
            this.fromJSON(options.json);
        }
    }
    initialize() {
        const { dataFormatter } = this.options;
        if (dataFormatter === null || dataFormatter === void 0 ? void 0 : dataFormatter.characters.length) {
            this.options.inputSize = this.options.inputRange = this.options.outputSize =
                dataFormatter.characters.length;
        }
        this.model = this.mapModel();
    }
    createHiddenLayers() {
        const { hiddenLayers, inputSize } = this.options;
        const hiddenLayersModel = [];
        // 0 is end, so add 1 to offset
        hiddenLayersModel.push(this.getHiddenLayer(hiddenLayers[0], inputSize));
        let prevSize = hiddenLayers[0];
        for (let d = 1; d < hiddenLayers.length; d++) {
            // loop over depths
            const hiddenSize = hiddenLayers[d];
            hiddenLayersModel.push(this.getHiddenLayer(hiddenSize, prevSize));
            prevSize = hiddenSize;
        }
        return hiddenLayersModel;
    }
    getHiddenLayer(hiddenSize, prevSize) {
        return {
            // wxh
            weight: new RandomMatrix(hiddenSize, prevSize, 0.08),
            // whh
            transition: new RandomMatrix(hiddenSize, hiddenSize, 0.08),
            // bhh
            bias: new Matrix(hiddenSize, 1),
        };
    }
    getEquation(equation, inputMatrix, previousResult, hiddenLayer) {
        if (!hiddenLayer.weight || !hiddenLayer.transition || !hiddenLayer.bias) {
            throw new Error('hiddenLayer does not have expected properties');
        }
        const relu = equation.relu.bind(equation);
        const add = equation.add.bind(equation);
        const multiply = equation.multiply.bind(equation);
        return relu(add(add(multiply(hiddenLayer.weight, inputMatrix), multiply(hiddenLayer.transition, previousResult)), hiddenLayer.bias));
    }
    createInputMatrix() {
        const { inputRange, inputSize } = this.options;
        if (inputRange < 1)
            throw new Error('this.options.inputRange not an expected number');
        if (inputSize < 1)
            throw new Error('this.options.inputSize not an expected number');
        // 0 is end, so add 1 to offset
        return new RandomMatrix(inputRange + 1, inputSize, 0.08);
    }
    createOutputMatrices() {
        const { outputSize, hiddenLayers } = this.options;
        const lastHiddenSize = last(hiddenLayers);
        // 0 is end, so add 1 to offset
        return {
            // whd
            outputConnector: new RandomMatrix(outputSize + 1, lastHiddenSize, 0.08),
            // 0 is end, so add 1 to offset
            // bd
            output: new Matrix(outputSize + 1, 1),
        };
    }
    bindEquation() {
        const { model } = this;
        const { hiddenLayers } = this.options;
        const equation = new Equation();
        const outputs = [];
        const equationConnection = model.equationConnections.length > 0
            ? last(model.equationConnections)
            : this.initialLayerInputs;
        // 0 index
        let output = this.getEquation(equation, equation.inputMatrixToRow(model.input), equationConnection[0], model.hiddenLayers[0]);
        outputs.push(output);
        // 1+ indices
        for (let i = 1, max = hiddenLayers.length; i < max; i++) {
            if (!equationConnection[i]) {
                throw new Error(`Cannot find equation at index ${i}`);
            }
            output = this.getEquation(equation, output, equationConnection[i], model.hiddenLayers[i]);
            outputs.push(output);
        }
        model.equationConnections.push(outputs);
        equation.add(equation.multiply(model.outputConnector, output), model.output);
        model.equations.push(equation);
    }
    mapModel() {
        const allMatrices = [];
        this.initialLayerInputs = this.options.hiddenLayers.map((size) => new Matrix(size, 1));
        const input = this.createInputMatrix();
        allMatrices.push(input);
        const hiddenLayers = this.createHiddenLayers();
        if (!hiddenLayers.length)
            throw new Error('net.hiddenLayers not set');
        for (let i = 0, max = hiddenLayers.length; i < max; i++) {
            const hiddenMatrix = hiddenLayers[i];
            for (const property in hiddenMatrix) {
                if (!hiddenMatrix.hasOwnProperty(property))
                    continue;
                allMatrices.push(hiddenMatrix[property]);
            }
        }
        const { output, outputConnector } = this.createOutputMatrices();
        allMatrices.push(outputConnector);
        allMatrices.push(output);
        return Object.seal({
            isInitialized: true,
            input,
            hiddenLayers,
            output,
            equations: [],
            allMatrices,
            equationConnections: [],
            outputConnector,
        });
    }
    trainInput(input) {
        this.runs++;
        const { model } = this;
        const max = input.length;
        let log2ppl = 0;
        let equation;
        while (model.equations.length <= input.length + 1) {
            // last is zero
            this.bindEquation();
        }
        for (let inputIndex = -1, inputMax = input.length; inputIndex < inputMax; inputIndex++) {
            // start and end tokens are zeros
            const equationIndex = inputIndex + 1;
            equation = model.equations[equationIndex];
            const source = inputIndex === -1 ? 0 : input[inputIndex] + 1; // first step: start with START token
            const target = inputIndex === max - 1 ? 0 : input[inputIndex + 1] + 1; // last step: end with END token
            log2ppl += equation.predictTargetIndex(source, target);
        }
        return Math.pow(2, log2ppl / (max - 1)) / 100;
    }
    backpropagate(input) {
        let i = input.length;
        const { model } = this;
        const { equations } = model;
        while (i > 0) {
            equations[i].backpropagateIndex(input[i - 1] + 1);
            i--;
        }
        equations[0].backpropagateIndex(0);
    }
    adjustWeights() {
        const { regc, clipval, decayRate, smoothEps } = this.options;
        const { trainOpts, model, stepCache } = this;
        const { learningRate } = trainOpts;
        const { allMatrices } = model;
        let numClipped = 0;
        let numTot = 0;
        for (let matrixIndex = 0; matrixIndex < allMatrices.length; matrixIndex++) {
            const matrix = allMatrices[matrixIndex];
            const { weights, deltas } = matrix;
            if (!(matrixIndex in stepCache)) {
                stepCache[matrixIndex] = zeros$1(matrix.rows * matrix.columns);
            }
            const cache = stepCache[matrixIndex];
            for (let i = 0; i < weights.length; i++) {
                let r = deltas[i];
                const w = weights[i];
                // rmsprop adaptive learning rate
                cache[i] = cache[i] * decayRate + (1 - decayRate) * r * r;
                // gradient clip
                if (r > clipval) {
                    r = clipval;
                    numClipped++;
                }
                else if (r < -clipval) {
                    r = -clipval;
                    numClipped++;
                }
                numTot++;
                // update (and regularize)
                weights[i] =
                    w + (-learningRate * r) / Math.sqrt(cache[i] + smoothEps) - regc * w;
            }
        }
        this.ratioClipped = numClipped / numTot;
    }
    get isRunnable() {
        if (this.model && this.model.equations.length === 0) {
            console.error(`No equations bound, did you run train()?`);
            return false;
        }
        return true;
    }
    checkRunnable() {
        if (!this.isRunnable) {
            throw new Error('Network not runnable');
        }
    }
    run(rawInput = [], isSampleI = false, temperature = 1) {
        const maxPredictionLength = this.options.maxPredictionLength +
            (rawInput !== null ? rawInput.length : 0) +
            (this.options.dataFormatter
                ? this.options.dataFormatter.specialIndexes.length
                : 0);
        this.checkRunnable();
        const input = this.options.dataFormatter && rawInput.length > 0
            ? this.options.dataFormatter.formatDataIn(rawInput)
            : rawInput;
        const { model } = this;
        const output = [];
        let i = 0;
        while (true) {
            const previousIndex = i === 0 ? 0 : i < input.length ? input[i - 1] + 1 : output[i - 1];
            while (model.equations.length <= i) {
                this.bindEquation();
            }
            const equation = model.equations[i];
            // sample predicted letter
            const outputMatrix = equation.runIndex(previousIndex);
            const logProbabilities = new Matrix(model.output.rows, model.output.columns);
            copy(logProbabilities, outputMatrix);
            if (temperature !== 1 && isSampleI) {
                /**
                 * scale log probabilities by temperature and re-normalize
                 * if temperature is high, logProbabilities will go towards zero
                 * and the softmax outputs will be more diffuse. if temperature is
                 * very low, the softmax outputs will be more peaky
                 */
                for (let j = 0, max = logProbabilities.weights.length; j < max; j++) {
                    logProbabilities.weights[j] /= temperature;
                }
            }
            const probs = softmax(logProbabilities);
            const nextIndex = isSampleI ? sampleI(probs) : maxI(probs);
            i++;
            if (nextIndex === 0) {
                // END token predicted, break out
                break;
            }
            if (i >= maxPredictionLength) {
                // something is wrong
                break;
            }
            output.push(nextIndex);
        }
        /**
         * we slice the input length here, not because output contains it, but it will be erroneous as we are sending the
         * network what is contained in input, so the data is essentially guessed by the network what could be next, till it
         * locks in on a value.
         * Kind of like this, values are from input:
         * 0 -> 4 (or in English: "beginning on input" -> "I have no idea? I'll guess what they want next!")
         * 2 -> 2 (oh how interesting, I've narrowed down values...)
         * 1 -> 9 (oh how interesting, I've now know what the values are...)
         * then the output looks like: [4, 2, 9,...]
         * so we then remove the erroneous data to get our true output
         */
        return this.options.dataFormatter.formatDataOut(input, output.slice(input.length).map((value) => value - 1));
    }
    /**
     *
     * Verifies network sizes are initialized
     * If they are not it will initialize them
     */
    verifyIsInitialized() {
        if (!this.model.isInitialized) {
            this.initialize();
        }
    }
    /**
     *
     * @param options
     *    Supports all `trainDefaults` properties
     *    also supports:
     *       learningRate: (number),
     *       momentum: (number),
     *       activation: 'sigmoid', 'relu', 'leaky-relu', 'tanh'
     */
    updateTrainingOptions(options) {
        var _a;
        this.trainOpts = { ...trainDefaults$1, ...options };
        this.validateTrainingOptions(this.trainOpts);
        this.setLogMethod((_a = options.log) !== null && _a !== void 0 ? _a : this.trainOpts.log);
        // TODO: Remove this?
        // this.activation = options.activation || this.activation;
    }
    validateTrainingOptions(options) {
        const validations = {
            iterations: () => {
                const val = options.iterations;
                return typeof val === 'number' && val > 0;
            },
            errorThresh: () => {
                const val = options.errorThresh;
                return typeof val === 'number' && val > 0 && val < 1;
            },
            log: () => {
                const val = options.log;
                return typeof val === 'function' || typeof val === 'boolean';
            },
            logPeriod: () => {
                const val = options.logPeriod;
                return typeof val === 'number' && val > 0;
            },
            learningRate: () => {
                const val = options.learningRate;
                return typeof val === 'number' && val > 0 && val < 1;
            },
            callback: () => {
                const val = options.callback;
                return typeof val === 'function' || val === undefined;
            },
            callbackPeriod: () => {
                const val = options.callbackPeriod;
                return typeof val === 'number' && val > 0;
            },
            timeout: () => {
                const val = options.timeout;
                return typeof val === 'number' && val > 0;
            },
        };
        for (const p in validations) {
            const v = options;
            if (!validations[p]()) {
                throw new Error(`[${p}, ${v[p]}] is out of normal training range, your network will probably not train.`);
            }
        }
    }
    setLogMethod(log) {
        if (typeof log === 'function') {
            this.trainOpts.log = log;
        }
        else if (log) {
            this.trainOpts.log = console.log;
        }
        else {
            this.trainOpts.log = false;
        }
    }
    prepTraining(data, options) {
        var _a;
        this.updateTrainingOptions(options);
        const preparedData = this.options.dataFormatter.format(data);
        const endTime = Date.now() + ((_a = this.trainOpts.timeout) !== null && _a !== void 0 ? _a : 0);
        const status = {
            error: 1,
            iterations: 0,
        };
        this.verifyIsInitialized();
        return {
            preparedData,
            status,
            endTime,
        };
    }
    train(data, trainOpts = {}) {
        var _a;
        this.trainOpts = trainOpts = {
            ...trainDefaults$1,
            ...trainOpts,
        };
        const { iterations, errorThresh, logPeriod, callback, callbackPeriod, } = this.trainOpts;
        const log = trainOpts.log === true ? console.log : trainOpts.log;
        let error = Infinity;
        let i;
        let inputs;
        if ((_a = this.options) === null || _a === void 0 ? void 0 : _a.dataFormatter) {
            inputs = this.options.dataFormatter.format(data);
        }
        else if (Array.isArray(data) &&
            Array.isArray(data[0]) &&
            typeof data[0][0] === 'number') {
            inputs = data;
        }
        else {
            throw new Error('training not in expected format of number[][]');
        }
        this.verifyIsInitialized();
        for (i = 0; i < iterations && error > errorThresh; i++) {
            let sum = 0;
            for (let j = 0; j < inputs.length; j++) {
                const err = this.trainPattern(inputs[j], true);
                sum += err;
            }
            error = sum / data.length;
            if (isNaN(error)) {
                throw new Error('Network error rate is unexpected NaN, check network configurations and try again. Most probably input format is not correct or training data is not enough. ');
            }
            if (log && i % logPeriod === 0) {
                log(`iterations: ${i}, training error: ${error}`);
            }
            if (callback && i % callbackPeriod === 0) {
                callback({ error, iterations: i });
            }
        }
        return {
            error,
            iterations: i,
        };
    }
    addFormat(data) { }
    formatData(data) {
        const result = [];
        for (let i = 0; i < data.length; i++) {
            result.push(this.options.dataFormatter.formatDataIn(data[i]));
        }
        return result;
    }
    toJSON() {
        if (!this.model.isInitialized) {
            this.initialize();
        }
        const { model, options } = this;
        return {
            type: this.constructor.name,
            options: { ...options, dataFormatter: options.dataFormatter.toJSON() },
            trainOpts: {
                ...this.trainOpts,
                timeout: this.trainOpts.timeout === Infinity
                    ? 'Infinity'
                    : this.trainOpts.timeout,
            },
            input: model.input.toJSON(),
            hiddenLayers: model.hiddenLayers.map((hiddenLayer) => {
                const layers = {};
                for (const p in hiddenLayer) {
                    if (!hiddenLayer.hasOwnProperty(p))
                        continue;
                    layers[p] = hiddenLayer[p].toJSON();
                }
                return layers;
            }),
            outputConnector: this.model.outputConnector.toJSON(),
            output: this.model.output.toJSON(),
        };
    }
    fromJSON(json) {
        const { options } = json;
        const allMatrices = [];
        const input = Matrix.fromJSON(json.input);
        allMatrices.push(input);
        const hiddenLayers = [];
        json.hiddenLayers.forEach((hiddenLayer) => {
            const layers = {};
            for (const p in hiddenLayer) {
                layers[p] = Matrix.fromJSON(hiddenLayer[p]);
                allMatrices.push(layers[p]);
            }
            hiddenLayers.push(layers);
        });
        const outputConnector = Matrix.fromJSON(json.outputConnector);
        allMatrices.push(outputConnector);
        const output = Matrix.fromJSON(json.output);
        allMatrices.push(output);
        if (options.dataFormatter) {
            this.options = {
                ...defaults$1(),
                ...options,
                dataFormatter: DataFormatter.fromJSON(options.dataFormatter),
            };
        }
        else {
            this.options = {
                ...defaults$1(),
                ...options,
                dataFormatter: new DataFormatter(),
            };
        }
        this.model = Object.seal({
            isInitialized: true,
            input,
            hiddenLayers,
            output,
            allMatrices,
            outputConnector,
            equations: [],
            equationConnections: [],
        });
        this.initialLayerInputs = this.options.hiddenLayers.map((size) => new Matrix(size, 1));
        this.bindEquation();
        return this;
    }
    toFunction(cb) {
        const { model } = this;
        const { equations } = this.model;
        const equation = equations[1];
        const { states } = equation;
        const jsonString = JSON.stringify(this.toJSON());
        function previousConnectionIndex(m) {
            const connection = model.equationConnections[0];
            const { states } = equations[0];
            for (let i = 0, max = states.length; i < max; i++) {
                if (states[i].product === m) {
                    return i;
                }
            }
            return connection.indexOf(m);
        }
        function matrixOrigin(m, stateIndex) {
            for (let i = 0, max = states.length; i < max; i++) {
                const state = states[i];
                if (i === stateIndex) {
                    const j = previousConnectionIndex(m);
                    if (j > -1 && (m === state.left || m === state.right)) {
                        return `typeof prevStates[${j}] === 'object' ? prevStates[${j}].product : new Matrix(${m.rows}, ${m.columns})`;
                    }
                    return `new Matrix(${m.rows}, ${m.columns})`;
                }
                if (m === state.product)
                    return `states[${i}].product`;
                if (m === state.right)
                    return `states[${i}].right`;
                if (m === state.left)
                    return `states[${i}].left`;
            }
            return '';
        }
        function matrixToString(m, stateIndex) {
            if (!m || !m.rows || !m.columns)
                return 'null';
            if (m === model.input)
                return `json.input`;
            if (m === model.outputConnector)
                return `json.outputConnector`;
            if (m === model.output)
                return `json.output`;
            for (let i = 0, max = model.hiddenLayers.length; i < max; i++) {
                const hiddenLayer = model.hiddenLayers[i];
                for (const p in hiddenLayer) {
                    if (!hiddenLayer.hasOwnProperty(p))
                        continue;
                    if (hiddenLayer[p] !== m)
                        continue;
                    return `json.hiddenLayers[${i}].${p}`;
                }
            }
            return matrixOrigin(m, stateIndex);
        }
        function toInner(fnString) {
            // crude, but should be sufficient for now
            // function() { body }
            const fnParts = fnString.toString().split('{');
            fnParts.shift();
            // body }
            const fnBodyString = fnParts.join('{');
            const fnBodyParts = fnBodyString.split('}');
            fnBodyParts.pop();
            // body
            return fnBodyParts
                .join('}')
                .split('\n')
                .join('\n        ')
                .replace('product.deltas[i] = 0;', '')
                .replace('product.deltas[column] = 0;', '')
                .replace('left.deltas[leftIndex] = 0;', '')
                .replace('right.deltas[rightIndex] = 0;', '')
                .replace('product.deltas = left.deltas.slice(0);', '');
        }
        function fileName(fnName) {
            return `src/recurrent/matrix/${fnName.replace(/[A-Z]/g, function (value) {
            return `-${value.toLowerCase()}`;
        })}.js`;
        }
        const statesRaw = [];
        const usedFunctionNames = {};
        const innerFunctionsSwitch = [];
        for (let i = 0, max = states.length; i < max; i++) {
            const state = states[i];
            statesRaw.push(`states[${i}] = {
  name: '${state.forwardFn.name}',
  left: ${state.left ? matrixToString(state.left, i) : 'undefined'},
  right: ${state.right ? matrixToString(state.right, i) : 'undefined'},
  product: ${matrixToString(state.product, i)}
}`);
            const fnName = state.forwardFn.name;
            if (!usedFunctionNames[fnName]) {
                usedFunctionNames[fnName] = true;
                innerFunctionsSwitch.push(`        case '${fnName}': //compiled from ${fileName(fnName)}
      ${toInner(state.forwardFn.toString())}
      break;`);
            }
        }
        const src = `
if (typeof rawInput === 'undefined') rawInput = [];
if (typeof isSampleI === 'undefined') isSampleI = false;
if (typeof temperature === 'undefined') temperature = 1;
var json = ${jsonString};
${this.options.dataFormatter
        ? `${this.options.dataFormatter.toFunctionString()};
Object.assign(dataFormatter, json.options.dataFormatter);`
        : ''}
${this.options.dataFormatter &&
        typeof this.options.dataFormatter.formatDataIn === 'function'
        ? `const formatDataIn = function (input, output) { ${toInner(this.options.dataFormatter.formatDataIn.toString())} }.bind(dataFormatter);`
        : ''}
${this.options.dataFormatter !== null &&
        typeof this.options.dataFormatter.formatDataOut === 'function'
        ? `const formatDataOut = function formatDataOut(input, output) { ${toInner(this.options.dataFormatter.formatDataOut.toString())} }.bind(dataFormatter);`
        : ''}
var maxPredictionLength =
${this.options.maxPredictionLength} +
rawInput.length +
${this.options.dataFormatter
        ? this.options.dataFormatter.specialIndexes.length
        : 0};
var input = ${this.options.dataFormatter &&
        typeof this.options.dataFormatter.formatDataIn === 'function'
        ? 'formatDataIn(rawInput)'
        : 'rawInput'};
var _i = 0;
var output = [];
var states = [];
var prevStates;
while (true) {
var previousIndex = (_i === 0
    ? 0
    : _i < input.length
      ? input[_i - 1] + 1
      : output[_i - 1])
      ;
var rowPluckIndex = previousIndex;
prevStates = states;
states = [];
${statesRaw.join(';\n    ')};
for (var stateIndex = 0, stateMax = ${statesRaw.length}; stateIndex < stateMax; stateIndex++) {
  var state = states[stateIndex];
  var product = state.product;
  var left = state.left;
  var right = state.right;
  switch (state.name) {
${innerFunctionsSwitch.join('\n')}
  }
}

var logProbabilities = state.product;
if (temperature !== 1 && isSampleI) {
  for (var q = 0, nq = logProbabilities.weights.length; q < nq; q++) {
    logProbabilities.weights[q] /= temperature;
  }
}

var probs = softmax(logProbabilities);
var nextIndex = isSampleI ? sampleI(probs) : maxI(probs);

_i++;
if (nextIndex === 0) {
  break;
}
if (_i >= maxPredictionLength) {
  break;
}

output.push(nextIndex);
}
${this.options.dataFormatter &&
        typeof this.options.dataFormatter.formatDataOut === 'function'
        ? 'return formatDataOut(input, output.slice(input.length).map(function(value) { return value - 1; }))'
        : 'return output.slice(input.length).map(function(value) { return value - 1; })'};
function Matrix(rows, columns) {
this.rows = rows;
this.columns = columns;
this.weights = zeros(rows * columns);
}
${zeros$1.toString()}
${softmax.toString().replace('_1.Matrix', 'Matrix')}
${randomFloat.toString()}
${sampleI.toString()}
${maxI.toString()}`;
        // eslint-disable-next-line
        return new Function('rawInput', 'isSampleI', 'temperature', cb ? cb(src) : src);
    }
    trainPattern(input, logErrorRate) {
        const error = this.trainInput(input);
        this.backpropagate(input);
        this.adjustWeights();
        if (logErrorRate) {
            return error;
        }
        return 0;
    }
}
function last(values) {
    return values[values.length - 1];
}

class GRU extends RNN {
    getHiddenLayer(hiddenSize, prevSize) {
        return getGRUHiddenLayer(hiddenSize, prevSize);
    }
    getEquation(equation, inputMatrix, previousResult, hiddenLayer) {
        return getGRUEquation(equation, inputMatrix, previousResult, hiddenLayer);
    }
}
function getGRUHiddenLayer(hiddenSize, prevSize) {
    return {
        // update Gate
        // wzxh
        updateGateInputMatrix: new RandomMatrix(hiddenSize, prevSize, 0.08),
        updateGateHiddenMatrix: new RandomMatrix(hiddenSize, hiddenSize, 0.08),
        updateGateBias: new Matrix(hiddenSize, 1),
        // reset Gate
        // wrxh
        resetGateInputMatrix: new RandomMatrix(hiddenSize, prevSize, 0.08),
        resetGateHiddenMatrix: new RandomMatrix(hiddenSize, hiddenSize, 0.08),
        resetGateBias: new Matrix(hiddenSize, 1),
        // cell write parameters
        // wcxh
        cellWriteInputMatrix: new RandomMatrix(hiddenSize, prevSize, 0.08),
        cellWriteHiddenMatrix: new RandomMatrix(hiddenSize, hiddenSize, 0.08),
        cellWriteBias: new Matrix(hiddenSize, 1),
    };
}
function getGRUEquation(equation, inputMatrix, previousResult, hiddenLayer) {
    if (!hiddenLayer.updateGateInputMatrix ||
        !hiddenLayer.updateGateHiddenMatrix ||
        !hiddenLayer.updateGateBias ||
        !hiddenLayer.resetGateInputMatrix ||
        !hiddenLayer.resetGateHiddenMatrix ||
        !hiddenLayer.resetGateBias ||
        !hiddenLayer.cellWriteInputMatrix ||
        !hiddenLayer.cellWriteHiddenMatrix ||
        !hiddenLayer.cellWriteBias) {
        throw new Error('hiddenLayer does not have expected properties');
    }
    const sigmoid = equation.sigmoid.bind(equation);
    const add = equation.add.bind(equation);
    const multiply = equation.multiply.bind(equation);
    const multiplyElement = equation.multiplyElement.bind(equation);
    const tanh = equation.tanh.bind(equation);
    const allOnes = equation.allOnes.bind(equation);
    const cloneNegative = equation.cloneNegative.bind(equation);
    // update gate
    const updateGate = sigmoid(add(add(multiply(hiddenLayer.updateGateInputMatrix, inputMatrix), multiply(hiddenLayer.updateGateHiddenMatrix, previousResult)), hiddenLayer.updateGateBias));
    // reset gate
    const resetGate = sigmoid(add(add(multiply(hiddenLayer.resetGateInputMatrix, inputMatrix), multiply(hiddenLayer.resetGateHiddenMatrix, previousResult)), hiddenLayer.resetGateBias));
    // cell
    const cell = tanh(add(add(multiply(hiddenLayer.cellWriteInputMatrix, inputMatrix), multiply(hiddenLayer.cellWriteHiddenMatrix, multiplyElement(resetGate, previousResult))), hiddenLayer.cellWriteBias));
    // compute hidden state as gated, saturated cell activations
    // negate updateGate
    return add(multiplyElement(add(allOnes(updateGate.rows, updateGate.columns), cloneNegative(updateGate)), cell), multiplyElement(previousResult, updateGate));
}

class ArrayLookupTable {
    constructor(data, prop) {
        this.prop = prop;
        this.length = 0;
        this.table = {};
        for (let i = 0; i < data.length; i++) {
            const datum = data[i];
            const ioValue = datum[prop];
            for (let j = 0; j < ioValue.length; j++) {
                const value = ioValue[j];
                for (const p in value) {
                    if (!value.hasOwnProperty(p))
                        continue;
                    if (this.table.hasOwnProperty(p))
                        continue;
                    this.table[p] = this.length++;
                }
            }
        }
    }
}

const defaults = () => {
    return {
        ...defaults$1(),
        inputSize: 1,
        hiddenLayers: [20],
        outputSize: 1,
        inputRange: 0,
    };
};
class RNNTimeStep extends RNN {
    constructor(options = {}) {
        super();
        this.inputLookupLength = 0;
        this.inputLookup = null;
        this.outputLookup = null;
        this.outputLookupLength = 0;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        this.model = Object.seal({
            isInitialized: false,
            hiddenLayers: [],
            output: new Matrix(0, 0),
            equations: [],
            allMatrices: [],
            equationConnections: [],
            outputConnector: new RandomMatrix(0, 0, 0.08),
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        this.options = defaults();
        this.options = { ...this.options, ...options };
        this.updateTrainingOptions({
            ...trainDefaults,
            ...options,
        });
        if (options.json) {
            this.fromJSON(options.json);
        }
    }
    createInputMatrix() {
        throw new Error('Input Matrices do not exist on RNNTimeStep');
    }
    createOutputMatrices() {
        const { outputSize } = this.options;
        const lastHiddenSize = last(this.options.hiddenLayers);
        // whd
        const outputConnector = new RandomMatrix(outputSize, lastHiddenSize, 0.08);
        // bd
        const output = new RandomMatrix(outputSize, 1, 0.08);
        return { output, outputConnector };
    }
    bindEquation() {
        const { model, options } = this;
        const { hiddenLayers, inputSize } = options;
        const layers = model.hiddenLayers;
        const equation = new Equation();
        const outputs = [];
        const equationConnection = model.equationConnections.length > 0
            ? model.equationConnections[model.equationConnections.length - 1]
            : this.initialLayerInputs;
        // 0 index
        let output = this.getEquation(equation, equation.input(new Matrix(inputSize, 1)), equationConnection[0], layers[0]);
        outputs.push(output);
        // 1+ indices
        for (let i = 1, max = hiddenLayers.length; i < max; i++) {
            output = this.getEquation(equation, output, equationConnection[i], layers[i]);
            outputs.push(output);
        }
        model.equationConnections.push(outputs);
        equation.add(equation.multiply(model.outputConnector, output), model.output);
        model.equations.push(equation);
    }
    initialize() {
        this.model = this.mapModel();
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    mapModel() {
        const allMatrices = [];
        this.initialLayerInputs = this.options.hiddenLayers.map((size) => new Matrix(size, 1));
        const hiddenLayers = this.createHiddenLayers();
        for (let i = 0, max = hiddenLayers.length; i < max; i++) {
            const hiddenMatrix = hiddenLayers[i];
            for (const property in hiddenMatrix) {
                if (!hiddenMatrix.hasOwnProperty(property))
                    continue;
                allMatrices.push(hiddenMatrix[property]);
            }
        }
        const { outputConnector, output } = this.createOutputMatrices();
        allMatrices.push(outputConnector);
        allMatrices.push(output);
        return Object.seal({
            isInitialized: true,
            hiddenLayers,
            output,
            equations: [],
            allMatrices,
            equationConnections: [],
            outputConnector,
        });
    }
    backpropagate() {
        for (let i = this.model.equations.length - 1; i > -1; i--) {
            this.model.equations[i].backpropagate();
        }
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    run(rawInput) {
        const shape = lookup.dataShape(rawInput).join(',');
        switch (shape) {
            case 'array,number':
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                return this.runArray(rawInput);
            case 'array,array,number':
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                return this.runArrayOfArray(rawInput);
            case 'object,number':
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                return this.runObject(rawInput); // Backward compatibility, will be result of `unknown` and need casting.  Better to just use net.runObject() directly
            case 'array,object,number':
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                return this.runArrayOfObject(rawInput);
            default:
                throw new Error(`Unrecognized data shape ${shape}`);
        }
    }
    forecast(rawInput, count = 1) {
        const shape = lookup.dataShape(rawInput).join(',');
        switch (shape) {
            case 'array,number':
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                return this.forecastArray(rawInput, count);
            case 'array,array,number':
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                return this.forecastArrayOfArray(rawInput, count);
            case 'object,number':
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                return this.runObject(rawInput);
            case 'array,object,number':
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                return this.forecastArrayOfObject(rawInput, count);
            default:
                throw new Error(`Unrecognized data shape ${shape}`);
        }
    }
    forecastArray(input, count = 1) {
        this.checkRunnable();
        const { model } = this;
        const { equations } = model;
        const length = input.length + count;
        while (equations.length <= length) {
            this.bindEquation();
        }
        let lastOutput;
        let equationIndex = 0;
        if (this.options.inputSize === 1) {
            for (let i = 0; i < input.length; i++) {
                lastOutput = equations[equationIndex++].runInput(Float32Array.from([input[i]]));
            }
        }
        else {
            for (let i = 0; i < input.length; i++) {
                lastOutput = equations[equationIndex++].runInput(Float32Array.from([]));
            }
        }
        if (!lastOutput) {
            throw new Error('lastOutput not set');
        }
        const result = [lastOutput.weights[0]];
        for (let i = 0, max = count - 1; i < max; i++) {
            lastOutput = equations[equationIndex++].runInput(lastOutput.weights);
            result.push(lastOutput.weights[0]);
        }
        this.end();
        return Float32Array.from(result);
    }
    forecastArrayOfArray(input, count = 1) {
        this.checkRunnable();
        const { model } = this;
        const { equations } = model;
        const length = input.length + count;
        while (equations.length <= length) {
            this.bindEquation();
        }
        let lastOutput;
        let equationIndex = 0;
        for (let i = 0; i < input.length; i++) {
            lastOutput = equations[equationIndex++].runInput(input[i]);
        }
        if (!lastOutput) {
            throw new Error('lastOutput not set');
        }
        const result = [Float32Array.from(lastOutput.weights)];
        for (let i = 0, max = count - 1; i < max; i++) {
            lastOutput = equations[equationIndex++].runInput(lastOutput.weights);
            result.push(Float32Array.from(lastOutput.weights.slice(0)));
        }
        this.end();
        return result;
    }
    forecastArrayOfObject(input, count = 1) {
        if (!this.inputLookup) {
            throw new Error('this.inputLookup not set');
        }
        if (!this.outputLookup) {
            throw new Error('this.outputLookup not set');
        }
        const formattedData = input.map((value) => lookup.toArray(this.inputLookup, value, this.inputLookupLength));
        return this.forecastArrayOfArray(formattedData, count).map((value) => lookup.toObject(this.outputLookup, value));
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    train(data, trainOpts = {}) {
        this.trainOpts = trainOpts = {
            ...trainDefaults$1,
            ...trainOpts,
        };
        // Don't destructure here because this.setSize() can reset this.options.
        if (this.options.inputSize === 1 && this.options.outputSize === 1) {
            this.setSize(data);
        }
        this.verifySize();
        const formattedData = this.formatData(data);
        let error = Infinity;
        let i;
        this.verifyIsInitialized();
        const { iterations, errorThresh, logPeriod, callback, callbackPeriod, } = this.trainOpts;
        const log = trainOpts.log === true ? console.log : trainOpts.log;
        for (i = 0; i < iterations && error > errorThresh; i++) {
            let sum = 0;
            for (let j = 0; j < formattedData.length; j++) {
                const err = this.trainPattern(formattedData[j], true);
                sum += err;
            }
            error = sum / formattedData.length;
            if (isNaN(error))
                throw new Error('Network error rate is unexpected NaN, check network configurations and try again. Most probably input format is not correct or training data is not enough. ');
            if (log && i % logPeriod === 0) {
                log(`iterations: ${i}, training error: ${error}`);
            }
            if (callback && i % callbackPeriod === 0) {
                callback({ error, iterations: i });
            }
        }
        return {
            error,
            iterations: i,
        };
    }
    trainArrayOfArray(input) {
        if (input.length < 2) {
            throw new Error('input must be an array of 2 or more');
        }
        const { equations } = this.model;
        while (equations.length < input.length) {
            this.bindEquation();
        }
        let errorSum = 0;
        for (let i = 0, max = input.length - 1; i < max; i++) {
            errorSum += equations[i].predictTarget(input[i], input[i + 1]);
        }
        this.end();
        return errorSum / input.length;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    trainPattern(input, logErrorRate) {
        const error = this.trainArrayOfArray(input);
        this.backpropagate();
        this.adjustWeights();
        if (logErrorRate) {
            return error;
        }
        return 0;
    }
    setSize(data) {
        let size = 0;
        const dataShape = lookup.dataShape(data).join(',');
        switch (dataShape) {
            case 'array,array,number':
            case 'array,object,number':
            case 'array,datum,array,number':
            case 'array,datum,object,number':
                size = 1;
                // probably 1
                break;
            case 'array,array,array,number':
                size = data[0][0].length;
                break;
            case 'array,array,object,number':
                // inputs and outputs should match
                size = Object.keys(lookup.toTable2D(data)).length;
                break;
            case 'array,datum,array,array,number':
                size = data[0].input[0].length;
                break;
            case 'array,datum,array,object,number':
                size = Object.keys(lookup.toInputTable2D(data)).length;
                break;
            default:
                throw new Error('unknown data shape or configuration');
        }
        this.options = Object.seal({
            ...this.options,
            inputSize: size,
            outputSize: size,
        });
    }
    verifySize() {
        if (this.options.inputSize || this.options.outputSize) {
            if (this.options.inputSize !== this.options.outputSize) {
                throw new Error('manually set inputSize and outputSize mismatch');
            }
        }
    }
    runArray(input) {
        this.checkRunnable();
        const { equations } = this.model;
        while (equations.length <= input.length) {
            this.bindEquation();
        }
        let lastOutput;
        for (let i = 0; i < input.length; i++) {
            lastOutput = equations[i].runInput(new Float32Array([input[i]]));
        }
        this.end();
        return lastOutput.weights[0];
    }
    runArrayOfArray(input) {
        this.checkRunnable();
        const { model } = this;
        const { equations } = model;
        while (equations.length <= input.length) {
            this.bindEquation();
        }
        let lastOutput;
        for (let i = 0; i < input.length; i++) {
            const outputMatrix = equations[i].runInput(input[i]);
            lastOutput = outputMatrix.weights;
        }
        this.end();
        return lastOutput !== null && lastOutput !== void 0 ? lastOutput : Float32Array.from([]);
    }
    runObject(input) {
        if (!this.inputLookup) {
            throw new Error('this.inputLookup not set');
        }
        if (!this.outputLookup) {
            throw new Error('this.outputLookup not set');
        }
        if (!this.outputLookupLength) {
            throw new Error('this.outputLookupLength not set');
        }
        if (this.inputLookup === this.outputLookup) {
            const inputArray = lookup.toArrayShort(this.inputLookup, input);
            return lookup.toObjectPartial(this.outputLookup, this.forecastArray(inputArray, this.outputLookupLength - inputArray.length), inputArray.length);
        }
        return lookup.toObject(this.outputLookup, this.forecastArray(lookup.toArray(this.inputLookup, input, this.inputLookupLength), this.outputLookupLength));
    }
    runArrayOfObject(input) {
        if (this.inputLookup === null) {
            throw new Error('this.inputLookup not set');
        }
        if (this.outputLookup === null) {
            throw new Error('this.outputLookup not set');
        }
        const formattedInput = input.map((value) => lookup.toArray(this.inputLookup, value, this.inputLookupLength));
        return this.forecastArrayOfArray(formattedInput, 1).map((value) => lookup.toObject(this.outputLookup, value))[0];
    }
    runArrayOfObjectOfArray(input) {
        if (!this.inputLookup) {
            throw new Error('this.inputLookup not set');
        }
        if (!this.outputLookup) {
            throw new Error('this.outputLookup not set');
        }
        return lookup.toObject(this.outputLookup, this.runArrayOfArray(lookup.toArrays(this.inputLookup, input, this.inputLookupLength)));
    }
    end() {
        this.model.equations[this.model.equations.length - 1].runInput(new Float32Array(this.options.outputSize));
    }
    requireInputOutputOfOne() {
        if (this.options.inputSize !== 1) {
            throw new Error('inputSize must be 1 for this data size');
        }
        if (this.options.outputSize !== 1) {
            throw new Error('outputSize must be 1 for this data size');
        }
    }
    // Handles data shape of 'array,number'
    formatArray(data) {
        const result = [];
        this.requireInputOutputOfOne();
        for (let i = 0; i < data.length; i++) {
            result.push(Float32Array.from([data[i]]));
        }
        return [result];
    }
    // Handles data shape of 'array,array,number'
    formatArrayOfArray(data) {
        const result = [];
        const { inputSize, outputSize } = this.options;
        if (inputSize === 1 && outputSize === 1) {
            for (let i = 0; i < data.length; i++) {
                result.push(arrayToFloat32Arrays(data[i]));
            }
            return result;
        }
        if (inputSize !== data[0].length) {
            throw new Error('inputSize must match data input size');
        }
        if (outputSize !== data[0].length) {
            throw new Error('outputSize must match data output size');
        }
        for (let i = 0; i < data.length; i++) {
            result.push(Float32Array.from(data[i]));
        }
        return [result];
    }
    // Handles data shape of 'array,object,number'
    formatArrayOfObject(data) {
        this.requireInputOutputOfOne();
        if (!this.inputLookup) {
            const lookupTable = new LookupTable(data);
            this.inputLookup = this.outputLookup = lookupTable.table;
            this.inputLookupLength = this.outputLookupLength = lookupTable.length;
        }
        const result = [];
        for (let i = 0; i < data.length; i++) {
            result.push(objectToFloat32Arrays(data[i]));
        }
        return result;
    }
    // Handles data shape of 'array,object,number' when this.options.inputSize > 1
    formatArrayOfObjectMulti(data) {
        if (!this.inputLookup) {
            const lookupTable = new LookupTable(data);
            this.inputLookup = this.outputLookup = lookupTable.table;
            this.inputLookupLength = this.outputLookupLength = lookupTable.length;
        }
        const result = [];
        for (let i = 0; i < data.length; i++) {
            result.push([
                objectToFloat32Array(data[i], this.inputLookup, this.inputLookupLength),
            ]);
        }
        return result;
    }
    // Handles data shape of 'array,datum,array,number'
    formatArrayOfDatumOfArray(data) {
        const result = [];
        this.requireInputOutputOfOne();
        for (let i = 0; i < data.length; i++) {
            const datum = data[i];
            result.push(inputOutputArrayToFloat32Arrays(datum.input, datum.output));
        }
        return result;
    }
    // Handles data shape of 'array,datum,object,number'
    formatArrayOfDatumOfObject(data) {
        this.requireInputOutputOfOne();
        if (!this.inputLookup) {
            const inputLookup = new LookupTable(data, 'input');
            this.inputLookup = inputLookup.table;
            this.inputLookupLength = inputLookup.length;
        }
        if (!this.outputLookup) {
            const outputLookup = new LookupTable(data, 'output');
            this.outputLookup = outputLookup.table;
            this.outputLookupLength = outputLookup.length;
        }
        const result = [];
        for (let i = 0; i < data.length; i++) {
            const datum = data[i];
            result.push(inputOutputObjectToFloat32Arrays(datum.input, datum.output));
        }
        return result;
    }
    // Handles data shape of 'array,array,array,number'
    formatArrayOfArrayOfArray(data) {
        const result = [];
        for (let i = 0; i < data.length; i++) {
            result.push(arraysToFloat32Arrays(data[i]));
        }
        return result;
    }
    // Handles data shape of 'array,array,object,number'
    formatArrayOfArrayOfObject(data) {
        if (!this.inputLookup) {
            const lookupTable = new LookupTable(data);
            this.inputLookup = this.outputLookup = lookupTable.table;
            this.inputLookupLength = this.outputLookupLength = lookupTable.length;
        }
        const result = [];
        for (let i = 0; i < data.length; i++) {
            const array = [];
            for (let j = 0; j < data[i].length; j++) {
                array.push(objectToFloat32Array(data[i][j], this.inputLookup, this.inputLookupLength));
            }
            result.push(array);
        }
        return result;
    }
    // Handles data shape of 'array,datum,array,array,number'
    formatArrayOfDatumOfArrayOfArray(data) {
        const result = [];
        const { inputSize, outputSize } = this.options;
        if (inputSize !== data[0].input[0].length) {
            throw new Error('inputSize must match data input size');
        }
        if (outputSize !== data[0].output[0].length) {
            throw new Error('outputSize must match data output size');
        }
        for (let i = 0; i < data.length; i++) {
            const datum = data[i];
            result.push(inputOutputArraysToFloat32Arrays(datum.input, datum.output));
        }
        return result;
    }
    // 'Handles data shape of array,datum,array,object,number'
    formatArrayOfDatumOfArrayOfObject(data) {
        if (!this.inputLookup) {
            const inputLookup = new ArrayLookupTable(data, 'input');
            this.inputLookup = inputLookup.table;
            this.inputLookupLength = inputLookup.length;
        }
        if (!this.outputLookup) {
            const outputLookup = new ArrayLookupTable(data, 'output');
            this.outputLookup = outputLookup.table;
            this.outputLookupLength = outputLookup.length;
        }
        if (!this.outputLookupLength) {
            throw new Error('this.outputLookupLength not set to usable number');
        }
        const result = [];
        for (let i = 0; i < data.length; i++) {
            const datum = data[i];
            result.push(inputOutputObjectsToFloat32Arrays(datum.input, datum.output, this.inputLookup, this.outputLookup, this.inputLookupLength, this.outputLookupLength));
        }
        return result;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    formatData(data) {
        const dataShape = lookup.dataShape(data).join(',');
        switch (dataShape) {
            case 'array,number':
                return this.formatArray(data);
            case 'array,array,number':
                return this.formatArrayOfArray(data);
            case 'array,object,number':
                if (this.options.inputSize === 1) {
                    return this.formatArrayOfObject(data);
                }
                else {
                    return this.formatArrayOfObjectMulti(data);
                }
            case 'array,datum,array,number':
                return this.formatArrayOfDatumOfArray(data);
            case 'array,datum,object,number':
                return this.formatArrayOfDatumOfObject(data);
            case 'array,array,array,number':
                return this.formatArrayOfArrayOfArray(data);
            case 'array,array,object,number':
                return this.formatArrayOfArrayOfObject(data);
            case 'array,datum,array,array,number':
                return this.formatArrayOfDatumOfArrayOfArray(data);
            case 'array,datum,array,object,number':
                return this.formatArrayOfDatumOfArrayOfObject(data);
            default:
                throw new Error('unknown data shape or configuration');
        }
    }
    test(data) {
        // for classification problems
        const misclasses = [];
        // run each pattern through the trained network and collect
        // error and misclassification statistics
        let errorSum = 0;
        const formattedData = this.formatData(data);
        for (let i = 0; i < formattedData.length; i++) {
            const input = formattedData[i];
            const output = this.run(input.splice(0, input.length - 1));
            const target = input[input.length - 1];
            let errors = 0;
            let errorCount = 0;
            for (let j = 0; j < output.length; j++) {
                errorCount++;
                const error = target[j] - output[j];
                // mse
                errors += error * error;
            }
            errorSum += errors / errorCount;
            const errorsAbs = Math.abs(errors);
            if (errorsAbs > this.trainOpts.errorThresh) {
                const misclass = data[i];
                misclasses.push({
                    value: misclass,
                    actual: output,
                });
            }
        }
        return {
            error: errorSum / formattedData.length,
            misclasses,
            total: formattedData.length,
        };
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    addFormat(value) {
        var _a, _b, _c, _d, _e, _f;
        const dataShape = lookup.dataShape(value).join(',');
        switch (dataShape) {
            case 'array,array,number':
            case 'datum,array,array,number':
            case 'array,number':
            case 'datum,array,number':
                return;
            case 'datum,object,number': {
                this.inputLookup = lookup.addKeys(value.input, (_a = this.inputLookup) !== null && _a !== void 0 ? _a : {});
                if (this.inputLookup) {
                    this.inputLookupLength = Object.keys(this.inputLookup).length;
                }
                this.outputLookup = lookup.addKeys(value.output, (_b = this.outputLookup) !== null && _b !== void 0 ? _b : {});
                if (this.outputLookup) {
                    this.outputLookupLength = Object.keys(this.outputLookup).length;
                }
                break;
            }
            case 'object,number': {
                this.inputLookup = this.outputLookup = lookup.addKeys(value, (_c = this.inputLookup) !== null && _c !== void 0 ? _c : {});
                if (this.inputLookup) {
                    this.inputLookupLength = this.outputLookupLength = Object.keys(this.inputLookup).length;
                }
                break;
            }
            case 'array,object,number': {
                const typedValue = value;
                for (let i = 0; i < typedValue.length; i++) {
                    this.inputLookup = this.outputLookup = lookup.addKeys(typedValue[i], (_d = this.inputLookup) !== null && _d !== void 0 ? _d : {});
                    if (this.inputLookup) {
                        this.inputLookupLength = this.outputLookupLength = Object.keys(this.inputLookup).length;
                    }
                }
                break;
            }
            case 'datum,array,object,number': {
                const typedValue = value;
                const typedInput = typedValue.input;
                for (let i = 0; i < typedInput.length; i++) {
                    this.inputLookup = lookup.addKeys(typedInput[i], (_e = this.inputLookup) !== null && _e !== void 0 ? _e : {});
                    if (this.inputLookup) {
                        this.inputLookupLength = Object.keys(this.inputLookup).length;
                    }
                }
                const typedOutput = typedValue.output;
                for (let i = 0; i < typedOutput.length; i++) {
                    this.outputLookup = lookup.addKeys(typedOutput[i], (_f = this.outputLookup) !== null && _f !== void 0 ? _f : {});
                    if (this.outputLookup) {
                        this.outputLookupLength = Object.keys(this.outputLookup).length;
                    }
                }
                break;
            }
            default:
                throw new Error('unknown data shape or configuration');
        }
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    toJSON() {
        if (!this.model) {
            this.initialize();
        }
        const { model } = this;
        const options = { ...this.options, ...defaults$1 };
        return {
            type: this.constructor.name,
            options,
            hiddenLayers: model.hiddenLayers.map((hiddenLayer) => {
                const layers = {};
                for (const p in hiddenLayer) {
                    if (!hiddenLayer.hasOwnProperty(p))
                        continue;
                    layers[p] = hiddenLayer[p].toJSON();
                }
                return layers;
            }),
            outputConnector: model.outputConnector.toJSON(),
            output: model.output.toJSON(),
            inputLookup: this.inputLookup,
            inputLookupLength: this.inputLookupLength,
            outputLookup: this.outputLookup,
            outputLookupLength: this.outputLookupLength,
        };
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    fromJSON(json) {
        const { options } = json;
        const allMatrices = [];
        const hiddenLayers = [];
        // backward compatibility for hiddenSizes
        json.hiddenLayers.forEach((hiddenLayer) => {
            const layers = {};
            for (const p in hiddenLayer) {
                layers[p] = Matrix.fromJSON(hiddenLayer[p]);
                allMatrices.push(layers[p]);
            }
            hiddenLayers.push(layers);
        });
        const outputConnector = Matrix.fromJSON(json.outputConnector);
        allMatrices.push(outputConnector);
        const output = Matrix.fromJSON(json.output);
        allMatrices.push(output);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        this.options = { ...defaults(), ...options };
        this.inputLookup = json.inputLookup;
        this.inputLookupLength = json.inputLookupLength;
        this.outputLookup = json.outputLookup;
        this.outputLookupLength = json.outputLookupLength;
        this.model = Object.seal({
            isInitialized: true,
            hiddenLayers,
            output,
            allMatrices,
            outputConnector,
            equations: [],
            equationConnections: [],
        });
        this.initialLayerInputs = options.hiddenLayers.map((size) => new Matrix(size, 1));
        this.bindEquation();
        return this;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    toFunction(cb) {
        const { model, inputLookup, inputLookupLength, outputLookup, outputLookupLength, } = this;
        const { inputSize } = this.options;
        const { equations } = model;
        const equation = equations[1];
        const { states } = equation;
        const jsonString = JSON.stringify(this.toJSON());
        function previousConnectionIndex(m) {
            const connection = model.equationConnections[0];
            const { states } = equations[0];
            for (let i = 0, max = states.length; i < max; i++) {
                if (states[i].product === m) {
                    return i;
                }
            }
            return connection.indexOf(m);
        }
        function matrixOrigin(m, stateIndex) {
            for (let i = 0, max = states.length; i < max; i++) {
                const state = states[i];
                if (i === stateIndex) {
                    const j = previousConnectionIndex(m);
                    switch (m) {
                        case state.left:
                            if (j > -1) {
                                return `typeof prevStates[${j}] === 'object' ? prevStates[${j}].product : new Matrix(${m.rows}, ${m.columns})`;
                            }
                        // eslint-disable-next-line no-fallthrough
                        case state.right:
                            if (j > -1) {
                                return `typeof prevStates[${j}] === 'object' ? prevStates[${j}].product : new Matrix(${m.rows}, ${m.columns})`;
                            }
                        // eslint-disable-next-line no-fallthrough
                        case state.product:
                            return `new Matrix(${m.rows}, ${m.columns})`;
                        default:
                            throw Error('unknown state');
                    }
                }
                if (m === state.product)
                    return `states[${i}].product`;
                if (m === state.right)
                    return `states[${i}].right`;
                if (m === state.left)
                    return `states[${i}].left`;
            }
            return '';
        }
        function matrixToString(m, stateIndex) {
            if (!m || !m.rows || !m.columns)
                return 'null';
            if (m === model.outputConnector)
                return `json.outputConnector`;
            if (m === model.output)
                return `json.output`;
            for (let i = 0, max = model.hiddenLayers.length; i < max; i++) {
                const hiddenLayer = model.hiddenLayers[i];
                for (const p in hiddenLayer) {
                    if (!hiddenLayer.hasOwnProperty(p))
                        continue;
                    if (hiddenLayer[p] !== m)
                        continue;
                    return `json.hiddenLayers[${i}].${p}`;
                }
            }
            return matrixOrigin(m, stateIndex);
        }
        function formatInputData() {
            if (!inputLookup)
                return '';
            if (inputSize === 1) {
                if (inputLookup === outputLookup) {
                    return `function lookupInput(input) {
        var table = ${JSON.stringify(inputLookup)};
        var result = [];
        for (var p in table) {
          if (!input.hasOwnProperty(p)) break;
          result.push(Float32Array.from([input[p]]));
        }
        return result;
      }`;
                }
                return `function lookupInput(input) {
      var table = ${JSON.stringify(inputLookup)};
      var result = [];
      for (var p in table) {
        result.push(Float32Array.from([input[p]]));
      }
      return result;
    }`;
            }
            return `function lookupInput(rawInputs) {
    var table = ${JSON.stringify(inputLookup)};
    var result = [];
    for (var i = 0; i < rawInputs.length; i++) {
      var rawInput = rawInputs[i];
      var input = new Float32Array(${inputLookupLength});
      for (var p in table) {
        input[table[p]] = rawInput.hasOwnProperty(p) ? rawInput[p] : 0;
      }
      result.push(input);
    }
    return result;
  }`;
        }
        function formatOutputData() {
            if (!outputLookup)
                return '';
            if (inputSize === 1) {
                if (inputLookup === outputLookup) {
                    return `function lookupOutputPartial(output, input) {
        var table = ${JSON.stringify(outputLookup)};
        var offset = input.length;
        var result = {};
        var i = 0;
        for (var p in table) {
          if (i++ < offset) continue;
          result[p] = output[table[p] - offset][0];
        }
        return result;
      }`;
                }
                return `function lookupOutput(output) {
      var table = ${JSON.stringify(outputLookup)};
      var result = {};
      for (var p in table) {
        result[p] = output[table[p]][0];
      }
      return result;
    }`;
            }
            return `function lookupOutput(output) {
    var table = ${JSON.stringify(outputLookup)};
    var result = {};
    for (var p in table) {
      result[p] = output[table[p]];
    }
    return result;
  }`;
        }
        function toInner(fnString) {
            // crude, but should be sufficient for now
            // function() { body }
            // crude, but should be sufficient for now
            // function() { body }
            const fnParts = fnString.toString().split('{');
            fnParts.shift();
            // body }
            const fnBodyString = fnParts.join('{');
            const fnBodyParts = fnBodyString.split('}');
            fnBodyParts.pop();
            // body
            return fnBodyParts
                .join('}')
                .split('\n')
                .join('\n        ')
                .replace('product.deltas[i] = 0;', '')
                .replace('product.deltas[column] = 0;', '')
                .replace('left.deltas[leftIndex] = 0;', '')
                .replace('right.deltas[rightIndex] = 0;', '')
                .replace('product.deltas = left.deltas.slice(0);', '');
        }
        function fileName(fnName) {
            return `src/recurrent/matrix/${fnName.replace(/[A-Z]/g, function (value) {
            return `-${value.toLowerCase()}`;
        })}.js`;
        }
        const statesRaw = [];
        const usedFunctionNames = {};
        const innerFunctionsSwitch = [];
        for (let i = 0, max = states.length; i < max; i++) {
            const state = states[i];
            statesRaw.push(`states[${i}] = {
  name: '${state.forwardFn.name}',
  left: ${state.left ? matrixToString(state.left, i) : 'undefined'},
  right: ${state.right ? matrixToString(state.right, i) : 'undefined'},
  product: ${matrixToString(state.product, i)}
}`);
            const fnName = state.forwardFn.name;
            if (!usedFunctionNames[fnName]) {
                usedFunctionNames[fnName] = true;
                if (state.name === 'input') {
                    innerFunctionsSwitch.push(`case '${fnName}':`);
                    innerFunctionsSwitch.push(inputLookup && inputSize === 1
                        ? 'product.weights = _i < input.length ? input[_i]: prevStates[prevStates.length - 1].product.weights;'
                        : inputSize === 1
                            ? 'product.weights = [input[_i]];'
                            : 'product.weights = input[_i];');
                    innerFunctionsSwitch.push('break;');
                }
                else {
                    innerFunctionsSwitch.push(`        case '${fnName}':${fnName !== 'forwardFn'
                    ? ` //compiled from ${fileName(fnName)}`
                    : ''}
      ${toInner(state.forwardFn.toString())}
      break;`);
                }
            }
        }
        const forceForecast = inputSize === 1 && this.outputLookup;
        const src = `
var input = ${this.inputLookup ? 'lookupInput(rawInput)' : 'rawInput'};
var json = ${jsonString};
var output = [];
var states = [];
var prevStates;
var state;
var max = ${forceForecast
        ? inputLookup === outputLookup
            ? inputLookupLength
            : `input.length + ${outputLookupLength - 1}`
        : 'input.length'};
for (var _i = 0; _i < max; _i++) {
prevStates = states;
states = [];
${statesRaw.join(';\n    ')};
for (var stateIndex = 0, stateMax = ${statesRaw.length}; stateIndex < stateMax; stateIndex++) {
  state = states[stateIndex];
  var product = state.product;
  var left = state.left;
  var right = state.right;

  switch (state.name) {
${innerFunctionsSwitch.join('\n')}
  }
}
${inputSize === 1 && inputLookup
        ? 'if (_i >= input.length - 1) { output.push(state.product.weights); }'
        : 'output = state.product.weights;'}
}
${outputLookup
        ? outputLookup === inputLookup
            ? 'return lookupOutputPartial(output, input)'
            : 'return lookupOutput(output)'
        : inputSize === 1
            ? 'return output[0]'
            : 'return output'};
${formatInputData()}
${formatOutputData()}

function Matrix(rows, columns) {
this.rows = rows;
this.columns = columns;
this.weights = new Float32Array(rows * columns);
}
${softmax.toString().replace('_2.default', 'Matrix')}
${randomFloat.toString()}
${sampleI.toString()}
${maxI.toString()}`;
        // eslint-disable-next-line
        return new Function('rawInput', cb ? cb(src) : src);
    }
}
const trainDefaults = { ...trainDefaults$1 };

class GRUTimeStep extends RNNTimeStep {
    getHiddenLayer(hiddenSize, prevSize) {
        return getGRUHiddenLayer(hiddenSize, prevSize);
    }
    getEquation(equation, inputMatrix, previousResult, hiddenLayer) {
        return getGRUEquation(equation, inputMatrix, previousResult, hiddenLayer);
    }
}

class LSTM extends RNN {
    getHiddenLayer(hiddenSize, prevSize) {
        return getHiddenLSTMLayer(hiddenSize, prevSize);
    }
    getEquation(equation, inputMatrix, previousResult, hiddenLayer) {
        return getLSTMEquation(equation, inputMatrix, previousResult, hiddenLayer);
    }
}
function getHiddenLSTMLayer(hiddenSize, prevSize) {
    return {
        // gates parameters
        // wix
        inputMatrix: new RandomMatrix(hiddenSize, prevSize, 0.08),
        inputHidden: new RandomMatrix(hiddenSize, hiddenSize, 0.08),
        inputBias: new Matrix(hiddenSize, 1),
        // wfx
        forgetMatrix: new RandomMatrix(hiddenSize, prevSize, 0.08),
        forgetHidden: new RandomMatrix(hiddenSize, hiddenSize, 0.08),
        forgetBias: new Matrix(hiddenSize, 1),
        // wox
        outputMatrix: new RandomMatrix(hiddenSize, prevSize, 0.08),
        outputHidden: new RandomMatrix(hiddenSize, hiddenSize, 0.08),
        outputBias: new Matrix(hiddenSize, 1),
        // cell write params
        // wcx
        cellActivationMatrix: new RandomMatrix(hiddenSize, prevSize, 0.08),
        cellActivationHidden: new RandomMatrix(hiddenSize, hiddenSize, 0.08),
        cellActivationBias: new Matrix(hiddenSize, 1),
    };
}
function getLSTMEquation(equation, inputMatrix, previousResult, hiddenLayer) {
    if (!hiddenLayer.inputMatrix ||
        !hiddenLayer.inputHidden ||
        !hiddenLayer.inputBias ||
        !hiddenLayer.forgetMatrix ||
        !hiddenLayer.forgetHidden ||
        !hiddenLayer.forgetBias ||
        !hiddenLayer.outputMatrix ||
        !hiddenLayer.outputHidden ||
        !hiddenLayer.outputBias ||
        !hiddenLayer.cellActivationMatrix ||
        !hiddenLayer.cellActivationHidden ||
        !hiddenLayer.cellActivationBias) {
        throw new Error('hiddenLayer does not have expected properties');
    }
    const sigmoid = equation.sigmoid.bind(equation);
    const add = equation.add.bind(equation);
    const multiply = equation.multiply.bind(equation);
    const multiplyElement = equation.multiplyElement.bind(equation);
    const tanh = equation.tanh.bind(equation);
    const inputGate = sigmoid(add(add(multiply(hiddenLayer.inputMatrix, inputMatrix), multiply(hiddenLayer.inputHidden, previousResult)), hiddenLayer.inputBias));
    const forgetGate = sigmoid(add(add(multiply(hiddenLayer.forgetMatrix, inputMatrix), multiply(hiddenLayer.forgetHidden, previousResult)), hiddenLayer.forgetBias));
    // output gate
    const outputGate = sigmoid(add(add(multiply(hiddenLayer.outputMatrix, inputMatrix), multiply(hiddenLayer.outputHidden, previousResult)), hiddenLayer.outputBias));
    // write operation on cells
    const cellWrite = tanh(add(add(multiply(hiddenLayer.cellActivationMatrix, inputMatrix), multiply(hiddenLayer.cellActivationHidden, previousResult)), hiddenLayer.cellActivationBias));
    // compute new cell activation
    const retainCell = multiplyElement(forgetGate, previousResult); // what do we keep from cell
    const writeCell = multiplyElement(inputGate, cellWrite); // what do we write to cell
    const cell = add(retainCell, writeCell); // new cell contents
    // compute hidden state as gated, saturated cell activations
    return multiplyElement(outputGate, tanh(cell));
}

class LSTMTimeStep extends RNNTimeStep {
    getHiddenLayer(hiddenSize, prevSize) {
        return getHiddenLSTMLayer(hiddenSize, prevSize);
    }
    getEquation(equation, inputMatrix, previousResult, hiddenLayer) {
        return getLSTMEquation(equation, inputMatrix, previousResult, hiddenLayer);
    }
}

/**
 *
 * @param start
 * @param end
 * @returns {Array}
 */
function range(start, end) {
    const result = [];
    for (; start < end; start++) {
        result.push(start);
    }
    return result;
}

function toArray(values) {
    if (Array.isArray(values)) {
        return Float32Array.from(values);
    }
    return Float32Array.from(Object.values(values));
}

function drawInput({ pixelX, pixelY, radius, inputs, row, line, fontSize, fontClassName, }) {
    let svg = `<rect
          x="${pixelX / 2 - radius}"
          y="${pixelY / 2 + row * pixelY - radius}"
          width="${2 * radius}"
          height="${2 * radius}"
          stroke="black"
          stroke-width="1"
          fill="${inputs.color}"
          class="${inputs.className}" />
        <line
          x1="${pixelX / 4}"
          y1="${pixelY / 2 + row * pixelY}"
          x2="${pixelX / 2 - radius}"
          y2="${pixelY / 2 + row * pixelY}"
          style="stroke:${line.color};stroke-width:${line.width}"
          class="${line.className}" />`;
    if (inputs.labels) {
        svg += `<text
          x="${pixelX / 8}"
          y="${pixelY / 2 + row * pixelY - 5}"
          fill="black"
          font-size="${fontSize}"
          class="${fontClassName}">${inputs.labels[row]}</text>`;
    }
    return svg;
}
function drawNeuron({ pixelX, pixelY, row, column, radius, hidden, }) {
    return `<circle
        cx="${pixelX / 2 + column * pixelX}"
        cy="${pixelY / 2 + row * pixelY}"
        r="${radius}"
        stroke="black"
        stroke-width="1"
        fill="${hidden.color}"
        class="${hidden.className}" />`;
}
function drawOutput({ pixelX, pixelY, row, column, line, outputs, radius, }) {
    return `<circle
        cx="${pixelX / 2 + column * pixelX}"
        cy="${pixelY / 2 + row * pixelY}"
        r="${radius}"
        stroke="black"
        stroke-width="1"
        fill="${outputs.color}"
        class="${outputs.className}" />
      <line
        x1="${pixelX / 2 + column * pixelX + radius}"
        y1="${pixelY / 2 + row * pixelY}"
        x2="${pixelX / 2 + column * pixelX + pixelX / 4}"
        y2="${pixelY / 2 + row * pixelY}"
        style="stroke:${line.color};stroke-width:${line.width}"
        class="${line.className}" />`;
}
function drawBackwardConnections({ pixelX, pixelY, row, column, radius, lineY, line, previousConnectionIndex, }) {
    return `<line
        x1="${pixelX / 2 + (column - 1) * pixelX + radius}"
        y1="${lineY / 2 + previousConnectionIndex * lineY}"
        x2="${pixelX / 2 + column * pixelX - radius}"
        y2="${pixelY / 2 + row * pixelY}"
        style="stroke:${line.color};stroke-width:${line.width}"
        class="${line.className}" />`;
}
function neuralNetworkToInnerSVG(options) {
    const { sizes, height, width } = options;
    let svg = '';
    const pixelX = width / sizes.length;
    for (let column = 0; column < sizes.length; column++) {
        const size = sizes[column];
        const pixelY = height / size;
        for (let row = 0; row < size; row++) {
            if (column === 0) {
                svg += drawInput({ pixelX, pixelY, row, column, ...options });
            }
            else {
                if (column === sizes.length - 1) {
                    svg += drawOutput({ pixelX, pixelY, row, column, ...options });
                }
                else {
                    svg += drawNeuron({ pixelX, pixelY, row, column, ...options });
                }
                const previousSize = sizes[column - 1];
                const lineY = height / previousSize;
                for (let previousConnectionIndex = 0; previousConnectionIndex < previousSize; previousConnectionIndex++) {
                    svg += drawBackwardConnections({
                        pixelX,
                        pixelY,
                        row,
                        column,
                        lineY,
                        previousConnectionIndex,
                        ...options,
                    });
                }
            }
        }
    }
    return svg;
}
function drawRecurrentConnections({ pixelX, pixelY, row, column, radius, recurrentLine, }) {
    const moveX = pixelX / 2 + column * pixelX + radius + 1;
    const moveY = pixelY / 2 + row * pixelY;
    const x = moveX - radius * 2 - 2;
    const y = moveY;
    const x1 = x + 100;
    const y1 = y + 50;
    const x2 = moveX - 100;
    const y2 = moveY + 50;
    return `<path
          d="M ${moveX} ${moveY} C ${x1} ${y1}, ${x2} ${y2}, ${x} ${y}"
          stroke="${recurrentLine.color}"
          stroke-width="${recurrentLine.width}"
          fill="transparent"
          stroke-linecap="round"
          marker-end="url(#arrow)"
          class="${recurrentLine.className}" />`;
}
function rnnToInnerSVG(options) {
    const { width, height, recurrentLine, sizes, radius } = options;
    const pixelX = width / sizes.length;
    let svg = `<defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="${recurrentLine.color}" />
          </marker>
        </defs>`;
    svg += neuralNetworkToInnerSVG(options);
    for (let column = 1; column < sizes.length; column++) {
        const size = sizes[column];
        const pixelY = height / size;
        for (let row = 0; row < size; row++) {
            svg += drawRecurrentConnections({
                pixelX,
                pixelY,
                row,
                column,
                radius,
                recurrentLine,
            });
        }
    }
    return svg;
}
function getFeedForwardLayers(network) {
    const { options } = network;
    if (!options) {
        throw new Error('options not defined');
    }
    if (!options.inputLayer) {
        throw new Error('options.inputLater not defined');
    }
    if (!options.hiddenLayers) {
        throw new Error('options.hiddenLayers not defined');
    }
    if (options.hiddenLayers.length < 1) {
        throw new Error('options.hiddenLayers is empty');
    }
    if (!options.outputLayer) {
        throw new Error('options.outputLayer not defined');
    }
    const inputLayer = options.inputLayer();
    const hiddenLayers = [];
    hiddenLayers.push(options.hiddenLayers[0](inputLayer, 0));
    for (let i = 1; i < options.hiddenLayers.length; i++) {
        hiddenLayers.push(options.hiddenLayers[i](hiddenLayers[i - 1], i));
    }
    const outputLayer = options.outputLayer(hiddenLayers[hiddenLayers.length - 1], hiddenLayers.length);
    return {
        inputSize: inputLayer.height,
        hiddenLayers: hiddenLayers.map((hiddenLayer) => hiddenLayer.height),
        outputSize: outputLayer.height,
    };
}
function getRecurrentLayers(network) {
    const hiddenLayers = [];
    const { options } = network;
    if (!options.inputLayer) {
        throw new Error('inputLayer not defined');
    }
    if (!options.outputLayer) {
        throw new Error('outputLayer not defined');
    }
    const inputLayer = options.inputLayer();
    hiddenLayers.push(options.hiddenLayers[0](inputLayer, recurrentZeros(), 0));
    for (let i = 1; i < options.hiddenLayers.length; i++) {
        hiddenLayers.push(options.hiddenLayers[i](hiddenLayers[i - 1], recurrentZeros(), i));
    }
    const outputLayer = options.outputLayer(hiddenLayers[hiddenLayers.length - 1], -1);
    return {
        inputSize: inputLayer.height,
        hiddenLayers: hiddenLayers.map((hiddenLayer) => hiddenLayer.height),
        outputSize: outputLayer.height,
    };
}
function wrapOuterSVG(svgBody, width, height) {
    // language=html
    return `<svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        version="1.1"
        width="${width}"
        height="${height}">${svgBody}</svg>`;
}
function getNeuralNetworkJSONSizes(json) {
    return json.sizes;
}
function getNeuralNetworkSizes(net) {
    const { options, sizes } = net;
    const { inputSize, outputSize, hiddenLayers } = options;
    if (!sizes) {
        if (typeof inputSize === 'number' && inputSize < 1) {
            throw new Error('inputSize not set');
        }
        if (typeof outputSize === 'number' && outputSize < 1) {
            throw new Error('outputSize not set');
        }
        if (hiddenLayers === null || hiddenLayers === void 0 ? void 0 : hiddenLayers.some((v) => v < 1)) {
            throw new Error('hiddenLayers not set');
        }
    }
    return typeof inputSize === 'number' &&
        Array.isArray(hiddenLayers) &&
        typeof outputSize === 'number'
        ? [inputSize].concat(hiddenLayers).concat([outputSize])
        : sizes;
}
function getRNNSizes(net) {
    const { options } = net;
    const { inputSize, outputSize, hiddenLayers } = options;
    return [inputSize].concat(hiddenLayers).concat([outputSize]);
}
function defaultOptions() {
    return {
        line: {
            width: 0.5,
            color: 'black',
            className: 'connection',
        },
        recurrentLine: {
            width: 1,
            color: 'red',
            className: 'recurrence',
        },
        inputs: {
            color: 'rgba(0, 128, 0, 0.5)',
            labels: null,
            className: 'input',
        },
        outputs: {
            color: 'rgba(100, 149, 237, 0.5)',
            className: 'output',
        },
        hidden: {
            color: 'rgba(255, 127, 80, 0.5)',
            className: 'hidden-neuron',
        },
        fontSize: '14px',
        fontClassName: 'label',
        radius: 8,
        width: 400,
        height: 250,
        sizes: [],
    };
}
function toSVG(net, options) {
    const mergedOptions = { ...defaultOptions(), ...options };
    const { width, height, inputs } = mergedOptions;
    // Get network size array for NeuralNetwork or NeuralNetworkGPU
    let sizes = [];
    if (net instanceof NeuralNetwork || net instanceof NeuralNetworkGPU) {
        sizes = getNeuralNetworkSizes(net);
    }
    // get network size for Recurrent
    else if (net instanceof Recurrent) {
        const { inputSize, hiddenLayers, outputSize } = getRecurrentLayers(net);
        sizes = [inputSize].concat(hiddenLayers).concat([outputSize]);
    }
    // get network size for FeedForward
    else if (net instanceof FeedForward) {
        const { inputSize, hiddenLayers, outputSize } = getFeedForwardLayers(net);
        sizes = [inputSize].concat(hiddenLayers).concat([outputSize]);
    }
    // handle json, recurrent first
    else if (net instanceof RNN ||
        net instanceof LSTM ||
        net instanceof GRU ||
        net instanceof RNNTimeStep ||
        net instanceof LSTMTimeStep ||
        net instanceof GRUTimeStep) {
        return wrapOuterSVG(rnnToInnerSVG({
            ...mergedOptions,
            sizes: checkSizes(getRNNSizes(net), inputs.labels),
        }), width, height);
    }
    // handle json, NeuralNetwork
    else if (net.hasOwnProperty('type')) {
        switch (net.type) {
            case 'NeuralNetwork':
            case 'NeuralNetworkGPU':
                return wrapOuterSVG(neuralNetworkToInnerSVG({
                    ...mergedOptions,
                    sizes: checkSizes(getNeuralNetworkJSONSizes(net), inputs.labels),
                }), width, height);
            case 'RNN':
            case 'GRU':
            case 'LSTM':
            case 'RNNTimeStep':
            case 'GRUTimeStep':
            case 'LSTMTimeStep':
                return wrapOuterSVG(rnnToInnerSVG({
                    ...mergedOptions,
                    sizes: checkSizes(getRNNSizes(net), inputs.labels),
                }), width, height);
            default:
                throw new Error('unrecognized network');
        }
    }
    else if (net.hasOwnProperty('inputSize') &&
        net.hasOwnProperty('hiddenLayers') &&
        net.hasOwnProperty('outputSize')) {
        const { inputSize, hiddenLayers, outputSize } = net;
        sizes = [inputSize, ...hiddenLayers, outputSize];
    }
    else if (net.hasOwnProperty('sizes')) {
        sizes = net.sizes;
    }
    else {
        throw new Error('unrecognized network');
    }
    return wrapOuterSVG(neuralNetworkToInnerSVG({
        ...mergedOptions,
        sizes: checkSizes(sizes, inputs.labels),
    }), width, height);
}
function checkSizes(sizes, labels) {
    if (!sizes) {
        throw new Error('sizes not set');
    }
    if (sizes.some((size) => size < 1)) {
        throw new Error('sizes not set correctly');
    }
    if (labels && labels.length !== sizes[0]) {
        throw new Error('not enough labels for inputs');
    }
    return sizes;
}

const recurrent = {
    RNNTimeStep,
    LSTMTimeStep,
    GRUTimeStep,
    RNN,
    LSTM,
    GRU,
};
const utilities = {
    max,
    mse: mse$1,
    ones: ones$1,
    ones2D,
    random: random$1,
    randomWeight,
    randos,
    range,
    toArray,
    DataFormatter,
    zeros: zeros$1,
    toSVG,
};

/*exports.AE = AE;
exports.CrossValidate = CrossValidate;
exports.FeedForward = FeedForward;
exports.NeuralNetwork = NeuralNetwork;
exports.NeuralNetworkGPU = NeuralNetworkGPU;
exports.Recurrent = Recurrent;
exports.activation = index$1;
exports.layer = layer;
exports.layerTypes = layerTypes;
exports.likely = likely;
exports.lookup = lookup;
exports.praxis = index;
exports.recurrent = recurrent;
exports.utilities = utilities;
*/

export { recurrent, utilities, NeuralNetwork, NeuralNetworkGPU }