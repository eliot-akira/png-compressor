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

const MAXBITS = 15
const ENOUGH_LENS = 852
const ENOUGH_DISTS = 592
//const ENOUGH = (ENOUGH_LENS+ENOUGH_DISTS);

const CODES = 0
const LENS = 1
const DISTS = 2

const lbase = new Uint16Array([
  /* Length codes 257..285 base */ 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19,
  23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0,
])

const lext = new Uint8Array([
  /* Length codes 257..285 extra */ 16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17,
  17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72,
  78,
])

const dbase = new Uint16Array([
  /* Distance codes 0..29 base */ 1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65,
  97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193,
  12289, 16385, 24577, 0, 0,
])

const dext = new Uint8Array([
  /* Distance codes 0..29 extra */ 16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20,
  20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29,
  64, 64,
])

const inflate_table = (
  type,
  lens,
  lens_index,
  codes,
  table,
  table_index,
  work,
  opts,
) => {
  const bits = opts.bits
  //here = opts.here; /* table entry for duplication */

  let len = 0 /* a code's length in bits */
  let sym = 0 /* index of code symbols */
  let min = 0,
    max = 0 /* minimum and maximum code lengths */
  let root = 0 /* number of index bits for root table */
  let curr = 0 /* number of index bits for current table */
  let drop = 0 /* code bits to drop for sub-table */
  let left = 0 /* number of prefix codes available */
  let used = 0 /* code entries in table used */
  let huff = 0 /* Huffman code */
  let incr /* for incrementing code, index */
  let fill /* index for replicating entries */
  let low /* low bits for current root entry */
  let mask /* mask for low root bits */
  let next /* next available space in table */
  let base = null /* base value table to use */
  //  let shoextra;    /* extra bits table to use */
  let match /* use base and extra for symbol >= match */
  const count = new Uint16Array(MAXBITS + 1) //[MAXBITS+1];    /* number of codes of each length */
  const offs = new Uint16Array(MAXBITS + 1) //[MAXBITS+1];     /* offsets in table for each length */
  let extra = null

  let here_bits, here_op, here_val

  /*
   Process a set of code lengths to create a canonical Huffman code.  The
   code lengths are lens[0..codes-1].  Each length corresponds to the
   symbols 0..codes-1.  The Huffman code is generated by first sorting the
   symbols by length from short to long, and retaining the symbol order
   for codes with equal lengths.  Then the code starts with all zero bits
   for the first code of the shortest length, and the codes are integer
   increments for the same length, and zeros are appended as the length
   increases.  For the deflate format, these bits are stored backwards
   from their more natural integer increment ordering, and so when the
   decoding tables are built in the large loop below, the integer codes
   are incremented backwards.

   This routine assumes, but does not check, that all of the entries in
   lens[] are in the range 0..MAXBITS.  The caller must assure this.
   1..MAXBITS is interpreted as that code length.  zero means that that
   symbol does not occur in this code.

   The codes are sorted by computing a count of codes for each length,
   creating from that a table of starting indices for each length in the
   sorted table, and then entering the symbols in order in the sorted
   table.  The sorted table is work[], with that space being provided by
   the caller.

   The length counts are used for other purposes as well, i.e. finding
   the minimum and maximum length codes, determining if there are any
   codes at all, checking for a valid set of lengths, and looking ahead
   at length counts to determine sub-table sizes when building the
   decoding tables.
   */

  /* accumulate lengths for codes (assumes lens[] all in 0..MAXBITS) */
  for (len = 0; len <= MAXBITS; len++) {
    count[len] = 0
  }
  for (sym = 0; sym < codes; sym++) {
    count[lens[lens_index + sym]]++
  }

  /* bound code lengths, force root to be within code lengths */
  root = bits
  for (max = MAXBITS; max >= 1; max--) {
    if (count[max] !== 0) {
      break
    }
  }
  if (root > max) {
    root = max
  }
  if (max === 0) {
    /* no symbols to code at all */
    //table.op[opts.table_index] = 64;  //here.op = (var char)64;    /* invalid code marker */
    //table.bits[opts.table_index] = 1;   //here.bits = (var char)1;
    //table.val[opts.table_index++] = 0;   //here.val = (var short)0;
    table[table_index++] = (1 << 24) | (64 << 16) | 0

    //table.op[opts.table_index] = 64;
    //table.bits[opts.table_index] = 1;
    //table.val[opts.table_index++] = 0;
    table[table_index++] = (1 << 24) | (64 << 16) | 0

    opts.bits = 1
    return 0 /* no symbols, but wait for decoding to report error */
  }
  for (min = 1; min < max; min++) {
    if (count[min] !== 0) {
      break
    }
  }
  if (root < min) {
    root = min
  }

  /* check for an over-subscribed or incomplete set of lengths */
  left = 1
  for (len = 1; len <= MAXBITS; len++) {
    left <<= 1
    left -= count[len]
    if (left < 0) {
      return -1
    } /* over-subscribed */
  }
  if (left > 0 && (type === CODES || max !== 1)) {
    return -1 /* incomplete set */
  }

  /* generate offsets into symbol table for each length for sorting */
  offs[1] = 0
  for (len = 1; len < MAXBITS; len++) {
    offs[len + 1] = offs[len] + count[len]
  }

  /* sort symbols by length, by symbol order within each length */
  for (sym = 0; sym < codes; sym++) {
    if (lens[lens_index + sym] !== 0) {
      work[offs[lens[lens_index + sym]]++] = sym
    }
  }

  /*
   Create and fill in decoding tables.  In this loop, the table being
   filled is at next and has curr index bits.  The code being used is huff
   with length len.  That code is converted to an index by dropping drop
   bits off of the bottom.  For codes where len is less than drop + curr,
   those top drop + curr - len bits are incremented through all values to
   fill the table with replicated entries.

   root is the number of index bits for the root table.  When len exceeds
   root, sub-tables are created pointed to by the root entry with an index
   of the low root bits of huff.  This is saved in low to check for when a
   new sub-table should be started.  drop is zero when the root table is
   being filled, and drop is root when sub-tables are being filled.

   When a new sub-table is needed, it is necessary to look ahead in the
   code lengths to determine what size sub-table is needed.  The length
   counts are used for this, and so count[] is decremented as codes are
   entered in the tables.

   used keeps track of how many table entries have been allocated from the
   provided *table space.  It is checked for LENS and DIST tables against
   the constants ENOUGH_LENS and ENOUGH_DISTS to guard against changes in
   the initial root table size constants.  See the comments in inftrees.h
   for more information.

   sym increments through all symbols, and the loop terminates when
   all codes of length max, i.e. all codes, have been processed.  This
   routine permits incomplete codes, so another loop after this one fills
   in the rest of the decoding tables with invalid code markers.
   */

  /* set up for code type */
  // poor man optimization - use if-else instead of switch,
  // to avoid deopts in old v8
  if (type === CODES) {
    base = extra = work /* dummy value--not used */
    match = 20
  } else if (type === LENS) {
    base = lbase
    extra = lext
    match = 257
  } else {
    /* DISTS */
    base = dbase
    extra = dext
    match = 0
  }

  /* initialize opts for loop */
  huff = 0 /* starting code */
  sym = 0 /* starting code symbol */
  len = min /* starting code length */
  next = table_index /* current table to fill in */
  curr = root /* current table index bits */
  drop = 0 /* current bits to drop from code for index */
  low = -1 /* trigger new sub-table when len > root */
  used = 1 << root /* use root table entries */
  mask = used - 1 /* mask for comparing low */

  /* check available table space */
  if (
    (type === LENS && used > ENOUGH_LENS) ||
    (type === DISTS && used > ENOUGH_DISTS)
  ) {
    return 1
  }

  /* process all codes and make table entries */
  for (;;) {
    /* create table entry */
    here_bits = len - drop
    if (work[sym] + 1 < match) {
      here_op = 0
      here_val = work[sym]
    } else if (work[sym] >= match) {
      here_op = extra[work[sym] - match]
      here_val = base[work[sym] - match]
    } else {
      here_op = 32 + 64 /* end of block */
      here_val = 0
    }

    /* replicate for those indices with low len bits equal to huff */
    incr = 1 << (len - drop)
    fill = 1 << curr
    min = fill /* save offset to next table */
    do {
      fill -= incr
      table[next + (huff >> drop) + fill] =
        (here_bits << 24) | (here_op << 16) | here_val | 0
    } while (fill !== 0)

    /* backwards increment the len-bit code huff */
    incr = 1 << (len - 1)
    while (huff & incr) {
      incr >>= 1
    }
    if (incr !== 0) {
      huff &= incr - 1
      huff += incr
    } else {
      huff = 0
    }

    /* go to next symbol, update count, len */
    sym++
    if (--count[len] === 0) {
      if (len === max) {
        break
      }
      len = lens[lens_index + work[sym]]
    }

    /* create new sub-table if needed */
    if (len > root && (huff & mask) !== low) {
      /* if first time, transition to sub-tables */
      if (drop === 0) {
        drop = root
      }

      /* increment past last table */
      next += min /* here min is 1 << curr */

      /* determine length of next table */
      curr = len - drop
      left = 1 << curr
      while (curr + drop < max) {
        left -= count[curr + drop]
        if (left <= 0) {
          break
        }
        curr++
        left <<= 1
      }

      /* check for enough space */
      used += 1 << curr
      if (
        (type === LENS && used > ENOUGH_LENS) ||
        (type === DISTS && used > ENOUGH_DISTS)
      ) {
        return 1
      }

      /* point entry in root table to sub-table */
      low = huff & mask
      /*table.op[low] = curr;
      table.bits[low] = root;
      table.val[low] = next - opts.table_index;*/
      table[low] = (root << 24) | (curr << 16) | (next - table_index) | 0
    }
  }

  /* fill in remaining table entry if code is incomplete (guaranteed to have
   at most one remaining entry, since if the code is incomplete, the
   maximum code length that was allowed to get this far is one bit) */
  if (huff !== 0) {
    //table.op[next + huff] = 64;            /* invalid code marker */
    //table.bits[next + huff] = len - drop;
    //table.val[next + huff] = 0;
    table[next + huff] = ((len - drop) << 24) | (64 << 16) | 0
  }

  /* set return parameters */
  //opts.table_index += used;
  opts.bits = root
  return 0
}

export default inflate_table
