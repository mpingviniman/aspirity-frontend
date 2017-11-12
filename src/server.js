import Koa from 'koa';
import React from 'react';
import ReactDom from 'react-dom/server';
import Router from 'koa-router';
import App from './app/components/app';
import serve from 'koa-static';
import favicon from 'koa-favicon';
import logger from 'koa-logger';
import path from 'path';
import { SheetsRegistry } from 'react-jss/lib/jss';
import JssProvider from 'react-jss/lib/JssProvider';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { create } from 'jss';
import createGenerateClassName from 'material-ui/styles/createGenerateClassName';
import preset from 'jss-preset-default';
import fetchTodos from '../src/app/utils';
const app = new Koa();
const posts = new Router();

app.use(logger());
app.use(favicon(path.resolve(__dirname, './public/favicon.ico')));
app.use(serve(path.resolve(__dirname, './public')));
posts.get('/', async(ctx, next) => {
  ctx.body = await renderHTML();
});
app.use(posts.routes());

async function renderHTML() {
  const sheetsRegistry = new SheetsRegistry();
  const theme = createMuiTheme();
  const jss = create(preset());
  jss.options.createGenerateClassName = createGenerateClassName;
  let todos = await fetchTodos();
  const html = ReactDom.renderToString(
    <JssProvider registry={sheetsRegistry} jss={jss}>
      <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
        <App items={todos} />
      </MuiThemeProvider>
    </JssProvider>
  );
  const css = sheetsRegistry.toString();
  return `
    <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Hello React</title>
          <link rel="stylesheet" href="app.bundle.css">
          <!-- Yandex.Metrika counter -->
<script type="text/javascript" >
    (function (d, w, c) {
        (w[c] = w[c] || []).push(function() {
            try {
                w.yaCounter46613898 = new Ya.Metrika({
                    id:46613898,
                    clickmap:true,
                    trackLinks:true,
                    accurateTrackBounce:true
                });
            } catch(e) { }
        });

        var n = d.getElementsByTagName("script")[0],
            s = d.createElement("script"),
            f = function () { n.parentNode.insertBefore(s, n); };
        s.type = "text/javascript";
        s.async = true;
        s.src = "https://mc.yandex.ru/metrika/watch.js";

        if (w.opera == "[object Opera]") {
            d.addEventListener("DOMContentLoaded", f, false);
        } else { f(); }
    })(document, window, "yandex_metrika_callbacks");
</script>
<noscript><div><img src="https://mc.yandex.ru/watch/46613898" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
<!-- /Yandex.Metrika counter -->
      </head>
      <body>
        <div id="app">${html}</div>
        <script type="application/javascript" src="vendor.bundle.js"></script>
        <script type="application/javascript" src="app.bundle.js"></script>
        <style id="jss-server-side">${css}</style>
      </body>
    </html>
  `;
}

app.listen(3000);

export default app;
