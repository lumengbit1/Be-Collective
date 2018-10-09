import 'babel-polyfill';
import React, { Component } from 'react';
import './Tree.css';
import {Tree,Divider } from 'antd';

const DirectoryTree = Tree.DirectoryTree;
const TreeNode = Tree.TreeNode;
const url = "https://chal-locdrmwqia.now.sh/";




class ITree extends Component {
    constructor(){
        super();

        this.state={
            treeData: [],
        }
    };

    //fetch data from URL;
    async componentDidMount(){
        let lastGist = await fetch(url).then(response => {
            if (!response.ok) throw new Error(response.statusText);
            return response.json();
        }).catch(function(err) {
            throw new Error(err);
        })

        this.setState({treeData: lastGist.data});
    }

    //Calculate units of size
    readablizeBytes = (bytes) =>{
        var s = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
        var e = Math.floor(Math.log(bytes)/Math.log(1024));
        return (bytes/Math.pow(1024, Math.floor(e))).toFixed(2)+" "+s[e];
    }

    //Calculate total number and size of file
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

    //Generated file directory
    renderTreeNodes = (data) => {
        if(data.length===0){
            return;
        }
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
                    Total Files: {this.state.treeData.length===0?'':this.totalFiles(this.state.treeData)[0]}
                    <br/>
                    Total Filesize: {this.state.treeData.length===0?'':this.readablizeBytes(this.totalFiles(this.state.treeData)[1])}
                </div>
            </div>




        );


    }
}

export default ITree;
