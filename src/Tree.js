import React, { Component } from 'react';
import './Tree.css';
import {Tree} from 'antd';

const DirectoryTree = Tree.DirectoryTree;
const TreeNode = Tree.TreeNode;
const url = "http://127.0.0.1:3000/structure/";




class ITree extends Component {
    constructor(){
        super();

        this.state={
            treeData: [],
            treeKey:[],
            ModalText: 'Content of the modal dialog',
            treelevel:null,
            editvisible: false,
            delvisible:false,
            NodeTreeItem: null,
            modalinput:'Please enter the value of the tree node!',
            ekey:null,
            modalselect:null,
            alldata:null,

        }
    };
    async componentDidMount(){

        let response = await fetch(url);
        let lastGist = await response.json();
        this.setState({alldata:lastGist});
        let temdata = this.state.treeData;
        //  let alldata = this.state.allData;
        //  console.log(lastGist.structure.level)

        let i = 0;
        for (let index of lastGist) {
            if (index.level==="0"){
                temdata[i] = index;
            }

            i++;
        }

        this.setState({treeData: temdata});




    }
    onSelect = (info) => {
        //console.log('selected', info);
        this.setState({treeKey:info});
        this.props.handleTreeselect(info);
        //   console.log(this.state.treeKey)
    }
    onLoadData = async(treeNode) => {

        //     let response = await fetch('./treeListData.json');
        let response = await fetch(url);
        let lastGist = await response.json();
        const treeData = [...this.state.treeData];
        const arr = [];
        let level=0;
        //   console.log(treeNode.props.eventKey)
        for(let index of lastGist) {
            //    let num = index.replace(/[^0-9]/ig,"");
            //      console.log(`${lastGist.index.name}`)
            let num = Number(index.level);
            //        console.log(num)

            if(num>level){
                level = num;
            }


            if(treeNode.props.eventKey.length+1===index.key.length&&treeNode.props.eventKey===index.pid){
                arr.push({name:index.name,key:index.key})
            };



            //     console.log(index)
        }


        //     console.log(arr)
        this.setState({treelevel:level});
        console.log('level:'+level)
        this.getNewTreeData(treeData, treeNode.props.eventKey, arr, level);
        //   console.log(treeData)
        this.setState({treeData: treeData });


    }


    setLeaf=(treeData, curKey, level) =>{
        const loopLeaf = (data, lev) => {
            const l = lev - 1;
            data.forEach((item) => {
                if ((item.key.length > curKey.length) ? item.key.indexOf(curKey) !== 0 :
                    curKey.indexOf(item.key) !== 0) {
                    return;
                }
                if (item.children) {
                    loopLeaf(item.children, l);
                } else if (l < 1) {
                    item.isLeaf = true;
                }
            });
        };
        loopLeaf(treeData, level + 1);
    }

    getNewTreeData=(treeData, curKey, child, level)=> {
        const loop = (data) => {
            if (level < 1 || curKey.length - 3 > level * 2) return;
            data.forEach((item) => {
                if (curKey.indexOf(item.key) === 0) {
                    if (item.children) {
                        loop(item.children);
                    } else {
                        item.children = child;
                    }
                }
            });
        };
        loop(treeData);
        //     console.log(treeData)
        this.setLeaf(treeData, curKey, level);
    }




    render() {

        const loop = data => data.map((item) => {
            if (item.children) {
                return <TreeNode title={item.name} key={item.key}>{loop(item.children)}</TreeNode>;
            }
            return <TreeNode title={item.name} key={item.key} isLeaf={item.isLeaf} disabled={item.key === '0-0-0'} />;
        });
        const treeNodes = loop(this.state.treeData);

        return (
            <div>
                    {
                        this.state.treeData.length
                            ?
                            <DirectoryTree defaultExpandAll onSelect={this.onSelect} loadData={this.onLoadData} >
                                {treeNodes}
                            </DirectoryTree>
                            :
                            null
                    }
            </div>





        );


    }
}

export default ITree;
