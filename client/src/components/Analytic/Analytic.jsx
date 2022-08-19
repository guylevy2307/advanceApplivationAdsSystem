import React, {useEffect, useRef, useState} from 'react'
import PieChart from "../PieChart/PieChart";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { spacing } from '@mui/system';
import {getDistributionTag, getPostAveragePerUser} from "../../services/PostService";
import {Box} from "@mui/material";
import BarChart from "../BarChart/BarChart";
import {getMostActive, getPopularFirstNames, getPopularLastNames} from "../../services/UserService";

export default function Analytic() {

    const [distributionBetweenPost, setDistributionBetweenPost] = useState(null)
    const [avgPost,setAvgPost] = useState(null)
    const tag1 = useRef()
    const tag2 = useRef()
    const tag3 = useRef()
    const initalizeTagsDist = async () => {
        if (!(tag1.current.value && tag2.current.value && tag3.current.value)) {
            setDistributionBetweenPost(null)
            return
        }
        if(tag1.current.value === tag2.current.value || tag2.current.value === tag3.current.value || tag1.current.value === tag3.current.value){
            setDistributionBetweenPost(null)
            return
        }
        const res = await getDistributionTag(tag1.current.value,tag2.current.value,tag3.current.value)
        let listData = []
        for(let index in Object.keys(res)){
            const key = Object.keys(res)[index]
            listData.push({item:key, count:res[key]})
        }
        console.log(listData)
        setDistributionBetweenPost(listData)
    }
    useEffect(() => {
        const initAvg = async () => {
            const res = await getPostAveragePerUser()
            setAvgPost(res)
        }
        initAvg()
    },[])

    const [firstNameDataPoints, setFirstNameDataPoints] = useState(null)
    useEffect(()=>{
        const initPopularFirstName = async () =>{
            const res = await getPopularFirstNames()

            if(res){
                const dataPoints = [
                    {
                        label: res.firstPlace,
                        y: res.firstFrequency
                    },
                    {
                        label: res.secondPlace,
                        y: res.secondFrequency
                    },
                    {
                        label: res.thirdPlace,
                        y: res.thirdFrequency
                    }
                ]
                setFirstNameDataPoints(dataPoints)
            }else{
                setFirstNameDataPoints(null)
            }
        }
        initPopularFirstName()
    },[])

    const [lastNameDataPoints, setLastNameDataPoints] = useState(null)
    useEffect(()=>{
        const initPopularLastName = async () =>{
            const res = await getPopularLastNames()

            if(res){
                const dataPoints = [
                    {
                        label: res.firstPlace,
                        y: res.firstFrequency
                    },
                    {
                        label: res.secondPlace,
                        y: res.secondFrequency
                    },
                    {
                        label: res.thirdPlace,
                        y: res.thirdFrequency
                    }
                ]
                setLastNameDataPoints(dataPoints)
            }else{
                setLastNameDataPoints(null)
            }
        }
        initPopularLastName()
    },[])

    const [mostActive,setMostActive] = useState(null)
    useEffect(()=>{
        const initMostActive = async () =>{
            const res = await getMostActive()
            let dataPoints = []
            if(res){
                for(let i=0; i < res.length;i++){
                    const user = res[i]
                    dataPoints.push({
                        label: `${user.fullName} - ${user.email}`,
                        y: user.count
                    })
                }
                setMostActive(dataPoints)
            }else{
                setMostActive(null)
            }
        }
        initMostActive()
    },[])

    const dataPoints = [
        { label: "Apple",  y: 10  },
        { label: "Orange", y: 15  },
        { label: "Banana", y: 25  },
        { label: "Mango",  y: 30  },
        { label: "Grape",  y: 28  }
    ]
    return (
        <div className="container">
            <h2>Distribution Between Words in Posts</h2>
            <h3>enter tags to compare between the tags frequency...</h3>
            <div className="tags-container">
                <Box display="flex">
                    <Box m={0.0001} flex={1}>
                        <TextField placeholder="tag #1" inputRef={tag1}/>
                    </Box>
                    <Box m={0.0001} flex={1}>
                        <TextField placeholder="tag #2" inputRef={tag2}/>
                    </Box>
                    <Box m={0.0001} flex={1}>
                        <TextField placeholder="tag #3" inputRef={tag3}/>
                    </Box>
                    <Box m={0.0001} flex={1}>
                        <Button onClick={()=>{initalizeTagsDist()}} variant="contained">
                            submit
                        </Button>
                    </Box>
                </Box>
            </div>
            {distributionBetweenPost && <PieChart data={distributionBetweenPost}/>}

            <br/>
            {avgPost && <ul>
                <li><h2>{avgPost}</h2></li>
            </ul>}
            <br/>
            {firstNameDataPoints && <BarChart dataPoints={firstNameDataPoints} title={"most popular users first names"}/>}
            <br/>
            {lastNameDataPoints && <BarChart dataPoints={lastNameDataPoints} title={"most popular users last names"}/>}
            <br/>
            {mostActive && <BarChart dataPoints={mostActive} title={"most active users"}/>}
        </div>
    )
}