import { a7 as local, a8 as toWorker, a9 as MAX_SUPPORTED_LEAGUE_VERSION, aa as gameAttributesCache, ab as gameAttributesKeysOtherSports, ac as gameAttributesArrayToObject, ad as downloadFile } from './bundle.js';

const instanceOfAny = (object, constructors) => constructors.some(c => object instanceof c);
let idbProxyableTypes;
let cursorAdvanceMethods;
// This is a function to prevent it throwing up in node environments.
function getIdbProxyableTypes() {
  return idbProxyableTypes || (idbProxyableTypes = [IDBDatabase, IDBObjectStore, IDBIndex, IDBCursor, IDBTransaction]);
}
// This is a function to prevent it throwing up in node environments.
function getCursorAdvanceMethods() {
  return cursorAdvanceMethods || (cursorAdvanceMethods = [IDBCursor.prototype.advance, IDBCursor.prototype.continue, IDBCursor.prototype.continuePrimaryKey]);
}
const cursorRequestMap = new WeakMap();
const transactionDoneMap = new WeakMap();
const transactionStoreNamesMap = new WeakMap();
const transformCache = new WeakMap();
const reverseTransformCache = new WeakMap();
function promisifyRequest(request) {
  const promise = new Promise((resolve, reject) => {
    const unlisten = () => {
      request.removeEventListener('success', success);
      request.removeEventListener('error', error);
    };
    const success = () => {
      resolve(wrap(request.result));
      unlisten();
    };
    const error = () => {
      reject(request.error);
      unlisten();
    };
    request.addEventListener('success', success);
    request.addEventListener('error', error);
  });
  promise.then(value => {
    // Since cursoring reuses the IDBRequest (*sigh*), we cache it for later retrieval
    // (see wrapFunction).
    if (value instanceof IDBCursor) {
      cursorRequestMap.set(value, request);
    }
    // Catching to avoid "Uncaught Promise exceptions"
  }).catch(() => {});
  // This mapping exists in reverseTransformCache but doesn't doesn't exist in transformCache. This
  // is because we create many promises from a single IDBRequest.
  reverseTransformCache.set(promise, request);
  return promise;
}
function cacheDonePromiseForTransaction(tx) {
  // Early bail if we've already created a done promise for this transaction.
  if (transactionDoneMap.has(tx)) return;
  const done = new Promise((resolve, reject) => {
    const unlisten = () => {
      tx.removeEventListener('complete', complete);
      tx.removeEventListener('error', error);
      tx.removeEventListener('abort', error);
    };
    const complete = () => {
      resolve();
      unlisten();
    };
    const error = () => {
      reject(tx.error || new DOMException('AbortError', 'AbortError'));
      unlisten();
    };
    tx.addEventListener('complete', complete);
    tx.addEventListener('error', error);
    tx.addEventListener('abort', error);
  });
  // Cache it for later retrieval.
  transactionDoneMap.set(tx, done);
}
let idbProxyTraps = {
  get(target, prop, receiver) {
    if (target instanceof IDBTransaction) {
      // Special handling for transaction.done.
      if (prop === 'done') return transactionDoneMap.get(target);
      // Polyfill for objectStoreNames because of Edge.
      if (prop === 'objectStoreNames') {
        return target.objectStoreNames || transactionStoreNamesMap.get(target);
      }
      // Make tx.store return the only store in the transaction, or undefined if there are many.
      if (prop === 'store') {
        return receiver.objectStoreNames[1] ? undefined : receiver.objectStore(receiver.objectStoreNames[0]);
      }
    }
    // Else transform whatever we get back.
    return wrap(target[prop]);
  },
  set(target, prop, value) {
    target[prop] = value;
    return true;
  },
  has(target, prop) {
    if (target instanceof IDBTransaction && (prop === 'done' || prop === 'store')) {
      return true;
    }
    return prop in target;
  }
};
function replaceTraps(callback) {
  idbProxyTraps = callback(idbProxyTraps);
}
function wrapFunction(func) {
  // Due to expected object equality (which is enforced by the caching in `wrap`), we
  // only create one new func per func.
  // Edge doesn't support objectStoreNames (booo), so we polyfill it here.
  if (func === IDBDatabase.prototype.transaction && !('objectStoreNames' in IDBTransaction.prototype)) {
    return function (storeNames, ...args) {
      const tx = func.call(unwrap(this), storeNames, ...args);
      transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);
      return wrap(tx);
    };
  }
  // Cursor methods are special, as the behaviour is a little more different to standard IDB. In
  // IDB, you advance the cursor and wait for a new 'success' on the IDBRequest that gave you the
  // cursor. It's kinda like a promise that can resolve with many values. That doesn't make sense
  // with real promises, so each advance methods returns a new promise for the cursor object, or
  // undefined if the end of the cursor has been reached.
  if (getCursorAdvanceMethods().includes(func)) {
    return function (...args) {
      // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
      // the original object.
      func.apply(unwrap(this), args);
      return wrap(cursorRequestMap.get(this));
    };
  }
  return function (...args) {
    // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
    // the original object.
    return wrap(func.apply(unwrap(this), args));
  };
}
function transformCachableValue(value) {
  if (typeof value === 'function') return wrapFunction(value);
  // This doesn't return, it just creates a 'done' promise for the transaction,
  // which is later returned for transaction.done (see idbObjectHandler).
  if (value instanceof IDBTransaction) cacheDonePromiseForTransaction(value);
  if (instanceOfAny(value, getIdbProxyableTypes())) return new Proxy(value, idbProxyTraps);
  // Return the same value back if we're not going to transform it.
  return value;
}
function wrap(value) {
  // We sometimes generate multiple promises from a single IDBRequest (eg when cursoring), because
  // IDB is weird and a single IDBRequest can yield many responses, so these can't be cached.
  if (value instanceof IDBRequest) return promisifyRequest(value);
  // If we've already transformed this value before, reuse the transformed value.
  // This is faster, but it also provides object equality.
  if (transformCache.has(value)) return transformCache.get(value);
  const newValue = transformCachableValue(value);
  // Not all types are transformed.
  // These may be primitive types, so they can't be WeakMap keys.
  if (newValue !== value) {
    transformCache.set(value, newValue);
    reverseTransformCache.set(newValue, value);
  }
  return newValue;
}
const unwrap = value => reverseTransformCache.get(value);

