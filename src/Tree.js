import React, { Component } from 'react';
import './Tree.css';
import {Tree,Divider } from 'antd';

const DirectoryTree = Tree.DirectoryTree;
const TreeNode = Tree.TreeNode;
//const url = "http://127.0.0.1:3000/data";
const url = "https://chal-locdrmwqia.now.sh/";




class ITree extends Component {
    constructor(){
        super();

        this.state={
            treeData: [],
        }
    };

    async componentDidMount(){
        let response = await fetch(url);
        let lastGist = await response.json();
        this.setState({treeData: lastGist.data});
        //this.setState({treeData: lastGist});
    }

    readablizeBytes = (bytes) =>{
        var s = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
        var e = Math.floor(Math.log(bytes)/Math.log(1024));
        return (bytes/Math.pow(1024, Math.floor(e))).toFixed(2)+" "+s[e];
    }

    totalFiles=(obj)=>{
        let num=0,size=0;
        let file=(o)=> {
            for (let item of o) {
                if (item.type === 'file') {
                    num++;
                    size=size+item.size;
                } else if (item.children) {
                    //this.totalFiles(item.children)
                    file(item.children)


                }
            }
            let num_size=[num,size];
            return num_size;
        }
        let totalnum_size = file(obj);
        return totalnum_size;
    }

    renderTreeNodes = (data) => {
        return data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode title={item.name+((item.size)?' '+this.readablizeBytes(item.size):'')}  dataRef={item} isLeaf={(item.type==='file')?true:false}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode title={item.name+((item.size)?' '+this.readablizeBytes(item.size):'')} dataRef={item} isLeaf={(item.type==='file')?true:false}/>;
        });
    }





    render() {

        return (
            <div id='main'>
                <div>
                    <DirectoryTree className='tree'>
                        {this.renderTreeNodes(this.state.treeData)}
                    </DirectoryTree>
                </div>
            <Divider className='divider' />
                <div id='total'>
                    {'Total Files:'+' '+ this.totalFiles(this.state.treeData)[0]}
                    <br/>
                    {'Total Filesize:'+' '+ this.readablizeBytes(this.totalFiles(this.state.treeData)[1])}
                </div>
            </div>




        );


    }
}

export default ITree;
