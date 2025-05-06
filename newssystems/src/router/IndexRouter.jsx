import React, {useEffect} from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from '../views/login/Login'
import NewsSandBox from '../views/sandbox/NewsSandBox'
import News from '../views/news/News'
import Detail from '../views/news/Detail'


function IndexRouter() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element = {<Login/>}/>
                <Route path="/news" element = {<News/>}/>
                <Route path="/detail/:id" element = {<Detail/>}/>
                <Route path="*" element = {<NewsSandBox/>}/>
            </Routes>  
        </BrowserRouter>
    )
  }
  
  export default IndexRouter