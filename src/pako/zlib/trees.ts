// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

/* eslint-disable space-unary-ops */

/* Public constants ==========================================================*/
/* ===========================================================================*/

//const Z_FILTERED          = 1;
//const Z_HUFFMAN_ONLY      = 2;
//const Z_RLE               = 3;
const Z_FIXED = 4
//const Z_DEFAULT_STRATEGY  = 0;

/* Possible values of the data_type field (though see inflate()) */
const Z_BINARY = 0
const Z_TEXT = 1
//const Z_ASCII             = 1; // = Z_TEXT
const Z_UNKNOWN = 2

/*============================================================================*/

function zero(buf) {
  let len = buf.length
  while (--len >= 0) {
    buf[len] = 0
  }
}

// From zutil.h

const STORED_BLOCK = 0
const STATIC_TREES = 1
const DYN_TREES = 2
/* The three kinds of block type */

const MIN_MATCH = 3
const MAX_MATCH = 258
/* The minimum and maximum match lengths */

// From deflate.h
/* ===========================================================================
 * Internal compression state.
 */

const LENGTH_CODES = 29
/* number of length codes, not counting the special END_BLOCK code */

const LITERALS = 256
/* number of literal bytes 0..255 */

const L_CODES = LITERALS + 1 + LENGTH_CODES
/* number of Literal or Length codes, including the END_BLOCK code */

const D_CODES = 30
/* number of distance codes */

const BL_CODES = 19
/* number of codes used to transfer the bit lengths */

const HEAP_SIZE = 2 * L_CODES + 1
/* maximum heap size */

const MAX_BITS = 15
/* All codes must not exceed MAX_BITS bits */

const Buf_size = 16
/* size of bit buffer in bi_buf */

/* ===========================================================================
 * Constants
 */

const MAX_BL_BITS = 7
/* Bit length codes must not exceed MAX_BL_BITS bits */

const END_BLOCK = 256
/* end of block literal code */

const REP_3_6 = 16
/* repeat previous bit length 3-6 times (2 bits of repeat count) */

const REPZ_3_10 = 17
/* repeat a zero length 3-10 times  (3 bits of repeat count) */

const REPZ_11_138 = 18
/* repeat a zero length 11-138 times  (7 bits of repeat count) */

/* eslint-disable comma-spacing,array-bracket-spacing */
const extra_lbits =
  /* extra bits for each length code */
  new Uint8Array([
    0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5,
    5, 5, 5, 0,
  ])

const extra_dbits =
  /* extra bits for each distance code */
  new Uint8Array([
    0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10,
    11, 11, 12, 12, 13, 13,
  ])

const extra_blbits =
  /* extra bits for each bit length code */
  new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7])

const bl_order = new Uint8Array([
  16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15,
])
/* eslint-enable comma-spacing,array-bracket-spacing */

/* The lengths of the bit length codes are sent in order of decreasing
 * probability, to avoid transmitting the lengths for unused bit length codes.
 */

/* ===========================================================================
 * Local data. These are initialized only once.
 */

// We pre-fill arrays with 0 to avoid uninitialized gaps

const DIST_CODE_LEN = 512 /* see definition of array dist_code below */

// !!!! Use flat array instead of structure, Freq = i*2, Len = i*2+1
const static_ltree = new Array((L_CODES + 2) * 2)
zero(static_ltree)
/* The static literal tree. Since the bit lengths are imposed, there is no
 * need for the L_CODES extra codes used during heap construction. However
 * The codes 286 and 287 are needed to build a canonical tree (see _tr_init
 * below).
 */

const static_dtree = new Array(D_CODES * 2)
zero(static_dtree)
/* The static distance tree. (Actually a trivial tree since all codes use
 * 5 bits.)
 */

const _dist_code = new Array(DIST_CODE_LEN)
zero(_dist_code)
/* Distance codes. The first 256 values correspond to the distances
 * 3 .. 258, the last 256 values correspond to the top 8 bits of
 * the 15 bit distances.
 */

const _length_code = new Array(MAX_MATCH - MIN_MATCH + 1)
zero(_length_code)
/* length code for each normalized match length (0 == MIN_MATCH) */

const base_length = new Array(LENGTH_CODES)
zero(base_length)
/* First normalized length for each code (0 = MIN_MATCH) */

const base_dist = new Array(D_CODES)
zero(base_dist)
/* First normalized distance for each code (0 = distance of 1) */

function StaticTreeDesc(
  static_tree,
  extra_bits,
  extra_base,
  elems,
  max_length,
) {
  this.static_tree = static_tree /* static tree or NULL */
  this.extra_bits = extra_bits /* extra bits for each code or NULL */
  this.extra_base = extra_base /* base index for extra_bits */
  this.elems = elems /* max number of elements in the tree */
  this.max_length = max_length /* max bit length for the codes */

  // show if `static_tree` has data or dummy - needed for monomorphic objects
  this.has_stree = static_tree && static_tree.length
}

let static_l_desc
let static_d_desc
let static_bl_desc

