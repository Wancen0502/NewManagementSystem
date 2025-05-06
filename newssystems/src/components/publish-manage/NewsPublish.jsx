import React from 'react'

import {Table} from 'antd'

function NewsPublish(props) {
  
    const columns = [
      {
        title: 'News Title',
        dataIndex: 'title',
        render: (title,item)=>{
          return <a href={`/news-manage/preview/${item.id}`}>{title}</a>
        },
      },
      {
        title: 'Author',
        dataIndex: 'author',
      },
      {
        title: 'News Category',
        dataIndex: 'category',
      },
      {
        title: 'Action',
        render: (item)=>{
          return <div>
             {props.button(item.id)}
          </div>
        },
      },
    ];

    return (
        <div>
        <Table dataSource={props.dataSource} columns={columns}
        pagination ={{
          pageSize:5
        }} rowKey={item=>item.id} />
        </div>
    )
  }
  
  export default NewsPublish