/**
 * Open a database.
 *
 * @param name Name of the database.
 * @param version Schema version.
 * @param callbacks Additional callbacks.
 */
function openDB(name, version, {
  blocked,
  upgrade,
  blocking,
  terminated
} = {}) {
  const request = indexedDB.open(name, version);
  const openPromise = wrap(request);
  if (upgrade) {
    request.addEventListener('upgradeneeded', event => {
      upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction));
    });
  }
  if (blocked) request.addEventListener('blocked', () => blocked());
  openPromise.then(db => {
    if (terminated) db.addEventListener('close', () => terminated());
    if (blocking) db.addEventListener('versionchange', () => blocking());
  }).catch(() => {});
  return openPromise;
}
const readMethods = ['get', 'getKey', 'getAll', 'getAllKeys', 'count'];
const writeMethods = ['put', 'add', 'delete', 'clear'];
const cachedMethods = new Map();
function getMethod(target, prop) {
  if (!(target instanceof IDBDatabase && !(prop in target) && typeof prop === 'string')) {
    return;
  }
  if (cachedMethods.get(prop)) return cachedMethods.get(prop);
  const targetFuncName = prop.replace(/FromIndex$/, '');
  const useIndex = prop !== targetFuncName;
  const isWrite = writeMethods.includes(targetFuncName);
  if (
  // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
  !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) || !(isWrite || readMethods.includes(targetFuncName))) {
    return;
  }
  const method = async function (storeName, ...args) {
    // isWrite ? 'readwrite' : undefined gzipps better, but fails in Edge :(
    const tx = this.transaction(storeName, isWrite ? 'readwrite' : 'readonly');
    let target = tx.store;
    if (useIndex) target = target.index(args.shift());
    // Must reject if op rejects.
    // If it's a write operation, must reject if tx.done rejects.
    // Must reject with op rejection first.
    // Must resolve with op value.
    // Must handle both promises (no unhandled rejections)
    return (await Promise.all([target[targetFuncName](...args), isWrite && tx.done]))[0];
  };
  cachedMethods.set(prop, method);
  return method;
}
replaceTraps(oldTraps => ({
  ...oldTraps,
  get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
  has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop)
}));