function TreeDesc(dyn_tree, stat_desc) {
  this.dyn_tree = dyn_tree /* the dynamic tree */
  this.max_code = 0 /* largest code with non zero frequency */
  this.stat_desc = stat_desc /* the corresponding static tree */
}

const d_code = (dist) => {
  return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)]
}

/* ===========================================================================
 * Output a short LSB first on the stream.
 * IN assertion: there is enough room in pendingBuf.
 */
const put_short = (s, w) => {
  //    put_byte(s, (uch)((w) & 0xff));
  //    put_byte(s, (uch)((ush)(w) >> 8));
  s.pending_buf[s.pending++] = w & 0xff
  s.pending_buf[s.pending++] = (w >>> 8) & 0xff
}

/* ===========================================================================
 * Send a value on a given number of bits.
 * IN assertion: length <= 16 and value fits in length bits.
 */
const send_bits = (s, value, length) => {
  if (s.bi_valid > Buf_size - length) {
    s.bi_buf |= (value << s.bi_valid) & 0xffff
    put_short(s, s.bi_buf)
    s.bi_buf = value >> (Buf_size - s.bi_valid)
    s.bi_valid += length - Buf_size
  } else {
    s.bi_buf |= (value << s.bi_valid) & 0xffff
    s.bi_valid += length
  }
}

const send_code = (s, c, tree) => {
  send_bits(s, tree[c * 2] /*.Code*/, tree[c * 2 + 1] /*.Len*/)
}

/* ===========================================================================
 * Reverse the first len bits of a code, using straightforward code (a faster
 * method would use a table)
 * IN assertion: 1 <= len <= 15
 */
const bi_reverse = (code, len) => {
  let res = 0
  do {
    res |= code & 1
    code >>>= 1
    res <<= 1
  } while (--len > 0)
  return res >>> 1
}

/* ===========================================================================
 * Flush the bit buffer, keeping at most 7 bits in it.
 */
const bi_flush = (s) => {
  if (s.bi_valid === 16) {
    put_short(s, s.bi_buf)
    s.bi_buf = 0
    s.bi_valid = 0
  } else if (s.bi_valid >= 8) {
    s.pending_buf[s.pending++] = s.bi_buf & 0xff
    s.bi_buf >>= 8
    s.bi_valid -= 8
  }
}

/* ===========================================================================
 * Compute the optimal bit lengths for a tree and update the total bit length
 * for the current block.
 * IN assertion: the fields freq and dad are set, heap[heap_max] and
 *    above are the tree nodes sorted by increasing frequency.
 * OUT assertions: the field len is set to the optimal bit length, the
 *     array bl_count contains the frequencies for each bit length.
 *     The length opt_len is updated; static_len is also updated if stree is
 *     not null.
 */
const gen_bitlen = (s, desc) => {
  //    deflate_state *s;
  //    tree_desc *desc;    /* the tree descriptor */

  const tree = desc.dyn_tree
  const max_code = desc.max_code
  const stree = desc.stat_desc.static_tree
  const has_stree = desc.stat_desc.has_stree
  const extra = desc.stat_desc.extra_bits
  const base = desc.stat_desc.extra_base
  const max_length = desc.stat_desc.max_length
  let h /* heap index */
  let n, m /* iterate over the tree elements */
  let bits /* bit length */
  let xbits /* extra bits */
  let f /* frequency */
  let overflow = 0 /* number of elements with bit length too large */

  for (bits = 0; bits <= MAX_BITS; bits++) {
    s.bl_count[bits] = 0
  }

  /* In a first pass, compute the optimal bit lengths (which may
   * overflow in the case of the bit length tree).
   */
  tree[s.heap[s.heap_max] * 2 + 1] /*.Len*/ = 0 /* root of the heap */

  for (h = s.heap_max + 1; h < HEAP_SIZE; h++) {
    n = s.heap[h]
    bits = tree[tree[n * 2 + 1] /*.Dad*/ * 2 + 1] /*.Len*/ + 1
    if (bits > max_length) {
      bits = max_length
      overflow++
    }
    tree[n * 2 + 1] /*.Len*/ = bits
    /* We overwrite tree[n].Dad which is no longer needed */

    if (n > max_code) {
      continue
    } /* not a leaf node */

    s.bl_count[bits]++
    xbits = 0
    if (n >= base) {
      xbits = extra[n - base]
    }
    f = tree[n * 2] /*.Freq*/
    s.opt_len += f * (bits + xbits)
    if (has_stree) {
      s.static_len += f * (stree[n * 2 + 1] /*.Len*/ + xbits)
    }
  }
  if (overflow === 0) {
    return
  }

  // Tracev((stderr,"\nbit length overflow\n"));
  /* This happens for example on obj2 and pic of the Calgary corpus */

  /* Find the first bit length which could increase: */
  do {
    bits = max_length - 1
    while (s.bl_count[bits] === 0) {
      bits--
    }
    s.bl_count[bits]-- /* move one leaf down the tree */
    s.bl_count[bits + 1] += 2 /* move one overflow item as its brother */
    s.bl_count[max_length]--
    /* The brother of the overflow item also moves one step up,
     * but this does not affect bl_count[max_length]
     */
    overflow -= 2
  } while (overflow > 0)

  /* Now recompute all bit lengths, scanning in increasing frequency.
   * h is still equal to HEAP_SIZE. (It is simpler to reconstruct all
   * lengths instead of fixing only the wrong ones. This idea is taken
   * from 'ar' written by Haruhiko Okumura.)
   */
  for (bits = max_length; bits !== 0; bits--) {
    n = s.bl_count[bits]
    while (n !== 0) {
      m = s.heap[--h]
      if (m > max_code) {
        continue
      }
      if (tree[m * 2 + 1] /*.Len*/ !== bits) {
        // Tracev((stderr,"code %d bits %d->%d\n", m, tree[m].Len, bits));
        s.opt_len += (bits - tree[m * 2 + 1]) /*.Len*/ * tree[m * 2] /*.Freq*/
        tree[m * 2 + 1] /*.Len*/ = bits
      }
      n--
    }
  }
}

