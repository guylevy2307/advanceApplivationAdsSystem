const axios = require("axios");
const { API_URL } = require("./Api");

const POST_SERVICE = API_URL + "/posts";

export const getAllPosts = async () => {
  const res = await axios.get(POST_SERVICE);
  return res.data;
};

export const getDistributionTag = async (firstTag, secondTag, thirdTag) => {
  const res = await axios.post(`${POST_SERVICE}/utils/tags`, {
    tag1: firstTag,
    tag2: secondTag,
    tag3: thirdTag,
  });
  if (res.status !== 200) return null;
  return res.data;
};

export const getPostAveragePerUser = async () => {
  const res = await axios.get(`${POST_SERVICE}/utils/average`);
  if (res.status !== 200) return null;
  return res.data;
};

export const deletePostById = async (postId) => {
  const res = await axios.delete(`${POST_SERVICE}/${postId}`);
  return res.status === 200;
};
