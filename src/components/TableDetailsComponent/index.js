/** *******************************************************************************************************************
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.                                                *
 *                                                                                                                    *
 *  Licensed under the Apache License, Version 2.0 (the "License").                                                   *
 *  You may not use this file except in compliance with the License.                                                  *
 *  You may obtain a copy of the License at                                                                           *
 *                                                                                                                    *
 *      http://www.apache.org/licenses/LICENSE-2.0                                                                    *
 *                                                                                                                    *
 *  Unless required by applicable law or agreed to in writing, software                                               *
 *  distributed under the License is distributed on an "AS IS" BASIS,                                                 *
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.                                          *
 *  See the License for the specific language governing permissions and                                               *
 *  limitations under the License.                                                                                    *
 ******************************************************************************************************************** */

import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Box from 'aws-northstar/layouts/Box'
import ColumnLayour, { Column } from 'aws-northstar/layouts/ColumnLayout'
import Card from 'aws-northstar/components/Card'
import Alert from 'aws-northstar/components/Alert'
import Button from 'aws-northstar/components/Button'
import NewVisualComponent from '../NewVisualComponent'
import VisualComponent from '../VisualComponent'
import api from '../../api/timestream'
import { periodIntervalOptions } from '../../helpers/options'

const TableDetailsComponent = ({ db, tableName, onRemove }) => {
  const [measures, setMeasures] = useState()
  const [visualSettings, setVisualSettings] = useState()
  const [newVisual, setNewVisual] = useState(true)

  useEffect(() => {
    const fetchMeasures = async () => {
      if (api.isInitialised()) {
        const res = await api.getMeasures(db, tableName)

        setMeasures(
          res.Rows.map((r) => ({
            name: r.Data[0].ScalarValue,
            type: r.Data[1].ScalarValue,
          }))
        )
      }
    }

    fetchMeasures()
  }, [db, tableName])

  const handleAddVisual = (obj) => {
    setVisualSettings((old) => [
      ...(old || []),
      { id: (old ? old.length : 0) + 1, value: obj },
    ])
    setNewVisual(false)
  }

  const removeVisual = (id) => {
    setVisualSettings(visualSettings.filter((q) => q.id !== id))
  }

  return (
    <Box style={{ marginBottom: '15px' }}>
      <Card
        title={tableName}
        titleTypographyProps={{ variant: 'h2', color: 'secondary' }}
      >
        {visualSettings &&
          visualSettings.map((r) => {
            return (
              <VisualComponent
                name={`Visual #${r.id}`}
                key={r.id}
                settings={r.value}
                options={{
                  measures,
                  interval: periodIntervalOptions,
                }}
                db={db}
                tableName={tableName}
                id={r.id}
                onClose={removeVisual}
              />
            )
          })}

        {newVisual && (
          <NewVisualComponent
            options={{
              measures,
              interval: periodIntervalOptions,
            }}
            onConfirm={handleAddVisual}
            onClose={() => setNewVisual(false)}
          />
        )}

        {!newVisual && (!visualSettings || !visualSettings.length) && (
          <Alert type='info'>
            There are no visuals yet for this table, click on{' '}
            <strong>New Visual</strong> to add a one
          </Alert>
        )}

        <Box style={{ borderTop: '1px solid #eeeeee', paddingTop: '15px' }}>
          <ColumnLayour renderDivider={false}>
            <Column>
              <Box
                display='flex'
                width='100%'
                alignItems='flex-start'
                justifyContent='flex-start'
              >
                <Button
                  variant='primary'
                  onClick={() => setNewVisual(true)}
                  disabled={newVisual}
                  icon='Add'
                  iconAlign='right'
                >
                  New Visual
                </Button>
              </Box>
            </Column>
            <Column>
              <Box
                display='flex'
                width='100%'
                alignItems='flex-end'
                justifyContent='flex-end'
              >
                <Button
                  onClick={() => onRemove(tableName)}
                  icon='RemoveCircleOutline'
                  iconAlign='right'
                >
                  Remove Table
                </Button>
              </Box>
            </Column>
          </ColumnLayour>
        </Box>
      </Card>
    </Box>
  )
}

TableDetailsComponent.propTypes = {
  tableName: PropTypes.string.isRequired,
  db: PropTypes.string.isRequired,
  onRemove: PropTypes.func,
}

TableDetailsComponent.defaultProps = {
  onRemove: () => {},
}

export default TableDetailsComponent
