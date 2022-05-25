/*
 * @Author: lzj
 * @Date: 2022-05-17 11:06:25
 */
//注册页面
//获取表单信息
$('button').on({
    click: function (e) {
        //阻止默认行为
        e.preventDefault();
        //收集表单信息
        let data = $('form input').serialize();
        //发送请求
        $.post('http://localhost:8888/users/register', data, res => {
            if (res.code == 0) {
                $('form span').css('display', 'block');
                return
            }
            //跳转页面
            window.alert('注册成功，点击确定进入登录页面');
            location.href = './login.html'

        })

    }
})