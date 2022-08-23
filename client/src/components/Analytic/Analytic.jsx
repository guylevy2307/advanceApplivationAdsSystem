import React, { useEffect, useRef, useState } from 'react';
import PieChart from "../PieChart/PieChart";
import { getDistributionTag, getPostAveragePerUser } from "../../services/PostService";
import { getMostActive, getPopularFirstNames, getPopularLastNames } from "../../services/UserService";
import BarChart from "../BarChart/BarChart";


export default function Analytic() {

    const [distributionBetweenPost, setDistributionBetweenPost] = useState(null)
    const [avgPost, setAvgPost] = useState(null)
    const tag1 = useRef()
    const tag2 = useRef()
    const tag3 = useRef()
    const initalizeTagsDist = async () => {
        if (!(tag1.current.value && tag2.current.value && tag3.current.value)) {
            setDistributionBetweenPost(null)
            return
        }
        if (tag1.current.value === tag2.current.value || tag2.current.value === tag3.current.value || tag1.current.value === tag3.current.value) {
            setDistributionBetweenPost(null)
            return
        }
        const res = await getDistributionTag(tag1.current.value, tag2.current.value, tag3.current.value)
        let listData = []
        for (let index in Object.keys(res)) {
            const key = Object.keys(res)[index]
            listData.push({ item: key, count: res[key] })
        }
        setDistributionBetweenPost(listData)
    }
    useEffect(() => {
        const initAvg = async () => {
            const res = await getPostAveragePerUser()
            setAvgPost(res)
        }
        initAvg()
        
    }, [])

    const [firstNameDataPoints, setFirstNameDataPoints] = useState(null)
    useEffect(() => {
        const initPopularFirstName = async () => {
            const res = await getPopularFirstNames();
            await initalizeTagsDist();
            if (res) {
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
            } else {
                setFirstNameDataPoints(null)
            }
        }
        initPopularFirstName()
    }, [])

    const [lastNameDataPoints, setLastNameDataPoints] = useState(null)
    useEffect(() => {
        const initPopularLastName = async () => {
            const res = await getPopularLastNames()

            if (res) {
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
            } else {
                setLastNameDataPoints(null)
            }
        }
        initPopularLastName()
    }, [])

    const [mostActive, setMostActive] = useState(null)
    useEffect(() => {
        const initMostActive = async () => {
            const res = await getMostActive()
            let dataPoints = []
            if (res) {
                for (let i = 0; i < res.length; i++) {
                    const user = res[i]
                    dataPoints.push({
                        label: `${user.fullName} - ${user.email}`,
                        y: user.count
                    })
                }
                setMostActive(dataPoints)
            } else {
                setMostActive(null)
            }
        }
        initMostActive()
    }, [])

    return (
        <div>
            <div className="container">

                {distributionBetweenPost && <PieChart data={distributionBetweenPost} />}

                <br />

                {avgPost &&
                    <h2>{avgPost}</h2>
                }
                <h2>Distribution Between First And Last Nmae Of Users</h2>
                <br />
                {firstNameDataPoints && <BarChart dataPoints={firstNameDataPoints} title={"most popular users first names"} />}
                <br />
                {lastNameDataPoints && <BarChart dataPoints={lastNameDataPoints} title={"most popular users last names"} />}
                <br />
                {mostActive && <BarChart dataPoints={mostActive} title={"most active users"} />}

            </div>



        </div>
    )
}
