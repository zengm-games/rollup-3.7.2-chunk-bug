import { B as Bugsnag, R as React, r as reactExports, j as jsxRuntimeExports, T as TransitionWrapper, t as transitionEndListener, c as classnamesExports, s as style, E as EXITED, a as EXITING, b as ENTERING, d as ENTERED, e as triggerBrowserReflow, S as SelectableContext, N as NavContext, f as dataAttr, u as useEventCallback, m as makeEventKey, g as Button, h as useForceUpdate, i as useMergedRefs, k as dataProp, q as qsa, l as createWithBsPrefix, n as useBootstrapPrefix, A as Anchor, o as useUncontrolled, p as NavbarContext, v as useIsomorphicEffect, w as AbstractModalHeader, x as divWithClassName, M as ModalContext, y as BaseModal, F as Fade, z as BootstrapModalManager, C as getSharedManager, D as loadFeatures, L as LazyContext, G as useLocalPartial, H as menuItems, I as localActions, J as safeLocalStorage$1, K as CollapseArrow, O as AnimatePresence, P as m, Q as helpers, U as logEvent$1, W as WrappedModal, V as realtimeUpdate, X as toWorker$1, Y as groupBy, Z as matchSorter, _ as orderBy, $ as sAgo, a0 as React$1, a1 as useTitleBar, a2 as emitter, a3 as ScoreBox, a4 as GameLinks, a5 as Dropdown, a6 as local$1, a7 as confirm$1, a8 as useViewData, a9 as OverlayTrigger, aa as Popover, ab as Dropdown$1, ac as Notifications, ad as analyticsEvent$1, ae as autoPlayDialog, af as confirmDeleteAllLeagues, ag as requestPersistentStorage, ah as showEvent, ai as ads, aj as util, ak as createRoot, al as router } from './index-fcb3f17e.js';
import { S as SPORT_HAS_REAL_PLAYERS, a as SPORT_HAS_LEGENDS, A as AD_DIVS, G as GAME_ACRONYM, b as SUBREDDIT_NAME, c as GAME_NAME, W as WEBSITE_ROOT, P as PHASE, i as isSport, d as GRACE_PERIOD, E as EMAIL_ADDRESS } from './getCols-55f556d5.js';

/**
 * web-streams-polyfill v3.2.1
 */
/// <reference lib="es2015.symbol" />
const SymbolPolyfill = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? Symbol : description => `Symbol(${description})`;

/// <reference lib="dom" />
function noop$2() {
  return undefined;
}
function getGlobals() {
  if (typeof self !== 'undefined') {
    return self;
  } else if (typeof window !== 'undefined') {
    return window;
  } else if (typeof global !== 'undefined') {
    return global;
  }
  return undefined;
}
const globals = getGlobals();
function typeIsObject$1(x) {
  return typeof x === 'object' && x !== null || typeof x === 'function';
}
const rethrowAssertionErrorRejection = noop$2;
const originalPromise = Promise;
const originalPromiseThen = Promise.prototype.then;
const originalPromiseResolve = Promise.resolve.bind(originalPromise);
const originalPromiseReject = Promise.reject.bind(originalPromise);
function newPromise(executor) {
  return new originalPromise(executor);
}
function promiseResolvedWith(value) {
  return originalPromiseResolve(value);
}
function promiseRejectedWith(reason) {
  return originalPromiseReject(reason);
}
function PerformPromiseThen(promise, onFulfilled, onRejected) {
  // There doesn't appear to be any way to correctly emulate the behaviour from JavaScript, so this is just an
  // approximation.
  return originalPromiseThen.call(promise, onFulfilled, onRejected);
}
function uponPromise(promise, onFulfilled, onRejected) {
  PerformPromiseThen(PerformPromiseThen(promise, onFulfilled, onRejected), undefined, rethrowAssertionErrorRejection);
}
function uponFulfillment(promise, onFulfilled) {
  uponPromise(promise, onFulfilled);
}
function uponRejection(promise, onRejected) {
  uponPromise(promise, undefined, onRejected);
}
function transformPromiseWith(promise, fulfillmentHandler, rejectionHandler) {
  return PerformPromiseThen(promise, fulfillmentHandler, rejectionHandler);
}
function setPromiseIsHandledToTrue(promise) {
  PerformPromiseThen(promise, undefined, rethrowAssertionErrorRejection);
}
const queueMicrotask = (() => {
  const globalQueueMicrotask = globals && globals.queueMicrotask;
  if (typeof globalQueueMicrotask === 'function') {
    return globalQueueMicrotask;
  }
  const resolvedPromise = promiseResolvedWith(undefined);
  return fn => PerformPromiseThen(resolvedPromise, fn);
})();
function reflectCall(F, V, args) {
  if (typeof F !== 'function') {
    throw new TypeError('Argument is not a function');
  }
  return Function.prototype.apply.call(F, V, args);
}
function promiseCall(F, V, args) {
  try {
    return promiseResolvedWith(reflectCall(F, V, args));
  } catch (value) {
    return promiseRejectedWith(value);
  }
}

// Original from Chromium
// https://chromium.googlesource.com/chromium/src/+/0aee4434a4dba42a42abaea9bfbc0cd196a63bc1/third_party/blink/renderer/core/streams/SimpleQueue.js
const QUEUE_MAX_ARRAY_SIZE = 16384;
/**
 * Simple queue structure.
 *
 * Avoids scalability issues with using a packed array directly by using
 * multiple arrays in a linked list and keeping the array size bounded.
 */
class SimpleQueue {
  constructor() {
    this._cursor = 0;
    this._size = 0;
    // _front and _back are always defined.
    this._front = {
      _elements: [],
      _next: undefined
    };
    this._back = this._front;
    // The cursor is used to avoid calling Array.shift().
    // It contains the index of the front element of the array inside the
    // front-most node. It is always in the range [0, QUEUE_MAX_ARRAY_SIZE).
    this._cursor = 0;
    // When there is only one node, size === elements.length - cursor.
    this._size = 0;
  }
  get length() {
    return this._size;
  }
  // For exception safety, this method is structured in order:
  // 1. Read state
  // 2. Calculate required state mutations
  // 3. Perform state mutations
  push(element) {
    const oldBack = this._back;
    let newBack = oldBack;
    if (oldBack._elements.length === QUEUE_MAX_ARRAY_SIZE - 1) {
      newBack = {
        _elements: [],
        _next: undefined
      };
    }
    // push() is the mutation most likely to throw an exception, so it
    // goes first.
    oldBack._elements.push(element);
    if (newBack !== oldBack) {
      this._back = newBack;
      oldBack._next = newBack;
    }
    ++this._size;
  }
  // Like push(), shift() follows the read -> calculate -> mutate pattern for
  // exception safety.
  shift() {
    // must not be called on an empty queue
    const oldFront = this._front;
    let newFront = oldFront;
    const oldCursor = this._cursor;
    let newCursor = oldCursor + 1;
    const elements = oldFront._elements;
    const element = elements[oldCursor];
    if (newCursor === QUEUE_MAX_ARRAY_SIZE) {
      newFront = oldFront._next;
      newCursor = 0;
    }
    // No mutations before this point.
    --this._size;
    this._cursor = newCursor;
    if (oldFront !== newFront) {
      this._front = newFront;
    }
    // Permit shifted element to be garbage collected.
    elements[oldCursor] = undefined;
    return element;
  }
  // The tricky thing about forEach() is that it can be called
  // re-entrantly. The queue may be mutated inside the callback. It is easy to
  // see that push() within the callback has no negative effects since the end
  // of the queue is checked for on every iteration. If shift() is called
  // repeatedly within the callback then the next iteration may return an
  // element that has been removed. In this case the callback will be called
  // with undefined values until we either "catch up" with elements that still
  // exist or reach the back of the queue.
  forEach(callback) {
    let i = this._cursor;
    let node = this._front;
    let elements = node._elements;
    while (i !== elements.length || node._next !== undefined) {
      if (i === elements.length) {
        node = node._next;
        elements = node._elements;
        i = 0;
        if (elements.length === 0) {
          break;
        }
      }
      callback(elements[i]);
      ++i;
    }
  }
  // Return the element that would be returned if shift() was called now,
  // without modifying the queue.
  peek() {
    // must not be called on an empty queue
    const front = this._front;
    const cursor = this._cursor;
    return front._elements[cursor];
  }
}
function ReadableStreamReaderGenericInitialize(reader, stream) {
  reader._ownerReadableStream = stream;
  stream._reader = reader;
  if (stream._state === 'readable') {
    defaultReaderClosedPromiseInitialize(reader);
  } else if (stream._state === 'closed') {
    defaultReaderClosedPromiseInitializeAsResolved(reader);
  } else {
    defaultReaderClosedPromiseInitializeAsRejected(reader, stream._storedError);
  }
}
// A client of ReadableStreamDefaultReader and ReadableStreamBYOBReader may use these functions directly to bypass state
// check.
function ReadableStreamReaderGenericCancel(reader, reason) {
  const stream = reader._ownerReadableStream;
  return ReadableStreamCancel(stream, reason);
}
function ReadableStreamReaderGenericRelease(reader) {
  if (reader._ownerReadableStream._state === 'readable') {
    defaultReaderClosedPromiseReject(reader, new TypeError(`Reader was released and can no longer be used to monitor the stream's closedness`));
  } else {
    defaultReaderClosedPromiseResetToRejected(reader, new TypeError(`Reader was released and can no longer be used to monitor the stream's closedness`));
  }
  reader._ownerReadableStream._reader = undefined;
  reader._ownerReadableStream = undefined;
}
// Helper functions for the readers.
function readerLockException(name) {
  return new TypeError('Cannot ' + name + ' a stream using a released reader');
}
// Helper functions for the ReadableStreamDefaultReader.
function defaultReaderClosedPromiseInitialize(reader) {
  reader._closedPromise = newPromise((resolve, reject) => {
    reader._closedPromise_resolve = resolve;
    reader._closedPromise_reject = reject;
  });
}
function defaultReaderClosedPromiseInitializeAsRejected(reader, reason) {
  defaultReaderClosedPromiseInitialize(reader);
  defaultReaderClosedPromiseReject(reader, reason);
}
function defaultReaderClosedPromiseInitializeAsResolved(reader) {
  defaultReaderClosedPromiseInitialize(reader);
  defaultReaderClosedPromiseResolve(reader);
}
function defaultReaderClosedPromiseReject(reader, reason) {
  if (reader._closedPromise_reject === undefined) {
    return;
  }
  setPromiseIsHandledToTrue(reader._closedPromise);
  reader._closedPromise_reject(reason);
  reader._closedPromise_resolve = undefined;
  reader._closedPromise_reject = undefined;
}
function defaultReaderClosedPromiseResetToRejected(reader, reason) {
  defaultReaderClosedPromiseInitializeAsRejected(reader, reason);
}
function defaultReaderClosedPromiseResolve(reader) {
  if (reader._closedPromise_resolve === undefined) {
    return;
  }
  reader._closedPromise_resolve(undefined);
  reader._closedPromise_resolve = undefined;
  reader._closedPromise_reject = undefined;
}
const AbortSteps = SymbolPolyfill('[[AbortSteps]]');
const ErrorSteps = SymbolPolyfill('[[ErrorSteps]]');
const CancelSteps = SymbolPolyfill('[[CancelSteps]]');
const PullSteps = SymbolPolyfill('[[PullSteps]]');

/// <reference lib="es2015.core" />
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite#Polyfill
const NumberIsFinite = Number.isFinite || function (x) {
  return typeof x === 'number' && isFinite(x);
};

/// <reference lib="es2015.core" />
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc#Polyfill
const MathTrunc = Math.trunc || function (v) {
  return v < 0 ? Math.ceil(v) : Math.floor(v);
};

// https://heycam.github.io/webidl/#idl-dictionaries
function isDictionary(x) {
  return typeof x === 'object' || typeof x === 'function';
}
function assertDictionary(obj, context) {
  if (obj !== undefined && !isDictionary(obj)) {
    throw new TypeError(`${context} is not an object.`);
  }
}
// https://heycam.github.io/webidl/#idl-callback-functions
function assertFunction(x, context) {
  if (typeof x !== 'function') {
    throw new TypeError(`${context} is not a function.`);
  }
}
// https://heycam.github.io/webidl/#idl-object
function isObject(x) {
  return typeof x === 'object' && x !== null || typeof x === 'function';
}
function assertObject(x, context) {
  if (!isObject(x)) {
    throw new TypeError(`${context} is not an object.`);
  }
}
function assertRequiredArgument(x, position, context) {
  if (x === undefined) {
    throw new TypeError(`Parameter ${position} is required in '${context}'.`);
  }
}
function assertRequiredField(x, field, context) {
  if (x === undefined) {
    throw new TypeError(`${field} is required in '${context}'.`);
  }
}
// https://heycam.github.io/webidl/#idl-unrestricted-double
function convertUnrestrictedDouble(value) {
  return Number(value);
}
function censorNegativeZero(x) {
  return x === 0 ? 0 : x;
}
function integerPart(x) {
  return censorNegativeZero(MathTrunc(x));
}
// https://heycam.github.io/webidl/#idl-unsigned-long-long
function convertUnsignedLongLongWithEnforceRange(value, context) {
  const lowerBound = 0;
  const upperBound = Number.MAX_SAFE_INTEGER;
  let x = Number(value);
  x = censorNegativeZero(x);
  if (!NumberIsFinite(x)) {
    throw new TypeError(`${context} is not a finite number`);
  }
  x = integerPart(x);
  if (x < lowerBound || x > upperBound) {
    throw new TypeError(`${context} is outside the accepted range of ${lowerBound} to ${upperBound}, inclusive`);
  }
  if (!NumberIsFinite(x) || x === 0) {
    return 0;
  }
  // TODO Use BigInt if supported?
  // let xBigInt = BigInt(integerPart(x));
  // xBigInt = BigInt.asUintN(64, xBigInt);
  // return Number(xBigInt);
  return x;
}
function assertReadableStream(x, context) {
  if (!IsReadableStream(x)) {
    throw new TypeError(`${context} is not a ReadableStream.`);
  }
}

// Abstract operations for the ReadableStream.
function AcquireReadableStreamDefaultReader(stream) {
  return new ReadableStreamDefaultReader(stream);
}
// ReadableStream API exposed for controllers.
function ReadableStreamAddReadRequest(stream, readRequest) {
  stream._reader._readRequests.push(readRequest);
}
function ReadableStreamFulfillReadRequest(stream, chunk, done) {
  const reader = stream._reader;
  const readRequest = reader._readRequests.shift();
  if (done) {
    readRequest._closeSteps();
  } else {
    readRequest._chunkSteps(chunk);
  }
}
function ReadableStreamGetNumReadRequests(stream) {
  return stream._reader._readRequests.length;
}
function ReadableStreamHasDefaultReader(stream) {
  const reader = stream._reader;
  if (reader === undefined) {
    return false;
  }
  if (!IsReadableStreamDefaultReader(reader)) {
    return false;
  }
  return true;
}
/**
 * A default reader vended by a {@link ReadableStream}.
 *
 * @public
 */
class ReadableStreamDefaultReader {
  constructor(stream) {
    assertRequiredArgument(stream, 1, 'ReadableStreamDefaultReader');
    assertReadableStream(stream, 'First parameter');
    if (IsReadableStreamLocked(stream)) {
      throw new TypeError('This stream has already been locked for exclusive reading by another reader');
    }
    ReadableStreamReaderGenericInitialize(this, stream);
    this._readRequests = new SimpleQueue();
  }
  /**
   * Returns a promise that will be fulfilled when the stream becomes closed,
   * or rejected if the stream ever errors or the reader's lock is released before the stream finishes closing.
   */
  get closed() {
    if (!IsReadableStreamDefaultReader(this)) {
      return promiseRejectedWith(defaultReaderBrandCheckException('closed'));
    }
    return this._closedPromise;
  }
  /**
   * If the reader is active, behaves the same as {@link ReadableStream.cancel | stream.cancel(reason)}.
   */
  cancel(reason = undefined) {
    if (!IsReadableStreamDefaultReader(this)) {
      return promiseRejectedWith(defaultReaderBrandCheckException('cancel'));
    }
    if (this._ownerReadableStream === undefined) {
      return promiseRejectedWith(readerLockException('cancel'));
    }
    return ReadableStreamReaderGenericCancel(this, reason);
  }
  /**
   * Returns a promise that allows access to the next chunk from the stream's internal queue, if available.
   *
   * If reading a chunk causes the queue to become empty, more data will be pulled from the underlying source.
   */
  read() {
    if (!IsReadableStreamDefaultReader(this)) {
      return promiseRejectedWith(defaultReaderBrandCheckException('read'));
    }
    if (this._ownerReadableStream === undefined) {
      return promiseRejectedWith(readerLockException('read from'));
    }
    let resolvePromise;
    let rejectPromise;
    const promise = newPromise((resolve, reject) => {
      resolvePromise = resolve;
      rejectPromise = reject;
    });
    const readRequest = {
      _chunkSteps: chunk => resolvePromise({
        value: chunk,
        done: false
      }),
      _closeSteps: () => resolvePromise({
        value: undefined,
        done: true
      }),
      _errorSteps: e => rejectPromise(e)
    };
    ReadableStreamDefaultReaderRead(this, readRequest);
    return promise;
  }
  /**
   * Releases the reader's lock on the corresponding stream. After the lock is released, the reader is no longer active.
   * If the associated stream is errored when the lock is released, the reader will appear errored in the same way
   * from now on; otherwise, the reader will appear closed.
   *
   * A reader's lock cannot be released while it still has a pending read request, i.e., if a promise returned by
   * the reader's {@link ReadableStreamDefaultReader.read | read()} method has not yet been settled. Attempting to
   * do so will throw a `TypeError` and leave the reader locked to the stream.
   */
  releaseLock() {
    if (!IsReadableStreamDefaultReader(this)) {
      throw defaultReaderBrandCheckException('releaseLock');
    }
    if (this._ownerReadableStream === undefined) {
      return;
    }
    if (this._readRequests.length > 0) {
      throw new TypeError('Tried to release a reader lock when that reader has pending read() calls un-settled');
    }
    ReadableStreamReaderGenericRelease(this);
  }
}
Object.defineProperties(ReadableStreamDefaultReader.prototype, {
  cancel: {
    enumerable: true
  },
  read: {
    enumerable: true
  },
  releaseLock: {
    enumerable: true
  },
  closed: {
    enumerable: true
  }
});
if (typeof SymbolPolyfill.toStringTag === 'symbol') {
  Object.defineProperty(ReadableStreamDefaultReader.prototype, SymbolPolyfill.toStringTag, {
    value: 'ReadableStreamDefaultReader',
    configurable: true
  });
}
// Abstract operations for the readers.
function IsReadableStreamDefaultReader(x) {
  if (!typeIsObject$1(x)) {
    return false;
  }
  if (!Object.prototype.hasOwnProperty.call(x, '_readRequests')) {
    return false;
  }
  return x instanceof ReadableStreamDefaultReader;
}
function ReadableStreamDefaultReaderRead(reader, readRequest) {
  const stream = reader._ownerReadableStream;
  stream._disturbed = true;
  if (stream._state === 'closed') {
    readRequest._closeSteps();
  } else if (stream._state === 'errored') {
    readRequest._errorSteps(stream._storedError);
  } else {
    stream._readableStreamController[PullSteps](readRequest);
  }
}
// Helper functions for the ReadableStreamDefaultReader.
function defaultReaderBrandCheckException(name) {
  return new TypeError(`ReadableStreamDefaultReader.prototype.${name} can only be used on a ReadableStreamDefaultReader`);
}

/// <reference lib="es2018.asynciterable" />
let AsyncIteratorPrototype;
if (typeof SymbolPolyfill.asyncIterator === 'symbol') {
  // We're running inside a ES2018+ environment, but we're compiling to an older syntax.
  // We cannot access %AsyncIteratorPrototype% without non-ES2018 syntax, but we can re-create it.
  AsyncIteratorPrototype = {
    // 25.1.3.1 %AsyncIteratorPrototype% [ @@asyncIterator ] ( )
    // https://tc39.github.io/ecma262/#sec-asynciteratorprototype-asynciterator
    [SymbolPolyfill.asyncIterator]() {
      return this;
    }
  };
  Object.defineProperty(AsyncIteratorPrototype, SymbolPolyfill.asyncIterator, {
    enumerable: false
  });
}

/// <reference lib="es2018.asynciterable" />
class ReadableStreamAsyncIteratorImpl {
  constructor(reader, preventCancel) {
    this._ongoingPromise = undefined;
    this._isFinished = false;
    this._reader = reader;
    this._preventCancel = preventCancel;
  }
  next() {
    const nextSteps = () => this._nextSteps();
    this._ongoingPromise = this._ongoingPromise ? transformPromiseWith(this._ongoingPromise, nextSteps, nextSteps) : nextSteps();
    return this._ongoingPromise;
  }
  return(value) {
    const returnSteps = () => this._returnSteps(value);
    return this._ongoingPromise ? transformPromiseWith(this._ongoingPromise, returnSteps, returnSteps) : returnSteps();
  }
  _nextSteps() {
    if (this._isFinished) {
      return Promise.resolve({
        value: undefined,
        done: true
      });
    }
    const reader = this._reader;
    if (reader._ownerReadableStream === undefined) {
      return promiseRejectedWith(readerLockException('iterate'));
    }
    let resolvePromise;
    let rejectPromise;
    const promise = newPromise((resolve, reject) => {
      resolvePromise = resolve;
      rejectPromise = reject;
    });
    const readRequest = {
      _chunkSteps: chunk => {
        this._ongoingPromise = undefined;
        // This needs to be delayed by one microtask, otherwise we stop pulling too early which breaks a test.
        // FIXME Is this a bug in the specification, or in the test?
        queueMicrotask(() => resolvePromise({
          value: chunk,
          done: false
        }));
      },
      _closeSteps: () => {
        this._ongoingPromise = undefined;
        this._isFinished = true;
        ReadableStreamReaderGenericRelease(reader);
        resolvePromise({
          value: undefined,
          done: true
        });
      },
      _errorSteps: reason => {
        this._ongoingPromise = undefined;
        this._isFinished = true;
        ReadableStreamReaderGenericRelease(reader);
        rejectPromise(reason);
      }
    };
    ReadableStreamDefaultReaderRead(reader, readRequest);
    return promise;
  }
  _returnSteps(value) {
    if (this._isFinished) {
      return Promise.resolve({
        value,
        done: true
      });
    }
    this._isFinished = true;
    const reader = this._reader;
    if (reader._ownerReadableStream === undefined) {
      return promiseRejectedWith(readerLockException('finish iterating'));
    }
    if (!this._preventCancel) {
      const result = ReadableStreamReaderGenericCancel(reader, value);
      ReadableStreamReaderGenericRelease(reader);
      return transformPromiseWith(result, () => ({
        value,
        done: true
      }));
    }
    ReadableStreamReaderGenericRelease(reader);
    return promiseResolvedWith({
      value,
      done: true
    });
  }
}
const ReadableStreamAsyncIteratorPrototype = {
  next() {
    if (!IsReadableStreamAsyncIterator(this)) {
      return promiseRejectedWith(streamAsyncIteratorBrandCheckException('next'));
    }
    return this._asyncIteratorImpl.next();
  },
  return(value) {
    if (!IsReadableStreamAsyncIterator(this)) {
      return promiseRejectedWith(streamAsyncIteratorBrandCheckException('return'));
    }
    return this._asyncIteratorImpl.return(value);
  }
};
if (AsyncIteratorPrototype !== undefined) {
  Object.setPrototypeOf(ReadableStreamAsyncIteratorPrototype, AsyncIteratorPrototype);
}
// Abstract operations for the ReadableStream.
function AcquireReadableStreamAsyncIterator(stream, preventCancel) {
  const reader = AcquireReadableStreamDefaultReader(stream);
  const impl = new ReadableStreamAsyncIteratorImpl(reader, preventCancel);
  const iterator = Object.create(ReadableStreamAsyncIteratorPrototype);
  iterator._asyncIteratorImpl = impl;
  return iterator;
}
function IsReadableStreamAsyncIterator(x) {
  if (!typeIsObject$1(x)) {
    return false;
  }
  if (!Object.prototype.hasOwnProperty.call(x, '_asyncIteratorImpl')) {
    return false;
  }
  try {
    // noinspection SuspiciousTypeOfGuard
    return x._asyncIteratorImpl instanceof ReadableStreamAsyncIteratorImpl;
  } catch (_a) {
    return false;
  }
}
// Helper functions for the ReadableStream.
function streamAsyncIteratorBrandCheckException(name) {
  return new TypeError(`ReadableStreamAsyncIterator.${name} can only be used on a ReadableSteamAsyncIterator`);
}

/// <reference lib="es2015.core" />
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN#Polyfill
const NumberIsNaN = Number.isNaN || function (x) {
  // eslint-disable-next-line no-self-compare
  return x !== x;
};
function CreateArrayFromList(elements) {
  // We use arrays to represent lists, so this is basically a no-op.
  // Do a slice though just in case we happen to depend on the unique-ness.
  return elements.slice();
}
function CopyDataBlockBytes(dest, destOffset, src, srcOffset, n) {
  new Uint8Array(dest).set(new Uint8Array(src, srcOffset, n), destOffset);
}
// Not implemented correctly
function TransferArrayBuffer(O) {
  return O;
}
// Not implemented correctly
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function IsDetachedBuffer(O) {
  return false;
}
function ArrayBufferSlice(buffer, begin, end) {
  // ArrayBuffer.prototype.slice is not available on IE10
  // https://www.caniuse.com/mdn-javascript_builtins_arraybuffer_slice
  if (buffer.slice) {
    return buffer.slice(begin, end);
  }
  const length = end - begin;
  const slice = new ArrayBuffer(length);
  CopyDataBlockBytes(slice, 0, buffer, begin, length);
  return slice;
}
function IsNonNegativeNumber(v) {
  if (typeof v !== 'number') {
    return false;
  }
  if (NumberIsNaN(v)) {
    return false;
  }
  if (v < 0) {
    return false;
  }
  return true;
}
function CloneAsUint8Array(O) {
  const buffer = ArrayBufferSlice(O.buffer, O.byteOffset, O.byteOffset + O.byteLength);
  return new Uint8Array(buffer);
}
function DequeueValue(container) {
  const pair = container._queue.shift();
  container._queueTotalSize -= pair.size;
  if (container._queueTotalSize < 0) {
    container._queueTotalSize = 0;
  }
  return pair.value;
}
function EnqueueValueWithSize(container, value, size) {
  if (!IsNonNegativeNumber(size) || size === Infinity) {
    throw new RangeError('Size must be a finite, non-NaN, non-negative number.');
  }
  container._queue.push({
    value,
    size
  });
  container._queueTotalSize += size;
}
function PeekQueueValue(container) {
  const pair = container._queue.peek();
  return pair.value;
}
function ResetQueue(container) {
  container._queue = new SimpleQueue();
  container._queueTotalSize = 0;
}

/**
 * A pull-into request in a {@link ReadableByteStreamController}.
 *
 * @public
 */
class ReadableStreamBYOBRequest {
  constructor() {
    throw new TypeError('Illegal constructor');
  }
  /**
   * Returns the view for writing in to, or `null` if the BYOB request has already been responded to.
   */
  get view() {
    if (!IsReadableStreamBYOBRequest(this)) {
      throw byobRequestBrandCheckException('view');
    }
    return this._view;
  }
  respond(bytesWritten) {
    if (!IsReadableStreamBYOBRequest(this)) {
      throw byobRequestBrandCheckException('respond');
    }
    assertRequiredArgument(bytesWritten, 1, 'respond');
    bytesWritten = convertUnsignedLongLongWithEnforceRange(bytesWritten, 'First parameter');
    if (this._associatedReadableByteStreamController === undefined) {
      throw new TypeError('This BYOB request has been invalidated');
    }
    if (IsDetachedBuffer(this._view.buffer)) ;
    ReadableByteStreamControllerRespond(this._associatedReadableByteStreamController, bytesWritten);
  }
  respondWithNewView(view) {
    if (!IsReadableStreamBYOBRequest(this)) {
      throw byobRequestBrandCheckException('respondWithNewView');
    }
    assertRequiredArgument(view, 1, 'respondWithNewView');
    if (!ArrayBuffer.isView(view)) {
      throw new TypeError('You can only respond with array buffer views');
    }
    if (this._associatedReadableByteStreamController === undefined) {
      throw new TypeError('This BYOB request has been invalidated');
    }
    if (IsDetachedBuffer(view.buffer)) ;
    ReadableByteStreamControllerRespondWithNewView(this._associatedReadableByteStreamController, view);
  }
}
Object.defineProperties(ReadableStreamBYOBRequest.prototype, {
  respond: {
    enumerable: true
  },
  respondWithNewView: {
    enumerable: true
  },
  view: {
    enumerable: true
  }
});
if (typeof SymbolPolyfill.toStringTag === 'symbol') {
  Object.defineProperty(ReadableStreamBYOBRequest.prototype, SymbolPolyfill.toStringTag, {
    value: 'ReadableStreamBYOBRequest',
    configurable: true
  });
}
/**
 * Allows control of a {@link ReadableStream | readable byte stream}'s state and internal queue.
 *
 * @public
 */
