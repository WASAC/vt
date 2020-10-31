# upload2openafrica.py

## Usage

First of all, please register your `CKAN_API_KEY` at secrets of Github settings.

```
pipenv install 
pipenv shell

python upload2openafrica.py --key ${CKAN_API_KEY} --pkg {your package url} --title {your package title} --file {relative path} --desc {description for file}
```

## Example

```
python upload2openafrica.py \
--key ${CKAN_API_KEY} \
--pkg rw-water-vectortiles \
--title "Vector Tiles for rural water supply systems in Rwanda" \
--file ../data/rwss.mbtiles \
--desc "mbtiles format of Mapbox Vector Tiles which was created by tippecanoe."
```