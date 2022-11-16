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

import Button from 'aws-northstar/components/Button'
import Flashbar from 'aws-northstar/components/Flashbar'
import FormField from 'aws-northstar/components/FormField'
import Input from 'aws-northstar/components/Input'
import Text from 'aws-northstar/components/Text'
import Container from 'aws-northstar/layouts/Container'
import React, { useEffect, useState } from 'react'
import api from '../../api/timestream'

const Settings = () => {
  const [region, setRegion] = useState('')
  const [key, setKey] = useState('')
  const [secret, setSecret] = useState('')
  const [session, setSessionToken] = useState('')
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const fetchConfig = async () => {
      const {
        region: configRegion,
        secretAccessKey,
        accessKeyId,
        sessionToken,
      } = await api.getConfiguration()

      setRegion(configRegion || 'us-east-1')
      setKey(accessKeyId)
      setSecret(secretAccessKey)
      setSessionToken(sessionToken)
    }

    fetchConfig()
  }, [])

  const saveSettings = () => {
    api.setConfiguration(region, key, secret, session)
    setNotifications((old) => [
      ...old,
      {
        type: 'success',
        header: 'Settings',
        content: 'Your settings have been updated successfully',
        dismissible: true,
      },
    ])
  }

  return (
    <>
      <Flashbar items={notifications} />
      <Container
        headingVariant='h2'
        title='Settings'
        subtitle='Define region and API keys to be used by the webapp.'
        style={{ marginTop: '25px' }}
      >
        <FormField>
          <Text>
            <strong>Note:</strong> settings are not persisted, the keys are just
            used to configure the AWS SDK running in the browser. <br />
            If you refresh the page the data will be lost and you&apos;d be
            required to input your credentials again
          </Text>
        </FormField>

        <FormField
          label='Region'
          hintText='Input a region supported by Timestream: eg. us-east-1'
          controlId='region'
        >
          <Input
            type='text'
            controlId='region'
            value={region}
            onChange={(v) => setRegion(v)}
          />
        </FormField>

        <FormField
          label='Access Key'
          hintText='Input the access key of a IAM programmatic user that has access to Timestream query'
          controlId='accessKey'
        >
          <Input
            type='password'
            controlId='accessKey'
            value={key}
            autocomplete={false}
            onChange={(v) => setKey(v)}
          />
        </FormField>

        <FormField
          label='Secret Access Key'
          hintText='Input the access key secret of a IAM programmatic user that has access to Timestream query'
          controlId='accessKeySecret'
        >
          <Input
            type='password'
            controlId='accessKeySecret'
            value={secret}
            autocomplete={false}
            onChange={(v) => setSecret(v)}
          />
        </FormField>

        <FormField
          label='Session Token'
          hintText='Input the session token of a IAM programmatic user that has access to Timestream query'
          controlId='sessionToken'
        >
          <Input
            type='password'
            controlId='sessionToken'
            value={session}
            autocomplete={false}
            onChange={(v) => setSessionToken(v)}
          />
        </FormField>

        <Button
          variant='primary'
          onClick={saveSettings}
          icon='Save'
          iconAlign='right'
        >
          Save
        </Button>
      </Container>
    </>
  )
}

export default Settings
