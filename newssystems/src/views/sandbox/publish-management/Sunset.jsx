import React from 'react'

import {Button} from 'antd'

import usePublish from '../../../components/publish-manage/usePublish'
import NewsPublish from '../../../components/publish-manage/NewsPublish'

function Sunset() {

   const {dataSource,handelDelete} = usePublish(3)
  
    return (
      <NewsPublish 
         dataSource={dataSource}
         button = {(id)=><Button 
                        danger
                        onClick = {()=>handelDelete(id)} 
                        >Delete</Button>}
      ></NewsPublish>
    )
  }
  
  export default Sunset