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

import React from 'react'
import { Route, Switch } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import AppLayout from 'aws-northstar/layouts/AppLayout'
import Box from 'aws-northstar/layouts/Box'
import HeaderComponent from '../components/HeaderComponent'
import HelpComponent from '../components/HelpComponent'
import NavigationBar from '../components/NavigationBar'
import Main from '../pages/Main'
import Settings from '../pages/Settings'
import NotFound from '../pages/404'

const Layout = () => {
  return (
    <BrowserRouter>
      <Box style={{ overflowX: 'hidden' }}>
        <AppLayout
          header={<HeaderComponent />}
          navigation={<NavigationBar />}
          helpPanel={<HelpComponent />}
        >
          <Switch>
            <Route exact path='/' component={Main} />
            <Route exact path='/settings' component={Settings} />
            <Route component={NotFound} />
          </Switch>
        </AppLayout>
      </Box>
    </BrowserRouter>
  )
}

export default Layout
