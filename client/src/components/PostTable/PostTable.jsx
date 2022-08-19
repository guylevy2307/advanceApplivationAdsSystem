import React, {useEffect, useState} from 'react'
import './postTable.css'
import { DataGrid} from '@mui/x-data-grid';
import ClearIcon from '@mui/icons-material/Clear';
import DoneIcon from '@mui/icons-material/Done';
import {deletePostById, getAllPosts} from "../../services/PostService";
import {deleteUserByEmail, getAllUsers} from "../../services/UserService";
import {useNavigate} from "react-router-dom";
import ActionList from "../ActionList/ActionList";

export default function PostTable(){
    const [allPostList,setAllPostList] = useState()
    const [flagToLoadAgain,setFlagToLoadAgian] = useState(0)
    const navigate = useNavigate()

    const deletePost = async (id) => {
        console.log('deleting post')
        const result = await deletePostById(id)
        if(result){
            console.log(`post ${id} is deleted`)
            setFlagToLoadAgian(1 - flagToLoadAgain) //switch each time this method is called
        }
        else
            console.log(`failed to delete  post ${id}`)

    }

    const columns = [
        { field: '_id', headerName: 'ID', width: 300, sortable: false},
        { field: 'userEmail', headerName: 'Email', width: 300, sortable: false},
        { field: 'content', headerName: 'Content', width: 300, sortable: false},
        { field: 'numOfComments', headerName: 'Amount of comments', width: 160, sortable: false, valueGetter: (params) => `${ params.row?.allCommentIDs?.length ||'0'}` },
        { field: 'createdAt', headerName: 'Created at', width: 180, sortable: false, valueGetter: (params) => {
                try{
                    const creationDate = new Date(Number(params.row.creationDate))
                    return `${creationDate.getUTCDate()}/${creationDate.getUTCMonth() + 1}/${creationDate.getUTCFullYear()} ${creationDate.getUTCHours()}:${creationDate.getUTCMinutes()}:${creationDate.getUTCSeconds()} UTC`
                }catch{
                    return 'unknown'
                }
            }
        },
        {field: 'actions', headerName: 'Actions', width: 240,sortable: false, renderCell: (params) => <ActionList deleteAction={e=>deletePost(params.row._id)} updateAction={e=>navigate(`/${params.row?._id}/postDetails`)}/>}
    ]

    useEffect(() => {
        const initializeUserList = async () => {
            try{
                const allPostList = await getAllPosts()
                setAllPostList(allPostList)
            }catch{
                setAllPostList([])
            }
        }
        initializeUserList()
    }, [flagToLoadAgain])

    useEffect(() => {
        const initializePostList = async () => {
            try{
                const allPostList = await getAllPosts()
                setAllPostList(allPostList)
            }catch{
                setAllPostList([])
            }
        }
        initializePostList()
    }, [])
    return (
        <>
            <div className="userTable">
                <DataGrid
                    rows={allPostList ?? []}
                    columns={columns}
                    pageSize={50}
                    rowsPerPageOptions={[50]}
                    getRowId={post => post._id}
                />
            </div>
        </>
    )
}