class ReadableByteStreamController {
  constructor() {
    throw new TypeError('Illegal constructor');
  }
  /**
   * Returns the current BYOB pull request, or `null` if there isn't one.
   */
  get byobRequest() {
    if (!IsReadableByteStreamController(this)) {
      throw byteStreamControllerBrandCheckException('byobRequest');
    }
    return ReadableByteStreamControllerGetBYOBRequest(this);
  }
  /**
   * Returns the desired size to fill the controlled stream's internal queue. It can be negative, if the queue is
   * over-full. An underlying byte source ought to use this information to determine when and how to apply backpressure.
   */
  get desiredSize() {
    if (!IsReadableByteStreamController(this)) {
      throw byteStreamControllerBrandCheckException('desiredSize');
    }
    return ReadableByteStreamControllerGetDesiredSize(this);
  }
  /**
   * Closes the controlled readable stream. Consumers will still be able to read any previously-enqueued chunks from
   * the stream, but once those are read, the stream will become closed.
   */
  close() {
    if (!IsReadableByteStreamController(this)) {
      throw byteStreamControllerBrandCheckException('close');
    }
    if (this._closeRequested) {
      throw new TypeError('The stream has already been closed; do not close it again!');
    }
    const state = this._controlledReadableByteStream._state;
    if (state !== 'readable') {
      throw new TypeError(`The stream (in ${state} state) is not in the readable state and cannot be closed`);
    }
    ReadableByteStreamControllerClose(this);
  }
  enqueue(chunk) {
    if (!IsReadableByteStreamController(this)) {
      throw byteStreamControllerBrandCheckException('enqueue');
    }
    assertRequiredArgument(chunk, 1, 'enqueue');
    if (!ArrayBuffer.isView(chunk)) {
      throw new TypeError('chunk must be an array buffer view');
    }
    if (chunk.byteLength === 0) {
      throw new TypeError('chunk must have non-zero byteLength');
    }
    if (chunk.buffer.byteLength === 0) {
      throw new TypeError(`chunk's buffer must have non-zero byteLength`);
    }
    if (this._closeRequested) {
      throw new TypeError('stream is closed or draining');
    }
    const state = this._controlledReadableByteStream._state;
    if (state !== 'readable') {
      throw new TypeError(`The stream (in ${state} state) is not in the readable state and cannot be enqueued to`);
    }
    ReadableByteStreamControllerEnqueue(this, chunk);
  }
  /**
   * Errors the controlled readable stream, making all future interactions with it fail with the given error `e`.
   */
  error(e = undefined) {
    if (!IsReadableByteStreamController(this)) {
      throw byteStreamControllerBrandCheckException('error');
    }
    ReadableByteStreamControllerError(this, e);
  }
  /** @internal */
  [CancelSteps](reason) {
    ReadableByteStreamControllerClearPendingPullIntos(this);
    ResetQueue(this);
    const result = this._cancelAlgorithm(reason);
    ReadableByteStreamControllerClearAlgorithms(this);
    return result;
  }
  /** @internal */
  [PullSteps](readRequest) {
    const stream = this._controlledReadableByteStream;
    if (this._queueTotalSize > 0) {
      const entry = this._queue.shift();
      this._queueTotalSize -= entry.byteLength;
      ReadableByteStreamControllerHandleQueueDrain(this);
      const view = new Uint8Array(entry.buffer, entry.byteOffset, entry.byteLength);
      readRequest._chunkSteps(view);
      return;
    }
    const autoAllocateChunkSize = this._autoAllocateChunkSize;
    if (autoAllocateChunkSize !== undefined) {
      let buffer;
      try {
        buffer = new ArrayBuffer(autoAllocateChunkSize);
      } catch (bufferE) {
        readRequest._errorSteps(bufferE);
        return;
      }
      const pullIntoDescriptor = {
        buffer,
        bufferByteLength: autoAllocateChunkSize,
        byteOffset: 0,
        byteLength: autoAllocateChunkSize,
        bytesFilled: 0,
        elementSize: 1,
        viewConstructor: Uint8Array,
        readerType: 'default'
      };
      this._pendingPullIntos.push(pullIntoDescriptor);
    }
    ReadableStreamAddReadRequest(stream, readRequest);
    ReadableByteStreamControllerCallPullIfNeeded(this);
  }
}
Object.defineProperties(ReadableByteStreamController.prototype, {
  close: {
    enumerable: true
  },
  enqueue: {
    enumerable: true
  },
  error: {
    enumerable: true
  },
  byobRequest: {
    enumerable: true
  },
  desiredSize: {
    enumerable: true
  }
});
if (typeof SymbolPolyfill.toStringTag === 'symbol') {
  Object.defineProperty(ReadableByteStreamController.prototype, SymbolPolyfill.toStringTag, {
    value: 'ReadableByteStreamController',
    configurable: true
  });
}
// Abstract operations for the ReadableByteStreamController.
function IsReadableByteStreamController(x) {
  if (!typeIsObject$1(x)) {
    return false;
  }
  if (!Object.prototype.hasOwnProperty.call(x, '_controlledReadableByteStream')) {
    return false;
  }
  return x instanceof ReadableByteStreamController;
}
function IsReadableStreamBYOBRequest(x) {
  if (!typeIsObject$1(x)) {
    return false;
  }
  if (!Object.prototype.hasOwnProperty.call(x, '_associatedReadableByteStreamController')) {
    return false;
  }
  return x instanceof ReadableStreamBYOBRequest;
}
function ReadableByteStreamControllerCallPullIfNeeded(controller) {
  const shouldPull = ReadableByteStreamControllerShouldCallPull(controller);
  if (!shouldPull) {
    return;
  }
  if (controller._pulling) {
    controller._pullAgain = true;
    return;
  }
  controller._pulling = true;
  // TODO: Test controller argument
  const pullPromise = controller._pullAlgorithm();
  uponPromise(pullPromise, () => {
    controller._pulling = false;
    if (controller._pullAgain) {
      controller._pullAgain = false;
      ReadableByteStreamControllerCallPullIfNeeded(controller);
    }
  }, e => {
    ReadableByteStreamControllerError(controller, e);
  });
}
function ReadableByteStreamControllerClearPendingPullIntos(controller) {
  ReadableByteStreamControllerInvalidateBYOBRequest(controller);
  controller._pendingPullIntos = new SimpleQueue();
}
function ReadableByteStreamControllerCommitPullIntoDescriptor(stream, pullIntoDescriptor) {
  let done = false;
  if (stream._state === 'closed') {
    done = true;
  }
  const filledView = ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor);
  if (pullIntoDescriptor.readerType === 'default') {
    ReadableStreamFulfillReadRequest(stream, filledView, done);
  } else {
    ReadableStreamFulfillReadIntoRequest(stream, filledView, done);
  }
}
function ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor) {
  const bytesFilled = pullIntoDescriptor.bytesFilled;
  const elementSize = pullIntoDescriptor.elementSize;
  return new pullIntoDescriptor.viewConstructor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, bytesFilled / elementSize);
}
function ReadableByteStreamControllerEnqueueChunkToQueue(controller, buffer, byteOffset, byteLength) {
  controller._queue.push({
    buffer,
    byteOffset,
    byteLength
  });
  controller._queueTotalSize += byteLength;
}
function ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor) {
  const elementSize = pullIntoDescriptor.elementSize;
  const currentAlignedBytes = pullIntoDescriptor.bytesFilled - pullIntoDescriptor.bytesFilled % elementSize;
  const maxBytesToCopy = Math.min(controller._queueTotalSize, pullIntoDescriptor.byteLength - pullIntoDescriptor.bytesFilled);
  const maxBytesFilled = pullIntoDescriptor.bytesFilled + maxBytesToCopy;
  const maxAlignedBytes = maxBytesFilled - maxBytesFilled % elementSize;
  let totalBytesToCopyRemaining = maxBytesToCopy;
  let ready = false;
  if (maxAlignedBytes > currentAlignedBytes) {
    totalBytesToCopyRemaining = maxAlignedBytes - pullIntoDescriptor.bytesFilled;
    ready = true;
  }
  const queue = controller._queue;
  while (totalBytesToCopyRemaining > 0) {
    const headOfQueue = queue.peek();
    const bytesToCopy = Math.min(totalBytesToCopyRemaining, headOfQueue.byteLength);
    const destStart = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
    CopyDataBlockBytes(pullIntoDescriptor.buffer, destStart, headOfQueue.buffer, headOfQueue.byteOffset, bytesToCopy);
    if (headOfQueue.byteLength === bytesToCopy) {
      queue.shift();
    } else {
      headOfQueue.byteOffset += bytesToCopy;
      headOfQueue.byteLength -= bytesToCopy;
    }
    controller._queueTotalSize -= bytesToCopy;
    ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, bytesToCopy, pullIntoDescriptor);
    totalBytesToCopyRemaining -= bytesToCopy;
  }
  return ready;
}
function ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, size, pullIntoDescriptor) {
  pullIntoDescriptor.bytesFilled += size;
}
function ReadableByteStreamControllerHandleQueueDrain(controller) {
  if (controller._queueTotalSize === 0 && controller._closeRequested) {
    ReadableByteStreamControllerClearAlgorithms(controller);
    ReadableStreamClose(controller._controlledReadableByteStream);
  } else {
    ReadableByteStreamControllerCallPullIfNeeded(controller);
  }
}
function ReadableByteStreamControllerInvalidateBYOBRequest(controller) {
  if (controller._byobRequest === null) {
    return;
  }
  controller._byobRequest._associatedReadableByteStreamController = undefined;
  controller._byobRequest._view = null;
  controller._byobRequest = null;
}
function ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller) {
  while (controller._pendingPullIntos.length > 0) {
    if (controller._queueTotalSize === 0) {
      return;
    }
    const pullIntoDescriptor = controller._pendingPullIntos.peek();
    if (ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor)) {
      ReadableByteStreamControllerShiftPendingPullInto(controller);
      ReadableByteStreamControllerCommitPullIntoDescriptor(controller._controlledReadableByteStream, pullIntoDescriptor);
    }
  }
}
function ReadableByteStreamControllerPullInto(controller, view, readIntoRequest) {
  const stream = controller._controlledReadableByteStream;
  let elementSize = 1;
  if (view.constructor !== DataView) {
    elementSize = view.constructor.BYTES_PER_ELEMENT;
  }
  const ctor = view.constructor;
  // try {
  const buffer = TransferArrayBuffer(view.buffer);
  // } catch (e) {
  //   readIntoRequest._errorSteps(e);
  //   return;
  // }
  const pullIntoDescriptor = {
    buffer,
    bufferByteLength: buffer.byteLength,
    byteOffset: view.byteOffset,
    byteLength: view.byteLength,
    bytesFilled: 0,
    elementSize,
    viewConstructor: ctor,
    readerType: 'byob'
  };
  if (controller._pendingPullIntos.length > 0) {
    controller._pendingPullIntos.push(pullIntoDescriptor);
    // No ReadableByteStreamControllerCallPullIfNeeded() call since:
    // - No change happens on desiredSize
    // - The source has already been notified of that there's at least 1 pending read(view)
    ReadableStreamAddReadIntoRequest(stream, readIntoRequest);
    return;
  }
  if (stream._state === 'closed') {
    const emptyView = new ctor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, 0);
    readIntoRequest._closeSteps(emptyView);
    return;
  }
  if (controller._queueTotalSize > 0) {
    if (ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor)) {
      const filledView = ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor);
      ReadableByteStreamControllerHandleQueueDrain(controller);
      readIntoRequest._chunkSteps(filledView);
      return;
    }
    if (controller._closeRequested) {
      const e = new TypeError('Insufficient bytes to fill elements in the given buffer');
      ReadableByteStreamControllerError(controller, e);
      readIntoRequest._errorSteps(e);
      return;
    }
  }
  controller._pendingPullIntos.push(pullIntoDescriptor);
  ReadableStreamAddReadIntoRequest(stream, readIntoRequest);
  ReadableByteStreamControllerCallPullIfNeeded(controller);
}
function ReadableByteStreamControllerRespondInClosedState(controller, firstDescriptor) {
  const stream = controller._controlledReadableByteStream;
  if (ReadableStreamHasBYOBReader(stream)) {
    while (ReadableStreamGetNumReadIntoRequests(stream) > 0) {
      const pullIntoDescriptor = ReadableByteStreamControllerShiftPendingPullInto(controller);
      ReadableByteStreamControllerCommitPullIntoDescriptor(stream, pullIntoDescriptor);
    }
  }
}
function ReadableByteStreamControllerRespondInReadableState(controller, bytesWritten, pullIntoDescriptor) {
  ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, bytesWritten, pullIntoDescriptor);
  if (pullIntoDescriptor.bytesFilled < pullIntoDescriptor.elementSize) {
    return;
  }
  ReadableByteStreamControllerShiftPendingPullInto(controller);
  const remainderSize = pullIntoDescriptor.bytesFilled % pullIntoDescriptor.elementSize;
  if (remainderSize > 0) {
    const end = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
    const remainder = ArrayBufferSlice(pullIntoDescriptor.buffer, end - remainderSize, end);
    ReadableByteStreamControllerEnqueueChunkToQueue(controller, remainder, 0, remainder.byteLength);
  }
  pullIntoDescriptor.bytesFilled -= remainderSize;
  ReadableByteStreamControllerCommitPullIntoDescriptor(controller._controlledReadableByteStream, pullIntoDescriptor);
  ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
}
function ReadableByteStreamControllerRespondInternal(controller, bytesWritten) {
  const firstDescriptor = controller._pendingPullIntos.peek();
  ReadableByteStreamControllerInvalidateBYOBRequest(controller);
  const state = controller._controlledReadableByteStream._state;
  if (state === 'closed') {
    ReadableByteStreamControllerRespondInClosedState(controller);
  } else {
    ReadableByteStreamControllerRespondInReadableState(controller, bytesWritten, firstDescriptor);
  }
  ReadableByteStreamControllerCallPullIfNeeded(controller);
}
function ReadableByteStreamControllerShiftPendingPullInto(controller) {
  const descriptor = controller._pendingPullIntos.shift();
  return descriptor;
}
function ReadableByteStreamControllerShouldCallPull(controller) {
  const stream = controller._controlledReadableByteStream;
  if (stream._state !== 'readable') {
    return false;
  }
  if (controller._closeRequested) {
    return false;
  }
  if (!controller._started) {
    return false;
  }
  if (ReadableStreamHasDefaultReader(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
    return true;
  }
  if (ReadableStreamHasBYOBReader(stream) && ReadableStreamGetNumReadIntoRequests(stream) > 0) {
    return true;
  }
  const desiredSize = ReadableByteStreamControllerGetDesiredSize(controller);
  if (desiredSize > 0) {
    return true;
  }
  return false;
}
function ReadableByteStreamControllerClearAlgorithms(controller) {
  controller._pullAlgorithm = undefined;
  controller._cancelAlgorithm = undefined;
}
// A client of ReadableByteStreamController may use these functions directly to bypass state check.
function ReadableByteStreamControllerClose(controller) {
  const stream = controller._controlledReadableByteStream;
  if (controller._closeRequested || stream._state !== 'readable') {
    return;
  }
  if (controller._queueTotalSize > 0) {
    controller._closeRequested = true;
    return;
  }
  if (controller._pendingPullIntos.length > 0) {
    const firstPendingPullInto = controller._pendingPullIntos.peek();
    if (firstPendingPullInto.bytesFilled > 0) {
      const e = new TypeError('Insufficient bytes to fill elements in the given buffer');
      ReadableByteStreamControllerError(controller, e);
      throw e;
    }
  }
  ReadableByteStreamControllerClearAlgorithms(controller);
  ReadableStreamClose(stream);
}
function ReadableByteStreamControllerEnqueue(controller, chunk) {
  const stream = controller._controlledReadableByteStream;
  if (controller._closeRequested || stream._state !== 'readable') {
    return;
  }
  const buffer = chunk.buffer;
  const byteOffset = chunk.byteOffset;
  const byteLength = chunk.byteLength;
  const transferredBuffer = TransferArrayBuffer(buffer);
  if (controller._pendingPullIntos.length > 0) {
    const firstPendingPullInto = controller._pendingPullIntos.peek();
    if (IsDetachedBuffer(firstPendingPullInto.buffer)) ;
    firstPendingPullInto.buffer = TransferArrayBuffer(firstPendingPullInto.buffer);
  }
  ReadableByteStreamControllerInvalidateBYOBRequest(controller);
  if (ReadableStreamHasDefaultReader(stream)) {
    if (ReadableStreamGetNumReadRequests(stream) === 0) {
      ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
    } else {
      if (controller._pendingPullIntos.length > 0) {
        ReadableByteStreamControllerShiftPendingPullInto(controller);
      }
      const transferredView = new Uint8Array(transferredBuffer, byteOffset, byteLength);
      ReadableStreamFulfillReadRequest(stream, transferredView, false);
    }
  } else if (ReadableStreamHasBYOBReader(stream)) {
    // TODO: Ideally in this branch detaching should happen only if the buffer is not consumed fully.
    ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
    ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
  } else {
    ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
  }
  ReadableByteStreamControllerCallPullIfNeeded(controller);
}
function ReadableByteStreamControllerError(controller, e) {
  const stream = controller._controlledReadableByteStream;
  if (stream._state !== 'readable') {
    return;
  }
  ReadableByteStreamControllerClearPendingPullIntos(controller);
  ResetQueue(controller);
  ReadableByteStreamControllerClearAlgorithms(controller);
  ReadableStreamError(stream, e);
}
function ReadableByteStreamControllerGetBYOBRequest(controller) {
  if (controller._byobRequest === null && controller._pendingPullIntos.length > 0) {
    const firstDescriptor = controller._pendingPullIntos.peek();
    const view = new Uint8Array(firstDescriptor.buffer, firstDescriptor.byteOffset + firstDescriptor.bytesFilled, firstDescriptor.byteLength - firstDescriptor.bytesFilled);
    const byobRequest = Object.create(ReadableStreamBYOBRequest.prototype);
    SetUpReadableStreamBYOBRequest(byobRequest, controller, view);
    controller._byobRequest = byobRequest;
  }
  return controller._byobRequest;
}
function ReadableByteStreamControllerGetDesiredSize(controller) {
  const state = controller._controlledReadableByteStream._state;
  if (state === 'errored') {
    return null;
  }
  if (state === 'closed') {
    return 0;
  }
  return controller._strategyHWM - controller._queueTotalSize;
}
function ReadableByteStreamControllerRespond(controller, bytesWritten) {
  const firstDescriptor = controller._pendingPullIntos.peek();
  const state = controller._controlledReadableByteStream._state;
  if (state === 'closed') {
    if (bytesWritten !== 0) {
      throw new TypeError('bytesWritten must be 0 when calling respond() on a closed stream');
    }
  } else {
    if (bytesWritten === 0) {
      throw new TypeError('bytesWritten must be greater than 0 when calling respond() on a readable stream');
    }
    if (firstDescriptor.bytesFilled + bytesWritten > firstDescriptor.byteLength) {
      throw new RangeError('bytesWritten out of range');
    }
  }
  firstDescriptor.buffer = TransferArrayBuffer(firstDescriptor.buffer);
  ReadableByteStreamControllerRespondInternal(controller, bytesWritten);
}
function ReadableByteStreamControllerRespondWithNewView(controller, view) {
  const firstDescriptor = controller._pendingPullIntos.peek();
  const state = controller._controlledReadableByteStream._state;
  if (state === 'closed') {
    if (view.byteLength !== 0) {
      throw new TypeError('The view\'s length must be 0 when calling respondWithNewView() on a closed stream');
    }
  } else {
    if (view.byteLength === 0) {
      throw new TypeError('The view\'s length must be greater than 0 when calling respondWithNewView() on a readable stream');
    }
  }
  if (firstDescriptor.byteOffset + firstDescriptor.bytesFilled !== view.byteOffset) {
    throw new RangeError('The region specified by view does not match byobRequest');
  }
  if (firstDescriptor.bufferByteLength !== view.buffer.byteLength) {
    throw new RangeError('The buffer of view has different capacity than byobRequest');
  }
  if (firstDescriptor.bytesFilled + view.byteLength > firstDescriptor.byteLength) {
    throw new RangeError('The region specified by view is larger than byobRequest');
  }
  const viewByteLength = view.byteLength;
  firstDescriptor.buffer = TransferArrayBuffer(view.buffer);
  ReadableByteStreamControllerRespondInternal(controller, viewByteLength);
}
function SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, autoAllocateChunkSize) {
  controller._controlledReadableByteStream = stream;
  controller._pullAgain = false;
  controller._pulling = false;
  controller._byobRequest = null;
  // Need to set the slots so that the assert doesn't fire. In the spec the slots already exist implicitly.
  controller._queue = controller._queueTotalSize = undefined;
  ResetQueue(controller);
  controller._closeRequested = false;
  controller._started = false;
  controller._strategyHWM = highWaterMark;
  controller._pullAlgorithm = pullAlgorithm;
  controller._cancelAlgorithm = cancelAlgorithm;
  controller._autoAllocateChunkSize = autoAllocateChunkSize;
  controller._pendingPullIntos = new SimpleQueue();
  stream._readableStreamController = controller;
  const startResult = startAlgorithm();
  uponPromise(promiseResolvedWith(startResult), () => {
    controller._started = true;
    ReadableByteStreamControllerCallPullIfNeeded(controller);
  }, r => {
    ReadableByteStreamControllerError(controller, r);
  });
}
function SetUpReadableByteStreamControllerFromUnderlyingSource(stream, underlyingByteSource, highWaterMark) {
  const controller = Object.create(ReadableByteStreamController.prototype);
  let startAlgorithm = () => undefined;
  let pullAlgorithm = () => promiseResolvedWith(undefined);
  let cancelAlgorithm = () => promiseResolvedWith(undefined);
  if (underlyingByteSource.start !== undefined) {
    startAlgorithm = () => underlyingByteSource.start(controller);
  }
  if (underlyingByteSource.pull !== undefined) {
    pullAlgorithm = () => underlyingByteSource.pull(controller);
  }
  if (underlyingByteSource.cancel !== undefined) {
    cancelAlgorithm = reason => underlyingByteSource.cancel(reason);
  }
  const autoAllocateChunkSize = underlyingByteSource.autoAllocateChunkSize;
  if (autoAllocateChunkSize === 0) {
    throw new TypeError('autoAllocateChunkSize must be greater than 0');
  }
  SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, autoAllocateChunkSize);
}
function SetUpReadableStreamBYOBRequest(request, controller, view) {
  request._associatedReadableByteStreamController = controller;
  request._view = view;
}
// Helper functions for the ReadableStreamBYOBRequest.
function byobRequestBrandCheckException(name) {
  return new TypeError(`ReadableStreamBYOBRequest.prototype.${name} can only be used on a ReadableStreamBYOBRequest`);
}
// Helper functions for the ReadableByteStreamController.
function byteStreamControllerBrandCheckException(name) {
  return new TypeError(`ReadableByteStreamController.prototype.${name} can only be used on a ReadableByteStreamController`);
}

// Abstract operations for the ReadableStream.
function AcquireReadableStreamBYOBReader(stream) {
  return new ReadableStreamBYOBReader(stream);
}
// ReadableStream API exposed for controllers.
function ReadableStreamAddReadIntoRequest(stream, readIntoRequest) {
  stream._reader._readIntoRequests.push(readIntoRequest);
}
function ReadableStreamFulfillReadIntoRequest(stream, chunk, done) {
  const reader = stream._reader;
  const readIntoRequest = reader._readIntoRequests.shift();
  if (done) {
    readIntoRequest._closeSteps(chunk);
  } else {
    readIntoRequest._chunkSteps(chunk);
  }
}
function ReadableStreamGetNumReadIntoRequests(stream) {
  return stream._reader._readIntoRequests.length;
}
function ReadableStreamHasBYOBReader(stream) {
  const reader = stream._reader;
  if (reader === undefined) {
    return false;
  }
  if (!IsReadableStreamBYOBReader(reader)) {
    return false;
  }
  return true;
}
/**
 * A BYOB reader vended by a {@link ReadableStream}.
 *
 * @public
 */
class ReadableStreamBYOBReader {
  constructor(stream) {
    assertRequiredArgument(stream, 1, 'ReadableStreamBYOBReader');
    assertReadableStream(stream, 'First parameter');
    if (IsReadableStreamLocked(stream)) {
      throw new TypeError('This stream has already been locked for exclusive reading by another reader');
    }
    if (!IsReadableByteStreamController(stream._readableStreamController)) {
      throw new TypeError('Cannot construct a ReadableStreamBYOBReader for a stream not constructed with a byte ' + 'source');
    }
    ReadableStreamReaderGenericInitialize(this, stream);
    this._readIntoRequests = new SimpleQueue();
  }
  /**
   * Returns a promise that will be fulfilled when the stream becomes closed, or rejected if the stream ever errors or
   * the reader's lock is released before the stream finishes closing.
   */
  get closed() {
    if (!IsReadableStreamBYOBReader(this)) {
      return promiseRejectedWith(byobReaderBrandCheckException('closed'));
    }
    return this._closedPromise;
  }
  /**
   * If the reader is active, behaves the same as {@link ReadableStream.cancel | stream.cancel(reason)}.
   */
  cancel(reason = undefined) {
    if (!IsReadableStreamBYOBReader(this)) {
      return promiseRejectedWith(byobReaderBrandCheckException('cancel'));
    }
    if (this._ownerReadableStream === undefined) {
      return promiseRejectedWith(readerLockException('cancel'));
    }
    return ReadableStreamReaderGenericCancel(this, reason);
  }
  /**
   * Attempts to reads bytes into view, and returns a promise resolved with the result.
   *
   * If reading a chunk causes the queue to become empty, more data will be pulled from the underlying source.
   */
  read(view) {
    if (!IsReadableStreamBYOBReader(this)) {
      return promiseRejectedWith(byobReaderBrandCheckException('read'));
    }
    if (!ArrayBuffer.isView(view)) {
      return promiseRejectedWith(new TypeError('view must be an array buffer view'));
    }
    if (view.byteLength === 0) {
      return promiseRejectedWith(new TypeError('view must have non-zero byteLength'));
    }
    if (view.buffer.byteLength === 0) {
      return promiseRejectedWith(new TypeError(`view's buffer must have non-zero byteLength`));
    }
    if (IsDetachedBuffer(view.buffer)) ;
    if (this._ownerReadableStream === undefined) {
      return promiseRejectedWith(readerLockException('read from'));
    }
    let resolvePromise;
    let rejectPromise;
    const promise = newPromise((resolve, reject) => {
      resolvePromise = resolve;
      rejectPromise = reject;
    });
    const readIntoRequest = {
      _chunkSteps: chunk => resolvePromise({
        value: chunk,
        done: false
      }),
      _closeSteps: chunk => resolvePromise({
        value: chunk,
        done: true
      }),
      _errorSteps: e => rejectPromise(e)
    };
    ReadableStreamBYOBReaderRead(this, view, readIntoRequest);
    return promise;
  }
  /**
   * Releases the reader's lock on the corresponding stream. After the lock is released, the reader is no longer active.
   * If the associated stream is errored when the lock is released, the reader will appear errored in the same way
   * from now on; otherwise, the reader will appear closed.
   *
   * A reader's lock cannot be released while it still has a pending read request, i.e., if a promise returned by
   * the reader's {@link ReadableStreamBYOBReader.read | read()} method has not yet been settled. Attempting to
   * do so will throw a `TypeError` and leave the reader locked to the stream.
   */
  releaseLock() {
    if (!IsReadableStreamBYOBReader(this)) {
      throw byobReaderBrandCheckException('releaseLock');
    }
    if (this._ownerReadableStream === undefined) {
      return;
    }
    if (this._readIntoRequests.length > 0) {
      throw new TypeError('Tried to release a reader lock when that reader has pending read() calls un-settled');
    }
    ReadableStreamReaderGenericRelease(this);
  }
}
Object.defineProperties(ReadableStreamBYOBReader.prototype, {
  cancel: {
    enumerable: true
  },
  read: {
    enumerable: true
  },
  releaseLock: {
    enumerable: true
  },
  closed: {
    enumerable: true
  }
});
if (typeof SymbolPolyfill.toStringTag === 'symbol') {
  Object.defineProperty(ReadableStreamBYOBReader.prototype, SymbolPolyfill.toStringTag, {
    value: 'ReadableStreamBYOBReader',
    configurable: true
  });
}
// Abstract operations for the readers.
function IsReadableStreamBYOBReader(x) {
  if (!typeIsObject$1(x)) {
    return false;
  }
  if (!Object.prototype.hasOwnProperty.call(x, '_readIntoRequests')) {
    return false;
  }
  return x instanceof ReadableStreamBYOBReader;
}
function ReadableStreamBYOBReaderRead(reader, view, readIntoRequest) {
  const stream = reader._ownerReadableStream;
  stream._disturbed = true;
  if (stream._state === 'errored') {
    readIntoRequest._errorSteps(stream._storedError);
  } else {
    ReadableByteStreamControllerPullInto(stream._readableStreamController, view, readIntoRequest);
  }
}
// Helper functions for the ReadableStreamBYOBReader.
function byobReaderBrandCheckException(name) {
  return new TypeError(`ReadableStreamBYOBReader.prototype.${name} can only be used on a ReadableStreamBYOBReader`);
}
function ExtractHighWaterMark(strategy, defaultHWM) {
  const {
    highWaterMark
  } = strategy;
  if (highWaterMark === undefined) {
    return defaultHWM;
  }
  if (NumberIsNaN(highWaterMark) || highWaterMark < 0) {
    throw new RangeError('Invalid highWaterMark');
  }
  return highWaterMark;
}
function ExtractSizeAlgorithm(strategy) {
  const {
    size
  } = strategy;
  if (!size) {
    return () => 1;
  }
  return size;
}
function convertQueuingStrategy(init, context) {
  assertDictionary(init, context);
  const highWaterMark = init === null || init === void 0 ? void 0 : init.highWaterMark;
  const size = init === null || init === void 0 ? void 0 : init.size;
  return {
    highWaterMark: highWaterMark === undefined ? undefined : convertUnrestrictedDouble(highWaterMark),
    size: size === undefined ? undefined : convertQueuingStrategySize(size, `${context} has member 'size' that`)
  };
}
function convertQueuingStrategySize(fn, context) {
  assertFunction(fn, context);
  return chunk => convertUnrestrictedDouble(fn(chunk));
}
function convertUnderlyingSink(original, context) {
  assertDictionary(original, context);
  const abort = original === null || original === void 0 ? void 0 : original.abort;
  const close = original === null || original === void 0 ? void 0 : original.close;
  const start = original === null || original === void 0 ? void 0 : original.start;
  const type = original === null || original === void 0 ? void 0 : original.type;
  const write = original === null || original === void 0 ? void 0 : original.write;
  return {
    abort: abort === undefined ? undefined : convertUnderlyingSinkAbortCallback(abort, original, `${context} has member 'abort' that`),
    close: close === undefined ? undefined : convertUnderlyingSinkCloseCallback(close, original, `${context} has member 'close' that`),
    start: start === undefined ? undefined : convertUnderlyingSinkStartCallback(start, original, `${context} has member 'start' that`),
    write: write === undefined ? undefined : convertUnderlyingSinkWriteCallback(write, original, `${context} has member 'write' that`),
    type
  };
}
function convertUnderlyingSinkAbortCallback(fn, original, context) {
  assertFunction(fn, context);
  return reason => promiseCall(fn, original, [reason]);
}
function convertUnderlyingSinkCloseCallback(fn, original, context) {
  assertFunction(fn, context);
  return () => promiseCall(fn, original, []);
}
function convertUnderlyingSinkStartCallback(fn, original, context) {
  assertFunction(fn, context);
  return controller => reflectCall(fn, original, [controller]);
}
function convertUnderlyingSinkWriteCallback(fn, original, context) {
  assertFunction(fn, context);
  return (chunk, controller) => promiseCall(fn, original, [chunk, controller]);
}
function assertWritableStream(x, context) {
  if (!IsWritableStream(x)) {
    throw new TypeError(`${context} is not a WritableStream.`);
  }
}
function isAbortSignal(value) {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  try {
    return typeof value.aborted === 'boolean';
  } catch (_a) {
    // AbortSignal.prototype.aborted throws if its brand check fails
    return false;
  }
}
const supportsAbortController = typeof AbortController === 'function';
/**
 * Construct a new AbortController, if supported by the platform.
 *
 * @internal
 */
function createAbortController() {
  if (supportsAbortController) {
    return new AbortController();
  }
  return undefined;
}

/**
 * A writable stream represents a destination for data, into which you can write.
 *
 * @public
 */
class WritableStream {
  constructor(rawUnderlyingSink = {}, rawStrategy = {}) {
    if (rawUnderlyingSink === undefined) {
      rawUnderlyingSink = null;
    } else {
      assertObject(rawUnderlyingSink, 'First parameter');
    }
    const strategy = convertQueuingStrategy(rawStrategy, 'Second parameter');
    const underlyingSink = convertUnderlyingSink(rawUnderlyingSink, 'First parameter');
    InitializeWritableStream(this);
    const type = underlyingSink.type;
    if (type !== undefined) {
      throw new RangeError('Invalid type is specified');
    }
    const sizeAlgorithm = ExtractSizeAlgorithm(strategy);
    const highWaterMark = ExtractHighWaterMark(strategy, 1);
    SetUpWritableStreamDefaultControllerFromUnderlyingSink(this, underlyingSink, highWaterMark, sizeAlgorithm);
  }
  /**
   * Returns whether or not the writable stream is locked to a writer.
   */
  get locked() {
    if (!IsWritableStream(this)) {
      throw streamBrandCheckException$2('locked');
    }
    return IsWritableStreamLocked(this);
  }
  /**
   * Aborts the stream, signaling that the producer can no longer successfully write to the stream and it is to be
   * immediately moved to an errored state, with any queued-up writes discarded. This will also execute any abort
   * mechanism of the underlying sink.
   *
   * The returned promise will fulfill if the stream shuts down successfully, or reject if the underlying sink signaled
   * that there was an error doing so. Additionally, it will reject with a `TypeError` (without attempting to cancel
   * the stream) if the stream is currently locked.
   */
  abort(reason = undefined) {
    if (!IsWritableStream(this)) {
      return promiseRejectedWith(streamBrandCheckException$2('abort'));
    }
    if (IsWritableStreamLocked(this)) {
      return promiseRejectedWith(new TypeError('Cannot abort a stream that already has a writer'));
    }
    return WritableStreamAbort(this, reason);
  }
  /**
   * Closes the stream. The underlying sink will finish processing any previously-written chunks, before invoking its
   * close behavior. During this time any further attempts to write will fail (without erroring the stream).
   *
   * The method returns a promise that will fulfill if all remaining chunks are successfully written and the stream
   * successfully closes, or rejects if an error is encountered during this process. Additionally, it will reject with
   * a `TypeError` (without attempting to cancel the stream) if the stream is currently locked.
   */
  close() {
    if (!IsWritableStream(this)) {
      return promiseRejectedWith(streamBrandCheckException$2('close'));
    }
    if (IsWritableStreamLocked(this)) {
      return promiseRejectedWith(new TypeError('Cannot close a stream that already has a writer'));
    }
    if (WritableStreamCloseQueuedOrInFlight(this)) {
      return promiseRejectedWith(new TypeError('Cannot close an already-closing stream'));
    }
    return WritableStreamClose(this);
  }
  /**
   * Creates a {@link WritableStreamDefaultWriter | writer} and locks the stream to the new writer. While the stream
   * is locked, no other writer can be acquired until this one is released.
   *
   * This functionality is especially useful for creating abstractions that desire the ability to write to a stream
   * without interruption or interleaving. By getting a writer for the stream, you can ensure nobody else can write at
   * the same time, which would cause the resulting written data to be unpredictable and probably useless.
   */
  getWriter() {
    if (!IsWritableStream(this)) {
      throw streamBrandCheckException$2('getWriter');
    }
    return AcquireWritableStreamDefaultWriter(this);
  }
}
Object.defineProperties(WritableStream.prototype, {
  abort: {
    enumerable: true
  },
  close: {
    enumerable: true
  },
  getWriter: {
    enumerable: true
  },
  locked: {
    enumerable: true
  }
});
if (typeof SymbolPolyfill.toStringTag === 'symbol') {
  Object.defineProperty(WritableStream.prototype, SymbolPolyfill.toStringTag, {
    value: 'WritableStream',
    configurable: true
  });
}
// Abstract operations for the WritableStream.
function AcquireWritableStreamDefaultWriter(stream) {
  return new WritableStreamDefaultWriter(stream);
}
// Throws if and only if startAlgorithm throws.
function CreateWritableStream(startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark = 1, sizeAlgorithm = () => 1) {
  const stream = Object.create(WritableStream.prototype);
  InitializeWritableStream(stream);
  const controller = Object.create(WritableStreamDefaultController.prototype);
  SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm);
  return stream;
}
function InitializeWritableStream(stream) {
  stream._state = 'writable';
  // The error that will be reported by new method calls once the state becomes errored. Only set when [[state]] is
  // 'erroring' or 'errored'. May be set to an undefined value.
  stream._storedError = undefined;
  stream._writer = undefined;
  // Initialize to undefined first because the constructor of the controller checks this
  // variable to validate the caller.
  stream._writableStreamController = undefined;
  // This queue is placed here instead of the writer class in order to allow for passing a writer to the next data
  // producer without waiting for the queued writes to finish.
  stream._writeRequests = new SimpleQueue();
  // Write requests are removed from _writeRequests when write() is called on the underlying sink. This prevents
  // them from being erroneously rejected on error. If a write() call is in-flight, the request is stored here.
  stream._inFlightWriteRequest = undefined;
  // The promise that was returned from writer.close(). Stored here because it may be fulfilled after the writer
  // has been detached.
  stream._closeRequest = undefined;
  // Close request is removed from _closeRequest when close() is called on the underlying sink. This prevents it
  // from being erroneously rejected on error. If a close() call is in-flight, the request is stored here.
  stream._inFlightCloseRequest = undefined;
  // The promise that was returned from writer.abort(). This may also be fulfilled after the writer has detached.
  stream._pendingAbortRequest = undefined;
  // The backpressure signal set by the controller.
  stream._backpressure = false;
}
function IsWritableStream(x) {
  if (!typeIsObject$1(x)) {
    return false;
  }
  if (!Object.prototype.hasOwnProperty.call(x, '_writableStreamController')) {
    return false;
  }
  return x instanceof WritableStream;
}
function IsWritableStreamLocked(stream) {
  if (stream._writer === undefined) {
    return false;
  }
  return true;
}
function WritableStreamAbort(stream, reason) {
  var _a;
  if (stream._state === 'closed' || stream._state === 'errored') {
    return promiseResolvedWith(undefined);
  }
  stream._writableStreamController._abortReason = reason;
  (_a = stream._writableStreamController._abortController) === null || _a === void 0 ? void 0 : _a.abort();
  // TypeScript narrows the type of `stream._state` down to 'writable' | 'erroring',
  // but it doesn't know that signaling abort runs author code that might have changed the state.
  // Widen the type again by casting to WritableStreamState.
  const state = stream._state;
  if (state === 'closed' || state === 'errored') {
    return promiseResolvedWith(undefined);
  }
  if (stream._pendingAbortRequest !== undefined) {
    return stream._pendingAbortRequest._promise;
  }
  let wasAlreadyErroring = false;
  if (state === 'erroring') {
    wasAlreadyErroring = true;
    // reason will not be used, so don't keep a reference to it.
    reason = undefined;
  }
  const promise = newPromise((resolve, reject) => {
    stream._pendingAbortRequest = {
      _promise: undefined,
      _resolve: resolve,
      _reject: reject,
      _reason: reason,
      _wasAlreadyErroring: wasAlreadyErroring
    };
  });
  stream._pendingAbortRequest._promise = promise;
  if (!wasAlreadyErroring) {
    WritableStreamStartErroring(stream, reason);
  }
  return promise;
}
function WritableStreamClose(stream) {
  const state = stream._state;
  if (state === 'closed' || state === 'errored') {
    return promiseRejectedWith(new TypeError(`The stream (in ${state} state) is not in the writable state and cannot be closed`));
  }
  const promise = newPromise((resolve, reject) => {
    const closeRequest = {
      _resolve: resolve,
      _reject: reject
    };
    stream._closeRequest = closeRequest;
  });
  const writer = stream._writer;
  if (writer !== undefined && stream._backpressure && state === 'writable') {
    defaultWriterReadyPromiseResolve(writer);
  }
  WritableStreamDefaultControllerClose(stream._writableStreamController);
  return promise;
}
// WritableStream API exposed for controllers.
function WritableStreamAddWriteRequest(stream) {
  const promise = newPromise((resolve, reject) => {
    const writeRequest = {
      _resolve: resolve,
      _reject: reject
    };
    stream._writeRequests.push(writeRequest);
  });
  return promise;
}
function WritableStreamDealWithRejection(stream, error) {
  const state = stream._state;
  if (state === 'writable') {
    WritableStreamStartErroring(stream, error);
    return;
  }
  WritableStreamFinishErroring(stream);
}
function WritableStreamStartErroring(stream, reason) {
  const controller = stream._writableStreamController;
  stream._state = 'erroring';
  stream._storedError = reason;
  const writer = stream._writer;
  if (writer !== undefined) {
    WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, reason);
  }
  if (!WritableStreamHasOperationMarkedInFlight(stream) && controller._started) {
    WritableStreamFinishErroring(stream);
  }
}
function WritableStreamFinishErroring(stream) {
  stream._state = 'errored';
  stream._writableStreamController[ErrorSteps]();
  const storedError = stream._storedError;
  stream._writeRequests.forEach(writeRequest => {
    writeRequest._reject(storedError);
  });
  stream._writeRequests = new SimpleQueue();
  if (stream._pendingAbortRequest === undefined) {
    WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
    return;
  }
  const abortRequest = stream._pendingAbortRequest;
  stream._pendingAbortRequest = undefined;
  if (abortRequest._wasAlreadyErroring) {
    abortRequest._reject(storedError);
    WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
    return;
  }
  const promise = stream._writableStreamController[AbortSteps](abortRequest._reason);
  uponPromise(promise, () => {
    abortRequest._resolve();
    WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
  }, reason => {
    abortRequest._reject(reason);
    WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
  });
}
function WritableStreamFinishInFlightWrite(stream) {
  stream._inFlightWriteRequest._resolve(undefined);
  stream._inFlightWriteRequest = undefined;
}
function WritableStreamFinishInFlightWriteWithError(stream, error) {
  stream._inFlightWriteRequest._reject(error);
  stream._inFlightWriteRequest = undefined;
  WritableStreamDealWithRejection(stream, error);
}
function WritableStreamFinishInFlightClose(stream) {
  stream._inFlightCloseRequest._resolve(undefined);
  stream._inFlightCloseRequest = undefined;
  const state = stream._state;
  if (state === 'erroring') {
    // The error was too late to do anything, so it is ignored.
    stream._storedError = undefined;
    if (stream._pendingAbortRequest !== undefined) {
      stream._pendingAbortRequest._resolve();
      stream._pendingAbortRequest = undefined;
    }
  }
  stream._state = 'closed';
  const writer = stream._writer;
  if (writer !== undefined) {
    defaultWriterClosedPromiseResolve(writer);
  }
}
function WritableStreamFinishInFlightCloseWithError(stream, error) {
  stream._inFlightCloseRequest._reject(error);
  stream._inFlightCloseRequest = undefined;
  // Never execute sink abort() after sink close().
  if (stream._pendingAbortRequest !== undefined) {
    stream._pendingAbortRequest._reject(error);
    stream._pendingAbortRequest = undefined;
  }
  WritableStreamDealWithRejection(stream, error);
}
// TODO(ricea): Fix alphabetical order.
function WritableStreamCloseQueuedOrInFlight(stream) {
  if (stream._closeRequest === undefined && stream._inFlightCloseRequest === undefined) {
    return false;
  }
  return true;
}
function WritableStreamHasOperationMarkedInFlight(stream) {
  if (stream._inFlightWriteRequest === undefined && stream._inFlightCloseRequest === undefined) {
    return false;
  }
  return true;
}
function WritableStreamMarkCloseRequestInFlight(stream) {
  stream._inFlightCloseRequest = stream._closeRequest;
  stream._closeRequest = undefined;
}
function WritableStreamMarkFirstWriteRequestInFlight(stream) {
  stream._inFlightWriteRequest = stream._writeRequests.shift();
}
function WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream) {
  if (stream._closeRequest !== undefined) {
    stream._closeRequest._reject(stream._storedError);
    stream._closeRequest = undefined;
  }
  const writer = stream._writer;
  if (writer !== undefined) {
    defaultWriterClosedPromiseReject(writer, stream._storedError);
  }
}
function WritableStreamUpdateBackpressure(stream, backpressure) {
  const writer = stream._writer;
  if (writer !== undefined && backpressure !== stream._backpressure) {
    if (backpressure) {
      defaultWriterReadyPromiseReset(writer);
    } else {
      defaultWriterReadyPromiseResolve(writer);
    }
  }
  stream._backpressure = backpressure;
}
/**
 * A default writer vended by a {@link WritableStream}.
 *
 * @public
 */
