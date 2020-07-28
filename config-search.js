require('dotenv').config();

module.exports = {
    db: {
      user:process.env.db_user,
      password:process.env.db_password,
      host:process.env.db_host,
      post:process.env.db_port,
      database:'rwss_assets',
    },
    layers : [
        {
          name: 'wss',
          geojsonFileName: __dirname + '/public/wss.geojson',
          select:`
          SELECT row_to_json(featurecollection) AS json FROM (
            SELECT
              'FeatureCollection' AS type,
              array_to_json(array_agg(feature)) AS features
            FROM (
              SELECT
              'Feature' AS type,
              ST_AsGeoJSON(ST_CENTROID(x.geom))::json AS geometry,
              row_to_json((
                SELECT p FROM (
                  SELECT
                  x.wss_id, 
                  x.wss_name, 
                  a.district,
                  c.po_name
                ) AS p
              )) AS properties
              FROM wss x
              INNER JOIN district a
              ON x.dist_id = a.dist_id
              LEFT JOIN management b
              ON x.wss_id = b.wss_id
              INNER JOIN private_operator c
              ON b.po_id = c.po_id
              WHERE NOT ST_IsEmpty(x.geom)
            ) AS feature
          ) AS featurecollection
          `
        },
    ],
};
