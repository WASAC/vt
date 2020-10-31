#!/bin/bash

pipenv run python upload2openafrica.py \
  --key ${CKAN_API_KEY} \
  --pkg rw-water-vectortiles \
  --title "Vector Tiles for rural water supply systems in Rwanda" \
  --file ../data/rwss.mbtiles \
  --desc "mbtiles format of Mapbox Vector Tiles which was created by tippecanoe."