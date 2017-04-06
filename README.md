# Lionshare Desktop

[![Travis][build-badge]][build]
[![Coveralls][coveralls-badge]][coveralls]

[build-badge]: https://img.shields.io/travis/dearfrankg/lionshare-desktop/master.png?style=flat-square
[build]: https://travis-ci.org/dearfrankg/lionshare-desktop

[coveralls-badge]: https://img.shields.io/coveralls/dearfrankg/lionshare-desktop/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/dearfrankg/lionshare-desktop


Lionshare is an open source project created by [Ben Jennings](https://twitter.com/benjennin_gs), [Jori Lallo](https://twitter.com/jorilallo) and [Maksim Stepanenko](https://twitter.com/maksim_s).

Lionshare is a simple macOS application that helps you track cryptocurrencies and
your portfolio.

The application consists of two parts, the api and the desktop app.

- Official [lionshare app](https://github.com/lionsharecapital)

- My Fork [lionshare-api](https://goo.gl/5SDuh5) and [lionshare-desktop](https://goo.gl/0QRnK9)


### Development

Running the development version will provide hot-module reloading.

To run development application:

```
yarn
yarn run dev
```

### Production

The production application is a double-clickable macOS app:

```
yarn
yarn run dist
// find the app in the dist folder and double-click
```
