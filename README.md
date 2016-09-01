# CV

### Task Watch
Clear up `app` folder, build application and run server:
```bash
npm run watch
```

### Task Build
Clear up `build` folder, build application and run server:
```bash
npm run build
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
