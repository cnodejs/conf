$(function () {
  var hiddenID = $("#id");
  var newsNode = $("#title");
  var fieldset = $("#news");
  var contentBox = $("#content");

  $(".container").on("click", 'td a.edit', function (event) {
    var that = $(event.currentTarget);
    var tr = that.closest("tr");
    var id = tr.data("id");
    if (!id) {
      return false;
    }
    $.ajax("/admin/view_news", {
      type: 'GET',
      dataType: 'json',
      data: {
        "id": id
      },
      success: function (res) {
        var news = res.news;
        hiddenID.val(news._id);
        contentBox.val(news.content);
        newsNode.val(news.title);
        $("#submit").text("更新").attr("edit", "1").attr("_id", id);
        newsNode.focus();
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

  $(".container").on("click", 'td a.remove', function (event) {
    var that = $(event.currentTarget);
    var tr = that.closest("tr");
    var id = tr.data("id");
    if (!id) {
      return false;
    }
    $.ajax("/admin/del_news", {
      type: 'DELETE',
      dataType: 'json',
      data: {
        "id": id,
        "_csrf": csrf
      },
      success: function (res) {
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

  $(".container").on("click", '#submit', function (event) {
    var title = newsNode.val();
    var content = contentBox.val();
    var that = $(event.currentTarget);
    if (that.attr("edit") !== "1") {
      $.ajax("/admin/add_news", {
        type: 'POST',
        dataType: 'json',
        data: {
          "title": title,
          "content": content,
          "_csrf": csrf
        },
        success: function (res) {
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
    } else {
      var id = that.attr("_id");
      $.ajax("/admin/edit_news", {
        type: 'POST',
        dataType: 'json',
        data: {
          "id": id,
          "title": title,
          "content": content,
          "_csrf": csrf
        },
        success: function (res) {
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
    }
  });

  newsNode.bind("input", function () {
    fieldset.removeClass("error");
  });
  $('.dropdown-toggle').dropdown();
});