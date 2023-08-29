const urlEndPoint = "https://api.cabemu.com/api/GroupInfo/";

const token = localStorage.getItem("token");

function fetchVideoGroups() {
  return $.ajax({
    url: `${urlEndPoint}group-info`,
    method: "GET",
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    success: (data) => {
      return data;
    },
    error: (error) => {
      return Promise.reject(error);
    },
  });
}
function updateGroup(updateGroupRequest) {
  return $.ajax({
    url: `${urlEndPoint}update-group-info`,
    method: "PUT",
    contentType: "application/json",
    data: JSON.stringify(updateGroupRequest),
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

function fetchGroupsSingle(groupId) {
  return $.ajax({
    url: `${urlEndPoint}group-info-single?groupId=${groupId}`,
    method: "GET",
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    success: (data) => {
      return data;
    },
    error: (error) => {
      console.error(error);
      return Promise.reject(error);
    },
  });
}
function deleteGroup(idGroupInfo) {
  return $.ajax({
    url: `${urlEndPoint}delete-group-info?idGroupInfo=${idGroupInfo}`,
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

function addGroup(addGroupRequest) {
  return $.ajax({
    url: `${urlEndPoint}add-group-info?namaGroup=${addGroupRequest}`,
    method: "POST",
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





export {
  fetchVideoGroups,
  fetchGroupsSingle,
  addGroup,
  updateGroup,
  deleteGroup,
};