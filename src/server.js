import Koa from 'koa';
import React from 'react';
import ReactDom from 'react-dom/server';
import Router from 'koa-router';
import App from './app/components/app';
import { green, red } from 'material-ui/colors';
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
posts.get('/', async(ctx, next) => {
  ctx.body = await renderHTML();
});
app.use(logger());
app.use(favicon(path.resolve(__dirname, '/public/favicon.ico')));
app.use(serve(path.resolve(__dirname, '/public')));
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
      </head>
      <body>
        <div id="app">${html}</div>
        <script type="application/javascript" src="vendor.bundle.js.gz"></script>
        <script type="application/javascript" src="app.bundle.js.gz"></script>
        <style id="jss-server-side">${css}</style>
      </body>
    </html>
  `;
}

app.listen(3000);

export default app;