// Otherwise it often pulls just one record per transaction, as it's hitting up against the high water mark
const TWENTY_MEGABYTES_IN_BYTES = 20 * 1024 * 1024;

// If we just let the normal highWaterMark mechanism work, it might pull only one record at a time, which is not ideal given the cost of starting a transaction. Make it too high, and the progress bar becomes unrealistic (especially when uploading to Dropbox which is slower than writing to disk) because it is measured from reading the database, not the end of the stream.
const highWaterMark = TWENTY_MEGABYTES_IN_BYTES;
const minSizePerPull = TWENTY_MEGABYTES_IN_BYTES;
const stringSizeInBytes = str => {
  if (!str) {
    return 0;
  }

  // https://stackoverflow.com/a/23329386/786644
  let s = str.length;
  for (let i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i);
    if (code > 0x7f && code <= 0x7ff) s++;else if (code > 0x7ff && code <= 0xffff) s += 2;
    if (code >= 0xdc00 && code <= 0xdfff) i--;
  }
  return s;
};
const NUM_SPACES_IN_TAB = 2;
const makeExportStream = async (storesInput, {
  compressed = false,
  filter = {},
  forEach = {},
  map = {},
  name,
  hasHistoricalData,
  onPercentDone,
  onProcessingStore
}) => {
  const lid = local.getState().lid;
  if (lid === undefined) {
    throw new Error("Missing lid");
  }

  // Don't worry about upgrades or anything, because this function will only be called if the league database already exists
  const leagueDB = await openDB(`league${lid}`, MAX_SUPPORTED_LEAGUE_VERSION, {
    blocking() {
      leagueDB.close();
    }
  });

  // Always flush before export, so export is current!
  await toWorker("main", "idbCacheFlush", undefined);
  const space = compressed ? "" : " ";
  const tab = compressed ? "" : " ".repeat(NUM_SPACES_IN_TAB);
  const newline = compressed ? "" : "\n";
  const jsonStringify = (object, indentationLevels) => {
    if (compressed) {
      return JSON.stringify(object);
    }
    const json = JSON.stringify(object, null, NUM_SPACES_IN_TAB);
    return json.replace(/\n/g, `\n${tab.repeat(indentationLevels)}`);
  };
  const stores = storesInput.filter(store => store !== "teamSeasons" && store !== "teamStats");
  const includeTeamSeasonsAndStats = stores.length !== storesInput.length;
  const writeRootObject = (controller, name, object) => controller.enqueue(
  // @ts-expect-error Typescript 4.9 bug I think
  `,${newline}${tab}"${name}":${space}${jsonStringify(object, 1)}`);
  let storeIndex = 0;
  let prevKey;
  let prevStore;
  let cancelCallback;
  const enqueuedFirstRecord = new Set();
  let hasGameAttributesStartingSeason = false;
  let numRecordsSeen = 0;
  let numRecordsTotal = 0;
  let prevPercentDone = 0;
  const incrementNumRecordsSeen = (count = 1) => {
    numRecordsSeen += count;
    if (onPercentDone) {
      const percentDone = Math.round(numRecordsSeen / numRecordsTotal * 100);
      if (percentDone !== prevPercentDone) {
        onPercentDone(percentDone);
        prevPercentDone = percentDone;
      }
    }
  };
  return new ReadableStream({
    async start(controller) {
      const tx = leagueDB.transaction(storesInput);
      for (const store of storesInput) {
        if (store === "gameAttributes") {
          numRecordsTotal += 1;
        } else {
          numRecordsTotal += await tx.objectStore(store).count();
        }
      }
      await controller.enqueue(`{${newline}${tab}"version":${space}${MAX_SUPPORTED_LEAGUE_VERSION}`);

      // If name is specified, include it in meta object. Currently this is only used when importing leagues, to set the name
      if (name) {
        await writeRootObject(controller, "meta", {
          name
        });
      }
    },
    async pull(controller) {
      // console.log("PULL", controller.desiredSize / 1024 / 1024);
      const done = () => {
        if (cancelCallback) {
          cancelCallback();
        }
        controller.close();
        leagueDB.close();
      };
      if (cancelCallback) {
        done();
        return;
      }

      // let count = 0;
      let size = 0;
      const enqueue = string => {
        size += stringSizeInBytes(string);
        controller.enqueue(string);
      };
      const store = stores[storeIndex];
      if (onProcessingStore && store !== prevStore) {
        onProcessingStore(store);
      }

      // Define this up here so it is undefined for gameAttributes, triggering the "go to next store" logic at the bottom
      let cursor;
      if (store === "gameAttributes") {
        // gameAttributes is special because we need to convert it into an object
        let rows = (await leagueDB.getAll(store)).filter(row => !gameAttributesCache.includes(row.key));
        if (filter[store]) {
          rows = rows.filter(filter[store]);
        }

        // No need to include settings that don't apply to this sport

        rows = rows.filter(row => !gameAttributesKeysOtherSports.has(row.key));
        if (forEach[store]) {
          for (const row of rows) {
            forEach[store](row);
          }
        }
        if (map[store]) {
          rows = rows.map(map[store]);
        }
        const gameAttributesObject = gameAttributesArrayToObject(rows);
        hasGameAttributesStartingSeason = gameAttributesObject.startingSeason !== undefined;
        await writeRootObject(controller, "gameAttributes", gameAttributesObject);
        incrementNumRecordsSeen();
      } else {
        const txStores = store === "teams" ? ["teams", "teamSeasons", "teamStats"] : [store];
        const transaction = leagueDB.transaction(txStores);
        const range = prevKey !== undefined ? IDBKeyRange.lowerBound(prevKey, true) : undefined;
        cursor = await transaction.objectStore(store).openCursor(range);
        while (cursor) {
          let value = cursor.value;
          if (!filter[store] || filter[store](value)) {
            // count += 1;

            const enqueuedFirst = enqueuedFirstRecord.has(store);
            const comma = enqueuedFirst ? "," : "";
            if (!enqueuedFirst) {
              enqueue(`,${newline}${tab}"${store}": [`);
              enqueuedFirstRecord.add(store);
            }
            if (forEach[store]) {
              forEach[store](value);
            }
            if (store === "players") {
              if (value.imgURL) {
                delete value.face;
              }
            }
            if (map[store]) {
              value = map[store](value);
            }
            if (store === "teams" && includeTeamSeasonsAndStats) {
              // This is a bit dangerous, since it will possibly read all teamStats/teamSeasons rows into memory, but that will very rarely exceed MIN_RECORDS_PER_PULL and we will just do one team per transaction, to be safe.

              const tid = value.tid;
              const infos = [{
                key: "seasons",
                store: "teamSeasons",
                index: "tid, season",
                keyRange: IDBKeyRange.bound([tid], [tid, ""])
              }, {
                key: "stats",
                store: "teamStats",
                index: "tid",
                keyRange: IDBKeyRange.only(tid)
              }];
              const t = value;
              for (const info of infos) {
                t[info.key] = [];
                let cursor2 = await transaction.objectStore(info.store).index(info.index).openCursor(info.keyRange);
                while (cursor2) {
                  t[info.key].push(cursor2.value);
                  cursor2 = await cursor2.continue();
                }
                incrementNumRecordsSeen(t[info.key].length);
              }
            }
            enqueue(`${comma}${newline}${tab.repeat(2)}${jsonStringify(value, 2)}`);
          }
          incrementNumRecordsSeen();
          prevKey = cursor.key;
          const desiredSize = controller.desiredSize;
          if ((desiredSize > 0 || size < minSizePerPull) && !cancelCallback) {
            // Keep going if desiredSize or minSizePerPull want us to
            cursor = await cursor.continue();
          } else {
            break;
          }
        }
      }

      // console.log("PULLED", count, size / 1024 / 1024);
      if (!cursor) {
        // Actually done with this store - we didn't just stop due to desiredSize
        storeIndex += 1;
        prevKey = undefined;
        if (enqueuedFirstRecord.has(store)) {
          enqueue(`${newline}${tab}]`);
        } else {
          // Ensure we don't ever enqueue nothing, in which case the stream can get stuck
          enqueue("");
        }
        if (storeIndex >= stores.length) {
          // Done whole export!

          if (!stores.includes("gameAttributes") || hasHistoricalData && !hasGameAttributesStartingSeason) {
            // Set startingSeason if gameAttributes is not selected, otherwise it's going to fail loading unless startingSeason is coincidentally the same as the default
            await writeRootObject(controller, "startingSeason", (await leagueDB.get("gameAttributes", "startingSeason"))?.value);
          }
          await controller.enqueue(`${newline}}${newline}`);
          done();
        }
      }
    },
    cancel() {
      return new Promise(resolve => {
        cancelCallback = resolve;
      });
    }
  }, {
    highWaterMark,
    size: stringSizeInBytes
  });
};
var makeExportStream$1 = makeExportStream;