/* ===========================================================================
 * Generate the codes for a given tree and bit counts (which need not be
 * optimal).
 * IN assertion: the array bl_count contains the bit length statistics for
 * the given tree and the field len is set for all tree elements.
 * OUT assertion: the field code is set for all tree elements of non
 *     zero code length.
 */
const gen_codes = (tree, max_code, bl_count) => {
  //    ct_data *tree;             /* the tree to decorate */
  //    int max_code;              /* largest code with non zero frequency */
  //    ushf *bl_count;            /* number of codes at each bit length */

  const next_code = new Array(
    MAX_BITS + 1,
  ) /* next code value for each bit length */
  let code = 0 /* running code value */
  let bits /* bit index */
  let n /* code index */

  /* The distribution counts are first used to generate the code values
   * without bit reversal.
   */
  for (bits = 1; bits <= MAX_BITS; bits++) {
    code = (code + bl_count[bits - 1]) << 1
    next_code[bits] = code
  }
  /* Check that the bit counts in bl_count are consistent. The last code
   * must be all ones.
   */
  //Assert (code + bl_count[MAX_BITS]-1 == (1<<MAX_BITS)-1,
  //        "inconsistent bit counts");
  //Tracev((stderr,"\ngen_codes: max_code %d ", max_code));

  for (n = 0; n <= max_code; n++) {
    let len = tree[n * 2 + 1] /*.Len*/
    if (len === 0) {
      continue
    }
    /* Now reverse the bits */
    tree[n * 2] /*.Code*/ = bi_reverse(next_code[len]++, len)

    //Tracecv(tree != static_ltree, (stderr,"\nn %3d %c l %2d c %4x (%x) ",
    //     n, (isgraph(n) ? n : ' '), len, tree[n].Code, next_code[len]-1));
  }
}

/* ===========================================================================
 * Initialize the various 'constant' tables.
 */
const tr_static_init = () => {
  let n /* iterates over tree elements */
  let bits /* bit counter */
  let length /* length value */
  let code /* code value */
  let dist /* distance index */
  const bl_count = new Array(MAX_BITS + 1)
  /* number of codes at each bit length for an optimal tree */

  // do check in _tr_init()
  //if (static_init_done) return;

  /* For some embedded targets, global variables are not initialized: */
  /*#ifdef NO_INIT_GLOBAL_POINTERS
  static_l_desc.static_tree = static_ltree;
  static_l_desc.extra_bits = extra_lbits;
  static_d_desc.static_tree = static_dtree;
  static_d_desc.extra_bits = extra_dbits;
  static_bl_desc.extra_bits = extra_blbits;
#endif*/

  /* Initialize the mapping length (0..255) -> length code (0..28) */
  length = 0
  for (code = 0; code < LENGTH_CODES - 1; code++) {
    base_length[code] = length
    for (n = 0; n < 1 << extra_lbits[code]; n++) {
      _length_code[length++] = code
    }
  }
  //Assert (length == 256, "tr_static_init: length != 256");
  /* Note that the length 255 (match length 258) can be represented
   * in two different ways: code 284 + 5 bits or code 285, so we
   * overwrite length_code[255] to use the best encoding:
   */
  _length_code[length - 1] = code

  /* Initialize the mapping dist (0..32K) -> dist code (0..29) */
  dist = 0
  for (code = 0; code < 16; code++) {
    base_dist[code] = dist
    for (n = 0; n < 1 << extra_dbits[code]; n++) {
      _dist_code[dist++] = code
    }
  }
  //Assert (dist == 256, "tr_static_init: dist != 256");
  dist >>= 7 /* from now on, all distances are divided by 128 */
  for (; code < D_CODES; code++) {
    base_dist[code] = dist << 7
    for (n = 0; n < 1 << (extra_dbits[code] - 7); n++) {
      _dist_code[256 + dist++] = code
    }
  }
  //Assert (dist == 256, "tr_static_init: 256+dist != 512");

  /* Construct the codes of the static literal tree */
  for (bits = 0; bits <= MAX_BITS; bits++) {
    bl_count[bits] = 0
  }

  n = 0
  while (n <= 143) {
    static_ltree[n * 2 + 1] /*.Len*/ = 8
    n++
    bl_count[8]++
  }
  while (n <= 255) {
    static_ltree[n * 2 + 1] /*.Len*/ = 9
    n++
    bl_count[9]++
  }
  while (n <= 279) {
    static_ltree[n * 2 + 1] /*.Len*/ = 7
    n++
    bl_count[7]++
  }
  while (n <= 287) {
    static_ltree[n * 2 + 1] /*.Len*/ = 8
    n++
    bl_count[8]++
  }
  /* Codes 286 and 287 do not exist, but we must include them in the
   * tree construction to get a canonical Huffman tree (longest code
   * all ones)
   */
  gen_codes(static_ltree, L_CODES + 1, bl_count)

  /* The static distance tree is trivial: */
  for (n = 0; n < D_CODES; n++) {
    static_dtree[n * 2 + 1] /*.Len*/ = 5
    static_dtree[n * 2] /*.Code*/ = bi_reverse(n, 5)
  }

  // Now data ready and we can init static trees
  static_l_desc = new StaticTreeDesc(
    static_ltree,
    extra_lbits,
    LITERALS + 1,
    L_CODES,
    MAX_BITS,
  )
  static_d_desc = new StaticTreeDesc(
    static_dtree,
    extra_dbits,
    0,
    D_CODES,
    MAX_BITS,
  )
  static_bl_desc = new StaticTreeDesc(
    new Array(0),
    extra_blbits,
    0,
    BL_CODES,
    MAX_BL_BITS,
  )

  //static_init_done = true;
}

