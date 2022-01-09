/*!
 * vite-plugin-posthtml v0.0.3
 * Copyright (c) 2021 chromeos.
 * Licensed under Apache License 2.0 (https://github.com/chromeos/static-site-scaffold-modules/blob/main/LICENSE)
 */
// const posthtml = require('posthtml');
// const { PerformanceObserver, performance } = require('perf_hooks');
import posthtml from 'posthtml';
import { PerformanceObserver, performance } from 'perf_hooks';

/**
 *
 * @param {Object} opts Options for the plugin
 * @param {Function[]} [opts.plugins] PostHTML plugins to use
 * @param {Function} [opts.posthtml] PostHTML instance to use
 * @param {Object} [opts.options] PostHTML options. Will always run in asynchronous mode
 * @return {Object} Vite plugin
 */
export const posthtmlPlugin = (opts = {}) => {
  const { options, plugins, renderer } = Object.assign(
    {
      renderer: posthtml,
      options: {},
      plugins: [],
    },
    opts,
  );
  options.sync = false;

  const observer = new PerformanceObserver((items) => {
    const entries = items.getEntries();
    const total = entries.find((i) => i.name === 'duration');
    if (total.duration > 250) {
      console.error(`PostHTML took ${Math.round(total.duration)}ms to run`);
    }

    performance.clearMarks();
  });
  observer.observe({ entryTypes: ['measure'] });

  return {
    name: 'posthtml',
    enforece: 'post',

    async transformIndexHtml(input) {
      performance.mark('start');
      const { html } = await renderer(plugins || []).process(input, options || {});
      performance.measure('duration', 'start');
      return html;
    },
  };
};
