import React,{useEffect, useState} from 'react'
import {Button} from 'antd'

import usePublish from '../../../components/publish-manage/usePublish'
import NewsPublish from '../../../components/publish-manage/NewsPublish'

function Unpublished() {

   const {dataSource, handelPublish} = usePublish(1)


  
    return (
      <div>
         <NewsPublish
          dataSource={dataSource}
          button = {(id)=><Button 
                        type="primary"
                        onClick = {()=>handelPublish(id)}
                        >Publish</Button>}
          ></NewsPublish>
      </div>
       
    )
  }
  
  export default Unpublished