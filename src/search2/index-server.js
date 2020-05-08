'use strict'
const React = require('react')
//const React = require('react-dom')
const s = require('./search.less')

class Search extends React.Component{
    constructor() {
        super(...arguments)
        this.state = {
            Text: null
        }
    }
    loadComponent() {
        import('./test').then((Text) => {
            this.setState({
                Text: Text.default
            })
        })
    }
    render() {
        //debugger
        const { Text } = this.state
        return <div className="search-text" onClick={this.loadComponent.bind(this)}>reactdfsadfsaf
        {
                Text ? <Text /> : null
            }
        </div>;
    }
}

module.exports = <Search />

// server端 render方法不能直接使用
/*ReactDom.render(
    <Search></Search>,
    document.getElementById("root")
)*/