class WritableStreamDefaultWriter {
  constructor(stream) {
    assertRequiredArgument(stream, 1, 'WritableStreamDefaultWriter');
    assertWritableStream(stream, 'First parameter');
    if (IsWritableStreamLocked(stream)) {
      throw new TypeError('This stream has already been locked for exclusive writing by another writer');
    }
    this._ownerWritableStream = stream;
    stream._writer = this;
    const state = stream._state;
    if (state === 'writable') {
      if (!WritableStreamCloseQueuedOrInFlight(stream) && stream._backpressure) {
        defaultWriterReadyPromiseInitialize(this);
      } else {
        defaultWriterReadyPromiseInitializeAsResolved(this);
      }
      defaultWriterClosedPromiseInitialize(this);
    } else if (state === 'erroring') {
      defaultWriterReadyPromiseInitializeAsRejected(this, stream._storedError);
      defaultWriterClosedPromiseInitialize(this);
    } else if (state === 'closed') {
      defaultWriterReadyPromiseInitializeAsResolved(this);
      defaultWriterClosedPromiseInitializeAsResolved(this);
    } else {
      const storedError = stream._storedError;
      defaultWriterReadyPromiseInitializeAsRejected(this, storedError);
      defaultWriterClosedPromiseInitializeAsRejected(this, storedError);
    }
  }
  /**
   * Returns a promise that will be fulfilled when the stream becomes closed, or rejected if the stream ever errors or
   * the writer’s lock is released before the stream finishes closing.
   */
  get closed() {
    if (!IsWritableStreamDefaultWriter(this)) {
      return promiseRejectedWith(defaultWriterBrandCheckException('closed'));
    }
    return this._closedPromise;
  }
  /**
   * Returns the desired size to fill the stream’s internal queue. It can be negative, if the queue is over-full.
   * A producer can use this information to determine the right amount of data to write.
   *
   * It will be `null` if the stream cannot be successfully written to (due to either being errored, or having an abort
   * queued up). It will return zero if the stream is closed. And the getter will throw an exception if invoked when
   * the writer’s lock is released.
   */
  get desiredSize() {
    if (!IsWritableStreamDefaultWriter(this)) {
      throw defaultWriterBrandCheckException('desiredSize');
    }
    if (this._ownerWritableStream === undefined) {
      throw defaultWriterLockException('desiredSize');
    }
    return WritableStreamDefaultWriterGetDesiredSize(this);
  }
  /**
   * Returns a promise that will be fulfilled when the desired size to fill the stream’s internal queue transitions
   * from non-positive to positive, signaling that it is no longer applying backpressure. Once the desired size dips
   * back to zero or below, the getter will return a new promise that stays pending until the next transition.
   *
   * If the stream becomes errored or aborted, or the writer’s lock is released, the returned promise will become
   * rejected.
   */
  get ready() {
    if (!IsWritableStreamDefaultWriter(this)) {
      return promiseRejectedWith(defaultWriterBrandCheckException('ready'));
    }
    return this._readyPromise;
  }
  /**
   * If the reader is active, behaves the same as {@link WritableStream.abort | stream.abort(reason)}.
   */
  abort(reason = undefined) {
    if (!IsWritableStreamDefaultWriter(this)) {
      return promiseRejectedWith(defaultWriterBrandCheckException('abort'));
    }
    if (this._ownerWritableStream === undefined) {
      return promiseRejectedWith(defaultWriterLockException('abort'));
    }
    return WritableStreamDefaultWriterAbort(this, reason);
  }
  /**
   * If the reader is active, behaves the same as {@link WritableStream.close | stream.close()}.
   */
  close() {
    if (!IsWritableStreamDefaultWriter(this)) {
      return promiseRejectedWith(defaultWriterBrandCheckException('close'));
    }
    const stream = this._ownerWritableStream;
    if (stream === undefined) {
      return promiseRejectedWith(defaultWriterLockException('close'));
    }
    if (WritableStreamCloseQueuedOrInFlight(stream)) {
      return promiseRejectedWith(new TypeError('Cannot close an already-closing stream'));
    }
    return WritableStreamDefaultWriterClose(this);
  }
  /**
   * Releases the writer’s lock on the corresponding stream. After the lock is released, the writer is no longer active.
   * If the associated stream is errored when the lock is released, the writer will appear errored in the same way from
   * now on; otherwise, the writer will appear closed.
   *
   * Note that the lock can still be released even if some ongoing writes have not yet finished (i.e. even if the
   * promises returned from previous calls to {@link WritableStreamDefaultWriter.write | write()} have not yet settled).
   * It’s not necessary to hold the lock on the writer for the duration of the write; the lock instead simply prevents
   * other producers from writing in an interleaved manner.
   */
  releaseLock() {
    if (!IsWritableStreamDefaultWriter(this)) {
      throw defaultWriterBrandCheckException('releaseLock');
    }
    const stream = this._ownerWritableStream;
    if (stream === undefined) {
      return;
    }
    WritableStreamDefaultWriterRelease(this);
  }
  write(chunk = undefined) {
    if (!IsWritableStreamDefaultWriter(this)) {
      return promiseRejectedWith(defaultWriterBrandCheckException('write'));
    }
    if (this._ownerWritableStream === undefined) {
      return promiseRejectedWith(defaultWriterLockException('write to'));
    }
    return WritableStreamDefaultWriterWrite(this, chunk);
  }
}
Object.defineProperties(WritableStreamDefaultWriter.prototype, {
  abort: {
    enumerable: true
  },
  close: {
    enumerable: true
  },
  releaseLock: {
    enumerable: true
  },
  write: {
    enumerable: true
  },
  closed: {
    enumerable: true
  },
  desiredSize: {
    enumerable: true
  },
  ready: {
    enumerable: true
  }
});
if (typeof SymbolPolyfill.toStringTag === 'symbol') {
  Object.defineProperty(WritableStreamDefaultWriter.prototype, SymbolPolyfill.toStringTag, {
    value: 'WritableStreamDefaultWriter',
    configurable: true
  });
}
// Abstract operations for the WritableStreamDefaultWriter.
function IsWritableStreamDefaultWriter(x) {
  if (!typeIsObject$1(x)) {
    return false;
  }
  if (!Object.prototype.hasOwnProperty.call(x, '_ownerWritableStream')) {
    return false;
  }
  return x instanceof WritableStreamDefaultWriter;
}
// A client of WritableStreamDefaultWriter may use these functions directly to bypass state check.
function WritableStreamDefaultWriterAbort(writer, reason) {
  const stream = writer._ownerWritableStream;
  return WritableStreamAbort(stream, reason);
}
function WritableStreamDefaultWriterClose(writer) {
  const stream = writer._ownerWritableStream;
  return WritableStreamClose(stream);
}
function WritableStreamDefaultWriterCloseWithErrorPropagation(writer) {
  const stream = writer._ownerWritableStream;
  const state = stream._state;
  if (WritableStreamCloseQueuedOrInFlight(stream) || state === 'closed') {
    return promiseResolvedWith(undefined);
  }
  if (state === 'errored') {
    return promiseRejectedWith(stream._storedError);
  }
  return WritableStreamDefaultWriterClose(writer);
}
function WritableStreamDefaultWriterEnsureClosedPromiseRejected(writer, error) {
  if (writer._closedPromiseState === 'pending') {
    defaultWriterClosedPromiseReject(writer, error);
  } else {
    defaultWriterClosedPromiseResetToRejected(writer, error);
  }
}
function WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, error) {
  if (writer._readyPromiseState === 'pending') {
    defaultWriterReadyPromiseReject(writer, error);
  } else {
    defaultWriterReadyPromiseResetToRejected(writer, error);
  }
}
function WritableStreamDefaultWriterGetDesiredSize(writer) {
  const stream = writer._ownerWritableStream;
  const state = stream._state;
  if (state === 'errored' || state === 'erroring') {
    return null;
  }
  if (state === 'closed') {
    return 0;
  }
  return WritableStreamDefaultControllerGetDesiredSize(stream._writableStreamController);
}
function WritableStreamDefaultWriterRelease(writer) {
  const stream = writer._ownerWritableStream;
  const releasedError = new TypeError(`Writer was released and can no longer be used to monitor the stream's closedness`);
  WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, releasedError);
  // The state transitions to "errored" before the sink abort() method runs, but the writer.closed promise is not
  // rejected until afterwards. This means that simply testing state will not work.
  WritableStreamDefaultWriterEnsureClosedPromiseRejected(writer, releasedError);
  stream._writer = undefined;
  writer._ownerWritableStream = undefined;
}
function WritableStreamDefaultWriterWrite(writer, chunk) {
  const stream = writer._ownerWritableStream;
  const controller = stream._writableStreamController;
  const chunkSize = WritableStreamDefaultControllerGetChunkSize(controller, chunk);
  if (stream !== writer._ownerWritableStream) {
    return promiseRejectedWith(defaultWriterLockException('write to'));
  }
  const state = stream._state;
  if (state === 'errored') {
    return promiseRejectedWith(stream._storedError);
  }
  if (WritableStreamCloseQueuedOrInFlight(stream) || state === 'closed') {
    return promiseRejectedWith(new TypeError('The stream is closing or closed and cannot be written to'));
  }
  if (state === 'erroring') {
    return promiseRejectedWith(stream._storedError);
  }
  const promise = WritableStreamAddWriteRequest(stream);
  WritableStreamDefaultControllerWrite(controller, chunk, chunkSize);
  return promise;
}
const closeSentinel = {};
/**
 * Allows control of a {@link WritableStream | writable stream}'s state and internal queue.
 *
 * @public
 */
class WritableStreamDefaultController {
  constructor() {
    throw new TypeError('Illegal constructor');
  }
  /**
   * The reason which was passed to `WritableStream.abort(reason)` when the stream was aborted.
   *
   * @deprecated
   *  This property has been removed from the specification, see https://github.com/whatwg/streams/pull/1177.
   *  Use {@link WritableStreamDefaultController.signal}'s `reason` instead.
   */
  get abortReason() {
    if (!IsWritableStreamDefaultController(this)) {
      throw defaultControllerBrandCheckException$2('abortReason');
    }
    return this._abortReason;
  }
  /**
   * An `AbortSignal` that can be used to abort the pending write or close operation when the stream is aborted.
   */
  get signal() {
    if (!IsWritableStreamDefaultController(this)) {
      throw defaultControllerBrandCheckException$2('signal');
    }
    if (this._abortController === undefined) {
      // Older browsers or older Node versions may not support `AbortController` or `AbortSignal`.
      // We don't want to bundle and ship an `AbortController` polyfill together with our polyfill,
      // so instead we only implement support for `signal` if we find a global `AbortController` constructor.
      throw new TypeError('WritableStreamDefaultController.prototype.signal is not supported');
    }
    return this._abortController.signal;
  }
  /**
   * Closes the controlled writable stream, making all future interactions with it fail with the given error `e`.
   *
   * This method is rarely used, since usually it suffices to return a rejected promise from one of the underlying
   * sink's methods. However, it can be useful for suddenly shutting down a stream in response to an event outside the
   * normal lifecycle of interactions with the underlying sink.
   */
  error(e = undefined) {
    if (!IsWritableStreamDefaultController(this)) {
      throw defaultControllerBrandCheckException$2('error');
    }
    const state = this._controlledWritableStream._state;
    if (state !== 'writable') {
      // The stream is closed, errored or will be soon. The sink can't do anything useful if it gets an error here, so
      // just treat it as a no-op.
      return;
    }
    WritableStreamDefaultControllerError(this, e);
  }
  /** @internal */
  [AbortSteps](reason) {
    const result = this._abortAlgorithm(reason);
    WritableStreamDefaultControllerClearAlgorithms(this);
    return result;
  }
  /** @internal */
  [ErrorSteps]() {
    ResetQueue(this);
  }
}
Object.defineProperties(WritableStreamDefaultController.prototype, {
  abortReason: {
    enumerable: true
  },
  signal: {
    enumerable: true
  },
  error: {
    enumerable: true
  }
});
if (typeof SymbolPolyfill.toStringTag === 'symbol') {
  Object.defineProperty(WritableStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
    value: 'WritableStreamDefaultController',
    configurable: true
  });
}
// Abstract operations implementing interface required by the WritableStream.
function IsWritableStreamDefaultController(x) {
  if (!typeIsObject$1(x)) {
    return false;
  }
  if (!Object.prototype.hasOwnProperty.call(x, '_controlledWritableStream')) {
    return false;
  }
  return x instanceof WritableStreamDefaultController;
}
function SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm) {
  controller._controlledWritableStream = stream;
  stream._writableStreamController = controller;
  // Need to set the slots so that the assert doesn't fire. In the spec the slots already exist implicitly.
  controller._queue = undefined;
  controller._queueTotalSize = undefined;
  ResetQueue(controller);
  controller._abortReason = undefined;
  controller._abortController = createAbortController();
  controller._started = false;
  controller._strategySizeAlgorithm = sizeAlgorithm;
  controller._strategyHWM = highWaterMark;
  controller._writeAlgorithm = writeAlgorithm;
  controller._closeAlgorithm = closeAlgorithm;
  controller._abortAlgorithm = abortAlgorithm;
  const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
  WritableStreamUpdateBackpressure(stream, backpressure);
  const startResult = startAlgorithm();
  const startPromise = promiseResolvedWith(startResult);
  uponPromise(startPromise, () => {
    controller._started = true;
    WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
  }, r => {
    controller._started = true;
    WritableStreamDealWithRejection(stream, r);
  });
}
function SetUpWritableStreamDefaultControllerFromUnderlyingSink(stream, underlyingSink, highWaterMark, sizeAlgorithm) {
  const controller = Object.create(WritableStreamDefaultController.prototype);
  let startAlgorithm = () => undefined;
  let writeAlgorithm = () => promiseResolvedWith(undefined);
  let closeAlgorithm = () => promiseResolvedWith(undefined);
  let abortAlgorithm = () => promiseResolvedWith(undefined);
  if (underlyingSink.start !== undefined) {
    startAlgorithm = () => underlyingSink.start(controller);
  }
  if (underlyingSink.write !== undefined) {
    writeAlgorithm = chunk => underlyingSink.write(chunk, controller);
  }
  if (underlyingSink.close !== undefined) {
    closeAlgorithm = () => underlyingSink.close();
  }
  if (underlyingSink.abort !== undefined) {
    abortAlgorithm = reason => underlyingSink.abort(reason);
  }
  SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm);
}
// ClearAlgorithms may be called twice. Erroring the same stream in multiple ways will often result in redundant calls.
function WritableStreamDefaultControllerClearAlgorithms(controller) {
  controller._writeAlgorithm = undefined;
  controller._closeAlgorithm = undefined;
  controller._abortAlgorithm = undefined;
  controller._strategySizeAlgorithm = undefined;
}
function WritableStreamDefaultControllerClose(controller) {
  EnqueueValueWithSize(controller, closeSentinel, 0);
  WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
}
function WritableStreamDefaultControllerGetChunkSize(controller, chunk) {
  try {
    return controller._strategySizeAlgorithm(chunk);
  } catch (chunkSizeE) {
    WritableStreamDefaultControllerErrorIfNeeded(controller, chunkSizeE);
    return 1;
  }
}
function WritableStreamDefaultControllerGetDesiredSize(controller) {
  return controller._strategyHWM - controller._queueTotalSize;
}
function WritableStreamDefaultControllerWrite(controller, chunk, chunkSize) {
  try {
    EnqueueValueWithSize(controller, chunk, chunkSize);
  } catch (enqueueE) {
    WritableStreamDefaultControllerErrorIfNeeded(controller, enqueueE);
    return;
  }
  const stream = controller._controlledWritableStream;
  if (!WritableStreamCloseQueuedOrInFlight(stream) && stream._state === 'writable') {
    const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
    WritableStreamUpdateBackpressure(stream, backpressure);
  }
  WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
}
// Abstract operations for the WritableStreamDefaultController.
function WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller) {
  const stream = controller._controlledWritableStream;
  if (!controller._started) {
    return;
  }
  if (stream._inFlightWriteRequest !== undefined) {
    return;
  }
  const state = stream._state;
  if (state === 'erroring') {
    WritableStreamFinishErroring(stream);
    return;
  }
  if (controller._queue.length === 0) {
    return;
  }
  const value = PeekQueueValue(controller);
  if (value === closeSentinel) {
    WritableStreamDefaultControllerProcessClose(controller);
  } else {
    WritableStreamDefaultControllerProcessWrite(controller, value);
  }
}
function WritableStreamDefaultControllerErrorIfNeeded(controller, error) {
  if (controller._controlledWritableStream._state === 'writable') {
    WritableStreamDefaultControllerError(controller, error);
  }
}
function WritableStreamDefaultControllerProcessClose(controller) {
  const stream = controller._controlledWritableStream;
  WritableStreamMarkCloseRequestInFlight(stream);
  DequeueValue(controller);
  const sinkClosePromise = controller._closeAlgorithm();
  WritableStreamDefaultControllerClearAlgorithms(controller);
  uponPromise(sinkClosePromise, () => {
    WritableStreamFinishInFlightClose(stream);
  }, reason => {
    WritableStreamFinishInFlightCloseWithError(stream, reason);
  });
}
function WritableStreamDefaultControllerProcessWrite(controller, chunk) {
  const stream = controller._controlledWritableStream;
  WritableStreamMarkFirstWriteRequestInFlight(stream);
  const sinkWritePromise = controller._writeAlgorithm(chunk);
  uponPromise(sinkWritePromise, () => {
    WritableStreamFinishInFlightWrite(stream);
    const state = stream._state;
    DequeueValue(controller);
    if (!WritableStreamCloseQueuedOrInFlight(stream) && state === 'writable') {
      const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
      WritableStreamUpdateBackpressure(stream, backpressure);
    }
    WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
  }, reason => {
    if (stream._state === 'writable') {
      WritableStreamDefaultControllerClearAlgorithms(controller);
    }
    WritableStreamFinishInFlightWriteWithError(stream, reason);
  });
}
function WritableStreamDefaultControllerGetBackpressure(controller) {
  const desiredSize = WritableStreamDefaultControllerGetDesiredSize(controller);
  return desiredSize <= 0;
}
// A client of WritableStreamDefaultController may use these functions directly to bypass state check.
function WritableStreamDefaultControllerError(controller, error) {
  const stream = controller._controlledWritableStream;
  WritableStreamDefaultControllerClearAlgorithms(controller);
  WritableStreamStartErroring(stream, error);
}
// Helper functions for the WritableStream.
function streamBrandCheckException$2(name) {
  return new TypeError(`WritableStream.prototype.${name} can only be used on a WritableStream`);
}
// Helper functions for the WritableStreamDefaultController.
function defaultControllerBrandCheckException$2(name) {
  return new TypeError(`WritableStreamDefaultController.prototype.${name} can only be used on a WritableStreamDefaultController`);
}
// Helper functions for the WritableStreamDefaultWriter.
function defaultWriterBrandCheckException(name) {
  return new TypeError(`WritableStreamDefaultWriter.prototype.${name} can only be used on a WritableStreamDefaultWriter`);
}
function defaultWriterLockException(name) {
  return new TypeError('Cannot ' + name + ' a stream using a released writer');
}
function defaultWriterClosedPromiseInitialize(writer) {
  writer._closedPromise = newPromise((resolve, reject) => {
    writer._closedPromise_resolve = resolve;
    writer._closedPromise_reject = reject;
    writer._closedPromiseState = 'pending';
  });
}
function defaultWriterClosedPromiseInitializeAsRejected(writer, reason) {
  defaultWriterClosedPromiseInitialize(writer);
  defaultWriterClosedPromiseReject(writer, reason);
}
function defaultWriterClosedPromiseInitializeAsResolved(writer) {
  defaultWriterClosedPromiseInitialize(writer);
  defaultWriterClosedPromiseResolve(writer);
}
function defaultWriterClosedPromiseReject(writer, reason) {
  if (writer._closedPromise_reject === undefined) {
    return;
  }
  setPromiseIsHandledToTrue(writer._closedPromise);
  writer._closedPromise_reject(reason);
  writer._closedPromise_resolve = undefined;
  writer._closedPromise_reject = undefined;
  writer._closedPromiseState = 'rejected';
}
function defaultWriterClosedPromiseResetToRejected(writer, reason) {
  defaultWriterClosedPromiseInitializeAsRejected(writer, reason);
}
function defaultWriterClosedPromiseResolve(writer) {
  if (writer._closedPromise_resolve === undefined) {
    return;
  }
  writer._closedPromise_resolve(undefined);
  writer._closedPromise_resolve = undefined;
  writer._closedPromise_reject = undefined;
  writer._closedPromiseState = 'resolved';
}
function defaultWriterReadyPromiseInitialize(writer) {
  writer._readyPromise = newPromise((resolve, reject) => {
    writer._readyPromise_resolve = resolve;
    writer._readyPromise_reject = reject;
  });
  writer._readyPromiseState = 'pending';
}
function defaultWriterReadyPromiseInitializeAsRejected(writer, reason) {
  defaultWriterReadyPromiseInitialize(writer);
  defaultWriterReadyPromiseReject(writer, reason);
}
function defaultWriterReadyPromiseInitializeAsResolved(writer) {
  defaultWriterReadyPromiseInitialize(writer);
  defaultWriterReadyPromiseResolve(writer);
}
function defaultWriterReadyPromiseReject(writer, reason) {
  if (writer._readyPromise_reject === undefined) {
    return;
  }
  setPromiseIsHandledToTrue(writer._readyPromise);
  writer._readyPromise_reject(reason);
  writer._readyPromise_resolve = undefined;
  writer._readyPromise_reject = undefined;
  writer._readyPromiseState = 'rejected';
}
function defaultWriterReadyPromiseReset(writer) {
  defaultWriterReadyPromiseInitialize(writer);
}
function defaultWriterReadyPromiseResetToRejected(writer, reason) {
  defaultWriterReadyPromiseInitializeAsRejected(writer, reason);
}
function defaultWriterReadyPromiseResolve(writer) {
  if (writer._readyPromise_resolve === undefined) {
    return;
  }
  writer._readyPromise_resolve(undefined);
  writer._readyPromise_resolve = undefined;
  writer._readyPromise_reject = undefined;
  writer._readyPromiseState = 'fulfilled';
}

/// <reference lib="dom" />
const NativeDOMException = typeof DOMException !== 'undefined' ? DOMException : undefined;

/// <reference types="node" />
function isDOMExceptionConstructor(ctor) {
  if (!(typeof ctor === 'function' || typeof ctor === 'object')) {
    return false;
  }
  try {
    new ctor();
    return true;
  } catch (_a) {
    return false;
  }
}
function createDOMExceptionPolyfill() {
  // eslint-disable-next-line no-shadow
  const ctor = function DOMException(message, name) {
    this.message = message || '';
    this.name = name || 'Error';
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  };
  ctor.prototype = Object.create(Error.prototype);
  Object.defineProperty(ctor.prototype, 'constructor', {
    value: ctor,
    writable: true,
    configurable: true
  });
  return ctor;
}
// eslint-disable-next-line no-redeclare
const DOMException$1 = isDOMExceptionConstructor(NativeDOMException) ? NativeDOMException : createDOMExceptionPolyfill();
function ReadableStreamPipeTo(source, dest, preventClose, preventAbort, preventCancel, signal) {
  const reader = AcquireReadableStreamDefaultReader(source);
  const writer = AcquireWritableStreamDefaultWriter(dest);
  source._disturbed = true;
  let shuttingDown = false;
  // This is used to keep track of the spec's requirement that we wait for ongoing writes during shutdown.
  let currentWrite = promiseResolvedWith(undefined);
  return newPromise((resolve, reject) => {
    let abortAlgorithm;
    if (signal !== undefined) {
      abortAlgorithm = () => {
        const error = new DOMException$1('Aborted', 'AbortError');
        const actions = [];
        if (!preventAbort) {
          actions.push(() => {
            if (dest._state === 'writable') {
              return WritableStreamAbort(dest, error);
            }
            return promiseResolvedWith(undefined);
          });
        }
        if (!preventCancel) {
          actions.push(() => {
            if (source._state === 'readable') {
              return ReadableStreamCancel(source, error);
            }
            return promiseResolvedWith(undefined);
          });
        }
        shutdownWithAction(() => Promise.all(actions.map(action => action())), true, error);
      };
      if (signal.aborted) {
        abortAlgorithm();
        return;
      }
      signal.addEventListener('abort', abortAlgorithm);
    }
    // Using reader and writer, read all chunks from this and write them to dest
    // - Backpressure must be enforced
    // - Shutdown must stop all activity
    function pipeLoop() {
      return newPromise((resolveLoop, rejectLoop) => {
        function next(done) {
          if (done) {
            resolveLoop();
          } else {
            // Use `PerformPromiseThen` instead of `uponPromise` to avoid
            // adding unnecessary `.catch(rethrowAssertionErrorRejection)` handlers
            PerformPromiseThen(pipeStep(), next, rejectLoop);
          }
        }
        next(false);
      });
    }
    function pipeStep() {
      if (shuttingDown) {
        return promiseResolvedWith(true);
      }
      return PerformPromiseThen(writer._readyPromise, () => {
        return newPromise((resolveRead, rejectRead) => {
          ReadableStreamDefaultReaderRead(reader, {
            _chunkSteps: chunk => {
              currentWrite = PerformPromiseThen(WritableStreamDefaultWriterWrite(writer, chunk), undefined, noop$2);
              resolveRead(false);
            },
            _closeSteps: () => resolveRead(true),
            _errorSteps: rejectRead
          });
        });
      });
    }
    // Errors must be propagated forward
    isOrBecomesErrored(source, reader._closedPromise, storedError => {
      if (!preventAbort) {
        shutdownWithAction(() => WritableStreamAbort(dest, storedError), true, storedError);
      } else {
        shutdown(true, storedError);
      }
    });
    // Errors must be propagated backward
    isOrBecomesErrored(dest, writer._closedPromise, storedError => {
      if (!preventCancel) {
        shutdownWithAction(() => ReadableStreamCancel(source, storedError), true, storedError);
      } else {
        shutdown(true, storedError);
      }
    });
    // Closing must be propagated forward
    isOrBecomesClosed(source, reader._closedPromise, () => {
      if (!preventClose) {
        shutdownWithAction(() => WritableStreamDefaultWriterCloseWithErrorPropagation(writer));
      } else {
        shutdown();
      }
    });
    // Closing must be propagated backward
    if (WritableStreamCloseQueuedOrInFlight(dest) || dest._state === 'closed') {
      const destClosed = new TypeError('the destination writable stream closed before all data could be piped to it');
      if (!preventCancel) {
        shutdownWithAction(() => ReadableStreamCancel(source, destClosed), true, destClosed);
      } else {
        shutdown(true, destClosed);
      }
    }
    setPromiseIsHandledToTrue(pipeLoop());
    function waitForWritesToFinish() {
      // Another write may have started while we were waiting on this currentWrite, so we have to be sure to wait
      // for that too.
      const oldCurrentWrite = currentWrite;
      return PerformPromiseThen(currentWrite, () => oldCurrentWrite !== currentWrite ? waitForWritesToFinish() : undefined);
    }
    function isOrBecomesErrored(stream, promise, action) {
      if (stream._state === 'errored') {
        action(stream._storedError);
      } else {
        uponRejection(promise, action);
      }
    }
    function isOrBecomesClosed(stream, promise, action) {
      if (stream._state === 'closed') {
        action();
      } else {
        uponFulfillment(promise, action);
      }
    }
    function shutdownWithAction(action, originalIsError, originalError) {
      if (shuttingDown) {
        return;
      }
      shuttingDown = true;
      if (dest._state === 'writable' && !WritableStreamCloseQueuedOrInFlight(dest)) {
        uponFulfillment(waitForWritesToFinish(), doTheRest);
      } else {
        doTheRest();
      }
      function doTheRest() {
        uponPromise(action(), () => finalize(originalIsError, originalError), newError => finalize(true, newError));
      }
    }
    function shutdown(isError, error) {
      if (shuttingDown) {
        return;
      }
      shuttingDown = true;
      if (dest._state === 'writable' && !WritableStreamCloseQueuedOrInFlight(dest)) {
        uponFulfillment(waitForWritesToFinish(), () => finalize(isError, error));
      } else {
        finalize(isError, error);
      }
    }
    function finalize(isError, error) {
      WritableStreamDefaultWriterRelease(writer);
      ReadableStreamReaderGenericRelease(reader);
      if (signal !== undefined) {
        signal.removeEventListener('abort', abortAlgorithm);
      }
      if (isError) {
        reject(error);
      } else {
        resolve(undefined);
      }
    }
  });
}

/**
 * Allows control of a {@link ReadableStream | readable stream}'s state and internal queue.
 *
 * @public
 */
