# vt
![GitHub](https://img.shields.io/github/license/wasac/vt)
![Docker Cloud Automated build](https://img.shields.io/docker/cloud/automated/wasac/vt)
![Docker Image Size (latest by date)](https://img.shields.io/docker/image-size/wasac/vt)

This is to manage vectortiles for WASAC in Github pages.

## Configuration
All the settings are in `config.js` and `config-search.js`, so please make sure your own settings on this file before producing vector tile.

Please put environment variable for database settings.
```
db_user=$db_user
db_password=$db_password
db_host=host.docker.internal
db_post=5432
```

## Create mbtiles
### Usage (Docker)

```
db_user=your user db_password=your password docker-compose up
```

Your mbtiles will be generated under `data` directory.

### Usage (Nodejs)

#### Requirements

This module uses [`tippecanoe`](https://github.com/mapbox/tippecanoe) to convert geojson files to mbtiles. Please make sure to install it before running.

for MacOS
```
$ brew install tippecanoe
```

for Ubuntu
```
$ git clone https://github.com/mapbox/tippecanoe.git
$ cd tippecanoe
$ make -j
$ make install
```

Then,

```
$ npm install

$ db_user=$db_user \
  db_password=$db_password \
  db_host=localhost \
  db_port=5432 \
  npm run create
```

There will be two files as follows.
- ./data/rwss.mbtile
- ./public/wss.geojson

## Extract pbf (mvt) tiles from mbtiles file
please configure `config-extact.js` file to adjust output directory path and input mbtiles path.

```
npm run extract
```

There will be vectortiles under `./public/tiles` directory.

## Deploy

```
npm run deploy
```

It will publish all the files under `public` directory to Github Pages.

# Using Github Action

We can use Github Action for `npm run extract` and `npm run deploy` process.

So, you can just push `data/rwss.mbtiles` and `public/wss.geojson` to master repository.