require('dotenv').config();

module.exports = {
    db: {
      user:process.env.db_user,
      password:process.env.db_password,
      host:process.env.db_host,
      post:process.env.db_port,
      database:'rwss_assets',
    },
    mbtiles: __dirname + '/data/rwss.mbtiles',
    minzoom: 8,
    maxzoom: 14,
    layers : [
        {
            name: 'pipeline',
            geojsonFileName: __dirname + '/pipeline.geojson',
            select: `
            SELECT row_to_json(featurecollection) AS json FROM (
              SELECT
                'FeatureCollection' AS type,
                array_to_json(array_agg(feature)) AS features
              FROM (
                SELECT
                  'Feature' AS type,
                  ST_AsGeoJSON(ST_MakeValid(x.geom))::json AS geometry,
                  row_to_json((
                    SELECT t FROM (
                      SELECT
                        14 as maxzoom,
                        11 as minzoom
                    ) AS t
                  )) AS tippecanoe,
                  row_to_json((
                    SELECT p FROM (
                      SELECT
                        x.pipe_id as fid,
                        x.material,
                        x.pipe_size,
                        x.pressure,
                        x.construction_year,
                        x.rehabilitation_year,
                        x.input_date
                    ) AS p
                  )) AS properties
                FROM pipeline x
                WHERE NOT ST_IsEmpty(x.geom)
              ) AS feature
            ) AS featurecollection
            `
        },
        {
          name: 'connection',
          geojsonFileName: __dirname + '/connection.geojson',
          select:`
          SELECT row_to_json(featurecollection) AS json FROM (
            SELECT
              'FeatureCollection' AS type,
              array_to_json(array_agg(feature)) AS features
            FROM (
              SELECT
              'Feature' AS type,
              ST_AsGeoJSON(x.geom)::json AS geometry,
              row_to_json((
                SELECT t FROM (
                  SELECT
                    14 as maxzoom,
                    14 as minzoom
                ) AS t
              )) AS tippecanoe,
              row_to_json((
                SELECT p FROM (
                  SELECT
                  	x.connection_id as fid, 
                    x.connection_type,
                    x.no_user, 
                    x.water_meter, 
                    a.status, 
                    x.observation, 
                    x.elevation, 
                    x.input_date, 
                    x.construction_year, 
                    x.rehabilitation_year
                ) AS p
              )) AS properties
              FROM water_connection x
              INNER JOIN status a
              ON x.status = a.code
              WHERE NOT ST_IsEmpty(x.geom)
            ) AS feature
          ) AS featurecollection
          `
        },
        {
          name: 'chamber',
          geojsonFileName: __dirname + '/chamber.geojson',
          select:`
          SELECT row_to_json(featurecollection) AS json FROM (
            SELECT
              'FeatureCollection' AS type,
              array_to_json(array_agg(feature)) AS features
            FROM (
              SELECT
              'Feature' AS type,
              ST_AsGeoJSON(x.geom)::json AS geometry,
              row_to_json((
                SELECT t FROM (
                  SELECT
                    14 as maxzoom,
                    14 as minzoom
                ) AS t
              )) AS tippecanoe,
              row_to_json((
                SELECT p FROM (
                  SELECT
                  	x.chamber_id as fid, 
                    x.chamber_type, 
                    x.chamber_size, 
                    x.material, 
                    a.status, 
                    x.observation, 
                    x.elevation, 
                    x.is_breakpressure, 
                    x.chlorination_unit, 
                    x.construction_year,
                    x.rehabilitation_year,
                    x.input_date
                ) AS p
              )) AS properties
              FROM chamber x
              INNER JOIN status a
              ON x.status = a.code
              WHERE NOT ST_IsEmpty(x.geom)
            ) AS feature
          ) AS featurecollection
          `
        },
        {
          name: 'watersource',
          geojsonFileName: __dirname + '/watersource.geojson',
          select:`
          SELECT row_to_json(featurecollection) AS json FROM (
            SELECT
              'FeatureCollection' AS type,
              array_to_json(array_agg(feature)) AS features
            FROM (
              SELECT
              'Feature' AS type,
              ST_AsGeoJSON(x.geom)::json AS geometry,
              row_to_json((
                SELECT t FROM (
                  SELECT
                    14 as maxzoom,
                    12 as minzoom
                ) AS t
              )) AS tippecanoe,
              row_to_json((
                SELECT p FROM (
                  SELECT
                  	x.watersource_id as fid, 
                    x.source_type, 
                    x.discharge,  
                    x.water_meter, 
                    a.status, 
                    x.observation, 
                    x.elevation, 
                    x.chlorination_unit, 
                    x.source_protected, 
                    x.construction_year,
                    x.rehabilitation_year,
                    x.input_date
                ) AS p
              )) AS properties
              FROM watersource x
              INNER JOIN status a
              ON x.status = a.code
              WHERE NOT ST_IsEmpty(x.geom)
            ) AS feature
          ) AS featurecollection
          `
        },
        {
          name: 'reservoir',
          geojsonFileName: __dirname + '/reservoir.geojson',
          select:`
          SELECT row_to_json(featurecollection) AS json FROM (
            SELECT
              'FeatureCollection' AS type,
              array_to_json(array_agg(feature)) AS features
            FROM (
              SELECT
              'Feature' AS type,
              ST_AsGeoJSON(x.geom)::json AS geometry,
              row_to_json((
                SELECT t FROM (
                  SELECT
                    14 as maxzoom,
                    12 as minzoom
                ) AS t
              )) AS tippecanoe,
              row_to_json((
                SELECT p FROM (
                  SELECT
                    x.reservoir_id as fid, 
                    x.reservoir_type,
                    x.capacity, 
                    x.material, 
                    x.water_meter, 
                    a.status, 
                    x.observation, 
                    x.elevation, 
                    x.is_breakpressure, 
                    x.meter_installation_date, 
                    x.chlorination_unit, 
                    x.construction_year, 
                    x.rehabilitation_year,
                    x.input_date
                ) AS p
              )) AS properties
              FROM reservoir x
              INNER JOIN status a
              ON x.status = a.code
              WHERE NOT ST_IsEmpty(x.geom) 
            ) AS feature
          ) AS featurecollection
          `
        },
        {
            name: 'pumping_station',
            geojsonFileName: __dirname + '/pumping_station.geojson',
            select:`
            SELECT row_to_json(featurecollection) AS json FROM (
              SELECT
                'FeatureCollection' AS type,
                array_to_json(array_agg(feature)) AS features
              FROM (
                SELECT
                'Feature' AS type,
                ST_AsGeoJSON(x.geom)::json AS geometry,
                row_to_json((
                  SELECT t FROM (
                    SELECT
                      14 as maxzoom,
                      12 as minzoom
                  ) AS t
                )) AS tippecanoe,
                row_to_json((
                  SELECT p FROM (
                    SELECT
                      x.pumpingstation_id as fid, 
                      a.status, 
                      x.head_pump, 
                      x.power_pump, 
                      x.discharge_pump, 
                      x.pump_type, 
                      x.power_source, 
                      x.no_pump, 
                      x.kva, 
                      x.no_generator, 
                      x.observation, 
                      x.elevation, 
                      x.pump_installation_date, 
                      x.meter_installation_date, 
                      x.capacity_antihummber, 
                      x.water_meter, 
                      x.chlorination_unit, 
                      x.installation_antihummer, 
                      x.construction_year, 
                      x.rehabilitation_year,
                      x.input_date
                  ) AS p
                )) AS properties
                FROM pumping_station x
                INNER JOIN status a
                ON x.status = a.code
                WHERE NOT ST_IsEmpty(x.geom)
              ) AS feature
            ) AS featurecollection
            `
        },
        // {
        //   name: 'parcels',
        //   geojsonFileName: __dirname + '/parcels.geojson',
        //   select:`
        //   SELECT row_to_json(featurecollection) AS json FROM (
        //     SELECT
        //       'FeatureCollection' AS type,
        //       array_to_json(array_agg(feature)) AS features
        //     FROM (
        //       SELECT
        //       'Feature' AS type,
        //       ST_AsGeoJSON(x.geom)::json AS geometry,
        //       row_to_json((
        //         SELECT t FROM (
        //           SELECT
        //             18 as maxzoom,
        //             16 as minzoom
        //         ) AS t
        //       )) AS tippecanoe,
        //       row_to_json((
        //         SELECT p FROM (
        //         SELECT
        //           x.fid,
        //           x."Parcel_ID" parcel_no
        //         ) AS p
        //       )) AS properties
        //       FROM parcels x
        //       WHERE NOT ST_IsEmpty(x.geom)
        //     ) AS feature
        //   ) AS featurecollection
        //   `
        // },
        // {
        //   name: 'parcels_annotation',
        //   geojsonFileName: __dirname + '/parcels_annotation.geojson',
        //   select:`
        //   SELECT row_to_json(featurecollection) AS json FROM (
        //     SELECT
        //       'FeatureCollection' AS type,
        //       array_to_json(array_agg(feature)) AS features
        //     FROM (
        //       SELECT
        //       'Feature' AS type,
        //       ST_AsGeoJSON(ST_CENTROID(geom))::json AS geometry,
        //       row_to_json((
        //         SELECT t FROM (
        //           SELECT
        //             18 as maxzoom,
        //             17 as minzoom
        //         ) AS t
        //       )) AS tippecanoe,
        //       row_to_json((
        //         SELECT p FROM (
        //         SELECT
        //           x.fid,
        //           x."Parcel_ID" parcel_no
        //         ) AS p
        //       )) AS properties
        //       FROM percels x
        //       WHERE NOT ST_IsEmpty(x.geom)
        //     ) AS feature
        //   ) AS featurecollection
        //   `
        // },
        {
          name: 'wss',
          geojsonFileName: __dirname + '/wss.geojson',
          select:`
          -- Water Connection Summary
          WITH household as(
          SELECT 
            a.wss_id,
            COUNT(*) as no_household
          FROM water_connection a
          WHERE a.connection_type = 'Household'
          GROUP BY a.wss_id
          ),
          publictap as (
          SELECT 
            a.wss_id,
            COUNT(*) as no_publictap
          FROM water_connection a
          WHERE a.connection_type = 'Public Tap'
          GROUP BY a.wss_id
          ),
          waterkiosk as (
          SELECT 
            a.wss_id,
            COUNT(*) as no_waterkiosk
          FROM water_connection a
          WHERE a.connection_type = 'Water Kiosk'
          GROUP BY a.wss_id
          ),
          institution as (
          SELECT 
            a.wss_id,
            COUNT(*) as no_institution
          FROM water_connection a
          WHERE a.connection_type = 'Institution'
          GROUP BY a.wss_id
          ),
          industrial as (
          SELECT 
            a.wss_id,
            COUNT(*) as no_industrial
          FROM water_connection a
          WHERE a.connection_type = 'Industrial'
          GROUP BY a.wss_id
          ),
          other_connection as (
          SELECT 
            a.wss_id,
            COUNT(*) as no_other_connection
          FROM water_connection a
          WHERE a.connection_type NOT IN ('Household', 'Public Tap', 'Water Kiosk', 'Industrial', 'Institution')
          GROUP BY a.wss_id
          ),
          -- Chamber Summary
          valve_chamber as (
          SELECT 
            a.wss_id,
            COUNT(*) as no_valve_chamber
          FROM chamber a
          WHERE a.chamber_type = 'Valve chamber'
          GROUP BY a.wss_id
          ),
          air_release_chamber as (
          SELECT 
            a.wss_id,
            COUNT(*) as no_air_release_chamber
          FROM chamber a
          WHERE a.chamber_type = 'Air release chamber'
          GROUP BY a.wss_id
          ),
          washout_chamber as(
          SELECT 
            a.wss_id,
            COUNT(*) as no_washout_chamber
          FROM chamber a
          WHERE a.chamber_type = 'Washout chamber'
          GROUP BY a.wss_id
          ),
          break_pressure_chamber as (
          SELECT 
            a.wss_id,
            COUNT(*) as no_break_pressure_chamber
          FROM chamber a
          WHERE a.chamber_type = 'Break Pressure chamber'
          GROUP BY a.wss_id
          ),
          prv_chamber as(
          SELECT 
            a.wss_id,
            COUNT(*) as no_prv_chamber
          FROM chamber a
          WHERE a.chamber_type = 'PRV chamber'
          GROUP BY a.wss_id
          ),
          starting_chamber as (
          SELECT 
            a.wss_id,
            COUNT(*) as no_starting_chamber
          FROM chamber a
          WHERE a.chamber_type = 'Starting chamber'
          GROUP BY a.wss_id
          ),
          collection_chamber as (
          SELECT 
            a.wss_id,
            COUNT(*) as no_collection_chamber
          FROM chamber a
          WHERE a.chamber_type = 'Collection chamber'
          GROUP BY a.wss_id
          ),
          pumping_station as (
          SELECT 
            a.wss_id,
            COUNT(*) as no_pumping_station
          FROM pumping_station a
          GROUP BY a.wss_id
          ),
          reservoir as (
          SELECT 
            a.wss_id,
            COUNT(*) as no_reservoir
          FROM reservoir a
          GROUP BY a.wss_id
          ),
          watersource as (
          SELECT 
            a.wss_id,
            COUNT(*) as no_watersource
          FROM watersource a 
          GROUP BY a.wss_id
          ),
          -- Pipeline Length
          pipeline as (
          SELECT
          z.wss_id,
          'Total: ' || CASE WHEN z.pipe_length_total IS NULL THEN 0 ELSE z.pipe_length_total END || E' m\n' ||
          '<5 years: ' || CASE WHEN z.pipe_length_lt_5_years IS NULL THEN 0 ELSE z.pipe_length_lt_5_years END || E' m\n' ||
          '<10 years: ' || CASE WHEN z.pipe_length_lt_10_years IS NULL THEN 0 ELSE z.pipe_length_lt_10_years END || E' m\n' || 
          '<15 years: ' || CASE WHEN z.pipe_length_lt_15_years IS NULL THEN 0 ELSE z.pipe_length_lt_15_years END || E' m\n' ||	 
          '<20 years: ' || CASE WHEN z.pipe_length_lt_20_years IS NULL THEN 0 ELSE z.pipe_length_lt_20_years END || E' m\n' ||
          '>=20 years: ' || CASE WHEN z.pipe_length_gt_20_years IS NULL THEN 0 ELSE z.pipe_length_gt_20_years END || E' m\n' ||
          'Unknown: ' || CASE WHEN z.pipe_length_unknown_years IS NULL THEN 0 ELSE z.pipe_length_unknown_years END || E' m\n' as pipe_length
          FROM(
            SELECT
              y.wss_id,
              round(SUM(pipe_length), 2) as pipe_length_total,
              SUM(CASE WHEN y.diff_const_year BETWEEN 0 AND 5 THEN round(pipe_length,2) END) as pipe_length_lt_5_years, 
              SUM(CASE WHEN y.diff_const_year BETWEEN 6 AND 10 THEN round(pipe_length,2) END) as pipe_length_lt_10_years, 
              SUM(CASE WHEN y.diff_const_year BETWEEN 11 AND 15 THEN round(pipe_length,2) END) as pipe_length_lt_15_years,	 
              SUM(CASE WHEN y.diff_const_year BETWEEN 16 AND 20 THEN round(pipe_length,2) END) as pipe_length_lt_20_years,	 
              SUM(CASE WHEN y.diff_const_year > 20 THEN round(pipe_length,2) END) as pipe_length_gt_20_years,
              SUM(CASE WHEN y.diff_const_year IS NULL THEN round(pipe_length,2) END) as pipe_length_unknown_years
            FROM ( 
            SELECT 
              x.wss_id,
              x.diff_const_year, 
              sum(x.pipe_length) as pipe_length 
              FROM ( 
              SELECT
                pipeline.wss_id,
                cast(pipeline.pipe_size as integer) as pipe_size,  
                cast(to_char(current_timestamp, 'YYYY') as integer) - COALESCE(pipeline.rehabilitation_year, pipeline.construction_year) as diff_const_year, 
                cast(ST_LENGTH(ST_TRANSFORM(pipeline.geom, 32736)) as numeric) as pipe_length 
              FROM pipeline 
              INNER JOIN wss ON pipeline.wss_id = wss.wss_id
              ) x 
              GROUP BY
              x.wss_id,
              x.diff_const_year) y 
            GROUP BY
              y.wss_id
            )z
          )
          -- main SQL
          SELECT row_to_json(featurecollection) AS json FROM (
            SELECT
              'FeatureCollection' AS type,
              array_to_json(array_agg(feature)) AS features
            FROM (
              SELECT
              'Feature' AS type,
              ST_AsGeoJSON(x.geom)::json AS geometry,
              row_to_json((
                SELECT t FROM (
                  SELECT
                    14 as maxzoom,
                    9 as minzoom
                ) AS t
              )) AS tippecanoe,
              row_to_json((
                SELECT p FROM (
                SELECT
                  x.wss_id,
                  x.wss_name,  
                  x.wss_type,
                  x.status,
                  x.description,
                  household.no_household,
                  publictap.no_publictap,
                  waterkiosk.no_waterkiosk,
                  institution.no_institution,
                  industrial.no_industrial,
                  other_connection.no_other_connection,
                  valve_chamber.no_valve_chamber,
                  air_release_chamber.no_air_release_chamber,
                  washout_chamber.no_washout_chamber,
                  break_pressure_chamber.no_break_pressure_chamber,
                  prv_chamber.no_prv_chamber,
                  starting_chamber.no_starting_chamber,
                  collection_chamber.no_collection_chamber,
                  pumping_station.no_pumping_station,
                  reservoir.no_reservoir,
                  watersource.no_watersource,
                  pipeline.pipe_length
                ) AS p
              )) AS properties
              FROM wss x
              LEFT JOIN household ON x.wss_id = household.wss_id
              LEFT JOIN publictap ON x.wss_id = publictap.wss_id
              LEFT JOIN waterkiosk ON x.wss_id = waterkiosk.wss_id
              LEFT JOIN institution ON x.wss_id = institution.wss_id
              LEFT JOIN industrial ON x.wss_id = industrial.wss_id
              LEFT JOIN other_connection ON x.wss_id = other_connection.wss_id
              LEFT JOIN valve_chamber ON x.wss_id = valve_chamber.wss_id
              LEFT JOIN air_release_chamber ON x.wss_id = air_release_chamber.wss_id
              LEFT JOIN washout_chamber ON x.wss_id = washout_chamber.wss_id
              LEFT JOIN break_pressure_chamber ON x.wss_id = break_pressure_chamber.wss_id
              LEFT JOIN prv_chamber ON x.wss_id = prv_chamber.wss_id
              LEFT JOIN starting_chamber ON x.wss_id = starting_chamber.wss_id
              LEFT JOIN collection_chamber ON x.wss_id = collection_chamber.wss_id
              LEFT JOIN pumping_station ON x.wss_id = pumping_station.wss_id
              LEFT JOIN reservoir ON x.wss_id = reservoir.wss_id
              LEFT JOIN watersource ON x.wss_id = watersource.wss_id
              LEFT JOIN pipeline ON x.wss_id = pipeline.wss_id
              WHERE NOT ST_IsEmpty(x.geom)
            ) AS feature
          ) AS featurecollection
          `
        },
        {
          name: 'wss_annotation',
          geojsonFileName: __dirname + '/wss_annotation.geojson',
          select:`
          SELECT row_to_json(featurecollection) AS json FROM (
            SELECT
              'FeatureCollection' AS type,
              array_to_json(array_agg(feature)) AS features
            FROM (
              SELECT
              'Feature' AS type,
              ST_AsGeoJSON(ST_CENTROID(geom))::json AS geometry,
              row_to_json((
                SELECT t FROM (
                  SELECT
                    14 as maxzoom,
                    11 as minzoom
                ) AS t
              )) AS tippecanoe,
              row_to_json((
                SELECT p FROM (
                SELECT
                  x.wss_id, 
                  x.wss_name
                ) AS p
              )) AS properties
              FROM wss x
              WHERE NOT ST_IsEmpty(x.geom)
            ) AS feature
          ) AS featurecollection
          `
        },
        {
          name: 'district',
          geojsonFileName: __dirname + '/district.geojson',
          select:`
          SELECT row_to_json(featurecollection) AS json FROM (
            SELECT
              'FeatureCollection' AS type,
              array_to_json(array_agg(feature)) AS features
            FROM (
              SELECT
              'Feature' AS type,
              ST_AsGeoJSON(x.geom)::json AS geometry,
              row_to_json((
                SELECT t FROM (
                  SELECT
                    14 as maxzoom,
                    8 as minzoom
                ) AS t
              )) AS tippecanoe,
              row_to_json((
                SELECT p FROM (
                SELECT
                  x.dist_id
                ) AS p
              )) AS properties
              FROM district x
              WHERE NOT ST_IsEmpty(x.geom)
            ) AS feature
          ) AS featurecollection
          `
        },
        {
          name: 'district_annotation',
          geojsonFileName: __dirname + '/district_annotation.geojson',
          select:`
          SELECT row_to_json(featurecollection) AS json FROM (
            SELECT
              'FeatureCollection' AS type,
              array_to_json(array_agg(feature)) AS features
            FROM (
              SELECT
              'Feature' AS type,
              ST_AsGeoJSON(ST_CENTROID(geom))::json AS geometry,
              row_to_json((
                SELECT t FROM (
                  SELECT
                    11 as maxzoom,
                    8 as minzoom
                ) AS t
              )) AS tippecanoe,
              row_to_json((
                SELECT p FROM (
                SELECT
                  x.dist_id, 
                  x.district
                ) AS p
              )) AS properties
              FROM district x
              WHERE NOT ST_IsEmpty(x.geom)
            ) AS feature
          ) AS featurecollection
          `
        },
        {
          name: 'sector',
          geojsonFileName: __dirname + '/sector.geojson',
          select:`
          SELECT row_to_json(featurecollection) AS json FROM (
            SELECT
              'FeatureCollection' AS type,
              array_to_json(array_agg(feature)) AS features
            FROM (
              SELECT
              'Feature' AS type,
              ST_AsGeoJSON(x.geom)::json AS geometry,
              row_to_json((
                SELECT t FROM (
                  SELECT
                    14 as maxzoom,
                    10 as minzoom
                ) AS t
              )) AS tippecanoe,
              row_to_json((
                SELECT p FROM (
                SELECT
                  x.sect_id
                ) AS p
              )) AS properties
              FROM sector x
              WHERE NOT ST_IsEmpty(x.geom)
            ) AS feature
          ) AS featurecollection
          `
        },
        {
          name: 'sector_annotation',
          geojsonFileName: __dirname + '/sector_annotation.geojson',
          select:`
          SELECT row_to_json(featurecollection) AS json FROM (
            SELECT
              'FeatureCollection' AS type,
              array_to_json(array_agg(feature)) AS features
            FROM (
              SELECT
              'Feature' AS type,
              ST_AsGeoJSON(ST_CENTROID(geom))::json AS geometry,
              row_to_json((
                SELECT t FROM (
                  SELECT
                    14 as maxzoom,
                    10 as minzoom
                ) AS t
              )) AS tippecanoe,
              row_to_json((
                SELECT p FROM (
                SELECT
                  x.sect_id, 
                  x.sector
                ) AS p
              )) AS properties
              FROM sector x
              WHERE NOT ST_IsEmpty(x.geom)
            ) AS feature
          ) AS featurecollection
          `
        },
        {
          name: 'cell',
          geojsonFileName: __dirname + '/cell.geojson',
          select:`
          SELECT row_to_json(featurecollection) AS json FROM (
            SELECT
              'FeatureCollection' AS type,
              array_to_json(array_agg(feature)) AS features
            FROM (
              SELECT
              'Feature' AS type,
              ST_AsGeoJSON(x.geom)::json AS geometry,
              row_to_json((
                SELECT t FROM (
                  SELECT
                    14 as maxzoom,
                    13 as minzoom
                ) AS t
              )) AS tippecanoe,
              row_to_json((
                SELECT p FROM (
                SELECT
                  x.cell_id
                ) AS p
              )) AS properties
              FROM cell x
              WHERE NOT ST_IsEmpty(x.geom)
            ) AS feature
          ) AS featurecollection
          `
        },
        {
          name: 'cell_annotation',
          geojsonFileName: __dirname + '/cell_annotation.geojson',
          select:`
          SELECT row_to_json(featurecollection) AS json FROM (
            SELECT
              'FeatureCollection' AS type,
              array_to_json(array_agg(feature)) AS features
            FROM (
              SELECT
              'Feature' AS type,
              ST_AsGeoJSON(ST_CENTROID(geom))::json AS geometry,
              row_to_json((
                SELECT t FROM (
                  SELECT
                    14 as maxzoom,
                    13 as minzoom
                ) AS t
              )) AS tippecanoe,
              row_to_json((
                SELECT p FROM (
                SELECT
                  x.cell_id, 
                  x.cell
                ) AS p
              )) AS properties
              FROM cell x
              WHERE NOT ST_IsEmpty(x.geom)
            ) AS feature
          ) AS featurecollection
          `
        },
        {
          name: 'village',
          geojsonFileName: __dirname + '/village.geojson',
          select:`
          SELECT row_to_json(featurecollection) AS json FROM (
            SELECT
              'FeatureCollection' AS type,
              array_to_json(array_agg(feature)) AS features
            FROM (
              SELECT
              'Feature' AS type,
              ST_AsGeoJSON(x.geom)::json AS geometry,
              row_to_json((
                SELECT t FROM (
                  SELECT
                    14 as maxzoom,
                    14 as minzoom
                ) AS t
              )) AS tippecanoe,
              row_to_json((
                SELECT p FROM (
                SELECT
                  x.vill_id
                ) AS p
              )) AS properties
              FROM village x
              WHERE NOT ST_IsEmpty(x.geom)
            ) AS feature
          ) AS featurecollection
          `
        },
        {
          name: 'village_annotation',
          geojsonFileName: __dirname + '/village_annotation.geojson',
          select:`
          SELECT row_to_json(featurecollection) AS json FROM (
            SELECT
              'FeatureCollection' AS type,
              array_to_json(array_agg(feature)) AS features
            FROM (
              SELECT
              'Feature' AS type,
              ST_AsGeoJSON(ST_CENTROID(geom))::json AS geometry,
              row_to_json((
                SELECT t FROM (
                  SELECT
                    14 as maxzoom,
                    14 as minzoom
                ) AS t
              )) AS tippecanoe,
              row_to_json((
                SELECT p FROM (
                SELECT
                  x.vill_id, 
                  x.village
                ) AS p
              )) AS properties
              FROM village x
              WHERE NOT ST_IsEmpty(x.geom)
            ) AS feature
          ) AS featurecollection
          `
        }
    ],
};
