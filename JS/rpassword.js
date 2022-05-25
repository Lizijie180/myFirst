/*
 * @Author: lzj
 * @Date: 2022-05-19 13:00:18
 */
// 修改密码
const token = localStorage.getItem('token');
const id = localStorage.getItem('id');

//判断是否登录过
if (!token || !id) {
    location.href = './login.html'
} else {
    //登录过又注销了
    //获取用户信息，判断是否登录又注销
    $.ajax({
        url: 'http://localhost:8888/users/info/',
        type: 'get',
        data: { id: id },
        headers: {
            authorization: token
        },
        success: function (res) {
            //判断是否登录后又注销
            if (res.code != 1) {
                location.href = './login.html';
                return
            }
        }
    })
}

$('button').on({
    'click': function (e) {
        e.preventDefault();
        let dataFn = $('form').serialize();
        $.ajax({
            url: 'http://localhost:8888/users/rpwd',
            type: 'post',
            data: 'id=' + id + '&' + dataFn,
            headers: {
                authorization: token
            },
            success: function (res) {
                if (res.code != 1) {
                    $('form span').css('display', 'block');
                    return
                } else {
                    alert('修改密码成功，请重新登录')
                    location.href = './login.html';
                }
            }
        })
    }
})