/* ===========================================================================
 * Initialize a new block.
 */
const init_block = (s) => {
  let n /* iterates over tree elements */

  /* Initialize the trees. */
  for (n = 0; n < L_CODES; n++) {
    s.dyn_ltree[n * 2] /*.Freq*/ = 0
  }
  for (n = 0; n < D_CODES; n++) {
    s.dyn_dtree[n * 2] /*.Freq*/ = 0
  }
  for (n = 0; n < BL_CODES; n++) {
    s.bl_tree[n * 2] /*.Freq*/ = 0
  }

  s.dyn_ltree[END_BLOCK * 2] /*.Freq*/ = 1
  s.opt_len = s.static_len = 0
  s.sym_next = s.matches = 0
}

/* ===========================================================================
 * Flush the bit buffer and align the output on a byte boundary
 */
const bi_windup = (s) => {
  if (s.bi_valid > 8) {
    put_short(s, s.bi_buf)
  } else if (s.bi_valid > 0) {
    //put_byte(s, (Byte)s->bi_buf);
    s.pending_buf[s.pending++] = s.bi_buf
  }
  s.bi_buf = 0
  s.bi_valid = 0
}

/* ===========================================================================
 * Compares to subtrees, using the tree depth as tie breaker when
 * the subtrees have equal frequency. This minimizes the worst case length.
 */
const smaller = (tree, n, m, depth) => {
  const _n2 = n * 2
  const _m2 = m * 2
  return (
    tree[_n2] /*.Freq*/ < tree[_m2] /*.Freq*/ ||
    (tree[_n2] /*.Freq*/ === tree[_m2] /*.Freq*/ && depth[n] <= depth[m])
  )
}

/* ===========================================================================
 * Restore the heap property by moving down the tree starting at node k,
 * exchanging a node with the smallest of its two sons if necessary, stopping
 * when the heap property is re-established (each father smaller than its
 * two sons).
 */
const pqdownheap = (s, tree, k) => {
  //    deflate_state *s;
  //    ct_data *tree;  /* the tree to restore */
  //    int k;               /* node to move down */

  const v = s.heap[k]
  let j = k << 1 /* left son of k */
  while (j <= s.heap_len) {
    /* Set j to the smallest of the two sons: */
    if (j < s.heap_len && smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) {
      j++
    }
    /* Exit if v is smaller than both sons */
    if (smaller(tree, v, s.heap[j], s.depth)) {
      break
    }

    /* Exchange v with the smallest son */
    s.heap[k] = s.heap[j]
    k = j

    /* And continue down the tree, setting j to the left son of k */
    j <<= 1
  }
  s.heap[k] = v
}

// inlined manually
// const SMALLEST = 1;

/* ===========================================================================
 * Send the block data compressed using the given Huffman trees
 */
