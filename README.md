# CV

It is single web page site for hosted your CV.

## Install
> Before start you must have installed `node.js` (v4 or upper), `npm` and `gulp-cli`.

Clone this git repository:
```bash
$ git clone https://github.com/svelykodnyi/cv.git
```
Go to project directory and run `npm install`:
```bash
$ cd cv
$ npm install
```

## Use

### Task Watch

Clear up `app` folder, build application and run development server. Run it for development `watch`.

```bash
npm run watch
```

### Task Build

Clear up `build` folder, build application and run test server:

```bash
npm run build
```
### Task Deploy

Clear up `build` folder, build application and deploy your site.

```bash
npm run deploy
```

## Deploy

You need to create `.deploy-options.json` file, which contains next data:

```json
{
  "host": "your host name",
  "port": "ssh port, if need",
  "remotePath": "/path/to/your/site",
  "user": "ssh user name",
  "passphrase": "ssh password phrase"
}
```

Then run:

```bash
npm run deploy
```

If you need more options for sftp connection, see [gulp-sftp][gulp-sftp] description.

[gulp-sftp]:https://www.npmjs.com/package/gulp-sftp
