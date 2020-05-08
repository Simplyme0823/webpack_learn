'use strict'
import React from 'react'
import ReactDom from 'react-dom'
import './search.less'
import test from './images/test.png'

import index from '../../common/index'
class Search extends React.Component {
    constructor(){
        super(...arguments)
        this.state={
            Text:null
        }
    }
    loadComponent(){
        import('./test').then((Text)=>{
            this.setState({
                Text:Text.default
            })
        })
    }
    render() {
        //debugger
        const{Text} = this.state
        return <div className="search-text" onClick={this.loadComponent.bind(this)}>reactdfsadfsaf
        {
            Text?<Text/>:null
        }
        </div>;
    }
}

ReactDom.render(
    <Search></Search>,
    document.getElementById("root")
)
