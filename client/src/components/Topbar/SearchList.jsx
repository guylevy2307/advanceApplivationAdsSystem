import React , { useState } from 'react'
import {SERVER_URL} from "../../services/HttpServiceHelper";
import axios from "axios";
import {Link} from "react-router-dom";

const SearchList = (props) => {
    const {userList, isFirstName, isLastName, isEmail} = props

    const filteredData = (userList || []).filter((el) => {
        if (props.input === '') {
            return true;
        }
        //return the item which contains the user input
        else {
            let toSearch = "";
            if(isFirstName)
                toSearch += el.firstName;
            if(isLastName)
                toSearch += el.lastName;
            if(isEmail)
                toSearch += el.email;

            return toSearch.toLowerCase().includes(props.input)
        }
    })
    return (
        <div className="searchList">
            {filteredData.length  > 0 && filteredData.map((u) => (
                <div className="userRow">
                    <Link to={`/profile/${u.email}`}>
                        <img
                            className="postProfileImg"
                            src={u.profilePicture ? u.profilePicture : "https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png"}
                            alt=""
                        />
                    </Link>
                    <span className="postUsername">
                            {u.firstName + " " + u.lastName}
                    </span>
                </div>
            ))}
        </div>
    )
}

export default React.memo(SearchList)