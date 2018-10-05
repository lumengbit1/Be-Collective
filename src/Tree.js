import React, { Component } from 'react';
import './Tree.css';
import {Tree, Modal, Button,Icon,Tooltip } from 'antd';





const TreeNode = Tree.TreeNode;
const url = "http://127.0.0.1:3000/structure/";
const inputtext='Please enter the value of the tree node!'


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


    onEdit(){
        if(this.state.treeKey.length===0){
            alert("Please Choose Treenode First!");
            return;
        }

    }
    onMouseEnter = (e) => {
        //   if(e.node.props.eventKey==='00'){

        //      return;
        //   }
        var x = e.event.currentTarget.offsetLeft + e.event.currentTarget.clientWidth;
        var y = e.event.currentTarget.offsetTop ;
        this.setState({
            NodeTreeItem: {
                pageX: x,
                pageY: y,
                id: e.node.props.eventKey,
            },
            ekey:e.node.props.eventKey
        });
    }
    getNodeTreeMenu() {
        const {pageX, pageY} = {...this.state.NodeTreeItem};
        const tmpStyle = {
            position: 'absolute',
            maxHeight: 40,
            textAlign: 'center',
            left: `${pageX}px`,
            top: `${pageY}px`,
            display: 'flex',
            flexDirection: 'row',
        };
        const menu = (
            <div
                style={tmpStyle}
            >
                <div className='icon' style={{alignSelf: 'center', marginLeft: 10}} >
                    <Tooltip placement='bottom' title='Edit Node Name'>
                        <Button className='treebutton' onClick={this.handleEditSub}><Icon  type="edit" /></Button>
                    </Tooltip>
                </div>
                <div className='icon' style={{alignSelf: 'center', marginLeft: 10}} >
                    <Tooltip placement='bottom' title='Add Node'>
                    <Button className='treebutton' onClick={this.handleAddSub}><Icon type="plus-circle-o" /></Button>
                    </Tooltip>
                </div>
                <div className='icon' style={{alignSelf: 'center', marginLeft: 10}} >
                   <Tooltip placement='bottom' title='Delete Node'>
                    <Button className='treebutton' onClick={this.handleDeleteSub}><Icon type="minus-circle-o" /></Button>
                   </Tooltip>
                </div>
            </div>
        );
        return (this.state.NodeTreeItem == null) ? '' : menu;
    }

    handleAddSub = (e) => {
        console.log("click add id :", this.state.NodeTreeItem.id)
        this.setState({modalselect:'Add'})
        this.showeditModal()
    }

    handleEditSub = (e) => {
        console.log("click edit id :", this.state.NodeTreeItem.id)
        this.setState({modalselect:'Edit'})
        this.showeditModal()
    }

    handleDeleteSub = (e) => {
        console.log("click delete id :", this.state.NodeTreeItem.id)
        this.setState({modalselect:'Del'})
        this.showdelModal()

    }
    clearMenu = () => {
        this.setState({
            NodeTreeItem: null
        })
    }

    showeditModal = () => {

        this.setState({
            editvisible: true,
        });

    }
    showdelModal = () => {

        this.setState({
            delvisible: true,
        });

    }
    handleeditOk = () => {
        this.setState({
            // ModalText: 'The modal dialog will be closed after two seconds',
            confirmLoading: true,
        });
        /* setTimeout(() => {
             this.setState({
                 visible: false,
                 confirmLoading: false,
             });
         }, 2000);*/

        if (this.state.modalselect==='Edit'){
            this.editsubmitData();
        } else if(this.state.modalselect==='Add'){
            this.addsubmitData();
        }else if(this.state.modalselect==='Del'){
            this.deleteData();
        }


        this.setState({
            editvisible: false,
            delvisible:false,
            confirmLoading: false,
            modalinput:inputtext,
        });
        this.reloadPage();

    }

    handleeditCancel = () => {
        console.log('Clicked cancel button');
        this.setState({
            editvisible: false,
            delvisible:false,
            modalinput:inputtext,
        });
    }
    handleChange = (event) =>{
        this.setState({modalinput:event.target.value})
    }

    handleMouseEnter = ()=>{
        this.setState({modalinput:''})
    }

    editsubmitData = async()=>{
        let newurl= url+this.state.ekey;


        let response =  await fetch(newurl,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name:this.state.modalinput})

        });
        let res  = await response;
        if(res.ok){
            console.log('Success!')

        }else if(res.status==='400'){
            console.log('Failed!')
        }

    }

    addsubmitData = async()=>{
        let newurl= url;
        let alldata=this.state.alldata;
        //    console.log('ekey:'+this.state.ekey)
        let key=this.state.ekey;
        let tempmaxkey = this.state.ekey+'0';
        const keylong = tempmaxkey.length;
        let num =0;
        let slicekey=key.slice(0,this.state.ekey.length);
        console.log('tempmaxkey:'+tempmaxkey);
        for(let index of alldata){
            if(index.key.length===keylong&&index.pid===key){
                if((index.key>tempmaxkey)){
                    num++;
                }
            }

        }
        let maxkey=key+(num+1).toString();
        console.log('maxkey:'+maxkey);

        console.log('level:'+(this.state.ekey.length-1));
        console.log('pid:'+slicekey);
        let response =  await fetch(newurl,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name:this.state.modalinput,
                id: maxkey,
                key: maxkey,
                level:this.state.ekey.length-1,
                pid:slicekey
            })

        });
        let res  = await response;
        if(res.ok){
            console.log('Success!')
        }else if(res.status==='400'){
            console.log('Failed!')
        }
    }


    deleteData = async()=>{
      //  let newurl= url;
        let alldata=this.state.alldata;
        //    console.log('ekey:'+this.state.ekey)
        let delarr=[];
        let key = this.state.ekey;
        for(let index of alldata){
            if(index.key.length>=key.length){
                if(index.key.slice(0,key.length)===key){
                    delarr.push(url+index.id)
                }
            }

        }
        console.log(delarr)
        let response =await delarr.map((url)=> { fetch(url,{
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                //      body: JSON.stringify(delarr)

            })}
        )
        let res  = await response;
        if(res.ok){
            console.log('Success!')
        }else if(res.status==='400'){
            console.log('Failed!')
        }
    }

    reloadPage=()=>{
        window.location.reload();
        //return <ITree/>

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
                <div onMouseLeave={this.clearMenu}>
                    {
                        this.state.treeData.length
                            ?
                            <Tree defaultExpandAll onSelect={this.onSelect} loadData={this.onLoadData} onMouseEnter={this.onMouseEnter}>
                                {treeNodes}
                            </Tree>
                            :
                            null
                    }

                    {this.state.NodeTreeItem != null ? this.getNodeTreeMenu() :""}
                </div>

                <div>
                    <Modal title="Edit Modal"
                           visible={this.state.editvisible}
                           onOk={this.handleeditOk}
                           confirmLoading={this.state.confirmLoading}
                           onCancel={this.handleeditCancel}

                    >
                        <p>Please enter the new name of the edited tree node.</p>
                        <input type='text' className='modalinput' value={this.state.modalinput} onChange={this.handleChange} onFocus={this.handleMouseEnter}/>
                    </Modal>
                </div>

                <div>
                    <Modal title="Delete Modal"
                           visible={this.state.delvisible}
                           onOk={this.handleeditOk}
                           confirmLoading={this.state.confirmLoading}
                           onCancel={this.handleeditCancel}
                    >
                        <p>Are you sure you want to delete this node and its children?</p>
                    </Modal>
                </div>
            </div>



        );


    }
}

export default ITree;
