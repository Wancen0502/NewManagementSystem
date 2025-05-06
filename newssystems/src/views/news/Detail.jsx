import React,{useEffect, useState} from 'react'

import {useParams} from "react-router-dom"

import { PageHeader } from '@ant-design/pro-components'
import {Descriptions} from 'antd'

import moment from 'moment'

import axios from 'axios'

import { 
    HeartTwoTone
    } 
from '@ant-design/icons'


function Detail(props) {

    const[newsInfo, setNewsInfo] = useState(null)

    const {id} = useParams()


    useEffect(()=>{
        axios.get(`/news/${id}`).then(res => {
            const updatedView = res.data.view + 1;

            setNewsInfo({
                ...res.data,
                view: updatedView
            });
    
            return axios.patch(`/news/${id}`, { view: updatedView });
        }).catch(error => {
            console.error("Error fetching or updating view count:", error);
        });
   },[id])

   const handelKudos = ()=>{

        setNewsInfo({
        ...newsInfo,
        star: newsInfo.star+1
        })
        axios.patch(`/news/${id}`,{star:newsInfo.star+1})

   }

    return(
        <div>{
                newsInfo && 
                <div>
                <PageHeader 
                        onBack={()=>window.history.back()}
                        title={newsInfo.title}
                        subTitle={
                            <div>
                            {newsInfo.category}
                            <HeartTwoTone twoToneColor="#eb2f96"
                            onClick={()=>handelKudos()} />
                            </div>
                        }
                       >
                    <Descriptions size="small" column={3}>
                        <Descriptions.Item label="Author">
                            {newsInfo.author}
                        </Descriptions.Item>
                        <Descriptions.Item label="Released Time">
                            {newsInfo.publishTime?moment(newsInfo.publishTime).format("YYYY/MM/DD HH:mm:ss"):"-"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Branch">
                            {newsInfo.region===""?"Headquarter":newsInfo.region}    
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

export default Detail