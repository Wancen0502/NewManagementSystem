import React,{useEffect, useState} from 'react'

import {useParams} from "react-router-dom"

import { PageHeader } from '@ant-design/pro-components'
import {Descriptions} from 'antd'

import moment from 'moment'

import axios from 'axios'

import './NewsPreview.css'

function NewsPreview(){

    const[newsInfo, setNewsInfo] = useState(null)

    const {id} = useParams()


    useEffect(()=>{
        if(id){
            axios.get(`/news/${id}`).then(res=>{
                setNewsInfo(res.data)
            }).catch(error=>{
                console.error(error)
            })
        }     
   },[id])

   const auditList = ["Await for censor", "Under censor","Censor pass","Unpass"]
   const publishList = ["Unpublished", "Ready for publish", "Published", "Offline"]

   const colorList = ["black", "orange","green"]



    return(
        <div>{
                newsInfo && 
                <div>
                <PageHeader 
                        onBack={()=>window.history.back()}
                        title={newsInfo.title}
                        subTitle={newsInfo.category}>
                    <Descriptions size="small" column={3}>
                        <Descriptions.Item label="Author">
                            {newsInfo.author}
                        </Descriptions.Item>
                        <Descriptions.Item label="Created Time">
                            {moment(newsInfo.createTime).format("YYYY/MM/DD HH:mm:ss")}
                        </Descriptions.Item>
                        <Descriptions.Item label="Released Time">
                            {newsInfo.publishTime?moment(newsInfo.publishTime).format("YYYY/MM/DD HH:mm:ss"):"-"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Branch">
                            {newsInfo.region===""?"Headquarter":newsInfo.region}    
                        </Descriptions.Item>
                        <Descriptions.Item label="Censor Status">
                            <span style={{color:colorList[newsInfo.auditState]}}>
                            { auditList[newsInfo.auditState] }
                            </span>
                        </Descriptions.Item>
                        <Descriptions.Item label="Release Status">
                            <span style={{color:colorList[newsInfo.publishState]}}>
                                { publishList[newsInfo.publishState] }
                            </span>
                        </Descriptions.Item>
                        <Descriptions.Item label="Views">
                            {newsInfo.view}
                        </Descriptions.Item>
                        <Descriptions.Item label="Kudos">
                            {newsInfo.star}
                        </Descriptions.Item>
                        <Descriptions.Item label="Comment">
                            0
                        </Descriptions.Item>
                    </Descriptions>
                </PageHeader>
                <div className="news-container" dangerouslySetInnerHTML={{
                    __html:newsInfo.content
                }}>

                </div>
                </div>
            }
        </div>
    )

}

export default NewsPreview