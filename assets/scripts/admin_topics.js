$(function () {
  $(".container").on("click", 'td a.select', function (event) {
    var that = $(event.currentTarget);
    var tr = that.closest("tr");
    var id = tr.data('id');
    var type = tr.data('type');
    if (!id) {
      return false;
    }
    $.ajax("/admin/update_topic", {
      type: 'POST',
      dataType: 'json',
      data: {
        "id": id,
        "type": (type === "wish" ? "formal" : "wish"),
        "_csrf": csrf
      },
      success: function (res) {
        that.removeClass('btn-primary');
        location.reload();
      },
      error: function (xhr, status) {
        if (xhr.status === 401) {
          alert("请先登录");
          location.href = "/oauth?blogtype=weibo";
        } else {
          alert("服务器错误，请稍候再试");
        }
      }
    });
  });

  var hiddenID = $("#id");
  var topicNode = $("#name");
  var speaker = $("#speaker");
  var status = $("#status");
  var languageNode = $("#language");
  var githubNode = $("#github");
  var topicInfoNode = $("#topic_intro");
  var speakerInfoNode = $("#speaker_intro");
  var fieldset = $("#topic");

  $(".container").on("click", 'td a.view', function (event) {
    var that = $(event.currentTarget);
    var tr = that.closest("tr");
    var id = tr.data('id');
    if (!id) {
      return false;
    }
    $.ajax("/admin/view_topic", {
      type: 'GET',
      dataType: 'json',
      data: {
        "id": id
      },
      success: function (res) {
        var topic = res.topic;
        hiddenID.val(topic._id);
        topicNode.val(topic.name);
        speaker.val(topic.speaker);
        topicInfoNode.val(topic.topicInfo);
        speakerInfoNode.val(topic.speakerInfo);
        githubNode.val(topic.github);
        topicNode.focus();
      },
      error: function (xhr, status) {
        if (xhr.status === 401) {
          alert("请先登录");
          location.href = "/oauth?blogtype=weibo";
        } else {
          alert("服务器错误，请稍候再试");
        }
      }
    });
  });

  topicNode.bind("input", function () {
    fieldset.removeClass("error");
  });

  $("#submit").click(function () {
    var name = $.trim(topicNode.val());
    if (!name) {
      status.html("主题忘填啦");
      fieldset.addClass("error");
      return false;
    }
    $.ajax("/admin/update_topic", {
      type: 'POST',
      dataType: 'json',
      data: {
        "id": hiddenID.val(),
        "name": name,
        "language": languageNode.val(),
        "speaker": speaker.val(),
        "github": githubNode.val(),
        "speakerInfo": speakerInfoNode.val(),
        "topicInfo": topicInfoNode.val(),
        "_csrf": csrf
      },
      success: function (res) {
        if (res.status === "success") {
          location.reload();
        } else {
          // TODO
        }
      },
      error: function (xhr) {
        if (xhr.status === 401) {
          alert("请先登录");
          location.href = "/oauth?blogtype=weibo";
        } else {
          status.html("服务器错误，请稍后再试");
          fieldset.addClass("error");
        }
      }
    });
    return false;
  });
});

$(function () {
  $('.dropdown-toggle').dropdown();
});