const compress_block = (s, ltree, dtree) => {
  //    deflate_state *s;
  //    const ct_data *ltree; /* literal tree */
  //    const ct_data *dtree; /* distance tree */

  let dist /* distance of matched string */
  let lc /* match length or unmatched char (if dist == 0) */
  let sx = 0 /* running index in sym_buf */
  let code /* the code to send */
  let extra /* number of extra bits to send */

  if (s.sym_next !== 0) {
    do {
      dist = s.pending_buf[s.sym_buf + sx++] & 0xff
      dist += (s.pending_buf[s.sym_buf + sx++] & 0xff) << 8
      lc = s.pending_buf[s.sym_buf + sx++]
      if (dist === 0) {
        send_code(s, lc, ltree) /* send a literal byte */
        //Tracecv(isgraph(lc), (stderr," '%c' ", lc));
      } else {
        /* Here, lc is the match length - MIN_MATCH */
        code = _length_code[lc]
        send_code(s, code + LITERALS + 1, ltree) /* send the length code */
        extra = extra_lbits[code]
        if (extra !== 0) {
          lc -= base_length[code]
          send_bits(s, lc, extra) /* send the extra length bits */
        }
        dist-- /* dist is now the match distance - 1 */
        code = d_code(dist)
        //Assert (code < D_CODES, "bad d_code");

        send_code(s, code, dtree) /* send the distance code */
        extra = extra_dbits[code]
        if (extra !== 0) {
          dist -= base_dist[code]
          send_bits(s, dist, extra) /* send the extra distance bits */
        }
      } /* literal or match pair ? */

      /* Check that the overlay between pending_buf and sym_buf is ok: */
      //Assert(s->pending < s->lit_bufsize + sx, "pendingBuf overflow");
    } while (sx < s.sym_next)
  }

  send_code(s, END_BLOCK, ltree)
}

/* ===========================================================================
 * Construct one Huffman tree and assigns the code bit strings and lengths.
 * Update the total bit length for the current block.
 * IN assertion: the field freq is set for all tree elements.
 * OUT assertions: the fields len and code are set to the optimal bit length
 *     and corresponding code. The length opt_len is updated; static_len is
 *     also updated if stree is not null. The field max_code is set.
 */
const build_tree = (s, desc) => {
  //    deflate_state *s;
  //    tree_desc *desc; /* the tree descriptor */

  const tree = desc.dyn_tree
  const stree = desc.stat_desc.static_tree
  const has_stree = desc.stat_desc.has_stree
  const elems = desc.stat_desc.elems
  let n, m /* iterate over heap elements */
  let max_code = -1 /* largest code with non zero frequency */
  let node /* new node being created */

  /* Construct the initial heap, with least frequent element in
   * heap[SMALLEST]. The sons of heap[n] are heap[2*n] and heap[2*n+1].
   * heap[0] is not used.
   */
  s.heap_len = 0
  s.heap_max = HEAP_SIZE

  for (n = 0; n < elems; n++) {
    if (tree[n * 2] /*.Freq*/ !== 0) {
      s.heap[++s.heap_len] = max_code = n
      s.depth[n] = 0
    } else {
      tree[n * 2 + 1] /*.Len*/ = 0
    }
  }

  /* The pkzip format requires that at least one distance code exists,
   * and that at least one bit should be sent even if there is only one
   * possible code. So to avoid special checks later on we force at least
   * two codes of non zero frequency.
   */
  while (s.heap_len < 2) {
    node = s.heap[++s.heap_len] = max_code < 2 ? ++max_code : 0
    tree[node * 2] /*.Freq*/ = 1
    s.depth[node] = 0
    s.opt_len--

    if (has_stree) {
      s.static_len -= stree[node * 2 + 1] /*.Len*/
    }
    /* node is 0 or 1 so it does not have extra bits */
  }
  desc.max_code = max_code

  /* The elements heap[heap_len/2+1 .. heap_len] are leaves of the tree,
   * establish sub-heaps of increasing lengths:
   */
  for (n = s.heap_len >> 1 /*int /2*/; n >= 1; n--) {
    pqdownheap(s, tree, n)
  }

  /* Construct the Huffman tree by repeatedly combining the least two
   * frequent nodes.
   */
  node = elems /* next internal node of the tree */
  do {
    //pqremove(s, tree, n);  /* n = node of least frequency */
    /*** pqremove ***/
    n = s.heap[1 /*SMALLEST*/]
    s.heap[1 /*SMALLEST*/] = s.heap[s.heap_len--]
    pqdownheap(s, tree, 1 /*SMALLEST*/)
    /***/

    m = s.heap[1 /*SMALLEST*/] /* m = node of next least frequency */

    s.heap[--s.heap_max] = n /* keep the nodes sorted by frequency */
    s.heap[--s.heap_max] = m

    /* Create a new node father of n and m */
    tree[node * 2] /*.Freq*/ = tree[n * 2] /*.Freq*/ + tree[m * 2] /*.Freq*/
    s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1
    tree[n * 2 + 1] /*.Dad*/ = tree[m * 2 + 1] /*.Dad*/ = node

    /* and insert the new node in the heap */
    s.heap[1 /*SMALLEST*/] = node++
    pqdownheap(s, tree, 1 /*SMALLEST*/)
  } while (s.heap_len >= 2)

  s.heap[--s.heap_max] = s.heap[1 /*SMALLEST*/]

  /* At this point, the fields freq and dad are set. We can now
   * generate the bit lengths.
   */
  gen_bitlen(s, desc)

  /* The field len is now set, we can generate the bit codes */
  gen_codes(tree, max_code, s.bl_count)
}

/* ===========================================================================
 * Scan a literal or distance tree to determine the frequencies of the codes
 * in the bit length tree.
 */
