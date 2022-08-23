const axios = require("axios");
const { SERVER_URL } = require("./Api");

const USER_SERVICE = SERVER_URL + "/users";

export const signUp = (user) => {
  console.log("service call");
  console.log(user);
  axios
    .post(USER_SERVICE + "/", user)
    .then((response) => console.log(response))
    .catch((err) => console.log(err));
};

export const deleteUserByEmail = async (email) => {
  const res = await axios.delete(`${USER_SERVICE}/${email}`);
  return res.status === 200;
};

export const login = async (credentials) => {
  console.log(credentials);
  await axios
    .post(USER_SERVICE + "/login", credentials)
    .then((response) => console.log(response));
};

export const getAllUsers = async () => {
  const res = await axios.get(USER_SERVICE);
  return res.data;
};

export const getAllAddresses = async () => {
  const res = await axios.get(`${USER_SERVICE}/analytics/addresses`);
  return res.data;
};

export const getUserByEmail = async (email) => {
  const response = await axios.get(USER_SERVICE + `/${email}`);
  return response.data;
};

export const getUserFriends = async (userEmail) => {
  const response = await axios.get(USER_SERVICE + `/${userEmail}/friends`);
  return response.data;
};

export const getPopularFirstNames = async () => {
  const response = await axios.get(USER_SERVICE + "/popular/firstNames");
  return response.status === 200 ? response.data : null;
};

export const getPopularLastNames = async () => {
  const response = await axios.get(USER_SERVICE + "/popular/lastNames");
  return response.status === 200 ? response.data : null;
};

export const getMostActive = async () => {
  const response = await axios.get(USER_SERVICE + "/analytics/mostactive");
  return response.status === 200 ? response.data : null;
};
