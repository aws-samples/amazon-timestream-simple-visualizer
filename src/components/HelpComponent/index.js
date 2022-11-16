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

import React from 'react'
import HelpPanel from 'aws-northstar/components/HelpPanel'
import Link from 'aws-northstar/components/Link'
import Text from 'aws-northstar/components/Text'
import Heading from 'aws-northstar/components/Heading'

const HelpComponent = () => (
  <HelpPanel
    header='Help'
    learnMoreFooter={[
      <Link key={1} href='/settings'>
        Settings
      </Link>,
      <Link
        key={3}
        href='https://github.com/aws-samples/amazon-timestream-simple-visualizer/docs/account-setup.md'
      >
        Setup Radonly Account
      </Link>,
      <Link
        key={2}
        href='https://github.com/aws-samples/amazon-timestream-simple-visualizer/README.md'
      >
        README
      </Link>,
    ]}
  >
    <Heading variant='h4'>Setup</Heading>
    <Text variant='p'>
      Create a new AWS User with programmatic access that has{' '}
      <strong>readonly</strong> permissions to Timestream and add the credentals
      in the <strong>settings</strong> page
    </Text>
    <Heading variant='h4'>Documentation</Heading>
    <Text variant='p'>
      Read the extended repo documentation and the <strong>README</strong> file
      for details on how to use the application
    </Text>
  </HelpPanel>
)

export default HelpComponent