const scan_tree = (s, tree, max_code) => {
  //    deflate_state *s;
  //    ct_data *tree;   /* the tree to be scanned */
  //    int max_code;    /* and its largest code of non zero frequency */

  let n /* iterates over all tree elements */
  let prevlen = -1 /* last emitted length */
  let curlen /* length of current code */

  let nextlen = tree[0 * 2 + 1] /*.Len*/ /* length of next code */

  let count = 0 /* repeat count of the current code */
  let max_count = 7 /* max repeat count */
  let min_count = 4 /* min repeat count */

  if (nextlen === 0) {
    max_count = 138
    min_count = 3
  }
  tree[(max_code + 1) * 2 + 1] /*.Len*/ = 0xffff /* guard */

  for (n = 0; n <= max_code; n++) {
    curlen = nextlen
    nextlen = tree[(n + 1) * 2 + 1] /*.Len*/

    if (++count < max_count && curlen === nextlen) {
      continue
    } else if (count < min_count) {
      s.bl_tree[curlen * 2] /*.Freq*/ += count
    } else if (curlen !== 0) {
      if (curlen !== prevlen) {
        s.bl_tree[curlen * 2] /*.Freq*/++
      }
      s.bl_tree[REP_3_6 * 2] /*.Freq*/++
    } else if (count <= 10) {
      s.bl_tree[REPZ_3_10 * 2] /*.Freq*/++
    } else {
      s.bl_tree[REPZ_11_138 * 2] /*.Freq*/++
    }

    count = 0
    prevlen = curlen

    if (nextlen === 0) {
      max_count = 138
      min_count = 3
    } else if (curlen === nextlen) {
      max_count = 6
      min_count = 3
    } else {
      max_count = 7
      min_count = 4
    }
  }
}

/* ===========================================================================
 * Send a literal or distance tree in compressed form, using the codes in
 * bl_tree.
 */
const send_tree = (s, tree, max_code) => {
  //    deflate_state *s;
  //    ct_data *tree; /* the tree to be scanned */
  //    int max_code;       /* and its largest code of non zero frequency */

  let n /* iterates over all tree elements */
  let prevlen = -1 /* last emitted length */
  let curlen /* length of current code */

  let nextlen = tree[0 * 2 + 1] /*.Len*/ /* length of next code */

  let count = 0 /* repeat count of the current code */
  let max_count = 7 /* max repeat count */
  let min_count = 4 /* min repeat count */

  /* tree[max_code+1].Len = -1; */ /* guard already set */
  if (nextlen === 0) {
    max_count = 138
    min_count = 3
  }

  for (n = 0; n <= max_code; n++) {
    curlen = nextlen
    nextlen = tree[(n + 1) * 2 + 1] /*.Len*/

    if (++count < max_count && curlen === nextlen) {
      continue
    } else if (count < min_count) {
      do {
        send_code(s, curlen, s.bl_tree)
      } while (--count !== 0)
    } else if (curlen !== 0) {
      if (curlen !== prevlen) {
        send_code(s, curlen, s.bl_tree)
        count--
      }
      //Assert(count >= 3 && count <= 6, " 3_6?");
      send_code(s, REP_3_6, s.bl_tree)
      send_bits(s, count - 3, 2)
    } else if (count <= 10) {
      send_code(s, REPZ_3_10, s.bl_tree)
      send_bits(s, count - 3, 3)
    } else {
      send_code(s, REPZ_11_138, s.bl_tree)
      send_bits(s, count - 11, 7)
    }

    count = 0
    prevlen = curlen
    if (nextlen === 0) {
      max_count = 138
      min_count = 3
    } else if (curlen === nextlen) {
      max_count = 6
      min_count = 3
    } else {
      max_count = 7
      min_count = 4
    }
  }
}

/* ===========================================================================
 * Construct the Huffman tree for the bit lengths and return the index in
 * bl_order of the last bit length code to send.
 */
const build_bl_tree = (s) => {
  let max_blindex /* index of last bit length code of non zero freq */

  /* Determine the bit length frequencies for literal and distance trees */
  scan_tree(s, s.dyn_ltree, s.l_desc.max_code)
  scan_tree(s, s.dyn_dtree, s.d_desc.max_code)

  /* Build the bit length tree: */
  build_tree(s, s.bl_desc)
  /* opt_len now includes the length of the tree representations, except
   * the lengths of the bit lengths codes and the 5+5+4 bits for the counts.
   */

  /* Determine the number of bit length codes to send. The pkzip format
   * requires that at least 4 bit length codes be sent. (appnote.txt says
   * 3 but the actual value used is 4.)
   */
  for (max_blindex = BL_CODES - 1; max_blindex >= 3; max_blindex--) {
    if (s.bl_tree[bl_order[max_blindex] * 2 + 1] /*.Len*/ !== 0) {
      break
    }
  }
  /* Update opt_len to include the bit length tree and counts */
  s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4
  //Tracev((stderr, "\ndyn trees: dyn %ld, stat %ld",
  //        s->opt_len, s->static_len));

  return max_blindex
}

/* ===========================================================================
 * Send the header for a block using dynamic Huffman trees: the counts, the
 * lengths of the bit length codes, the literal tree and the distance tree.
 * IN assertion: lcodes >= 257, dcodes >= 1, blcodes >= 4.
 */