class ReadableStreamDefaultController {
  constructor() {
    throw new TypeError('Illegal constructor');
  }
  /**
   * Returns the desired size to fill the controlled stream's internal queue. It can be negative, if the queue is
   * over-full. An underlying source ought to use this information to determine when and how to apply backpressure.
   */
  get desiredSize() {
    if (!IsReadableStreamDefaultController(this)) {
      throw defaultControllerBrandCheckException$1('desiredSize');
    }
    return ReadableStreamDefaultControllerGetDesiredSize(this);
  }
  /**
   * Closes the controlled readable stream. Consumers will still be able to read any previously-enqueued chunks from
   * the stream, but once those are read, the stream will become closed.
   */
  close() {
    if (!IsReadableStreamDefaultController(this)) {
      throw defaultControllerBrandCheckException$1('close');
    }
    if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(this)) {
      throw new TypeError('The stream is not in a state that permits close');
    }
    ReadableStreamDefaultControllerClose(this);
  }
  enqueue(chunk = undefined) {
    if (!IsReadableStreamDefaultController(this)) {
      throw defaultControllerBrandCheckException$1('enqueue');
    }
    if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(this)) {
      throw new TypeError('The stream is not in a state that permits enqueue');
    }
    return ReadableStreamDefaultControllerEnqueue(this, chunk);
  }
  /**
   * Errors the controlled readable stream, making all future interactions with it fail with the given error `e`.
   */
  error(e = undefined) {
    if (!IsReadableStreamDefaultController(this)) {
      throw defaultControllerBrandCheckException$1('error');
    }
    ReadableStreamDefaultControllerError(this, e);
  }
  /** @internal */
  [CancelSteps](reason) {
    ResetQueue(this);
    const result = this._cancelAlgorithm(reason);
    ReadableStreamDefaultControllerClearAlgorithms(this);
    return result;
  }
  /** @internal */
  [PullSteps](readRequest) {
    const stream = this._controlledReadableStream;
    if (this._queue.length > 0) {
      const chunk = DequeueValue(this);
      if (this._closeRequested && this._queue.length === 0) {
        ReadableStreamDefaultControllerClearAlgorithms(this);
        ReadableStreamClose(stream);
      } else {
        ReadableStreamDefaultControllerCallPullIfNeeded(this);
      }
      readRequest._chunkSteps(chunk);
    } else {
      ReadableStreamAddReadRequest(stream, readRequest);
      ReadableStreamDefaultControllerCallPullIfNeeded(this);
    }
  }
}
Object.defineProperties(ReadableStreamDefaultController.prototype, {
  close: {
    enumerable: true
  },
  enqueue: {
    enumerable: true
  },
  error: {
    enumerable: true
  },
  desiredSize: {
    enumerable: true
  }
});
if (typeof SymbolPolyfill.toStringTag === 'symbol') {
  Object.defineProperty(ReadableStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
    value: 'ReadableStreamDefaultController',
    configurable: true
  });
}
// Abstract operations for the ReadableStreamDefaultController.
function IsReadableStreamDefaultController(x) {
  if (!typeIsObject$1(x)) {
    return false;
  }
  if (!Object.prototype.hasOwnProperty.call(x, '_controlledReadableStream')) {
    return false;
  }
  return x instanceof ReadableStreamDefaultController;
}
function ReadableStreamDefaultControllerCallPullIfNeeded(controller) {
  const shouldPull = ReadableStreamDefaultControllerShouldCallPull(controller);
  if (!shouldPull) {
    return;
  }
  if (controller._pulling) {
    controller._pullAgain = true;
    return;
  }
  controller._pulling = true;
  const pullPromise = controller._pullAlgorithm();
  uponPromise(pullPromise, () => {
    controller._pulling = false;
    if (controller._pullAgain) {
      controller._pullAgain = false;
      ReadableStreamDefaultControllerCallPullIfNeeded(controller);
    }
  }, e => {
    ReadableStreamDefaultControllerError(controller, e);
  });
}
function ReadableStreamDefaultControllerShouldCallPull(controller) {
  const stream = controller._controlledReadableStream;
  if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
    return false;
  }
  if (!controller._started) {
    return false;
  }
  if (IsReadableStreamLocked(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
    return true;
  }
  const desiredSize = ReadableStreamDefaultControllerGetDesiredSize(controller);
  if (desiredSize > 0) {
    return true;
  }
  return false;
}
function ReadableStreamDefaultControllerClearAlgorithms(controller) {
  controller._pullAlgorithm = undefined;
  controller._cancelAlgorithm = undefined;
  controller._strategySizeAlgorithm = undefined;
}
// A client of ReadableStreamDefaultController may use these functions directly to bypass state check.
function ReadableStreamDefaultControllerClose(controller) {
  if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
    return;
  }
  const stream = controller._controlledReadableStream;
  controller._closeRequested = true;
  if (controller._queue.length === 0) {
    ReadableStreamDefaultControllerClearAlgorithms(controller);
    ReadableStreamClose(stream);
  }
}
function ReadableStreamDefaultControllerEnqueue(controller, chunk) {
  if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
    return;
  }
  const stream = controller._controlledReadableStream;
  if (IsReadableStreamLocked(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
    ReadableStreamFulfillReadRequest(stream, chunk, false);
  } else {
    let chunkSize;
    try {
      chunkSize = controller._strategySizeAlgorithm(chunk);
    } catch (chunkSizeE) {
      ReadableStreamDefaultControllerError(controller, chunkSizeE);
      throw chunkSizeE;
    }
    try {
      EnqueueValueWithSize(controller, chunk, chunkSize);
    } catch (enqueueE) {
      ReadableStreamDefaultControllerError(controller, enqueueE);
      throw enqueueE;
    }
  }
  ReadableStreamDefaultControllerCallPullIfNeeded(controller);
}
function ReadableStreamDefaultControllerError(controller, e) {
  const stream = controller._controlledReadableStream;
  if (stream._state !== 'readable') {
    return;
  }
  ResetQueue(controller);
  ReadableStreamDefaultControllerClearAlgorithms(controller);
  ReadableStreamError(stream, e);
}
function ReadableStreamDefaultControllerGetDesiredSize(controller) {
  const state = controller._controlledReadableStream._state;
  if (state === 'errored') {
    return null;
  }
  if (state === 'closed') {
    return 0;
  }
  return controller._strategyHWM - controller._queueTotalSize;
}
// This is used in the implementation of TransformStream.
function ReadableStreamDefaultControllerHasBackpressure(controller) {
  if (ReadableStreamDefaultControllerShouldCallPull(controller)) {
    return false;
  }
  return true;
}
function ReadableStreamDefaultControllerCanCloseOrEnqueue(controller) {
  const state = controller._controlledReadableStream._state;
  if (!controller._closeRequested && state === 'readable') {
    return true;
  }
  return false;
}
function SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm) {
  controller._controlledReadableStream = stream;
  controller._queue = undefined;
  controller._queueTotalSize = undefined;
  ResetQueue(controller);
  controller._started = false;
  controller._closeRequested = false;
  controller._pullAgain = false;
  controller._pulling = false;
  controller._strategySizeAlgorithm = sizeAlgorithm;
  controller._strategyHWM = highWaterMark;
  controller._pullAlgorithm = pullAlgorithm;
  controller._cancelAlgorithm = cancelAlgorithm;
  stream._readableStreamController = controller;
  const startResult = startAlgorithm();
  uponPromise(promiseResolvedWith(startResult), () => {
    controller._started = true;
    ReadableStreamDefaultControllerCallPullIfNeeded(controller);
  }, r => {
    ReadableStreamDefaultControllerError(controller, r);
  });
}
function SetUpReadableStreamDefaultControllerFromUnderlyingSource(stream, underlyingSource, highWaterMark, sizeAlgorithm) {
  const controller = Object.create(ReadableStreamDefaultController.prototype);
  let startAlgorithm = () => undefined;
  let pullAlgorithm = () => promiseResolvedWith(undefined);
  let cancelAlgorithm = () => promiseResolvedWith(undefined);
  if (underlyingSource.start !== undefined) {
    startAlgorithm = () => underlyingSource.start(controller);
  }
  if (underlyingSource.pull !== undefined) {
    pullAlgorithm = () => underlyingSource.pull(controller);
  }
  if (underlyingSource.cancel !== undefined) {
    cancelAlgorithm = reason => underlyingSource.cancel(reason);
  }
  SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm);
}
// Helper functions for the ReadableStreamDefaultController.
function defaultControllerBrandCheckException$1(name) {
  return new TypeError(`ReadableStreamDefaultController.prototype.${name} can only be used on a ReadableStreamDefaultController`);
}
function ReadableStreamTee(stream, cloneForBranch2) {
  if (IsReadableByteStreamController(stream._readableStreamController)) {
    return ReadableByteStreamTee(stream);
  }
  return ReadableStreamDefaultTee(stream);
}
function ReadableStreamDefaultTee(stream, cloneForBranch2) {
  const reader = AcquireReadableStreamDefaultReader(stream);
  let reading = false;
  let readAgain = false;
  let canceled1 = false;
  let canceled2 = false;
  let reason1;
  let reason2;
  let branch1;
  let branch2;
  let resolveCancelPromise;
  const cancelPromise = newPromise(resolve => {
    resolveCancelPromise = resolve;
  });
  function pullAlgorithm() {
    if (reading) {
      readAgain = true;
      return promiseResolvedWith(undefined);
    }
    reading = true;
    const readRequest = {
      _chunkSteps: chunk => {
        // This needs to be delayed a microtask because it takes at least a microtask to detect errors (using
        // reader._closedPromise below), and we want errors in stream to error both branches immediately. We cannot let
        // successful synchronously-available reads get ahead of asynchronously-available errors.
        queueMicrotask(() => {
          readAgain = false;
          const chunk1 = chunk;
          const chunk2 = chunk;
          // There is no way to access the cloning code right now in the reference implementation.
          // If we add one then we'll need an implementation for serializable objects.
          // if (!canceled2 && cloneForBranch2) {
          //   chunk2 = StructuredDeserialize(StructuredSerialize(chunk2));
          // }
          if (!canceled1) {
            ReadableStreamDefaultControllerEnqueue(branch1._readableStreamController, chunk1);
          }
          if (!canceled2) {
            ReadableStreamDefaultControllerEnqueue(branch2._readableStreamController, chunk2);
          }
          reading = false;
          if (readAgain) {
            pullAlgorithm();
          }
        });
      },
      _closeSteps: () => {
        reading = false;
        if (!canceled1) {
          ReadableStreamDefaultControllerClose(branch1._readableStreamController);
        }
        if (!canceled2) {
          ReadableStreamDefaultControllerClose(branch2._readableStreamController);
        }
        if (!canceled1 || !canceled2) {
          resolveCancelPromise(undefined);
        }
      },
      _errorSteps: () => {
        reading = false;
      }
    };
    ReadableStreamDefaultReaderRead(reader, readRequest);
    return promiseResolvedWith(undefined);
  }
  function cancel1Algorithm(reason) {
    canceled1 = true;
    reason1 = reason;
    if (canceled2) {
      const compositeReason = CreateArrayFromList([reason1, reason2]);
      const cancelResult = ReadableStreamCancel(stream, compositeReason);
      resolveCancelPromise(cancelResult);
    }
    return cancelPromise;
  }
  function cancel2Algorithm(reason) {
    canceled2 = true;
    reason2 = reason;
    if (canceled1) {
      const compositeReason = CreateArrayFromList([reason1, reason2]);
      const cancelResult = ReadableStreamCancel(stream, compositeReason);
      resolveCancelPromise(cancelResult);
    }
    return cancelPromise;
  }
  function startAlgorithm() {
    // do nothing
  }
  branch1 = CreateReadableStream(startAlgorithm, pullAlgorithm, cancel1Algorithm);
  branch2 = CreateReadableStream(startAlgorithm, pullAlgorithm, cancel2Algorithm);
  uponRejection(reader._closedPromise, r => {
    ReadableStreamDefaultControllerError(branch1._readableStreamController, r);
    ReadableStreamDefaultControllerError(branch2._readableStreamController, r);
    if (!canceled1 || !canceled2) {
      resolveCancelPromise(undefined);
    }
  });
  return [branch1, branch2];
}
function ReadableByteStreamTee(stream) {
  let reader = AcquireReadableStreamDefaultReader(stream);
  let reading = false;
  let readAgainForBranch1 = false;
  let readAgainForBranch2 = false;
  let canceled1 = false;
  let canceled2 = false;
  let reason1;
  let reason2;
  let branch1;
  let branch2;
  let resolveCancelPromise;
  const cancelPromise = newPromise(resolve => {
    resolveCancelPromise = resolve;
  });
  function forwardReaderError(thisReader) {
    uponRejection(thisReader._closedPromise, r => {
      if (thisReader !== reader) {
        return;
      }
      ReadableByteStreamControllerError(branch1._readableStreamController, r);
      ReadableByteStreamControllerError(branch2._readableStreamController, r);
      if (!canceled1 || !canceled2) {
        resolveCancelPromise(undefined);
      }
    });
  }
  function pullWithDefaultReader() {
    if (IsReadableStreamBYOBReader(reader)) {
      ReadableStreamReaderGenericRelease(reader);
      reader = AcquireReadableStreamDefaultReader(stream);
      forwardReaderError(reader);
    }
    const readRequest = {
      _chunkSteps: chunk => {
        // This needs to be delayed a microtask because it takes at least a microtask to detect errors (using
        // reader._closedPromise below), and we want errors in stream to error both branches immediately. We cannot let
        // successful synchronously-available reads get ahead of asynchronously-available errors.
        queueMicrotask(() => {
          readAgainForBranch1 = false;
          readAgainForBranch2 = false;
          const chunk1 = chunk;
          let chunk2 = chunk;
          if (!canceled1 && !canceled2) {
            try {
              chunk2 = CloneAsUint8Array(chunk);
            } catch (cloneE) {
              ReadableByteStreamControllerError(branch1._readableStreamController, cloneE);
              ReadableByteStreamControllerError(branch2._readableStreamController, cloneE);
              resolveCancelPromise(ReadableStreamCancel(stream, cloneE));
              return;
            }
          }
          if (!canceled1) {
            ReadableByteStreamControllerEnqueue(branch1._readableStreamController, chunk1);
          }
          if (!canceled2) {
            ReadableByteStreamControllerEnqueue(branch2._readableStreamController, chunk2);
          }
          reading = false;
          if (readAgainForBranch1) {
            pull1Algorithm();
          } else if (readAgainForBranch2) {
            pull2Algorithm();
          }
        });
      },
      _closeSteps: () => {
        reading = false;
        if (!canceled1) {
          ReadableByteStreamControllerClose(branch1._readableStreamController);
        }
        if (!canceled2) {
          ReadableByteStreamControllerClose(branch2._readableStreamController);
        }
        if (branch1._readableStreamController._pendingPullIntos.length > 0) {
          ReadableByteStreamControllerRespond(branch1._readableStreamController, 0);
        }
        if (branch2._readableStreamController._pendingPullIntos.length > 0) {
          ReadableByteStreamControllerRespond(branch2._readableStreamController, 0);
        }
        if (!canceled1 || !canceled2) {
          resolveCancelPromise(undefined);
        }
      },
      _errorSteps: () => {
        reading = false;
      }
    };
    ReadableStreamDefaultReaderRead(reader, readRequest);
  }
  function pullWithBYOBReader(view, forBranch2) {
    if (IsReadableStreamDefaultReader(reader)) {
      ReadableStreamReaderGenericRelease(reader);
      reader = AcquireReadableStreamBYOBReader(stream);
      forwardReaderError(reader);
    }
    const byobBranch = forBranch2 ? branch2 : branch1;
    const otherBranch = forBranch2 ? branch1 : branch2;
    const readIntoRequest = {
      _chunkSteps: chunk => {
        // This needs to be delayed a microtask because it takes at least a microtask to detect errors (using
        // reader._closedPromise below), and we want errors in stream to error both branches immediately. We cannot let
        // successful synchronously-available reads get ahead of asynchronously-available errors.
        queueMicrotask(() => {
          readAgainForBranch1 = false;
          readAgainForBranch2 = false;
          const byobCanceled = forBranch2 ? canceled2 : canceled1;
          const otherCanceled = forBranch2 ? canceled1 : canceled2;
          if (!otherCanceled) {
            let clonedChunk;
            try {
              clonedChunk = CloneAsUint8Array(chunk);
            } catch (cloneE) {
              ReadableByteStreamControllerError(byobBranch._readableStreamController, cloneE);
              ReadableByteStreamControllerError(otherBranch._readableStreamController, cloneE);
              resolveCancelPromise(ReadableStreamCancel(stream, cloneE));
              return;
            }
            if (!byobCanceled) {
              ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
            }
            ReadableByteStreamControllerEnqueue(otherBranch._readableStreamController, clonedChunk);
          } else if (!byobCanceled) {
            ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
          }
          reading = false;
          if (readAgainForBranch1) {
            pull1Algorithm();
          } else if (readAgainForBranch2) {
            pull2Algorithm();
          }
        });
      },
      _closeSteps: chunk => {
        reading = false;
        const byobCanceled = forBranch2 ? canceled2 : canceled1;
        const otherCanceled = forBranch2 ? canceled1 : canceled2;
        if (!byobCanceled) {
          ReadableByteStreamControllerClose(byobBranch._readableStreamController);
        }
        if (!otherCanceled) {
          ReadableByteStreamControllerClose(otherBranch._readableStreamController);
        }
        if (chunk !== undefined) {
          if (!byobCanceled) {
            ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
          }
          if (!otherCanceled && otherBranch._readableStreamController._pendingPullIntos.length > 0) {
            ReadableByteStreamControllerRespond(otherBranch._readableStreamController, 0);
          }
        }
        if (!byobCanceled || !otherCanceled) {
          resolveCancelPromise(undefined);
        }
      },
      _errorSteps: () => {
        reading = false;
      }
    };
    ReadableStreamBYOBReaderRead(reader, view, readIntoRequest);
  }
  function pull1Algorithm() {
    if (reading) {
      readAgainForBranch1 = true;
      return promiseResolvedWith(undefined);
    }
    reading = true;
    const byobRequest = ReadableByteStreamControllerGetBYOBRequest(branch1._readableStreamController);
    if (byobRequest === null) {
      pullWithDefaultReader();
    } else {
      pullWithBYOBReader(byobRequest._view, false);
    }
    return promiseResolvedWith(undefined);
  }
  function pull2Algorithm() {
    if (reading) {
      readAgainForBranch2 = true;
      return promiseResolvedWith(undefined);
    }
    reading = true;
    const byobRequest = ReadableByteStreamControllerGetBYOBRequest(branch2._readableStreamController);
    if (byobRequest === null) {
      pullWithDefaultReader();
    } else {
      pullWithBYOBReader(byobRequest._view, true);
    }
    return promiseResolvedWith(undefined);
  }
  function cancel1Algorithm(reason) {
    canceled1 = true;
    reason1 = reason;
    if (canceled2) {
      const compositeReason = CreateArrayFromList([reason1, reason2]);
      const cancelResult = ReadableStreamCancel(stream, compositeReason);
      resolveCancelPromise(cancelResult);
    }
    return cancelPromise;
  }
  function cancel2Algorithm(reason) {
    canceled2 = true;
    reason2 = reason;
    if (canceled1) {
      const compositeReason = CreateArrayFromList([reason1, reason2]);
      const cancelResult = ReadableStreamCancel(stream, compositeReason);
      resolveCancelPromise(cancelResult);
    }
    return cancelPromise;
  }
  function startAlgorithm() {
    return;
  }
  branch1 = CreateReadableByteStream(startAlgorithm, pull1Algorithm, cancel1Algorithm);
  branch2 = CreateReadableByteStream(startAlgorithm, pull2Algorithm, cancel2Algorithm);
  forwardReaderError(reader);
  return [branch1, branch2];
}
function convertUnderlyingDefaultOrByteSource(source, context) {
  assertDictionary(source, context);
  const original = source;
  const autoAllocateChunkSize = original === null || original === void 0 ? void 0 : original.autoAllocateChunkSize;
  const cancel = original === null || original === void 0 ? void 0 : original.cancel;
  const pull = original === null || original === void 0 ? void 0 : original.pull;
  const start = original === null || original === void 0 ? void 0 : original.start;
  const type = original === null || original === void 0 ? void 0 : original.type;
  return {
    autoAllocateChunkSize: autoAllocateChunkSize === undefined ? undefined : convertUnsignedLongLongWithEnforceRange(autoAllocateChunkSize, `${context} has member 'autoAllocateChunkSize' that`),
    cancel: cancel === undefined ? undefined : convertUnderlyingSourceCancelCallback(cancel, original, `${context} has member 'cancel' that`),
    pull: pull === undefined ? undefined : convertUnderlyingSourcePullCallback(pull, original, `${context} has member 'pull' that`),
    start: start === undefined ? undefined : convertUnderlyingSourceStartCallback(start, original, `${context} has member 'start' that`),
    type: type === undefined ? undefined : convertReadableStreamType(type, `${context} has member 'type' that`)
  };
}
function convertUnderlyingSourceCancelCallback(fn, original, context) {
  assertFunction(fn, context);
  return reason => promiseCall(fn, original, [reason]);
}
function convertUnderlyingSourcePullCallback(fn, original, context) {
  assertFunction(fn, context);
  return controller => promiseCall(fn, original, [controller]);
}
function convertUnderlyingSourceStartCallback(fn, original, context) {
  assertFunction(fn, context);
  return controller => reflectCall(fn, original, [controller]);
}
function convertReadableStreamType(type, context) {
  type = `${type}`;
  if (type !== 'bytes') {
    throw new TypeError(`${context} '${type}' is not a valid enumeration value for ReadableStreamType`);
  }
  return type;
}
function convertReaderOptions(options, context) {
  assertDictionary(options, context);
  const mode = options === null || options === void 0 ? void 0 : options.mode;
  return {
    mode: mode === undefined ? undefined : convertReadableStreamReaderMode(mode, `${context} has member 'mode' that`)
  };
}
function convertReadableStreamReaderMode(mode, context) {
  mode = `${mode}`;
  if (mode !== 'byob') {
    throw new TypeError(`${context} '${mode}' is not a valid enumeration value for ReadableStreamReaderMode`);
  }
  return mode;
}
function convertIteratorOptions(options, context) {
  assertDictionary(options, context);
  const preventCancel = options === null || options === void 0 ? void 0 : options.preventCancel;
  return {
    preventCancel: Boolean(preventCancel)
  };
}
function convertPipeOptions(options, context) {
  assertDictionary(options, context);
  const preventAbort = options === null || options === void 0 ? void 0 : options.preventAbort;
  const preventCancel = options === null || options === void 0 ? void 0 : options.preventCancel;
  const preventClose = options === null || options === void 0 ? void 0 : options.preventClose;
  const signal = options === null || options === void 0 ? void 0 : options.signal;
  if (signal !== undefined) {
    assertAbortSignal(signal, `${context} has member 'signal' that`);
  }
  return {
    preventAbort: Boolean(preventAbort),
    preventCancel: Boolean(preventCancel),
    preventClose: Boolean(preventClose),
    signal
  };
}
function assertAbortSignal(signal, context) {
  if (!isAbortSignal(signal)) {
    throw new TypeError(`${context} is not an AbortSignal.`);
  }
}
function convertReadableWritablePair(pair, context) {
  assertDictionary(pair, context);
  const readable = pair === null || pair === void 0 ? void 0 : pair.readable;
  assertRequiredField(readable, 'readable', 'ReadableWritablePair');
  assertReadableStream(readable, `${context} has member 'readable' that`);
  const writable = pair === null || pair === void 0 ? void 0 : pair.writable;
  assertRequiredField(writable, 'writable', 'ReadableWritablePair');
  assertWritableStream(writable, `${context} has member 'writable' that`);
  return {
    readable,
    writable
  };
}

/**
 * A readable stream represents a source of data, from which you can read.
 *
 * @public
 */
let ReadableStream$1 = class ReadableStream {
  constructor(rawUnderlyingSource = {}, rawStrategy = {}) {
    if (rawUnderlyingSource === undefined) {
      rawUnderlyingSource = null;
    } else {
      assertObject(rawUnderlyingSource, 'First parameter');
    }
    const strategy = convertQueuingStrategy(rawStrategy, 'Second parameter');
    const underlyingSource = convertUnderlyingDefaultOrByteSource(rawUnderlyingSource, 'First parameter');
    InitializeReadableStream(this);
    if (underlyingSource.type === 'bytes') {
      if (strategy.size !== undefined) {
        throw new RangeError('The strategy for a byte stream cannot have a size function');
      }
      const highWaterMark = ExtractHighWaterMark(strategy, 0);
      SetUpReadableByteStreamControllerFromUnderlyingSource(this, underlyingSource, highWaterMark);
    } else {
      const sizeAlgorithm = ExtractSizeAlgorithm(strategy);
      const highWaterMark = ExtractHighWaterMark(strategy, 1);
      SetUpReadableStreamDefaultControllerFromUnderlyingSource(this, underlyingSource, highWaterMark, sizeAlgorithm);
    }
  }
  /**
   * Whether or not the readable stream is locked to a {@link ReadableStreamDefaultReader | reader}.
   */
  get locked() {
    if (!IsReadableStream(this)) {
      throw streamBrandCheckException$1('locked');
    }
    return IsReadableStreamLocked(this);
  }
  /**
   * Cancels the stream, signaling a loss of interest in the stream by a consumer.
   *
   * The supplied `reason` argument will be given to the underlying source's {@link UnderlyingSource.cancel | cancel()}
   * method, which might or might not use it.
   */
  cancel(reason = undefined) {
    if (!IsReadableStream(this)) {
      return promiseRejectedWith(streamBrandCheckException$1('cancel'));
    }
    if (IsReadableStreamLocked(this)) {
      return promiseRejectedWith(new TypeError('Cannot cancel a stream that already has a reader'));
    }
    return ReadableStreamCancel(this, reason);
  }
  getReader(rawOptions = undefined) {
    if (!IsReadableStream(this)) {
      throw streamBrandCheckException$1('getReader');
    }
    const options = convertReaderOptions(rawOptions, 'First parameter');
    if (options.mode === undefined) {
      return AcquireReadableStreamDefaultReader(this);
    }
    return AcquireReadableStreamBYOBReader(this);
  }
  pipeThrough(rawTransform, rawOptions = {}) {
    if (!IsReadableStream(this)) {
      throw streamBrandCheckException$1('pipeThrough');
    }
    assertRequiredArgument(rawTransform, 1, 'pipeThrough');
    const transform = convertReadableWritablePair(rawTransform, 'First parameter');
    const options = convertPipeOptions(rawOptions, 'Second parameter');
    if (IsReadableStreamLocked(this)) {
      throw new TypeError('ReadableStream.prototype.pipeThrough cannot be used on a locked ReadableStream');
    }
    if (IsWritableStreamLocked(transform.writable)) {
      throw new TypeError('ReadableStream.prototype.pipeThrough cannot be used on a locked WritableStream');
    }
    const promise = ReadableStreamPipeTo(this, transform.writable, options.preventClose, options.preventAbort, options.preventCancel, options.signal);
    setPromiseIsHandledToTrue(promise);
    return transform.readable;
  }
  pipeTo(destination, rawOptions = {}) {
    if (!IsReadableStream(this)) {
      return promiseRejectedWith(streamBrandCheckException$1('pipeTo'));
    }
    if (destination === undefined) {
      return promiseRejectedWith(`Parameter 1 is required in 'pipeTo'.`);
    }
    if (!IsWritableStream(destination)) {
      return promiseRejectedWith(new TypeError(`ReadableStream.prototype.pipeTo's first argument must be a WritableStream`));
    }
    let options;
    try {
      options = convertPipeOptions(rawOptions, 'Second parameter');
    } catch (e) {
      return promiseRejectedWith(e);
    }
    if (IsReadableStreamLocked(this)) {
      return promiseRejectedWith(new TypeError('ReadableStream.prototype.pipeTo cannot be used on a locked ReadableStream'));
    }
    if (IsWritableStreamLocked(destination)) {
      return promiseRejectedWith(new TypeError('ReadableStream.prototype.pipeTo cannot be used on a locked WritableStream'));
    }
    return ReadableStreamPipeTo(this, destination, options.preventClose, options.preventAbort, options.preventCancel, options.signal);
  }
  /**
   * Tees this readable stream, returning a two-element array containing the two resulting branches as
   * new {@link ReadableStream} instances.
   *
   * Teeing a stream will lock it, preventing any other consumer from acquiring a reader.
   * To cancel the stream, cancel both of the resulting branches; a composite cancellation reason will then be
   * propagated to the stream's underlying source.
   *
   * Note that the chunks seen in each branch will be the same object. If the chunks are not immutable,
   * this could allow interference between the two branches.
   */
  tee() {
    if (!IsReadableStream(this)) {
      throw streamBrandCheckException$1('tee');
    }
    const branches = ReadableStreamTee(this);
    return CreateArrayFromList(branches);
  }
  values(rawOptions = undefined) {
    if (!IsReadableStream(this)) {
      throw streamBrandCheckException$1('values');
    }
    const options = convertIteratorOptions(rawOptions, 'First parameter');
    return AcquireReadableStreamAsyncIterator(this, options.preventCancel);
  }
};
Object.defineProperties(ReadableStream$1.prototype, {
  cancel: {
    enumerable: true
  },
  getReader: {
    enumerable: true
  },
  pipeThrough: {
    enumerable: true
  },
  pipeTo: {
    enumerable: true
  },
  tee: {
    enumerable: true
  },
  values: {
    enumerable: true
  },
  locked: {
    enumerable: true
  }
});
if (typeof SymbolPolyfill.toStringTag === 'symbol') {
  Object.defineProperty(ReadableStream$1.prototype, SymbolPolyfill.toStringTag, {
    value: 'ReadableStream',
    configurable: true
  });
}
if (typeof SymbolPolyfill.asyncIterator === 'symbol') {
  Object.defineProperty(ReadableStream$1.prototype, SymbolPolyfill.asyncIterator, {
    value: ReadableStream$1.prototype.values,
    writable: true,
    configurable: true
  });
}
// Abstract operations for the ReadableStream.
// Throws if and only if startAlgorithm throws.
function CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark = 1, sizeAlgorithm = () => 1) {
  const stream = Object.create(ReadableStream$1.prototype);
  InitializeReadableStream(stream);
  const controller = Object.create(ReadableStreamDefaultController.prototype);
  SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm);
  return stream;
}
// Throws if and only if startAlgorithm throws.
function CreateReadableByteStream(startAlgorithm, pullAlgorithm, cancelAlgorithm) {
  const stream = Object.create(ReadableStream$1.prototype);
  InitializeReadableStream(stream);
  const controller = Object.create(ReadableByteStreamController.prototype);
  SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, 0, undefined);
  return stream;
}
function InitializeReadableStream(stream) {
  stream._state = 'readable';
  stream._reader = undefined;
  stream._storedError = undefined;
  stream._disturbed = false;
}
function IsReadableStream(x) {
  if (!typeIsObject$1(x)) {
    return false;
  }
  if (!Object.prototype.hasOwnProperty.call(x, '_readableStreamController')) {
    return false;
  }
  return x instanceof ReadableStream$1;
}
function IsReadableStreamLocked(stream) {
  if (stream._reader === undefined) {
    return false;
  }
  return true;
}
// ReadableStream API exposed for controllers.
function ReadableStreamCancel(stream, reason) {
  stream._disturbed = true;
  if (stream._state === 'closed') {
    return promiseResolvedWith(undefined);
  }
  if (stream._state === 'errored') {
    return promiseRejectedWith(stream._storedError);
  }
  ReadableStreamClose(stream);
  const reader = stream._reader;
  if (reader !== undefined && IsReadableStreamBYOBReader(reader)) {
    reader._readIntoRequests.forEach(readIntoRequest => {
      readIntoRequest._closeSteps(undefined);
    });
    reader._readIntoRequests = new SimpleQueue();
  }
  const sourceCancelPromise = stream._readableStreamController[CancelSteps](reason);
  return transformPromiseWith(sourceCancelPromise, noop$2);
}
function ReadableStreamClose(stream) {
  stream._state = 'closed';
  const reader = stream._reader;
  if (reader === undefined) {
    return;
  }
  defaultReaderClosedPromiseResolve(reader);
  if (IsReadableStreamDefaultReader(reader)) {
    reader._readRequests.forEach(readRequest => {
      readRequest._closeSteps();
    });
    reader._readRequests = new SimpleQueue();
  }
}
function ReadableStreamError(stream, e) {
  stream._state = 'errored';
  stream._storedError = e;
  const reader = stream._reader;
  if (reader === undefined) {
    return;
  }
  defaultReaderClosedPromiseReject(reader, e);
  if (IsReadableStreamDefaultReader(reader)) {
    reader._readRequests.forEach(readRequest => {
      readRequest._errorSteps(e);
    });
    reader._readRequests = new SimpleQueue();
  } else {
    reader._readIntoRequests.forEach(readIntoRequest => {
      readIntoRequest._errorSteps(e);
    });
    reader._readIntoRequests = new SimpleQueue();
  }
}
// Helper functions for the ReadableStream.
function streamBrandCheckException$1(name) {
  return new TypeError(`ReadableStream.prototype.${name} can only be used on a ReadableStream`);
}
function convertQueuingStrategyInit(init, context) {
  assertDictionary(init, context);
  const highWaterMark = init === null || init === void 0 ? void 0 : init.highWaterMark;
  assertRequiredField(highWaterMark, 'highWaterMark', 'QueuingStrategyInit');
  return {
    highWaterMark: convertUnrestrictedDouble(highWaterMark)
  };
}

// The size function must not have a prototype property nor be a constructor
const byteLengthSizeFunction = chunk => {
  return chunk.byteLength;
};
try {
  Object.defineProperty(byteLengthSizeFunction, 'name', {
    value: 'size',
    configurable: true
  });
} catch (_a) {
  // This property is non-configurable in older browsers, so ignore if this throws.
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name#browser_compatibility
}
/**
 * A queuing strategy that counts the number of bytes in each chunk.
 *
 * @public
 */
class ByteLengthQueuingStrategy {
  constructor(options) {
    assertRequiredArgument(options, 1, 'ByteLengthQueuingStrategy');
    options = convertQueuingStrategyInit(options, 'First parameter');
    this._byteLengthQueuingStrategyHighWaterMark = options.highWaterMark;
  }
  /**
   * Returns the high water mark provided to the constructor.
   */
  get highWaterMark() {
    if (!IsByteLengthQueuingStrategy(this)) {
      throw byteLengthBrandCheckException('highWaterMark');
    }
    return this._byteLengthQueuingStrategyHighWaterMark;
  }
  /**
   * Measures the size of `chunk` by returning the value of its `byteLength` property.
   */
  get size() {
    if (!IsByteLengthQueuingStrategy(this)) {
      throw byteLengthBrandCheckException('size');
    }
    return byteLengthSizeFunction;
  }
}
Object.defineProperties(ByteLengthQueuingStrategy.prototype, {
  highWaterMark: {
    enumerable: true
  },
  size: {
    enumerable: true
  }
});
if (typeof SymbolPolyfill.toStringTag === 'symbol') {
  Object.defineProperty(ByteLengthQueuingStrategy.prototype, SymbolPolyfill.toStringTag, {
    value: 'ByteLengthQueuingStrategy',
    configurable: true
  });
}
// Helper functions for the ByteLengthQueuingStrategy.
function byteLengthBrandCheckException(name) {
  return new TypeError(`ByteLengthQueuingStrategy.prototype.${name} can only be used on a ByteLengthQueuingStrategy`);
}
function IsByteLengthQueuingStrategy(x) {
  if (!typeIsObject$1(x)) {
    return false;
  }
  if (!Object.prototype.hasOwnProperty.call(x, '_byteLengthQueuingStrategyHighWaterMark')) {
    return false;
  }
  return x instanceof ByteLengthQueuingStrategy;
}

// The size function must not have a prototype property nor be a constructor
const countSizeFunction = () => {
  return 1;
};
try {
  Object.defineProperty(countSizeFunction, 'name', {
    value: 'size',
    configurable: true
  });
} catch (_a) {
  // This property is non-configurable in older browsers, so ignore if this throws.
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name#browser_compatibility
}
/**
 * A queuing strategy that counts the number of chunks.
 *
 * @public
 */
class CountQueuingStrategy {
  constructor(options) {
    assertRequiredArgument(options, 1, 'CountQueuingStrategy');
    options = convertQueuingStrategyInit(options, 'First parameter');
    this._countQueuingStrategyHighWaterMark = options.highWaterMark;
  }
  /**
   * Returns the high water mark provided to the constructor.
   */
  get highWaterMark() {
    if (!IsCountQueuingStrategy(this)) {
      throw countBrandCheckException('highWaterMark');
    }
    return this._countQueuingStrategyHighWaterMark;
  }
  /**
   * Measures the size of `chunk` by always returning 1.
   * This ensures that the total queue size is a count of the number of chunks in the queue.
   */
  get size() {
    if (!IsCountQueuingStrategy(this)) {
      throw countBrandCheckException('size');
    }
    return countSizeFunction;
  }
}
Object.defineProperties(CountQueuingStrategy.prototype, {
  highWaterMark: {
    enumerable: true
  },
  size: {
    enumerable: true
  }
});
if (typeof SymbolPolyfill.toStringTag === 'symbol') {
  Object.defineProperty(CountQueuingStrategy.prototype, SymbolPolyfill.toStringTag, {
    value: 'CountQueuingStrategy',
    configurable: true
  });
}
// Helper functions for the CountQueuingStrategy.
function countBrandCheckException(name) {
  return new TypeError(`CountQueuingStrategy.prototype.${name} can only be used on a CountQueuingStrategy`);
}
function IsCountQueuingStrategy(x) {
  if (!typeIsObject$1(x)) {
    return false;
  }
  if (!Object.prototype.hasOwnProperty.call(x, '_countQueuingStrategyHighWaterMark')) {
    return false;
  }
  return x instanceof CountQueuingStrategy;
}
function convertTransformer(original, context) {
  assertDictionary(original, context);
  const flush = original === null || original === void 0 ? void 0 : original.flush;
  const readableType = original === null || original === void 0 ? void 0 : original.readableType;
  const start = original === null || original === void 0 ? void 0 : original.start;
  const transform = original === null || original === void 0 ? void 0 : original.transform;
  const writableType = original === null || original === void 0 ? void 0 : original.writableType;
  return {
    flush: flush === undefined ? undefined : convertTransformerFlushCallback(flush, original, `${context} has member 'flush' that`),
    readableType,
    start: start === undefined ? undefined : convertTransformerStartCallback(start, original, `${context} has member 'start' that`),
    transform: transform === undefined ? undefined : convertTransformerTransformCallback(transform, original, `${context} has member 'transform' that`),
    writableType
  };
}
function convertTransformerFlushCallback(fn, original, context) {
  assertFunction(fn, context);
  return controller => promiseCall(fn, original, [controller]);
}
function convertTransformerStartCallback(fn, original, context) {
  assertFunction(fn, context);
  return controller => reflectCall(fn, original, [controller]);
}
function convertTransformerTransformCallback(fn, original, context) {
  assertFunction(fn, context);
  return (chunk, controller) => promiseCall(fn, original, [chunk, controller]);
}

// Class TransformStream
/**
 * A transform stream consists of a pair of streams: a {@link WritableStream | writable stream},
 * known as its writable side, and a {@link ReadableStream | readable stream}, known as its readable side.
 * In a manner specific to the transform stream in question, writes to the writable side result in new data being
 * made available for reading from the readable side.
 *
 * @public
 */
let TransformStream$1 = class TransformStream {
  constructor(rawTransformer = {}, rawWritableStrategy = {}, rawReadableStrategy = {}) {
    if (rawTransformer === undefined) {
      rawTransformer = null;
    }
    const writableStrategy = convertQueuingStrategy(rawWritableStrategy, 'Second parameter');
    const readableStrategy = convertQueuingStrategy(rawReadableStrategy, 'Third parameter');
    const transformer = convertTransformer(rawTransformer, 'First parameter');
    if (transformer.readableType !== undefined) {
      throw new RangeError('Invalid readableType specified');
    }
    if (transformer.writableType !== undefined) {
      throw new RangeError('Invalid writableType specified');
    }
    const readableHighWaterMark = ExtractHighWaterMark(readableStrategy, 0);
    const readableSizeAlgorithm = ExtractSizeAlgorithm(readableStrategy);
    const writableHighWaterMark = ExtractHighWaterMark(writableStrategy, 1);
    const writableSizeAlgorithm = ExtractSizeAlgorithm(writableStrategy);
    let startPromise_resolve;
    const startPromise = newPromise(resolve => {
      startPromise_resolve = resolve;
    });
    InitializeTransformStream(this, startPromise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm);
    SetUpTransformStreamDefaultControllerFromTransformer(this, transformer);
    if (transformer.start !== undefined) {
      startPromise_resolve(transformer.start(this._transformStreamController));
    } else {
      startPromise_resolve(undefined);
    }
  }
  /**
   * The readable side of the transform stream.
   */
  get readable() {
    if (!IsTransformStream(this)) {
      throw streamBrandCheckException('readable');
    }
    return this._readable;
  }
  /**
   * The writable side of the transform stream.
   */
  get writable() {
    if (!IsTransformStream(this)) {
      throw streamBrandCheckException('writable');
    }
    return this._writable;
  }
};
Object.defineProperties(TransformStream$1.prototype, {
  readable: {
    enumerable: true
  },
  writable: {
    enumerable: true
  }
});
if (typeof SymbolPolyfill.toStringTag === 'symbol') {
  Object.defineProperty(TransformStream$1.prototype, SymbolPolyfill.toStringTag, {
    value: 'TransformStream',
    configurable: true
  });
}
function InitializeTransformStream(stream, startPromise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm) {
  function startAlgorithm() {
    return startPromise;
  }
  function writeAlgorithm(chunk) {
    return TransformStreamDefaultSinkWriteAlgorithm(stream, chunk);
  }
  function abortAlgorithm(reason) {
    return TransformStreamDefaultSinkAbortAlgorithm(stream, reason);
  }
  function closeAlgorithm() {
    return TransformStreamDefaultSinkCloseAlgorithm(stream);
  }
  stream._writable = CreateWritableStream(startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, writableHighWaterMark, writableSizeAlgorithm);
  function pullAlgorithm() {
    return TransformStreamDefaultSourcePullAlgorithm(stream);
  }
  function cancelAlgorithm(reason) {
    TransformStreamErrorWritableAndUnblockWrite(stream, reason);
    return promiseResolvedWith(undefined);
  }
  stream._readable = CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, readableHighWaterMark, readableSizeAlgorithm);
  // The [[backpressure]] slot is set to undefined so that it can be initialised by TransformStreamSetBackpressure.
  stream._backpressure = undefined;
  stream._backpressureChangePromise = undefined;
  stream._backpressureChangePromise_resolve = undefined;
  TransformStreamSetBackpressure(stream, true);
  stream._transformStreamController = undefined;
}
function IsTransformStream(x) {
  if (!typeIsObject$1(x)) {
    return false;
  }
  if (!Object.prototype.hasOwnProperty.call(x, '_transformStreamController')) {
    return false;
  }
  return x instanceof TransformStream$1;
}
// This is a no-op if both sides are already errored.
function TransformStreamError(stream, e) {
  ReadableStreamDefaultControllerError(stream._readable._readableStreamController, e);
  TransformStreamErrorWritableAndUnblockWrite(stream, e);
}
function TransformStreamErrorWritableAndUnblockWrite(stream, e) {
  TransformStreamDefaultControllerClearAlgorithms(stream._transformStreamController);
  WritableStreamDefaultControllerErrorIfNeeded(stream._writable._writableStreamController, e);
  if (stream._backpressure) {
    // Pretend that pull() was called to permit any pending write() calls to complete. TransformStreamSetBackpressure()
    // cannot be called from enqueue() or pull() once the ReadableStream is errored, so this will will be the final time
    // _backpressure is set.
    TransformStreamSetBackpressure(stream, false);
  }
}
function TransformStreamSetBackpressure(stream, backpressure) {
  // Passes also when called during construction.
  if (stream._backpressureChangePromise !== undefined) {
    stream._backpressureChangePromise_resolve();
  }
  stream._backpressureChangePromise = newPromise(resolve => {
    stream._backpressureChangePromise_resolve = resolve;
  });
  stream._backpressure = backpressure;
}
// Class TransformStreamDefaultController
/**
 * Allows control of the {@link ReadableStream} and {@link WritableStream} of the associated {@link TransformStream}.
 *
 * @public
 */
