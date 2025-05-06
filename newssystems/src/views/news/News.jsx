import React, {useEffect, useState} from 'react'

import { PageHeader } from '@ant-design/pro-components'
import {Card, Col, Row,List} from 'antd'

import axios from 'axios'

import _ from 'lodash'

import './News.css'

function News() {

    const[list,setlist] = useState([]) 

    useEffect(()=>{
        axios.get("/news?publishState=2").then(res=>{
            //console.log(Object.entries(_.groupBy(res.data,item=>item.category)))
            setlist(Object.entries(_.groupBy(res.data,item=>item.category)))

        })

    },[])


    return (
        <div>
        <section className="header-title-container">
            <PageHeader 
                    title='News Channel'
                    subTitle='Exploring Break News In The World'>
            </PageHeader>
        </section>
        <section className='card-container'>
        <Row gutter={16}>
            {
                list.map (item=>
                    <Col span={8} key={item[0]} className='card'>
                <Card  title={item[0]}variant="borderless" hoverable={true}>
                <List
                        size="small"
                        dataSource={item[1]}
                        pagination = {{
                            pageSize: 5
                        }}
                        renderItem={(data) => 
                        <List.Item><a href={`/detail/${data.id}`}>{data.title}</a></List.Item>}
                />
                </Card>
            </Col>)
            }
        </Row>
        </section>
        </div>
    )
}

export default News
