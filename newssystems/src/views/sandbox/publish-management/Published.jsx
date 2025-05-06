import React from 'react'

import {Button} from 'antd'

import usePublish from '../../../components/publish-manage/usePublish'
import NewsPublish from '../../../components/publish-manage/NewsPublish'

function Published() {

   const {dataSource,handelSunset} = usePublish(2)

    return (
       <NewsPublish dataSource = {dataSource}
       button = {(id)=><Button 
                     danger
                     onClick = {()=>handelSunset(id)}
                     >Off Line</Button>}
       ></NewsPublish>
    )
  }
  
  export default Published