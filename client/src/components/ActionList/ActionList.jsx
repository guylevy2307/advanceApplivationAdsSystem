import React from 'react'
import './actionList.css'

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function ActionList({deleteAction, updateAction}) {
    return (
        <>
            <div className="ActionWrapper">
                <div className="Delete">
                    <DeleteIcon onClick={deleteAction}/>
                </div>
                <div className="Update">
                    <EditIcon onClick={updateAction} />
                </div>
            </div>
        </>
    )
}