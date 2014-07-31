(function ($)
{
    function switch_to_login_form()
    {
        $("#welcome form").attr("action", "/login/");
        $("#welcome h3").text("登录");
        $("#welcome #password2").hide_password_field();
        $("#welcome #toggle_register_login").text("创建新账号");
    }
    function switch_to_register_form()
    {
        $("#welcome form").attr("action", "/register/");
        $("#welcome h3").text("注册");
        $("#welcome #password2").show_password_field();
        $("#welcome #toggle_register_login").text("登录");
    }
    function toggle_register_login()
    {
        var current = $("#welcome form").attr("action");
        if (current === "/register/") {
            switch_to_login_form();
        }
        else {
            switch_to_register_form();
        }
        $("#welcome form").find(".validation_error, .double_error").remove();
        return false;
    }
    function username()
    {
        return $("#welcome #username").val();
    }
    function logged_in()
    {
        location.href = "/worldline/";
    }
    function newuser_intro()
    {
        location.href = "/worldline/?new=intro";
    }
    $.fn.show_validation_error = function (text)
    {
        if ($(this).next().is(".validation_error")) {
            $(this).next().text(text);
            return this;
        }
        $("<div class='validation_error'>" + text + "</div>").insertAfter(this).hide().fadeIn(500);
        $(this).one("keydown", function ()
        {
            $(this).next().filter(".validation_error").fadeOut(1000, function ()
            {
                $(this).remove();
            });
        });
        return this;
    };
    function show_mismatched_password_validation()
    {
        var error = $("<div class='double_error'>两次输入的密码需要一致</div>").insertAfter("#password").hide().fadeIn(500);
        if ($.browser.opera) {
            error.css("margin-top", "5px");
        }
        $("#password, #password2").keyup(function ()
        {
            var p1 = $("#password").val(), p2 = $("#password2").val();
            if (p1 === p2)
            {
                error.fadeOut(500, function ()
                {
                    error.remove();
                });
                $("#password, #password2").unbind("keyup");
            }
        });
    }
    function current_action()
    {
        return $("#welcome h3").text();
    }
    function error_when_logging_in(json)
    {
        switch (json.result)
        {
            case "unavailable_username":
                $("#username").show_validation_error("抱歉，用户名已被使用").focus().select();
                return true;
            case "bad_username":
                $("#username").show_validation_error("请使用小写英文或数字").focus().select();
                return true;
            case "unknown_username":
                $("#username").show_validation_error("抱歉，该用户尚未注册").focus().select();
                return true;
            case "missing_username":
                $("#username").show_validation_error("请输入用户名").focus();
                return true;
            case "wrong_password":
                $("#password").show_validation_error("抱歉，用户名密码不匹配").focus().select();
                return true;
            case "missing_password":
                $("#password").show_validation_error("请输入密码").prev().trigger("focus").next().focus();
                return true;
            case "mismatched_passwords":
                show_mismatched_password_validation();
                return true;
            default:
                return false;
        }
    }
$.postJSON = function(url, parameters, callback, error_callback) {
    var handle_error = function(err) {
        if (error_callback && error_callback(err)) {} else if (debug) {
            alert(callback);
        } else {
            location.href = 'error.php';
        }
    };
    $.ajax({
        data: parameters,
        type: "POST",
        url: url,
        timeout: 20000,
        dataType: 'json',
        error: handle_error,
        success: function(json) {
            if (json.result === "ok") {
                if (callback) {
                    callback(json);
                }
            } else if (json.result === "not_logged_in") {
                location.href = location.href + "?session=expired";
            } else {
                handle_error(json);
            }
        }
    });
};
    function submit_register_login_form(event)
    {
        var form = $(this);
        event.preventDefault();
        if (form.attr("action") == "/login/")
        {
            $.postJSON("/login/", form.serializeArray(), logged_in, error_when_logging_in);
        }
        else if (form.attr("action") == "/register/")
        {
            $.postJSON("/register/", form.serializeArray(), newuser_intro, error_when_logging_in);
        }
        return false;
    }
    function should_show_login_form_as_default()
    {
        $("#welcome #password2").hide_password_field();
        return $("#session_expired").exists() || username() !== "username";
    }
    function initialize()
    {
        $("#username").add_hint("用户名");
        $("#password").add_hint("密码");
        $("#password2").add_hint("重复密码");
        $("#toggle_register_login").click(toggle_register_login);
        $("#welcome form").submit(submit_register_login_form);
        if (should_show_login_form_as_default()) {
            switch_to_login_form();
        }
        $("#submit").val("提交").removeAttr("disabled");
    }
    initialize();
})(jQuery);