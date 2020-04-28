'use strict'
import React from 'react'
import ReactDom from 'react-dom'
import './search.less'
import test from './images/test.png'
class Search extends React.Component {
    render() {
        return <div className="search-text">react
        <img src={test} />
        </div>;
    }
}

ReactDom.render(
    <Search></Search>,
    document.getElementById("root")
)