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

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Container from 'aws-northstar/layouts/Container'
import Inline from 'aws-northstar/layouts/Inline'
import FormField from 'aws-northstar/components/FormField'
import Select from 'aws-northstar/components/Select'
import Alert from 'aws-northstar/components/Alert'
import Button from 'aws-northstar/components/Button'
import Box from 'aws-northstar/layouts/Box'
import ColumnLayour, { Column } from 'aws-northstar/layouts/ColumnLayout'
import api from '../../api/timestream'
import TableDetailsComponent from '../TableDetailsComponent'

const DatabaseConnectionComponent = ({ id, onRemove }) => {
  const isInitailised = api.isInitialised()
  const [statusType, setStatusType] = React.useState(null)
  const [tablesStatusType, setTablesStatusType] = React.useState(null)
  const [dbConnections, seDbConnections] = useState([])
  const [tables, setTables] = useState([])
  const [currentTable, setCurrentTable] = useState()
  const [selectedTables, setSelectedTables] = useState([])
  const [selectedDb, setSelectedDb] = useState()

  const loadDababses = async () => {
    setStatusType('loading')

    if (isInitailised) {
      const dbs = await api.listDatabases()
      const databases = dbs.Databases.map((d) => ({
        label: d.DatabaseName,
        value: d.Arn,
      }))

      seDbConnections(databases)
    }

    setStatusType('finished')
  }

  const loadTables = async () => {
    setTablesStatusType('loading')

    if (isInitailised && !tables.length) {
      const tbs = await api.listTables(selectedDb.label)
      const tb = tbs.Tables.map((d) => ({
        label: d.TableName,
        value: d.Arn,
      }))

      setTables(tb)
    }

    setTablesStatusType('finished')
  }

  const addTable = async () => {
    if (!selectedTables.find((q) => q.value === currentTable.value)) {
      setSelectedTables((old) => [...old, currentTable])
    }
  }

  return (
    <Container
      headingVariant='h2'
      footerContent={
        <ColumnLayour renderDivider={false}>
          <Column>
            <Box
              display='flex'
              width='100%'
              alignItems='flex-end'
              justifyContent='flex-end'
            >
              <Button
                onClick={() => onRemove(id)}
                icon='RemoveCircleOutline'
                iconAlign='right'
              >
                Remove Connection
              </Button>
            </Box>
          </Column>
        </ColumnLayour>
      }
      title={`Database Connection #${id}`}
      actionGroup={
        <Select
          placeholder='Select a Database...'
          loadingText='Loading Databases'
          onFocus={loadDababses}
          statusType={statusType}
          options={dbConnections}
          onChange={(e) =>
            setSelectedDb(dbConnections.find((q) => q.value === e.target.value))
          }
          selectedOption={selectedDb}
          disabled={!!selectedDb}
        />
      }
    >
      {!selectedDb && <Alert type='info'>Select a database first</Alert>}
      {selectedDb && (
        <FormField label='Select a table' controlId='table'>
          <Inline>
            <Select
              placeholder='Select a Table...'
              loadingText='Loading Tables'
              onFocus={loadTables}
              statusType={tablesStatusType}
              options={tables}
              onChange={(e) =>
                setCurrentTable(tables.find((q) => q.value === e.target.value))
              }
              selectedOption={currentTable}
            />
            <Button
              variant='primary'
              iconAlign='right'
              icon='add_plus'
              onClick={addTable}
              disabled={!currentTable}
            >
              Add Table
            </Button>
          </Inline>
        </FormField>
      )}

      {selectedTables.map((q) => (
        <TableDetailsComponent
          tableName={q.label}
          db={selectedDb.label}
          key={q.value}
          onRemove={(t) =>
            setSelectedTables(selectedTables.filter((tt) => tt.label !== t))
          }
        />
      ))}
    </Container>
  )
}

DatabaseConnectionComponent.propTypes = {
  id: PropTypes.number.isRequired,
  onRemove: PropTypes.func,
}

DatabaseConnectionComponent.defaultProps = {
  onRemove: () => {},
}

export default DatabaseConnectionComponent
