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
import Inline from 'aws-northstar/layouts/Inline'
import Box from 'aws-northstar/layouts/Box'
import Modal from 'aws-northstar/components/Modal'
import Input from 'aws-northstar/components/Input'
import Button from 'aws-northstar/components/Button'
import Toggle from 'aws-northstar/components/Toggle'
import FormField from 'aws-northstar/components/FormField'
import Select from 'aws-northstar/components/Select'
import Multiselect from 'aws-northstar/components/Multiselect'
import Icon from 'aws-northstar/components/Icon'
import api from '../../../api/timestream'
import {
  operatorsOptions,
  aggregationOptions,
  autoRefreshOptions,
  groupIntervalOptions,
} from '../../../helpers/options'

const Toolbar = ({
  db,
  tableName,
  visible,
  onClose,
  onChange,
  settings,
  options,
}) => {
  const [dimentions, setDimentions] = useState()
  const [isGroupInterval, setIsGroupInterval] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [filters, setFilters] = useState(false)
  const [object, setObject] = useState(settings)

  useEffect(() => {
    const fetchMeasures = async () => {
      if (api.isInitialised()) {
        const table = await api.describeTable(db, tableName)

        const dimensions = table.Rows.filter(
          (q) => q.Data[2].ScalarValue === 'DIMENSION'
        ).map((r) => ({
          name: r.Data[0].ScalarValue,
          type: r.Data[1].ScalarValue,
        }))

        setDimentions(dimensions)
      }
    }

    fetchMeasures()
  }, [db, tableName])

  const updateObject = (field, value) => {
    setObject((old) => ({ ...old, [field]: value }))
  }

  useEffect(() => {
    setObject(settings)
  }, [settings])

  useEffect(() => {
    setIsGroupInterval(object.groupInterval || object.groupAggregation)
    setAutoRefresh(!!object.refresh)
    setFilters(object.filters && object.filters.length > 0)
  }, [object])

  useEffect(() => {
    if (!autoRefresh) {
      updateObject('refresh', undefined)
    }
  }, [autoRefresh])

  useEffect(() => {
    if (!isGroupInterval) {
      updateObject('groupInterval', undefined)
      updateObject('groupAggregation', undefined)
    }
  }, [isGroupInterval])

  useEffect(() => {
    if (!filters) {
      updateObject('filters', undefined)
    }

    if (filters && !object.filters) {
      updateObject('filters', [{}])
    }
  }, [object.filters, filters])

  const updateFiltersProp = (idx, prop, value) => {
    const newObj = { ...object }
    newObj.filters[idx][prop] = value

    setObject(newObj)
  }

  const addNewFilterItem = () => {
    const newObj = { ...object }
    newObj.filters.push({})

    setObject(newObj)
  }

  const removeFilterItem = (idx) => {
    const newObj = { ...object }
    newObj.filters.splice(idx, 1)

    setObject(newObj)
  }

  return (
    <>
      <Modal
        title='Visual Options'
        visible={visible}
        onClose={() => {
          setObject(settings)
          onClose()
        }}
      >
        <Box marginBottom='10px'>
          <FormField label='Visualization measures'>
            <Multiselect
              options={options.measures.map((p) => ({
                value: p.name,
                label: p.name,
              }))}
              ariaDescribedby='Select measures to visualise'
              checkboxes={true}
              value={object.measures.map((p) => ({
                value: p.name,
                label: p.name,
              }))}
              onChange={(v) =>
                updateObject(
                  'measures',
                  v.map((q) => options.measures.find((g) => g.name === q.value))
                )
              }
            />
          </FormField>
        </Box>

        <Box marginBottom='10px'>
          <FormField label='Visualization interval'>
            <Select
              placeholder='Select a visualization interval'
              options={options.interval}
              selectedOption={{ value: object.interval }}
              onChange={(e) =>
                updateObject(
                  'interval',
                  options.interval.find((q) => q.value === e.target.value).value
                )
              }
            />
          </FormField>
        </Box>

        <Box marginBottom='10px'>
          <Toggle
            name='group'
            label='Define a grouping interval'
            onChange={(e) => setIsGroupInterval(e)}
            value={isGroupInterval}
          />
        </Box>

        {isGroupInterval && (
          <Box marginBottom='10px'>
            <Inline>
              <Select
                placeholder='Select an interval...'
                options={groupIntervalOptions}
                selectedOption={
                  object.groupInterval
                    ? { value: object.groupInterval }
                    : undefined
                }
                onChange={(e) =>
                  updateObject(
                    'groupInterval',
                    groupIntervalOptions.find((q) => q.value === e.target.value)
                      .value
                  )
                }
              />
              <Select
                placeholder='Select an aggreagtion function...'
                options={aggregationOptions}
                selectedOption={
                  object.groupAggregation
                    ? { value: object.groupAggregation }
                    : undefined
                }
                onChange={(e) =>
                  updateObject(
                    'groupAggregation',
                    aggregationOptions.find((q) => q.value === e.target.value)
                      .value
                  )
                }
              />
            </Inline>
          </Box>
        )}

        <Box marginBottom='10px'>
          <Toggle
            name='refresh'
            label='Automatic refresh'
            onChange={(e) => setAutoRefresh(e)}
            value={autoRefresh}
          />
        </Box>

        {autoRefresh && (
          <Box marginBottom='10px'>
            <Select
              placeholder='Select an interval...'
              options={autoRefreshOptions}
              selectedOption={
                object.refresh ? { value: object.refresh } : undefined
              }
              onChange={(e) =>
                updateObject(
                  'refresh',
                  autoRefreshOptions.find((q) => q.value === e.target.value)
                    .value
                )
              }
            />
          </Box>
        )}

        <Box marginBottom='10px'>
          <Toggle
            name='filters'
            label='Enable Filters'
            onChange={(e) => setFilters(e)}
            value={filters}
          />
        </Box>
        {filters &&
          (object.filters || []).map((q, idx) => (
            <Box marginBottom='10px' key={idx}>
              <Inline>
                <Select
                  placeholder='Dimention...'
                  options={dimentions.map((p) => ({
                    value: p.name,
                    label: p.name,
                  }))}
                  selectedOption={
                    q.dimention ? { value: q.dimention.name } : undefined
                  }
                  onChange={(e) =>
                    updateFiltersProp(
                      idx,
                      'dimention',
                      dimentions.find((d) => d.name === e.target.value)
                    )
                  }
                />
                <Select
                  placeholder='Operator...'
                  options={operatorsOptions}
                  selectedOption={
                    q.operator ? { value: q.operator } : undefined
                  }
                  onChange={(e) =>
                    updateFiltersProp(
                      idx,
                      'operator',
                      operatorsOptions.find((d) => d.value === e.target.value)
                        .value
                    )
                  }
                />
                <Input
                  type='text'
                  placeholder='Value...'
                  value={q.value}
                  onChange={(e) => updateFiltersProp(idx, 'value', e)}
                />
                <Icon name='Remove' onClick={() => removeFilterItem(idx)} />
                {idx + 1 === object.filters.length && (
                  <Icon name='Add' onClick={addNewFilterItem} />
                )}
              </Inline>
            </Box>
          ))}
        <Button
          variant='primary'
          iconAlign='right'
          icon='Save'
          onClick={() => onChange(object)}
        >
          Save
        </Button>
      </Modal>
    </>
  )
}

Toolbar.propTypes = {
  db: PropTypes.string.isRequired,
  tableName: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  onChange: PropTypes.func,
  visible: PropTypes.bool.isRequired,
  settings: PropTypes.shape({
    interval: PropTypes.string.isRequired,
    groupInterval: PropTypes.string,
    groupAggregation: PropTypes.string,
    refresh: PropTypes.number,
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
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
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