class TransformStreamDefaultController {
  constructor() {
    throw new TypeError('Illegal constructor');
  }
  /**
   * Returns the desired size to fill the readable side’s internal queue. It can be negative, if the queue is over-full.
   */
  get desiredSize() {
    if (!IsTransformStreamDefaultController(this)) {
      throw defaultControllerBrandCheckException('desiredSize');
    }
    const readableController = this._controlledTransformStream._readable._readableStreamController;
    return ReadableStreamDefaultControllerGetDesiredSize(readableController);
  }
  enqueue(chunk = undefined) {
    if (!IsTransformStreamDefaultController(this)) {
      throw defaultControllerBrandCheckException('enqueue');
    }
    TransformStreamDefaultControllerEnqueue(this, chunk);
  }
  /**
   * Errors both the readable side and the writable side of the controlled transform stream, making all future
   * interactions with it fail with the given error `e`. Any chunks queued for transformation will be discarded.
   */
  error(reason = undefined) {
    if (!IsTransformStreamDefaultController(this)) {
      throw defaultControllerBrandCheckException('error');
    }
    TransformStreamDefaultControllerError(this, reason);
  }
  /**
   * Closes the readable side and errors the writable side of the controlled transform stream. This is useful when the
   * transformer only needs to consume a portion of the chunks written to the writable side.
   */
  terminate() {
    if (!IsTransformStreamDefaultController(this)) {
      throw defaultControllerBrandCheckException('terminate');
    }
    TransformStreamDefaultControllerTerminate(this);
  }
}
Object.defineProperties(TransformStreamDefaultController.prototype, {
  enqueue: {
    enumerable: true
  },
  error: {
    enumerable: true
  },
  terminate: {
    enumerable: true
  },
  desiredSize: {
    enumerable: true
  }
});
if (typeof SymbolPolyfill.toStringTag === 'symbol') {
  Object.defineProperty(TransformStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
    value: 'TransformStreamDefaultController',
    configurable: true
  });
}
// Transform Stream Default Controller Abstract Operations
function IsTransformStreamDefaultController(x) {
  if (!typeIsObject$1(x)) {
    return false;
  }
  if (!Object.prototype.hasOwnProperty.call(x, '_controlledTransformStream')) {
    return false;
  }
  return x instanceof TransformStreamDefaultController;
}
function SetUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm) {
  controller._controlledTransformStream = stream;
  stream._transformStreamController = controller;
  controller._transformAlgorithm = transformAlgorithm;
  controller._flushAlgorithm = flushAlgorithm;
}
function SetUpTransformStreamDefaultControllerFromTransformer(stream, transformer) {
  const controller = Object.create(TransformStreamDefaultController.prototype);
  let transformAlgorithm = chunk => {
    try {
      TransformStreamDefaultControllerEnqueue(controller, chunk);
      return promiseResolvedWith(undefined);
    } catch (transformResultE) {
      return promiseRejectedWith(transformResultE);
    }
  };
  let flushAlgorithm = () => promiseResolvedWith(undefined);
  if (transformer.transform !== undefined) {
    transformAlgorithm = chunk => transformer.transform(chunk, controller);
  }
  if (transformer.flush !== undefined) {
    flushAlgorithm = () => transformer.flush(controller);
  }
  SetUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm);
}
function TransformStreamDefaultControllerClearAlgorithms(controller) {
  controller._transformAlgorithm = undefined;
  controller._flushAlgorithm = undefined;
}
function TransformStreamDefaultControllerEnqueue(controller, chunk) {
  const stream = controller._controlledTransformStream;
  const readableController = stream._readable._readableStreamController;
  if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(readableController)) {
    throw new TypeError('Readable side is not in a state that permits enqueue');
  }
  // We throttle transform invocations based on the backpressure of the ReadableStream, but we still
  // accept TransformStreamDefaultControllerEnqueue() calls.
  try {
    ReadableStreamDefaultControllerEnqueue(readableController, chunk);
  } catch (e) {
    // This happens when readableStrategy.size() throws.
    TransformStreamErrorWritableAndUnblockWrite(stream, e);
    throw stream._readable._storedError;
  }
  const backpressure = ReadableStreamDefaultControllerHasBackpressure(readableController);
  if (backpressure !== stream._backpressure) {
    TransformStreamSetBackpressure(stream, true);
  }
}
function TransformStreamDefaultControllerError(controller, e) {
  TransformStreamError(controller._controlledTransformStream, e);
}
function TransformStreamDefaultControllerPerformTransform(controller, chunk) {
  const transformPromise = controller._transformAlgorithm(chunk);
  return transformPromiseWith(transformPromise, undefined, r => {
    TransformStreamError(controller._controlledTransformStream, r);
    throw r;
  });
}
function TransformStreamDefaultControllerTerminate(controller) {
  const stream = controller._controlledTransformStream;
  const readableController = stream._readable._readableStreamController;
  ReadableStreamDefaultControllerClose(readableController);
  const error = new TypeError('TransformStream terminated');
  TransformStreamErrorWritableAndUnblockWrite(stream, error);
}
// TransformStreamDefaultSink Algorithms
function TransformStreamDefaultSinkWriteAlgorithm(stream, chunk) {
  const controller = stream._transformStreamController;
  if (stream._backpressure) {
    const backpressureChangePromise = stream._backpressureChangePromise;
    return transformPromiseWith(backpressureChangePromise, () => {
      const writable = stream._writable;
      const state = writable._state;
      if (state === 'erroring') {
        throw writable._storedError;
      }
      return TransformStreamDefaultControllerPerformTransform(controller, chunk);
    });
  }
  return TransformStreamDefaultControllerPerformTransform(controller, chunk);
}
function TransformStreamDefaultSinkAbortAlgorithm(stream, reason) {
  // abort() is not called synchronously, so it is possible for abort() to be called when the stream is already
  // errored.
  TransformStreamError(stream, reason);
  return promiseResolvedWith(undefined);
}
function TransformStreamDefaultSinkCloseAlgorithm(stream) {
  // stream._readable cannot change after construction, so caching it across a call to user code is safe.
  const readable = stream._readable;
  const controller = stream._transformStreamController;
  const flushPromise = controller._flushAlgorithm();
  TransformStreamDefaultControllerClearAlgorithms(controller);
  // Return a promise that is fulfilled with undefined on success.
  return transformPromiseWith(flushPromise, () => {
    if (readable._state === 'errored') {
      throw readable._storedError;
    }
    ReadableStreamDefaultControllerClose(readable._readableStreamController);
  }, r => {
    TransformStreamError(stream, r);
    throw readable._storedError;
  });
}
// TransformStreamDefaultSource Algorithms
function TransformStreamDefaultSourcePullAlgorithm(stream) {
  // Invariant. Enforced by the promises returned by start() and pull().
  TransformStreamSetBackpressure(stream, false);
  // Prevent the next pull() call until there is backpressure.
  return stream._backpressureChangePromise;
}
// Helper functions for the TransformStreamDefaultController.
function defaultControllerBrandCheckException(name) {
  return new TypeError(`TransformStreamDefaultController.prototype.${name} can only be used on a TransformStreamDefaultController`);
}
// Helper functions for the TransformStream.
function streamBrandCheckException(name) {
  return new TypeError(`TransformStream.prototype.${name} can only be used on a TransformStream`);
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function (d, b) {
  extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (d, b) {
    d.__proto__ = b;
  } || function (d, b) {
    for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
  };
  return extendStatics(d, b);
};
function __extends(d, b) {
  if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
function assert(test) {
  if (!test) {
    throw new TypeError('Assertion failed');
  }
}
function noop$1() {
  return;
}
function typeIsObject(x) {
  return typeof x === 'object' && x !== null || typeof x === 'function';
}
function isStreamConstructor(ctor) {
  if (typeof ctor !== 'function') {
    return false;
  }
  var startCalled = false;
  try {
    new ctor({
      start: function () {
        startCalled = true;
      }
    });
  } catch (e) {
    // ignore
  }
  return startCalled;
}
function isReadableStream(readable) {
  if (!typeIsObject(readable)) {
    return false;
  }
  if (typeof readable.getReader !== 'function') {
    return false;
  }
  return true;
}
function isReadableStreamConstructor(ctor) {
  if (!isStreamConstructor(ctor)) {
    return false;
  }
  if (!isReadableStream(new ctor())) {
    return false;
  }
  return true;
}
function isWritableStream(writable) {
  if (!typeIsObject(writable)) {
    return false;
  }
  if (typeof writable.getWriter !== 'function') {
    return false;
  }
  return true;
}
function isTransformStream(transform) {
  if (!typeIsObject(transform)) {
    return false;
  }
  if (!isReadableStream(transform.readable)) {
    return false;
  }
  if (!isWritableStream(transform.writable)) {
    return false;
  }
  return true;
}
function isTransformStreamConstructor(ctor) {
  if (!isStreamConstructor(ctor)) {
    return false;
  }
  if (!isTransformStream(new ctor())) {
    return false;
  }
  return true;
}
function supportsByobReader(readable) {
  try {
    var reader = readable.getReader({
      mode: 'byob'
    });
    reader.releaseLock();
    return true;
  } catch (_a) {
    return false;
  }
}
function supportsByteSource(ctor) {
  try {
    new ctor({
      type: 'bytes'
    });
    return true;
  } catch (_a) {
    return false;
  }
}
function createReadableStreamWrapper(ctor) {
  assert(isReadableStreamConstructor(ctor));
  var byteSourceSupported = supportsByteSource(ctor);
  return function (readable, _a) {
    var _b = _a === void 0 ? {} : _a,
      type = _b.type;
    type = parseReadableType(type);
    if (type === 'bytes' && !byteSourceSupported) {
      type = undefined;
    }
    if (readable.constructor === ctor) {
      if (type !== 'bytes' || supportsByobReader(readable)) {
        return readable;
      }
    }
    if (type === 'bytes') {
      var source = createWrappingReadableSource(readable, {
        type: type
      });
      return new ctor(source);
    } else {
      var source = createWrappingReadableSource(readable);
      return new ctor(source);
    }
  };
}
function createWrappingReadableSource(readable, _a) {
  var _b = _a === void 0 ? {} : _a,
    type = _b.type;
  assert(isReadableStream(readable));
  assert(readable.locked === false);
  type = parseReadableType(type);
  var source;
  if (type === 'bytes') {
    source = new WrappingReadableByteStreamSource(readable);
  } else {
    source = new WrappingReadableStreamDefaultSource(readable);
  }
  return source;
}
function parseReadableType(type) {
  var typeString = String(type);
  if (typeString === 'bytes') {
    return typeString;
  } else if (type === undefined) {
    return type;
  } else {
    throw new RangeError('Invalid type is specified');
  }
}
var AbstractWrappingReadableStreamSource = /** @class */function () {
  function AbstractWrappingReadableStreamSource(underlyingStream) {
    this._underlyingReader = undefined;
    this._readerMode = undefined;
    this._readableStreamController = undefined;
    this._pendingRead = undefined;
    this._underlyingStream = underlyingStream;
    // always keep a reader attached to detect close/error
    this._attachDefaultReader();
  }
  AbstractWrappingReadableStreamSource.prototype.start = function (controller) {
    this._readableStreamController = controller;
  };
  AbstractWrappingReadableStreamSource.prototype.cancel = function (reason) {
    assert(this._underlyingReader !== undefined);
    return this._underlyingReader.cancel(reason);
  };
  AbstractWrappingReadableStreamSource.prototype._attachDefaultReader = function () {
    if (this._readerMode === "default" /* DEFAULT */) {
      return;
    }
    this._detachReader();
    var reader = this._underlyingStream.getReader();
    this._readerMode = "default" /* DEFAULT */;
    this._attachReader(reader);
  };
  AbstractWrappingReadableStreamSource.prototype._attachReader = function (reader) {
    var _this = this;
    assert(this._underlyingReader === undefined);
    this._underlyingReader = reader;
    var closed = this._underlyingReader.closed;
    if (!closed) {
      return;
    }
    closed.then(function () {
      return _this._finishPendingRead();
    }).then(function () {
      if (reader === _this._underlyingReader) {
        _this._readableStreamController.close();
      }
    }, function (reason) {
      if (reader === _this._underlyingReader) {
        _this._readableStreamController.error(reason);
      }
    }).catch(noop$1);
  };
  AbstractWrappingReadableStreamSource.prototype._detachReader = function () {
    if (this._underlyingReader === undefined) {
      return;
    }
    this._underlyingReader.releaseLock();
    this._underlyingReader = undefined;
    this._readerMode = undefined;
  };
  AbstractWrappingReadableStreamSource.prototype._pullWithDefaultReader = function () {
    var _this = this;
    this._attachDefaultReader();
    // TODO Backpressure?
    var read = this._underlyingReader.read().then(function (result) {
      var controller = _this._readableStreamController;
      if (result.done) {
        _this._tryClose();
      } else {
        controller.enqueue(result.value);
      }
    });
    this._setPendingRead(read);
    return read;
  };
  AbstractWrappingReadableStreamSource.prototype._tryClose = function () {
    try {
      this._readableStreamController.close();
    } catch (_a) {
      // already errored or closed
    }
  };
  AbstractWrappingReadableStreamSource.prototype._setPendingRead = function (readPromise) {
    var _this = this;
    var pendingRead;
    var finishRead = function () {
      if (_this._pendingRead === pendingRead) {
        _this._pendingRead = undefined;
      }
    };
    this._pendingRead = pendingRead = readPromise.then(finishRead, finishRead);
  };
  AbstractWrappingReadableStreamSource.prototype._finishPendingRead = function () {
    var _this = this;
    if (!this._pendingRead) {
      return undefined;
    }
    var afterRead = function () {
      return _this._finishPendingRead();
    };
    return this._pendingRead.then(afterRead, afterRead);
  };
  return AbstractWrappingReadableStreamSource;
}();
var WrappingReadableStreamDefaultSource = /** @class */function (_super) {
  __extends(WrappingReadableStreamDefaultSource, _super);
  function WrappingReadableStreamDefaultSource() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  WrappingReadableStreamDefaultSource.prototype.pull = function () {
    return this._pullWithDefaultReader();
  };
  return WrappingReadableStreamDefaultSource;
}(AbstractWrappingReadableStreamSource);
function toUint8Array(view) {
  return new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
}
function copyArrayBufferView(from, to) {
  var fromArray = toUint8Array(from);
  var toArray = toUint8Array(to);
  toArray.set(fromArray, 0);
}
var WrappingReadableByteStreamSource = /** @class */function (_super) {
  __extends(WrappingReadableByteStreamSource, _super);
  function WrappingReadableByteStreamSource(underlyingStream) {
    var _this = this;
    var supportsByob = supportsByobReader(underlyingStream);
    _this = _super.call(this, underlyingStream) || this;
    _this._supportsByob = supportsByob;
    return _this;
  }
  Object.defineProperty(WrappingReadableByteStreamSource.prototype, "type", {
    get: function () {
      return 'bytes';
    },
    enumerable: false,
    configurable: true
  });
  WrappingReadableByteStreamSource.prototype._attachByobReader = function () {
    if (this._readerMode === "byob" /* BYOB */) {
      return;
    }
    assert(this._supportsByob);
    this._detachReader();
    var reader = this._underlyingStream.getReader({
      mode: 'byob'
    });
    this._readerMode = "byob" /* BYOB */;
    this._attachReader(reader);
  };
  WrappingReadableByteStreamSource.prototype.pull = function () {
    if (this._supportsByob) {
      var byobRequest = this._readableStreamController.byobRequest;
      if (byobRequest) {
        return this._pullWithByobRequest(byobRequest);
      }
    }
    return this._pullWithDefaultReader();
  };
  WrappingReadableByteStreamSource.prototype._pullWithByobRequest = function (byobRequest) {
    var _this = this;
    this._attachByobReader();
    // reader.read(view) detaches the input view, therefore we cannot pass byobRequest.view directly
    // create a separate buffer to read into, then copy that to byobRequest.view
    var buffer = new Uint8Array(byobRequest.view.byteLength);
    // TODO Backpressure?
    var read = this._underlyingReader.read(buffer).then(function (result) {
      _this._readableStreamController;
      if (result.done) {
        _this._tryClose();
        byobRequest.respond(0);
      } else {
        copyArrayBufferView(result.value, byobRequest.view);
        byobRequest.respond(result.value.byteLength);
      }
    });
    this._setPendingRead(read);
    return read;
  };
  return WrappingReadableByteStreamSource;
}(AbstractWrappingReadableStreamSource);
function createTransformStreamWrapper(ctor) {
  assert(isTransformStreamConstructor(ctor));
  return function (transform) {
    if (transform.constructor === ctor) {
      return transform;
    }
    var transformer = createWrappingTransformer(transform);
    return new ctor(transformer);
  };
}
function createWrappingTransformer(transform) {
  assert(isTransformStream(transform));
  var readable = transform.readable,
    writable = transform.writable;
  assert(readable.locked === false);
  assert(writable.locked === false);
  var reader = readable.getReader();
  var writer;
  try {
    writer = writable.getWriter();
  } catch (e) {
    reader.releaseLock(); // do not leak reader
    throw e;
  }
  return new WrappingTransformStreamTransformer(reader, writer);
}
var WrappingTransformStreamTransformer = /** @class */function () {
  function WrappingTransformStreamTransformer(reader, writer) {
    var _this = this;
    this._transformStreamController = undefined;
    this._onRead = function (result) {
      if (result.done) {
        return;
      }
      _this._transformStreamController.enqueue(result.value);
      return _this._reader.read().then(_this._onRead);
    };
    this._onError = function (reason) {
      _this._flushReject(reason);
      _this._transformStreamController.error(reason);
      _this._reader.cancel(reason).catch(noop$1);
      _this._writer.abort(reason).catch(noop$1);
    };
    this._onTerminate = function () {
      _this._flushResolve();
      _this._transformStreamController.terminate();
      var error = new TypeError('TransformStream terminated');
      _this._writer.abort(error).catch(noop$1);
    };
    this._reader = reader;
    this._writer = writer;
    this._flushPromise = new Promise(function (resolve, reject) {
      _this._flushResolve = resolve;
      _this._flushReject = reject;
    });
  }
  WrappingTransformStreamTransformer.prototype.start = function (controller) {
    this._transformStreamController = controller;
    this._reader.read().then(this._onRead).then(this._onTerminate, this._onError);
    var readerClosed = this._reader.closed;
    if (readerClosed) {
      readerClosed.then(this._onTerminate, this._onError);
    }
  };
  WrappingTransformStreamTransformer.prototype.transform = function (chunk) {
    return this._writer.write(chunk);
  };
  WrappingTransformStreamTransformer.prototype.flush = function () {
    var _this = this;
    return this._writer.close().then(function () {
      return _this._flushPromise;
    });
  };
  return WrappingTransformStreamTransformer;
}();

// @ts-nocheck

// Taken from https://github.com/GoogleChromeLabs/text-encode-transform-polyfill/blob/ca78bcec819b5f354550798ec0378b66d7adcc63/text-encode-transform.js

// Copyright 2016 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Polyfill for TextEncoderStream and TextDecoderStream

(function () {

  if (typeof self.TextEncoderStream === "function" && typeof self.TextDecoderStream === "function") {
    // The constructors exist. Assume that they work and don't replace them.
    return;
  }

  // These symbols end up being different for every realm, so mixing objects
  // created in one realm with methods created in another fails.
  const codec = Symbol("codec");
  const transform = Symbol("transform");
  class TextEncoderStream {
    constructor() {
      this[codec] = new TextEncoder();
      this[transform] = new TransformStream(new TextEncodeTransformer(this[codec]));
    }
  }
  class TextDecoderStream {
    constructor(label = undefined, options = undefined) {
      this[codec] = new TextDecoder(label, options);
      this[transform] = new TransformStream(new TextDecodeTransformer(this[codec]));
    }
  }

  // ECMAScript class syntax will create getters that are non-enumerable, but we
  // need them to be enumerable in WebIDL-style, so we add them manually.
  // "readable" and "writable" are always delegated to the TransformStream
  // object. Properties specified in |properties| are delegated to the
  // underlying TextEncoder or TextDecoder.
  function addDelegatingProperties(prototype, properties) {
    for (const transformProperty of ["readable", "writable"]) {
      addGetter(prototype, transformProperty, function () {
        return this[transform][transformProperty];
      });
    }
    for (const codecProperty of properties) {
      addGetter(prototype, codecProperty, function () {
        return this[codec][codecProperty];
      });
    }
  }
  function addGetter(prototype, property, getter) {
    Object.defineProperty(prototype, property, {
      configurable: true,
      enumerable: true,
      get: getter
    });
  }
  addDelegatingProperties(TextEncoderStream.prototype, ["encoding"]);
  addDelegatingProperties(TextDecoderStream.prototype, ["encoding", "fatal", "ignoreBOM"]);
  class TextEncodeTransformer {
    constructor() {
      this._encoder = new TextEncoder();
      this._carry = undefined;
    }
    transform(chunk, controller) {
      chunk = String(chunk);
      if (this._carry !== undefined) {
        chunk = this._carry + chunk;
        this._carry = undefined;
      }
      const terminalCodeUnit = chunk.charCodeAt(chunk.length - 1);
      if (terminalCodeUnit >= 0xd800 && terminalCodeUnit < 0xdc00) {
        this._carry = chunk.substring(chunk.length - 1);
        chunk = chunk.substring(0, chunk.length - 1);
      }
      const encoded = this._encoder.encode(chunk);
      if (encoded.length > 0) {
        controller.enqueue(encoded);
      }
    }
    flush(controller) {
      if (this._carry !== undefined) {
        controller.enqueue(this._encoder.encode(this._carry));
        this._carry = undefined;
      }
    }
  }
  class TextDecodeTransformer {
    constructor(decoder) {
      this._decoder = new TextDecoder(decoder.encoding, {
        fatal: decoder.fatal,
        ignoreBOM: decoder.ignoreBOM
      });
    }
    transform(chunk, controller) {
      const decoded = this._decoder.decode(chunk, {
        stream: true
      });
      if (decoded != "") {
        controller.enqueue(decoded);
      }
    }
    flush(controller) {
      // If {fatal: false} is in options (the default), then the final call to
      // decode() can produce extra output (usually the unicode replacement
      // character 0xFFFD). When fatal is true, this call is just used for its
      // side-effect of throwing a TypeError exception if the input is
      // incomplete.
      const output = this._decoder.decode();
      if (output !== "") {
        controller.enqueue(output);
      }
    }
  }
  function exportAs(name, value) {
    // Make it stringify as [object <name>] rather than [object Object].
    value.prototype[Symbol.toStringTag] = name;
    Object.defineProperty(self, name, {
      configurable: true,
      enumerable: false,
      writable: true,
      value
    });
  }
  exportAs("TextEncoderStream", TextEncoderStream);
  exportAs("TextDecoderStream", TextDecoderStream);
})();

// These are polyfills that are used everywhere, including modern browsers.

// Chrome 92, Firefox 90, Safari 15.4
// https://github.com/tc39/proposal-relative-indexing-method#polyfill
function at(n) {
  // ToInteger() abstract op
  n = Math.trunc(n) || 0;
  // Allow negative indexing from the end
  if (n < 0) n += this.length;
  // OOB access is guaranteed to return undefined
  if (n < 0 || n >= this.length) return undefined;
  // Otherwise, this is just normal property access
  return this[n];
}
if (!Array.prototype.at) {
  for (const C of [Array, String]) {
    Object.defineProperty(C.prototype, "at", {
      value: at,
      writable: true,
      enumerable: false,
      configurable: true
    });
  }
}

// Chrome 93, Firefox 92, Safari 15.4
if (!Object.hasOwn) {
  Object.defineProperty(Object, "hasOwn", {
    value: function (object, property) {
      if (object == null) {
        throw new TypeError("Cannot convert undefined or null to object");
      }
      return Object.prototype.hasOwnProperty.call(Object(object), property);
    },
    configurable: true,
    enumerable: false,
    writable: true
  });
}

// Comments indicate where I'd have to bump minimum supported browser versions to get rid of these.

// Chrome 54
// Inlined from MDN
if (!Object.entries) {
  Object.entries = obj => {
    const ownProps = Object.keys(obj);
    let i = ownProps.length;
    const resArray = new Array(i); // preallocate the Array

    while (i--) {
      resArray[i] = [ownProps[i], obj[ownProps[i]]];
    }
    return resArray;
  };
}
if (!Object.values) {
  Object.values = obj => {
    const ownProps = Object.keys(obj);
    let i = ownProps.length;
    const resArray = new Array(i); // preallocate the Array

    while (i--) {
      resArray[i] = obj[ownProps[i]];
    }
    return resArray;
  };
}

// Chrome 69, Safari 12
// https://github.com/behnammodi/polyfill/blob/1a5965edc0e2eaf8e6d87902cc719462e2a889fb/array.polyfill.js#L598-L622
if (!Array.prototype.flat) {
  Object.defineProperty(Array.prototype, "flat", {
    configurable: true,
    writable: true,
    value: function () {
      const depth =
      // eslint-disable-next-line prefer-rest-params
      typeof arguments[0] === "undefined" ? 1 : Number(arguments[0]) || 0;
      const result = [];
      const forEach = result.forEach;
      const flatDeep = function (arr, depth) {
        forEach.call(arr, function (val) {
          if (depth > 0 && Array.isArray(val)) {
            flatDeep(val, depth - 1);
          } else {
            result.push(val);
          }
        });
      };
      flatDeep(this, depth);
      return result;
    }
  });
}

// It's all or nothing for stream polyfills, because native methods return native streams which do not play nice with the polyfill streams.
const POLYFILL_STREAMS = !self.WritableStream || !self.TransformStream;
if (POLYFILL_STREAMS) {
  // Chrome 67, Firefox 102, Safari 14.1 (those are for TransformStream, which was the last implemented in some browsers, so that's the cutoff for removing all of these polyfills)
  self.ReadableStream = ReadableStream$1;
  self.TransformStream = TransformStream$1;
  self.WritableStream = WritableStream;
  createReadableStreamWrapper(ReadableStream$1);
  createTransformStreamWrapper(TransformStream$1);
}

// Chrome 52
if (self.CountQueuingStrategy === undefined) {
  self.CountQueuingStrategy = CountQueuingStrategy;
}

// Chrome 76, Safari 14.1
// Based on https://stackoverflow.com/a/65087341/786644
if (!Blob.prototype.stream) {
  Blob.prototype.stream = function () {
    let offset = 0;
    const chunkSize = 64 * 1024;

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const blob = this;
    return new ReadableStream({
      pull(controller) {
        return new Promise(resolve => {
          if (offset < blob.size) {
            const blobChunk = blob.slice(offset, offset + chunkSize);
            const reader = new FileReader();
            reader.onload = event => {
              controller.enqueue(event.currentTarget.result);
              offset += chunkSize;
              if (offset >= blob.size) {
                controller.close();
              }
              resolve();
            };
            reader.readAsArrayBuffer(blobChunk);
          }
        });
      }
    });
  };
}

var bugsnagReactExports = {};
var bugsnagReact = {
  get exports(){ return bugsnagReactExports; },
  set exports(v){ bugsnagReactExports = v; },
};

(function (module, exports) {
	(function (f) {
	  {
	    module.exports = f();
	  }
	})(function () {
	  var _$src_1 = {};
	  function _extends() {
	    _extends = Object.assign || function (target) {
	      for (var i = 1; i < arguments.length; i++) {
	        var source = arguments[i];
	        for (var key in source) {
	          if (Object.prototype.hasOwnProperty.call(source, key)) {
	            target[key] = source[key];
	          }
	        }
	      }
	      return target;
	    };
	    return _extends.apply(this, arguments);
	  }
	  function _assertThisInitialized(self) {
	    if (self === void 0) {
	      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	    }
	    return self;
	  }
	  function _inheritsLoose(subClass, superClass) {
	    subClass.prototype = Object.create(superClass.prototype);
	    subClass.prototype.constructor = subClass;
	    _setPrototypeOf(subClass, superClass);
	  }
	  function _setPrototypeOf(o, p) {
	    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
	      o.__proto__ = p;
	      return o;
	    };
	    return _setPrototypeOf(o, p);
	  }
	  _$src_1 = /*#__PURE__*/function () {
	    function BugsnagPluginReact() {
	      // Fetch React from the window object, if it exists
	      var globalReact = typeof window !== 'undefined' && window.React;
	      this.name = 'react';
	      this.lazy = arguments.length === 0 && !globalReact;
	      if (!this.lazy) {
	        this.React = (arguments.length <= 0 ? undefined : arguments[0]) || globalReact;
	        if (!this.React) throw new Error('@bugsnag/plugin-react reference to `React` was undefined');
	      }
	    }
	    var _proto = BugsnagPluginReact.prototype;
	    _proto.load = function load(client) {
	      if (!this.lazy) {
	        var ErrorBoundary = createClass(this.React, client);
	        ErrorBoundary.createErrorBoundary = function () {
	          return ErrorBoundary;
	        };
	        return ErrorBoundary;
	      }
	      var BugsnagPluginReactLazyInitializer = function () {
	        throw new Error("@bugsnag/plugin-react was used incorrectly. Valid usage is as follows:\nPass React to the plugin constructor\n\n  `Bugsnag.start({ plugins: [new BugsnagPluginReact(React)] })`\nand then call `const ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary()`\n\nOr if React is not available until after Bugsnag has started,\nconstruct the plugin with no arguments\n  `Bugsnag.start({ plugins: [new BugsnagPluginReact()] })`,\nthen pass in React when available to construct your error boundary\n  `const ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React)`");
	      };
	      BugsnagPluginReactLazyInitializer.createErrorBoundary = function (React) {
	        if (!React) throw new Error('@bugsnag/plugin-react reference to `React` was undefined');
	        return createClass(React, client);
	      };
	      return BugsnagPluginReactLazyInitializer;
	    };
	    return BugsnagPluginReact;
	  }();
	  var formatComponentStack = function (str) {
	    var lines = str.split(/\s*\n\s*/g);
	    var ret = '';
	    for (var line = 0, len = lines.length; line < len; line++) {
	      if (lines[line].length) ret += "" + (ret.length ? '\n' : '') + lines[line];
	    }
	    return ret;
	  };
	  var createClass = function (React, client) {
	    return /*#__PURE__*/function (_React$Component) {
	      _inheritsLoose(ErrorBoundary, _React$Component);
	      function ErrorBoundary(props) {
	        var _this;
	        _this = _React$Component.call(this, props) || this;
	        _this.state = {
	          error: null,
	          info: null
	        };
	        _this.handleClearError = _this.handleClearError.bind(_assertThisInitialized(_this));
	        return _this;
	      }
	      var _proto2 = ErrorBoundary.prototype;
	      _proto2.handleClearError = function handleClearError() {
	        this.setState({
	          error: null,
	          info: null
	        });
	      };
	      _proto2.componentDidCatch = function componentDidCatch(error, info) {
	        var onError = this.props.onError;
	        var handledState = {
	          severity: 'error',
	          unhandled: true,
	          severityReason: {
	            type: 'unhandledException'
	          }
	        };
	        var event = client.Event.create(error, true, handledState, 1);
	        if (info && info.componentStack) info.componentStack = formatComponentStack(info.componentStack);
	        event.addMetadata('react', info);
	        client._notify(event, onError);
	        this.setState({
	          error: error,
	          info: info
	        });
	      };
	      _proto2.render = function render() {
	        var error = this.state.error;
	        if (error) {
	          var FallbackComponent = this.props.FallbackComponent;
	          if (FallbackComponent) return React.createElement(FallbackComponent, _extends({}, this.state, {
	            clearError: this.handleClearError
	          }));
	          return null;
	        }
	        return this.props.children;
	      };
	      return ErrorBoundary;
	    }(React.Component);
	  };
	  _$src_1.formatComponentStack = formatComponentStack;
	  _$src_1["default"] = _$src_1;
	  return _$src_1;
	});
} (bugsnagReact));

var BugsnagPluginReact = bugsnagReactExports;

Bugsnag.start({
  apiKey: window.bugsnagKey,
  appVersion: window.bbgmVersion,
  autoTrackSessions: false,
  onError: function (event) {
    // Normalize league URLs to all look the same
    if (event && typeof event.context === "string") {
      event.context = event.context.replace(/^\/l\/[0-9]+?\//, "/l/0/");
    }
  },
  enabledReleaseStages: ["beta", "production"],
  plugins: [new BugsnagPluginReact()],
  releaseStage: window.releaseStage
});

/**
 * Safe chained function
 *
 * Will only create a new function if needed,
 * otherwise will pass back existing functions or null.
 *
 * @param {function} functions to chain
 * @returns {function|null}
 */
function createChainedFunction(...funcs) {
  return funcs.filter(f => f != null).reduce((acc, f) => {
    if (typeof f !== 'function') {
      throw new Error('Invalid Argument Type, must only provide functions, undefined, or null.');
    }
    if (acc === null) return f;
    return function chainedFunction(...args) {
      // @ts-ignore
      acc.apply(this, args);
      // @ts-ignore
      f.apply(this, args);
    };
  }, null);
}

const MARGINS = {
  height: ['marginTop', 'marginBottom'],
  width: ['marginLeft', 'marginRight']
};
function getDefaultDimensionValue(dimension, elem) {
  const offset = `offset${dimension[0].toUpperCase()}${dimension.slice(1)}`;
  const value = elem[offset];
  const margins = MARGINS[dimension];
  return value +
  // @ts-ignore
  parseInt(style(elem, margins[0]), 10) +
  // @ts-ignore
  parseInt(style(elem, margins[1]), 10);
}
const collapseStyles = {
  [EXITED]: 'collapse',
  [EXITING]: 'collapsing',
  [ENTERING]: 'collapsing',
  [ENTERED]: 'collapse show'
};
const defaultProps$7 = {
  in: false,
  timeout: 300,
  mountOnEnter: false,
  unmountOnExit: false,
  appear: false,
  getDimensionValue: getDefaultDimensionValue
};
const Collapse = /*#__PURE__*/React.forwardRef(({
  onEnter,
  onEntering,
  onEntered,
  onExit,
  onExiting,
  className,
  children,
  dimension = 'height',
  getDimensionValue = getDefaultDimensionValue,
  ...props
}, ref) => {
  /* Compute dimension */
  const computedDimension = typeof dimension === 'function' ? dimension() : dimension;

  /* -- Expanding -- */
  const handleEnter = reactExports.useMemo(() => createChainedFunction(elem => {
    elem.style[computedDimension] = '0';
  }, onEnter), [computedDimension, onEnter]);
  const handleEntering = reactExports.useMemo(() => createChainedFunction(elem => {
    const scroll = `scroll${computedDimension[0].toUpperCase()}${computedDimension.slice(1)}`;
    elem.style[computedDimension] = `${elem[scroll]}px`;
  }, onEntering), [computedDimension, onEntering]);
  const handleEntered = reactExports.useMemo(() => createChainedFunction(elem => {
    elem.style[computedDimension] = null;
  }, onEntered), [computedDimension, onEntered]);

  /* -- Collapsing -- */
  const handleExit = reactExports.useMemo(() => createChainedFunction(elem => {
    elem.style[computedDimension] = `${getDimensionValue(computedDimension, elem)}px`;
    triggerBrowserReflow(elem);
  }, onExit), [onExit, getDimensionValue, computedDimension]);
  const handleExiting = reactExports.useMemo(() => createChainedFunction(elem => {
    elem.style[computedDimension] = null;
  }, onExiting), [computedDimension, onExiting]);
  return /*#__PURE__*/jsxRuntimeExports.jsx(TransitionWrapper, {
    ref: ref,
    addEndListener: transitionEndListener,
    ...props,
    "aria-expanded": props.role ? props.in : null,
    onEnter: handleEnter,
    onEntering: handleEntering,
    onEntered: handleEntered,
    onExit: handleExit,
    onExiting: handleExiting,
    childRef: children.ref,
    children: (state, innerProps) => /*#__PURE__*/React.cloneElement(children, {
      ...innerProps,
      className: classnamesExports(className, children.props.className, collapseStyles[state], computedDimension === 'width' && 'collapse-horizontal')
    })
  });
});

// @ts-ignore

// @ts-ignore
Collapse.defaultProps = defaultProps$7;
var Collapse$1 = Collapse;

const context = /*#__PURE__*/reactExports.createContext(null);
context.displayName = 'CardHeaderContext';
var CardHeaderContext = context;

const TabContext = /*#__PURE__*/reactExports.createContext(null);

const _excluded$1 = ["as", "active", "eventKey"];
function _objectWithoutPropertiesLoose$1(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
function useNavItem({
  key,
  onClick,
  active,
  id,
  role,
  disabled
}) {
  const parentOnSelect = reactExports.useContext(SelectableContext);
  const navContext = reactExports.useContext(NavContext);
  const tabContext = reactExports.useContext(TabContext);
  let isActive = active;
  const props = {
    role
  };
  if (navContext) {
    if (!role && navContext.role === 'tablist') props.role = 'tab';
    const contextControllerId = navContext.getControllerId(key != null ? key : null);
    const contextControlledId = navContext.getControlledId(key != null ? key : null);

    // @ts-ignore
    props[dataAttr('event-key')] = key;
    props.id = contextControllerId || id;
    isActive = active == null && key != null ? navContext.activeKey === key : active;

    /**
     * Simplified scenario for `mountOnEnter`.
     *
     * While it would make sense to keep 'aria-controls' for tabs that have been mounted at least
     * once, it would also complicate the code quite a bit, for very little gain.
     * The following implementation is probably good enough.
     *
     * @see https://github.com/react-restart/ui/pull/40#issuecomment-1009971561
     */
    if (isActive || !(tabContext != null && tabContext.unmountOnExit) && !(tabContext != null && tabContext.mountOnEnter)) props['aria-controls'] = contextControlledId;
  }
  if (props.role === 'tab') {
    props['aria-selected'] = isActive;
    if (!isActive) {
      props.tabIndex = -1;
    }
    if (disabled) {
      props.tabIndex = -1;
      props['aria-disabled'] = true;
    }
  }
  props.onClick = useEventCallback(e => {
    if (disabled) return;
    onClick == null ? void 0 : onClick(e);
    if (key == null) {
      return;
    }
    if (parentOnSelect && !e.isPropagationStopped()) {
      parentOnSelect(key, e);
    }
  });
  return [props, {
    isActive
  }];
}
const NavItem$1 = /*#__PURE__*/reactExports.forwardRef((_ref, ref) => {
  let {
      as: Component = Button,
      active,
      eventKey
    } = _ref,
    options = _objectWithoutPropertiesLoose$1(_ref, _excluded$1);
  const [props, meta] = useNavItem(Object.assign({
    key: makeEventKey(eventKey, options.href),
    active
  }, options));

  // @ts-ignore
  props[dataAttr('active')] = meta.isActive;
  return /*#__PURE__*/jsxRuntimeExports.jsx(Component, Object.assign({}, options, props, {
    ref: ref
  }));
});
NavItem$1.displayName = 'NavItem';

const _excluded = ["as", "onSelect", "activeKey", "role", "onKeyDown"];
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};
const EVENT_KEY_ATTR = dataAttr('event-key');
const Nav$2 = /*#__PURE__*/reactExports.forwardRef((_ref, ref) => {
  let {
      // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
      as: Component = 'div',
      onSelect,
      activeKey,
      role,
      onKeyDown
    } = _ref,
    props = _objectWithoutPropertiesLoose(_ref, _excluded);
  // A ref and forceUpdate for refocus, b/c we only want to trigger when needed
  // and don't want to reset the set in the effect
  const forceUpdate = useForceUpdate();
  const needsRefocusRef = reactExports.useRef(false);
  const parentOnSelect = reactExports.useContext(SelectableContext);
  const tabContext = reactExports.useContext(TabContext);
  let getControlledId, getControllerId;
  if (tabContext) {
    role = role || 'tablist';
    activeKey = tabContext.activeKey;
    // TODO: do we need to duplicate these?
    getControlledId = tabContext.getControlledId;
    getControllerId = tabContext.getControllerId;
  }
  const listNode = reactExports.useRef(null);
  const getNextActiveTab = offset => {
    const currentListNode = listNode.current;
    if (!currentListNode) return null;
    const items = qsa(currentListNode, `[${EVENT_KEY_ATTR}]:not([aria-disabled=true])`);
    const activeChild = currentListNode.querySelector('[aria-selected=true]');
    if (!activeChild || activeChild !== document.activeElement) return null;
    const index = items.indexOf(activeChild);
    if (index === -1) return null;
    let nextIndex = index + offset;
    if (nextIndex >= items.length) nextIndex = 0;
    if (nextIndex < 0) nextIndex = items.length - 1;
    return items[nextIndex];
  };
  const handleSelect = (key, event) => {
    if (key == null) return;
    onSelect == null ? void 0 : onSelect(key, event);
    parentOnSelect == null ? void 0 : parentOnSelect(key, event);
  };
  const handleKeyDown = event => {
    onKeyDown == null ? void 0 : onKeyDown(event);
    if (!tabContext) {
      return;
    }
    let nextActiveChild;
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        nextActiveChild = getNextActiveTab(-1);
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        nextActiveChild = getNextActiveTab(1);
        break;
      default:
        return;
    }
    if (!nextActiveChild) return;
    event.preventDefault();
    handleSelect(nextActiveChild.dataset[dataProp('EventKey')] || null, event);
    needsRefocusRef.current = true;
    forceUpdate();
  };
  reactExports.useEffect(() => {
    if (listNode.current && needsRefocusRef.current) {
      const activeChild = listNode.current.querySelector(`[${EVENT_KEY_ATTR}][aria-selected=true]`);
      activeChild == null ? void 0 : activeChild.focus();
    }
    needsRefocusRef.current = false;
  });
  const mergedRef = useMergedRefs(ref, listNode);
  return /*#__PURE__*/jsxRuntimeExports.jsx(SelectableContext.Provider, {
    value: handleSelect,
    children: /*#__PURE__*/jsxRuntimeExports.jsx(NavContext.Provider, {
      value: {
        role,
        // used by NavLink to determine it's role
        activeKey: makeEventKey(activeKey),
        getControlledId: getControlledId || noop,
        getControllerId: getControllerId || noop
      },
      children: /*#__PURE__*/jsxRuntimeExports.jsx(Component, Object.assign({}, props, {
        onKeyDown: handleKeyDown,
        ref: mergedRef,
        role: role
      }))
    })
  });
});
Nav$2.displayName = 'Nav';
var BaseNav = Object.assign(Nav$2, {
  Item: NavItem$1
});

var allExports = {};
var all = {
  get exports(){ return allExports; },
  set exports(v){ allExports = v; },
};

var createChainableTypeCheckerExports = {};
var createChainableTypeChecker = {
  get exports(){ return createChainableTypeCheckerExports; },
  set exports(v){ createChainableTypeCheckerExports = v; },
};

(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = createChainableTypeChecker;
	/**
	 * Copyright 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */

	// Mostly taken from ReactPropTypes.

	function createChainableTypeChecker(validate) {
	  function checkType(isRequired, props, propName, componentName, location, propFullName) {
	    var componentNameSafe = componentName || '<<anonymous>>';
	    var propFullNameSafe = propFullName || propName;
	    if (props[propName] == null) {
	      if (isRequired) {
	        return new Error('Required ' + location + ' `' + propFullNameSafe + '` was not specified ' + ('in `' + componentNameSafe + '`.'));
	      }
	      return null;
	    }
	    for (var _len = arguments.length, args = Array(_len > 6 ? _len - 6 : 0), _key = 6; _key < _len; _key++) {
	      args[_key - 6] = arguments[_key];
	    }
	    return validate.apply(undefined, [props, propName, componentNameSafe, location, propFullNameSafe].concat(args));
	  }
	  var chainedCheckType = checkType.bind(null, false);
	  chainedCheckType.isRequired = checkType.bind(null, true);
	  return chainedCheckType;
	}
	module.exports = exports['default'];
} (createChainableTypeChecker, createChainableTypeCheckerExports));

