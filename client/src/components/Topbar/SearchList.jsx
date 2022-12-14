import React from 'react';
import { Link } from "react-router-dom";

const SearchList = (props) => {
    const { userList, isFirstName, isLastName, isEmail } = props

    const filteredData = (userList || []).filter((el) => {
        if (props.input === '') {
            return true;
        }
        else {
            let toSearch = "";
            if (isFirstName)
                toSearch += el.firstName;
            if (isLastName)
                toSearch += el.lastName;
            if (isEmail)
                toSearch += el.email;

            return toSearch.toLowerCase().includes(props.input)
        }
    })
    if (isEmail && !isFirstName && !isLastName) {
        return (
            <div className="searchList">
                {filteredData.length > 0 && filteredData.map((u) => (
                    <div className="userRow">
                        <Link to={`/profile/${u.email}`}>
                            <img
                                className="postProfileImg"
                                src={u.profilePicture ? u.profilePicture : "https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png"}
                                alt=""
                            />
                        </Link>

                        <span className="postUsername">
                            {" Email: " + u.email}
                        </span>


                    </div>
                ))}
            </div>
        )
    } else if (!isEmail && isFirstName && !isLastName) {
        return (
            <div className="searchList">
                {filteredData.length > 0 && filteredData.map((u) => (
                    <div className="userRow">
                        <Link to={`/profile/${u.email}`}>
                            <img
                                className="postProfileImg"
                                src={u.profilePicture ? u.profilePicture : "https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png"}
                                alt=""
                            />
                        </Link>

                        <span className="postUsername">
                            {"First name: " + u.firstName}
                        </span>


                    </div>
                ))}
            </div>
        )
    }
    else if (!isEmail && !isFirstName && isLastName) {
        return (
            <div className="searchList">
                {filteredData.length > 0 && filteredData.map((u) => (
                    <div className="userRow">
                        <Link to={`/profile/${u.email}`}>
                            <img
                                className="postProfileImg"
                                src={u.profilePicture ? u.profilePicture : "https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png"}
                                alt=""
                            />
                        </Link>

                        <span className="postUsername">
                            {"Last name: " + u.lastName}
                        </span>


                    </div>
                ))}
            </div>
        )
    } else if (!isEmail && isFirstName && isLastName) {
        return (
            <div className="searchList">
                {filteredData.length > 0 && filteredData.map((u) => (
                    <div className="userRow">
                        <Link to={`/profile/${u.email}`}>
                            <img
                                className="postProfileImg"
                                src={u.profilePicture ? u.profilePicture : "https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png"}
                                alt=""
                            />
                        </Link>

                        <span className="postUsername">
                            {"Full name: " + u.firstName + " " + u.lastName}
                        </span>


                    </div>
                ))}
            </div>
        )
    } else if (isEmail && isFirstName && isLastName) {
        return (
            <div className="searchList">
                {filteredData.length > 0 && filteredData.map((u) => (
                    <div className="userRow">
                        <Link to={`/profile/${u.email}`}>
                            <img
                                className="postProfileImg"
                                src={u.profilePicture ? u.profilePicture : "https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png"}
                                alt=""
                            />
                        </Link>

                        <span className="postUsername">
                            {"Full Name: " + u.firstName + " " + u.lastName + " Email: " + u.email}
                        </span>

                    </div>
                ))}
            </div>
        )
    }
}

export default React.memo(SearchList)

