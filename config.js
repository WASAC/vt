require('dotenv').config();

module.exports = {
    db: {
      user:process.env.db_user,
      password:process.env.db_password,
      host:process.env.db_host,
      port:process.env.db_port,
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
                        10 as minzoom
                    ) AS t
                  )) AS tippecanoe,
                  row_to_json((
                    SELECT p FROM (
                      SELECT
                        x.wss_id as id,
                        x.pipe_id,
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
                    x.wss_id as id, 
                    x.connection_id,
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
                    x.wss_id as id, 
                    x.chamber_id,
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
                    x.wss_id as id, 
                    x.watersource_id,
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
                    x.wss_id as id, 
                    x.reservoir_id,
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
                      x.wss_id as id, 
                      x.pumpingstation_id,
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
          pipeline_total as (
            SELECT 
              x.wss_id,
              round(SUM(x.pipe_length),2) || ' m' as pipe_length 
            FROM ( 
              SELECT
                pipeline.wss_id,
                cast(ST_LENGTH(ST_TRANSFORM(pipeline.geom, 32736)) as numeric) as pipe_length 
              FROM pipeline 
              INNER JOIN wss ON pipeline.wss_id = wss.wss_id
              ) x 
            GROUP BY
            x.wss_id
          ),
          pipeline_year as (
          SELECT
          z.wss_id,
          CASE WHEN z.pipe_length_lt_5_years IS NULL THEN '' ELSE '<=5year: ' || z.pipe_length_lt_5_years || E' m\n' END ||
          CASE WHEN z.pipe_length_lt_10_years IS NULL THEN '' ELSE '<=10year: ' || z.pipe_length_lt_10_years || E' m\n' END || 
          CASE WHEN z.pipe_length_lt_15_years IS NULL THEN '' ELSE '<=15year: ' || z.pipe_length_lt_15_years || E' m\n' END ||	 
          CASE WHEN z.pipe_length_lt_20_years IS NULL THEN '' ELSE '<=20year: ' || z.pipe_length_lt_20_years || E' m\n' END ||
          CASE WHEN z.pipe_length_gt_20_years IS NULL THEN '' ELSE 'over 20year: ' || z.pipe_length_gt_20_years || E' m\n' END ||
          CASE WHEN z.pipe_length_unknown_years IS NULL THEN '' ELSE 'Unknown: ' || z.pipe_length_unknown_years || E' m\n' END as pipe_length
          FROM(
            SELECT
              y.wss_id,
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
          ),
          pipeline_material as (
            SELECT
              z.wss_id,
              CASE WHEN z.ac IS NULL THEN '' ELSE 'AC: ' || z.ac || E' m\n' END ||
              CASE WHEN z.ci IS NULL THEN '' ELSE 'CI: ' || z.ci || E' m\n' END ||
              CASE WHEN z.di IS NULL THEN '' ELSE 'DI: ' || z.di || E' m\n' END || 
              CASE WHEN z.gs IS NULL THEN '' ELSE 'GS: ' || z.gs || E' m\n' END ||	 
              CASE WHEN z.hdpe IS NULL THEN '' ELSE 'HDPE: ' || z.hdpe || E' m\n' END ||	
              CASE WHEN z.pvc IS NULL THEN '' ELSE 'PVC: ' || z.pvc || E' m\n' END ||
              CASE WHEN z.unknown IS NULL THEN '' ELSE 'Unknown: ' || z.unknown || E' m\n' END as pipe_length
            FROM(
            SELECT
              y.wss_id,
              SUM(CASE WHEN y.material = 'AC' THEN round(pipe_length,2) END) as ac, 
              SUM(CASE WHEN y.material = 'CI' THEN round(pipe_length,2) END) as ci, 
              SUM(CASE WHEN y.material = 'DI' THEN round(pipe_length,2) END) as di, 
              SUM(CASE WHEN y.material = 'GS' THEN round(pipe_length,2) END) as gs, 
              SUM(CASE WHEN y.material = 'HDPE' THEN round(pipe_length,2) END) as hdpe, 
              SUM(CASE WHEN y.material = 'PVC' THEN round(pipe_length,2) END) as pvc, 
              SUM(CASE WHEN y.material IS NULL THEN round(pipe_length,2) END) as unknown
            FROM ( 
            SELECT 
              x.wss_id,
              x.material, 
              sum(cast(ST_LENGTH(ST_TRANSFORM(x.geom, 32736)) as numeric)) as pipe_length 
              FROM pipeline x
              INNER JOIN wss ON x.wss_id = wss.wss_id
              GROUP BY
              x.wss_id,
              x.material) y 
            GROUP BY
              y.wss_id
            )z
          ),
          pipeline_diameter as (
          SELECT
            z.wss_id,
            CASE WHEN z.lt_25 IS NULL THEN '' ELSE '<=DN25: ' || z.lt_25 || E' m\n' END ||
            CASE WHEN z.lt_50 IS NULL THEN '' ELSE '<=DN50: ' || z.lt_50 || E' m\n' END || 
            CASE WHEN z.lt_75 IS NULL THEN '' ELSE '<=DN75: ' || z.lt_75 || E' m\n' END ||	 
            CASE WHEN z.lt_110 IS NULL THEN '' ELSE '<=DN110: ' || z.lt_110 || E' m\n' END ||
            CASE WHEN z.lt_150 IS NULL THEN '' ELSE '<=DN150: ' || z.lt_150 || E' m\n' END ||
            CASE WHEN z.lt_200 IS NULL THEN '' ELSE '<=DN200: ' || z.lt_200 || E' m\n' END ||
            CASE WHEN z.lt_300 IS NULL THEN '' ELSE '<=DN300: ' || z.lt_300 || E' m\n' END ||
            CASE WHEN z.lt_400 IS NULL THEN '' ELSE '<=DN400: ' || z.lt_400 || E' m\n' END ||
            CASE WHEN z.lt_500 IS NULL THEN '' ELSE '<=DN500: ' || z.lt_500 || E' m\n' END ||
            CASE WHEN z.gt_500 IS NULL THEN '' ELSE '>DN500: ' || z.gt_500 || E' m\n' END ||
            CASE WHEN z.unknown IS NULL THEN '' ELSE 'Unknown: ' || z.unknown || E' m\n' END as pipe_length
          FROM(
            SELECT
              y.wss_id,
              SUM(CASE WHEN y.diameter BETWEEN 0 AND 25 THEN round(pipe_length,2) END) as lt_25, 
              SUM(CASE WHEN y.diameter BETWEEN 26 AND 50 THEN round(pipe_length,2) END) as lt_50, 
              SUM(CASE WHEN y.diameter BETWEEN 51 AND 75 THEN round(pipe_length,2) END) as lt_75,	 
              SUM(CASE WHEN y.diameter BETWEEN 76 AND 110 THEN round(pipe_length,2) END) as lt_110,
              SUM(CASE WHEN y.diameter BETWEEN 111 AND 150 THEN round(pipe_length,2) END) as lt_150,
              SUM(CASE WHEN y.diameter BETWEEN 151 AND 200 THEN round(pipe_length,2) END) as lt_200,
              SUM(CASE WHEN y.diameter BETWEEN 251 AND 300 THEN round(pipe_length,2) END) as lt_300,
              SUM(CASE WHEN y.diameter BETWEEN 301 AND 400 THEN round(pipe_length,2) END) as lt_400,
              SUM(CASE WHEN y.diameter BETWEEN 401 AND 500 THEN round(pipe_length,2) END) as lt_500,
              SUM(CASE WHEN y.diameter > 501 THEN round(pipe_length,2) END) as gt_500,
              SUM(CASE WHEN y.diameter IS NULL THEN round(pipe_length,2) END) as unknown
            FROM ( 
            SELECT 
              x.wss_id,
              x.diameter, 
              sum(x.pipe_length) as pipe_length 
              FROM ( 
              SELECT
                pipeline.wss_id,
                cast(pipeline.pipe_size as integer) as diameter,  
                cast(ST_LENGTH(ST_TRANSFORM(pipeline.geom, 32736)) as numeric) as pipe_length 
              FROM pipeline 
              INNER JOIN wss ON pipeline.wss_id = wss.wss_id
              ) x 
              GROUP BY
              x.wss_id,
              x.diameter) y 
            GROUP BY
              y.wss_id
            )z
          ),
          private_operator as (
              SELECT 
                a.wss_id,
                b.po_name
              FROM management a 
          LEFT JOIN private_operator b
          ON a.po_id = b.po_id
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
                  x.wss_id as id,
                  x.wss_id,
                  x.wss_name,  
                  x.wss_type,
                  private_operator.po_name as management,
                  x.status,
                  x.description,
                  household.no_household as household,
                  publictap.no_publictap as public_tap,
                  waterkiosk.no_waterkiosk as water_kiosk,
                  institution.no_institution as institution,
                  industrial.no_industrial as industrial,
                  other_connection.no_other_connection as other_connection,
                  valve_chamber.no_valve_chamber as valve_chamber,
                  air_release_chamber.no_air_release_chamber as air_release_chamber,
                  washout_chamber.no_washout_chamber as washout_chamber,
                  break_pressure_chamber.no_break_pressure_chamber as break_pressure_chamber,
                  prv_chamber.no_prv_chamber as prv_chamber,
                  starting_chamber.no_starting_chamber as starting_chamber,
                  collection_chamber.no_collection_chamber as collection_chamber,
                  pumping_station.no_pumping_station as pumping_station,
                  reservoir.no_reservoir as reservoir,
                  watersource.no_watersource as watersource,
                  pipeline_total.pipe_length as pipe_length_total,
                  pipeline_year.pipe_length as pipe_length_by_year,
                  pipeline_material.pipe_length as pipe_length_by_material,
                  pipeline_diameter.pipe_length as pipe_length_by_diameter
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
              LEFT JOIN pipeline_total ON x.wss_id = pipeline_total.wss_id
              LEFT JOIN pipeline_year ON x.wss_id = pipeline_year.wss_id
              LEFT JOIN pipeline_material ON x.wss_id = pipeline_material.wss_id
              LEFT JOIN pipeline_diameter ON x.wss_id = pipeline_diameter.wss_id
              LEFT JOIN private_operator ON x.wss_id = private_operator.wss_id
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
                  x.wss_type as id,
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
                  x.dist_id as id,
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
                  x.dist_id as id, 
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
                  x.sect_id as id,
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
                  x.sect_id as id, 
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
                  x.cell_id as id,
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
                  x.cell_id as id, 
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
                  x.vill_id as id,
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
                  x.vill_id as id, 
                  x.vill_id, 
                  x.village
                ) AS p
              )) AS properties
              FROM village x
              WHERE NOT ST_IsEmpty(x.geom)
            ) AS feature
          ) AS featurecollection
          `
        },
        {
          name: 'water_points',
          geojsonFileName: __dirname + '/water_points.geojson',
          select:`
          SELECT row_to_json(featurecollection) AS json FROM (
            SELECT
              'FeatureCollection' AS type,
              array_to_json(array_agg(feature)) AS features
            FROM (
              SELECT
              'Feature' AS type,
              ST_AsGeoJSON(ST_TRANSFORM(x.geom,4326))::json AS geometry,
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
                    x.id as id,
                    x.wsf_code, 
                    x.wsf_type, 
                    x.wsf_name, 
                    x.altitude, 
                    x.serv_area_villages, 
                    x.serv_popu_personals, 
                    x.serv_popu_households, 
                    x.type_water_source, 
                    x.no_water_source, 
                    x.hand_pump_type_name, 
                    x.year_construction, 
                    x.fund, 
                    a.status, 
                    x.observation
                ) AS p
              )) AS properties
              FROM waterfacilities x
              INNER JOIN status a ON x.status = a.code
              WHERE NOT ST_IsEmpty(x.geom)
            ) AS feature
          ) AS featurecollection
          `
        }
    ],
};
