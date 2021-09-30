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

import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Box from 'aws-northstar/layouts/Box'
import ColumnLayour, { Column } from 'aws-northstar/layouts/ColumnLayout'
import Heading from 'aws-northstar/components/Heading'
import Alert from 'aws-northstar/components/Alert'
import LoadingIndicator from 'aws-northstar/components/LoadingIndicator'
import ReactEchartsCore from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import {
  LegendComponent,
  TooltipComponent,
  TitleComponent,
  GridComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

import Toolbar from './Toolbar'
import api from '../../api/timestream'

echarts.use([
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  CanvasRenderer,
])

const VisualComponent = ({
  db,
  tableName,
  name,
  id,
  settings,
  options,
  onClose,
}) => {
  const [data, setData] = useState()
  const [query, setQuery] = useState()
  const [loading, setLoading] = useState(false)
  const [echartOptions, setEchartOptions] = useState({})
  const [stateSettings, setStateSettings] = useState(settings)

  useEffect(() => {
    setStateSettings(settings)
  }, [settings])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const res = await api.query(db, tableName, stateSettings)

      setData(res.result)
      setQuery(res.query)
      setLoading(false)
    }

    fetchData()
  }, [db, tableName, stateSettings])

  useEffect(() => {
    let timer

    const fetchData = async () => {
      const res = await api.query(db, tableName, stateSettings)
      setData(res.result)
    }

    if (stateSettings.refresh) {
      timer = setInterval(() => {
        fetchData()
      }, stateSettings.refresh)
    } else {
      clearInterval(timer)
    }

    return () => clearInterval(timer)
  }, [db, tableName, stateSettings])

  const handleQueryChange = async (q) => {
    if (q !== query) {
      setLoading(true)

      const res = await api.rawQuery(q)

      setData(res)
      setQuery(q)
      setLoading(false)
    }
  }

  const onCloseHandler = () => {
    if (onClose) {
      onClose(id)
    }
  }

  useEffect(() => {
    if (!data) return

    const columns = data.ColumnInfo.map((q) => q.Name)
    const otherColumns = columns.filter((q) => q !== 'time')
    const dtIndex = columns.indexOf('time')

    const rows = data.Rows.reverse().map((p) => {
      const dt = new Date(p.Data[dtIndex].ScalarValue)
      const otherColumnsIndex = otherColumns.map((q) => columns.indexOf(q))

      return {
        date: dt,
        ...otherColumnsIndex.reduce((acc, idx) => {
          return {
            ...acc,
            [columns[idx]]: p.Data[idx].ScalarValue,
          }
        }, {}),
      }
    })

    const opt = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: false,
        },
        formatter(params) {
          const first = params[0]

          const date = new Date(first.name)
          const label = date.toLocaleTimeString()
          const dt = date.toLocaleDateString()
          let result = `Date: ${dt} ${label}`

          params.map((q) => {
            result += `<br/>${q.seriesName}: ${q.value}`
            return ''
          })

          return result
        },
      },
      legend: {
        data: otherColumns,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: rows.map((item) => {
          return item.date
        }),
        axisLabel: {
          formatter(value, idx) {
            const date = new Date(value)
            return idx === 0
              ? date.toLocaleDateString()
              : date.toLocaleTimeString()
          },
        },
      },
      yAxis: {
        type: 'value',
      },
      series: [
        ...otherColumns.map((column) => ({
          name: column,
          type: 'line',
          showSymbol: false,
          hoverAnimation: false,
          data: rows.map((q) => q[column]),
        })),
      ],
    }

    setEchartOptions(opt)
  }, [data])

  return (
    <Box>
      <Box style={{ borderTop: '1px solid #eeeeee', paddingTop: '15px' }}>
        <ColumnLayour renderDivider={false}>
          <Column>
            <Box
              display='flex'
              width='100%'
              alignItems='flex-start'
              justifyContent='flex-start'
            >
              <Heading variant='h4'>{name}</Heading>
            </Box>
          </Column>
          <Column>
            <Toolbar
              id={id}
              db={db}
              tableName={tableName}
              onClose={onCloseHandler}
              options={options}
              settings={settings}
              onChange={(newSettings) => {
                if (newSettings.type === 'settings') {
                  setStateSettings(newSettings.settings)
                }
                if (newSettings.type === 'query') {
                  handleQueryChange(newSettings.query)
                }
              }}
              query={query}
            />
          </Column>
        </ColumnLayour>
      </Box>

      <Box marginTop='10px' marginBottom='10px'>
        {data && !data.Rows.length && !loading && (
          <Alert type='warning'>
            No data found for the given period, try with a different search
          </Alert>
        )}
        {loading && <LoadingIndicator label='Loading...' />}
        {!loading && data && data.Rows.length > 0 && (
          <ReactEchartsCore echarts={echarts} option={echartOptions} />
        )}
      </Box>
    </Box>
  )
}

VisualComponent.propTypes = {
  id: PropTypes.number.isRequired,
  tableName: PropTypes.string.isRequired,
  db: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  options: PropTypes.shape({
    measures: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
      })
    ),
    interval: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      })
    ),
  }),
  settings: PropTypes.shape({
    interval: PropTypes.string.isRequired,
    groupInterval: PropTypes.string,
    measures: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
  onClose: PropTypes.func,
}

VisualComponent.defaultProps = {
  onClose: () => {},
}

export default VisualComponent
