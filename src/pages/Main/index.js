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
import { useHistory } from 'react-router-dom'
import Box from 'aws-northstar/layouts/Box'
import Button from 'aws-northstar/components/Button'
import Flashbar from 'aws-northstar/components/Flashbar'
import DatabaseConnectionComponent from '../../components/DatabaseConnectionComponent'
import api from '../../api/timestream'

const Main = () => {
  const isInitailised = api.isInitialised()
  const [dbs, setDbs] = useState([])
  const [inc, setInc] = useState(0)
  const history = useHistory()

  useEffect(() => {
    if (inc > 0) {
      setDbs((old) => [...old, { id: inc }])
    }
  }, [inc])

  const removeDbConnection = (id) => {
    setDbs(dbs.filter((q) => q.id !== id))
  }

  return (
    <>
      {!isInitailised && (
        <Box style={{ marginBottom: '25px' }}>
          <Flashbar
            items={[
              {
                header: 'Information',
                content:
                  'The access credentials are not yet configured. Visit the settings page to configure that to be able to add connections',
                buttonText: 'Settings',
                onButtonClick: () => {
                  history.push('/settings')
                },
              },
            ]}
          />
        </Box>
      )}
      {dbs.map((db) => (
        <DatabaseConnectionComponent
          id={db.id}
          key={db.id}
          onRemove={removeDbConnection}
        />
      ))}
      <Button
        variant='primary'
        iconAlign='right'
        icon='add_plus'
        onClick={() => setInc((old) => old + 1)}
        disabled={!isInitailised}
      >
        New Database Connection
      </Button>
    </>
  )
}

export default Main
