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
import Modal from 'aws-northstar/components/Modal'
import Button from 'aws-northstar/components/Button'
import Editor from '@monaco-editor/react'

const QueryModal = ({ query, visible, onClose, onChange }) => {
  const [value, setValue] = useState(query)

  useEffect(() => {
    setValue(query)
  }, [query])

  return (
    <>
      <Modal title='Query editor' visible={visible} onClose={onClose}>
        <Editor
          height='50vh'
          language='sql'
          value={value}
          onChange={(v) => setValue(v)}
          options={{
            autoIndent: 'full',
            codeLens: false,
            minimap: null,
          }}
        />
        <Box style={{ marginTop: '20px' }}>
          <Button
            variant='primary'
            iconAlign='right'
            icon='Save'
            onClick={() => onChange(value)}
          >
            Save
          </Button>
        </Box>
      </Modal>
    </>
  )
}

QueryModal.propTypes = {
  query: PropTypes.string.isRequired,
  tableName: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  onChange: PropTypes.func,
  visible: PropTypes.bool.isRequired,
}

QueryModal.defaultProps = {
  onClose: () => {},
  onChange: () => {},
}

export default QueryModal
