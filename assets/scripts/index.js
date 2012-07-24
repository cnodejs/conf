$(function () {
  var topicNode = $("#name");
  var speaker = $("#speaker");
  var status = $("#status");
  var fieldset = $("#topic");
  var preSession = $("#pre-session");

  topicNode.bind("input", function () {
    fieldset.removeClass("error");
  });

  $("#submit").click(function () {
    var name = $.trim(topicNode.val());
    if (!name) {
      status.html("您想听的主题忘填啦");
      fieldset.addClass("error");
      return false;
    }
    $.ajax("/add_topic", {
      type: 'POST',
      dataType: 'json',
      data: {
        "name": name,
        "speaker": speaker.val(),
        "_csrf": csrf
      },
      success: function (res) {
        if (res.status === "success") {
          var topics = res.topics;
          for (var i = 0, l = topics.length; i < l; i++) {
            var topic = topics[i];
            var temp = '<tr data-id="' + topic._id + '">' +
              '<td>' + topic.name + '</td>' +
              '<td>' + topic.speaker + '</td>' +
              '<td><a href="javascript:;" class="btn">' + topic.vote.length + ' | 我想听 +1</a></td>'+
              '</tr>';
            preSession.append(temp);
          }
          topicNode.val("");
          speaker.val("");
          status.html("");
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
  $(".container").on("click", 'td a', function (event) {
    var that = $(event.currentTarget);
    var id = that.closest("tr").data('id');
    if (!id) {
      return false;
    }
    $.ajax("/vote_topic", {
      type: 'POST',
      dataType: 'json',
      data: {
        "id": id,
        "_csrf": csrf
      },
      success: function (res) {
        that.html('我想听 +1 | ' + res.vote).removeClass('btn-primary');
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
});

$(function () {
  $('.dropdown-toggle').dropdown();
});