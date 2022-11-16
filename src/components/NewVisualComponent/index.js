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

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Inline from 'aws-northstar/layouts/Inline'
import Box from 'aws-northstar/layouts/Box'
import Button from 'aws-northstar/components/Button'
import Select from 'aws-northstar/components/Select'
import Heading from 'aws-northstar/components/Heading'
import LoadingIndicator from 'aws-northstar/components/LoadingIndicator'

const NewVisualComponent = ({ options, onConfirm, onClose }) => {
  const [object, setObject] = useState({})

  const updateObject = (field, value) => {
    setObject((old) => ({ ...old, [field]: value }))
  }

  const handleSubmit = () => {
    const error = !object.interval || !object.measure

    updateObject('intervalError', !object.interval)
    updateObject('measureError', !object.measure)

    if (error) {
      return
    }

    onConfirm({
      interval: object.interval.value,
      measures: [object.measure],
    })
  }

  return (
    <>
      {options.measures && (
        <>
          <Box paddingBottom='15px'>
            <Heading variant='h3'>New Visual</Heading>
          </Box>

          <Box marginBottom='10px'>
            <Select
              placeholder='Select the measure to display in the graph'
              options={options.measures.map((q) => ({
                value: q.name,
                label: q.name,
              }))}
              selectedOption={
                object.measure ? { value: object.measure.name } : undefined
              }
              invalid={object.measureError}
              onChange={(e) =>
                updateObject(
                  'measure',
                  options.measures.find((q) => q.name === e.target.value)
                )
              }
            />
          </Box>

          <Box marginBottom='10px'>
            <Select
              placeholder='Select the visualization period'
              options={options.interval}
              selectedOption={object.interval}
              invalid={object.intervalError}
              onChange={(e) =>
                updateObject(
                  'interval',
                  options.interval.find((q) => q.value === e.target.value)
                )
              }
            />
          </Box>
          <Box marginBottom='10px'>
            <Inline>
              <Button
                variant='primary'
                onClick={handleSubmit}
                icon='SaveOutlined'
                iconAlign='right'
              >
                Save Visual
              </Button>

              <Button
                variant='normal'
                onClick={() => onClose()}
                icon='CancelOutlined'
                iconAlign='right'
              >
                Cancel
              </Button>
            </Inline>
          </Box>
        </>
      )}
      {!options.measures && <LoadingIndicator label='Loading...' />}
    </>
  )
}

NewVisualComponent.propTypes = {
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
  onConfirm: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}

NewVisualComponent.defaultProps = {}

export default NewVisualComponent
