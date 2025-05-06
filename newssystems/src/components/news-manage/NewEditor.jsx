import React, { useState, useEffect } from 'react'
import { Editor } from "react-draft-wysiwyg"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs';
import {convertToRaw,EditorState,ContentState} from 'draft-js'

import './NewEditor.css'

function NewEditor(props){

    const[editorState, setEditorState] = useState("")

    useEffect(()=>{
        //console.log(props.content)
        const html = props.content
        if(html===undefined) return
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            setEditorState(editorState)
    }
    },[props.content])

    
    

    return(
        <div className="editor-container">
            <Editor
                editorState={editorState}
                toolbarClassName="tool-bar"
                wrapperClassName="wrapper"
                editorClassName="editor"
                onEditorStateChange={(editorState)=>
                    setEditorState(editorState)
                }
                onBlur={ ()=>{
                    props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
                }}
            />
        </div>
    )

}




export default NewEditor