const send_all_trees = (s, lcodes, dcodes, blcodes) => {
  //    deflate_state *s;
  //    int lcodes, dcodes, blcodes; /* number of codes for each tree */

  let rank /* index in bl_order */

  //Assert (lcodes >= 257 && dcodes >= 1 && blcodes >= 4, "not enough codes");
  //Assert (lcodes <= L_CODES && dcodes <= D_CODES && blcodes <= BL_CODES,
  //        "too many codes");
  //Tracev((stderr, "\nbl counts: "));
  send_bits(s, lcodes - 257, 5) /* not +255 as stated in appnote.txt */
  send_bits(s, dcodes - 1, 5)
  send_bits(s, blcodes - 4, 4) /* not -3 as stated in appnote.txt */
  for (rank = 0; rank < blcodes; rank++) {
    //Tracev((stderr, "\nbl code %2d ", bl_order[rank]));
    send_bits(s, s.bl_tree[bl_order[rank] * 2 + 1] /*.Len*/, 3)
  }
  //Tracev((stderr, "\nbl tree: sent %ld", s->bits_sent));

  send_tree(s, s.dyn_ltree, lcodes - 1) /* literal tree */
  //Tracev((stderr, "\nlit tree: sent %ld", s->bits_sent));

  send_tree(s, s.dyn_dtree, dcodes - 1) /* distance tree */
  //Tracev((stderr, "\ndist tree: sent %ld", s->bits_sent));
}

/* ===========================================================================
 * Check if the data type is TEXT or BINARY, using the following algorithm:
 * - TEXT if the two conditions below are satisfied:
 *    a) There are no non-portable control characters belonging to the
 *       "block list" (0..6, 14..25, 28..31).
 *    b) There is at least one printable character belonging to the
 *       "allow list" (9 {TAB}, 10 {LF}, 13 {CR}, 32..255).
 * - BINARY otherwise.
 * - The following partially-portable control characters form a
 *   "gray list" that is ignored in this detection algorithm:
 *   (7 {BEL}, 8 {BS}, 11 {VT}, 12 {FF}, 26 {SUB}, 27 {ESC}).
 * IN assertion: the fields Freq of dyn_ltree are set.
 */
const detect_data_type = (s) => {
  /* block_mask is the bit mask of block-listed bytes
   * set bits 0..6, 14..25, and 28..31
   * 0xf3ffc07f = binary 11110011111111111100000001111111
   */
  let block_mask = 0xf3ffc07f
  let n

  /* Check for non-textual ("block-listed") bytes. */
  for (n = 0; n <= 31; n++, block_mask >>>= 1) {
    if (block_mask & 1 && s.dyn_ltree[n * 2] /*.Freq*/ !== 0) {
      return Z_BINARY
    }
  }

  /* Check for textual ("allow-listed") bytes. */
  if (
    s.dyn_ltree[9 * 2] /*.Freq*/ !== 0 ||
    s.dyn_ltree[10 * 2] /*.Freq*/ !== 0 ||
    s.dyn_ltree[13 * 2] /*.Freq*/ !== 0
  ) {
    return Z_TEXT
  }
  for (n = 32; n < LITERALS; n++) {
    if (s.dyn_ltree[n * 2] /*.Freq*/ !== 0) {
      return Z_TEXT
    }
  }

  /* There are no "block-listed" or "allow-listed" bytes:
   * this stream either is empty or has tolerated ("gray-listed") bytes only.
   */
  return Z_BINARY
}

let static_init_done = false

/* ===========================================================================
 * Initialize the tree data structures for a new zlib stream.
 */
const _tr_init = (s) => {
  if (!static_init_done) {
    tr_static_init()
    static_init_done = true
  }

  s.l_desc = new TreeDesc(s.dyn_ltree, static_l_desc)
  s.d_desc = new TreeDesc(s.dyn_dtree, static_d_desc)
  s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc)

  s.bi_buf = 0
  s.bi_valid = 0

  /* Initialize the first block of the first file: */
  init_block(s)
}

/* ===========================================================================
 * Send a stored block
 */
const _tr_stored_block = (s, buf, stored_len, last) => {
  //DeflateState *s;
  //charf *buf;       /* input block */
  //ulg stored_len;   /* length of input block */
  //int last;         /* one if this is the last block for a file */

  send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3) /* send block type */
  bi_windup(s) /* align on byte boundary */
  put_short(s, stored_len)
  put_short(s, ~stored_len)
  if (stored_len) {
    s.pending_buf.set(s.window.subarray(buf, buf + stored_len), s.pending)
  }
  s.pending += stored_len
}

/* ===========================================================================
 * Send one empty static block to give enough lookahead for inflate.
 * This takes 10 bits, of which 7 may remain in the bit buffer.
 */
const _tr_align = (s) => {
  send_bits(s, STATIC_TREES << 1, 3)
  send_code(s, END_BLOCK, static_ltree)
  bi_flush(s)
}

/* ===========================================================================
 * Determine the best encoding for the current block: dynamic trees, static
 * trees or store, and write out the encoded block.
 */
