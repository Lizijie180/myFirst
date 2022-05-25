/*
 * @Author: lzj
 * @Date: 2022-05-18 11:33:26
 */
//个人中心
const token = localStorage.getItem('token');
const id = localStorage.getItem('id');

//判断是否登录过
if (!token || !id) {
    location.href = './login.html'
} else {
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
            } else {
                $('#user').val(res.info.username);
                $('#age').val(res.info.age);
                $('#gender').val(res.info.gender);
                $('#nickname').val(res.info.nickname);
            }
        }
    })
}

$('button').on({
    'click': function (e) {
        e.preventDefault();
        //获取修改的信息
        let dataFn = $('form').serialize();
        //发送请求
        $.ajax({
            url: 'http://localhost:8888/users/update/?',
            type: 'post',
            data: 'id=' + id + '&' + dataFn,
            headers: {
                authorization: token
            },
            success: function (res) {
                if (res.code == 1) {
                    alert('修改成功');
                }
            }
        })
    }
})


