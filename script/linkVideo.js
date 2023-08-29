const urlEndPoint = "https://api.cabemu.com/api/Link/";
const urlEndPointLocal = "http://192.168.17.8:11333/api/Link/"; 

const apiKeyYT = "AIzaSyB8tlzkyW7zOAQky1-1kmTHiTqdERc4Rp0";
const token = localStorage.getItem("token");
function fetchVideolinksGroup(groupId) {
  return $.ajax({
    url: `${urlEndPoint}get-link-group?groupId=${groupId}`,
    method: "GET",
    contentType: "application/json",
    success: (data) => {
      return data;
    },
    error: (textStatus, error) => {
      console.error(textStatus, error);
      return Promise.reject(error);
    },
  });
}

function fetchVideoData(videoIdYT) {
  const urlFetchVideoDataYT = `https://www.googleapis.com/youtube/v3/videos?id=${videoIdYT}&part=snippet&key=${apiKeyYT}`;
  return $.ajax({
    url: urlFetchVideoDataYT,
    method: "GET",
    contentType: "application/json",
    success: (data) => {
      return data;
    },
    error: (textStatus, errorThrown) => {
      console.error(textStatus, errorThrown);
      return Promise.reject(error);
    },
  });
}

function fetchVideolink(linkId) {
  return $.ajax({
    url: `${urlEndPoint}get-link?linkId=${linkId}`,
    method: "GET",
    contentType: "application/json",
    success: (data) => {
      return data;
    },
    error: (error) => {
      console.error(error);
      return Promise.reject(error);
    },
  });
}


function deleteVideoLink(linkId) {
  return $.ajax({
    url: `${urlEndPoint}delete-link?linkId=${linkId}`,
    method: "GET",
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    success: function (data) {
      return data;
    },
    error: function (error) {
      return Promise.reject(error);
    },
  });
}


function addVideoLink(addLinkRequest) {
  return $.ajax({
    url: `${urlEndPoint}add-link`,
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(addLinkRequest),
    headers: {
      Authorization: `Bearer ${token}`,
    },
    success: function (data) {
      return data;
    },
    error: function (error) {
      if (error.status === 401) {
        console.log("error");
      }

      return Promise.reject(error);
    },
  });
}

function updateVideoLink(updateLinkRequest) {
  return $.ajax({
    url: `${urlEndPoint}update-link`,
    method: "PUT",
    contentType: "application/json",
    data: JSON.stringify(updateLinkRequest),
    headers: {
      Authorization: `Bearer ${token}`,
    },
    success: function (data) {
      return data;
    },
    error: function (error) {
      return Promise.reject(error);
    },
  });
}


export {
  fetchVideoData,
  fetchVideolinksGroup,
  fetchVideolink,
  addVideoLink,
  updateVideoLink,
  deleteVideoLink,
};