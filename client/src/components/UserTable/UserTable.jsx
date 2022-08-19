import React, {useEffect, useState} from 'react'
import './userTable.css'
import { DataGrid} from '@mui/x-data-grid';
import {deleteUserByEmail, getAllAddresses, getAllUsers} from "../../services/UserService";
import ClearIcon from '@mui/icons-material/Clear';
import DoneIcon from '@mui/icons-material/Done';
import CustomGoogleMap from "../GoogleMap/CustomGoogleMap";
import CircularProgress from '@mui/material/CircularProgress';
import ActionList from "../ActionList/ActionList";
import {useNavigate} from "react-router-dom";



export default function UserTable(){

    const navigate = useNavigate()
    const [allUserList,setAllUserList] = useState(null)
    const [addressesList,setAddressesList] = useState(null)
    const [flagToLoadAgain,setFlagToLoadAgian] = useState(0)
    const deleteUser = async (email) => {
        const result = await deleteUserByEmail(email)
        if(result){
            console.log(`user ${email} is deleted`)
            setFlagToLoadAgian(1 - flagToLoadAgain) //switch each time this method is called
        }
        else
            console.log(`failed to delete  user ${email}`)

    }

    const columns = [
        { field: 'email', headerName: 'Email', width: 300, sortable: false},
        { field: 'firstName', headerName: 'First name', width: 130, sortable: false },
        { field: 'lastName', headerName: 'Last name', width: 130, sortable: false },
        { field: 'address', headerName: 'Address', width: 130, sortable: false },
        { field: 'numOfFriends', headerName: 'Amount Of Friends', width: 140, sortable: false, valueGetter: (params) => `${ params.row?.friends?.length ||'0'}` },
        { field: 'createdAt', headerName: 'Created at', width: 180, sortable: false, valueGetter: (params) => {
                try{
                    const creationDate = new Date(Number(params.row.creationDate))
                    return `${creationDate.getUTCDate()}/${creationDate.getUTCMonth() + 1}/${creationDate.getUTCFullYear()} ${creationDate.getUTCHours()}:${creationDate.getUTCMinutes()}:${creationDate.getUTCSeconds()} UTC`
                }catch{
                    return 'unknown'
                }
            }
        },
        {field: 'isAdmin', headerName: 'Admin', width: 120, sortable: false, renderCell: (params) => params.row?.isAdmin? <DoneIcon style={{color:"green"}}/> : <ClearIcon style={{color:"red"}}/>},
        {field: 'actions', headerName: 'Actions', width: 240,sortable: false, renderCell: (params) => <ActionList deleteAction={e=>deleteUser(params.row?.email)} updateAction={e=>navigate(`/updateUser/${params.row.email}`)}/>}
    ]

    useEffect(() => {
        const initializeUserList = async () => {
            try{
                const userList = await getAllUsers()
                setAllUserList(userList)
            }catch{
                setAllUserList([])
            }
        }
        initializeUserList()
    }, [flagToLoadAgain])
    useEffect(()=>{
        const initializeAddressesList = async () => {
            try{
                const list = await getAllAddresses()
                console.log(`list from server:`)
                setAddressesList(list)
            }catch (err){
                console.log(err)
                setAddressesList([])
            }finally {
                console.log(addressesList)
            }
        }
        initializeAddressesList()
    },[flagToLoadAgain])
    return (
        <>
            <div className="userTable">
                <div className="table">
                    <DataGrid
                        rows={allUserList ?? []}
                        columns={columns}
                        pageSize={50}
                        rowsPerPageOptions={[50]}
                        getRowId={user => user.email}
                    />
                </div>
                <div className="map">
                    {
                        addressesList ?
                            <div className="googleMap">
                                <CustomGoogleMap points={addressesList}/>
                            </div> :
                            <div>
                                <h1 style={{"textAlign":"center"}}>
                                    Loading Users' Addresses on Map
                                </h1>
                                <div style={{"textAlign":"center"}}>
                                    <CircularProgress style={{"display":"inline-block", "color": "#d4cb7b"}}/>
                                </div>

                            </div>
                    }
                </div>
            </div>
        </>
    )
}