const _tr_flush_block = (s, buf, stored_len, last) => {
  //DeflateState *s;
  //charf *buf;       /* input block, or NULL if too old */
  //ulg stored_len;   /* length of input block */
  //int last;         /* one if this is the last block for a file */

  let opt_lenb, static_lenb /* opt_len and static_len in bytes */
  let max_blindex = 0 /* index of last bit length code of non zero freq */

  /* Build the Huffman trees unless a stored block is forced */
  if (s.level > 0) {
    /* Check if the file is binary or text */
    if (s.strm.data_type === Z_UNKNOWN) {
      s.strm.data_type = detect_data_type(s)
    }

    /* Construct the literal and distance trees */
    build_tree(s, s.l_desc)
    // Tracev((stderr, "\nlit data: dyn %ld, stat %ld", s->opt_len,
    //        s->static_len));

    build_tree(s, s.d_desc)
    // Tracev((stderr, "\ndist data: dyn %ld, stat %ld", s->opt_len,
    //        s->static_len));
    /* At this point, opt_len and static_len are the total bit lengths of
     * the compressed block data, excluding the tree representations.
     */

    /* Build the bit length tree for the above two trees, and get the index
     * in bl_order of the last bit length code to send.
     */
    max_blindex = build_bl_tree(s)

    /* Determine the best encoding. Compute the block lengths in bytes. */
    opt_lenb = (s.opt_len + 3 + 7) >>> 3
    static_lenb = (s.static_len + 3 + 7) >>> 3

    // Tracev((stderr, "\nopt %lu(%lu) stat %lu(%lu) stored %lu lit %u ",
    //        opt_lenb, s->opt_len, static_lenb, s->static_len, stored_len,
    //        s->sym_next / 3));

    if (static_lenb <= opt_lenb) {
      opt_lenb = static_lenb
    }
  } else {
    // Assert(buf != (char*)0, "lost buf");
    opt_lenb = static_lenb = stored_len + 5 /* force a stored block */
  }

  if (stored_len + 4 <= opt_lenb && buf !== -1) {
    /* 4: two words for the lengths */

    /* The test buf != NULL is only necessary if LIT_BUFSIZE > WSIZE.
     * Otherwise we can't have processed more than WSIZE input bytes since
     * the last block flush, because compression would have been
     * successful. If LIT_BUFSIZE <= WSIZE, it is never too late to
     * transform a block into a stored block.
     */
    _tr_stored_block(s, buf, stored_len, last)
  } else if (s.strategy === Z_FIXED || static_lenb === opt_lenb) {
    send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3)
    compress_block(s, static_ltree, static_dtree)
  } else {
    send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3)
    send_all_trees(
      s,
      s.l_desc.max_code + 1,
      s.d_desc.max_code + 1,
      max_blindex + 1,
    )
    compress_block(s, s.dyn_ltree, s.dyn_dtree)
  }
  // Assert (s->compressed_len == s->bits_sent, "bad compressed size");
  /* The above check is made mod 2^32, for files larger than 512 MB
   * and uLong implemented on 32 bits.
   */
  init_block(s)

  if (last) {
    bi_windup(s)
  }
  // Tracev((stderr,"\ncomprlen %lu(%lu) ", s->compressed_len>>3,
  //       s->compressed_len-7*last));
}

/* ===========================================================================
 * Save the match info and tally the frequency counts. Return true if
 * the current block must be flushed.
 */
const _tr_tally = (s, dist, lc) => {
  //    deflate_state *s;
  //    unsigned dist;  /* distance of matched string */
  //    unsigned lc;    /* match length-MIN_MATCH or unmatched char (if dist==0) */

  s.pending_buf[s.sym_buf + s.sym_next++] = dist
  s.pending_buf[s.sym_buf + s.sym_next++] = dist >> 8
  s.pending_buf[s.sym_buf + s.sym_next++] = lc
  if (dist === 0) {
    /* lc is the unmatched char */
    s.dyn_ltree[lc * 2] /*.Freq*/++
  } else {
    s.matches++
    /* Here, lc is the match length - MIN_MATCH */
    dist-- /* dist = match distance - 1 */
    //Assert((ush)dist < (ush)MAX_DIST(s) &&
    //       (ush)lc <= (ush)(MAX_MATCH-MIN_MATCH) &&
    //       (ush)d_code(dist) < (ush)D_CODES,  "_tr_tally: bad match");

    s.dyn_ltree[(_length_code[lc] + LITERALS + 1) * 2] /*.Freq*/++
    s.dyn_dtree[d_code(dist) * 2] /*.Freq*/++
  }

  return s.sym_next === s.sym_end
}

const __tr_init = _tr_init
export { __tr_init as _tr_init }
const __tr_stored_block = _tr_stored_block
export { __tr_stored_block as _tr_stored_block }
const __tr_flush_block = _tr_flush_block
export { __tr_flush_block as _tr_flush_block }
const __tr_tally = _tr_tally
export { __tr_tally as _tr_tally }
const __tr_align = _tr_align
export { __tr_align as _tr_align }