var StreamSaverExports = {};
var StreamSaver = {
  get exports(){ return StreamSaverExports; },
  set exports(v){ StreamSaverExports = v; },
};

/*! streamsaver. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */

(function (module) {
	((name, definition) => {
	  module.exports = definition() ;
	})('streamSaver', () => {

	  const global = typeof window === 'object' ? window : this;
	  if (!global.HTMLElement) console.warn('streamsaver is meant to run on browsers main thread');
	  let mitmTransporter = null;
	  let supportsTransferable = false;
	  const test = fn => {
	    try {
	      fn();
	    } catch (e) {}
	  };
	  const ponyfill = global.WebStreamsPolyfill || {};
	  const isSecureContext = global.isSecureContext;
	  // TODO: Must come up with a real detection test (#69)
	  let useBlobFallback = /constructor/i.test(global.HTMLElement) || !!global.safari || !!global.WebKitPoint;
	  const downloadStrategy = isSecureContext || 'MozAppearance' in document.documentElement.style ? 'iframe' : 'navigate';
	  const streamSaver = {
	    createWriteStream,
	    WritableStream: global.WritableStream || ponyfill.WritableStream,
	    supported: true,
	    version: {
	      full: '2.0.5',
	      major: 2,
	      minor: 0,
	      dot: 5
	    },
	    mitm: 'https://jimmywarting.github.io/StreamSaver.js/mitm.html?version=2.0.0'
	  };

	  /**
	   * create a hidden iframe and append it to the DOM (body)
	   *
	   * @param  {string} src page to load
	   * @return {HTMLIFrameElement} page to load
	   */
	  function makeIframe(src) {
	    if (!src) throw new Error('meh');
	    const iframe = document.createElement('iframe');
	    iframe.hidden = true;
	    iframe.src = src;
	    iframe.loaded = false;
	    iframe.name = 'iframe';
	    iframe.isIframe = true;
	    iframe.postMessage = (...args) => iframe.contentWindow.postMessage(...args);
	    iframe.addEventListener('load', () => {
	      iframe.loaded = true;
	    }, {
	      once: true
	    });
	    document.body.appendChild(iframe);
	    return iframe;
	  }

	  /**
	   * create a popup that simulates the basic things
	   * of what a iframe can do
	   *
	   * @param  {string} src page to load
	   * @return {object}     iframe like object
	   */
	  function makePopup(src) {
	    const options = 'width=200,height=100';
	    const delegate = document.createDocumentFragment();
	    const popup = {
	      frame: global.open(src, 'popup', options),
	      loaded: false,
	      isIframe: false,
	      isPopup: true,
	      remove() {
	        popup.frame.close();
	      },
	      addEventListener(...args) {
	        delegate.addEventListener(...args);
	      },
	      dispatchEvent(...args) {
	        delegate.dispatchEvent(...args);
	      },
	      removeEventListener(...args) {
	        delegate.removeEventListener(...args);
	      },
	      postMessage(...args) {
	        popup.frame.postMessage(...args);
	      }
	    };
	    const onReady = evt => {
	      if (evt.source === popup.frame) {
	        popup.loaded = true;
	        global.removeEventListener('message', onReady);
	        popup.dispatchEvent(new Event('load'));
	      }
	    };
	    global.addEventListener('message', onReady);
	    return popup;
	  }
	  try {
	    // We can't look for service worker since it may still work on http
	    new Response(new ReadableStream());
	    if (isSecureContext && !('serviceWorker' in navigator)) {
	      useBlobFallback = true;
	    }
	  } catch (err) {
	    useBlobFallback = true;
	  }
	  test(() => {
	    // Transferable stream was first enabled in chrome v73 behind a flag
	    const {
	      readable
	    } = new TransformStream();
	    const mc = new MessageChannel();
	    mc.port1.postMessage(readable, [readable]);
	    mc.port1.close();
	    mc.port2.close();
	    supportsTransferable = true;
	    // Freeze TransformStream object (can only work with native)
	    Object.defineProperty(streamSaver, 'TransformStream', {
	      configurable: false,
	      writable: false,
	      value: TransformStream
	    });
	  });
	  function loadTransporter() {
	    if (!mitmTransporter) {
	      mitmTransporter = isSecureContext ? makeIframe(streamSaver.mitm) : makePopup(streamSaver.mitm);
	    }
	  }

	  /**
	   * @param  {string} filename filename that should be used
	   * @param  {object} options  [description]
	   * @param  {number} size     deprecated
	   * @return {WritableStream<Uint8Array>}
	   */
	  function createWriteStream(filename, options, size) {
	    let opts = {
	      size: null,
	      pathname: null,
	      writableStrategy: undefined,
	      readableStrategy: undefined
	    };
	    let bytesWritten = 0; // by StreamSaver.js (not the service worker)
	    let downloadUrl = null;
	    let channel = null;
	    let ts = null;

	    // normalize arguments
	    if (Number.isFinite(options)) {
	      [size, options] = [options, size];
	      console.warn('[StreamSaver] Deprecated pass an object as 2nd argument when creating a write stream');
	      opts.size = size;
	      opts.writableStrategy = options;
	    } else if (options && options.highWaterMark) {
	      console.warn('[StreamSaver] Deprecated pass an object as 2nd argument when creating a write stream');
	      opts.size = size;
	      opts.writableStrategy = options;
	    } else {
	      opts = options || {};
	    }
	    if (!useBlobFallback) {
	      loadTransporter();
	      channel = new MessageChannel();

	      // Make filename RFC5987 compatible
	      filename = encodeURIComponent(filename.replace(/\//g, ':')).replace(/['()]/g, escape).replace(/\*/g, '%2A');
	      const response = {
	        transferringReadable: supportsTransferable,
	        pathname: opts.pathname || Math.random().toString().slice(-6) + '/' + filename,
	        headers: {
	          'Content-Type': 'application/octet-stream; charset=utf-8',
	          'Content-Disposition': "attachment; filename*=UTF-8''" + filename
	        }
	      };
	      if (opts.size) {
	        response.headers['Content-Length'] = opts.size;
	      }
	      const args = [response, '*', [channel.port2]];
	      if (supportsTransferable) {
	        const transformer = downloadStrategy === 'iframe' ? undefined : {
	          // This transformer & flush method is only used by insecure context.
	          transform(chunk, controller) {
	            if (!(chunk instanceof Uint8Array)) {
	              throw new TypeError('Can only write Uint8Arrays');
	            }
	            bytesWritten += chunk.length;
	            controller.enqueue(chunk);
	            if (downloadUrl) {
	              location.href = downloadUrl;
	              downloadUrl = null;
	            }
	          },
	          flush() {
	            if (downloadUrl) {
	              location.href = downloadUrl;
	            }
	          }
	        };
	        ts = new streamSaver.TransformStream(transformer, opts.writableStrategy, opts.readableStrategy);
	        const readableStream = ts.readable;
	        channel.port1.postMessage({
	          readableStream
	        }, [readableStream]);
	      }
	      channel.port1.onmessage = evt => {
	        // Service worker sent us a link that we should open.
	        if (evt.data.download) {
	          // Special treatment for popup...
	          if (downloadStrategy === 'navigate') {
	            mitmTransporter.remove();
	            mitmTransporter = null;
	            if (bytesWritten) {
	              location.href = evt.data.download;
	            } else {
	              downloadUrl = evt.data.download;
	            }
	          } else {
	            if (mitmTransporter.isPopup) {
	              mitmTransporter.remove();
	              mitmTransporter = null;
	              // Special case for firefox, they can keep sw alive with fetch
	              if (downloadStrategy === 'iframe') {
	                makeIframe(streamSaver.mitm);
	              }
	            }

	            // We never remove this iframes b/c it can interrupt saving
	            makeIframe(evt.data.download);
	          }
	        } else if (evt.data.abort) {
	          chunks = [];
	          channel.port1.postMessage('abort'); //send back so controller is aborted
	          channel.port1.onmessage = null;
	          channel.port1.close();
	          channel.port2.close();
	          channel = null;
	        }
	      };
	      if (mitmTransporter.loaded) {
	        mitmTransporter.postMessage(...args);
	      } else {
	        mitmTransporter.addEventListener('load', () => {
	          mitmTransporter.postMessage(...args);
	        }, {
	          once: true
	        });
	      }
	    }
	    let chunks = [];
	    return !useBlobFallback && ts && ts.writable || new streamSaver.WritableStream({
	      write(chunk) {
	        if (!(chunk instanceof Uint8Array)) {
	          throw new TypeError('Can only write Uint8Arrays');
	        }
	        if (useBlobFallback) {
	          // Safari... The new IE6
	          // https://github.com/jimmywarting/StreamSaver.js/issues/69
	          //
	          // even though it has everything it fails to download anything
	          // that comes from the service worker..!
	          chunks.push(chunk);
	          return;
	        }

	        // is called when a new chunk of data is ready to be written
	        // to the underlying sink. It can return a promise to signal
	        // success or failure of the write operation. The stream
	        // implementation guarantees that this method will be called
	        // only after previous writes have succeeded, and never after
	        // close or abort is called.

	        // TODO: Kind of important that service worker respond back when
	        // it has been written. Otherwise we can't handle backpressure
	        // EDIT: Transferable streams solves this...
	        channel.port1.postMessage(chunk);
	        bytesWritten += chunk.length;
	        if (downloadUrl) {
	          location.href = downloadUrl;
	          downloadUrl = null;
	        }
	      },
	      close() {
	        if (useBlobFallback) {
	          const blob = new Blob(chunks, {
	            type: 'application/octet-stream; charset=utf-8'
	          });
	          const link = document.createElement('a');
	          link.href = URL.createObjectURL(blob);
	          link.download = filename;
	          link.click();
	        } else {
	          channel.port1.postMessage('end');
	        }
	      },
	      abort() {
	        chunks = [];
	        channel.port1.postMessage('abort');
	        channel.port1.onmessage = null;
	        channel.port1.close();
	        channel.port2.close();
	        channel = null;
	      }
	    }, opts.writableStrategy);
	  }
	  return streamSaver;
	});
} (StreamSaver));

var streamSaver = StreamSaverExports;

const HAS_FILE_SYSTEM_ACCESS_API = !!window.showSaveFilePicker;

// Why is this in UI? streamsaver does not work in worker. Otherwise it would be better there.
// If this is ever moved to the worker, be careful about file system access API crashing Chrome 93/94 https://dumbmatter.com/file-system-access-worker-bug/
const downloadFileStream = async (stream, filename) => {
  if (stream) {
    let fileStream;
    if (HAS_FILE_SYSTEM_ACCESS_API) {
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [{
          description: "JSON Files",
          accept: {
            "application/json": [".json"]
          }
        }]
      });
      fileStream = await fileHandle.createWritable();
    } else {
      // This is needed because we asynchronously load the stream polyfill
      streamSaver.WritableStream = window.WritableStream;
      fileStream = streamSaver.createWriteStream(filename);
    }
    return fileStream;
  }
  const contents = [];
  const fileStream = new WritableStream({
    write(chunk) {
      contents.push(chunk);
    },
    close() {
      downloadFile(filename, contents, "application/json");
    }
  });
  return fileStream;
};
var downloadFileStream$1 = downloadFileStream;

export { downloadFileStream$1 as downloadFileStream, makeExportStream$1 as makeExportStream };