(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = all;
	var _createChainableTypeChecker = createChainableTypeCheckerExports;
	var _createChainableTypeChecker2 = _interopRequireDefault(_createChainableTypeChecker);
	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : {
	    default: obj
	  };
	}
	function all() {
	  for (var _len = arguments.length, validators = Array(_len), _key = 0; _key < _len; _key++) {
	    validators[_key] = arguments[_key];
	  }
	  function allPropTypes() {
	    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	      args[_key2] = arguments[_key2];
	    }
	    var error = null;
	    validators.forEach(function (validator) {
	      if (error != null) {
	        return;
	      }
	      var result = validator.apply(undefined, args);
	      if (result != null) {
	        error = result;
	      }
	    });
	    return error;
	  }
	  return (0, _createChainableTypeChecker2.default)(allPropTypes);
	}
	module.exports = exports['default'];
} (all, allExports));

var NavItem = createWithBsPrefix('nav-item');

const defaultProps$6 = {
  disabled: false
};
const NavLink = /*#__PURE__*/reactExports.forwardRef(({
  bsPrefix,
  className,
  as: Component = Anchor,
  active,
  eventKey,
  ...props
}, ref) => {
  bsPrefix = useBootstrapPrefix(bsPrefix, 'nav-link');
  const [navItemProps, meta] = useNavItem({
    key: makeEventKey(eventKey, props.href),
    active,
    ...props
  });
  return /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
    ...props,
    ...navItemProps,
    ref: ref,
    className: classnamesExports(className, bsPrefix, props.disabled && 'disabled', meta.isActive && 'active')
  });
});
NavLink.displayName = 'NavLink';
NavLink.defaultProps = defaultProps$6;
var NavLink$1 = NavLink;

const defaultProps$5 = {
  justify: false,
  fill: false
};
const Nav = /*#__PURE__*/reactExports.forwardRef((uncontrolledProps, ref) => {
  const {
    as = 'div',
    bsPrefix: initialBsPrefix,
    variant,
    fill,
    justify,
    navbar,
    navbarScroll,
    className,
    activeKey,
    ...props
  } = useUncontrolled(uncontrolledProps, {
    activeKey: 'onSelect'
  });
  const bsPrefix = useBootstrapPrefix(initialBsPrefix, 'nav');
  let navbarBsPrefix;
  let cardHeaderBsPrefix;
  let isNavbar = false;
  const navbarContext = reactExports.useContext(NavbarContext);
  const cardHeaderContext = reactExports.useContext(CardHeaderContext);
  if (navbarContext) {
    navbarBsPrefix = navbarContext.bsPrefix;
    isNavbar = navbar == null ? true : navbar;
  } else if (cardHeaderContext) {
    ({
      cardHeaderBsPrefix
    } = cardHeaderContext);
  }
  return /*#__PURE__*/jsxRuntimeExports.jsx(BaseNav, {
    as: as,
    ref: ref,
    activeKey: activeKey,
    className: classnamesExports(className, {
      [bsPrefix]: !isNavbar,
      [`${navbarBsPrefix}-nav`]: isNavbar,
      [`${navbarBsPrefix}-nav-scroll`]: isNavbar && navbarScroll,
      [`${cardHeaderBsPrefix}-${variant}`]: !!cardHeaderBsPrefix,
      [`${bsPrefix}-${variant}`]: !!variant,
      [`${bsPrefix}-fill`]: fill,
      [`${bsPrefix}-justified`]: justify
    }),
    ...props
  });
});
Nav.displayName = 'Nav';
Nav.defaultProps = defaultProps$5;
var Nav$1 = Object.assign(Nav, {
  Item: NavItem,
  Link: NavLink$1
});

const NavbarBrand = /*#__PURE__*/reactExports.forwardRef(({
  bsPrefix,
  className,
  as,
  ...props
}, ref) => {
  bsPrefix = useBootstrapPrefix(bsPrefix, 'navbar-brand');
  const Component = as || (props.href ? 'a' : 'span');
  return /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
    ...props,
    ref: ref,
    className: classnamesExports(className, bsPrefix)
  });
});
NavbarBrand.displayName = 'NavbarBrand';
var NavbarBrand$1 = NavbarBrand;

const NavbarCollapse = /*#__PURE__*/reactExports.forwardRef(({
  children,
  bsPrefix,
  ...props
}, ref) => {
  bsPrefix = useBootstrapPrefix(bsPrefix, 'navbar-collapse');
  const context = reactExports.useContext(NavbarContext);
  return /*#__PURE__*/jsxRuntimeExports.jsx(Collapse$1, {
    in: !!(context && context.expanded),
    ...props,
    children: /*#__PURE__*/jsxRuntimeExports.jsx("div", {
      ref: ref,
      className: bsPrefix,
      children: children
    })
  });
});
NavbarCollapse.displayName = 'NavbarCollapse';
var NavbarCollapse$1 = NavbarCollapse;

const defaultProps$4 = {
  label: 'Toggle navigation'
};
const NavbarToggle = /*#__PURE__*/reactExports.forwardRef(({
  bsPrefix,
  className,
  children,
  label,
  // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
  as: Component = 'button',
  onClick,
  ...props
}, ref) => {
  bsPrefix = useBootstrapPrefix(bsPrefix, 'navbar-toggler');
  const {
    onToggle,
    expanded
  } = reactExports.useContext(NavbarContext) || {};
  const handleClick = useEventCallback(e => {
    if (onClick) onClick(e);
    if (onToggle) onToggle();
  });
  if (Component === 'button') {
    props.type = 'button';
  }
  return /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
    ...props,
    ref: ref,
    onClick: handleClick,
    "aria-label": label,
    className: classnamesExports(className, bsPrefix, !expanded && 'collapsed'),
    children: children || /*#__PURE__*/jsxRuntimeExports.jsx("span", {
      className: `${bsPrefix}-icon`
    })
  });
});
NavbarToggle.displayName = 'NavbarToggle';
NavbarToggle.defaultProps = defaultProps$4;
var NavbarToggle$1 = NavbarToggle;

var matchersByWindow = new WeakMap();
var getMatcher = function getMatcher(query, targetWindow) {
  if (!query || !targetWindow) return undefined;
  var matchers = matchersByWindow.get(targetWindow) || new Map();
  matchersByWindow.set(targetWindow, matchers);
  var mql = matchers.get(query);
  if (!mql) {
    mql = targetWindow.matchMedia(query);
    mql.refCount = 0;
    matchers.set(mql.media, mql);
  }
  return mql;
};
/**
 * Match a media query and get updates as the match changes. The media string is
 * passed directly to `window.matchMedia` and run as a Layout Effect, so initial
 * matches are returned before the browser has a chance to paint.
 *
 * ```tsx
 * function Page() {
 *   const isWide = useMediaQuery('min-width: 1000px')
 *
 *   return isWide ? "very wide" : 'not so wide'
 * }
 * ```
 *
 * Media query lists are also reused globally, hook calls for the same query
 * will only create a matcher once under the hood.
 *
 * @param query A media query
 * @param targetWindow The window to match against, uses the globally available one as a default.
 */

function useMediaQuery(query, targetWindow) {
  if (targetWindow === void 0) {
    targetWindow = typeof window === 'undefined' ? undefined : window;
  }
  var mql = getMatcher(query, targetWindow);
  var _useState = reactExports.useState(function () {
      return mql ? mql.matches : false;
    }),
    matches = _useState[0],
    setMatches = _useState[1];
  useIsomorphicEffect(function () {
    var mql = getMatcher(query, targetWindow);
    if (!mql) {
      return setMatches(false);
    }
    var matchers = matchersByWindow.get(targetWindow);
    var handleChange = function handleChange() {
      setMatches(mql.matches);
    };
    mql.refCount++;
    mql.addListener(handleChange);
    handleChange();
    return function () {
      mql.removeListener(handleChange);
      mql.refCount--;
      if (mql.refCount <= 0) {
        matchers == null ? void 0 : matchers.delete(mql.media);
      }
      mql = undefined;
    };
  }, [query]);
  return matches;
}

/**
 * Create a responsive hook we a set of breakpoint names and widths.
 * You can use any valid css units as well as a numbers (for pixels).
 *
 * **NOTE:** The object key order is important! it's assumed to be in order from smallest to largest
 *
 * ```ts
 * const useBreakpoint = createBreakpointHook({
 *  xs: 0,
 *  sm: 576,
 *  md: 768,
 *  lg: 992,
 *  xl: 1200,
 * })
 * ```
 *
 * **Watch out!** using string values will sometimes construct media queries using css `calc()` which
 * is NOT supported in media queries by all browsers at the moment. use numbers for
 * the widest range of browser support.
 *
 * @param breakpointValues A object hash of names to breakpoint dimensions
 */
function createBreakpointHook(breakpointValues) {
  var names = Object.keys(breakpointValues);
  function and(query, next) {
    if (query === next) {
      return next;
    }
    return query ? query + " and " + next : next;
  }
  function getNext(breakpoint) {
    return names[Math.min(names.indexOf(breakpoint) + 1, names.length - 1)];
  }
  function getMaxQuery(breakpoint) {
    var next = getNext(breakpoint);
    var value = breakpointValues[next];
    if (typeof value === 'number') value = value - 0.2 + "px";else value = "calc(" + value + " - 0.2px)";
    return "(max-width: " + value + ")";
  }
  function getMinQuery(breakpoint) {
    var value = breakpointValues[breakpoint];
    if (typeof value === 'number') {
      value = value + "px";
    }
    return "(min-width: " + value + ")";
  }
  /**
   * Match a set of breakpoints
   *
   * ```tsx
   * const MidSizeOnly = () => {
   *   const isMid = useBreakpoint({ lg: 'down', sm: 'up' });
   *
   *   if (isMid) return <div>On a Reasonable sized Screen!</div>
   *   return null;
   * }
   * ```
   * @param breakpointMap An object map of breakpoints and directions, queries are constructed using "and" to join
   * breakpoints together
   * @param window Optionally specify the target window to match against (useful when rendering into iframes)
   */

  function useBreakpoint(breakpointOrMap, direction, window) {
    var breakpointMap;
    if (typeof breakpointOrMap === 'object') {
      breakpointMap = breakpointOrMap;
      window = direction;
      direction = true;
    } else {
      var _breakpointMap;
      direction = direction || true;
      breakpointMap = (_breakpointMap = {}, _breakpointMap[breakpointOrMap] = direction, _breakpointMap);
    }
    var query = reactExports.useMemo(function () {
      return Object.entries(breakpointMap).reduce(function (query, _ref) {
        var key = _ref[0],
          direction = _ref[1];
        if (direction === 'up' || direction === true) {
          query = and(query, getMinQuery(key));
        }
        if (direction === 'down' || direction === true) {
          query = and(query, getMaxQuery(key));
        }
        return query;
      }, '');
    }, [JSON.stringify(breakpointMap)]);
    return useMediaQuery(query, window);
  }
  return useBreakpoint;
}
var useBreakpoint = createBreakpointHook({
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400
});

var OffcanvasBody = createWithBsPrefix('offcanvas-body');

const defaultProps$3 = {
  in: false,
  mountOnEnter: false,
  unmountOnExit: false,
  appear: false
};
const transitionStyles = {
  [ENTERING]: 'show',
  [ENTERED]: 'show'
};
const OffcanvasToggling = /*#__PURE__*/reactExports.forwardRef(({
  bsPrefix,
  className,
  children,
  ...props
}, ref) => {
  bsPrefix = useBootstrapPrefix(bsPrefix, 'offcanvas');
  return /*#__PURE__*/jsxRuntimeExports.jsx(TransitionWrapper, {
    ref: ref,
    addEndListener: transitionEndListener,
    ...props,
    childRef: children.ref,
    children: (status, innerProps) => /*#__PURE__*/reactExports.cloneElement(children, {
      ...innerProps,
      className: classnamesExports(className, children.props.className, (status === ENTERING || status === EXITING) && `${bsPrefix}-toggling`, transitionStyles[status])
    })
  });
});
OffcanvasToggling.defaultProps = defaultProps$3;
OffcanvasToggling.displayName = 'OffcanvasToggling';
var OffcanvasToggling$1 = OffcanvasToggling;

const defaultProps$2 = {
  closeLabel: 'Close',
  closeButton: false
};
const OffcanvasHeader = /*#__PURE__*/reactExports.forwardRef(({
  bsPrefix,
  className,
  ...props
}, ref) => {
  bsPrefix = useBootstrapPrefix(bsPrefix, 'offcanvas-header');
  return /*#__PURE__*/jsxRuntimeExports.jsx(AbstractModalHeader, {
    ref: ref,
    ...props,
    className: classnamesExports(className, bsPrefix)
  });
});
OffcanvasHeader.displayName = 'OffcanvasHeader';
OffcanvasHeader.defaultProps = defaultProps$2;
var OffcanvasHeader$1 = OffcanvasHeader;

const DivStyledAsH5 = divWithClassName('h5');
var OffcanvasTitle = createWithBsPrefix('offcanvas-title', {
  Component: DivStyledAsH5
});

const defaultProps$1 = {
  show: false,
  backdrop: true,
  keyboard: true,
  scroll: false,
  autoFocus: true,
  enforceFocus: true,
  restoreFocus: true,
  placement: 'start',
  renderStaticNode: false
};
function DialogTransition(props) {
  return /*#__PURE__*/jsxRuntimeExports.jsx(OffcanvasToggling$1, {
    ...props
  });
}
function BackdropTransition(props) {
  return /*#__PURE__*/jsxRuntimeExports.jsx(Fade, {
    ...props
  });
}
const Offcanvas = /*#__PURE__*/reactExports.forwardRef(({
  bsPrefix,
  className,
  children,
  'aria-labelledby': ariaLabelledby,
  placement,
  responsive,
  /* BaseModal props */

  show,
  backdrop,
  keyboard,
  scroll,
  onEscapeKeyDown,
  onShow,
  onHide,
  container,
  autoFocus,
  enforceFocus,
  restoreFocus,
  restoreFocusOptions,
  onEntered,
  onExit,
  onExiting,
  onEnter,
  onEntering,
  onExited,
  backdropClassName,
  manager: propsManager,
  renderStaticNode,
  ...props
}, ref) => {
  const modalManager = reactExports.useRef();
  bsPrefix = useBootstrapPrefix(bsPrefix, 'offcanvas');
  const {
    onToggle
  } = reactExports.useContext(NavbarContext) || {};
  const [showOffcanvas, setShowOffcanvas] = reactExports.useState(false);
  const hideResponsiveOffcanvas = useBreakpoint(responsive || 'xs', 'up');
  reactExports.useEffect(() => {
    // Handles the case where screen is resized while the responsive
    // offcanvas is shown. If `responsive` not provided, just use `show`.
    setShowOffcanvas(responsive ? show && !hideResponsiveOffcanvas : show);
  }, [show, responsive, hideResponsiveOffcanvas]);
  const handleHide = useEventCallback(() => {
    onToggle == null ? void 0 : onToggle();
    onHide == null ? void 0 : onHide();
  });
  const modalContext = reactExports.useMemo(() => ({
    onHide: handleHide
  }), [handleHide]);
  function getModalManager() {
    if (propsManager) return propsManager;
    if (scroll) {
      // Have to use a different modal manager since the shared
      // one handles overflow.
      if (!modalManager.current) modalManager.current = new BootstrapModalManager({
        handleContainerOverflow: false
      });
      return modalManager.current;
    }
    return getSharedManager();
  }
  const handleEnter = (node, ...args) => {
    if (node) node.style.visibility = 'visible';
    onEnter == null ? void 0 : onEnter(node, ...args);
  };
  const handleExited = (node, ...args) => {
    if (node) node.style.visibility = '';
    onExited == null ? void 0 : onExited(...args);
  };
  const renderBackdrop = reactExports.useCallback(backdropProps => /*#__PURE__*/jsxRuntimeExports.jsx("div", {
    ...backdropProps,
    className: classnamesExports(`${bsPrefix}-backdrop`, backdropClassName)
  }), [backdropClassName, bsPrefix]);
  const renderDialog = dialogProps => /*#__PURE__*/jsxRuntimeExports.jsx("div", {
    ...dialogProps,
    ...props,
    className: classnamesExports(className, responsive ? `${bsPrefix}-${responsive}` : bsPrefix, `${bsPrefix}-${placement}`),
    "aria-labelledby": ariaLabelledby,
    children: children
  });
  return /*#__PURE__*/jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
    children: [!showOffcanvas && (responsive || renderStaticNode) && renderDialog({}), /*#__PURE__*/jsxRuntimeExports.jsx(ModalContext.Provider, {
      value: modalContext,
      children: /*#__PURE__*/jsxRuntimeExports.jsx(BaseModal, {
        show: showOffcanvas,
        ref: ref,
        backdrop: backdrop,
        container: container,
        keyboard: keyboard,
        autoFocus: autoFocus,
        enforceFocus: enforceFocus && !scroll,
        restoreFocus: restoreFocus,
        restoreFocusOptions: restoreFocusOptions,
        onEscapeKeyDown: onEscapeKeyDown,
        onShow: onShow,
        onHide: handleHide,
        onEnter: handleEnter,
        onEntering: onEntering,
        onEntered: onEntered,
        onExit: onExit,
        onExiting: onExiting,
        onExited: handleExited,
        manager: getModalManager(),
        transition: DialogTransition,
        backdropTransition: BackdropTransition,
        renderBackdrop: renderBackdrop,
        renderDialog: renderDialog
      })
    })]
  });
});
Offcanvas.displayName = 'Offcanvas';
Offcanvas.defaultProps = defaultProps$1;
var Offcanvas$1 = Object.assign(Offcanvas, {
  Body: OffcanvasBody,
  Header: OffcanvasHeader$1,
  Title: OffcanvasTitle
});

const NavbarOffcanvas = /*#__PURE__*/reactExports.forwardRef((props, ref) => {
  const context = reactExports.useContext(NavbarContext);
  return /*#__PURE__*/jsxRuntimeExports.jsx(Offcanvas$1, {
    ref: ref,
    show: !!(context != null && context.expanded),
    ...props,
    renderStaticNode: true
  });
});
NavbarOffcanvas.displayName = 'NavbarOffcanvas';
var NavbarOffcanvas$1 = NavbarOffcanvas;

const NavbarText = createWithBsPrefix('navbar-text', {
  Component: 'span'
});
const defaultProps = {
  expand: true,
  variant: 'light',
  collapseOnSelect: false
};
const Navbar = /*#__PURE__*/reactExports.forwardRef((props, ref) => {
  const {
    bsPrefix: initialBsPrefix,
    expand,
    variant,
    bg,
    fixed,
    sticky,
    className,
    // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
    as: Component = 'nav',
    expanded,
    onToggle,
    onSelect,
    collapseOnSelect,
    ...controlledProps
  } = useUncontrolled(props, {
    expanded: 'onToggle'
  });
  const bsPrefix = useBootstrapPrefix(initialBsPrefix, 'navbar');
  const handleCollapse = reactExports.useCallback((...args) => {
    onSelect == null ? void 0 : onSelect(...args);
    if (collapseOnSelect && expanded) {
      onToggle == null ? void 0 : onToggle(false);
    }
  }, [onSelect, collapseOnSelect, expanded, onToggle]);

  // will result in some false positives but that seems better
  // than false negatives. strict `undefined` check allows explicit
  // "nulling" of the role if the user really doesn't want one
  if (controlledProps.role === undefined && Component !== 'nav') {
    controlledProps.role = 'navigation';
  }
  let expandClass = `${bsPrefix}-expand`;
  if (typeof expand === 'string') expandClass = `${expandClass}-${expand}`;
  const navbarContext = reactExports.useMemo(() => ({
    onToggle: () => onToggle == null ? void 0 : onToggle(!expanded),
    bsPrefix,
    expanded: !!expanded,
    expand
  }), [bsPrefix, expanded, expand, onToggle]);
  return /*#__PURE__*/jsxRuntimeExports.jsx(NavbarContext.Provider, {
    value: navbarContext,
    children: /*#__PURE__*/jsxRuntimeExports.jsx(SelectableContext.Provider, {
      value: handleCollapse,
      children: /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
        ref: ref,
        ...controlledProps,
        className: classnamesExports(className, bsPrefix, expand && expandClass, variant && `${bsPrefix}-${variant}`, bg && `bg-${bg}`, sticky && `sticky-${sticky}`, fixed && `fixed-${fixed}`)
      })
    })
  });
});
Navbar.defaultProps = defaultProps;
Navbar.displayName = 'Navbar';
var Navbar$1 = Object.assign(Navbar, {
  Brand: NavbarBrand$1,
  Collapse: NavbarCollapse$1,
  Offcanvas: NavbarOffcanvas$1,
  Text: NavbarText,
  Toggle: NavbarToggle$1
});

/**
 * Used in conjunction with the `m` component to reduce bundle size.
 *
 * `m` is a version of the `motion` component that only loads functionality
 * critical for the initial render.
 *
 * `LazyMotion` can then be used to either synchronously or asynchronously
 * load animation and gesture support.
 *
 * ```jsx
 * // Synchronous loading
 * import { LazyMotion, m, domAnimations } from "framer-motion"
 *
 * function App() {
 *   return (
 *     <LazyMotion features={domAnimations}>
 *       <m.div animate={{ scale: 2 }} />
 *     </LazyMotion>
 *   )
 * }
 *
 * // Asynchronous loading
 * import { LazyMotion, m } from "framer-motion"
 *
 * function App() {
 *   return (
 *     <LazyMotion features={() => import('./path/to/domAnimations')}>
 *       <m.div animate={{ scale: 2 }} />
 *     </LazyMotion>
 *   )
 * }
 * ```
 *
 * @public
 */
function LazyMotion({
  children,
  features,
  strict = false
}) {
  const [, setIsLoaded] = reactExports.useState(!isLazyBundle(features));
  const loadedRenderer = reactExports.useRef(undefined);
  /**
   * If this is a synchronous load, load features immediately
   */
  if (!isLazyBundle(features)) {
    const {
      renderer,
      ...loadedFeatures
    } = features;
    loadedRenderer.current = renderer;
    loadFeatures(loadedFeatures);
  }
  reactExports.useEffect(() => {
    if (isLazyBundle(features)) {
      features().then(({
        renderer,
        ...loadedFeatures
      }) => {
        loadFeatures(loadedFeatures);
        loadedRenderer.current = renderer;
        setIsLoaded(true);
      });
    }
  }, []);
  return /*#__PURE__*/reactExports.createElement(LazyContext.Provider, {
    value: {
      renderer: loadedRenderer.current,
      strict
    }
  }, children);
}
function isLazyBundle(features) {
  return typeof features === "function";
}

const getText$1 = text => {
  if (Object.hasOwn(text, "side")) {
    // @ts-expect-error
    return text.side;
  }

  // @ts-expect-error
  return text;
};
const MenuGroup = ({
  children,
  title
}) => {
  const [open, setOpen] = reactExports.useState(true);
  return /*#__PURE__*/jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
    children: [title ? /*#__PURE__*/jsxRuntimeExports.jsxs("a", {
      className: "sidebar-heading",
      onClick: event => {
        event.preventDefault();
        setOpen(prev => !prev);
      },
      children: [/*#__PURE__*/jsxRuntimeExports.jsx(CollapseArrow, {
        open: open
      }), " ", title]
    }) : null, /*#__PURE__*/jsxRuntimeExports.jsx(AnimatePresence, {
      initial: false,
      children: open ? /*#__PURE__*/jsxRuntimeExports.jsx(m.ul, {
        className: "nav flex-column flex-nowrap overflow-hidden",
        initial: "collapsed",
        animate: "open",
        exit: "collapsed",
        variants: {
          open: {
            opacity: 1,
            height: "auto"
          },
          collapsed: {
            opacity: 0,
            height: 0
          }
        },
        transition: {
          duration: 0.3,
          type: "tween"
        },
        children: children
      }) : null
    })]
  });
};
const makeAnchorProps$1 = (menuItem, onMenuItemClick, closeBeforeOnClickResolves) => {
  let href;
  let rel;
  let target;
  if (typeof menuItem.path === "string") {
    href = menuItem.path;
    if (menuItem.path.startsWith("http")) {
      rel = "noopener noreferrer";
      target = "_blank";
    }
  } else if (Array.isArray(menuItem.path)) {
    href = helpers.leagueUrl(menuItem.path);
  }
  const onClick = async event => {
    if (menuItem.onClick) {
      if (closeBeforeOnClickResolves) {
        onMenuItemClick();
      }

      // Don't close menu if response is false
      const response = await menuItem.onClick(event);
      if (response !== false && !closeBeforeOnClickResolves) {
        onMenuItemClick();
      }
    } else {
      onMenuItemClick();
    }
  };
  return {
    onClick,
    href,
    rel,
    target
  };
};
const MenuItem$1 = ({
  godMode,
  lid,
  menuItem,
  onMenuItemClick,
  pageID,
  pathname,
  root
}) => {
  if (menuItem.type === "text") {
    return null;
  }
  if (!menuItem.league && lid !== undefined) {
    return null;
  }
  if (!menuItem.nonLeague && lid === undefined) {
    return null;
  }
  if (menuItem.type === "link") {
    if (menuItem.commandPaletteOnly) {
      return null;
    }
    if (menuItem.godMode && !godMode) {
      return null;
    }
    const anchorProps = makeAnchorProps$1(menuItem, onMenuItemClick);
    const item = /*#__PURE__*/jsxRuntimeExports.jsx("li", {
      className: "nav-item",
      children: /*#__PURE__*/jsxRuntimeExports.jsx("a", {
        className: classnamesExports("nav-link", {
          active: menuItem.active ? menuItem.active(pageID, pathname) : false,
          "god-mode": menuItem.godMode
        }),
        ...anchorProps,
        children: getText$1(menuItem.text)
      })
    });
    return root ? /*#__PURE__*/jsxRuntimeExports.jsx(MenuGroup, {
      children: item
    }) : item;
  }
  if (menuItem.type === "header") {
    if (menuItem.commandPaletteOnly) {
      return null;
    }
    const children = menuItem.children.map((child, i) => /*#__PURE__*/jsxRuntimeExports.jsx(MenuItem$1, {
      godMode: godMode,
      lid: lid,
      menuItem: child,
      onMenuItemClick: onMenuItemClick,
      pageID: pageID,
      pathname: pathname,
      root: false
    }, i)).filter(element => element !== null);
    if (children.length === 0) {
      return null;
    }
    return /*#__PURE__*/jsxRuntimeExports.jsx(MenuGroup, {
      title: menuItem.long,
      children: children
    });
  }
  throw new Error(`Unknown menuItem.type "${menuItem.type}"`);
};
// Sidebar open/close state is done with the DOM directly rather than by passing a prop down or using local.getState()
// because then performance of the menu is independent of any other React performance issues - basically it's a hack to
// make menu performance consistent even if there are other problems. Like on the Fantasy Draft page.
const SideBar = /*#__PURE__*/reactExports.memo(({
  pageID,
  pathname
}) => {
  const [node, setNode] = reactExports.useState(null);
  const [nodeFade, setNodeFade] = reactExports.useState(null);
  const {
    godMode,
    lid,
    sidebarOpen
  } = useLocalPartial(["godMode", "lid", "sidebarOpen"]);
  const getNode = reactExports.useCallback(node2 => {
    if (node2 !== null) {
      setNode(node2);
    }
  }, []);
  const getNodeFade = reactExports.useCallback(node2 => {
    if (node2 !== null) {
      setNodeFade(node2);
    }
  }, []);
  const close = reactExports.useCallback(() => {
    // These are flat conditions while open is nested, by design - clean up everything!
    if (node) {
      node.classList.remove("sidebar-open");
    }
    if (nodeFade) {
      nodeFade.classList.add("sidebar-fade-closing");
    }
    setTimeout(() => {
      if (nodeFade) {
        nodeFade.classList.remove("sidebar-fade-open");
      }
      if (nodeFade) {
        nodeFade.classList.remove("sidebar-fade-closing");
      }
      if (document.body) {
        document.body.classList.remove("modal-open");
      }
    }, 300); // Keep time in sync with .sidebar-fade
  }, [node, nodeFade]);
  const open = reactExports.useCallback(() => {
    if (node) {
      node.classList.add("sidebar-open");
      if (nodeFade) {
        nodeFade.classList.add("sidebar-fade-open");
        if (document.body) {
          if (document.body) {
            document.body.classList.add("modal-open");
          }
        }
      }
    }
  }, [node, nodeFade]);
  reactExports.useEffect(() => {
    if (node) {
      const opening = node.classList.contains("sidebar-open");
      if (!sidebarOpen && opening) {
        close();
      } else if (sidebarOpen && !opening) {
        open();
      }
    }
  }, [close, node, open, sidebarOpen]);
  reactExports.useEffect(() => {
    // Use one media query per cutoff. At the time of writing, there is only ever one, at 768px. This is more efficient than listening for the window resize event and updating every time it changes.
    const mediaQueryList = window.matchMedia("(min-width: 1200px)");
    const handle = event => {
      // Call open/close even if sidebarOpen says it's open, cause sidebarOpen is not actually the source of truth!
      if (event.matches) {
        // Now we're xl or larger - open unless closed is saved value
        const saved = safeLocalStorage$1.getItem("sidebarOpen");
        if (saved === "false") {
          localActions.setSidebarOpen(false);
        } else {
          localActions.setSidebarOpen(true);
        }
      } else {
        // Now we're smaller than xl - hide the sidebar
        localActions.setSidebarOpen(false);
      }
    };

    // Rather than addEventListener for Safari <14
    mediaQueryList.addListener(handle);
    return () => {
      mediaQueryList.removeListener(handle);
    };
  }, [close, open]);
  reactExports.useEffect(() => {
    const closeHandler = () => {
      localActions.setSidebarOpen(false);
    };
    if (nodeFade) {
      nodeFade.addEventListener("click", closeHandler);
    }
    return () => {
      if (nodeFade) {
        nodeFade.removeEventListener("click", closeHandler);
      }
    };
  }, [nodeFade]);
  return /*#__PURE__*/jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
    children: [/*#__PURE__*/jsxRuntimeExports.jsx("div", {
      ref: getNodeFade,
      className: "sidebar-fade"
    }), /*#__PURE__*/jsxRuntimeExports.jsx("nav", {
      className: "bg-light sidebar flex-shrink-0",
      id: "sidebar",
      ref: getNode,
      "aria-label": "side navigation",
      children: /*#__PURE__*/jsxRuntimeExports.jsx("div", {
        className: "bg-light sidebar-inner small-scrollbar",
        children: menuItems.map((menuItem, i) => /*#__PURE__*/jsxRuntimeExports.jsx(MenuItem$1, {
          godMode: godMode,
          lid: lid,
          menuItem: menuItem,
          onMenuItemClick: () => {
            // Only on mobile, close menu on click
            if (window.innerWidth < 1200) {
              localActions.setSidebarOpen(false);
            }
          },
          pageID: pageID,
          pathname: pathname,
          root: true
        }, i))
      })
    })]
  });
});

