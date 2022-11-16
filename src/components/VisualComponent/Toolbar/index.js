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
import Button from 'aws-northstar/components/Button'
import Inline from 'aws-northstar/layouts/Inline'
import Select from 'aws-northstar/components/Select'
import EditModal from './EditModal'
import QueryModal from './QueryModal'

const Toolbar = ({
  id,
  db,
  tableName,
  onClose,
  onChange,
  settings,
  options,
  query,
}) => {
  const [visible, setVisible] = useState(false)
  const [newQuery, setNewQuery] = useState()
  const [queryVisible, setQueryVisible] = useState(false)
  const [visualSettings, setVisualSettings] = useState(settings)

  useEffect(() => {
    setVisualSettings(settings)
  }, [settings])

  useEffect(() => {
    onChange({ settings: visualSettings, type: 'settings' })
    // eslint-disable-next-line
  }, [visualSettings])

  useEffect(() => {
    onChange({ query: newQuery, type: 'query' })
    // eslint-disable-next-line
  }, [newQuery])

  const onCloseHandler = () => {
    if (onClose) {
      onClose(id)
    }
  }

  const updateSettings = (field, value) => {
    setVisualSettings((old) => ({ ...old, [field]: value }))
  }

  return (
    <>
      <Box
        display='flex'
        width='100%'
        alignItems='flex-end'
        justifyContent='flex-end'
      >
        <Inline>
          <Select
            placeholder='Select the visualization period'
            options={options.interval}
            selectedOption={{ value: visualSettings.interval }}
            onChange={(e) =>
              updateSettings(
                'interval',
                options.interval.find((q) => q.value === e.target.value).value
              )
            }
          />
          <Button
            variant='normal'
            iconAlign='right'
            icon='ShowChart'
            size='small'
            onClick={() => setQueryVisible(true)}
          >
            Query
          </Button>
          <Button
            variant='normal'
            iconAlign='right'
            icon='Edit'
            size='small'
            onClick={() => setVisible(true)}
          >
            Edit
          </Button>
          <Button
            variant='normal'
            icon='Close'
            iconAlign='right'
            size='small'
            onClick={onCloseHandler}
          >
            Close
          </Button>
        </Inline>
      </Box>

      <EditModal
        db={db}
        tableName={tableName}
        visible={visible}
        onClose={() => setVisible(false)}
        settings={visualSettings}
        options={options}
        onChange={(nSettings) => {
          setVisualSettings(nSettings)
          setVisible(false)
        }}
      />
      <QueryModal
        visible={queryVisible}
        onClose={() => setQueryVisible(false)}
        query={query}
        onChange={(q) => {
          setNewQuery(q)
          setQueryVisible(false)
        }}
      />
    </>
  )
}

Toolbar.propTypes = {
  id: PropTypes.number.isRequired,
  db: PropTypes.string.isRequired,
  tableName: PropTypes.string.isRequired,
  query: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  onChange: PropTypes.func,
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
  options: PropTypes.shape({
    measures: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      })
    ).isRequired,
    interval: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
}

Toolbar.defaultProps = {
  onClose: () => {},
  onChange: () => {},
}

export default Toolbar
