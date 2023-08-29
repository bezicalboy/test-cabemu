import { fetchVideoGroups } from "./script/groupInfo.js";
import {
  fetchVideoData,
  fetchVideolinksGroup,
  deleteVideoLink,
} from "./script/linkVideo.js";
import { showToastMessage, redirectTo } from "./script/utility.js";

DevExpress.setTemplateEngine("underscore");
const token = localStorage.getItem("token");

const checkLoginStatus = () => {
  const $noLoginSection = $("#noLoginSection");
  const $loginSection = $("#loginSection");
  const $btnAction = $("#btn-action");

  if (token != null) {
    $loginSection.show();
    $noLoginSection.hide();
    $btnAction.show();
  } else {
    $loginSection.show().attr("style", "display: none !important;");
    $noLoginSection.show();
    $btnAction.show().attr("style", "display: none !important;");
  }
};
checkLoginStatus();

$("#btn-logout").on("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("token");
  checkLoginStatus();
});

fetchVideoGroups()
  .then((response) => {
    const dataSource = response.map((group) => {
      return {
        id: group.id,
        title: group.namaGroup,
      };
    });
    createDxDropdown(dataSource);
    createDxTabs(dataSource);
  })
  .catch((error) => {
    showToastMessage(error.responseText, "error");
  });

function showVideosByGroupId(groupId) {
  fetchVideolinksGroup(groupId)
    .then((response) => {
      renderVideoContainers(response);
    })
    .catch((error) => {
      showToastMessage(error.responseText, "error");
    });
}

let activeTabIndex = "";
let tabPanel;

function getTabIndexByGuid(guid, dataSource) {
  const index = dataSource.findIndex((item) => item.id === guid);
  return index !== -1 ? index : 0;
}


function getGuidByTabIndex(index, dataSource) {
  return dataSource[index]?.id || null; 
}

function createDxDropdown(dataSource) {
  $("#dropdown-groups").dxDropDownButton({
    text: "Video Selections",
    icon: "fas fa-video",
    dropDownOptions: {
      width: 230,
    },
    onItemClick(e) {
      activeTabIndex = e.itemData.id;
      tabPanel.option(
        "selectedIndex",
        getTabIndexByGuid(activeTabIndex, dataSource)
      );
    },
    items: dataSource,
    displayExpr: "title",
    valueExpr: "id",
  });
}

function createDxTabs(dataSource) {
  tabPanel = $("#tabpanel-container")
    .dxTabPanel({
      height: 260,
      dataSource: dataSource,
      selectedIndex: getTabIndexByGuid(activeTabIndex, dataSource),
      loop: false,
      animationEnabled: true,
      swipeEnabled: false,
      showNavButtons: true,
      scrollByContent: true,
      itemTemplate: $("#tabs-content"),
      onInitialized: function (e) {
        activeTabIndex = getGuidByTabIndex(
          e.component.option("selectedIndex"),
          dataSource
        );
        showVideosByGroupId(activeTabIndex);
      },
      onSelectionChanged: function (e) {
        activeTabIndex = getGuidByTabIndex(
          e.component.option("selectedIndex"),
          dataSource
        );
        showVideosByGroupId(activeTabIndex);
      },
    })
    .dxTabPanel("instance");
}

function renderVideoContainers(response) {
  response.forEach((videoData) => {
    const videoIdYT = getVideoIdFromURL(videoData.link);
    const videoContainerId = `video-container-${videoData.groupInfoId}`;
    const videoContainer = $(`#${videoContainerId}`);
    videoContainer.empty();

    fetchVideoData(videoIdYT)
      .then((responseYT) => {
        const formattedDate = formatDate(videoData.dateCreated);

        const html = generateVideoHtml(
          responseYT.items[0].id,
          videoData.id,
          videoData.judul,
          videoData.userCreated,
          formattedDate,
          videoData.groupInfo
        );

        videoContainer.append(html);

        if (token != null) {
          createUniqueButtons(videoIdYT, videoData.id);
        } else {
          hideUniqueButtons(videoData.id);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
}

function getVideoIdFromURL(url) {
  const youtubeRegexes = [
    /youtu\.be\/([^/?]+)/i, 
    /youtube\.com\/watch\?v=([^/?]+)/i, 
    /youtube\.com\/embed\/([^/?]+)/i, 
    /youtube\.com\/v\/([^/?]+)/i, 
  ];

  for (const regex of youtubeRegexes) {
    const match = url.match(regex);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}


function formatDate(date) {
  const options = { month: "long", day: "numeric", year: "numeric" };
  return new Date(date).toLocaleDateString("en-US", options);
}


function generateVideoHtml(
  videoId,
  linkId,
  judul,
  userCreated,
  dateCreated,
  groupInfo
) {
  const templateVideoHtml = $("#video-content").html();
  return _.template(templateVideoHtml)({
    videoId: videoId,
    linkId: linkId,
    judul: judul,
    userCreated: userCreated,
    dateCreated: dateCreated,
    groupInfo: groupInfo,
  });
}

function hideUniqueButtons(videoId) {
  $(`#btn-update-${videoId}`).hide();
  $(`#btn-delete-${videoId}`).hide();
}

function createUniqueButtons(videoId, linkId) {
  $(`#btn-update-${linkId}`).dxButton({
    icon: "fas fa-edit",
    stylingMode: "contained",
    text: "Update",
    type: "success",
    onClick() {
      handleUpdateButtonClick(linkId);
    },
  });

  $(`#btn-delete-${linkId}`).dxButton({
    icon: "fas fa-trash",
    stylingMode: "contained",
    text: "Delete",
    type: "danger",
    onClick() {
      handleDeleteButtonClick(linkId, videoId);
    },
  });
}

function handleUpdateButtonClick(linkId) {
  const url = `./add_link/add_link.html?action=update&linkId=${linkId}`;
  redirectTo(url);
}

function handleDeleteButtonClick(linkId, videoId) {
  deleteVideoLink(linkId)
    .then((response) => {
      showToastMessage(response, "success");
      $(`#video-col-${videoId}`).remove();
    })
    .catch((error) => {
      showToastMessage(error, "error");
    });
}