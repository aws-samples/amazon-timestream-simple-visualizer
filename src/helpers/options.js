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

export const periodIntervalOptions = [
  { label: '15 Minutes', value: '15m' },
  { label: '1 Hour', value: '1h' },
  { label: '3 Hours', value: '3h' },
  { label: '12 Hours', value: '12h' },
  { label: '24 Hours', value: '1d' },
  { label: '1 Week', value: '7d' },
  { label: '1 Month', value: '30d' },
  { label: '3 Months', value: '90d' },
  { label: '6 Months', value: '180d' },
]

export const groupIntervalOptions = [
  { label: '1 Second', value: '1s' },
  { label: '5 Seconds', value: '5s' },
  { label: '30 Seconds', value: '30s' },
  { label: '1 minute', value: '1m' },
  { label: '5 minutes', value: '5m' },
  { label: '15 minutes', value: '15m' },
]
export const autoRefreshOptions = [
  { label: '1 Second', value: 1000 },
  { label: '2 Seconds', value: 2000 },
  { label: '5 Seconds', value: 5000 },
  { label: '30 Seconds', value: 30000 },
  { label: '1 minute', value: 100000 },
  { label: '5 minutes', value: 500000 },
]
export const aggregationOptions = [
  { label: 'Average', value: 'AVG' },
  { label: 'Maximum', value: 'MAX' },
  { label: 'Minimum', value: 'MIN' },
]
export const operatorsOptions = [
  { label: 'Equal', value: '=' },
  { label: 'Not Equal', value: '<>' },
  { label: 'GreaterThan', value: '>' },
  { label: 'GreaterThanEqual', value: '>=' },
  { label: 'LesserThan', value: '<' },
  { label: 'LesserThanEqual', value: '<=' },
]