const TWO_MONTHS_IN_MILLISECONDS = 2 * 30 * 24 * 60 * 60 * 1000;
const ONE_WEEK_IN_MILLISECONDS = 7 * 24 * 60 * 60 * 1000;
const saveLastUsed = init => {
  let now = Date.now();

  // If init, set it up so notification will show in a week
  if (init) {
    now = now - TWO_MONTHS_IN_MILLISECONDS + ONE_WEEK_IN_MILLISECONDS;
  }
  safeLocalStorage$1.setItem("commandPaletteLastUsed", String(now));
};
const useCommandPalette = () => {
  const [show, setShow] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const handleKeydown = event => {
      if (event.altKey || event.shiftKey || event.isComposing) {
        return;
      }
      if (event.code === "KeyK" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        setShow(current => !current);
      }
    };
    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, []);
  const onHide = reactExports.useCallback(() => {
    setShow(false);
  }, []);
  return {
    show,
    onHide
  };
};
const MODES = [{
  key: "@",
  description: "players"
}, {
  key: "/",
  description: "teams"
}, {
  key: "!",
  description: "leagues"
}];
// Tiebreaker - original sort order, rather than alphabetical (default)
const baseSort = () => 0;
const getResultsGroupedDefault = ({
  godMode,
  inLeague,
  onHide,
  playMenuOptions,
  searchText
}) => {
  const filterMenuItem = menuItem => {
    if (menuItem.type === "text") {
      return false;
    }
    if (!menuItem.commandPalette) {
      return false;
    }
    if (!menuItem.league && inLeague) {
      return false;
    }
    if (!menuItem.nonLeague && !inLeague) {
      return false;
    }
    if (menuItem.godMode && !godMode) {
      return false;
    }
    return true;
  };
  const flat = menuItems.filter(menuItem => menuItem.type === "link");
  const nested = menuItems.filter(menuItem => menuItem.type === "header");
  const results = [...flat.filter(filterMenuItem).map(menuItem => {
    return {
      category: "",
      menuItem
    };
  }), ...nested.map(header => {
    return header.children.filter(filterMenuItem).map(menuItem => {
      return {
        category: header.long,
        menuItem
      };
    });
  })].flat().map(({
    category,
    menuItem
  }) => {
    const anchorProps = makeAnchorProps$1(menuItem, onHide, true);
    let text = getText$1(menuItem.text);
    if (menuItem.godMode) {
      text = /*#__PURE__*/jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
        children: [/*#__PURE__*/jsxRuntimeExports.jsx("span", {
          className: "legend-square god-mode me-1"
        }), text]
      });
    }
    const search = category ? `${category} ${text}` : text;
    return {
      category,
      text,
      search,
      anchorProps
    };
  });
  results.unshift(...playMenuOptions.map(option => ({
    category: "Play",
    text: option.label,
    search: `Play ${option.label}`,
    anchorProps: {
      href: option.url,
      onClick: () => {
        onHide();
        if (!option.url) {
          toWorker$1("playMenu", option.id, undefined);
        }
      }
    }
  })));
  const output = [];
  if (searchText === "") {
    // No search - return groups
    const resultsGrouped = groupBy(results, "category");
    for (const category of Object.keys(resultsGrouped)) {
      if (resultsGrouped[category]) {
        output.push({
          category,
          results: resultsGrouped[category]
        });
      }
    }
  } else {
    // Search - return sorted by relevance, no grouping
    const filteredResults = matchSorter(results, searchText, {
      keys: ["search"],
      baseSort
    });
    if (filteredResults.length > 0) {
      output.push({
        category: "",
        results: filteredResults
      });
    }
  }
  return output;
};
const getResultsGroupedTeams = ({
  hideDisabledTeams,
  onHide,
  searchText,
  teamInfoCache
}) => {
  const teamInfos = teamInfoCache.map((t, tid) => ({
    text: `${t.region} ${t.name} (${t.abbrev}${t.disabled ? ", disabled" : ""})`,
    disabled: t.disabled,
    anchorProps: {
      href: helpers.leagueUrl(["roster", `${t.abbrev}_${tid}`]),
      onClick: onHide
    }
  })).filter(t => !hideDisabledTeams || !t.disabled);
  const filteredResults = matchSorter(teamInfos, searchText, {
    keys: ["text"],
    baseSort
  });
  return [{
    category: "",
    results: filteredResults.map(t => ({
      category: "",
      text: t.text,
      anchorProps: t.anchorProps
    }))
  }];
};
const getResultsGroupedLeagues = async ({
  onHide,
  searchText
}) => {
  const leagues = await toWorker$1("main", "getLeagues", undefined);
  const newLeagueResults = [];
  if (SPORT_HAS_REAL_PLAYERS) {
    newLeagueResults.push({
      text: "New League - Real Players",
      href: "/new_league/real"
    }, {
      text: "New League - Random Players",
      href: "/new_league/random"
    });
    if (SPORT_HAS_LEGENDS) {
      newLeagueResults.push({
        text: "New League - Legends",
        href: "/new_league/legends"
      });
    }
    newLeagueResults.push({
      text: "New League - Custom",
      href: "/new_league"
    });
  } else {
    newLeagueResults.push({
      text: "New League",
      href: "/new_league"
    });
  }
  const results = [{
    category: "",
    text: "Switch League",
    anchorProps: {
      href: "/",
      onClick: onHide
    }
  }, ...newLeagueResults.map(row => ({
    category: "",
    text: row.text,
    anchorProps: {
      href: row.href,
      onClick: onHide
    }
  })), ...orderBy(leagues, "lastPlayed", "desc").map(l => {
    const lastPlayed = `last played ${l.lastPlayed ? sAgo(l.lastPlayed) : "???"}`;
    return {
      category: "Leagues",
      text: /*#__PURE__*/jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
        children: [l.name, " - ", lastPlayed, /*#__PURE__*/jsxRuntimeExports.jsx("br", {}), l.phaseText, " - ", l.teamRegion, " ", l.teamName]
      }),
      search: `${l.name} - ${lastPlayed} ${l.phaseText} - ${l.teamRegion} ${l.teamName}`,
      anchorProps: {
        href: `/l/${l.lid}`,
        onClick: onHide
      }
    };
  })];
  const output = [];
  if (searchText === "") {
    // No search - return groups
    const resultsGrouped = groupBy(results, "category");
    for (const category of Object.keys(resultsGrouped)) {
      if (resultsGrouped[category]) {
        output.push({
          category,
          results: resultsGrouped[category]
        });
      }
    }
  } else {
    // Search - return sorted by relevance, no grouping
    const filteredResults = matchSorter(results, searchText, {
      keys: [row => row.search ?? row.text],
      baseSort
    });
    if (filteredResults.length > 0) {
      output.push({
        category: "",
        results: filteredResults.map(row => ({
          category: row.category,
          text: row.text,
          anchorProps: row.anchorProps,
          hideCollapsedCategory: true
        }))
      });
    }
  }
  return output;
};
const getResultsGroupedPlayers = async ({
  challengeNoRatings,
  onHide,
  searchText
}) => {
  const players = await toWorker$1("main", "getPlayersCommandPalette", undefined);
  const playerInfos = orderBy(players, ["lastName", "firstName", "abbrev"]).map(p => {
    return {
      text: `${p.firstName} ${p.lastName} - ${p.abbrev}, ${p.ratings.pos}, ${p.age}yo${!challengeNoRatings ? ` - ${p.ratings.ovr} ovr, ${p.ratings.pot} pot` : ""}`,
      anchorProps: {
        href: helpers.leagueUrl(["player", p.pid]),
        onClick: onHide
      }
    };
  });
  const filteredResults = matchSorter(playerInfos, searchText, {
    keys: ["text"],
    baseSort
  });
  return [{
    category: "",
    results: filteredResults.map(row => ({
      category: "",
      text: row.text,
      anchorProps: row.anchorProps
    }))
  }];
};
const getResultsGrouped = async ({
  challengeNoRatings,
  godMode,
  hideDisabledTeams,
  inLeague,
  mode,
  onHide,
  playMenuOptions,
  searchText,
  teamInfoCache
}) => {
  let resultsGrouped;
  if (mode?.key === "/") {
    resultsGrouped = getResultsGroupedTeams({
      hideDisabledTeams,
      onHide,
      searchText,
      teamInfoCache
    });
  } else if (mode?.key === "!") {
    resultsGrouped = await getResultsGroupedLeagues({
      onHide,
      searchText
    });
  } else if (mode?.key === "@") {
    resultsGrouped = await getResultsGroupedPlayers({
      challengeNoRatings,
      onHide,
      searchText
    });
  } else {
    resultsGrouped = getResultsGroupedDefault({
      godMode,
      inLeague,
      onHide,
      playMenuOptions,
      searchText
    });
  }
  let count = 0;
  for (const group of resultsGrouped) {
    count += group.results.length;
  }
  return {
    resultsGrouped,
    count
  };
};
const ACTIVE_CLASS = "table-bg-striped";
const SearchResults = ({
  activeIndex,
  collapseGroups,
  resultsGrouped
}) => {
  const wrapperRef = reactExports.useRef(null);

  // Keep active element in viewport
  reactExports.useEffect(() => {
    if (activeIndex !== undefined && wrapperRef.current) {
      const activeElement = wrapperRef.current.querySelector(`.${ACTIVE_CLASS}`);
      if (activeElement) {
        activeElement.scrollIntoView({
          block: "nearest"
        });
      }
    }
  }, [activeIndex, resultsGrouped]);
  let index = 0;
  return /*#__PURE__*/jsxRuntimeExports.jsx("div", {
    ref: wrapperRef,
    children: resultsGrouped.map(({
      category,
      results
    }, i) => {
      const block = /*#__PURE__*/jsxRuntimeExports.jsxs("div", {
        className: `card border-0${i > 0 ? " pt-2 mt-2 border-top" : ""}`,
        children: [!collapseGroups && category ? /*#__PURE__*/jsxRuntimeExports.jsx("div", {
          className: "card-header bg-transparent border-0",
          children: /*#__PURE__*/jsxRuntimeExports.jsx("span", {
            className: "fw-bold text-secondary text-uppercase",
            children: category
          })
        }) : null, /*#__PURE__*/jsxRuntimeExports.jsx("div", {
          className: "list-group list-group-flush rounded-0",
          children: results.map((result, j) => {
            const active = activeIndex === index;
            index += 1;
            return /*#__PURE__*/jsxRuntimeExports.jsxs("a", {
              ...result.anchorProps,
              className: `d-flex cursor-pointer list-group-item list-group-item-action border-0 ${active ? ACTIVE_CLASS : ""}`,
              children: [collapseGroups && result.category && !result.hideCollapsedCategory ? /*#__PURE__*/jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
                children: [result.category, " > "]
              }) : null, result.text, active ? /*#__PURE__*/jsxRuntimeExports.jsx("div", {
                className: "ms-auto",
                children: "Press enter to select"
              }) : null]
            }, j);
          })
        })]
      }, category);
      return block;
    })
  });
};
const ModeText = ({
  inLeague
}) => {
  // Hide players/teams in league
  const modes = MODES.filter(mode => inLeague || mode.key === "!");
  return /*#__PURE__*/jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
    children: ["Type", " ", modes.map((mode, i) => /*#__PURE__*/jsxRuntimeExports.jsxs(reactExports.Fragment, {
      children: [i === 0 ? null : i === modes.length - 1 ? ", or " : ", ", /*#__PURE__*/jsxRuntimeExports.jsx("span", {
        className: "text-black",
        children: mode.key
      }), " to search", " ", mode.description]
    }, mode.key)), "."]
  });
};
const ComandPalette = ({
  show,
  onHide
}) => {
  const searchInputRef = reactExports.useRef(null);
  const {
    challengeNoRatings,
    godMode,
    hideDisabledTeams,
    lid,
    playMenuOptions,
    teamInfoCache
  } = useLocalPartial(["challengeNoRatings", "godMode", "hideDisabledTeams", "lid", "playMenuOptions", "teamInfoCache"]);
  const inLeague = lid !== undefined;
  const [searchText, setSearchText] = reactExports.useState("");
  const [mode, setMode] = reactExports.useState();
  const [activeIndex, setActiveIndex] = reactExports.useState();
  const [{
    resultsGrouped,
    count
  }, setResults] = reactExports.useState({
    resultsGrouped: [],
    count: 0
  });
  reactExports.useEffect(() => {
    let active = true;
    const update = async () => {
      const newResults = await getResultsGrouped({
        challengeNoRatings,
        godMode,
        hideDisabledTeams,
        inLeague,
        mode,
        onHide,
        playMenuOptions,
        searchText,
        teamInfoCache
      });
      if (active) {
        setResults(newResults);
      }
    };
    update();
    return () => {
      active = false;
    };
  }, [challengeNoRatings, godMode, hideDisabledTeams, inLeague, mode, onHide, playMenuOptions, searchText, teamInfoCache]);
  reactExports.useEffect(() => {
    if (show) {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
      saveLastUsed();
    } else {
      setSearchText("");
      setMode(undefined);
      setActiveIndex(undefined);
    }
  }, [show]);
  reactExports.useEffect(() => {
    if (!show) {
      return;
    }
    const handleKeydown = event => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.isComposing) {
        return;
      }
      if (event.code === "ArrowDown") {
        setActiveIndex(index => {
          if (index === undefined) {
            return 0;
          }
          if (index + 1 >= count) {
            return 0;
          }
          return index + 1;
        });
      } else if (event.code === "ArrowUp") {
        setActiveIndex(index => {
          if (index === undefined) {
            return 0;
          }
          if (index - 1 < 0) {
            return count - 1;
          }
          return index - 1;
        });
      }
    };
    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [count, setActiveIndex, show]);
  if (!show) {
    return null;
  }
  return /*#__PURE__*/jsxRuntimeExports.jsxs(WrappedModal, {
    show: show,
    onHide: onHide,
    scrollable: true,
    children: [/*#__PURE__*/jsxRuntimeExports.jsxs(WrappedModal.Header, {
      className: "ps-3 pe-0 py-1",
      children: [/*#__PURE__*/jsxRuntimeExports.jsx("span", {
        className: "glyphicon glyphicon-search",
        style: {
          paddingBottom: 2
        }
      }), /*#__PURE__*/jsxRuntimeExports.jsx("form", {
        className: "flex-grow-1",
        onSubmit: event => {
          event.preventDefault();
          if (activeIndex !== undefined) {
            let index = 0;
            for (const group of resultsGrouped) {
              for (const result of group.results) {
                if (index === activeIndex) {
                  if (result.anchorProps.onClick) {
                    result.anchorProps.onClick();
                  }
                  if (result.anchorProps.href) {
                    if (result.anchorProps.target) {
                      window.open(result.anchorProps.href);
                    } else {
                      realtimeUpdate([], result.anchorProps.href);
                    }
                  }
                  return;
                }
                index += 1;
              }
            }
          }
        },
        children: /*#__PURE__*/jsxRuntimeExports.jsxs("div", {
          className: "input-group ps-1",
          children: [mode ? /*#__PURE__*/jsxRuntimeExports.jsx("span", {
            className: "input-group-text px-1 border-0 rounded-3 justify-content-center",
            style: {
              minWidth: 21
            },
            children: mode.key
          }) : null, /*#__PURE__*/jsxRuntimeExports.jsx("input", {
            ref: searchInputRef,
            className: "form-control shadow-none border-0 ps-1 pe-0",
            type: "text",
            placeholder: `Search ${mode?.description ?? "pages"}...`,
            style: {
              fontSize: 15
            },
            value: searchText,
            onChange: event => {
              const newText = event.target.value;
              if (!mode && newText.length > 0) {
                const newMode = MODES.find(mode => mode.key === newText[0]);
                if (newMode) {
                  setMode(newMode);
                  setSearchText(newText.slice(1));
                  setActiveIndex(newText.length > 1 ? 0 : undefined);
                  return;
                }
              }
              setSearchText(newText);
              setActiveIndex(newText.length > 0 ? 0 : undefined);
            },
            onKeyDown: event => {
              // Handle backspace when mode is set and there is no text - unset mode
              if (searchText === "" && mode && event.code === "Backspace") {
                setMode(undefined);
                setActiveIndex(undefined);
              }
            }
          })]
        })
      })]
    }), /*#__PURE__*/jsxRuntimeExports.jsxs(WrappedModal.Body, {
      className: "py-2 px-0",
      children: [searchText === "" && !mode ? /*#__PURE__*/jsxRuntimeExports.jsx("p", {
        className: "text-muted px-3 pb-2 mb-2 border-bottom",
        children: /*#__PURE__*/jsxRuntimeExports.jsx(ModeText, {
          inLeague: inLeague
        })
      }) : null, resultsGrouped.length > 0 ? /*#__PURE__*/jsxRuntimeExports.jsx(SearchResults, {
        activeIndex: activeIndex,
        collapseGroups: searchText !== "",
        resultsGrouped: resultsGrouped
      }) : /*#__PURE__*/jsxRuntimeExports.jsx("div", {
        className: "px-3",
        children: "No results found."
      })]
    })]
  });
};

// Wrapper so useEffect stuff in CommandPalette does not run until it shows
const ComandPaletteWrapper = () => {
  const {
    show,
    onHide
  } = useCommandPalette();
  reactExports.useEffect(() => {
    if (window.mobile) {
      return;
    }
    const lastUsedOrBugged = safeLocalStorage$1.getItem("commandPaletteLastUsed");
    if (lastUsedOrBugged === null) {
      saveLastUsed(true);
      return;
    }
    const lastDate = parseInt(lastUsedOrBugged);
    if (Number.isNaN(lastDate)) {
      saveLastUsed();
      return;
    }
    const diff = Date.now() - lastDate;
    if (diff >= TWO_MONTHS_IN_MILLISECONDS) {
      logEvent$1({
        extraClass: "",
        type: "info",
        text: "Pro tip: press ctrl+k or cmd+k to open the command palette, which allows easy keyboard navigation of your league.",
        saveToDb: false,
        persistent: true
      });
      saveLastUsed();
    }
  }, []);
  if (show) {
    return /*#__PURE__*/jsxRuntimeExports.jsx(ComandPalette, {
      show: show,
      onHide: onHide
    });
  }
  return null;
};

const FallbackGlobal = ({
  error,
  info
}) => {
  console.log(error, info);
  useTitleBar({
    title: "Error",
    hideNewWindow: true
  });
  return /*#__PURE__*/jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
    children: [/*#__PURE__*/jsxRuntimeExports.jsx("p", {
      children: error.message
    }), /*#__PURE__*/jsxRuntimeExports.jsx("pre", {
      children: error.stack
    })]
  });
};
const FallbackLocal = ({
  error,
  info
}) => {
  console.log(error, info);
  return /*#__PURE__*/jsxRuntimeExports.jsxs("p", {
    children: [/*#__PURE__*/jsxRuntimeExports.jsx("span", {
      className: "text-danger",
      children: "Error:"
    }), " ", error.message]
  });
};
let ErrorBoundaryBugsnag;
const ErrorBoundary = ({
  children,
  local
}) => {
  if (!ErrorBoundaryBugsnag) {
    ErrorBoundaryBugsnag = Bugsnag.getPlugin("react").createErrorBoundary(React$1);
  }
  return /*#__PURE__*/jsxRuntimeExports.jsx(ErrorBoundaryBugsnag, {
    FallbackComponent: local ? FallbackLocal : FallbackGlobal,
    children: children
  });
};

const footerLinks = [{
  url: "https://zengm.com/about/",
  title: "About"
}, {
  url: "https://zengm.com/blog/",
  title: "Blog"
}, {
  url: "https://zengm.com/contact/",
  title: "Contact"
}, {
  url: "https://zengm.com/privacy/",
  title: "Privacy"
}, {
  url: "https://github.com/zengm-games/zengm",
  title: "GitHub",
  hideMobile: true
}, {
  url: `https://www.reddit.com/r/${SUBREDDIT_NAME}/`,
  title: "Reddit"
}, {
  url: "https://zengm.com/discord/",
  title: "Discord"
}];
const Footer = /*#__PURE__*/reactExports.memo(() => {
  // banner-ad class is so ad blockers remove it cleanly. I'm so nice!
  return /*#__PURE__*/jsxRuntimeExports.jsxs("footer", {
    className: "footer-wrapper mt-auto mb-3",
    id: "main-footer",
    children: [/*#__PURE__*/jsxRuntimeExports.jsx("p", {
      className: "clearfix"
    }), /*#__PURE__*/jsxRuntimeExports.jsxs("div", {
      className: "banner-ad",
      style: {
        position: "relative"
      },
      children: [/*#__PURE__*/jsxRuntimeExports.jsx("div", {
        id: `${AD_DIVS.rectangle1}_disabled`,
        style: {
          display: "none",
          textAlign: "center",
          height: "250px",
          position: "absolute",
          top: "5px",
          left: 0
        }
      }), /*#__PURE__*/jsxRuntimeExports.jsx("div", {
        id: "bbgm-ads-logo",
        style: {
          display: "none",
          height: "250px",
          margin: "5px 320px 0 320px",
          alignItems: "center",
          justifyContent: "center"
        },
        children: /*#__PURE__*/jsxRuntimeExports.jsx("img", {
          alt: "",
          src: `https://zengm.com/files/logo-${process.env.SPORT}.svg`,
          style: {
            maxHeight: "100%",
            maxWidth: "100%"
          }
        })
      }), /*#__PURE__*/jsxRuntimeExports.jsx("div", {
        id: `${AD_DIVS.rectangle2}_disabled`,
        style: {
          display: "none",
          textAlign: "center",
          height: "250px",
          position: "absolute",
          top: "5px",
          right: 0
        }
      })]
    }), /*#__PURE__*/jsxRuntimeExports.jsx("div", {
      className: "clearfix"
    }), /*#__PURE__*/jsxRuntimeExports.jsx("hr", {}), /*#__PURE__*/jsxRuntimeExports.jsxs("div", {
      className: "float-sm-start",
      children: [footerLinks.map(({
        hideMobile,
        url,
        title
      }, i) => {
        return /*#__PURE__*/jsxRuntimeExports.jsxs("span", {
          className: hideMobile ? "d-none d-sm-inline-block" : undefined,
          children: [i > 0 ? " · " : null, /*#__PURE__*/jsxRuntimeExports.jsx("a", {
            href: url,
            rel: "noopener noreferrer",
            target: "_blank",
            children: title
          })]
        }, url);
      }), /*#__PURE__*/jsxRuntimeExports.jsx("br", {})]
    }), /*#__PURE__*/jsxRuntimeExports.jsxs("div", {
      className: "float-sm-end text-muted",
      children: [GAME_ACRONYM, " v", window.bbgmVersion]
    })]
  });
});

const Header = /*#__PURE__*/reactExports.memo(() => {
  return (
    /*#__PURE__*/
    // banner-ad class is so ad blockers remove it cleanly. I'm so nice!
    jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
      children: [/*#__PURE__*/jsxRuntimeExports.jsx("div", {
        className: "banner-ad",
        id: `${AD_DIVS.leaderboard}_disabled`,
        style: {
          display: "none",
          textAlign: "center",
          minHeight: 90,
          marginBottom: 5
        }
      }), /*#__PURE__*/jsxRuntimeExports.jsx("div", {
        className: "banner-ad",
        id: `${AD_DIVS.mobile}_disabled`,
        style: {
          display: "none",
          textAlign: "center",
          minHeight: 50,
          marginBottom: 5
        }
      })]
    })
  );
});

const Toggle = ({
  show,
  toggle
}) => {
  // container-fluid is needed to make this account for scrollbar width when modal is open
  return /*#__PURE__*/jsxRuntimeExports.jsx("button", {
    className: "btn btn-secondary p-0 league-top-bar-toggle",
    title: show ? "Hide scores" : "Show scores",
    onClick: toggle,
    children: /*#__PURE__*/jsxRuntimeExports.jsx("span", {
      className: classnamesExports("glyphicon", show ? "glyphicon-menu-right" : "glyphicon-menu-left")
    })
  });
};
const hiddenStyle = {
  height: 0
};
const IS_SAFARI = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const LeagueTopBar = /*#__PURE__*/reactExports.memo(() => {
  const {
    games,
    lid,
    liveGameInProgress
  } = useLocalPartial(["games", "lid", "liveGameInProgress"]);
  const [show, setShow] = reactExports.useState(() => {
    const showTemp = safeLocalStorage$1.getItem("bbgmShowLeagueTopBar");
    if (showTemp === "true") {
      return true;
    }
    if (showTemp === "false") {
      return false;
    }
    return true;
  });
  const keepScrollToRightRef = reactExports.useRef(true);
  const [wrapperElement, setWrapperElement] = reactExports.useState(null);
  const prevGames = reactExports.useRef([]);
  const games2 = [];
  const keepScrolledToRightIfNecessary = reactExports.useCallback(() => {
    if (keepScrollToRightRef.current && wrapperElement && wrapperElement.scrollLeft + wrapperElement.offsetWidth < wrapperElement.scrollWidth &&
    // Chrome 61 supports scrollTo, so after making that the minimum supported version, this check is no longer needed
    wrapperElement.scrollTo) {
      wrapperElement.scrollTo({
        left: wrapperElement.scrollWidth
      });
    }
  }, [wrapperElement]);
  reactExports.useEffect(() => {
    return emitter.on("keepScrollToRight", keepScrolledToRightIfNecessary);
  }, [keepScrolledToRightIfNecessary]);
  reactExports.useEffect(() => {
    if (!wrapperElement || !show) {
      return;
    }
    const handleWheel = event => {
      if (!wrapperElement || wrapperElement.scrollWidth <= wrapperElement.clientWidth || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey ||
      // Chrome 61 supports scrollTo, so after making that the minimum supported version, this check is no longer needed
      !wrapperElement.scrollTo) {
        return;
      }

      // We're scrolling within the bar, not within the whole page
      event.preventDefault();
      const leagueTopBarPosition = wrapperElement.scrollLeft;
      wrapperElement.scrollTo({
        // Normal mouse wheels are just deltaY, but trackpads (such as on Mac) can include both, and I think there's no way to tell if this event came from a device supporting two dimensional scrolling or not.
        left: leagueTopBarPosition + 2 * (event.deltaX + event.deltaY)
      });
    };

    // This triggers for wheel scrolling and click scrolling
    const handleScroll = () => {
      if (!wrapperElement || wrapperElement.scrollWidth <= wrapperElement.clientWidth) {
        return;
      }

      // Keep track of if we're scrolled to the right or not
      const FUDGE_FACTOR = 50; // Off by a few pixels? That's fine!
      keepScrollToRightRef.current = wrapperElement.scrollLeft + wrapperElement.offsetWidth >= wrapperElement.scrollWidth - FUDGE_FACTOR;
    };
    wrapperElement.addEventListener("wheel", handleWheel, {
      passive: false
    });
    wrapperElement.addEventListener("scroll", handleScroll, {
      passive: false
    });
    let resizeObserver;
    // Chrome 64 and Safari 13.1 support ResizeObserver
    if (typeof ResizeObserver !== "undefined") {
      // This works better than the global "resize" event because it also handles when the div size changes due to other reasons, like the window's scrollbar appearing or disappearing
      resizeObserver = new ResizeObserver(keepScrolledToRightIfNecessary);
      resizeObserver.observe(wrapperElement);
    }
    return () => {
      wrapperElement.removeEventListener("wheel", handleWheel);
      wrapperElement.removeEventListener("scroll", handleScroll);
      resizeObserver?.unobserve(wrapperElement);
    };
  }, [keepScrolledToRightIfNecessary, show, wrapperElement]);

  // If you take control of an expansion team after the season, the ASG is the only game, and it looks weird to show just it
  const onlyAllStarGame = games.length === 1 && games[0].teams[0].tid === -1 && games[0].teams[1].tid === -2;
  if (lid === undefined || games.length === 0 || onlyAllStarGame) {
    return /*#__PURE__*/jsxRuntimeExports.jsx("div", {
      className: "mt-2"
    });
  }

  // Don't show any new games if liveGameInProgress
  if (!liveGameInProgress) {
    prevGames.current = games;
  }
  if (show) {
    // Show only the first upcoming game
    for (const game of prevGames.current) {
      games2.push(game);
      if (game.teams[0].pts === undefined) {
        break;
      }
    }
  }

  // In a new season, start scrolled to right
  if (games2.length <= 1) {
    keepScrollToRightRef.current = true;
  }

  // Keep scrolled to the right, if something besides a scroll event has moved us away (i.e. a game was simmed and added to the list)
  keepScrolledToRightIfNecessary();
  return /*#__PURE__*/jsxRuntimeExports.jsxs("div", {
    className: `league-top-bar${IS_SAFARI ? " league-top-bar-safari" : ""} flex-shrink-0 d-flex overflow-auto small-scrollbar flex-row ps-1 mt-2`,
    style: show ? undefined : hiddenStyle,
    ref: element => {
      setWrapperElement(element);
    },
    children: [/*#__PURE__*/jsxRuntimeExports.jsx(Toggle, {
      show: show,
      toggle: () => {
        if (show === false) {
          // When showing, always scroll to right
          keepScrollToRightRef.current = true;
        }
        setShow(!show);
        safeLocalStorage$1.setItem("bbgmShowLeagueTopBar", String(!show));
      }
    }), show ? games2.map((game, i) => /*#__PURE__*/jsxRuntimeExports.jsx(ScoreBox, {
      className: `me-2${i === 0 ? " ms-auto" : ""}`,
      game: game,
      small: true
    }, game.gid)) : null]
  });
});

const setUserTid = async userTid => {
  await toWorker$1("main", "updateGameAttributes", {
    userTid
  });
  realtimeUpdate(["firstRun"]);
};
const handleChange = async event => {
  const userTid = parseInt(event.target.value);
  await setUserTid(userTid);
};
const MultiTeamMenu = () => {
  const state = useLocalPartial(["stickyFooterAd", "stickyFormButtons", "teamInfoCache", "userTid", "userTids"]);

  // Hide if not multi team or not loaded yet
  if (state.userTids.length <= 1 || state.stickyFormButtons) {
    return null;
  }
  const teams = orderBy(state.userTids.map(tid => ({
    region: state.teamInfoCache[tid]?.region,
    name: state.teamInfoCache[tid]?.name,
    tid
  })), ["region", "name", "tid"]);
  const ind = teams.findIndex(t => t.tid === state.userTid);
  const prev = async () => {
    const t = teams[ind - 1];
    if (t !== undefined) {
      await setUserTid(t.tid);
    }
  };
  const next = async () => {
    const t = teams[ind + 1];
    if (t !== undefined) {
      await setUserTid(t.tid);
    }
  };
  const prevDisabled = ind < 0 || ind === 0;
  const nextDisabled = ind < 0 || ind === state.userTids.length - 1;
  let bottom = 0;
  if (state.stickyFooterAd) {
    bottom += 52;
  }
  return /*#__PURE__*/jsxRuntimeExports.jsxs("div", {
    className: "multi-team-menu d-flex align-items-end",
    style: {
      bottom
    },
    children: [/*#__PURE__*/jsxRuntimeExports.jsx("button", {
      className: "btn btn-link p-0 mb-1",
      disabled: prevDisabled,
      onClick: prev,
      title: "Previous Team",
      children: /*#__PURE__*/jsxRuntimeExports.jsx("span", {
        className: "glyphicon glyphicon-menu-left"
      })
    }), /*#__PURE__*/jsxRuntimeExports.jsx("div", {
      className: "flex-fill px-1",
      children: /*#__PURE__*/jsxRuntimeExports.jsx("select", {
        className: "form-select",
        onChange: handleChange,
        value: state.userTid,
        children: teams.map(t => /*#__PURE__*/jsxRuntimeExports.jsxs("option", {
          value: t.tid,
          children: [t.region, " ", t.name]
        }, t.tid))
      })
    }), /*#__PURE__*/jsxRuntimeExports.jsx("button", {
      className: "btn btn-link p-0 mb-1",
      disabled: nextDisabled,
      onClick: next,
      title: "Next Team",
      children: /*#__PURE__*/jsxRuntimeExports.jsx("span", {
        className: "glyphicon glyphicon-menu-right"
      })
    })]
  });
};

const NagModal = ({
  close,
  show
}) => {
  const adBlock = !window.freestar.refreshAllSlots || !window.googletag || !window.googletag.pubads;
  return /*#__PURE__*/jsxRuntimeExports.jsxs(WrappedModal, {
    show: show,
    onHide: close,
    children: [/*#__PURE__*/jsxRuntimeExports.jsx(WrappedModal.Header, {
      closeButton: true,
      children: adBlock ? "Are you using an ad blocker?" : `Please support ${GAME_NAME}`
    }), adBlock ? /*#__PURE__*/jsxRuntimeExports.jsxs(WrappedModal.Body, {
      children: [/*#__PURE__*/jsxRuntimeExports.jsx("p", {
        children: "Don't worry. I understand why people use ad blockers. You can close this window and keep playing."
      }), /*#__PURE__*/jsxRuntimeExports.jsxs("p", {
        children: ["But please remember that ", GAME_NAME, " is a free game. It's made by one person (", /*#__PURE__*/jsxRuntimeExports.jsx("a", {
          href: `https://${WEBSITE_ROOT}/about/`,
          children: "me"
        }), ") in my spare time. The more money I make, the more time I can afford to spend improving the game."]
      }), /*#__PURE__*/jsxRuntimeExports.jsxs("p", {
        children: ["Also remember how corrupt and horrible most video game companies are. Imagine if ", GAME_NAME, " was owned by EA or 2k. For example, I could make a lot more money if I let you pay to \"hire trainers\" to improve player development."]
      }), /*#__PURE__*/jsxRuntimeExports.jsxs("p", {
        children: ["But I refuse to do that. If you want to encourage me, please support", " ", GAME_NAME, ". There are a few ways you can do it:"]
      }), /*#__PURE__*/jsxRuntimeExports.jsxs("ol", {
        children: [/*#__PURE__*/jsxRuntimeExports.jsxs("li", {
          children: [/*#__PURE__*/jsxRuntimeExports.jsxs("b", {
            children: ["Tell your friends about ", GAME_NAME, "."]
          }), " The more users I have, the better."]
        }), /*#__PURE__*/jsxRuntimeExports.jsxs("li", {
          children: [/*#__PURE__*/jsxRuntimeExports.jsx("b", {
            children: /*#__PURE__*/jsxRuntimeExports.jsx("a", {
              href: "/account",
              onClick: close,
              children: "Subscribe to ZenGM Gold."
            })
          }), " ", "For $5/month, you can play ", /*#__PURE__*/jsxRuntimeExports.jsx(GameLinks, {}), " without any ads."]
        }), /*#__PURE__*/jsxRuntimeExports.jsxs("li", {
          children: [/*#__PURE__*/jsxRuntimeExports.jsxs("b", {
            children: ["Disable your ad blocker for ", GAME_NAME, "."]
          }), " To do this, click the icon for your ad blocker (such as uBlock Origin or Adblock Plus) in your browser toolbar and there will be some button to allow you to disable it for only this site."]
        })]
      }), /*#__PURE__*/jsxRuntimeExports.jsx("p", {
        className: "mb-0",
        children: "None of that is mandatory. Like I said at the top, you can close this and keep playing!"
      })]
    }) : /*#__PURE__*/jsxRuntimeExports.jsxs(WrappedModal.Body, {
      children: [/*#__PURE__*/jsxRuntimeExports.jsxs("p", {
        children: [GAME_NAME, " is completely free. There will never be any", " ", /*#__PURE__*/jsxRuntimeExports.jsx("a", {
          href: "http://en.wikipedia.org/wiki/Freemium",
          rel: "noopener noreferrer",
          target: "_blank",
          children: "\"freemium\""
        }), " ", "or", " ", /*#__PURE__*/jsxRuntimeExports.jsx("a", {
          href: "http://en.wikipedia.org/wiki/Free-to-play",
          rel: "noopener noreferrer",
          target: "_blank",
          children: "\"pay-to-win\""
        }), " ", "bullshit here. Why? Because if a game charges you money for power-ups, the developer makes more money if they make their game frustratingly annoying to play without power-ups. Because of this,", " ", /*#__PURE__*/jsxRuntimeExports.jsx("b", {
          children: "freemium games always suck"
        }), "."]
      }), /*#__PURE__*/jsxRuntimeExports.jsxs("p", {
        children: ["If you want to support ", GAME_NAME, " continuing to be a non-sucky game, sign up for ZenGM Gold! It's only ", /*#__PURE__*/jsxRuntimeExports.jsx("b", {
          children: "$5/month"
        }), ". What do you get? More like, what don't you get? You get no new features, no new improvements, no new anything. Just ", /*#__PURE__*/jsxRuntimeExports.jsx("b", {
          children: "no more ads"
        }), " on", " ", /*#__PURE__*/jsxRuntimeExports.jsx(GameLinks, {
          thisGameText: "this game"
        }), ". That's it. Why? For basically the same reason I won't make ", GAME_NAME, " freemium. I don't want the free version to become a crippled advertisement for the pay version. If you agree that the world is a better place when anyone anywhere can play ", /*#__PURE__*/jsxRuntimeExports.jsx(GameLinks, {
          noLinks: true
        }), ", sign up for ZenGM Gold today!"]
      }), /*#__PURE__*/jsxRuntimeExports.jsx("div", {
        className: "text-center",
        children: /*#__PURE__*/jsxRuntimeExports.jsx("a", {
          href: "/account",
          className: "btn btn-primary",
          onClick: close,
          children: "Sign up for ZenGM Gold from your account page"
        })
      })]
    })]
  });
};

const TopMenuToggle = ({
  long,
  openID,
  short,
  toggle
}) => {
  const handleMouseEnter = reactExports.useCallback(event => {
    if (openID !== undefined && openID !== long && toggle) {
      toggle(event);
    }
  }, [long, openID, toggle]);
  return /*#__PURE__*/jsxRuntimeExports.jsxs(Dropdown.Toggle, {
    as: Nav$1.Link,
    id: "whatever",
    onMouseEnter: handleMouseEnter,
    children: [/*#__PURE__*/jsxRuntimeExports.jsx("span", {
      className: "d-none d-md-inline",
      children: long
    }), /*#__PURE__*/jsxRuntimeExports.jsx("span", {
      className: "d-md-none",
      title: long,
      children: short
    })]
  });
};
const TopMenuDropdown = ({
  children,
  hideTitle,
  long,
  short,
  openID,
  onToggle
}) => {
  const toggle = reactExports.useCallback(event => onToggle(long, event), [long, onToggle]);
  return /*#__PURE__*/jsxRuntimeExports.jsxs(Dropdown, {
    show: openID === long,
    onToggle: toggle,
    as: Nav$1.Item,
    children: [/*#__PURE__*/jsxRuntimeExports.jsx(TopMenuToggle, {
      long: long,
      short: short,
      openID: openID,
      toggle: toggle
    }), /*#__PURE__*/jsxRuntimeExports.jsxs(Dropdown.Menu, {
      align: "end",
      children: [!hideTitle ? /*#__PURE__*/jsxRuntimeExports.jsx(Dropdown.Header, {
        className: "d-none d-sm-block d-md-none",
        children: long
      }) : null, children]
    })]
  });
};
const getText = text => {
  if (Object.hasOwn(text, "top")) {
    // @ts-expect-error
    return text.top;
  }
  return text;
};
const makeAnchorProps = menuItem => {
  let href;
  let rel;
  let target;
  if (typeof menuItem.path === "string") {
    href = menuItem.path;
    if (menuItem.path.startsWith("http")) {
      rel = "noopener noreferrer";
      target = "_blank";
    }
  } else if (Array.isArray(menuItem.path)) {
    href = helpers.leagueUrl(menuItem.path);
  }
  const onClick = menuItem.onClick;
  return {
    onClick,
    href,
    rel,
    target
  };
};
const MenuItem = ({
  godMode,
  hideTitle,
  inLeague,
  lid,
  menuItem,
  openID,
  onToggle,
  root
}) => {
  if (menuItem.type === "text") {
    return /*#__PURE__*/jsxRuntimeExports.jsx(Dropdown.Header, {
      children: menuItem.text
    });
  }
  if (!menuItem.league && inLeague) {
    return null;
  }
  if (!menuItem.nonLeague && !inLeague) {
    return null;
  }
  if (menuItem.type === "link") {
    if (menuItem.commandPaletteOnly) {
      return null;
    }
    if (menuItem.godMode && !godMode) {
      return null;
    }
    if (menuItem.text === "Switch League") {
      return null;
    }
    const anchorProps = makeAnchorProps(menuItem);
    if (typeof menuItem.path === "string") {
      anchorProps.href = menuItem.path;
      if (menuItem.path.startsWith("http")) {
        anchorProps.rel = "noopener noreferrer";
        anchorProps.target = "_blank";
      }
    } else if (Array.isArray(menuItem.path)) {
      anchorProps.href = helpers.leagueUrl(menuItem.path);
    }
    if (menuItem.onClick) {
      anchorProps.onClick = menuItem.onClick;
    }
    if (root) {
      return /*#__PURE__*/jsxRuntimeExports.jsx(Nav$1.Item, {
        children: /*#__PURE__*/jsxRuntimeExports.jsx(Nav$1.Link, {
          ...anchorProps,
          children: getText(menuItem.text)
        })
      });
    }
    return /*#__PURE__*/jsxRuntimeExports.jsx(Dropdown.Item, {
      ...anchorProps,
      className: classnamesExports({
        "god-mode": menuItem.godMode
      }),
      children: getText(menuItem.text)
    });
  }
  if (menuItem.type === "header") {
    const children = menuItem.children.map((child, i) => /*#__PURE__*/jsxRuntimeExports.jsx(MenuItem, {
      godMode: godMode,
      lid: lid,
      inLeague: inLeague,
      menuItem: child,
      openID: openID,
      onToggle: onToggle,
      root: false
    }, i)).filter(element => element !== null);
    if (children.length === 0) {
      return null;
    }
    return /*#__PURE__*/jsxRuntimeExports.jsx(TopMenuDropdown, {
      hideTitle: hideTitle,
      long: menuItem.long,
      short: menuItem.short,
      openID: openID,
      onToggle: onToggle,
      children: children
    });
  }
  throw new Error(`Unknown menuItem.type "${menuItem.type}"`);
};
const DropdownLinks = /*#__PURE__*/reactExports.memo(({
  className,
  godMode,
  hideTitle,
  inLeague,
  lid,
  menuItems
}) => {
  const [openID, setOpenID] = reactExports.useState();
  const handleTopMenuToggle = reactExports.useCallback((id, event) => {
    if (event.currentTarget && event.currentTarget.focus) {
      event.currentTarget.focus();
    }
    setOpenID(id === openID ? undefined : id);
  }, [openID]);
  return /*#__PURE__*/jsxRuntimeExports.jsx(Nav$1, {
    navbar: true,
    className: classnamesExports(className, "dropdown-links navbar-nav"),
    children: menuItems.map((menuItem, i) => /*#__PURE__*/jsxRuntimeExports.jsx(MenuItem, {
      godMode: godMode,
      lid: lid,
      hideTitle: hideTitle,
      inLeague: inLeague,
      menuItem: menuItem,
      openID: openID,
      onToggle: handleTopMenuToggle,
      root: true
    }, i))
  });
});

const LogoAndText = /*#__PURE__*/reactExports.memo(({
  gold,
  inLeague,
  updating
}) => {
  return /*#__PURE__*/jsxRuntimeExports.jsxs("a", {
    className: inLeague ? "navbar-brand text-muted d-none d-md-inline ms-md-2 ms-lg-0" : "navbar-brand text-muted",
    href: "/",
    children: [/*#__PURE__*/jsxRuntimeExports.jsx("img", {
      alt: "",
      className: "spin",
      width: "18",
      height: "18",
      src: gold ? "/ico/logo-gold.png" : "/ico/logo.png",
      style: {
        animationPlayState: updating ? "running" : "paused"
      }
    }), /*#__PURE__*/jsxRuntimeExports.jsx("span", {
      className: inLeague ? "d-none d-lg-inline" : undefined,
      children: GAME_NAME
    })]
  });
});

