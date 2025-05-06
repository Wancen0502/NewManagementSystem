import React,{useEffect,useState,useRef} from 'react'
import { Button,Drawer} from 'antd'
import axios from 'axios'
import { Card, Col, Row, List, Avatar } from 'antd'
import { 
    EditOutlined, 
    EllipsisOutlined, 
    PieChartOutlined } 
from '@ant-design/icons'
import _ from 'lodash'

import * as echarts from 'echarts';

const { Meta } = Card;

function Home() {

    const [viewList, setViewList] = useState([])
    const [popularList, setPopularList] = useState([])
    const [allList, setAllList] = useState([])

    const barRef = useRef(null)
    const pieRef = useRef(null)

    const [open, setOpen] = useState(false);
    const [pieChart, setPieChart] = useState(null)

    useEffect(()=>{
        axios.get(`/news?publishState=2&_sort=-view&_order=desc&_limit=6`).then(res=>{
            //console.log(res.data)
            setViewList(res.data)
        })
    },[])


    useEffect(()=>{
        axios.get(`/news?publishState=2&_sort=-star&_order=desc&_limit=6`).then(res=>{
            //console.log(res.data)
            setPopularList(res.data)
        })
    },[])


    const {username,region,role} = JSON.parse(localStorage.getItem("token"))

    useEffect(()=>{

        axios.get(`/news?publishState=2`).then(res=>{
            //console.log(res.data)
            //console.log(_.groupBy(res.data, item=>item.category))
            renderBarView(_.groupBy(res.data, item=>item.category))

            setAllList(res.data)
        })

        return ()=>{
            window.onresize =null

        }

    },[])

    const renderBarView = (obj)=>{
        
        var myChart = echarts.init(barRef.current);

        var option = {
            title: {
              text: 'News Category Charts'
            },
            tooltip: {},
            legend: {
              data: ['Amount']
            },
            xAxis: {
              data: Object.keys(obj),
              axisLabel:{
                rotate:"30",
                interval:0

              }
            },
            yAxis: {
                minInterval:1
            },
            series: [
              {
                name: 'Amount',
                type: 'bar',
                data: Object.values(obj).map(item=>item.length)
              }
            ]
        };
        myChart.setOption(option);

        window.onresize = ()=>{
            //console.log("resize")
            myChart.resize()

        }    
    }

    const showDrawer = () => {

        setTimeout(()=>{
            renderPieView()  
        },0)
        setOpen(true)
        

      };

    const renderPieView = ()=>{

        // deal data set
        var currentList = allList.filter(item=>item.author === username)
        //console.log(currentList)
        var groupObj = _.groupBy(currentList, item => item.category)
        //console.log(groupObj)

        var list = []
        for (var i in groupObj){
            list.push({
               name:i,
                value:groupObj[i].length
             })
        }
        //console.log(list)

        var myChart
        if(!pieChart){
            var myChart = echarts.init(pieRef.current);
            setPieChart(myChart)
        }

        var option = {
            title: {
              text: 'Personal News Category',
              left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                  name: 'Publish Amount',
                  type: 'pie',
                  radius: '50%',
                  data: list,
                  emphasis: {
                    itemStyle: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                  }
                }
              ]
        };
        option && myChart.setOption(option);

        window.onresize = ()=>{
            //console.log("resize")
            myChart.resize()

        }    
    }


    
      const onClose = () => {
        setOpen(false);
      };


    return (
    <div>
     <Row gutter={16}>
        <Col span={8}>
            <Card title="News With Highest Reviews" variant="outlined">
            <List
                size="small"
                dataSource={viewList}
                renderItem={(item) => <List.Item><a href={`/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
            />
            </Card>
        </Col>
        <Col span={8}>
            <Card title="News With Highest Kudos" variant="outlined" >
            <List
                size="small"
                dataSource={popularList}
                renderItem={(item) => <List.Item><a href={`/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
            />
            </Card>
        </Col>
        <Col span={8}>
        <Card
            cover={
            <img
                alt="example"
                src="../src/img/absolutvision-WYd_PkCa1BY-unsplash.jpg"
            />
            }
            actions={[
                <PieChartOutlined key="setting" onClick={showDrawer} />,
                <EditOutlined key="edit" />,
                <EllipsisOutlined key="ellipsis" />,
            ]}
            >
            <Meta
                title={username}
                description={
                    <div>
                        <b>{region?region:"Headquarter "}</b>
                        <br/>
                        {role}
                    </div>
                }
            />
            </Card>
        </Col>
    </Row>
    <div>
      <Drawer   title="Personal News Publish Statement" 
                onClose={onClose} 
                open={open}
                size="large">
            <div    ref={pieRef} 
                    style={{
                        height:"700px",
                        marginTop:"30px"
                }}>
            </div>
      </Drawer>
    </div>
    <div ref={barRef} style={{
        height:"700px",
        marginTop:"30px"
    }}>
    </div>
    </div> 

    )
  }
  
  export default Home