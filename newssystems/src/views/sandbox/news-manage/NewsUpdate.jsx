import React,  { useState, useEffect,useRef} from 'react'

import { useNavigate,useParams } from 'react-router-dom'

import { Steps, Button, Form, Input,Select, message, notification} from 'antd'
import { PageHeader } from '@ant-design/pro-components';

import NewEditor from '../../../components/news-manage/NewEditor'

import './NewAdd.css'

import axios from 'axios'

const { Option } = Select;

function NewsUpdate() {

    const [current, setCurrent] = useState(0)
    const [categoryList, setCategoryList] = useState([])
    const [form] = Form.useForm()

    const [formInfo, setFormInfo] = useState({})

    const [content, setContent] = useState("")

    const {id} = useParams()

    const navigate = useNavigate();

    const User = JSON.parse(localStorage.getItem("token"))

    useEffect(()=>{
        if(id){
            axios.get(`/news/${id}`).then(res=>{
                let{title,categoryId,content} = res.data
                //console.log(content)
                NewsForm.current.setFieldsValue({
                    title,
                    categoryId,
                })
                setContent(content)  
            }).catch(error=>{
                console.error(error)
            })
        }     
   },[id])


    const handleNext = ()=>{
        if(current===0){
            NewsForm.current.validateFields().then(res=>{
                setFormInfo(res)
               // console.log(res)
                setCurrent(current+1)
            }).catch(error=>{
                console.log(error)
            })
        }else{
            if(content==="" || content.trim()==="<p></p>"){
                message.error('the content of news can not be empty')
            }else{
                setCurrent(current+1)
            } 
        }
            
    }

    const handlePrevious = ()=>{
        setCurrent(current-1)
    }

    useEffect(()=>{
        axios.get("http://localhost:3000/categories").then(res=>{
            console.log(res.data)
            setCategoryList(res.data)
        })
    },[])

    const NewsForm = useRef(null) 


    const handleSave = (auditState)=>{
        const categoryMap = {
            "1":"Current News",
            "2":"Global Economy",
            "3":"Technology Science",
            "4":"Military News",
            "5":"Sports News",
            "6":"Life News",
          }
        axios.patch(`/news/${id}`,{
            ...formInfo,
            "category":categoryMap[formInfo.categoryId],
            "content":content,
            "auditState":auditState,
            //"publishTime":0
        }).then(res=>{
            (auditState===0? navigate('/news-manage/draft'):
            navigate('/audit-manage/list'))
            return(
                notification.info({
                message: "Notification",
                description: `The news can be found at ${auditState===0?'draft box':'censor list'}.`,
                placement:"bottomRight",
            })
            )
        })
    }

    return(
        <div>
           < PageHeader
                className="site-page-header"
                title= "Update News"
                onBack={()=>window.history.back()}
                subTitle="edit your news"
           
           /> 
            <div className='steps-container'>
            <Steps //step line 
                current={current}
                items={[
                {
                    title: 'Basic Information',
                    description: 'news title and category',
                },
                {
                    title: 'Content',
                    description:'news content',
                },
                {
                    title: 'Submission',
                    description:'save draft or submit to censor ',
                },
            ]}
            />
            </div>
            <div className={current===0?'':'active'}>
                <Form   
                        form={form}
                        className="Form"
                        ref={NewsForm}
                   >
                <Form.Item label="News Title:"
                            name="title"
                            rules={[{required:true, message:'Please title the news!'}]}>
                    <Input placeholder="Title the news" />
                </Form.Item>
                <Form.Item label="News Category:"
                           name="categoryId"
                           rules={[{required:true, message:'Please category the news!'}]} >
                    <Select placeholder="Select a category for the news"
                            allowClear
                    >
                        {
                             categoryList.map(item=>{
                               return <Option value={item.id} key={item.id}>{item.title}</Option>
                            }  
                            )
                        }    
                    </Select>
                </Form.Item>
                </Form>
            </div>
            <div className={current===1?'':'active'}>
                <NewEditor getContent={ (value)=>{
                    //console.log(value)
                    setContent(value)
                }} content={content} />  
            </div>
            <div className="btn-container">
                {   
                    current>0 &&  <Button onClick={handlePrevious} >Previous</Button>
                }
                {
                    current ===2 && <span>
                        <Button className='save-btn' type="primary" onClick={()=>handleSave(0)}>Save Draft</Button>
                        <Button danger onClick={()=>handleSave(1)}>Submit To Censor</Button>
                    </span>
                }
                {
                    current<2 && <Button type="primary" className='next-btn' onClick={handleNext}>Next</Button>
                }
            </div>
        </div>
    )

}
export default NewsUpdate
