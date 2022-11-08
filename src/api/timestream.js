/** *******************************************************************************************************************
  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
  
  Licensed under the Apache License, Version 2.0 (the "License").
  You may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  
      http://www.apache.org/licenses/LICENSE-2.0
  
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.                                                                              
 ******************************************************************************************************************** */

import { TimestreamQueryClient as Tsquery } from '@aws-sdk/client-timestream-query'
import { TimestreamWriteClient as Tswrite } from '@aws-sdk/client-timestream-write'
import * as h from '../helpers/index'

let tsw = null
let tsq = null

const getConfiguration = () => {
  if (!tsw) return {}

  const { region } = tsw.config

  return new Promise((resolve) => {
    tsw.config.getCredentials((err, res) => {
      if (err || !res) {
        resolve({
          region,
          accessKeyId: null,
          secretAccessKey: null,
        })
        return
      }

      const { accessKeyId, secretAccessKey } = res

      resolve({
        region,
        accessKeyId,
        secretAccessKey,
      })
    })
  })
}

const setConfiguration = (region, accessKeyId, secretAccessKey) => {
  tsw = new Tswrite({
    region,
    accessKeyId,
    secretAccessKey,
  })

  tsq = new Tsquery({
    region,
    accessKeyId,
    secretAccessKey,
  })
}

const listDatabases = () => tsw.listDatabases().promise()
const listTables = (db) =>
  tsw
    .listTables({
      DatabaseName: db,
      // todo: does not support pagination
      MaxResults: 20,
    })
    .promise()

const isInitialised = () => tsw !== null

const getMeasures = (db, table) => {
  return tsq
    .query({
      QueryString: `SHOW MEASURES IN "${db}"."${table}"`,
    })
    .promise()
}

const describeTable = (db, table) => {
  return tsq
    .query({
      QueryString: `DESCRIBE "${db}"."${table}"`,
    })
    .promise()
}

const query = async (
  db,
  table,
  { interval, measures, groupInterval, groupAggregation, filters }
) => {
  const conditions = (filters || []).filter(
    (q) => q.dimention && q.operator && q.value
  )

  const q = `
  SELECT 
    ${groupInterval ? `bin(time, ${groupInterval}) as time` : 'time'},
    ${measures
      .map(
        (p) =>
          `${groupInterval ? groupAggregation : ''}(CASE WHEN measure_name = '${
            p.name
          }' THEN measure_value::${p.type} ELSE NULL END) as ${h.cleanName(
            p.name
          )}`
      )
      .join(', ')}
FROM "${db}"."${table}"
WHERE time >= ago(${interval})
AND measure_name IN (${measures.map((p) => `'${p.name}'`).join(',')})
${conditions.length > 0 ? 'AND' : ''}
${conditions
  .map(
    (f) =>
      `${f.dimention.name} ${f.operator} ${h.convertValue(
        f.dimention.type,
        f.value
      )}`
  )
  .join(' AND ')}
${groupInterval ? `GROUP BY bin(time, ${groupInterval})` : ''}
ORDER BY time DESC
`

  return {
    query: q,
    result: await tsq.query({ QueryString: q }).promise(),
  }
}

const rawQuery = (q) => tsq.query({ QueryString: q }).promise()

// eslint-disable-next-line
export default {
  getConfiguration,
  setConfiguration,
  isInitialised,
  listDatabases,
  listTables,
  getMeasures,
  describeTable,
  query,
  rawQuery,
}
