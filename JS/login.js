/*
 * @Author: lzj
 * @Date: 2022-05-17 11:05:39
 */
//登陆页面
$('button').on('click', function (e) {
    //阻止默认事件
    e.preventDefault();
    let date = $('form').serialize();
    // console.log(date);
    //发送请求
    $.post('http://localhost:8888/users/login', date, res => {
        if (res.code != 1) {
            $('form span').css('display', 'block');
            return;
        }
        //登录成功,保存能够证明登录成功的值，然后再跳转到首页
        localStorage.setItem('token', res.token);
        localStorage.setItem('id', res.user.id);
        location.href = './index.html';
    })
})
