import React,{useEffect} from 'react'

import {Layout} from 'antd'

import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'
import NewsRouter from '../../components/sandbox/NewsRouter'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'


import './NewSandBox.css'

const { Content } = Layout;

function NewsSandBox() {
  
 // NProgress.start()

  //useEffect(() => {
      // NProgress.done()
   //})

    return (
        <Layout>
         <SideMenu/>
         <Layout>
           <TopHeader/>
            <Content className="main-container">
                <NewsRouter/>
          </Content>
         </Layout>
        </Layout>
    )
  }
  
  export default NewsSandBox