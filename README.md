This is just repeating the bug report from https://github.com/rollup/rollup/issues/4840

---

I noticed a bug in my application when upgrading from Rollup 3.7.1 to 3.7.2, which still persist with the latest version of Rollup, and I've finally gotten around to investigating. I suspect the bug is caused by the new chunk generation stuff in 3.7.2 from #4736 but that PR is beyond me, so all I have is an example of the problem.

This comes from a big old application. I've reduced it as much as I can in this repo https://github.com/zengm-games/rollup-3.7.2-chunk-bug/ but it seems it needs to remain fairly large and with multiple dynamic imports or the bug goes away, so I'm not sure if I can reduce it more. But the important parts are only a few lines of code.

I have a build script https://github.com/zengm-games/rollup-3.7.2-chunk-bug/blob/master/tools/build.mjs that calls rollup once on one input file, with a few normal plugins (babel, json, commonjs, node-resolve).

The input file is https://github.com/zengm-games/rollup-3.7.2-chunk-bug/blob/master/src/ui/index.tsx and I think the only important part of that file is the first line:

    import "../common/polyfills.ts";

That imports some polyfills that I want to run before any other code, which AFAIK is what should happen for an import on the first line of the bundle's entry point. And prior to Rollup 3.7.2, that's what happened. But with 3.7.2, it no longer works that way.

[3.7.1 build output](https://github.com/zengm-games/rollup-3.7.2-chunk-bug/tree/master/build-3.7.1) - notice the large "bundle.js" file that includes my polyfills at the top, and dynamically imports a few other smaller modules.

[3.7.2 build output](https://github.com/zengm-games/rollup-3.7.2-chunk-bug/tree/master/build-3.7.2) - notice the much smaller "bundle.js" file that includes my polyfills *below* some other imports from another chunk, and most of the code in 3.7.1's bundle.js is now in that other chunk.

(Those folders build-3.7.1 and build-3.7.2 come from running `yarn build` with those two different versions of Rollup installed, I have just committed those two build outputs to this repo for convenience.)

So with 3.7.2, now I have tons of my application code being executed before my polyfills, leading to errors for users in older browsers.

I feel like I'm probably doing something wrong, since Rollup is so widely used somebody else would have hit a bug like this, since it could cause problems with any imports with side effects. But maybe I'm just hitting a weird edge case, since the issue seems to go away if I start deleting stuff from my code, and then I wind up with 3.7.1 and 3.7.2 producing similar output.
