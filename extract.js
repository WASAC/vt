const {Mbtiles2Pbf, FileExtension} = require('@watergis/mbtiles2pbf');

const config = require('./config-extract');

const extract = async() =>{
    console.time('mbtiles2pbf');
    const mb2pbf = new Mbtiles2Pbf(config.mbtiles, config.ghpages.tiles, FileExtension.MVT);
    const no_tiles = await mb2pbf.run();
    console.log(`${no_tiles} tiles were extracted under ${config.ghpages.tiles}`);
    console.timeEnd('mbtiles2pbf');
};

module.exports = extract();