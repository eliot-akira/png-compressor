(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // src/png-codec/api.ts
  var ColorType, InterlaceMethod, KnownChunkTypes, RenderingIntent;
  var init_api = __esm({
    "src/png-codec/api.ts"() {
      ColorType = /* @__PURE__ */ ((ColorType2) => {
        ColorType2[ColorType2["Grayscale"] = 0] = "Grayscale";
        ColorType2[ColorType2["Truecolor"] = 2] = "Truecolor";
        ColorType2[ColorType2["Indexed"] = 3] = "Indexed";
        ColorType2[ColorType2["GrayscaleAndAlpha"] = 4] = "GrayscaleAndAlpha";
        ColorType2[ColorType2["TruecolorAndAlpha"] = 6] = "TruecolorAndAlpha";
        return ColorType2;
      })(ColorType || {});
      InterlaceMethod = /* @__PURE__ */ ((InterlaceMethod2) => {
        InterlaceMethod2[InterlaceMethod2["None"] = 0] = "None";
        InterlaceMethod2[InterlaceMethod2["Adam7"] = 1] = "Adam7";
        return InterlaceMethod2;
      })(InterlaceMethod || {});
      KnownChunkTypes = /* @__PURE__ */ ((KnownChunkTypes5) => {
        KnownChunkTypes5["IHDR"] = "IHDR";
        KnownChunkTypes5["PLTE"] = "PLTE";
        KnownChunkTypes5["IDAT"] = "IDAT";
        KnownChunkTypes5["IEND"] = "IEND";
        KnownChunkTypes5["bKGD"] = "bKGD";
        KnownChunkTypes5["cHRM"] = "cHRM";
        KnownChunkTypes5["eXIf"] = "eXIf";
        KnownChunkTypes5["gAMA"] = "gAMA";
        KnownChunkTypes5["hIST"] = "hIST";
        KnownChunkTypes5["iCCP"] = "iCCP";
        KnownChunkTypes5["iTXt"] = "iTXt";
        KnownChunkTypes5["oFFs"] = "oFFs";
        KnownChunkTypes5["pCAL"] = "pCAL";
        KnownChunkTypes5["pHYs"] = "pHYs";
        KnownChunkTypes5["sBIT"] = "sBIT";
        KnownChunkTypes5["sCAL"] = "sCAL";
        KnownChunkTypes5["sPLT"] = "sPLT";
        KnownChunkTypes5["sRGB"] = "sRGB";
        KnownChunkTypes5["sTER"] = "sTER";
        KnownChunkTypes5["tEXt"] = "tEXt";
        KnownChunkTypes5["tIME"] = "tIME";
        KnownChunkTypes5["tRNS"] = "tRNS";
        KnownChunkTypes5["zTXt"] = "zTXt";
        return KnownChunkTypes5;
      })(KnownChunkTypes || {});
      RenderingIntent = /* @__PURE__ */ ((RenderingIntent2) => {
        RenderingIntent2[RenderingIntent2["Perceptual"] = 0] = "Perceptual";
        RenderingIntent2[RenderingIntent2["RelativeColorimetric"] = 1] = "RelativeColorimetric";
        RenderingIntent2[RenderingIntent2["Saturation"] = 2] = "Saturation";
        RenderingIntent2[RenderingIntent2["AbsoluteColorimetric"] = 3] = "AbsoluteColorimetric";
        return RenderingIntent2;
      })(RenderingIntent || {});
    }
  });

  // src/png-codec/shared/types.ts
  var ChunkPartByteLength, FilterMethod, FilterType;
  var init_types = __esm({
    "src/png-codec/shared/types.ts"() {
      init_api();
      ChunkPartByteLength = /* @__PURE__ */ ((ChunkPartByteLength2) => {
        ChunkPartByteLength2[ChunkPartByteLength2["Length"] = 4] = "Length";
        ChunkPartByteLength2[ChunkPartByteLength2["Type"] = 4] = "Type";
        ChunkPartByteLength2[ChunkPartByteLength2["CRC"] = 4] = "CRC";
        return ChunkPartByteLength2;
      })(ChunkPartByteLength || {});
      FilterMethod = /* @__PURE__ */ ((FilterMethod2) => {
        FilterMethod2[FilterMethod2["Adaptive"] = 0] = "Adaptive";
        return FilterMethod2;
      })(FilterMethod || {});
      FilterType = /* @__PURE__ */ ((FilterType2) => {
        FilterType2[FilterType2["None"] = 0] = "None";
        FilterType2[FilterType2["Sub"] = 1] = "Sub";
        FilterType2[FilterType2["Up"] = 2] = "Up";
        FilterType2[FilterType2["Average"] = 3] = "Average";
        FilterType2[FilterType2["Paeth"] = 4] = "Paeth";
        return FilterType2;
      })(FilterType || {});
    }
  });

  // src/png-codec/decode/assert.ts
  function assertChunkSinglular(ctx, chunk) {
    if (ctx.parsedChunks.has(chunk.type)) {
      handleWarning(
        ctx,
        createChunkDecodeWarning(
          chunk,
          `Multiple ${chunk.type} chunks not allowed`,
          chunk.offset + 4 /* Length */
        )
      );
    }
  }
  function assertChunkDataLengthEquals(ctx, chunk, expected) {
    if (chunk.dataLength !== expected) {
      const error = createChunkDecodeWarning(
        chunk,
        `Invalid data length: ${chunk.dataLength} !== ${expected}`,
        chunk.offset
      );
      if (chunk.dataLength > expected) {
        handleWarning(ctx, error);
      } else {
        throw error;
      }
    }
  }
  function assertChunkDataLengthGte(ctx, chunk, expected) {
    if (chunk.dataLength < expected) {
      throw createChunkDecodeError(
        ctx,
        chunk,
        `Invalid data length: ${chunk.dataLength} < ${expected}`,
        chunk.offset
      );
    }
  }
  function assertChunkPrecedes(ctx, chunk, typeAfter) {
    if (ctx.parsedChunks.has(typeAfter)) {
      handleWarning(
        ctx,
        createChunkDecodeWarning(
          chunk,
          `Must precede ${typeAfter}`,
          chunk.offset + 4 /* Length */
        )
      );
    }
  }
  function assertChunkFollows(ctx, chunk, typeAfter) {
    if (!ctx.parsedChunks.has(typeAfter)) {
      throw createChunkDecodeError(
        ctx,
        chunk,
        `Must follow ${typeAfter}`,
        chunk.offset + 4 /* Length */
      );
    }
  }
  function assertChunkMutualExclusion(ctx, chunk, otherType) {
    if (ctx.parsedChunks.has(otherType)) {
      handleWarning(
        ctx,
        createChunkDecodeWarning(
          chunk,
          `Should not be present alongside ${otherType}`,
          chunk.offset + 4 /* Length */
        )
      );
    }
  }
  function assertChunkCompressionMethod(ctx, chunk, compressionMethod, offset) {
    if (compressionMethod !== 0) {
      handleWarning(
        ctx,
        createChunkDecodeWarning(
          chunk,
          `Unknown compression method "${compressionMethod}"`,
          offset
        )
      );
    }
  }
  function createChunkDecodeError(ctx, chunk, message, offset) {
    return new DecodeError(ctx, `${chunk.type}: ${message}`, offset);
  }
  function createChunkDecodeWarning(chunk, message, offset) {
    return new DecodeWarning(`${chunk.type}: ${message}`, offset);
  }
  function handleWarning(ctx, warning) {
    if (ctx.options.strictMode) {
      throw warning;
    }
    ctx.warnings.push(warning);
  }
  var DecodeError, DecodeWarning;
  var init_assert = __esm({
    "src/png-codec/decode/assert.ts"() {
      init_types();
      DecodeError = class extends Error {
        constructor(ctx, message, offset) {
          super(message);
          this.offset = offset;
          this.partiallyDecodedImage = {
            details: "header" in ctx && ctx.header ? {
              width: ctx.header.width,
              height: ctx.header.height,
              bitDepth: ctx.header.bitDepth,
              colorType: ctx.header.colorType,
              interlaceMethod: ctx.header.interlaceMethod
            } : void 0,
            info: ctx.info,
            metadata: ctx.metadata,
            rawChunks: ctx.rawChunks,
            warnings: ctx.warnings
          };
        }
      };
      DecodeWarning = class extends Error {
        constructor(message, offset) {
          super(message);
          this.offset = offset;
        }
      };
    }
  });

  // src/png-codec/encode/assert.ts
  function handleWarning2(ctx, warning) {
    if (ctx.options.strictMode) {
      throw warning;
    }
    ctx.warnings.push(warning);
  }
  var EncodeError, EncodeWarning;
  var init_assert2 = __esm({
    "src/png-codec/encode/assert.ts"() {
      EncodeError = class extends Error {
        constructor(message, offset) {
          super(message);
          this.offset = offset;
        }
      };
      EncodeWarning = class extends Error {
        constructor(message, offset) {
          super(message);
          this.offset = offset;
        }
      };
    }
  });

  // src/png-codec/decode/array.ts
  function convert16BitTo8BitData(data) {
    const view8Bit = new Uint8Array(data.buffer);
    const result = new Uint8Array(data.length);
    for (let i = 0; i < result.length; i++) {
      result[i] = view8Bit[i * 2 + 1];
    }
    return result;
  }
  var init_array = __esm({
    "src/png-codec/decode/array.ts"() {
    }
  });

  // src/pako/zlib/trees.ts
  function zero(buf) {
    let len = buf.length;
    while (--len >= 0) {
      buf[len] = 0;
    }
  }
  function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {
    this.static_tree = static_tree;
    this.extra_bits = extra_bits;
    this.extra_base = extra_base;
    this.elems = elems;
    this.max_length = max_length;
    this.has_stree = static_tree && static_tree.length;
  }
  function TreeDesc(dyn_tree, stat_desc) {
    this.dyn_tree = dyn_tree;
    this.max_code = 0;
    this.stat_desc = stat_desc;
  }
  var Z_FIXED, Z_BINARY, Z_TEXT, Z_UNKNOWN, STORED_BLOCK, STATIC_TREES, DYN_TREES, MIN_MATCH, MAX_MATCH, LENGTH_CODES, LITERALS, L_CODES, D_CODES, BL_CODES, HEAP_SIZE, MAX_BITS, Buf_size, MAX_BL_BITS, END_BLOCK, REP_3_6, REPZ_3_10, REPZ_11_138, extra_lbits, extra_dbits, extra_blbits, bl_order, DIST_CODE_LEN, static_ltree, static_dtree, _dist_code, _length_code, base_length, base_dist, static_l_desc, static_d_desc, static_bl_desc, d_code, put_short, send_bits, send_code, bi_reverse, bi_flush, gen_bitlen, gen_codes, tr_static_init, init_block, bi_windup, smaller, pqdownheap, compress_block, build_tree, scan_tree, send_tree, build_bl_tree, send_all_trees, detect_data_type, static_init_done, _tr_init, _tr_stored_block, _tr_align, _tr_flush_block, _tr_tally, __tr_init, __tr_stored_block, __tr_flush_block, __tr_tally, __tr_align;
  var init_trees = __esm({
    "src/pako/zlib/trees.ts"() {
      Z_FIXED = 4;
      Z_BINARY = 0;
      Z_TEXT = 1;
      Z_UNKNOWN = 2;
      STORED_BLOCK = 0;
      STATIC_TREES = 1;
      DYN_TREES = 2;
      MIN_MATCH = 3;
      MAX_MATCH = 258;
      LENGTH_CODES = 29;
      LITERALS = 256;
      L_CODES = LITERALS + 1 + LENGTH_CODES;
      D_CODES = 30;
      BL_CODES = 19;
      HEAP_SIZE = 2 * L_CODES + 1;
      MAX_BITS = 15;
      Buf_size = 16;
      MAX_BL_BITS = 7;
      END_BLOCK = 256;
      REP_3_6 = 16;
      REPZ_3_10 = 17;
      REPZ_11_138 = 18;
      extra_lbits = /* extra bits for each length code */
      new Uint8Array([
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        1,
        1,
        1,
        2,
        2,
        2,
        2,
        3,
        3,
        3,
        3,
        4,
        4,
        4,
        4,
        5,
        5,
        5,
        5,
        0
      ]);
      extra_dbits = /* extra bits for each distance code */
      new Uint8Array([
        0,
        0,
        0,
        0,
        1,
        1,
        2,
        2,
        3,
        3,
        4,
        4,
        5,
        5,
        6,
        6,
        7,
        7,
        8,
        8,
        9,
        9,
        10,
        10,
        11,
        11,
        12,
        12,
        13,
        13
      ]);
      extra_blbits = /* extra bits for each bit length code */
      new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7]);
      bl_order = new Uint8Array([
        16,
        17,
        18,
        0,
        8,
        7,
        9,
        6,
        10,
        5,
        11,
        4,
        12,
        3,
        13,
        2,
        14,
        1,
        15
      ]);
      DIST_CODE_LEN = 512;
      static_ltree = new Array((L_CODES + 2) * 2);
      zero(static_ltree);
      static_dtree = new Array(D_CODES * 2);
      zero(static_dtree);
      _dist_code = new Array(DIST_CODE_LEN);
      zero(_dist_code);
      _length_code = new Array(MAX_MATCH - MIN_MATCH + 1);
      zero(_length_code);
      base_length = new Array(LENGTH_CODES);
      zero(base_length);
      base_dist = new Array(D_CODES);
      zero(base_dist);
      d_code = (dist) => {
        return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
      };
      put_short = (s, w) => {
        s.pending_buf[s.pending++] = w & 255;
        s.pending_buf[s.pending++] = w >>> 8 & 255;
      };
      send_bits = (s, value, length) => {
        if (s.bi_valid > Buf_size - length) {
          s.bi_buf |= value << s.bi_valid & 65535;
          put_short(s, s.bi_buf);
          s.bi_buf = value >> Buf_size - s.bi_valid;
          s.bi_valid += length - Buf_size;
        } else {
          s.bi_buf |= value << s.bi_valid & 65535;
          s.bi_valid += length;
        }
      };
      send_code = (s, c, tree) => {
        send_bits(
          s,
          tree[c * 2],
          tree[c * 2 + 1]
          /*.Len*/
        );
      };
      bi_reverse = (code, len) => {
        let res = 0;
        do {
          res |= code & 1;
          code >>>= 1;
          res <<= 1;
        } while (--len > 0);
        return res >>> 1;
      };
      bi_flush = (s) => {
        if (s.bi_valid === 16) {
          put_short(s, s.bi_buf);
          s.bi_buf = 0;
          s.bi_valid = 0;
        } else if (s.bi_valid >= 8) {
          s.pending_buf[s.pending++] = s.bi_buf & 255;
          s.bi_buf >>= 8;
          s.bi_valid -= 8;
        }
      };
      gen_bitlen = (s, desc) => {
        const tree = desc.dyn_tree;
        const max_code = desc.max_code;
        const stree = desc.stat_desc.static_tree;
        const has_stree = desc.stat_desc.has_stree;
        const extra = desc.stat_desc.extra_bits;
        const base = desc.stat_desc.extra_base;
        const max_length = desc.stat_desc.max_length;
        let h;
        let n, m;
        let bits;
        let xbits;
        let f;
        let overflow = 0;
        for (bits = 0; bits <= MAX_BITS; bits++) {
          s.bl_count[bits] = 0;
        }
        tree[s.heap[s.heap_max] * 2 + 1] = 0;
        for (h = s.heap_max + 1; h < HEAP_SIZE; h++) {
          n = s.heap[h];
          bits = tree[tree[n * 2 + 1] * 2 + 1] + 1;
          if (bits > max_length) {
            bits = max_length;
            overflow++;
          }
          tree[n * 2 + 1] = bits;
          if (n > max_code) {
            continue;
          }
          s.bl_count[bits]++;
          xbits = 0;
          if (n >= base) {
            xbits = extra[n - base];
          }
          f = tree[n * 2];
          s.opt_len += f * (bits + xbits);
          if (has_stree) {
            s.static_len += f * (stree[n * 2 + 1] + xbits);
          }
        }
        if (overflow === 0) {
          return;
        }
        do {
          bits = max_length - 1;
          while (s.bl_count[bits] === 0) {
            bits--;
          }
          s.bl_count[bits]--;
          s.bl_count[bits + 1] += 2;
          s.bl_count[max_length]--;
          overflow -= 2;
        } while (overflow > 0);
        for (bits = max_length; bits !== 0; bits--) {
          n = s.bl_count[bits];
          while (n !== 0) {
            m = s.heap[--h];
            if (m > max_code) {
              continue;
            }
            if (tree[m * 2 + 1] !== bits) {
              s.opt_len += (bits - tree[m * 2 + 1]) * tree[m * 2];
              tree[m * 2 + 1] = bits;
            }
            n--;
          }
        }
      };
      gen_codes = (tree, max_code, bl_count) => {
        const next_code = new Array(
          MAX_BITS + 1
        );
        let code = 0;
        let bits;
        let n;
        for (bits = 1; bits <= MAX_BITS; bits++) {
          code = code + bl_count[bits - 1] << 1;
          next_code[bits] = code;
        }
        for (n = 0; n <= max_code; n++) {
          let len = tree[n * 2 + 1];
          if (len === 0) {
            continue;
          }
          tree[n * 2] = bi_reverse(next_code[len]++, len);
        }
      };
      tr_static_init = () => {
        let n;
        let bits;
        let length;
        let code;
        let dist;
        const bl_count = new Array(MAX_BITS + 1);
        length = 0;
        for (code = 0; code < LENGTH_CODES - 1; code++) {
          base_length[code] = length;
          for (n = 0; n < 1 << extra_lbits[code]; n++) {
            _length_code[length++] = code;
          }
        }
        _length_code[length - 1] = code;
        dist = 0;
        for (code = 0; code < 16; code++) {
          base_dist[code] = dist;
          for (n = 0; n < 1 << extra_dbits[code]; n++) {
            _dist_code[dist++] = code;
          }
        }
        dist >>= 7;
        for (; code < D_CODES; code++) {
          base_dist[code] = dist << 7;
          for (n = 0; n < 1 << extra_dbits[code] - 7; n++) {
            _dist_code[256 + dist++] = code;
          }
        }
        for (bits = 0; bits <= MAX_BITS; bits++) {
          bl_count[bits] = 0;
        }
        n = 0;
        while (n <= 143) {
          static_ltree[n * 2 + 1] = 8;
          n++;
          bl_count[8]++;
        }
        while (n <= 255) {
          static_ltree[n * 2 + 1] = 9;
          n++;
          bl_count[9]++;
        }
        while (n <= 279) {
          static_ltree[n * 2 + 1] = 7;
          n++;
          bl_count[7]++;
        }
        while (n <= 287) {
          static_ltree[n * 2 + 1] = 8;
          n++;
          bl_count[8]++;
        }
        gen_codes(static_ltree, L_CODES + 1, bl_count);
        for (n = 0; n < D_CODES; n++) {
          static_dtree[n * 2 + 1] = 5;
          static_dtree[n * 2] = bi_reverse(n, 5);
        }
        static_l_desc = new StaticTreeDesc(
          static_ltree,
          extra_lbits,
          LITERALS + 1,
          L_CODES,
          MAX_BITS
        );
        static_d_desc = new StaticTreeDesc(
          static_dtree,
          extra_dbits,
          0,
          D_CODES,
          MAX_BITS
        );
        static_bl_desc = new StaticTreeDesc(
          new Array(0),
          extra_blbits,
          0,
          BL_CODES,
          MAX_BL_BITS
        );
      };
      init_block = (s) => {
        let n;
        for (n = 0; n < L_CODES; n++) {
          s.dyn_ltree[n * 2] = 0;
        }
        for (n = 0; n < D_CODES; n++) {
          s.dyn_dtree[n * 2] = 0;
        }
        for (n = 0; n < BL_CODES; n++) {
          s.bl_tree[n * 2] = 0;
        }
        s.dyn_ltree[END_BLOCK * 2] = 1;
        s.opt_len = s.static_len = 0;
        s.sym_next = s.matches = 0;
      };
      bi_windup = (s) => {
        if (s.bi_valid > 8) {
          put_short(s, s.bi_buf);
        } else if (s.bi_valid > 0) {
          s.pending_buf[s.pending++] = s.bi_buf;
        }
        s.bi_buf = 0;
        s.bi_valid = 0;
      };
      smaller = (tree, n, m, depth) => {
        const _n2 = n * 2;
        const _m2 = m * 2;
        return tree[_n2] < tree[_m2] || tree[_n2] === tree[_m2] && depth[n] <= depth[m];
      };
      pqdownheap = (s, tree, k) => {
        const v = s.heap[k];
        let j = k << 1;
        while (j <= s.heap_len) {
          if (j < s.heap_len && smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) {
            j++;
          }
          if (smaller(tree, v, s.heap[j], s.depth)) {
            break;
          }
          s.heap[k] = s.heap[j];
          k = j;
          j <<= 1;
        }
        s.heap[k] = v;
      };
      compress_block = (s, ltree, dtree) => {
        let dist;
        let lc;
        let sx = 0;
        let code;
        let extra;
        if (s.sym_next !== 0) {
          do {
            dist = s.pending_buf[s.sym_buf + sx++] & 255;
            dist += (s.pending_buf[s.sym_buf + sx++] & 255) << 8;
            lc = s.pending_buf[s.sym_buf + sx++];
            if (dist === 0) {
              send_code(s, lc, ltree);
            } else {
              code = _length_code[lc];
              send_code(s, code + LITERALS + 1, ltree);
              extra = extra_lbits[code];
              if (extra !== 0) {
                lc -= base_length[code];
                send_bits(s, lc, extra);
              }
              dist--;
              code = d_code(dist);
              send_code(s, code, dtree);
              extra = extra_dbits[code];
              if (extra !== 0) {
                dist -= base_dist[code];
                send_bits(s, dist, extra);
              }
            }
          } while (sx < s.sym_next);
        }
        send_code(s, END_BLOCK, ltree);
      };
      build_tree = (s, desc) => {
        const tree = desc.dyn_tree;
        const stree = desc.stat_desc.static_tree;
        const has_stree = desc.stat_desc.has_stree;
        const elems = desc.stat_desc.elems;
        let n, m;
        let max_code = -1;
        let node;
        s.heap_len = 0;
        s.heap_max = HEAP_SIZE;
        for (n = 0; n < elems; n++) {
          if (tree[n * 2] !== 0) {
            s.heap[++s.heap_len] = max_code = n;
            s.depth[n] = 0;
          } else {
            tree[n * 2 + 1] = 0;
          }
        }
        while (s.heap_len < 2) {
          node = s.heap[++s.heap_len] = max_code < 2 ? ++max_code : 0;
          tree[node * 2] = 1;
          s.depth[node] = 0;
          s.opt_len--;
          if (has_stree) {
            s.static_len -= stree[node * 2 + 1];
          }
        }
        desc.max_code = max_code;
        for (n = s.heap_len >> 1; n >= 1; n--) {
          pqdownheap(s, tree, n);
        }
        node = elems;
        do {
          n = s.heap[
            1
            /*SMALLEST*/
          ];
          s.heap[
            1
            /*SMALLEST*/
          ] = s.heap[s.heap_len--];
          pqdownheap(
            s,
            tree,
            1
            /*SMALLEST*/
          );
          m = s.heap[
            1
            /*SMALLEST*/
          ];
          s.heap[--s.heap_max] = n;
          s.heap[--s.heap_max] = m;
          tree[node * 2] = tree[n * 2] + tree[m * 2];
          s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
          tree[n * 2 + 1] = tree[m * 2 + 1] = node;
          s.heap[
            1
            /*SMALLEST*/
          ] = node++;
          pqdownheap(
            s,
            tree,
            1
            /*SMALLEST*/
          );
        } while (s.heap_len >= 2);
        s.heap[--s.heap_max] = s.heap[
          1
          /*SMALLEST*/
        ];
        gen_bitlen(s, desc);
        gen_codes(tree, max_code, s.bl_count);
      };
      scan_tree = (s, tree, max_code) => {
        let n;
        let prevlen = -1;
        let curlen;
        let nextlen = tree[0 * 2 + 1];
        let count = 0;
        let max_count = 7;
        let min_count = 4;
        if (nextlen === 0) {
          max_count = 138;
          min_count = 3;
        }
        tree[(max_code + 1) * 2 + 1] = 65535;
        for (n = 0; n <= max_code; n++) {
          curlen = nextlen;
          nextlen = tree[(n + 1) * 2 + 1];
          if (++count < max_count && curlen === nextlen) {
            continue;
          } else if (count < min_count) {
            s.bl_tree[curlen * 2] += count;
          } else if (curlen !== 0) {
            if (curlen !== prevlen) {
              s.bl_tree[curlen * 2]++;
            }
            s.bl_tree[REP_3_6 * 2]++;
          } else if (count <= 10) {
            s.bl_tree[REPZ_3_10 * 2]++;
          } else {
            s.bl_tree[REPZ_11_138 * 2]++;
          }
          count = 0;
          prevlen = curlen;
          if (nextlen === 0) {
            max_count = 138;
            min_count = 3;
          } else if (curlen === nextlen) {
            max_count = 6;
            min_count = 3;
          } else {
            max_count = 7;
            min_count = 4;
          }
        }
      };
      send_tree = (s, tree, max_code) => {
        let n;
        let prevlen = -1;
        let curlen;
        let nextlen = tree[0 * 2 + 1];
        let count = 0;
        let max_count = 7;
        let min_count = 4;
        if (nextlen === 0) {
          max_count = 138;
          min_count = 3;
        }
        for (n = 0; n <= max_code; n++) {
          curlen = nextlen;
          nextlen = tree[(n + 1) * 2 + 1];
          if (++count < max_count && curlen === nextlen) {
            continue;
          } else if (count < min_count) {
            do {
              send_code(s, curlen, s.bl_tree);
            } while (--count !== 0);
          } else if (curlen !== 0) {
            if (curlen !== prevlen) {
              send_code(s, curlen, s.bl_tree);
              count--;
            }
            send_code(s, REP_3_6, s.bl_tree);
            send_bits(s, count - 3, 2);
          } else if (count <= 10) {
            send_code(s, REPZ_3_10, s.bl_tree);
            send_bits(s, count - 3, 3);
          } else {
            send_code(s, REPZ_11_138, s.bl_tree);
            send_bits(s, count - 11, 7);
          }
          count = 0;
          prevlen = curlen;
          if (nextlen === 0) {
            max_count = 138;
            min_count = 3;
          } else if (curlen === nextlen) {
            max_count = 6;
            min_count = 3;
          } else {
            max_count = 7;
            min_count = 4;
          }
        }
      };
      build_bl_tree = (s) => {
        let max_blindex;
        scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
        scan_tree(s, s.dyn_dtree, s.d_desc.max_code);
        build_tree(s, s.bl_desc);
        for (max_blindex = BL_CODES - 1; max_blindex >= 3; max_blindex--) {
          if (s.bl_tree[bl_order[max_blindex] * 2 + 1] !== 0) {
            break;
          }
        }
        s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
        return max_blindex;
      };
      send_all_trees = (s, lcodes, dcodes, blcodes) => {
        let rank2;
        send_bits(s, lcodes - 257, 5);
        send_bits(s, dcodes - 1, 5);
        send_bits(s, blcodes - 4, 4);
        for (rank2 = 0; rank2 < blcodes; rank2++) {
          send_bits(s, s.bl_tree[bl_order[rank2] * 2 + 1], 3);
        }
        send_tree(s, s.dyn_ltree, lcodes - 1);
        send_tree(s, s.dyn_dtree, dcodes - 1);
      };
      detect_data_type = (s) => {
        let block_mask = 4093624447;
        let n;
        for (n = 0; n <= 31; n++, block_mask >>>= 1) {
          if (block_mask & 1 && s.dyn_ltree[n * 2] !== 0) {
            return Z_BINARY;
          }
        }
        if (s.dyn_ltree[9 * 2] !== 0 || s.dyn_ltree[10 * 2] !== 0 || s.dyn_ltree[13 * 2] !== 0) {
          return Z_TEXT;
        }
        for (n = 32; n < LITERALS; n++) {
          if (s.dyn_ltree[n * 2] !== 0) {
            return Z_TEXT;
          }
        }
        return Z_BINARY;
      };
      static_init_done = false;
      _tr_init = (s) => {
        if (!static_init_done) {
          tr_static_init();
          static_init_done = true;
        }
        s.l_desc = new TreeDesc(s.dyn_ltree, static_l_desc);
        s.d_desc = new TreeDesc(s.dyn_dtree, static_d_desc);
        s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);
        s.bi_buf = 0;
        s.bi_valid = 0;
        init_block(s);
      };
      _tr_stored_block = (s, buf, stored_len, last) => {
        send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3);
        bi_windup(s);
        put_short(s, stored_len);
        put_short(s, ~stored_len);
        if (stored_len) {
          s.pending_buf.set(s.window.subarray(buf, buf + stored_len), s.pending);
        }
        s.pending += stored_len;
      };
      _tr_align = (s) => {
        send_bits(s, STATIC_TREES << 1, 3);
        send_code(s, END_BLOCK, static_ltree);
        bi_flush(s);
      };
      _tr_flush_block = (s, buf, stored_len, last) => {
        let opt_lenb, static_lenb;
        let max_blindex = 0;
        if (s.level > 0) {
          if (s.strm.data_type === Z_UNKNOWN) {
            s.strm.data_type = detect_data_type(s);
          }
          build_tree(s, s.l_desc);
          build_tree(s, s.d_desc);
          max_blindex = build_bl_tree(s);
          opt_lenb = s.opt_len + 3 + 7 >>> 3;
          static_lenb = s.static_len + 3 + 7 >>> 3;
          if (static_lenb <= opt_lenb) {
            opt_lenb = static_lenb;
          }
        } else {
          opt_lenb = static_lenb = stored_len + 5;
        }
        if (stored_len + 4 <= opt_lenb && buf !== -1) {
          _tr_stored_block(s, buf, stored_len, last);
        } else if (s.strategy === Z_FIXED || static_lenb === opt_lenb) {
          send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
          compress_block(s, static_ltree, static_dtree);
        } else {
          send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
          send_all_trees(
            s,
            s.l_desc.max_code + 1,
            s.d_desc.max_code + 1,
            max_blindex + 1
          );
          compress_block(s, s.dyn_ltree, s.dyn_dtree);
        }
        init_block(s);
        if (last) {
          bi_windup(s);
        }
      };
      _tr_tally = (s, dist, lc) => {
        s.pending_buf[s.sym_buf + s.sym_next++] = dist;
        s.pending_buf[s.sym_buf + s.sym_next++] = dist >> 8;
        s.pending_buf[s.sym_buf + s.sym_next++] = lc;
        if (dist === 0) {
          s.dyn_ltree[lc * 2]++;
        } else {
          s.matches++;
          dist--;
          s.dyn_ltree[(_length_code[lc] + LITERALS + 1) * 2]++;
          s.dyn_dtree[d_code(dist) * 2]++;
        }
        return s.sym_next === s.sym_end;
      };
      __tr_init = _tr_init;
      __tr_stored_block = _tr_stored_block;
      __tr_flush_block = _tr_flush_block;
      __tr_tally = _tr_tally;
      __tr_align = _tr_align;
    }
  });

  // src/pako/zlib/adler32.ts
  var adler32, adler32_default;
  var init_adler32 = __esm({
    "src/pako/zlib/adler32.ts"() {
      adler32 = (adler, buf, len, pos) => {
        let s1 = adler & 65535 | 0, s2 = adler >>> 16 & 65535 | 0, n = 0;
        while (len !== 0) {
          n = len > 2e3 ? 2e3 : len;
          len -= n;
          do {
            s1 = s1 + buf[pos++] | 0;
            s2 = s2 + s1 | 0;
          } while (--n);
          s1 %= 65521;
          s2 %= 65521;
        }
        return s1 | s2 << 16 | 0;
      };
      adler32_default = adler32;
    }
  });

  // src/pako/zlib/crc32.ts
  var makeTable, crcTable, crc32, crc32_default;
  var init_crc32 = __esm({
    "src/pako/zlib/crc32.ts"() {
      makeTable = () => {
        let c, table = [];
        for (var n = 0; n < 256; n++) {
          c = n;
          for (var k = 0; k < 8; k++) {
            c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
          }
          table[n] = c;
        }
        return table;
      };
      crcTable = new Uint32Array(makeTable());
      crc32 = (crc, buf, len, pos) => {
        const t = crcTable;
        const end = pos + len;
        crc ^= -1;
        for (let i = pos; i < end; i++) {
          crc = crc >>> 8 ^ t[(crc ^ buf[i]) & 255];
        }
        return crc ^ -1;
      };
      crc32_default = crc32;
    }
  });

  // src/pako/zlib/messages.ts
  var messages_default;
  var init_messages = __esm({
    "src/pako/zlib/messages.ts"() {
      "use strict";
      messages_default = {
        2: "need dictionary",
        1: "stream end",
        0: "",
        "-1": "file error",
        "-2": "stream error",
        "-3": "data error",
        "-4": "insufficient memory",
        "-5": "buffer error",
        "-6": "incompatible version"
      };
    }
  });

  // src/pako/zlib/constants.ts
  var Z_NO_FLUSH, Z_PARTIAL_FLUSH, Z_SYNC_FLUSH, Z_FULL_FLUSH, Z_FINISH, Z_BLOCK, Z_TREES, Z_OK, Z_STREAM_END, Z_NEED_DICT, Z_STREAM_ERROR, Z_DATA_ERROR, Z_MEM_ERROR, Z_BUF_ERROR, Z_DEFAULT_COMPRESSION, Z_FILTERED, Z_HUFFMAN_ONLY, Z_RLE, Z_FIXED2, Z_DEFAULT_STRATEGY, Z_UNKNOWN2, Z_DEFLATED;
  var init_constants = __esm({
    "src/pako/zlib/constants.ts"() {
      Z_NO_FLUSH = 0;
      Z_PARTIAL_FLUSH = 1;
      Z_SYNC_FLUSH = 2;
      Z_FULL_FLUSH = 3;
      Z_FINISH = 4;
      Z_BLOCK = 5;
      Z_TREES = 6;
      Z_OK = 0;
      Z_STREAM_END = 1;
      Z_NEED_DICT = 2;
      Z_STREAM_ERROR = -2;
      Z_DATA_ERROR = -3;
      Z_MEM_ERROR = -4;
      Z_BUF_ERROR = -5;
      Z_DEFAULT_COMPRESSION = -1;
      Z_FILTERED = 1;
      Z_HUFFMAN_ONLY = 2;
      Z_RLE = 3;
      Z_FIXED2 = 4;
      Z_DEFAULT_STRATEGY = 0;
      Z_UNKNOWN2 = 2;
      Z_DEFLATED = 8;
    }
  });

  // src/pako/zlib/deflate.ts
  function Config(good_length, max_lazy, nice_length, max_chain, func) {
    this.good_length = good_length;
    this.max_lazy = max_lazy;
    this.nice_length = nice_length;
    this.max_chain = max_chain;
    this.func = func;
  }
  function DeflateState() {
    this.strm = null;
    this.status = 0;
    this.pending_buf = null;
    this.pending_buf_size = 0;
    this.pending_out = 0;
    this.pending = 0;
    this.wrap = 0;
    this.gzhead = null;
    this.gzindex = 0;
    this.method = Z_DEFLATED;
    this.last_flush = -1;
    this.w_size = 0;
    this.w_bits = 0;
    this.w_mask = 0;
    this.window = null;
    this.window_size = 0;
    this.prev = null;
    this.head = null;
    this.ins_h = 0;
    this.hash_size = 0;
    this.hash_bits = 0;
    this.hash_mask = 0;
    this.hash_shift = 0;
    this.block_start = 0;
    this.match_length = 0;
    this.prev_match = 0;
    this.match_available = 0;
    this.strstart = 0;
    this.match_start = 0;
    this.lookahead = 0;
    this.prev_length = 0;
    this.max_chain_length = 0;
    this.max_lazy_match = 0;
    this.level = 0;
    this.strategy = 0;
    this.good_match = 0;
    this.nice_match = 0;
    this.dyn_ltree = new Uint16Array(HEAP_SIZE2 * 2);
    this.dyn_dtree = new Uint16Array((2 * D_CODES2 + 1) * 2);
    this.bl_tree = new Uint16Array((2 * BL_CODES2 + 1) * 2);
    zero2(this.dyn_ltree);
    zero2(this.dyn_dtree);
    zero2(this.bl_tree);
    this.l_desc = null;
    this.d_desc = null;
    this.bl_desc = null;
    this.bl_count = new Uint16Array(MAX_BITS2 + 1);
    this.heap = new Uint16Array(
      2 * L_CODES2 + 1
    );
    zero2(this.heap);
    this.heap_len = 0;
    this.heap_max = 0;
    this.depth = new Uint16Array(2 * L_CODES2 + 1);
    zero2(this.depth);
    this.sym_buf = 0;
    this.lit_bufsize = 0;
    this.sym_next = 0;
    this.sym_end = 0;
    this.opt_len = 0;
    this.static_len = 0;
    this.matches = 0;
    this.insert = 0;
    this.bi_buf = 0;
    this.bi_valid = 0;
  }
  var MAX_MEM_LEVEL, LENGTH_CODES2, LITERALS2, L_CODES2, D_CODES2, BL_CODES2, HEAP_SIZE2, MAX_BITS2, MIN_MATCH2, MAX_MATCH2, MIN_LOOKAHEAD, PRESET_DICT, INIT_STATE, GZIP_STATE, EXTRA_STATE, NAME_STATE, COMMENT_STATE, HCRC_STATE, BUSY_STATE, FINISH_STATE, BS_NEED_MORE, BS_BLOCK_DONE, BS_FINISH_STARTED, BS_FINISH_DONE, OS_CODE, err, rank, zero2, slide_hash, HASH_ZLIB, HASH, flush_pending, flush_block_only, put_byte, putShortMSB, read_buf, longest_match, fill_window, deflate_stored, deflate_fast, deflate_slow, deflate_rle, deflate_huff, configuration_table, lm_init, deflateStateCheck, deflateResetKeep, deflateReset, deflateSetHeader, deflateInit2, deflate, deflateEnd, deflateSetDictionary, _deflateInit2, _deflateSetHeader, _deflate, _deflateEnd, _deflateSetDictionary;
  var init_deflate = __esm({
    "src/pako/zlib/deflate.ts"() {
      init_trees();
      init_adler32();
      init_crc32();
      init_messages();
      init_constants();
      MAX_MEM_LEVEL = 9;
      LENGTH_CODES2 = 29;
      LITERALS2 = 256;
      L_CODES2 = LITERALS2 + 1 + LENGTH_CODES2;
      D_CODES2 = 30;
      BL_CODES2 = 19;
      HEAP_SIZE2 = 2 * L_CODES2 + 1;
      MAX_BITS2 = 15;
      MIN_MATCH2 = 3;
      MAX_MATCH2 = 258;
      MIN_LOOKAHEAD = MAX_MATCH2 + MIN_MATCH2 + 1;
      PRESET_DICT = 32;
      INIT_STATE = 42;
      GZIP_STATE = 57;
      EXTRA_STATE = 69;
      NAME_STATE = 73;
      COMMENT_STATE = 91;
      HCRC_STATE = 103;
      BUSY_STATE = 113;
      FINISH_STATE = 666;
      BS_NEED_MORE = 1;
      BS_BLOCK_DONE = 2;
      BS_FINISH_STARTED = 3;
      BS_FINISH_DONE = 4;
      OS_CODE = 3;
      err = (strm, errorCode) => {
        strm.msg = messages_default[errorCode];
        return errorCode;
      };
      rank = (f) => {
        return f * 2 - (f > 4 ? 9 : 0);
      };
      zero2 = (buf) => {
        let len = buf.length;
        while (--len >= 0) {
          buf[len] = 0;
        }
      };
      slide_hash = (s) => {
        let n, m;
        let p;
        let wsize = s.w_size;
        n = s.hash_size;
        p = n;
        do {
          m = s.head[--p];
          s.head[p] = m >= wsize ? m - wsize : 0;
        } while (--n);
        n = wsize;
        p = n;
        do {
          m = s.prev[--p];
          s.prev[p] = m >= wsize ? m - wsize : 0;
        } while (--n);
      };
      HASH_ZLIB = (s, prev, data) => (prev << s.hash_shift ^ data) & s.hash_mask;
      HASH = HASH_ZLIB;
      flush_pending = (strm) => {
        const s = strm.state;
        let len = s.pending;
        if (len > strm.avail_out) {
          len = strm.avail_out;
        }
        if (len === 0) {
          return;
        }
        strm.output.set(
          s.pending_buf.subarray(s.pending_out, s.pending_out + len),
          strm.next_out
        );
        strm.next_out += len;
        s.pending_out += len;
        strm.total_out += len;
        strm.avail_out -= len;
        s.pending -= len;
        if (s.pending === 0) {
          s.pending_out = 0;
        }
      };
      flush_block_only = (s, last) => {
        __tr_flush_block(
          s,
          s.block_start >= 0 ? s.block_start : -1,
          s.strstart - s.block_start,
          last
        );
        s.block_start = s.strstart;
        flush_pending(s.strm);
      };
      put_byte = (s, b) => {
        s.pending_buf[s.pending++] = b;
      };
      putShortMSB = (s, b) => {
        s.pending_buf[s.pending++] = b >>> 8 & 255;
        s.pending_buf[s.pending++] = b & 255;
      };
      read_buf = (strm, buf, start, size) => {
        let len = strm.avail_in;
        if (len > size) {
          len = size;
        }
        if (len === 0) {
          return 0;
        }
        strm.avail_in -= len;
        buf.set(strm.input.subarray(strm.next_in, strm.next_in + len), start);
        if (strm.state.wrap === 1) {
          strm.adler = adler32_default(strm.adler, buf, len, start);
        } else if (strm.state.wrap === 2) {
          strm.adler = crc32_default(strm.adler, buf, len, start);
        }
        strm.next_in += len;
        strm.total_in += len;
        return len;
      };
      longest_match = (s, cur_match) => {
        let chain_length = s.max_chain_length;
        let scan = s.strstart;
        let match;
        let len;
        let best_len = s.prev_length;
        let nice_match = s.nice_match;
        const limit = s.strstart > s.w_size - MIN_LOOKAHEAD ? s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0;
        const _win = s.window;
        const wmask = s.w_mask;
        const prev = s.prev;
        const strend = s.strstart + MAX_MATCH2;
        let scan_end1 = _win[scan + best_len - 1];
        let scan_end = _win[scan + best_len];
        if (s.prev_length >= s.good_match) {
          chain_length >>= 2;
        }
        if (nice_match > s.lookahead) {
          nice_match = s.lookahead;
        }
        do {
          match = cur_match;
          if (_win[match + best_len] !== scan_end || _win[match + best_len - 1] !== scan_end1 || _win[match] !== _win[scan] || _win[++match] !== _win[scan + 1]) {
            continue;
          }
          scan += 2;
          match++;
          do {
          } while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && scan < strend);
          len = MAX_MATCH2 - (strend - scan);
          scan = strend - MAX_MATCH2;
          if (len > best_len) {
            s.match_start = cur_match;
            best_len = len;
            if (len >= nice_match) {
              break;
            }
            scan_end1 = _win[scan + best_len - 1];
            scan_end = _win[scan + best_len];
          }
        } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);
        if (best_len <= s.lookahead) {
          return best_len;
        }
        return s.lookahead;
      };
      fill_window = (s) => {
        const _w_size = s.w_size;
        let n, more, str;
        do {
          more = s.window_size - s.lookahead - s.strstart;
          if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {
            s.window.set(s.window.subarray(_w_size, _w_size + _w_size - more), 0);
            s.match_start -= _w_size;
            s.strstart -= _w_size;
            s.block_start -= _w_size;
            if (s.insert > s.strstart) {
              s.insert = s.strstart;
            }
            slide_hash(s);
            more += _w_size;
          }
          if (s.strm.avail_in === 0) {
            break;
          }
          n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
          s.lookahead += n;
          if (s.lookahead + s.insert >= MIN_MATCH2) {
            str = s.strstart - s.insert;
            s.ins_h = s.window[str];
            s.ins_h = HASH(s, s.ins_h, s.window[str + 1]);
            while (s.insert) {
              s.ins_h = HASH(s, s.ins_h, s.window[str + MIN_MATCH2 - 1]);
              s.prev[str & s.w_mask] = s.head[s.ins_h];
              s.head[s.ins_h] = str;
              str++;
              s.insert--;
              if (s.lookahead + s.insert < MIN_MATCH2) {
                break;
              }
            }
          }
        } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);
      };
      deflate_stored = (s, flush) => {
        let min_block = s.pending_buf_size - 5 > s.w_size ? s.w_size : s.pending_buf_size - 5;
        let len, left, have, last = 0;
        let used = s.strm.avail_in;
        do {
          len = 65535;
          have = s.bi_valid + 42 >> 3;
          if (s.strm.avail_out < have) {
            break;
          }
          have = s.strm.avail_out - have;
          left = s.strstart - s.block_start;
          if (len > left + s.strm.avail_in) {
            len = left + s.strm.avail_in;
          }
          if (len > have) {
            len = have;
          }
          if (len < min_block && (len === 0 && flush !== Z_FINISH || flush === Z_NO_FLUSH || len !== left + s.strm.avail_in)) {
            break;
          }
          last = flush === Z_FINISH && len === left + s.strm.avail_in ? 1 : 0;
          __tr_stored_block(s, 0, 0, last);
          s.pending_buf[s.pending - 4] = len;
          s.pending_buf[s.pending - 3] = len >> 8;
          s.pending_buf[s.pending - 2] = ~len;
          s.pending_buf[s.pending - 1] = ~len >> 8;
          flush_pending(s.strm);
          if (left) {
            if (left > len) {
              left = len;
            }
            s.strm.output.set(
              s.window.subarray(s.block_start, s.block_start + left),
              s.strm.next_out
            );
            s.strm.next_out += left;
            s.strm.avail_out -= left;
            s.strm.total_out += left;
            s.block_start += left;
            len -= left;
          }
          if (len) {
            read_buf(s.strm, s.strm.output, s.strm.next_out, len);
            s.strm.next_out += len;
            s.strm.avail_out -= len;
            s.strm.total_out += len;
          }
        } while (last === 0);
        used -= s.strm.avail_in;
        if (used) {
          if (used >= s.w_size) {
            s.matches = 2;
            s.window.set(
              s.strm.input.subarray(s.strm.next_in - s.w_size, s.strm.next_in),
              0
            );
            s.strstart = s.w_size;
            s.insert = s.strstart;
          } else {
            if (s.window_size - s.strstart <= used) {
              s.strstart -= s.w_size;
              s.window.set(s.window.subarray(s.w_size, s.w_size + s.strstart), 0);
              if (s.matches < 2) {
                s.matches++;
              }
              if (s.insert > s.strstart) {
                s.insert = s.strstart;
              }
            }
            s.window.set(
              s.strm.input.subarray(s.strm.next_in - used, s.strm.next_in),
              s.strstart
            );
            s.strstart += used;
            s.insert += used > s.w_size - s.insert ? s.w_size - s.insert : used;
          }
          s.block_start = s.strstart;
        }
        if (s.high_water < s.strstart) {
          s.high_water = s.strstart;
        }
        if (last) {
          return BS_FINISH_DONE;
        }
        if (flush !== Z_NO_FLUSH && flush !== Z_FINISH && s.strm.avail_in === 0 && s.strstart === s.block_start) {
          return BS_BLOCK_DONE;
        }
        have = s.window_size - s.strstart;
        if (s.strm.avail_in > have && s.block_start >= s.w_size) {
          s.block_start -= s.w_size;
          s.strstart -= s.w_size;
          s.window.set(s.window.subarray(s.w_size, s.w_size + s.strstart), 0);
          if (s.matches < 2) {
            s.matches++;
          }
          have += s.w_size;
          if (s.insert > s.strstart) {
            s.insert = s.strstart;
          }
        }
        if (have > s.strm.avail_in) {
          have = s.strm.avail_in;
        }
        if (have) {
          read_buf(s.strm, s.window, s.strstart, have);
          s.strstart += have;
          s.insert += have > s.w_size - s.insert ? s.w_size - s.insert : have;
        }
        if (s.high_water < s.strstart) {
          s.high_water = s.strstart;
        }
        have = s.bi_valid + 42 >> 3;
        have = s.pending_buf_size - have > 65535 ? 65535 : s.pending_buf_size - have;
        min_block = have > s.w_size ? s.w_size : have;
        left = s.strstart - s.block_start;
        if (left >= min_block || (left || flush === Z_FINISH) && flush !== Z_NO_FLUSH && s.strm.avail_in === 0 && left <= have) {
          len = left > have ? have : left;
          last = flush === Z_FINISH && s.strm.avail_in === 0 && len === left ? 1 : 0;
          __tr_stored_block(s, s.block_start, len, last);
          s.block_start += len;
          flush_pending(s.strm);
        }
        return last ? BS_FINISH_STARTED : BS_NEED_MORE;
      };
      deflate_fast = (s, flush) => {
        let hash_head;
        let bflush;
        for (; ; ) {
          if (s.lookahead < MIN_LOOKAHEAD) {
            fill_window(s);
            if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
              return BS_NEED_MORE;
            }
            if (s.lookahead === 0) {
              break;
            }
          }
          hash_head = 0;
          if (s.lookahead >= MIN_MATCH2) {
            s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH2 - 1]);
            hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
            s.head[s.ins_h] = s.strstart;
          }
          if (hash_head !== 0 && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {
            s.match_length = longest_match(s, hash_head);
          }
          if (s.match_length >= MIN_MATCH2) {
            bflush = __tr_tally(
              s,
              s.strstart - s.match_start,
              s.match_length - MIN_MATCH2
            );
            s.lookahead -= s.match_length;
            if (s.match_length <= s.max_lazy_match && s.lookahead >= MIN_MATCH2) {
              s.match_length--;
              do {
                s.strstart++;
                s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH2 - 1]);
                hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
                s.head[s.ins_h] = s.strstart;
              } while (--s.match_length !== 0);
              s.strstart++;
            } else {
              s.strstart += s.match_length;
              s.match_length = 0;
              s.ins_h = s.window[s.strstart];
              s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + 1]);
            }
          } else {
            bflush = __tr_tally(s, 0, s.window[s.strstart]);
            s.lookahead--;
            s.strstart++;
          }
          if (bflush) {
            flush_block_only(s, false);
            if (s.strm.avail_out === 0) {
              return BS_NEED_MORE;
            }
          }
        }
        s.insert = s.strstart < MIN_MATCH2 - 1 ? s.strstart : MIN_MATCH2 - 1;
        if (flush === Z_FINISH) {
          flush_block_only(s, true);
          if (s.strm.avail_out === 0) {
            return BS_FINISH_STARTED;
          }
          return BS_FINISH_DONE;
        }
        if (s.sym_next) {
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        }
        return BS_BLOCK_DONE;
      };
      deflate_slow = (s, flush) => {
        let hash_head;
        let bflush;
        let max_insert;
        for (; ; ) {
          if (s.lookahead < MIN_LOOKAHEAD) {
            fill_window(s);
            if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
              return BS_NEED_MORE;
            }
            if (s.lookahead === 0) {
              break;
            }
          }
          hash_head = 0;
          if (s.lookahead >= MIN_MATCH2) {
            s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH2 - 1]);
            hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
            s.head[s.ins_h] = s.strstart;
          }
          s.prev_length = s.match_length;
          s.prev_match = s.match_start;
          s.match_length = MIN_MATCH2 - 1;
          if (hash_head !== 0 && s.prev_length < s.max_lazy_match && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {
            s.match_length = longest_match(s, hash_head);
            if (s.match_length <= 5 && (s.strategy === Z_FILTERED || s.match_length === MIN_MATCH2 && s.strstart - s.match_start > 4096)) {
              s.match_length = MIN_MATCH2 - 1;
            }
          }
          if (s.prev_length >= MIN_MATCH2 && s.match_length <= s.prev_length) {
            max_insert = s.strstart + s.lookahead - MIN_MATCH2;
            bflush = __tr_tally(
              s,
              s.strstart - 1 - s.prev_match,
              s.prev_length - MIN_MATCH2
            );
            s.lookahead -= s.prev_length - 1;
            s.prev_length -= 2;
            do {
              if (++s.strstart <= max_insert) {
                s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH2 - 1]);
                hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
                s.head[s.ins_h] = s.strstart;
              }
            } while (--s.prev_length !== 0);
            s.match_available = 0;
            s.match_length = MIN_MATCH2 - 1;
            s.strstart++;
            if (bflush) {
              flush_block_only(s, false);
              if (s.strm.avail_out === 0) {
                return BS_NEED_MORE;
              }
            }
          } else if (s.match_available) {
            bflush = __tr_tally(s, 0, s.window[s.strstart - 1]);
            if (bflush) {
              flush_block_only(s, false);
            }
            s.strstart++;
            s.lookahead--;
            if (s.strm.avail_out === 0) {
              return BS_NEED_MORE;
            }
          } else {
            s.match_available = 1;
            s.strstart++;
            s.lookahead--;
          }
        }
        if (s.match_available) {
          bflush = __tr_tally(s, 0, s.window[s.strstart - 1]);
          s.match_available = 0;
        }
        s.insert = s.strstart < MIN_MATCH2 - 1 ? s.strstart : MIN_MATCH2 - 1;
        if (flush === Z_FINISH) {
          flush_block_only(s, true);
          if (s.strm.avail_out === 0) {
            return BS_FINISH_STARTED;
          }
          return BS_FINISH_DONE;
        }
        if (s.sym_next) {
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        }
        return BS_BLOCK_DONE;
      };
      deflate_rle = (s, flush) => {
        let bflush;
        let prev;
        let scan, strend;
        const _win = s.window;
        for (; ; ) {
          if (s.lookahead <= MAX_MATCH2) {
            fill_window(s);
            if (s.lookahead <= MAX_MATCH2 && flush === Z_NO_FLUSH) {
              return BS_NEED_MORE;
            }
            if (s.lookahead === 0) {
              break;
            }
          }
          s.match_length = 0;
          if (s.lookahead >= MIN_MATCH2 && s.strstart > 0) {
            scan = s.strstart - 1;
            prev = _win[scan];
            if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
              strend = s.strstart + MAX_MATCH2;
              do {
              } while (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && scan < strend);
              s.match_length = MAX_MATCH2 - (strend - scan);
              if (s.match_length > s.lookahead) {
                s.match_length = s.lookahead;
              }
            }
          }
          if (s.match_length >= MIN_MATCH2) {
            bflush = __tr_tally(s, 1, s.match_length - MIN_MATCH2);
            s.lookahead -= s.match_length;
            s.strstart += s.match_length;
            s.match_length = 0;
          } else {
            bflush = __tr_tally(s, 0, s.window[s.strstart]);
            s.lookahead--;
            s.strstart++;
          }
          if (bflush) {
            flush_block_only(s, false);
            if (s.strm.avail_out === 0) {
              return BS_NEED_MORE;
            }
          }
        }
        s.insert = 0;
        if (flush === Z_FINISH) {
          flush_block_only(s, true);
          if (s.strm.avail_out === 0) {
            return BS_FINISH_STARTED;
          }
          return BS_FINISH_DONE;
        }
        if (s.sym_next) {
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        }
        return BS_BLOCK_DONE;
      };
      deflate_huff = (s, flush) => {
        let bflush;
        for (; ; ) {
          if (s.lookahead === 0) {
            fill_window(s);
            if (s.lookahead === 0) {
              if (flush === Z_NO_FLUSH) {
                return BS_NEED_MORE;
              }
              break;
            }
          }
          s.match_length = 0;
          bflush = __tr_tally(s, 0, s.window[s.strstart]);
          s.lookahead--;
          s.strstart++;
          if (bflush) {
            flush_block_only(s, false);
            if (s.strm.avail_out === 0) {
              return BS_NEED_MORE;
            }
          }
        }
        s.insert = 0;
        if (flush === Z_FINISH) {
          flush_block_only(s, true);
          if (s.strm.avail_out === 0) {
            return BS_FINISH_STARTED;
          }
          return BS_FINISH_DONE;
        }
        if (s.sym_next) {
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        }
        return BS_BLOCK_DONE;
      };
      configuration_table = [
        /*      good lazy nice chain */
        new Config(0, 0, 0, 0, deflate_stored),
        new Config(4, 4, 8, 4, deflate_fast),
        new Config(4, 5, 16, 8, deflate_fast),
        new Config(4, 6, 32, 32, deflate_fast),
        new Config(4, 4, 16, 16, deflate_slow),
        new Config(8, 16, 32, 32, deflate_slow),
        new Config(8, 16, 128, 128, deflate_slow),
        new Config(8, 32, 128, 256, deflate_slow),
        new Config(32, 128, 258, 1024, deflate_slow),
        new Config(32, 258, 258, 4096, deflate_slow)
      ];
      lm_init = (s) => {
        s.window_size = 2 * s.w_size;
        zero2(s.head);
        s.max_lazy_match = configuration_table[s.level].max_lazy;
        s.good_match = configuration_table[s.level].good_length;
        s.nice_match = configuration_table[s.level].nice_length;
        s.max_chain_length = configuration_table[s.level].max_chain;
        s.strstart = 0;
        s.block_start = 0;
        s.lookahead = 0;
        s.insert = 0;
        s.match_length = s.prev_length = MIN_MATCH2 - 1;
        s.match_available = 0;
        s.ins_h = 0;
      };
      deflateStateCheck = (strm) => {
        if (!strm) {
          return 1;
        }
        const s = strm.state;
        if (!s || s.strm !== strm || s.status !== INIT_STATE && //#ifdef GZIP
        s.status !== GZIP_STATE && //#endif
        s.status !== EXTRA_STATE && s.status !== NAME_STATE && s.status !== COMMENT_STATE && s.status !== HCRC_STATE && s.status !== BUSY_STATE && s.status !== FINISH_STATE) {
          return 1;
        }
        return 0;
      };
      deflateResetKeep = (strm) => {
        if (deflateStateCheck(strm)) {
          return err(strm, Z_STREAM_ERROR);
        }
        strm.total_in = strm.total_out = 0;
        strm.data_type = Z_UNKNOWN2;
        const s = strm.state;
        s.pending = 0;
        s.pending_out = 0;
        if (s.wrap < 0) {
          s.wrap = -s.wrap;
        }
        s.status = //#ifdef GZIP
        s.wrap === 2 ? GZIP_STATE : (
          //#endif
          s.wrap ? INIT_STATE : BUSY_STATE
        );
        strm.adler = s.wrap === 2 ? 0 : 1;
        s.last_flush = -2;
        __tr_init(s);
        return Z_OK;
      };
      deflateReset = (strm) => {
        const ret = deflateResetKeep(strm);
        if (ret === Z_OK) {
          lm_init(strm.state);
        }
        return ret;
      };
      deflateSetHeader = (strm, head) => {
        if (deflateStateCheck(strm) || strm.state.wrap !== 2) {
          return Z_STREAM_ERROR;
        }
        strm.state.gzhead = head;
        return Z_OK;
      };
      deflateInit2 = (strm, level, method, windowBits, memLevel, strategy) => {
        if (!strm) {
          return Z_STREAM_ERROR;
        }
        let wrap = 1;
        if (level === Z_DEFAULT_COMPRESSION) {
          level = 6;
        }
        if (windowBits < 0) {
          wrap = 0;
          windowBits = -windowBits;
        } else if (windowBits > 15) {
          wrap = 2;
          windowBits -= 16;
        }
        if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED || windowBits < 8 || windowBits > 15 || level < 0 || level > 9 || strategy < 0 || strategy > Z_FIXED2 || windowBits === 8 && wrap !== 1) {
          return err(strm, Z_STREAM_ERROR);
        }
        if (windowBits === 8) {
          windowBits = 9;
        }
        const s = new DeflateState();
        strm.state = s;
        s.strm = strm;
        s.status = INIT_STATE;
        s.wrap = wrap;
        s.gzhead = null;
        s.w_bits = windowBits;
        s.w_size = 1 << s.w_bits;
        s.w_mask = s.w_size - 1;
        s.hash_bits = memLevel + 7;
        s.hash_size = 1 << s.hash_bits;
        s.hash_mask = s.hash_size - 1;
        s.hash_shift = ~~((s.hash_bits + MIN_MATCH2 - 1) / MIN_MATCH2);
        s.window = new Uint8Array(s.w_size * 2);
        s.head = new Uint16Array(s.hash_size);
        s.prev = new Uint16Array(s.w_size);
        s.lit_bufsize = 1 << memLevel + 6;
        s.pending_buf_size = s.lit_bufsize * 4;
        s.pending_buf = new Uint8Array(s.pending_buf_size);
        s.sym_buf = s.lit_bufsize;
        s.sym_end = (s.lit_bufsize - 1) * 3;
        s.level = level;
        s.strategy = strategy;
        s.method = method;
        return deflateReset(strm);
      };
      deflate = (strm, flush) => {
        if (deflateStateCheck(strm) || flush > Z_BLOCK || flush < 0) {
          return strm ? err(strm, Z_STREAM_ERROR) : Z_STREAM_ERROR;
        }
        const s = strm.state;
        if (!strm.output || strm.avail_in !== 0 && !strm.input || s.status === FINISH_STATE && flush !== Z_FINISH) {
          return err(strm, strm.avail_out === 0 ? Z_BUF_ERROR : Z_STREAM_ERROR);
        }
        const old_flush = s.last_flush;
        s.last_flush = flush;
        if (s.pending !== 0) {
          flush_pending(strm);
          if (strm.avail_out === 0) {
            s.last_flush = -1;
            return Z_OK;
          }
        } else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) && flush !== Z_FINISH) {
          return err(strm, Z_BUF_ERROR);
        }
        if (s.status === FINISH_STATE && strm.avail_in !== 0) {
          return err(strm, Z_BUF_ERROR);
        }
        if (s.status === INIT_STATE && s.wrap === 0) {
          s.status = BUSY_STATE;
        }
        if (s.status === INIT_STATE) {
          let header = Z_DEFLATED + (s.w_bits - 8 << 4) << 8;
          let level_flags = -1;
          if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) {
            level_flags = 0;
          } else if (s.level < 6) {
            level_flags = 1;
          } else if (s.level === 6) {
            level_flags = 2;
          } else {
            level_flags = 3;
          }
          header |= level_flags << 6;
          if (s.strstart !== 0) {
            header |= PRESET_DICT;
          }
          header += 31 - header % 31;
          putShortMSB(s, header);
          if (s.strstart !== 0) {
            putShortMSB(s, strm.adler >>> 16);
            putShortMSB(s, strm.adler & 65535);
          }
          strm.adler = 1;
          s.status = BUSY_STATE;
          flush_pending(strm);
          if (s.pending !== 0) {
            s.last_flush = -1;
            return Z_OK;
          }
        }
        if (s.status === GZIP_STATE) {
          strm.adler = 0;
          put_byte(s, 31);
          put_byte(s, 139);
          put_byte(s, 8);
          if (!s.gzhead) {
            put_byte(s, 0);
            put_byte(s, 0);
            put_byte(s, 0);
            put_byte(s, 0);
            put_byte(s, 0);
            put_byte(
              s,
              s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0
            );
            put_byte(s, OS_CODE);
            s.status = BUSY_STATE;
            flush_pending(strm);
            if (s.pending !== 0) {
              s.last_flush = -1;
              return Z_OK;
            }
          } else {
            put_byte(
              s,
              (s.gzhead.text ? 1 : 0) + (s.gzhead.hcrc ? 2 : 0) + (!s.gzhead.extra ? 0 : 4) + (!s.gzhead.name ? 0 : 8) + (!s.gzhead.comment ? 0 : 16)
            );
            put_byte(s, s.gzhead.time & 255);
            put_byte(s, s.gzhead.time >> 8 & 255);
            put_byte(s, s.gzhead.time >> 16 & 255);
            put_byte(s, s.gzhead.time >> 24 & 255);
            put_byte(
              s,
              s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0
            );
            put_byte(s, s.gzhead.os & 255);
            if (s.gzhead.extra && s.gzhead.extra.length) {
              put_byte(s, s.gzhead.extra.length & 255);
              put_byte(s, s.gzhead.extra.length >> 8 & 255);
            }
            if (s.gzhead.hcrc) {
              strm.adler = crc32_default(strm.adler, s.pending_buf, s.pending, 0);
            }
            s.gzindex = 0;
            s.status = EXTRA_STATE;
          }
        }
        if (s.status === EXTRA_STATE) {
          if (s.gzhead.extra) {
            let beg = s.pending;
            let left = (s.gzhead.extra.length & 65535) - s.gzindex;
            while (s.pending + left > s.pending_buf_size) {
              let copy = s.pending_buf_size - s.pending;
              s.pending_buf.set(
                s.gzhead.extra.subarray(s.gzindex, s.gzindex + copy),
                s.pending
              );
              s.pending = s.pending_buf_size;
              if (s.gzhead.hcrc && s.pending > beg) {
                strm.adler = crc32_default(strm.adler, s.pending_buf, s.pending - beg, beg);
              }
              s.gzindex += copy;
              flush_pending(strm);
              if (s.pending !== 0) {
                s.last_flush = -1;
                return Z_OK;
              }
              beg = 0;
              left -= copy;
            }
            let gzhead_extra = new Uint8Array(s.gzhead.extra);
            s.pending_buf.set(
              gzhead_extra.subarray(s.gzindex, s.gzindex + left),
              s.pending
            );
            s.pending += left;
            if (s.gzhead.hcrc && s.pending > beg) {
              strm.adler = crc32_default(strm.adler, s.pending_buf, s.pending - beg, beg);
            }
            s.gzindex = 0;
          }
          s.status = NAME_STATE;
        }
        if (s.status === NAME_STATE) {
          if (s.gzhead.name) {
            let beg = s.pending;
            let val;
            do {
              if (s.pending === s.pending_buf_size) {
                if (s.gzhead.hcrc && s.pending > beg) {
                  strm.adler = crc32_default(strm.adler, s.pending_buf, s.pending - beg, beg);
                }
                flush_pending(strm);
                if (s.pending !== 0) {
                  s.last_flush = -1;
                  return Z_OK;
                }
                beg = 0;
              }
              if (s.gzindex < s.gzhead.name.length) {
                val = s.gzhead.name.charCodeAt(s.gzindex++) & 255;
              } else {
                val = 0;
              }
              put_byte(s, val);
            } while (val !== 0);
            if (s.gzhead.hcrc && s.pending > beg) {
              strm.adler = crc32_default(strm.adler, s.pending_buf, s.pending - beg, beg);
            }
            s.gzindex = 0;
          }
          s.status = COMMENT_STATE;
        }
        if (s.status === COMMENT_STATE) {
          if (s.gzhead.comment) {
            let beg = s.pending;
            let val;
            do {
              if (s.pending === s.pending_buf_size) {
                if (s.gzhead.hcrc && s.pending > beg) {
                  strm.adler = crc32_default(strm.adler, s.pending_buf, s.pending - beg, beg);
                }
                flush_pending(strm);
                if (s.pending !== 0) {
                  s.last_flush = -1;
                  return Z_OK;
                }
                beg = 0;
              }
              if (s.gzindex < s.gzhead.comment.length) {
                val = s.gzhead.comment.charCodeAt(s.gzindex++) & 255;
              } else {
                val = 0;
              }
              put_byte(s, val);
            } while (val !== 0);
            if (s.gzhead.hcrc && s.pending > beg) {
              strm.adler = crc32_default(strm.adler, s.pending_buf, s.pending - beg, beg);
            }
          }
          s.status = HCRC_STATE;
        }
        if (s.status === HCRC_STATE) {
          if (s.gzhead.hcrc) {
            if (s.pending + 2 > s.pending_buf_size) {
              flush_pending(strm);
              if (s.pending !== 0) {
                s.last_flush = -1;
                return Z_OK;
              }
            }
            put_byte(s, strm.adler & 255);
            put_byte(s, strm.adler >> 8 & 255);
            strm.adler = 0;
          }
          s.status = BUSY_STATE;
          flush_pending(strm);
          if (s.pending !== 0) {
            s.last_flush = -1;
            return Z_OK;
          }
        }
        if (strm.avail_in !== 0 || s.lookahead !== 0 || flush !== Z_NO_FLUSH && s.status !== FINISH_STATE) {
          let bstate = s.level === 0 ? deflate_stored(s, flush) : s.strategy === Z_HUFFMAN_ONLY ? deflate_huff(s, flush) : s.strategy === Z_RLE ? deflate_rle(s, flush) : configuration_table[s.level].func(s, flush);
          if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) {
            s.status = FINISH_STATE;
          }
          if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
            if (strm.avail_out === 0) {
              s.last_flush = -1;
            }
            return Z_OK;
          }
          if (bstate === BS_BLOCK_DONE) {
            if (flush === Z_PARTIAL_FLUSH) {
              __tr_align(s);
            } else if (flush !== Z_BLOCK) {
              __tr_stored_block(s, 0, 0, false);
              if (flush === Z_FULL_FLUSH) {
                zero2(s.head);
                if (s.lookahead === 0) {
                  s.strstart = 0;
                  s.block_start = 0;
                  s.insert = 0;
                }
              }
            }
            flush_pending(strm);
            if (strm.avail_out === 0) {
              s.last_flush = -1;
              return Z_OK;
            }
          }
        }
        if (flush !== Z_FINISH) {
          return Z_OK;
        }
        if (s.wrap <= 0) {
          return Z_STREAM_END;
        }
        if (s.wrap === 2) {
          put_byte(s, strm.adler & 255);
          put_byte(s, strm.adler >> 8 & 255);
          put_byte(s, strm.adler >> 16 & 255);
          put_byte(s, strm.adler >> 24 & 255);
          put_byte(s, strm.total_in & 255);
          put_byte(s, strm.total_in >> 8 & 255);
          put_byte(s, strm.total_in >> 16 & 255);
          put_byte(s, strm.total_in >> 24 & 255);
        } else {
          putShortMSB(s, strm.adler >>> 16);
          putShortMSB(s, strm.adler & 65535);
        }
        flush_pending(strm);
        if (s.wrap > 0) {
          s.wrap = -s.wrap;
        }
        return s.pending !== 0 ? Z_OK : Z_STREAM_END;
      };
      deflateEnd = (strm) => {
        if (deflateStateCheck(strm)) {
          return Z_STREAM_ERROR;
        }
        const status = strm.state.status;
        strm.state = null;
        return status === BUSY_STATE ? err(strm, Z_DATA_ERROR) : Z_OK;
      };
      deflateSetDictionary = (strm, dictionary) => {
        let dictLength = dictionary.length;
        if (deflateStateCheck(strm)) {
          return Z_STREAM_ERROR;
        }
        const s = strm.state;
        const wrap = s.wrap;
        if (wrap === 2 || wrap === 1 && s.status !== INIT_STATE || s.lookahead) {
          return Z_STREAM_ERROR;
        }
        if (wrap === 1) {
          strm.adler = adler32_default(strm.adler, dictionary, dictLength, 0);
        }
        s.wrap = 0;
        if (dictLength >= s.w_size) {
          if (wrap === 0) {
            zero2(s.head);
            s.strstart = 0;
            s.block_start = 0;
            s.insert = 0;
          }
          let tmpDict = new Uint8Array(s.w_size);
          tmpDict.set(dictionary.subarray(dictLength - s.w_size, dictLength), 0);
          dictionary = tmpDict;
          dictLength = s.w_size;
        }
        const avail = strm.avail_in;
        const next = strm.next_in;
        const input = strm.input;
        strm.avail_in = dictLength;
        strm.next_in = 0;
        strm.input = dictionary;
        fill_window(s);
        while (s.lookahead >= MIN_MATCH2) {
          let str = s.strstart;
          let n = s.lookahead - (MIN_MATCH2 - 1);
          do {
            s.ins_h = HASH(s, s.ins_h, s.window[str + MIN_MATCH2 - 1]);
            s.prev[str & s.w_mask] = s.head[s.ins_h];
            s.head[s.ins_h] = str;
            str++;
          } while (--n);
          s.strstart = str;
          s.lookahead = MIN_MATCH2 - 1;
          fill_window(s);
        }
        s.strstart += s.lookahead;
        s.block_start = s.strstart;
        s.insert = s.lookahead;
        s.lookahead = 0;
        s.match_length = s.prev_length = MIN_MATCH2 - 1;
        s.match_available = 0;
        strm.next_in = next;
        strm.input = input;
        strm.avail_in = avail;
        s.wrap = wrap;
        return Z_OK;
      };
      _deflateInit2 = deflateInit2;
      _deflateSetHeader = deflateSetHeader;
      _deflate = deflate;
      _deflateEnd = deflateEnd;
      _deflateSetDictionary = deflateSetDictionary;
    }
  });

  // src/pako/utils/common.ts
  function assign(obj, ...sources) {
    while (sources.length) {
      const source = sources.shift();
      if (!source) {
        continue;
      }
      if (typeof source !== "object") {
        throw new TypeError(source + "must be non-object");
      }
      for (const p in source) {
        if (_has(source, p)) {
          obj[p] = source[p];
        }
      }
    }
    return obj;
  }
  function flattenChunks(chunks) {
    let len = 0;
    for (let i = 0, l = chunks.length; i < l; i++) {
      len += chunks[i].length;
    }
    const result = new Uint8Array(len);
    for (let i = 0, pos = 0, l = chunks.length; i < l; i++) {
      let chunk = chunks[i];
      result.set(chunk, pos);
      pos += chunk.length;
    }
    return result;
  }
  var _has;
  var init_common = __esm({
    "src/pako/utils/common.ts"() {
      _has = (obj, key) => {
        return Object.prototype.hasOwnProperty.call(obj, key);
      };
    }
  });

  // src/pako/utils/strings.ts
  function string2buf(str) {
    if (typeof TextEncoder === "function" && TextEncoder.prototype.encode) {
      return new TextEncoder().encode(str);
    }
    let buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;
    for (m_pos = 0; m_pos < str_len; m_pos++) {
      c = str.charCodeAt(m_pos);
      if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
        c2 = str.charCodeAt(m_pos + 1);
        if ((c2 & 64512) === 56320) {
          c = 65536 + (c - 55296 << 10) + (c2 - 56320);
          m_pos++;
        }
      }
      buf_len += c < 128 ? 1 : c < 2048 ? 2 : c < 65536 ? 3 : 4;
    }
    buf = new Uint8Array(buf_len);
    for (i = 0, m_pos = 0; i < buf_len; m_pos++) {
      c = str.charCodeAt(m_pos);
      if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
        c2 = str.charCodeAt(m_pos + 1);
        if ((c2 & 64512) === 56320) {
          c = 65536 + (c - 55296 << 10) + (c2 - 56320);
          m_pos++;
        }
      }
      if (c < 128) {
        buf[i++] = c;
      } else if (c < 2048) {
        buf[i++] = 192 | c >>> 6;
        buf[i++] = 128 | c & 63;
      } else if (c < 65536) {
        buf[i++] = 224 | c >>> 12;
        buf[i++] = 128 | c >>> 6 & 63;
        buf[i++] = 128 | c & 63;
      } else {
        buf[i++] = 240 | c >>> 18;
        buf[i++] = 128 | c >>> 12 & 63;
        buf[i++] = 128 | c >>> 6 & 63;
        buf[i++] = 128 | c & 63;
      }
    }
    return buf;
  }
  function buf2string(buf, max) {
    const len = max || buf.length;
    if (typeof TextDecoder === "function" && TextDecoder.prototype.decode) {
      return new TextDecoder().decode(buf.subarray(0, max));
    }
    let i, out;
    const utf16buf = new Array(len * 2);
    for (out = 0, i = 0; i < len; ) {
      let c = buf[i++];
      if (c < 128) {
        utf16buf[out++] = c;
        continue;
      }
      let c_len = _utf8len[c];
      if (c_len > 4) {
        utf16buf[out++] = 65533;
        i += c_len - 1;
        continue;
      }
      c &= c_len === 2 ? 31 : c_len === 3 ? 15 : 7;
      while (c_len > 1 && i < len) {
        c = c << 6 | buf[i++] & 63;
        c_len--;
      }
      if (c_len > 1) {
        utf16buf[out++] = 65533;
        continue;
      }
      if (c < 65536) {
        utf16buf[out++] = c;
      } else {
        c -= 65536;
        utf16buf[out++] = 55296 | c >> 10 & 1023;
        utf16buf[out++] = 56320 | c & 1023;
      }
    }
    return buf2binstring(utf16buf, out);
  }
  function utf8border(buf, max) {
    max = max || buf.length;
    if (max > buf.length) {
      max = buf.length;
    }
    let pos = max - 1;
    while (pos >= 0 && (buf[pos] & 192) === 128) {
      pos--;
    }
    if (pos < 0) {
      return max;
    }
    if (pos === 0) {
      return max;
    }
    return pos + _utf8len[buf[pos]] > max ? pos : max;
  }
  var STR_APPLY_UIA_OK, _utf8len, buf2binstring;
  var init_strings = __esm({
    "src/pako/utils/strings.ts"() {
      STR_APPLY_UIA_OK = true;
      try {
        String.fromCharCode.apply(null, new Uint8Array(1));
      } catch (__) {
        STR_APPLY_UIA_OK = false;
      }
      _utf8len = new Uint8Array(256);
      for (let q = 0; q < 256; q++) {
        _utf8len[q] = q >= 252 ? 6 : q >= 248 ? 5 : q >= 240 ? 4 : q >= 224 ? 3 : q >= 192 ? 2 : 1;
      }
      _utf8len[254] = _utf8len[254] = 1;
      buf2binstring = (buf, len) => {
        if (len < 65534) {
          if (buf.subarray && STR_APPLY_UIA_OK) {
            return String.fromCharCode.apply(
              null,
              buf.length === len ? buf : buf.subarray(0, len)
            );
          }
        }
        let result = "";
        for (let i = 0; i < len; i++) {
          result += String.fromCharCode(buf[i]);
        }
        return result;
      };
    }
  });

  // src/pako/zlib/zstream.ts
  function ZStream() {
    this.input = null;
    this.next_in = 0;
    this.avail_in = 0;
    this.total_in = 0;
    this.output = null;
    this.next_out = 0;
    this.avail_out = 0;
    this.total_out = 0;
    this.msg = "";
    this.state = null;
    this.data_type = 2;
    this.adler = 0;
  }
  var zstream_default;
  var init_zstream = __esm({
    "src/pako/zlib/zstream.ts"() {
      zstream_default = ZStream;
    }
  });

  // src/pako/deflate.ts
  function Deflate(options) {
    this.options = assign(
      {
        level: Z_DEFAULT_COMPRESSION,
        method: Z_DEFLATED,
        chunkSize: 16384,
        windowBits: 15,
        memLevel: 8,
        strategy: Z_DEFAULT_STRATEGY
      },
      options || {}
    );
    let opt = this.options;
    if (opt.raw && opt.windowBits > 0) {
      opt.windowBits = -opt.windowBits;
    } else if (opt.gzip && opt.windowBits > 0 && opt.windowBits < 16) {
      opt.windowBits += 16;
    }
    this.err = 0;
    this.msg = "";
    this.ended = false;
    this.chunks = [];
    this.strm = new zstream_default();
    this.strm.avail_out = 0;
    let status = _deflateInit2(
      this.strm,
      opt.level,
      opt.method,
      opt.windowBits,
      opt.memLevel,
      opt.strategy
    );
    if (status !== Z_OK) {
      throw new Error(messages_default[status]);
    }
    if (opt.header) {
      _deflateSetHeader(this.strm, opt.header);
    }
    if (opt.dictionary) {
      let dict;
      if (typeof opt.dictionary === "string") {
        dict = string2buf(opt.dictionary);
      } else if (toString.call(opt.dictionary) === "[object ArrayBuffer]") {
        dict = new Uint8Array(opt.dictionary);
      } else {
        dict = opt.dictionary;
      }
      status = _deflateSetDictionary(this.strm, dict);
      if (status !== Z_OK) {
        throw new Error(messages_default[status]);
      }
      this._dict_set = true;
    }
  }
  function deflate2(input, options = {}) {
    const deflator = new Deflate(options);
    deflator.push(input, true);
    if (deflator.err) {
      throw deflator.msg || messages_default[deflator.err];
    }
    return deflator.result;
  }
  var toString;
  var init_deflate2 = __esm({
    "src/pako/deflate.ts"() {
      init_deflate();
      init_common();
      init_strings();
      init_messages();
      init_zstream();
      init_constants();
      init_constants();
      toString = Object.prototype.toString;
      Deflate.prototype.push = function(data, flush_mode) {
        const strm = this.strm;
        const chunkSize = this.options.chunkSize;
        let status, _flush_mode;
        if (this.ended) {
          return false;
        }
        if (flush_mode === ~~flush_mode) _flush_mode = flush_mode;
        else _flush_mode = flush_mode === true ? Z_FINISH : Z_NO_FLUSH;
        if (typeof data === "string") {
          strm.input = string2buf(data);
        } else if (toString.call(data) === "[object ArrayBuffer]") {
          strm.input = new Uint8Array(data);
        } else {
          strm.input = data;
        }
        strm.next_in = 0;
        strm.avail_in = strm.input.length;
        for (; ; ) {
          if (strm.avail_out === 0) {
            strm.output = new Uint8Array(chunkSize);
            strm.next_out = 0;
            strm.avail_out = chunkSize;
          }
          if ((_flush_mode === Z_SYNC_FLUSH || _flush_mode === Z_FULL_FLUSH) && strm.avail_out <= 6) {
            this.onData(strm.output.subarray(0, strm.next_out));
            strm.avail_out = 0;
            continue;
          }
          status = _deflate(strm, _flush_mode);
          if (status === Z_STREAM_END) {
            if (strm.next_out > 0) {
              this.onData(strm.output.subarray(0, strm.next_out));
            }
            status = _deflateEnd(this.strm);
            this.onEnd(status);
            this.ended = true;
            return status === Z_OK;
          }
          if (strm.avail_out === 0) {
            this.onData(strm.output);
            continue;
          }
          if (_flush_mode > 0 && strm.next_out > 0) {
            this.onData(strm.output.subarray(0, strm.next_out));
            strm.avail_out = 0;
            continue;
          }
          if (strm.avail_in === 0) break;
        }
        return true;
      };
      Deflate.prototype.onData = function(chunk) {
        this.chunks.push(chunk);
      };
      Deflate.prototype.onEnd = function(status) {
        if (status === Z_OK) {
          this.result = flattenChunks(this.chunks);
        }
        this.chunks = [];
        this.err = status;
        this.msg = this.strm.msg;
      };
    }
  });

  // src/pako/zlib/inffast.ts
  function inflate_fast(strm, start) {
    let _in;
    let last;
    let _out;
    let beg;
    let end;
    let dmax;
    let wsize;
    let whave;
    let wnext;
    let s_window;
    let hold;
    let bits;
    let lcode;
    let dcode;
    let lmask;
    let dmask;
    let here;
    let op;
    let len;
    let dist;
    let from;
    let from_source;
    let input, output;
    const state = strm.state;
    _in = strm.next_in;
    input = strm.input;
    last = _in + (strm.avail_in - 5);
    _out = strm.next_out;
    output = strm.output;
    beg = _out - (start - strm.avail_out);
    end = _out + (strm.avail_out - 257);
    dmax = state.dmax;
    wsize = state.wsize;
    whave = state.whave;
    wnext = state.wnext;
    s_window = state.window;
    hold = state.hold;
    bits = state.bits;
    lcode = state.lencode;
    dcode = state.distcode;
    lmask = (1 << state.lenbits) - 1;
    dmask = (1 << state.distbits) - 1;
    top: do {
      if (bits < 15) {
        hold += input[_in++] << bits;
        bits += 8;
        hold += input[_in++] << bits;
        bits += 8;
      }
      here = lcode[hold & lmask];
      dolen: for (; ; ) {
        op = here >>> 24;
        hold >>>= op;
        bits -= op;
        op = here >>> 16 & 255;
        if (op === 0) {
          output[_out++] = here & 65535;
        } else if (op & 16) {
          len = here & 65535;
          op &= 15;
          if (op) {
            if (bits < op) {
              hold += input[_in++] << bits;
              bits += 8;
            }
            len += hold & (1 << op) - 1;
            hold >>>= op;
            bits -= op;
          }
          if (bits < 15) {
            hold += input[_in++] << bits;
            bits += 8;
            hold += input[_in++] << bits;
            bits += 8;
          }
          here = dcode[hold & dmask];
          dodist: for (; ; ) {
            op = here >>> 24;
            hold >>>= op;
            bits -= op;
            op = here >>> 16 & 255;
            if (op & 16) {
              dist = here & 65535;
              op &= 15;
              if (bits < op) {
                hold += input[_in++] << bits;
                bits += 8;
                if (bits < op) {
                  hold += input[_in++] << bits;
                  bits += 8;
                }
              }
              dist += hold & (1 << op) - 1;
              if (dist > dmax) {
                strm.msg = "invalid distance too far back";
                state.mode = BAD;
                break top;
              }
              hold >>>= op;
              bits -= op;
              op = _out - beg;
              if (dist > op) {
                op = dist - op;
                if (op > whave) {
                  if (state.sane) {
                    strm.msg = "invalid distance too far back";
                    state.mode = BAD;
                    break top;
                  }
                }
                from = 0;
                from_source = s_window;
                if (wnext === 0) {
                  from += wsize - op;
                  if (op < len) {
                    len -= op;
                    do {
                      output[_out++] = s_window[from++];
                    } while (--op);
                    from = _out - dist;
                    from_source = output;
                  }
                } else if (wnext < op) {
                  from += wsize + wnext - op;
                  op -= wnext;
                  if (op < len) {
                    len -= op;
                    do {
                      output[_out++] = s_window[from++];
                    } while (--op);
                    from = 0;
                    if (wnext < len) {
                      op = wnext;
                      len -= op;
                      do {
                        output[_out++] = s_window[from++];
                      } while (--op);
                      from = _out - dist;
                      from_source = output;
                    }
                  }
                } else {
                  from += wnext - op;
                  if (op < len) {
                    len -= op;
                    do {
                      output[_out++] = s_window[from++];
                    } while (--op);
                    from = _out - dist;
                    from_source = output;
                  }
                }
                while (len > 2) {
                  output[_out++] = from_source[from++];
                  output[_out++] = from_source[from++];
                  output[_out++] = from_source[from++];
                  len -= 3;
                }
                if (len) {
                  output[_out++] = from_source[from++];
                  if (len > 1) {
                    output[_out++] = from_source[from++];
                  }
                }
              } else {
                from = _out - dist;
                do {
                  output[_out++] = output[from++];
                  output[_out++] = output[from++];
                  output[_out++] = output[from++];
                  len -= 3;
                } while (len > 2);
                if (len) {
                  output[_out++] = output[from++];
                  if (len > 1) {
                    output[_out++] = output[from++];
                  }
                }
              }
            } else if ((op & 64) === 0) {
              here = dcode[(here & 65535) + (hold & (1 << op) - 1)];
              continue dodist;
            } else {
              strm.msg = "invalid distance code";
              state.mode = BAD;
              break top;
            }
            break;
          }
        } else if ((op & 64) === 0) {
          here = lcode[(here & 65535) + (hold & (1 << op) - 1)];
          continue dolen;
        } else if (op & 32) {
          state.mode = TYPE;
          break top;
        } else {
          strm.msg = "invalid literal/length code";
          state.mode = BAD;
          break top;
        }
        break;
      }
    } while (_in < last && _out < end);
    len = bits >> 3;
    _in -= len;
    bits -= len << 3;
    hold &= (1 << bits) - 1;
    strm.next_in = _in;
    strm.next_out = _out;
    strm.avail_in = _in < last ? 5 + (last - _in) : 5 - (_in - last);
    strm.avail_out = _out < end ? 257 + (end - _out) : 257 - (_out - end);
    state.hold = hold;
    state.bits = bits;
    return;
  }
  var BAD, TYPE;
  var init_inffast = __esm({
    "src/pako/zlib/inffast.ts"() {
      BAD = 16209;
      TYPE = 16191;
    }
  });

  // src/pako/zlib/inftrees.ts
  var MAXBITS, ENOUGH_LENS, ENOUGH_DISTS, CODES, LENS, DISTS, lbase, lext, dbase, dext, inflate_table, inftrees_default;
  var init_inftrees = __esm({
    "src/pako/zlib/inftrees.ts"() {
      MAXBITS = 15;
      ENOUGH_LENS = 852;
      ENOUGH_DISTS = 592;
      CODES = 0;
      LENS = 1;
      DISTS = 2;
      lbase = new Uint16Array([
        /* Length codes 257..285 base */
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        13,
        15,
        17,
        19,
        23,
        27,
        31,
        35,
        43,
        51,
        59,
        67,
        83,
        99,
        115,
        131,
        163,
        195,
        227,
        258,
        0,
        0
      ]);
      lext = new Uint8Array([
        /* Length codes 257..285 extra */
        16,
        16,
        16,
        16,
        16,
        16,
        16,
        16,
        17,
        17,
        17,
        17,
        18,
        18,
        18,
        18,
        19,
        19,
        19,
        19,
        20,
        20,
        20,
        20,
        21,
        21,
        21,
        21,
        16,
        72,
        78
      ]);
      dbase = new Uint16Array([
        /* Distance codes 0..29 base */
        1,
        2,
        3,
        4,
        5,
        7,
        9,
        13,
        17,
        25,
        33,
        49,
        65,
        97,
        129,
        193,
        257,
        385,
        513,
        769,
        1025,
        1537,
        2049,
        3073,
        4097,
        6145,
        8193,
        12289,
        16385,
        24577,
        0,
        0
      ]);
      dext = new Uint8Array([
        /* Distance codes 0..29 extra */
        16,
        16,
        16,
        16,
        17,
        17,
        18,
        18,
        19,
        19,
        20,
        20,
        21,
        21,
        22,
        22,
        23,
        23,
        24,
        24,
        25,
        25,
        26,
        26,
        27,
        27,
        28,
        28,
        29,
        29,
        64,
        64
      ]);
      inflate_table = (type, lens, lens_index, codes, table, table_index, work, opts) => {
        const bits = opts.bits;
        let len = 0;
        let sym = 0;
        let min = 0, max = 0;
        let root = 0;
        let curr = 0;
        let drop = 0;
        let left = 0;
        let used = 0;
        let huff = 0;
        let incr;
        let fill;
        let low;
        let mask;
        let next;
        let base = null;
        let match;
        const count = new Uint16Array(MAXBITS + 1);
        const offs = new Uint16Array(MAXBITS + 1);
        let extra = null;
        let here_bits, here_op, here_val;
        for (len = 0; len <= MAXBITS; len++) {
          count[len] = 0;
        }
        for (sym = 0; sym < codes; sym++) {
          count[lens[lens_index + sym]]++;
        }
        root = bits;
        for (max = MAXBITS; max >= 1; max--) {
          if (count[max] !== 0) {
            break;
          }
        }
        if (root > max) {
          root = max;
        }
        if (max === 0) {
          table[table_index++] = 1 << 24 | 64 << 16 | 0;
          table[table_index++] = 1 << 24 | 64 << 16 | 0;
          opts.bits = 1;
          return 0;
        }
        for (min = 1; min < max; min++) {
          if (count[min] !== 0) {
            break;
          }
        }
        if (root < min) {
          root = min;
        }
        left = 1;
        for (len = 1; len <= MAXBITS; len++) {
          left <<= 1;
          left -= count[len];
          if (left < 0) {
            return -1;
          }
        }
        if (left > 0 && (type === CODES || max !== 1)) {
          return -1;
        }
        offs[1] = 0;
        for (len = 1; len < MAXBITS; len++) {
          offs[len + 1] = offs[len] + count[len];
        }
        for (sym = 0; sym < codes; sym++) {
          if (lens[lens_index + sym] !== 0) {
            work[offs[lens[lens_index + sym]]++] = sym;
          }
        }
        if (type === CODES) {
          base = extra = work;
          match = 20;
        } else if (type === LENS) {
          base = lbase;
          extra = lext;
          match = 257;
        } else {
          base = dbase;
          extra = dext;
          match = 0;
        }
        huff = 0;
        sym = 0;
        len = min;
        next = table_index;
        curr = root;
        drop = 0;
        low = -1;
        used = 1 << root;
        mask = used - 1;
        if (type === LENS && used > ENOUGH_LENS || type === DISTS && used > ENOUGH_DISTS) {
          return 1;
        }
        for (; ; ) {
          here_bits = len - drop;
          if (work[sym] + 1 < match) {
            here_op = 0;
            here_val = work[sym];
          } else if (work[sym] >= match) {
            here_op = extra[work[sym] - match];
            here_val = base[work[sym] - match];
          } else {
            here_op = 32 + 64;
            here_val = 0;
          }
          incr = 1 << len - drop;
          fill = 1 << curr;
          min = fill;
          do {
            fill -= incr;
            table[next + (huff >> drop) + fill] = here_bits << 24 | here_op << 16 | here_val | 0;
          } while (fill !== 0);
          incr = 1 << len - 1;
          while (huff & incr) {
            incr >>= 1;
          }
          if (incr !== 0) {
            huff &= incr - 1;
            huff += incr;
          } else {
            huff = 0;
          }
          sym++;
          if (--count[len] === 0) {
            if (len === max) {
              break;
            }
            len = lens[lens_index + work[sym]];
          }
          if (len > root && (huff & mask) !== low) {
            if (drop === 0) {
              drop = root;
            }
            next += min;
            curr = len - drop;
            left = 1 << curr;
            while (curr + drop < max) {
              left -= count[curr + drop];
              if (left <= 0) {
                break;
              }
              curr++;
              left <<= 1;
            }
            used += 1 << curr;
            if (type === LENS && used > ENOUGH_LENS || type === DISTS && used > ENOUGH_DISTS) {
              return 1;
            }
            low = huff & mask;
            table[low] = root << 24 | curr << 16 | next - table_index | 0;
          }
        }
        if (huff !== 0) {
          table[next + huff] = len - drop << 24 | 64 << 16 | 0;
        }
        opts.bits = root;
        return 0;
      };
      inftrees_default = inflate_table;
    }
  });

  // src/pako/zlib/inflate.ts
  function InflateState() {
    this.strm = null;
    this.mode = 0;
    this.last = false;
    this.wrap = 0;
    this.havedict = false;
    this.flags = 0;
    this.dmax = 0;
    this.check = 0;
    this.total = 0;
    this.head = null;
    this.wbits = 0;
    this.wsize = 0;
    this.whave = 0;
    this.wnext = 0;
    this.window = null;
    this.hold = 0;
    this.bits = 0;
    this.length = 0;
    this.offset = 0;
    this.extra = 0;
    this.lencode = null;
    this.distcode = null;
    this.lenbits = 0;
    this.distbits = 0;
    this.ncode = 0;
    this.nlen = 0;
    this.ndist = 0;
    this.have = 0;
    this.next = null;
    this.lens = new Uint16Array(320);
    this.work = new Uint16Array(288);
    this.lendyn = null;
    this.distdyn = null;
    this.sane = 0;
    this.back = 0;
    this.was = 0;
  }
  var CODES2, LENS2, DISTS2, HEAD, FLAGS, TIME, OS, EXLEN, EXTRA, NAME, COMMENT, HCRC, DICTID, DICT, TYPE2, TYPEDO, STORED, COPY_, COPY, TABLE, LENLENS, CODELENS, LEN_, LEN, LENEXT, DIST, DISTEXT, MATCH, LIT, CHECK, LENGTH, DONE, BAD2, MEM, SYNC, ENOUGH_LENS2, ENOUGH_DISTS2, zswap32, inflateStateCheck, inflateResetKeep, inflateReset, inflateReset2, inflateInit2, virgin, lenfix, distfix, fixedtables, updatewindow, inflate, inflateEnd, inflateGetHeader, inflateSetDictionary, _inflateReset, _inflateInit2, _inflate, _inflateEnd, _inflateGetHeader, _inflateSetDictionary;
  var init_inflate = __esm({
    "src/pako/zlib/inflate.ts"() {
      init_adler32();
      init_crc32();
      init_inffast();
      init_inftrees();
      init_constants();
      CODES2 = 0;
      LENS2 = 1;
      DISTS2 = 2;
      HEAD = 16180;
      FLAGS = 16181;
      TIME = 16182;
      OS = 16183;
      EXLEN = 16184;
      EXTRA = 16185;
      NAME = 16186;
      COMMENT = 16187;
      HCRC = 16188;
      DICTID = 16189;
      DICT = 16190;
      TYPE2 = 16191;
      TYPEDO = 16192;
      STORED = 16193;
      COPY_ = 16194;
      COPY = 16195;
      TABLE = 16196;
      LENLENS = 16197;
      CODELENS = 16198;
      LEN_ = 16199;
      LEN = 16200;
      LENEXT = 16201;
      DIST = 16202;
      DISTEXT = 16203;
      MATCH = 16204;
      LIT = 16205;
      CHECK = 16206;
      LENGTH = 16207;
      DONE = 16208;
      BAD2 = 16209;
      MEM = 16210;
      SYNC = 16211;
      ENOUGH_LENS2 = 852;
      ENOUGH_DISTS2 = 592;
      zswap32 = (q) => {
        return (q >>> 24 & 255) + (q >>> 8 & 65280) + ((q & 65280) << 8) + ((q & 255) << 24);
      };
      inflateStateCheck = (strm) => {
        if (!strm) {
          return 1;
        }
        const state = strm.state;
        if (!state || state.strm !== strm || state.mode < HEAD || state.mode > SYNC) {
          return 1;
        }
        return 0;
      };
      inflateResetKeep = (strm) => {
        if (inflateStateCheck(strm)) {
          return Z_STREAM_ERROR;
        }
        const state = strm.state;
        strm.total_in = strm.total_out = state.total = 0;
        strm.msg = "";
        if (state.wrap) {
          strm.adler = state.wrap & 1;
        }
        state.mode = HEAD;
        state.last = 0;
        state.havedict = 0;
        state.flags = -1;
        state.dmax = 32768;
        state.head = null;
        state.hold = 0;
        state.bits = 0;
        state.lencode = state.lendyn = new Int32Array(ENOUGH_LENS2);
        state.distcode = state.distdyn = new Int32Array(ENOUGH_DISTS2);
        state.sane = 1;
        state.back = -1;
        return Z_OK;
      };
      inflateReset = (strm) => {
        if (inflateStateCheck(strm)) {
          return Z_STREAM_ERROR;
        }
        const state = strm.state;
        state.wsize = 0;
        state.whave = 0;
        state.wnext = 0;
        return inflateResetKeep(strm);
      };
      inflateReset2 = (strm, windowBits) => {
        let wrap;
        if (inflateStateCheck(strm)) {
          return Z_STREAM_ERROR;
        }
        const state = strm.state;
        if (windowBits < 0) {
          wrap = 0;
          windowBits = -windowBits;
        } else {
          wrap = (windowBits >> 4) + 5;
          if (windowBits < 48) {
            windowBits &= 15;
          }
        }
        if (windowBits && (windowBits < 8 || windowBits > 15)) {
          return Z_STREAM_ERROR;
        }
        if (state.window !== null && state.wbits !== windowBits) {
          state.window = null;
        }
        state.wrap = wrap;
        state.wbits = windowBits;
        return inflateReset(strm);
      };
      inflateInit2 = (strm, windowBits) => {
        if (!strm) {
          return Z_STREAM_ERROR;
        }
        const state = new InflateState();
        strm.state = state;
        state.strm = strm;
        state.window = null;
        state.mode = HEAD;
        const ret = inflateReset2(strm, windowBits);
        if (ret !== Z_OK) {
          strm.state = null;
        }
        return ret;
      };
      virgin = true;
      fixedtables = (state) => {
        if (virgin) {
          lenfix = new Int32Array(512);
          distfix = new Int32Array(32);
          let sym = 0;
          while (sym < 144) {
            state.lens[sym++] = 8;
          }
          while (sym < 256) {
            state.lens[sym++] = 9;
          }
          while (sym < 280) {
            state.lens[sym++] = 7;
          }
          while (sym < 288) {
            state.lens[sym++] = 8;
          }
          inftrees_default(LENS2, state.lens, 0, 288, lenfix, 0, state.work, { bits: 9 });
          sym = 0;
          while (sym < 32) {
            state.lens[sym++] = 5;
          }
          inftrees_default(DISTS2, state.lens, 0, 32, distfix, 0, state.work, { bits: 5 });
          virgin = false;
        }
        state.lencode = lenfix;
        state.lenbits = 9;
        state.distcode = distfix;
        state.distbits = 5;
      };
      updatewindow = (strm, src, end, copy) => {
        let dist;
        const state = strm.state;
        if (state.window === null) {
          state.wsize = 1 << state.wbits;
          state.wnext = 0;
          state.whave = 0;
          state.window = new Uint8Array(state.wsize);
        }
        if (copy >= state.wsize) {
          state.window.set(src.subarray(end - state.wsize, end), 0);
          state.wnext = 0;
          state.whave = state.wsize;
        } else {
          dist = state.wsize - state.wnext;
          if (dist > copy) {
            dist = copy;
          }
          state.window.set(src.subarray(end - copy, end - copy + dist), state.wnext);
          copy -= dist;
          if (copy) {
            state.window.set(src.subarray(end - copy, end), 0);
            state.wnext = copy;
            state.whave = state.wsize;
          } else {
            state.wnext += dist;
            if (state.wnext === state.wsize) {
              state.wnext = 0;
            }
            if (state.whave < state.wsize) {
              state.whave += dist;
            }
          }
        }
        return 0;
      };
      inflate = (strm, flush) => {
        let state;
        let input, output;
        let next;
        let put;
        let have, left;
        let hold;
        let bits;
        let _in, _out;
        let copy;
        let from;
        let from_source;
        let here = 0;
        let here_bits, here_op, here_val;
        let last_bits, last_op, last_val;
        let len;
        let ret;
        const hbuf = new Uint8Array(4);
        let opts;
        let n;
        const order = (
          /* permutation of code lengths */
          new Uint8Array([
            16,
            17,
            18,
            0,
            8,
            7,
            9,
            6,
            10,
            5,
            11,
            4,
            12,
            3,
            13,
            2,
            14,
            1,
            15
          ])
        );
        if (inflateStateCheck(strm) || !strm.output || !strm.input && strm.avail_in !== 0) {
          return Z_STREAM_ERROR;
        }
        state = strm.state;
        if (state.mode === TYPE2) {
          state.mode = TYPEDO;
        }
        put = strm.next_out;
        output = strm.output;
        left = strm.avail_out;
        next = strm.next_in;
        input = strm.input;
        have = strm.avail_in;
        hold = state.hold;
        bits = state.bits;
        _in = have;
        _out = left;
        ret = Z_OK;
        inf_leave: for (; ; ) {
          switch (state.mode) {
            case HEAD:
              if (state.wrap === 0) {
                state.mode = TYPEDO;
                break;
              }
              while (bits < 16) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (state.wrap & 2 && hold === 35615) {
                if (state.wbits === 0) {
                  state.wbits = 15;
                }
                state.check = 0;
                hbuf[0] = hold & 255;
                hbuf[1] = hold >>> 8 & 255;
                state.check = crc32_default(state.check, hbuf, 2, 0);
                hold = 0;
                bits = 0;
                state.mode = FLAGS;
                break;
              }
              if (state.head) {
                state.head.done = false;
              }
              if (!(state.wrap & 1) || (((hold & 255) << 8) + (hold >> 8)) % 31) {
                strm.msg = "incorrect header check";
                state.mode = BAD2;
                break;
              }
              if ((hold & 15) !== Z_DEFLATED) {
                strm.msg = "unknown compression method";
                state.mode = BAD2;
                break;
              }
              hold >>>= 4;
              bits -= 4;
              len = (hold & 15) + 8;
              if (state.wbits === 0) {
                state.wbits = len;
              }
              if (len > 15 || len > state.wbits) {
                strm.msg = "invalid window size";
                state.mode = BAD2;
                break;
              }
              state.dmax = 1 << state.wbits;
              state.flags = 0;
              strm.adler = state.check = 1;
              state.mode = hold & 512 ? DICTID : TYPE2;
              hold = 0;
              bits = 0;
              break;
            case FLAGS:
              while (bits < 16) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state.flags = hold;
              if ((state.flags & 255) !== Z_DEFLATED) {
                strm.msg = "unknown compression method";
                state.mode = BAD2;
                break;
              }
              if (state.flags & 57344) {
                strm.msg = "unknown header flags set";
                state.mode = BAD2;
                break;
              }
              if (state.head) {
                state.head.text = hold >> 8 & 1;
              }
              if (state.flags & 512 && state.wrap & 4) {
                hbuf[0] = hold & 255;
                hbuf[1] = hold >>> 8 & 255;
                state.check = crc32_default(state.check, hbuf, 2, 0);
              }
              hold = 0;
              bits = 0;
              state.mode = TIME;
            /* falls through */
            case TIME:
              while (bits < 32) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (state.head) {
                state.head.time = hold;
              }
              if (state.flags & 512 && state.wrap & 4) {
                hbuf[0] = hold & 255;
                hbuf[1] = hold >>> 8 & 255;
                hbuf[2] = hold >>> 16 & 255;
                hbuf[3] = hold >>> 24 & 255;
                state.check = crc32_default(state.check, hbuf, 4, 0);
              }
              hold = 0;
              bits = 0;
              state.mode = OS;
            /* falls through */
            case OS:
              while (bits < 16) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (state.head) {
                state.head.xflags = hold & 255;
                state.head.os = hold >> 8;
              }
              if (state.flags & 512 && state.wrap & 4) {
                hbuf[0] = hold & 255;
                hbuf[1] = hold >>> 8 & 255;
                state.check = crc32_default(state.check, hbuf, 2, 0);
              }
              hold = 0;
              bits = 0;
              state.mode = EXLEN;
            /* falls through */
            case EXLEN:
              if (state.flags & 1024) {
                while (bits < 16) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                state.length = hold;
                if (state.head) {
                  state.head.extra_len = hold;
                }
                if (state.flags & 512 && state.wrap & 4) {
                  hbuf[0] = hold & 255;
                  hbuf[1] = hold >>> 8 & 255;
                  state.check = crc32_default(state.check, hbuf, 2, 0);
                }
                hold = 0;
                bits = 0;
              } else if (state.head) {
                state.head.extra = null;
              }
              state.mode = EXTRA;
            /* falls through */
            case EXTRA:
              if (state.flags & 1024) {
                copy = state.length;
                if (copy > have) {
                  copy = have;
                }
                if (copy) {
                  if (state.head) {
                    len = state.head.extra_len - state.length;
                    if (!state.head.extra) {
                      state.head.extra = new Uint8Array(state.head.extra_len);
                    }
                    state.head.extra.set(
                      input.subarray(
                        next,
                        // extra field is limited to 65536 bytes
                        // - no need for additional size check
                        next + copy
                      ),
                      /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
                      len
                    );
                  }
                  if (state.flags & 512 && state.wrap & 4) {
                    state.check = crc32_default(state.check, input, copy, next);
                  }
                  have -= copy;
                  next += copy;
                  state.length -= copy;
                }
                if (state.length) {
                  break inf_leave;
                }
              }
              state.length = 0;
              state.mode = NAME;
            /* falls through */
            case NAME:
              if (state.flags & 2048) {
                if (have === 0) {
                  break inf_leave;
                }
                copy = 0;
                do {
                  len = input[next + copy++];
                  if (state.head && len && state.length < 65536) {
                    state.head.name += String.fromCharCode(len);
                  }
                } while (len && copy < have);
                if (state.flags & 512 && state.wrap & 4) {
                  state.check = crc32_default(state.check, input, copy, next);
                }
                have -= copy;
                next += copy;
                if (len) {
                  break inf_leave;
                }
              } else if (state.head) {
                state.head.name = null;
              }
              state.length = 0;
              state.mode = COMMENT;
            /* falls through */
            case COMMENT:
              if (state.flags & 4096) {
                if (have === 0) {
                  break inf_leave;
                }
                copy = 0;
                do {
                  len = input[next + copy++];
                  if (state.head && len && state.length < 65536) {
                    state.head.comment += String.fromCharCode(len);
                  }
                } while (len && copy < have);
                if (state.flags & 512 && state.wrap & 4) {
                  state.check = crc32_default(state.check, input, copy, next);
                }
                have -= copy;
                next += copy;
                if (len) {
                  break inf_leave;
                }
              } else if (state.head) {
                state.head.comment = null;
              }
              state.mode = HCRC;
            /* falls through */
            case HCRC:
              if (state.flags & 512) {
                while (bits < 16) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                if (state.wrap & 4 && hold !== (state.check & 65535)) {
                  strm.msg = "header crc mismatch";
                  state.mode = BAD2;
                  break;
                }
                hold = 0;
                bits = 0;
              }
              if (state.head) {
                state.head.hcrc = state.flags >> 9 & 1;
                state.head.done = true;
              }
              strm.adler = state.check = 0;
              state.mode = TYPE2;
              break;
            case DICTID:
              while (bits < 32) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              strm.adler = state.check = zswap32(hold);
              hold = 0;
              bits = 0;
              state.mode = DICT;
            /* falls through */
            case DICT:
              if (state.havedict === 0) {
                strm.next_out = put;
                strm.avail_out = left;
                strm.next_in = next;
                strm.avail_in = have;
                state.hold = hold;
                state.bits = bits;
                return Z_NEED_DICT;
              }
              strm.adler = state.check = 1;
              state.mode = TYPE2;
            /* falls through */
            case TYPE2:
              if (flush === Z_BLOCK || flush === Z_TREES) {
                break inf_leave;
              }
            /* falls through */
            case TYPEDO:
              if (state.last) {
                hold >>>= bits & 7;
                bits -= bits & 7;
                state.mode = CHECK;
                break;
              }
              while (bits < 3) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state.last = hold & 1;
              hold >>>= 1;
              bits -= 1;
              switch (hold & 3) {
                case 0:
                  state.mode = STORED;
                  break;
                case 1:
                  fixedtables(state);
                  state.mode = LEN_;
                  if (flush === Z_TREES) {
                    hold >>>= 2;
                    bits -= 2;
                    break inf_leave;
                  }
                  break;
                case 2:
                  state.mode = TABLE;
                  break;
                case 3:
                  strm.msg = "invalid block type";
                  state.mode = BAD2;
              }
              hold >>>= 2;
              bits -= 2;
              break;
            case STORED:
              hold >>>= bits & 7;
              bits -= bits & 7;
              while (bits < 32) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if ((hold & 65535) !== (hold >>> 16 ^ 65535)) {
                strm.msg = "invalid stored block lengths";
                state.mode = BAD2;
                break;
              }
              state.length = hold & 65535;
              hold = 0;
              bits = 0;
              state.mode = COPY_;
              if (flush === Z_TREES) {
                break inf_leave;
              }
            /* falls through */
            case COPY_:
              state.mode = COPY;
            /* falls through */
            case COPY:
              copy = state.length;
              if (copy) {
                if (copy > have) {
                  copy = have;
                }
                if (copy > left) {
                  copy = left;
                }
                if (copy === 0) {
                  break inf_leave;
                }
                output.set(input.subarray(next, next + copy), put);
                have -= copy;
                next += copy;
                left -= copy;
                put += copy;
                state.length -= copy;
                break;
              }
              state.mode = TYPE2;
              break;
            case TABLE:
              while (bits < 14) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state.nlen = (hold & 31) + 257;
              hold >>>= 5;
              bits -= 5;
              state.ndist = (hold & 31) + 1;
              hold >>>= 5;
              bits -= 5;
              state.ncode = (hold & 15) + 4;
              hold >>>= 4;
              bits -= 4;
              if (state.nlen > 286 || state.ndist > 30) {
                strm.msg = "too many length or distance symbols";
                state.mode = BAD2;
                break;
              }
              state.have = 0;
              state.mode = LENLENS;
            /* falls through */
            case LENLENS:
              while (state.have < state.ncode) {
                while (bits < 3) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                state.lens[order[state.have++]] = hold & 7;
                hold >>>= 3;
                bits -= 3;
              }
              while (state.have < 19) {
                state.lens[order[state.have++]] = 0;
              }
              state.lencode = state.lendyn;
              state.lenbits = 7;
              opts = { bits: state.lenbits };
              ret = inftrees_default(
                CODES2,
                state.lens,
                0,
                19,
                state.lencode,
                0,
                state.work,
                opts
              );
              state.lenbits = opts.bits;
              if (ret) {
                strm.msg = "invalid code lengths set";
                state.mode = BAD2;
                break;
              }
              state.have = 0;
              state.mode = CODELENS;
            /* falls through */
            case CODELENS:
              while (state.have < state.nlen + state.ndist) {
                for (; ; ) {
                  here = state.lencode[hold & (1 << state.lenbits) - 1];
                  here_bits = here >>> 24;
                  here_op = here >>> 16 & 255;
                  here_val = here & 65535;
                  if (here_bits <= bits) {
                    break;
                  }
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                if (here_val < 16) {
                  hold >>>= here_bits;
                  bits -= here_bits;
                  state.lens[state.have++] = here_val;
                } else {
                  if (here_val === 16) {
                    n = here_bits + 2;
                    while (bits < n) {
                      if (have === 0) {
                        break inf_leave;
                      }
                      have--;
                      hold += input[next++] << bits;
                      bits += 8;
                    }
                    hold >>>= here_bits;
                    bits -= here_bits;
                    if (state.have === 0) {
                      strm.msg = "invalid bit length repeat";
                      state.mode = BAD2;
                      break;
                    }
                    len = state.lens[state.have - 1];
                    copy = 3 + (hold & 3);
                    hold >>>= 2;
                    bits -= 2;
                  } else if (here_val === 17) {
                    n = here_bits + 3;
                    while (bits < n) {
                      if (have === 0) {
                        break inf_leave;
                      }
                      have--;
                      hold += input[next++] << bits;
                      bits += 8;
                    }
                    hold >>>= here_bits;
                    bits -= here_bits;
                    len = 0;
                    copy = 3 + (hold & 7);
                    hold >>>= 3;
                    bits -= 3;
                  } else {
                    n = here_bits + 7;
                    while (bits < n) {
                      if (have === 0) {
                        break inf_leave;
                      }
                      have--;
                      hold += input[next++] << bits;
                      bits += 8;
                    }
                    hold >>>= here_bits;
                    bits -= here_bits;
                    len = 0;
                    copy = 11 + (hold & 127);
                    hold >>>= 7;
                    bits -= 7;
                  }
                  if (state.have + copy > state.nlen + state.ndist) {
                    strm.msg = "invalid bit length repeat";
                    state.mode = BAD2;
                    break;
                  }
                  while (copy--) {
                    state.lens[state.have++] = len;
                  }
                }
              }
              if (state.mode === BAD2) {
                break;
              }
              if (state.lens[256] === 0) {
                strm.msg = "invalid code -- missing end-of-block";
                state.mode = BAD2;
                break;
              }
              state.lenbits = 9;
              opts = { bits: state.lenbits };
              ret = inftrees_default(
                LENS2,
                state.lens,
                0,
                state.nlen,
                state.lencode,
                0,
                state.work,
                opts
              );
              state.lenbits = opts.bits;
              if (ret) {
                strm.msg = "invalid literal/lengths set";
                state.mode = BAD2;
                break;
              }
              state.distbits = 6;
              state.distcode = state.distdyn;
              opts = { bits: state.distbits };
              ret = inftrees_default(
                DISTS2,
                state.lens,
                state.nlen,
                state.ndist,
                state.distcode,
                0,
                state.work,
                opts
              );
              state.distbits = opts.bits;
              if (ret) {
                strm.msg = "invalid distances set";
                state.mode = BAD2;
                break;
              }
              state.mode = LEN_;
              if (flush === Z_TREES) {
                break inf_leave;
              }
            /* falls through */
            case LEN_:
              state.mode = LEN;
            /* falls through */
            case LEN:
              if (have >= 6 && left >= 258) {
                strm.next_out = put;
                strm.avail_out = left;
                strm.next_in = next;
                strm.avail_in = have;
                state.hold = hold;
                state.bits = bits;
                inflate_fast(strm, _out);
                put = strm.next_out;
                output = strm.output;
                left = strm.avail_out;
                next = strm.next_in;
                input = strm.input;
                have = strm.avail_in;
                hold = state.hold;
                bits = state.bits;
                if (state.mode === TYPE2) {
                  state.back = -1;
                }
                break;
              }
              state.back = 0;
              for (; ; ) {
                here = state.lencode[hold & (1 << state.lenbits) - 1];
                here_bits = here >>> 24;
                here_op = here >>> 16 & 255;
                here_val = here & 65535;
                if (here_bits <= bits) {
                  break;
                }
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (here_op && (here_op & 240) === 0) {
                last_bits = here_bits;
                last_op = here_op;
                last_val = here_val;
                for (; ; ) {
                  here = state.lencode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
                  here_bits = here >>> 24;
                  here_op = here >>> 16 & 255;
                  here_val = here & 65535;
                  if (last_bits + here_bits <= bits) {
                    break;
                  }
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                hold >>>= last_bits;
                bits -= last_bits;
                state.back += last_bits;
              }
              hold >>>= here_bits;
              bits -= here_bits;
              state.back += here_bits;
              state.length = here_val;
              if (here_op === 0) {
                state.mode = LIT;
                break;
              }
              if (here_op & 32) {
                state.back = -1;
                state.mode = TYPE2;
                break;
              }
              if (here_op & 64) {
                strm.msg = "invalid literal/length code";
                state.mode = BAD2;
                break;
              }
              state.extra = here_op & 15;
              state.mode = LENEXT;
            /* falls through */
            case LENEXT:
              if (state.extra) {
                n = state.extra;
                while (bits < n) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                state.length += hold & (1 << state.extra) - 1;
                hold >>>= state.extra;
                bits -= state.extra;
                state.back += state.extra;
              }
              state.was = state.length;
              state.mode = DIST;
            /* falls through */
            case DIST:
              for (; ; ) {
                here = state.distcode[hold & (1 << state.distbits) - 1];
                here_bits = here >>> 24;
                here_op = here >>> 16 & 255;
                here_val = here & 65535;
                if (here_bits <= bits) {
                  break;
                }
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if ((here_op & 240) === 0) {
                last_bits = here_bits;
                last_op = here_op;
                last_val = here_val;
                for (; ; ) {
                  here = state.distcode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
                  here_bits = here >>> 24;
                  here_op = here >>> 16 & 255;
                  here_val = here & 65535;
                  if (last_bits + here_bits <= bits) {
                    break;
                  }
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                hold >>>= last_bits;
                bits -= last_bits;
                state.back += last_bits;
              }
              hold >>>= here_bits;
              bits -= here_bits;
              state.back += here_bits;
              if (here_op & 64) {
                strm.msg = "invalid distance code";
                state.mode = BAD2;
                break;
              }
              state.offset = here_val;
              state.extra = here_op & 15;
              state.mode = DISTEXT;
            /* falls through */
            case DISTEXT:
              if (state.extra) {
                n = state.extra;
                while (bits < n) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                state.offset += hold & (1 << state.extra) - 1;
                hold >>>= state.extra;
                bits -= state.extra;
                state.back += state.extra;
              }
              if (state.offset > state.dmax) {
                strm.msg = "invalid distance too far back";
                state.mode = BAD2;
                break;
              }
              state.mode = MATCH;
            /* falls through */
            case MATCH:
              if (left === 0) {
                break inf_leave;
              }
              copy = _out - left;
              if (state.offset > copy) {
                copy = state.offset - copy;
                if (copy > state.whave) {
                  if (state.sane) {
                    strm.msg = "invalid distance too far back";
                    state.mode = BAD2;
                    break;
                  }
                }
                if (copy > state.wnext) {
                  copy -= state.wnext;
                  from = state.wsize - copy;
                } else {
                  from = state.wnext - copy;
                }
                if (copy > state.length) {
                  copy = state.length;
                }
                from_source = state.window;
              } else {
                from_source = output;
                from = put - state.offset;
                copy = state.length;
              }
              if (copy > left) {
                copy = left;
              }
              left -= copy;
              state.length -= copy;
              do {
                output[put++] = from_source[from++];
              } while (--copy);
              if (state.length === 0) {
                state.mode = LEN;
              }
              break;
            case LIT:
              if (left === 0) {
                break inf_leave;
              }
              output[put++] = state.length;
              left--;
              state.mode = LEN;
              break;
            case CHECK:
              if (state.wrap) {
                while (bits < 32) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold |= input[next++] << bits;
                  bits += 8;
                }
                _out -= left;
                strm.total_out += _out;
                state.total += _out;
                if (state.wrap & 4 && _out) {
                  strm.adler = state.check = /*UPDATE_CHECK(state.check, put - _out, _out);*/
                  state.flags ? crc32_default(state.check, output, _out, put - _out) : adler32_default(state.check, output, _out, put - _out);
                }
                _out = left;
                if (state.wrap & 4 && (state.flags ? hold : zswap32(hold)) !== state.check) {
                  strm.msg = "incorrect data check";
                  state.mode = BAD2;
                  break;
                }
                hold = 0;
                bits = 0;
              }
              state.mode = LENGTH;
            /* falls through */
            case LENGTH:
              if (state.wrap && state.flags) {
                while (bits < 32) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                if (state.wrap & 4 && hold !== (state.total & 4294967295)) {
                  strm.msg = "incorrect length check";
                  state.mode = BAD2;
                  break;
                }
                hold = 0;
                bits = 0;
              }
              state.mode = DONE;
            /* falls through */
            case DONE:
              ret = Z_STREAM_END;
              break inf_leave;
            case BAD2:
              ret = Z_DATA_ERROR;
              break inf_leave;
            case MEM:
              return Z_MEM_ERROR;
            case SYNC:
            /* falls through */
            default:
              return Z_STREAM_ERROR;
          }
        }
        strm.next_out = put;
        strm.avail_out = left;
        strm.next_in = next;
        strm.avail_in = have;
        state.hold = hold;
        state.bits = bits;
        if (state.wsize || _out !== strm.avail_out && state.mode < BAD2 && (state.mode < CHECK || flush !== Z_FINISH)) {
          if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) {
            state.mode = MEM;
            return Z_MEM_ERROR;
          }
        }
        _in -= strm.avail_in;
        _out -= strm.avail_out;
        strm.total_in += _in;
        strm.total_out += _out;
        state.total += _out;
        if (state.wrap & 4 && _out) {
          strm.adler = state.check = /*UPDATE_CHECK(state.check, strm.next_out - _out, _out);*/
          state.flags ? crc32_default(state.check, output, _out, strm.next_out - _out) : adler32_default(state.check, output, _out, strm.next_out - _out);
        }
        strm.data_type = state.bits + (state.last ? 64 : 0) + (state.mode === TYPE2 ? 128 : 0) + (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
        if ((_in === 0 && _out === 0 || flush === Z_FINISH) && ret === Z_OK) {
          ret = Z_BUF_ERROR;
        }
        return ret;
      };
      inflateEnd = (strm) => {
        if (inflateStateCheck(strm)) {
          return Z_STREAM_ERROR;
        }
        let state = strm.state;
        if (state.window) {
          state.window = null;
        }
        strm.state = null;
        return Z_OK;
      };
      inflateGetHeader = (strm, head) => {
        if (inflateStateCheck(strm)) {
          return Z_STREAM_ERROR;
        }
        const state = strm.state;
        if ((state.wrap & 2) === 0) {
          return Z_STREAM_ERROR;
        }
        state.head = head;
        head.done = false;
        return Z_OK;
      };
      inflateSetDictionary = (strm, dictionary) => {
        const dictLength = dictionary.length;
        let state;
        let dictid;
        let ret;
        if (inflateStateCheck(strm)) {
          return Z_STREAM_ERROR;
        }
        state = strm.state;
        if (state.wrap !== 0 && state.mode !== DICT) {
          return Z_STREAM_ERROR;
        }
        if (state.mode === DICT) {
          dictid = 1;
          dictid = adler32_default(dictid, dictionary, dictLength, 0);
          if (dictid !== state.check) {
            return Z_DATA_ERROR;
          }
        }
        ret = updatewindow(strm, dictionary, dictLength, dictLength);
        if (ret) {
          state.mode = MEM;
          return Z_MEM_ERROR;
        }
        state.havedict = 1;
        return Z_OK;
      };
      _inflateReset = inflateReset;
      _inflateInit2 = inflateInit2;
      _inflate = inflate;
      _inflateEnd = inflateEnd;
      _inflateGetHeader = inflateGetHeader;
      _inflateSetDictionary = inflateSetDictionary;
    }
  });

  // src/pako/zlib/gzheader.ts
  function GZheader() {
    this.text = 0;
    this.time = 0;
    this.xflags = 0;
    this.os = 0;
    this.extra = null;
    this.extra_len = 0;
    this.name = "";
    this.comment = "";
    this.hcrc = 0;
    this.done = false;
  }
  var gzheader_default;
  var init_gzheader = __esm({
    "src/pako/zlib/gzheader.ts"() {
      gzheader_default = GZheader;
    }
  });

  // src/pako/inflate.ts
  function Inflate(options = {}) {
    this.options = assign(
      {
        chunkSize: 1024 * 64,
        windowBits: 15,
        to: ""
      },
      options
    );
    const opt = this.options;
    if (opt.raw && opt.windowBits >= 0 && opt.windowBits < 16) {
      opt.windowBits = -opt.windowBits;
      if (opt.windowBits === 0) {
        opt.windowBits = -15;
      }
    }
    if (opt.windowBits >= 0 && opt.windowBits < 16 && !(options && options.windowBits)) {
      opt.windowBits += 32;
    }
    if (opt.windowBits > 15 && opt.windowBits < 48) {
      if ((opt.windowBits & 15) === 0) {
        opt.windowBits |= 15;
      }
    }
    this.err = 0;
    this.msg = "";
    this.ended = false;
    this.chunks = [];
    this.strm = new zstream_default();
    this.strm.avail_out = 0;
    let status = _inflateInit2(this.strm, opt.windowBits);
    if (status !== Z_OK) {
      throw new Error(messages_default[status]);
    }
    this.header = new gzheader_default();
    _inflateGetHeader(this.strm, this.header);
    if (opt.dictionary) {
      if (typeof opt.dictionary === "string") {
        opt.dictionary = string2buf(opt.dictionary);
      } else if (toString2.call(opt.dictionary) === "[object ArrayBuffer]") {
        opt.dictionary = new Uint8Array(opt.dictionary);
      }
      if (opt.raw) {
        status = _inflateSetDictionary(this.strm, opt.dictionary);
        if (status !== Z_OK) {
          throw new Error(messages_default[status]);
        }
      }
    }
  }
  var toString2;
  var init_inflate2 = __esm({
    "src/pako/inflate.ts"() {
      init_inflate();
      init_common();
      init_strings();
      init_messages();
      init_zstream();
      init_gzheader();
      init_constants();
      init_constants();
      toString2 = Object.prototype.toString;
      Inflate.prototype.push = function(data, flush_mode) {
        const strm = this.strm;
        const chunkSize = this.options.chunkSize;
        const dictionary = this.options.dictionary;
        let status, _flush_mode, last_avail_out;
        if (this.ended) return false;
        if (flush_mode === ~~flush_mode) _flush_mode = flush_mode;
        else _flush_mode = flush_mode === true ? Z_FINISH : Z_NO_FLUSH;
        if (toString2.call(data) === "[object ArrayBuffer]") {
          strm.input = new Uint8Array(data);
        } else {
          strm.input = data;
        }
        strm.next_in = 0;
        strm.avail_in = strm.input.length;
        for (; ; ) {
          if (strm.avail_out === 0) {
            strm.output = new Uint8Array(chunkSize);
            strm.next_out = 0;
            strm.avail_out = chunkSize;
          }
          status = _inflate(strm, _flush_mode);
          if (status === Z_NEED_DICT && dictionary) {
            status = _inflateSetDictionary(strm, dictionary);
            if (status === Z_OK) {
              status = _inflate(strm, _flush_mode);
            } else if (status === Z_DATA_ERROR) {
              status = Z_NEED_DICT;
            }
          }
          while (strm.avail_in > 0 && status === Z_STREAM_END && strm.state.wrap > 0 && data[strm.next_in] !== 0) {
            _inflateReset(strm);
            status = _inflate(strm, _flush_mode);
          }
          switch (status) {
            case Z_STREAM_ERROR:
            case Z_DATA_ERROR:
            case Z_NEED_DICT:
            case Z_MEM_ERROR:
              this.onEnd(status);
              this.ended = true;
              return false;
          }
          last_avail_out = strm.avail_out;
          if (strm.next_out) {
            if (strm.avail_out === 0 || status === Z_STREAM_END) {
              if (this.options.to === "string") {
                let next_out_utf8 = utf8border(strm.output, strm.next_out);
                let tail = strm.next_out - next_out_utf8;
                let utf8str = buf2string(strm.output, next_out_utf8);
                strm.next_out = tail;
                strm.avail_out = chunkSize - tail;
                if (tail)
                  strm.output.set(
                    strm.output.subarray(next_out_utf8, next_out_utf8 + tail),
                    0
                  );
                this.onData(utf8str);
              } else {
                this.onData(
                  strm.output.length === strm.next_out ? strm.output : strm.output.subarray(0, strm.next_out)
                );
              }
            }
          }
          if (status === Z_OK && last_avail_out === 0) continue;
          if (status === Z_STREAM_END) {
            status = _inflateEnd(this.strm);
            this.onEnd(status);
            this.ended = true;
            return true;
          }
          if (strm.avail_in === 0) break;
        }
        return true;
      };
      Inflate.prototype.onData = function(chunk) {
        this.chunks.push(chunk);
      };
      Inflate.prototype.onEnd = function(status) {
        if (status === Z_OK) {
          if (this.options.to === "string") {
            this.result = this.chunks.join("");
          } else {
            this.result = flattenChunks(this.chunks);
          }
        }
        this.chunks = [];
        this.err = status;
        this.msg = this.strm.msg;
      };
    }
  });

  // src/pako/index.ts
  var init_pako = __esm({
    "src/pako/index.ts"() {
      init_deflate2();
      init_inflate2();
      init_constants();
    }
  });

  // src/png-codec/shared/paeth.ts
  function paethPredicator(a, b, c) {
    const p = a + b - c;
    const pa = Math.abs(p - a);
    const pb = Math.abs(p - b);
    const pc = Math.abs(p - c);
    if (pa <= pb && pa <= pc) {
      return a;
    }
    if (pb <= pc) {
      return b;
    }
    return c;
  }
  var init_paeth = __esm({
    "src/png-codec/shared/paeth.ts"() {
    }
  });

  // src/png-codec/decode/chunks/chunk_IDAT.ts
  function parseChunk(ctx, header, chunks) {
    const decompressed = decompress(ctx, chunks);
    let packed;
    if (header.interlaceMethod === 1 /* Adam7 */) {
      packed = deinterlaceAdam7(ctx, header, decompressed);
    } else {
      packed = defilter(ctx, header, decompressed);
    }
    const trnsChunk = ctx.metadata.find((e) => e.type === "tRNS");
    const result = mapPackedDataToRgba(
      ctx,
      header,
      packed,
      ctx.palette,
      trnsChunk
    );
    if (trnsChunk && (header.colorType === 0 /* Grayscale */ || header.colorType === 2 /* Truecolor */)) {
      applyTransparency(header, result, trnsChunk);
    }
    return result;
  }
  function decompress(ctx, chunks) {
    const inflator = new Inflate();
    let offset = 0;
    for (const chunk of chunks) {
      offset = chunk.offset + 4 /* Length */ + 4 /* Type */;
      inflator.push(
        ctx.view.buffer.slice(
          ctx.view.byteOffset + offset,
          ctx.view.byteOffset + offset + chunk.dataLength
        )
      );
    }
    if (inflator.err) {
      throw createChunkDecodeError(
        ctx,
        chunks[0],
        `Inflate error: ${inflator.msg}`,
        chunks[0].offset
      );
    }
    if (inflator.result === void 0) {
      throw new DecodeError(ctx, "IDAT: Failed to decompress data chunks", 0);
    }
    return inflator.result;
  }
  function defilter(ctx, header, decompressed, start = 0, width = header.width, height = header.height) {
    let i = 0;
    const bpp = getBytesPerPixel(header);
    const bppFloat = getBytesPerPixelFloat(header);
    const bpl = getBytesPerLine(header, width);
    const bplCeiled = Math.ceil(width * bppFloat);
    const result = new Uint8Array(height * bplCeiled);
    const filterFnCache = /* @__PURE__ */ new Map();
    for (let y = 0; y < height; y++) {
      let lineOffset = start + y * (bpl + 1);
      const filterType = decompressed[lineOffset++];
      if (!isValidFilterType) {
        throw new DecodeError(ctx, `IDAT: Invalid filter type ${filterType}`, 0);
      }
      let filterFn = filterFnCache.get(filterType);
      if (!filterFn) {
        filterFn = buildDefilterFunction(bppFloat, bpl, width, filterType);
        filterFnCache.set(filterType, filterFn);
      }
      let pixel = 1;
      let x = 0;
      switch (filterType) {
        case 0 /* None */:
        case 1 /* Sub */: {
          for (; x < bpp; x++) {
            result[i] = decompressed[lineOffset + x];
            i++;
          }
          break;
        }
        case 3 /* Average */: {
          let bi = 0;
          for (; x < bpp; x++) {
            bi = i - width * bpp;
            result[i] = decompressed[lineOffset + x] + Math.floor(0 + (bi < 0 ? 0 : result[bi])) / 2;
            i++;
          }
          break;
        }
        case 2 /* Up */: {
          pixel = 0;
          break;
        }
        case 4 /* Paeth */: {
          for (; x < bpp; x++) {
            const bi = Math.floor(i - bpl);
            result[i] = (decompressed[lineOffset + x] + paethPredicator(0, bi < 0 ? 0 : result[bi], 0)) % 256;
            i++;
          }
          break;
        }
      }
      if (header.bitDepth >= 8) {
        for (; pixel < width; pixel++) {
          for (let x2 = 0; x2 < bpp; x2++) {
            result[i] = filterFn(
              decompressed,
              lineOffset + pixel * bpp + x2,
              result,
              i
            );
            i++;
          }
        }
      } else {
        if (pixel) {
          i -= pixel;
        }
        for (x = pixel; x < bpl; x++) {
          result[i + x] = filterFn(decompressed, lineOffset + x, result, i + x);
        }
        i += bpl;
      }
    }
    return result;
  }
  function isValidFilterType(filterType) {
    return filterType % 1 === 0 && filterType >= 0 && filterType <= 4;
  }
  function buildDefilterFunction(bpp, bpl, width, filterType) {
    let ai = 0, bi = 0, ci = 0;
    switch (filterType) {
      case 0 /* None */:
        return (filt, filtX) => filt[filtX];
      case 1 /* Sub */:
        return (filt, filtX, recon, reconX) => (filt[filtX] + recon[Math.floor(reconX - bpp)]) % 256;
      case 2 /* Up */:
        return (filt, filtX, recon, reconX) => {
          bi = Math.floor(reconX - width * bpp);
          return bi < 0 ? filt[filtX] : (filt[filtX] + recon[bi]) % 256;
        };
      case 3 /* Average */:
        return (filt, filtX, recon, reconX) => {
          ai = Math.floor(reconX - bpp);
          bi = Math.floor(reconX - width * bpp);
          return filt[filtX] + Math.floor((ai < 0 ? 0 : recon[ai]) + (bi < 0 ? 0 : recon[bi])) / 2;
        };
      case 4 /* Paeth */:
        return (filt, filtX, recon, reconX) => {
          ai = Math.floor(reconX - Math.ceil(bpp));
          bi = Math.floor(reconX - bpl);
          ci = Math.floor(reconX - bpl - Math.ceil(bpp));
          return (filt[filtX] + paethPredicator(
            ai < 0 ? 0 : recon[ai],
            bi < 0 ? 0 : recon[bi],
            ci < 0 ? 0 : recon[ci]
          )) % 256;
        };
    }
  }
  function getBytesPerPixel(header) {
    return Math.ceil(getBytesPerPixelFloat(header));
  }
  function getBytesPerPixelFloat(header) {
    return getChannelCount(header.colorType) * header.bitDepth / 8;
  }
  function getBytesPerLine(header, width) {
    return Math.ceil(
      getChannelCount(header.colorType) * header.bitDepth * width / 8
    );
  }
  function getChannelCount(colorType) {
    switch (colorType) {
      case 0 /* Grayscale */:
        return 1;
      case 2 /* Truecolor */:
        return 3;
      case 3 /* Indexed */:
        return 1;
      case 4 /* GrayscaleAndAlpha */:
        return 2;
      case 6 /* TruecolorAndAlpha */:
        return 4;
    }
  }
  function deinterlaceAdam7(ctx, header, decompressed) {
    const bppFloat = getBytesPerPixelFloat(header);
    const bplCeiled = Math.ceil(header.width * bppFloat);
    const result = new Uint8Array(bplCeiled * header.height);
    const bpp = getBytesPerPixel(header);
    const pixelsPerByte = 8 / header.bitDepth;
    const maxValue = (1 << header.bitDepth) - 1;
    const xStart = [0, 4, 0, 2, 0, 1, 0];
    const yStart = [0, 0, 4, 0, 2, 0, 1];
    const xGap = [8, 8, 4, 4, 2, 2, 1];
    const yGap = [8, 8, 8, 4, 4, 2, 2];
    let dataPointer = 0;
    for (let pass = 0; pass < 7; pass++) {
      const passXStart = xStart[pass];
      const passYStart = yStart[pass];
      const passXGap = xGap[pass];
      const passYGap = yGap[pass];
      const passWidth = Math.ceil((header.width - passXStart) / passXGap);
      const passHeight = Math.ceil((header.height - passYStart) / passYGap);
      const passBplCeiled = Math.ceil(bppFloat * passWidth);
      if (passWidth === 0 || passHeight === 0) {
        continue;
      }
      const passPacked = defilter(
        ctx,
        header,
        decompressed,
        dataPointer,
        passWidth,
        passHeight
      );
      let i = 0;
      for (let y = 0; y < passHeight; y++) {
        i = (passYStart + y * passYGap) * bplCeiled + passXStart * bppFloat;
        for (let x = 0; x < passWidth; x++) {
          if (header.bitDepth < 8) {
            let value = passPacked[y * passBplCeiled + Math.floor(x * bppFloat)];
            value >>= (pixelsPerByte - x % pixelsPerByte - 1) * header.bitDepth;
            value &= maxValue;
            const resultPosition = (pixelsPerByte - 1 - i % 1 * pixelsPerByte) * header.bitDepth;
            value <<= resultPosition;
            result[Math.floor(i)] |= value;
          } else {
            for (let j = 0; j < bpp; j++) {
              result[i + j] = passPacked[(y * passWidth + x) * bpp + j];
            }
          }
          i += passXGap * bppFloat;
        }
      }
      dataPointer += passHeight * (1 + getBytesPerLine(header, passWidth));
    }
    return result;
  }
  function mapPackedDataToRgba(ctx, header, packed, palette, trnsChunk) {
    const result = new (header.bitDepth === 16 ? Uint16Array : Uint8Array)(
      header.width * header.height * 4
    );
    let i = 0;
    const bpp = getBytesPerPixel(header);
    const bppFloat = getBytesPerPixelFloat(header);
    const bplCeiled = Math.ceil(header.width * bppFloat);
    switch (header.colorType) {
      case 0 /* Grayscale */: {
        switch (header.bitDepth) {
          case 1:
          case 2:
          case 4: {
            const pixelsPerByte = 8 / header.bitDepth;
            const maxValue = (1 << header.bitDepth) - 1;
            const bytesPerPixel = header.bitDepth / 8;
            for (let y = 0; y < header.height; y++) {
              for (let x = 0; x < header.width; x++) {
                i = (y * header.width + x) * 4;
                result[i] = packed[y * bplCeiled + Math.floor(x * bytesPerPixel)];
                result[i] >>= (pixelsPerByte - x % pixelsPerByte - 1) * header.bitDepth;
                result[i] &= maxValue;
                result[i] *= 255 / maxValue;
                result[i + 1] = result[i];
                result[i + 2] = result[i];
                result[i + 3] = 255;
              }
            }
            break;
          }
          case 8:
          case 16: {
            for (let y = 0; y < header.height; y++) {
              for (let x = 0; x < header.width; x++) {
                i = (y * header.width + x) * 4;
                if (header.bitDepth === 16) {
                  result[i] = packed[(y * header.width + x) * bpp] << 8 | packed[(y * header.width + x) * bpp + 1];
                } else {
                  result[i] = packed[(y * header.width + x) * bpp];
                }
                result[i + 1] = result[i];
                result[i + 2] = result[i];
                result[i + 3] = header.bitDepth === 16 ? 65535 : 255;
              }
            }
            break;
          }
        }
        break;
      }
      case 4 /* GrayscaleAndAlpha */: {
        for (let y = 0; y < header.height; y++) {
          for (let x = 0; x < header.width; x++) {
            i = (y * header.width + x) * 4;
            if (header.bitDepth === 16) {
              result[i] = packed[(y * header.width + x) * bpp] << 8 | packed[(y * header.width + x) * bpp + 1];
            } else {
              result[i] = packed[(y * header.width + x) * bpp];
            }
            result[i + 1] = result[i];
            result[i + 2] = result[i];
            if (header.bitDepth === 16) {
              result[i + 3] = packed[(y * header.width + x) * bpp + 2] << 8 | packed[(y * header.width + x) * bpp + 3];
            } else {
              result[i + 3] = packed[(y * header.width + x) * bpp + 1];
            }
          }
        }
        break;
      }
      case 3 /* Indexed */: {
        if (!palette) {
          throw new DecodeError(
            ctx,
            "IDAT: Cannot decode indexed color type without a palette",
            0
          );
        }
        switch (header.bitDepth) {
          case 1:
          case 2:
          case 4: {
            const pixelsPerByte = 8 / header.bitDepth;
            const maxValue = (1 << header.bitDepth) - 1;
            const bytesPerPixel = header.bitDepth / 8;
            for (let y = 0; y < header.height; y++) {
              for (let x = 0; x < header.width; x++) {
                i = (y * header.width + x) * 4;
                let colorId = packed[y * bplCeiled + Math.floor(x * bytesPerPixel)];
                colorId >>= (pixelsPerByte - x % pixelsPerByte - 1) * header.bitDepth;
                colorId &= maxValue;
                palette.setRgba(result, i, colorId);
                if (trnsChunk && trnsChunk.transparency.length > colorId) {
                  result[i + 3] = trnsChunk.transparency[colorId];
                }
              }
            }
            break;
          }
          case 8: {
            let colorId = 0;
            for (let y = 0; y < header.height; y++) {
              for (let x = 0; x < header.width; x++) {
                i = (y * header.width + x) * 4;
                colorId = packed[y * header.width + x];
                palette.setRgba(result, i, colorId);
                if (trnsChunk && trnsChunk.transparency.length > colorId) {
                  result[i + 3] = trnsChunk.transparency[colorId];
                }
              }
            }
            break;
          }
        }
        break;
      }
      case 2 /* Truecolor */: {
        for (let y = 0; y < header.height; y++) {
          for (let x = 0; x < header.width; x++) {
            i = (y * header.width + x) * 4;
            if (header.bitDepth === 16) {
              result[i] = packed[(y * header.width + x) * bpp] << 8 | packed[(y * header.width + x) * bpp + 1];
              result[i + 1] = packed[(y * header.width + x) * bpp + 2] << 8 | packed[(y * header.width + x) * bpp + 3];
              result[i + 2] = packed[(y * header.width + x) * bpp + 4] << 8 | packed[(y * header.width + x) * bpp + 5];
            } else {
              result[i] = packed[(y * header.width + x) * bpp];
              result[i + 1] = packed[(y * header.width + x) * bpp + 1];
              result[i + 2] = packed[(y * header.width + x) * bpp + 2];
            }
            result[i + 3] = header.bitDepth === 16 ? 65535 : 255;
          }
        }
        break;
      }
      case 6 /* TruecolorAndAlpha */: {
        for (let y = 0; y < header.height; y++) {
          for (let x = 0; x < header.width; x++) {
            i = (y * header.width + x) * 4;
            if (header.bitDepth === 16) {
              result[i] = packed[(y * header.width + x) * bpp] << 8 | packed[(y * header.width + x) * bpp + 1];
              result[i + 1] = packed[(y * header.width + x) * bpp + 2] << 8 | packed[(y * header.width + x) * bpp + 3];
              result[i + 2] = packed[(y * header.width + x) * bpp + 4] << 8 | packed[(y * header.width + x) * bpp + 5];
              result[i + 3] = packed[(y * header.width + x) * bpp + 6] << 8 | packed[(y * header.width + x) * bpp + 7];
            } else {
              result[i] = packed[(y * header.width + x) * bpp];
              result[i + 1] = packed[(y * header.width + x) * bpp + 1];
              result[i + 2] = packed[(y * header.width + x) * bpp + 2];
              result[i + 3] = packed[(y * header.width + x) * bpp + 3];
            }
          }
        }
        break;
      }
    }
    return result;
  }
  function applyTransparency(header, data, trnsChunk) {
    const maxEncodedValue = (1 << header.bitDepth) - 1;
    const maxDataValue = header.bitDepth === 16 ? 65535 : 255;
    if (header.colorType === 0 /* Grayscale */) {
      const shade = maxDataValue / maxEncodedValue * trnsChunk.transparency;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i] === shade) {
          data[i + 3] = 0;
        }
      }
      return;
    }
    if (header.colorType === 2 /* Truecolor */) {
      const channels = [
        maxDataValue / maxEncodedValue * trnsChunk.transparency[0],
        maxDataValue / maxEncodedValue * trnsChunk.transparency[1],
        maxDataValue / maxEncodedValue * trnsChunk.transparency[2]
      ];
      for (let i = 0; i < data.length; i += 4) {
        if (data[i] === channels[0] && data[i + 1] === channels[1] && data[i + 2] === channels[2]) {
          data[i + 3] = 0;
        }
      }
      return;
    }
  }
  var init_chunk_IDAT = __esm({
    "src/png-codec/decode/chunks/chunk_IDAT.ts"() {
      init_pako();
      init_assert();
      init_paeth();
      init_types();
    }
  });

  // src/png-codec/decode/chunks/chunk_IEND.ts
  function parseChunk2(ctx, header, chunk) {
    assertChunkFollows(ctx, chunk, "IDAT" /* IDAT */);
    assertChunkDataLengthEquals(ctx, chunk, 0);
  }
  var init_chunk_IEND = __esm({
    "src/png-codec/decode/chunks/chunk_IEND.ts"() {
      init_assert();
      init_types();
    }
  });

  // src/png-codec/decode/validate.ts
  function isValidBitDepth(bitDepth) {
    return bitDepth === 1 || bitDepth === 2 || bitDepth === 4 || bitDepth === 8 || bitDepth === 16;
  }
  function isValidColorType(colorType, bitDepth) {
    return colorType === 0 /* Grayscale */ && bitDepth >= 1 && bitDepth <= 16 || colorType === 2 /* Truecolor */ && bitDepth >= 8 && bitDepth <= 16 || colorType === 3 /* Indexed */ && bitDepth >= 1 && bitDepth <= 8 || colorType === 4 /* GrayscaleAndAlpha */ && bitDepth >= 8 && bitDepth <= 16 || colorType === 6 /* TruecolorAndAlpha */ && bitDepth >= 8 && bitDepth <= 16;
  }
  function isValidFilterMethod(filterMethod) {
    return filterMethod === 0 /* Adaptive */;
  }
  function isValidInterlaceMethod(interlaceMethod) {
    return interlaceMethod === 0 /* None */ || interlaceMethod === 1 /* Adam7 */;
  }
  var init_validate = __esm({
    "src/png-codec/decode/validate.ts"() {
      init_types();
    }
  });

  // src/png-codec/decode/chunks/chunk_IHDR.ts
  function parseChunk3(ctx, chunk) {
    assertChunkDataLengthEquals(ctx, chunk, 13);
    let offset = chunk.offset + 4 /* Length */ + 4 /* Type */;
    const width = ctx.view.getUint32(offset);
    offset += 4;
    const height = ctx.view.getUint32(offset);
    offset += 4;
    const bitDepth = ctx.view.getUint8(offset);
    if (!isValidBitDepth(bitDepth)) {
      throw createChunkDecodeError(
        ctx,
        chunk,
        `Bit depth "${bitDepth}" is not valid`,
        offset
      );
    }
    offset++;
    const colorType = ctx.view.getUint8(offset);
    if (!isValidColorType(colorType, bitDepth)) {
      throw createChunkDecodeError(
        ctx,
        chunk,
        `Color type "${colorType}" is not valid with bit depth "${bitDepth}"`,
        offset
      );
    }
    offset++;
    const compressionMethod = ctx.view.getUint8(offset);
    assertChunkCompressionMethod(ctx, chunk, compressionMethod, offset);
    offset++;
    let filterMethod = ctx.view.getUint8(offset);
    if (!isValidFilterMethod(filterMethod)) {
      handleWarning(
        ctx,
        createChunkDecodeWarning(
          chunk,
          `Filter method "${filterMethod}" is not valid`,
          offset
        )
      );
      filterMethod = 0;
    }
    offset++;
    let interlaceMethod = ctx.view.getUint8(offset);
    if (!isValidInterlaceMethod(interlaceMethod)) {
      handleWarning(
        ctx,
        createChunkDecodeWarning(
          chunk,
          `Interlace method "${interlaceMethod}" is not valid`,
          offset
        )
      );
      interlaceMethod = 0 /* None */;
    }
    offset++;
    return {
      width,
      height,
      bitDepth,
      colorType,
      interlaceMethod
    };
  }
  var init_chunk_IHDR = __esm({
    "src/png-codec/decode/chunks/chunk_IHDR.ts"() {
      init_assert();
      init_types();
      init_validate();
    }
  });

  // src/png-codec/shared/crc32.ts
  function getCrcTable() {
    if (tableInternal) {
      return tableInternal;
    }
    tableInternal = [];
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) {
        if (c & 1) {
          c = 3988292384 ^ c >>> 1;
        } else {
          c = c >>> 1;
        }
      }
      tableInternal[n] = c >>> 0;
    }
    return tableInternal;
  }
  function updateCrc(crc, dataView, offset, length) {
    const table = getCrcTable();
    let c = crc;
    for (let n = 0; n < length; n++) {
      c = table[(c ^ dataView.getUint8(offset + n)) & 255] ^ c >>> 8;
    }
    return c;
  }
  function crc322(dataView, offset, length) {
    return (updateCrc(4294967295, dataView, offset, length) ^ 4294967295) >>> 0;
  }
  var tableInternal;
  var init_crc322 = __esm({
    "src/png-codec/shared/crc32.ts"() {
    }
  });

  // src/png-codec/decode/chunks/chunk_bKGD.ts
  var chunk_bKGD_exports = {};
  __export(chunk_bKGD_exports, {
    parseChunk: () => parseChunk4
  });
  function parseChunk4(ctx, header, chunk) {
    assertChunkSinglular(ctx, chunk);
    assertChunkPrecedes(ctx, chunk, "IDAT" /* IDAT */);
    const offset = chunk.offset + 4 /* Length */ + 4 /* Type */;
    let color;
    let expectedLength;
    switch (header.colorType) {
      case 0:
      case 4: {
        color = ctx.view.getUint16(offset);
        expectedLength = 2;
        break;
      }
      case 2:
      case 6: {
        color = [
          ctx.view.getUint16(offset),
          ctx.view.getUint16(offset + 2),
          ctx.view.getUint16(offset + 4)
        ];
        expectedLength = 6;
        break;
      }
      case 3: {
        color = ctx.view.getUint8(offset);
        expectedLength = 1;
        break;
      }
      default:
        throw createChunkDecodeWarning(
          chunk,
          `Unrecognized color type "${header.colorType}"`,
          offset
        );
    }
    assertChunkDataLengthEquals(ctx, chunk, expectedLength);
    return { type: "bKGD", color };
  }
  var init_chunk_bKGD = __esm({
    "src/png-codec/decode/chunks/chunk_bKGD.ts"() {
      init_assert();
      init_types();
    }
  });

  // src/png-codec/decode/chunks/chunk_cHRM.ts
  var chunk_cHRM_exports = {};
  __export(chunk_cHRM_exports, {
    parseChunk: () => parseChunk5
  });
  function parseChunk5(ctx, header, chunk) {
    assertChunkSinglular(ctx, chunk);
    assertChunkPrecedes(ctx, chunk, "PLTE" /* PLTE */);
    assertChunkPrecedes(ctx, chunk, "IDAT" /* IDAT */);
    assertChunkDataLengthEquals(ctx, chunk, 32);
    let offset = chunk.offset + 4 /* Length */ + 4 /* Type */;
    const whitePoint = {
      x: ctx.view.getUint32(offset) / 1e5,
      y: ctx.view.getUint32(offset + 4) / 1e5
    };
    if (whitePoint.x > 1 || whitePoint.y > 1) {
      throw createChunkDecodeWarning(
        chunk,
        `Invalid white point (${whitePoint.x},${whitePoint.y})`,
        offset
      );
    }
    offset += 8;
    const red = {
      x: ctx.view.getUint32(offset) / 1e5,
      y: ctx.view.getUint32(offset + 4) / 1e5
    };
    if (red.x > 1 || red.y > 1) {
      throw createChunkDecodeWarning(
        chunk,
        `Invalid red (${red.x},${red.y})`,
        offset
      );
    }
    offset += 8;
    const green = {
      x: ctx.view.getUint32(offset) / 1e5,
      y: ctx.view.getUint32(offset + 4) / 1e5
    };
    if (green.x > 1 || green.y > 1) {
      throw createChunkDecodeWarning(
        chunk,
        `Invalid green (${green.x},${green.y})`,
        offset
      );
    }
    offset += 8;
    const blue = {
      x: ctx.view.getUint32(offset) / 1e5,
      y: ctx.view.getUint32(offset + 4) / 1e5
    };
    if (blue.x > 1 || blue.y > 1) {
      throw createChunkDecodeWarning(
        chunk,
        `Invalid blue (${blue.x},${blue.y})`,
        offset
      );
    }
    return {
      type: "cHRM",
      whitePoint,
      red,
      green,
      blue
    };
  }
  var init_chunk_cHRM = __esm({
    "src/png-codec/decode/chunks/chunk_cHRM.ts"() {
      init_assert();
      init_types();
    }
  });

  // src/png-codec/decode/chunks/chunk_eXIf.ts
  var chunk_eXIf_exports = {};
  __export(chunk_eXIf_exports, {
    parseChunk: () => parseChunk6
  });
  function parseChunk6(ctx, header, chunk) {
    const offset = chunk.offset + 4 /* Length */ + 4 /* Type */;
    return {
      type: "eXIf",
      value: ctx.view.buffer.slice(
        ctx.view.byteOffset + offset,
        ctx.view.byteOffset + offset + chunk.dataLength
      )
    };
  }
  var init_chunk_eXIf = __esm({
    "src/png-codec/decode/chunks/chunk_eXIf.ts"() {
      init_types();
    }
  });

  // src/png-codec/decode/chunks/chunk_gAMA.ts
  var chunk_gAMA_exports = {};
  __export(chunk_gAMA_exports, {
    parseChunk: () => parseChunk7
  });
  function parseChunk7(ctx, header, chunk) {
    assertChunkSinglular(ctx, chunk);
    assertChunkPrecedes(ctx, chunk, "PLTE" /* PLTE */);
    assertChunkPrecedes(ctx, chunk, "IDAT" /* IDAT */);
    assertChunkDataLengthEquals(ctx, chunk, 4);
    const offset = chunk.offset + 4 /* Length */ + 4 /* Type */;
    const value = ctx.view.getUint32(offset) / 1e5;
    if (value === 0) {
      handleWarning(
        ctx,
        createChunkDecodeWarning(chunk, "A value of 0 is meaningless", offset)
      );
    }
    return {
      type: "gAMA",
      value
    };
  }
  var init_chunk_gAMA = __esm({
    "src/png-codec/decode/chunks/chunk_gAMA.ts"() {
      init_assert();
      init_types();
    }
  });

  // src/png-codec/decode/chunks/chunk_hIST.ts
  var chunk_hIST_exports = {};
  __export(chunk_hIST_exports, {
    parseChunk: () => parseChunk8
  });
  function parseChunk8(ctx, header, chunk) {
    assertChunkSinglular(ctx, chunk);
    assertChunkFollows(ctx, chunk, "PLTE" /* PLTE */);
    assertChunkPrecedes(ctx, chunk, "IDAT" /* IDAT */);
    assertChunkDataLengthEquals(ctx, chunk, ctx.palette.size * 2);
    const offset = chunk.offset + 4 /* Length */ + 4 /* Type */;
    const frequency = [];
    for (let i = 0; i < ctx.palette.size * 2; i += 2) {
      frequency.push(ctx.view.getUint16(offset + i));
    }
    return {
      type: "hIST",
      frequency
    };
  }
  var init_chunk_hIST = __esm({
    "src/png-codec/decode/chunks/chunk_hIST.ts"() {
      init_assert();
      init_types();
    }
  });

  // src/png-codec/decode/text.ts
  function readText(ctx, chunk, textDecoder, maxLength, offset, maxOffset, readTrailingNull, isCompressed) {
    const bytes = [];
    let current = 0;
    let i = 0;
    for (; maxLength === void 0 || i < maxLength; i++) {
      if (!readTrailingNull && offset === maxOffset) {
        break;
      }
      try {
        current = ctx.view.getUint8(offset);
      } catch (e) {
        if (e instanceof Error && e.message === "Offset is outside the bounds of the DataView") {
          throw createChunkDecodeWarning(chunk, "EOF while reading text", offset);
        }
        throw e;
      }
      if (!isCompressed && current === 0) {
        break;
      }
      offset++;
      bytes.push(current);
    }
    if (readTrailingNull && ctx.view.getUint8(offset) !== 0) {
      throw createChunkDecodeWarning(
        chunk,
        "No null character after text",
        offset
      );
    }
    let typedArray = new Uint8Array(bytes);
    if (isCompressed) {
      const inflator = new Inflate();
      inflator.push(typedArray);
      if (inflator.err) {
        throw createChunkDecodeWarning(
          chunk,
          `Inflate error: ${inflator.msg}`,
          offset
        );
      }
      typedArray = inflator.result;
    }
    return {
      text: textDecoder ? textDecoder.decode(typedArray) : String.fromCharCode(...bytes),
      bytesRead: i + 1
    };
  }
  var init_text = __esm({
    "src/png-codec/decode/text.ts"() {
      init_pako();
      init_assert();
    }
  });

  // src/png-codec/decode/chunks/chunk_iCCP.ts
  var chunk_iCCP_exports = {};
  __export(chunk_iCCP_exports, {
    parseChunk: () => parseChunk9
  });
  function parseChunk9(ctx, header, chunk) {
    assertChunkSinglular(ctx, chunk);
    assertChunkMutualExclusion(ctx, chunk, "sRGB" /* sRGB */);
    assertChunkPrecedes(ctx, chunk, "PLTE" /* PLTE */);
    assertChunkPrecedes(ctx, chunk, "IDAT" /* IDAT */);
    assertChunkDataLengthGte(ctx, chunk, 3);
    const chunkDataOffset = chunk.offset + 4 /* Length */ + 4 /* Type */;
    const maxOffset = chunkDataOffset + chunk.dataLength;
    let offset = chunkDataOffset;
    const textDecoder = new TextDecoder("latin1");
    const readResult = readText(
      ctx,
      chunk,
      textDecoder,
      79,
      offset,
      maxOffset,
      true
    );
    offset += readResult.bytesRead;
    const name = readResult.text;
    const compressionMethod = ctx.view.getUint8(offset);
    assertChunkCompressionMethod(ctx, chunk, compressionMethod, offset);
    offset++;
    const data = new Uint8Array(
      ctx.view.buffer.slice(
        ctx.view.byteOffset + offset,
        ctx.view.byteOffset + maxOffset
      )
    );
    return {
      type: "iCCP",
      name,
      data
    };
  }
  var init_chunk_iCCP = __esm({
    "src/png-codec/decode/chunks/chunk_iCCP.ts"() {
      init_assert();
      init_text();
      init_types();
    }
  });

  // src/png-codec/decode/chunks/chunk_iTXt.ts
  var chunk_iTXt_exports = {};
  __export(chunk_iTXt_exports, {
    parseChunk: () => parseChunk10
  });
  function parseChunk10(ctx, header, chunk) {
    assertChunkDataLengthGte(ctx, chunk, 6);
    let offset = chunk.offset + 4 /* Length */ + 4 /* Type */;
    const maxOffset = offset + chunk.dataLength;
    const textDecoder = new TextDecoder("utf8");
    let readResult;
    readResult = readText(ctx, chunk, textDecoder, 79, offset, maxOffset, true);
    offset += readResult.bytesRead;
    const keyword = readResult.text;
    const isCompressed = ctx.view.getUint8(offset++) === 1;
    const compressionMethod = ctx.view.getUint8(offset);
    if (isCompressed) {
      assertChunkCompressionMethod(ctx, chunk, compressionMethod, offset);
    }
    offset++;
    readResult = readText(
      ctx,
      chunk,
      textDecoder,
      void 0,
      offset,
      maxOffset,
      true
    );
    offset += readResult.bytesRead;
    const languageTag = readResult.text;
    readResult = readText(
      ctx,
      chunk,
      textDecoder,
      void 0,
      offset,
      maxOffset,
      true
    );
    offset += readResult.bytesRead;
    const translatedKeyword = readResult.text;
    readResult = readText(
      ctx,
      chunk,
      textDecoder,
      void 0,
      offset,
      maxOffset,
      false,
      isCompressed
    );
    offset += readResult.bytesRead;
    const text = readResult.text;
    return {
      type: "iTXt",
      keyword,
      languageTag,
      translatedKeyword,
      text
    };
  }
  var init_chunk_iTXt = __esm({
    "src/png-codec/decode/chunks/chunk_iTXt.ts"() {
      init_assert();
      init_text();
      init_types();
    }
  });

  // src/png-codec/decode/chunks/chunk_tIME.ts
  var chunk_tIME_exports = {};
  __export(chunk_tIME_exports, {
    parseChunk: () => parseChunk11
  });
  function parseChunk11(ctx, header, chunk) {
    assertChunkSinglular(ctx, chunk);
    assertChunkDataLengthEquals(ctx, chunk, 7);
    let offset = chunk.offset + 4 /* Length */ + 4 /* Type */;
    const year = ctx.view.getUint16(offset);
    offset += 2;
    const month = ctx.view.getUint8(offset++);
    const day = ctx.view.getUint8(offset++);
    const hour = ctx.view.getUint8(offset++);
    const minute = ctx.view.getUint8(offset++);
    const second = ctx.view.getUint8(offset++);
    return {
      type: "tIME",
      value: new Date(year, month, day, hour, minute, second)
    };
  }
  var init_chunk_tIME = __esm({
    "src/png-codec/decode/chunks/chunk_tIME.ts"() {
      init_assert();
      init_types();
    }
  });

  // src/png-codec/decode/chunks/chunk_oFFs.ts
  var chunk_oFFs_exports = {};
  __export(chunk_oFFs_exports, {
    parseChunk: () => parseChunk12
  });
  function parseChunk12(ctx, header, chunk) {
    assertChunkSinglular(ctx, chunk);
    assertChunkPrecedes(ctx, chunk, "IDAT" /* IDAT */);
    assertChunkDataLengthEquals(ctx, chunk, 9);
    let offset = chunk.offset + 4 /* Length */ + 4 /* Type */;
    const x = ctx.view.getInt32(offset);
    offset += 4;
    const y = ctx.view.getInt32(offset);
    offset += 4;
    const unitTypeByte = ctx.view.getUint8(offset);
    let unitType;
    switch (unitTypeByte) {
      case 0:
        unitType = "pixel";
        break;
      case 1:
        unitType = "micrometer";
        break;
      default:
        throw createChunkDecodeWarning(
          chunk,
          `Invalid oFFs unit type ("${unitTypeByte}")`,
          offset
        );
    }
    return {
      type: "oFFs",
      offset: { x, y },
      unitType
    };
  }
  var init_chunk_oFFs = __esm({
    "src/png-codec/decode/chunks/chunk_oFFs.ts"() {
      init_assert();
      init_types();
    }
  });

  // src/png-codec/decode/float.ts
  function readFloat(ctx, chunk, textDecoder, offset, maxOffset, readTrailingNull) {
    const readResult = readText(
      ctx,
      chunk,
      textDecoder,
      void 0,
      offset,
      maxOffset,
      readTrailingNull
    );
    offset += readResult.bytesRead;
    if (!isValidFloatingPoint(readResult.text)) {
      handleWarning(
        ctx,
        createChunkDecodeWarning(
          chunk,
          `Invalid character in floating point number ("${readResult.text}")`,
          offset
        )
      );
    }
    const value = parseFloat(readResult.text);
    return {
      bytesRead: readResult.bytesRead,
      value
    };
  }
  function isValidFloatingPoint(text) {
    return text.match(/^[+-]?[0-9]+\.[0-9]+([eE][+-]?[0-9]+)?$/) || text.match(/^[+-]?[0-9]+\.?([eE][+-]?[0-9]+)?$/) || text.match(/^[+-]?\.[0-9]+([eE][+-]?[0-9]+)?$/);
  }
  var init_float = __esm({
    "src/png-codec/decode/float.ts"() {
      init_assert();
      init_text();
    }
  });

  // src/png-codec/decode/chunks/chunk_pCAL.ts
  var chunk_pCAL_exports = {};
  __export(chunk_pCAL_exports, {
    parseChunk: () => parseChunk13
  });
  function parseChunk13(ctx, header, chunk) {
    assertChunkSinglular(ctx, chunk);
    assertChunkPrecedes(ctx, chunk, "IDAT" /* IDAT */);
    assertChunkDataLengthGte(ctx, chunk, 4);
    const chunkDataOffset = chunk.offset + 4 /* Length */ + 4 /* Type */;
    const maxOffset = chunkDataOffset + chunk.dataLength;
    let offset = chunkDataOffset;
    const textDecoder = new TextDecoder("latin1");
    let readTextResult;
    readTextResult = readText(
      ctx,
      chunk,
      textDecoder,
      79,
      offset,
      maxOffset,
      true
    );
    offset += readTextResult.bytesRead;
    const calibrationName = readTextResult.text;
    const x0 = ctx.view.getInt32(offset);
    offset += 4;
    const x1 = ctx.view.getInt32(offset);
    offset += 4;
    const equationTypeByte = ctx.view.getUint8(offset++);
    let equationType;
    switch (equationTypeByte) {
      case 0:
        equationType = "linear-mapping";
        break;
      case 1:
        equationType = "base-e exponential mapping";
        break;
      case 2:
        equationType = "arbitrary-base exponential mapping";
        break;
      case 3:
        equationType = "hyperbolic mapping";
        break;
      default:
        throw createChunkDecodeWarning(
          chunk,
          `Invalid equation type "${equationTypeByte}"`,
          offset
        );
    }
    const parameterCount = ctx.view.getUint8(offset++);
    readTextResult = readText(
      ctx,
      chunk,
      textDecoder,
      79,
      offset,
      maxOffset,
      true
    );
    offset += readTextResult.bytesRead;
    const unitName = readTextResult.text;
    const params = [];
    let readFloatResult;
    for (let i = 0; i < parameterCount; i++) {
      readFloatResult = readFloat(
        ctx,
        chunk,
        textDecoder,
        offset,
        maxOffset,
        i < parameterCount - 1
      );
      offset += readFloatResult.bytesRead;
      params.push(readFloatResult.value);
    }
    return {
      type: "pCAL",
      calibrationName,
      x0,
      x1,
      equationType,
      unitName,
      params
    };
  }
  var init_chunk_pCAL = __esm({
    "src/png-codec/decode/chunks/chunk_pCAL.ts"() {
      init_assert();
      init_float();
      init_text();
      init_types();
    }
  });

  // src/png-codec/decode/chunks/chunk_pHYs.ts
  var chunk_pHYs_exports = {};
  __export(chunk_pHYs_exports, {
    parseChunk: () => parseChunk14
  });
  function parseChunk14(ctx, header, chunk) {
    assertChunkSinglular(ctx, chunk);
    assertChunkPrecedes(ctx, chunk, "IDAT" /* IDAT */);
    assertChunkDataLengthEquals(ctx, chunk, 9);
    let offset = chunk.offset + 4 /* Length */ + 4 /* Type */;
    const x = ctx.view.getUint32(offset);
    offset += 4;
    const y = ctx.view.getUint32(offset);
    offset += 4;
    const unitType = ctx.view.getUint8(offset) === 1 ? "meter" : "unknown";
    return {
      type: "pHYs",
      pixelsPerUnit: { x, y },
      unitType
    };
  }
  var init_chunk_pHYs = __esm({
    "src/png-codec/decode/chunks/chunk_pHYs.ts"() {
      init_assert();
      init_types();
    }
  });

  // src/png-codec/decode/chunks/chunk_sBIT.ts
  var chunk_sBIT_exports = {};
  __export(chunk_sBIT_exports, {
    parseChunk: () => parseChunk15
  });
  function parseChunk15(ctx, header, chunk) {
    assertChunkSinglular(ctx, chunk);
    assertChunkPrecedes(ctx, chunk, "PLTE" /* PLTE */);
    assertChunkPrecedes(ctx, chunk, "IDAT" /* IDAT */);
    const offset = chunk.offset + 4 /* Length */ + 4 /* Type */;
    let value;
    let expectedLength;
    switch (header.colorType) {
      case 0: {
        value = ctx.view.getUint8(offset);
        expectedLength = 1;
        break;
      }
      case 2:
      case 3: {
        value = [
          ctx.view.getUint8(offset),
          ctx.view.getUint8(offset + 1),
          ctx.view.getUint8(offset + 2)
        ];
        expectedLength = 3;
        break;
      }
      case 4: {
        value = [ctx.view.getUint8(offset), ctx.view.getUint8(offset + 1)];
        expectedLength = 2;
        break;
      }
      case 6: {
        value = [
          ctx.view.getUint8(offset),
          ctx.view.getUint8(offset + 1),
          ctx.view.getUint8(offset + 2),
          ctx.view.getUint8(offset + 3)
        ];
        expectedLength = 4;
        break;
      }
      default:
        throw createChunkDecodeWarning(
          chunk,
          `Unrecognized color type "${header.colorType}"`,
          offset
        );
    }
    assertChunkDataLengthEquals(ctx, chunk, expectedLength);
    return {
      type: "sBIT",
      value
    };
  }
  var init_chunk_sBIT = __esm({
    "src/png-codec/decode/chunks/chunk_sBIT.ts"() {
      init_assert();
      init_types();
    }
  });

  // src/png-codec/decode/chunks/chunk_sCAL.ts
  var chunk_sCAL_exports = {};
  __export(chunk_sCAL_exports, {
    parseChunk: () => parseChunk16
  });
  function parseChunk16(ctx, header, chunk) {
    assertChunkSinglular(ctx, chunk);
    assertChunkPrecedes(ctx, chunk, "IDAT" /* IDAT */);
    assertChunkDataLengthGte(ctx, chunk, 4);
    const chunkDataOffset = chunk.offset + 4 /* Length */ + 4 /* Type */;
    const maxOffset = chunkDataOffset + chunk.dataLength;
    let offset = chunkDataOffset;
    const textDecoder = new TextDecoder("latin1");
    const unitTypeByte = ctx.view.getUint8(offset);
    let unitType;
    switch (unitTypeByte) {
      case 0:
        unitType = "meter";
        break;
      case 1:
        unitType = "radian";
        break;
      default:
        throw createChunkDecodeWarning(
          chunk,
          `Invalid sCAL unit type ("${unitTypeByte}")`,
          offset
        );
    }
    offset++;
    let readResult;
    readResult = readFloat(ctx, chunk, textDecoder, offset, maxOffset, true);
    offset += readResult.bytesRead;
    const x = readResult.value;
    readResult = readFloat(ctx, chunk, textDecoder, offset, maxOffset, false);
    offset += readResult.bytesRead;
    const y = readResult.value;
    if (x < 0 || y < 0) {
      throw createChunkDecodeWarning(
        chunk,
        `Values cannot be negative (${x}, ${y})`,
        offset
      );
    }
    return {
      type: "sCAL",
      pixelsPerUnit: { x, y },
      unitType
    };
  }
  var init_chunk_sCAL = __esm({
    "src/png-codec/decode/chunks/chunk_sCAL.ts"() {
      init_assert();
      init_float();
      init_types();
    }
  });

  // src/png-codec/decode/chunks/chunk_sPLT.ts
  var chunk_sPLT_exports = {};
  __export(chunk_sPLT_exports, {
    parseChunk: () => parseChunk17
  });
  function parseChunk17(ctx, header, chunk) {
    assertChunkPrecedes(ctx, chunk, "IDAT" /* IDAT */);
    const dataStartOffset = chunk.offset + 4 /* Length */ + 4 /* Type */;
    let offset = dataStartOffset;
    const maxOffset = offset + chunk.dataLength;
    const textDecoder = new TextDecoder("latin1");
    const readResult = readText(
      ctx,
      chunk,
      textDecoder,
      void 0,
      offset,
      maxOffset,
      true
    );
    offset += readResult.bytesRead;
    const name = readResult.text;
    const sampleDepth = ctx.view.getUint8(offset++);
    const sampleBytes = sampleDepth === 16 ? 2 : 1;
    const entrySize = sampleBytes * 4 + 2;
    const entriesOffset = chunk.dataLength - (offset - dataStartOffset);
    const entryCount = entriesOffset / entrySize;
    if (entryCount % 1 !== 0) {
      throw createChunkDecodeWarning(
        chunk,
        `Invalid data length: ${entriesOffset} should be divisible by entry size ${entrySize}`,
        offset
      );
    }
    const entries = [];
    for (let i = 0; i < entryCount; i++) {
      const channels = [];
      for (let c = 0; c < 4; c++) {
        channels.push(
          sampleBytes === 2 ? ctx.view.getUint16(offset) : ctx.view.getUint8(offset)
        );
        offset += sampleBytes;
      }
      const frequency = ctx.view.getUint16(offset);
      offset += 2;
      entries.push({
        red: channels[0],
        green: channels[1],
        blue: channels[2],
        alpha: channels[3],
        frequency
      });
    }
    return {
      type: "sPLT",
      name,
      sampleDepth,
      entries
    };
  }
  var init_chunk_sPLT = __esm({
    "src/png-codec/decode/chunks/chunk_sPLT.ts"() {
      init_assert();
      init_text();
      init_types();
    }
  });

  // src/png-codec/decode/chunks/chunk_sRGB.ts
  var chunk_sRGB_exports = {};
  __export(chunk_sRGB_exports, {
    parseChunk: () => parseChunk18
  });
  function parseChunk18(ctx, header, chunk) {
    assertChunkSinglular(ctx, chunk);
    assertChunkMutualExclusion(ctx, chunk, "iCCP" /* iCCP */);
    assertChunkPrecedes(ctx, chunk, "PLTE" /* PLTE */);
    assertChunkPrecedes(ctx, chunk, "IDAT" /* IDAT */);
    assertChunkDataLengthEquals(ctx, chunk, 1);
    const offset = chunk.offset + 4 /* Length */ + 4 /* Type */;
    const byte = ctx.view.getUint8(offset);
    let renderingIntent;
    switch (byte) {
      case 0 /* Perceptual */:
      case 1 /* RelativeColorimetric */:
      case 2 /* Saturation */:
      case 3 /* AbsoluteColorimetric */:
        renderingIntent = byte;
        break;
      default:
        throw createChunkDecodeWarning(
          chunk,
          `Invalid rendering intent "${byte}"`,
          offset
        );
    }
    return {
      type: "sRGB",
      renderingIntent
    };
  }
  var init_chunk_sRGB = __esm({
    "src/png-codec/decode/chunks/chunk_sRGB.ts"() {
      init_assert();
      init_types();
    }
  });

  // src/png-codec/decode/chunks/chunk_sTER.ts
  var chunk_sTER_exports = {};
  __export(chunk_sTER_exports, {
    parseChunk: () => parseChunk19
  });
  function parseChunk19(ctx, header, chunk) {
    assertChunkSinglular(ctx, chunk);
    assertChunkPrecedes(ctx, chunk, "IDAT" /* IDAT */);
    assertChunkDataLengthEquals(ctx, chunk, 1);
    const offset = chunk.offset + 4 /* Length */ + 4 /* Type */;
    const layoutModeByte = ctx.view.getUint8(offset);
    let layoutMode;
    switch (layoutModeByte) {
      case 0:
        layoutMode = "cross-fuse";
        break;
      case 1:
        layoutMode = "diverging-fuse";
        break;
      default:
        throw createChunkDecodeWarning(
          chunk,
          `Invalid layout mode "${layoutModeByte}"`,
          offset
        );
    }
    const padding = 15 - (header.width - 1) % 16;
    if (padding > 7) {
      throw createChunkDecodeWarning(
        chunk,
        `Invalid padding value "${padding}" for image width ${header.width}`,
        offset
      );
    }
    const subimageWidth = Math.floor((header.width - padding) / 2);
    return {
      type: "sTER",
      layoutMode,
      subimageWidth,
      padding
    };
  }
  var init_chunk_sTER = __esm({
    "src/png-codec/decode/chunks/chunk_sTER.ts"() {
      init_assert();
      init_types();
    }
  });

  // src/png-codec/decode/chunks/chunk_tEXt.ts
  var chunk_tEXt_exports = {};
  __export(chunk_tEXt_exports, {
    parseChunk: () => parseChunk20
  });
  function parseChunk20(ctx, header, chunk) {
    assertChunkDataLengthGte(ctx, chunk, 6);
    const chunkDataOffset = chunk.offset + 4 /* Length */ + 4 /* Type */;
    const maxOffset = chunkDataOffset + chunk.dataLength;
    let offset = chunkDataOffset;
    const textDecoder = new TextDecoder("utf8");
    let readResult;
    readResult = readText(ctx, chunk, textDecoder, 79, offset, maxOffset, true);
    offset += readResult.bytesRead;
    const keyword = readResult.text;
    readResult = readText(
      ctx,
      chunk,
      textDecoder,
      void 0,
      offset,
      maxOffset,
      false
    );
    offset += readResult.bytesRead;
    const text = readResult.text;
    return {
      type: "tEXt",
      keyword,
      text
    };
  }
  var init_chunk_tEXt = __esm({
    "src/png-codec/decode/chunks/chunk_tEXt.ts"() {
      init_assert();
      init_text();
      init_types();
    }
  });

  // src/png-codec/decode/chunks/chunk_tRNS.ts
  var chunk_tRNS_exports = {};
  __export(chunk_tRNS_exports, {
    parseChunk: () => parseChunk21
  });
  function parseChunk21(ctx, header, chunk) {
    assertChunkPrecedes(ctx, chunk, "IDAT" /* IDAT */);
    switch (header.colorType) {
      case 0 /* Grayscale */:
        assertChunkDataLengthEquals(ctx, chunk, 2);
        break;
      case 2 /* Truecolor */:
        assertChunkDataLengthEquals(ctx, chunk, 6);
        break;
      case 3 /* Indexed */:
        assertChunkFollows(ctx, chunk, "PLTE" /* PLTE */);
        if (chunk.dataLength > ctx.palette.size) {
          throw createChunkDecodeWarning(
            chunk,
            `Invalid data length for color type ${header.colorType}: ${chunk.dataLength} > ${ctx.palette.size}`,
            chunk.offset + 4 /* Length */ + 4 /* Type */
          );
        }
        break;
      case 4 /* GrayscaleAndAlpha */:
      case 6 /* TruecolorAndAlpha */:
        throw createChunkDecodeWarning(
          chunk,
          `Chunk invalid when color type has alpha (${header.colorType})`,
          chunk.offset + 4 /* Length */ + 4 /* Type */
        );
    }
    const offset = chunk.offset + 4 /* Length */ + 4 /* Type */;
    let transparency;
    switch (header.colorType) {
      case 0 /* Grayscale */:
        transparency = ctx.view.getUint16(offset);
        break;
      case 2 /* Truecolor */:
        transparency = [
          ctx.view.getUint16(offset),
          ctx.view.getUint16(offset + 2),
          ctx.view.getUint16(offset + 4)
        ];
        break;
      case 3 /* Indexed */:
        transparency = [];
        for (let i = 0; i < chunk.dataLength; i++) {
          transparency.push(ctx.view.getUint8(offset + i));
        }
        break;
    }
    return {
      type: "tRNS",
      transparency
    };
  }
  var init_chunk_tRNS = __esm({
    "src/png-codec/decode/chunks/chunk_tRNS.ts"() {
      init_assert();
      init_types();
    }
  });

  // src/png-codec/decode/chunks/chunk_zTXt.ts
  var chunk_zTXt_exports = {};
  __export(chunk_zTXt_exports, {
    parseChunk: () => parseChunk22
  });
  function parseChunk22(ctx, header, chunk) {
    assertChunkDataLengthGte(ctx, chunk, 6);
    const chunkDataOffset = chunk.offset + 4 /* Length */ + 4 /* Type */;
    const maxOffset = chunkDataOffset + chunk.dataLength;
    let offset = chunkDataOffset;
    const textDecoder = new TextDecoder("utf8");
    let readResult;
    readResult = readText(ctx, chunk, textDecoder, 79, offset, maxOffset, true);
    offset += readResult.bytesRead;
    const keyword = readResult.text;
    const compressionMethod = ctx.view.getUint8(offset);
    assertChunkCompressionMethod(ctx, chunk, compressionMethod, offset);
    offset++;
    readResult = readText(
      ctx,
      chunk,
      textDecoder,
      void 0,
      offset,
      maxOffset,
      false,
      true
      // isCompressed
    );
    offset += readResult.bytesRead;
    const text = readResult.text;
    return {
      type: "zTXt",
      keyword,
      text
    };
  }
  var init_chunk_zTXt = __esm({
    "src/png-codec/decode/chunks/chunk_zTXt.ts"() {
      init_assert();
      init_text();
      init_types();
    }
  });

  // src/png-codec/decode/chunks/chunk_PLTE.ts
  var chunk_PLTE_exports = {};
  __export(chunk_PLTE_exports, {
    Palette: () => Palette,
    parseChunk: () => parseChunk23
  });
  function parseChunk23(ctx, header, chunk) {
    assertChunkSinglular(ctx, chunk);
    assertChunkPrecedes(ctx, chunk, "bKGD" /* bKGD */);
    assertChunkPrecedes(ctx, chunk, "hIST" /* hIST */);
    assertChunkPrecedes(ctx, chunk, "tRNS" /* tRNS */);
    assertChunkPrecedes(ctx, chunk, "IDAT" /* IDAT */);
    let offset = chunk.offset + 4 /* Length */;
    if (header.colorType === 0 /* Grayscale */ || header.colorType === 4 /* GrayscaleAndAlpha */) {
      throw createChunkDecodeWarning(
        chunk,
        `Color type "${header.colorType}" cannot have a palette`,
        offset
      );
    }
    offset += 4 /* Type */;
    if (chunk.dataLength === 0) {
      throw createChunkDecodeWarning(chunk, "Cannot have 0 entries", offset);
    }
    if (chunk.dataLength % 3 !== 0) {
      throw createChunkDecodeWarning(
        chunk,
        `Chunk length must be divisible by 3 (actual "${chunk.dataLength}")`,
        offset
      );
    }
    if (chunk.dataLength / 3 > 256) {
      handleWarning(
        ctx,
        createChunkDecodeWarning(
          chunk,
          `Too many entries (${chunk.dataLength / 3} > 256)`,
          offset
        )
      );
    }
    if (chunk.dataLength / 3 > Math.pow(2, header.bitDepth)) {
      handleWarning(
        ctx,
        createChunkDecodeWarning(
          chunk,
          `Too many entries for bit depth (${chunk.dataLength / 3} > 2^${header.bitDepth})`,
          offset
        )
      );
    }
    return new Palette(
      ctx.view,
      chunk.offset + 4 /* Length */ + 4 /* Type */,
      chunk.dataLength
    );
  }
  var Palette;
  var init_chunk_PLTE = __esm({
    "src/png-codec/decode/chunks/chunk_PLTE.ts"() {
      init_assert();
      init_types();
      Palette = class {
        constructor(_view, _paletteOffset, _length) {
          this._view = _view;
          this._paletteOffset = _paletteOffset;
          this._length = _length;
        }
        get size() {
          return this._length / 3;
        }
        getRgb(colorIndex) {
          this._checkIndex(colorIndex);
          return new Uint8Array(
            this._view.buffer.slice(
              this._view.byteOffset + this._paletteOffset + colorIndex * 3,
              this._view.byteOffset + this._paletteOffset + colorIndex * 3 + 3
            )
          );
        }
        setRgba(data, offset, colorIndex) {
          this._checkIndex(colorIndex);
          const i = this._paletteOffset + colorIndex * 3;
          data[offset] = this._view.getUint8(i);
          data[offset + 1] = this._view.getUint8(i + 1);
          data[offset + 2] = this._view.getUint8(i + 2);
          data[offset + 3] = 255;
        }
        _checkIndex(colorIndex) {
          if (colorIndex < 0 || colorIndex * 3 > this._length - 3) {
            throw new Error(`Palette does not contain color index "${colorIndex}"`);
          }
        }
      };
    }
  });

  // src/png-codec/decode/decoder.ts
  var decoder_exports = {};
  __export(decoder_exports, {
    DecodeError: () => DecodeError,
    DecodeWarning: () => DecodeWarning,
    decodePng: () => decodePng,
    readChunk: () => readChunk,
    readChunks: () => readChunks,
    verifyPngSignature: () => verifyPngSignature
  });
  function verifyPngSignature(ctx) {
    if (ctx.view.byteLength < 7) {
      throw new DecodeError(
        ctx,
        `Not enough bytes in file for png signature (${ctx.view.byteLength})`,
        0
      );
    }
    const isCorrect = ctx.view.getUint8(0) === 137 && ctx.view.getUint8(1) === 80 && ctx.view.getUint8(2) === 78 && ctx.view.getUint8(3) === 71 && ctx.view.getUint8(4) === 13 && ctx.view.getUint8(5) === 10 && ctx.view.getUint8(6) === 26 && ctx.view.getUint8(7) === 10;
    if (!isCorrect) {
      const actual = formatHexAssertion(
        Array.from(
          new Uint8Array(ctx.view.buffer).slice(
            ctx.view.byteOffset,
            ctx.view.byteOffset + 8
          )
        )
      );
      const expected = formatHexAssertion([
        137,
        80,
        78,
        71,
        13,
        10,
        26,
        10
      ]);
      throw new DecodeError(
        ctx,
        `Png signature is not correct (${actual} != ${expected})`,
        0
      );
    }
  }
  function formatHexAssertion(actual) {
    return `0x${actual.map((e) => e.toString(16).padStart(2, "0")).join("")}`;
  }
  function getChunkDecoder(type) {
    switch (type) {
      case "bKGD" /* bKGD */:
        return Promise.resolve().then(() => (init_chunk_bKGD(), chunk_bKGD_exports));
      case "cHRM" /* cHRM */:
        return Promise.resolve().then(() => (init_chunk_cHRM(), chunk_cHRM_exports));
      case "eXIf" /* eXIf */:
        return Promise.resolve().then(() => (init_chunk_eXIf(), chunk_eXIf_exports));
      case "gAMA" /* gAMA */:
        return Promise.resolve().then(() => (init_chunk_gAMA(), chunk_gAMA_exports));
      case "hIST" /* hIST */:
        return Promise.resolve().then(() => (init_chunk_hIST(), chunk_hIST_exports));
      case "iCCP" /* iCCP */:
        return Promise.resolve().then(() => (init_chunk_iCCP(), chunk_iCCP_exports));
      case "iTXt" /* iTXt */:
        return Promise.resolve().then(() => (init_chunk_iTXt(), chunk_iTXt_exports));
      case "tIME" /* tIME */:
        return Promise.resolve().then(() => (init_chunk_tIME(), chunk_tIME_exports));
      case "oFFs" /* oFFs */:
        return Promise.resolve().then(() => (init_chunk_oFFs(), chunk_oFFs_exports));
      case "pCAL" /* pCAL */:
        return Promise.resolve().then(() => (init_chunk_pCAL(), chunk_pCAL_exports));
      case "pHYs" /* pHYs */:
        return Promise.resolve().then(() => (init_chunk_pHYs(), chunk_pHYs_exports));
      case "sBIT" /* sBIT */:
        return Promise.resolve().then(() => (init_chunk_sBIT(), chunk_sBIT_exports));
      case "sCAL" /* sCAL */:
        return Promise.resolve().then(() => (init_chunk_sCAL(), chunk_sCAL_exports));
      case "sPLT" /* sPLT */:
        return Promise.resolve().then(() => (init_chunk_sPLT(), chunk_sPLT_exports));
      case "sRGB" /* sRGB */:
        return Promise.resolve().then(() => (init_chunk_sRGB(), chunk_sRGB_exports));
      case "sTER" /* sTER */:
        return Promise.resolve().then(() => (init_chunk_sTER(), chunk_sTER_exports));
      case "tEXt" /* tEXt */:
        return Promise.resolve().then(() => (init_chunk_tEXt(), chunk_tEXt_exports));
      case "tRNS" /* tRNS */:
        return Promise.resolve().then(() => (init_chunk_tRNS(), chunk_tRNS_exports));
      case "zTXt" /* zTXt */:
        return Promise.resolve().then(() => (init_chunk_zTXt(), chunk_zTXt_exports));
      /* istanbul ignore next - this error should never happen in practice */
      default:
        throw new Error(`Could not get decoder for chunk type "${type}"`);
    }
  }
  async function decodePng(data, options = {}) {
    const initialCtx = {
      view: new DataView(data.buffer, data.byteOffset, data.byteLength),
      image: void 0,
      palette: void 0,
      metadata: [],
      parsedChunks: /* @__PURE__ */ new Set(),
      warnings: [],
      info: [],
      options
    };
    verifyPngSignature(initialCtx);
    const chunks = readChunks(initialCtx);
    initialCtx.rawChunks = chunks;
    const header = parseChunk3(initialCtx, chunks[0]);
    const ctx = {
      ...initialCtx,
      header
    };
    let parseChunkTypes;
    if (options && options.parseChunkTypes) {
      if (options.parseChunkTypes === "*") {
        parseChunkTypes = allLazyChunkTypes;
      } else {
        parseChunkTypes = defaultLazyChunkTypes.concat(options.parseChunkTypes);
      }
    } else {
      parseChunkTypes = defaultLazyChunkTypes;
    }
    for (let i = 1; i < chunks.length; i++) {
      const chunk = chunks[i];
      switch (chunk.type) {
        case "IHDR" /* IHDR */:
          handleWarning(
            ctx,
            createChunkDecodeWarning(
              chunk,
              `Multiple IHDR chunks not allowed`,
              chunk.offset + 4 /* Length */
            )
          );
          break;
        case "IDAT" /* IDAT */: {
          const dataChunks = [chunk];
          while (chunks.length > i + 1 && chunks[i + 1].type === "IDAT" /* IDAT */) {
            dataChunks.push(chunks[++i]);
          }
          ctx.image = {
            width: header.width,
            height: header.height,
            // HACK: Not sure why TS doesn't like unioned typed arrays
            data: parseChunk(ctx, header, dataChunks)
          };
          break;
        }
        case "PLTE" /* PLTE */:
          ctx.palette = (await Promise.resolve().then(() => (init_chunk_PLTE(), chunk_PLTE_exports))).parseChunk(
            ctx,
            header,
            chunk
          );
          break;
        case "IEND" /* IEND */:
          parseChunk2(ctx, header, chunk);
          break;
        default:
          if (parseChunkTypes.includes(chunk.type)) {
            try {
              ctx.metadata.push(
                (await getChunkDecoder(chunk.type)).parseChunk(
                  ctx,
                  header,
                  chunk
                )
              );
            } catch (e) {
              if (e instanceof DecodeWarning) {
                handleWarning(ctx, e);
              } else {
                throw e;
              }
            }
          } else {
            if (!allLazyChunkTypes.includes(chunk.type)) {
              if (!chunk.isAncillary) {
                throw new DecodeError(
                  ctx,
                  `Unrecognized critical chunk type "${chunk.type}"`,
                  chunk.offset + 4 /* Length */
                );
              } else {
                ctx.info.push(`Unrecognized chunk type "${chunk.type}"`);
              }
            }
          }
          break;
      }
      ctx.parsedChunks.add(chunk.type);
    }
    if (!ctx.image) {
      throw new DecodeError(ctx, "Failed to decode, no IDAT chunk", 0);
    }
    if (options && options.force32 && ctx.image.data.BYTES_PER_ELEMENT === 2) {
      ctx.image.data = convert16BitTo8BitData(ctx.image.data);
    }
    return {
      image: ctx.image,
      details: {
        width: header.width,
        height: header.height,
        bitDepth: header.bitDepth,
        colorType: header.colorType,
        interlaceMethod: header.interlaceMethod
      },
      palette: ctx.palette,
      metadata: ctx.metadata,
      rawChunks: chunks,
      warnings: ctx.warnings,
      info: ctx.info
    };
  }
  function readChunks(ctx) {
    const chunks = [];
    let offset = 8;
    let hasData = false;
    let hasEnd = false;
    let chunk;
    while (offset < ctx.view.byteLength) {
      try {
        chunk = readChunk(ctx, offset);
      } catch (e) {
        if (!hasEnd || !(e instanceof Error)) {
          throw e;
        }
        handleWarning(
          ctx,
          new DecodeWarning(
            "Could not parse chunk after IEND: " + e.message,
            offset
          )
        );
      }
      offset += 4 /* Length */ + 4 /* Type */ + chunk.dataLength + 4 /* CRC */;
      chunks.push(chunk);
      hasData ||= chunk.type === "IDAT" /* IDAT */;
      hasEnd ||= chunk.type === "IEND" /* IEND */;
    }
    if (chunks[0].type !== "IHDR" /* IHDR */) {
      throw new DecodeError(
        ctx,
        `First chunk is not IHDR`,
        chunks[0].offset + 4 /* Type */
      );
    }
    if (chunks[chunks.length - 1].type !== "IEND" /* IEND */) {
      handleWarning(
        ctx,
        new DecodeWarning(
          "Last chunk is not IEND",
          chunks[chunks.length - 1].offset + 4 /* Length */
        )
      );
    }
    if (!hasData) {
      throw new DecodeError(ctx, "No IDAT chunk", 0);
    }
    return chunks;
  }
  function readChunk(ctx, offset) {
    if (ctx.view.byteLength < offset + 4 /* Length */) {
      throw new DecodeError(ctx, `EOF while reading chunk length`, offset);
    }
    const dataLength = ctx.view.getUint32(offset);
    if (ctx.view.byteLength < offset + 4 /* Length */ + 4 /* Type */) {
      throw new DecodeError(ctx, `EOF while reading chunk type`, offset);
    }
    const type = String.fromCharCode(
      ctx.view.getUint8(offset + 4),
      ctx.view.getUint8(offset + 5),
      ctx.view.getUint8(offset + 6),
      ctx.view.getUint8(offset + 7)
    );
    if (ctx.view.byteLength < offset + 4 /* Length */ + 4 /* Type */ + dataLength + 4 /* CRC */) {
      throw new DecodeError(ctx, `EOF while reading chunk "${type}"`, offset);
    }
    const actualCrc = ctx.view.getUint32(
      offset + 4 /* Length */ + 4 /* Type */ + dataLength
    ) >>> 0;
    const expectedCrc = crc322(
      ctx.view,
      offset + 4 /* Length */,
      4 /* Type */ + dataLength
    );
    if (actualCrc !== expectedCrc) {
      handleWarning(
        ctx,
        new DecodeWarning(
          `CRC for chunk "${type}" at offset 0x${offset.toString(
            16
          )} doesn't match (0x${actualCrc.toString(
            16
          )} !== 0x${expectedCrc.toString(16)})`,
          offset
        )
      );
    }
    return {
      offset,
      type,
      dataLength,
      isAncillary: isCharLowercase(type, 0),
      isPrivate: isCharLowercase(type, 1),
      isSafeToCopy: isCharLowercase(type, 3)
    };
  }
  function isCharLowercase(text, index) {
    return !!(text.charCodeAt(index) & 32);
  }
  var defaultLazyChunkTypes, allLazyChunkTypes;
  var init_decoder = __esm({
    "src/png-codec/decode/decoder.ts"() {
      init_array();
      init_assert();
      init_chunk_IDAT();
      init_chunk_IEND();
      init_chunk_IHDR();
      init_crc322();
      init_types();
      defaultLazyChunkTypes = Object.freeze([
        "tRNS" /* tRNS */
      ]);
      allLazyChunkTypes = Object.freeze([
        "bKGD" /* bKGD */,
        "cHRM" /* cHRM */,
        "eXIf" /* eXIf */,
        "gAMA" /* gAMA */,
        "hIST" /* hIST */,
        "iCCP" /* iCCP */,
        "iTXt" /* iTXt */,
        "tIME" /* tIME */,
        "oFFs" /* oFFs */,
        "pCAL" /* pCAL */,
        "pHYs" /* pHYs */,
        "sBIT" /* sBIT */,
        "sCAL" /* sCAL */,
        "sPLT" /* sPLT */,
        "sRGB" /* sRGB */,
        "sTER" /* sTER */,
        "tEXt" /* tEXt */,
        "tRNS" /* tRNS */,
        "zTXt" /* zTXt */
      ]);
    }
  });

  // src/png-codec/encode/byteStream.ts
  var ByteStream;
  var init_byteStream = __esm({
    "src/png-codec/encode/byteStream.ts"() {
      ByteStream = class {
        constructor(length) {
          this.offset = 0;
          this.array = new Uint8Array(length);
          this.view = new DataView(
            this.array.buffer,
            this.array.byteOffset,
            this.array.byteLength
          );
        }
        writeUint8(value) {
          this.view.setUint8(this.offset, value);
          this.offset += 1;
        }
        writeUint16(value) {
          this.view.setUint16(this.offset, value);
          this.offset += 2;
        }
        writeUint32(value) {
          this.view.setUint32(this.offset, value);
          this.offset += 4;
        }
        writeArray(values) {
          this.array.set(values, this.array.byteOffset + this.offset);
          this.offset += values.length;
        }
        assertAtEnd() {
          if (this.offset !== this.array.length) {
            throw new Error("Writing finished before expected length of stream");
          }
        }
      };
    }
  });

  // src/png-codec/encode/write.ts
  function writeChunkType(stream, type) {
    stream.writeUint8(type.charCodeAt(0));
    stream.writeUint8(type.charCodeAt(1));
    stream.writeUint8(type.charCodeAt(2));
    stream.writeUint8(type.charCodeAt(3));
  }
  function writeChunk(type, data) {
    const stream = new ByteStream(
      4 /* Length */ + 4 /* Length */ + data.length + 4 /* CRC */
    );
    stream.writeUint32(data.length);
    if (type.length !== 4) {
      throw new Error(`Cannot encode a chunk type of length ${type.length}`);
    }
    writeChunkType(stream, type);
    stream.writeArray(data);
    stream.writeUint32(
      crc322(
        stream.view,
        4 /* Length */,
        4 /* Type */ + data.length
      )
    );
    stream.assertAtEnd();
    return stream.array;
  }
  function writeChunkDataFn(type, dataLength, writeDataFn) {
    const stream = new ByteStream(
      4 /* Length */ + 4 /* Length */ + dataLength + 4 /* CRC */
    );
    stream.writeUint32(dataLength);
    if (type.length !== 4) {
      throw new Error(`Cannot encode a chunk type of length ${type.length}`);
    }
    writeChunkType(stream, type);
    writeDataFn(stream);
    stream.writeUint32(
      crc322(
        stream.view,
        4 /* Length */,
        4 /* Type */ + dataLength
      )
    );
    stream.assertAtEnd();
    return stream.array;
  }
  var init_write = __esm({
    "src/png-codec/encode/write.ts"() {
      init_byteStream();
      init_crc322();
      init_types();
    }
  });

  // src/png-codec/encode/chunks/IDAT_encode.ts
  function encodeChunk(ctx, image) {
    const dataStreamLength = calculateDataLength(ctx, image);
    const stream = new ByteStream(dataStreamLength);
    writeUncompressedData(ctx, image, stream);
    const compressed = deflate2(stream.array);
    const chunkIDAT = writeChunk("IDAT", compressed);
    return chunkIDAT;
  }
  function calculateDataLength(ctx, image) {
    if (ctx.bitDepth < 8) {
      throw new Error("Only bit depth 8 and 16 is supported currently");
    }
    if (image.data.BYTES_PER_ELEMENT === 2 && ctx.bitDepth === 8) {
      throw new Error("16 to 8 bit conversion isn't supported yet");
    }
    if (ctx.interlaceMethod !== 0 /* None */) {
      throw new Error("Only interlace method 0 is supported currently");
    }
    let channels;
    switch (ctx.colorType) {
      case 0 /* Grayscale */:
        channels = 1;
        break;
      case 2 /* Truecolor */:
        channels = 3;
        break;
      case 3 /* Indexed */:
        channels = 1;
        break;
      case 4 /* GrayscaleAndAlpha */:
        channels = 2;
        break;
      case 6 /* TruecolorAndAlpha */:
        channels = 4;
        break;
    }
    const bytesPerChannel = ctx.bitDepth === 16 ? 2 : 1;
    const bytesPerPixel = channels * bytesPerChannel;
    const bytesPerLine = (
      /*Filter type*/
      1 + bytesPerPixel * image.width
    );
    const bytesAllLines = bytesPerLine * image.height;
    return bytesAllLines;
  }
  function writeUncompressedData(ctx, image, stream) {
    let i = 0, x = 0, y = 0;
    if (ctx.colorType === 3 /* Indexed */) {
      if (!ctx.palette) {
        throw new Error("Cannot encode indexed file without palette");
      }
      if (image.data.BYTES_PER_ELEMENT === 2) {
        throw new Error("Cannot encode indexed file from 16-bit image");
      }
      for (; y < image.height; y++) {
        stream.writeUint8(0);
        for (x = 0; x < image.width; x++) {
          stream.writeUint8(
            ctx.palette.get(
              image.data[i] << 24 | image.data[i + 1] << 16 | image.data[i + 2] << 8 | image.data[i + 3]
            )
          );
          i += 4;
        }
      }
      return;
    }
    let filterPattern;
    if (ctx.options.filterPattern) {
      if (ctx.options.filterPattern.length === 0) {
        throw new Error("Filter pattern with 0 entries");
      }
      filterPattern = ctx.options.filterPattern;
    }
    const bpp = 4 * image.data.BYTES_PER_ELEMENT;
    const filterFns = [];
    for (const filterType of [0, 1, 2, 3, 4]) {
      filterFns[filterType] = buildFilterFunction(
        bpp,
        bpp * image.width,
        filterType
      );
    }
    const channelsToWrite = getChannelsToWrite(ctx.colorType);
    for (; y < image.height; y++) {
      const filterType = filterPattern ? filterPattern[y % filterPattern.length] : pickFilterType(ctx.colorType, image, y * image.width * 4, filterFns);
      const dataUint8 = new Uint8Array(
        image.data.buffer,
        image.data.byteOffset,
        image.data.byteLength
      );
      stream.writeUint8(filterType);
      let byte = 0, c = 0;
      for (x = 0; x < image.width; x++) {
        for (c of channelsToWrite) {
          for (byte = image.data.BYTES_PER_ELEMENT - 1; byte >= 0; byte--) {
            stream.writeUint8(
              filterFns[filterType](
                dataUint8,
                (i + c) * image.data.BYTES_PER_ELEMENT + byte,
                x === 0
              )
            );
          }
        }
        i += 4;
      }
    }
  }
  function pickFilterType(colorType, image, lineIndex, filterFns) {
    const filterSums = [];
    const bpp = 4 * image.data.BYTES_PER_ELEMENT;
    for (const filterType of [0, 1, 2, 3, 4]) {
      let sum = 0;
      const channelsToWrite = getChannelsToWrite(colorType);
      const dataUint8 = new Uint8Array(
        image.data.buffer,
        image.data.byteOffset,
        image.data.byteLength
      );
      let c = 0, byte = 0;
      for (let i = lineIndex; i < lineIndex + image.width * 4; i += 4) {
        for (c of channelsToWrite) {
          for (byte = image.data.BYTES_PER_ELEMENT - 1; byte >= 0; byte--) {
            sum += filterFns[filterType](
              dataUint8,
              (i + c) * image.data.BYTES_PER_ELEMENT + byte,
              i === lineIndex
            );
          }
        }
      }
      filterSums[filterType] = sum;
    }
    let lowestFilterType = 0 /* None */;
    let lowestSum = filterSums[0 /* None */];
    for (const filterType of [1, 2, 3, 4]) {
      if (filterSums[filterType] < lowestSum) {
        lowestFilterType = filterType;
        lowestSum = filterSums[filterType];
      }
    }
    return lowestFilterType;
  }
  function buildFilterFunction(bpp, bpl, filterType) {
    let ai = 0, bi = 0, ci = 0;
    switch (filterType) {
      case 0 /* None */:
        return (filt, filtX) => filt[filtX];
      case 1 /* Sub */:
        return (filt, filtX, isFirstInLine) => {
          ai = isFirstInLine ? -1 : filtX - bpp;
          return (filt[filtX] - (ai < 0 ? 0 : filt[filtX - bpp]) + 256) % 256;
        };
      case 2 /* Up */:
        return (filt, filtX) => {
          bi = filtX - bpl;
          return (filt[filtX] - (bi < 0 ? 0 : filt[bi]) + 256) % 256;
        };
      case 3 /* Average */:
        return (filt, filtX, isFirstInLine) => {
          ai = isFirstInLine ? -1 : filtX - bpp;
          bi = filtX - bpl;
          return (filt[filtX] - Math.floor(
            ((ai < 0 ? 0 : filt[ai]) + (bi < 0 ? 0 : filt[bi])) / 2
          ) + 256) % 256;
        };
      case 4 /* Paeth */:
        return (filt, filtX, isFirstInLine) => {
          ai = isFirstInLine ? -1 : filtX - bpp;
          bi = filtX - bpl;
          ci = isFirstInLine ? -1 : filtX - bpp - bpl;
          return (filt[filtX] - paethPredicator(
            ai < 0 ? 0 : filt[ai],
            bi < 0 ? 0 : filt[bi],
            ci < 0 ? 0 : filt[ci]
          ) + 256) % 256;
        };
    }
  }
  function getChannelsToWrite(colorType) {
    switch (colorType) {
      case 0 /* Grayscale */:
        return [0];
      case 2 /* Truecolor */:
        return [0, 1, 2];
      case 4 /* GrayscaleAndAlpha */:
        return [0, 3];
      case 6 /* TruecolorAndAlpha */:
        return [0, 1, 2, 3];
    }
  }
  var init_IDAT_encode = __esm({
    "src/png-codec/encode/chunks/IDAT_encode.ts"() {
      init_pako();
      init_byteStream();
      init_paeth();
      init_types();
      init_write();
    }
  });

  // src/png-codec/encode/chunks/IEND_encode.ts
  function encodeChunk2() {
    return writeChunk("IEND", new Uint8Array(0));
  }
  var init_IEND_encode = __esm({
    "src/png-codec/encode/chunks/IEND_encode.ts"() {
      init_write();
    }
  });

  // src/png-codec/encode/chunks/IHDR_encode.ts
  function encodeChunk3(ctx, image) {
    if (image.width <= 0 || image.height <= 0) {
      throw new Error(`Invalid dimensions ${image.width}x${image.height}`);
    }
    return writeChunkDataFn("IHDR", 13 /* DataLength */, (stream) => {
      stream.writeUint32(image.width);
      stream.writeUint32(image.height);
      stream.writeUint8(ctx.bitDepth);
      stream.writeUint8(ctx.colorType);
      stream.writeUint8(0);
      stream.writeUint8(0);
      stream.writeUint8(ctx.interlaceMethod);
    });
  }
  var init_IHDR_encode = __esm({
    "src/png-codec/encode/chunks/IHDR_encode.ts"() {
      init_write();
    }
  });

  // src/png-codec/encode/chunks/tRNS_encode.ts
  var tRNS_encode_exports = {};
  __export(tRNS_encode_exports, {
    encodeChunk: () => encodeChunk4
  });
  function encodeChunk4(ctx, image) {
    switch (ctx.colorType) {
      case 0 /* Grayscale */: {
        if (ctx.firstTransparentColor === void 0) {
          throw new Error(
            "Cannot write tRNS for grayscale without any transparent colors"
          );
        }
        const firstTransparentColor = ctx.firstTransparentColor;
        return writeChunkDataFn("tRNS", 2, (stream) => {
          if (image.data.BYTES_PER_ELEMENT === 2) {
            stream.writeUint16(firstTransparentColor >> 48 & 65535);
          } else {
            stream.writeUint16(firstTransparentColor >> 24 & 255);
          }
        });
      }
      case 3 /* Indexed */: {
        if (!ctx.palette) {
          throw new Error(
            "Cannot encode tRNS chunk for indexed image without palette"
          );
        }
        return writeChunkDataFn("tRNS", ctx.palette.size, (stream) => {
          for (const color of ctx.colorSet) {
            stream.writeUint8(color & 255);
          }
        });
      }
      case 2 /* Truecolor */: {
        if (ctx.firstTransparentColor === void 0) {
          throw new Error(
            "Cannot write tRNS for True color without any transparent colors"
          );
        }
        const firstTransparentColor = ctx.firstTransparentColor;
        return writeChunkDataFn("tRNS", 6, (stream) => {
          if (image.data.BYTES_PER_ELEMENT === 2) {
            stream.writeUint16(firstTransparentColor >> 48 & 65535);
            stream.writeUint16(firstTransparentColor >> 32 & 65535);
            stream.writeUint16(firstTransparentColor >> 16 & 65535);
          } else {
            stream.writeUint16(firstTransparentColor >> 24 & 255);
            stream.writeUint16(firstTransparentColor >> 16 & 255);
            stream.writeUint16(firstTransparentColor >> 8 & 255);
          }
        });
      }
      /* istanbul ignore next - this error should never happen in practice */
      default:
        throw new Error(
          `Cannot encode tRNS chunk for color type "${ctx.colorType}"`
        );
    }
  }
  var init_tRNS_encode = __esm({
    "src/png-codec/encode/chunks/tRNS_encode.ts"() {
      init_types();
      init_write();
    }
  });

  // src/png-codec/encode/chunks/PLTE_encode.ts
  var PLTE_encode_exports = {};
  __export(PLTE_encode_exports, {
    encodeChunk: () => encodeChunk5
  });
  function encodeChunk5(ctx, image) {
    if (ctx.bitDepth === 16 || image.data.BYTES_PER_ELEMENT === 2) {
      throw new Error("Cannot encode 16 bit images using indexed color type");
    }
    if (ctx.colorSet.size > Math.pow(2, ctx.bitDepth)) {
      throw new Error(
        `Too many colors ${ctx.colorSet.size} to encode into indexed image (2^${ctx.bitDepth} = ${Math.pow(2, ctx.bitDepth)})`
      );
    }
    const chunkData = writeChunkDataFn(
      "PLTE",
      ctx.colorSet.size * 3,
      (stream) => {
        for (const color of ctx.colorSet.values()) {
          stream.writeUint8(color >> 24 & 255);
          stream.writeUint8(color >> 16 & 255);
          stream.writeUint8(color >> 8 & 255);
        }
      }
    );
    const palette = /* @__PURE__ */ new Map();
    for (const color of ctx.colorSet.values()) {
      palette.set(color, palette.size);
    }
    return {
      chunkData,
      palette
    };
  }
  var init_PLTE_encode = __esm({
    "src/png-codec/encode/chunks/PLTE_encode.ts"() {
      init_write();
    }
  });

  // src/png-codec/encode/chunks/tEXt_encode.ts
  var tEXt_encode_exports = {};
  __export(tEXt_encode_exports, {
    encodeChunk: () => encodeChunk6
  });
  function encodeChunk6(ctx, image, keyword, value) {
    if (keyword.length === 0 || keyword.length > 79) {
      throw new EncodeError(
        `tEXt: Invalid keyword length: 0 < ${keyword.length} < 80`,
        0
      );
    }
    value = value instanceof Uint8Array ? value : new TextEncoder().encode(value);
    const dataLength = keyword.length + 1 + value.length;
    return writeChunkDataFn("tEXt", dataLength, (stream) => {
      let i = 0;
      for (; i < keyword.length; i++) {
        stream.writeUint8(keyword.charCodeAt(i));
      }
      stream.writeUint8(0);
      for (i = 0; i < value.length; i++) {
        stream.writeUint8(value[i]);
      }
    });
  }
  var init_tEXt_encode = __esm({
    "src/png-codec/encode/chunks/tEXt_encode.ts"() {
      init_assert2();
      init_write();
    }
  });

  // src/png-codec/encode/chunks/zTXt_encode.ts
  var zTXt_encode_exports = {};
  __export(zTXt_encode_exports, {
    encodeChunk: () => encodeChunk7
  });
  function encodeChunk7(ctx, image, keyword, value) {
    if (keyword.length === 0 || keyword.length > 79) {
      throw new EncodeError(
        `zTXt: Invalid keyword length: 0 < ${keyword.length} < 80`,
        0
      );
    }
    value = deflate2(value);
    const dataLength = keyword.length + 1 + 1 + value.byteLength;
    return writeChunkDataFn("zTXt", dataLength, (stream) => {
      let i = 0;
      for (; i < keyword.length; i++) {
        stream.writeUint8(keyword.charCodeAt(i));
      }
      stream.writeUint8(0);
      stream.writeUint8(0);
      for (i = 0; i < value.byteLength; i++) {
        stream.writeUint8(value[i]);
      }
    });
  }
  var init_zTXt_encode = __esm({
    "src/png-codec/encode/chunks/zTXt_encode.ts"() {
      init_pako();
      init_assert2();
      init_write();
    }
  });

  // src/png-codec/encode/encoder.ts
  var encoder_exports = {};
  __export(encoder_exports, {
    EncodeError: () => EncodeError,
    EncodeWarning: () => EncodeWarning,
    encodePng: () => encodePng
  });
  function getChunkDecoder2(type) {
    switch (type) {
      case "tRNS" /* tRNS */:
        return Promise.resolve().then(() => (init_tRNS_encode(), tRNS_encode_exports));
      /* istanbul ignore next - this error should never happen in practice */
      default:
        throw new Error(`Could not get encoder for chunk type "${type}"`);
    }
  }
  async function encodePng(image, options = {}) {
    if (image.data.length !== image.width * image.height * 4) {
      throw new EncodeError(
        `Provided image data length (${image.data.length}) is not expected length (${image.width * image.height * 4})`,
        Math.min(image.data.length, image.width * image.height * 4) - 1
      );
    }
    const sections = [];
    sections.push(writePngSignature());
    const ctx = analyze(image, options);
    sections.push(encodeChunk3(ctx, image));
    if (ctx.colorType === 3 /* Indexed */) {
      const result2 = (await Promise.resolve().then(() => (init_PLTE_encode(), PLTE_encode_exports))).encodeChunk(
        ctx,
        image
      );
      ctx.palette = result2.palette;
      sections.push(result2.chunkData);
    }
    if (ctx.useTransparencyChunk) {
      sections.push(
        (await getChunkDecoder2("tRNS" /* tRNS */)).encodeChunk(ctx, image)
      );
    }
    sections.push(encodeChunk(ctx, image));
    if (options?.ancillaryChunks === void 0) {
    } else {
      for (const chunk of options.ancillaryChunks) {
        switch (chunk.type) {
          case "tEXt" /* tEXt */:
            sections.push(
              (await Promise.resolve().then(() => (init_tEXt_encode(), tEXt_encode_exports))).encodeChunk(
                ctx,
                image,
                chunk.keyword,
                chunk.text
              )
            );
            break;
          case "zTXt" /* zTXt */:
            sections.push(
              (await Promise.resolve().then(() => (init_zTXt_encode(), zTXt_encode_exports))).encodeChunk(
                ctx,
                image,
                chunk.keyword,
                chunk.text
              )
            );
            break;
          default:
            throw new Error(`Cannot encode chunk type "${chunk.type}"`);
        }
      }
    }
    sections.push(encodeChunk2());
    const totalLength = sections.reduce((p, c) => p + c.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const s of sections) {
      result.set(s, offset);
      offset += s.length;
    }
    return {
      data: result,
      warnings: ctx.warnings,
      info: ctx.info
    };
  }
  function writePngSignature() {
    const stream = new ByteStream(8);
    stream.writeUint8(137);
    stream.writeUint8(80);
    stream.writeUint8(78);
    stream.writeUint8(71);
    stream.writeUint8(13);
    stream.writeUint8(10);
    stream.writeUint8(26);
    stream.writeUint8(10);
    stream.assertAtEnd();
    return stream.array;
  }
  function analyze(image, options = {}) {
    const warnings = [];
    const info = [];
    const pixelCount = image.width * image.height;
    const indexCount = pixelCount * 4;
    const colorSet = /* @__PURE__ */ new Set();
    const transparentColorSet = /* @__PURE__ */ new Set();
    let rgbaId = 0;
    if (image.data.BYTES_PER_ELEMENT === 2) {
      for (let i = 0; i < indexCount; i += 4) {
        rgbaId = image.data[i] << 48 | image.data[i + 1] << 32 | image.data[i + 2] << 16 | image.data[i + 3];
        if (image.data[i + 3] < 65535) {
          transparentColorSet.add(rgbaId);
        }
        colorSet.add(rgbaId);
      }
    } else {
      for (let i = 0; i < indexCount; i += 4) {
        rgbaId = image.data[i] << 24 | image.data[i + 1] << 16 | image.data[i + 2] << 8 | image.data[i + 3];
        if (image.data[i + 3] < 255) {
          transparentColorSet.add(rgbaId);
        }
        colorSet.add(rgbaId);
      }
    }
    let colorType = options.colorType;
    if (colorType === void 0) {
      if (colorSet.size > 256 || image.data.BYTES_PER_ELEMENT === 2) {
        colorType = 2 /* Truecolor */;
      } else {
        colorType = 3 /* Indexed */;
      }
    }
    let useTransparencyChunk;
    switch (colorType) {
      case 0 /* Grayscale */:
      case 2 /* Truecolor */:
        useTransparencyChunk = transparentColorSet.size === 1;
        if (!useTransparencyChunk && transparentColorSet.size > 1) {
          colorType = colorType === 2 /* Truecolor */ ? 6 /* TruecolorAndAlpha */ : 4 /* GrayscaleAndAlpha */;
          if (options.colorType === 2 /* Truecolor */) {
            handleWarning2(
              { options, warnings },
              new EncodeWarning(
                `Cannot encode image as color type Truecolor as it contains ${transparentColorSet.size} transparent colors`,
                0
              )
            );
          }
        }
        break;
      case 3 /* Indexed */:
        useTransparencyChunk = transparentColorSet.size > 0;
        break;
      default:
        useTransparencyChunk = false;
    }
    if (options.colorType === void 0) {
      info.push(`Using color type ${colorType}`);
    }
    return {
      colorType,
      bitDepth: image.data.BYTES_PER_ELEMENT === 2 ? 16 : 8,
      interlaceMethod: 0 /* None */,
      colorSet,
      transparentColorCount: transparentColorSet.size,
      firstTransparentColor: transparentColorSet.size > 0 ? transparentColorSet.values().next().value : void 0,
      useTransparencyChunk,
      options,
      warnings,
      info
    };
  }
  var init_encoder = __esm({
    "src/png-codec/encode/encoder.ts"() {
      init_byteStream();
      init_IDAT_encode();
      init_IEND_encode();
      init_IHDR_encode();
      init_assert2();
      init_types();
    }
  });

  // src/index.ts
  var index_exports = {};
  __export(index_exports, {
    arrayBufferToValue: () => arrayBufferToValue,
    compress: () => compress,
    compressJson: () => compressJson,
    createDataBlock: () => createDataBlock,
    decode: () => decode,
    decodeBinary: () => decodeBinary,
    decodeImageData: () => decodeImageData,
    decodeImageDataBinary: () => decodeImageDataBinary,
    decodeImageDataBlocks: () => decodeImageDataBlocks,
    decodeImageMetadata: () => decodeImageMetadata,
    decompress: () => decompress2,
    decompressAsArrayBuffer: () => decompressAsArrayBuffer,
    decompressAsString: () => decompressAsString,
    defaultCompressionFormat: () => defaultCompressionFormat,
    encode: () => encode,
    encodeBinary: () => encodeBinary,
    encodeImageData: () => encodeImageData,
    encodeImageDataBlocks: () => encodeImageDataBlocks,
    encodeToBlob: () => encodeToBlob,
    encodeToImage: () => encodeToImage,
    getDataBlock: () => getDataBlock,
    getDataBlocks: () => getDataBlocks,
    valueToArrayBuffer: () => valueToArrayBuffer
  });

  // src/png-codec/index.ts
  var png_codec_exports = {};
  __export(png_codec_exports, {
    ChunkPartByteLength: () => ChunkPartByteLength,
    ColorType: () => ColorType,
    DecodeError: () => DecodeError,
    DecodeWarning: () => DecodeWarning,
    EncodeError: () => EncodeError,
    EncodeWarning: () => EncodeWarning,
    FilterMethod: () => FilterMethod,
    FilterType: () => FilterType,
    InterlaceMethod: () => InterlaceMethod,
    KnownChunkTypes: () => KnownChunkTypes,
    RenderingIntent: () => RenderingIntent,
    decodePng: () => decodePng2,
    encodePng: () => encodePng2
  });

  // src/png-codec/public.ts
  init_assert();
  init_assert2();
  async function decodePng2(data, options) {
    return (await Promise.resolve().then(() => (init_decoder(), decoder_exports))).decodePng(data, options);
  }
  async function encodePng2(data, options) {
    return (await Promise.resolve().then(() => (init_encoder(), encoder_exports))).encodePng(data, options);
  }

  // src/png-codec/index.ts
  init_api();
  init_types();

  // src/image.ts
  function createImageBlob(buffer) {
    return new Blob([buffer], {
      type: "image/png"
    });
  }
  async function blobToImageElement(blob, image = document.createElement("img")) {
    return new Promise((resolve, reject) => {
      const listener = () => {
        URL.revokeObjectURL(image.src);
        image.removeEventListener("load", listener);
        image.removeEventListener("error", reject);
        resolve(image);
      };
      image.addEventListener("load", listener);
      image.addEventListener("error", reject);
      image.src = URL.createObjectURL(blob);
    });
  }
  function encodeDataIntoImage(data, img) {
    const size = data.length;
    for (let i = 0; i < 3; i++) {
      img[i] = size / Math.pow(256, i) % 256 | 0;
    }
    img[3] = 255;
    for (let i = 4, j = 0, l = img.length; i < l; i += 4, j += 3) {
      img[i] = data[j] || 0;
      img[i + 1] = data[j + 1] || 0;
      img[i + 2] = data[j + 2] || 0;
      img[i + 3] = 255;
    }
    return img;
  }
  function decodeDataFromImage(img) {
    let size = 0;
    for (let i = 0; i < 3; i++) {
      const val = img[i] * Math.pow(256, i);
      size += val;
    }
    const data = new Uint8Array(size);
    root: for (let i = 4, j = 0, l = img.length; j < l; i += 4, j += 3) {
      for (let k = 0; k < 3; k++) {
        if (j + k >= size) break root;
        data[j + k] = img[i + k];
      }
    }
    return data.buffer;
  }

  // src/png.ts
  async function encodeBinaryToPng(buffer) {
    const data = new Uint8Array(buffer);
    const size = Math.ceil(Math.sqrt(data.length / 3 + 1));
    const target = new Uint8ClampedArray(size * size * 4);
    encodeDataIntoImage(data, target);
    const arr = await encodePng2({
      width: size,
      height: size,
      data: new Uint8Array(target.buffer)
    });
    return arr.data.buffer;
  }
  async function decodeBinaryFromPng(buffer) {
    const { image } = await decodePng2(
      new Uint8Array(buffer instanceof ArrayBuffer ? buffer : buffer.buffer)
    );
    return decodeDataFromImage(new Uint8ClampedArray(image.data.buffer));
  }

  // src/json-array-buffer.ts
  function valueToArrayBuffer(value) {
    return new TextEncoder().encode(JSON.stringify(value)).buffer;
  }
  function arrayBufferToValue(buffer) {
    return JSON.parse(new TextDecoder().decode(buffer));
  }

  // src/compress.ts
  var { CompressionStream, DecompressionStream, Response } = globalThis;
  var defaultCompressionFormat = "gzip";
  async function compress(buffer, compressionFormat = defaultCompressionFormat) {
    const compressor = new CompressionStream(compressionFormat);
    const stream = new Response(buffer).body?.pipeThrough(compressor);
    return await new Response(stream).arrayBuffer();
  }
  async function compressJson(value, compressionFormat = defaultCompressionFormat) {
    return await compress(valueToArrayBuffer(value), compressionFormat);
  }
  async function decompressAsResponse(buffer, compressionFormat = defaultCompressionFormat) {
    const decompressor = new DecompressionStream(compressionFormat);
    const stream = new Response(buffer).body?.pipeThrough(decompressor);
    return new Response(stream);
  }
  async function decompressAsArrayBuffer(buffer, compressionFormat = defaultCompressionFormat) {
    return (await decompressAsResponse(buffer, compressionFormat)).arrayBuffer();
  }
  async function decompressAsString(buffer, compressionFormat = defaultCompressionFormat) {
    return (await decompressAsResponse(buffer, compressionFormat)).text();
  }
  var decompress2 = decompressAsArrayBuffer;

  // src/encode.ts
  async function encodeImageData(value) {
    return await encodeBinaryToPng(
      await compress(
        value instanceof ArrayBuffer || value instanceof Uint8Array ? value : valueToArrayBuffer(value)
      )
    );
  }
  async function encode(value) {
    return await encodeImageData(value);
  }
  async function encodeBinary(value) {
    return await encodeImageData(value);
  }
  async function encodeToBlob(value) {
    return createImageBlob(await encodeImageData(value));
  }
  async function encodeToImage(value, image) {
    return blobToImageElement(
      createImageBlob(await encodeImageData(value)),
      image
    );
  }

  // src/string-uint8-array.ts
  function stringToUint8Array(str) {
    const ret = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
      ret[i] = str.charCodeAt(i);
    }
    return ret;
  }

  // src/data-blocks.ts
  var { KnownChunkTypes: KnownChunkTypes4 } = png_codec_exports;
  function createDataBlock(name, value) {
    if (value instanceof ArrayBuffer) value = new Uint8Array(value);
    if (value instanceof Uint8Array) {
      return {
        type: "bin",
        name,
        value
      };
    }
    if (typeof value === "string") {
      return {
        type: "text",
        name,
        value
      };
    }
    return {
      type: "json",
      name,
      value
    };
  }
  async function decodeImageDataBlocks(buffer, chunkTypes = []) {
    const {
      image,
      metadata,
      details,
      palette
      // warnings,
      // info,
    } = await decodePng2(
      !(buffer instanceof Uint8Array) ? new Uint8Array(buffer) : buffer,
      {
        parseChunkTypes: chunkTypes === "*" ? chunkTypes : [...chunkTypes, KnownChunkTypes4.tEXt, KnownChunkTypes4.zTXt]
      }
    );
    const blocks = [];
    for (const {
      type,
      keyword = "",
      text: value
    } of metadata) {
      const [prefix, name] = keyword.split("/");
      switch (type) {
        case KnownChunkTypes4.tEXt:
          switch (prefix) {
            case "text":
              blocks.push({
                type: prefix,
                name,
                value
              });
              break;
          }
          break;
        case KnownChunkTypes4.zTXt:
          switch (prefix) {
            case "json":
              blocks.push({
                type: prefix,
                name,
                value: JSON.parse(String(value))
              });
              break;
            case "bin":
              blocks.push({
                type: prefix,
                name,
                value: stringToUint8Array(value)
              });
              break;
          }
          break;
      }
    }
    return {
      image,
      blocks,
      chunks: metadata,
      details,
      palette
    };
  }
  async function encodeImageDataBlocks(image, blockDefinition) {
    const imageData = image instanceof ArrayBuffer || image instanceof Uint8Array ? (await decodePng2(image)).image : image;
    const blocks = [];
    const chunks = [];
    for (const [key, value] of Object.entries(blockDefinition)) {
      if (Array.isArray(value)) {
        for (const subValue of value) {
          blocks.push(createDataBlock(key, subValue));
        }
      } else {
        blocks.push(createDataBlock(key, value));
      }
    }
    for (const { type, name, value } of blocks) {
      switch (type) {
        case "text":
          chunks.push({
            type: KnownChunkTypes4.tEXt,
            keyword: `${type}/${name}`,
            text: value
          });
          break;
        case "json":
          chunks.push({
            type: KnownChunkTypes4.zTXt,
            keyword: `${type}/${name}`,
            text: JSON.stringify(value)
          });
          break;
        case "bin":
          chunks.push({
            type: KnownChunkTypes4.zTXt,
            keyword: `${type}/${name}`,
            // Array buffer to string - inlined here for performance
            text: String.fromCharCode.apply(null, new Uint16Array(value))
          });
          break;
        default:
          break;
      }
    }
    return (await encodePng2(imageData, {
      ancillaryChunks: chunks
    })).data;
  }
  function getDataBlock(name, blocks) {
    for (const b of blocks) {
      if (b.name === name) return b.value;
    }
  }
  function getDataBlocks(name, blocks) {
    return blocks.filter((b) => b.name === name).map((b) => b.value);
  }

  // src/decode.ts
  async function decodeImageData(buffer) {
    return arrayBufferToValue(await decodeImageDataBinary(buffer));
  }
  async function decodeImageDataBinary(buffer) {
    return await decompressAsArrayBuffer(await decodeBinaryFromPng(buffer));
  }
  async function decodeImageMetadata(buffer) {
    return await decodeImageDataBlocks(buffer);
  }
  async function decode(buffer) {
    return await decodeImageData(buffer);
  }
  async function decodeBinary(buffer) {
    return await decodeImageDataBinary(buffer);
  }

  // src/png-compressor.ts
  window.PNGCompressor = index_exports;
})();
/**
 * @license
 * Copyright (c) 2022 Daniel Imms <http://www.growingwiththeweb.com>
 * Released under MIT license. See LICENSE in the project root for details.
 */
//# sourceMappingURL=png-compressor.js.map
