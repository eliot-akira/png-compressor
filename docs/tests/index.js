(() => {
  // src/tests/equal.ts
  var { getOwnPropertySymbols, is, keys, prototype } = Object;
  var { hasOwnProperty, valueOf } = prototype;
  var { isView } = ArrayBuffer;
  var { Node } = globalThis;
  var isEqualArray = (a, b, compareMap) => {
    if (a.length !== b.length) return false;
    for (let i = a.length - 1; i >= 0; i--) {
      if (!isEqualGeneral(a[i], b[i], compareMap)) return false;
    }
    return true;
  };
  var isEqualMapAdvanced = (a, b, compareMap) => {
    const entriesA = Array.from(a.entries());
    const entriesB = Array.from(b.entries());
    outer: for (let i = entriesA.length - 1; i >= 0; i--) {
      const entryA = entriesA[i];
      for (let j = entriesB.length - 1; j >= 0; j--) {
        const entryB = entriesB[j];
        if (isEqualGeneral(entryA[0], entryB[0], compareMap) && isEqualGeneral(entryA[1], entryB[1], compareMap)) {
          entriesB.splice(j, 1);
          continue outer;
        }
      }
      return false;
    }
    return true;
  };
  var isEqualMap = (a, b, compareMap) => {
    if (a.size !== b.size) return false;
    for (const [key, valueA] of a.entries()) {
      const valueB = b.get(key);
      if (!isEqualGeneral(valueA, valueB, compareMap)) {
        return isEqualMapAdvanced(a, b, compareMap);
      }
      if (valueB === void 0 && !b.has(key)) return false;
    }
    return true;
  };
  var isEqualSetAdvanced = (a, b, compareMap) => {
    const valuesA = Array.from(a.values());
    const valuesB = Array.from(b.values());
    outer: for (let i = valuesA.length - 1; i >= 0; i--) {
      const valueA = valuesA[i];
      for (let j = valuesB.length - 1; j >= 0; j--) {
        const valueB = valuesB[j];
        if (isEqualGeneral(valueA, valueB, compareMap)) {
          valuesB.splice(j, 1);
          continue outer;
        }
      }
      return false;
    }
    return true;
  };
  var isEqualSet = (a, b, compareMap) => {
    if (a.size !== b.size) return false;
    for (const [valueA] of a.entries()) {
      if (!b.has(valueA)) return isEqualSetAdvanced(a, b, compareMap);
    }
    return true;
  };
  var isEqualDate = (a, b) => {
    return is(a.getTime(), b.getTime());
  };
  var isEqualRegExp = (a, b) => {
    return a.source === b.source && a.flags === b.flags;
  };
  var isEqualArrayBuffer = (a, b) => {
    if (a.byteLength !== b.byteLength) return false;
    return isEqualTypedArray(new Uint8Array(a), new Uint8Array(b));
  };
  function isEqualTypedArray(a, b) {
    if (a.length !== b.length) return false;
    for (let i = a.length - 1; i >= 0; i--) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  var isEqualValueOf = (a, b, compareMap) => {
    return isEqualGeneral(a.valueOf(), b.valueOf(), compareMap);
  };
  var isEqualObject = (a, b, compareMap) => {
    const propertiesA = keys(a);
    const propertiesB = keys(b);
    if (propertiesA.length !== propertiesB.length) return false;
    for (let i = propertiesA.length - 1; i >= 0; i--) {
      const property = propertiesA[i];
      const valueA = a[property];
      const valueB = b[property];
      if (!isEqualGeneral(valueA, valueB, compareMap)) return false;
      if (valueB === void 0 && !hasOwnProperty.call(b, property)) return false;
    }
    const symbolsA = getOwnPropertySymbols(a);
    const symbolsB = getOwnPropertySymbols(b);
    if (symbolsA.length !== symbolsB.length) return false;
    for (let i = symbolsA.length - 1; i >= 0; i--) {
      const symbol = symbolsA[i];
      const valueA = a[symbol];
      const valueB = b[symbol];
      if (!isEqualGeneral(valueA, valueB, compareMap)) return false;
      if (valueB === void 0 && !hasOwnProperty.call(b, symbol)) return false;
    }
    return true;
  };
  function isEqualGeneral(a, b, compareMap) {
    if (is(a, b)) return true;
    if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) {
      return false;
    }
    const { constructor } = a;
    const { constructor: constructorB } = b;
    if (constructor && constructorB && constructor !== constructorB) {
      return false;
    }
    if (compareMap.get(a) === b) return true;
    compareMap.set(a, b);
    if (!constructor || !constructorB) {
      if ((!constructor || constructor === Object) && (!constructorB || constructorB === Object)) {
        return isEqualObject(a, b, compareMap);
      }
      return false;
    }
    if (constructor === Array) {
      return isEqualArray(a, b, compareMap);
    }
    if (constructor === Map) {
      return isEqualMap(a, b, compareMap);
    }
    if (constructor === Set) {
      return isEqualSet(a, b, compareMap);
    }
    if (constructor === Date) {
      return isEqualDate(a, b);
    }
    if (constructor === RegExp) {
      return isEqualRegExp(a, b);
    }
    if (constructor === ArrayBuffer) {
      return isEqualArrayBuffer(a, b);
    }
    if (isView(a)) {
      return isEqualTypedArray(a, b);
    }
    if (constructor === Promise || constructor === WeakMap || constructor === WeakSet || constructor === Node) {
      return false;
    }
    if (a.valueOf !== valueOf) {
      return isEqualValueOf(a, b, compareMap);
    }
    return isEqualObject(a, b, compareMap);
  }
  function isEqual(a, b) {
    return isEqualGeneral(a, b, /* @__PURE__ */ new Map());
  }

  // src/tests/runner.ts
  var tests = [];
  var test = (title, callback) => tests.push({
    title,
    callback,
    assertions: [],
    result: void 0,
    error: void 0
  });
  var runTests = async (report = consoleReporter) => {
    report("tests", tests);
    for (const test2 of tests) {
      report("test", { test: test2 });
      const it = (title, result) => {
        report("assert", { title, result });
        test2.assertions.push({ title, result });
      };
      try {
        await test2.callback(it, isEqual);
        test2.result = test2.assertions.filter((a) => !a.result).length === 0;
      } catch (error) {
        report("error", error);
        test2.result = false;
        test2.error = error;
      }
      report("testEnd", test2);
    }
    const pass = tests.map((test2) => test2.result).filter((r) => r).length;
    const total = tests.length;
    const fail = total - pass;
    const results = {
      tests,
      pass,
      fail,
      total
    };
    report("testsEnd", results);
    return results;
  };
  function consoleReporter(type, data) {
    switch (type) {
      case "tests":
        console.log("Tests");
        break;
      case "testsEnd":
        {
          const { pass, total } = data;
          console.log(pass, "/", total);
        }
        break;
      case "test":
        {
          const { test: test2 } = data;
          console.group(test2.title);
        }
        break;
      case "testEnd":
        console.groupEnd();
        break;
      case "assert":
        {
          const { title, result } = data;
          console[result ? "log" : "warn"](title, !!result);
        }
        break;
      case "error":
        console.error(data);
        break;
      default:
        break;
    }
  }

  // src/tests/index.ts
  var { PNGCompressor: png } = window;
  console.log("PNGCompressor", png);
  var encodableDataTypes = [
    ["string", "Hello, world"],
    ["number", 123],
    ["boolean", true],
    ["null", null]
  ];
  var arrayTypeValues = encodableDataTypes.map(([_, value]) => value);
  arrayTypeValues.push(JSON.parse(JSON.stringify(arrayTypeValues)));
  var objectTypeValue = encodableDataTypes.reduce((obj, [key, value]) => {
    obj[key] = value;
    return obj;
  }, {});
  arrayTypeValues.push(JSON.parse(JSON.stringify(objectTypeValue)));
  encodableDataTypes.push(["array", arrayTypeValues]);
  encodableDataTypes.push(["object", objectTypeValue]);
  test("Array buffer", async (it, is2) => {
    for (const [type, source] of encodableDataTypes) {
      const encoded = await png.valueToArrayBuffer(source);
      it(
        `valueToArrayBuffer() converts ${type} to array buffer`,
        encoded instanceof ArrayBuffer
      );
      const decoded = await png.arrayBufferToValue(encoded);
      it(
        `arrayBufferToValue() converts array buffer to original value (${type})`,
        is2(decoded, source)
      );
    }
  });
  test("Compress", async (it, is2) => {
    for (const [type, source] of encodableDataTypes) {
      const encoded = await png.compress(await png.valueToArrayBuffer(source));
      it(
        `compress() compresses ${type} to array buffer`,
        encoded instanceof ArrayBuffer
      );
      const decoded = await png.arrayBufferToValue(await png.decompress(encoded));
      it(
        `decompress() decompresses array buffer to original value (${type})`,
        is2(decoded, source)
      );
    }
  });
  test("PNG", async (it, is2) => {
    for (const [type, source] of encodableDataTypes) {
      const encoded = await png.encodeImageData(source);
      it(
        `encode() encodes ${type} to array buffer`,
        encoded instanceof ArrayBuffer
      );
      const decoded = await png.decodeImageData(encoded);
      it(
        `decode() decodes array buffer to original value (${type})`,
        is2(decoded, source)
      );
    }
  });
  var style = document.createElement("style");
  style.innerText = `
html, body { margin: 0 }
body { margin: 2rem; }
.success { color: green }    
.fail { color: red }      
`;
  document.head.appendChild(style);
  var $result = document.createElement("div");
  document.body.appendChild($result);
  runTests().then((results) => {
    const { tests: tests2, pass, fail, total } = results;
    $result.innerHTML = `

  <h1>Tests</h1>

  <h2>Total <span class=${pass === total ? "success" : "fail"}>${pass} / ${total}</span> pass</h2>

  ${tests2.map(
      ({ title, assertions, error }) => `

    <h3>${title}</h3>

    ${assertions.map(
        ({ title: title2, result }) => `
      <p class=${result ? "success" : "fail"}>${result ? "\u2714" : "\u2716"} ${title2}</p>
    `
      ).join("")}

    ${error ? "<p class=fail>" + error + "</p>" : ""}

  `
    ).join("")}
`;
  });
})();
//# sourceMappingURL=index.js.map