const handleOptionClick = (option, event) => {
  if (!option.url) {
    event.preventDefault();
    toWorker$1("playMenu", option.id, undefined);
  }
};
const PlayMenu = /*#__PURE__*/reactExports.forwardRef(({
  lid,
  spectator,
  options
}, ref) => {
  reactExports.useEffect(() => {
    const handleKeydown = async event => {
      // alt + letter -  CANNOT USE KeyboardEvent.key BECAUSE ALT+P ON MAC IS PI!
      if (event.altKey && !event.ctrlKey && !event.shiftKey && !event.isComposing && !event.metaKey) {
        const option = options.find(option2 => option2.code === event.code);
        if (!option) {
          return;
        }
        if (window.location.pathname.includes("/live_game")) {
          const liveGameInProgress = local$1.getState().liveGameInProgress;
          if (liveGameInProgress) {
            const proceed = await confirm$1("Are you sure you meant to press a Play Menu keyboard shortcut while watching a live sim?", {
              okText: "Yes",
              cancelText: "Cancel"
            });
            if (!proceed) {
              return;
            }
          }
        }
        if (option.url) {
          realtimeUpdate([], option.url);
        } else {
          toWorker$1("playMenu", option.id, undefined);
        }
      }
    };
    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [options]);
  if (lid === undefined) {
    return null;
  }
  return /*#__PURE__*/jsxRuntimeExports.jsxs(Dropdown, {
    className: `play-button-wrapper${window.mobile ? " dropdown-mobile" : ""}`,
    as: Nav$1.Item,
    ref: ref,
    children: [/*#__PURE__*/jsxRuntimeExports.jsx(Dropdown.Toggle, {
      className: classnamesExports("play-button", spectator ? "play-button-danger" : "play-button-success"),
      id: "play-button",
      as: Nav$1.Link,
      children: "Play"
    }), /*#__PURE__*/jsxRuntimeExports.jsx(Dropdown.Menu, {
      children: options.map((option, i) => {
        return /*#__PURE__*/jsxRuntimeExports.jsxs(Dropdown.Item, {
          href: option.url,
          onClick: event => handleOptionClick(option, event),
          className: "kbd-parent",
          children: [option.label, option.key ? /*#__PURE__*/jsxRuntimeExports.jsxs("span", {
            className: "text-muted kbd",
            children: ["Alt+", option.key.toUpperCase()]
          }) : null]
        }, i);
      })
    })]
  });
});

const PhaseStatusBlock = () => {
  const {
    liveGameInProgress,
    phase,
    phaseText,
    statusText
  } = useLocalPartial(["liveGameInProgress", "phase", "phaseText", "statusText"]);

  // Hide phase and status, to prevent revealing that the playoffs has ended, thus spoiling a 3-0/3-1/3-2 finals
  // game. This is needed because game sim happens before the results are displayed in liveGame.
  const text = /*#__PURE__*/jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
    children: [liveGameInProgress ? "Live game" : phaseText, /*#__PURE__*/jsxRuntimeExports.jsx("br", {}), liveGameInProgress ? "in progress" : statusText]
  });
  let urlParts;
  if (statusText === "Contract negotiation") {
    urlParts = ["negotiation"];
  } else {
    const urls = {
      [PHASE.EXPANSION_DRAFT]: ["draft"],
      [PHASE.FANTASY_DRAFT]: ["draft"],
      [PHASE.PRESEASON]: ["roster"],
      [PHASE.REGULAR_SEASON]: ["roster"],
      [PHASE.AFTER_TRADE_DEADLINE]: ["roster"],
      [PHASE.PLAYOFFS]: ["playoffs"],
      // Hack because we don't know repeatSeason and draftType, see updatePhase
      [PHASE.DRAFT_LOTTERY]: phaseText.includes("after playoffs") ? ["draft_scouting"] : ["draft_lottery"],
      [PHASE.DRAFT]: ["draft"],
      [PHASE.AFTER_DRAFT]: ["draft_history"],
      [PHASE.RESIGN_PLAYERS]: ["negotiation"],
      [PHASE.FREE_AGENCY]: ["free_agents"]
    };
    urlParts = urls[phase];
  }
  return /*#__PURE__*/jsxRuntimeExports.jsx("div", {
    className: "dropdown-links navbar-nav flex-shrink-1 overflow-hidden text-nowrap",
    children: /*#__PURE__*/jsxRuntimeExports.jsx("div", {
      className: "nav-item",
      children: /*#__PURE__*/jsxRuntimeExports.jsx("a", {
        href: helpers.leagueUrl(urlParts),
        className: "nav-link",
        style: {
          lineHeight: 1.35,
          padding: "9px 0 8px 16px"
        },
        children: text
      })
    })
  });
};
const NavBar = ({
  updating
}) => {
  const {
    lid,
    godMode,
    gold,
    hasViewedALeague,
    sidebarOpen,
    spectator,
    playMenuOptions,
    popup,
    username
  } = useLocalPartial(["lid", "godMode", "gold", "hasViewedALeague", "sidebarOpen", "spectator", "playMenuOptions", "popup", "username"]);
  const viewInfo = useViewData();

  // Checking lid too helps with some flicker
  const inLeague = viewInfo?.inLeague && lid !== undefined;
  if (popup) {
    return /*#__PURE__*/jsxRuntimeExports.jsx("div", {});
  }
  const userBlock = username ? /*#__PURE__*/jsxRuntimeExports.jsxs(Nav$1.Link, {
    href: "/account",
    "aria-label": "Account",
    children: [/*#__PURE__*/jsxRuntimeExports.jsx("span", {
      className: "glyphicon glyphicon-user"
    }), " ", /*#__PURE__*/jsxRuntimeExports.jsx("span", {
      className: "d-none d-lg-inline",
      children: username
    })]
  }) : /*#__PURE__*/jsxRuntimeExports.jsxs(Nav$1.Link, {
    href: "/account/login_or_register",
    "aria-label": "Login/Register",
    children: [/*#__PURE__*/jsxRuntimeExports.jsx("span", {
      className: "glyphicon glyphicon-user"
    }), " ", /*#__PURE__*/jsxRuntimeExports.jsx("span", {
      className: "d-none d-lg-inline",
      children: "Login/Register"
    })]
  });
  return /*#__PURE__*/jsxRuntimeExports.jsx(Navbar$1, {
    bg: "light",
    expand: "sm",
    fixed: "top",
    className: "navbar-border flex-nowrap",
    children: /*#__PURE__*/jsxRuntimeExports.jsxs("div", {
      className: "container-fluid",
      children: [/*#__PURE__*/jsxRuntimeExports.jsx("button", {
        className: "navbar-toggler me-2 d-block",
        onClick: () => {
          localActions.setSidebarOpen(!sidebarOpen);
        },
        type: "button",
        "aria-label": "Toggle navigation",
        children: /*#__PURE__*/jsxRuntimeExports.jsx("span", {
          className: "navbar-toggler-icon"
        })
      }), /*#__PURE__*/jsxRuntimeExports.jsx(LogoAndText, {
        gold: gold,
        inLeague: inLeague,
        updating: updating
      }), inLeague ? /*#__PURE__*/jsxRuntimeExports.jsx(Nav$1, {
        navbar: true,
        children: /*#__PURE__*/jsxRuntimeExports.jsx(OverlayTrigger, {
          placement: "bottom",
          defaultShow: !hasViewedALeague && lid === 1,
          trigger: "click",
          rootClose: true,
          onExited: () => {
            localActions.update({
              hasViewedALeague: true
            });
            safeLocalStorage$1.setItem("hasViewedALeague", "true");
          },
          overlay: /*#__PURE__*/jsxRuntimeExports.jsxs(Popover, {
            id: "popover-welcome",
            children: [/*#__PURE__*/jsxRuntimeExports.jsxs(Popover.Header, {
              className: "text-primary fw-bold",
              children: ["Welcome to ", GAME_NAME, "!"]
            }), /*#__PURE__*/jsxRuntimeExports.jsx(Popover.Body, {
              children: "To advance through the game, use the Play button at the top. The options shown will change depending on the current state of the game."
            })]
          }),
          children: /*#__PURE__*/jsxRuntimeExports.jsx(PlayMenu, {
            lid: lid,
            spectator: spectator,
            options: playMenuOptions
          })
        })
      }) : null, inLeague ? /*#__PURE__*/jsxRuntimeExports.jsx(PhaseStatusBlock, {}) : null, /*#__PURE__*/jsxRuntimeExports.jsx("div", {
        className: "flex-grow-1"
      }), /*#__PURE__*/jsxRuntimeExports.jsx("div", {
        className: "d-none d-sm-flex",
        children: /*#__PURE__*/jsxRuntimeExports.jsx(DropdownLinks, {
          godMode: godMode,
          inLeague: inLeague,
          lid: lid,
          menuItems: menuItems.filter(menuItem => !menuItem.commandPaletteOnly)
        })
      }), /*#__PURE__*/jsxRuntimeExports.jsx(Nav$1, {
        id: "top-user-block",
        navbar: true,
        children: /*#__PURE__*/jsxRuntimeExports.jsx(Nav$1.Item, {
          children: userBlock
        })
      })]
    })
  });
};

const widthCutoff = 1200 + 190;
let displayed = false;
const updateSkyscraperDisplay = () => {
  const div = document.getElementById(AD_DIVS.rail);
  if (div) {
    const gold = !!div.dataset.gold;
    if (document.documentElement.clientWidth >= widthCutoff && !gold) {
      if (!displayed) {
        window.freestar.queue.push(() => {
          div.style.display = "block";
          window.freestar.newAdSlots([{
            placementName: AD_DIVS.rail,
            slotId: AD_DIVS.rail
          }]);
          displayed = true;
        });
      }
    } else {
      if (displayed || gold) {
        window.freestar.queue.push(() => {
          div.style.display = "none";
          window.freestar.deleteAdSlots(AD_DIVS.rail);
          displayed = false;
        });
      }
    }
  }
};

// https://developer.mozilla.org/en-US/docs/Web/Events/resize
let running = false;
const resizeListener = () => {
  if (running) {
    return;
  }
  running = true;
  window.requestAnimationFrame(() => {
    window.dispatchEvent(new CustomEvent("optimizedResize"));
    running = false;
  });
};
const Skyscraper = /*#__PURE__*/reactExports.memo(() => {
  reactExports.useEffect(() => {
    if (!window.mobile) {
      updateSkyscraperDisplay();
      window.addEventListener("resize", resizeListener);
      window.addEventListener("optimizedResize", updateSkyscraperDisplay);
      return () => {
        window.removeEventListener("resize", resizeListener);
        window.removeEventListener("optimizedResize", updateSkyscraperDisplay);
      };
    }
  }, []);
  return (
    /*#__PURE__*/
    // banner-ad class is so ad blockers remove it cleanly. I'm so nice!
    jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, {
      children: /*#__PURE__*/jsxRuntimeExports.jsx("div", {
        className: "banner-ad ms-3 flex-shrink-0",
        id: `${AD_DIVS.rail}_disabled`,
        "data-gold": "true",
        style: {
          display: "none"
        }
      })
    })
  );
});

const NewWindowLink = ({
  parts
}) => {
  const handleClick = reactExports.useCallback(() => {
    const url = parts ? helpers.leagueUrl(parts) : document.URL; // Window name is set to the current time, so each window has a unique name and thus a new window is always opened

    window.open(`${url}?w=popup`, String(Date.now()), "height=600,width=800,scrollbars=yes");
  }, [parts]);
  return /*#__PURE__*/jsxRuntimeExports.jsxs("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "13",
    height: "13",
    viewBox: "0 0 272.8 272.9",
    className: "new_window ms-2",
    onClick: handleClick,
    children: [/*#__PURE__*/jsxRuntimeExports.jsx("title", {
      children: "Open In New Window"
    }), /*#__PURE__*/jsxRuntimeExports.jsx("path", {
      fill: "none",
      strokeWidth: "20",
      d: "M60 10h203v203H60z"
    }), /*#__PURE__*/jsxRuntimeExports.jsx("path", {
      d: "M107 171L216 55v75-75h-75",
      fill: "none",
      strokeWidth: "30",
      strokeLinejoin: "bevel"
    }), /*#__PURE__*/jsxRuntimeExports.jsx("path", {
      fill: "#000",
      d: "M205 40h26v15h-26z"
    }), /*#__PURE__*/jsxRuntimeExports.jsx("path", {
      d: "M10 50v223",
      strokeWidth: "20"
    }), /*#__PURE__*/jsxRuntimeExports.jsx("path", {
      d: "M10 263h213M1 60h60M213 220v46",
      strokeWidth: "20"
    })]
  });
};

const genPath = (parts, season) => {
  if (season !== undefined) {
    return [...parts, season];
  }
  return parts;
};
const TitleBar = () => {
  const {
    title,
    customMenu,
    hideNewWindow,
    jumpTo,
    jumpToSeason,
    dropdownCustomOptions,
    dropdownCustomURL,
    dropdownView,
    dropdownFields,
    moreInfoAbbrev,
    moreInfoSeason,
    moreInfoTid,
    lid
  } = useLocalPartial(["title", "customMenu", "hideNewWindow", "jumpTo", "jumpToSeason", "dropdownCustomOptions", "dropdownCustomURL", "dropdownView", "dropdownFields", "moreInfoAbbrev", "moreInfoSeason", "moreInfoTid", "lid"]);
  if (title === undefined) {
    return null;
  }
  const menuItems = [];
  if (jumpTo) {
    // Sometimes the season will be some nonsense like "all", in which case we can't generally use
    // it (although maybe it would be good to in some cases).
    const season = typeof jumpToSeason === "number" ? String(jumpToSeason) : undefined;
    menuItems.push({
      type: "header",
      long: "Jump To",
      short: "Jump To",
      league: true,
      children: [{
        type: "link",
        league: true,
        path: genPath(["standings"], season),
        text: "Standings"
      }, {
        type: "link",
        league: true,
        path: genPath(["playoffs"], season),
        text: "Playoffs"
      }, {
        type: "link",
        league: true,
        path: genPath(["history"], season),
        text: "Season Summary"
      }, {
        type: "link",
        league: true,
        path: genPath(["league_finances"], season),
        text: "Finances"
      }, {
        type: "link",
        league: true,
        path: genPath(["news", "all"], season),
        text: "News Feed"
      }, {
        type: "link",
        league: true,
        path: genPath(["draft_history"], season),
        text: "Draft"
      }, {
        type: "link",
        league: true,
        path: genPath(["leaders"], season),
        text: "Leaders"
      }, {
        type: "link",
        league: true,
        path: genPath(["team_stats"], season),
        text: "Team Stats"
      }, {
        type: "link",
        league: true,
        path: genPath(["player_bios", "all"], season),
        text: "Player Bios"
      }, {
        type: "link",
        league: true,
        path: genPath(["player_stats", "all"], season),
        text: "Player Stats"
      }, {
        type: "link",
        league: true,
        path: genPath(["player_ratings", "all"], season),
        text: "Player Ratings"
      }]
    });
  }
  if (moreInfoAbbrev && moreInfoSeason !== undefined && moreInfoTid !== undefined) {
    menuItems.push({
      type: "header",
      long: "More Info",
      short: "More",
      league: true,
      children: [{
        type: "link",
        league: true,
        path: ["player_bios", `${moreInfoAbbrev}_${moreInfoTid}`, moreInfoSeason],
        text: "Player Bios"
      }, {
        type: "link",
        league: true,
        path: ["player_stats", `${moreInfoAbbrev}_${moreInfoTid}`, moreInfoSeason],
        text: "Player Stats"
      }, {
        type: "link",
        league: true,
        path: ["player_ratings", `${moreInfoAbbrev}_${moreInfoTid}`, moreInfoSeason],
        text: "Player Ratings"
      }]
    });
  }
  if (customMenu) {
    menuItems.push(customMenu);
  }
  return /*#__PURE__*/jsxRuntimeExports.jsxs("aside", {
    className: "navbar navbar-border navbar-light justify-content-start title-bar flex-shrink-0  py-0",
    children: [/*#__PURE__*/jsxRuntimeExports.jsxs("h1", {
      children: [title, !hideNewWindow ? /*#__PURE__*/jsxRuntimeExports.jsx(NewWindowLink, {}) : null]
    }), dropdownView && dropdownFields ? /*#__PURE__*/jsxRuntimeExports.jsx(Dropdown$1, {
      customURL: dropdownCustomURL,
      customOptions: dropdownCustomOptions,
      view: dropdownView,
      fields: dropdownFields
    }) : null, /*#__PURE__*/jsxRuntimeExports.jsx(DropdownLinks, {
      className: "ms-auto title-bar-right-links",
      hideTitle: true,
      inLeague: true,
      lid: lid,
      menuItems: menuItems
    })]
  });
};

const loadFramerMotionFeatures = () => import('./framerMotionFeatures-8fd28ad5.js').then(res => res.default);
const minHeight100 = {
  // Just using h-100 class here results in the sticky ad in the skyscraper becoming unstuck after scrolling down 100% of the viewport, for some reason
  minHeight: "100%"
};
const minWidth0 = {
  // Fix for responsive table not being triggered by flexbox limits, and skyscraper ad overflowing content https://stackoverflow.com/a/36247448/786644
  minWidth: 0
};
const KeepPreviousRenderWhileUpdating = /*#__PURE__*/reactExports.memo(props => {
  return props.children;
}, (prevProps, nextProps) => {
  // No point in rendering while updating contents
  return nextProps.updating;
});
const Controller = () => {
  const state = useViewData();
  const {
    popup,
    showNagModal
  } = useLocalPartial(["popup", "showNagModal"]);
  const closeNagModal = reactExports.useCallback(() => {
    localActions.update({
      showNagModal: false
    });
  }, []);
  reactExports.useEffect(() => {
    if (popup) {
      document.body.style.paddingTop = "0";
      const css = document.createElement("style");
      css.innerHTML = ".new_window { display: none }";
      document.body.appendChild(css);
    }
  }, [popup]);
  const {
    Component,
    data,
    idLoading,
    idLoaded,
    inLeague,
    loading: updating,
    scrollToTop
  } = state;

  // Optimistically use idLoading before it renders, for UI responsiveness in the sidebar
  const sidebarPageID = idLoading ?? idLoaded;
  const pathname = isSport("baseball") ? document.location.pathname : undefined;

  // Scroll to top if this load came from user clicking a link to a new page
  reactExports.useEffect(() => {
    if (scrollToTop) {
      window.scrollTo(window.pageXOffset, 0);
    }
  }, [idLoaded, scrollToTop]);
  return /*#__PURE__*/jsxRuntimeExports.jsxs(LazyMotion, {
    strict: true,
    features: loadFramerMotionFeatures,
    children: [/*#__PURE__*/jsxRuntimeExports.jsx(NavBar, {
      updating: updating
    }), /*#__PURE__*/jsxRuntimeExports.jsxs("div", {
      className: "h-100 d-flex",
      children: [/*#__PURE__*/jsxRuntimeExports.jsx(SideBar, {
        pageID: sidebarPageID,
        pathname: pathname
      }), /*#__PURE__*/jsxRuntimeExports.jsxs("div", {
        className: "h-100 w-100 d-flex flex-column",
        style: minWidth0,
        children: [/*#__PURE__*/jsxRuntimeExports.jsx(LeagueTopBar, {}), /*#__PURE__*/jsxRuntimeExports.jsx(TitleBar, {}), /*#__PURE__*/jsxRuntimeExports.jsxs("div", {
          className: "container-fluid position-relative mt-2 flex-grow-1 h-100",
          children: [/*#__PURE__*/jsxRuntimeExports.jsxs("div", {
            className: "d-flex",
            style: minHeight100,
            children: [/*#__PURE__*/jsxRuntimeExports.jsxs("div", {
              className: "w-100 d-flex flex-column",
              style: minWidth0,
              children: [/*#__PURE__*/jsxRuntimeExports.jsx(Header, {}), /*#__PURE__*/jsxRuntimeExports.jsx("main", {
                className: "p402_premium",
                children: /*#__PURE__*/jsxRuntimeExports.jsx("div", {
                  id: "actual-actual-content",
                  className: "clearfix",
                  children: /*#__PURE__*/jsxRuntimeExports.jsxs(ErrorBoundary, {
                    children: [Component ? /*#__PURE__*/jsxRuntimeExports.jsx(KeepPreviousRenderWhileUpdating, {
                      updating: updating,
                      children: /*#__PURE__*/jsxRuntimeExports.jsx(Component, {
                        ...data
                      })
                    }) : null, inLeague ? /*#__PURE__*/jsxRuntimeExports.jsx(MultiTeamMenu, {}) : null]
                  }, idLoaded)
                })
              }), /*#__PURE__*/jsxRuntimeExports.jsx(Footer, {})]
            }), /*#__PURE__*/jsxRuntimeExports.jsx(Skyscraper, {})]
          }), /*#__PURE__*/jsxRuntimeExports.jsx(ComandPaletteWrapper, {}), /*#__PURE__*/jsxRuntimeExports.jsx(NagModal, {
            close: closeNagModal,
            show: showNagModal
          })]
        })]
      })]
    }), /*#__PURE__*/jsxRuntimeExports.jsx(Notifications, {})]
  });
};

// Read from goldUntil rather than local because this is called before local is updated
const initAds = goldUntil => {
  let hideAds = false; // No ads for Gold members

  const currentTimestamp = Math.floor(Date.now() / 1000) - GRACE_PERIOD;
  if (goldUntil === undefined || currentTimestamp < goldUntil) {
    hideAds = true;
  }
  if (!hideAds) {
    // _disabled names are to hide from Blockthrough, so it doesn't leak through for Gold subscribers. Run this regardless of window.freestar, so Blockthrough can still work for some users.
    const divsAll = [AD_DIVS.mobile, AD_DIVS.leaderboard, AD_DIVS.rectangle1, AD_DIVS.rectangle2, AD_DIVS.rail];
    for (const id of divsAll) {
      const div = document.getElementById(`${id}_disabled`);
      if (div) {
        div.id = id;
      }
    }
    window.freestar.queue.push(() => {
      // Show hidden divs. skyscraper has its own code elsewhere to manage display.
      const divsMobile = [AD_DIVS.mobile];
      const divsDesktop = [AD_DIVS.leaderboard, AD_DIVS.rectangle1, AD_DIVS.rectangle2];
      const divs = window.mobile ? divsMobile : divsDesktop;
      for (const id of divs) {
        const div = document.getElementById(id);
        if (div) {
          div.style.removeProperty("display");
        }
      }

      // Special case for rail, to tell it there is no gold
      const rail = document.getElementById(AD_DIVS.rail);
      if (rail) {
        delete rail.dataset.gold;
        updateSkyscraperDisplay();
      }
      for (const id of divs) {
        window.freestar.config.enabled_slots.push({
          placementName: id,
          slotId: id
        });
      }
      if (divs.includes(AD_DIVS.mobile)) {
        localActions.update({
          stickyFooterAd: true
        });

        // Add margin to footer - do this manually rather than using stickyFooterAd so <Footer> does not have to re-render
        const footer = document.getElementById("main-footer");
        if (footer) {
          footer.style.paddingBottom = "52px";
        }

        // Hack to hopefully stop the Microsoft ad from breaking everything
        // Maybe this is breaking country tracking in Freestar, and maybe for direct ads too?
        window.googletag = window.googletag || {};
        window.googletag.cmd = window.googletag.cmd || [];
        window.googletag.cmd.push(() => {
          window.googletag.pubads().setForceSafeFrame(true);
          window.googletag.pubads().setSafeFrameConfig({
            allowOverlayExpansion: false,
            allowPushExpansion: false,
            sandbox: true
          });
        });
      }
      if (!window.mobile) {
        // Show the logo too
        const logo = document.getElementById("bbgm-ads-logo");
        if (logo) {
          logo.style.display = "flex";
        }
      }
    });
  }
};

// This does the opposite of initAds. To be called when a user subscribes to gold or logs in to an account with an active subscription
const initGold = () => {
  window.freestar.queue.push(() => {
    const divsAll = [AD_DIVS.mobile, AD_DIVS.leaderboard, AD_DIVS.rectangle1, AD_DIVS.rectangle2];
    for (const id of divsAll) {
      const div = document.getElementById(id);
      if (div) {
        div.style.display = "none";
      }
      window.freestar.deleteAdSlots(id);
    }

    // Special case for rail, to tell it there is no BBGM gold
    const rail = document.getElementById(AD_DIVS.rail);
    if (rail) {
      rail.dataset.gold = "true";
      updateSkyscraperDisplay();
    }
    localActions.update({
      stickyFooterAd: false
    });

    // Add margin to footer - do this manually rather than using stickyFooterAd so <Footer> does not have to re-render
    const footer = document.getElementById("main-footer");
    if (footer) {
      footer.style.marginBottom = "";
    }
    const logo = document.getElementById("bbgm-ads-logo");
    if (logo) {
      logo.style.display = "none";
    }

    // Rename to hide from Blockthrough
    for (const id of [...divsAll, AD_DIVS.rail]) {
      const div = document.getElementById(id);
      if (div) {
        div.id = `${id}_disabled`;
      }
    }
    console.log("initGold end", "display", document.getElementById("basketball-gm_mobile_leaderboard")?.style.display);
  });
};
const deleteGames = gids => {
  localActions.deleteGames(gids);
};
const mergeGames = games => {
  localActions.mergeGames(games);
};

// Should only be called from Shared Worker, to move other tabs to new league because only one can be open at a time
const newLid = async lid => {
  const parts = window.location.pathname.split("/");
  if (parts[1] === "l" && parseInt(parts[2]) !== lid) {
    parts[2] = String(lid);
    const newPathname = parts.join("/");
    await realtimeUpdate(["firstRun"], newPathname);
    localActions.update({
      lid
    });
  }
};
async function realtimeUpdate2(updateEvents = [], url, raw) {
  await realtimeUpdate(updateEvents, url, raw);
}
const resetLeague = () => {
  localActions.resetLeague();
};
const setGameAttributes = (gameAttributes, flagOverrides) => {
  localActions.updateGameAttributes(gameAttributes, flagOverrides);
};
const showEvent2 = options => {
  showEvent(options);
};
const showModal = () => {
  if (!window.enableLogging) {
    return;
  }

  // No ads for Gold members
  if (local$1.getState().gold !== false) {
    return;
  }

  // Max once/hour
  const date = new Date().toISOString().slice(0, 13);
  const lastDate = safeLocalStorage$1.getItem("lastDateShowModal");
  if (date === lastDate) {
    return;
  }
  safeLocalStorage$1.setItem("lastDateShowModal", date);
  const r = Math.random();
  const adBlock = !window.freestar.refreshAllSlots || !window.googletag || !window.googletag.pubads;
  if (adBlock && r < 0.1) {
    ads.showModal();
    return;
  }
  if (r < 0.01) {
    ads.showModal();
  }
};
const updateLocal = obj => {
  localActions.update(obj);
};
const updateTeamOvrs = ovrs => {
  const games = local$1.getState().games;

  // Find upcoming game, it's the only one that needs updating because it's the only one displayed in a ScoreBox in LeagueTopBar
  const gameIndex = games.findIndex(game => game.teams[0].pts === undefined);
  if (gameIndex >= 0) {
    const {
      teams
    } = games[gameIndex];
    if (teams[0].ovr !== ovrs[teams[0].tid] || teams[1].ovr !== ovrs[teams[1].tid]) {
      games[gameIndex] = {
        ...games[gameIndex]
      };
      teams[0].ovr = ovrs[teams[0].tid];
      teams[1].ovr = ovrs[teams[1].tid];
      localActions.update({
        games: games.slice()
      });
    }
  }
};
var api = {
  analyticsEvent: analyticsEvent$1,
  autoPlayDialog,
  confirm: confirm$1,
  confirmDeleteAllLeagues,
  deleteGames,
  initAds,
  initGold,
  mergeGames,
  newLid,
  realtimeUpdate: realtimeUpdate2,
  requestPersistentStorage,
  resetLeague,
  setGameAttributes,
  showEvent: showEvent2,
  showModal,
  updateLocal,
  updateTeamOvrs
};

window.bbgm = {
  api,
  ...util
};
const {
  analyticsEvent,
  compareVersions,
  confirm,
  genStaticPage,
  leagueNotFoundMessage,
  local,
  logEvent,
  routes,
  safeLocalStorage,
  toWorker,
  unregisterServiceWorkers
} = util;
const handleVersion = async () => {
  window.addEventListener("storage", e => {
    if (e.key === "bbgmVersionConflict") {
      const bbgmVersionStored = safeLocalStorage.getItem("bbgmVersion");
      if (bbgmVersionStored && compareVersions(bbgmVersionStored, window.bbgmVersion) === 1) {
        logEvent({
          type: "error",
          text: `A newer version of ${GAME_NAME} was just opened in another tab. Please reload this tab to load the same version here.`,
          saveToDb: false,
          persistent: true
        });
      }
    } else if (e.key === "theme") {
      if (window.themeCSSLink) {
        window.themeCSSLink.href = `/${window.getTheme()}.css`;
      }
    }
  });
  analyticsEvent("app_version", {
    app_version: window.bbgmVersion
  });
  window.withGoodUI?.();
  toWorker("main", "ping", undefined).then(() => {
    window.withGoodWorker?.();
  });

  // Check if there are other tabs open with a different version
  const bbgmVersionStored = safeLocalStorage.getItem("bbgmVersion");
  if (bbgmVersionStored) {
    const cmpResult = compareVersions(window.bbgmVersion, bbgmVersionStored);
    if (cmpResult === 1) {
      // This version is newer than another tab's - send a signal to the other tabs
      let conflictNum = parseInt(
      // @ts-expect-error
      safeLocalStorage.getItem("bbgmVersionConflict"));
      if (Number.isNaN(conflictNum)) {
        conflictNum = 1;
      } else {
        conflictNum += 1;
      }
      safeLocalStorage.setItem("bbgmVersion", window.bbgmVersion);
      safeLocalStorage.setItem("bbgmVersionConflict", String(conflictNum));
    } else if (cmpResult === -1) {
      // This version is older than another tab's
      console.log(window.bbgmVersion, bbgmVersionStored);
      console.log(`This version of ${GAME_NAME} (${window.bbgmVersion}) is older than one you already played (${bbgmVersionStored}). This should never happen, so please email ${EMAIL_ADDRESS} with any info about how this error occurred.`);

      // Don't block
      (async () => {
        let registrations = [];
        if (window.navigator.serviceWorker) {
          registrations = await window.navigator.serviceWorker.getRegistrations();
        }
        const getSWVersion = () => {
          return new Promise(resolve => {
            setTimeout(() => {
              resolve("???");
            }, 2000);
            const messageChannel = new MessageChannel();
            messageChannel.port1.onmessage = event => {
              resolve(event.data);
            };
            if (navigator.serviceWorker.controller) {
              navigator.serviceWorker.controller.postMessage("getSWVersion", [messageChannel.port2]);
            }
          });
        };
        const swVersion = await getSWVersion();
        console.log("swVersion", swVersion);
        Bugsnag.notify(new Error("Game version mismatch"), event => {
          event.addMetadata("custom", {
            bbgmVersion: window.bbgmVersion,
            bbgmVersionStored,
            hasNavigatorServiceWorker: window.navigator.serviceWorker !== undefined,
            registrationsLength: registrations.length,
            registrations: registrations.map(r => {
              return {
                scope: r.scope,
                active: r.active ? {
                  scriptURL: r.active.scriptURL,
                  state: r.active.state
                } : null,
                installing: r.installing ? {
                  scriptURL: r.installing.scriptURL,
                  state: r.installing.state
                } : null,
                waiting: r.waiting ? {
                  scriptURL: r.waiting.scriptURL,
                  state: r.waiting.state
                } : null
              };
            }),
            swVersion
          });
        });
        unregisterServiceWorkers();
      })();
    }
  } else {
    // Initial load, store version for future comparisons
    safeLocalStorage.setItem("bbgmVersion", window.bbgmVersion);
  }
};
const setupEnv = async () => {
  // Heartbeat, used to keep only one tab open at a time for browsers where we have to use a Web
  // Worker due to lack of Shared Worker support (currently just Safari). Uses sessionStorage
  // rather than a global variable to persist over page reloads, otherwise it'd be a race
  // condition to distinguish between reloading the page and opening it in two tabs.
  let heartbeatID = sessionStorage.getItem("heartbeatID");
  if (heartbeatID === null || heartbeatID === undefined) {
    heartbeatID = Math.random().toString(16).slice(2);
    sessionStorage.setItem("heartbeatID", heartbeatID);
  }
  const env = {
    enableLogging: window.enableLogging,
    heartbeatID,
    mobile: window.mobile,
    useSharedWorker: window.useSharedWorker
  };
  await toWorker("main", "init", env);
};
const render = () => {
  const container = document.getElementById("content");
  const root = createRoot(container);
  root.render( /*#__PURE__*/jsxRuntimeExports.jsx(ErrorBoundary, {
    children: /*#__PURE__*/jsxRuntimeExports.jsx(Controller, {})
  }));
};
const setupRoutes = () => {
  let initialLoad = true;
  router.start({
    routeMatched: async ({
      context
    }) => {
      if (!context.state.backendRedirect) {
        const liveGame = window.location.pathname.includes("/live_game") && !context.path.includes("/live_game") && local.getState().liveGameInProgress;
        const liveGameExhibition = window.location.pathname.includes("/exhibition/game") && !context.path.includes("/exhibition/game");
        if (liveGame || liveGameExhibition) {
          const proceed = await confirm(`If you navigate away from this page, you won't be able to see ${window.location.pathname.includes("/exhibition") ? "this box score" : "these play-by-play results"} again.`, {
            okText: "Navigate Away",
            cancelText: "Stay Here"
          });
          if (!proceed) {
            return false;
          }
        }

        // Checks for Settings (includes because of league ID in URL) and DefaultSettings
        if (window.location.pathname.includes("/settings") && !context.path.includes("/settings") || window.location.pathname === "/settings/default" && context.path !== "/settings/default") {
          const dirtySettings = local.getState().dirtySettings;
          if (dirtySettings) {
            const proceed = await confirm("Are you sure you want to discard your unsaved settings changes?", {
              okText: "Discard",
              cancelText: "Stay Here"
            });
            if (!proceed) {
              return false;
            }
            local.getState().actions.update({
              dirtySettings: false
            });
          }
        }
      }
      if (!context.state.noTrack) {
        if (window.enableLogging) {
          if (!initialLoad) {
            const pagePath = context.path.replace(/^\/l\/[0-9]+/, "/l/0");

            // https://developers.google.com/analytics/devguides/collection/gtagjs/pages
            analyticsEvent("page_view", {
              page_path: pagePath,
              // https://online-metrics.com/page-view-in-google-analytics-4/
              page_location: `${location.origin}${pagePath}`
            });

            // https://developers.google.com/analytics/devguides/collection/gtagjs/single-page-applications
            // gtag('set', 'page_path', pagePath);
            // gtag('event', 'page_view');

            /*// Prev, also similar to https://developers.google.com/analytics/devguides/collection/ga4/views?technology=websites - but did not work
            window.gtag("config", window.googleAnalyticsID, {
            	// Normalize league URLs to all look the same
            	page_path: pagePath,
            });*/

            /*if (window._qevents) {
            	window._qevents.push({
            		qacct: "p-Ye5RY6xC03ZWz",
            		event: "click",
            	});
            }*/
          }
        }

        if (!initialLoad) {
          if (window.freestar.refreshAllSlots) {
            window.freestar.queue.push(() => {
              window.freestar.refreshAllSlots();
            });
          }
        } else {
          initialLoad = false;
        }
      }
    },
    navigationEnd: ({
      context,
      error
    }) => {
      if (error) {
        let errMsg = error.message;
        if (errMsg === "Matching route not found") {
          errMsg = "Page not found.";
        } else if (errMsg === "League not found.") {
          errMsg = leagueNotFoundMessage;
        } else if (typeof errMsg !== "string" || !errMsg.includes("A league can only be open in one tab at a time")) {
          Bugsnag.notify(error);
          console.error("Error from view:");
          console.error(error);

          // As of 2019-07-20, these cover all IndexedDB version error messages in Chrome, Firefox, and Safari
          if (typeof errMsg === "string" && (errMsg.includes("requested version") || errMsg.includes("existing version") || errMsg.includes("higher version") || errMsg.includes("version requested") || errMsg.includes("lower version"))) {
            errMsg = /*#__PURE__*/jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
              children: [/*#__PURE__*/jsxRuntimeExports.jsx("p", {
                children: errMsg
              }), /*#__PURE__*/jsxRuntimeExports.jsxs("p", {
                children: ["Please", " ", /*#__PURE__*/jsxRuntimeExports.jsx("a", {
                  href: `https://${WEBSITE_ROOT}/manual/faq/#latest-version`,
                  rel: "noopener noreferrer",
                  target: "_blank",
                  children: "make sure you have the latest version of the game loaded"
                }), "."]
              })]
            });
            unregisterServiceWorkers();
          }
        }
        const ErrorPage = /*#__PURE__*/jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, {
          children: typeof errMsg === "string" ? /*#__PURE__*/jsxRuntimeExports.jsx("p", {
            children: errMsg
          }) : errMsg
        });
        const errorPage = genStaticPage("error", "Error", ErrorPage, false);
        errorPage(context);
      }
    },
    routes
  });
};
(async () => {
  promiseWorker.register(([name, ...params]) => {
    if (!Object.hasOwn(api, name)) {
      throw new Error(`API call to nonexistant UI function "${name}" with params ${JSON.stringify(params)}`);
    }

    // https://github.com/microsoft/TypeScript/issues/21732
    // @ts-expect-error
    return api[name](...params);
  });
  await handleVersion();
  await setupEnv();
  render();
  await setupRoutes();
  await import('./initServiceWorker-55a9919b.js');
})();
